import { CGSize, CoreGraphicTypes, CGColor, CGRectangle } from '@tuval/cg';
import { DisposableBase, IntPtr, Stream, is, System, int, New, ArgumentNullException, Out, Type, ArgumentException, Locale, FileNotFoundException, InvalidOperationException, ArgumentOutOfRangeException, Exception } from '@tuval/core';
import { float } from "@tuval/core";
import { Graphics } from "./Graphics";
import { createCanvasElement } from "./createCanvasElement";
import { SketchGraphics } from "./sketch/SketchGraphics";
import { Image } from "./Image";
import { GraphicTypes } from '../GDITypes';
import { PixelFormat } from './imaging/PixelFormat';
import { GDIPlus } from './GDIPlus';
import { Status } from './gdipEnums';
import { ImageLockMode } from './imaging/ImageLockMode';
import { BitmapData } from './imaging/BitmapData';
import { ImageAttributes } from './imaging/ImageAttributes';
import { GraphicsUnit } from './GraphicsUnit';
/*
export class Bitmap extends DisposableBase {

    private canvasElement: HTMLCanvasElement;
    public context: CanvasRenderingContext2D;
    private myWidth: float = 0;
    private myHeight: float = 0;
    public Graphics: SketchGraphics = undefined as any;

    public get Width(): float {
        return this.myWidth;
    }
    public set Width(value: float) {
        this.myWidth = value;
    }

    public get Height(): float {
        return this.myHeight;
    }
    public set Height(value: float) {
        this.myHeight = value;
    }

    public constructor(width: number, height: number, graphics?: Graphics) {
        super();
        this.canvasElement = createCanvasElement();
        this.canvasElement.width = width;
        this.canvasElement.height = height;
        this.context = this.canvasElement.getContext('2d') as any;
        this.Graphics = new SketchGraphics(this.context);
    }

    public resize(newSize: CGSize) {
        this.canvasElement.width = newSize.Width;
        this.canvasElement.height = newSize.Height;
    }
} */

export class Bitmap extends Image {

    public constructor();
    public constructor(ptr: IntPtr);
    // Usually called when cloning images that need to have
    // not only the handle saved, but also the underlying stream
    // (when using MS GDI+ and IStream we must ensure the stream stays alive for all the life of the Image)
    public constructor(ptr: IntPtr, stream: Stream);
    public constructor(width: int, height: int);
    public constructor(width: int, height: int, g: Graphics);
    public constructor(width: int, height: int, format: PixelFormat);
    public constructor(original: Image);
    public constructor(stream: Stream);
    public constructor(filename: string);
    public constructor(original: Image, newSize: CGSize);
    public constructor(stream: Stream, useIcm: boolean);
    public constructor(filename: string, useIcm: boolean);
    public constructor(type: Type, resource: string);
    public constructor(original: Image, width: int, height: int);
    public constructor(...args: any[]) {
        super();
        if (args.length === 1 && is.typeof<IntPtr>(args[0], System.Types.IntPtr)) {
            const ptr: IntPtr = args[0];
            this.constructor2(ptr);
        } else if (args.length === 2 && is.typeof<IntPtr>(args[0], System.Types.IntPtr) && is.typeof<Stream>(args[0], System.Types.IO.Stream)) {
            const ptr: IntPtr = args[0];
            const stream: Stream = args[1];
            this.constructor3(ptr, stream);
        } else if (args.length === 2 && is.int(args[0]) && is.int(args[1])) {
            const width: int = args[0];
            const height: int = args[1];
            this.constructor4(width, height);
        } else if (args.length === 3 && is.int(args[0]) && is.int(args[1]) && is.typeof<Graphics>(args[0], GraphicTypes.Graphics)) {
            const width: int = args[0];
            const height: int = args[1];
            const g: Graphics = args[2];
            this.constructor5(width, height, g);
        } else if (args.length === 3 && is.int(args[0]) && is.int(args[1]) && is.int(args[2])) {
            const width: int = args[0];
            const height: int = args[1];
            const format: PixelFormat = args[2];
            this.constructor6(width, height, format);
        } else if (args.length === 1 && is.typeof<Image>(args[0], GraphicTypes.Image)) {
            const original: Image = args[0];
            this.constructor7(args[0]);
        } else if (args.length === 1 && is.typeof<Stream>(args[0], System.Types.IO.Stream)) {
            const stream: Stream = args[0];
            this.constructor8(stream);
        } else if (args.length === 1 && is.string(args[0])) {
            const filename: string = args[0];
            this.constructor9(filename);
        } else if (args.length === 2 && is.typeof<Image>(args[0], GraphicTypes.Image) && is.typeof<CGSize>(args[1], CoreGraphicTypes.CGSize)) {
            const original: Image = args[0];
            const newSize: CGSize = args[1];
            this.constructor10(original, newSize);
        } else if (args.length === 2 && is.typeof<Stream>(args[0], System.Types.IO.Stream) && is.boolean(args[1])) {
            const stream: Stream = args[0];
            const useIcm: boolean = args[1];
            this.constructor11(stream, useIcm);
        } else if (args.length === 2 && is.string(args[0]) && is.boolean(args[1])) {
            const filename: string = args[0];
            const useIcm: boolean = args[1];
            this.constructor12(filename, useIcm);
        } else if (args.length === 2 && args[0] instanceof Type && is.string(args[1])) {
            const type: Type = args[0];
            const resource: string = args[1];
            this.constructor13(type, resource);
        } else if (args.length === 3 && is.typeof<Image>(args[0], GraphicTypes.Image) && is.int(args[1]) && is.int(args[2])) {
            const original: Image = args[0];
            const width: int = args[1];
            const height: int = args[2];
            this.constructor14(original, width, height);
        }
    }


