import React, { createElement, Fragment } from "../../../../../preact/compat";
import { CGColor, CGPoint, CGRectangle, CGSize } from "@tuval/cg";
import { as, float, int, TString, StringBuilder, Guid, is } from '@tuval/core';
import { Brush, DashStyle, GraphicsPath, GraphicTypes, Pen, SolidBrush } from "@tuval/graphics";
import { Border, BorderApplies } from "../../../Border";
import { Margin, MarginApplies } from "../../../Margin";
import { Padding, PaddingApplies } from "../../../Padding";
import { Control, TComponent } from "../Control";
import { XmlTransformer } from "./XmlTransformer";
import { Message } from "../Message";
import { Msg } from "../Msg";
import { Teact } from "../../Teact";
import { ShadowRoot } from "../../ShadowRoot/ShadowRoot";
import { IControl } from "../IControl";
import { KeyFrameCollection } from "../../../../../UIKit/KeyFrameCollection";
import { motion } from '../../../../../motion/render/dom/motion';
import { jss } from "../../../../../jss/jss";
import { cssClassNameGenerator } from "./classNameGenerator";
import { Wrapper } from "./Wrapper";
import { useMemo } from "../../../../../hooks";
import type { UIView } from "../../../../../UIKit/UIView";

let cssCounter = 1;

export abstract class HtmlRenderer<T extends IControl> extends XmlTransformer<T> {
    protected Ref;
    private Control: T;
    private renderId: boolean = true;
    //private renderAsAnimated: boolean = true;
    protected contextMenu: any;


    public constructor(props: any) {
        super(props);

        this.Control = props.control;
        if (props.renderId === false) {
            this.renderId = false;
        }

        // if (props.renderAsAnimated === false) {
        // this.renderAsAnimated = !!props.control.renderAsAnimated;
        // }

        if (props.doNotBind === true) {
        } else {
            this.Control.PropertyChanged = (propertyName => {
                console.log(this.Control.constructor.name, ' : ', propertyName, ' changed');
                const stateObject = {};
                stateObject['GUID'] = Guid.NewGuid().ToString();
                this.setState(stateObject);
            }) as any;
            this.Control.UpdateRequied = (() => {
                console.log(this.Control.constructor.name, ' : ', ' updated.');
                const stateObject = {};
                stateObject['GUID'] = Guid.NewGuid().ToString();
                this.setState(stateObject);
            }) as any;
        }
        this.InitializeRenderer(this.Control);
    }

    //virtual
    protected InitializeRenderer(obj: T) { }

    public /* virtual */  TranslateAlpha(c: CGColor): float {
        return c.A / 255;
    }
    public /* virtual */  TranslateColor(c: CGColor): string {
        if (c == null) {
            return null;
        }

        const str: any[] = ["rgb(", c.R, ",", c.G, ",", c.B, ")"];
        return str.join('');
    }

    public /* virtual */  TranslateGraphicsPath(path: GraphicsPath): string {
        let str: string = "";
        try {
            const pathPoints: CGPoint[] = path.PathPoints;
            const pathTypes: number[] = path.PathTypes;
            let str1: string = "";
            for (let i: int = 0; i < Math.min(pathPoints.length, pathTypes.length); i++) {
                let str2: string = "M";
                let int32: int = pathTypes[i];
                let flag: boolean = false;
                if ((int32 & 128) != 0) {
                    flag = true;
                    int32 &= 127;
                }
                switch (int32 & 63) {
                    case 0:
                        {
                            str2 = "M";
                            break;
                        }
                    case 1:
                        {
                            str2 = "L";
                            break;
                        }
                    case 2:
                        {
                            str2 = TString.Concat("?", int32, "?");
                            break;
                        }
                    case 3:
                        {
                            str2 = "C";
                            break;
                        }
                    default:
                        {
                            str2 = TString.Concat("?", int32, "?");
                            break;
                        }
                }
                if (str2 !== str1) {
                    str = TString.Concat(str, str2);
                    str1 = str2;
                }
                let str3: string = str;
                const strArrays: any[] = [str3, pathPoints[i].X, " ", pathPoints[i].Y, " "];
                str = strArrays.join('');
                if (flag) {
                    str = TString.Concat(str, "Z ");
                }
            }
        }
        catch (exception) {
        }
        return str;
    }
    public /* virtual */  WriteBrushAttributes(brush: Brush): void {
        if (brush == null) {
            this.WriteStyleAttrVal("background-color", "transparent");
            return;
        }
        const solidBrush: SolidBrush = as(brush, GraphicTypes.SolidBrush);
        if (solidBrush != null) {
            this.WriteStyleAttrVal("background-color", this.TranslateColor(solidBrush.Color));
            if (solidBrush.Color.A !== 255) {
                this.WriteAttrVal("fill-opacity", this.TranslateAlpha(solidBrush.Color));
            }
        }
        //base.Writer.InvokeGenerateAttributes(b.GetType(), b);
    }

