import type { ZStackClass } from './ZStack';
import { ControlTypes } from '../windows/Forms/Components/ControlTypes';
import { Control } from "../windows/Forms/Components/AAA/Control";
import { Event, foreach, int, List, is, throwIfEndless, StringBuilder, TMath } from '@tuval/core';
import { UIController } from './UIController';
import { IControl } from '../windows/Forms/Components/AAA/IControl';
import { Border } from "../windows/Forms/Border";
import { AppearanceObject } from "../windows/Forms/Components/AAA/AppearanceObject";
import { Message } from "../windows/Forms/Components/AAA/Message";
import { Margin } from "../windows/Forms/Margin";
import { Padding } from "../windows/Forms/Padding";
import { CGColor } from '@tuval/cg';
import { IRenderable } from './IView';
import { ControlHtmlRenderer } from "../windows/Forms/Components/AAA/HtmlRenderer/ControlHtmlRenderer";
import { Msg } from "../windows/Forms/Components/AAA/Msg";
import { IVirtualContainer, TContainerControlRenderer } from "../windows/Forms/Components/AAA/Panel";
import { ControlCollection } from "../windows/Forms/Components/AAA/ControlCollection";
import { KeyFrameCollection } from './KeyFrameCollection';
import { UniqueComponentId } from '../UniqueComponentId';
import { useRef } from '../hooks';
import { AlignmentType, cBottom, cBottomLeading, cBottomTrailing, cCenter, cLeading, cTop, cTopLeading, cTopTrailing, cTrailing, cVertical, cLeft, cRight, cHorizontal } from './Constants';
import { ColorConverter } from '../windows/Forms/Components/AAA/FontIcon/ColorConverter';
import { ColorClass } from '../tuval-system/ColorClass';



export function Color(value: string): ColorClass {
    return new ColorClass(value)
}


export namespace Color {
    export let black = new ColorClass('white');
    export let navy = new ColorClass('white');
    export let darkblue = new ColorClass('white');
    export let mediumblue = new ColorClass('white');
    export let blue = new ColorClass('white');
    export let darkgreen = new ColorClass('white');
    export let green = new ColorClass('white');
    export let teal = new ColorClass('white');
    export let darkcyan = new ColorClass('white');
    export let deepskyblue = new ColorClass('white');
    export let darkturquoise = new ColorClass('white');
    export let mediumspringgreen = new ColorClass('white');
    export let lime = new ColorClass('white');
    export let springgreen = new ColorClass('white');
    export let aqua = new ColorClass('white');
    export let cyan = new ColorClass('white');
    export let midnightblue = new ColorClass('white');
    export let dodgerblue = new ColorClass('white');
    export let lightseagreen = new ColorClass('white');
    export let forestgreen = new ColorClass('white');
    export let seagreen = new ColorClass('white');
    export let darkslategray = new ColorClass('white');
    export let limegreen = new ColorClass('white');
    export let mediumseagreen = new ColorClass('white');
    export let turquoise = new ColorClass('white');
    export let royalblue = new ColorClass('white');
    export let steelblue = new ColorClass('white');
    export let darkslateblue = new ColorClass('white');
    export let mediumturquoise = new ColorClass('white');
    export let indigo = new ColorClass('white');
    export let darkolivegreen = new ColorClass('white');
    export let cadetblue = new ColorClass('white');
    export let cornflowerblue = new ColorClass('white');
    export let rebeccapurple = new ColorClass('white');
    export let mediumaquamarine = new ColorClass('white');
    export let dimgray = new ColorClass('white');
    export let slateblue = new ColorClass('white');
    export let olivedrab = new ColorClass('white');
    export let slategray = new ColorClass('white');
    export let lightslategray = new ColorClass('white');
    export let mediumslateblue = new ColorClass('white');
    export let lawngreen = new ColorClass('white');
    export let chartreuse = new ColorClass('white');
    export let aquamarine = new ColorClass('white');
    export let maroon = new ColorClass('white');
    export let purple = new ColorClass('white');
    export let olive = new ColorClass('white');
    export let gray = new ColorClass('white');
    export let skyblue = new ColorClass('white');
    export let lightskyblue = new ColorClass('white');
    export let blueviolet = new ColorClass('white');
    export let darkred = new ColorClass('white');
    export let darkmagenta = new ColorClass('white');
    export let saddlebrown = new ColorClass('white');
    export let darkseagreen = new ColorClass('white');
    export let lightgreen = new ColorClass('white');
    export let mediumpurple = new ColorClass('white');
    export let darkviolet = new ColorClass('white');
    export let palegreen = new ColorClass('white');
    export let darkorchid = new ColorClass('white');
    export let yellowgreen = new ColorClass('white');
    export let sienna = new ColorClass('white');
    export let brown = new ColorClass('white');
    export let darkgray = new ColorClass('white');
    export let lightblue = new ColorClass('white');
    export let greenyellow = new ColorClass('white');
    export let paleturquoise = new ColorClass('white');
    export let lightsteelblue = new ColorClass('white');
    export let powderblue = new ColorClass('white');
    export let firebrick = new ColorClass('white');
    export let darkgoldenrod = new ColorClass('white');
    export let mediumorchid = new ColorClass('white');
    export let rosybrown = new ColorClass('white');
    export let darkkhaki = new ColorClass('white');
    export let silver = new ColorClass('white');
    export let mediumvioletred = new ColorClass('white');
    export let indianred = new ColorClass('white');
    export let peru = new ColorClass('white');
    export let chocolate = new ColorClass('white');
    export let tan = new ColorClass('white');
    export let lightgray = new ColorClass('white');
    export let thistle = new ColorClass('white');
    export let orchid = new ColorClass('white');
    export let goldenrod = new ColorClass('white');
    export let palevioletred = new ColorClass('white');
    export let crimson = new ColorClass('white');
    export let gainsboro = new ColorClass('white');
    export let plum = new ColorClass('white');
    export let burlywood = new ColorClass('white');
    export let lightcyan = new ColorClass('white');
    export let lavender = new ColorClass('white');
    export let darksalmon = new ColorClass('white');
    export let violet = new ColorClass('white');
    export let palegoldenrod = new ColorClass('white');
    export let lightcoral = new ColorClass('white');
    export let khaki = new ColorClass('white');
    export let aliceblue = new ColorClass('white');
    export let honeydew = new ColorClass('white');
    export let azure = new ColorClass('white');
    export let sandybrown = new ColorClass('white');
    export let wheat = new ColorClass('white');
    export let beige = new ColorClass('white');
    export let whitesmoke = new ColorClass('white');
    export let mintcream = new ColorClass('white');
    export let ghostwhite = new ColorClass('white');
    export let salmon = new ColorClass('white');
    export let antiquewhite = new ColorClass('white');
    export let linen = new ColorClass('white');
    export let lightgoldenrodyellow = new ColorClass('white');
    export let oldlace = new ColorClass('white');
    export let red = new ColorClass('white');
    export let fuchsia = new ColorClass('white');
    export let magenta = new ColorClass('white');
    export let deeppink = new ColorClass('white');
    export let orangered = new ColorClass('white');
    export let tomato = new ColorClass('white');
    export let hotpink = new ColorClass('white');
    export let coral = new ColorClass('white');
    export let darkorange = new ColorClass('white');
    export let lightsalmon = new ColorClass('white');
    export let orange = new ColorClass('white');
    export let lightpink = new ColorClass('white');
    export let pink = new ColorClass('white');
    export let gold = new ColorClass('white');
    export let peachpuff = new ColorClass('white');
    export let navajowhite = new ColorClass('white');
    export let moccasin = new ColorClass('white');
    export let bisque = new ColorClass('white');
    export let mistyrose = new ColorClass('white');
    export let blanchedalmond = new ColorClass('white');
    export let papayawhip = new ColorClass('white');
    export let lavenderblush = new ColorClass('white');
    export let seashell = new ColorClass('white');
    export let cornsilk = new ColorClass('white');
    export let lemonchiffon = new ColorClass('white');
    export let floralwhite = new ColorClass('white');
    export let snow = new ColorClass('white');
    export let yellow = new ColorClass('white');
    export let lightyellow = new ColorClass('white');
    export let ivory = new ColorClass('white');
    export let white = new ColorClass('white');

