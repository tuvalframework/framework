import { CGPoint, CGColor } from '@tuval/cg';
import { int, ICursorService } from '@tuval/core';
import { float } from '@tuval/core';
import { Pen } from '../drawing/Pen';
import { SolidBrush } from '../drawing/SolidBrush';
import { SketchGraphics } from '../drawing/sketch/SketchGraphics';


export class DraggablePoint extends CGPoint {
    private color: CGColor = CGColor.Black;
    private cursorService: ICursorService = undefined as any;
    private animation: number = 0;
    private selected: boolean = false;
    private dragging: boolean = false;
    private enter: boolean = false;
    private mouseX: number = 0;
    private mouseY: number = 0;
    private pmouseX: number = 0;
    private pmouseY: number = 0;

    public constructor(x: float, y: float, cursorService?: ICursorService) {
        super(x, y);
        this.cursorService = cursorService ?? undefined as any;
        this.color = CGColor.FromRgba(255, 165, 0);
        var self = this;
        /*  window.addEventListener('mousedown', function (evt) {
             self.onMouseDown(evt);
         });
         window.addEventListener('mousemove', function (evt) {
             self.onMouseMove(evt);
         });
         window.addEventListener('mouseup', function (evt) {
             self.onMouseUp(evt);
         }); */
    }

    public draw(tg: SketchGraphics) {
        if (this.selected || (!this.selected && this.mouseover())) {
            if (this.animation < 5) {
                this.animation++;
            }
        } else {
            this.animation = 0;
        }

        const pen: Pen = new Pen(CGColor.FromRgba(240, 250, 255), 1);
        var r = 12 + this.animation;
        tg.FillEllipse(new SolidBrush(this.color), this.X - (r / 2), this.Y - (r / 2), r, r);
        tg.DrawEllipse(pen, this.X - (r / 2), this.Y - (r / 2), r, r);
    }
    private mouseover() {
        const dist = SketchGraphics.prototype.dist(this.mouseX, this.mouseY, this.X, this.Y);
        return dist <= 12 / 2;
    }
    public onMouseDown() {
        if (this.mouseover()) {
            this.dragging = true;
        }
    }
    public onMouseMove(/* evt: MouseEvent */x: int, y: int, prevX: int, prevY: int) {
        this.pmouseX = prevX;//this.mouseX;
        this.pmouseY = prevY;//this.mouseY;
        this.mouseX = x;//evt.offsetX;
        this.mouseY = y;//evt.offsetY;

        if (this.mouseover()) {
            this.enter = true;
            this.mouseenter();
        } else {
            if (this.enter) {
                this.enter = false;
                this.mouseout();
            }
        }
        if (this.dragging) {
            this.move();
        }
    }
    private mouseenter() {
        if (this.cursorService != null) {
            this.cursorService('pointer');
        }
    }
    private mouseout() {
        if (this.cursorService != null) {
            this.cursorService('default');
        }
    }
    public onMouseUp() {
        this.dragging = false;
    }
    public move() {
        this.X += this.mouseX - this.pmouseX;
        this.Y += this.mouseY - this.pmouseY;
    }

}