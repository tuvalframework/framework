import { float, Out, byte, toByte, newOutEmpty, IEquatable, Convert } from '@tuval/core';
import { ColorConversion } from "./ColorConversion";
import { NotImplementedException, ArgumentException } from "@tuval/core";
import { ClassInfo } from "@tuval/core";
import { lerp } from "@tuval/core";
import { namedColors } from "./namedColors";
import { KnownColor } from "./KnownColor";
import { KnownColors } from "./KnownColors";
import { COLORS } from "./colors";
import { SketchColor } from "./SketchColor";
import { CoreGraphicTypes } from "../types";


const WHITESPACE = /\s*/; // Match zero or more whitespace characters.
const INTEGER = /(\d{1,3})/; // Match integers: 79, 255, etc.
const DECIMAL = /((?:\d+(?:\.\d+)?)|(?:\.\d+))/; // Match 129.6, 79, .9, etc.
const PERCENT = new RegExp(DECIMAL.source + '%'); // Match 12.9%, 79%, .9%, etc.

const colorPatterns = {
    // Match colors in format #XXX, e.g. #416.
    HEX3: /^#([a-f0-9])([a-f0-9])([a-f0-9])$/i,

    // Match colors in format #XXXX, e.g. #5123.
    HEX4: /^#([a-f0-9])([a-f0-9])([a-f0-9])([a-f0-9])$/i,

    // Match colors in format #XXXXXX, e.g. #b4d455.
    HEX6: /^#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i,

    // Match colors in format #XXXXXXXX, e.g. #b4d45535.
    HEX8: /^#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i,

    // Match colors in format rgb(R, G, B), e.g. rgb(255, 0, 128).
    RGB: new RegExp(
        [
            '^rgb\\(',
            INTEGER.source,
            ',',
            INTEGER.source,
            ',',
            INTEGER.source,
            '\\)$'
        ].join(WHITESPACE.source),
        'i'
    ),

    // Match colors in format rgb(R%, G%, B%), e.g. rgb(100%, 0%, 28.9%).
    RGB_PERCENT: new RegExp(
        [
            '^rgb\\(',
            PERCENT.source,
            ',',
            PERCENT.source,
            ',',
            PERCENT.source,
            '\\)$'
        ].join(WHITESPACE.source),
        'i'
    ),

    // Match colors in format rgb(R, G, B, A), e.g. rgb(255, 0, 128, 0.25).
    RGBA: new RegExp(
        [
            '^rgba\\(',
            INTEGER.source,
            ',',
            INTEGER.source,
            ',',
            INTEGER.source,
            ',',
            DECIMAL.source,
            '\\)$'
        ].join(WHITESPACE.source),
        'i'
    ),

    // Match colors in format rgb(R%, G%, B%, A), e.g. rgb(100%, 0%, 28.9%, 0.5).
    RGBA_PERCENT: new RegExp(
        [
            '^rgba\\(',
            PERCENT.source,
            ',',
            PERCENT.source,
            ',',
            PERCENT.source,
            ',',
            DECIMAL.source,
            '\\)$'
        ].join(WHITESPACE.source),
        'i'
    ),

    // Match colors in format hsla(H, S%, L%), e.g. hsl(100, 40%, 28.9%).
    HSL: new RegExp(
        [
            '^hsl\\(',
            INTEGER.source,
            ',',
            PERCENT.source,
            ',',
            PERCENT.source,
            '\\)$'
        ].join(WHITESPACE.source),
        'i'
    ),

    // Match colors in format hsla(H, S%, L%, A), e.g. hsla(100, 40%, 28.9%, 0.5).
    HSLA: new RegExp(
        [
            '^hsla\\(',
            INTEGER.source,
            ',',
            PERCENT.source,
            ',',
            PERCENT.source,
            ',',
            DECIMAL.source,
            '\\)$'
        ].join(WHITESPACE.source),
        'i'
    ),

    // Match colors in format hsb(H, S%, B%), e.g. hsb(100, 40%, 28.9%).
    HSB: new RegExp(
        [
            '^hsb\\(',
            INTEGER.source,
            ',',
            PERCENT.source,
            ',',
            PERCENT.source,
            '\\)$'
        ].join(WHITESPACE.source),
        'i'
    ),

    // Match colors in format hsba(H, S%, B%, A), e.g. hsba(100, 40%, 28.9%, 0.5).
    HSBA: new RegExp(
        [
            '^hsba\\(',
            INTEGER.source,
            ',',
            PERCENT.source,
            ',',
            PERCENT.source,
            ',',
            DECIMAL.source,
            '\\)$'
        ].join(WHITESPACE.source),
        'i'
    )
}

const constants = {
    RGB: 'rgb',
    /**
     * @property {String} HSB
     * @final
     */
    HSB: 'hsb',
    /**
     * @property {String} HSL
     * @final
     */
    HSL: 'hsl'
}

@ClassInfo({
    fullName: CoreGraphicTypes.CGColor,
    instanceof: [
        CoreGraphicTypes.CGColor
    ]
})
export class CGColor implements IEquatable<CGColor> {
    // private value: number[] = [];
    private levels: number[] = [];
    private _array: float[] = []
    private maxes: { [key: string]: number[] } = {
        rgb: [255, 255, 255, 255],
        hsb: [360, 100, 100, 1],
        hsl: [360, 100, 100, 1]
    };
    private myR: number = 0;
    private myG: number = 0;
    private myB: number = 0;
    private myA: number = 0;
    private mode: string = constants.RGB;

