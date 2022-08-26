import { FLOAT, LONG, UMO } from "@tuval/core";
import { ICommand, IsDebug } from "./ICommand";

export class TransformCommand extends UMO implements ICommand {
    @LONG CommandType = 6;
    @FLOAT A;
    @FLOAT B;
    @FLOAT C;
    @FLOAT D;
    @FLOAT E;
    @FLOAT F;
    @LONG NextCommandType;
    @LONG NextCommandPointer;
    public ExecuteCommand(drawingContext: CanvasRenderingContext2D) {
        drawingContext.transform(this.A, this.B, this.C, this.D, this.E, this.F);

        if (IsDebug) {
            console.log(`TransformCommand a: ${this.A}, b: ${this.B}, c: ${this.C}`);
        }
    }
}