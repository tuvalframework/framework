import { Guid, foreach, int, is } from "@tuval/core";
import { AppearanceObject } from "./AppearanceObject";
import { ViewProperty } from "./ViewProperty";
import { StyleAttribute } from "./StyleAttribute";
import { ColorClass } from "./ColorClass";
import React, { FunctionComponent } from "react";
import { AlignmentType, cBottom, cBottomLeading, cBottomTrailing, cCenter, cHorizontal, cLeading, cLeft, CornerRadiusTypes, cRight, cTop, cTopLeading, cTopTrailing, cTrailing, cVertical, FontWeightModifierTypes, PositionTypes, ShadowTypes, TextAligns, TextTransforms, VerticalAligns } from "../../Constants";
import { css } from "@emotion/css";
import { KeyFrameCollection } from './KeyFrameCollection';

const DefaultPaddingValue = '10px';
const DefaultMarginValue = '5px';

export class UIView {
    private silentMode: boolean;
    private isInRenderProcess: boolean = false;
    public static Renderer: any;
    public propertyBag = {}

    public BeginUpdate() {
        this.silentMode = true;
    }

    public EndUpdate() {
        this.silentMode = false;
    }

    @ViewProperty()
    public KeyFrameCollection: KeyFrameCollection[];

    @ViewProperty()
    public vp_Key: string;



    @ViewProperty()
    public vp_Tooltip: string;

    public tooltip(value: string) {
        this.vp_Tooltip = value;
        return this;
    }

    @ViewProperty()
    public vp_Tag: any;

    public tag(value: any) {
        this.vp_Tag = value;
        return this;
    }

    @ViewProperty() vp_Ref: any;
    public ref(value: any): this {
        this.vp_Ref = value;
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

    @ViewProperty()
    public AfterAppearance: AppearanceObject;

    public constructor() {

        this.BeginUpdate();
        // const [key, setKey] = React.useState(Guid.NewGuid().ToString());
        // this.vp_Key = key;
        // console.log(key);
        this.EndUpdate();

        this.vp_Visible = true;

        this.Appearance = new AppearanceObject(this);
        this.HoverAppearance = new AppearanceObject(this);
        this.FocusAppearance = new AppearanceObject(this);
        this.ActiveAppearance = new AppearanceObject(this);
        this.DisabledAppearance = new AppearanceObject(this);
        this.BeforeAppearance = new AppearanceObject(this);
        this.AfterAppearance = new AppearanceObject(this);

        this.KeyFrameCollection = [];


        this.Appearance.Position = PositionTypes.Relative;

        this.vp_Ref = React.createRef();
    }

    public RenderStarted() {
        this.isInRenderProcess = true;
    }
    public RenderFinished() {
        this.isInRenderProcess = false;
    }

    public SetViewProperty(propertyName, value?: any): void/* PropertyDecorator */ {

        if (this.propertyBag == null) {
            this.propertyBag = {};
        }

        if (this.propertyBag[propertyName] !== value) {
            this.propertyBag[propertyName] = value;
            if (!this.silentMode) {
                this.ForceUpdate()
            }
        }
    }


    //-------------Events--------
    /** @internal */
    @ViewProperty((): void => { })
    public vp_OnDragStart: Function;

    public onDragStart(value: Function) {
        this.vp_OnDragStart = value;
        return this;
    }

    @ViewProperty((): void => { })
    public vp_OnDragEnd: Function;

    public onDragEnd(value: Function) {
        this.vp_OnDragEnd = value;
        return this;
    }

   // protected onDragStartInternal(e: any): void { }

    /** @internal */
    @ViewProperty((): void => { })
    public vp_OnDragOver: Function;

    public onDragOver(value: Function) {
        this.vp_OnDragOver = value;
        return this;
    }

   // protected onDragOverInternal(e: any): void { }

    /** @internal */
    @ViewProperty((): void => { })
    public vp_OnDrop: Function;

    public onDrop(value: Function) {
        this.vp_OnDrop = value;
        return this;
    }

    protected onDropInternal(e: any): void { }


    /** @internal */
    @ViewProperty((): void => { })
    public vp_OnDragEnter: Function;

    public onDragEnter(value: Function) {
        this.vp_OnDragEnter = value;
        return this;
    }

   // protected onDragEnterInternal(e: any): void { }

    /** @internal */
    @ViewProperty((): void => { })
    public vp_OnDragLeave: Function;

    public onDragLeave(value: Function) {
        this.vp_OnDragLeave = value;
        return this;
    }

   // protected onDragLeaveInternal(e: any): void { }

    /** @internal */
    @ViewProperty((): void => { })
    public vp_OnClick: Function;

    public onClick(value: Function) {
        this.vp_OnClick = value;
        return this;
    }

    /** @internal */
    @ViewProperty((): void => { })
    public vp_OnPointerDown: Function;

    public onPointerDown(value: Function) {
        this.vp_OnPointerDown = value;
        return this;
    }



    protected onClickInternal(e: any): void { }

    /** @internal */
    @ViewProperty((): void => { })
    public vp_OnMouseDown: Function;

    public onMouseDown(value: Function) {
        this.vp_OnMouseDown = value;
        return this;
    }

    protected onMouseDownInternal(e: any): void { }

    /** @internal */
    @ViewProperty((): void => { })
    public vp_OnFocus: Function;

    public onFocus(value: Function) {
        this.vp_OnFocus = value;
        return this;
    }

    protected onFocusInternal(e: any): void { }

    /** @internal */
    @ViewProperty((): void => { })
    public vp_OnFocusOut: Function;

    public onFocusOut(value: Function) {
        this.vp_OnFocusOut = value;
        return this;
    }

    protected onFocusOutInternal(e: any): void { }



    /** @internal */
    @ViewProperty((): void => { })
    public vp_OnBlur: Function;

    public onBlur(value: Function) {
        this.vp_OnBlur = value;
        return this;
    }

    protected onBlurInternal(e: any): void { }

    /** @internal */
    @ViewProperty((): void => { })
    public vp_OnScroll: Function;

    public onScroll(value: Function) {
        this.vp_OnScroll = value;
        return this;
    }

    protected onScrollInternal(e: any): void { }

    /** @internal */
    @ViewProperty((): void => { })
    public vp_OnKeyDown: Function;

    public onKeyDown(value: Function) {
        this.vp_OnKeyDown = value;
        return this;
    }

    //-------------------------

    /** @internal */
    @ViewProperty(false)
    public vp_Disabled: boolean;

    public disabled(value: boolean) {
        this.vp_Disabled = value;
        return this;
    }

    /** @internal */
    @ViewProperty()
    public vp_TabIndex: number;

    public tabIndex(value: number) {
        this.vp_TabIndex = value;
        return this;
    }


    /** @internal */
    @ViewProperty()
    public vp_Visible: boolean;

    public visible(value: boolean): this {
        if (value === true) {
            this.vp_Visible = true;
            this.Appearance.Visibility = 'visible';
        } else {
            this.vp_Visible = false;
            this.Appearance.Visibility = 'hidden';
        }
        return this;
    }



    public visibility(value: string): this {
        this.Appearance.Visibility = value
        return this;
    }

    public gridTemplateRows(value: string): this {
        this.Appearance.GridTemplateRows = value
        return this;
    }


    /** @internal */
    @ViewProperty()
    public vp_ScrollTop: number;

    public scrollTop(value: number) {
        this.vp_ScrollTop = value;
        return this;
    }

    /** @internal */
    @ViewProperty()
    public vp_Style: string;

    public style(value: string) {
        this.vp_Style = value;
        return this;
    }

    public ForceUpdate() { }

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
        } else if (args.length === 1 && args[0] === null) {
            // no set width
            this.Appearance.Width = '';
            this.Appearance.MaxWidth = '';
            this.Appearance.MinWidth = '';
            return this;
        }
        else if (args.length === 1 && is.number(args[0])) {
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
            if (styleAttribute.after != null) {
                this.AfterAppearance.Width = styleAttribute.after as any;
            }
            return this;
        }