    private hsba: number[] = undefined as any;
    private hsla: number[] = undefined as any;

    public get Levels(): number[] {
        return this.levels;
    }


    public constructor(gray: number, alpha?: number);
    public constructor(v1: number, v2: number, v3: number, alpha?: number);
    public constructor(namedColor: string);
    public constructor(rgba: number[]);
    public constructor(...args: any[]) {
        /* if (args.length === 1) {
            this.value = args[0];
        } else if (args.length === 4) {
            this.value[1] = args[0];
            this.value[2] = args[1];
            this.value[3] = args[2];
            this.value[0] = args[3];
        } else if (args.length === 3) {
            this.value[1] = args[0];
            this.value[2] = args[1];
            this.value[3] = args[2];
        } */
        if (args.length === 1 && Array.isArray(args[0])) {
            const rgba = args[0];
            args = new Array(4);
            args[0] = rgba[0];
            args[1] = rgba[1];
            args[2] = rgba[2];
            args[3] = rgba[3];
        }

        if (this.mode !== constants.RGB &&
            this.mode !== constants.HSL &&
            this.mode !== constants.HSB
        ) {
            throw new Error(this.mode + ' is an invalid colorMode.');
        } else {
            this._array = this._parseInputs(...args);
        }

        // Expose closest screen color.
        this._calculateLevels();
        return this;
    }

