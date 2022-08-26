import { LONG, STRING, UMO } from "@tuval/core";
import { CGPathDrawingMode } from "../../CGPath/CGPathDrawingMode";
import { ICommand, IsDebug } from "./ICommand";

export class DrawPathCommand extends UMO implements ICommand {
    @LONG CommandType = 17;
    @LONG MODE: CGPathDrawingMode = CGPathDrawingMode.Stroke;
    @LONG NextCommandType;
    @LONG NextCommandPointer;
    public ExecuteCommand(drawingContext: CanvasRenderingContext2D) {
        //this.drawingContext.translate(tx, ty);
        if (this.MODE === CGPathDrawingMode.Stroke) {
            drawingContext.stroke();
        }
        if (IsDebug) {
            console.log(`DrawPathCommand`);
        }
    }
}