    public /* virtual */  WriteEllipse(p: Pen, b: Brush, r: CGRectangle): void {
        this.WriteStartElement("div");
        this.WriteBrushAttributes(b);
        this.WritePenAttributes(p);
        this.WriteStyleAttrVal('position', 'absolute');
        this.WriteStyleAttrVal('left', r.Left + 'px');
        this.WriteStyleAttrVal('top', r.Top + 'px');
        this.WriteStyleAttrVal('width', r.Width + 'px');
        this.WriteStyleAttrVal('height', r.Height + 'px');
        this.WriteStyleAttrVal('border-radius', '50%');
        this.WriteEndElement();


    }

    public /* virtual */  WriteLine(p: Pen, a: CGPoint, b: CGPoint): void {
        const color = p.Color.toString('#rrggbb');
        const width = p.Width;

        let ax: float = a.X;
        let ay: float = a.Y;
        let bx: float = b.X;
        let by: float = b.Y;
        if (ax > bx) {
            bx = ax + bx;
            ax = bx - ax;
            bx = bx - ax;
            by = ay + by;
            ay = by - ay;
            by = by - ay;
        }

        var angle = Math.atan((ay - by) / (bx - ax));
        // console.log('angle: ' + angle);

        angle = (angle * 180 / Math.PI);
        //   console.log('angle: ' + angle);
        angle = -angle;
        //   console.log('angle: ' + angle);

        var length = Math.sqrt((ax - bx) * (ax - bx) + (ay - by) * (ay - by));
        //console.log('length: ' + length);

        this.WriteStartElement("div");
        this.WriteStyleAttrVal('left', ax + "px");
        this.WriteStyleAttrVal('top', ay + "px");
        this.WriteStyleAttrVal('width', length + "px");
        this.WriteStyleAttrVal('height', width + "px");
        this.WriteStyleAttrVal('background-color', color);
        this.WriteStyleAttrVal('position', 'absolute');
        this.WriteStyleAttrVal('transform', "rotate(" + angle + "deg)");
        this.WriteStyleAttrVal('-ms-transform', "rotate(" + angle + "deg)");
        this.WriteStyleAttrVal('transform-origin', "0% 0%");

        this.WriteStyleAttrVal('-moz-transform', "rotate(" + angle + "deg)");
        this.WriteStyleAttrVal('-moz-transform-origin', "0% 0%");

        this.WriteStyleAttrVal('-webkit-transform', "rotate(" + angle + "deg)");
        this.WriteStyleAttrVal('-webkit-transform-origin', "0% 0%");

        this.WriteStyleAttrVal('-o-transform', "rotate(" + angle + "deg)");
        this.WriteStyleAttrVal('-o-transform-origin', "0% 0%");

        this.WriteEndElement();
    }

    public /* virtual */  WriteLines(p: Pen, v: CGPoint[]): void {
        this.WriteStartElement("div");
        //this.WriteBrushAttributes(null);
        this.WritePenAttributes(p);
        let str: string = "";
        for (let i: int = 0; i < v.length; i++) {
            const pointF: CGPoint = v[i];
            let str1: string = str;
            const strArrays: any[] = [str1, pointF.X, ",", pointF.Y, " "];
            str = strArrays.join('');
        }
        this.WriteStyleAttrVal("clip-path", "polygon(" + str + ")");
        this.WriteEndElement();
    }
    public /* virtual */  WritePath(p: Pen, b: Brush, pathdesc: string): void {
        this.WriteStartElement("div");
        this.WriteBrushAttributes(b);
        this.WritePenAttributes(p);
        this.WriteStyleAttrVal("clip-path", "path(" + pathdesc + ")");
        this.WriteEndElement();
    }

