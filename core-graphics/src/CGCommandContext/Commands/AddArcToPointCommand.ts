import { FLOAT, LONG, STRING, UMO } from "@tuval/core";
import { ICommand, IsDebug } from "./ICommand";

export class AddArcToPointCommand extends UMO implements ICommand {
    @LONG CommandType = 19;
    @FLOAT X1;
    @FLOAT Y1;
    @FLOAT X2;
    @FLOAT Y2;
    @FLOAT RADIUS;
    @LONG NextCommandType;
    @LONG NextCommandPointer;
    public ExecuteCommand(drawingContext: CanvasRenderingContext2D) {
        drawingContext.arcTo(this.X1, this.Y1, this.X2, this.Y2, this.RADIUS);
        if (IsDebug) {
            console.log(`AddArcToPointCommand`);
        }
    }
}