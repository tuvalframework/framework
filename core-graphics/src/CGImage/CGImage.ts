import { CGColor } from './../CGColor/CGColor';
import { error, EventSimple, float, TObject, ByteArray, is, TBuffer, Browser, File, FileNotFoundException, using, FileStream, New } from '@tuval/core';
import { ClassInfo } from "@tuval/core";
import { CGAffineTransform } from "../CGAffineTransform";
import { CGSize } from "../CGSize";
import { Filters } from './Filters';
import { CoreGraphicTypes } from '../types';



export type ImageLoadedEventHandler = (img: HTMLImageElement) => void;

@ClassInfo({
    fullName: CoreGraphicTypes.CGImage,
    instanceof: [
        CoreGraphicTypes.CGImage
    ]
})
export class CGImage {
    private mySize: CGSize = undefined as any;
    public onLoad: EventSimple<ImageLoadedEventHandler> = undefined as any;
    public IsImageLoaded: boolean = false;
    public imageTransform: CGAffineTransform;

    private _pixelsDirty: boolean;
    private _modified: boolean;
    private _pixelDensity: number;
    public canvas: HTMLCanvasElement = undefined as any;
    private drawingContext: CanvasRenderingContext2D = undefined as any;
    private imageData: ImageData = undefined as any;
    private myPixels: Uint8ClampedArray = undefined as any;
    public get Pixels(): Uint8ClampedArray {
        return this.myPixels;
    }
    public set Pixels(value: Uint8ClampedArray) {
        this.myPixels = value;
    }

    private myHeight: number = 0;
    public get Height(): number {
        return this.myHeight
    }

    public set Height(value: number) {
        this.myHeight = value;
    }

    private myWidth: number = 0;
    public get Width(): number {
        return this.myWidth;
    }
    public set Width(value: number) {
        this.myWidth = value;
    }

    public get Size(): CGSize {
        return this.mySize;
    }

    public set Size(value: CGSize) {
        this.mySize = value;
    }

    public constructor(filename: string);
    public constructor(buffer: ByteArray);
    public constructor(ctx: CanvasRenderingContext2D);
    public constructor(width: number, height: number);
    public constructor(...args: any[]) {
        if (args.length === 1 && is.string(args[0])) {
            const filename: string = args[0];
            if (!File.Exists(filename)) {
                throw new FileNotFoundException(filename + ' not found.');
            }

            let buffer: ByteArray;
            using(File.OpenRead(filename), (fs: FileStream) => {
                buffer = New.ByteArray(fs.Length);
                fs.Read(buffer, 0, fs.Length);
                fs.Close();
            });

            const readBuffer: TBuffer = new TBuffer(buffer!);
            this.Width = readBuffer.readUint32();
            this.Height = readBuffer.readUint32();
            const context: CanvasRenderingContext2D = Browser.CreateRenderingContext(this.Width, this.Height);
            const imageData = new ImageData(new Uint8ClampedArray(readBuffer.readBytes(readBuffer.readUint32())), this.Width, this.Height);
            context.putImageData(imageData, 0, 0);
            this.canvas = context.canvas;
            this.drawingContext = context;

        }
        if (args.length === 1 && is.ByteArray(args[0])) {
            const buffer: ByteArray = args[0];
            const readBuffer: TBuffer = new TBuffer(buffer);
            this.Width = readBuffer.readUint32();
            this.Height = readBuffer.readUint32();
            const context: CanvasRenderingContext2D = Browser.CreateRenderingContext(this.Width, this.Height);
            const imageData = new ImageData(new Uint8ClampedArray(readBuffer.readBytes(readBuffer.readUint32())), this.Width, this.Height);
            context.putImageData(imageData, 0, 0);
            this.canvas = context.canvas;
            this.drawingContext = context;
        } else if (args.length === 2) {
            const width: float = args[0];
            const height: float = args[1];
            this.Width = width;
            this.Height = height;
            this.canvas = document.createElement('canvas');
            this.canvas.width = this.Width;
            this.canvas.height = this.Height;
            this.drawingContext = this.canvas.getContext('2d') as any;
        } else if (args.length === 1 && args[0] instanceof CanvasRenderingContext2D) {
            const ctx: CanvasRenderingContext2D = args[0];
            this.Width = ctx.canvas.width;
            this.Height = ctx.canvas.height;
            this.canvas = ctx.canvas;
            this.drawingContext = ctx;
        }

        this._pixelDensity = 1;
        //used for webgl texturing only
        this._modified = false;
        this._pixelsDirty = true;

        this.Pixels = <any>[];
        this.imageTransform = CGAffineTransform.MakeIdentity();
    }

