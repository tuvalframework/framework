import { CGContext2D,CGPatternTiling, CGRectangle, CGPattern , CGAffineTransform} from '@tuval/cg';
import { CGImage } from '@tuval/cg';
import { Brush } from './Brush';
import { Matrix, MatrixOrder } from './drawing2D/Matrix';
import { WrapMode } from './drawing2D/WrapMode';
import { ArgumentNullException } from '@tuval/core';
import { float } from '@tuval/core';
import { Graphics } from './Graphics';
import { ClassInfo } from '@tuval/core';
import { GraphicTypes } from '../GDITypes';

@ClassInfo({
    fullName:GraphicTypes.TextureBrush,
    instanceof: [
        GraphicTypes.TextureBrush
    ]
})
export class TextureBrush extends Brush {
    private textureImage: CGImage;
    private textureTransform: Matrix = new Matrix();
    private wrapMode: WrapMode = WrapMode.Tile;
    private _changed: boolean = false;

    public get Image(): CGImage | HTMLImageElement {
        return this.textureImage;
    }

    public get Transform(): Matrix {
        return this.textureTransform;
    }
    public set Transform(value: Matrix) {
        if (value == null) {
            throw new ArgumentNullException("value");
        }
        this.textureTransform = value.clone();
        this._changed = true;

    }

    public get WrapMode(): WrapMode {
        return this.wrapMode;
    }
    public set WrapMode(value: WrapMode) {
        if (this.wrapMode !== value) {
            this.wrapMode = value;
            this._changed = true;
        }
    }
    constructor(image: CGImage);
    constructor(image: CGImage, wrapMode: number = WrapMode.Tile) {
        super();
        if (image == null) {
            throw new ArgumentNullException("image");
        }

        this.textureImage = image;
        this.wrapMode = wrapMode;
    }

    public multiplyTransform(matrix: Matrix, order: MatrixOrder = MatrixOrder.Prepend): void {
        if (matrix == null) {
            throw new ArgumentNullException("matrix");
        }
        this.textureTransform.multiply(matrix, order);
        this._changed = true;
    }

    public resetTransform(): void {
        this.textureTransform.reset();
        this._changed = true;
    }

    public rotateTransform(angle: float): void;
    public rotateTransform(angle: float, order: MatrixOrder = MatrixOrder.Prepend): void {
        this.textureTransform.rotate(angle, order);
        this._changed = true;
    }


    public scaleTransform(sx: float, sy: float, order: MatrixOrder = MatrixOrder.Prepend): void {
        this.textureTransform.scale(sx, sy, order);
        this._changed = true;
    }

    public translateTransform(dx: float, dy: float, order: MatrixOrder = MatrixOrder.Prepend): void {
        this.textureTransform.translate(dx, dy, order);
        this._changed = true;
    }

    private drawTexture(context: CGContext2D): void {
        var destRect = new CGRectangle(0, 0, this.textureImage.Width, this.textureImage.Height);
        context.concatCTM(this.textureImage.imageTransform);
        context.drawImage(this.textureImage.canvas, 0, 0);
        context.concatCTM(this.textureImage.imageTransform.invert());

        if (this.wrapMode === WrapMode.Tile) {
            context.drawImage(this.textureImage.canvas, 0, 0, destRect.Width, destRect.Height, destRect.X, destRect.Y, destRect.Width, destRect.Height);
        }

        if (this.wrapMode === WrapMode.TileFlipX || this.wrapMode === WrapMode.TileFlipXY) {
            context.concatCTM(CGAffineTransform.MakeScale(-1, 1));
            context.concatCTM(this.textureImage.imageTransform);
            context.drawImage(this.textureImage.canvas, 0, 0, destRect.Width, destRect.Height, destRect.X, destRect.Y, destRect.Width, destRect.Height);
            context.concatCTM(this.textureImage.imageTransform.invert());
        }

        if (this.wrapMode === WrapMode.TileFlipY || this.wrapMode === WrapMode.TileFlipXY) {
            var transformY = new CGAffineTransform(1, 0, 0, -1,
                destRect.Width,
                destRect.Height);
            context.concatCTM(transformY);
            context.concatCTM(this.textureImage.imageTransform);
            context.drawImage(this.textureImage.canvas, 0, 0, destRect.Width, destRect.Height, destRect.X, destRect.Y, destRect.Width, destRect.Height);
            context.concatCTM(this.textureImage.imageTransform.invert());
        }
        if (this.wrapMode === WrapMode.TileFlipXY) {
            // draw the last one of the quadrant which is flipped by both the y and x axis
            var transform = new CGAffineTransform(-1, 0, 0, -1, destRect.Width * 2, destRect.Height);
            context.concatCTM(transform);
            context.concatCTM(this.textureImage.imageTransform);
            context.drawImage(this.textureImage.canvas, 0, 0, destRect.Width, destRect.Height, destRect.X, destRect.Y, destRect.Width, destRect.Height);
            context.concatCTM(this.textureImage.imageTransform.invert());
        }

    }
    public /*internal*/ /*override*/  setup(graphics: Graphics, fill: boolean): void {
        const HALF_PIXEL_X: float = 0.5;
        const HALF_PIXEL_Y: float = 0.5;
        // if this is the same as the last that was set then return and no changes have been made
        // then return.
        if (graphics.LastBrush == this && !this._changed) {
            return;
        }

        // obtain our width and height so we can set the pattern rectangle
        let textureWidth: float = this.textureImage.Width;
        let textureHeight: float = this.textureImage.Height;

        if (this.wrapMode === WrapMode.TileFlipX || this.wrapMode === WrapMode.TileFlipY)
            textureWidth *= 2;

        if (this.wrapMode === WrapMode.TileFlipXY) {
            textureWidth *= 2;
            textureHeight *= 2;
        }

        //choose the pattern to be filled based on the currentPattern selected
        /* var patternSpace = CGColorSpace.CreatePattern(null);
        graphics.context.SetFillColorSpace(patternSpace);
        patternSpace.Dispose(); */

        // Pattern default work variables
        var patternRect = new CGRectangle(HALF_PIXEL_X, HALF_PIXEL_Y,
            textureWidth + HALF_PIXEL_X,
            textureHeight + HALF_PIXEL_Y);

        //var patternTransform = graphics.context.getCTM();
        //patternTransform = CGAffineTransform.Multiply(this.textureTransform.transform, patternTransform);
        const patternTransform = CGAffineTransform.MakeIdentity();
        patternTransform.multiply(this.textureTransform.transform);

        // DrawPattern callback which will be set depending on hatch style
        let drawPattern: (context: CGContext2D) => void;

        drawPattern = this.drawTexture;

        //set the pattern as the Current Context’s fill pattern
        var pattern = new CGPattern(patternRect,
            patternTransform,
            textureWidth,
            textureHeight,
            //textureHeight,
            CGPatternTiling.NoDistortion,
            true, drawPattern.bind(this) as any,
            this.wrapMode);
        //we dont need to set any color, as the pattern cell itself has chosen its own color
        const aone: float[] = [1];
        graphics.renderer.setFillPattern(pattern, aone);
        graphics.renderer.setStrokePattern(pattern, aone);

        this._changed = false;

        graphics.LastBrush = this;

        //graphics.lastBrushColor = foreColor;
    }
}
