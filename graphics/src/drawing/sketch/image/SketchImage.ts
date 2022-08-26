import { int } from '@tuval/core';
import { CGColor } from '@tuval/cg';
import { SketchCanvasRenderer2D } from "../SketchCanvasRenderer2D";
import { Filters } from "./filters";


export class SketchImage {
    width: number;
    height: number;
    canvas: HTMLCanvasElement;
    drawingContext: CanvasRenderingContext2D = undefined as any;
    _pixelDensity: number;
    _modified: boolean;
    _pixelsDirty: boolean;
    pixels: any;
    imageData: any;

    public constructor(width: number, height: number, inst?: any) {

        this.width = width;

        this.height = height;
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.drawingContext = this.canvas.getContext('2d') as any;
        this._pixelDensity = 1;
        //used for webgl texturing only
        this._modified = false;
        this._pixelsDirty = true;

        this.pixels = [];

    }
    public _setProperty(prop, value) {
        this[prop] = value;
        this.setModified(true);
    }

    public loadPixels() {
        if (!this._pixelsDirty) { return; }
        this._pixelsDirty = false;

        var pd = this._pixelDensity;
        var w = this.width * pd;
        var h = this.height * pd;
        var imageData = this.drawingContext.getImageData(0, 0, w, h);
        // @todo this should actually set pixels per object, so diff buffers can
        // have diff pixel arrays.
        this.imageData = imageData;
        this.pixels = imageData.data;
        this.setModified(true);
    }

    public updatePixels(x, y, w, h) {
        const pixelsState = this;
        const pd = pixelsState._pixelDensity;
        if (
            x === undefined &&
            y === undefined &&
            w === undefined &&
            h === undefined
        ) {
            x = 0;
            y = 0;
            w = this.width;
            h = this.height;
        }
        x *= pd;
        y *= pd;
        w *= pd;
        h *= pd;

        this.drawingContext.putImageData(pixelsState.imageData, x, y, 0, 0, w, h);

        if (x !== 0 || y !== 0 || w !== this.width || h !== this.height) {
            pixelsState._pixelsDirty = true;
        }
        this.setModified(true);
    }
    public get(x, y, w, h) {
        const pixelsState = this;
        const pd = pixelsState._pixelDensity;
        const canvas = this.canvas;

        if (typeof x === 'undefined' && typeof y === 'undefined') {
            // get()
            x = y = 0;
            w = pixelsState.width;
            h = pixelsState.height;
        } else {
            x *= pd;
            y *= pd;

            if (typeof w === 'undefined' && typeof h === 'undefined') {
                // get(x,y)
                if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) {
                    return [0, 0, 0, 0];
                }

                return this._getPixel(x, y);
            }
            // get(x,y,w,h)
        }

        const region = new SketchImage(w, h);
        (region.canvas as any).getContext('2d').drawImage(canvas, x, y, w * pd, h * pd, 0, 0, w, h);

