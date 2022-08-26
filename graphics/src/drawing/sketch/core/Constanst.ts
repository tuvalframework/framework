/**
 * @module Constants
 * @submodule Constants
 * @for p5
 */

'use strict';

var PI = Math.PI;

export const constants = {
    // GRAPHICS RENDERER
    /**
     * @property {String} P2D
     * @final
     */
    P2D: 'p2d',
    /**
     * @property {String} WEBGL
     * @final
     */
    WEBGL: 'webgl',

    // ENVIRONMENT
    /**
     * @property {String} ARROW
     * @final
     */
    ARROW: 'default',
    /**
     * @property {String} CROSS
     * @final
     */
    CROSS: 'crosshair',
    /**
     * @property {String} HAND
     * @final
     */
    HAND: 'pointer',
    /**
     * @property {String} MOVE
     * @final
     */
    MOVE: 'move',
    /**
     * @property {String} TEXT
     * @final
     */
    TEXT: 'text',
    /**
     * @property {String} WAIT
     * @final
     */
    WAIT: 'wait',

    // TRIGONOMETRY

    /**
     * HALF_PI is a mathematical constant with the value
     * 1.57079632679489661923. It is half the ratio of the
     * circumference of a circle to its diameter. It is useful in
     * combination with the trigonometric functions <a href="#/p5/sin">sin()</a> and <a href="#/p5/cos">cos()</a>.
     *
     * @property {Number} HALF_PI
     * @final
     *
     * @example
     * <div><code>
     * arc(50, 50, 80, 80, 0, HALF_PI);
     * </code></div>
     *
     * @alt
     * 80x80 white quarter-circle with curve toward bottom right of canvas.
     *
     */
    HALF_PI: PI / 2,
    /**
     * PI is a mathematical constant with the value
     * 3.14159265358979323846. It is the ratio of the circumference
     * of a circle to its diameter. It is useful in combination with
     * the trigonometric functions <a href="#/p5/sin">sin()</a> and <a href="#/p5/cos">cos()</a>.
     *
     * @property {Number} PI
     * @final
     *
     * @example
     * <div><code>
     * arc(50, 50, 80, 80, 0, PI);
     * </code></div>
     *
     * @alt
     * white half-circle with curve toward bottom of canvas.
     *
     */
    PI: PI,
    /**
     * QUARTER_PI is a mathematical constant with the value 0.7853982.
     * It is one quarter the ratio of the circumference of a circle to
     * its diameter. It is useful in combination with the trigonometric
     * functions <a href="#/p5/sin">sin()</a> and <a href="#/p5/cos">cos()</a>.
     *
     * @property {Number} QUARTER_PI
     * @final
     *
     * @example
     * <div><code>
     * arc(50, 50, 80, 80, 0, QUARTER_PI);
     * </code></div>
     *
     * @alt
     * white eighth-circle rotated about 40 degrees with curve bottom right canvas.
     *
     */
    QUARTER_PI: PI / 4,
    /**
     * TAU is an alias for TWO_PI, a mathematical constant with the
     * value 6.28318530717958647693. It is twice the ratio of the
     * circumference of a circle to its diameter. It is useful in
     * combination with the trigonometric functions <a href="#/p5/sin">sin()</a> and <a href="#/p5/cos">cos()</a>.
     *
     * @property {Number} TAU
     * @final
     *
     * @example
     * <div><code>
     * arc(50, 50, 80, 80, 0, TAU);
     * </code></div>
     *
     * @alt
     * 80x80 white ellipse shape in center of canvas.
     *
     */
    TAU: PI * 2,
    /**
     * TWO_PI is a mathematical constant with the value
     * 6.28318530717958647693. It is twice the ratio of the
     * circumference of a circle to its diameter. It is useful in
     * combination with the trigonometric functions <a href="#/p5/sin">sin()</a> and <a href="#/p5/cos">cos()</a>.
     *
     * @property {Number} TWO_PI
     * @final
     *
     * @example
     * <div><code>
     * arc(50, 50, 80, 80, 0, TWO_PI);
     * </code></div>
     *
     * @alt
     * 80x80 white ellipse shape in center of canvas.
     *
     */
    TWO_PI: PI * 2,
    /**
     * Constant to be used with <a href="#/p5/angleMode">angleMode()</a> function, to set the mode which
     * p5.js interprates and calculates angles (either DEGREES or RADIANS).
     * @property {String} DEGREES
     * @final
     *
     * @example
     * <div class='norender'><code>
     * function setup() {
     *   angleMode(DEGREES);
     * }
     * </code></div>
     */
    DEGREES: 'degrees',
    /**
     * Constant to be used with <a href="#/p5/angleMode">angleMode()</a> function, to set the mode which
     * p5.js interprates and calculates angles (either RADIANS or DEGREES).
     * @property {String} RADIANS
     * @final
     *
     * @example
     * <div class='norender'><code>
     * function setup() {
     *   angleMode(RADIANS);
     * }
     * </code></div>
     */
    RADIANS: 'radians',
    DEG_TO_RAD: PI / 180.0,
    RAD_TO_DEG: 180.0 / PI,

    // SHAPE
    /**
     * @property {String} CORNER
     * @final
     */
    CORNER: 'corner',
    /**
     * @property {String} CORNERS
     * @final
     */
    CORNERS: 'corners',
    /**
     * @property {String} RADIUS
     * @final
     */
    RADIUS: 'radius',
    /**
     * @property {String} RIGHT
     * @final
     */
    RIGHT: 'right',
    /**
     * @property {String} LEFT
     * @final
     */
    LEFT: 'left',
    /**
     * @property {String} CENTER
     * @final
     */
    CENTER: 'center',
    /**
     * @property {String} TOP
     * @final
     */
    TOP: 'top',
    /**
     * @property {String} BOTTOM
     * @final
     */
    BOTTOM: 'bottom',
    /**
     * @property {String} BASELINE
     * @final
     * @default alphabetic
     */
    BASELINE: 'alphabetic',
    /**
     * @property {Number} POINTS
     * @final
     * @default 0x0000
     */
    POINTS: 0x0000,
    /**
     * @property {Number} LINES
     * @final
     * @default 0x0001
     */
    LINES: 0x0001,
    /**
     * @property {Number} LINE_STRIP
     * @final
     * @default 0x0003
     */
    LINE_STRIP: 0x0003,
    /**
     * @property {Number} LINE_LOOP
     * @final
     * @default 0x0002
     */
    LINE_LOOP: 0x0002,
    /**
     * @property {Number} TRIANGLES
     * @final
     * @default 0x0004
     */
    TRIANGLES: 0x0004,
    /**
     * @property {Number} TRIANGLE_FAN
     * @final
     * @default 0x0006
     */
    TRIANGLE_FAN: 0x0006,
    /**
     * @property {Number} TRIANGLE_STRIP
     * @final
     * @default 0x0005
     */
    TRIANGLE_STRIP: 0x0005,
    /**
     * @property {String} QUADS
     * @final
     */
    QUADS: 'quads',
    /**
     * @property {String} QUAD_STRIP
     * @final
     * @default quad_strip
     */
    QUAD_STRIP: 'quad_strip',
    /**
     * @property {String} CLOSE
     * @final
     */
    CLOSE: 'close',
    /**
     * @property {String} OPEN
     * @final
     */
    OPEN: 'open',
    /**
     * @property {String} CHORD
     * @final
     */
    CHORD: 'chord',
    /**
     * @property {String} PIE
     * @final
     */
    PIE: 'pie',
    /**
     * @property {String} PROJECT
     * @final
     * @default square
     */
    PROJECT: 'square', // PEND: careful this is counterintuitive
    /**
     * @property {String} SQUARE
     * @final
     * @default butt
     */
    SQUARE: 'butt',
    /**
     * @property {String} ROUND
     * @final
     */
    ROUND: 'round',
    /**
     * @property {String} BEVEL
     * @final
     */
    BEVEL: 'bevel',
    /**
     * @property {String} MITER
     * @final
     */
    MITER: 'miter',

    // COLOR
    /**
     * @property {String} RGB
     * @final
     */
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
    HSL: 'hsl',

    // DOM EXTENSION
    /**
     * @property {String} AUTO
     * @final
     */
    AUTO: 'auto',

    // INPUT
    ALT: 18,
    BACKSPACE: 8,
    CONTROL: 17,
    DELETE: 46,
    DOWN_ARROW: 40,
    ENTER: 13,
    ESCAPE: 27,
    LEFT_ARROW: 37,
    OPTION: 18,
    RETURN: 13,
    RIGHT_ARROW: 39,
    SHIFT: 16,
    TAB: 9,
    UP_ARROW: 38,

    // RENDERING
    /**
     * @property {String} BLEND
     * @final
     * @default source-over
     */
    BLEND: 'source-over',
    /**
     * @property {String} ADD
     * @final
     * @default lighter
     */
    ADD: 'lighter',
    //ADD: 'add', //
    //SUBTRACT: 'subtract', //
    /**
     * @property {String} DARKEST
     * @final
     */
    DARKEST: 'darken',
    /**
     * @property {String} LIGHTEST
     * @final
     * @default lighten
     */
    LIGHTEST: 'lighten',
    /**
     * @property {String} DIFFERENCE
     * @final
     */
    DIFFERENCE: 'difference',
    SUBTRACT: 'subtract',
    /**
     * @property {String} EXCLUSION
     * @final
     */
    EXCLUSION: 'exclusion',
    /**
     * @property {String} MULTIPLY
     * @final
     */
    MULTIPLY: 'multiply',
    /**
     * @property {String} SCREEN
     * @final
     */
    SCREEN: 'screen',
    /**
     * @property {String} REPLACE
     * @final
     * @default copy
     */
    REPLACE: 'copy',
    /**
     * @property {String} OVERLAY
     * @final
     */
    OVERLAY: 'overlay',
    /**
     * @property {String} HARD_LIGHT
     * @final
     */
    HARD_LIGHT: 'hard-light',
    /**
     * @property {String} SOFT_LIGHT
     * @final
     */
    SOFT_LIGHT: 'soft-light',
    /**
     * @property {String} DODGE
     * @final
     * @default color-dodge
     */
    DODGE: 'color-dodge',
    /**
     * @property {String} BURN
     * @final
     * @default color-burn
     */
    BURN: 'color-burn',

    // FILTERS
    /**
     * @property {String} THRESHOLD
     * @final
     */
    THRESHOLD: 'threshold',
    /**
     * @property {String} GRAY
     * @final
     */
    GRAY: 'gray',
    /**
     * @property {String} OPAQUE
     * @final
     */
    OPAQUE: 'opaque',
    /**
     * @property {String} INVERT
     * @final
     */
    INVERT: 'invert',
    /**
     * @property {String} POSTERIZE
     * @final
     */
    POSTERIZE: 'posterize',
    /**
     * @property {String} DILATE
     * @final
     */
    DILATE: 'dilate',
    /**
     * @property {String} ERODE
     * @final
     */
    ERODE: 'erode',
    /**
     * @property {String} BLUR
     * @final
     */
    BLUR: 'blur',

    // TYPOGRAPHY
    /**
     * @property {String} NORMAL
     * @final
     */
    NORMAL: 'normal',
    /**
     * @property {String} ITALIC
     * @final
     */
    ITALIC: 'italic',
    /**
     * @property {String} BOLD
     * @final
     */
    BOLD: 'bold',

    // TYPOGRAPHY-INTERNAL
    _DEFAULT_TEXT_FILL: '#000000',
    _DEFAULT_LEADMULT: 1.25,
    _CTX_MIDDLE: 'middle',

    // VERTICES
    LINEAR: 'linear',
    QUADRATIC: 'quadratic',
    BEZIER: 'bezier',
    CURVE: 'curve',

    // WEBGL DRAWMODES
    STROKE: 'stroke',
    FILL: 'fill',
    TEXTURE: 'texture',
    IMMEDIATE: 'immediate',

    //WEBGL TEXTURE WRAP AND FILTERING
    // LINEAR already exists above
    NEAREST: 'nearest',
    REPEAT: 'repeat',
    CLAMP: 'clamp',
    MIRROR: 'mirror',

    // DEVICE-ORIENTATION
    /**
     * @property {String} LANDSCAPE
     * @final
     */
    LANDSCAPE: 'landscape',
    /**
     * @property {String} PORTRAIT
     * @final
     */
    PORTRAIT: 'portrait',
    POLYGON: 'polygon',
    BOLDITALIC : 'bold italic',

    // DEFAULTS
    _DEFAULT_STROKE: '#000000',
    _DEFAULT_FILL: '#FFFFFF'
}

