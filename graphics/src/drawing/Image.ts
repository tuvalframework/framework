import {
    IntPtr, File, FileNotFoundException, New, Out, Stream, ArgumentNullException,
    NotSupportedException, Locale, int, ArgumentException, ByteArray, TArray,
    MemoryStream, using, IntArray, ArgumentOutOfRangeException, OutOfMemoryException
} from '@tuval/core';
import { ImageType, Status } from './gdipEnums';
import { PixelFormat } from './imaging/PixelFormat';
import { CGRectangle, CGSize } from '@tuval/cg';
import { GraphicsUnit } from './GraphicsUnit';
import { GDIPlus, GdiPlusStreamHelper } from './GDIPlus';
import { EncoderParameters } from './imaging/EncoderParameters';
import { Guid, uint, Marshal, NotImplementedException, float, Virtual, is, typeOf, Delegate, System, ClassInfo, Context } from '@tuval/core';
import { Graphics } from './Graphics';
import { RotateFlipType } from './RotateFlipType';
import { PropertyItem } from './imaging/PropertyItem';
import { GdipPropertyItem } from './gdipStructs';
import { ImageFormat } from './imaging/ImageFormat';
import { ImageCodecInfo } from './imaging/ImageCodecInfo';
import { FrameDimension } from './imaging/FrameDimension';
import { ColorPalette } from './imaging/ColorPalette';
import { GraphicTypes } from '../GDITypes';
import { Bitmap } from './Bitmap';

export class GetThumbnailImageAbort extends Delegate<() => boolean> { };

declare var Metafile, HandleRef;

@ClassInfo({
    fullName: GraphicTypes.Image,
    instanceof: [
        GraphicTypes.Image
    ]
})
export abstract class Image {
    public /* internal */  nativeObject: IntPtr = IntPtr.Zero;
    public /* internal */  stream: Stream = null as any;

    public static FromFile(filename: string): Image;
    public static FromFile(filename: string, useEmbeddedColorManagement: boolean): Image;
    public static FromFile(...args: any[]): Image {
        if (args.length === 1) {
            const filename: string = args[0];
            return Image.FromFile(filename, false);
        } else if (args.length === 2) {
            const filename: string = args[0];
            const useEmbeddedColorManagement: boolean = args[1];
            const imagePtr: Out<IntPtr> = New.Out(null as any);
            let st: Status;

            if (!File.Exists(filename))
                throw new FileNotFoundException(filename);

            if (useEmbeddedColorManagement)
                st = GDIPlus.GdipLoadImageFromFileICM(filename, imagePtr.value);
            else
                st = GDIPlus.GdipLoadImageFromFile(filename, imagePtr);
            GDIPlus.CheckStatus(st);

            return Image.CreateFromHandle(imagePtr.value);
        }
        throw new ArgumentOutOfRangeException('');
    }

    public static FromHbitmap(hbitmap: IntPtr): Bitmap;
    public static FromHbitmap(hbitmap: IntPtr, hpalette: IntPtr): Bitmap;
    public static FromHbitmap(...args: any[]): Bitmap {
        if (args.length === 1) {
            const hbitmap: IntPtr = args[0];
            return Image.FromHbitmap(hbitmap, IntPtr.Zero);
        } else if (args.length === 2) {
            const hbitmap: IntPtr = args[0];
            const hpalette: IntPtr = args[1];
            const imagePtr: Out<IntPtr> = New.Out(null as any);;
            let st: Status;

            st = GDIPlus.GdipCreateBitmapFromHBITMAP(hbitmap, hpalette, imagePtr);

            GDIPlus.CheckStatus(st);
            const bitmap = Context.Current.get('Bitmap');
            return new bitmap(imagePtr.value);
        }
        throw new ArgumentOutOfRangeException('');
    }