    export let blue50 = new ColorClass('#f5f9ff');
    export let blue100 = new ColorClass('#d0e1fd');
    export let blue200 = new ColorClass('#abc9fb');
    export let blue300 = new ColorClass('#85b2f9');
    export let blue400 = new ColorClass('#609af8');
    export let blue500 = new ColorClass('#3b82f6');
    export let blue600 = new ColorClass('#326fd1');
    export let blue700 = new ColorClass('#295bac');
    export let blue800 = new ColorClass('#204887');
    export let blue900 = new ColorClass('#183462');
    export let green50 = new ColorClass('#f4fcf7');
    export let green100 = new ColorClass('#caf1d8');
    export let green200 = new ColorClass('#a0e6ba');
    export let green300 = new ColorClass('#76db9b');
    export let green400 = new ColorClass('#4cd07d');
    export let green500 = new ColorClass('#22c55e');
    export let green600 = new ColorClass('#1da750');
    export let green700 = new ColorClass('#188a42');
    export let green800 = new ColorClass('#136c34');
    export let green900 = new ColorClass('#0e4f26');
    export let yellow50 = new ColorClass('#fefbf3');
    export let yellow100 = new ColorClass('#faedc4');
    export let yellow200 = new ColorClass('#f6de95');
    export let yellow300 = new ColorClass('#f2d066');
    export let yellow400 = new ColorClass('#eec137');
    export let yellow500 = new ColorClass('#eab308');
    export let yellow600 = new ColorClass('#c79807');
    export let yellow700 = new ColorClass('#a47d06');
    export let yellow800 = new ColorClass('#816204');
    export let yellow900 = new ColorClass('#5e4803');
    export let cyan50 = new ColorClass('#f3fbfd');
    export let cyan100 = new ColorClass('#c3edf5');
    export let cyan200 = new ColorClass('#94e0ed');
    export let cyan300 = new ColorClass('#65d2e4');
    export let cyan400 = new ColorClass('#35c4dc');
    export let cyan500 = new ColorClass('#06b6d4');
    export let cyan600 = new ColorClass('#059bb4');
    export let cyan700 = new ColorClass('#047f94');
    export let cyan800 = new ColorClass('#036475');
    export let cyan900 = new ColorClass('#024955');
    export let pink50 = new ColorClass('#fef6fa');
    export let pink100 = new ColorClass('#fad3e7');
    export let pink200 = new ColorClass('#f7b0d3');
    export let pink300 = new ColorClass('#f38ec0');
    export let pink400 = new ColorClass('#f06bac');
    export let pink500 = new ColorClass('#ec4899');
    export let pink600 = new ColorClass('#c93d82');
    export let pink700 = new ColorClass('#a5326b');
    export let pink800 = new ColorClass('#822854');
    export let pink900 = new ColorClass('#5e1d3d');
    export let indigo50 = new ColorClass('#f7f7fe');
    export let indigo100 = new ColorClass('#dadafc');
    export let indigo200 = new ColorClass('#bcbdf9');
    export let indigo300 = new ColorClass('#9ea0f6');
    export let indigo400 = new ColorClass('#8183f4');
    export let indigo500 = new ColorClass('#6366f1');
    export let indigo600 = new ColorClass('#5457cd');
    export let indigo700 = new ColorClass('#4547a9');
    export let indigo800 = new ColorClass('#363885');
    export let indigo900 = new ColorClass('#282960');
    export let teal50 = new ColorClass('#f3fbfb');
    export let teal100 = new ColorClass('#c7eeea');
    export let teal200 = new ColorClass('#9ae0d9');
    export let teal300 = new ColorClass('#6dd3c8');
    export let teal400 = new ColorClass('#41c5b7');
    export let teal500 = new ColorClass('#14b8a6');
    export let teal600 = new ColorClass('#119c8d');
    export let teal700 = new ColorClass('#0e8174');
    export let teal800 = new ColorClass('#0b655b');
    export let teal900 = new ColorClass('#084a42');
    export let orange50 = new ColorClass('#fff8f3');
    export let orange100 = new ColorClass('#feddc7');
    export let orange200 = new ColorClass('#fcc39b');
    export let orange300 = new ColorClass('#fba86f');
    export let orange400 = new ColorClass('#fa8e42');
    export let orange500 = new ColorClass('#f97316');
    export let orange600 = new ColorClass('#d46213');
    export let orange700 = new ColorClass('#ae510f');
    export let orange800 = new ColorClass('#893f0c');
    export let orange900 = new ColorClass('#642e09');
    export let bluegray50 = new ColorClass('#f7f8f9');
    export let bluegray100 = new ColorClass('#dadee3');
    export let bluegray200 = new ColorClass('#bcc3cd');
    export let bluegray300 = new ColorClass('#9fa9b7');
    export let bluegray400 = new ColorClass('#818ea1');
    export let bluegray500 = new ColorClass('#64748b');
    export let bluegray600 = new ColorClass('#556376');
    export let bluegray700 = new ColorClass('#465161');
    export let bluegray800 = new ColorClass('#37404c');
    export let bluegray900 = new ColorClass('#282e38');
    export let purple50 = new ColorClass('#fbf7ff');
    export let purple100 = new ColorClass('#ead6fd');
    export let purple200 = new ColorClass('#dab6fc');
    export let purple300 = new ColorClass('#c996fa');
    export let purple400 = new ColorClass('#b975f9');
    export let purple500 = new ColorClass('#a855f7');
    export let purple600 = new ColorClass('#8f48d2');
    export let purple700 = new ColorClass('#763cad');
    export let purple800 = new ColorClass('#5c2f88');
    export let purple900 = new ColorClass('#432263');
    export let red50 = new ColorClass('#fff5f5');
    export let red100 = new ColorClass('#ffd0ce');
    export let red200 = new ColorClass('#ffaca7');
    export let red300 = new ColorClass('#ff8780');
    export let red400 = new ColorClass('#ff6259');
    export let red500 = new ColorClass('#ff3d32');
    export let red600 = new ColorClass('#d9342b');
    export let red700 = new ColorClass('#b32b23');
    export let red800 = new ColorClass('#8c221c');
    export let red900 = new ColorClass('#661814');

    export let primary50 = new ColorClass('#f7f7fe');
    export let primary100 = new ColorClass('#dadafc');
    export let primary200 = new ColorClass('#bcbdf9');
    export let primary300 = new ColorClass('#9ea0f6');
    export let primary400 = new ColorClass('#8183f4');
    export let primary500 = new ColorClass('#6366f1');
    export let primary600 = new ColorClass('#5457cd');
    export let primary700 = new ColorClass('#4547a9');
    export let primary800 = new ColorClass('#363885');
    export let primary900 = new ColorClass('#282960');

    export let surfacea = new ColorClass('#ffffff');
    export let surfaceb = new ColorClass('#f8f9fa');
    export let surfacec = new ColorClass('#e9ecef');
    export let surfaced = new ColorClass('#dee2e6');
    export let surfacee = new ColorClass('#ffffff');
    export let surfacef = new ColorClass('#ffffff');
    export let textcolor = new ColorClass('#495057');
    export let textcolorsecondary = new ColorClass('#6c757d');
    export let primarycolor = new ColorClass('#6366F1');
    export let primarycolortext = new ColorClass('#ffffff');

    export let surface0 = new ColorClass('#ffffff');
    export let surface50 = new ColorClass('#FAFAFA');
    export let surface100 = new ColorClass('#F5F5F5');
    export let surface200 = new ColorClass('#EEEEEE');
    export let surface300 = new ColorClass('#E0E0E0');
    export let surface400 = new ColorClass('#BDBDBD');
    export let surface500 = new ColorClass('#9E9E9E');
    export let surface600 = new ColorClass('#757575');
    export let surface700 = new ColorClass('#616161');
    export let surface800 = new ColorClass('#424242');
    export let surface900 = new ColorClass('#212121');
    export let gray50 = new ColorClass('#FAFAFA');
    export let gray100 = new ColorClass('#F5F5F5');
    export let gray200 = new ColorClass('#EEEEEE');
    export let gray300 = new ColorClass('#E0E0E0');
    export let gray400 = new ColorClass('#BDBDBD');
    export let gray500 = new ColorClass('#9E9E9E');
    export let gray600 = new ColorClass('#757575');
    export let gray700 = new ColorClass('#616161');
    export let gray800 = new ColorClass('#424242');
    export let gray900 = new ColorClass('#212121');
    export let contentpadding = new ColorClass('1.25rem');
    export let inlinespacing = new ColorClass('0.5rem');
    export let borderradius = new ColorClass('6px;')
    export let surfaceground = new ColorClass('#eff3f8');
    export let surfacesection = new ColorClass('#ffffff');
    export let surfacecard = new ColorClass('#ffffff');
    export let surfaceoverlay = new ColorClass('#ffffff');
    export let surfaceborder = new ColorClass('#dfe7ef');
    export let surfacehover = new ColorClass('#f6f9fc');
}

