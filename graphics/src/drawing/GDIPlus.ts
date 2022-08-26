import {
    int, Out, EventArgs, Locale, IntPtr, Console, float,
    Exception, ArgumentException, FileNotFoundException, NotSupportedException, Marshal, typeOf, OutOfMemoryException, InvalidOperationException, SeekOrigin,
    NotImplementedException, New, IntArray, MemberAccessException, InternalBufferOverflowException, UnauthorizedAccessException, OverflowException, Environment, State
} from '@tuval/core';
import { BrushType, Status, ImageType } from './gdipEnums';
import { CGPoint, CGRectangle, CoreGraphicTypes, CGImage, IContext2D, CGContext2D } from '@tuval/cg';
import { GraphicTypes } from '../GDITypes';
import { CombineMode } from './drawing2D/CombineMode';
import { Stream } from '../index_web';
import { GdiplusStartupInput, GdiplusStartupOutput, GdipPropertyItem } from './gdipStructs';
import { Guid, uint, Delegate, ByteArray, TArray, Dictionary, byte, TBuffer } from '@tuval/core';
import { GraphicsUnit } from './GraphicsUnit';
import { RotateFlipType } from './RotateFlipType';
import { StringFormatFlags } from './StringFormatFlags';
import { PixelFormat } from './imaging/PixelFormat';
import { ImageLockMode } from './imaging/ImageLockMode';
import { BitmapData } from './imaging/BitmapData';
import { ColorThief } from '../Utilities/ColorThief';

declare var GC, AppDomain, EventHandler;

export class DrawImageAbort extends Delegate<(callbackData: IntPtr) => boolean>{ };

export class ImageHandleTable extends Dictionary<IntPtr, CGImage> {
    private static handleCount: int = 0;
    public CreateHandle(image: CGImage) {
        const handle = new IntPtr(ImageHandleTable.handleCount++);
        this.Add(handle, image);
        return handle;
    }
    public GetImage(handle: IntPtr): CGImage {
        if (this.ContainsKey(handle)) {
            return this.Get(handle);
        }
        return null as any;
    }
}

export class GraphicsHandleTable extends Dictionary<IntPtr, IContext2D> {
    public static Default = new GraphicsHandleTable();
    private static handleCount: int = 0;
    public CreateHandle(context: IContext2D) {
        const handle = new IntPtr(GraphicsHandleTable.handleCount++);
        this.Add(handle, context);
        return handle;
    }
    public GetGraphics(handle: IntPtr): IContext2D {
        if (this.ContainsKey(handle)) {
            return this.Get(handle);
        }
        return null as any;
    }
    public SetGraphics(handle: IntPtr, renderingContext: IContext2D) {
        //if (this.ContainsKey(handle)) {
        this.Set(handle, renderingContext);
        //}
        //return null as any;
    }
}

export class GDIPlus {
    public static ImageHandleTable = new ImageHandleTable();
    public static readonly FACESIZE: int = 32;
    public static readonly LANG_NEUTRAL: int = 0;
    public static Display: IntPtr = IntPtr.Zero;
    public static UseX11Drawable: boolean = false;
    public static UseCarbonDrawable: boolean = false;
    public static UseCocoaDrawable: boolean = false;

    /*  public static CreateImageHandle: (image: CGImage) => IntPtr = (function () {
         let imageHandleCount = 0;
         let imageTable: Dictionary<IntPtr, CGImage> = null as any;
         return (image: CGImage): IntPtr => {
             if (imageTable == null) {
                 imageTable = new Dictionary();
             }
             const handle = new IntPtr(imageHandleCount++);
             imageTable.Add(handle, image);
             return
         }
     })(); */

    public static GdiplusStartup(token: Out<int>, input: Out<GdiplusStartupInput>, output: Out<GdiplusStartupOutput>): Status {
        //throw new NotImplementedException('');
        // do nothing
        return Status.Ok;
    }
    public static GdiplusShutdown(token: Out<int>): void {
        throw new NotImplementedException('');
    }
    public /* internal */ static GdiPlusToken: Out<int>;
    public static ProcessExit(sender: any, e: EventArgs): void {
        // Called all pending objects and claim any pending handle before
        // shutting down
        GC.Collect();
        GC.WaitForPendingFinalizers();

    }