    public static FromSketchColor(value: byte);
    public static FromSketchColor(value: string);
    public static FromSketchColor(values: Array<byte>);
    public static FromSketchColor(gray: byte, alpha: byte);
    public static FromSketchColor(v1: byte, v2: byte, v3: byte);
    public static FromSketchColor(v1: byte, v2: byte, v3: byte, alpha: byte);
    public static FromSketchColor(...args: any[]): CGColor {
        let sc: SketchColor = undefined as any;;
        if (args.length === 1) {
            sc = new SketchColor(args[0]);
        } else if (args.length === 2) {
            sc = new SketchColor(args[0], args[1]);
        } else if (args.length === 3) {
            sc = new SketchColor(args[0], args[1], args[2]);
        } else if (args.length === 4) {
            sc = new SketchColor(args[0], args[1], args[2], args[3]);
        }
        return sc.toColor();
    }
    private _calculateLevels() {
        const array: number[] = this._array;
        // (loop backwards for performance)
        const levels: number[] = (this.levels = new Array(array.length));
        for (let i = array.length - 1; i >= 0; --i) {
            levels[i] = Math.round(array[i] * 255);
        }
    }
    //private _parseInputs(namedColor: string): number[];
    //private _parseInputs(r: number, g: number, b: number, a: number): number[]
    private _parseInputs(...args: any[]): number[] {
        const r: any = args[0];
        const g: any = args[1];
        const b: any = args[2];
        const a: any = args[3];

        const numArgs: number = arguments.length;
        const mode: string = this.mode;
        const maxes: number[] = this.maxes[mode];
        let results: number[] = [];
        let i;

        if (numArgs >= 3) {
            // Argument is a list of component values.

            results[0] = r / maxes[0];
            results[1] = g / maxes[1];
            results[2] = b / maxes[2];

            // Alpha may be undefined, so default it to 100%.
            if (typeof a === 'number') {
                results[3] = a / maxes[3];
            } else {
                results[3] = 1;
            }

            // Constrain components to the range [0,1].
            // (loop backwards for performance)
            for (i = results.length - 1; i >= 0; --i) {
                const result = results[i];
                if (result < 0) {
                    results[i] = 0;
                } else if (result > 1) {
                    results[i] = 1;
                }
            }

            // Convert to RGBA and return.
            if (mode === constants.HSL) {
                return ColorConversion.HslaToRGBA(results);
            } else if (mode === constants.HSB) {
                return ColorConversion.HsbaToRGBA(results);
            } else {
                return results;
            }
        } else if (numArgs === 1 && typeof r === 'string') {
            const str: string = (<any>r).trim().toLowerCase();

            // Return if string is a named colour.
            if (namedColors[str]) {
                return this._parseInputs(namedColors[str]);
            }

            // Try RGBA pattern matching.
            if (colorPatterns.HEX3.test(str)) {
                // #rgb
                results = (colorPatterns.HEX3 as any).exec(str)
                    .slice(1)
                    .map(function (color) {
                        return parseInt(color + color, 16) / 255;
                    });
                results[3] = 1;
                return results;
            } else if (colorPatterns.HEX6.test(str)) {
                // #rrggbb
                results = (colorPatterns.HEX6 as any).exec(str)
                    .slice(1)
                    .map(function (color) {
                        return parseInt(color, 16) / 255;
                    });
                results[3] = 1;
                return results;
            } else if (colorPatterns.HEX4.test(str)) {
                // #rgba
                results = (colorPatterns.HEX4 as any).exec(str)
                    .slice(1)
                    .map(function (color) {
                        return parseInt(color + color, 16) / 255;
                    });
                return results;
            } else if (colorPatterns.HEX8.test(str)) {
                // #rrggbbaa
                results = (colorPatterns.HEX8 as any).exec(str)
                    .slice(1)
                    .map(function (color) {
                        return parseInt(color, 16) / 255;
                    });
                return results;
            } else if (colorPatterns.RGB.test(str)) {
                // rgb(R,G,B)
                results = (colorPatterns.RGB as any).exec(str)
                    .slice(1)
                    .map(function (color: any) {
                        return color / 255;
                    });
                results[3] = 1;
                return results;
            } else if (colorPatterns.RGB_PERCENT.test(str)) {
                // rgb(R%,G%,B%)
                results = (colorPatterns.RGB_PERCENT as any).exec(str)
                    .slice(1)
                    .map(function (color) {
                        return parseFloat(color) / 100;
                    });
                results[3] = 1;
                return results;
            } else if (colorPatterns.RGBA.test(str)) {
                // rgba(R,G,B,A)
                results = (colorPatterns.RGBA as any).exec(str)
                    .slice(1)
                    .map(function (color: any, idx: number) {
                        if (idx === 3) {
                            return parseFloat(color);
                        }
                        return color / 255;
                    });
                return results;
            } else if (colorPatterns.RGBA_PERCENT.test(str)) {
                // rgba(R%,G%,B%,A%)
                results = (colorPatterns.RGBA_PERCENT as any).exec(str)
                    .slice(1)
                    .map(function (color, idx) {
                        if (idx === 3) {
                            return parseFloat(color);
                        }
                        return parseFloat(color) / 100;
                    });
                return results;
            }

            // Try HSLA pattern matching.
            if (colorPatterns.HSL.test(str)) {
                // hsl(H,S,L)
                results = (colorPatterns.HSL as any).exec(str)
                    .slice(1)
                    .map(function (color, idx) {
                        if (idx === 0) {
                            return parseInt(color, 10) / 360;
                        }
                        return parseInt(color, 10) / 100;
                    });
                results[3] = 1;
            } else if (colorPatterns.HSLA.test(str)) {
                // hsla(H,S,L,A)
                results = (colorPatterns.HSLA as any).exec(str)
                    .slice(1)
                    .map(function (color, idx) {
                        if (idx === 0) {
                            return parseInt(color, 10) / 360;
                        } else if (idx === 3) {
                            return parseFloat(color);
                        }
                        return parseInt(color, 10) / 100;
                    });
            }
            results = results.map(function (value) {
                return Math.max(Math.min(value, 1), 0);
            });
            if (results.length) {
                return ColorConversion.HslaToRGBA(results);
            }

            // Try HSBA pattern matching.
            if (colorPatterns.HSB.test(str)) {
                // hsb(H,S,B)
                results = (colorPatterns.HSB as any).exec(str)
                    .slice(1)
                    .map(function (color: any, idx: number) {
                        if (idx === 0) {
                            return parseInt(color, 10) / 360;
                        }
                        return parseInt(color, 10) / 100;
                    });
                results[3] = 1;
            } else if (colorPatterns.HSBA.test(str)) {
                // hsba(H,S,B,A)
                results = (colorPatterns.HSBA as any).exec(str)
                    .slice(1)
                    .map(function (color: any, idx: number) {
                        if (idx === 0) {
                            return parseInt(color, 10) / 360;
                        } else if (idx === 3) {
                            return parseFloat(color);
                        }
                        return parseInt(color, 10) / 100;
                    });
            }

            if (results.length) {
                // (loop backwards for performance)
                for (i = results.length - 1; i >= 0; --i) {
                    results[i] = Math.max(Math.min(results[i], 1), 0);
                }

                return ColorConversion.HsbaToRGBA(results);
            }

            // Input did not match any CSS color pattern: default to white.
            results = [1, 1, 1, 1];
        } else if ((numArgs === 1 || numArgs === 2) && typeof r === 'number') {
            // 'Grayscale' mode.

            /**
             * For HSB and HSL, interpret the gray level as a brightness/lightness
             * value (they are equivalent when chroma is zero). For RGB, normalize the
             * gray level according to the blue maximum.
             */
            results[0] = r / maxes[2];
            results[1] = r / maxes[2];
            results[2] = r / maxes[2];

            // Alpha may be undefined, so default it to 100%.
            if (typeof g === 'number') {
                results[3] = g / maxes[3];
            } else {
                results[3] = 1;
            }

            // Constrain components to the range [0,1].
            results = results.map(function (value) {
                return Math.max(Math.min(value, 1), 0);
            });
        } else {
            throw new Error(arguments + 'is not a valid color representation.');
        }

        return results;
    }

    public static FromRgba(color: number): CGColor;
    public static FromRgba(red: number, green: number, blue: number): CGColor;
    public static FromRgba(red: number, green: number, blue: number, alpha: number,): CGColor;
    public static FromRgba(color: CGColor, alpha: number,): CGColor;
    public static FromRgba(...args: any[]): CGColor {
        if (args.length === 1) {
            return CGColor.FromRgba(args[0], args[0], args[0], 255);
        } else if (args.length === 3) {
            return CGColor.FromRgba(args[0], args[1], args[2], 255);
        } else if (args.length === 4) {
            if ((args[1] > 255) || (args[1] < 0))
                throw CGColor.CreateColorArgumentException(args[0], "red");
            if ((args[2] > 255) || (args[2] < 0))
                throw CGColor.CreateColorArgumentException(args[2], "green");
            if ((args[3] > 255) || (args[3] < 0))
                throw CGColor.CreateColorArgumentException(args[3], "blue");
            if ((args[0] > 255) || (args[0] < 0))
                throw CGColor.CreateColorArgumentException(args[0], "alpha");

            const color: CGColor = new CGColor(args[0], args[1], args[2], args[3]);

            return color;
        } else if (args.length === 2) {
            const baseColor: CGColor = args[0];
            return CGColor.FromRgba(baseColor.R, baseColor.G, baseColor.B, args[1]);
        } else if (args.length === 1) {
            return new CGColor(args[0]);
        }

        return CGColor.Empty;
    }

