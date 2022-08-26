import { CGColor } from '@tuval/cg';
import { foreach, int } from '@tuval/core';
import { List } from '@tuval/core';
import { GUIComponent } from "./GUIComponent";
import { SketchGraphics } from '../drawing/sketch/SketchGraphics';
import { SolidBrush } from '../drawing/SolidBrush';
import { Pen } from '../drawing/Pen';
import { RadioButtonComponent } from './RadioButtonComponent';
import { IMouseEventService } from '../services/IMouseEventService';
import { ButtonComponent } from './ButtonComponent';


export class ToolbarComponent extends GUIComponent {
    private components: List<GUIComponent>;
    public constructor(x: number, y: number, w: number) {
        super(null as any, x, y, w, 8, '', undefined);
        this.components = new List<GUIComponent>();;
    }
    public draw(tg: SketchGraphics) {
        if (!this.components.Count) { return; }
        const brush = new SolidBrush(new CGColor(250));
        const pen = new Pen(new CGColor(180), 1);

        tg.FillRectangle(brush, this.x, this.y, this.w, this.h, 8);
        tg.DrawRectangle(pen, this.x, this.y, this.w, this.h, 8);
        foreach(this.components, (item: GUIComponent) => {
            item.draw(tg);
        });
    };
    public add(type: any, params) {
        params = params || {};
        var h = params.h || 20;
        var component = new type(this.x + 5, this.y + this.h, this.w - 10, h, params);
        this.components.Add(component);
        this.h += component.h + 8;
    }

    public addButton(evetService: IMouseEventService, name: string, trigger: Function, height?: int) {
        var component = new ButtonComponent(evetService, this.x + 5, this.y + this.h, this.w - 10, height ?? 20, { name: name, trigger: trigger });
        this.components.Add(component);
        this.h += (component as any).h + 8;
    }

    public addRadioButtons(options: any, trigger: Function, defaultOption: any) {
        var x = this.x + 3;
        var y = this.y + this.h + 2;
        var w = this.w - 6;
        var radioButtons: any = [];

        var triggerFunction = function () {
            if (!this.marked) {
                this.marked = true;

                // Deselected other buttons
                for (let i: int = 0; i < radioButtons.length; i++) {
                    if (radioButtons[i] !== this) {
                        radioButtons[i].marked = false;
                    }
                }
            }
            if (trigger) { trigger(this.name); }
        };

        for (var i = 0; i < options.length; i++) {
            var button = new RadioButtonComponent(x, y, w, 22, options[i], triggerFunction);
            radioButtons.push(button);
            y += 27;
            this.h += 27;
        }

        radioButtons[defaultOption || 0].trigger();

        this.components.AddRange(radioButtons);
        this.h += 2;
    };
}