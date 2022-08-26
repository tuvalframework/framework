import { LONG, STRING, UMO } from "@tuval/core";
import { ICommand, IsDebug } from "./ICommand";

export class SetFillColorCommand extends UMO implements ICommand {
    @LONG CommandType = 18;
    @STRING(20) COLOR;
    @LONG NextCommandType;
    @LONG NextCommandPointer;
    public ExecuteCommand(drawingContext: CanvasRenderingContext2D) {
        drawingContext.fillStyle = this.COLOR;

        if (IsDebug) {
            console.log(`SetFillColorCommand color:${this.COLOR}`);
        }
    }
}