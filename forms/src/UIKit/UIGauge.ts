import { IRenderable } from './IView';
import { foreach, int, StringBuilder } from "@tuval/core";
import { ControlHtmlRenderer } from "../windows/Forms/Components/AAA/HtmlRenderer/ControlHtmlRenderer";
import { UIView, ViewProperty } from "./UIView";
import { UIController } from './UIController';
import { viewFunc } from './getView';



class UIGaugeRenderer extends ControlHtmlRenderer<GaugeClass> {
    public get UseShadowDom(): boolean {
        return true;
    }

    public OnStyleCreating(obj: GaugeClass, sb: StringBuilder): void {
        sb.AppendLine(`
        circle {
            transition: stroke-dashoffset 0.35s;
            transform: rotate(-90deg);
            transform-origin: 50% 50%;
          }
        `);
    }
    protected OnShadowDomDidMount(ref: any, obj: GaugeClass): void {

    }

    public GenerateElement(obj: GaugeClass): boolean {
        this.WriteStartElement('svg')
        return true;
    }
    public GenerateAttributes(obj: GaugeClass): void {
        this.WriteAttrVal('width', `${obj.Radius * 2}`);
        this.WriteAttrVal('height', `${obj.Radius * 2}`);
        // this.WriteStyleAttrVal('transform', 'rotateX(180deg)');
    }
    public GenerateBody(obj: GaugeClass): void {

        const stroke = obj.Stroke;
        const radius = obj.Radius;
        const normalizedRadius = radius - stroke * 2;
        const _circumference = normalizedRadius * 2 * Math.PI;

        const offset = _circumference - (obj.Value / 100 * _circumference);

        this.WriteStartElement('circle');
        this.WriteAttrVal('stroke', obj.MaskColor);
        this.WriteAttrVal('stroke-width', `${stroke / 3 * 2}`);
        this.WriteAttrVal('fill', `transparent`);
        this.WriteAttrVal('r', `${normalizedRadius}`);
        this.WriteAttrVal('cx', `50%`);
        this.WriteAttrVal('cy', `50%`);
        this.WriteEndElement();

        this.WriteStartElement('circle');
        this.WriteAttrVal('stroke', obj.Color);
        this.WriteAttrVal('stroke-dasharray', `${_circumference} ${_circumference}`);
        this.WriteStyleAttrVal('stroke-dashoffset', `${offset}`);
        this.WriteAttrVal('stroke-width', `${stroke}`);
        this.WriteAttrVal('stroke-linecap', 'round');
        this.WriteAttrVal('fill', `transparent`);
        this.WriteAttrVal('r', `${normalizedRadius}`);
        this.WriteAttrVal('cx', `50%`);
        this.WriteAttrVal('cy', `50%`);
        this.WriteEndElement();

        this.WriteStartElement('text');
        this.WriteAttrVal('text-anchor', 'middle');
        this.WriteAttrVal('fill', `${obj.Appearance.Color}`);
        this.WriteAttrVal('font-size', `${obj.Appearance.FontSize}`);
        this.WriteAttrVal('dy', `.3em`);
        this.WriteAttrVal('x', `50%`);
        this.WriteAttrVal('y', `50%`);
        this.WriteTextBody(obj.Value.toString());
        this.WriteEndElement();

    }
}

export class GaugeClass extends UIView {

    @ViewProperty()
    public Color: string = 'blue';

    @ViewProperty()
    public MaskColor: string = 'rgba(100, 100, 100, 0.2)';

    @ViewProperty()
    public Value: int = 1;

    @ViewProperty()
    public Stroke: int = 1;

    @ViewProperty()
    public Radius: int = 100;

    public setController(controller: UIController): this {
        super.setController(controller);

        this.Renderer = new UIGaugeRenderer({
            control: this,
            doNotBind: true,
            renderId: false
        });

        return this;
    }
    public constructor() {
        super();
        // Default renderer


        this.Color = 'blue';
        this.MaskColor = 'rgba(100, 100, 100, 0.2)';
        this.Value = 1;
        this.Stroke = 1;
        this.Radius  =100;
    }
    public value(value: int): this {
        this.Value = value;
        return this;
    }
    public radius(value: int): this {
        this.Radius = value;
        return this;
    }
    public stroke(value: int): this {
        this.Stroke = value;
        return this;
    }
    public color(value: string): this {
        this.Color = value;
        return this;
    }
    public maskColor(value: string): this {
        this.MaskColor = value;
        return this;
    }
}


export class RangeClass extends UIView {

}

export function Gauge(...subViews: RangeClass[]): GaugeClass {
    return viewFunc(GaugeClass, (controller, propertyBag) => {
        return new GaugeClass().setController(controller).PropertyBag(propertyBag).setChilds(...subViews);
    });
}

export function Range(): RangeClass {
    return viewFunc(RangeClass, (controller, propertyBag) => {
        return new RangeClass().setController(controller).PropertyBag(propertyBag);
    });
}