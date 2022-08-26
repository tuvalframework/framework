import { CGColor } from '@tuval/cg';
import { GUIComponent } from "./GUIComponent";
import { Pen } from "../drawing/Pen";
import { SketchGraphics } from "../drawing/sketch/SketchGraphics";
import { StringFormat } from "../drawing/StringFormat";
import { StringAlignment } from "../drawing/StringAlignment";
import { Font } from "../drawing/Font";
import { SolidBrush } from "../drawing/SolidBrush";


export class SliderComponent extends GUIComponent {
    private ballR: number;
    private ballD: number;
    private x2: number;
    private fill: CGColor;
    private stroke: Pen;
    private min: number;
    private max: number;
    private val: number;
    private decimalPlaces: number;
    private bx: number = 0;
    private hideVal: boolean;
    public constructor(x: number, y: number, w: number, h: number, params: any) {
        super(null as any,0, 0, 0, 0, params.name, params.trigger);
        // Size of ball
        const ballR = params.ballR || h / 2;
        const ballD = ballR * 2;

        x += ballR;
        w -= ballR * 2;

        h = ballD + (params.name ? 16 : 0);
        y += h - ballR;


        // Size of ball
        this.ballR = ballR;
        this.ballD = ballD;


        this.x2 = x + w;
        this.fill = params.fill || new CGColor(240);
        this.stroke = params.stroke || new Pen(new CGColor(180));

        this.min = params.min || 0;
        this.max = params.max === undefined ? 1 : params.max;
        this.val = params.now === undefined ? this.min : params.now;
        this.decimalPlaces = params.decimalPlaces === undefined ? 0 : params.decimalPlaces;
        this.setValue(this.val);
        this.trigger();

        this.hideVal = params.hideVal;
        this.activeCursor = 'ew-resize';

        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    public draw(tg: SketchGraphics) {
        if (this.name) {
            //tg.fill(20);
            /*  tg.textSize(13);
             tg.textAlign(CENTER, BASELINE);
             text(this.name,  this.x + this.w / 2, this.y - 14); */
            //text(this.name + ": " + this.val,  this.x + this.w / 2, this.y - 14);
            const sf = new StringFormat();
            sf.Alignment = StringAlignment.Center;
            sf.LineAlignment = StringAlignment.Far;
            tg.drawString(this.name + ": " + this.val, new Font('Tahoma', 10), new SolidBrush(new CGColor(20)), this.x + this.w / 2, this.y - 14, sf);
        }

        tg.DrawLine(this.stroke, this.x, this.y, this.x2, this.y);

        this.fade();
        const brush = new SolidBrush(tg.lerpColor(this.fill, this.stroke.Color, this.transition / 10));

        if (!this.hideVal) {
            tg.FillEllipse(brush, this.bx - (this.ballD / 2), this.y - (this.ballD / 2), this.ballD, this.ballD);
            tg.DrawEllipse(this.stroke, this.bx - (this.ballD / 2), this.y - (this.ballD / 2), this.ballD, this.ballD);
            //tg.fill(20);
            /* tg.textSize(11);
            tg.textAlign(CENTER, CENTER);
            tg.text("" + this.val, this.bx, this.y); */
            const sf = new StringFormat();
            sf.Alignment = StringAlignment.Center;
            sf.LineAlignment = StringAlignment.Center;
            tg.drawString('' + this.val, new Font('Tahoma', 10), new SolidBrush(new CGColor(20)), this.bx, this.y, sf);
        } else {
            tg.FillEllipse(brush, this.bx - (this.ballD / 2), this.y - (this.ballD / 2), this.ballD, this.ballD);
            tg.DrawEllipse(this.stroke, this.bx - (this.ballD / 2), this.y - (this.ballD / 2), this.ballD, this.ballD);
        }
    };

    protected mouseOver() {
        return SketchGraphics.prototype.dist(this.mouseX, this.mouseY, this.bx, this.y) < this.ballR;
    };

    protected mousePressed() {
        if (this.mouseOver()) {
            this.selected = true;
            return true;
        }
    }

    protected mouseDragged() {
        if (this.selected) {
            this.bx = SketchGraphics.prototype.constrain(this.mouseX, this.x, this.x2);
            var p = Math.pow(10, this.decimalPlaces);
            this.val = Math.round(SketchGraphics.prototype.map(this.bx, this.x, this.x2, this.min, this.max) * p) / p;
            this.trigger();
            return true;
        }
    };

    public setValue(v: number) {
        this.val = SketchGraphics.prototype.constrain(v, this.min, this.max);
        this.bx = SketchGraphics.prototype.map(this.val, this.min, this.max, this.x, this.x2);
        this.trigger();
    };
}