import { IDisposable, int, IntPtr, Marshal, typeOf, Convert, uint, System, Type } from '@tuval/core';
import { GdipEncoderParameter } from '../gdipStructs';
import { Encoder } from './Encoder';
import { EncoderParameterValueType } from './EncoderParameterValueType';
import { GraphicTypes } from '../../GDITypes';
export class EncoderParameter implements IDisposable {

    private encoder: Encoder = null as any;
    private valuesCount: int = 0;
    private type: EncoderParameterValueType = 0;
    private valuePtr: IntPtr = null as any;

    public /* internal */ constructor() {
    }

    /* public EncoderParameter (Encoder encoder, byte value)
    {
        this.encoder = encoder;
        this.valuesCount = 1;
        this.type = EncoderParameterValueType.ValueTypeByte;
        this.valuePtr = Marshal.AllocHGlobal (1);
        Marshal.WriteByte (this.valuePtr, value);
    }

    public EncoderParameter (Encoder encoder, byte[] value)
    {
        this.encoder = encoder;
        this.valuesCount = value.Length;
        this.type = EncoderParameterValueType.ValueTypeByte;
        this.valuePtr = Marshal.AllocHGlobal (1 * valuesCount);
        Marshal.Copy (value, 0, this.valuePtr, valuesCount);
    }

    public EncoderParameter (Encoder encoder, short value)
    {
        this.encoder = encoder;
        this.valuesCount = 1;
        this.type = EncoderParameterValueType.ValueTypeShort;
        this.valuePtr = Marshal.AllocHGlobal (2);
        Marshal.WriteInt16 (this.valuePtr, value);
    }

    public EncoderParameter (Encoder encoder, short[] value)
    {
        this.encoder = encoder;
        this.valuesCount = value.Length;
        this.type = EncoderParameterValueType.ValueTypeShort;
        this.valuePtr = Marshal.AllocHGlobal (2 * valuesCount);
        Marshal.Copy (value, 0, this.valuePtr, valuesCount);
    }


    public EncoderParameter (Encoder encoder, long value)
    {
        this.encoder = encoder;
        this.valuesCount = 1;
        this.type = EncoderParameterValueType.ValueTypeLong;
        this.valuePtr = Marshal.AllocHGlobal (4);
        Marshal.WriteInt32 (this.valuePtr, (int) value);
    }

    public EncoderParameter (Encoder encoder, long[] value)
    {
        this.encoder = encoder;
        this.valuesCount = value.Length;
        this.type = EncoderParameterValueType.ValueTypeLong;
        this.valuePtr = Marshal.AllocHGlobal (4 * valuesCount);
        int [] ivals = new int[value.Length];
        for (int i = 0; i < value.Length; i++) ivals[i] = (int) value[i];
        Marshal.Copy (ivals, 0, this.valuePtr, valuesCount);
    }

    public EncoderParameter (Encoder encoder, string value)
    {
        this.encoder = encoder;

        ASCIIEncoding ascii = new ASCIIEncoding ();
        int asciiByteCount = ascii.GetByteCount (value);
        byte[] bytes = new byte [asciiByteCount];
        ascii.GetBytes (value, 0, value.Length, bytes, 0);

        this.valuesCount = bytes.Length;
        this.type = EncoderParameterValueType.ValueTypeAscii;
        this.valuePtr = Marshal.AllocHGlobal (valuesCount);
        Marshal.Copy (bytes, 0, this.valuePtr, valuesCount);
    }

    public EncoderParameter (Encoder encoder, byte value, bool undefined)
    {
        this.encoder = encoder;
        this.valuesCount = 1;
        if (undefined)
            this.type = EncoderParameterValueType.ValueTypeUndefined;
        else
            this.type = EncoderParameterValueType.ValueTypeByte;
        this.valuePtr = Marshal.AllocHGlobal (1);
        Marshal.WriteByte (this.valuePtr, value);
    }

    public EncoderParameter (Encoder encoder, byte[] value, bool undefined)
    {
        this.encoder = encoder;
        this.valuesCount = value.Length;
        if (undefined)
            this.type = EncoderParameterValueType.ValueTypeUndefined;
        else
            this.type = EncoderParameterValueType.ValueTypeByte;
        this.valuePtr = Marshal.AllocHGlobal (valuesCount);
        Marshal.Copy (value, 0, this.valuePtr, valuesCount);
    }

    public EncoderParameter (Encoder encoder, int numerator, int denominator)
    {
        this.encoder = encoder;
        this.valuesCount = 1;
        this.type = EncoderParameterValueType.ValueTypeRational;
        this.valuePtr = Marshal.AllocHGlobal (8);
        int [] valuearray = { numerator, denominator };
        Marshal.Copy (valuearray, 0, this.valuePtr, valuearray.Length);
    }

    public EncoderParameter (Encoder encoder, int[] numerator, int[] denominator)
    {
        if (numerator.Length != denominator.Length)
            throw new ArgumentException ("Invalid parameter used.");

        this.encoder = encoder;
        this.valuesCount = numerator.Length;
        this.type = EncoderParameterValueType.ValueTypeRational;
        this.valuePtr = Marshal.AllocHGlobal (4 * valuesCount * 2);
        for (int i = 0; i < valuesCount; i++) {
            Marshal.WriteInt32 (valuePtr, i * 4, (int) numerator[i]);
            Marshal.WriteInt32 (valuePtr, (i + 1) * 4, (int) denominator[i]);
        }
    }

    public EncoderParameter (Encoder encoder, long rangebegin, long rangeend)
    {
        this.encoder = encoder;
        this.valuesCount = 1;
        this.type = EncoderParameterValueType.ValueTypeLongRange;
        this.valuePtr = Marshal.AllocHGlobal (8);
        int [] valuearray = { (int) rangebegin, (int) rangeend };
        Marshal.Copy (valuearray, 0, this.valuePtr, valuearray.Length);
    }

    public EncoderParameter (Encoder encoder, long[] rangebegin, long[] rangeend)
    {
        if (rangebegin.Length != rangeend.Length)
            throw new ArgumentException ("Invalid parameter used.");

        this.encoder = encoder;
        this.valuesCount = rangebegin.Length;
        this.type = EncoderParameterValueType.ValueTypeLongRange;

        this.valuePtr = Marshal.AllocHGlobal (4 * valuesCount * 2);
        IntPtr dest = this.valuePtr;
        for (int i = 0; i < valuesCount; i++) {
            Marshal.WriteInt32 (dest, i * 4, (int) rangebegin[i]);
            Marshal.WriteInt32 (dest, (i + 1) * 4, (int) rangeend[i]);
        }
    }

    public EncoderParameter (Encoder encoder, int numberOfValues, int type, int value)
    {
        this.encoder = encoder;
        this.valuePtr = (IntPtr) value;
        this.valuesCount = numberOfValues;
        this.type = (EncoderParameterValueType) type;
    }

    public EncoderParameter (Encoder encoder, int numerator1, int denominator1, int numerator2, int denominator2)
    {
        this.encoder = encoder;
        this.valuesCount = 1;
        this.type = EncoderParameterValueType.ValueTypeRationalRange;
        this.valuePtr = Marshal.AllocHGlobal (4 * 4);
        int [] valuearray = { numerator1, denominator1, numerator2, denominator2 };
        Marshal.Copy (valuearray, 0, this.valuePtr, 4);
    }

    public EncoderParameter (Encoder encoder, int[] numerator1, int[] denominator1, int[] numerator2, int[] denominator2)
    {
        if (numerator1.Length != denominator1.Length ||
            numerator2.Length != denominator2.Length ||
            numerator1.Length != numerator2.Length)
            throw new ArgumentException ("Invalid parameter used.");

        this.encoder = encoder;
        this.valuesCount = numerator1.Length;
        this.type = EncoderParameterValueType.ValueTypeRationalRange;

        this.valuePtr = Marshal.AllocHGlobal (4 * valuesCount * 4);
        IntPtr dest = this.valuePtr;
        for (int i = 0; i < valuesCount; i++) {
            Marshal.WriteInt32 (dest, i * 4, numerator1[i]);
            Marshal.WriteInt32 (dest, (i + 1) * 4, denominator1[i]);
            Marshal.WriteInt32 (dest, (i + 2) * 4, numerator2[i]);
            Marshal.WriteInt32 (dest, (i + 3) * 4, denominator2[i]);
        }
    } */

