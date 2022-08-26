import { Commands } from "./Commands";
import { ICommand } from "./Commands/ICommand";

export class CommandContextPilotWithPointer {
    private m_StartPointer: number = 0;
    constructor(pointer: number) {
        this.m_StartPointer = pointer;
    }


    public Drive(canvasContext: CanvasRenderingContext2D) {
        let currentCommand: ICommand = new Commands[0](this.m_StartPointer);
        currentCommand.ExecuteCommand(canvasContext);
        while (currentCommand.CommandType !== 1 && currentCommand.NextCommandPointer !== 0) {
            currentCommand = new Commands[currentCommand.NextCommandType](currentCommand.NextCommandPointer);
            currentCommand.ExecuteCommand(canvasContext);
        }
    }
}