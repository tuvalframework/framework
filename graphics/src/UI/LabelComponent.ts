import { CGColor } from '@tuval/cg';
import { GUIComponent } from "./GUIComponent";
import { SketchGraphics } from "../drawing/sketch/SketchGraphics";
import { StringFormat } from "../drawing/StringFormat";
import { StringAlignment } from "../drawing/StringAlignment";
import { Font } from "../drawing/Font";
import { SolidBrush } from "../drawing/SolidBrush";
import { Pen } from "../drawing/Pen";

export class LabelComponent extends GUIComponent {
    private x1: number;
    private x2: number;
    private y2: number;
    private textColor: CGColor;
    public constructor(x: number, y: number, w: number, h: number, params: any) {
        super(null as any,x, y, w, h, params.name);
        this.x1 = x + 8;
        this.x2 = x + w - 8;
        this.y2 = y + h / 2 + 5;
        this.textColor = params.textColor || new CGColor(50);
    }
    public draw(tg: SketchGraphics) {
        const sf = new StringFormat();
        sf.Alignment = StringAlignment.Center;
        sf.LineAlignment = StringAlignment.Near;
        tg.drawString(this.name, new Font('Tahoma', 12), new SolidBrush(this.textColor), this.x + (this.w / 2), this.y, sf);
        tg.DrawLine(new Pen(new CGColor(180)), this.x1, this.y2, this.x2, this.y2);
    }
}