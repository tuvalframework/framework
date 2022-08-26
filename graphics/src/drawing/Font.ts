import { IContext2D } from '@tuval/cg';
import { CGContext2D } from '@tuval/cg';
import { float } from '@tuval/core';
import { CGFont } from '@tuval/cg';
import { FontStyle } from './FontStyle';
import { FontFamily } from './FontFamily';
import { DisposableBase } from '@tuval/core';
import { StringAlignment } from './StringAlignment';
import { Graphics, GraphicsBase } from './Graphics';
// import * as opentype from 'opentype.js'
import { ClassInfo } from '@tuval/core';
import { GraphicTypes } from '../GDITypes';
import { createCanvas } from './scene/utils/Canvas';
/* import 'tiny-inflate';
import 'opentype.js'; */
import { int } from '@tuval/core';
import { measureFont, IFontMetrics } from './fontMeasure';

const pxToEmArray: float[] = [];
pxToEmArray[4] = 0.250;
pxToEmArray[5] = 0.3125;
pxToEmArray[6] = 0.375;
pxToEmArray[7] = 0.4375;
pxToEmArray[8] = 0.500;
pxToEmArray[9] = 0.5625;
pxToEmArray[10] = 0.625;
pxToEmArray[11] = 0.6875;
pxToEmArray[12] = 0.750;
pxToEmArray[13] = 0.8125;

pxToEmArray[14] = 0.875;
pxToEmArray[15] = 0.9375;
pxToEmArray[16] = 1.000;
pxToEmArray[17] = 1.0625;
pxToEmArray[18] = 1.125;
pxToEmArray[19] = 1.1875;
pxToEmArray[20] = 1.250;
pxToEmArray[21] = 1.3125;
pxToEmArray[22] = 1.375;

pxToEmArray[23] = 1.4375;
pxToEmArray[24] = 1.500;
pxToEmArray[25] = 1.5625;
pxToEmArray[26] = 1.625;
pxToEmArray[27] = 1.6875;
pxToEmArray[28] = 1.75;
pxToEmArray[29] = 1.8125;
pxToEmArray[30] = 1.875;
pxToEmArray[31] = 1.9375;
pxToEmArray[32] = 2.00;
/*
4 PX	0.250 EM	25%
5 PX	0.3125 EM	31.25%
6 PX	0.375 EM	37.5%
7 PX	0.4375 EM	43.75%
8 PX	0.500 EM	50.0%
9 PX	0.5625 EM	56.25%
10 PX	0.625 EM	62.5%
11 PX	0.6875 EM	68.75%
12 PX	0.750 EM	75.0%
13 PX	0.8125 EM	81.25%
14 PX	0.875 EM	87.5%
15 PX	0.9375 EM	93.75%
16 PX	1.000 EM	100.0%
17 PX	1.0625 EM	106.25%
18 PX	1.125 EM	112.5%
19 PX	1.1875 EM	118.75%
20 PX	1.250 EM	125.0%
21 PX	1.3125 EM	131.25%
22 PX	1.375 EM	137.5%
23 PX	1.4375 EM	143.75%
24 PX	1.500 EM	150.0%
25 PX	1.5625 EM	156.25%
26 PX	1.625 EM	162.5%
27 PX	1.6875 EM	168.75%
28 PX	1.75 EM	175.0%
29 PX	1.8125 EM	181.25%
30 PX	1.875 EM	187.5%
31 PX	1.9375 EM	193.75%
32 PX	2.00 EM	200.0% */
@ClassInfo({
    fullName: GraphicTypes.Font,
    instanceof: [
        GraphicTypes.Font
    ]
})
export class Font extends CGFont {
    private static _ctx: CanvasRenderingContext2D = createCanvas().getContext("2d") as any;

    public get Height(): int {
        return this.Size;
    }

    constructor(fontFamily: /* opentype.Font | */ FontFamily | string, size: float) {
        super(fontFamily, size);

    }
    public setup(graphics: IContext2D) {
        const a = 'sdasd';
        //if (graphics instanceof GraphicsBase) {
        graphics.setFont(this);
        //}
    }

    protected _prepContext(ctx) {
        ctx.font = `${this.Size}px ${this.Name}`
        switch (this.HorizAlign) {
            case StringAlignment.Near:
                ctx.textAlign = "left";
                break;
            case StringAlignment.Center:
                ctx.textAlign = "center";
                break;
            case StringAlignment.Far:
                ctx.textAlign = "right";
                break;
        }
        switch (this.VertAlign) {
            case StringAlignment.Near:
                ctx.textBaseline = "top";
                break;
            case StringAlignment.Center:
                ctx.textBaseline = "middle";
                break;
            case StringAlignment.Far:
                ctx.textBaseline = "bottom";
                break;
        }

        ctx.lineJoin = "miter";
        ctx.miterLimit = 2.5;
        return ctx;
    }
    public getHeight(): number {
        // TODO: fix this
        //console.error('font.getHeight not implemented.');
        return (this as any).textSize;
    }
    public getTextWidth(text: string): number {
        let ctx = Font._ctx;
        ctx.save();
        const w = this._prepContext(ctx).measureText(text).width;
        ctx.restore();
        return w;
    }

    public equals(font: Font): boolean {
        return false;
    }

    public GetCellAscent(): float {
        const metics: IFontMetrics = measureFont(this.Name, {
            'fontSize': this.Height, 'fontWeight': this.Style === FontStyle.Bold ? 400 : 100,
            'fontStyle': this.Style === FontStyle.Italic ? 'italic' : 'normal'
        });
        return metics.ascent;
    }
    public GetHeight(): float {
        const metics: IFontMetrics = measureFont(this.Name, {
            'fontSize': this.Height , 'fontWeight': this.Style === FontStyle.Bold ? 400 : 100,
            'fontStyle': this.Style === FontStyle.Italic ? 'italic' : 'normal'
        });
        return metics.lineHeight;
    }

}