    public /* virtual */  WritePenAttributes(pen: Pen): void {

        if (pen == null || pen.Color.IsEmpty) {
            this.WriteStyleAttrVal("borderColor", "transparent");
            return;
        }
        this.WriteStyleAttrVal("borderColor", this.TranslateColor(pen.Color));
        const width: float = pen.Width;

        if (width !== 0) {
            this.WriteStyleAttrVal("borderWidth", width);
        }
        else {
            this.WriteStyleAttrVal("borderWidth", width + "px");
        }

        if (pen.Color.A !== 255) {
            this.WriteStyleAttrVal("stroke-opacity", this.TranslateAlpha(pen.Color));
        }
        if (pen.DashOffset > 0) {
            this.WriteStyleAttrVal("borderStyle", pen.DashOffset);
        }
        if (pen.DashStyle !== 0/* DashStyle.Solid */) {
            const dashPattern: float[] = pen.DashPattern;
            let str: string = "";
            for (let i: int = 0; i < dashPattern.length; i++) {
                if (i > 0) {
                    str = TString.Concat(str, ",");
                }
                str = TString.Concat(str, dashPattern[i] * width);
            }
            this.WriteStyleAttrVal("borderStyle", str);
        } else {
            this.WriteStyleAttrVal("borderStyle", 'solid');
        }

        //base.Writer.InvokeGenerateAttributes(p.GetType(), p);
    }

    public /* virtual */  WritePolygon(p: Pen, b: Brush, poly: CGPoint[]): void {
        if (poly == null || poly.length < 2) {
            return;
        }
        const str: any[] = ["M", poly[0].X, " ", poly[0].Y, " "];
        let str1: string = str.join('');
        for (let i: int = 1; i < poly.length; i++) {
            const pointF: CGPoint = poly[i];
            const str2: string = str1;
            const strArrays: any[] = [str2, "L", pointF.X, " ", pointF.Y, " "];
            str1 = strArrays.join('');
        }
        str1 = TString.Concat(str1, "Z");
        this.WritePath(p, b, str1);
    }

    public /* virtual */  WriteRectangle(p: Pen, b: Brush, r: CGRectangle, corner: CGSize): void {
        this.WriteStartElement("div");
        this.WriteBrushAttributes(b);
        this.WritePenAttributes(p);
        this.WriteStyleAttrVal('position', 'absolute');
        this.WriteStyleAttrVal('left', r.Left + 'px');
        this.WriteStyleAttrVal('top', r.Top + 'px');
        this.WriteStyleAttrVal('width', r.Width + 'px');
        this.WriteStyleAttrVal('height', r.Height + 'px');

        if (corner.Width > 0 && corner.Height > 0) {
            this.WriteStyleAttrVal('border-radius', corner.Width + "px " + corner.Height + "px");
        }
        this.WriteEndElement();
    }

    //Lifecycle methods
    private componentWillMount(): void {


        this.OnComponentWillMount(this.Ref, this.Control);
    }
    private componentDidMount(): void {
        this.OnComponentDidMount(this.Ref, this.Control);
        this.Control.OnLoaded();
    }
    private componentWillReceiveProps(): void {
        this.OnComponentWillReceiveProps(this.Control);
    }
    private shouldComponentUpdate(nextProps: any, nextState: any): boolean {
        return this.OnShouldComponentUpdate(this.Control);
    }
    private componentWillUpdate(): void {
        this.OnComponentWillUpdate(this.Control);
    }
    private componentDidUpdate(prevProps, prevState): void {
        this.OnComponentDidUpdate(this.Control);
    }
    private componentWillUnmount(): void {
        if (this.Control.Appearance['jssStyle']) {
            this.Control.Appearance['jssStyle'].detach();
            jss.removeStyleSheet(this.Control.Appearance['jssStyle']);
        }

        this.OnComponentWillUnmount(this.Control);
        this.Control.OnUnLoaded();
    }