    public static StaticConstructor() {
        GDIPlus.GdiPlusToken = New.Out(0);
        const platform: int = 4; // Environment.OSVersion.Platform;
        /* if ((platform == 4) || (platform == 6) || (platform == 128)) {
            if (Environment.GetEnvironmentVariable("not_supported_MONO_MWF_USE_NEW_X11_BACKEND") != null || Environment.GetEnvironmentVariable("MONO_MWF_MAC_FORCE_X11") != null) {
                UseX11Drawable = true;
            } else {
                IntPtr buf = Marshal.AllocHGlobal(8192);
                // This is kind of a hack but gets us sysname from uname (struct utsname *name) on
                // linux and darwin
                if (uname(buf) != 0) {
                    // WTH: We couldn't detect the OS; lets default to X11
                    UseX11Drawable = true;
                } else {
                    string os = Marshal.PtrToStringAnsi(buf);
                    if (os == "Darwin")
                        UseCarbonDrawable = true;
                    else
                        UseX11Drawable = true;
                }
                Marshal.FreeHGlobal(buf);
            }
        }*/

        const input: Out<GdiplusStartupInput> = New.Out(GdiplusStartupInput.MakeGdiplusStartupInput());
        const output: Out<GdiplusStartupOutput> = New.Out(GdiplusStartupOutput.MakeGdiplusStartupOutput());
        try {
            GDIPlus.GdiplusStartup(GDIPlus.GdiPlusToken, input, output);
        }
        catch (TypeInitializationException) {
            Console.Error.WriteLine(
                "* ERROR: Can not initialize GDI+ library{0}{0}" +
                "Please check http://www.mono-project.com/Problem:GDIPlusInit for details",
                Environment.NewLine);
        }

        // under MS 1.x this event is raised only for the default application domain
        // TODO: AppDomain.CurrentDomain.ProcessExit.add(new EventHandler(GDIPlus.ProcessExit));
    }

    public static RunningOnWindows(): boolean {
        return true;/* !UseX11Drawable && !UseCarbonDrawable && !UseCocoaDrawable */;
    }

    public static RunningOnUnix(): boolean {
        return false;/* UseX11Drawable || UseCarbonDrawable || UseCocoaDrawable; */
    }

    // Copies a Ptr to an array of Points and releases the memory
    public static FromUnManagedMemoryToPointI(prt: IntPtr, pts: CGPoint[]): void {
        const nPointSize: int = Marshal.SizeOf(pts[0]);
        let pos: IntPtr = prt;
        for (let i: int = 0; i < pts.length; i++, pos = new IntPtr(pos.ToInt64() + nPointSize))
            pts[i] = Marshal.PtrToStructure(pos, typeOf(CoreGraphicTypes.CGPoint)) as any;

        Marshal.FreeHGlobal(prt);
    }

    // Copies a Ptr to an array of Points and releases the memory
    public static FromUnManagedMemoryToPoint(prt: IntPtr, pts: CGPoint[]): void {
        const nPointSize: int = Marshal.SizeOf(pts[0]);
        let pos: IntPtr = prt;
        for (let i: int = 0; i < pts.length; i++, pos = new IntPtr(pos.ToInt64() + nPointSize))
            pts[i] = Marshal.PtrToStructure(pos, typeOf(CoreGraphicTypes.CGPoint)) as any;

        Marshal.FreeHGlobal(prt);
    }

    // Copies an array of Points to unmanaged memory
    public static FromPointToUnManagedMemoryI(pts: CGPoint[]): IntPtr {
        const nPointSize: int = Marshal.SizeOf(pts[0]);
        const dest: IntPtr = Marshal.AllocHGlobal(nPointSize * pts.length);
        let pos: IntPtr = dest;
        for (let i: int = 0; i < pts.length; i++, pos = new IntPtr(pos.ToInt64() + nPointSize))
            Marshal.StructureToPtr(pts[i] as any, pos, false);

        return dest;
    }

    // Copies a Ptr to an array of v and releases the memory
    public static FromUnManagedMemoryToRectangles(prt: IntPtr, pts: CGRectangle[]): void {
        const nPointSize: int = Marshal.SizeOf(pts[0]);
        let pos: IntPtr = prt;
        for (let i: int = 0; i < pts.length; i++, pos = new IntPtr(pos.ToInt64() + nPointSize))
            pts[i] = Marshal.PtrToStructure(pos, typeOf(CoreGraphicTypes.CGRectangle)) as any;

        Marshal.FreeHGlobal(prt);
    }

    // Copies an array of Points to unmanaged memory
    public static FromPointToUnManagedMemory(pts: CGPoint[]): IntPtr {
        const nPointSize: int = Marshal.SizeOf(pts[0]);
        const dest: IntPtr = Marshal.AllocHGlobal(nPointSize * pts.length);
        let pos: IntPtr = dest;
        for (let i: int = 0; i < pts.length; i++, pos = new IntPtr(pos.ToInt64() + nPointSize))
            Marshal.StructureToPtr(pts[i] as any, pos, false);

        return dest;
    }

