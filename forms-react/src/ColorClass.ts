import { ColorConverter } from "./ColorConverter";
import { int, TMath, float } from '@tuval/core';
import { alpha, lighten, darken } from './ColorManipulator';

export class _ColorClass {
    public color: string;

    public constructor(color: string) {
        let colorInfo = ColorConverter(color);
        if (colorInfo.isValid) {
            this.color = color;
        } else {
            console.error('Color not valid.');
        }
    }
    public opacity(value: float): this {
        this.color = alpha(this.color, value)
        /*  let colorInfo = ColorConverter(this.color);
         this.color = `rgba(${colorInfo.r},${colorInfo.g},${colorInfo.b},${value})`; */
        return this;
    }
    public lighten(volume: float = 0.5): this {
        this.color = lighten(this.color, volume)
        /* let colorInfo = ColorConverter(this.color);
        if (colorInfo.isValid) {
            this.color = `hsl(${colorInfo.h},${colorInfo.s}%, ${TMath.min(100, colorInfo.l * 1.1)}%)`;
        } */
        return this;
    }
    public darken(volume: float = 0.5): this {
        this.color = darken(this.color, volume)
        /* let colorInfo = ColorConverter(this.color);
        if (colorInfo.isValid) {
            this.color = `hsl(${colorInfo.h},${colorInfo.s}%, ${TMath.min(100, colorInfo.l * 1.1)}%)`;
        } */
        return this;
    }
    public toString(): string {
        return this.color;
    }
}