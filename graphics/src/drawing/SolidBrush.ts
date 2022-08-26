import { CGColor } from '@tuval/cg';
import { Brush } from "./Brush";
import { Graphics, CompositingMode } from "./Graphics";
import { ClassInfo } from "@tuval/core";
import { GraphicTypes } from "../GDITypes";

@ClassInfo({
    fullName: GraphicTypes.SolidBrush,
    instanceof: [
        GraphicTypes.SolidBrush
    ]
})
export class SolidBrush extends Brush {
    private color: CGColor;
    public isModifiable: boolean = false;
    private isModified: boolean = false;

    public constructor(color: CGColor, isModifiable: boolean = true) {
        super();
        this.color = color;
        this.isModifiable = isModifiable;
    }

    public get Color(): CGColor {
        return this.color;
    }
    public set Color(value: CGColor) {
        if (value.Equals(this.color)) {
            this.color = value;
            this.isModified = true;
        }
    }
    public /*override*/ Dispose(disposing?: boolean): void {

    }

    public /*override*/ Clone(): SolidBrush {
        return new SolidBrush(this.color);
    }

    public /*override*/ setup(graphics: Graphics, fill: boolean): void {

        // Aşağıdaki mod sketch modda kullanırken problem yaratıyor. Çünkü bir önceki brush
        // aynı olsa dahi sketch mod ta arkaplanda fill style değişebiliyor.
        /* if (graphics.LastBrush === this && !this.isModified)
            return; */

        super.setup(graphics, fill);
        const sourceCopy: boolean = graphics.CompositingMode === CompositingMode.SourceCopy;
        if (fill) {
            graphics.renderer.setFillColor(this.color.R, this.color.G, this.color.B, sourceCopy ? 1 : this.color.A);
        } else {
            graphics.renderer.setStrokeColor(this.color.R, this.color.G, this.color.B, sourceCopy ? 1 : this.color.A);
        }

        graphics.LastBrush = this;
        this.isModified = false;

        // I am setting this to be used for Text coloring in DrawString
        graphics.LastBrushColor = this.color;
    }

    public /*override*/ equals(sb: SolidBrush): boolean {
        return this.color.Equals(sb.Color);
    }

    public /*override*/ getHashCode(): number {
        return this.color.getHashCode();
    }
}
