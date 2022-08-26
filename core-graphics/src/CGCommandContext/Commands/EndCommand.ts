import { LONG, UMO } from "@tuval/core";
import { ICommand, IsDebug } from "./ICommand";

export class EndCommand extends UMO implements ICommand {
    @LONG CommandType = 1;
    @LONG NextCommandType;
    @LONG NextCommandPointer;
    public ExecuteCommand(drawingContext: CanvasRenderingContext2D) {
        if (IsDebug) {
            console.log('EndCommand');
        }
    }
}