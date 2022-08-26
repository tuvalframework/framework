import { LONG, FLOAT, UMO } from "@tuval/core";
import { ICommand, IsDebug } from "./ICommand";

export class SetLineDashCommand extends UMO implements ICommand {
    @LONG CommandType = 16;
    @FLOAT DASHOFFSET;
    @LONG DASH_COUNT;
    @LONG DASH1;
    @LONG DASH2;
    @LONG DASH3;
    @LONG DASH4;
    @LONG DASH5;
    @LONG DASH6;
    @LONG NextCommandType;
    @LONG NextCommandPointer;
    public ExecuteCommand(drawingContext: CanvasRenderingContext2D) {
        drawingContext.lineDashOffset = this.DASHOFFSET;
        let dashArray: any[] = [];
        if (this.DASH_COUNT > 5) {
            dashArray = [this.DASH1, this.DASH2, this.DASH3, this.DASH4, this.DASH5, this.DASH6]
        } else if (this.DASH_COUNT > 4) {
            dashArray = [this.DASH1, this.DASH2, this.DASH3, this.DASH4, this.DASH5]
        } else if (this.DASH_COUNT > 3) {
            dashArray = [this.DASH1, this.DASH2, this.DASH3, this.DASH4]
        } else if (this.DASH_COUNT > 2) {
            dashArray = [this.DASH1, this.DASH2, this.DASH3]
        } else if (this.DASH_COUNT > 1) {
            dashArray = [this.DASH1, this.DASH2]
        } if (this.DASH_COUNT > 0) {
            dashArray = [this.DASH1]
        }
        drawingContext.setLineDash(dashArray);

        if (IsDebug) {
            console.log(`SetLineDashCommand`);
        }
    }
}