        throw `ArgumentOutOfRange Exception in UIView::width method. Argument count: ${args.length}`;
    }

    public minWidth(): this;
    public minWidth(value: int): this;
    public minWidth(value: string): this;
    public minWidth(value: StyleAttribute): this;
    public minWidth(...args: any[]): this {
        if (args.length === 0) {
            this.Appearance.MinWidth = '';
            return this;
        } else if (args.length === 1 && is.number(args[0])) {
            const value = args[0];
            this.Appearance.MinWidth = `${value}px`;
            return this;
        } else if (args.length === 1 && is.string(args[0])) {
            const value: string = args[0];
            this.Appearance.MinWidth = value;
            return this;
        } else if (args.length === 1 && typeof args[0] === 'object') {
            const styleAttribute: StyleAttribute = args[0];
            if (styleAttribute.default != null) {
                this.Appearance.MinWidth = styleAttribute.default as any;
            }
            if (styleAttribute.hover != null) {
                this.HoverAppearance.MinWidth = styleAttribute.hover as any;
            }
            if (styleAttribute.active != null) {
                this.ActiveAppearance.MinWidth = styleAttribute.active as any;
            }
            if (styleAttribute.disabled != null) {
                this.DisabledAppearance.MinWidth = styleAttribute.disabled as any;
            }

            if (styleAttribute.focus != null) {
                this.FocusAppearance.MinWidth = styleAttribute.focus as any;
            }

            if (styleAttribute.before != null) {
                this.BeforeAppearance.MinWidth = styleAttribute.before as any;
            }

            if (styleAttribute.after != null) {
                this.AfterAppearance.MinWidth = styleAttribute.after as any;
            }
            return this;
        }

        throw `ArgumentOutOfRange Exception in UIView::height method. Argument count: ${args.length}`;
    }

    public maxWidth(): this;
    public maxWidth(value: int): this;
    public maxWidth(value: string): this;
    public maxWidth(value: StyleAttribute): this;
    public maxWidth(...args: any[]): this {
        if (args.length === 0) {
            this.Appearance.MaxWidth = '';
            return this;
        } else if (args.length === 1 && is.number(args[0])) {
            const value = args[0];
            this.Appearance.MaxWidth = `${value}px`;
            return this;
        } else if (args.length === 1 && is.string(args[0])) {
            const value: string = args[0];
            this.Appearance.MaxWidth = value;
            return this;
        } else if (args.length === 1 && typeof args[0] === 'object') {
            const styleAttribute: StyleAttribute = args[0];
            if (styleAttribute.default != null) {
                this.Appearance.MaxWidth = styleAttribute.default as any;
            }
            if (styleAttribute.hover != null) {
                this.HoverAppearance.MaxWidth = styleAttribute.hover as any;
            }
            if (styleAttribute.active != null) {
                this.ActiveAppearance.MaxWidth = styleAttribute.active as any;
            }
            if (styleAttribute.disabled != null) {
                this.DisabledAppearance.MaxWidth = styleAttribute.disabled as any;
            }

            if (styleAttribute.focus != null) {
                this.FocusAppearance.MaxWidth = styleAttribute.focus as any;
            }

            if (styleAttribute.before != null) {
                this.BeforeAppearance.MaxWidth = styleAttribute.before as any;
            }

            if (styleAttribute.after != null) {
                this.AfterAppearance.MaxWidth = styleAttribute.after as any;
            }


            return this;
        }

        throw `ArgumentOutOfRange Exception in UIView::height method. Argument count: ${args.length}`;
    }

    public allWidth(): this;
    public allWidth(value: int): this;
    public allWidth(value: string): this;
    public allWidth(...args: any[]): this {
        if (args.length === 0) {
            this.Appearance.Width = this.Appearance.MinWidth = this.Appearance.MaxWidth = '';
            return this;
        } else if (args.length === 1 && is.number(args[0])) {
            const value = args[0];
            this.Appearance.Width = this.Appearance.MinWidth = this.Appearance.MaxWidth = `${value}px`;
            return this;
        } else if (args.length === 1 && is.string(args[0])) {
            const value: string = args[0];
            this.Appearance.Width = this.Appearance.MinWidth = this.Appearance.MaxWidth = value;
            return this;
        }

        throw `ArgumentOutOfRange Exception in UIView::width method. Argument count: ${args.length}`;
    }

    public height(): this;
    public height(value: int): this;
    public height(value: string): this;
    public height(value: StyleAttribute): this;
    public height(...args: any[]): this {

        //if için
       /*  if (args.length === 1 && args[0] === null){
           
            return;
        }
        else */ if (args.length === 1 && args[0] === null) {
            // no set width
            this.Appearance.Height = '';
            this.Appearance.MaxHeight = '';
            this.Appearance.MinHeight = '';
            return this;
        }

        if (args.length === 0) {
            this.Appearance.Height = 'fit-content';
            return this;
        } else if (args.length === 1 && is.number(args[0])) {
            const value = args[0];
            this.Appearance.Height = `${value}px`;
            return this;
        } else if (args.length === 1 && is.string(args[0])) {
            const value: string = args[0];
            this.Appearance.Height = value;
            return this;
        } else if (args.length === 1 && typeof args[0] === 'object') {
            const styleAttribute: StyleAttribute = args[0];
            if (styleAttribute.default != null) {
                this.Appearance.Height = styleAttribute.default as any;
            }
            if (styleAttribute.hover != null) {
                this.HoverAppearance.Height = styleAttribute.hover as any;
            }
            if (styleAttribute.active != null) {
                this.ActiveAppearance.Height = styleAttribute.active as any;
            }
            if (styleAttribute.disabled != null) {
                this.DisabledAppearance.Height = styleAttribute.disabled as any;
            }

            if (styleAttribute.focus != null) {
                this.FocusAppearance.Height = styleAttribute.focus as any;
            }

            if (styleAttribute.before != null) {
                this.BeforeAppearance.Height = styleAttribute.before as any;
            }

            if (styleAttribute.after != null) {
                this.AfterAppearance.Height = styleAttribute.after as any;
            }

            return this;
        }

        throw `ArgumentOutOfRange Exception in UIView::height method. Argument count: ${args.length}`;
    }

    public allHeight(): this;
    public allHeight(value: int): this;
    public allHeight(value: string): this;
    public allHeight(...args: any[]): this {
        if (args.length === 0) {
            this.Appearance.Height = this.Appearance.MaxHeight = this.Appearance.MinHeight = '';
            return this;
        } else if (args.length === 1 && is.number(args[0])) {
            const value = args[0];
            this.Appearance.Height = this.Appearance.MaxHeight = this.Appearance.MinHeight = `${value}px`;
            return this;
        } else if (args.length === 1 && is.string(args[0])) {
            const value: string = args[0];
            this.Appearance.Height = this.Appearance.MaxHeight = this.Appearance.MinHeight = value;
            return this;
        }

        throw `ArgumentOutOfRange Exception in UIView::height method. Argument count: ${args.length}`;
    }

    public minHeight(): this;
    public minHeight(value: int): this;
    public minHeight(value: string): this;
    public minHeight(value: StyleAttribute): this;
    public minHeight(...args: any[]): this {
        if (args.length === 0) {
            this.Appearance.MinHeight = '';
            return this;
        } else if (args.length === 1 && is.number(args[0])) {
            const value = args[0];
            this.Appearance.MinHeight = `${value}px`;
            return this;
        } else if (args.length === 1 && is.string(args[0])) {
            const value: string = args[0];
            this.Appearance.MinHeight = value;
            return this;
        } else if (args.length === 1 && typeof args[0] === 'object') {
            const styleAttribute: StyleAttribute = args[0];
            if (styleAttribute.default != null) {
                this.Appearance.MinHeight = styleAttribute.default as any;
            }
            if (styleAttribute.hover != null) {
                this.HoverAppearance.MinHeight = styleAttribute.hover as any;
            }
            if (styleAttribute.active != null) {
                this.ActiveAppearance.MinHeight = styleAttribute.active as any;
            }
            if (styleAttribute.disabled != null) {
                this.DisabledAppearance.MinHeight = styleAttribute.disabled as any;
            }

            if (styleAttribute.focus != null) {
                this.FocusAppearance.MinHeight = styleAttribute.focus as any;
            }

            if (styleAttribute.before != null) {
                this.BeforeAppearance.MinHeight = styleAttribute.before as any;
            }

            if (styleAttribute.after != null) {
                this.AfterAppearance.MinHeight = styleAttribute.after as any;
            }
            return this;
        }

        throw `ArgumentOutOfRange Exception in UIView::minheight method. Argument count: ${args.length}`;
    }

    public maxHeight(): this;
    public maxHeight(value: int): this;
    public maxHeight(value: string): this;
    public maxHeight(value: StyleAttribute): this;
    public maxHeight(...args: any[]): this {
        if (args.length === 0) {
            this.Appearance.MaxHeight = '';
            return this;
        } else if (args.length === 1 && is.number(args[0])) {
            const value = args[0];
            this.Appearance.MaxHeight = `${value}px`;
            return this;
        } else if (args.length === 1 && is.string(args[0])) {
            const value: string = args[0];
            this.Appearance.MaxHeight = value;
            return this;
        } else if (args.length === 1 && typeof args[0] === 'object') {
            const styleAttribute: StyleAttribute = args[0];
            if (styleAttribute.default != null) {
                this.Appearance.MaxHeight = styleAttribute.default as any;
            }
            if (styleAttribute.hover != null) {
                this.HoverAppearance.MaxHeight = styleAttribute.hover as any;
            }
            if (styleAttribute.active != null) {
                this.ActiveAppearance.MaxHeight = styleAttribute.active as any;
            }
            if (styleAttribute.disabled != null) {
                this.DisabledAppearance.MaxHeight = styleAttribute.disabled as any;
            }

            if (styleAttribute.focus != null) {
                this.FocusAppearance.MaxHeight = styleAttribute.focus as any;
            }

            if (styleAttribute.before != null) {
                this.BeforeAppearance.MaxHeight = styleAttribute.before as any;
            }

            if (styleAttribute.after != null) {
                this.AfterAppearance.MaxHeight = styleAttribute.after as any;
            }
            return this;
        }

        throw `ArgumentOutOfRange Exception in UIView::maxHeight method. Argument count: ${args.length}`;
    }

    public backgroundColor(value: StyleAttribute): this;
    public backgroundColor(value: string): this;
    public backgroundColor(...args: any[]): this {
        if (args.length === 0 || args[0] == null) {
            this.Appearance.BackgroundColor = '';
        } else if (args.length === 1 && is.string(args[0])) {
            const image = args[0];
            this.Appearance.BackgroundColor = image;
        } else if (args.length === 1 && typeof args[0] === 'object') {
            const styleAttribute: StyleAttribute = args[0];
            if (styleAttribute.default != null) {
                if (is.string(styleAttribute.default)) {
                    this.Appearance.BackgroundColor = styleAttribute.default;
                } else if (styleAttribute.default instanceof ColorClass) {
                    this.Appearance.BackgroundColor = styleAttribute.default.color;
                }

            }
            if (styleAttribute.hover != null) {
                if (is.string(styleAttribute.hover)) {
                    this.HoverAppearance.BackgroundColor = styleAttribute.hover;
                } else if (styleAttribute.hover instanceof ColorClass) {
                    this.HoverAppearance.BackgroundColor = styleAttribute.hover.color;
                }
            }
            if (styleAttribute.active != null) {
                if (is.string(styleAttribute.active)) {
                    this.ActiveAppearance.BackgroundColor = styleAttribute.active;
                } else if (styleAttribute.active instanceof ColorClass) {
                    this.ActiveAppearance.BackgroundColor = styleAttribute.active.color;
                }
            }
            if (styleAttribute.disabled != null) {
                if (is.string(styleAttribute.disabled)) {
                    this.DisabledAppearance.BackgroundColor = styleAttribute.disabled;
                } else if (styleAttribute.disabled instanceof ColorClass) {
                    this.DisabledAppearance.BackgroundColor = styleAttribute.disabled.color;
                }
            }

            if (styleAttribute.focus != null) {
                if (is.string(styleAttribute.focus)) {
                    this.FocusAppearance.BackgroundColor = styleAttribute.focus;
                } else if (styleAttribute.focus instanceof ColorClass) {
                    this.FocusAppearance.BackgroundColor = styleAttribute.focus.color;
                }
            }
        }
        return this;
        //throw 'Argument Exception in ' + this.constructor.name + '::backgroundColor function.';
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

            if (styleAttribute.after != null) {
                this.AfterAppearance.Background = styleAttribute.after as any;
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

            if (styleAttribute.focus != null) {
                this.FocusAppearance.BackgroundImage = styleAttribute.focus instanceof ColorClass ? styleAttribute.focus.color : styleAttribute.focus;
            }

            if (styleAttribute.before != null) {
                this.BeforeAppearance.BackgroundImage = styleAttribute.before instanceof ColorClass ? styleAttribute.before.color : styleAttribute.before;
            }

            if (styleAttribute.after != null) {
                this.AfterAppearance.BackgroundImage = styleAttribute.after as any;
            }

            return this;
        }
        throw 'Argument Exception in ' + this.constructor.name + '::backgroundImage function.';
    }




    public position(value: PositionTypes): this;
    public position(value: StyleAttribute): this;
    public position(value: string): this;
    public position(...args: any[]): this {
        if (args.length === 0 || args[0] == null) {
            this.Appearance.Position = 'relative';
        } else if (args.length === 1 && is.string(args[0])) {
            const image = args[0];
            this.Appearance.Position = image;
        } else if (args.length === 1 && typeof args[0] === 'object') {
            const styleAttribute: StyleAttribute = args[0];
            if (styleAttribute.default != null) {
                this.Appearance.Position = styleAttribute.default as any;
            }
            if (styleAttribute.hover != null) {
                this.HoverAppearance.Position = styleAttribute.hover as any;
            }
            if (styleAttribute.active != null) {
                this.ActiveAppearance.Position = styleAttribute.active as any;
            }
            if (styleAttribute.disabled != null) {
                this.DisabledAppearance.Position = styleAttribute.disabled as any;
            }

            if (styleAttribute.focus != null) {
                this.FocusAppearance.Position = styleAttribute.focus as any;
            }

            if (styleAttribute.before != null) {
                this.BeforeAppearance.Position = styleAttribute.before as any;
            }

            if (styleAttribute.after != null) {
                this.AfterAppearance.Position = styleAttribute.after as any;
            }
        }
        return this;
        //throw 'Argument Exception in ' + this.constructor.name + '::backgroundColor function.';
    }

    public flexBasis(value: StyleAttribute): this;
    public flexBasis(value: string): this;
    public flexBasis(...args: any[]): this {
        if (args.length === 0 || args[0] == null) {
            this.Appearance.FlexBasis = '';
        } else if (args.length === 1 && is.string(args[0])) {
            const image = args[0];
            this.Appearance.FlexBasis = image;
        } else if (args.length === 1 && typeof args[0] === 'object') {
            const styleAttribute: StyleAttribute = args[0];
            if (styleAttribute.default != null) {
                this.Appearance.FlexBasis = styleAttribute.default as any;
            }
            if (styleAttribute.hover != null) {
                this.HoverAppearance.FlexBasis = styleAttribute.hover as any;
            }
            if (styleAttribute.active != null) {
                this.ActiveAppearance.FlexBasis = styleAttribute.active as any;
            }
            if (styleAttribute.disabled != null) {
                this.DisabledAppearance.FlexBasis = styleAttribute.disabled as any;
            }

            if (styleAttribute.focus != null) {
                this.FocusAppearance.FlexBasis = styleAttribute.focus as any;
            }

            if (styleAttribute.before != null) {
                this.BeforeAppearance.FlexBasis = styleAttribute.before as any;
            }

            if (styleAttribute.after != null) {
                this.AfterAppearance.FlexBasis = styleAttribute.after as any;
            }
        }
        return this;
        //throw 'Argument Exception in ' + this.constructor.name + '::backgroundColor function.';
    }

    public flexGrow(value: StyleAttribute): this;
    public flexGrow(value: string): this;
    public flexGrow(...args: any[]): this {
        if (args.length === 0 || args[0] == null) {
            this.Appearance.FlexGrow = '';
        } else if (args.length === 1 && is.string(args[0])) {
            const image = args[0];
            this.Appearance.FlexGrow = image;
        } else if (args.length === 1 && typeof args[0] === 'object') {
            const styleAttribute: StyleAttribute = args[0];
            if (styleAttribute.default != null) {
                this.Appearance.FlexGrow = styleAttribute.default as any;
            }
            if (styleAttribute.hover != null) {
                this.HoverAppearance.FlexGrow = styleAttribute.hover as any;
            }
            if (styleAttribute.active != null) {
                this.ActiveAppearance.FlexGrow = styleAttribute.active as any;
            }
            if (styleAttribute.disabled != null) {
                this.DisabledAppearance.FlexGrow = styleAttribute.disabled as any;
            }

            if (styleAttribute.focus != null) {
                this.FocusAppearance.FlexGrow = styleAttribute.focus as any;
            }

            if (styleAttribute.before != null) {
                this.BeforeAppearance.FlexGrow = styleAttribute.before as any;
            }

            if (styleAttribute.after != null) {
                this.AfterAppearance.FlexGrow = styleAttribute.after as any;
            }
        }
        return this;
        //throw 'Argument Exception in ' + this.constructor.name + '::backgroundColor function.';
    }

    public flexShrink(value: StyleAttribute): this;
    public flexShrink(value: string): this;
    public flexShrink(...args: any[]): this {
        if (args.length === 0 || args[0] == null) {
            this.Appearance.FlexShrink = '';
        } else if (args.length === 1 && is.string(args[0])) {
            const image = args[0];
            this.Appearance.FlexShrink = image;
        } else if (args.length === 1 && typeof args[0] === 'object') {
            const styleAttribute: StyleAttribute = args[0];
            if (styleAttribute.default != null) {
                this.Appearance.FlexShrink = styleAttribute.default as any;
            }
            if (styleAttribute.hover != null) {
                this.HoverAppearance.FlexShrink = styleAttribute.hover as any;
            }
            if (styleAttribute.active != null) {
                this.ActiveAppearance.FlexShrink = styleAttribute.active as any;
            }
            if (styleAttribute.disabled != null) {
                this.DisabledAppearance.FlexShrink = styleAttribute.disabled as any;
            }

            if (styleAttribute.focus != null) {
                this.FocusAppearance.FlexShrink = styleAttribute.focus as any;
            }

            if (styleAttribute.before != null) {
                this.BeforeAppearance.FlexShrink = styleAttribute.before as any;
            }

            if (styleAttribute.after != null) {
                this.AfterAppearance.FlexShrink = styleAttribute.after as any;
            }
        }
        return this;
        //throw 'Argument Exception in ' + this.constructor.name + '::backgroundColor function.';
    }

    public flex(value: StyleAttribute): this;
    public flex(value: string): this;
    public flex(...args: any[]): this {
        if (args.length === 0 || args[0] == null) {
            this.Appearance.flex = '';
        } else if (args.length === 1 && is.string(args[0])) {
            const image = args[0];
            this.Appearance.flex = image;
        } else if (args.length === 1 && typeof args[0] === 'object') {
            const styleAttribute: StyleAttribute = args[0];
            if (styleAttribute.default != null) {
                this.Appearance.flex = styleAttribute.default as any;
            }
            if (styleAttribute.hover != null) {
                this.HoverAppearance.flex = styleAttribute.hover as any;
            }
            if (styleAttribute.active != null) {
                this.ActiveAppearance.flex = styleAttribute.active as any;
            }
            if (styleAttribute.disabled != null) {
                this.DisabledAppearance.flex = styleAttribute.disabled as any;
            }

            if (styleAttribute.focus != null) {
                this.FocusAppearance.flex = styleAttribute.focus as any;
            }

            if (styleAttribute.before != null) {
                this.BeforeAppearance.flex = styleAttribute.before as any;
            }

            if (styleAttribute.after != null) {
                this.AfterAppearance.flex = styleAttribute.after as any;
            }
        }
        return this;
        //throw 'Argument Exception in ' + this.constructor.name + '::backgroundColor function.';
    }


    public writingMode(value: StyleAttribute): this;
    public writingMode(value: string): this;
    public writingMode(...args: any[]): this {
        if (args.length === 0 || args[0] == null) {
            this.Appearance.WritingMode = '';
        } else if (args.length === 1 && is.string(args[0])) {
            const image = args[0];
            this.Appearance.WritingMode = image;
        } else if (args.length === 1 && typeof args[0] === 'object') {
            const styleAttribute: StyleAttribute = args[0];
            if (styleAttribute.default != null) {
                this.Appearance.WritingMode = styleAttribute.default as any;
            }
            if (styleAttribute.hover != null) {
                this.HoverAppearance.WritingMode = styleAttribute.hover as any;
            }
            if (styleAttribute.active != null) {
                this.ActiveAppearance.WritingMode = styleAttribute.active as any;
            }
            if (styleAttribute.disabled != null) {
                this.DisabledAppearance.WritingMode = styleAttribute.disabled as any;
            }

            if (styleAttribute.focus != null) {
                this.FocusAppearance.WritingMode = styleAttribute.focus as any;
            }

            if (styleAttribute.before != null) {
                this.BeforeAppearance.WritingMode = styleAttribute.before as any;
            }

            if (styleAttribute.after != null) {
                this.AfterAppearance.WritingMode = styleAttribute.after as any;
            }
        }
        return this;
        //throw 'Argument Exception in ' + this.constructor.name + '::backgroundColor function.';
    }

    public left(value: StyleAttribute): this;
    public left(value: string): this;
    public left(...args: any[]): this {
        if (args.length === 0 || args[0] == null) {
            this.Appearance.Left = 'relative';
        } else if (args.length === 1 && is.string(args[0])) {
            const image = args[0];
            this.Appearance.Left = image;
        } else if (args.length === 1 && typeof args[0] === 'object') {
            const styleAttribute: StyleAttribute = args[0];
            if (styleAttribute.default != null) {
                this.Appearance.Left = styleAttribute.default as any;
            }
            if (styleAttribute.hover != null) {
                this.HoverAppearance.Left = styleAttribute.hover as any;
            }
            if (styleAttribute.active != null) {
                this.ActiveAppearance.Left = styleAttribute.active as any;
            }
            if (styleAttribute.disabled != null) {
                this.DisabledAppearance.Left = styleAttribute.disabled as any;
            }

            if (styleAttribute.focus != null) {
                this.FocusAppearance.Left = styleAttribute.focus as any;
            }

            if (styleAttribute.before != null) {
                this.BeforeAppearance.Left = styleAttribute.before as any;
            }

            if (styleAttribute.after != null) {
                this.AfterAppearance.Left = styleAttribute.after as any;
            }
        }
        return this;
        //throw 'Argument Exception in ' + this.constructor.name + '::backgroundColor function.';
    }

    public top(value: StyleAttribute): this;
    public top(value: string): this;
    public top(...args: any[]): this {
        if (args.length === 0 || args[0] == null) {
            this.Appearance.Top = 'relative';
        } else if (args.length === 1 && is.string(args[0])) {
            const image = args[0];
            this.Appearance.Top = image;
        } else if (args.length === 1 && typeof args[0] === 'object') {
            const styleAttribute: StyleAttribute = args[0];
            if (styleAttribute.default != null) {
                this.Appearance.Top = styleAttribute.default as any;
            }
            if (styleAttribute.hover != null) {
                this.HoverAppearance.Top = styleAttribute.hover as any;
            }
            if (styleAttribute.active != null) {
                this.ActiveAppearance.Top = styleAttribute.active as any;
            }
            if (styleAttribute.disabled != null) {
                this.DisabledAppearance.Top = styleAttribute.disabled as any;
            }

            if (styleAttribute.focus != null) {
                this.FocusAppearance.Top = styleAttribute.focus as any;
            }

            if (styleAttribute.before != null) {
                this.BeforeAppearance.Top = styleAttribute.before as any;
            }

            if (styleAttribute.after != null) {
                this.AfterAppearance.Top = styleAttribute.after as any;
            }
        }
        return this;
        //throw 'Argument Exception in ' + this.constructor.name + '::backgroundColor function.';
    }

    public right(value: StyleAttribute): this;
    public right(value: string): this;
    public right(...args: any[]): this {
        if (args.length === 0 || args[0] == null) {
            this.Appearance.Right = 'relative';
        } else if (args.length === 1 && is.string(args[0])) {
            const image = args[0];
            this.Appearance.Right = image;
        } else if (args.length === 1 && typeof args[0] === 'object') {
            const styleAttribute: StyleAttribute = args[0];
            if (styleAttribute.default != null) {
                this.Appearance.Right = styleAttribute.default as any;
            }
            if (styleAttribute.hover != null) {
                this.HoverAppearance.Right = styleAttribute.hover as any;
            }
            if (styleAttribute.active != null) {
                this.ActiveAppearance.Right = styleAttribute.active as any;
            }
            if (styleAttribute.disabled != null) {
                this.DisabledAppearance.Right = styleAttribute.disabled as any;
            }

            if (styleAttribute.focus != null) {
                this.FocusAppearance.Right = styleAttribute.focus as any;
            }

            if (styleAttribute.before != null) {
                this.BeforeAppearance.Right = styleAttribute.before as any;
            }

            if (styleAttribute.after != null) {
                this.AfterAppearance.Right = styleAttribute.after as any;
            }
        }
        return this;
        //throw 'Argument Exception in ' + this.constructor.name + '::backgroundColor function.';
    }

    public bottom(value: StyleAttribute): this;
    public bottom(value: string): this;
    public bottom(...args: any[]): this {
        if (args.length === 0 || args[0] == null) {
            this.Appearance.Bottom = 'relative';
        } else if (args.length === 1 && is.string(args[0])) {
            const image = args[0];
            this.Appearance.Bottom = image;
        } else if (args.length === 1 && typeof args[0] === 'object') {
            const styleAttribute: StyleAttribute = args[0];
            if (styleAttribute.default != null) {
                this.Appearance.Bottom = styleAttribute.default as any;
            }
            if (styleAttribute.hover != null) {
                this.HoverAppearance.Bottom = styleAttribute.hover as any;
            }
            if (styleAttribute.active != null) {
                this.ActiveAppearance.Bottom = styleAttribute.active as any;
            }
            if (styleAttribute.disabled != null) {
                this.DisabledAppearance.Bottom = styleAttribute.disabled as any;
            }

            if (styleAttribute.focus != null) {
                this.FocusAppearance.Bottom = styleAttribute.focus as any;
            }

            if (styleAttribute.before != null) {
                this.BeforeAppearance.Bottom = styleAttribute.before as any;
            }

            if (styleAttribute.after != null) {
                this.AfterAppearance.Bottom = styleAttribute.after as any;
            }
        }
        return this;
        //throw 'Argument Exception in ' + this.constructor.name + '::backgroundColor function.';
    }

    //#region Transforms

    public transform(value: StyleAttribute): this;
    public transform(value: string): this;
    public transform(...args: any[]): this {
        if (args.length === 1 && is.string(args[0])) {
            const value = args[0];
            this.Appearance.Transform = value;
            return this;
        } else if (args.length === 1 && typeof args[0] === 'object') {
            const styleAttribute: StyleAttribute = args[0];
            if (styleAttribute.default != null) {
                this.Appearance.Transform = styleAttribute.default instanceof ColorClass ? styleAttribute.default.color : styleAttribute.default;
            }
            if (styleAttribute.hover != null) {
                this.HoverAppearance.Transform = styleAttribute.hover instanceof ColorClass ? styleAttribute.hover.color : styleAttribute.hover;
            }
            if (styleAttribute.active != null) {
                this.ActiveAppearance.Transform = styleAttribute.active instanceof ColorClass ? styleAttribute.active.color : styleAttribute.active;
            }
            if (styleAttribute.disabled != null) {
                this.DisabledAppearance.Transform = styleAttribute.disabled instanceof ColorClass ? styleAttribute.disabled.color : styleAttribute.disabled;
            }


            if (styleAttribute.focus != null) {
                this.FocusAppearance.Transform = styleAttribute.focus instanceof ColorClass ? styleAttribute.focus.color : styleAttribute.focus;
            }
            if (styleAttribute.before != null) {
                this.BeforeAppearance.Transform = styleAttribute.before instanceof ColorClass ? styleAttribute.before.color : styleAttribute.before;
            }

            if (styleAttribute.after != null) {
                this.AfterAppearance.Transform = styleAttribute.after as any;
            }
            return this;
        }
        throw 'Argument Exception in ' + this.constructor.name + '::border function.';
    }

    public transformOrigin(value: StyleAttribute): this;
    public transformOrigin(value: string): this;
    public transformOrigin(...args: any[]): this {
        if (args.length === 1 && is.string(args[0])) {
            const value = args[0];
            this.Appearance.TransformOrigin = value;
            return this;
        } else if (args.length === 1 && typeof args[0] === 'object') {
            const styleAttribute: StyleAttribute = args[0];
            if (styleAttribute.default != null) {
                this.Appearance.TransformOrigin = styleAttribute.default instanceof ColorClass ? styleAttribute.default.color : styleAttribute.default;
            }
            if (styleAttribute.hover != null) {
                this.HoverAppearance.TransformOrigin = styleAttribute.hover instanceof ColorClass ? styleAttribute.hover.color : styleAttribute.hover;
            }
            if (styleAttribute.active != null) {
                this.ActiveAppearance.TransformOrigin = styleAttribute.active instanceof ColorClass ? styleAttribute.active.color : styleAttribute.active;
            }
            if (styleAttribute.disabled != null) {
                this.DisabledAppearance.TransformOrigin = styleAttribute.disabled instanceof ColorClass ? styleAttribute.disabled.color : styleAttribute.disabled;
            }


            if (styleAttribute.focus != null) {
                this.FocusAppearance.TransformOrigin = styleAttribute.focus instanceof ColorClass ? styleAttribute.focus.color : styleAttribute.focus;
            }
            if (styleAttribute.before != null) {
                this.BeforeAppearance.TransformOrigin = styleAttribute.before instanceof ColorClass ? styleAttribute.before.color : styleAttribute.before;
            }

            if (styleAttribute.after != null) {
                this.AfterAppearance.TransformOrigin = styleAttribute.after as any;
            }
            return this;
        }
        throw 'Argument Exception in ' + this.constructor.name + '::TransformOrigin function.';
    }


    public rotate(value: string): this {
        if (this.Appearance.Transform == null) {
            this.Appearance.Transform = '';
        }
        this.Appearance.Transform += ` rotate(${value})`;
        return this;
    }
    //#endregion



    public clipPath(): this;
    public clipPath(value: string): this;
    public clipPath(value: StyleAttribute): this;
    public clipPath(...args: any[]): this {
        if (args.length === 0) {
            this.Appearance.ClipPath = '';
            return this;
        } else if (args.length === 1 && is.string(args[0])) {
            const value: string = args[0];
            this.Appearance.ClipPath = value;
            return this;
        } else if (args.length === 1 && typeof args[0] === 'object') {
            const styleAttribute: StyleAttribute = args[0];
            if (styleAttribute.default != null) {
                this.Appearance.ClipPath = styleAttribute.default as any;
            }
            if (styleAttribute.hover != null) {
                this.HoverAppearance.ClipPath = styleAttribute.hover as any;
            }
            if (styleAttribute.active != null) {
                this.ActiveAppearance.ClipPath = styleAttribute.active as any;
            }
            if (styleAttribute.disabled != null) {
                this.DisabledAppearance.ClipPath = styleAttribute.disabled as any;
            }

            if (styleAttribute.focus != null) {
                this.FocusAppearance.ClipPath = styleAttribute.focus as any;
            }

            if (styleAttribute.before != null) {
                this.BeforeAppearance.ClipPath = styleAttribute.before as any;
            }

            if (styleAttribute.after != null) {
                this.AfterAppearance.ClipPath = styleAttribute.after as any;
            }

            return this;
        }

        throw `ArgumentOutOfRange Exception in UIView::ClipPath method. Argument count: ${args.length}`;
    }

    public filter(value: string): this {
        this.Appearance.Filter = value;
        return this;
    }

    public verticalAlign(value: VerticalAligns): this {
        this.Appearance.VerticalAlign = value;
        return this;
    }

    public textAlign(value: TextAligns): this {
        this.Appearance.TextAlign = value;
        return this;
    }

    public textTransform(value: TextTransforms): this {
        this.Appearance.TextTransform = value;
        return this;
    }


    public fontFamily(size: string): this {
        this.Appearance.FontFamily = size;
        return this;
    }


    public fontSmoothing(value: string): this;
    public fontSmoothing(...args: any[]): this {
        if (args.length === 1) {
            const value = args[0];
            this.Appearance.StylePropertyBag['-webkit-font-smoothing'] = value;
            this.Appearance.StylePropertyBag['-moz-osx-font-smoothing'] = value;
            return this;
        }

        throw 'ArgumentOutOfRange Exception. UIView::fontSize';
    }

    public fontSize(value: (view: UIView) => void): this;
    public fontSize(size: int): this;
    public fontSize(size: string): this;
    public fontSize(...args: any[]): this {
        if (args.length === 1 && is.function(args[0])) {
            const value: (view: UIView) => void = args[0];
            value(this);
            return this;
        } else if (args.length === 1 && is.number(args[0])) {
            const size = args[0];
            this.Appearance.FontSize = size + 'px';
            return this;
        } else if (args.length === 1 && is.string(args[0])) {
            const size = args[0];
            this.Appearance.FontSize = size;
            return this;
        }

        throw 'ArgumentOutOfRange Exception. UIView::fontSize';
    }

    public fontWeight(weight: FontWeightModifierTypes) {
        this.Appearance.FontWeight = weight;
        return this;
    }

    public lineHeight(size: int): this;
    public lineHeight(size: string): this;
    public lineHeight(...args: any[]): this {
        if (args.length === 1 && is.number(args[0])) {
            const size = args[0];
            this.Appearance.LineHeight = size + 'px';
            return this;
        } else if (args.length === 1 && is.string(args[0])) {
            const size = args[0];
            this.Appearance.LineHeight = size;
            return this;
        }

        throw 'ArgumentOutOfRange Exception. UIView::lineHeight';
    }


    public grow(): this {
        this.Appearance.FlexGrow = '1';
        return this;
    }


    public foregroundColor(value: ColorClass): this;
    public foregroundColor(value: StyleAttribute): this;
    public foregroundColor(color: string): this
    public foregroundColor(condition: boolean, trueValue: string, falseValue: string): this;
    public foregroundColor(...args: any[]): this {
        if (args.length === 0 || args[0] == null) {
            this.Appearance.Color = '';
        } else if (args.length === 1 && args[0] instanceof ColorClass) {
            const color = args[0];
            this.Appearance.Color = color.toString();
        } else if (args.length === 1 && is.string(args[0])) {
            const color = args[0];
            this.Appearance.Color = color;
        } else if (args.length === 3) {
            const condition: boolean = args[0];
            const trueValue: string = args[1];
            const falseValue: string = args[2];
            this.Appearance.Color = condition ? trueValue : falseValue;
        } else if (args.length === 1 && typeof args[0] === 'object') {
            const styleAttribute: StyleAttribute = args[0];
            if (styleAttribute.default != null) {
                this.Appearance.Color = styleAttribute.default instanceof ColorClass ? styleAttribute.default.color : styleAttribute.default;
            }
            if (styleAttribute.hover != null) {
                this.HoverAppearance.Color = styleAttribute.hover instanceof ColorClass ? styleAttribute.hover.color : styleAttribute.hover;
            }
            if (styleAttribute.active != null) {
                this.ActiveAppearance.Color = styleAttribute.active instanceof ColorClass ? styleAttribute.active.color : styleAttribute.active;
            }
            if (styleAttribute.disabled != null) {
                this.DisabledAppearance.Color = styleAttribute.disabled instanceof ColorClass ? styleAttribute.disabled.color : styleAttribute.disabled;
            }
        }

        return this;
        // throw 'Argument Exception in ' + this.constructor.name + '::foregroundColor function.';

    }

    public backgroundSize(value: StyleAttribute): this;
    public backgroundSize(value: string): this;
    public backgroundSize(...args: any[]): this {
        if (args.length === 1 && is.string(args[0])) {
            const image = args[0];
            this.Appearance.BackgroundSize = image;
            return this;
        } else if (args.length === 1 && typeof args[0] === 'object') {
            const styleAttribute: StyleAttribute = args[0];
            if (styleAttribute.default != null) {
                this.Appearance.BackgroundSize = styleAttribute.default instanceof ColorClass ? styleAttribute.default.color : styleAttribute.default;
            }
            if (styleAttribute.hover != null) {
                this.HoverAppearance.BackgroundSize = styleAttribute.hover instanceof ColorClass ? styleAttribute.hover.color : styleAttribute.hover;
            }
            if (styleAttribute.active != null) {
                this.ActiveAppearance.BackgroundSize = styleAttribute.active instanceof ColorClass ? styleAttribute.active.color : styleAttribute.active;
            }
            if (styleAttribute.disabled != null) {
                this.DisabledAppearance.BackgroundSize = styleAttribute.disabled instanceof ColorClass ? styleAttribute.disabled.color : styleAttribute.disabled;
            }
            return this;
        }
        throw 'Argument Exception in ' + this.constructor.name + '::backgroundImage function.';
    }

    public content(value: StyleAttribute): this;
    public content(value: string): this;
    public content(...args: any[]): this {
        if (args.length === 0 || args[0] == null) {
            this.Appearance.Content = '';
        } else if (args.length === 1 && is.string(args[0])) {
            const image = args[0];
            this.Appearance.Content = image;
        } else if (args.length === 1 && typeof args[0] === 'object') {
            const styleAttribute: StyleAttribute = args[0];
            if (styleAttribute.default != null) {
                this.Appearance.Content = styleAttribute.default as any;
            }
            if (styleAttribute.hover != null) {
                this.HoverAppearance.Content = styleAttribute.hover as any;
            }
            if (styleAttribute.active != null) {
                this.ActiveAppearance.Content = styleAttribute.active as any;
            }
            if (styleAttribute.disabled != null) {
                this.DisabledAppearance.Content = styleAttribute.disabled as any;
            }

            if (styleAttribute.focus != null) {
                this.FocusAppearance.Content = styleAttribute.focus as any;
            }

            if (styleAttribute.before != null) {
                this.BeforeAppearance.Content = styleAttribute.before as any;
            }

            if (styleAttribute.after != null) {
                this.AfterAppearance.Content = styleAttribute.after as any;
            }
        }
        return this;
        //throw 'Argument Exception in ' + this.constructor.name + '::backgroundColor function.';
    }

    public cursor(value: StyleAttribute): this;
    public cursor(value: string): this;
    public cursor(...args: any[]): this {
        if (args.length === 0 || args[0] == null) {
            this.Appearance.Cursor = '';
        } else if (args.length === 1 && is.string(args[0])) {
            const image = args[0];
            this.Appearance.Cursor = image;
        } else if (args.length === 1 && typeof args[0] === 'object') {
            const styleAttribute: StyleAttribute = args[0];
            if (styleAttribute.default != null) {
                this.Appearance.Cursor = styleAttribute.default as any;
            }
            if (styleAttribute.hover != null) {
                this.HoverAppearance.Cursor = styleAttribute.hover as any;
            }
            if (styleAttribute.active != null) {
                this.ActiveAppearance.Cursor = styleAttribute.active as any;
            }
            if (styleAttribute.disabled != null) {
                this.DisabledAppearance.Cursor = styleAttribute.disabled as any;
            }

            if (styleAttribute.focus != null) {
                this.FocusAppearance.Cursor = styleAttribute.focus as any;
            }

            if (styleAttribute.before != null) {
                this.BeforeAppearance.Cursor = styleAttribute.before as any;
            }

            if (styleAttribute.after != null) {
                this.AfterAppearance.Cursor = styleAttribute.after as any;
            }
        }
        return this;
        //throw 'Argument Exception in ' + this.constructor.name + '::backgroundColor function.';
    }


    public alignItems(value: string) {
        this.Appearance.AlignItems = value;
        return this;
    }
    public alignContent(value: string) {
        this.Appearance.AlignContent = value;
        return this;
    }
    public justifyContent(value: string) {
        this.Appearance.JustifyContent = value;
        return this;
    }

    public cornerRadius(): this;
    public cornerRadius(value: StyleAttribute): this;
    public cornerRadius(value: CornerRadiusTypes): this;
    public cornerRadius(value: string): this;
    public cornerRadius(value: int): this;
    public cornerRadius(...args: any[]): this {
        if (args.length === 0) {
            this.Appearance.BorderRadius = CornerRadiusTypes.Rounded;;
            return this;
        } else if (args.length === 1 && is.string(args[0])) {
            const value: string = args[0];
            this.Appearance.BorderRadius = value;
            return this;
        } else if (args.length === 1 && is.number(args[0])) {
            const value: int = args[0];
            this.Appearance.BorderRadius = `${value}px`;
            return this;
        } else if (args.length === 1 && typeof args[0] === 'object') {
            const styleAttribute: StyleAttribute = args[0];
            if (styleAttribute.default != null) {
                this.Appearance.BorderRadius = styleAttribute.default instanceof ColorClass ? styleAttribute.default.color : styleAttribute.default;
            }
            if (styleAttribute.hover != null) {
                this.HoverAppearance.BorderRadius = styleAttribute.hover instanceof ColorClass ? styleAttribute.hover.color : styleAttribute.hover;
            }
            if (styleAttribute.active != null) {
                this.ActiveAppearance.BorderRadius = styleAttribute.active instanceof ColorClass ? styleAttribute.active.color : styleAttribute.active;
            }
            if (styleAttribute.disabled != null) {
                this.DisabledAppearance.BorderRadius = styleAttribute.disabled instanceof ColorClass ? styleAttribute.disabled.color : styleAttribute.disabled;
            }
            if (styleAttribute.focus != null) {
                this.FocusAppearance.BorderRadius = styleAttribute.focus instanceof ColorClass ? styleAttribute.focus.color : styleAttribute.focus;
            }
            if (styleAttribute.after != null) {
                this.AfterAppearance.BorderRadius = styleAttribute.after instanceof ColorClass ? styleAttribute.after.color : styleAttribute.after;
            }
            return this;
        }
        throw 'ArgumentOutOfRange Exception in ' + this.constructor.name + '::cornerRadius function.';
    }

    public pointerEvents(): this;
    public pointerEvents(value: StyleAttribute): this;
    public pointerEvents(value: string): this;
    public pointerEvents(...args: any[]): this {
        if (args.length === 0) {
            this.Appearance.PointerEvents = 'none';;
            return this;
        } else if (args.length === 1 && is.string(args[0])) {
            const value: string = args[0];
            this.Appearance.PointerEvents = value;
            return this;
        } else if (args.length === 1 && typeof args[0] === 'object') {
            const styleAttribute: StyleAttribute = args[0];
            if (styleAttribute.default != null) {
                this.Appearance.PointerEvents = styleAttribute.default instanceof ColorClass ? styleAttribute.default.color : styleAttribute.default;
            }
            if (styleAttribute.hover != null) {
                this.HoverAppearance.PointerEvents = styleAttribute.hover instanceof ColorClass ? styleAttribute.hover.color : styleAttribute.hover;
            }
            if (styleAttribute.active != null) {
                this.ActiveAppearance.PointerEvents = styleAttribute.active instanceof ColorClass ? styleAttribute.active.color : styleAttribute.active;
            }
            if (styleAttribute.disabled != null) {
                this.DisabledAppearance.PointerEvents = styleAttribute.disabled instanceof ColorClass ? styleAttribute.disabled.color : styleAttribute.disabled;
            }
            if (styleAttribute.focus != null) {
                this.FocusAppearance.PointerEvents = styleAttribute.focus instanceof ColorClass ? styleAttribute.focus.color : styleAttribute.focus;
            }
            if (styleAttribute.after != null) {
                this.AfterAppearance.PointerEvents = styleAttribute.after instanceof ColorClass ? styleAttribute.after.color : styleAttribute.after;
            }
            return this;
        }
        throw 'ArgumentOutOfRange Exception in ' + this.constructor.name + '::PointerEvents function.';
    }


    public outline(value: StyleAttribute): this;
    public outline(value: string): this;
    public outline(...args: any[]): this {
        if (args.length === 1 && is.string(args[0])) {
            const value = args[0];
            this.Appearance.Outline = value;
            return this;
        } else if (args.length === 1 && typeof args[0] === 'object') {
            const styleAttribute: StyleAttribute = args[0];
            if (styleAttribute.default != null) {
                this.Appearance.Outline = styleAttribute.default instanceof ColorClass ? styleAttribute.default.color : styleAttribute.default;
            }
            if (styleAttribute.hover != null) {
                this.HoverAppearance.Outline = styleAttribute.hover instanceof ColorClass ? styleAttribute.hover.color : styleAttribute.hover;
            }
            if (styleAttribute.active != null) {
                this.ActiveAppearance.Outline = styleAttribute.active instanceof ColorClass ? styleAttribute.active.color : styleAttribute.active;
            }
            if (styleAttribute.disabled != null) {
                this.DisabledAppearance.Outline = styleAttribute.disabled instanceof ColorClass ? styleAttribute.disabled.color : styleAttribute.disabled;
            }

            if (styleAttribute.focus != null) {
                this.FocusAppearance.Outline = styleAttribute.focus instanceof ColorClass ? styleAttribute.focus.color : styleAttribute.focus;
            }
            return this;
        }
        throw 'Argument Exception in ' + this.constructor.name + '::border function.';
    }

    public inset(value: StyleAttribute): this;
    public inset(value: string): this;
    public inset(...args: any[]): this {
        if (args.length === 1 && is.string(args[0])) {
            const value = args[0];
            this.Appearance.Inset = value;
            return this;
        } else if (args.length === 1 && typeof args[0] === 'object') {
            const styleAttribute: StyleAttribute = args[0];
            if (styleAttribute.default != null) {
                this.Appearance.Inset = styleAttribute.default instanceof ColorClass ? styleAttribute.default.color : styleAttribute.default;
            }
            if (styleAttribute.hover != null) {
                this.HoverAppearance.Inset = styleAttribute.hover instanceof ColorClass ? styleAttribute.hover.color : styleAttribute.hover;
            }
            if (styleAttribute.active != null) {
                this.ActiveAppearance.Inset = styleAttribute.active instanceof ColorClass ? styleAttribute.active.color : styleAttribute.active;
            }
            if (styleAttribute.disabled != null) {
                this.DisabledAppearance.Inset = styleAttribute.disabled instanceof ColorClass ? styleAttribute.disabled.color : styleAttribute.disabled;
            }

            if (styleAttribute.focus != null) {
                this.FocusAppearance.Inset = styleAttribute.focus instanceof ColorClass ? styleAttribute.focus.color : styleAttribute.focus;
            }
            if (styleAttribute.before != null) {
                this.BeforeAppearance.Inset = styleAttribute.before instanceof ColorClass ? styleAttribute.before.color : styleAttribute.before;
            }

            if (styleAttribute.after != null) {
                this.AfterAppearance.Inset = styleAttribute.after as any;
            }
            return this;
        }
        throw 'Argument Exception in ' + this.constructor.name + '::border function.';
    }

    public border(value: StyleAttribute): this;
    public border(value: string): this;
    public border(...args: any[]): this {
        if (args.length === 1 && is.string(args[0])) {
            const value = args[0];
            this.Appearance.Border = value;
            return this;
        } else if (args.length === 1 && typeof args[0] === 'object') {
            const styleAttribute: StyleAttribute = args[0];
            if (styleAttribute.default != null) {
                this.Appearance.Border = styleAttribute.default instanceof ColorClass ? styleAttribute.default.color : styleAttribute.default;
            }
            if (styleAttribute.hover != null) {
                this.HoverAppearance.Border = styleAttribute.hover instanceof ColorClass ? styleAttribute.hover.color : styleAttribute.hover;
            }
            if (styleAttribute.active != null) {
                this.ActiveAppearance.Border = styleAttribute.active instanceof ColorClass ? styleAttribute.active.color : styleAttribute.active;
            }
            if (styleAttribute.disabled != null) {
                this.DisabledAppearance.Border = styleAttribute.disabled instanceof ColorClass ? styleAttribute.disabled.color : styleAttribute.disabled;
            }

            if (styleAttribute.focus != null) {
                this.FocusAppearance.Border = styleAttribute.focus instanceof ColorClass ? styleAttribute.focus.color : styleAttribute.focus;
            }
            if (styleAttribute.before != null) {
                this.BeforeAppearance.Border = styleAttribute.before instanceof ColorClass ? styleAttribute.before.color : styleAttribute.before;
            }

            if (styleAttribute.after != null) {
                this.AfterAppearance.Border = styleAttribute.after as any;
            }
            return this;
        }
        throw 'Argument Exception in ' + this.constructor.name + '::border function.';
    }

    public borderLeft(value: StyleAttribute): this;
    public borderLeft(value: string): this;
    public borderLeft(...args: any[]): this {
        if (args.length === 1 && is.string(args[0])) {
            const value = args[0];
            this.Appearance.BorderLeft = value;
            return this;
        } else if (args.length === 1 && typeof args[0] === 'object') {
            const styleAttribute: StyleAttribute = args[0];
            if (styleAttribute.default != null) {
                this.Appearance.BorderLeft = styleAttribute.default instanceof ColorClass ? styleAttribute.default.color : styleAttribute.default;
            }
            if (styleAttribute.hover != null) {
                this.HoverAppearance.BorderLeft = styleAttribute.hover instanceof ColorClass ? styleAttribute.hover.color : styleAttribute.hover;
            }
            if (styleAttribute.active != null) {
                this.ActiveAppearance.BorderLeft = styleAttribute.active instanceof ColorClass ? styleAttribute.active.color : styleAttribute.active;
            }

            if (styleAttribute.disabled != null) {
                this.DisabledAppearance.BorderLeft = styleAttribute.disabled instanceof ColorClass ? styleAttribute.disabled.color : styleAttribute.disabled;
            }

            if (styleAttribute.focus != null) {
                this.FocusAppearance.BorderLeft = styleAttribute.focus instanceof ColorClass ? styleAttribute.focus.color : styleAttribute.focus;
            }
            if (styleAttribute.before != null) {
                this.BeforeAppearance.BorderLeft = styleAttribute.before instanceof ColorClass ? styleAttribute.before.color : styleAttribute.before;
            }

            if (styleAttribute.after != null) {
                this.AfterAppearance.BorderLeft = styleAttribute.after as any;
            }

            return this;
        }
        throw 'Argument Exception in ' + this.constructor.name + '::border function.';
    }

    public borderRight(value: StyleAttribute): this;
    public borderRight(value: string): this;
    public borderRight(...args: any[]): this {
        if (args.length === 1 && is.string(args[0])) {
            const value = args[0];
            this.Appearance.BorderRight = value;
            return this;
        } else if (args.length === 1 && typeof args[0] === 'object') {
            const styleAttribute: StyleAttribute = args[0];
            if (styleAttribute.default != null) {
                this.Appearance.BorderRight = styleAttribute.default instanceof ColorClass ? styleAttribute.default.color : styleAttribute.default;
            }
            if (styleAttribute.hover != null) {
                this.HoverAppearance.BorderRight = styleAttribute.hover instanceof ColorClass ? styleAttribute.hover.color : styleAttribute.hover;
            }
            if (styleAttribute.active != null) {
                this.ActiveAppearance.BorderRight = styleAttribute.active instanceof ColorClass ? styleAttribute.active.color : styleAttribute.active;
            }

            if (styleAttribute.disabled != null) {
                this.DisabledAppearance.BorderRight = styleAttribute.active instanceof ColorClass ? styleAttribute.active.color : styleAttribute.active;
            }

            if (styleAttribute.focus != null) {
                this.FocusAppearance.BorderRight = styleAttribute.focus instanceof ColorClass ? styleAttribute.focus.color : styleAttribute.focus;
            }
            if (styleAttribute.before != null) {
                this.BeforeAppearance.BorderRight = styleAttribute.before instanceof ColorClass ? styleAttribute.before.color : styleAttribute.before;
            }

            if (styleAttribute.after != null) {
                this.AfterAppearance.BorderRight = styleAttribute.after as any;
            }
            return this;
        }
        throw 'Argument Exception in ' + this.constructor.name + '::border function.';
    }

    public borderTop(value: StyleAttribute): this;
    public borderTop(value: string): this;
    public borderTop(...args: any[]): this {
        if (args.length === 1 && is.string(args[0])) {
            const value = args[0];
            this.Appearance.BorderTop = value;
            return this;
        } else if (args.length === 1 && typeof args[0] === 'object') {
            const styleAttribute: StyleAttribute = args[0];
            if (styleAttribute.default != null) {
                this.Appearance.BorderTop = styleAttribute.default instanceof ColorClass ? styleAttribute.default.color : styleAttribute.default;
            }
            if (styleAttribute.hover != null) {
                this.HoverAppearance.BorderTop = styleAttribute.hover instanceof ColorClass ? styleAttribute.hover.color : styleAttribute.hover;
            }
            if (styleAttribute.active != null) {
                this.ActiveAppearance.BorderTop = styleAttribute.active instanceof ColorClass ? styleAttribute.active.color : styleAttribute.active;
            }
            if (styleAttribute.disabled != null) {
                this.DisabledAppearance.BorderTop = styleAttribute.disabled instanceof ColorClass ? styleAttribute.disabled.color : styleAttribute.disabled;
            }
            if (styleAttribute.focus != null) {
                this.FocusAppearance.BorderTop = styleAttribute.focus instanceof ColorClass ? styleAttribute.focus.color : styleAttribute.focus;
            }
            if (styleAttribute.before != null) {
                this.BeforeAppearance.BorderTop = styleAttribute.before instanceof ColorClass ? styleAttribute.before.color : styleAttribute.before;
            }

            if (styleAttribute.after != null) {
                this.AfterAppearance.BorderTop = styleAttribute.after as any;
            }
            return this;
        }
        throw 'Argument Exception in ' + this.constructor.name + '::border function.';
    }

    public borderBottom(value: StyleAttribute): this;
    public borderBottom(value: string): this;
    public borderBottom(...args: any[]): this {
        if (args.length === 1 && is.string(args[0])) {
            const value = args[0];
            this.Appearance.BorderBottom = value;
            return this;
        } else if (args.length === 1 && typeof args[0] === 'object') {
            const styleAttribute: StyleAttribute = args[0];
            if (styleAttribute.default != null) {
                this.Appearance.BorderBottom = styleAttribute.default instanceof ColorClass ? styleAttribute.default.color : styleAttribute.default;
            }
            if (styleAttribute.hover != null) {
                this.HoverAppearance.BorderBottom = styleAttribute.hover instanceof ColorClass ? styleAttribute.hover.color : styleAttribute.hover;
            }
            if (styleAttribute.active != null) {
                this.ActiveAppearance.BorderBottom = styleAttribute.active instanceof ColorClass ? styleAttribute.active.color : styleAttribute.active;
            }

            if (styleAttribute.disabled != null) {
                this.DisabledAppearance.BorderBottom = styleAttribute.disabled instanceof ColorClass ? styleAttribute.disabled.color : styleAttribute.disabled;
            }

            if (styleAttribute.focus != null) {
                this.FocusAppearance.BorderBottom = styleAttribute.focus instanceof ColorClass ? styleAttribute.focus.color : styleAttribute.focus;
            }
            if (styleAttribute.before != null) {
                this.BeforeAppearance.BorderBottom = styleAttribute.before instanceof ColorClass ? styleAttribute.before.color : styleAttribute.before;
            }

            if (styleAttribute.after != null) {
                this.AfterAppearance.BorderBottom = styleAttribute.after as any;
            }
            return this;
        }
        throw 'Argument Exception in ' + this.constructor.name + '::border function.';
    }

    public wrap(value: string) {
        this.Appearance.FlexWrap = value;
        return this;
    }
    public basis(value: string) {
        this.Appearance.FlexBasis = value;
        return this;
    }

    public margin(): this;
    public margin(value: string): this;
    public margin(value: int): this;
    public margin(...args: any[]): this {
        if (args.length === 0) {
            this.Appearance.Margin = DefaultMarginValue;
            return this;
        } else if (args.length === 1 && is.string(args[0])) {
            const value: string = args[0];
            this.Appearance.Margin = value;
            return this;
        } else if (args.length === 1 && is.number(args[0])) {
            const value: int = args[0];
            this.Appearance.Margin = `${value}px`;
            return this;
        }
        throw 'ArgumentOutOfRange Exception in ' + this.constructor.name + '::margin method.';
    }

    public marginVertical(): this;
    public marginVertical(value: string): this;
    public marginVertical(value: int): this;
    public marginVertical(...args: any[]): this {
        if (args.length === 0) {
            this.Appearance.MarginTop = DefaultMarginValue;
            this.Appearance.MarginBottom = DefaultMarginValue;
            return this;
        } else if (args.length === 1 && is.string(args[0])) {
            const value: string = args[0];
            this.Appearance.MarginTop = value;
            this.Appearance.MarginBottom = value;
            return this;
        } else if (args.length === 1 && is.number(args[0])) {
            const value: int = args[0];
            this.Appearance.MarginTop = `${value}px`;
            this.Appearance.MarginBottom = `${value}px`;
            return this;
        }
        throw 'ArgumentOutOfRange Exception in ' + this.constructor.name + '::marginVertical method.';
    }

    public marginHorizontal(): this;
    public marginHorizontal(value: string): this;
    public marginHorizontal(value: int): this;
    public marginHorizontal(...args: any[]): this {
        if (args.length === 0) {
            this.Appearance.MarginLeft = DefaultMarginValue;
            this.Appearance.MarginRight = DefaultMarginValue;
            return this;
        } else if (args.length === 1 && is.string(args[0])) {
            const value: string = args[0];
            this.Appearance.MarginLeft = value;
            this.Appearance.MarginRight = value;
            return this;
        } else if (args.length === 1 && is.number(args[0])) {
            const value: int = args[0];
            this.Appearance.MarginLeft = `${value}px`;
            this.Appearance.MarginRight = `${value}px`;
            return this;
        }
        throw 'ArgumentOutOfRange Exception in ' + this.constructor.name + '::marginHorizontal method.';
    }


    public marginLeft(): this;
    public marginLeft(value: int): this;
    public marginLeft(value: string): this;
    public marginLeft(value: StyleAttribute): this;
    public marginLeft(...args: any[]): this {
        if (args.length === 0) {
            this.Appearance.MarginLeft = 'inherit';
            return this;
        } else if (args.length === 1 && is.number(args[0])) {
            const value = args[0];
            this.Appearance.MarginLeft = `${value}px`;

            return this;
        } else if (args.length === 1 && is.string(args[0])) {
            const value: string = args[0];
            this.Appearance.MarginLeft = value;
            return this;
        } else if (args.length === 1 && typeof args[0] === 'object') {
            const styleAttribute: StyleAttribute = args[0];
            if (styleAttribute.default != null) {
                this.Appearance.MarginLeft = styleAttribute.default as any;
            }
            if (styleAttribute.hover != null) {
                this.HoverAppearance.MarginLeft = styleAttribute.hover as any;
            }
            if (styleAttribute.active != null) {
                this.ActiveAppearance.MarginLeft = styleAttribute.active as any;
            }
            if (styleAttribute.disabled != null) {
                this.DisabledAppearance.MarginLeft = styleAttribute.disabled as any;
            }

            if (styleAttribute.focus != null) {
                this.FocusAppearance.MarginLeft = styleAttribute.focus as any;
            }

            if (styleAttribute.before != null) {
                this.BeforeAppearance.MarginLeft = styleAttribute.before as any;
            }
            if (styleAttribute.after != null) {
                this.AfterAppearance.MarginLeft = styleAttribute.after as any;
            }
            return this;
        }

        throw `ArgumentOutOfRange Exception in UIView::marginLeft method. Argument count: ${args.length}`;
    }


    public marginRight(): this;
    public marginRight(value: int): this;
    public marginRight(value: string): this;
    public marginRight(value: StyleAttribute): this;
    public marginRight(...args: any[]): this {
        if (args.length === 0) {
            this.Appearance.MarginRight = 'inherit';
            return this;
        } else if (args.length === 1 && is.number(args[0])) {
            const value = args[0];
            this.Appearance.MarginRight = `${value}px`;

            return this;
        } else if (args.length === 1 && is.string(args[0])) {
            const value: string = args[0];
            this.Appearance.MarginRight = value;
            return this;
        } else if (args.length === 1 && typeof args[0] === 'object') {
            const styleAttribute: StyleAttribute = args[0];
            if (styleAttribute.default != null) {
                this.Appearance.MarginRight = styleAttribute.default as any;
            }
            if (styleAttribute.hover != null) {
                this.HoverAppearance.MarginRight = styleAttribute.hover as any;
            }
            if (styleAttribute.active != null) {
                this.ActiveAppearance.MarginRight = styleAttribute.active as any;
            }
            if (styleAttribute.disabled != null) {
                this.DisabledAppearance.MarginRight = styleAttribute.disabled as any;
            }

            if (styleAttribute.focus != null) {
                this.FocusAppearance.MarginRight = styleAttribute.focus as any;
            }

            if (styleAttribute.before != null) {
                this.BeforeAppearance.MarginRight = styleAttribute.before as any;
            }
            if (styleAttribute.after != null) {
                this.AfterAppearance.MarginRight = styleAttribute.after as any;
            }
            return this;
        }

        throw `ArgumentOutOfRange Exception in UIView::marginRight method. Argument count: ${args.length}`;
    }


    public marginTop(): this;
    public marginTop(value: int): this;
    public marginTop(value: string): this;
    public marginTop(value: StyleAttribute): this;
    public marginTop(...args: any[]): this {
        if (args.length === 0) {
            this.Appearance.MarginTop = 'inherit';
            return this;
        } else if (args.length === 1 && is.number(args[0])) {
            const value = args[0];
            this.Appearance.MarginTop = `${value}px`;

            return this;
        } else if (args.length === 1 && is.string(args[0])) {
            const value: string = args[0];
            this.Appearance.MarginTop = value;
            return this;
        } else if (args.length === 1 && typeof args[0] === 'object') {
            const styleAttribute: StyleAttribute = args[0];
            if (styleAttribute.default != null) {
                this.Appearance.MarginTop = styleAttribute.default as any;
            }
            if (styleAttribute.hover != null) {
                this.HoverAppearance.MarginTop = styleAttribute.hover as any;
            }
            if (styleAttribute.active != null) {
                this.ActiveAppearance.MarginTop = styleAttribute.active as any;
            }
            if (styleAttribute.disabled != null) {
                this.DisabledAppearance.MarginTop = styleAttribute.disabled as any;
            }

            if (styleAttribute.focus != null) {
                this.FocusAppearance.MarginTop = styleAttribute.focus as any;
            }

            if (styleAttribute.before != null) {
                this.BeforeAppearance.MarginTop = styleAttribute.before as any;
            }
            if (styleAttribute.after != null) {
                this.AfterAppearance.MarginTop = styleAttribute.after as any;
            }
            return this;
        }

        throw `ArgumentOutOfRange Exception in UIView::marginLeft method. Argument count: ${args.length}`;
    }



    public marginBottom(): this;
    public marginBottom(value: int): this;
    public marginBottom(value: string): this;
    public marginBottom(value: StyleAttribute): this;
    public marginBottom(...args: any[]): this {
        if (args.length === 0) {
            this.Appearance.MarginBottom = 'inherit';
            return this;
        } else if (args.length === 1 && is.number(args[0])) {
            const value = args[0];
            this.Appearance.MarginBottom = `${value}px`;

            return this;
        } else if (args.length === 1 && is.string(args[0])) {
            const value: string = args[0];
            this.Appearance.MarginBottom = value;
            return this;
        } else if (args.length === 1 && typeof args[0] === 'object') {
            const styleAttribute: StyleAttribute = args[0];
            if (styleAttribute.default != null) {
                this.Appearance.MarginBottom = styleAttribute.default as any;
            }
            if (styleAttribute.hover != null) {
                this.HoverAppearance.MarginBottom = styleAttribute.hover as any;
            }
            if (styleAttribute.active != null) {
                this.ActiveAppearance.MarginBottom = styleAttribute.active as any;
            }
            if (styleAttribute.disabled != null) {
                this.DisabledAppearance.MarginBottom = styleAttribute.disabled as any;
            }

            if (styleAttribute.focus != null) {
                this.FocusAppearance.MarginBottom = styleAttribute.focus as any;
            }

            if (styleAttribute.before != null) {
                this.BeforeAppearance.MarginBottom = styleAttribute.before as any;
            }
            if (styleAttribute.after != null) {
                this.AfterAppearance.MarginBottom = styleAttribute.after as any;
            }
            return this;
        }

        throw `ArgumentOutOfRange Exception in UIView::marginBottom method. Argument count: ${args.length}`;
    }

    public padding(): this;
    public padding(value: string): this;
    public padding(type: string, value: string): this;
    public padding(value: int): this;
    public padding(type: string, value: int): this;
    public padding(...args: any[]): this {
        if (args.length === 0) {
            this.Appearance.Padding = DefaultPaddingValue;
        } else if (args.length === 1 && is.string(args[0])) {
            const value: string = args[0];
            this.Appearance.Padding = value;
        } else if (args.length === 1 && is.number(args[0])) {
            const value: int = args[0];
            this.Appearance.Padding = `${value}px`;
        } else if (args.length === 2 && is.string(args[0]) && is.string(args[1])) {
            const type: string = args[0];
            const value: string = args[1];
            switch (type) {
                case cTop:
                    this.Appearance.PaddingTop = value;
                    break;
                case cLeft:
                    this.Appearance.PaddingLeft = value;
                    break;
                case cRight:
                    this.Appearance.PaddingRight = value;
                    break;
                case cBottom:
                    this.Appearance.PaddingBottom = value;
                    break;
                case cVertical:
                    this.Appearance.PaddingTop = this.Appearance.PaddingBottom = value;
                    break;
                case cHorizontal:
                    this.Appearance.PaddingLeft = this.Appearance.PaddingRight = value;
                    break;
            }
        } else if (args.length === 2 && is.string(args[0]) && is.int(args[1])) {
            const type: string = args[0];
            const value: int = args[1];
            switch (type) {
                case cTop:
                    this.Appearance.PaddingTop = `${value}px`;
                    break;
                case cLeft:
                    this.Appearance.PaddingLeft = `${value}px`;
                    break;
                case cRight:
                    this.Appearance.PaddingRight = `${value}px`;
                    break;
                case cBottom:
                    this.Appearance.PaddingBottom = `${value}px`;
                    break;
                case cVertical:
                    this.Appearance.PaddingTop = this.Appearance.PaddingBottom = `${value}px`;
                    break;
                case cHorizontal:
                    this.Appearance.PaddingLeft = this.Appearance.PaddingRight = `${value}px`;
                    break;
            }
        }

        //this.OnAppearanceChanged('Padding');
        return this;
    }

    public paddingLeft(value: string) {
        this.Appearance.PaddingLeft = value;
        //this.OnAppearanceChanged('PaddingLeft');
        return this;
    }
    public paddingRight(value: string) {
        this.Appearance.PaddingRight = value;
        return this;
    }
    public paddingTop(value: string) {
        this.Appearance.PaddingTop = value;
        return this;
    }
    public paddingBottom(value: string) {
        this.Appearance.PaddingBottom = value;
        return this;
    }

    public overflow(value: string) {
        this.Appearance.Overflow = value;
        return this;
    }

    public overflowX(value: string) {
        this.Appearance.OverflowX = value;
        return this;
    }

    public overflowY(value: string) {
        this.Appearance.OverflowY = value;
        return this;
    }

    public float(value: string) {
        this.Appearance.Float = value;
        return this;
    }

    public shadow(value: StyleAttribute): this;
    public shadow(value: ShadowTypes): this;
    public shadow(value: string): this;
    public shadow(...args: any[]): this {
        if (args.length === 1 && is.string(args[0])) {
            const value: string = args[0];
            this.Appearance.BoxShadow = value;
            return this;
        } else if (args.length === 1 && typeof args[0] === 'object') {
            const styleAttribute: StyleAttribute = args[0];
            if (styleAttribute.default != null) {
                this.Appearance.BoxShadow = styleAttribute.default instanceof ColorClass ? styleAttribute.default.color : styleAttribute.default;
            }
            if (styleAttribute.hover != null) {
                this.HoverAppearance.BoxShadow = styleAttribute.hover instanceof ColorClass ? styleAttribute.hover.color : styleAttribute.hover;
            }
            if (styleAttribute.active != null) {
                this.ActiveAppearance.BoxShadow = styleAttribute.active instanceof ColorClass ? styleAttribute.active.color : styleAttribute.active;
            }
            if (styleAttribute.disabled != null) {
                this.DisabledAppearance.BoxShadow = styleAttribute.disabled instanceof ColorClass ? styleAttribute.disabled.color : styleAttribute.disabled;
            }
            if (styleAttribute.focus != null) {
                this.FocusAppearance.BoxShadow = styleAttribute.focus instanceof ColorClass ? styleAttribute.focus.color : styleAttribute.focus;
            }
            if (styleAttribute.after != null) {
                this.AfterAppearance.BoxShadow = styleAttribute.after instanceof ColorClass ? styleAttribute.after.color : styleAttribute.after;
            }
            return this;
        }
        throw 'ArgumentOutOfRange Exception in ' + this.constructor.name + '::shadow method.';
    }

    public transition(value: string): this {
        this.Appearance.Transition = value;
        return this;
    }

    public opacity(): this;
    public opacity(value: int): this;
    public opacity(value: string): this;
    public opacity(value: StyleAttribute): this;
    public opacity(...args: any[]): this {
        if (args.length === 0) {
            this.Appearance.Opacity = '';
            return this;
        } else if (args.length === 1 && is.number(args[0])) {
            const value = args[0];
            this.Appearance.Opacity = `${value}`;
            return this;
        } else if (args.length === 1 && is.string(args[0])) {
            const value: string = args[0];
            this.Appearance.Opacity = value;
            return this;
        } else if (args.length === 1 && typeof args[0] === 'object') {
            const styleAttribute: StyleAttribute = args[0];
            if (styleAttribute.default != null) {
                this.Appearance.Opacity = styleAttribute.default as any;
            }
            if (styleAttribute.hover != null) {
                this.HoverAppearance.Opacity = styleAttribute.hover as any;
            }
            if (styleAttribute.active != null) {
                this.ActiveAppearance.Opacity = styleAttribute.active as any;
            }
            if (styleAttribute.disabled != null) {
                this.DisabledAppearance.Opacity = styleAttribute.disabled as any;
            }

            if (styleAttribute.focus != null) {
                this.FocusAppearance.Opacity = styleAttribute.focus as any;
            }

            if (styleAttribute.before != null) {
                this.BeforeAppearance.Opacity = styleAttribute.before as any;
            }

            if (styleAttribute.after != null) {
                this.AfterAppearance.Opacity = styleAttribute.after as any;
            }
            return this;
        }

        throw `ArgumentOutOfRange Exception in UIView::width method. Argument count: ${args.length}`;
    }

    public display(value: StyleAttribute): this;
    public display(value: string): this;
    public display(...args: any[]): this {
        if (args.length === 0 || args[0] == null) {
            this.Appearance.Display = 'flex';
        } else if (args.length === 1 && is.string(args[0])) {
            const image = args[0];
            this.Appearance.Display = image;
        } else if (args.length === 1 && typeof args[0] === 'object') {
            const styleAttribute: StyleAttribute = args[0];
            if (styleAttribute.default != null) {
                this.Appearance.Display = styleAttribute.default as any;
            }
            if (styleAttribute.hover != null) {
                this.HoverAppearance.Display = styleAttribute.hover as any;
            }
            if (styleAttribute.active != null) {
                this.ActiveAppearance.Display = styleAttribute.active as any;
            }
            if (styleAttribute.disabled != null) {
                this.DisabledAppearance.Display = styleAttribute.disabled as any;
            }


            if (styleAttribute.focus != null) {
                this.FocusAppearance.Display = styleAttribute.focus as any;
            }

            if (styleAttribute.before != null) {
                this.BeforeAppearance.Display = styleAttribute.before as any;
            }

            if (styleAttribute.after != null) {
                this.AfterAppearance.Display = styleAttribute.after as any;
            }
        }
        return this;
        //throw 'Argument Exception in ' + this.constructor.name + '::backgroundColor function.';
    }

    //--------------------------------

    public kerning(value: string): this {
        this.Appearance.LetterSpacing = value;
        return this;
    }

    public wordBreak(value: 'normal' | 'break-all' | 'keep-all' | 'break-word'): this {
        this.Appearance.WordBreak = value;
        return this;
    }

    public wordWrap(value: 'normal' | 'break-word'): this {
        this.Appearance.WordWrap = value;
        return this;
    }

    alignment(value: AlignmentType) {
        if (value == null) {
            return this;
        }

        if (value === cTopLeading) {
            this.Appearance.JustifyContent = 'start';
            this.Appearance.AlignContent = 'start';

            this.Appearance.JustifyItems = 'start';
            this.Appearance.AlignItems = 'start';

        } else if (value === cTop) {
            this.Appearance.JustifyContent = 'start';
            this.Appearance.AlignContent = 'center';

            this.Appearance.JustifyItems = 'start';
            this.Appearance.AlignItems = 'center';
        } else if (value === cTopTrailing) {
            this.Appearance.JustifyContent = 'end';
            this.Appearance.AlignContent = 'start';

            this.Appearance.AlignItems = 'end';
            this.Appearance.JustifyItems = 'start';


        } else if (value === cLeading) {
            this.Appearance.JustifyContent = 'center';
            this.Appearance.AlignContent = 'center';

            this.Appearance.AlignItems = 'start';
            this.Appearance.JustifyItems = 'start';
        } else if (value === cCenter) {
            this.Appearance.JustifyContent = 'center';
            this.Appearance.AlignContent = 'center';

            this.Appearance.AlignItems = 'center';
            this.Appearance.JustifyItems = 'center';

        } else if (value === cTrailing) {
            this.Appearance.JustifyContent = 'end';
            this.Appearance.AlignContent = 'center';

            this.Appearance.AlignItems = 'end';
            this.Appearance.JustifyItems = 'center';
        } else if (value === cBottomLeading) {
            this.Appearance.JustifyContent = 'start';
            this.Appearance.AlignContent = 'end';

            this.Appearance.AlignItems = 'start';
            this.Appearance.JustifyItems = 'end';
        } else if (value === cBottom) {
            this.Appearance.JustifyContent = 'center';
            this.Appearance.AlignContent = 'end';

            this.Appearance.AlignItems = 'center';
            this.Appearance.JustifyItems = 'end';
        } else if (value === cBottomTrailing) {
            this.Appearance.JustifyContent = 'end';
            this.Appearance.AlignContent = 'end';

            this.Appearance.AlignItems = 'end';
            this.Appearance.JustifyItems = 'end';
        }
        return this;
    }


    public zIndex(value: StyleAttribute): this;
    public zIndex(value: int): this;
    public zIndex(...args: any[]): this {
        if (args.length === 1 && (is.string(args[0]) || is.int(args[0]))) {
            const value = args[0];
            this.Appearance.ZIndex = value.toString();
            return this;
        } else if (args.length === 1 && typeof args[0] === 'object') {
            const styleAttribute: StyleAttribute = args[0];
            if (styleAttribute.default != null) {
                this.Appearance.ZIndex = styleAttribute.default as string;
            }
            if (styleAttribute.hover != null) {
                this.HoverAppearance.ZIndex = styleAttribute.hover as string;
            }
            if (styleAttribute.active != null) {
                this.ActiveAppearance.ZIndex = styleAttribute.active as string;
            }
            if (styleAttribute.disabled != null) {
                this.DisabledAppearance.ZIndex = styleAttribute.disabled as string;
            }

            if (styleAttribute.focus != null) {
                this.FocusAppearance.ZIndex = styleAttribute.focus as string;
            }
            if (styleAttribute.before != null) {
                this.BeforeAppearance.ZIndex = styleAttribute.before as string;
            }

            if (styleAttribute.after != null) {
                this.AfterAppearance.ZIndex = styleAttribute.after as any;
            }
            return this;
        }
        throw 'Argument Exception in ' + this.constructor.name + '::zIndex function.';
    }

    public variable(name: string, value: StyleAttribute): this {
        if (value.default != null) {
            this.Appearance.StylePropertyBag[name] = value.default;
            this.Appearance.isModified = true;
            this.Appearance.IsEmpty = false;
        }
        if (value.hover != null) {
            this.HoverAppearance.StylePropertyBag[name] = value.hover;
            this.HoverAppearance.isModified = true;
            this.HoverAppearance.IsEmpty = false;
        }
        if (value.active != null) {
            this.ActiveAppearance.StylePropertyBag[name] = value.active;
            this.ActiveAppearance.isModified = true;
            this.ActiveAppearance.IsEmpty = false;
        }
        if (value.disabled != null) {
            this.DisabledAppearance.StylePropertyBag[name] = value.disabled;
            this.DisabledAppearance.isModified = true;
            this.DisabledAppearance.IsEmpty = false;
        }
        if (value.focus != null) {
            this.FocusAppearance.StylePropertyBag[name] = value.focus;
            this.FocusAppearance.isModified = true;
            this.FocusAppearance.IsEmpty = false;
        }
        return this;
    }

    /** @internal */
    @ViewProperty() vp_Renderer: FunctionComponent<any>;;

    public renderer(value: FunctionComponent<any>) {
        this.vp_Renderer = value;
        return this;
    }

    // Animate Props

    @ViewProperty() renderAsAnimated: boolean;

    @ViewProperty() _initial: any;
    @ViewProperty() _animate: any;
    @ViewProperty() _transition: any;
    @ViewProperty() _whileHover: any;
    @ViewProperty() _whileTap: any;
    @ViewProperty() _whileDrag: any;
    @ViewProperty() _whileFocus: any;
    @ViewProperty() _whileInView: any;
    @ViewProperty() _exit: any;

    public initial(value: any): this {
        this._initial = value;
        this.renderAsAnimated = true;
        return this;
    }
    public animate(value: any): this {
        this._animate = value;
        this.renderAsAnimated = true;
        return this;
    }
    public __transition(value: any): this {
        this._transition = value;
        this.renderAsAnimated = true;
        return this;
    }

    public hover(value: any): this {
        this._whileHover = value;
        this.renderAsAnimated = true;
        return this;
    }

    public tap(value: any): this {
        this._whileHover = value;
        this.renderAsAnimated = true;
        return this;
    }
    public drag(value: any): this {
        this._whileDrag = value;
        this.renderAsAnimated = true;
        return this;
    }
    public focus(value: any): this {
        this._whileFocus = value;
        this.renderAsAnimated = true;
        return this;
    }



    //---------------

    public GetEventsObject(): Object {
        const events = {};

        events['onClick'] = is.function(this.vp_OnClick) ? (e) => {
            this.onClickInternal(e);
            this.vp_OnClick(e);
        } : void 0;

        events['onPointerDown'] = is.function(this.vp_OnPointerDown) ? (e) => {
            this.vp_OnPointerDown(e);
            //this.vp_OnClick(e);
        } : void 0;

        events['onMouseDown'] = is.function(this.vp_OnMouseDown) ? (e) => {
            this.onMouseDownInternal(e);
            this.vp_OnMouseDown(e);
        } : void 0;

        events['onScroll'] = is.function(this.vp_OnScroll) ? (e) => {
            this.onScrollInternal(e);
            this.vp_OnScroll(this.vp_Ref.current?.scrollTop)
        } : void 0;

        events['onBlur'] = is.function(this.vp_OnBlur) ? (e) => {
            this.onBlurInternal(e);
            this.vp_OnBlur(e);
        } : void 0;

        events['onFocusOut'] = is.function(this.vp_OnFocusOut) ? (e) => {
            this.onFocusOutInternal(e);
            this.vp_OnFocusOut(e);
        } : void 0;

        events['onDragStart'] = is.function(this.vp_OnDragStart) ? (e) => {
          //  this.onDragStartInternal(e);
            this.vp_OnDragStart(e);
        } : void 0;

        events['onDragEnd'] = is.function(this.vp_OnDragEnd) ? (e) => {
           // this.onDragStartInternal(e);
            this.vp_OnDragEnd(e);
        } : void 0;

        events['onDragOver'] = is.function(this.vp_OnDragOver) ? (e) => {
         //   this.onDragOverInternal(e);
            this.vp_OnDragOver(e);
        } : void 0;

        events['onDrop'] = is.function(this.vp_OnDrop) ? (e) => {
            this.onDropInternal(e);
            this.vp_OnDrop(e);
        } : void 0;

        events['onDragEnter'] = is.function(this.vp_OnDragEnter) ? (e) => {
           // this.onDragEnterInternal(e);
            this.vp_OnDragEnter(e);
        } : void 0;

        events['onDragLeave'] = is.function(this.vp_OnDragLeave) ? (e) => {
           // this.onDragLeaveInternal(e);
            this.vp_OnDragLeave(e);
        } : void 0;

        events['onKeyDown'] = is.function(this.vp_OnKeyDown) ? (e) => {
            //this.onClickInternal(e);
            this.vp_OnKeyDown(e);
        } : void 0;

        return events;
    }

    public GetClassName(): string {
        const className = css`
        ${this.Appearance.ToString()}
        ${this.HoverAppearance.IsEmpty ? '' : '&:hover { ' + this.HoverAppearance.ToString() + ' }'}
        ${this.ActiveAppearance.IsEmpty ? '' : '&:active { ' + this.ActiveAppearance.ToString() + ' }'}
        ${this.FocusAppearance.IsEmpty ? '' : '&:focus { ' + this.FocusAppearance.ToString() + ' }'}
    `;

        return className;
    }


    public render(): React.ReactNode {
        return null;
    }
}