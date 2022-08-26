import { FLOAT, LONG, STRING, UMO } from "@tuval/core";
import { ICommand, IsDebug } from "./ICommand";

export class SetShadowWithColorCommand extends UMO implements ICommand {
    @LONG CommandType = 14;
    @LONG WIDTH;
    @LONG HEIGHT;
    @FLOAT BLUR;
    @STRING(20) COLOR;
    @LONG NextCommandType;
    @LONG NextCommandPointer;
    public ExecuteCommand(drawingContext: CanvasRenderingContext2D) {
        const ctx: any = drawingContext;
        ctx.shadowColor = this.COLOR;
        ctx.shadowOffsetX = this.WIDTH
        ctx.shadowOffsetY = this.HEIGHT;
        ctx.shadowBlur = this.BLUR;

        if (IsDebug) {
            console.log(`SetShadowWithColorCommand Width: ${this.WIDTH}, height:${this.HEIGHT}, Color: ${this.COLOR}`);
        }
    }
}