    protected OnShadowDomWillMount(ref: any, obj: T): void { }
    protected OnShadowDomDidMount(ref: any, obj: T): void { }
    protected OnShadowDomWillUnmount(ref: any, obj: T): void { }


    protected OnComponentWillMount(ref: any, obj: T): void { }
    protected OnComponentDidMount(ref: any, obj: T): void { }
    protected OnComponentWillReceiveProps(obj: T) { }
    protected OnShouldComponentUpdate(obj: T): boolean { return true; }
    protected OnComponentWillUpdate(obj: T): void { }
    protected OnComponentDidUpdate(obj: T): void { }
    protected OnComponentWillUnmount(obj: T): void { }

    protected GetStyleObject(): any {
        const style = {};
        if (this.Control.Width) {
            style['width'] = this.Control.Width + 'px';
        }
        if (this.Control.Height) {
            style['height'] = this.Control.Height + 'px';
        }

        if (this.Control.BackgroundColor) {
            style['background'] = this.Control.BackgroundColor;
        }

        if (this.Control.Padding !== Padding.Empty) {
            if (this.Control.Padding.Applies & PaddingApplies.Left) {
                style['paddingLeft'] = this.Control.Padding.Left + 'px';
            }
            if (this.Control.Padding.Applies & PaddingApplies.Right) {
                style['paddingRight'] = this.Control.Padding.Right + 'px';
            }
            if (this.Control.Padding.Applies & PaddingApplies.Top) {
                style['paddingTop'] = this.Control.Padding.Top + 'px';
            }
            if (this.Control.Padding.Applies & PaddingApplies.Bottom) {
                style['paddingBottom'] = this.Control.Padding.Bottom + 'px';
            }
        }
        if (this.Control.Border !== Border.Empty) {
            if (this.Control.Border.Applies & BorderApplies.Left) {
                style['borderLeft'] = TString.Format('solid {0}px {1}', 1, this.Control.Border.LeftBorderColor);
            }
            if (this.Control.Border.Applies & BorderApplies.Right) {
                style['borderRight'] = TString.Format('solid {0}px {1}', 1, this.Control.Border.RightBorderColor);
            }
            if (this.Control.Border.Applies & BorderApplies.Top) {
                style['borderTop'] = TString.Format('solid {0}px {1}', 1, this.Control.Border.TopBorderColor);
            }
            if (this.Control.Border.Applies & BorderApplies.Bottom) {
                style['borderBottom'] = TString.Format('solid {0}px {1}', 1, this.Control.Border.BottomBorderColor);
            }
        }

        if (this.Control.Margin !== Margin.Empty) {
            if (this.Control.Margin.Applies & MarginApplies.Left) {
                style['marginLeft'] = this.Control.Margin.Left + 'px';
            }
            if (this.Control.Margin.Applies & MarginApplies.Right) {
                style['marginRight'] = this.Control.Margin.Right + 'px';
            }
            if (this.Control.Margin.Applies & MarginApplies.Top) {
                style['marginTop'] = this.Control.Margin.Top + 'px';
            }
            if (this.Control.Margin.Applies & MarginApplies.Bottom) {
                style['marginBottom'] = this.Control.Margin.Bottom + 'px';
            }
        }

        return style;
    }

    public get UseShadowDom(): boolean {
        return false;
    }

