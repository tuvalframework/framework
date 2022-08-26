import { LONG, UMO } from "@tuval/core";
import { ICommand, IsDebug } from "./ICommand";

export class SetLineWidthCommand extends UMO implements ICommand {
    @LONG CommandType = 9;
    @LONG WIDTH;
    @LONG NextCommandType;
    @LONG NextCommandPointer;
    public ExecuteCommand(drawingContext: CanvasRenderingContext2D) {
        drawingContext.lineWidth = this.WIDTH;
        if (IsDebug) {
            console.log(`SetLineWidth  width: ${this.WIDTH}`);
        }
    }
}