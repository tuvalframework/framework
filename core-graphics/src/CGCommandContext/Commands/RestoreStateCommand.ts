import { LONG, UMO } from "@tuval/core";
import { ICommand, IsDebug } from "./ICommand";

export class RestoreStateCommand extends UMO implements ICommand {
    @LONG CommandType = 8;
    @LONG NextCommandType;
    @LONG NextCommandPointer;
    public ExecuteCommand(drawingContext: CanvasRenderingContext2D) {
        drawingContext.restore();
        if (IsDebug) {
            console.log(`Restore State`);
        }
    }
}