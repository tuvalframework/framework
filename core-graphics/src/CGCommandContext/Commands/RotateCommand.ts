import { LONG, FLOAT, UMO } from "@tuval/core";
import { ICommand, IsDebug } from "./ICommand";

export class RotateCommand extends UMO implements ICommand {
    @LONG CommandType = 5;
    @FLOAT Angle;
    @LONG NextCommandType;
    @LONG NextCommandPointer;
    public ExecuteCommand(drawingContext: CanvasRenderingContext2D) {
        drawingContext.rotate(this.Angle);
        if (IsDebug) {
            console.log(`Rotate angle: ${this.Angle}`);
        }
    }
}