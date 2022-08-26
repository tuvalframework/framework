import { FontFamily } from './FontFamily';
import { float } from '@tuval/core';
import { DisposableBase } from '@tuval/core';
// import * as opentype from 'opentype.js'
import { ClassInfo } from '@tuval/core';
import { FontStyle } from '../FontStyle';
import { StringAlignment } from '../StringAlignment';
import { IContext2D } from '../IContext2D';
import { CoreGraphicTypes } from '../types';
/* import 'tiny-inflate';
import 'opentype.js'; */

 @ClassInfo({
    fullName: CoreGraphicTypes.CGFont,
    instanceof: [
        CoreGraphicTypes.CGFont
    ]
})
export abstract class CGFont extends DisposableBase {
    private fontFamily: /* opentype.Font | */ FontFamily = undefined as any;
    private textLeading: float = 0;
    private textSize: float = 0;
    private textStyle: FontStyle = FontStyle.Regular;
    private horizAlign: StringAlignment = StringAlignment.Near;
    private vertAlign: StringAlignment = StringAlignment.Near;
    private myName: string = '';

    public get Name(): string {
        return this.myName;
    }
    public set Name(value: string) {
        this.myName = value;
    }
    public get Size(): number {
        return this.textSize;
    }

    public set Size(value: number) {
        this.textSize = value;
    }

    public get Style(): FontStyle {
        return this.textStyle;
    }

    public get GdiCharSet(): number {
        console.error('font.GdiCharSet not implemented.');
        return 0;
    }


    public get TextLeading(): float {
        return this.textLeading;
    }


    public get TextStyle(): FontStyle {
        return this.textStyle;
    }

    public get HorizAlign(): StringAlignment {
        return this.horizAlign;
    }

    public get VertAlign(): StringAlignment {
        return this.vertAlign;
    }

    public get FontFamily(): /* opentype.Font | */ FontFamily {
        return this.fontFamily;
    }

    constructor(fontFamily: /* opentype.Font | */ FontFamily | string, size: float) {
        super();
        if (fontFamily instanceof FontFamily) {
            this.fontFamily = fontFamily;
            this.Name = fontFamily.Name;
            this.Size = size;
        } else if (typeof fontFamily === 'string') {
            this.Name = fontFamily;
            this.Size = size;
        }
    }
    public abstract setup(graphics: IContext2D): void;

    public abstract getHeight(): number ;
    public abstract getTextWidth(text: string): number;

    public equals(font: CGFont): boolean {
        return false;
    }
}
