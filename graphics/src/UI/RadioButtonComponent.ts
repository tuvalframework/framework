import { CGColor } from '@tuval/cg';
import { ButtonComponent } from "./ButtonComponent";
import { SketchGraphics } from "../drawing/sketch/SketchGraphics";
import { SolidBrush } from "../drawing/SolidBrush";
import { StringFormat } from "../drawing/StringFormat";
import { StringAlignment } from "../drawing/StringAlignment";
import { Font } from "../drawing/Font";
import { EllipseModes } from "../drawing/Graphics";
import { Pen } from "../drawing/Pen";

export class RadioButtonComponent extends ButtonComponent {
    r: number;
    cx: number;
    cy: number;
    marked: boolean;
    public constructor(x: number, y: number, w: number, h: number, name: string, trigger: Function) {
        super(null as any,x, y, w, h, { name: name, trigger: trigger });
        this.r = this.h - 6;
        this.cx = this.x + this.r / 2 + 5;
        this.cy = this.y + this.h / 2;
        this.marked = false;
    }

    public draw(tg: SketchGraphics) {
        this.fade();

        if (this.transition) {
           const brush = new SolidBrush(tg.lerpColor(this.defaultCol, this.highlightCol, this.transition / 10));
            tg.FillRectangle(brush, this.x, this.y, this.w, this.h + 1, 4);
        }

        const sf = new StringFormat();
        sf.Alignment = StringAlignment.Near;
        sf.LineAlignment = StringAlignment.Center;
        tg.drawString(this.name, new Font('Tahoma', 12), new SolidBrush(new CGColor(20)), this.cx + this.r /2 + 4, this.cy + 1, sf);

        tg.DrawEllipse(new Pen(new CGColor(100)),this.cx, this.cy, this.r, this.r, EllipseModes.Center);

        if (this.marked) {
            tg.FillEllipse(new SolidBrush(new CGColor(100)), this.cx, this.cy, this.r / 2, this.r / 2, EllipseModes.Center);
        }
    }
}