    private createStyles() {
        const sb = new StringBuilder();

        this.OnStyleCreating(this.Control, sb);


        const styleObject = this.Control.Appearance.GetStyleObject();
        if (Object.keys(styleObject).length > 0) {

            sb.AppendLine(`:host {`);
            for (let key in styleObject) {
                if (!is.nullOrEmpty(styleObject[key])) {
                    sb.AppendLine(`${key}:${styleObject[key]} !important;`);
                }
            }
            sb.AppendLine(`}`);
        }


        const hoverStyleObject = this.Control.HoverAppearance.GetStyleObject();
        if (Object.keys(hoverStyleObject).length > 0) {

            sb.AppendLine(`:host(:hover) {`);
            for (let key in hoverStyleObject) {
                if (!is.nullOrEmpty(hoverStyleObject[key])) {
                    sb.AppendLine(`${key}:${hoverStyleObject[key]} !important;`);
                }
            }
            sb.AppendLine(`}`);
        }

        const activeStyleObject = this.Control.ActiveAppearance.GetStyleObject();
        if (Object.keys(activeStyleObject).length > 0) {

            sb.AppendLine(`:host(:active) {`);
            for (let key in activeStyleObject) {
                if (!is.nullOrEmpty(activeStyleObject[key])) {
                    sb.AppendLine(`${key}:${activeStyleObject[key]} !important;`);
                }
            }
            sb.AppendLine(`}`);
        }

        const disabledStyleObject = this.Control.DisabledAppearance.GetStyleObject();
        if (Object.keys(disabledStyleObject).length > 0) {

            sb.AppendLine(`:host([disabled]) {`);
            for (let key in disabledStyleObject) {
                if (!is.nullOrEmpty(disabledStyleObject[key])) {
                    sb.AppendLine(`${key}:${disabledStyleObject[key]} !important;`);
                }
            }
            sb.AppendLine(`}`);
        }

        //Element üzerinde yapılıyor. Shadow dom before desteği yok.
        /*  const beforeStyleObject = this.Control.BeforeAppearance.GetStyleObject();
        if (Object.keys(beforeStyleObject).length > 0) {
            sb.AppendLine(`:host(:before) {`);
            sb.AppendLine(`content:'';`);
            for (let key in beforeStyleObject) {
                if (!is.nullOrEmpty(beforeStyleObject[key]) && key !== 'content') {
                    sb.AppendLine(`${key}:${beforeStyleObject[key]};`);
                }
            }
            sb.AppendLine(`}`);
        } */


        const focusStyleObject = this.Control.FocusAppearance.GetStyleObject();
        if (Object.keys(focusStyleObject).length > 0) {

            sb.AppendLine(`:host(:focus) {`);
            for (let key in focusStyleObject) {
                if (!is.nullOrEmpty(focusStyleObject[key])) {
                    sb.AppendLine(`${key}:${focusStyleObject[key]} !important;`);
                }
            }
            sb.AppendLine(`}`);
        }

        const keyframesCollections: KeyFrameCollection[] = this.Control.KeyFrameCollection;
        for (let i = 0; i < keyframesCollections.length; i++) {
            sb.AppendLine(keyframesCollections[i].ToString());
        }



        return sb.ToString();

    }

    public OnStyleCreating(obj: T, sb: StringBuilder): void {

    }



    public OnCustomAttributesCreating(obj: T, attributeObject: any): void {

    }

    public GetCustomJss(obj:T): Object {
        return {};
    }

