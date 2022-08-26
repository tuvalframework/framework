import { FLOAT, LONG, UMO } from "@tuval/core";
import { ICommand, IsDebug } from "./ICommand";

export class ScaleCommand extends UMO implements ICommand {
    @LONG CommandType = 3;
    @FLOAT SX;
    @FLOAT SY;
    @LONG NextCommandType;
    @LONG NextCommandPointer;
    public ExecuteCommand(drawingContext: CanvasRenderingContext2D) {
        //drawingContext.scale(this.SX, this.SY);
        drawingContext.scale(this.SX, this.SY);

        if (IsDebug) {
            console.log(`Scale x: ${this.SX}, y : ${this.SY}`);
        }
    }
}