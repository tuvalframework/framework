import { CGColor } from '@tuval/cg';
import { GUIComponent } from "./GUIComponent";
import { SketchGraphics } from '../drawing/sketch/SketchGraphics';
import { Brush } from "../drawing/Brush";
import { SolidBrush } from "../drawing/SolidBrush";
import { Pen } from "../drawing/Pen";
import { StringFormat } from "../drawing/StringFormat";
import { StringAlignment } from "../drawing/StringAlignment";
import { Font } from "../drawing/Font";
import { IMouseEventService } from "../services/IMouseEventService";


export class ButtonComponent extends GUIComponent {
    protected defaultCol: CGColor;
    protected highlightCol: CGColor;
    public constructor(eventService: IMouseEventService,x: number, y: number, w: number, h: number, params: any) {
        super(eventService,x, y, w, h, params.name, params.trigger);
        this.defaultCol = new CGColor(230, 230, 230, 200);
        this.highlightCol = params.highlightCol || new CGColor(210, 210, 210, 250);
        if (params.filled) {
            this.makeFilled();
        }
    }
    public draw(tg: SketchGraphics) {
        this.fade();

        let brush: Brush;
        let pen: Pen;

        if (this.disabled) {
            brush = new SolidBrush(new CGColor(180));
            pen = new Pen(new CGColor(200), 0);
        } else {
            const color = tg.lerpColor(this.defaultCol, this.highlightCol, this.transition / 10)
            brush = new SolidBrush(color);
            pen = new Pen(new CGColor(200));
        }
        tg.FillRectangle(brush, this.x, this.y, this.w, this.h, 12);
        tg.DrawRectangle(pen, this.x, this.y, this.w, this.h, 12);

        /* if (this.disabled) {
            tg.fill(180);
            tg.noStroke();
        } else {
            const color = tg.lerpColor(this.defaultCol, this.highlightCol, this.transition / 10)
            tg.fill(color);
            tg.strokeWeight(1);
            tg.stroke(200);
        }

        tg.rect(this.x, this.y - 1, this.w, this.h + 3, 12);

        if (this.disabled) {
            tg.fill(120);
        } else {
            tg.fill(20);
        }
 */
        // textFont(sansFont, 16);
        // textAlign(CENTER, CENTER);
        // text(this.name, this.x + this.w / 2, this.y + this.h/2 + 1);
        const sf = new StringFormat();
        sf.Alignment = StringAlignment.Center;
        sf.LineAlignment = StringAlignment.Center;
        tg.drawString(this.name, new Font('Tahoma', 12), new SolidBrush(new CGColor(20)), this.x + this.w / 2, this.y + this.h / 2 + 1, sf);
    }

    private drawFilled(tg: SketchGraphics) {
        this.fade();

        if (this.disabled) {
            tg.fill(180);
            tg.noStroke();
        } else {
            tg.fill(tg.lerpColor(this.defaultCol, this.highlightCol, this.transition / 10));
            tg.strokeWeight(1);
            tg.stroke(this.highlightCol);
        }

        tg.rect(this.x, this.y - 1, this.w, this.h + 3, 19);

        if (this.disabled) {
            tg.fill(120);
        } else {
            tg.fill(tg.lerpColor(this.highlightCol, CGColor.FromRgba(255, 255, 255), this.transition / 10));
        }

        //textFont(sansFont, 16);
        //textAlign(CENTER, CENTER);
        //text(this.name, this.x + this.w / 2, this.y + this.h/2);
    }

    private makeFilled() {
        this.draw = this.drawFilled;
        this.defaultCol = new CGColor(0, 0, 0, 1);
    }
}