        return region;
    }
    private _getPixel(x, y) {
        let imageData, index;
        imageData = this.drawingContext.getImageData(x, y, 1, 1).data;
        index = 0;
        return [
            imageData[index + 0],
            imageData[index + 1],
            imageData[index + 2],
            imageData[index + 3]
        ];
    }

    public set(x:int, y: int, imgOrCol: CGColor) {
        // round down to get integer numbers
        x = Math.floor(x);
        y = Math.floor(y);
        const pixelsState = this;
        if (imgOrCol instanceof SketchImage) {
            this.drawingContext.save();
            this.drawingContext.setTransform(1, 0, 0, 1, 0, 0);
            this.drawingContext.scale(
                pixelsState._pixelDensity,
                pixelsState._pixelDensity
            );
            this.drawingContext.drawImage(imgOrCol.canvas, x, y);
            this.drawingContext.restore();
        } else {
            let r = 0,
                g = 0,
                b = 0,
                a = 0;
            let idx =
                4 *
                (y *
                    pixelsState._pixelDensity *
                    (this.width * pixelsState._pixelDensity) +
                    x * pixelsState._pixelDensity);
            if (!pixelsState.imageData) {
                pixelsState.loadPixels.call(pixelsState);
            }
            if (typeof imgOrCol === 'number') {
                if (idx < pixelsState.pixels.length) {
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
                if (idx < pixelsState.pixels.length) {
                    r = imgOrCol[0];
                    g = imgOrCol[1];
                    b = imgOrCol[2];
                    a = imgOrCol[3];
                    //this.updatePixels.call(this);
                }
            } else if (imgOrCol instanceof CGColor) {
                if (idx < pixelsState.pixels.length) {
                    r = imgOrCol.Levels[0];
                    g = imgOrCol.Levels[1];
                    b = imgOrCol.Levels[2];
                    a = imgOrCol.Levels[3];
                    //this.updatePixels.call(this);
                }
            }
            // loop over pixelDensity * pixelDensity
            for (let i = 0; i < pixelsState._pixelDensity; i++) {
                for (let j = 0; j < pixelsState._pixelDensity; j++) {
                    // loop over
                    idx =
                        4 *
                        ((y * pixelsState._pixelDensity + j) *
                            this.width *
                            pixelsState._pixelDensity +
                            (x * pixelsState._pixelDensity + i));
                    pixelsState.pixels[idx] = r;
                    pixelsState.pixels[idx + 1] = g;
                    pixelsState.pixels[idx + 2] = b;
                    pixelsState.pixels[idx + 3] = a;
                }
            }
        }
        this.setModified(true);
    }

    public resize(width, height) {
        // Copy contents to a temporary canvas, resize the original
        // and then copy back.
        //
        // There is a faster approach that involves just one copy and swapping the
        // this.canvas reference. We could switch to that approach if (as i think
        // is the case) there an expectation that the user would not hold a
        // reference to the backing canvas of a p5.Image. But since we do not
        // enforce that at the moment, I am leaving in the slower, but safer
        // implementation.

        // auto-resize
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

        const tempCanvas: any = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        // prettier-ignore
        tempCanvas.getContext('2d').drawImage(
            this.canvas,
            0, 0, this.canvas.width, this.canvas.height,
            0, 0, tempCanvas.width, tempCanvas.height
        );

        // Resize the original canvas, which will clear its contents
        this.canvas.width = this.width = width;
        this.canvas.height = this.height = height;

        //Copy the image back

        // prettier-ignore
        this.drawingContext.drawImage(
            tempCanvas,
            0, 0, width, height,
            0, 0, width, height
        );

        if (this.pixels.length > 0) {
            this.loadPixels();
        }

        this.setModified(true);
        this._pixelsDirty = true;
    }

    public copy() {
        var srcImage, sx, sy, sw, sh, dx, dy, dw, dh;
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
        SketchImage._copyHelper(this, srcImage, sx, sy, sw, sh, dx, dy, dw, dh);
        this._pixelsDirty = true;
    }
     private static _copyHelper(
        dstImage,
        srcImage,
        sx,
        sy,
        sw,
        sh,
        dx,
        dy,
        dw,
        dh
    ) {
        srcImage.loadPixels();
        const s = srcImage.canvas.width / srcImage.width;
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

    public mask(p5Image) {
        if (p5Image === undefined) {
            p5Image = this;
        }
        var currBlend = this.drawingContext.globalCompositeOperation;

        var scaleFactor = 1;
        if (p5Image instanceof SketchCanvasRenderer2D) {
            scaleFactor = (p5Image as any)._pixelDensity;
        }

        var copyArgs = [
            p5Image,
            0,
            0,
            scaleFactor * p5Image.width,
            scaleFactor * p5Image.height,
            0,
            0,
            this.width,
            this.height
        ];

        this.drawingContext.globalCompositeOperation = 'destination-in';
        SketchImage.prototype.copy.apply(this, copyArgs as any);
        this.drawingContext.globalCompositeOperation = currBlend;
        this.setModified(true);
    }

    public filter(operation, value) {
        Filters.apply(this.canvas, Filters[operation.toLowerCase()], value);
        this.setModified(true);
    }
    public blend() {
        //Sketch.prototype.blend.apply(this, arguments);
        this.setModified(true);
    }
    public setModified = function (val) {
        this._modified = val; //enforce boolean?
    }
    public isModified() {
        return this._modified;
    }
    public save(filename, extension) {
        //Sketch.prototype.saveCanvas(this.canvas, filename, extension);
    }
}