    public static FromStream(stream: Stream): Image;
    public static FromStream(stream: Stream, useEmbeddedColorManagement: boolean): Image;
    public static FromStream(stream: Stream, useEmbeddedColorManagement: boolean, validateImageData: boolean): Image;
    public static FromStream(...args: any[]): Image {
        if (args.length === 1) {
            const stream: Stream = args[0];
            return Image.LoadFromStream(stream, false);
        } else if (args.length === 2) {
            const stream: Stream = args[0];
            const useEmbeddedColorManagement: boolean = args[1];
            return Image.LoadFromStream(stream, false);
        } else if (args.length === 3) {
            const stream: Stream = args[0];
            const useEmbeddedColorManagement: boolean = args[1];
            const validateImageData: boolean = args[2];
            return Image.LoadFromStream(stream, false);
        }
        throw new ArgumentOutOfRangeException('');
    }

    public /* internal */ static LoadFromStream(stream: Stream, keepAlive: boolean): Image {
        if (stream == null)
            throw new ArgumentNullException("stream");

        const img: Image = Image.CreateFromHandle(Image.InitFromStream(stream));

        // Under Windows, we may need to keep a reference on the stream as long as the image is alive
        // (GDI+ seems to use a lazy loader)
        if (keepAlive && GDIPlus.RunningOnWindows())
            img.stream = stream;

        return img;
    }
    public /* internal */ static CreateFromHandle(handle: IntPtr): Image {
        let type: Out<ImageType> = New.Out(ImageType.Unknown);
        GDIPlus.CheckStatus(GDIPlus.GdipGetImageType(handle, type));
        switch (type.value) {
            case ImageType.Bitmap:
                const bitmap = Context.Current.get('Bitmap');
                return new bitmap(handle);
            case ImageType.Metafile:
                return new Metafile(handle);
            default:
                throw new NotSupportedException(Locale.GetText("Unknown image type."));
        }
    }

    public static GetPixelFormatSize(pixfmt: PixelFormat): int {
        let result: int = 0;
        switch (pixfmt) {
            case PixelFormat.Format16bppArgb1555:
            case PixelFormat.Format16bppGrayScale:
            case PixelFormat.Format16bppRgb555:
            case PixelFormat.Format16bppRgb565:
                result = 16;
                break;
            case PixelFormat.Format1bppIndexed:
                result = 1;
                break;
            case PixelFormat.Format24bppRgb:
                result = 24;
                break;
            case PixelFormat.Format32bppArgb:
            case PixelFormat.Format32bppPArgb:
            case PixelFormat.Format32bppRgb:
                result = 32;
                break;
            case PixelFormat.Format48bppRgb:
                result = 48;
                break;
            case PixelFormat.Format4bppIndexed:
                result = 4;
                break;
            case PixelFormat.Format64bppArgb:
            case PixelFormat.Format64bppPArgb:
                result = 64;
                break;
            case PixelFormat.Format8bppIndexed:
                result = 8;
                break;
        }
        return result;
    }

    public static IsAlphaPixelFormat(pixfmt: PixelFormat): boolean {
        let result: boolean = false;
        switch (pixfmt) {
            case PixelFormat.Format16bppArgb1555:
            case PixelFormat.Format32bppArgb:
            case PixelFormat.Format32bppPArgb:
            case PixelFormat.Format64bppArgb:
            case PixelFormat.Format64bppPArgb:
                result = true;
                break;
            case PixelFormat.Format16bppGrayScale:
            case PixelFormat.Format16bppRgb555:
            case PixelFormat.Format16bppRgb565:
            case PixelFormat.Format1bppIndexed:
            case PixelFormat.Format24bppRgb:
            case PixelFormat.Format32bppRgb:
            case PixelFormat.Format48bppRgb:
            case PixelFormat.Format4bppIndexed:
            case PixelFormat.Format8bppIndexed:
                result = false;
                break;
        }
        return result;
    }

    public static IsCanonicalPixelFormat(pixfmt: PixelFormat): boolean {
        return ((pixfmt & PixelFormat.Canonical) !== 0);
    }

    public static IsExtendedPixelFormat(pixfmt: PixelFormat): boolean {
        return ((pixfmt & PixelFormat.Extended) != 0);
    }

