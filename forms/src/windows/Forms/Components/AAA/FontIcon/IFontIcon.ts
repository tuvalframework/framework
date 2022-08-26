import { IControl } from './../IControl';
import { CGColor } from '@tuval/cg';
import { int } from '@tuval/core';

export interface IFontIcon extends IControl {
    FontFamily: string ;
    Size: int;
    Color: CGColor;
}