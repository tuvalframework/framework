
export * from './drawing/Graphics';
//import './drawing/GraphicsSetting';
//import './drawing/Graphics2D';
//import './drawing/GraphicsAnimate';
//import './drawing/GraphicsText';

export * from './drawing/drawing2D/GraphicsPath';
export * from './drawing/Region';
export * from './drawing/Pen';
export * from './drawing/Brush';
export * from './drawing/Font';
export * from './drawing/Icon';
export * from './drawing/Bitmap';
export * from './drawing/Image';
export * from './drawing/SolidBrush';
export * from './drawing/Brushes';
export * from './drawing/Pens';
export * from './drawing/drawing2D/GraphicsPath';
export * from './drawing/drawing2D/FillMode';

export * from './drawing/printing/PrintDocument';
export * from './drawing/printing/PageSettings';
export * from './drawing/printing/PrintPageEventArgs';
export * from './drawing/printing/PrintPageEventHandler';
export * from './drawing/Region';
export * from './drawing/drawing2D/HitTester';

export * from './drawing/sketch/index';

export * from './drawing/GeomUtilities';
export * from './GDITypes';

//export * from './drawing/Drawing2d/DashStyle';
//export * from './drawing/Drawing2d/Matrix';

export * from './drawing/ImageList';
export * from './drawing/ColorMatrix';
export * from './drawing/drawing2D/GraphicsState';
export * from './drawing/drawing2D/CompositingQuality';
export * from './drawing/InterpolationMode';
export * from './drawing/SmoothingMode';
//export * from './drawing/drawing2D/PixelOffsetMode';

//export * from './drawing/drawing2D/WrapMode';
export * from './drawing/drawing2D/PathGradientBrush';
export * from './drawing/drawing2D/HatchBrush';
export * from './drawing/drawing2D/HatchStyle';
export * from './drawing/drawing2D/LinearGradientBrush';
export * from './drawing/drawing2D/LinearGradientMode';
export * from './drawing/drawing2D/RadialGradientBrush';
export * from './drawing/drawing2D/ColorBlend';
export * from './drawing/drawing2D/Blend';
export * from './drawing/TextureBrush';
export * from './drawing/Shadow';

export * from './drawing/DashCap';
export * from './drawing/PenAlignment';
export * from './drawing/drawing2D/ColorBlend';
//export * from './drawing/drawing2D/LineCap';
//export * from './drawing/drawing2D/LineJoin';

export * from './drawing/StringFormat';
//export * from './drawing/FontStyle';
export * from './drawing/StringTrimming';
//export * from './drawing/FontFamily';
export * from './drawing/StringFormatFlags';
//export * from './drawing/StringAlignment';
export * from './drawing/GraphicsUnit';

export * from './drawing/SystemColors';
//export * from './drawing/KnownColor';
export * from './drawing/SystemPens';
export * from './drawing/SystemBrushes';
export * from './drawing/printing/PrintRange';

export * from './drawing/text';


export * from './drawing/scene';

export * from './drawing/RotateFlipType';
export * from './drawing/ContentAlignment';
export * from './UI';
export * from './drawing/createCanvasElement';
export * from './services/IMouseEventService';
export * from './TTween';
export * from './Modules';
export * from './GUIConsole';

export * from './drawing/imaging/PixelFormat';
export * from './drawing/SystemFonts';


export * from '@tuval/core';
export * from '@tuval/cg';

import { Bitmap } from './drawing/Bitmap';
import './exports';
//import './test';
import { Context } from '@tuval/core';

export const TDIModule = {
    /* __init__: ['eventBus',
        'global',
        'mouse',
        'input',
        'keyboardPP',
        'tickerPP',
        'timerPP',
        'routerPP'
    ], */
    Bitmap: ['value', Bitmap]
}

Context.Current.addModules([TDIModule]);