    public /* internal */ static InitFromStream(stream: Stream): IntPtr {
        if (stream == null)
            throw new ArgumentException("stream");

        let imagePtr: Out<IntPtr> = New.Out();
        let st: Status = Status.Ok;

        // Seeking required
        if (!stream.CanSeek) {
            let buffer: ByteArray = New.ByteArray(256);
            let index: int = 0;
            let count: int;

            do {
                if (buffer.length < index + 256) {
                    const newBuffer: ByteArray = New.ByteArray(buffer.length * 2);
                    TArray.Copy(buffer, newBuffer, buffer.length);
                    buffer = newBuffer;
                }
                count = stream.Read(buffer, index, 256);
                index += count;
            }
            while (count !== 0);

            stream = new MemoryStream(buffer, 0, index);
        }

        if (GDIPlus.RunningOnUnix()) {
            // Unix, with libgdiplus
            // We use a custom API for this, because there's no easy way
            // to get the Stream down to libgdiplus.  So, we wrap the stream
            // with a set of delegates.
            /*   const sh:GdiPlusStreamHelper = new GdiPlusStreamHelper(stream, true);

              st = GdipLoadImageFromDelegate_linux(sh.GetHeaderDelegate, sh.GetBytesDelegate,
                  sh.PutBytesDelegate, sh.SeekDelegate, sh.CloseDelegate, sh.SizeDelegate, out imagePtr); */
        } else {
            st = GDIPlus.GdipLoadImageFromStream(/* new ComIStreamWrapper( */stream, imagePtr);
        }

        return st === Status.Ok ? imagePtr.value : IntPtr.Zero;
    }

    // non-static
    public GetBounds(pageUnit: Out<GraphicsUnit>): CGRectangle {
        let source: Out<CGRectangle> = New.Out(CGRectangle.Empty);

        const status: Status = GDIPlus.GdipGetImageBounds(this.nativeObject, source, pageUnit);
        GDIPlus.CheckStatus(status);

        return source.value;
    }

    public GetEncoderParameterList(encoder: Guid): EncoderParameters {
        let status: Status;
        let sz: Out<uint> = New.Out(0);

        status = GDIPlus.GdipGetEncoderParameterListSize(this.nativeObject, New.Out(encoder), sz);
        GDIPlus.CheckStatus(status);

        const rawEPList: IntPtr = Marshal.AllocHGlobal(sz.value);
        let eps: EncoderParameters;

        try {
            status = GDIPlus.GdipGetEncoderParameterList(this.nativeObject, New.Out(encoder), sz.value, rawEPList);
            eps = EncoderParameters.FromNativePtr(rawEPList);
            GDIPlus.CheckStatus(status);
        }
        finally {
            Marshal.FreeHGlobal(rawEPList);
        }

        return eps;
    }

    public GetFrameCount(dimension: FrameDimension): int {
        let count: Out<uint> = New.Out(0);
        let guid: Out<Guid> = New.Out(dimension.Guid);

        const status: Status = GDIPlus.GdipImageGetFrameCount(this.nativeObject, guid, count);
        GDIPlus.CheckStatus(status);

        return count.value;
    }

    public GetPropertyItem(propid: int): PropertyItem {
        let propSize: Out<int> = New.Out(0);
        let property: IntPtr;
        const item: PropertyItem = new PropertyItem();
        let gdipProperty: GdipPropertyItem = new GdipPropertyItem();
        let status: Status;

        status = GDIPlus.GdipGetPropertyItemSize(this.nativeObject, propid, propSize);
        GDIPlus.CheckStatus(status);

        /* Get PropertyItem */
        property = Marshal.AllocHGlobal(propSize.value);
        try {
            status = GDIPlus.GdipGetPropertyItem(this.nativeObject, propid, propSize.value, property);
            GDIPlus.CheckStatus(status);
            gdipProperty = Marshal.PtrToStructure<GdipPropertyItem>(property, typeOf(GdipPropertyItem));
            GdipPropertyItem.MarshalTo(gdipProperty, item);
        }
        finally {
            Marshal.FreeHGlobal(property);
        }
        return item;
    }

