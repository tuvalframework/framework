
import { int, is } from '@tuval/core';
import { AppearanceObject } from "../windows/Forms/Components/AAA/AppearanceObject";
import { KeyFrameCollection } from './KeyFrameCollection';
import { CornerRadiusTypes, FontWeightModifierTypes, IFont, PositionTypes, ShadowTypes, StyleAttribute, TextAligns, TextTransforms, UIView } from './UIView';
import { ZStackClass } from './ZStack';
import { ControlTypes } from '../windows/Forms/Components/ControlTypes';
import { cBottom, cHorizontal, cLeft, cRight, cTop, cVertical } from './Constants';
import { ColorClass } from '../tuval-system/ColorClass';


export class AppearanceClass {

    public Appearance: AppearanceObject
    public HoverAppearance: AppearanceObject;
    public FocusAppearance: AppearanceObject;
    public ActiveAppearance: AppearanceObject;
    public BeforeAppearance: AppearanceObject;
    public KeyFrameCollection: KeyFrameCollection[] = [];

    public constructor() {
        this.Appearance = new AppearanceObject(null);
        this.HoverAppearance = new AppearanceObject(null);
        this.FocusAppearance = new AppearanceObject(null);
        this.ActiveAppearance = new AppearanceObject(null);
        this.BeforeAppearance = new AppearanceObject(null);
    }
    public zIndex(value: int): this {
        this.Appearance.ZIndex = value.toString();
        return this;
    }

    public variable(name: string, value: StyleAttribute): this {
        if (value.default != null) {
            this.Appearance.StylePropertyBag[name] = value.default;
        }
        if (value.hover != null) {
            this.HoverAppearance.StylePropertyBag[name] = value.hover;
        }
        if (value.active != null) {
            this.ActiveAppearance.StylePropertyBag[name] = value.active;
        }
        if (value.focus != null) {
            this.FocusAppearance.StylePropertyBag[name] = value.focus;
        }
        return this;
    }
    public visible(value: boolean): this {
        if (value === true) {
            this.Appearance.Visibility = 'visible';
        } else {
            this.Appearance.Visibility = 'hidden';
        }
        return this;
    }

    public position(value: PositionTypes): this;
    public position(size: int): this;
    public position(size: string): this;
    public position(...args: any[]): this {
        if (args.length === 1 && is.number(args[0])) {
            const size = args[0];
            this.Appearance.Position = size + 'pt';
            return this;
        } else if (args.length === 1 && is.string(args[0])) {
            const size = args[0];
            this.Appearance.Position = size;
            return this;
        }
        throw 'ArgumentOutOfRange Exception. UIView::position';
    }

    public left(value: string): this {
        this.Appearance.Left = value;
        return this;
    }
    public top(value: string): this {
        this.Appearance.Top = value;
        return this;
    }
    public right(value: string): this {
        this.Appearance.Right = value;
        return this;
    }
    public bottom(value: string): this {
        this.Appearance.Bottom = value;
        return this;
    }

    //#region Transforms
    public transform(value: string): this {
        this.Appearance.Transform = value;
        return this;
    }

    public rotate(value: string): this {
        if (this.Appearance.Transform == null) {
            this.Appearance.Transform = '';
        }
        this.Appearance.Transform += ` rotate(${value})`;
        return this;
    }
    //#endregion

    public clipPath(value: string): this {
        this.Appearance.ClipPath = value;
        return this;
    }

    public filter(value: string): this {
        this.Appearance.Filter = value;
        return this;
    }


