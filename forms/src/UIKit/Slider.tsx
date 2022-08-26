

import { IRenderable } from './IView';
import { foreach, int, StringBuilder, Event } from "@tuval/core";
import { ControlHtmlRenderer } from "../windows/Forms/Components/AAA/HtmlRenderer/ControlHtmlRenderer";
import { UIView, ViewProperty } from "./UIView";
import { SliderComponent } from '../windows/Forms/Components/slider/Slider';
import { Teact } from '../windows/Forms/Components/Teact';
import { UIController } from './UIController';
import { viewFunc } from './getView';



class SliderRenderer extends ControlHtmlRenderer<SliderClass> {
    public get UseShadowDom(): boolean {
        return true;
    }

    public OnStyleCreating(obj: SliderClass, sb: StringBuilder): void {

        sb.AppendLine(`
        .p-slider {
            position: relative;
        }

        .p-slider .p-slider-handle {
            position: absolute;
           /*  cursor: grab; */
            touch-action: none;
            display: block;
            z-index: 1;
            border-radius: 100%;
            background-color: #fff;
            box-shadow: 0 2px 10px rgb(0 0 0 / 16%), 0 2px 5px rgb(0 0 0 / 26%);
            width: 24px;
            height: 24px;
            border: 0px !important;
            margin-left: -12px !important;
        }

        .p-slider .p-slider-handle.p-slider-handle-active {
            z-index: 2;
        }

        .p-slider .p-slider-range {
            background: rgb(20, 169, 213);
        }

        .p-slider-range {
            position: absolute;
            display: block;
        }

        .p-slider-horizontal .p-slider-range {
            top: 0;
            left: 0;
            height: 100%;
        }

        .p-slider-horizontal .p-slider-handle {
            top: 50%;
        }

        .p-slider-vertical {
            height: 100% !important;
            background-color: #d8d8d8 !important;
            border-radius: 4px !important;
            width: 8px !important;
        }

        .p-slider-vertical .p-slider-handle {
            left: 50%;
        }

        .p-slider-vertical .p-slider-range {
            bottom: 0;
            left: 0;
            width: 100%;
            border-radius: 4px !important;
            /* height: 100%; */
            width: 8px !important;
        }
        `);
    }
    public GenerateElement(obj: SliderClass): boolean {
        this.WriteStartFragment();
        return true;
    }
    public GenerateBody(obj: SliderClass): void {
        this.WriteComponent(
            <SliderComponent style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', float: 'none' }} max={obj.Max} min={obj.Min} value={obj.Value} onChange={(e) => obj.Changed(e.value)} onSlideEnd={(e) => obj.onSlideEnd()} orientation={obj.Orientation} />
        );

    }
}


export class SliderClass extends UIView {

    /** @internal */
    @ViewProperty() Max: int = 100;

    /** @internal */
    @ViewProperty() Min: int = 0;

    /** @internal */
    @ViewProperty() Value: int = 30;

    /** @internal */
    @ViewProperty() Orientation: string = 'vertical';

    /** @internal */
    @ViewProperty() Changed: Event<any> = new Event();

    public setController(controller: UIController): this {
        super.setController(controller);
        this.Renderer = new SliderRenderer({
            control: this,
            doNotBind: true,
            renderId: false
        });
        return this;
    }
    public constructor() {
        super();
        // Default renderer


        this.Max = 100;
        this.Min = 0;
        this.Value = 30;
        this.Orientation = 'vertical';
        this.Changed = new Event();;


        this.Appearance.Height = '100%';
    }

    public onSlideEnd() {

    }
    public action(value: (value: int) => void): this {
        this.Changed.add(value);
        return this;
    }
    public value(value: int): this {
        this.Value = value;
        return this;
    }
}




export function UISlider(): SliderClass {
    return viewFunc(SliderClass, (controller, propertyBag) => {
        return new SliderClass().setController(controller).PropertyBag(propertyBag);
    });
}