type ADD = "lighter";
type ARROW = "arrow";
type AUDIO = "audio";
type AUTO = "auto";
type AXES = "axes";
type BASELINE = "alphabetic";
type BEVEL = "bevel";
type BLEND = "source-over";
type BLUR = "blur";
type BOLD = "bold";
type BOTTOM = "bottom";
type BURN = "color-burn";
type CENTER = "center";
type CHORD = "chord";
type CLOSE = "close";
type CORNER = "corner";
type CORNERS = "corners";
type CROSS = "cross";
type DARKEST = "darkest";
type DEGREES = "degrees";
type DIFFERENCE = "difference";
type DILATE = "dilate";
type DODGE = "color-dodge";
type ERODE = "erode";
type EXCLUSION = "exclusion";
type GRAY = "gray";
type GRID = "grid";
type HAND = "hand";
type HARD_LIGHT = "hard-light";
type HSB = "hsb";
type HSL = "hsl";
type INVERT = "invert";
type ITALIC = "italic";
type LANDSCAPE = "landscape";
type LEFT = "left";
type LIGHTEST = "lighten";
type LINE_LOOP = 0x0002;
type LINE_STRIP = 0x0003;
type LINES = 0x0001;
type MITER = "miter";
type MOVE = "move";
type MULTIPLY = "multiply";
type NORMAL = "normal";
type OPAQUE = "opaque";
type OPEN = "open";
type OVERLAY = "overlay";
type P2D = "p2d";
type PIE = "pie";
type POINTS = 0x0000;
type PORTRAIT = "portrait";
type POSTERIZE = "posterize";
type PROJECT = "square";
type QUAD_STRIP = "quad_strip";
type QUADS = "quads";
type RADIANS = "radians";
type RADIUS = "radius";
type REPLACE = "copy";
type RGB = "rgb";
type RIGHT = "right";
type ROUND = "round";
type SCREEN = "screen";
type SOFT_LIGHT = "soft-light";
type SQUARE = "butt";
type TEXT = "text";
type THRESHOLD = "threshold";
type TOP = "top";
type TRIANGLE_FAN = 0x0006;
type TRIANGLE_STRIP = 0x0005;
type TRIANGLES = 0x0004;
type VIDEO = "video";
type WAIT = "wait";
type WEBGL = "webgl";