Object.defineProperty(Color, 'black', { get: function () { return new ColorClass('#000000'); } });
Object.defineProperty(Color, 'navy', { get: function () { return new ColorClass('#000080'); } });
Object.defineProperty(Color, 'darkblue', { get: function () { return new ColorClass('#00008B'); } });
Object.defineProperty(Color, 'mediumblue', { get: function () { return new ColorClass('#0000CD'); } });
Object.defineProperty(Color, 'blue', { get: function () { return new ColorClass('#0000FF'); } });
Object.defineProperty(Color, 'darkgreen', { get: function () { return new ColorClass('#006400'); } });
Object.defineProperty(Color, 'green', { get: function () { return new ColorClass('#008000'); } });
Object.defineProperty(Color, 'teal', { get: function () { return new ColorClass('#008080'); } });
Object.defineProperty(Color, 'darkcyan', { get: function () { return new ColorClass('#008B8B'); } });
Object.defineProperty(Color, 'deepskyblue', { get: function () { return new ColorClass('#00BFFF'); } });
Object.defineProperty(Color, 'darkturquoise', { get: function () { return new ColorClass('#00CED1'); } });
Object.defineProperty(Color, 'mediumspringgreen', { get: function () { return new ColorClass('#00FA9A'); } });
Object.defineProperty(Color, 'lime', { get: function () { return new ColorClass('#00FF00'); } });
Object.defineProperty(Color, 'springgreen', { get: function () { return new ColorClass('#00FF7F'); } });
Object.defineProperty(Color, 'aqua', { get: function () { return new ColorClass('#00FFFF'); } });
Object.defineProperty(Color, 'cyan', { get: function () { return new ColorClass('#00FFFF'); } });
Object.defineProperty(Color, 'midnightblue', { get: function () { return new ColorClass('#191970'); } });
Object.defineProperty(Color, 'dodgerblue', { get: function () { return new ColorClass('#1E90FF'); } });
Object.defineProperty(Color, 'lightseagreen', { get: function () { return new ColorClass('#20B2AA'); } });
Object.defineProperty(Color, 'forestgreen', { get: function () { return new ColorClass('#228B22'); } });
Object.defineProperty(Color, 'seagreen', { get: function () { return new ColorClass('#2E8B57'); } });
Object.defineProperty(Color, 'darkslategray', { get: function () { return new ColorClass('#2F4F4F'); } });
Object.defineProperty(Color, 'limegreen', { get: function () { return new ColorClass('#32CD32'); } });
Object.defineProperty(Color, 'mediumseagreen', { get: function () { return new ColorClass('#3CB371'); } });
Object.defineProperty(Color, 'turquoise', { get: function () { return new ColorClass('#40E0D0'); } });
Object.defineProperty(Color, 'royalblue', { get: function () { return new ColorClass('#4169E1'); } });
Object.defineProperty(Color, 'steelblue', { get: function () { return new ColorClass('#4682B4'); } });
Object.defineProperty(Color, 'darkslateblue', { get: function () { return new ColorClass('#483D8B'); } });
Object.defineProperty(Color, 'mediumturquoise', { get: function () { return new ColorClass('#48D1CC'); } });
Object.defineProperty(Color, 'indigo', { get: function () { return new ColorClass('#4B0082'); } });
Object.defineProperty(Color, 'darkolivegreen', { get: function () { return new ColorClass('#556B2F'); } });
Object.defineProperty(Color, 'cadetblue', { get: function () { return new ColorClass('#5F9EA0'); } });
Object.defineProperty(Color, 'cornflowerblue', { get: function () { return new ColorClass('#6495ED'); } });
Object.defineProperty(Color, 'rebeccapurple', { get: function () { return new ColorClass('#663399'); } });
Object.defineProperty(Color, 'mediumaquamarine', { get: function () { return new ColorClass('#66CDAA'); } });
Object.defineProperty(Color, 'dimgray', { get: function () { return new ColorClass('#696969'); } });
Object.defineProperty(Color, 'slateblue', { get: function () { return new ColorClass('#6A5ACD'); } });
Object.defineProperty(Color, 'olivedrab', { get: function () { return new ColorClass('#6B8E23'); } });
Object.defineProperty(Color, 'slategray', { get: function () { return new ColorClass('#708090'); } });
Object.defineProperty(Color, 'lightslategray', { get: function () { return new ColorClass('#778899'); } });
Object.defineProperty(Color, 'mediumslateblue', { get: function () { return new ColorClass('#7B68EE'); } });
Object.defineProperty(Color, 'lawngreen', { get: function () { return new ColorClass('#7CFC00'); } });
Object.defineProperty(Color, 'chartreuse', { get: function () { return new ColorClass('#7FFF00'); } });
Object.defineProperty(Color, 'aquamarine', { get: function () { return new ColorClass('#7FFFD4'); } });
Object.defineProperty(Color, 'maroon', { get: function () { return new ColorClass('#800000'); } });
Object.defineProperty(Color, 'purple', { get: function () { return new ColorClass('#800080'); } });
Object.defineProperty(Color, 'olive', { get: function () { return new ColorClass('#808000'); } });
Object.defineProperty(Color, 'gray', { get: function () { return new ColorClass('#808080'); } });
Object.defineProperty(Color, 'skyblue', { get: function () { return new ColorClass('#87CEEB'); } });
Object.defineProperty(Color, 'lightskyblue', { get: function () { return new ColorClass('#87CEFA'); } });
Object.defineProperty(Color, 'blueviolet', { get: function () { return new ColorClass('#8A2BE2'); } });
Object.defineProperty(Color, 'darkred', { get: function () { return new ColorClass('#8B0000'); } });
Object.defineProperty(Color, 'darkmagenta', { get: function () { return new ColorClass('#8B008B'); } });
Object.defineProperty(Color, 'saddlebrown', { get: function () { return new ColorClass('#8B4513'); } });
Object.defineProperty(Color, 'darkseagreen', { get: function () { return new ColorClass('#8FBC8F'); } });
Object.defineProperty(Color, 'lightgreen', { get: function () { return new ColorClass('#90EE90'); } });
Object.defineProperty(Color, 'mediumpurple', { get: function () { return new ColorClass('#9370DB'); } });
Object.defineProperty(Color, 'darkviolet', { get: function () { return new ColorClass('#9400D3'); } });
Object.defineProperty(Color, 'palegreen', { get: function () { return new ColorClass('#98FB98'); } });
Object.defineProperty(Color, 'darkorchid', { get: function () { return new ColorClass('#9932CC'); } });
Object.defineProperty(Color, 'yellowgreen', { get: function () { return new ColorClass('#9ACD32'); } });
Object.defineProperty(Color, 'sienna', { get: function () { return new ColorClass('#A0522D'); } });
Object.defineProperty(Color, 'brown', { get: function () { return new ColorClass('#A52A2A'); } });
Object.defineProperty(Color, 'darkgray', { get: function () { return new ColorClass('#A9A9A9'); } });
Object.defineProperty(Color, 'lightblue', { get: function () { return new ColorClass('#ADD8E6'); } });
Object.defineProperty(Color, 'greenyellow', { get: function () { return new ColorClass('#ADFF2F'); } });
Object.defineProperty(Color, 'paleturquoise', { get: function () { return new ColorClass('#AFEEEE'); } });
Object.defineProperty(Color, 'lightsteelblue', { get: function () { return new ColorClass('#B0C4DE'); } });
Object.defineProperty(Color, 'powderblue', { get: function () { return new ColorClass('#B0E0E6'); } });
Object.defineProperty(Color, 'firebrick', { get: function () { return new ColorClass('#B22222'); } });
Object.defineProperty(Color, 'darkgoldenrod', { get: function () { return new ColorClass('#B8860B'); } });
Object.defineProperty(Color, 'mediumorchid', { get: function () { return new ColorClass('#BA55D3'); } });
Object.defineProperty(Color, 'rosybrown', { get: function () { return new ColorClass('#BC8F8F'); } });
Object.defineProperty(Color, 'darkkhaki', { get: function () { return new ColorClass('#BDB76B'); } });
Object.defineProperty(Color, 'silver', { get: function () { return new ColorClass('#C0C0C0'); } });
Object.defineProperty(Color, 'mediumvioletred', { get: function () { return new ColorClass('#C71585'); } });
Object.defineProperty(Color, 'indianred', { get: function () { return new ColorClass('#CD5C5C'); } });
Object.defineProperty(Color, 'peru', { get: function () { return new ColorClass('#CD853F'); } });
Object.defineProperty(Color, 'chocolate', { get: function () { return new ColorClass('#D2691E'); } });
Object.defineProperty(Color, 'tan', { get: function () { return new ColorClass('#D2B48C'); } });
Object.defineProperty(Color, 'lightgray', { get: function () { return new ColorClass('#D3D3D3'); } });
Object.defineProperty(Color, 'thistle', { get: function () { return new ColorClass('#D8BFD8'); } });
Object.defineProperty(Color, 'orchid', { get: function () { return new ColorClass('#DA70D6'); } });
Object.defineProperty(Color, 'goldenrod', { get: function () { return new ColorClass('#DAA520'); } });
Object.defineProperty(Color, 'palevioletred', { get: function () { return new ColorClass('#DB7093'); } });
Object.defineProperty(Color, 'crimson', { get: function () { return new ColorClass('#DC143C'); } });
Object.defineProperty(Color, 'gainsboro', { get: function () { return new ColorClass('#DCDCDC'); } });
Object.defineProperty(Color, 'plum', { get: function () { return new ColorClass('#DDA0DD'); } });
Object.defineProperty(Color, 'burlywood', { get: function () { return new ColorClass('#DEB887'); } });
Object.defineProperty(Color, 'lightcyan', { get: function () { return new ColorClass('#E0FFFF'); } });
Object.defineProperty(Color, 'lavender', { get: function () { return new ColorClass('#E6E6FA'); } });
Object.defineProperty(Color, 'darksalmon', { get: function () { return new ColorClass('#E9967A'); } });
Object.defineProperty(Color, 'violet', { get: function () { return new ColorClass('#EE82EE'); } });
Object.defineProperty(Color, 'palegoldenrod', { get: function () { return new ColorClass('#EEE8AA'); } });
Object.defineProperty(Color, 'lightcoral', { get: function () { return new ColorClass('#F08080'); } });
Object.defineProperty(Color, 'khaki', { get: function () { return new ColorClass('#F0E68C'); } });
Object.defineProperty(Color, 'aliceblue', { get: function () { return new ColorClass('#F0F8FF'); } });
Object.defineProperty(Color, 'honeydew', { get: function () { return new ColorClass('#F0FFF0'); } });
Object.defineProperty(Color, 'azure', { get: function () { return new ColorClass('#F0FFFF'); } });
Object.defineProperty(Color, 'sandybrown', { get: function () { return new ColorClass('#F4A460'); } });
Object.defineProperty(Color, 'wheat', { get: function () { return new ColorClass('#F5DEB3'); } });
Object.defineProperty(Color, 'beige', { get: function () { return new ColorClass('#F5F5DC'); } });
Object.defineProperty(Color, 'whitesmoke', { get: function () { return new ColorClass('#F5F5F5'); } });
Object.defineProperty(Color, 'mintcream', { get: function () { return new ColorClass('#F5FFFA'); } });
Object.defineProperty(Color, 'ghostwhite', { get: function () { return new ColorClass('#F8F8FF'); } });
Object.defineProperty(Color, 'salmon', { get: function () { return new ColorClass('#FA8072'); } });
Object.defineProperty(Color, 'antiquewhite', { get: function () { return new ColorClass('#FAEBD7'); } });
Object.defineProperty(Color, 'linen', { get: function () { return new ColorClass('#FAF0E6'); } });
Object.defineProperty(Color, 'lightgoldenrodyellow', { get: function () { return new ColorClass('#FAFAD2'); } });
Object.defineProperty(Color, 'oldlace', { get: function () { return new ColorClass('#FDF5E6'); } });
Object.defineProperty(Color, 'red', { get: function () { return new ColorClass('#FF0000'); } });
Object.defineProperty(Color, 'fuchsia', { get: function () { return new ColorClass('#FF00FF'); } });
Object.defineProperty(Color, 'magenta', { get: function () { return new ColorClass('#FF00FF'); } });
Object.defineProperty(Color, 'deeppink', { get: function () { return new ColorClass('#FF1493'); } });
Object.defineProperty(Color, 'orangered', { get: function () { return new ColorClass('#FF4500'); } });
Object.defineProperty(Color, 'tomato', { get: function () { return new ColorClass('#FF6347'); } });
Object.defineProperty(Color, 'hotpink', { get: function () { return new ColorClass('#FF69B4'); } });
Object.defineProperty(Color, 'coral', { get: function () { return new ColorClass('#FF7F50'); } });
Object.defineProperty(Color, 'darkorange', { get: function () { return new ColorClass('#FF8C00'); } });
Object.defineProperty(Color, 'lightsalmon', { get: function () { return new ColorClass('#FFA07A'); } });
Object.defineProperty(Color, 'orange', { get: function () { return new ColorClass('#FFA500'); } });
Object.defineProperty(Color, 'lightpink', { get: function () { return new ColorClass('#FFB6C1'); } });
Object.defineProperty(Color, 'pink', { get: function () { return new ColorClass('#FFC0CB'); } });
Object.defineProperty(Color, 'gold', { get: function () { return new ColorClass('#FFD700'); } });
Object.defineProperty(Color, 'peachpuff', { get: function () { return new ColorClass('#FFDAB9'); } });
Object.defineProperty(Color, 'navajowhite', { get: function () { return new ColorClass('#FFDEAD'); } });
Object.defineProperty(Color, 'moccasin', { get: function () { return new ColorClass('#FFE4B5'); } });
Object.defineProperty(Color, 'bisque', { get: function () { return new ColorClass('#FFE4C4'); } });
Object.defineProperty(Color, 'mistyrose', { get: function () { return new ColorClass('#FFE4E1'); } });
Object.defineProperty(Color, 'blanchedalmond', { get: function () { return new ColorClass('#FFEBCD'); } });
Object.defineProperty(Color, 'papayawhip', { get: function () { return new ColorClass('#FFEFD5'); } });
Object.defineProperty(Color, 'lavenderblush', { get: function () { return new ColorClass('#FFF0F5'); } });
Object.defineProperty(Color, 'seashell', { get: function () { return new ColorClass('#FFF5EE'); } });
Object.defineProperty(Color, 'cornsilk', { get: function () { return new ColorClass('#FFF8DC'); } });
Object.defineProperty(Color, 'lemonchiffon', { get: function () { return new ColorClass('#FFFACD'); } });
Object.defineProperty(Color, 'floralwhite', { get: function () { return new ColorClass('#FFFAF0'); } });
Object.defineProperty(Color, 'snow', { get: function () { return new ColorClass('#FFFAFA'); } });
Object.defineProperty(Color, 'yellow', { get: function () { return new ColorClass('#FFFF00'); } });
Object.defineProperty(Color, 'lightyellow', { get: function () { return new ColorClass('#FFFFE0'); } });
Object.defineProperty(Color, 'ivory', { get: function () { return new ColorClass('#FFFFF0'); } });
Object.defineProperty(Color, 'white', { get: function () { return new ColorClass('#FFFFFF'); } });

