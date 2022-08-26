import { FLOAT, LONG, STRING, UMO } from "@tuval/core";
import { ICommand, IsDebug } from "./ICommand";

export class EOFillPathCommand extends UMO implements ICommand {
    @LONG CommandType = 21;
    @LONG NextCommandType;
    @LONG NextCommandPointer;
    public ExecuteCommand(drawingContext: CanvasRenderingContext2D) {
        (<any>drawingContext).msFillRule = 'evenodd';
        drawingContext.fill();

        if (IsDebug) {
            console.log(`EOFillPathCommand`);
        }
    }
}