export type ANGLE_MODE =
    | RADIANS
    | DEGREES;

export type ARC_MODE =
    | CHORD
    | PIE
    | OPEN;

export type BEGIN_KIND =
    | POINTS
    | LINES
    | TRIANGLES
    | TRIANGLE_FAN
    | TRIANGLE_STRIP
    | QUADS
    | QUAD_STRIP;

export type BLEND_MODE =
    | BLEND
    | DARKEST
    | LIGHTEST
    | DIFFERENCE
    | MULTIPLY
    | EXCLUSION
    | SCREEN
    | REPLACE
    | OVERLAY
    | HARD_LIGHT
    | SOFT_LIGHT
    | DODGE
    | BURN
    | ADD
    | NORMAL;

export type COLOR_MODE =
    | RGB
    | HSB
    | HSL;

export type CURSOR_TYPE =
    | ARROW
    | CROSS
    | HAND
    | MOVE
    | TEXT
    | WAIT;

export type DEBUG_MODE =
    | GRID
    | AXES;

export type ELLIPSE_MODE =
    | CENTER
    | RADIUS
    | CORNER
    | CORNERS;

export type END_MODE = CLOSE;

export type FILTER_TYPE =
    | THRESHOLD
    | GRAY
    | OPAQUE
    | INVERT
    | POSTERIZE
    | BLUR
    | ERODE
    | DILATE;

export type GRAPHICS_RENDERER =
    | P2D
    | WEBGL;

export type HORIZ_ALIGN =
    | LEFT
    | CENTER
    | RIGHT;

export type IMAGE_MODE =
    | CORNER
    | CORNERS
    | CENTER;

export type RECT_MODE =
    | CORNER
    | CORNERS
    | CENTER
    | RADIUS;

export type RENDERER =
    | P2D
    | WEBGL;

export type SIZE_H = AUTO;

export type SIZE_W = AUTO;

export type STROKE_CAP =
    | SQUARE
    | PROJECT
    | ROUND;

export type STROKE_JOIN =
    | MITER
    | BEVEL
    | ROUND;

export type THE_STYLE =
    | NORMAL
    | ITALIC
    | BOLD;

export type TYPE =
    | VIDEO
    | AUDIO;

export type VERT_ALIGN =
    | TOP
    | BOTTOM
    | CENTER
    | BASELINE;