Object.defineProperty(Color, 'blue50', { get: function () { return new ColorClass('#f5f9ff'); } });
Object.defineProperty(Color, 'blue100', { get: function () { return new ColorClass('#d0e1fd'); } });
Object.defineProperty(Color, 'blue200', { get: function () { return new ColorClass('#abc9fb'); } });
Object.defineProperty(Color, 'blue300', { get: function () { return new ColorClass('#85b2f9'); } });
Object.defineProperty(Color, 'blue400', { get: function () { return new ColorClass('#609af8'); } });
Object.defineProperty(Color, 'blue500', { get: function () { return new ColorClass('#3b82f6'); } });
Object.defineProperty(Color, 'blue600', { get: function () { return new ColorClass('#326fd1'); } });
Object.defineProperty(Color, 'blue700', { get: function () { return new ColorClass('#295bac'); } });
Object.defineProperty(Color, 'blue800', { get: function () { return new ColorClass('#204887'); } });
Object.defineProperty(Color, 'blue900', { get: function () { return new ColorClass('#183462'); } });
Object.defineProperty(Color, 'green50', { get: function () { return new ColorClass('#f4fcf7'); } });
Object.defineProperty(Color, 'green100', { get: function () { return new ColorClass('#caf1d8'); } });
Object.defineProperty(Color, 'green200', { get: function () { return new ColorClass('#a0e6ba'); } });
Object.defineProperty(Color, 'green300', { get: function () { return new ColorClass('#76db9b'); } });
Object.defineProperty(Color, 'green400', { get: function () { return new ColorClass('#4cd07d'); } });
Object.defineProperty(Color, 'green500', { get: function () { return new ColorClass('#22c55e'); } });
Object.defineProperty(Color, 'green600', { get: function () { return new ColorClass('#1da750'); } });
Object.defineProperty(Color, 'green700', { get: function () { return new ColorClass('#188a42'); } });
Object.defineProperty(Color, 'green800', { get: function () { return new ColorClass('#136c34'); } });
Object.defineProperty(Color, 'green900', { get: function () { return new ColorClass('#0e4f26'); } });
Object.defineProperty(Color, 'yellow50', { get: function () { return new ColorClass('#fefbf3'); } });
Object.defineProperty(Color, 'yellow100', { get: function () { return new ColorClass('#faedc4'); } });
Object.defineProperty(Color, 'yellow200', { get: function () { return new ColorClass('#f6de95'); } });
Object.defineProperty(Color, 'yellow300', { get: function () { return new ColorClass('#f2d066'); } });
Object.defineProperty(Color, 'yellow400', { get: function () { return new ColorClass('#eec137'); } });
Object.defineProperty(Color, 'yellow500', { get: function () { return new ColorClass('#eab308'); } });
Object.defineProperty(Color, 'yellow600', { get: function () { return new ColorClass('#c79807'); } });
Object.defineProperty(Color, 'yellow700', { get: function () { return new ColorClass('#a47d06'); } });
Object.defineProperty(Color, 'yellow800', { get: function () { return new ColorClass('#816204'); } });
Object.defineProperty(Color, 'yellow900', { get: function () { return new ColorClass('#5e4803'); } });
Object.defineProperty(Color, 'cyan50', { get: function () { return new ColorClass('#f3fbfd'); } });
Object.defineProperty(Color, 'cyan100', { get: function () { return new ColorClass('#c3edf5'); } });
Object.defineProperty(Color, 'cyan200', { get: function () { return new ColorClass('#94e0ed'); } });
Object.defineProperty(Color, 'cyan300', { get: function () { return new ColorClass('#65d2e4'); } });
Object.defineProperty(Color, 'cyan400', { get: function () { return new ColorClass('#35c4dc'); } });
Object.defineProperty(Color, 'cyan500', { get: function () { return new ColorClass('#06b6d4'); } });
Object.defineProperty(Color, 'cyan600', { get: function () { return new ColorClass('#059bb4'); } });
Object.defineProperty(Color, 'cyan700', { get: function () { return new ColorClass('#047f94'); } });
Object.defineProperty(Color, 'cyan800', { get: function () { return new ColorClass('#036475'); } });
Object.defineProperty(Color, 'cyan900', { get: function () { return new ColorClass('#024955'); } });
Object.defineProperty(Color, 'pink50', { get: function () { return new ColorClass('#fef6fa'); } });
Object.defineProperty(Color, 'pink100', { get: function () { return new ColorClass('#fad3e7'); } });
Object.defineProperty(Color, 'pink200', { get: function () { return new ColorClass('#f7b0d3'); } });
Object.defineProperty(Color, 'pink300', { get: function () { return new ColorClass('#f38ec0'); } });
Object.defineProperty(Color, 'pink400', { get: function () { return new ColorClass('#f06bac'); } });
Object.defineProperty(Color, 'pink500', { get: function () { return new ColorClass('#ec4899'); } });
Object.defineProperty(Color, 'pink600', { get: function () { return new ColorClass('#c93d82'); } });
Object.defineProperty(Color, 'pink700', { get: function () { return new ColorClass('#a5326b'); } });
Object.defineProperty(Color, 'pink800', { get: function () { return new ColorClass('#822854'); } });
Object.defineProperty(Color, 'pink900', { get: function () { return new ColorClass('#5e1d3d'); } });
Object.defineProperty(Color, 'indigo50', { get: function () { return new ColorClass('#f7f7fe'); } });
Object.defineProperty(Color, 'indigo100', { get: function () { return new ColorClass('#dadafc'); } });
Object.defineProperty(Color, 'indigo200', { get: function () { return new ColorClass('#bcbdf9'); } });
Object.defineProperty(Color, 'indigo300', { get: function () { return new ColorClass('#9ea0f6'); } });
Object.defineProperty(Color, 'indigo400', { get: function () { return new ColorClass('#8183f4'); } });
Object.defineProperty(Color, 'indigo500', { get: function () { return new ColorClass('#6366f1'); } });
Object.defineProperty(Color, 'indigo600', { get: function () { return new ColorClass('#5457cd'); } });
Object.defineProperty(Color, 'indigo700', { get: function () { return new ColorClass('#4547a9'); } });
Object.defineProperty(Color, 'indigo800', { get: function () { return new ColorClass('#363885'); } });
Object.defineProperty(Color, 'indigo900', { get: function () { return new ColorClass('#282960'); } });
Object.defineProperty(Color, 'teal50', { get: function () { return new ColorClass('#f3fbfb'); } });
Object.defineProperty(Color, 'teal100', { get: function () { return new ColorClass('#c7eeea'); } });
Object.defineProperty(Color, 'teal200', { get: function () { return new ColorClass('#9ae0d9'); } });
Object.defineProperty(Color, 'teal300', { get: function () { return new ColorClass('#6dd3c8'); } });
Object.defineProperty(Color, 'teal400', { get: function () { return new ColorClass('#41c5b7'); } });
Object.defineProperty(Color, 'teal500', { get: function () { return new ColorClass('#14b8a6'); } });
Object.defineProperty(Color, 'teal600', { get: function () { return new ColorClass('#119c8d'); } });
Object.defineProperty(Color, 'teal700', { get: function () { return new ColorClass('#0e8174'); } });
Object.defineProperty(Color, 'teal800', { get: function () { return new ColorClass('#0b655b'); } });
Object.defineProperty(Color, 'teal900', { get: function () { return new ColorClass('#084a42'); } });
Object.defineProperty(Color, 'orange50', { get: function () { return new ColorClass('#fff8f3'); } });
Object.defineProperty(Color, 'orange100', { get: function () { return new ColorClass('#feddc7'); } });
Object.defineProperty(Color, 'orange200', { get: function () { return new ColorClass('#fcc39b'); } });
Object.defineProperty(Color, 'orange300', { get: function () { return new ColorClass('#fba86f'); } });
Object.defineProperty(Color, 'orange400', { get: function () { return new ColorClass('#fa8e42'); } });
Object.defineProperty(Color, 'orange500', { get: function () { return new ColorClass('#f97316'); } });
Object.defineProperty(Color, 'orange600', { get: function () { return new ColorClass('#d46213'); } });
Object.defineProperty(Color, 'orange700', { get: function () { return new ColorClass('#ae510f'); } });
Object.defineProperty(Color, 'orange800', { get: function () { return new ColorClass('#893f0c'); } });
Object.defineProperty(Color, 'orange900', { get: function () { return new ColorClass('#642e09'); } });
Object.defineProperty(Color, 'bluegray50', { get: function () { return new ColorClass('#f7f8f9'); } });
Object.defineProperty(Color, 'bluegray100', { get: function () { return new ColorClass('#dadee3'); } });
Object.defineProperty(Color, 'bluegray200', { get: function () { return new ColorClass('#bcc3cd'); } });
Object.defineProperty(Color, 'bluegray300', { get: function () { return new ColorClass('#9fa9b7'); } });
Object.defineProperty(Color, 'bluegray400', { get: function () { return new ColorClass('#818ea1'); } });
Object.defineProperty(Color, 'bluegray500', { get: function () { return new ColorClass('#64748b'); } });
Object.defineProperty(Color, 'bluegray600', { get: function () { return new ColorClass('#556376'); } });
Object.defineProperty(Color, 'bluegray700', { get: function () { return new ColorClass('#465161'); } });
Object.defineProperty(Color, 'bluegray800', { get: function () { return new ColorClass('#37404c'); } });
Object.defineProperty(Color, 'bluegray900', { get: function () { return new ColorClass('#282e38'); } });
Object.defineProperty(Color, 'purple50', { get: function () { return new ColorClass('#fbf7ff'); } });
Object.defineProperty(Color, 'purple100', { get: function () { return new ColorClass('#ead6fd'); } });
Object.defineProperty(Color, 'purple200', { get: function () { return new ColorClass('#dab6fc'); } });
Object.defineProperty(Color, 'purple300', { get: function () { return new ColorClass('#c996fa'); } });
Object.defineProperty(Color, 'purple400', { get: function () { return new ColorClass('#b975f9'); } });
Object.defineProperty(Color, 'purple500', { get: function () { return new ColorClass('#a855f7'); } });
Object.defineProperty(Color, 'purple600', { get: function () { return new ColorClass('#8f48d2'); } });
Object.defineProperty(Color, 'purple700', { get: function () { return new ColorClass('#763cad'); } });
Object.defineProperty(Color, 'purple800', { get: function () { return new ColorClass('#5c2f88'); } });
Object.defineProperty(Color, 'purple900', { get: function () { return new ColorClass('#432263'); } });
Object.defineProperty(Color, 'red50', { get: function () { return new ColorClass('#fff5f5'); } });
Object.defineProperty(Color, 'red100', { get: function () { return new ColorClass('#ffd0ce'); } });
Object.defineProperty(Color, 'red200', { get: function () { return new ColorClass('#ffaca7'); } });
Object.defineProperty(Color, 'red300', { get: function () { return new ColorClass('#ff8780'); } });
Object.defineProperty(Color, 'red400', { get: function () { return new ColorClass('#ff6259'); } });
Object.defineProperty(Color, 'red500', { get: function () { return new ColorClass('#ff3d32'); } });
Object.defineProperty(Color, 'red600', { get: function () { return new ColorClass('#d9342b'); } });
Object.defineProperty(Color, 'red700', { get: function () { return new ColorClass('#b32b23'); } });
Object.defineProperty(Color, 'red800', { get: function () { return new ColorClass('#8c221c'); } });
Object.defineProperty(Color, 'red900', { get: function () { return new ColorClass('#661814'); } });
Object.defineProperty(Color, 'primary50', { get: function () { return new ColorClass('#f7f7fe'); } });
Object.defineProperty(Color, 'primary100', { get: function () { return new ColorClass('#dadafc'); } });
Object.defineProperty(Color, 'primary200', { get: function () { return new ColorClass('#bcbdf9'); } });
Object.defineProperty(Color, 'primary300', { get: function () { return new ColorClass('#9ea0f6'); } });
Object.defineProperty(Color, 'primary400', { get: function () { return new ColorClass('#8183f4'); } });
Object.defineProperty(Color, 'primary500', { get: function () { return new ColorClass('#6366f1'); } });
Object.defineProperty(Color, 'primary600', { get: function () { return new ColorClass('#5457cd'); } });
Object.defineProperty(Color, 'primary700', { get: function () { return new ColorClass('#4547a9'); } });
Object.defineProperty(Color, 'primary800', { get: function () { return new ColorClass('#363885'); } });
Object.defineProperty(Color, 'primary900', { get: function () { return new ColorClass('#282960'); } });


