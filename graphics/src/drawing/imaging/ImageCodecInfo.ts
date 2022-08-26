import { ByteArray, int, Guid, IntPtr, New, Out, Marshal, typeOf } from '@tuval/core';
import { Status } from '../gdipEnums';
import { GDIPlus } from '../GDIPlus';
import { GdipImageCodecInfo } from '../gdipStructs';
import { ImageCodecFlags } from './ImageCodecFlags';

export class ImageCodecInfo {
    private clsid: Guid = null as any;
    private codecName: string = '';
    private dllName: string = '';
    private filenameExtension: string = '';
    private flags: ImageCodecFlags = 0;
    private formatDescription: string = '';
    private formatID: Guid = null as any;
    private mimeType: string = '';
    private signatureMasks: ByteArray[] = null as any;
    private signaturePatterns: ByteArray[] = null as any;
    private version: int = 0;

    public /* internal */ constructor() {
    }

    // methods
    public static GetImageDecoders(): ImageCodecInfo[] {
        let decoderNums: Out<int> = New.Out(0);
        let arraySize: Out<int> = New.Out(0);
        let decoder_size: int;
        let decoders: IntPtr;
        let decoder_ptr: IntPtr;
        let result: ImageCodecInfo[];
        let gdipdecoder: GdipImageCodecInfo = new GdipImageCodecInfo();
        let status: Status;

        status = GDIPlus.GdipGetImageDecodersSize(decoderNums, arraySize);
        GDIPlus.CheckStatus(status);

        result = New.Array(decoderNums.value);

        if (decoderNums.value === 0)
            return result;

        /* Get decoders list*/
        decoders = Marshal.AllocHGlobal(arraySize.value);
        try {
            status = GDIPlus.GdipGetImageDecoders(decoderNums.value, arraySize.value, decoders);
            GDIPlus.CheckStatus(status);

            decoder_size = Marshal.SizeOf(gdipdecoder);
            decoder_ptr = decoders;

            for (let i: int = 0; i < decoderNums.value; i++, decoder_ptr = new IntPtr(decoder_ptr.ToInt64() + decoder_size)) {
                gdipdecoder = Marshal.PtrToStructure<GdipImageCodecInfo>(decoder_ptr, typeOf(GdipImageCodecInfo));
                result[i] = new ImageCodecInfo();
                GdipImageCodecInfo.MarshalTo(gdipdecoder, result[i]);
            }
        }
        finally {
            Marshal.FreeHGlobal(decoders);
        }
        return result;
    }


    public static GetImageEncoders(): ImageCodecInfo[] {
        let encoderNums: Out<int> = New.Out(0), arraySize: Out<int> = New.Out(0), encoder_size: int = 0;
        let encoders: IntPtr, encoder_ptr: IntPtr;
        let result: ImageCodecInfo[];
        let gdipencoder: GdipImageCodecInfo = new GdipImageCodecInfo();
        let status: Status;

        status = GDIPlus.GdipGetImageEncodersSize(encoderNums, arraySize);
        GDIPlus.CheckStatus(status);

        result = New.Array(encoderNums.value);

        if (encoderNums.value === 0)
            return result;

        /* Get encoders list*/
        encoders = Marshal.AllocHGlobal(arraySize.value);
        try {
            status = GDIPlus.GdipGetImageEncoders(encoderNums.value, arraySize.value, encoders);
            GDIPlus.CheckStatus(status);

            encoder_size = Marshal.SizeOf(gdipencoder);
            encoder_ptr = encoders;

            for (let i: int = 0; i < encoderNums.value; i++, encoder_ptr = new IntPtr(encoder_ptr.ToInt64() + encoder_size)) {
                gdipencoder = Marshal.PtrToStructure(encoder_ptr, typeOf(GdipImageCodecInfo));
                result[i] = new ImageCodecInfo();
                GdipImageCodecInfo.MarshalTo(gdipencoder, result[i]);
            }
        }
        finally {
            Marshal.FreeHGlobal(encoders);
        }
        return result;
    }

    // properties

    public get Clsid(): Guid {
        return this.clsid;
    }
    public set Clsid(value: Guid) {
        this.clsid = value;
    }


    public get CodecName(): string {
        return this.codecName;
    }
    public set CodecName(value: string) {
        this.codecName = value;
    }


    public get DllName(): string {
        return this.dllName;
    }
    public set DllName(value: string) {
        this.dllName = value;
    }


    public get FilenameExtension(): string {
        return this.filenameExtension;
    }
    public set FilenameExtension(value: string) {
        this.filenameExtension = value;
    }


    public get Flags(): ImageCodecFlags {
        return this.flags;
    }
    public set Flags(value: ImageCodecFlags) {
        this.flags = value;
    }


    public get FormatDescription(): string {
        return this.formatDescription;
    }
    public set FormatDescription(value: string) {
        this.formatDescription = value;
    }


    public get FormatID(): Guid {
        return this.formatID;
    }
    public set FormatID(value: Guid) {
        this.formatID = value;
    }


    public get MimeType(): string {
        return this.mimeType;
    }
    public set MimeType(value: string) {
        this.mimeType = value;
    }



    public get SignatureMasks(): ByteArray[] {
        return this.signatureMasks;
    }
    public set SignatureMasks(value: ByteArray[]) {
        this.signatureMasks = value;
    }

    public get SignaturePatterns(): ByteArray[] {
        return this.signaturePatterns;
    }
    public set SignaturePatterns(value: ByteArray[]) {
        this.signaturePatterns = value;
    }

    public get Version(): int {
        return this.version;
    }
    public set Version(value: int) {
        this.version = value;
    }
}