    // Converts a status into exception
    // TODO: Add more status code mappings here
    public static /* internal */  CheckStatus(status: Status): void {
        let msg: string;
        switch (status) {
            case Status.Ok:
                return;
            case Status.GenericError:
                msg = Locale.GetText("Generic Error [GDI+ status: {0}]", status);
                throw new Exception(msg);
            case Status.InvalidParameter:
                msg = Locale.GetText("A null reference or invalid value was found [GDI+ status: {0}]", status);
                throw new ArgumentException(msg);
            case Status.OutOfMemory:
                msg = Locale.GetText("Not enough memory to complete operation [GDI+ status: {0}]", status);
                throw new OutOfMemoryException(msg);
            case Status.ObjectBusy:
                msg = Locale.GetText("Object is busy and cannot state allow this operation [GDI+ status: {0}]", status);
                throw new MemberAccessException(msg);
            case Status.InsufficientBuffer:
                msg = Locale.GetText("Insufficient buffer provided to complete operation [GDI+ status: {0}]", status);
                throw new InternalBufferOverflowException(msg);
            case Status.PropertyNotSupported:
                msg = Locale.GetText("Property not supported [GDI+ status: {0}]", status);
                throw new NotSupportedException(msg);
            case Status.FileNotFound:
                msg = Locale.GetText("Requested file was not found [GDI+ status: {0}]", status);
                throw new FileNotFoundException(msg);
            case Status.AccessDenied:
                msg = Locale.GetText("Access to resource was denied [GDI+ status: {0}]", status);
                throw new UnauthorizedAccessException(msg);
            case Status.UnknownImageFormat:
                msg = Locale.GetText("Either the image format is unknown or you don't have the required libraries to decode this format [GDI+ status: {0}]", status);
                throw new NotSupportedException(msg);
            case Status.NotImplemented:
                msg = Locale.GetText("The requested feature is not implemented [GDI+ status: {0}]", status);
                throw new NotImplementedException(msg);
            case Status.WrongState:
                msg = Locale.GetText("Object is not in a state that can allow this operation [GDI+ status: {0}]", status);
                throw new ArgumentException(msg);
            case Status.FontFamilyNotFound:
                msg = Locale.GetText("The requested FontFamily could not be found [GDI+ status: {0}]", status);
                throw new ArgumentException(msg);
            case Status.ValueOverflow:
                msg = Locale.GetText("Argument is out of range [GDI+ status: {0}]", status);
                throw new OverflowException(msg);
            case Status.Win32Error:
                msg = Locale.GetText("The operation is invalid [GDI+ status: {0}]", status);
                throw new InvalidOperationException(msg);
            default:
                msg = Locale.GetText("Unknown Error [GDI+ status: {0}]", status);
                throw new Exception(msg);
        }
    }

    // Memory functions
    public static /* internal */   GdipAlloc(size: int): IntPtr {
        throw new NotImplementedException('');
    }
    public static /* internal */   GdipFree(ptr: IntPtr): void {
        throw new NotImplementedException('');
    }


    // Brush functions
    public static /* internal */   GdipCloneBrush(brush: IntPtr, clonedBrush: Out<IntPtr>): Status {
        throw new NotImplementedException('');
    }
    public static /* internal */   GdipDeleteBrush(brush: IntPtr): Status {
        throw new NotImplementedException('');
    }
    public static /* internal */   GdipGetBrushType(brush: IntPtr, type: Out<BrushType>): Status {
        throw new NotImplementedException('');
    }


    // Region functions
    public static /* internal */   GdipCreateRegion(region: Out<IntPtr>): Status {
        throw new NotImplementedException('');
    }
    public static /* internal */   GdipCreateRegionRgnData(data: ByteArray, size: int, region: Out<IntPtr>): Status {
        throw new NotImplementedException('');
    }
    public static /* internal */   GdipDeleteRegion(region: IntPtr): Status {
        throw new NotImplementedException('');
    }
    public static /* internal */   GdipCloneRegion(region: IntPtr, cloned: Out<IntPtr>): Status {
        throw new NotImplementedException('');
    }
    public static /* internal */   GdipCreateRegionRect(rect: Out<CGRectangle>, region: Out<IntPtr>): Status {
        throw new NotImplementedException('');
    }
    public static /* internal */   GdipCreateRegionRectI(rect: Out<CGRectangle>, region: Out<IntPtr>): Status {
        throw new NotImplementedException('');
    }
    public static /* internal */   GdipCreateRegionPath(path: IntPtr, region: Out<IntPtr>): Status {
        throw new NotImplementedException('');
    }
    public static /* internal */   GdipTranslateRegion(region: IntPtr, dx: float, dy: float): Status {
        throw new NotImplementedException('');
    }
    public static /* internal */   GdipTranslateRegionI(region: IntPtr, dx: int, dy: int): Status {
        throw new NotImplementedException('');
    }
    public static /* internal */   GdipIsVisibleRegionPoint(region: IntPtr, x: float, y: float, graphics: IntPtr, result: Out<boolean>): Status {
        throw new NotImplementedException('');
    }
    public static /* internal */   GdipIsVisibleRegionPointI(region: IntPtr, x: int, y: int, graphics: IntPtr, result: Out<boolean>): Status {
        throw new NotImplementedException('');
    }
    public static /* internal */   GdipIsVisibleRegionRect(region: IntPtr, x: float, y: float, width: float, height: float, graphics: IntPtr, result: Out<boolean>): Status {
        throw new NotImplementedException('');
    }
    public static /* internal */    GdipIsVisibleRegionRectI(region: IntPtr, x: int, y: int, width: int, height: int, graphics: IntPtr, result: Out<boolean>): Status {
        throw new NotImplementedException('');
    }
    public static /* internal */   GdipCombineRegionRect(region: IntPtr, rect: Out<CGRectangle>, combineMode: CombineMode): Status {
        throw new NotImplementedException('');
    }
    public static /* internal */   GdipCombineRegionRectI(region: IntPtr, rect: Out<CGRectangle>, combineMode: CombineMode): Status {
        throw new NotImplementedException('');
    }
    public static /* internal */   GdipCombineRegionPath(region: IntPtr, path: IntPtr, combineMode: CombineMode): Status {
        throw new NotImplementedException('');
    }
    public static /* internal */   GdipGetRegionBounds(region: IntPtr, graphics: IntPtr, rect: Out<CGRectangle>): Status {
        throw new NotImplementedException('');
    }
    public static /* internal */   GdipSetInfinite(region: IntPtr): Status {
        throw new NotImplementedException('');
    }
    public static /* internal */   GdipSetEmpty(region: IntPtr): Status {
        throw new NotImplementedException('');
    }
    public static /* internal */   GdipIsEmptyRegion(region: IntPtr, graphics: IntPtr, result: Out<boolean>): Status {
        throw new NotImplementedException('');
    }
    public static /* internal */   GdipIsInfiniteRegion(region: IntPtr, graphics: IntPtr, result: Out<boolean>): Status {
        throw new NotImplementedException('');
    }
    public static /* internal */   GdipCombineRegionRegion(region: IntPtr, region2: IntPtr, combineMode: CombineMode): Status {
        throw new NotImplementedException('');
    }
    public static /* internal */   GdipIsEqualRegion(region: IntPtr, region2: IntPtr, graphics: IntPtr, result: Out<boolean>): Status {
        throw new NotImplementedException('');
    }

