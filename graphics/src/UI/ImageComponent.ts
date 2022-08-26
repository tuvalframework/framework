import { CGImage, CGColor } from '@tuval/cg';
import { LabelComponent } from "./LabelComponent";
import { SketchGraphics } from "../drawing/sketch/SketchGraphics";
import { StringFormat } from "../drawing/StringFormat";
import { StringAlignment } from "../drawing/StringAlignment";
import { Font } from "../drawing/Font";
import { SolidBrush } from "../drawing/SolidBrush";
import { Pen } from "../drawing/Pen";

export class ImageComponent extends LabelComponent {
    private image: any;
    public constructor(x: number, y: number, w: number, h: number, params: any) {
        super(x, y, w, h, params);
        this.image = params.image;

    }
    public draw(tg: SketchGraphics) {
        const sf = new StringFormat();
        sf.Alignment = StringAlignment.Center;
        sf.LineAlignment = StringAlignment.Near;
        tg.drawString(this.name, new Font('Tahoma', 12), new SolidBrush(CGColor.Black), this.x + (this.w / 2), this.y, sf);
        const x1 = this.x + 8;
        const x2 = this.x + this.w - 8;
        const y2 = this.y + 15;
        tg.DrawLine(new Pen(new CGColor(180)), x1, y2, x2, y2);
        tg.DrawImage(this.image, (this.x + this.w / 2) - (this.image.Width / 2), this.y + 20);
    }
}