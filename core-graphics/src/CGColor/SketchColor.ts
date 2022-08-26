import { byte, is } from "@tuval/core";
import { ColorConversion } from "./ColorConversion";
import { CGColor } from "./CGColor";

/**
 * These regular expressions are used to build up the patterns for matching
 * viable CSS color strings: fragmenting the regexes in this way increases the
 * legibility and comprehensibility of the code.
 *
 * Note that RGB values of .9 are not parsed by IE, but are supported here for
 * color string consistency.
 */
var WHITESPACE = /\s*/; // Match zero or more whitespace characters.
var INTEGER = /(\d{1,3})/; // Match integers: 79, 255, etc.
var DECIMAL = /((?:\d+(?:\.\d+)?)|(?:\.\d+))/; // Match 129.6, 79, .9, etc.
var PERCENT = new RegExp(DECIMAL.source + '%'); // Match 12.9%, 79%, .9%, etc.

/**
 * Full color string patterns. The capture groups are necessary.
 */
var colorPatterns = {
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
};
var namedColors = {
    aliceblue: '#f0f8ff',
    antiquewhite: '#faebd7',
    aqua: '#00ffff',
    aquamarine: '#7fffd4',
    azure: '#f0ffff',
    beige: '#f5f5dc',
    bisque: '#ffe4c4',
    black: '#000000',
    blanchedalmond: '#ffebcd',
    blue: '#0000ff',
    blueviolet: '#8a2be2',
    brown: '#a52a2a',
    burlywood: '#deb887',
    cadetblue: '#5f9ea0',
    chartreuse: '#7fff00',
    chocolate: '#d2691e',
    coral: '#ff7f50',
    cornflowerblue: '#6495ed',
    cornsilk: '#fff8dc',
    crimson: '#dc143c',
    cyan: '#00ffff',
    darkblue: '#00008b',
    darkcyan: '#008b8b',
    darkgoldenrod: '#b8860b',
    darkgray: '#a9a9a9',
    darkgreen: '#006400',
    darkgrey: '#a9a9a9',
    darkkhaki: '#bdb76b',
    darkmagenta: '#8b008b',
    darkolivegreen: '#556b2f',
    darkorange: '#ff8c00',
    darkorchid: '#9932cc',
    darkred: '#8b0000',
    darksalmon: '#e9967a',
    darkseagreen: '#8fbc8f',
    darkslateblue: '#483d8b',
    darkslategray: '#2f4f4f',
    darkslategrey: '#2f4f4f',
    darkturquoise: '#00ced1',
    darkviolet: '#9400d3',
    deeppink: '#ff1493',
    deepskyblue: '#00bfff',
    dimgray: '#696969',
    dimgrey: '#696969',
    dodgerblue: '#1e90ff',
    firebrick: '#b22222',
    floralwhite: '#fffaf0',
    forestgreen: '#228b22',
    fuchsia: '#ff00ff',
    gainsboro: '#dcdcdc',
    ghostwhite: '#f8f8ff',
    gold: '#ffd700',
    goldenrod: '#daa520',
    gray: '#808080',
    green: '#008000',
    greenyellow: '#adff2f',
    grey: '#808080',
    honeydew: '#f0fff0',
    hotpink: '#ff69b4',
    indianred: '#cd5c5c',
    indigo: '#4b0082',
    ivory: '#fffff0',
    khaki: '#f0e68c',
    lavender: '#e6e6fa',
    lavenderblush: '#fff0f5',
    lawngreen: '#7cfc00',
    lemonchiffon: '#fffacd',
    lightblue: '#add8e6',
    lightcoral: '#f08080',
    lightcyan: '#e0ffff',
    lightgoldenrodyellow: '#fafad2',
    lightgray: '#d3d3d3',
    lightgreen: '#90ee90',
    lightgrey: '#d3d3d3',
    lightpink: '#ffb6c1',
    lightsalmon: '#ffa07a',
    lightseagreen: '#20b2aa',
    lightskyblue: '#87cefa',
    lightslategray: '#778899',
    lightslategrey: '#778899',
    lightsteelblue: '#b0c4de',
    lightyellow: '#ffffe0',
    lime: '#00ff00',
    limegreen: '#32cd32',
    linen: '#faf0e6',
    magenta: '#ff00ff',
    maroon: '#800000',
    mediumaquamarine: '#66cdaa',
    mediumblue: '#0000cd',
    mediumorchid: '#ba55d3',
    mediumpurple: '#9370db',
    mediumseagreen: '#3cb371',
    mediumslateblue: '#7b68ee',
    mediumspringgreen: '#00fa9a',
    mediumturquoise: '#48d1cc',
    mediumvioletred: '#c71585',
    midnightblue: '#191970',
    mintcream: '#f5fffa',
    mistyrose: '#ffe4e1',
    moccasin: '#ffe4b5',
    navajowhite: '#ffdead',
    navy: '#000080',
    oldlace: '#fdf5e6',
    olive: '#808000',
    olivedrab: '#6b8e23',
    orange: '#ffa500',
    orangered: '#ff4500',
    orchid: '#da70d6',
    palegoldenrod: '#eee8aa',
    palegreen: '#98fb98',
    paleturquoise: '#afeeee',
    palevioletred: '#db7093',
    papayawhip: '#ffefd5',
    peachpuff: '#ffdab9',
    peru: '#cd853f',
    pink: '#ffc0cb',
    plum: '#dda0dd',
    powderblue: '#b0e0e6',
    purple: '#800080',
    red: '#ff0000',
    rosybrown: '#bc8f8f',
    royalblue: '#4169e1',
    saddlebrown: '#8b4513',
    salmon: '#fa8072',
    sandybrown: '#f4a460',
    seagreen: '#2e8b57',
    seashell: '#fff5ee',
    sienna: '#a0522d',
    silver: '#c0c0c0',
    skyblue: '#87ceeb',
    slateblue: '#6a5acd',
    slategray: '#708090',
    slategrey: '#708090',
    snow: '#fffafa',
    springgreen: '#00ff7f',
    steelblue: '#4682b4',
    tan: '#d2b48c',
    teal: '#008080',
    thistle: '#d8bfd8',
    tomato: '#ff6347',
    turquoise: '#40e0d0',
    violet: '#ee82ee',
    wheat: '#f5deb3',
    white: '#ffffff',
    whitesmoke: '#f5f5f5',
    yellow: '#ffff00',
    yellowgreen: '#9acd32'
};