    public /* internal */ static GdipCloneBitmapArea(x: float, y: float, width: float, height: float, format: PixelFormat, original: IntPtr, bitmap: Out<IntPtr>): Status {
        throw new NotImplementedException('');
    }

    // Image functions
    public /* internal */ static GdipLoadImageFromFile(filename: string, image: Out<IntPtr>): Status {
        //throw new NotImplementedException('');
        const img = new CGImage(filename);
        image.value = GDIPlus.ImageHandleTable.CreateHandle(img);
        if (image.value != null) {
            return Status.Ok;
        } else {
            return Status.GenericError;
        }
    }

    // Stream functions for Win32 (original Win32 ones)
    public /* internal */ static GdipLoadImageFromStream(stream: Stream, image: Out<IntPtr>): Status {
        throw new NotImplementedException('');
    }

    public /* internal */ static GdipSaveImageToStream(image: IntPtr, stream: Stream, clsidEncoder: Out<Guid>, encoderParams: IntPtr): Status {
        throw new NotImplementedException('');
    }

    public /* internal */ static GdipCloneImage(image: IntPtr, imageclone: Out<IntPtr>): Status {
        throw new NotImplementedException('');
    }

    public /* internal */ static GdipLoadImageFromFileICM(filename: string, image: IntPtr): Status {
        throw new NotImplementedException('');
    }

    public /* internal */ static GdipCreateBitmapFromHBITMAP(hBitMap: IntPtr, gdiPalette: IntPtr, image: Out<IntPtr>): Status {
        throw new NotImplementedException('');
    }

    public /* internal */ static GdipDisposeImage(image: IntPtr): Status {
        throw new NotImplementedException('');
    }

    public /* internal */ static GdipGetImageFlags(image: IntPtr, flag: Out<int>): Status {
        throw new NotImplementedException('');
    }

    public /* internal */ static GdipGetImageType(image: IntPtr, type: Out<ImageType>): Status {
        // throw new NotImplementedException('');
        type.value = ImageType.Bitmap;
        return Status.Ok;
    }

    public /* internal */ static GdipImageGetFrameDimensionsCount(image: IntPtr, count: Out<uint>): Status {
        throw new NotImplementedException('');
    }

    public/* internal */ static GdipImageGetFrameDimensionsList(image: IntPtr, dimensionIDs: Guid[], count: uint): Status {
        throw new NotImplementedException('');
    }

    public /* internal */ static GdipGetImageHeight(image: IntPtr, height: Out<uint>): Status {
        //throw new NotImplementedException('');
        const img = GDIPlus.ImageHandleTable.GetImage(image);
        if (img != null) {
            height.value = img.Height;
            return Status.Ok;
        } else {
            return Status.NativeImageNotFound;
        }
    }

    public /* internal */ static GdipGetImageHorizontalResolution(image: IntPtr, resolution: Out<float>): Status {
        throw new NotImplementedException('');
    }

    public/* internal */ static GdipGetImagePaletteSize(image: IntPtr, size: Out<int>): Status {
        //throw new NotImplementedException('');
        const img = GDIPlus.ImageHandleTable.GetImage(image);
        if (img != null) {
            const colorThief = new ColorThief();
            size.value =  colorThief.GetPalette(img).length;
            return Status.Ok;
        } else {
            return Status.NativeImageNotFound;
        }
    }

    public /* internal */ static GdipGetImagePalette(image: IntPtr, palette: IntPtr, size: int): Status {
        const img = GDIPlus.ImageHandleTable.GetImage(image);
        if (img != null) {
            const colorThief = new ColorThief();
            const buffer: TBuffer =Marshal.GetBufferFromPointer(palette);
            buffer.writeInt32(1); // flag
            buffer.writeInt32(size); // sieof palette

            const imagePalette = colorThief.GetPalette(img);
            for (let i = 0; i < imagePalette.length; i++) {
                for (let j = 0; j < imagePalette[i].length; j++) {
                    buffer.writeUint8(imagePalette[i][j]);
                }
            }
            return Status.Ok;
        } else {
            return Status.NativeImageNotFound;
        }
    }

