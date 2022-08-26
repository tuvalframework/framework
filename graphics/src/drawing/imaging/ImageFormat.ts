import { Guid, Override, int } from '@tuval/core';
export class ImageFormat {

    private guid: Guid = null as any;
    private name: string = '';

    private static readonly BmpGuid: string = "b96b3cab-0728-11d3-9d7b-0000f81ef32e";
    private static readonly EmfGuid: string = "b96b3cac-0728-11d3-9d7b-0000f81ef32e";
    private static readonly ExifGuid: string = "b96b3cb2-0728-11d3-9d7b-0000f81ef32e";
    private static readonly GifGuid: string = "b96b3cb0-0728-11d3-9d7b-0000f81ef32e";
    private static readonly TiffGuid: string = "b96b3cb1-0728-11d3-9d7b-0000f81ef32e";
    private static readonly PngGuid: string = "b96b3caf-0728-11d3-9d7b-0000f81ef32e";
    private static readonly MemoryBmpGuid: string = "b96b3caa-0728-11d3-9d7b-0000f81ef32e";
    private static readonly IconGuid: string = "b96b3cb5-0728-11d3-9d7b-0000f81ef32e";
    private static readonly JpegGuid: string = "b96b3cae-0728-11d3-9d7b-0000f81ef32e";
    private static readonly WmfGuid: string = "b96b3cad-0728-11d3-9d7b-0000f81ef32e";

    // lock(this) is bad
    // http://msdn.microsoft.com/library/en-us/dnaskdr/html/askgui06032003.asp?frame=true

    private static BmpImageFormat: ImageFormat;
    private static EmfImageFormat: ImageFormat;
    private static ExifImageFormat: ImageFormat;
    private static GifImageFormat: ImageFormat;
    private static TiffImageFormat: ImageFormat;
    private static PngImageFormat: ImageFormat;
    private static MemoryBmpImageFormat: ImageFormat;
    private static IconImageFormat: ImageFormat;
    private static JpegImageFormat: ImageFormat;
    private static WmfImageFormat: ImageFormat;


    // constructors
    public constructor(guid: Guid);
    public constructor(name: string, guid: string);
    public constructor(...args: any[]) {
        if (args.length === 1) {
            const guid: Guid = args[0];
            this.guid = guid;
        } else if (args.length === 2) {
            const name: string = args[0];
            const guid: string = args[1];
            this.name = name;
            this.guid = new Guid(guid);
        }
    }

    // methods
    @Override
    public Equals(o: ImageFormat): boolean {
        const f: ImageFormat = (o as ImageFormat);
        if (f == null)
            return false;

        return f.Guid.Equals(this.guid);
    }


    @Override
    public GetHashCode(): int {
        return this.guid.GetHashCode();
    }


    @Override
    public ToString(): string {
        if (this.name != null)
            return this.name;

        return ("[ImageFormat: " + this.guid.ToString() + "]");
    }

    // properties
    public get Guid(): Guid {
        return this.guid;
    }


    public static get Bmp(): ImageFormat {
        if (ImageFormat.BmpImageFormat == null)
            ImageFormat.BmpImageFormat = new ImageFormat("Bmp", ImageFormat.BmpGuid);
        return ImageFormat.BmpImageFormat;
    }

    public static get Emf(): ImageFormat {
        if (ImageFormat.EmfImageFormat == null)
            ImageFormat.EmfImageFormat = new ImageFormat("Emf", ImageFormat.EmfGuid);
        return ImageFormat.EmfImageFormat;
    }


    public static get Exif(): ImageFormat {
        if (ImageFormat.ExifImageFormat == null)
            ImageFormat.ExifImageFormat = new ImageFormat("Exif", ImageFormat.ExifGuid);
        return ImageFormat.ExifImageFormat;
    }


    public static get Gif(): ImageFormat {
        if (ImageFormat.GifImageFormat == null)
            ImageFormat.GifImageFormat = new ImageFormat("Gif", ImageFormat.GifGuid);
        return ImageFormat.GifImageFormat;
    }


    public static get Icon(): ImageFormat {
        if (ImageFormat.IconImageFormat == null)
            ImageFormat.IconImageFormat = new ImageFormat("Icon", ImageFormat.IconGuid);
        return ImageFormat.IconImageFormat;
    }


    public static get Jpeg(): ImageFormat {
        if (ImageFormat.JpegImageFormat == null)
            ImageFormat.JpegImageFormat = new ImageFormat("Jpeg", ImageFormat.JpegGuid);
        return ImageFormat.JpegImageFormat;
    }


    public static get MemoryBmp(): ImageFormat {
        if (ImageFormat.MemoryBmpImageFormat == null)
            ImageFormat.MemoryBmpImageFormat = new ImageFormat("MemoryBMP", ImageFormat.MemoryBmpGuid);
        return ImageFormat.MemoryBmpImageFormat;
    }


    public static get Png(): ImageFormat {
        if (ImageFormat.PngImageFormat == null)
            ImageFormat.PngImageFormat = new ImageFormat("Png", ImageFormat.PngGuid);
        return ImageFormat.PngImageFormat;
    }


    public static get Tiff(): ImageFormat {
        if (ImageFormat.TiffImageFormat == null)
            ImageFormat.TiffImageFormat = new ImageFormat("Tiff", ImageFormat.TiffGuid);
        return ImageFormat.TiffImageFormat;
    }


    public static get Wmf(): ImageFormat {
        if (ImageFormat.WmfImageFormat == null)
            ImageFormat.WmfImageFormat = new ImageFormat("Wmf", ImageFormat.WmfGuid);
        return ImageFormat.WmfImageFormat;
    }
}