    public GetThumbnailImage(thumbWidth: int, thumbHeight: int, callback: GetThumbnailImageAbort, callbackData: IntPtr): Image {
        if ((thumbWidth <= 0) || (thumbHeight <= 0))
            throw new OutOfMemoryException("Invalid thumbnail size");

            const bitmap = Context.Current.get('Bitmap');
        const ThumbNail: Image = new bitmap(thumbWidth, thumbHeight);

        using(Graphics.FromImage(ThumbNail), (g: Graphics) => {
            const status: Status = GDIPlus.GdipDrawImageRectRectI(g.nativeObject, this.nativeObject, 0, 0, thumbWidth, thumbHeight, 0, 0, this.Width, this.Height,
                GraphicsUnit.Pixel, IntPtr.Zero, null as any, IntPtr.Zero);

            GDIPlus.CheckStatus(status);
        });

        return ThumbNail;
    }


    public RemovePropertyItem(propid: int): void {
        const status: Status = GDIPlus.GdipRemovePropertyItem(this.nativeObject, propid);
        GDIPlus.CheckStatus(status);
    }

    public RotateFlip(rotateFlipType: RotateFlipType): void {
        const status: Status = GDIPlus.GdipImageRotateFlip(this.nativeObject, rotateFlipType);
        GDIPlus.CheckStatus(status);
    }

    public /* internal */  findEncoderForFormat(format: ImageFormat): ImageCodecInfo {
        const encoders: ImageCodecInfo[] = ImageCodecInfo.GetImageEncoders();
        let encoder: ImageCodecInfo = null as any;

        if (format.Guid.Equals(ImageFormat.MemoryBmp.Guid))
            format = ImageFormat.Png;

        /* Look for the right encoder for our format*/
        for (let i: int = 0; i < encoders.length; i++) {
            if (encoders[i].FormatID.Equals(format.Guid)) {
                encoder = encoders[i];
                break;
            }
        }

        return encoder;
    }

    public Save(filename: string): void;
    public Save(filename: string, format: ImageFormat): void;
    public Save(filename: string, encoder: ImageCodecInfo, encoderParams: EncoderParameters): void;
    public Save(stream: Stream, format: ImageFormat): void;
    public Save(stream: Stream, encoder: ImageCodecInfo, encoderParams: EncoderParameters): void;
    public Save(...args: any[]): void {
        if (args.length === 0 && is.string(args[0])) {
            const filename: string = args[0];
            this.Save(filename, this.RawFormat);
        } else if (args.length === 2 && is.string(args[0])) {
            const filename: string = args[0];
            const format: ImageFormat = args[1];
            let encoder: ImageCodecInfo = this.findEncoderForFormat(format);
            if (encoder == null) {
                // second chance
                encoder = this.findEncoderForFormat(this.RawFormat);
                if (encoder == null) {
                    const msg: string = Locale.GetText("No codec available for saving format '{0}'.", format.Guid);
                    throw new ArgumentException(msg, "format");
                }
            }
            this.Save(filename, encoder, null as any);
        } else if (args.length === 3 && is.string(args[0])) {
            const filename: string = args[0];
            const encoder: ImageCodecInfo = args[1];
            const encoderParams: EncoderParameters = args[2];

            let st: Status;
            let guid: Out<Guid> = New.Out(encoder.Clsid);

            if (encoderParams == null) {
                st = GDIPlus.GdipSaveImageToFile(this.nativeObject, filename, guid, IntPtr.Zero);
            } else {
                const nativeEncoderParams: IntPtr = encoderParams.ToNativePtr();
                st = GDIPlus.GdipSaveImageToFile(this.nativeObject, filename, guid, nativeEncoderParams);
                Marshal.FreeHGlobal(nativeEncoderParams);
            }

            GDIPlus.CheckStatus(st);
        } else if (args.length === 2 && is.typeof<Stream>(args[0], System.Types.IO.Stream)) {
            const stream: Stream = args[0];
            const format: ImageFormat = args[1];
            const encoder: ImageCodecInfo = this.findEncoderForFormat(format);

            if (encoder == null)
                throw new ArgumentException("No codec available for format:" + format.Guid);

            this.Save(stream, encoder, null as any);
        } else if (args.length === 3 && is.typeof<Stream>(args[0], System.Types.IO.Stream)) {
            const stream: Stream = args[0];
            const encoder: ImageCodecInfo = args[1];
            const encoderParams: EncoderParameters = args[2];
            let st: Status = Status.Ok;
            let nativeEncoderParams: IntPtr;
            const guid: Out<Guid> = New.Out(encoder.Clsid);

            if (encoderParams == null)
                nativeEncoderParams = IntPtr.Zero;
            else
                nativeEncoderParams = encoderParams.ToNativePtr();

            try {
                if (GDIPlus.RunningOnUnix()) {
                    /*  GdiPlusStreamHelper sh = new GDIPlus.GdiPlusStreamHelper(stream, false);
                     st = GDIPlus.GdipSaveImageToDelegate_linux(nativeObject, sh.GetBytesDelegate, sh.PutBytesDelegate,
                         sh.SeekDelegate, sh.CloseDelegate, sh.SizeDelegate, ref guid, nativeEncoderParams); */
                } else {
                    st = GDIPlus.GdipSaveImageToStream(this.nativeObject, stream, guid, new HandleRef(encoderParams, nativeEncoderParams));
                }
            }
            finally {
                if (nativeEncoderParams != IntPtr.Zero)
                    Marshal.FreeHGlobal(nativeEncoderParams);
            }
            GDIPlus.CheckStatus(st);
        }
    }

