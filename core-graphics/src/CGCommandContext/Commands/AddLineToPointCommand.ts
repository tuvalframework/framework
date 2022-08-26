import { LONG, UMO } from "@tuval/core";
import { ICommand, IsDebug } from "./ICommand";

export class AddLineToPointCommand extends UMO implements ICommand {
    @LONG CommandType = 13;
    @LONG X;
    @LONG Y;
    @LONG NextCommandType;
    @LONG NextCommandPointer;
    public ExecuteCommand(drawingContext: CanvasRenderingContext2D) {
        drawingContext.lineTo(this.X, this.Y);
        if (IsDebug) {
            console.log(`AddLineToPointCommand x: ${this.X}, y:${this.Y}`);
        }
    }
}