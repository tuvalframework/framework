import { int, is } from "@tuval/core";
import { AppearanceObject } from "./AppearanceObject";
import { ViewProperty } from "./ViewProperty";
import { StyleAttribute } from "./StyleAttribute";
import { ColorClass } from "./ColorClass";

export class UIViewClass {
    private isInRenderProcess: boolean = false;
    public static Renderer: any;
    public propertyBag = {}

    @ViewProperty()
    public vp_Background: string;

    public backgroundColor(value: string) {
        this.vp_Background = value;
        return this;
    }

    @ViewProperty()
    public vp_Tooltip: string;

    public tooltip(value: string) {
        this.vp_Tooltip = value;
        return this;
    }

    @ViewProperty(0)
    private forceUpdateKey: number;

    @ViewProperty()
    public HoverAppearance: AppearanceObject;

    @ViewProperty()
    public Appearance: AppearanceObject;

    @ViewProperty()
    public FocusAppearance: AppearanceObject;

    @ViewProperty()
    public ActiveAppearance: AppearanceObject;

    @ViewProperty()
    public DisabledAppearance: AppearanceObject;

    @ViewProperty()
    public BeforeAppearance: AppearanceObject;

    public constructor() {
        this.Appearance = new AppearanceObject(this);
        this.HoverAppearance = new AppearanceObject(this);
        this.FocusAppearance = new AppearanceObject(this);
        this.ActiveAppearance = new AppearanceObject(this);
        this.DisabledAppearance = new AppearanceObject(this);
        this.BeforeAppearance = new AppearanceObject(this);
    }

    public RenderStarted() {
        this.isInRenderProcess = true;
    }
    public RenderFinished() {
        this.isInRenderProcess = false;
    }

    /** @internal */
    @ViewProperty((): void => { })
    public vp_OnClick: Function;

    public onClick(value: Function) {
        this.vp_OnClick = value;
        return this;
    }

    public ForceUpdate() {}

    public width(): this;
    public width(value: int): this;
    public width(value: string): this;
    public width(value: StyleAttribute): this;
    public width(...args: any[]): this {
        if (args.length === 0) {
            this.Appearance.Width = 'fit-content';
            this.Appearance.MaxWidth = 'fit-content';
            this.Appearance.MinWidth = 'fit-content';
            return this;
        } else if (args.length === 1 && is.number(args[0])) {
            const value = args[0];
            this.Appearance.Width = `${value}px`;

            return this;
        } else if (args.length === 1 && is.string(args[0])) {
            const value: string = args[0];
            this.Appearance.Width = value;
            return this;
        } else if (args.length === 1 && typeof args[0] === 'object') {
            const styleAttribute: StyleAttribute = args[0];
            if (styleAttribute.default != null) {
                this.Appearance.Width = styleAttribute.default as any;
            }
            if (styleAttribute.hover != null) {
                this.HoverAppearance.Width = styleAttribute.hover as any;
            }
            if (styleAttribute.active != null) {
                this.ActiveAppearance.Width = styleAttribute.active as any;
            }
            if (styleAttribute.disabled != null) {
                this.DisabledAppearance.Width = styleAttribute.disabled as any;
            }

            if (styleAttribute.focus != null) {
                this.FocusAppearance.Width = styleAttribute.focus as any;
            }

            if (styleAttribute.before != null) {
                this.BeforeAppearance.Width = styleAttribute.before as any;
            }
            return this;
        }

        throw `ArgumentOutOfRange Exception in UIView::width method. Argument count: ${args.length}`;
    }

    public background(value: ColorClass): this;
    public background(value: StyleAttribute): this;
    //public background(zstack: ZStackClass): this;
    public background(color: string): this;
    public background(condition: boolean, trueValue: string, falseValue: string): this;
    public background(...args: any[]): this {
        if (args.length === 1 && args[0] instanceof ColorClass) {
            const value = args[0];
            this.Appearance.Background = value.toString();
            return this;
        } else if (args.length === 1 && is.string(args[0])) {
            const color = args[0];
            this.Appearance.Background = color;
            return this;
        } else if (args.length === 3) {
            const condition: boolean = args[0];
            const trueValue: string = args[1];
            const falseValue: string = args[2];
            this.Appearance.Background = condition ? trueValue : falseValue;
            return this;
        } /* else if (args.length === 1 && is.typeof<ZStackClass>(args[0], ControlTypes.UIKit.ZStack)) {
            const zstack: ZStackClass = args[0];
            zstack.Appearance.Position = 'absolute';
            zstack.Appearance.ZIndex = '-1';
            zstack.Appearance.Left = '0px';
            zstack.Appearance.Top = '0px';
            this.AddSubView(zstack);
            return this;
        } */ else if (args.length === 1 && typeof args[0] === 'object') {
            const styleAttribute: StyleAttribute = args[0];
            if (styleAttribute.default != null) {
                this.Appearance.Background = styleAttribute.default instanceof ColorClass ? styleAttribute.default.color : styleAttribute.default;
            }
            if (styleAttribute.hover != null) {
                this.HoverAppearance.Background = styleAttribute.hover instanceof ColorClass ? styleAttribute.hover.color : styleAttribute.hover;
            }
            if (styleAttribute.active != null) {
                this.ActiveAppearance.Background = styleAttribute.active instanceof ColorClass ? styleAttribute.active.color : styleAttribute.active;
            }
            if (styleAttribute.disabled != null) {
                this.DisabledAppearance.Background = styleAttribute.disabled instanceof ColorClass ? styleAttribute.disabled.color : styleAttribute.disabled;
            }

            if (styleAttribute.focus != null) {
                this.FocusAppearance.Background = styleAttribute.focus instanceof ColorClass ? styleAttribute.focus.color : styleAttribute.focus;
            }

            if (styleAttribute.before != null) {
                this.BeforeAppearance.Background = styleAttribute.before instanceof ColorClass ? styleAttribute.before.color : styleAttribute.before;
            }
            return this;
        }

        throw 'Argument Exception in ' + this.constructor.name + '::backgound function.';

    }

    public backgroundImage(value: StyleAttribute): this;
    public backgroundImage(value: string): this;
    public backgroundImage(...args: any[]): this {
        if (args.length === 1 && is.string(args[0])) {
            const image = args[0];
            this.Appearance.BackgroundImage = image;
            return this;
        } else if (args.length === 1 && typeof args[0] === 'object') {
            const styleAttribute: StyleAttribute = args[0];
            if (styleAttribute.default != null) {
                this.Appearance.BackgroundImage = styleAttribute.default instanceof ColorClass ? styleAttribute.default.color : styleAttribute.default;
            }
            if (styleAttribute.hover != null) {
                this.HoverAppearance.BackgroundImage = styleAttribute.hover instanceof ColorClass ? styleAttribute.hover.color : styleAttribute.hover;
            }
            if (styleAttribute.active != null) {
                this.ActiveAppearance.BackgroundImage = styleAttribute.active instanceof ColorClass ? styleAttribute.active.color : styleAttribute.active;
            }
            if (styleAttribute.disabled != null) {
                this.DisabledAppearance.BackgroundImage = styleAttribute.disabled instanceof ColorClass ? styleAttribute.disabled.color : styleAttribute.disabled;
            }
            return this;
        }
        throw 'Argument Exception in ' + this.constructor.name + '::backgroundImage function.';
    }

    public render(): React.ReactNode {
        return null;
    }
}