import { int, uint, CanvasModule, NotImplementedException, Virtual, PATH, is, New, byte, ByteArray, Convert, TArray } from '@tuval/core';
import { CGColor, CGRectangle, CGSize } from '@tuval/cg';


declare var webkitAudioContext, CanvasPixelArray, OffscreenCanvas;
var tempDouble;
var tempI64;

type PRect = int;

export class SDL_Palette {
    public ncolors: int = 0;
    public colors: CGColor[] = [];
    public version: uint = 0;
    public refcount: int = 0;
}

export class SDL_PixelFormat {
    public format: uint = 0;
    public palette: SDL_Palette = null as any;
    public BitsPerPixel: byte = 0;
    public BytesPerPixel: byte = 0;
    public padding: ByteArray = New.ByteArray(2);
    public Rmask: uint = 0;
    public Gmask: uint = 0;
    public Bmask: uint = 0;
    public Amask: uint = 0;
    public Rloss: byte = 0;
    public Gloss: byte = 0;
    public Bloss: byte = 0;
    public Aloss: byte = 0;
    public Rshift: byte = 0;
    public Gshift: byte = 0;
    public Bshift: byte = 0;
    public Ashift: byte = 0;
    public refcount: int = 0;
    public next: SDL_PixelFormat = null as any;
}

let SurfaceCounter: int = 0;
export class SDL_Surface {
    public Id: int = 0;

    public flags: uint = 0;               /**< Read-only */
    public format: SDL_PixelFormat = null as any;    /**< Read-only */
    public w: int = 0;
    public h: int = 0;                   /**< Read-only */
    public pitch: int = 0;                  /**< Read-only */
    public pixels: ByteArray = null as any;               /**< Read-write */

    /** Application data associated with the surface */
    public userdata: ByteArray = null as any;             /**< Read-write */

    /** information needed for surfaces requiring locks */
    public locked: int = 0;                 /**< Read-only */
    public lock_data: ByteArray = null as any;            /**< Read-only */

    /** clipping information */
    public clip_rect: CGRectangle = CGRectangle.Empty;         /**< Read-only */

    /** info for fast blit mapping to other surfaces */
    public map: ByteArray = null as any;    /**< Private */

    /** Reference count -- used when freeing surface */
    public refcount: int = 0;               /**< Read-mostly */
    public constructor() {
        this.Id = SurfaceCounter++;
    }
}