    public font(font: IFont): this {
        if (font.family != null) {
            this.fontFamily(font.family);
        }
        if (font.size != null) {
            this.fontSize(font.size);
        }
        if (font.weight != null) {
            this.fontWeight(font.weight);
        }
        if (font.leading != null) {
            this.Appearance.LineHeight = font.leading;
        }
        if (font.spacing != null) {
            this.Appearance.LetterSpacing = font.spacing;
        }
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


    public fontSmoothing(value: (view: UIView) => void): this;
    public fontSmoothing(...args: any[]): this {
        if (args.length === 1 && is.function(args[0])) {
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
            value(null);
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

    public width(): this;
    public width(value: int): this;
    public width(value: string): this;
    public width(...args: any[]): this {
        if (args.length === 0) {
            this.Appearance.Width = '';
            return this;
        } else if (args.length === 1 && is.number(args[0])) {
            const value = args[0];
            this.Appearance.Width = `${value}px`;
            return this;
        } else if (args.length === 1 && is.string(args[0])) {
            const value: string = args[0];
            this.Appearance.Width = value;
            return this;
        }

        throw `ArgumentOutOfRange Exception in UIView::width method. Argument count: ${args.length}`;
    }

    public minWidth(value: string) {
        this.Appearance.MinWidth = value;
        return this;
    }

    public maxWidth(value: string) {
        this.Appearance.MaxWidth = value;
        return this;
    }

    public height(): this;
    public height(value: int): this;
    public height(value: string): this;
    public height(...args: any[]): this {
        if (args.length === 0) {
            this.Appearance.Height = '';
            return this;
        } else if (args.length === 1 && is.number(args[0])) {
            const value = args[0];
            this.Appearance.Height = `${value}px`;
            return this;
        } else if (args.length === 1 && is.string(args[0])) {
            const value: string = args[0];
            this.Appearance.Height = value;
            return this;
        }

        throw `ArgumentOutOfRange Exception in UIView::height method. Argument count: ${args.length}`;
    }
    public minHeight(value: string) {
        this.Appearance.MinHeight = value;
        return this;
    }

    public maxHeight(value: string) {
        this.Appearance.MaxHeight = value;
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
                (this as any).Appearance.Color = styleAttribute.default instanceof ColorClass ? styleAttribute.default.color : styleAttribute.default;
            }
            if (styleAttribute.hover != null) {
                (this as any).HoverAppearance.Color = styleAttribute.hover instanceof ColorClass ? styleAttribute.hover.color : styleAttribute.hover;
            }
            if (styleAttribute.active != null) {
                (this as any).ActiveAppearance.Color = styleAttribute.active instanceof ColorClass ? styleAttribute.active.color : styleAttribute.active;
            }
        }

        return this;
        // throw 'Argument Exception in ' + this.constructor.name + '::foregroundColor function.';

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
                (this as any).Appearance.BackgroundImage = styleAttribute.default instanceof ColorClass ? styleAttribute.default.color : styleAttribute.default;
            }
            if (styleAttribute.hover != null) {
                (this as any).HoverAppearance.BackgroundImage = styleAttribute.hover instanceof ColorClass ? styleAttribute.hover.color : styleAttribute.hover;
            }
            if (styleAttribute.active != null) {
                (this as any).ActiveAppearance.BackgroundImage = styleAttribute.active instanceof ColorClass ? styleAttribute.active.color : styleAttribute.active;
            }
            return this;
        }
        throw 'Argument Exception in ' + this.constructor.name + '::backgroundImage function.';
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
        } else if (args.length === 1 && typeof args[0] === 'object') {
            const styleAttribute: StyleAttribute = args[0];
            if (styleAttribute.default != null) {
                (this as any).Appearance.Background = styleAttribute.default instanceof ColorClass ? styleAttribute.default.color : styleAttribute.default;
            }
            if (styleAttribute.hover != null) {
                (this as any).HoverAppearance.Background = styleAttribute.hover instanceof ColorClass ? styleAttribute.hover.color : styleAttribute.hover;
            }
            return this;
        }

        throw 'Argument Exception in ' + this.constructor.name + '::backgound function.';

    }
    public cursor(value: string) {
        this.Appearance.Cursor = value;
        return this;
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
        }
        throw 'ArgumentOutOfRange Exception in ' + this.constructor.name + '::cornerRadius function.';
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
                (this as any).Appearance.Outline = styleAttribute.default instanceof ColorClass ? styleAttribute.default.color : styleAttribute.default;
            }
            if (styleAttribute.hover != null) {
                (this as any).HoverAppearance.Outline = styleAttribute.hover instanceof ColorClass ? styleAttribute.hover.color : styleAttribute.hover;
            }
            if (styleAttribute.active != null) {
                (this as any).ActiveAppearance.Outline = styleAttribute.active instanceof ColorClass ? styleAttribute.active.color : styleAttribute.active;
            }
            if (styleAttribute.focus != null) {
                (this as any).FocusAppearance.Outline = styleAttribute.focus instanceof ColorClass ? styleAttribute.focus.color : styleAttribute.focus;
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
                (this as any).Appearance.Border = styleAttribute.default instanceof ColorClass ? styleAttribute.default.color : styleAttribute.default;
            }
            if (styleAttribute.hover != null) {
                (this as any).HoverAppearance.Border = styleAttribute.hover instanceof ColorClass ? styleAttribute.hover.color : styleAttribute.hover;
            }
            if (styleAttribute.active != null) {
                (this as any).ActiveAppearance.Border = styleAttribute.active instanceof ColorClass ? styleAttribute.active.color : styleAttribute.active;
            }
            if (styleAttribute.focus != null) {
                (this as any).FocusAppearance.Border = styleAttribute.focus instanceof ColorClass ? styleAttribute.focus.color : styleAttribute.focus;
            }
            return this;
        }
        throw 'Argument Exception in ' + this.constructor.name + '::border function.';
    }

    public borderLeft(value: string) {
        this.Appearance.BorderLeft = value;
        return this;
    }
    public borderRight(value: string) {
        this.Appearance.BorderRight = value;
        return this;
    }
    public borderTop(value: string) {
        this.Appearance.BorderTop = value;
        return this;
    }
    public borderBottom(value: string) {
        this.Appearance.BorderBottom = value;
        return this;
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
            this.Appearance.Margin = '5px';
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
            this.Appearance.MarginTop = '5px';
            this.Appearance.MarginBottom = '5px';
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
            this.Appearance.MarginLeft = '5px';
            this.Appearance.MarginRight = '5px';
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


    public marginLeft(value: string) {
        this.Appearance.MarginLeft = value;
        return this;
    }
    public marginRight(value: string) {
        this.Appearance.MarginRight = value;
        return this;
    }
    public marginTop(value: string) {
        this.Appearance.MarginTop = value;
        return this;
    }
    public marginBottom(value: string) {
        this.Appearance.MarginBottom = value;
        return this;
    }

    public padding(): this;
    public padding(value: string): this;
    public padding(type: string, value: string): this;
    public padding(value: int): this;
    public padding(type: string, value: int): this;
    public padding(...args: any[]): this {
        if (args.length === 0) {
            this.Appearance.Padding = '5px';
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


        return this;
    }

    public paddingLeft(value: string) {
        this.Appearance.PaddingLeft = value;

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
                (this as any).Appearance.BoxShadow = styleAttribute.default instanceof ColorClass ? styleAttribute.default.color : styleAttribute.default;
            }
            if (styleAttribute.hover != null) {
                (this as any).HoverAppearance.BoxShadow = styleAttribute.hover instanceof ColorClass ? styleAttribute.hover.color : styleAttribute.hover;
            }
            if (styleAttribute.active != null) {
                (this as any).ActiveAppearance.BoxShadow = styleAttribute.active instanceof ColorClass ? styleAttribute.active.color : styleAttribute.active;
            }
            if (styleAttribute.focus != null) {
                (this as any).FocusAppearance.BoxShadow = styleAttribute.focus instanceof ColorClass ? styleAttribute.focus.color : styleAttribute.focus;
            }
            return this;
        }
        throw 'ArgumentOutOfRange Exception in ' + this.constructor.name + '::shadow method.';
    }

    public transition(value: string): this {
        this.Appearance.Transition = value;
        return this;
    }

    public opacity(value: string): this {
        this.Appearance.Opacity = value;
        return this;
    }

    //--------------------------------

    public kerning(value: string): this {
        this.Appearance.LetterSpacing = value;
        return this;
    }

}

export function UIAppearance(): AppearanceClass {
    return new AppearanceClass();
}