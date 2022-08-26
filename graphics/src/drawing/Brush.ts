import { CGSize } from '@tuval/cg';
import { IDisposable } from "@tuval/core";
import { ICloneable } from "./ICloneable";
import { Graphics } from "./Graphics";
import { ClassInfo } from "@tuval/core";
import { GraphicTypes } from "../GDITypes";
import { Shadow } from "./Shadow";


@ClassInfo({
    fullName:GraphicTypes.Brush,
    instanceof: [
        GraphicTypes.Brush
    ]
})
export class Brush implements IDisposable, ICloneable<Brush> {
    protected changed: boolean = true;
    public Shadow: Shadow = Shadow.identity.clone();
    public /*virtual*/ Dispose(): void;
    public /*virtual*/ Dispose(disposing?: boolean): void {

    }
    public /*virtual*/ Clone(): Brush { throw new Error('You must implement clone method of brush.'); }
    public /*virtual*/ setup(graphics: Graphics, fill: boolean): void {
        graphics.renderer.setShadowWithColor(new CGSize(this.Shadow.offsetX,this.Shadow.offsetY), this.Shadow.blur,this.Shadow.color);
     }
}
