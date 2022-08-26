import { FLOAT, LONG, STRING, UMO } from "@tuval/core";
import { ICommand, IsDebug } from "./ICommand";

export class ClosePathCommand extends UMO implements ICommand {
    @LONG CommandType = 20;
    @LONG NextCommandType;
    @LONG NextCommandPointer;
    public ExecuteCommand(drawingContext: CanvasRenderingContext2D) {
        drawingContext.closePath();
        if (IsDebug) {
            console.log(`AddArcToPointCommand`);
        }
    }
}