    public render(param?: any) {
        if (!this.Control.Visible) {
            return null;
        }
        //debugger;
        const result = [];
        this.Render(result, this.Control);
        if (this.UseShadowDom /* || !this.Control.HoverAppearance.IsEmpty */) {
            const sr = (
                <ShadowRoot componentDidMount={(shadowRoot) => this.OnShadowDomDidMount(shadowRoot, this.Control)} componentWillMount={(shadowRoot) => this.OnShadowDomWillMount(shadowRoot, this.Control)} componentWillUnmount={(shadowRoot) => this.OnShadowDomWillUnmount(shadowRoot, this.Control)}>
                    {<style>{this.createStyles()}</style>}
                    {result}
                </ShadowRoot>
            );

            const style = {};

            if (this.Control.Left != null && this.Control.Top != null) {
                style['position'] = 'absolute';
                style['left'] = this.Control.Left;
                style['top'] = this.Control.Top;
                style['bottom'] = this.Control.Bottom;
                style['right'] = this.Control.Right;
            } else {
                style['position'] = 'relative';
            }
            if (this.Control._Width != null) {
                style['width'] = this.Control._Width;
            }
            if (this.Control._Height != null) {
                style['height'] = this.Control._Height;
            }

            const elementProperties = {};
            if (this.renderId) {
                elementProperties['id'] = 'id-' + this.Control.Id;
            }

            if (this.Control.TabIndex != null) {
                elementProperties['tabindex'] = this.Control.TabIndex;
            }

            elementProperties['onContextMenu'] = (e) => {

                if (this.contextMenu != null) {
                    this.contextMenu.show(e);
                }
            };

            if ((this.Control as any).renderAsAnimated) {
                elementProperties['animated'] = true;

                if ((this.Control as any)._initial != null) {
                    elementProperties['initial'] = (this.Control as any)._initial;
                }
                if ((this.Control as any)._animate != null) {
                    elementProperties['animate'] = (this.Control as any)._animate;
                }
                if ((this.Control as any)._transition != null) {
                    elementProperties['transition'] = (this.Control as any)._transition;
                }

                if ((this.Control as any)._whileHover != null) {
                    elementProperties['whileHover'] = (this.Control as any)._whileHover;
                }
                if ((this.Control as any)._whileTap != null) {
                    elementProperties['whileTap'] = (this.Control as any)._whileTap;
                }
                if ((this.Control as any)._whileDrag != null) {
                    elementProperties['whileDrag'] = (this.Control as any)._whileDrag;
                }
                if ((this.Control as any)._whileFocus != null) {
                    elementProperties['whileFocus'] = (this.Control as any)._whileFocus;
                }
                if ((this.Control as any)._whileInView != null) {
                    elementProperties['whileInView'] = (this.Control as any)._whileInView;
                }
                if ((this.Control as any)._exit != null) {
                    elementProperties['exit'] = (this.Control as any)._exit;
                }
            }

            /*   elementProperties['data-cooltipz-dir'] = `left`;
              elementProperties['aria-label'] = `Hello there!`; */

            //elementProperties['class'] = `tvl-control-${this.Control.constructor.name}`;
            elementProperties['style'] = style;
            elementProperties['ref'] = (e) => this.Ref = e;
            elementProperties['onclick'] = (e) => this.Control.WndProc(Message.Create(Msg.WM_CLICK, e, e));
            elementProperties['ondblclick'] = (e) => this.Control.WndProc(Message.Create(Msg.WM_DBCLICK, e, e));
            elementProperties['onmouseDown'] = (e) => this.Control.WndProc(Message.Create(Msg.WM_MOUSEDOWN, e, e));
            elementProperties['onkeydown'] = (e) => this.Control.WndProc(Message.Create(Msg.WM_KEYDOWN, e, e));
            elementProperties['onkeydown'] = (e) => this.Control.WndProc(Message.Create(Msg.WM_KEYDOWN, e, e));
            elementProperties['onfocus'] = (e) => this.Control.WndProc(Message.Create(Msg.WM_SETFOCUS, e, e));
            elementProperties['onfocusout'] = (e) => this.Control.WndProc(Message.Create(Msg.WM_KILLFOCUS, e, e));

            this.OnCustomAttributesCreating(this.Control, elementProperties);

            const alias = (this.Control as any).vp_Alias;
            if (alias != null) {
                elementProperties['alias'] = alias;
            }

            if ((this.Control as any).renderAsAnimated) {
                return Teact.createElement(motion[`tuval-control-${this.Control.constructor.name}`], elementProperties, sr);
            } else {
                return Teact.createElement(`tuval-control-${this.Control.constructor.name}`, elementProperties, sr);
            }

        } else {
            const style = {};/* this.Control.Appearance.GetStyleObject(); */

            if (this.Control.Left != null && this.Control.Top != null) {
                style['position'] = 'absolute';
                style['left'] = this.Control.Left;
                style['top'] = this.Control.Top;
                style['bottom'] = this.Control.Bottom;
                style['right'] = this.Control.Right;
            } else {
                if (this.Control.Appearance.Position !== 'absolute') {
                    style['position'] = 'relative';
                }
            }
            if (this.Control._Width != null) {
                style['width'] = this.Control._Width;
            }
            if (this.Control._Height != null) {
                style['height'] = this.Control._Height;
            }

            const elementProperties = {};
            if (this.renderId) {
                elementProperties['id'] = 'id-' + this.Control.Id;
            }

            if (this.Control.TabIndex != null) {
                elementProperties['tabindex'] = this.Control.TabIndex;
            }

            elementProperties['onContextMenu'] = (e) => {

                if (this.contextMenu != null) {
                    this.contextMenu.show(e);
                }
            };

            if ((this.Control as any).renderAsAnimated) {
                elementProperties['animated'] = true;

                if ((this.Control as any)._initial != null) {
                    elementProperties['initial'] = (this.Control as any)._initial;
                }
                if ((this.Control as any)._animate != null) {
                    elementProperties['animate'] = (this.Control as any)._animate;
                }
                if ((this.Control as any)._transition != null) {
                    elementProperties['transition'] = (this.Control as any)._transition;
                }

                if ((this.Control as any)._whileHover != null) {
                    elementProperties['whileHover'] = (this.Control as any)._whileHover;
                }
                if ((this.Control as any)._whileTap != null) {
                    elementProperties['whileTap'] = (this.Control as any)._whileTap;
                }
                if ((this.Control as any)._whileDrag != null) {
                    elementProperties['whileDrag'] = (this.Control as any)._whileDrag;
                }
                if ((this.Control as any)._whileFocus != null) {
                    elementProperties['whileFocus'] = (this.Control as any)._whileFocus;
                }
                if ((this.Control as any)._whileInView != null) {
                    elementProperties['whileInView'] = (this.Control as any)._whileInView;
                }
                if ((this.Control as any)._exit != null) {
                    elementProperties['exit'] = (this.Control as any)._exit;
                }
            }

            /*   elementProperties['data-cooltipz-dir'] = `left`;
              elementProperties['aria-label'] = `Hello there!`; */

            //elementProperties['class'] = `tvl-control-${this.Control.constructor.name}`;

            elementProperties['style'] = style;
            elementProperties['ref'] = (e) => this.Ref = e;
            elementProperties['onclick'] = (e) => { this.Control.WndProc(Message.Create(Msg.WM_CLICK, e, e)) };
            elementProperties['ondblclick'] = (e) => this.Control.WndProc(Message.Create(Msg.WM_DBCLICK, e, e));
            elementProperties['onmouseDown'] = (e) => this.Control.WndProc(Message.Create(Msg.WM_MOUSEDOWN, e, e));
            elementProperties['onkeydown'] = (e) => this.Control.WndProc(Message.Create(Msg.WM_KEYDOWN, e, e));
            elementProperties['onkeydown'] = (e) => this.Control.WndProc(Message.Create(Msg.WM_KEYDOWN, e, e));
            elementProperties['onfocus'] = (e) => this.Control.WndProc(Message.Create(Msg.WM_SETFOCUS, e, e));
            elementProperties['onfocusout'] = (e) => this.Control.WndProc(Message.Create(Msg.WM_KILLFOCUS, e, e));


            this.OnCustomAttributesCreating(this.Control, elementProperties);

            const alias = (this.Control as any).vp_Alias;
            if (alias != null) {
                elementProperties['alias'] = alias;
            }

            /*  if ((this.Control as any).__createStyle) {
                 elementProperties['className'] = (this.Control as any).__createStyle();
             } */


            /*  elementProperties['style'] = {
                 ...this.Control.Appearance.GetStyleObject()
             }; */

            return (
                <Wrapper
                    renderAsAnimated={(this.Control as any).renderAsAnimated}
                    renderer={this}
                    control={this.Control}
                    elementProps={elementProperties}
                    OnComponentWillMount={this.componentWillMount.bind(this)}
                    OnComponentDidMount={this.componentDidMount.bind(this)}
                    OnComponentWillUnmount={this.componentWillUnmount.bind(this)}
                    OnComponentDidUpdate={this.componentDidUpdate.bind(this)}
                >
                    {result}
                    {/*  <tuval-view {...elementProperties}>
                            {result}
                        </tuval-view> */}
                    {/* Teact.createElement(`tuval-control-${this.Control.constructor.name}`, elementProperties, result) */}
                </Wrapper>
            )
            //return Teact.createElement(`tuval-control-${this.Control.constructor.name}`, elementProperties, result);
        }
    }

}