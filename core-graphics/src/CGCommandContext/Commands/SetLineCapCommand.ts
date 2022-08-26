import { CGLineCap } from './../../CGLineCap';
import { LONG, UMO } from "@tuval/core";
import { ICommand, IsDebug } from "./ICommand";

export class SetLineCapCommand extends UMO implements ICommand {
    @LONG CommandType = 10;
    @LONG CAP: CGLineCap = CGLineCap.Butt;
    @LONG NextCommandType;
    @LONG NextCommandPointer;
    public ExecuteCommand(drawingContext: CanvasRenderingContext2D) {
        switch (this.CAP) {
            case CGLineCap.Round:
                drawingContext.lineCap = 'round';
                break;
            case CGLineCap.Butt:
                drawingContext.lineCap = 'butt';
                break;
            default:
                drawingContext.lineCap = 'square';
                break;
        }

        if (IsDebug) {
            console.log(`SetLineWidthCommand  cap: ${CGLineCap[this.CAP]}`);
        }
    }
}