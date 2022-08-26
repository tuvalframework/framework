import { LONG, UMO } from "@tuval/core";
import { ICommand, IsDebug } from "./ICommand";

export class SaveStateCommand extends UMO implements ICommand {
    @LONG CommandType = 7;
    @LONG NextCommandType;
    @LONG NextCommandPointer;
    public ExecuteCommand(drawingContext: CanvasRenderingContext2D) {
        drawingContext.save();

        if (IsDebug) {
            console.log(`Save State`);
        }
    }
}