    public loadPixels() {

        if (!this._pixelsDirty) return;
        this._pixelsDirty = false;

        var pd = this._pixelDensity;
        var w = this.Width * pd;
        var h = this.Height * pd;
        this.imageData = this.drawingContext.getImageData(0, 0, w, h);
        this.Pixels = this.imageData.data;
        this.setModified(true);
    }
    public updatePixels(x?: number, y?: number, w?: number, h?: number) {
        const pd = this._pixelDensity;
        if (x === undefined && y === undefined && w === undefined && h === undefined) {
            x = 0;
            y = 0;
            w = this.Width;
            h = this.Height;
        }

        (w as any) *= pd;
        (h as any) *= pd;

        this.drawingContext.putImageData(this.imageData, x as any, y as any, 0, 0, w as any, h as any);

        if (x !== 0 || y !== 0 || w !== this.Width || h !== this.Height) {
            this._pixelsDirty = true;
        }
    }

    public get(x: number, y: number, w: number, h: number) {
        if (typeof w === 'undefined' && typeof h === 'undefined') {
            if (typeof x === 'undefined' && typeof y === 'undefined') {
                x = y = 0;
                w = this.Width;
                h = this.Height;
            } else {
                w = h = 1;
            }
        }

        // if the section does not overlap the canvas
        if (x + w < 0 || y + h < 0 || x >= this.Width || y >= this.Height) {
            // TODO: is this valid for w,h > 1 ?
            return [0, 0, 0, 255];
        }

        const pd: number = this._pixelDensity;

        // round down to get integer numbers
        x = Math.floor(x);
        y = Math.floor(y);
        w = Math.floor(w);
        h = Math.floor(h);

        var sx = x * pd;
        var sy = y * pd;
        if (w === 1 && h === 1 && !(this.drawingContext instanceof WebGLRenderingContext)) {
            var imageData, index;
            if (this._pixelsDirty) {
                imageData = this.drawingContext.getImageData(sx, sy, 1, 1).data;
                index = 0;
            } else {
                imageData = this.Pixels;
                index = (sx + sy * this.Width * pd) * 4;
            }
            return [
                imageData[index + 0],
                imageData[index + 1],
                imageData[index + 2],
                imageData[index + 3]
            ];
        } else {
            //auto constrain the width and height to
            //dimensions of the source image
            var dw = Math.min(w, this.Width);
            var dh = Math.min(h, this.Height);
            var sw = dw * pd;
            var sh = dh * pd;

            const region: CGImage = new CGImage(dw, dh);
            (region.canvas as any).getContext('2d').drawImage(this.canvas, sx, sy, sw, sh, 0, 0, dw, dh);

            return region;
        }
    }
    public set(x: number, y: number, imgOrCol: CGColor | CGImage | number | number[]) {
        // round down to get integer numbers
        x = Math.floor(x);
        y = Math.floor(y);
        if (imgOrCol instanceof CGImage) {
            this.drawingContext.save();
            this.drawingContext.setTransform(1, 0, 0, 1, 0, 0);
            this.drawingContext.scale(this._pixelDensity, this._pixelDensity);
            this.drawingContext.drawImage(imgOrCol.canvas, x, y);
            this.drawingContext.restore();
            this._pixelsDirty = true;
        } else {
            var r = 0,
                g = 0,
                b = 0,
                a = 0;
            var idx =
                4 *
                (y * this._pixelDensity * (this.Width * this._pixelDensity) +
                    x * this._pixelDensity);
            if (!this.imageData || this._pixelsDirty) {
                this.loadPixels();
            }
            if (typeof imgOrCol === 'number') {
                if (idx < this.Pixels.length) {
                    r = imgOrCol;
                    g = imgOrCol;
                    b = imgOrCol;
                    a = 255;
                    //this.updatePixels.call(this);
                }
            } else if (imgOrCol instanceof Array) {
                if (imgOrCol.length < 4) {
                    throw new Error('pixel array must be of the form [R, G, B, A]');
                }
                if (idx < this.Pixels.length) {
                    r = imgOrCol[0];
                    g = imgOrCol[1];
                    b = imgOrCol[2];
                    a = imgOrCol[3];
                    //this.updatePixels.call(this);
                }
            } else if (imgOrCol instanceof CGColor) {
                if (idx < this.Pixels.length) {
                    r = imgOrCol.R;
                    g = imgOrCol.G;
                    b = imgOrCol.B
                    a = imgOrCol.A;
                    //this.updatePixels.call(this);
                }
            }
            // loop over pixelDensity * pixelDensity
            for (var i = 0; i < this._pixelDensity; i++) {
                for (var j = 0; j < this._pixelDensity; j++) {
                    // loop over
                    idx =
                        4 *
                        ((y * this._pixelDensity + j) * this.Width * this._pixelDensity +
                            (x * this._pixelDensity + i));
                    this.Pixels[idx] = r;
                    this.Pixels[idx + 1] = g;
                    this.Pixels[idx + 2] = b;
                    this.Pixels[idx + 3] = a;
                }
            }
        }
    }