    public SaveAdd(encoderParams: EncoderParameters): void;
    public SaveAdd(image: Image, encoderParams: EncoderParameters): void;
    public SaveAdd(...args: any[]): void {
        if (args.length === 1) {
            const encoderParams: EncoderParameters = args[0];
            let st: Status = Status.Ok;

            const nativeEncoderParams: IntPtr = encoderParams.ToNativePtr();
            st = GDIPlus.GdipSaveAdd(this.nativeObject, nativeEncoderParams);
            Marshal.FreeHGlobal(nativeEncoderParams);
            GDIPlus.CheckStatus(st);
        } else if (args.length === 2) {
            const image: Image = args[0];
            const encoderParams: EncoderParameters = args[1];
            let st: Status = Status.Ok;

            const nativeEncoderParams: IntPtr = encoderParams.ToNativePtr();
            st = GDIPlus.GdipSaveAddImage(this.nativeObject, image.NativeObject, nativeEncoderParams);
            Marshal.FreeHGlobal(nativeEncoderParams);
            GDIPlus.CheckStatus(st);
        }
        throw new ArgumentOutOfRangeException('');
    }

    public SelectActiveFrame(dimension: FrameDimension, frameIndex: int): int {
        const guid: Out<Guid> = New.Out(dimension.Guid);
        const st: Status = GDIPlus.GdipImageSelectActiveFrame(this.nativeObject, guid, frameIndex);

        GDIPlus.CheckStatus(st);

        return frameIndex;
    }

    public SetPropertyItem(propitem: PropertyItem): void {
        throw new NotImplementedException('');
        /*
                GdipPropertyItem pi = new GdipPropertyItem ();
                GdipPropertyItem.MarshalTo (pi, propitem);
                unsafe {
                    Status status = GDIPlus.GdipSetPropertyItem (nativeObject, &pi);

                    GDIPlus.CheckStatus (status);
                }
        */
    }

    // properties
    public get Flags(): int {
        let flags: Out<int> = New.Out(0);

        const status: Status = GDIPlus.GdipGetImageFlags(this.nativeObject, flags);
        GDIPlus.CheckStatus(status);
        return flags.value;
    }

    public get FrameDimensionsList(): Guid[] {
        let found: Out<uint> = New.Out(0);
        let status: Status = GDIPlus.GdipImageGetFrameDimensionsCount(this.nativeObject, found);
        GDIPlus.CheckStatus(status);
        const guid: Guid[] = New.Array(found.value);
        status = GDIPlus.GdipImageGetFrameDimensionsList(this.nativeObject, guid, found.value);
        GDIPlus.CheckStatus(status);
        return guid;
    }