Object.defineProperty(Color, 'surfacea', { get: function () { new ColorClass('#ffffff') } });
Object.defineProperty(Color, 'surfaceb', { get: function () { new ColorClass('#f8f9fa') } });
Object.defineProperty(Color, 'surfacec', { get: function () { new ColorClass('#e9ecef') } });
Object.defineProperty(Color, 'surfaced', { get: function () { new ColorClass('#dee2e6') } });
Object.defineProperty(Color, 'surfacee', { get: function () { new ColorClass('#ffffff') } });
Object.defineProperty(Color, 'surfacef', { get: function () { new ColorClass('#ffffff') } });
Object.defineProperty(Color, 'textcolor', { get: function () { new ColorClass('#495057') } });
Object.defineProperty(Color, 'textcolorsecondary', { get: function () { new ColorClass('#6c757d') } });
Object.defineProperty(Color, 'primarycolor', { get: function () { new ColorClass('#6366F1') } });
Object.defineProperty(Color, 'primarycolortext', { get: function () { new ColorClass('#ffffff') } });
Object.defineProperty(Color, 'surface0', { get: function () { new ColorClass('#ffffff') } });
Object.defineProperty(Color, 'surface50', { get: function () { new ColorClass('#FAFAFA') } });
Object.defineProperty(Color, 'surface100', { get: function () { new ColorClass('#F5F5F5') } });
Object.defineProperty(Color, 'surface200', { get: function () { new ColorClass('#EEEEEE') } });
Object.defineProperty(Color, 'surface300', { get: function () { new ColorClass('#E0E0E0') } });
Object.defineProperty(Color, 'surface400', { get: function () { new ColorClass('#BDBDBD') } });
Object.defineProperty(Color, 'surface500', { get: function () { new ColorClass('#9E9E9E') } });
Object.defineProperty(Color, 'surface600', { get: function () { new ColorClass('#757575') } });
Object.defineProperty(Color, 'surface700', { get: function () { new ColorClass('#616161') } });
Object.defineProperty(Color, 'surface800', { get: function () { new ColorClass('#424242') } });
Object.defineProperty(Color, 'surface900', { get: function () { new ColorClass('#212121') } });
Object.defineProperty(Color, 'gray50', { get: function () { new ColorClass('#FAFAFA') } });
Object.defineProperty(Color, 'gray100', { get: function () { new ColorClass('#F5F5F5') } });
Object.defineProperty(Color, 'gray200', { get: function () { new ColorClass('#EEEEEE') } });
Object.defineProperty(Color, 'gray300', { get: function () { new ColorClass('#E0E0E0') } });
Object.defineProperty(Color, 'gray400', { get: function () { new ColorClass('#BDBDBD') } });
Object.defineProperty(Color, 'gray500', { get: function () { new ColorClass('#9E9E9E') } });
Object.defineProperty(Color, 'gray600', { get: function () { new ColorClass('#757575') } });
Object.defineProperty(Color, 'gray700', { get: function () { new ColorClass('#616161') } });
Object.defineProperty(Color, 'gray800', { get: function () { new ColorClass('#424242') } });
Object.defineProperty(Color, 'gray900', { get: function () { new ColorClass('#212121') } });