    public /* internal */ static GdipSetImagePalette(image: IntPtr, palette: IntPtr): Status {
        throw new NotImplementedException('');
    }

    public /* internal */ static GdipGetImageDimension(image: IntPtr, width: Out<float>, height: Out<float>): Status {
        throw new NotImplementedException('');
    }

    public/* internal */ static GdipGetImagePixelFormat(image: IntPtr, format: Out<PixelFormat>): Status {
        //throw new NotImplementedException('');
        format.value = PixelFormat.Format32bppArgb;
        return Status.Ok;
    }

    public static GdipGetPropertyCount(image: IntPtr, propNumbers: Out<uint>): Status {
        throw new NotImplementedException('');
    }

    public /* internal */ static GdipGetPropertyIdList(image: IntPtr, propNumbers: uint, list: IntArray): Status {
        throw new NotImplementedException('');
    }

    public /* internal */ static GdipGetPropertySize(image: IntPtr, bufferSize: Out<int>, propNumbers: Out<int>): Status {
        throw new NotImplementedException('');
    }

    public /* internal */ static GdipGetAllPropertyItems(image: IntPtr, bufferSize: int, propNumbers: int, items: IntPtr): Status {
        throw new NotImplementedException('');
    }

    public /* internal */ static GdipGetImageRawFormat(image: IntPtr, format: Out<Guid>): Status {
        throw new NotImplementedException('');
    }

