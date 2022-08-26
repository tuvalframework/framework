import { LONG, UMO } from "@tuval/core";
import { ICommand, IsDebug } from "./ICommand";

export class BeginPathCommand extends UMO implements ICommand {
    @LONG CommandType = 11;
    @LONG NextCommandType;
    @LONG NextCommandPointer;
    public ExecuteCommand(drawingContext: CanvasRenderingContext2D) {
        drawingContext.beginPath();
        if (IsDebug) {
            console.log(`BeginPathCommand`);
        }
    }
}