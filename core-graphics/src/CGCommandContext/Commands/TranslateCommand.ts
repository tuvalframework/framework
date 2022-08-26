import { FLOAT, LONG, UMO } from "@tuval/core";
import { ICommand, IsDebug } from "./ICommand";

export class TranslateCommand extends UMO implements ICommand {
    @LONG CommandType = 4;
    @FLOAT TX;
    @FLOAT TY;
    @LONG NextCommandType;
    @LONG NextCommandPointer;
    public ExecuteCommand(drawingContext: CanvasRenderingContext2D) {
        drawingContext.translate(this.TX, this.TY);

        if (IsDebug) {
            console.log(`Translate x: ${this.TX}, y : ${this.TY}`);
        }
    }
}