    public getPixelColor(x: number, y: number): CGColor {
        const pixelData = this.get(x, y, 1, 1);
        return new CGColor(pixelData[0], pixelData[1], pixelData[2], pixelData[3]);

    }
    public resize(width: number, height: number) {

        if (width === 0 && height === 0) {
            width = this.canvas.width;
            height = this.canvas.height;
        } else if (width === 0) {
            width = this.canvas.width * height / this.canvas.height;
        } else if (height === 0) {
            height = this.canvas.height * width / this.canvas.width;
        }

        width = Math.floor(width);
        height = Math.floor(height);

        var tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        // prettier-ignore
        (tempCanvas as any).getContext('2d').drawImage(
            this.canvas,
            0, 0, this.canvas.width, this.canvas.height,
            0, 0, tempCanvas.width, tempCanvas.height
        );

        // Resize the original canvas, which will clear its contents
        this.canvas.width = this.Width = width;
        this.canvas.height = this.Height = height;


        this.drawingContext.drawImage(
            tempCanvas,
            0, 0, width, height,
            0, 0, width, height
        );

        if (this.Pixels.length > 0) {
            this.loadPixels();
        }

        this.setModified(true);
        this._pixelsDirty = true;
    }

    public copy(srcImage: CGImage, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void {
        //let srcImage, sx, sy, sw, sh, dx, dy, dw, dh;
        if (arguments.length === 9) {
            srcImage = arguments[0];
            sx = arguments[1];
            sy = arguments[2];
            sw = arguments[3];
            sh = arguments[4];
            dx = arguments[5];
            dy = arguments[6];
            dw = arguments[7];
            dh = arguments[8];
        } else if (arguments.length === 8) {
            srcImage = this;
            sx = arguments[0];
            sy = arguments[1];
            sw = arguments[2];
            sh = arguments[3];
            dx = arguments[4];
            dy = arguments[5];
            dw = arguments[6];
            dh = arguments[7];
        } else {
            throw new Error('Signature not supported');
        }
        CGImage._copyHelper(this, srcImage, sx, sy, sw, sh, dx, dy, dw, dh);
        this._pixelsDirty = true;
    }
    public static _copyHelper(dstImage, srcImage, sx, sy, sw, sh, dx, dy, dw, dh) {
        srcImage.loadPixels();
        var s = srcImage.canvas.width / srcImage.width;
        dstImage.drawingContext.drawImage(
            srcImage.canvas,
            s * sx,
            s * sy,
            s * sw,
            s * sh,
            dx,
            dy,
            dw,
            dh
        );
    }
    public mask(cgImage: CGImage) {
        if (cgImage === undefined) {
            cgImage = this;
        }
        var currBlend = this.drawingContext.globalCompositeOperation;

        var scaleFactor = 1;

        this.drawingContext.globalCompositeOperation = 'destination-in';
        this.copy(cgImage,
            0,
            0,
            scaleFactor * cgImage.Width,
            scaleFactor * cgImage.Height,
            0,
            0,
            this.Width,
            this.Height);
        this.drawingContext.globalCompositeOperation = currBlend;
        this.setModified(true);
    }
    private setModified(val: boolean) {
        this._modified = val;
    }

    public static async LoadFromUrl(path: string): Promise<CGImage> {
        const img = new Image();
        const pImg = new CGImage(1, 1);

        return new Promise((resolve, reject) => {
            img.addEventListener("load", () => {
                pImg.Width = pImg.canvas.width = img.width;
                pImg.Height = pImg.canvas.height = img.height;

                // Draw the image into the backing canvas of the p5.Image
                pImg.drawingContext.drawImage(img, 0, 0);
                pImg._modified = true;
                resolve(pImg);
            });
            img.addEventListener("error", err => {
                reject(err);
            }
            );
            // Set crossOrigin in case image is served with CORS headers.
            // This will let us draw to the canvas without tainting it.
            // See https://developer.mozilla.org/en-US/docs/HTML/CORS_Enabled_Image
            // When using data-uris the file will be loaded locally
            // so we don't need to worry about crossOrigin with base64 file types.
            if (path.indexOf('data:image/') !== 0) {
                img.crossOrigin = 'Anonymous';
            }

            // start loading the image
            img.src = path;
        });
    }

    public filter(operation: string, value: number) {
        Filters.apply(this.canvas, Filters[operation.toLowerCase()], value);
        this.setModified(true);
    }

    public static FromStream(stream: any): CGImage {
        throw error('FromStream is not implemented.');
    }

    /* public static FromBitmap(bmp: Bitmap): CGImage {
        throw error('FromBitmap is not implemented.');
    } */
    public getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }
    public getContext(): CanvasRenderingContext2D {
        return this.drawingContext;
    }
}