    public static FromHSBA(hue: float, saturation: float, brightness: float, alpha: float = 1): CGColor {
        const maxes: number[] = [360, 100, 100, 1];
        const h: float = hue / maxes[0];
        const s: float = saturation / maxes[1];
        const b: float = brightness / maxes[2];
        const a: float = (alpha >= 0 && alpha <= 1) ? alpha : 1;
        const rgba: number[] = ColorConversion.HsbaToRGBA([h, s, b, a]);
        return new CGColor(Math.round(rgba[0] * 255), Math.round(rgba[1] * 255), Math.round(rgba[2] * 255), Math.round(rgba[3] * 255));
    }

    public static FromHSLA(hue: float, saturation: float, lightness: float, alpha: float = 1): CGColor {
        const maxes: number[] = [360, 100, 100, 1];
        const h: float = hue / maxes[0];
        const s: float = saturation / maxes[1];
        const l: float = lightness / maxes[2];
        const a: float = (alpha >= 0 && alpha <= 1) ? alpha : 1;
        const rgba: number[] = ColorConversion.HslaToRGBA([h, s, l, a]);
        return new CGColor(Math.round(rgba[0] * 255), Math.round(rgba[1] * 255), Math.round(rgba[2] * 255), Math.round(rgba[3] * 255));
    }

    public toRgba(): number[] {
        //FIX ME:
        return [this.R, this.G, this.B, this.A];
    }
    public toInt(): number {
        //FIX ME:
        return Convert.ToInt32((this.A << 24) + (this.R << 16) + (this.G << 8) + this.B);
    }

    public clone(): CGColor {
        return CGColor.FromRgba(this.R, this.G, this.B, this.A);
    }

    public static FromKnownColor(color: KnownColor): CGColor {
        return KnownColors.FromKnownColor(color);
    }

    public static FromName(name: string): CGColor {
        let argb: Out<number[]> = newOutEmpty();
        if (KnownColors.ArgbByName.tryGetValue(name, argb)) {
            return new CGColor(argb.value[1], argb.value[2], argb.value[3]);
        }
        return new CGColor([0, 0, 0, 0]);
    }
    public static get Empty(): CGColor {
        return new CGColor(0, 0, 0, 0);
    }

    public static GetRGBAString(obj: { red: number, green: number, blue: number, alpha: number }): string {
        var red = obj.red || 0,
            green = obj.green || 0,
            blue = obj.blue || 0,
            alpha = obj.alpha || 1;

        return ['rgba(', red, ',', green, ',', blue, ',', alpha, ')'].join(
            ''
        );
    }

    public static RgbToHex(r: number, g: number, b: number): string {
        return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);