Object.defineProperty(Color, 'surfaceground', { get: function () { new ColorClass('#eff3f8') } });
Object.defineProperty(Color, 'surfacesection', { get: function () { new ColorClass('#ffffff') } });
Object.defineProperty(Color, 'surfacecard', { get: function () { new ColorClass('#ffffff') } });
Object.defineProperty(Color, 'surfaceoverlay', { get: function () { new ColorClass('#ffffff') } });
Object.defineProperty(Color, 'surfaceborder', { get: function () { new ColorClass('#dfe7ef') } });
Object.defineProperty(Color, 'surfacehover', { get: function () { new ColorClass('#f6f9fc') } });


export class UITemplate {
    public primary50: ColorClass = new ColorClass('#f7f7fe');
    public primary100: ColorClass = new ColorClass('#dadafc');
    public primary200: ColorClass = new ColorClass('#bcbdf9');
    public primary300: ColorClass = new ColorClass('#9ea0f6');
    public primary400: ColorClass = new ColorClass('#8183f4');
    public primary500: ColorClass = new ColorClass('#6366f1');
    public primary600: ColorClass = new ColorClass('#5457cd');
    public primary700: ColorClass = new ColorClass('#4547a9');
    public primary800: ColorClass = new ColorClass('#363885');
    public primary900: ColorClass = new ColorClass('#282960');

    public surfacea: ColorClass = new ColorClass('#ffffff');
    public surfaceb: ColorClass = new ColorClass('#f8f9fa');
    public surfacec: ColorClass = new ColorClass('#e9ecef');
    public surfaced: ColorClass = new ColorClass('#dee2e6');
    public surfacee: ColorClass = new ColorClass('#ffffff');
    public surfacef: ColorClass = new ColorClass('#ffffff');
    public textcolor: ColorClass = new ColorClass('#495057');
    public textcolorsecondary: ColorClass = new ColorClass('#6c757d');
    public primarycolor: ColorClass = new ColorClass('#6366F1');
    public primarycolortext: ColorClass = new ColorClass('#ffffff');

