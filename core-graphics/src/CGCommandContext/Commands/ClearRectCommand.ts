import { LONG, UMO } from "@tuval/core";
import { ICommand, IsDebug } from "./ICommand";

export class ClearRectCommand extends UMO implements ICommand {
    @LONG CommandType = 2;
    @LONG X;
    @LONG Y;
    @LONG Width;
    @LONG Height;
    @LONG NextCommandType;
    @LONG NextCommandPointer;
    public ExecuteCommand(drawingContext: CanvasRenderingContext2D) {
        drawingContext.clearRect(this.X, this.Y, this.Width, this.Height);
        if (IsDebug) {
            console.log('ClearRect');
        }
    }
}