    // required for XmlSerializer (#323246)
    public constructor1() {
    }

    public constructor2(ptr: IntPtr) {
        this.nativeObject = ptr;
    }

    // Usually called when cloning images that need to have
    // not only the handle saved, but also the underlying stream
    // (when using MS GDI+ and IStream we must ensure the stream stays alive for all the life of the Image)
    public /* internal */ constructor3(ptr: IntPtr, stream: Stream) {
        // under Win32 stream is owned by SD/GDI+ code
        if (GDIPlus.RunningOnWindows())
            this.stream = stream;
        this.nativeObject = ptr;
    }

    public constructor4(width: int, height: int) {
        this.constructor6(width, height, PixelFormat.Format32bppArgb)
    }

    public constructor5(width: int, height: int, g: Graphics) {
        if (g == null)
            throw new ArgumentNullException("g");

        let bmp: Out<IntPtr> = New.Out();
        let s: Status = GDIPlus.GdipCreateBitmapFromGraphics(width, height, g.nativeObject, bmp);
        GDIPlus.CheckStatus(s);
        this.nativeObject = bmp.value;
    }

    public constructor6(width: int, height: int, format: PixelFormat) {
        const bmp: Out<IntPtr> = New.Out();
        const s: Status = GDIPlus.GdipCreateBitmapFromScan0(width, height, 0, format, IntPtr.Zero, bmp);
        GDIPlus.CheckStatus(s);
        this.nativeObject = bmp.value;

    }

    public constructor7(original: Image) {
        this.constructor14(original, original.Width, original.Height)
    }

    public constructor8(stream: Stream) {
        this.constructor11(stream, false);
    }

    public constructor9(filename: string) {
        this.constructor12(filename, false);
    }

    public constructor10(original: Image, newSize: CGSize) {
        this.constructor14(original, newSize.Width, newSize.Height);
    }

    public constructor11(stream: Stream, useIcm: boolean) {
        // false: stream is owned by user code
        this.nativeObject = Bitmap.InitFromStream(stream);
    }

    public constructor12(filename: string, useIcm: boolean) {
        if (filename == null)
            throw new ArgumentNullException("filename");

        let imagePtr: Out<IntPtr> = New.Out();
        let st: Status;

        if (useIcm)
            st = GDIPlus.GdipCreateBitmapFromFileICM(filename, imagePtr);
        else
            st = GDIPlus.GdipCreateBitmapFromFile(filename, imagePtr);

        GDIPlus.CheckStatus(st);
        this.nativeObject = imagePtr.value;
    }