    public get Encoder(): Encoder {
        return this.encoder;
    }

    public set Encoder(value: Encoder) {
        this.encoder = value;
    }


    public get NumberOfValues(): int {
        return this.valuesCount;
    }

    public get Type(): EncoderParameterValueType {
        return this.type;
    }

    public get ValueType(): EncoderParameterValueType {
        return this.type;
    }

    public dispose(disposing: boolean): void {
        if (this.valuePtr !== IntPtr.Zero) {
            //Marshal.FreeHGlobal(valuePtr);
            this.valuePtr = IntPtr.Zero;
        }
    }

    public Dispose(): void {
        this.dispose(true);
        //GC.SuppressFinalize(this);
    }


    public /* internal */ static NativeSize(): int {
        return Marshal.SizeOf(GdipEncoderParameter);
    }

    public /* internal */  ToNativePtr(epPtr: IntPtr): void {
        const ep: GdipEncoderParameter = new GdipEncoderParameter();
        ep.guid = this.encoder.Guid;
        ep.numberOfValues = Convert.ToUInt32(this.valuesCount);
        ep.type = this.type;
        ep.value = this.valuePtr;
        Marshal.StructureToPtr(ep, epPtr, false);
    }

    public /* internal */ static FromNativePtr(epPtr: IntPtr): EncoderParameter {
        let ep: GdipEncoderParameter;
        ep = Marshal.PtrToStructure(epPtr, typeOf(GraphicTypes.GdipEncoderParameter));

        let valType: Type;
        let valCount: uint;

        switch (ep.type) {
            case EncoderParameterValueType.ValueTypeAscii:
            case EncoderParameterValueType.ValueTypeByte:
            case EncoderParameterValueType.ValueTypeUndefined:
                valType = typeOf(System.Types.Primitives.Byte);
                valCount = ep.numberOfValues;
                break;
            case EncoderParameterValueType.ValueTypeShort:
                valType = typeOf(System.Types.Primitives.Short);
                valCount = ep.numberOfValues;
                break;
            case EncoderParameterValueType.ValueTypeLong:
                valType = typeOf(System.Types.Primitives.Int);
                valCount = ep.numberOfValues;
                break;
            case EncoderParameterValueType.ValueTypeLongRange:
            case EncoderParameterValueType.ValueTypeRational:
                valType = typeOf (System.Types.Primitives.Int);
                valCount = ep.numberOfValues * 2;
                break;
            case EncoderParameterValueType.ValueTypeRationalRange:
                valType = typeOf (System.Types.Primitives.Int);
                valCount = ep.numberOfValues * 4;
                break;
            default:
                return null as any;
        }

        const eparam: EncoderParameter = new EncoderParameter();
        eparam.encoder = new Encoder(ep.guid);
        eparam.valuesCount = Convert.ToInt32(ep.numberOfValues);
        eparam.type = ep.type;
        eparam.valuePtr = Marshal.AllocHGlobal(Convert.ToInt32(valCount * Marshal.SizeOf(valType))); // TODO:  sizeof düzelt

        /* There's nothing in Marshal to do a memcpy() between two IntPtrs.  This sucks. */
      /*   unsafe {
            byte * s = (byte *) ep.value;
            byte * d = (byte *) eparam.valuePtr;
            for (int i = 0; i < valCount * Marshal.SizeOf(valType); i++)
                * d++ = * s++;
        } */

        return eparam;
    }
}