/* @ClassInfo({
    fullName: GraphicTypes.SketchColor,
    instanceof: [
        GraphicTypes.SketchColor
    ]
}) */
export class SketchColor {
    mode: string = 'RGB'
    _array: any;
    hsba: any;
    hsla: any;
    levels: any;
    maxes: any;

    public constructor( value: byte);
    public constructor( value: string);
    public constructor( values: Array<byte>);
    public constructor( gray: byte, alpha: byte);
    public constructor( v1: byte, v2: byte, v3: byte);
    public constructor( v1: byte, v2: byte, v3: byte, alpha: byte);
    public constructor(...args: any[]) {
       // this._pInst = args[0];
        // Record color mode and maxes at time of construction.
        /* if (args[0] != null) {
            this._storeModeAndMaxes(args[0]._colorMode, args[0]._colorMaxes);
        } else { */
            this._storeModeAndMaxes('rgb', {
                rgb: [255, 255, 255, 255],
                hsb: [360, 100, 100, 1],
                hsl: [360, 100, 100, 1]
            });
        //}
        if (args.length === 1 && (is.number(args[0]) || is.string(args[0]))) {
            // Calculate normalized RGBA values.
            if (
                this.mode !== 'rgb' &&
                this.mode !== 'hsl' &&
                this.mode !== 'hsb'
            ) {
                throw new Error(this.mode + ' is an invalid colorMode.');
            } else {
                this._array = SketchColor._parseInputs.call(this, args[0]);
            }
        } else if (args.length === 1 && is.array(args[0])) {
            // Calculate normalized RGBA values.
            if (
                this.mode !== 'rgb' &&
                this.mode !== 'hsl' &&
                this.mode !== 'hsb'
            ) {
                throw new Error(this.mode + ' is an invalid colorMode.');
            } else {
                this._array = SketchColor._parseInputs.call(this, args[1][0], args[1][1], args[1][2], args[1][3]);
            }
        } else if (args.length === 2 && is.number(args[0]) && is.number(args[1])) {
            // Calculate normalized RGBA values.
            if (
                this.mode !== 'rgb' &&
                this.mode !== 'hsl' &&
                this.mode !== 'hsb'
            ) {
                throw new Error(this.mode + ' is an invalid colorMode.');
            } else {
                this._array = SketchColor._parseInputs.call(this, args[0], args[1]);
            }
        } else if (args.length === 3 && is.number(args[0]) && is.number(args[1]) && is.number(args[2])) {
            // Calculate normalized RGBA values.
            if (
                this.mode !== 'rgb' &&
                this.mode !== 'hsl' &&
                this.mode !== 'hsb'
            ) {
                throw new Error(this.mode + ' is an invalid colorMode.');
            } else {
                this._array = SketchColor._parseInputs.call(this, args[0], args[1], args[2]);
            }
        } else if (args.length === 4 && is.number(args[0]) && is.number(args[1]) && is.number(args[2]) && is.number(args[3])) {
            // Calculate normalized RGBA values.
            if (
                this.mode !== 'rgb' &&
                this.mode !== 'hsl' &&
                this.mode !== 'hsb'
            ) {
                throw new Error(this.mode + ' is an invalid colorMode.');
            } else {
                this._array = SketchColor._parseInputs.call(this, args[0], args[1], args[2], args[3]);
            }
        }

        // Expose closest screen color.
        this._calculateLevels();
        return this;
    }
    public toString(format?: string) {
        if (!this.hsba) this.hsba = ColorConversion.RgbaToHSBA(this._array);
        if (!this.hsla) this.hsla = ColorConversion.RgbaToHSLA(this._array);

        var a = this.levels;
        var f = this._array;
        var alpha = f[3]; // String representation uses normalized alpha

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
                return 'rgb('.concat(a[0], ', ', a[1], ', ', a[2], ')');

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
                    (this.hsba[0] * this.maxes['hsb'][0]) as any,
                    ', ',
                    (this.hsba[1] * this.maxes['hsb'][1]) as any,
                    ', ',
                    (this.hsba[2] * this.maxes['hsb'][2]) as any,
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
                    (this.hsba[0] * this.maxes['hsb'][0]) as any,
                    ', ',
                    (this.hsba[1] * this.maxes['hsb'][1]) as any,
                    ', ',
                    (this.hsba[2] * this.maxes['hsb'][2]) as any,
                    ', ',
                    alpha,
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
                    (this.hsla[0] * this.maxes['hsl'][0]) as any,
                    ', ',
                    (this.hsla[1] * this.maxes['hsl'][1]) as any,
                    ', ',
                    (this.hsla[2] * this.maxes['hsl'][2]) as any,
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
                    (this.hsla[0] * this.maxes['hsl'][0]) as any,
                    ', ',
                    (this.hsla[1] * this.maxes['hsl'][1]) as any,
                    ', ',
                    (this.hsla[2] * this.maxes['hsl'][2]) as any,
                    ', ',
                    alpha,
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

            case 'rgba':
            default:
                return 'rgba(' + a[0] + ',' + a[1] + ',' + a[2] + ',' + alpha + ')';
        }
    }

    public setRed(new_red) {
        this._array[0] = new_red / this.maxes['rgb'][0];
        this._calculateLevels();
    }

    public setGreen(new_green) {
        this._array[1] = new_green / this.maxes['rgb'][1];
        this._calculateLevels();
    }

    public setBlue(new_blue) {
        this._array[2] = new_blue / this.maxes['rgb'][2];
        this._calculateLevels();
    }
    public setAlpha(new_alpha) {
        this._array[3] = new_alpha / this.maxes[this.mode][3];
        this._calculateLevels();
    }

    public _calculateLevels() {
        var array = this._array;
        // (loop backwards for performance)
        var levels = (this.levels = new Array(array.length));
        for (var i = array.length - 1; i >= 0; --i) {
            levels[i] = Math.round(array[i] * 255);
        }
    }

    public _getAlpha() {
        return this._array[3] * this.maxes[this.mode][3];
    }

    public _storeModeAndMaxes(new_mode, new_maxes) {
        this.mode = new_mode;
        this.maxes = new_maxes;
    }

    public _getMode() {
        return this.mode;
    }

    public _getMaxes() {
        return this.maxes;
    }

    public _getBlue() {
        return this._array[2] * this.maxes['rgb'][2];
    }

    public _getBrightness() {
        if (!this.hsba) {
            this.hsba = ColorConversion.RgbaToHSBA(this._array);
        }
        return this.hsba[2] * this.maxes['hsb'][2];
    };

    public _getGreen() {
        return this._array[1] * this.maxes['rgb'][1];
    };
    public _getHue() {
        if (this.mode === 'hsb') {
            if (!this.hsba) {
                this.hsba = ColorConversion.RgbaToHSBA(this._array);
            }
            return this.hsba[0] * this.maxes['hsb'][0];
        } else {
            if (!this.hsla) {
                this.hsla = ColorConversion.RgbaToHSLA(this._array);
            }
            return this.hsla[0] * this.maxes['hsl'][0];
        }
    };

    public _getLightness() {
        if (!this.hsla) {
            this.hsla = ColorConversion.RgbaToHSLA(this._array);
        }
        return this.hsla[2] * this.maxes['hsl'][2];
    };

    public _getRed() {
        return this._array[0] * this.maxes['rgb'][0];
    };

    public _getSaturation() {
        if (this.mode === 'hsb') {
            if (!this.hsba) {
                this.hsba = ColorConversion.RgbaToHSBA(this._array);
            }
            return this.hsba[1] * this.maxes['hsb'][1];
        } else {
            if (!this.hsla) {
                this.hsla = ColorConversion.RgbaToHSLA(this._array);
            }
            return this.hsla[1] * this.maxes['hsl'][1];
        }
    }
    public static _parseInputs(r, g?, b?, a?) {
        let numArgs;
        if (Array.isArray(r)) {
            numArgs = r.length;
            a = r[3];
            b = r[2];
            g = r[1];
            r = r[0];

        } else {
            numArgs = arguments.length;
        }
        var mode = (<any>this).mode;
        var maxes = (<any>this).maxes[mode];
        let results: any[] = [];
        var i;

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
                var result = results[i];
                if (result < 0) {
                    results[i] = 0;
                } else if (result > 1) {
                    results[i] = 1;
                }
            }

            // Convert to RGBA and return.
            if (mode === 'hsl') {
                return ColorConversion.HslaToRGBA(results);
            } else if (mode === 'hsb') {
                return ColorConversion.HsbaToRGBA(results);
            } else {
                return results;
            }
        } else if (numArgs === 1 && typeof r === 'string') {
            var str = r.trim().toLowerCase();

            // Return if string is a named colour.
            if (namedColors[str]) {
                return SketchColor._parseInputs.call(this, namedColors[str]);
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
                    .map(function (color: any, idx) {
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
                    .map(function (color, idx) {
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
                    .map(function (color, idx) {
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

     public toColor(): CGColor {
        return CGColor.FromRgba(this.levels[0], this.levels[1], this.levels[2],this.levels[3] );
    }
}