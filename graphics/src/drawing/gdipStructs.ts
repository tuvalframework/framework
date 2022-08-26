import { UMP, GUID, LONG, IntPtr, New, Marshal, int } from '@tuval/core';
import { ImageCodecInfo } from './imaging/ImageCodecInfo';
import { PropertyItem } from './imaging/PropertyItem';
export class GdipEncoderParameter extends UMP {
    @GUID guid;
    @LONG numberOfValues;
    @LONG type;
    @LONG value;
}

export class GdiplusStartupInput extends UMP {
    // internalted to silent compiler
    @LONG GdiplusVersion;
    @LONG DebugEventCallback;
    @LONG SuppressBackgroundThread;
    @LONG SuppressExternalCodecs;

    public static MakeGdiplusStartupInput(): GdiplusStartupInput {
        const result: GdiplusStartupInput = new GdiplusStartupInput();
        result.GdiplusVersion = 1;
        result.DebugEventCallback = IntPtr.Zero;
        result.SuppressBackgroundThread = 0;
        result.SuppressExternalCodecs = 0;
        return result;
    }
}

export class GdiplusStartupOutput extends UMP {
    @LONG NotificationHook;
    @LONG NotificationUnhook;

    public static MakeGdiplusStartupOutput(): GdiplusStartupOutput {
        const result: GdiplusStartupOutput = new GdiplusStartupOutput();
        result.NotificationHook = result.NotificationUnhook = IntPtr.Zero;
        return result;
    }
}

export class GdipPropertyItem extends UMP {
    @LONG/* int */ id;
    @LONG/* int */ len;
    @LONG/* short */ type;
    @LONG/* IntPtr */ value;

    /* internal */ static MarshalTo(gdipProp: GdipPropertyItem, prop: PropertyItem): void {
        prop.Id = gdipProp.id;
        prop.Len = gdipProp.len;
        prop.Type = gdipProp.type;
        prop.Value = New.ByteArray(gdipProp.len);
        Marshal.Copy(gdipProp.value, prop.Value, 0, gdipProp.len);
    }
}

export class/* internal */  GdipImageCodecInfo extends UMP	/*Size 76 bytes*/ {
    @GUID/* Guid */ Clsid;
    @LONG/* Guid */ FormatID;
    @LONG/* IntPtr */ CodecName;
    @LONG/* IntPtr */ DllName;
    @LONG/* IntPtr */ FormatDescription;
    @LONG/* IntPtr */ FilenameExtension;
    @LONG/* IntPtr */ MimeType;
    @LONG Flags;
    @LONG Version;
    @LONG SigCount;
    @LONG SigSize;
    @LONG SigPattern;
    @LONG SigMask;

    public /* internal */ static MarshalTo(gdipcodec: GdipImageCodecInfo, codec: ImageCodecInfo): void {
        codec.CodecName = Marshal.PtrToStringUni(gdipcodec.CodecName);
        codec.DllName = Marshal.PtrToStringUni(gdipcodec.DllName);
        codec.FormatDescription = Marshal.PtrToStringUni(gdipcodec.FormatDescription);
        codec.FilenameExtension = Marshal.PtrToStringUni(gdipcodec.FilenameExtension);
        codec.MimeType = Marshal.PtrToStringUni(gdipcodec.MimeType);
        codec.Clsid = gdipcodec.Clsid;
        codec.FormatID = gdipcodec.FormatID;
        codec.Flags = gdipcodec.Flags;
        codec.Version = gdipcodec.Version;
        codec.SignatureMasks = New.Array(gdipcodec.SigCount);
        codec.SignaturePatterns = New.Array(gdipcodec.SigCount);
        let p: IntPtr = gdipcodec.SigPattern;
        let m: IntPtr = gdipcodec.SigMask;
        for (let i: int = 0; i < gdipcodec.SigCount; i++) {
            codec.SignatureMasks[i] = New.ByteArray(gdipcodec.SigSize);
            Marshal.Copy(m, codec.SignatureMasks[i], 0, gdipcodec.SigSize);
            m = new IntPtr(m.ToInt64() + gdipcodec.SigSize);
            codec.SignaturePatterns[i] = New.ByteArray(gdipcodec.SigSize);
            Marshal.Copy(p, codec.SignaturePatterns[i], 0, gdipcodec.SigSize);
            p = new IntPtr(p.ToInt64() + gdipcodec.SigSize);
        }
    }
}

export class GdiColorPalette extends UMP {
    @LONG/* internal */ /* int */ Flags;             // Palette flags
    @LONG/* internal */ /* int */ Count;             // Number of color entries
}