export class SDLModule extends CanvasModule {
    private width: int = 320;
    private height: int = 200;
    private copyOnLock: boolean = true;
    private discardOnLock: boolean = false;
    private opaqueFrontBuffer: boolean = true;
    private version: any = null;
    private surfaces: any = {};
    private canvasPool: any[] = [];
    private events: any[] = [];
    private fonts: any[] = [null];
    private audios: any[] = [null];
    private rwops: any[] = [null];
    private music_audio: any = null;
    private music_volume: int = 1;
    private mixerFrequency: int = 22050;
    private mixerFormat: int = 32784;
    private mixerNumChannels: int = 2;
    private mixerChunkSize: int = 1024;
    private channelMinimumNumber: int = 0;
    private GL: boolean = false;
    private glAttributes: any = { 0: 3, 1: 3, 2: 2, 3: 0, 4: 0, 5: 1, 6: 16, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 1, 16: 0, 17: 0, 18: 0 };
    private keyboardState: any = null;
    private keyboardMap: any = {};
    private canRequestFullscreen: boolean = false;
    private isRequestingFullscreen: boolean = false;
    private textInput: boolean = false;
    private startTime: any = null;
    private initFlags: int = 0;
    private buttonState: int = 0;
    private modState: int = 0;
    private DOMButtons: int[] = [0, 0, 0];
    private DOMEventToSDLEvent: any = {};
    private TOUCH_DEFAULT_ID: int = 0;
    private eventHandler: any = null;
    private eventHandlerContext: any = null;
    private eventHandlerTemp: int = 0;
    private keyCodes: any = {
        16: 1249, 17: 1248, 18: 1250, 20: 1081, 33: 1099, 34: 1102, 35: 1101, 36: 1098,
        37: 1104, 38: 1106, 39: 1103, 40: 1105, 44: 316,
        45: 1097, 46: 127, 91: 1251, 93: 1125, 96: 1122,
        97: 1113, 98: 1114, 99: 1115, 100: 1116, 101: 1117, 102: 1118, 103: 1119, 104: 1120, 105: 1121, 106: 1109, 107: 1111, 109: 1110, 110: 1123, 111: 1108, 112: 1082, 113: 1083,
        114: 1084, 115: 1085, 116: 1086, 117: 1087, 118: 1088, 119: 1089, 120: 1090, 121: 1091, 122: 1092, 123: 1093, 124: 1128, 125: 1129, 126: 1130, 127: 1131, 128: 1132, 129: 1133, 130: 1134, 131: 1135, 132: 1136, 133: 1137, 134: 1138,
        135: 1139, 144: 1107, 160: 94, 161: 33, 162: 34, 163: 35, 164: 36, 165: 37, 166: 38, 167: 95, 168: 40, 169: 41, 170: 42, 171: 43, 172: 124, 173: 45, 174: 123, 175: 125, 176: 126, 181: 127, 182: 129, 183: 128, 188: 44, 190: 46, 191: 47, 192: 96, 219: 91, 220: 92,
        221: 93, 222: 39, 224: 1251
    }
    private scanCodes: any = {
        8: 42, 9: 43, 13: 40, 27: 41, 32: 44, 35: 204, 39: 53, 44: 54, 46: 55, 47: 56,
        48: 39, 49: 30, 50: 31, 51: 32, 52: 33, 53: 34, 54: 35, 55: 36, 56: 37, 57: 38, 58: 203, 59: 51,
        61: 46, 91: 47, 92: 49, 93: 48, 96: 52, 97: 4, 98: 5, 99: 6, 100: 7, 101: 8, 102: 9, 103: 10,
        104: 11, 105: 12, 106: 13, 107: 14, 108: 15, 109: 16, 110: 17, 111: 18, 112: 19, 113: 20, 114: 21,
        115: 22, 116: 23, 117: 24, 118: 25, 119: 26, 120: 27, 121: 28, 122: 29, 127: 76, 305: 224,
        308: 226, 316: 70
    }
    private screen: any;
    private channels: any[] = [];
    private numChannels: int = 0;
    private audioContext: AudioContext = null as any;
    public constructor(width: int, height: int) {
        super(width, height);
    }
    private loadRect(rect: PRect) {
        return {
            x: this.HEAP32[((rect + 0) >> 2)],
            y: this.HEAP32[((rect + 4) >> 2)],
            w: this.HEAP32[((rect + 8) >> 2)],
            h: this.HEAP32[((rect + 12) >> 2)]
        };
    }
    private updateRect(rect: CGRectangle, r: CGRectangle) {
        rect.X = r.X;
        rect.Y = r.Y;
        rect.Width = r.Width;
        rect.Height = r.Height;
        return rect;
    }
    private intersectionOfRects(first: CGRectangle, second: CGRectangle): CGRectangle {
        var leftX = Math.max(first.X, second.X);
        var leftY = Math.max(first.Y, second.Y);
        var rightX = Math.min(first.X + first.Width, second.X + second.Width);
        var rightY = Math.min(first.Y + first.Height, second.Y + second.Height);

        return new CGRectangle(leftX, leftY,
            Math.max(leftX, rightX) - leftX,
            Math.max(leftY, rightY) - leftY);

    }
    private checkPixelFormat(fmt: any) {
        // Canvas screens are always RGBA.
        const format = this.HEAP32[((fmt) >> 2)];
        if (format !== -2042224636) {
            this.warnOnce('Unsupported pixel format!');
        }
    }
    private loadColorToCSSRGB(color: CGColor) {
        //var rgba = this.HEAP32[((color) >> 2)];
        return 'rgb(' + (color.R) + ',' + color.G + ',' + color.B + ')';
    }
    private loadColorToCSSRGBA(color: any) {
        const rgba = this.HEAP32[((color) >> 2)];
        return 'rgba(' + (rgba & 255) + ',' + ((rgba >> 8) & 255) + ',' + ((rgba >> 16) & 255) + ',' + (((rgba >> 24) & 255) / 255) + ')';
    }
    private translateColorToCSSRGBA(color: CGColor): string {
        return 'rgba(' + color.R + ',' + color.G + ',' + color.B + ',' + color.A + ')';
    }
    private translateRGBAToCSSRGBA(r: any, g: any, b: any, a: any) {
        return 'rgba(' + (r & 0xff) + ',' + (g & 0xff) + ',' + (b & 0xff) + ',' + (a & 0xff) / 255 + ')';
    }
    private translateRGBAToColor(r: int, g: int, b: int, a: int) {
        return r | g << 8 | b << 16 | a << 24;
    }
    private makeSurface(width: int, height: int, flags: int, usePageCanvas: boolean, source: any, rmask?: int, gmask?: int, bmask?: int, amask?: int): SDL_Surface {
        flags = flags || 0;
        const is_SDL_HWSURFACE = flags & 0x00000001;
        const is_SDL_HWPALETTE = flags & 0x00200000;
        const is_SDL_OPENGL = flags & 0x04000000;

        var surf = new SDL_Surface(); // this._malloc(60);
        var pixelFormat = new SDL_PixelFormat(); //this._malloc(44);
        //surface with SDL_HWPALETTE flag is 8bpp surface (1 byte)
        var bpp = is_SDL_HWPALETTE ? 1 : 4;
        let buffer: ByteArray = New.ByteArray(0);

        // preemptively initialize this for software surfaces,
        // otherwise it will be lazily initialized inside of SDL_LockSurface
        if (!is_SDL_HWSURFACE && !is_SDL_OPENGL) {
            buffer = New.ByteArray(width * height * 4); //this._malloc(width * height * 4);
        }

        surf.flags = flags;
        surf.format = pixelFormat;
        surf.w = width;
        surf.h = height;
        surf.pitch = width * bpp;  // assuming RGBA or indexed for now,
        // since that is what ImageData gives us in browsers
        surf.pixels = buffer;
        /** Application data associated with the surface */
        /*   surf.userdata = New.ByteArray(0);
          surf.locked = 0;
          surf.lock_data */
        surf.clip_rect = new CGRectangle(0, 0, this.Canvas.width, this.Canvas.height);
        //surf.map
        surf.refcount = 1;

        /* this.HEAP32[((surf) >> 2)] = flags;
        this.HEAP32[(((surf) + (4)) >> 2)] = pixelFormat;
        this.HEAP32[(((surf) + (8)) >> 2)] = width;
        this.HEAP32[(((surf) + (12)) >> 2)] = height;
        this.HEAP32[(((surf) + (16)) >> 2)] = width * bpp;  // assuming RGBA or indexed for now,
        // since that is what ImageData gives us in browsers
        this.HEAP32[(((surf) + (20)) >> 2)] = buffer; */

        /*  this.HEAP32[(((surf) + (36)) >> 2)] = 0;
         this.HEAP32[(((surf) + (40)) >> 2)] = 0;
         this.HEAP32[(((surf) + (44)) >> 2)] = this.Canvas.width;
         this.HEAP32[(((surf) + (48)) >> 2)] = this.Canvas.height; */

        //this.HEAP32[(((surf) + (56)) >> 2)] = 1;

        surf.format.format = Convert.ToUInt32(-2042224636);
        surf.format.BitsPerPixel = bpp * 8;
        surf.format.BytesPerPixel = bpp;
        surf.format.Rmask = rmask || 0x000000ff;
        surf.format.Gmask = gmask || 0x0000ff00;
        surf.format.Bmask = bmask || 0x00ff0000;
        surf.format.Amask = amask || 0xff000000;

        //this.HEAP32[((pixelFormat) >> 2)] = -2042224636;
        /*  this.HEAP32[(((pixelFormat) + (4)) >> 2)] = 0;// TODO
         this.HEAP8[(((pixelFormat) + (8)) >> 0)] = bpp * 8;
         this.HEAP8[(((pixelFormat) + (9)) >> 0)] = bpp; */

        /*  this.HEAP32[(((pixelFormat) + (12)) >> 2)] = rmask || 0x000000ff;
         this.HEAP32[(((pixelFormat) + (16)) >> 2)] = gmask || 0x0000ff00;
         this.HEAP32[(((pixelFormat) + (20)) >> 2)] = bmask || 0x00ff0000;
         this.HEAP32[(((pixelFormat) + (24)) >> 2)] = amask || 0xff000000; */

        // Decide if we want to use WebGL or not
        this.GL = this.GL || !!is_SDL_OPENGL;
        let canvas;
        if (!usePageCanvas) {
            if (this.canvasPool.length > 0) {
                canvas = this.canvasPool.pop();
            } else {
                canvas = document.createElement('canvas');
            }
            canvas.width = width;
            canvas.height = height;
        } else {
            canvas = this.Canvas;
        }

        var webGLContextAttributes = {
            antialias: ((this.glAttributes[13 /*SDL_GL_MULTISAMPLEBUFFERS*/] != 0) && (this.glAttributes[14 /*SDL_GL_MULTISAMPLESAMPLES*/] > 1)),
            depth: (this.glAttributes[6 /*SDL_GL_DEPTH_SIZE*/] > 0),
            stencil: (this.glAttributes[7 /*SDL_GL_STENCIL_SIZE*/] > 0),
            alpha: (this.glAttributes[3 /*SDL_GL_ALPHA_SIZE*/] > 0)
        };

        const ctx = this.Browser.CreateContext(canvas, !!is_SDL_OPENGL, usePageCanvas, webGLContextAttributes);

        this.surfaces[surf.Id] = {
            width: width,
            height: height,
            canvas: canvas,
            ctx: ctx,
            surf: surf,
            buffer: buffer,
            pixelFormat: pixelFormat,
            alpha: 255,
            flags: flags,
            locked: 0,
            usePageCanvas: usePageCanvas,
            source: source,

            isFlagSet: function (flag) {
                return flags & flag;
            }
        };

        return surf;
    }
    private copyIndexedColorData(surfData: any, rX?: int, rY?: int, rW?: int, rH?: int): void {
        // HWPALETTE works with palette
        // setted by SDL_SetColors
        if (!surfData.colors) {
            return;
        }

        var fullWidth = this.Canvas.width;
        var fullHeight = this.Canvas.height;

        var startX = rX || 0;
        var startY = rY || 0;
        var endX = (rW || (fullWidth - startX)) + startX;
        var endY = (rH || (fullHeight - startY)) + startY;

        var buffer = surfData.buffer;

        if (!surfData.image.data32) {
            surfData.image.data32 = new Uint32Array(surfData.image.data.buffer);
        }
        var data32 = surfData.image.data32;

        var colors32 = surfData.colors32;

        for (var y = startY; y < endY; ++y) {
            var base = y * fullWidth;
            for (var x = startX; x < endX; ++x) {
                data32[base + x] = colors32[this.HEAPU8[((buffer + base + x) >> 0)]];
            }
        }
    }
    private freeSurface(surf: SDL_Surface) {
        /*  var refcountPointer = surf + 56;
         var refcount = this.HEAP32[((refcountPointer) >> 2)];
         if (refcount > 1) {
             this.HEAP32[((refcountPointer) >> 2)] = refcount - 1;
             return;
         } */

        var info: any = this.surfaces[surf.Id];
        if (!info.usePageCanvas && info.canvas) {
            this.canvasPool.push(info.canvas);
        }
        if (info.buffer) {
            info.buffer = undefined;
            //this._free(info.buffer);
        }
        // this._free(info.pixelFormat);
        // this._free(surf);
        this.surfaces[surf.Id] = null;

        if (surf === this.screen) {
            this.screen = null;
        }
    }
    protected BlitSurface(src: SDL_Surface, srcrect: CGRectangle, dst: SDL_Surface, dstrect: CGRectangle, scale: any) {
        var srcData = this.surfaces[src.Id];
        var dstData = this.surfaces[dst.Id];
        let sr: CGRectangle, dr: CGRectangle;
        if (srcrect) {
            sr = srcrect; //this.loadRect(srcrect);
        } else {
            sr = new CGRectangle(0, 0, srcData.width, srcData.height);
        }
        if (dstrect) {
            dr = dstrect;//this.loadRect(dstrect);
        } else {
            dr = new CGRectangle(0, 0, srcData.width, srcData.height);
        }
        if (dstData.clipRect) {
            var widthScale = (!scale || sr.Width === 0) ? 1 : sr.Width / dr.Width;
            var heightScale = (!scale || sr.Height === 0) ? 1 : sr.Height / dr.Height;

            dr = this.intersectionOfRects(dstData.clipRect, dr);

            sr.Width = dr.Width * widthScale;
            sr.Height = dr.Height * heightScale;

            if (dstrect) {
                this.updateRect(dstrect, dr);
            }
        }
        let blitw, blith;
        if (scale) {
            blitw = dr.Width; blith = dr.Height;
        } else {
            blitw = sr.Width; blith = sr.Height;
        }
        if (sr.Width === 0 || sr.Height === 0 || blitw === 0 || blith === 0) {
            return 0;
        }
        var oldAlpha = dstData.ctx.globalAlpha;
        dstData.ctx.globalAlpha = srcData.alpha / 255;
        dstData.ctx.drawImage(srcData.canvas, sr.X, sr.Y, sr.Width, sr.Height, dr.X, dr.Y, blitw, blith);
        dstData.ctx.globalAlpha = oldAlpha;
        if (dst !== this.screen) {
            // XXX As in IMG_Load, for compatibility we write out |pixels|
            this.warnOnce('WARNING: copying canvas data to memory for compatibility');
            this._SDL_LockSurface(dst);
            dstData.locked--; // The surface is not actually locked in this hack
        }
        return 0;
    }
    private downFingers: any = {};
    private savedKeydown: any = null;