    public /* internal */ static GdipGetImageVerticalResolution(image: IntPtr, resolution: Out<float>): Status {
        throw new NotImplementedException('');
    }
    public /* internal */ static GdipGetImageWidth(image: IntPtr, width: Out<uint>): Status {
        //throw new NotImplementedException('');

        const img = GDIPlus.ImageHandleTable.GetImage(image);
        if (img != null) {
            width.value = img.Width;
            return Status.Ok;
        } else {
            return Status.NativeImageNotFound;
        }


    }
    public /* internal */ static GdipGetImageBounds(image: IntPtr, source: Out<CGRectangle>, unit: Out<GraphicsUnit>): Status {
        throw new NotImplementedException('');
    }
    public /* internal */ static GdipGetEncoderParameterListSize(image: IntPtr, encoder: Out<Guid>, size: Out<uint>): Status {
        throw new NotImplementedException('');
    }
    public /* internal */ static GdipGetEncoderParameterList(image: IntPtr, encoder: Out<Guid>, size: uint, buffer: IntPtr): Status {
        throw new NotImplementedException('');
    }
    public /* internal */ static GdipImageGetFrameCount(image: IntPtr, guidDimension: Out<Guid>, count: Out<uint>): Status {
        throw new NotImplementedException('');
    }
    public /* internal */ static GdipImageSelectActiveFrame(image: IntPtr, guidDimension: Out<Guid>, frameIndex: int): Status {
        throw new NotImplementedException('');
    }
    public /* internal */ static GdipGetPropertyItemSize(image: IntPtr, propertyID: int, propertySize: Out<int>): Status {
        throw new NotImplementedException('');
    }
    public /* internal */ static GdipGetPropertyItem(image: IntPtr, propertyID: int, propertySize: int, buffer: IntPtr): Status {
        throw new NotImplementedException('');
    }
    public /* internal */ static GdipRemovePropertyItem(image: IntPtr, propertyId: int): Status {
        throw new NotImplementedException('');
    }
    public /* internal */ static GdipSetPropertyItem(image: IntPtr, propertyItem: GdipPropertyItem): Status {
        throw new NotImplementedException('');
    }
    public /* internal */ static GdipGetImageThumbnail(image: IntPtr, width: uint, height: uint, thumbImage: Out<IntPtr>, callback: IntPtr, callBackData: IntPtr): Status {
        throw new NotImplementedException('');
    }
    public /* internal */ static GdipImageRotateFlip(image: IntPtr, rotateFlipType: RotateFlipType): Status {
        throw new NotImplementedException('');
    }
    public /* internal */ static GdipSaveImageToFile(image: IntPtr, filename: string, encoderClsID: Out<Guid>, encoderParameters: IntPtr): Status {
        throw new NotImplementedException('');
    }
    public /* internal */ static GdipSaveAdd(image: IntPtr, encoderParameters: IntPtr): Status {
        throw new NotImplementedException('');
    }
    public /* internal */ static GdipSaveAddImage(image: IntPtr, imagenew: IntPtr, encoderParameters: IntPtr): Status {
        throw new NotImplementedException('');
    }
    public /* internal */ static GdipDrawImageI(graphics: IntPtr, image: IntPtr, x: int, y: int): Status {
        // throw new NotImplementedException('');
        const context = GraphicsHandleTable.Default.GetGraphics(graphics);
        if (context != null) {
            const img = GDIPlus.ImageHandleTable.GetImage(image);
            if (img != null) {
                context.drawImage(img.canvas, 0, 0, img.Width, img.Height, x, y, img.Width, img.Height);
                return Status.Ok;
            } else {
                return Status.NativeImageNotFound;
            }
        } else {
            return Status.NativeContext2DNotFound;
        }
        return Status.NotImplemented;
    }
    public /* internal */ static GdipGetImageGraphicsContext(image: IntPtr, graphics: Out<IntPtr>): Status {
        //throw new NotImplementedException('');
        const img = GDIPlus.ImageHandleTable.GetImage(image);
        if (img != null) {
            const rendererContext = new CGContext2D(img.getContext());
            graphics.value = GraphicsHandleTable.Default.CreateHandle(rendererContext);
            return Status.Ok;
        }
        return Status.GenericError;
    }
    public /* internal */ static GdipDrawImage(graphics: IntPtr, image: IntPtr, x: float, y: float): Status {
        throw new NotImplementedException('');
    }
    public /* internal */ static GdipBeginContainer(graphics: IntPtr, dstrect: Out<CGRectangle>, srcrect: Out<CGRectangle>, unit: GraphicsUnit, state: Out<uint>): Status {
        throw new NotImplementedException('');
    }
    public /* internal */ static GdipBeginContainerI(graphics: IntPtr, dstrect: Out<CGRectangle>, srcrect: Out<CGRectangle>, unit: GraphicsUnit, state: Out<uint>): Status {
        throw new NotImplementedException('');
    }
    public /* internal */ static GdipBeginContainer2(graphics: IntPtr, state: Out<uint>): Status {
        throw new NotImplementedException('');
    }
    public /* internal */ static GdipDrawImagePoints(graphics: IntPtr, image: IntPtr, destPoints: CGPoint[], count: int): Status {
        throw new NotImplementedException('');
    }
    public /* internal */ static GdipDrawImagePointsI(graphics: IntPtr, image: IntPtr, destPoints: CGPoint[], count: int): Status {
        throw new NotImplementedException('');
    }
    public /* internal */ static GdipDrawImageRectRectI(graphics: IntPtr, image: IntPtr, dstx: int, dsty: int, dstwidth: int, dstheight: int, srcx: int, srcy: int, srcwidth: int, srcheight: int, srcUnit: GraphicsUnit,
        imageattr: IntPtr, callback: DrawImageAbort, callbackData: IntPtr): Status {
        throw new NotImplementedException('');
    }
    public /* internal */ static GdipDrawImageRectRect(graphics: IntPtr, image: IntPtr, dstx: float, dsty: float, dstwidth: float, dstheight: float, srcx: float, srcy: float, srcwidth: float, srcheight: float, srcUnit: GraphicsUnit, imageattr: IntPtr, callback: DrawImageAbort, callbackData: IntPtr): Status {
        throw new NotImplementedException('');
    }
    public /* internal */ static GdipDrawImagePointsRectI(graphics: IntPtr, image: IntPtr, destPoints: CGPoint, count: int, srcx: int, srcy: int, srcwidth: int, srcheight: int, srcUnit: GraphicsUnit, imageattr: IntPtr, callback: DrawImageAbort, callbackData: IntPtr): Status {
        throw new NotImplementedException('');
    }
    public /* internal */ static GdipDrawImagePointsRect(graphics: IntPtr, image: IntPtr, destPoints: CGPoint[], count: int, srcx: float, srcy: float, srcwidth: float, srcheight: float, srcUnit: GraphicsUnit, imageattr: IntPtr, callback: DrawImageAbort, callbackData: IntPtr): Status {
        throw new NotImplementedException('');
    }
    public /* internal */ static GdipDrawImageRect(graphics: IntPtr, image: IntPtr, x: float, y: float, width: float, height: float): Status {
        // throw new NotImplementedException('');
        const context = GraphicsHandleTable.Default.GetGraphics(graphics);
        if (context != null) {
            const img = GDIPlus.ImageHandleTable.GetImage(image);
            if (img != null) {
                context.drawImage(img.canvas, 0, 0, img.Width, img.Height, x, y, width, height);
                return Status.Ok;
            } else {
                return Status.NativeImageNotFound;
            }
        } else {
            return Status.NativeContext2DNotFound;
        }
        return Status.NotImplemented;
    }
    public /* internal */ static GdipDrawImagePointRect(graphics: IntPtr, image: IntPtr, x: float, y: float, srcx: float, srcy: float, srcwidth: float, srcheight: float, srcUnit: GraphicsUnit): Status {
        throw new NotImplementedException('');
    }
    public /* internal */ static GdipDrawImagePointRectI(graphics: IntPtr, image: IntPtr, x: int, y: int, srcx: int, srcy: int, srcwidth: int, srcheight: int, srcUnit: GraphicsUnit): Status {
        throw new NotImplementedException('');
    }
    public /* internal */ static GdipCreateStringFormat(formatAttributes: StringFormatFlags, language: int, native: Out<IntPtr>): Status {
        throw new NotImplementedException('');
    }
    public /* internal */ static GdipCreateHBITMAPFromBitmap(bmp: IntPtr, HandleBmp: Out<IntPtr>, clrbackground: int): Status {
        throw new NotImplementedException('');
    }
    public /* internal */ static GdipCreateBitmapFromFile(filename: string, bitmap: Out<IntPtr>): Status {
        throw new NotImplementedException('');
    }
    public /* internal */ static GdipCreateBitmapFromFileICM(filename: string, bitmap: Out<IntPtr>): Status {
        throw new NotImplementedException('');
    }
    public /* internal */ static GdipCreateHICONFromBitmap(bmp: IntPtr, HandleIcon: Out<IntPtr>): Status {
        throw new NotImplementedException('');
    }
    public /* internal */ static GdipCreateBitmapFromHICON(hicon: IntPtr, bitmap: Out<IntPtr>): Status {
        throw new NotImplementedException('');
    }
    public /* internal */ static GdipCreateBitmapFromResource(hInstance: IntPtr, lpBitmapName: string, bitmap: Out<IntPtr>): Status {
        throw new NotImplementedException('');
    }