    public constructor13(type: Type, resource: string) {
        if (resource == null)
            throw new ArgumentException("resource");

        const s: Stream = (type as any).Assembly.GetManifestResourceStream(type, resource);
        if (s == null) {
            const msg: string = Locale.GetText("Resource '{0}' was not found.", resource);
            throw new FileNotFoundException(msg);
        }

        this.nativeObject = Bitmap.InitFromStream(s);
        // under Win32 stream is owned by SD/GDI+ code
        if (GDIPlus.RunningOnWindows())
            this.stream = s;
    }

    public constructor14(original: Image, width: int, height: int) {
        this.constructor6(width, height, PixelFormat.Format32bppArgb)
        const graphics: Graphics = Graphics.FromImage(this);

        graphics.DrawImage(original, 0, 0, width, height);
        graphics.Dispose();
    }

    public constructor15(width: int, height: int, stride: int, format: PixelFormat, scan0: IntPtr) {
        let bmp: Out<IntPtr> = New.Out();

        let status: Status = GDIPlus.GdipCreateBitmapFromScan0(width, height, stride, format, scan0, bmp);
        GDIPlus.CheckStatus(status);
        this.nativeObject = bmp.value;
    }


    // methods
    public GetPixel(x: int, y: int): CGColor {
        const argb: Out<int> = New.Out(0);
        const s: Status = GDIPlus.GdipBitmapGetPixel(this.nativeObject, x, y, argb);
        GDIPlus.CheckStatus(s);
        return CGColor.FromRgba(argb.value);
    }

    public SetPixel(x: int, y: int, color: CGColor): void {
        const s: Status = GDIPlus.GdipBitmapSetPixel(this.nativeObject, x, y, color.toInt());
        if (s === Status.InvalidParameter) {
            // check is done in case of an error only to avoid another
            // unmanaged call for normal (successful) calls
            if ((this.PixelFormat & PixelFormat.Indexed) != 0) {
                const msg: string = Locale.GetText("SetPixel cannot be called on indexed bitmaps.");
                throw new InvalidOperationException(msg);
            }
        }
        GDIPlus.CheckStatus(s);
    }

    /* public Clone(rect: CGRectangle, format: PixelFormat): Bitmap;
    public Clone(...args: any[]): Bitmap {
        if (args.length === 2) {
            const rect: CGRectangle = args[0];
            const format: PixelFormat = args[1];
            const bmp: Out<IntPtr> = New.Out();
            const status: Status = GDIPlus.GdipCloneBitmapAreaI(rect.X, rect.Y, rect.Width, rect.Height, format, this.nativeObject, bmp);
            GDIPlus.CheckStatus(status);
            return new Bitmap(bmp.value);
        }
    } */

    public Clone<Bitmap>(): Bitmap;
    public Clone<Bitmap>(rect: CGRectangle, format: PixelFormat): Bitmap;
    public Clone<Bitmap>(...args: any[]): Bitmap {
        if (args.length === 0) {
            return super.Clone() as any;
        } else if (args.length === 2) {
            const rect: CGRectangle = args[0];
            const format: PixelFormat = args[1];

            const bmp: Out<IntPtr> = New.Out();
            const status: Status = GDIPlus.GdipCloneBitmapArea(rect.X, rect.Y, rect.Width, rect.Height, format, this.nativeObject, bmp);
            GDIPlus.CheckStatus(status);
            return new Bitmap(bmp.value) as any;
        }
        throw new ArgumentOutOfRangeException('');
    }

    public static FromHicon(hicon: IntPtr): Bitmap {
        const bitmap: Out<IntPtr> = New.Out();
        const status: Status = GDIPlus.GdipCreateBitmapFromHICON(hicon, bitmap);
        GDIPlus.CheckStatus(status);
        return new Bitmap(bitmap.value);
    }