    public surface0: ColorClass = new ColorClass('#ffffff');
    public surface50: ColorClass = new ColorClass('#FAFAFA');
    public surface100: ColorClass = new ColorClass('#F5F5F5');
    public surface200: ColorClass = new ColorClass('#EEEEEE');
    public surface300: ColorClass = new ColorClass('#E0E0E0');
    public surface400: ColorClass = new ColorClass('#BDBDBD');
    public surface500: ColorClass = new ColorClass('#9E9E9E');
    public surface600: ColorClass = new ColorClass('#757575');
    public surface700: ColorClass = new ColorClass('#616161');
    public surface800: ColorClass = new ColorClass('#424242');
    public surface900: ColorClass = new ColorClass('#212121');
    public gray50: ColorClass = new ColorClass('#FAFAFA');
    public gray100: ColorClass = new ColorClass('#F5F5F5');
    public gray200: ColorClass = new ColorClass('#EEEEEE');
    public gray300: ColorClass = new ColorClass('#E0E0E0');
    public gray400: ColorClass = new ColorClass('#BDBDBD');
    public gray500: ColorClass = new ColorClass('#9E9E9E');
    public gray600: ColorClass = new ColorClass('#757575');
    public gray700: ColorClass = new ColorClass('#616161');
    public gray800: ColorClass = new ColorClass('#424242');
    public gray900: ColorClass = new ColorClass('#212121');
    public contentpadding: ColorClass = new ColorClass('1.25rem');
    public inlinespacing: ColorClass = new ColorClass('0.5rem');
    public borderradius: ColorClass = new ColorClass('6px;')
    public surfaceground: ColorClass = new ColorClass('#eff3f8');
    public surfacesection: ColorClass = new ColorClass('#ffffff');
    public surfacecard: ColorClass = new ColorClass('#ffffff');
    public surfaceoverlay: ColorClass = new ColorClass('#ffffff');
    public surfaceborder: ColorClass = new ColorClass('#dfe7ef');
    public surfacehover: ColorClass = new ColorClass('#f6f9fc');

    public fontFamily: string = 'font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol;';
    public contentPadding: string = '1.25rem';
    public inlineSpacing: string = '0.5rem';
    public borderRadius: string = '6px';
    public focusRing: string = '0 0 0 0.2rem #C7D2FE';
    public maskbg: string = 'rgba(0, 0, 0, 0.4)';
}

const DefaultPaddingValue = '1rem';
const DefaultMarginValue = '5px';
export interface StyleAttribute {
    default?: string | ColorClass;
    hover?: string | ColorClass;
    active?: string | ColorClass;
    disabled?: string | ColorClass;
    focus?: string | ColorClass;
    before?: string | ColorClass;
}
export type FontWeightModifierTypes = 'normal' | 'bold' | 'lighter' | 'bolder' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | 'inherit' | 'initial' | 'revert' | 'unset';
export type TextAligns = 'left' | 'right' | 'center' | 'justify' | 'initial' | 'inherit';
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

export function ViewProperty(defaultValue?: any): any/* PropertyDecorator */ {
    return (target: Object, key: string) => {
        const eventDescriptor: Object = {
            set: function (newValue: Function): void {
                this.propertyBag[key] = newValue;
            },
            get: function (): any {
                if (this.propertyBag == null) {
                    this.propertyBag = {};
                }
                return this.propertyBag[key];
            },
            enumerable: true,
            configurable: true
        };
        Object.defineProperty(target, key, eventDescriptor);

    };
}

export class UIView implements IVirtualContainer, IControl, IRenderable {
    private propertyBag: any = {};

    public PropertyBag(value: any): this {
        this.propertyBag = { ...this.propertyBag, ...value };
        return this;
    }

    @ViewProperty() _initial: any;
    @ViewProperty() _animate: any;
    @ViewProperty() _transition: any;
    @ViewProperty() _whileHover: any;
    @ViewProperty() _whileTap: any;
    @ViewProperty() _whileDrag: any;
    @ViewProperty() _whileFocus: any;
    @ViewProperty() _whileInView: any;
    @ViewProperty() _exit: any;

    @ViewProperty() renderAsAnimated: boolean;

    @ViewProperty()
    protected SubViews: List<IRenderable>;

    public controller: UIController;

    protected Renderer: ControlHtmlRenderer<any>;


    @ViewProperty() vp_Alias: string;
    @ViewProperty() vp_UseCache: boolean;

    @ViewProperty()
    public Text: string;

    @ViewProperty()
    public Tooltip: string;

    @ViewProperty()
    public Appearance: AppearanceObject
    //public AppearanceChanged:Event<any>;
    @ViewProperty()
    public HoverAppearance: AppearanceObject;

    @ViewProperty()
    public FocusAppearance: AppearanceObject;

    @ViewProperty()
    public ActiveAppearance: AppearanceObject;

    @ViewProperty()
    public DisabledAppearance: AppearanceObject;

    @ViewProperty()
    public BeforeAppearance: AppearanceObject;

    @ViewProperty()
    public PropertyChanged: Event<any>;

    @ViewProperty()
    public UpdateRequied: Event<any>;

    //#region IVirtualContainer
    @ViewProperty()
    Controls: ControlCollection<any, any>;


    @ViewProperty()
    public vp_TableHeaderWidth: string;

    @ViewProperty()
    public vp_TableHeaderHeight: string;

    @ViewProperty()
    public vp_Skeleton: boolean;

    @ViewProperty()
    public vp_Disabled: boolean;
    public disabled(value: boolean): this {
        this.vp_Disabled = value;
        return this;
    }

    public GetViews(): IRenderable[] {
        return this.SubViews.ToArray();
    }
    //#endregion

    public setController(controller: UIController): this {
        this.controller = controller;
        // Default renderer
        this.Renderer = new TContainerControlRenderer({
            control: this,
            doNotBind: true,
            renderId: false
        });
        return this;
    }

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

    public constructor() {

        this._initial = {};
        this._animate = {};
        this._transition = {};
        this._whileHover = {};
        this._whileTap = {};
        this._whileDrag = {};
        this._whileFocus = {};

        this.Appearance = new AppearanceObject(this);
        this.HoverAppearance = new AppearanceObject(this);
        this.FocusAppearance = new AppearanceObject(this);
        this.ActiveAppearance = new AppearanceObject(this);
        this.DisabledAppearance = new AppearanceObject(this);
        this.BeforeAppearance = new AppearanceObject(this);


        //this.Appearance.Width = 'inherit';
        this.Appearance.Cursor = 'inherit';
        this.Appearance.BoxSizing = 'border-box';

        this.Appearance.Border = '0 solid #e5e7eb';

        /*   this.Appearance.WordBreak = 'break-all';
          this.Appearance.WordWrap = 'break-word'; */

        this.Visible = true;

        this.KeyFrameCollection = [];

        this.SubViews = new List();

        //this.AppearanceChanged = new Event();
    }
    OnLoaded(): void {
        //throw new Error("Method not implemented.");
    }
    OnUnLoaded(): void {
        //throw new Error("Method not implemented.");
    }

    public OnAppearanceChanged(name: string): void {

    }

    @ViewProperty()
    TabIndex: int = null;

    @ViewProperty()
    BackgroundColor: string;

    @ViewProperty()
    Padding: Padding;

    @ViewProperty()
    Border: Border;

    @ViewProperty()
    Margin: Margin;

    @ViewProperty()
    Id: string;

    @ViewProperty(true)
    Visible: boolean = true;

    @ViewProperty(true)
    public KeyFrameCollection: KeyFrameCollection[] = [];

    //#region OnClick
    @ViewProperty(true)
    private _Clicked: Event<any> = new Event();

    @ViewProperty(true)
    private _DbClicked: Event<any> = new Event();

    @ViewProperty(true)
    private _MouseDown: Event<any> = new Event();

    @ViewProperty(true)
    private _KeyDown: Event<any> = new Event();

    @ViewProperty(true) vp_SetFocus: Event<any> = new Event();
    @ViewProperty(true) vp_KillFocus: Event<any> = new Event();

    protected WmClick(nativeEvent: any) {
        if (is.function(this._Clicked) && !(this.vp_Disabled === true)) {
            this._Clicked(nativeEvent);
        }
    }
    public onClick(func: Function): this {
        this._Clicked = func as any;
        return this;
    }

    public FireClick(nativeEvent?: any) {
        if (is.function(this._Clicked) && !(this.vp_Disabled === true)) {
            this._Clicked(nativeEvent);
        }
    }