    public static /* internal */   GdipGetImageDecodersSize(decoderNums: Out<int>, arraySize: Out<int>): Status {
        throw new NotImplementedException('');
    }
    public static /* internal */   GdipGetImageDecoders(decoderNums: int, arraySize: int, decoders: IntPtr): Status {
        throw new NotImplementedException('');
    }
    public static /* internal */   GdipGetImageEncodersSize(encoderNums: Out<int>, arraySize: Out<int>): Status {
        throw new NotImplementedException('');
    }
    public static /* internal */   GdipGetImageEncoders(encoderNums: int, arraySize: int, encoders: IntPtr): Status {
        throw new NotImplementedException('');
    }

    // Bitmap functions
    public /* internal */ static GdipCreateBitmapFromScan0(width: int, height: int, stride: int, format: PixelFormat, scan0: IntPtr, bmp: Out<IntPtr>): Status {
        // throw new NotImplementedException('');
        const img = new CGImage(width, height);
        bmp.value = GDIPlus.ImageHandleTable.CreateHandle(img);
        if (bmp.value != null) {
            return Status.Ok;
        } else {
            return Status.GenericError;
        }
    }
    public /* internal */ static GdipCreateBitmapFromGraphics(width: int, height: int, target: IntPtr, bitmap: Out<IntPtr>): Status {
        throw new NotImplementedException('');
    }
    public /* internal */ static GdipBitmapLockBits(bmp: IntPtr, rc: Out<CGRectangle>, flags: ImageLockMode, format: PixelFormat, bmpData: BitmapData): Status {
        throw new NotImplementedException('');
    }
    public /* internal */ static GdipBitmapSetResolution(bmp: IntPtr, xdpi: float, ydpi: float): Status {
        throw new NotImplementedException('');
    }
    public /* internal */ static GdipBitmapUnlockBits(bmp: IntPtr, bmpData: BitmapData): Status {
        throw new NotImplementedException('');
    }
    public /* internal */ static GdipBitmapGetPixel(bmp: IntPtr, x: int, y: int, argb: Out<int>): Status {
        throw new NotImplementedException('');
    }
    public /* internal */ static GdipBitmapSetPixel(bmp: IntPtr, x: int, y: int, argb: int): Status {
        throw new NotImplementedException('');
    }
}

//
// These are stuff that is unix-only
//
export class StreamGetHeaderDelegate extends Delegate<(buf: IntPtr, bufsz: int) => int> { };
export class StreamGetBytesDelegate extends Delegate<(buf: IntPtr, bufsz: int, peek: boolean) => int> { }
export class StreamSeekDelegate extends Delegate<(offset: int, whence: int) => int /* long */>{ };
export class StreamPutBytesDelegate extends Delegate<(buf: IntPtr, bufsz: int) => int>{ };
export class StreamCloseDelegate extends Delegate<() => void>{ };
export class StreamSizeDelegate extends Delegate<() => int/* long */>{ };

export class GdiPlusStreamHelper {
    public stream: Stream = null as any;

    private sghd: StreamGetHeaderDelegate = null as any;
    private sgbd: StreamGetBytesDelegate = null as any;
    private skd: StreamSeekDelegate = null as any;
    private spbd: StreamPutBytesDelegate = null as any;
    private scd: StreamCloseDelegate = null as any;
    private ssd: StreamSizeDelegate = null as any;
    private start_buf: ByteArray = null as any;
    private start_buf_pos: int = 0;
    private start_buf_len: int = 0;
    private managedBuf: ByteArray = null as any;
    private static readonly default_bufsize: int = 4096;

    public constructor(s: Stream, seekToOrigin: boolean) {
        this.managedBuf = New.ByteArray(GdiPlusStreamHelper.default_bufsize);

        this.stream = s;
        if (this.stream != null && this.stream.CanSeek && seekToOrigin) {
            this.stream.Seek(0, SeekOrigin.Begin);
        }
    }

    public StreamGetHeaderImpl(buf: IntPtr, bufsz: int): int {
        let bytesRead: int;

        this.start_buf = New.ByteArray(bufsz);

        try {
            bytesRead = this.stream.Read(this.start_buf, 0, bufsz);
        } catch (e) {
            return -1;
        }

        if (bytesRead > 0 && buf != IntPtr.Zero) {
            Marshal.Copy(this.start_buf, 0, new IntPtr(buf.ToInt64()), bytesRead);
        }

        this.start_buf_pos = 0;
        this.start_buf_len = bytesRead;

        return bytesRead;
    }