    public static FromResource(hinstance: IntPtr, bitmapName: string): Bitmap	//TODO: Untested
    {
        const bitmap: Out<IntPtr> = New.Out();
        const status: Status = GDIPlus.GdipCreateBitmapFromResource(hinstance, bitmapName, bitmap);
        GDIPlus.CheckStatus(status);
        return new Bitmap(bitmap.value);
    }

    public GetHbitmap(): IntPtr;
    public GetHbitmap(background: CGColor): IntPtr;
    public GetHbitmap(...args: any[]): IntPtr {
        if (args.length === 0) {
            return this.GetHbitmap(CGColor.Gray);
        } else if (args.length === 1) {
            const background: CGColor = args[0];

            const HandleBmp: Out<IntPtr> = New.Out();

            const status: Status = GDIPlus.GdipCreateHBITMAPFromBitmap(this.nativeObject, HandleBmp, background.toInt());
            GDIPlus.CheckStatus(status);

            return HandleBmp.value;
        }
        throw new ArgumentOutOfRangeException('');
    }

    public GetHicon(): IntPtr {
        const HandleIcon: Out<IntPtr> = New.Out();;

        const status: Status = GDIPlus.GdipCreateHICONFromBitmap(this.nativeObject, HandleIcon);
        GDIPlus.CheckStatus(status);

        return HandleIcon.value;
    }

    public LockBits(rect: CGRectangle, flags: ImageLockMode, format: PixelFormat): BitmapData;
    public LockBits(rect: CGRectangle, flags: ImageLockMode, format: PixelFormat, bitmapData: BitmapData): BitmapData;
    public LockBits(...args: any[]): BitmapData {
        if (args.length === 3) {
            const rect: CGRectangle = args[0];
            const flags: ImageLockMode = args[1];
            const format: PixelFormat = args[2];
            const result: BitmapData = new BitmapData();
            return this.LockBits(rect, flags, format, result);
        } else if (args.length === 4) {
            let rect: CGRectangle = args[0];
            const flags: ImageLockMode = args[1];
            const format: PixelFormat = args[2];
            const bitmapData: BitmapData = args[3];
            const _rect: Out<CGRectangle> = New.Out(rect);
            const status: Status = GDIPlus.GdipBitmapLockBits(this.nativeObject, _rect, flags, format, bitmapData);
            rect = _rect.value;
            //NOTE: scan0 points to piece of memory allocated in the unmanaged space
            GDIPlus.CheckStatus(status);

            return bitmapData;
        }
        throw new ArgumentOutOfRangeException('');
    }

    public MakeTransparent(): void;
    public MakeTransparent(transparentColor: CGColor): void;
    public MakeTransparent(...args: any[]): void {
        if (args.length === 0) {
            const clr: CGColor = this.GetPixel(0, 0);
            this.MakeTransparent(clr);
        } else if (args.length === 1) {
            const transparentColor: CGColor = args[0];
            // We have to draw always over a 32-bitmap surface that supports alpha channel
            const bmp: Bitmap = new Bitmap(this.Width, this.Height, PixelFormat.Format32bppArgb);
            const gr: Graphics = Graphics.FromImage(bmp);
            const destRect: CGRectangle = new CGRectangle(0, 0, this.Width, this.Height);
            const imageAttr: ImageAttributes = new ImageAttributes();

            imageAttr.SetColorKey(transparentColor, transparentColor);

            throw new Exception('');
            //gr.DrawImage(this, destRect, 0, 0, this.Width, this.Height, GraphicsUnit.Pixel, imageAttr);

            const oldBmp: IntPtr = this.nativeObject;
            this.nativeObject = bmp.nativeObject;
            bmp.nativeObject = oldBmp;

            gr.Dispose();
            bmp.Dispose();
            imageAttr.Dispose();
        }
    }

    public SetResolution(xDpi: float, yDpi: float): void {
        const status: Status = GDIPlus.GdipBitmapSetResolution(this.nativeObject, xDpi, yDpi);
        GDIPlus.CheckStatus(status);
    }

    public UnlockBits(bitmapdata: BitmapData): void {
        const status: Status = GDIPlus.GdipBitmapUnlockBits(this.nativeObject, bitmapdata);
        GDIPlus.CheckStatus(status);
    }
}