import { FLOAT, LONG, STRING, UMO } from "@tuval/core";
import { ICommand, IsDebug } from "./ICommand";


export class AddCurveToPointCommand extends UMO implements ICommand {
    @LONG CommandType = 22;
    @FLOAT CP1X;
    @FLOAT CP1Y;
    @FLOAT CP2X;
    @FLOAT CP2Y;
    @FLOAT X;
    @FLOAT Y;
    @LONG NextCommandType;
    @LONG NextCommandPointer;
    public ExecuteCommand(drawingContext: CanvasRenderingContext2D) {
        drawingContext.bezierCurveTo(this.CP1X, this.CP1Y, this.CP2X, this.CP2Y, this.X, this.Y);
        if (IsDebug) {
            console.log(`AddCurveToPointCommand`);
        }
    }
}