    private receiveEvent(event: any) {
        const unpressAllPressedKeys = () => {
            // Un-press all pressed keys: TODO
            for (var code in this.keyboardMap) {
                this.events.push({
                    type: 'keyup',
                    keyCode: this.keyboardMap[code]
                });
            }
        };
        switch (event.type) {
            case 'touchstart': case 'touchmove': {
                event.preventDefault();

                var touches: any[] = [];

                // Clear out any touchstart events that we've already processed
                if (event.type === 'touchstart') {
                    for (var i = 0; i < event.touches.length; i++) {
                        var touch = event.touches[i];
                        if (this.downFingers[touch.identifier] !== true) {
                            this.downFingers[touch.identifier] = true;
                            touches.push(touch);
                        }
                    }
                } else {
                    touches = event.touches;
                }

                var firstTouch = touches[0];
                if (firstTouch) {
                    if (event.type === 'touchstart') {
                        this.DOMButtons[0] = 1;
                    }
                    var mouseEventType;
                    switch (event.type) {
                        case 'touchstart': mouseEventType = 'mousedown'; break;
                        case 'touchmove': mouseEventType = 'mousemove'; break;
                    }
                    var mouseEvent = {
                        type: mouseEventType,
                        button: 0,
                        pageX: firstTouch.clientX,
                        pageY: firstTouch.clientY
                    };
                    this.events.push(mouseEvent);
                }

                for (var i = 0; i < touches.length; i++) {
                    var touch = touches[i];
                    this.events.push({
                        type: event.type,
                        touch: touch
                    });
                };
                break;
            }
            case 'touchend': {
                event.preventDefault();

                // Remove the entry in the SDL.downFingers hash
                // because the finger is no longer down.
                for (var i = 0; i < event.changedTouches.length; i++) {
                    var touch = event.changedTouches[i];
                    if (this.downFingers[touch.identifier] === true) {
                        delete this.downFingers[touch.identifier];
                    }
                }

                const mouseEvent: any = {
                    type: 'mouseup',
                    button: 0,
                    pageX: event.changedTouches[0].clientX,
                    pageY: event.changedTouches[0].clientY
                };
                this.DOMButtons[0] = 0;
                this.events.push(mouseEvent);

                for (var i = 0; i < event.changedTouches.length; i++) {
                    var touch = event.changedTouches[i];
                    this.events.push({
                        type: 'touchend',
                        touch: touch
                    });
                };
                break;
            }
            case 'DOMMouseScroll': case 'mousewheel': case 'wheel':
                var delta = -this.Browser.GetMouseWheelDelta(event); // Flip the wheel direction to translate from browser wheel direction (+:down) to SDL direction (+:up)
                delta = (delta == 0) ? 0 : (delta > 0 ? Math.max(delta, 1) : Math.min(delta, -1)); // Quantize to integer so that minimum scroll is at least +/- 1.

                // Simulate old-style SDL events representing mouse wheel input as buttons
                var button = delta > 0 ? 3 /*SDL_BUTTON_WHEELUP-1*/ : 4 /*SDL_BUTTON_WHEELDOWN-1*/; // Subtract one since JS->C marshalling is defined to add one back.
                this.events.push({ type: 'mousedown', button: button, pageX: event.pageX, pageY: event.pageY });
                this.events.push({ type: 'mouseup', button: button, pageX: event.pageX, pageY: event.pageY });

                // Pass a delta motion event.
                this.events.push({ type: 'wheel', deltaX: 0, deltaY: delta });
                event.preventDefault(); // If we don't prevent this, then 'wheel' event will be sent again by the browser as 'DOMMouseScroll' and we will receive this same event the second time.
                break;
            case 'mousemove':
                if (this.DOMButtons[0] === 1) {
                    this.events.push({
                        type: 'touchmove',
                        touch: {
                            identifier: 0,
                            deviceID: -1,
                            pageX: event.pageX,
                            pageY: event.pageY
                        }
                    });
                }
                if (this.Browser.pointerLock) {
                    // workaround for firefox bug 750111
                    if ('mozMovementX' in event) {
                        event['movementX'] = event['mozMovementX'];
                        event['movementY'] = event['mozMovementY'];
                    }
                    // workaround for Firefox bug 782777
                    if (event['movementX'] == 0 && event['movementY'] == 0) {
                        // ignore a mousemove event if it doesn't contain any movement info
                        // (without pointer lock, we infer movement from pageX/pageY, so this check is unnecessary)
                        event.preventDefault();
                        return;
                    }
                }
            // fall through
            case 'keydown': case 'keyup': case 'keypress': case 'mousedown': case 'mouseup':
                // If we preventDefault on keydown events, the subsequent keypress events
                // won't fire. However, it's fine (and in some cases necessary) to
                // preventDefault for keys that don't generate a character. Otherwise,
                // preventDefault is the right thing to do in general.
                if (event.type !== 'keydown' || (!this.SDL_unicode() && !this.textInput) || (event.keyCode === 8 /* backspace */ || event.keyCode === 9 /* tab */)) {
                    event.preventDefault();
                }

                if (event.type == 'mousedown') {
                    this.DOMButtons[event.button] = 1;
                    this.events.push({
                        type: 'touchstart',
                        touch: {
                            identifier: 0,
                            deviceID: -1,
                            pageX: event.pageX,
                            pageY: event.pageY
                        }
                    });
                } else if (event.type == 'mouseup') {
                    // ignore extra ups, can happen if we leave the canvas while pressing down, then return,
                    // since we add a mouseup in that case
                    if (!this.DOMButtons[event.button]) {
                        return;
                    }

                    this.events.push({
                        type: 'touchend',
                        touch: {
                            identifier: 0,
                            deviceID: -1,
                            pageX: event.pageX,
                            pageY: event.pageY
                        }
                    });
                    this.DOMButtons[event.button] = 0;
                }

                // We can only request fullscreen as the result of user input.
                // Due to this limitation, we toggle a boolean on keydown which
                // SDL_WM_ToggleFullScreen will check and subsequently set another
                // flag indicating for us to request fullscreen on the following
                // keyup. This isn't perfect, but it enables SDL_WM_ToggleFullScreen
                // to work as the result of a keypress (which is an extremely
                // common use case).
                if (event.type === 'keydown' || event.type === 'mousedown') {
                    this.canRequestFullscreen = true;
                } else if (event.type === 'keyup' || event.type === 'mouseup') {
                    if (this.isRequestingFullscreen) {
                        this.requestFullscreen(/*lockPointer=*/true, /*resizeCanvas=*/true);
                        this.isRequestingFullscreen = false;
                    }
                    this.canRequestFullscreen = false;
                }

                // SDL expects a unicode character to be passed to its keydown events.
                // Unfortunately, the browser APIs only provide a charCode property on
                // keypress events, so we must backfill in keydown events with their
                // subsequent keypress event's charCode.
                if (event.type === 'keypress' && this.savedKeydown) {
                    // charCode is read-only
                    this.savedKeydown.keypressCharCode = event.charCode;
                    this.savedKeydown = null;
                } else if (event.type === 'keydown') {
                    this.savedKeydown = event;
                }

                // Don't push keypress events unless SDL_StartTextInput has been called.
                if (event.type !== 'keypress' || this.textInput) {
                    this.events.push(event);
                }
                break;
            case 'mouseout':
                // Un-press all pressed mouse buttons, because we might miss the release outside of the canvas
                for (var i = 0; i < 3; i++) {
                    if (this.DOMButtons[i]) {
                        this.events.push({
                            type: 'mouseup',
                            button: i,
                            pageX: event.pageX,
                            pageY: event.pageY
                        });
                        this.DOMButtons[i] = 0;
                    }
                }
                event.preventDefault();
                break;
            case 'focus':
                this.events.push(event);
                event.preventDefault();
                break;
            case 'blur':
                this.events.push(event);
                unpressAllPressedKeys();
                event.preventDefault();
                break;
            case 'visibilitychange':
                this.events.push({
                    type: 'visibilitychange',
                    visible: !document.hidden
                });
                unpressAllPressedKeys();
                event.preventDefault();
                break;
            case 'unload':
                if (this.Browser.mainLoop.Runner) {
                    this.events.push(event);
                    // Force-run a main event loop, since otherwise this event will never be caught!
                    this.Browser.mainLoop.Runner();
                }
                return;
            case 'resize':
                this.events.push(event);
                // manually triggered resize event doesn't have a preventDefault member
                if (event.preventDefault) {
                    event.preventDefault();
                }
                break;
        }
        if (this.events.length >= 10000) {
            this.err('SDL event queue full, dropping events');
            this.events = this.events.slice(0, 10000);
        }
        // If we have a handler installed, this will push the events to the app
        // instead of the app polling for them.
        this.flushEventsToHandler();
        return;
    }
    private lookupKeyCodeForEvent(event: any): int {
        var code = event.keyCode;
        if (code >= 65 && code <= 90) {
            code += 32; // make lowercase for SDL
        } else {
            code = this.keyCodes[event.keyCode] || event.keyCode;
            // If this is one of the modifier keys (224 | 1<<10 - 227 | 1<<10), and the event specifies that it is
            // a right key, add 4 to get the right key SDL key code.
            if (event.location === 2 /*KeyboardEvent.DOM_KEY_LOCATION_RIGHT*/ && code >= (224 | 1 << 10) && code <= (227 | 1 << 10)) {
                code += 4;
            }
        }
        return code;
    }
    private handleEvent(event: any): void {
        if (event.handled) return;
        event.handled = true;

        switch (event.type) {
            case 'touchstart': case 'touchend': case 'touchmove': {
                this.Browser.CalculateMouseEvent(event);
                break;
            }
            case 'keydown': case 'keyup': {
                const down: boolean = event.type === 'keydown';
                const code: int = this.lookupKeyCodeForEvent(event);
                // Assigning a boolean to HEAP8, that's alright but Closure would like to warn about it:
                /** @suppress{checkTypes} */
                this.HEAP8[(((this.keyboardState) + (code)) >> 0)] = down ? 1 : 0;
                // TODO: lmeta, rmeta, numlock, capslock, KMOD_MODE, KMOD_RESERVED
                this.modState = (this.HEAP8[(((this.keyboardState) + (1248)) >> 0)] ? 0x0040 : 0) | // KMOD_LCTRL
                    (this.HEAP8[(((this.keyboardState) + (1249)) >> 0)] ? 0x0001 : 0) | // KMOD_LSHIFT
                    (this.HEAP8[(((this.keyboardState) + (1250)) >> 0)] ? 0x0100 : 0) | // KMOD_LALT
                    (this.HEAP8[(((this.keyboardState) + (1252)) >> 0)] ? 0x0080 : 0) | // KMOD_RCTRL
                    (this.HEAP8[(((this.keyboardState) + (1253)) >> 0)] ? 0x0002 : 0) | // KMOD_RSHIFT
                    (this.HEAP8[(((this.keyboardState) + (1254)) >> 0)] ? 0x0200 : 0); //  KMOD_RALT
                if (down) {
                    this.keyboardMap[code] = event.keyCode; // save the DOM input, which we can use to unpress it during blur
                } else {
                    delete this.keyboardMap[code];
                }

                break;
            }
            case 'mousedown': case 'mouseup':
                if (event.type == 'mousedown') {
                    // SDL_BUTTON(x) is defined as (1 << ((x)-1)).  SDL buttons are 1-3,
                    // and DOM buttons are 0-2, so this means that the below formula is
                    // correct.
                    this.buttonState |= 1 << event.button;
                } else if (event.type === 'mouseup') {
                    this.buttonState &= ~(1 << event.button);
                }
            // fall through
            case 'mousemove': {
                this.Browser.CalculateMouseEvent(event);
                break;
            }
        }
    }
    private flushEventsToHandler(): void {
        if (!this.eventHandler)
            return;

        while (this.pollEvent(this.eventHandlerTemp)) {
            throw new NotImplementedException('');
            //wasmTable.get(this.eventHandler)(this.eventHandlerContext, this.eventHandlerTemp);
        }
    }
    private pollEvent(ptr: int): int {
        if (this.initFlags & 0x200 && this.joystickEventState) {
            // If SDL_INIT_JOYSTICK was supplied AND the joystick system is configured
            // to automatically query for events, query for joystick events.
            this.queryJoysticks();
        }
        if (ptr) {
            while (this.events.length > 0) {
                if (this.makeCEvent(this.events.shift(), ptr) !== false) return 1;
            }
            return 0;
        } else {
            // XXX: somewhat risky in that we do not check if the event is real or not (makeCEvent returns false) if no pointer supplied
            return this.events.length > 0 ? 1 : 0;
        }
    }
    private makeCEvent(event: any, ptr: int): boolean {
        if (typeof event === 'number') {
            // This is a pointer to a copy of a native C event that was SDL_PushEvent'ed
            this._memcpy(ptr, event, 28);
            this._free(event); // the copy is no longer needed
            return false;
        }

        this.handleEvent(event);

        switch (event.type) {
            case 'keydown': case 'keyup': {
                var down = event.type === 'keydown';
                //out('Received key event: ' + event.keyCode);
                var key = this.lookupKeyCodeForEvent(event);
                var scan;
                if (key >= 1024) {
                    scan = key - 1024;
                } else {
                    scan = this.scanCodes[key] || key;
                }

                this.HEAP32[((ptr) >> 2)] = this.DOMEventToSDLEvent[event.type];
                this.HEAP8[(((ptr) + (8)) >> 0)] = down ? 1 : 0;
                this.HEAP8[(((ptr) + (9)) >> 0)] = 0; // TODO
                this.HEAP32[(((ptr) + (12)) >> 2)] = scan;
                this.HEAP32[(((ptr) + (16)) >> 2)] = key;
                this.HEAP16[(((ptr) + (20)) >> 1)] = this.modState;
                // some non-character keys (e.g. backspace and tab) won't have keypressCharCode set, fill in with the keyCode.
                this.HEAP32[(((ptr) + (24)) >> 2)] = event.keypressCharCode || key;

                break;
            }
            case 'keypress': {
                this.HEAP32[((ptr) >> 2)] = this.DOMEventToSDLEvent[event.type];
                // Not filling in windowID for now
                var cStr = this.intArrayFromString(String.fromCharCode(event.charCode));
                for (var i = 0; i < cStr.length; ++i) {
                    this.HEAP8[(((ptr) + (8 + i)) >> 0)] = cStr[i];
                }
                break;
            }
            case 'mousedown': case 'mouseup': case 'mousemove': {
                if (event.type != 'mousemove') {
                    var down = event.type === 'mousedown';
                    this.HEAP32[((ptr) >> 2)] = this.DOMEventToSDLEvent[event.type];
                    this.HEAP32[(((ptr) + (4)) >> 2)] = 0;
                    this.HEAP32[(((ptr) + (8)) >> 2)] = 0;
                    this.HEAP32[(((ptr) + (12)) >> 2)] = 0;
                    this.HEAP8[(((ptr) + (16)) >> 0)] = event.button + 1; // DOM buttons are 0-2, SDL 1-3
                    this.HEAP8[(((ptr) + (17)) >> 0)] = down ? 1 : 0;
                    this.HEAP32[(((ptr) + (20)) >> 2)] = this.Browser.mouseX;
                    this.HEAP32[(((ptr) + (24)) >> 2)] = this.Browser.mouseY;
                } else {
                    this.HEAP32[((ptr) >> 2)] = this.DOMEventToSDLEvent[event.type];
                    this.HEAP32[(((ptr) + (4)) >> 2)] = 0;
                    this.HEAP32[(((ptr) + (8)) >> 2)] = 0;
                    this.HEAP32[(((ptr) + (12)) >> 2)] = 0;
                    this.HEAP32[(((ptr) + (16)) >> 2)] = this.buttonState;
                    this.HEAP32[(((ptr) + (20)) >> 2)] = this.Browser.mouseX;
                    this.HEAP32[(((ptr) + (24)) >> 2)] = this.Browser.mouseY;
                    this.HEAP32[(((ptr) + (28)) >> 2)] = this.Browser.mouseMovementX;
                    this.HEAP32[(((ptr) + (32)) >> 2)] = this.Browser.mouseMovementY;
                }
                break;
            }
            case 'wheel': {
                this.HEAP32[((ptr) >> 2)] = this.DOMEventToSDLEvent[event.type];
                this.HEAP32[(((ptr) + (16)) >> 2)] = event.deltaX;
                this.HEAP32[(((ptr) + (20)) >> 2)] = event.deltaY;
                break;
            }
            case 'touchstart': case 'touchend': case 'touchmove': {
                var touch = event.touch;
                if (!this.Browser.touches[touch.identifier]) break;
                var w = this.Canvas.width;
                var h = this.Canvas.height;
                var x = this.Browser.touches[touch.identifier].x / w;
                var y = this.Browser.touches[touch.identifier].y / h;
                var lx = this.Browser.lastTouches[touch.identifier].x / w;
                var ly = this.Browser.lastTouches[touch.identifier].y / h;
                var dx = x - lx;
                var dy = y - ly;
                if (touch['deviceID'] === undefined) touch.deviceID = this.TOUCH_DEFAULT_ID;
                if (dx === 0 && dy === 0 && event.type === 'touchmove') return false; // don't send these if nothing happened
                this.HEAP32[((ptr) >> 2)] = this.DOMEventToSDLEvent[event.type];
                this.HEAP32[(((ptr) + (4)) >> 2)] = this._SDL_GetTicks();
                (tempI64 = [touch.deviceID >>> 0, (tempDouble = touch.deviceID, (+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math.min((+(Math.floor((tempDouble) / 4294967296.0))), 4294967295.0)) | 0) >>> 0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble))) >>> 0)) / 4294967296.0))))) >>> 0) : 0)], this.HEAP32[(((ptr) + (8)) >> 2)] = tempI64[0], this.HEAP32[(((ptr) + (12)) >> 2)] = tempI64[1]);
                (tempI64 = [touch.identifier >>> 0, (tempDouble = touch.identifier, (+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math.min((+(Math.floor((tempDouble) / 4294967296.0))), 4294967295.0)) | 0) >>> 0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble))) >>> 0)) / 4294967296.0))))) >>> 0) : 0)], this.HEAP32[(((ptr) + (16)) >> 2)] = tempI64[0], this.HEAP32[(((ptr) + (20)) >> 2)] = tempI64[1]);
                this.HEAPF32[(((ptr) + (24)) >> 2)] = x;
                this.HEAPF32[(((ptr) + (28)) >> 2)] = y;
                this.HEAPF32[(((ptr) + (32)) >> 2)] = dx;
                this.HEAPF32[(((ptr) + (36)) >> 2)] = dy;
                if (touch.force !== undefined) {
                    this.HEAPF32[(((ptr) + (40)) >> 2)] = touch.force;
                } else { // No pressure data, send a digital 0/1 pressure.
                    this.HEAPF32[(((ptr) + (40)) >> 2)] = event.type == "touchend" ? 0 : 1;
                }
                break;
            }
            case 'unload': {
                this.HEAP32[((ptr) >> 2)] = this.DOMEventToSDLEvent[event.type];
                break;
            }
            case 'resize': {
                this.HEAP32[((ptr) >> 2)] = this.DOMEventToSDLEvent[event.type];
                this.HEAP32[(((ptr) + (4)) >> 2)] = event.w;
                this.HEAP32[(((ptr) + (8)) >> 2)] = event.h;
                break;
            }
            case 'joystick_button_up': case 'joystick_button_down': {
                var state = event.type === 'joystick_button_up' ? 0 : 1;
                this.HEAP32[((ptr) >> 2)] = this.DOMEventToSDLEvent[event.type];
                this.HEAP8[(((ptr) + (4)) >> 0)] = event.index;
                this.HEAP8[(((ptr) + (5)) >> 0)] = event.button;
                this.HEAP8[(((ptr) + (6)) >> 0)] = state;
                break;
            }
            case 'joystick_axis_motion': {
                this.HEAP32[((ptr) >> 2)] = this.DOMEventToSDLEvent[event.type];
                this.HEAP8[(((ptr) + (4)) >> 0)] = event.index;
                this.HEAP8[(((ptr) + (5)) >> 0)] = event.axis;
                this.HEAP32[(((ptr) + (8)) >> 2)] = this.joystickAxisValueConversion(event.value);
                break;
            }
            case 'focus': {
                var SDL_WINDOWEVENT_FOCUS_GAINED = 12 /* SDL_WINDOWEVENT_FOCUS_GAINED */;
                this.HEAP32[((ptr) >> 2)] = this.DOMEventToSDLEvent[event.type];
                this.HEAP32[(((ptr) + (4)) >> 2)] = 0;
                this.HEAP8[(((ptr) + (8)) >> 0)] = SDL_WINDOWEVENT_FOCUS_GAINED;
                break;
            }
            case 'blur': {
                var SDL_WINDOWEVENT_FOCUS_LOST = 13 /* SDL_WINDOWEVENT_FOCUS_LOST */;
                this.HEAP32[((ptr) >> 2)] = this.DOMEventToSDLEvent[event.type];
                this.HEAP32[(((ptr) + (4)) >> 2)] = 0;
                this.HEAP8[(((ptr) + (8)) >> 0)] = SDL_WINDOWEVENT_FOCUS_LOST;
                break;
            }
            case 'visibilitychange': {
                var SDL_WINDOWEVENT_SHOWN = 1 /* SDL_WINDOWEVENT_SHOWN */;
                var SDL_WINDOWEVENT_HIDDEN = 2 /* SDL_WINDOWEVENT_HIDDEN */;
                var visibilityEventID = event.visible ? SDL_WINDOWEVENT_SHOWN : SDL_WINDOWEVENT_HIDDEN;
                this.HEAP32[((ptr) >> 2)] = this.DOMEventToSDLEvent[event.type];
                this.HEAP32[(((ptr) + (4)) >> 2)] = 0;
                this.HEAP8[(((ptr) + (8)) >> 0)] = visibilityEventID;
                break;
            }
            default: throw 'Unhandled SDL event: ' + event.type;
        }
        throw 'Unhandled SDL event: ' + event.type;
    }
    private makeFontString(height: int, fontName: string): string {
        if (fontName.charAt(0) != "'" && fontName.charAt(0) != '"') {
            // https://developer.mozilla.org/ru/docs/Web/CSS/font-family
            // Font family names containing whitespace should be quoted.
            // BTW, quote all font names is easier than searching spaces
            fontName = '"' + fontName + '"';
        }
        return height + 'px ' + fontName + ', serif';
    }
    private estimateTextWidth(fontData, text: string): int {
        var h = fontData.size;
        var fontString = this.makeFontString(h, fontData.name);
        var tempCtx = this.SDL_ttfContext();
        this.assert(tempCtx, 'TTF_Init must have been called');
        tempCtx.font = fontString;
        var ret = tempCtx.measureText(text).width | 0;
        return ret;
    }
    private allocateChannels(num: int): void { // called from Mix_AllocateChannels and init
        if (this.numChannels && this.numChannels >= num && num !== 0) return;
        this.numChannels = num;
        this.channels = [];
        for (var i = 0; i < num; i++) {
            this.channels[i] = {
                audio: null,
                volume: 1.0
            };
        }
    }
    private setGetVolume(info, volume): int {
        if (!info) {
            return 0;
        }
        const ret = info.volume * 128; // MIX_MAX_VOLUME
        if (volume !== -1) {
            info.volume = Math.min(Math.max(volume, 0), 128) / 128;
            if (info.audio) {
                try {
                    info.audio.volume = info.volume; // For <audio> element
                    if (info.audio.webAudioGainNode) info.audio.webAudioGainNode['gain']['value'] = info.volume; // For WebAudio playback
                } catch (e) {
                    this.err('setGetVolume failed to set audio volume: ' + e);
                }
            }
        }
        return ret;
    }
    private setPannerPosition(info: any, x: int, y: int, z: int): void {
        if (!info) return;
        if (info.audio) {
            if (info.audio.webAudioPannerNode) {
                info.audio.webAudioPannerNode['setPosition'](x, y, z);
            }
        }
    }
    private playWebAudio(audio: any) {
        if (!audio) return;
        if (audio.webAudioNode) return; // This instance is already playing, don't start again.
        if (!this.webAudioAvailable()) return;
        try {
            var webAudio = audio.resource.webAudio;
            audio.paused = false;
            if (!webAudio.decodedBuffer) {
                if (webAudio.onDecodeComplete === undefined) this.abort("Cannot play back audio object that was not loaded");
                webAudio.onDecodeComplete.push(function () { if (!audio.paused) this.playWebAudio(audio); });
                return;
            }
            audio.webAudioNode = this.audioContext['createBufferSource']();
            audio.webAudioNode['buffer'] = webAudio.decodedBuffer;
            audio.webAudioNode['loop'] = audio.loop;
            audio.webAudioNode['onended'] = () => { audio['onended'](); } // For <media> element compatibility, route the onended signal to the instance.

            audio.webAudioPannerNode = this.audioContext['createPanner']();
            // avoid Chrome bug
            // If posz = 0, the sound will come from only the right.
            // By posz = -0.5 (slightly ahead), the sound will come from right and left correctly.
            audio.webAudioPannerNode["setPosition"](0, 0, -.5);
            audio.webAudioPannerNode['panningModel'] = 'equalpower';

            // Add an intermediate gain node to control volume.
            audio.webAudioGainNode = this.audioContext['createGain']();
            audio.webAudioGainNode['gain']['value'] = audio.volume;

            audio.webAudioNode['connect'](audio.webAudioPannerNode);
            audio.webAudioPannerNode['connect'](audio.webAudioGainNode);
            audio.webAudioGainNode['connect'](this.audioContext['destination']);

            audio.webAudioNode['start'](0, audio.currentPosition);
            audio.startTime = this.audioContext['currentTime'] - audio.currentPosition;
        } catch (e) {
            this.err('playWebAudio failed: ' + e);
        }
    }
    private pauseWebAudio(audio: any): void {
        if (!audio) return;
        if (audio.webAudioNode) {
            try {
                // Remember where we left off, so that if/when we resume, we can restart the playback at a proper place.
                audio.currentPosition = (this.audioContext['currentTime'] - audio.startTime) % audio.resource.webAudio.decodedBuffer.duration;
                // Important: When we reach here, the audio playback is stopped by the user. But when calling .stop() below, the Web Audio
                // graph will send the onended signal, but we don't want to process that, since pausing should not clear/destroy the audio
                // channel.
                audio.webAudioNode['onended'] = undefined;
                audio.webAudioNode.stop(0); // 0 is a default parameter, but WebKit is confused by it #3861
                audio.webAudioNode = undefined;
            } catch (e) {
                this.err('pauseWebAudio failed: ' + e);
            }
        }
        audio.paused = true;
    }
    private openAudioContext(): void {
        // Initialize Web Audio API if we haven't done so yet. Note: Only initialize Web Audio context ever once on the web page,
        // since initializing multiple times fails on Chrome saying 'audio resources have been exhausted'.
        if (!this.audioContext) {
            if (typeof (AudioContext) !== 'undefined') this.audioContext = new AudioContext();
            else if (typeof (webkitAudioContext) !== 'undefined') this.audioContext = new webkitAudioContext();
        }
    }
    private webAudioAvailable(): boolean {
        return !!this.audioContext;
    }
    private fillWebAudioBufferFromHeap(heapPtr, sizeSamplesPerChannel, dstAudioBuffer): void {
        // The input audio data is interleaved across the channels, i.e. [L, R, L, R, L, R, ...] and is either 8-bit, 16-bit or float as
        // supported by the SDL API. The output audio wave data for Web Audio API must be in planar buffers of [-1,1]-normalized Float32 data,
        // so perform a buffer conversion for the data.
        var audio = this.SDL_audio();
        var numChannels = audio.channels;
        for (var c = 0; c < numChannels; ++c) {
            var channelData = dstAudioBuffer['getChannelData'](c);
            if (channelData.length !== sizeSamplesPerChannel) {
                throw 'Web Audio output buffer length mismatch! Destination size: ' + channelData.length + ' samples vs expected ' + sizeSamplesPerChannel + ' samples!';
            }
            if (audio.format == 0x8010 /*AUDIO_S16LSB*/) {
                for (var j = 0; j < sizeSamplesPerChannel; ++j) {
                    channelData[j] = (this.HEAP16[(((heapPtr) + ((j * numChannels + c) * 2)) >> 1)]) / 0x8000;
                }
            } else if (audio.format == 0x0008 /*AUDIO_U8*/) {
                for (var j = 0; j < sizeSamplesPerChannel; ++j) {
                    var v = (this.HEAP8[(((heapPtr) + (j * numChannels + c)) >> 0)]);
                    channelData[j] = ((v >= 0) ? v - 128 : v + 128) / 128;
                }
            } else if (audio.format == 0x8120 /*AUDIO_F32*/) {
                for (var j = 0; j < sizeSamplesPerChannel; ++j) {
                    channelData[j] = (this.HEAPF32[(((heapPtr) + ((j * numChannels + c) * 4)) >> 2)]);
                }
            } else {
                throw 'Invalid SDL audio format ' + audio.format + '!';
            }
        }
    }
    private debugSurface(surfData): void {
        console.log('dumping surface ' + [surfData.surf, surfData.source, surfData.width, surfData.height]);
        var image = surfData.ctx.getImageData(0, 0, surfData.width, surfData.height);
        var data = image.data;
        var num = Math.min(surfData.width, surfData.height);
        for (var i = 0; i < num; i++) {
            console.log('   diagonal ' + i + ':' + [data[i * surfData.width * 4 + i * 4 + 0], data[i * surfData.width * 4 + i * 4 + 1], data[i * surfData.width * 4 + i * 4 + 2], data[i * surfData.width * 4 + i * 4 + 3]]);
        }
    }
    private joystickEventState: int = 1;
    private lastJoystickState: any = {};
    private joystickNamePool: any = {};
    private recordJoystickState(joystick, state): void {
        // Standardize button state.
        var buttons = new Array(state.buttons.length);
        for (var i = 0; i < state.buttons.length; i++) {
            buttons[i] = this.getJoystickButtonState(state.buttons[i]);
        }

        this.lastJoystickState[joystick] = {
            buttons: buttons,
            axes: state.axes.slice(0),
            timestamp: state.timestamp,
            index: state.index,
            id: state.id
        };
    }
    private getJoystickButtonState(button): boolean {
        if (typeof button === 'object') {
            // Current gamepad API editor's draft (Firefox Nightly)
            // https://dvcs.w3.org/hg/gamepad/raw-file/default/gamepad.html#idl-def-GamepadButton
            return button['pressed'];
        } else {
            // Current gamepad API working draft (Firefox / Chrome Stable)
            // http://www.w3.org/TR/2012/WD-gamepad-20120529/#gamepad-interface
            return button > 0;
        }
    }
    private queryJoysticks(): void {
        let joystick: any;
        for (joystick in this.lastJoystickState) {
            var state = this.getGamepad(joystick - 1);
            var prevState = this.lastJoystickState[joystick];
            // If joystick was removed, state returns null.
            if (typeof state === 'undefined') return;
            if (state === null) return;
            // Check only if the timestamp has differed.
            // NOTE: Timestamp is not available in Firefox.
            // NOTE: Timestamp is currently not properly set for the GearVR controller
            //       on Samsung Internet: it is always zero.
            if (typeof state.timestamp !== 'number' || state.timestamp !== prevState.timestamp || !state.timestamp) {
                var i;
                for (i = 0; i < state.buttons.length; i++) {
                    var buttonState = this.getJoystickButtonState(state.buttons[i]);
                    // NOTE: The previous state already has a boolean representation of
                    //       its button, so no need to standardize its button state here.
                    if (buttonState !== prevState.buttons[i]) {
                        // Insert button-press event.
                        this.events.push({
                            type: buttonState ? 'joystick_button_down' : 'joystick_button_up',
                            joystick: joystick,
                            index: joystick - 1,
                            button: i
                        });
                    }
                }
                for (i = 0; i < state.axes.length; i++) {
                    if (state.axes[i] !== prevState.axes[i]) {
                        // Insert axes-change event.
                        this.events.push({
                            type: 'joystick_axis_motion',
                            joystick: joystick,
                            index: joystick - 1,
                            axis: i,
                            value: state.axes[i]
                        });
                    }
                }

                this.recordJoystickState(joystick, state);
            }
        }
    }
    private joystickAxisValueConversion(value): int {
        // Make sure value is properly clamped
        value = Math.min(1, Math.max(value, -1));
        // Ensures that 0 is 0, 1 is 32767, and -1 is 32768.
        return Math.ceil(((value + 1) * 32767.5) - 32768);
    }
    private getGamepads(): any[] {
        var fcn = navigator.getGamepads || (navigator as any).webkitGamepads || (navigator as any).mozGamepads || (navigator as any).gamepads || (navigator as any).webkitGetGamepads;
        if (fcn !== undefined) {
            // The function must be applied on the navigator object.
            return fcn.apply(navigator);
        } else {
            return [];
        }
    }
    private getGamepad(deviceIndex: int): any {
        var gamepads = this.getGamepads();
        if (gamepads.length > deviceIndex && deviceIndex >= 0) {
            return gamepads[deviceIndex];
        }
        return null;
    }


    private _SDL_FillRect(surf: SDL_Surface, rect: CGRectangle, color: CGColor | int) {
        var surfData = this.surfaces[surf.Id];
        this.assert(!surfData.locked); // but we could unlock and re-lock if we must..

        if (is.int(color)) {
            if (surfData.isFlagSet(0x00200000 /* SDL_HWPALETTE */)) {
                //in SDL_HWPALETTE color is index (0..255)
                //so we should translate 1 byte value to
                //32 bit canvas
                color = surfData.colors32[color];
            }
        }

        var r = rect != null ? rect : new CGRectangle(0, 0, surfData.width, surfData.height);

        if (surfData.clipRect) {
            r = this.intersectionOfRects(surfData.clipRect, r);

            if (rect) {
                this.updateRect(rect, r);
            }
        }

        surfData.ctx.save();
        surfData.ctx.fillStyle = this.translateColorToCSSRGBA(color as any);
        surfData.ctx.fillRect(r.X, r.Y, r.Width, r.Height);
        surfData.ctx.restore();
        return 0;
    }

    private _SDL_Flip(surf): void {
        // We actually do this in Unlock, since the screen surface has as its canvas
        // backing the page canvas element
    }

    private doNotCaptureKeyboard: boolean = false;
    private keyboardListeningElement: any;

    /** @param{number=} initFlags */
    private _SDL_Init(initFlags: int): int {
        this.startTime = Date.now();
        this.initFlags = initFlags;

        // capture all key events. we just keep down and up, but also capture press to prevent default actions
        if (!this.doNotCaptureKeyboard) {
            var keyboardListeningElement = this.keyboardListeningElement || document;
            keyboardListeningElement.addEventListener("keydown", this.receiveEvent);
            keyboardListeningElement.addEventListener("keyup", this.receiveEvent);
            keyboardListeningElement.addEventListener("keypress", this.receiveEvent);
            window.addEventListener("focus", this.receiveEvent);
            window.addEventListener("blur", this.receiveEvent);
            document.addEventListener("visibilitychange", this.receiveEvent);
        }

        window.addEventListener("unload", this.receiveEvent);
        this.keyboardState = this._malloc(0x10000); // Our SDL needs 512, but 64K is safe for older SDLs
        this._memset(this.keyboardState, 0, 0x10000);
        // Initialize this structure carefully for closure
        this.DOMEventToSDLEvent['keydown'] = 0x300  /* SDL_KEYDOWN */;
        this.DOMEventToSDLEvent['keyup'] = 0x301  /* SDL_KEYUP */;
        this.DOMEventToSDLEvent['keypress'] = 0x303  /* SDL_TEXTINPUT */;
        this.DOMEventToSDLEvent['mousedown'] = 0x401  /* SDL_MOUSEBUTTONDOWN */;
        this.DOMEventToSDLEvent['mouseup'] = 0x402  /* SDL_MOUSEBUTTONUP */;
        this.DOMEventToSDLEvent['mousemove'] = 0x400  /* SDL_MOUSEMOTION */;
        this.DOMEventToSDLEvent['wheel'] = 0x403  /* SDL_MOUSEWHEEL */;
        this.DOMEventToSDLEvent['touchstart'] = 0x700  /* SDL_FINGERDOWN */;
        this.DOMEventToSDLEvent['touchend'] = 0x701  /* SDL_FINGERUP */;
        this.DOMEventToSDLEvent['touchmove'] = 0x702  /* SDL_FINGERMOTION */;
        this.DOMEventToSDLEvent['unload'] = 0x100  /* SDL_QUIT */;
        this.DOMEventToSDLEvent['resize'] = 0x7001 /* SDL_VIDEORESIZE/SDL_EVENT_COMPAT2 */;
        this.DOMEventToSDLEvent['visibilitychange'] = 0x200 /* SDL_WINDOWEVENT */;
        this.DOMEventToSDLEvent['focus'] = 0x200 /* SDL_WINDOWEVENT */;
        this.DOMEventToSDLEvent['blur'] = 0x200 /* SDL_WINDOWEVENT */;

        // These are not technically DOM events; the HTML gamepad API is poll-based.
        // However, we define them here, as the rest of the SDL code assumes that
        // all SDL events originate as DOM events.
        this.DOMEventToSDLEvent['joystick_axis_motion'] = 0x600 /* SDL_JOYAXISMOTION */;
        this.DOMEventToSDLEvent['joystick_button_down'] = 0x603 /* SDL_JOYBUTTONDOWN */;
        this.DOMEventToSDLEvent['joystick_button_up'] = 0x604 /* SDL_JOYBUTTONUP */;
        return 0; // success
    }


    private _SDL_MapRGBA(fmt, r, g, b, a): CGColor {
        this.checkPixelFormat(fmt);
        // We assume the machine is little-endian.
        return CGColor.FromRgba(r, g, b, a);
    }

    private _SDL_AudioQuit(): void {
        for (let i = 0; i < this.numChannels; ++i) {
            if (this.channels[i].audio) {
                this.channels[i].audio.pause();
                this.channels[i].audio = undefined;
            }
        }
        if (this.music_audio) this.music_audio.pause();
        this.music_audio = undefined;
    }
    private _SDL_Quit() {
        this._SDL_AudioQuit();
        this.out('SDL_Quit called (and ignored)');
    }
    private addedResizeListener: boolean = false;
    private settingVideoMode: boolean = false;

    private _SDL_SetVideoMode(width: int, height: int, depth: int, flags: int): void {
        ['touchstart', 'touchend', 'touchmove', 'mousedown', 'mouseup', 'mousemove', 'DOMMouseScroll', 'mousewheel', 'wheel', 'mouseout'].forEach((event) => {
            this.Canvas.addEventListener(event, this.receiveEvent, true);
        });

        var canvas = this.Canvas;

        // (0,0) means 'use fullscreen' in native; in Emscripten, use the current canvas size.
        if (width == 0 && height == 0) {
            width = canvas.width;
            height = canvas.height;
        }

        if (!this.addedResizeListener) {
            this.addedResizeListener = true;
            this.Browser.resizeListeners.push((w, h) => {
                if (!this.settingVideoMode) {
                    this.receiveEvent({
                        type: 'resize',
                        w: w,
                        h: h
                    });
                }
            });
        }

        this.settingVideoMode = true; // SetVideoMode itself should not trigger resize events
        this.Browser.setCanvasSize(width, height);
        this.settingVideoMode = false;

        // Free the old surface first if there is one
        if (this.screen) {
            this.freeSurface(this.screen);
            this.assert(!this.screen);
        }

        if (this.GL) flags = flags | 0x04000000; // SDL_OPENGL - if we are using GL, then later calls to SetVideoMode may not mention GL, but we do need it. Once in GL mode, we never leave it.

        this.screen = this.makeSurface(width, height, flags, true, 'screen');

        return this.screen;
    }


    private _SDL_UnlockSurface(surf: SDL_Surface): void {
        this.assert(!this.GL); // in GL mode we do not keep around 2D canvases and contexts

        const surfData = this.surfaces[surf.Id];

        if (!surfData.locked || --surfData.locked > 0) {
            return;
        }

        // Copy pixel data to image
        if (surfData.isFlagSet(0x00200000 /* SDL_HWPALETTE */)) {
            this.copyIndexedColorData(surfData);
        } else if (!surfData.colors) {
            var data = surfData.image.data;
            var buffer = surfData.buffer;
            //this.assert(buffer % 4 == 0, 'Invalid buffer offset: ' + buffer);
            var src = 0; /* buffer */ /* >> 2 */;
            var dst = 0;
            var isScreen = surf === this.screen;
            let num;
            if (typeof CanvasPixelArray !== 'undefined' && data instanceof CanvasPixelArray) {
                // IE10/IE11: ImageData objects are backed by the deprecated CanvasPixelArray,
                // not UInt8ClampedArray. These don't have buffers, so we need to revert
                // to copying a byte at a time. We do the undefined check because modern
                // browsers do not define CanvasPixelArray anymore.
                num = data.length;
                while (dst < num) {
                    var val = /* this.HEAP32[ */buffer[src];//]; // This is optimized. Instead, we could do HEAP32[(((buffer)+(dst))>>2)];
                    data[dst] = val & 0xff;
                    data[dst + 1] = (val >> 8) & 0xff;
                    data[dst + 2] = (val >> 16) & 0xff;
                    data[dst + 3] = isScreen ? 0xff : ((val >> 24) & 0xff);
                    src++;
                    dst += 4;
                }
            } else {
                var data32 = new Uint32Array(data.buffer);
                if (isScreen && this.opaqueFrontBuffer) {
                    num = data32.length;
                    // logically we need to do
                    //      while (dst < num) {
                    //          data32[dst++] = HEAP32[src++] | 0xff000000
                    //      }
                    // the following code is faster though, because
                    // .set() is almost free - easily 10x faster due to
                    // native memcpy efficiencies, and the remaining loop
                    // just stores, not load + store, so it is faster
                    const heap32 = new Int32Array(buffer.buffer);
                    data32.set(heap32.subarray(0, num));
                    var data8 = new Uint8Array(data.buffer);
                    var i = 3;
                    var j = i + 4 * num;
                    if (num % 8 == 0) {
                        // unrolling gives big speedups
                        while (i < j) {
                            data8[i] = 0xff;
                            i = i + 4 | 0;
                            data8[i] = 0xff;
                            i = i + 4 | 0;
                            data8[i] = 0xff;
                            i = i + 4 | 0;
                            data8[i] = 0xff;
                            i = i + 4 | 0;
                            data8[i] = 0xff;
                            i = i + 4 | 0;
                            data8[i] = 0xff;
                            i = i + 4 | 0;
                            data8[i] = 0xff;
                            i = i + 4 | 0;
                            data8[i] = 0xff;
                            i = i + 4 | 0;
                        }
                    } else {
                        while (i < j) {
                            data8[i] = 0xff;
                            i = i + 4 | 0;
                        }
                    }
                } else {
                    const heap32 = new Int32Array(buffer.buffer);
                    data32.set(heap32.subarray(0, data32.length));
                }
            }
        } else {
            var width = this.Canvas.width;
            var height = this.Canvas.height;
            var s = 0; //surfData.buffer
            var data = surfData.image.data;
            var colors = surfData.colors; // TODO: optimize using colors32
            for (var y = 0; y < height; y++) {
                var base = y * width * 4;
                for (var x = 0; x < width; x++) {
                    // See comment above about signs
                    const val = surfData.buffer[s] * 4;
                    var start = base + x * 4;
                    data[start] = colors[val];
                    data[start + 1] = colors[val + 1];
                    data[start + 2] = colors[val + 2];
                }
                s += width * 3;
            }
        }
        // Copy to canvas
        surfData.ctx.putImageData(surfData.image, 0, 0);
        // Note that we save the image, so future writes are fast. But, memory is not yet released
    }
    private _SDL_UpperBlit(src, srcrect, dst, dstrect) {
        return this.BlitSurface(src, srcrect, dst, dstrect, false);
    }

    private ttfContext: any;
    private _TTF_Init(): int {
        // OffscreenCanvas 2D is faster than Canvas for text operations, so we use
        // it if it's available.
        try {
            var offscreenCanvas = new OffscreenCanvas(0, 0);
            this.ttfContext = offscreenCanvas.getContext('2d');
        } catch (ex) {
            var canvas = document.createElement('canvas');
            this.ttfContext = canvas.getContext('2d');
        }

        return 0;
    }

    private _TTF_OpenFont(filename: string, size: int): int {
        filename = PATH.normalize(/* this.UTF8ToString( */filename/* ) */);
        var id = this.fonts.length;
        this.fonts.push({
            name: filename, // but we don't actually do anything with it..
            size: size
        });
        return id;
    }

    private _TTF_RenderText_Solid(font: int, text: string, color: CGColor) {
        // XXX the font and color are ignored
        //text = this.UTF8ToString(text) || ' '; // if given an empty string, still return a valid surface
        var fontData = this.fonts[font];
        var w = this.estimateTextWidth(fontData, text);
        var h = fontData.size;
        const colorStr: string = this.loadColorToCSSRGB(color); // XXX alpha breaks fonts?
        var fontString = this.makeFontString(h, fontData.name);
        var surf = this.makeSurface(w, h, 0, false, 'text:' + text); // bogus numbers..
        var surfData = this.surfaces[surf.Id];
        surfData.ctx.save();
        surfData.ctx.fillStyle = colorStr;
        surfData.ctx.font = fontString;
        // use bottom alignment, because it works
        // same in all browsers, more info here:
        // https://bugzilla.mozilla.org/show_bug.cgi?id=737852
        surfData.ctx.textBaseline = 'bottom';
        surfData.ctx.fillText(text, 0, h | 0);
        surfData.ctx.restore();
        return surf;
    }

    private _abort(): void {
        this.abort('');
    }
    private _SDL_GetTicks(): int {
        return (Date.now() - this.startTime) | 0;
    }

    private screenIsReadOnly: boolean = false;
    private _SDL_LockSurface(surf: SDL_Surface): int {
        var surfData = this.surfaces[surf.Id];

        surfData.locked++;
        if (surfData.locked > 1) return 0;

        if (!surfData.buffer) {
            surfData.buffer = New.ByteArray(surfData.width * surfData.height * 4); // this._malloc(surfData.width * surfData.height * 4);
            //this.HEAP32[(((surf) + (20)) >> 2)] = surfData.buffer;
            surf.pixels = surfData.buffer;
        }

        // Mark in C/C++-accessible SDL structure
        // SDL_Surface has the following fields: Uint32 flags, SDL_PixelFormat *format; int w, h; Uint16 pitch; void *pixels; ...
        // So we have fields all of the same size, and 5 of them before us.
        // TODO: Use macros like in library.js
        //this.HEAP32[(((surf) + (20)) >> 2)] = surfData.buffer;
        surf.pixels = surfData.buffer;
        if (surf == this.screen && this.screenIsReadOnly && surfData.image) return 0;

        if (this.discardOnLock) {
            if (!surfData.image) {
                surfData.image = surfData.ctx.createImageData(surfData.width, surfData.height);
            }
            if (!this.opaqueFrontBuffer) {
                return undefined as any;
            }
        } else {
            surfData.image = surfData.ctx.getImageData(0, 0, surfData.width, surfData.height);
        }

        // Emulate desktop behavior and kill alpha values on the locked surface. (very costly!) Set SDL.defaults.opaqueFrontBuffer = false
        // if you don't want this.
        if (surf == this.screen && this.opaqueFrontBuffer) {
            var data = surfData.image.data;
            var num = data.length;
            for (var i = 0; i < num / 4; i++) {
                data[i * 4 + 3] = 255; // opacity, as canvases blend alpha
            }
        }

        if (this.copyOnLock && !this.discardOnLock) {
            // Copy pixel data to somewhere accessible to 'C/C++'
            if (surfData.isFlagSet(0x00200000 /* SDL_HWPALETTE */)) {
                // If this is neaded then
                // we should compact the data from 32bpp to 8bpp index.
                // I think best way to implement this is use
                // additional colorMap hash (color->index).
                // Something like this:
                //
                // var size = surfData.width * surfData.height;
                // var data = '';
                // for (var i = 0; i<size; i++) {
                //   var color = SDL.translateRGBAToColor(
                //     surfData.image.data[i*4   ],
                //     surfData.image.data[i*4 +1],
                //     surfData.image.data[i*4 +2],
                //     255);
                //   var index = surfData.colorMap[color];
                //   HEAP8[(((surfData.buffer)+(i))>>0)] = index;
                // }
                throw 'CopyOnLock is not supported for SDL_LockSurface with SDL_HWPALETTE flag set' + new Error().stack;
            } else {
                TArray.Copy(surfData.image.data, 0, surfData.buffer, 0, surfData.image.data.length);
                //this.HEAPU8.set(surfData.image.data, surfData.buffer);
            }
        }

        return 0;
    }

    private unicode: any;
    /** @suppress{missingProperties} */
    private SDL_unicode() { return this.unicode }

    /** @suppress{missingProperties} */
    private SDL_ttfContext() { return this.ttfContext }

    private audio: any;
    /** @suppress{missingProperties} */
    private SDL_audio() { return this.audio }

    @Virtual
    protected requestFullscreen(lockPointer, resizeCanvas) {
        this.Browser.requestFullscreen(lockPointer, resizeCanvas)
    }

    @Virtual
    protected requestFullScreen() {
        this.Browser.requestFullScreen()
    }

    @Virtual
    protected requestAnimationFrame(func) {
        this.Browser.requestAnimationFrame(func)
    }

    @Virtual
    protected setCanvasSize(width, height, noUpdates) {
        this.Browser.setCanvasSize(width, height, noUpdates)
    }

    @Virtual
    protected pauseMainLoop() {
        this.Browser.mainLoop.Pause()
    }

    @Virtual
    protected resumeMainLoop() {
        this.Browser.mainLoop.Resume()
    }
    @Virtual
    protected getUserMedia() {
        (this.Browser as any).getUserMedia();
    }

    @Virtual
    protected createContext(canvas, useWebGL, setInModule, webGLContextAttributes): CanvasRenderingContext2D {
        return this.Browser.CreateContext(canvas, useWebGL, setInModule, webGLContextAttributes)
    }
    protected _emscripten_get_canvas_element_size(): CGSize {
        /* var canvas = findCanvasEventTarget(target);
        if (!canvas) return -4; */
        return new CGSize(this.Canvas.width, this.Canvas.height);
        /* HEAP32[((width)>>2)]=canvas.width;
        HEAP32[((height)>>2)]=canvas.height; */
    }
}
