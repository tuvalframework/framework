import { LONG, STRING, UMO } from "@tuval/core";
import { ICommand, IsDebug } from "./ICommand";

export class SetStrokeColor extends UMO implements ICommand {
    @LONG CommandType = 15;
    @STRING(20) COLOR;
    @LONG NextCommandType;
    @LONG NextCommandPointer;
    public ExecuteCommand(drawingContext: CanvasRenderingContext2D) {
        drawingContext.strokeStyle = this.COLOR;

        if (IsDebug) {
            console.log(`SetStrokeColor Color: ${this.COLOR}`);
        }
    }
}