    public get Height(): int {
        const height: Out<uint> = New.Out(0);
        const status: Status = GDIPlus.GdipGetImageHeight(this.nativeObject, height);
        GDIPlus.CheckStatus(status);

        return height.value;
    }

    public get HorizontalResolution(): float {
        let resolution: Out<float> = New.Out(0);

        const status: Status = GDIPlus.GdipGetImageHorizontalResolution(this.nativeObject, resolution);
        GDIPlus.CheckStatus(status);

        return resolution.value;
    }

    public get Palette(): ColorPalette {
        return this.retrieveGDIPalette();
    }
    public set Palette(value: ColorPalette) {
        this.storeGDIPalette(value);
    }


    public /* internal */  retrieveGDIPalette(): ColorPalette {
        let bytes: Out<int> = New.Out(0);
        const ret: ColorPalette = new ColorPalette();

        let st: Status = GDIPlus.GdipGetImagePaletteSize(this.nativeObject, bytes);
        GDIPlus.CheckStatus(st);
        const palette_data: IntPtr = Marshal.AllocHGlobal(bytes.value + 4 /* flag */+ 4 /* count */);
        try {
            st = GDIPlus.GdipGetImagePalette(this.nativeObject, palette_data, bytes.value);
            GDIPlus.CheckStatus(st);
            ret.setFromGDIPalette(palette_data);
            return ret;
        }

        finally {
            Marshal.FreeHGlobal(palette_data);
        }
    }

    public /* internal */  storeGDIPalette(palette: ColorPalette): void {
        if (palette == null) {
            throw new ArgumentNullException("palette");
        }
        const palette_data: IntPtr = palette.getGDIPalette();
        if (palette_data === IntPtr.Zero) {
            return;
        }

        try {
            const st: Status = GDIPlus.GdipSetImagePalette(this.nativeObject, palette_data);
            GDIPlus.CheckStatus(st);
        }

        finally {
            Marshal.FreeHGlobal(palette_data);
        }
    }


    public get PhysicalDimension(): CGSize {
        let width: Out<float> = New.Out(0), height: Out<float> = New.Out(0);
        const status: Status = GDIPlus.GdipGetImageDimension(this.nativeObject, width, height);
        GDIPlus.CheckStatus(status);

        return new CGSize(width.value, height.value);
    }

    public get PixelFormat(): PixelFormat {
        const pixFormat: Out<PixelFormat> = New.Out();
        const status: Status = GDIPlus.GdipGetImagePixelFormat(this.nativeObject, pixFormat);
        GDIPlus.CheckStatus(status);

        return pixFormat.value;
    }

    public get PropertyIdList(): IntArray {
        let propNumbers: Out<uint> = New.Out(0);

        let status: Status = GDIPlus.GdipGetPropertyCount(this.nativeObject, propNumbers);
        GDIPlus.CheckStatus(status);

        const idList: IntArray = New.IntArray(propNumbers.value);
        status = GDIPlus.GdipGetPropertyIdList(this.nativeObject, propNumbers.value, idList);
        GDIPlus.CheckStatus(status);

        return idList;
    }

    public get PropertyItems(): PropertyItem[] {
        let propNums: Out<int> = New.Out(0);
        let propsSize: Out<int> = New.Out(0);
        let propSize: int = 0;
        let properties: Out<IntPtr> = New.Out()
        let propPtr: Out<IntPtr> = New.Out();
        let items: PropertyItem[];
        let gdipProperty: GdipPropertyItem = new GdipPropertyItem();
        let status: Status;

        status = GDIPlus.GdipGetPropertySize(this.nativeObject, propsSize, propNums);
        GDIPlus.CheckStatus(status);

        items = New.Array(propNums.value);

        if (propNums.value === 0)
            return items;

        /* Get PropertyItem list*/
        properties.value = Marshal.AllocHGlobal(propsSize.value * propNums.value);
        try {
            status = GDIPlus.GdipGetAllPropertyItems(this.nativeObject, propsSize.value, propNums.value, properties.value);
            GDIPlus.CheckStatus(status);

            propSize = Marshal.SizeOf(gdipProperty);
            propPtr = properties;

            for (let i: int = 0; i < propNums.value; i++, propPtr.value = new IntPtr(propPtr.value.ToInt64() + propSize)) {
                gdipProperty = Marshal.PtrToStructure(propPtr.value, typeOf(GdipPropertyItem));
                items[i] = new PropertyItem();
                GdipPropertyItem.MarshalTo(gdipProperty, items[i]);
            }
        }
        finally {
            Marshal.FreeHGlobal(properties.value);
        }
        return items;
    }

