import { CGColor } from '@tuval/cg';
import { ButtonComponent } from "./ButtonComponent";
import { SketchGraphics } from "../drawing/sketch/SketchGraphics";
import { SolidBrush } from "../drawing/SolidBrush";
import { StringFormat } from "../drawing/StringFormat";
import { StringAlignment } from "../drawing/StringAlignment";
import { Font } from "../drawing/Font";
import { Pen } from "../drawing/Pen";


export class CheckboxComponent extends ButtonComponent {
    private box: number;
    private bx: number;
    private by: number;
    public checked: boolean = false;
    public constructor(x: number, y: number, w: number, h: number, params: any) {
        super(null as any,x, y, w, h, { name: params.name });
        this.box = this.h - 6;
        this.bx = this.x + 5;
        this.by = this.y + 3;
    }
    public trigger() {
        // showing[this.name] = !showing[this.name];
    }
    protected mousePressed() {
        this.checked = !this.checked;
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
        tg.drawString(this.name, new Font('Tahoma', 12), new SolidBrush(new CGColor(20)), this.x + this.box + 9, this.y + this.h/2 + 1, sf);

        tg.DrawRectangle(new Pen(new CGColor(100)),this.bx, this.y + 3, this.box, this.box);

        if (this.checked) {
            tg.DrawLine(new Pen(new CGColor(100)),this.bx + 1, this.by + 1, this.bx + this.box, this.by + this.box);
            tg.DrawLine(new Pen(new CGColor(100)), this.bx + this.box, this.by + 1, this.bx + 1, this.by + this.box);
        }
    }
}