    protected WmDbClick(nativeEvent: any) {
        this._DbClicked(nativeEvent);
    }
    public onDbClick(func: Function): this {
        this._DbClicked = func as any;
        return this;
    }

    protected WmMouseDown(nativeEvent: any) {
        this._MouseDown(nativeEvent);
    }
    public onMouseDown(func: Function): this {
        this._MouseDown = func as any;
        return this;
    }

    protected WmKeyDown(nativeEvent: any) {
        this._KeyDown(nativeEvent);
    }
    public onKeyDown(func: Function): this {
        this._KeyDown = func as any;
        return this;
    }

    protected WmSetFocus(nativeEvent: any) {
        this.vp_SetFocus(nativeEvent);
    }
    public onFocus(func: Function): this {
        this.vp_SetFocus = func as any;
        return this;
    }

    protected WmKillFocus(nativeEvent: any) {
        this.vp_KillFocus(nativeEvent);
    }
    public onLostFocus(func: Function): this {
        this.vp_KillFocus = func as any;
        return this;
    }

    //#endregion
    WndProc(msg: Message) {
        switch (msg.Msg) {
            case Msg.WM_CLICK:
                this.WmClick(msg.WParam);
                break;
            case Msg.WM_DBCLICK:
                this.WmDbClick(msg.WParam);
                break;
            case Msg.WM_MOUSEDOWN:
                this.WmMouseDown(msg.WParam);
                break;
            case Msg.WM_KEYDOWN:
                this.WmKeyDown(msg.WParam);
                break;
            case Msg.WM_SETFOCUS:
                this.WmSetFocus(msg.WParam);
                break;
            case Msg.WM_KILLFOCUS:
                this.WmKillFocus(msg.WParam);
                break;
        }
    }


    public AddSubView(subView: UIView | IControl | UIController) {
        this.SubViews.Add(subView);
    }
    public Ref(refFunc: Function) {
        //refFunc(this.GetControl());
        return this;
    }
    protected IsChildValid(renderable: IRenderable): boolean {
        return true;
    }

    protected DoFlatten(...args: (UIView | IControl | UIController)[]): IRenderable[] {
        const result: IRenderable[] = [];
        foreach(args, (item: UIView | IControl | UIController) => {
            if (Array.isArray(item)) {
                for (let i = 0; i < item.length; i++) {
                    if (this.IsChildValid(item[i])) {
                        result.push(item[i]);
                    }
                }
            } else {
                if (this.IsChildValid(item)) {
                    result.push(item);
                }
            }
        })
        return result;
    }

    public setChilds(...args: (UIView | IControl | UIController)[]) {
        foreach(this.DoFlatten(...args), (item: IRenderable) => {
            if (this.IsChildValid(item)) {
                this.SubViews.Add(item);
            }
        })
        return this;
    }

    public If(_case: boolean, func: Function): this {
        if (_case) {
            func(this);
        }
        return this;
    }

    public ForEach(enumarable: any, enumFunc: Function) {
        let index: int = 0;
        foreach(enumarable, (item: any) => {
            index++;
            const subView = enumFunc(item, index);
            if (subView instanceof UIView) {
                this.setChilds(subView);
            }
        });
        return this;
    }

    public Render() {
        if (this.Visible) {
            return this.Renderer.render();
        }
    }
    public ForceUpdate() { }

    public tabIndex(value: int): this {
        this.TabIndex = value;
        return this;
    }
    public zIndex(value: int): this {
        this.Appearance.ZIndex = value.toString();
        return this;
    }

    public animation(value: KeyFrameCollection, time: string): this {
        this.KeyFrameCollection.push(value);

        // Set animation
        foreach(this.SubViews as any, (view: UIView) => {
            view.Appearance.Animation = `${value.Name} ${time}`
        })
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
        if (value.disabled != null) {
            this.DisabledAppearance.StylePropertyBag[name] = value.disabled;
        }
        if (value.focus != null) {
            this.FocusAppearance.StylePropertyBag[name] = value.focus;
        }
        return this;
    }
    public tooltip(value: string): this {
        this.Tooltip = value;
        return this;
    }
    public visible(value: boolean): this {
        if (value === true) {
            this.Visible = true;
            this.Appearance.Visibility = 'visible';
        } else {
            this.Visible = false;
            this.Appearance.Visibility = 'hidden';
        }
        return this;
    }

    /*     public position(value: PositionTypes): this;
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
        } */

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
            return this;
        }
        throw 'Argument Exception in ' + this.constructor.name + '::border function.';
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

    public width(): this;
    public width(value: int): this;
    public width(value: string): this;
    public width(value: StyleAttribute): this;
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
            return this;
        }

        throw `ArgumentOutOfRange Exception in UIView::maxHeight method. Argument count: ${args.length}`;
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
    public background(zstack: ZStackClass): this;
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
        } else if (args.length === 1 && is.typeof<ZStackClass>(args[0], ControlTypes.UIKit.ZStack)) {
            const zstack: ZStackClass = args[0];
            zstack.Appearance.Position = 'absolute';
            zstack.Appearance.ZIndex = '-1';
            zstack.Appearance.Left = '0px';
            zstack.Appearance.Top = '0px';
            this.AddSubView(zstack);
            return this;
        } else if (args.length === 1 && typeof args[0] === 'object') {
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

        this.OnAppearanceChanged('Padding');
        return this;
    }

    public paddingLeft(value: string) {
        this.Appearance.PaddingLeft = value;
        this.OnAppearanceChanged('PaddingLeft');
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

    protected createStyles() {
        const sb = new StringBuilder();

        const styleObject = this.Appearance.GetStyleObject();
        if (Object.keys(styleObject).length > 0) {

            sb.AppendLine(`:host {`);
            for (let key in styleObject) {
                if (!is.nullOrEmpty(styleObject[key])) {
                    sb.AppendLine(`${key}:${styleObject[key]} !important;`);
                }
            }
            sb.AppendLine(`}`);
        }


        const hoverStyleObject = this.HoverAppearance.GetStyleObject();
        if (Object.keys(hoverStyleObject).length > 0) {

            sb.AppendLine(`:host(:hover) {`);
            for (let key in hoverStyleObject) {
                if (!is.nullOrEmpty(hoverStyleObject[key])) {
                    sb.AppendLine(`${key}:${hoverStyleObject[key]} !important;`);
                }
            }
            sb.AppendLine(`}`);
        }

        const activeStyleObject = this.ActiveAppearance.GetStyleObject();
        if (Object.keys(activeStyleObject).length > 0) {

            sb.AppendLine(`:host(:active) {`);
            for (let key in activeStyleObject) {
                if (!is.nullOrEmpty(activeStyleObject[key])) {
                    sb.AppendLine(`${key}:${activeStyleObject[key]} !important;`);
                }
            }
            sb.AppendLine(`}`);
        }

        const disabledStyleObject = this.DisabledAppearance.GetStyleObject();
        if (Object.keys(disabledStyleObject).length > 0) {

            sb.AppendLine(`:host([disabled] ) {`);
            for (let key in disabledStyleObject) {
                if (!is.nullOrEmpty(disabledStyleObject[key])) {
                    sb.AppendLine(`${key}:${disabledStyleObject[key]} !important;`);
                }
            }
            sb.AppendLine(`}`);
        }

        const focusStyleObject = this.FocusAppearance.GetStyleObject();
        if (Object.keys(focusStyleObject).length > 0) {

            sb.AppendLine(`:host(:focus) {`);
            for (let key in focusStyleObject) {
                if (!is.nullOrEmpty(focusStyleObject[key])) {
                    sb.AppendLine(`${key}:${focusStyleObject[key]} !important;`);
                }
            }
            sb.AppendLine(`}`);
        }

        const keyframesCollections: KeyFrameCollection[] = this.KeyFrameCollection;
        for (let i = 0; i < keyframesCollections.length; i++) {
            sb.AppendLine(keyframesCollections[i].ToString());
        }


        return sb.ToString();

    }

    public alias(value: string): this {
        this.vp_Alias = value;
        return this;
    }
    public useCache(value: boolean): this {
        this.vp_UseCache = value;
        return this;
    }

    public tableHeaderWidth(value: string): this {
        this.vp_TableHeaderWidth = value;
        return this;
    }
    public tableHeaderHeight(value: string): this {
        this.vp_TableHeaderHeight = value;
        return this;
    }

    public skeleton(value: boolean): this {
        this.vp_Skeleton = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_variant: string;
    public variant(value: string): this {
        this.vp_variant = value;
        return this;
    }

}