        /* function componentToHex(c: number) {
          var hex = c.toString(16);
          return hex.length == 1 ? "0" + hex : hex;
        }
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);  */
    }

    public static RgbaToHex(r: number, g: number, b: number, a: number): string {
        return ((a << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    public static HexToRgb(hex: string): { r: number, g: number, b: number } {
        const HASH = "#";
        const EMPTY_STRING = "";
        hex = hex.replace(HASH, EMPTY_STRING);
        var bigint = parseInt(hex, 16);
        return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255
        };
    }

    public static GetRandomColor(): string {
        let randColor = ((Math.random() * 0xffffff) << 0).toString(16);
        while (randColor.length < 6) {
            randColor = '0' + randColor;
        }
        return '#' + randColor;
    }

    public static ColorToRGBA(str: string): { r: number, g: number, b: number, a: number } {
        str = str || "black";
        return (
            CGColor.NamedColorToRBA(str) ||
            CGColor.Hex3ColorToRGBA(str) ||
            CGColor.Hex6ColorToRGBA(str) ||
            CGColor.RgbColorToRGBA(str) ||
            CGColor.RgbaColorToRGBA(str)
        );
    }
    public static NamedColorToRBA(str: string): { r: number, g: number, b: number, a: number } {
        var c = COLORS[str.toLowerCase()];
        if (!c) {
            return null as any;
        }
        return {
            r: c[0],
            g: c[1],
            b: c[2],
            a: 1
        };
    }

    // Parse rgb(n, n, n)
    public static RgbColorToRGBA(str: string): { r: number, g: number, b: number, a: number } {
        if (str.indexOf("rgb(") === 0) {
            str = (str as any).match(/rgb\(([^)]+)\)/)[1];
            var parts = str.split(/ *, */).map(Number);
            return {
                r: parts[0],
                g: parts[1],
                b: parts[2],
                a: 1
            };
        }
        return null as any;
    }

    public static RgbaColorToRGBA(str: string): { r: number, g: number, b: number, a: number } {
        if (str.indexOf("rgba(") === 0) {
            str = (str as any).match(/rgba\(([^)]+)\)/)[1];
            var parts = str.split(/ *, */).map(Number);
            return {
                r: parts[0],
                g: parts[1],
                b: parts[2],
                a: parts[3]
            };
        }
        return undefined as any;
    }

    // Parse #nnnnnn
    public static Hex6ColorToRGBA(str: string): { r: number, g: number, b: number, a: number } {
        if (str[0] === "#" && str.length === 7) {
            return {
                r: parseInt(str.slice(1, 3), 16),
                g: parseInt(str.slice(3, 5), 16),
                b: parseInt(str.slice(5, 7), 16),
                a: 1
            };
        }
        return undefined as any;
    }
    // Parse #nnn
    public static Hex3ColorToRGBA(str: string): { r: number, g: number, b: number, a: number } {
        if (str[0] === "#" && str.length === 4) {
            return {
                r: parseInt(str[1] + str[1], 16),
                g: parseInt(str[2] + str[2], 16),
                b: parseInt(str[3] + str[3], 16),
                a: 1
            };
        }
        return undefined as any;
    }

    public getBrightness(): float {
        const minval: byte = toByte(Math.min(this.R, Math.min(this.G, this.B)));
        const maxval: byte = toByte(Math.max(this.R, Math.max(this.G, this.B)));

        return (maxval + minval) / 510;
    }

    public getSaturation(): float {
        const minval: byte = toByte(Math.min(this.R, Math.min(this.G, this.B)));
        const maxval: byte = toByte(Math.max(this.R, Math.max(this.G, this.B)));

        if (maxval === minval) {
            return 0.0;
        }

        let sum: number = maxval + minval;
        if (sum > 255)
            sum = 510 - sum;

        return (maxval - minval) / sum;
    }

    public getHue(): float {
        const r: number = this.R;
        const g: number = this.G;
        const b: number = this.B;
        const minval: byte = toByte(Math.min(r, Math.min(g, b)));
        const maxval: byte = toByte(Math.max(r, Math.max(g, b)));

        if (maxval === minval)
            return 0.0;

        const diff: float = (maxval - minval);
        const rnorm: float = (maxval - r) / diff;
        const gnorm: float = (maxval - g) / diff;
        const bnorm: float = (maxval - b) / diff;

        let hue: float = 0.0;
        if (r === maxval) {
            hue = 60.0 * (6.0 + bnorm - gnorm);
        }
        if (g === maxval) {
            hue = 60.0 * (2.0 + rnorm - bnorm);
        }
        if (b === maxval) {
            hue = 60.0 * (4.0 + gnorm - rnorm);
        }
        if (hue > 360.0) {
            hue = hue - 360.0;
        }

        return hue;
    }

    public getLightness(): number {
        if (!this.hsla) {
            this.hsla = ColorConversion.RgbaToHSLA(this._array);
        }
        return this.hsla[2] * this.maxes[constants.HSL][2];
    }
    public ToKnownColor(): KnownColor {
        throw new NotImplementedException('CGColor.ToKnownColor');
    }

    public get IsEmpty(): boolean {
        return this.A === 0 && this.R === 0 && this.G === 0 && this.B === 0;
    }

    public get A(): byte {
        return this._getAlpha();
    }
    public set A(value: byte) {
        this._setAlpha(value);
    }

    private _getAlpha(): byte {
        return this._array[3] * this.maxes[this.mode][3];
    };

    private _setAlpha(new_alpha: byte) {
        this._array[3] = new_alpha / this.maxes[this.mode][3];
        this._calculateLevels();
    }

    /**
     * Returns the alpha component value in a Color structure.
     */
    public get R(): byte {
        return this._getRed();
    }
    public set R(value: byte) {
        this._setRed(value);
    }

    private _setRed(new_red: byte) {
        this._array[0] = new_red / this.maxes[constants.RGB][0];
        this._calculateLevels();
    }
    private _getRed(): number {
        return this._array[0] * this.maxes[constants.RGB][0];
    };

    public get G(): byte {
        return this._getGreen();
    }
    public set G(value: byte) {
        this._setGreen(value);
    }

    private _setGreen(new_green: byte) {
        this._array[1] = new_green / this.maxes[constants.RGB][1];
        this._calculateLevels();
    }

    private _getGreen(): number {
        return this._array[1] * this.maxes[constants.RGB][1];
    }

    public get B(): byte {
        return this._getBlue();
    }
    public set B(value: byte) {
        this._setBlue(value);
    }

    private _getBlue(): number {
        return this._array[2] * this.maxes[constants.RGB][2];
    }

    private _setBlue(new_blue: byte) {
        this._array[2] = new_blue / this.maxes[constants.RGB][2];
        this._calculateLevels();
    };

    public Equals = (color: CGColor): boolean =>
        this.A === color.A && this.R === color.R && this.G === color.G && this.B === color.B;

    public notEquals = (color: CGColor): boolean =>
        this.A !== color.A || this.R !== color.R || this.G !== color.G || this.B !== color.B;

    /*  public /*override*/ /*toString(): string {
         if (this.IsEmpty)
             return "Color [Empty]";

         return "Color [A=" + this.A + ", R=" + this.R + ", G=" + this.G + ", B=" + this.B;
     } */

    private static CreateColorArgumentException(value: number, color: string): ArgumentException {
        return new ArgumentException(value + " is not a valid"
            + " value for '" + color + "'. '" + color + "' should be greater or equal to 0 and"
            + " less than or equal to 255.");
    }

    public static get Transparent(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.Transparent]);
    }

    public static get AliceBlue(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.AliceBlue]);
    }

    public static get AntiqueWhite(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.AntiqueWhite]);
    }

    public static get Aqua(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.Aqua]);
    }

    public static get Aquamarine(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.Aquamarine]);
    }

    public static get Azure(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.Azure]);
    }

    public static get Beige(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.Beige]);
    }

    public static get Bisque(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.Bisque]);
    }

    public static get Black(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.Black]);
    }

    public static get BlanchedAlmond(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.BlanchedAlmond]);
    }

    public static get Blue(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.Blue]);
    }

    public static get BlueViolet(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.BlueViolet]);
    }

    public static get Brown(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.Brown]);
    }

    public static get BurlyWood(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.BurlyWood]);
    }

    public static get CadetBlue(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.CadetBlue]);
    }

    public static get Chartreuse(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.Chartreuse]);
    }

    public static get Chocolate(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.Coral]);
    }

    public static get Coral(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.Coral]);
    }

    public static get CornflowerBlue(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.CornflowerBlue]);
    }

    public static get Cornsilk(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.Cornsilk]);
    }

    public static get Crimson(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.Crimson]);
    }

    public static get Cyan(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.Cyan]);
    }

    public static get DarkBlue(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.DarkBlue]);
    }

    public static get DarkCyan(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.DarkCyan]);
    }

    public static get DarkGoldenrod(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.DarkGoldenrod]);
    }

    public static get DarkGray(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.DarkGray]);
    }

    public static get DarkGreen(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.DarkGreen]);
    }

    public static get DarkKhaki(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.DarkKhaki]);
    }

    public static get DarkMagenta(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.DarkMagenta]);
    }

    public static get DarkOliveGreen(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.DarkOliveGreen]);
    }

    public static get DarkOrange(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.DarkOrange]);
    }

    public static get DarkOrchid(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.DarkOrchid]);
    }

    public static get DarkRed(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.DarkRed]);
    }

    public static get DarkSalmon(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.DarkSalmon]);
    }

    public static get DarkSeaGreen(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.DarkSeaGreen]);
    }

    public static get DarkSlateBlue(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.DarkSlateBlue]);
    }

    public static get DarkSlateGray(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.DarkSlateGray]);
    }

    public static get DarkTurquoise(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.DarkTurquoise]);
    }

    public static get DarkViolet(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.DarkViolet]);
    }

    public static get DeepPink(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.DeepPink]);
    }

    public static get DeepSkyBlue(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.DeepSkyBlue]);
    }

    public static get DimGray(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.DimGray]);
    }

    public static get DodgerBlue(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.DodgerBlue]);
    }

    public static get Firebrick(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.Firebrick]);
    }

    public static get FloralWhite(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.FloralWhite]);
    }

    public static get ForestGreen(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.ForestGreen]);
    }

    public static get Fuchsia(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.Fuchsia]);
    }

    public static get Gainsboro(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.Gainsboro]);
    }

    public static get GhostWhite(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.GhostWhite]);
    }

    public static get Gold(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.Gold]);
    }

    public static get Goldenrod(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.Goldenrod]);
    }

    public static get Gray(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.Gray]);
    }

    public static get Green(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.Green]);
    }

    public static get GreenYellow(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.GreenYellow]);
    }

    public static get Honeydew(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.Honeydew]);
    }

    public static get HotPink(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.HotPink]);
    }

    public static get IndianRed(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.IndianRed]);
    }

    public static get Indigo(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.Indigo]);
    }

    public static get Ivory(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.Ivory]);
    }

    public static get Khaki(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.Khaki]);
    }

    public static get Lavender(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.Lavender]);
    }

    public static get LavenderBlush(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.LavenderBlush]);
    }

    public static get LawnGreen(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.LawnGreen]);
    }

    public static get LemonChiffon(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.LemonChiffon]);
    }

    public static get LightBlue(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.LightBlue]);
    }

    public static get LightCoral(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.LightCoral]);
    }

    public static get LightCyan(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.LightCyan]);
    }

    public static get LightGoldenrodYellow(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.LightGoldenrodYellow]);
    }

    public static get LightGreen(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.LightGreen]);
    }

    public static get LightGray(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.LightGray]);
    }

    public static get LightPink(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.LightPink]);
    }

    public static get LightSalmon(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.LightSalmon]);
    }

    public static get LightSeaGreen(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.LightSeaGreen]);
    }

    public static get LightSkyBlue(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.LightSkyBlue]);
    }

    public static get LightSlateGray(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.LightSlateGray]);
    }

    public static get LightSteelBlue(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.LightSteelBlue]);
    }

    public static get LightYellow(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.LightYellow]);
    }

    public static get Lime(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.Lime]);
    }

    public static get LimeGreen(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.LimeGreen]);
    }

    public static get Linen(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.Linen]);
    }

    public static get Magenta(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.Magenta]);
    }

    public static get Maroon(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.Maroon]);
    }

    public static get MediumAquamarine(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.MediumAquamarine]);
    }

    public static get MediumBlue(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.MediumBlue]);
    }

    public static get MediumOrchid(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.MediumOrchid]);
    }

    public static get MediumPurple(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.MediumPurple]);
    }

    public static get MediumSeaGreen(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.MediumSeaGreen]);
    }

    public static get MediumSlateBlue(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.MediumSlateBlue]);
    }

    public static get MediumSpringGreen(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.MediumSpringGreen]);
    }

    public static get MediumTurquoise(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.MediumTurquoise]);
    }

    public static get MediumVioletRed(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.MediumVioletRed]);
    }

    public static get MidnightBlue(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.MidnightBlue]);
    }

    public static get MintCream(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.MintCream]);
    }

    public static get MistyRose(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.MistyRose]);
    }

    public static get Moccasin(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.Moccasin]);
    }

    public static get NavajoWhite(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.NavajoWhite]);
    }

    public static get Navy(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.Navy]);
    }

    public static get OldLace(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.OldLace]);
    }

    public static get Olive(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.Olive]);
    }

    public static get OliveDrab(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.OliveDrab]);
    }

    public static get Orange(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.Orange]);
    }

    public static get OrangeRed(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.OrangeRed]);
    }

    public static get Orchid(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.Orchid]);
    }

    public static get PaleGoldenrod(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.PaleGoldenrod]);
    }

    public static get PaleGreen(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.PaleGreen]);
    }

    public static get PaleTurquoise(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.PaleTurquoise]);
    }

    public static get PaleVioletRed(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.PaleVioletRed]);
    }

    public static get PapayaWhip(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.PapayaWhip]);
    }

    public static get PeachPuff(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.PeachPuff]);
    }

    public static get Peru(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.Peru]);
    }

    public static get Pink(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.Pink]);
    }

    public static get Plum(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.Plum]);
    }

    public static get PowderBlue(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.PowderBlue]);
    }

    public static get Purple(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.Purple]);
    }

    public static get Red(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.Red]);
    }

    public static get RosyBrown(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.RosyBrown]);
    }

    public static get RoyalBlue(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.RoyalBlue]);
    }

    public static get SaddleBrown(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.SaddleBrown]);
    }

    public static get Salmon(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.Salmon]);
    }

    public static get SandyBrown(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.SandyBrown]);
    }

    public static get SeaGreen(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.SeaGreen]);
    }

    public static get SeaShell(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.SeaShell]);
    }

    public static get Sienna(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.Sienna]);
    }

    public static get Silver(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.Silver]);
    }

    public static get SkyBlue(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.SkyBlue]);
    }

    public static get SlateBlue(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.SlateBlue]);
    }

    public static get SlateGray(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.SlateGray]);
    }

    public static get Snow(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.Snow]);
    }

    public static get SpringGreen(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.SpringGreen]);
    }

    public static get SteelBlue(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.SteelBlue]);
    }

    public static get Tan(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.Tan]);
    }

    public static get Teal(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.Teal]);
    }

    public static get Thistle(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.Thistle]);
    }

    public static get Tomato(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.Tomato]);
    }

    public static get Turquoise(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.Turquoise]);
    }

    public static get Violet(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.Violet]);
    }

    public static get Wheat(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.Wheat]);
    }

    public static get White(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.White]);
    }

    public static get WhiteSmoke(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.WhiteSmoke]);
    }

    public static get Yellow(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.Yellow]);
    }

    public static get YellowGreen(): CGColor {
        return new CGColor(KnownColors.RgbaValues[KnownColor.YellowGreen]);
    }

    public /*override*/ getHashCode(): number {
        return this.R * this.G * this.B * this.A;
    }

    public /*override*/ toString(format?: string) {
        if (this.hsba == null) {
            this.hsba = ColorConversion.RgbaToHSBA(this._array);
        }
        if (this.hsla == null) {
            this.hsla = ColorConversion.RgbaToHSLA(this._array);
        }

        const a: number[] = this.levels;
        const f: number[] = this._array;
        const alpha: number = f[3]; // String representation uses normalized alpha

        switch (format) {
            case '#rrggbb':
                return '#'.concat(
                    a[0] < 16 ? '0'.concat(a[0].toString(16)) : a[0].toString(16),
                    a[1] < 16 ? '0'.concat(a[1].toString(16)) : a[1].toString(16),
                    a[2] < 16 ? '0'.concat(a[2].toString(16)) : a[2].toString(16)
                );

            case '#rrggbbaa':
                return '#'.concat(
                    a[0] < 16 ? '0'.concat(a[0].toString(16)) : a[0].toString(16),
                    a[1] < 16 ? '0'.concat(a[1].toString(16)) : a[1].toString(16),
                    a[2] < 16 ? '0'.concat(a[2].toString(16)) : a[2].toString(16),
                    a[3] < 16 ? '0'.concat(a[2].toString(16)) : a[3].toString(16)
                );

            case '#rgb':
                return '#'.concat(
                    Math.round(f[0] * 15).toString(16),
                    Math.round(f[1] * 15).toString(16),
                    Math.round(f[2] * 15).toString(16)
                );

            case '#rgba':
                return '#'.concat(
                    Math.round(f[0] * 15).toString(16),
                    Math.round(f[1] * 15).toString(16),
                    Math.round(f[2] * 15).toString(16),
                    Math.round(f[3] * 15).toString(16)
                );

            case 'rgb':
                return 'rgb('.concat(a[0].toString(), ', ', a[1].toString(), ', ', a[2].toString(), ')');

            case 'rgb%':
                return 'rgb('.concat(
                    (100 * f[0]).toPrecision(3),
                    '%, ',
                    (100 * f[1]).toPrecision(3),
                    '%, ',
                    (100 * f[2]).toPrecision(3),
                    '%)'
                );

            case 'rgba%':
                return 'rgba('.concat(
                    (100 * f[0]).toPrecision(3),
                    '%, ',
                    (100 * f[1]).toPrecision(3),
                    '%, ',
                    (100 * f[2]).toPrecision(3),
                    '%, ',
                    (100 * f[3]).toPrecision(3),
                    '%)'
                );

            case 'hsb':
            case 'hsv':
                return 'hsb('.concat(
                    (this.hsba[0] * this.maxes[constants.HSB][0]).toString(),
                    ', ',
                    (this.hsba[1] * this.maxes[constants.HSB][1]).toString(),
                    ', ',
                    (this.hsba[2] * this.maxes[constants.HSB][2]).toString(),
                    ')'
                );

            case 'hsb%':
            case 'hsv%':
                return 'hsb('.concat(
                    (100 * this.hsba[0]).toPrecision(3),
                    '%, ',
                    (100 * this.hsba[1]).toPrecision(3),
                    '%, ',
                    (100 * this.hsba[2]).toPrecision(3),
                    '%)'
                );

            case 'hsba':
            case 'hsva':
                return 'hsba('.concat(
                    (this.hsba[0] * this.maxes[constants.HSB][0]).toString(),
                    ', ',
                    (this.hsba[1] * this.maxes[constants.HSB][1]).toString(),
                    ', ',
                    (this.hsba[2] * this.maxes[constants.HSB][2]).toString(),
                    ', ',
                    alpha.toString(),
                    ')'
                );

            case 'hsba%':
            case 'hsva%':
                return 'hsba('.concat(
                    (100 * this.hsba[0]).toPrecision(3),
                    '%, ',
                    (100 * this.hsba[1]).toPrecision(3),
                    '%, ',
                    (100 * this.hsba[2]).toPrecision(3),
                    '%, ',
                    (100 * alpha).toPrecision(3),
                    '%)'
                );

            case 'hsl':
                return 'hsl('.concat(
                    (this.hsla[0] * this.maxes[constants.HSL][0]).toString(),
                    ', ',
                    (this.hsla[1] * this.maxes[constants.HSL][1]).toString(),
                    ', ',
                    (this.hsla[2] * this.maxes[constants.HSL][2]).toString(),
                    ')'
                );

            case 'hsl%':
                return 'hsl('.concat(
                    (100 * this.hsla[0]).toPrecision(3),
                    '%, ',
                    (100 * this.hsla[1]).toPrecision(3),
                    '%, ',
                    (100 * this.hsla[2]).toPrecision(3),
                    '%)'
                );

            case 'hsla':
                return 'hsla('.concat(
                    (this.hsla[0] * this.maxes[constants.HSL][0]).toString(),
                    ', ',
                    (this.hsla[1] * this.maxes[constants.HSL][1]).toString(),
                    ', ',
                    (this.hsla[2] * this.maxes[constants.HSL][2]).toString(),
                    ', ',
                    alpha.toString(),
                    ')'
                );

            case 'hsla%':
                return 'hsl('.concat(
                    (100 * this.hsla[0]).toPrecision(3),
                    '%, ',
                    (100 * this.hsla[1]).toPrecision(3),
                    '%, ',
                    (100 * this.hsla[2]).toPrecision(3),
                    '%, ',
                    (100 * alpha).toPrecision(3),
                    '%)'
                );
            case 'name':
                const rrggbb = this.toString('#rrggbb');
                for (let key in namedColors) {
                    if (namedColors[key] === rrggbb) {
                        return key;
                    }
                }
            case 'rgba':
            default:
                return 'rgba(' + a[0] + ',' + a[1] + ',' + a[2] + ',' + alpha + ')';
        }
    }

    public static Lerp(c1: CGColor, c2: CGColor, amt: float): CGColor {
        const mode: string = c1.mode;
        const maxes = c1.maxes;
        let l0: float, l1: float, l2: float, l3: float;
        let fromArray: number[], toArray: number[];

        if (mode === 'rgb') {
            fromArray = c1.levels.map(function (level) {
                return level / 255;
            });
            toArray = c2.levels.map(function (level) {
                return level / 255;
            });
        } else if (mode === 'hsb') {
            c1.hsba = ColorConversion.RgbaToHSBA(c1._array);
            c2.hsba = ColorConversion.RgbaToHSBA(c2._array);
            //c1.getBrightness(); // Cache hsba so it definitely exists.
            //c2.getBrightness();
            fromArray = c1.hsba;
            toArray = c2.hsba;
        } else if (mode === 'hsl') {
            c1.hsla = ColorConversion.RgbaToHSLA(c1._array);
            c2.hsla = ColorConversion.RgbaToHSLA(c2._array);
            //c1.getLightness(); // Cache hsla so it definitely exists.
            //c2.getLightness();
            fromArray = c1.hsla;
            toArray = c2.hsla;
        } else {
            throw new Error(mode + 'cannot be used for interpolation.');
        }

        // Prevent extrapolation.
        amt = Math.max(Math.min(amt, 1), 0);

        // Perform interpolation.
        l0 = lerp(fromArray[0], toArray[0], amt);
        l1 = lerp(fromArray[1], toArray[1], amt);
        l2 = lerp(fromArray[2], toArray[2], amt);
        l3 = lerp(fromArray[3], toArray[3], amt);

        // Scale components.
        l0 *= maxes[mode][0];
        l1 *= maxes[mode][1];
        l2 *= maxes[mode][2];
        l3 *= maxes[mode][3];

        return new CGColor(Math.round(l0), Math.round(l1), Math.round(l2), Math.round(l3));
    }
}