    public get GetHeaderDelegate(): StreamGetHeaderDelegate {
        if (this.stream != null && this.stream.CanRead) {
            if (this.sghd == null) {
                this.sghd = new StreamGetHeaderDelegate(this.StreamGetHeaderImpl);
            }
            return this.sghd;
        }
        return null as any;
    }

    public StreamGetBytesImpl(buf: IntPtr, bufsz: int, peek: boolean): int {
        if (buf === IntPtr.Zero && peek) {
            return -1;
        }

        if (bufsz > this.managedBuf.length)
            this.managedBuf = New.ByteArray(bufsz);
        let bytesRead: int = 0;
        let streamPosition: int /* long */ = 0;

        if (bufsz > 0) {
            if (this.stream.CanSeek) {
                streamPosition = this.stream.Position;
            }
            if (this.start_buf_len > 0) {
                if (this.start_buf_len > bufsz) {
                    TArray.Copy(this.start_buf, this.start_buf_pos, this.managedBuf, 0, bufsz);
                    this.start_buf_pos += bufsz;
                    this.start_buf_len -= bufsz;
                    bytesRead = bufsz;
                    bufsz = 0;
                } else {
                    // this is easy
                    TArray.Copy(this.start_buf, this.start_buf_pos, this.managedBuf, 0, this.start_buf_len);
                    bufsz -= this.start_buf_len;
                    bytesRead = this.start_buf_len;
                    this.start_buf_len = 0;
                }
            }

            if (bufsz > 0) {
                try {
                    bytesRead += this.stream.Read(this.managedBuf, bytesRead, bufsz);
                } catch (IOException) {
                    return -1;
                }
            }

            if (bytesRead > 0 && buf != IntPtr.Zero) {
                Marshal.Copy(this.managedBuf, 0, new IntPtr(buf.ToInt64()), bytesRead);
            }

            if (!this.stream.CanSeek && (bufsz === 10) && peek) {
                // Special 'hack' to support peeking of the type for gdi+ on non-seekable streams
            }

            if (peek) {
                if (this.stream.CanSeek) {
                    // If we are peeking bytes, then go back to original position before peeking
                    this.stream.Seek(streamPosition, SeekOrigin.Begin);
                } else {
                    throw new NotSupportedException('');
                }
            }
        }

        return bytesRead;
    }

    public get GetBytesDelegate(): StreamGetBytesDelegate {
        if (this.stream != null && this.stream.CanRead) {
            if (this.sgbd == null) {
                this.sgbd = new StreamGetBytesDelegate(this.StreamGetBytesImpl);
            }
            return this.sgbd;
        }
        return null as any;
    }

    public StreamSeekImpl(offset: int, whence: int): int /* long */ {
        // Make sure we have a valid 'whence'.
        if ((whence < 0) || (whence > 2))
            return -1;

        // Invalidate the start_buf if we're actually going to call a Seek method.
        this.start_buf_pos += this.start_buf_len;
        this.start_buf_len = 0;

        let origin: SeekOrigin;

        // Translate 'whence' into a SeekOrigin enum member.
        switch (whence) {
            case 0: origin = SeekOrigin.Begin; break;
            case 1: origin = SeekOrigin.Current; break;
            case 2: origin = SeekOrigin.End; break;

            // The following line is redundant but necessary to avoid a
            // "Use of unassigned local variable" error without actually
            // initializing 'origin' to a dummy value.
            default: return -1;
        }

        // Do the actual seek operation and return its result.
        return this.stream.Seek(offset, origin);
    }

    public get SeekDelegate(): StreamSeekDelegate {
        if (this.stream != null && this.stream.CanSeek) {
            if (this.skd == null) {
                this.skd = new StreamSeekDelegate(this.StreamSeekImpl);
            }
            return this.skd;
        }
        return null as any;
    }

    public StreamPutBytesImpl(buf: IntPtr, bufsz: int): int {
        if (bufsz > this.managedBuf.length)
            this.managedBuf = New.ByteArray(bufsz);
        Marshal.Copy(buf, this.managedBuf, 0, bufsz);
        this.stream.Write(this.managedBuf, 0, bufsz);
        return bufsz;
    }

    public get PutBytesDelegate(): StreamPutBytesDelegate {
        if (this.stream != null && this.stream.CanWrite) {
            if (this.spbd == null) {
                this.spbd = new StreamPutBytesDelegate(this.StreamPutBytesImpl);
            }
            return this.spbd;
        }
        return null as any;
    }

    public StreamCloseImpl(): void {
        this.stream.Close();
    }

    public get CloseDelegate(): StreamCloseDelegate {
        if (this.stream != null) {
            if (this.scd == null) {
                this.scd = new StreamCloseDelegate(this.StreamCloseImpl);
            }
            return this.scd;
        }
        return null as any;
    }

    public StreamSizeImpl(): int /* long */ {
        try {
            return this.stream.Length;
        } catch {
            return -1;
        }
    }

    public get SizeDelegate(): StreamSizeDelegate {
        if (this.stream != null) {
            if (this.ssd == null) {
                this.ssd = new StreamSizeDelegate(this.StreamSizeImpl);
            }
            return this.ssd;
        }
        return null as any;
    }




}

GDIPlus.StaticConstructor();