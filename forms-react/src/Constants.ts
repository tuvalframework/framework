import { UIView } from "./components/UIView/UIView";

export const cAll = 'cAll';
export const cHorizontal = 'cHorizontal';
export const cVertical = 'cVertical';
export const cLeft = 'cLeft';
export const cRight = 'cRight';

export const cTopLeading = 'cTopLeading';
export const cTop = 'cTop';
export const cTopTrailing = 'cTopTrailing';
export const cLeading = 'cLeading';
export const cCenter = 'cCenter';
export const cTrailing = 'cTrailing';
export const cBottomTrailing = 'cBottomTrailing';
export const cBottom = 'cBottom';
export const cBottomLeading = 'cBottomLeading';

export type AlignmentType = 'cTopLeading' | 'cTop' | 'cTopTrailing' | 'cLeading' | 'cCenter' | 'cTrailing' | 'cBottomTrailing' | 'cBottom' | 'cBottomLeading';


export type FontWeightModifierTypes = 'normal' | 'bold' | 'lighter' | 'bolder' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | 'inherit' | 'initial' | 'revert' | 'unset';
export type TextAligns = 'left' | 'right' | 'center' | 'justify' | 'initial' | 'inherit';
export type VerticalAligns = 'bottom' | 'middle' | 'top';
export type TextTransforms = 'capitalize' | 'uppercase' | 'lowercase' | 'none' | 'full-width' | 'full-size-kana';
export enum ShadowTypes {
    Small = '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    Shadow = '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    Medium = '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    Large = '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    XLarge = '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    XXLarge = '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    Inner = 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    None = '0 0 #0000'
}

export enum CornerRadiusTypes {
    None = '0px',
    Small = '0.125rem',     /* 2px */
    Rounded = '0.25rem',    /* 4px */
    Medium = '0.375rem',    /* 6px */
    Large = '0.5rem',       /* 8px */
    XLarge = '0.75rem',     /* 12px */
    XXLarge = '1rem',       /* 16px */
    XXXLarge = '1.5rem',    /* 24px */
    Full = '9999px'
}


export class FontSizeTypes {
    public static XSmall = (view: UIView) => { view.fontSize('0.75rem'); /* 12px */ view.lineHeight('1rem'); /* 16px */ }
    public static Small = (view: UIView) => { view.fontSize('0.875rem'); /* 14px */ view.lineHeight('1.25rem'); /* 20px */ }
    public static Base = (view: UIView) => { view.fontSize('1rem'); /* 16px */      view.lineHeight('1.5rem'); /* 24px */ }
    public static Large = (view: UIView) => { view.fontSize('1.125rem'); /* 18px */ view.lineHeight('1.75rem'); /* 28px */ }
    public static LargeX = (view: UIView) => { view.fontSize('1.25rem'); /* 20px */ view.lineHeight('1.75rem'); /* 28px */ }
    public static Large2X = (view: UIView) => { view.fontSize('1.5rem'); /* 24px */ view.lineHeight('2rem'); /* 32px */ }
    public static Large3X = (view: UIView) => { view.fontSize('1.875rem'); /* 30px */ view.lineHeight('2.25rem'); /* 36px */ }
}

export class FontSmoothingTypes {
    public static Antialiased = (view: UIView) => {
        view.Appearance.StylePropertyBag['-webkit-font-smoothing'] = 'antialiased';
        view.Appearance.StylePropertyBag['-moz-osx-font-smoothing'] = 'grayscale';
    }

    public static Subpixel = (view: UIView) => {
        view.Appearance.StylePropertyBag['-webkit-font-smoothing'] = 'auto';
        view.Appearance.StylePropertyBag['-moz-osx-font-smoothing'] = 'auto';
    }
}


export interface IFont {
    family?: string;
    size?: string;
    weight?: FontWeightModifierTypes;
    leading?: string;
    spacing?: string;
}


const FontFamily = "-apple-system, system-ui, BlinkMacSystemFont, 'Inter', sans-serif";
const Regular = '400';
const Medium = '500';
const SemiBold = '600';
const Bold = '700';

export enum PositionTypes {
    Static = 'static',
    Fixed = 'fixed',
    Absolute = 'absolute',
    Relative = 'relative',
    Sticky = 'sticky'
}
export class Fonts {
    public static largeTitle: IFont = { family: FontFamily, size: '20pt'/* '34pt' */, weight: Regular, leading: '41pt', spacing: '0.9px' }
    public static title: IFont = { family: FontFamily, size: '17pt'/* '28pt' */, weight: Regular, leading: '34pt', spacing: '0.9px' }
    public static title2: IFont = { family: FontFamily, size: '14pt'/* '22pt' */, weight: Regular, leading: '28pt', spacing: '0.9px' }
    public static title3: IFont = { family: FontFamily, size: '12pt'/* '20pt' */, weight: Regular, leading: '25pt', spacing: '0.9px' }
    public static headline: IFont = { family: FontFamily, size: '10pt'/* '17pt' */, weight: SemiBold, leading: '22pt', spacing: '0.9px' }
    public static body: IFont = { family: FontFamily, size: '10pt'/* '17pt' */, weight: Regular, leading: '22pt', spacing: '0.9px' }
    public static callout: IFont = { family: FontFamily, size: '16pt', weight: Regular, leading: '21pt', spacing: '0.9px' }
    public static subhead: IFont = { family: FontFamily, size: '15pt', weight: Regular, leading: '20pt', spacing: '0.9px' }
    public static footnote: IFont = { family: FontFamily, size: '13pt', weight: Regular, leading: '18pt', spacing: '0.9px' }
    public static caption: IFont = { family: FontFamily, size: '12pt', weight: Regular, leading: '16pt', spacing: '0.9px' }
    public static caption2: IFont = { family: FontFamily, size: '11pt', weight: Regular, leading: '13pt', spacing: '0.9px' }
}

export enum Alignment {
    topLeading = 0,
    top = 1,
    topTrailing = 2,
    leading = 3,
    center = 4,
    trailing = 5,
    bottomTrailing = 6,
    bottom = 7,
    bottomLeading = 8
}
