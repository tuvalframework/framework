import { float, int } from '@tuval/core';
import { SketchGraphics } from '../drawing/sketch/SketchGraphics';
import { IMouseEventService } from '../services/IMouseEventService';
export class GUIComponent {
    protected x: float;
    protected y: float;
    protected w: float;
    protected h: float;
    protected name: string;
    protected selected: boolean;
    protected disabled: boolean;
    protected transition: number;
    protected activeCursor: string;
    private dragging: boolean = false;
    protected mouseX: number = 0;
    protected mouseY: number = 0;
    private pmouseX: number = 0;
    private pmouseY: number = 0;
    private enter: boolean = false;
    public constructor(eventService: IMouseEventService, x: float, y: float, w: float, h: float, name: string, updateFunction?: Function) {

        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.name = name;

        if (updateFunction) {
            this.trigger = updateFunction.bind(this);
        }

        this.selected = false;
        this.disabled = false;
        this.transition = 0;
        this.activeCursor = 'pointer';

        if (eventService != null) {
            eventService.onMouseDown$.subscribe(this.onMouseDown.bind(this));
            eventService.onMouseMove$.subscribe(this.onMouseMove.bind(this));
            eventService.onMouseUp$.subscribe(this.onMouseUp.bind(this));
        }
    }

    public draw(tg: SketchGraphics) { }
    protected mouseOver() {
        return (this.mouseX >= this.x && this.mouseX <= this.x + this.w &&
            this.mouseY >= this.y && this.mouseY <= this.y + this.h);
    };
    private onMouseDown(/* evt */) {
        if (this.mouseOver()) {
            this.mousePressed();
            this.dragging = true;
        }
    }
    private onMouseMove( evt: any ) {
        this.pmouseX = evt.prevX;//this.mouseX;
        this.pmouseY = evt.prevY;//this.mouseY;
        this.mouseX = evt.x;//evt.offsetX;
        this.mouseY = evt.y;//evt.offsetY;
        if (this.mouseOver()) {
            this.enter = true;
            this.mouseenter();
        } else {
            if (this.enter) {
                this.enter = false;
                this.mouseout();
            }
        }
        if (this.dragging) {
            this.mouseDragged();
        }
    }
    private onMouseUp(/* evt */) {
        this.dragging = false;
        this.mouseReleased();
    }

    private mouseenter() {
        document.body.style.cursor = this.activeCursor;
    }
    private mouseout() {
        document.body.style.cursor = 'default';
    }
    protected mousePressed() {
        this.selected = this.mouseOver();
    }
    protected mouseDragged() { }

    private mouseReleased() {
        if (this.selected && !this.disabled && this.mouseOver()) {
            this.trigger();
        }
        this.selected = false;
    }

    protected trigger() {
        // To be over-written
    }

    protected fade() {
        if (this.selected || this.mouseOver()) {
            this.transition = Math.min(10, this.transition + 1);
        } else {
            this.transition = Math.max(0, this.transition - 1);
        }
    };
}