    public get RawFormat(): ImageFormat {
        const guid: Out<Guid> = New.Out();
        const st: Status = GDIPlus.GdipGetImageRawFormat(this.nativeObject, guid);

        GDIPlus.CheckStatus(st);
        return new ImageFormat(guid.value);
    }

    public get Size(): CGSize {
        return new CGSize(this.Width, this.Height);
    }
    public Tag: any;

    public get VerticalResolution(): float {
        let resolution: Out<float> = New.Out();

        const status: Status = GDIPlus.GdipGetImageVerticalResolution(this.nativeObject, resolution);
        GDIPlus.CheckStatus(status);

        return resolution.value;
    }

    public get Width(): int {
        let width: Out<uint> = New.Out(0);
        let status: Status = GDIPlus.GdipGetImageWidth(this.nativeObject, width);
        GDIPlus.CheckStatus(status);

        return width.value;
    }

    public /* internal */ get NativeObject(): IntPtr {
        return this.nativeObject;
    }
    public set NativeObject(value: IntPtr) {
        this.nativeObject = value;
    }

    public Dispose(): void {
        this.dispose(true);
        //GC.SuppressFinalize(this);
    }

    /* ~Image()
    {
        Dispose(false);
    } */

    @Virtual
    protected dispose(disposing: boolean): void {
        if (GDIPlus.GdiPlusToken.value !== 0 && this.nativeObject !== IntPtr.Zero) {
            const status: Status = GDIPlus.GdipDisposeImage(this.nativeObject);
            // dispose the stream (set under Win32 only if SD owns the stream) and ...
            if (this.stream != null) {
                this.stream.Close();
                this.stream = null as any;
            }
            // ... set nativeObject to null before (possibly) throwing an exception
            this.nativeObject = IntPtr.Zero;
            GDIPlus.CheckStatus(status);
        }
    }

    public Clone(): Image {
        if (GDIPlus.RunningOnWindows() && this.stream != null)
            return this.CloneFromStream();

        const newimage: Out<IntPtr> = New.Out(IntPtr.Zero);
        const status: Status = GDIPlus.GdipCloneImage(this.NativeObject, newimage);
        GDIPlus.CheckStatus(status);

        if (is.typeof<Bitmap>(this, GraphicTypes.Bitmap)){
            const bitmap = Context.Current.get('Bitmap');
            return new bitmap(newimage.value);
        }
        else
            return new Metafile(newimage);
    }

    // On win32, when cloning images that were originally created from a stream, we need to
    // clone both the image and the stream to make sure the gc doesn't kill it
    // (when using MS GDI+ and IStream we must ensure the stream stays alive for all the life of the Image)
    private CloneFromStream(): Image {
        const bytes: ByteArray = New.ByteArray(this.stream.Length);
        const ms: MemoryStream = new MemoryStream(bytes);
        let count: int = (this.stream.Length < 4096 ? this.stream.Length : 4096);
        const buffer: ByteArray = New.ByteArray(count);
        this.stream.Position = 0;
        do {
            count = this.stream.Read(buffer, 0, count);
            ms.Write(buffer, 0, count);
        } while (count == 4096);

        let newimage: IntPtr = IntPtr.Zero;
        newimage = Image.InitFromStream(ms);

        if (is.typeof<Bitmap>(this, GraphicTypes.Bitmap)) {
            const bitmap = Context.Current.get('Bitmap');
            return new bitmap(newimage, ms);
        }
        else {
            return new Metafile(newimage, ms);
        }
    }

}