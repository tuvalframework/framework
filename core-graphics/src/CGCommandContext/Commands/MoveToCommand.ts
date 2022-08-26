import { LONG, UMO } from "@tuval/core";
import { ICommand, IsDebug } from "./ICommand";

export class MoveToCommand extends UMO implements ICommand {
    @LONG CommandType = 12;
    @LONG X;
    @LONG Y;
    @LONG NextCommandType;
    @LONG NextCommandPointer;
    public ExecuteCommand(drawingContext: CanvasRenderingContext2D) {
        drawingContext.moveTo(this.X, this.Y);
        if (IsDebug) {
            console.log(`MoveToCommand x: ${this.X}, y:${this.Y}`);
        }
    }
}