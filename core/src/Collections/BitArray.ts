import { Convert } from "../convert";
import { Environment } from "../Environment";
import { ArgumentException } from "../Exceptions/ArgumentException";
import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { ArgumentOutOfRangeException } from "../Exceptions/ArgumentOutOfRangeException";
import { InvalidOperationException } from "../Exceptions/InvalidOperationException";
import { TArray } from "../Extensions/TArray";
import { TObject } from "../Extensions/TObject";
import { New, int, ByteArray, IntArray } from "../float";
import { ICloneable } from "../ICloneable";
import { Int32 } from "../Int32";
import { is } from "../is";
import { ClassInfo, Virtual } from "../Reflection/Decorators/ClassInfo";
import { System } from "../SystemTypes";
import { IIteratorResult } from "./enumeration_";
import { IEnumerator } from "./enumeration_/IEnumerator";
import { ICollection } from "./Generic/ICollection";

@ClassInfo({
    fullName: System.Types.Collections.BitArray,
    instanceof: [
        System.Types.Collections.BitArray,
        System.Types.Collections.Generics.ICollection,
        System.Types.Collections.Enumeration.IEnumerable,
        System.Types.ICloneable
    ]
})
//@sealed
export class BitArray extends TObject implements ICollection<boolean>, ICloneable<BitArray> {
    protected dispose(disposing: boolean): void {
        throw new Error("Method not implemented.");
    }

    private m_array: IntArray = null as any;
    private m_length: int = 0;
    private _version: int = 0;

    private static readonly _ShrinkThreshold: int = 256;


    Add(item: boolean): void {
        throw new Error("Method not implemented.");
    }
    Clear(): void {
        throw new Error("Method not implemented.");
    }
    Contains(item: boolean): boolean {
        throw new Error("Method not implemented.");
    }
    Remove(item: boolean): boolean {
        throw new Error("Method not implemented.");
    }
    IsEndless?: boolean | undefined;

    public constructor();
    public constructor(length: int);
    public constructor(length: int, defaultValue: boolean);
    public constructor(bytes: ByteArray);
    public constructor(values: boolean[]);
    public constructor(values: IntArray);
    public constructor(bits: BitArray);
    public constructor(...args: any[]) {
        super();
        if (args.length === 0) {
            this.constructor1();
        } else if (args.length === 1 && is.int(args[0])) {
            const length: int = args[0];
            this.constructor2(length);
        } else if (args.length === 2 && is.int(args[0]) && is.boolean(args[1])) {
            const length: int = args[0];
            const defaultValue: boolean = args[1];
            this.constructor3(length, defaultValue);
        } else if (args.length === 1 && is.ByteArray(args[0])) {
            const bytes: ByteArray = args[0];
            this.constructor4(bytes);
        } else if (args.length === 1 && is.BooleanArray(args[0])) {
            const values: boolean[] = args[0];
            this.constructor5(values);
        } else if (args.length === 1 && is.Int32Array(args[0])) {
            const values: IntArray = args[0];
            this.constructor6(values);
        } else if (args.length === 1 && is.typeof<BitArray>(args[0], System.Types.Collections.BitArray)) {
            const bits: BitArray = args[0];
            this.constructor7(bits);
        }
    }

    private constructor1() {

    }

    /*=========================================================================
    ** Allocates space to hold length bit values. All of the values in the bit
    ** array are set to false.
    **
    ** Exceptions: ArgumentException if length < 0.
    =========================================================================*/
    public constructor2(length: int) {
        this.constructor3(length, false)
    }

    /*=========================================================================
    ** Allocates space to hold length bit values. All of the values in the bit
    ** array are set to defaultValue.
    **
    ** Exceptions: ArgumentOutOfRangeException if length < 0.
    =========================================================================*/
    public constructor3(length: int, defaultValue: boolean) {
        if (length < 0) {
            throw new ArgumentOutOfRangeException("length", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
        }
        // Contract.EndContractBlock();

        this.m_array = New.IntArray(BitArray.GetArrayLength(length, BitArray.BitsPerInt32));
        this.m_length = length;

        const fillValue: int = defaultValue ? ((Convert.ToInt32(0xffffffff))) : 0;
        for (let i: int = 0; i < this.m_array.length; i++) {
            this.m_array[i] = fillValue;
        }

        this._version = 0;
    }

    /*=========================================================================
    ** Allocates space to hold the bit values in bytes. bytes[0] represents
    ** bits 0 - 7, bytes[1] represents bits 8 - 15, etc. The LSB of each byte
    ** represents the lowest index value; bytes[0] & 1 represents bit 0,
    ** bytes[0] & 2 represents bit 1, bytes[0] & 4 represents bit 2, etc.
    **
    ** Exceptions: ArgumentException if bytes == null.
    =========================================================================*/
    public constructor4(bytes: ByteArray) {
        if (bytes == null) {
            throw new ArgumentNullException("bytes");
        }
        // this value is chosen to prevent overflow when computing m_length.
        // m_length is of type int32 and is exposed as a property, so
        // type of m_length can't be changed to accommodate.
        if (bytes.length > Int32.MaxValue / BitArray.BitsPerByte) {
            throw new ArgumentException(Environment.GetResourceString("Argument_ArrayTooLarge", BitArray.BitsPerByte), "bytes");
        }

        this.m_array = New.IntArray(BitArray.GetArrayLength(bytes.length, BitArray.BytesPerInt32));
        this.m_length = bytes.length * BitArray.BitsPerByte;

        let i: int = 0;
        let j: int = 0;
        while (bytes.length - j >= 4) {
            this.m_array[i++] = (bytes[j] & 0xff) |
                ((bytes[j + 1] & 0xff) << 8) |
                ((bytes[j + 2] & 0xff) << 16) |
                ((bytes[j + 3] & 0xff) << 24);
            j += 4;
        }


        switch (bytes.length - j) {
            case 3:
                this.m_array[i] = ((bytes[j + 2] & 0xff) << 16);
            // fall through
            case 2:
                this.m_array[i] |= ((bytes[j + 1] & 0xff) << 8);
            // fall through
            case 1:
                this.m_array[i] |= (bytes[j] & 0xff);
                break;
        }

        this._version = 0;
    }

    public constructor5(values: boolean[]) {
        if (values == null) {
            throw new ArgumentNullException("values");
        }

        this.m_array = New.IntArray(BitArray.GetArrayLength(values.length, BitArray.BitsPerInt32));
        this.m_length = values.length;

        for (let i: int = 0; i < values.length; i++) {
            if (values[i]) {
                this.m_array[i / 32] |= (1 << (i % 32));
            }
        }

        this._version = 0;

    }

    /*=========================================================================
    ** Allocates space to hold the bit values in values. values[0] represents
    ** bits 0 - 31, values[1] represents bits 32 - 63, etc. The LSB of each
    ** integer represents the lowest index value; values[0] & 1 represents bit
    ** 0, values[0] & 2 represents bit 1, values[0] & 4 represents bit 2, etc.
    **
    ** Exceptions: ArgumentException if values == null.
    =========================================================================*/
    public constructor6(values: IntArray) {
        if (values == null) {
            throw new ArgumentNullException("values");
        }
        //Contract.EndContractBlock();
        // this value is chosen to prevent overflow when computing m_length
        if (values.length > Int32.MaxValue / BitArray.BitsPerInt32) {
            throw new ArgumentException(Environment.GetResourceString("Argument_ArrayTooLarge", BitArray.BitsPerInt32), "values");
        }

        this.m_array = New.IntArray(values.length);
        this.m_length = values.length * BitArray.BitsPerInt32;

        TArray.Copy(values, this.m_array, values.length);

        this._version = 0;
    }

    /*=========================================================================
    ** Allocates a new BitArray with the same length and bit values as bits.
    **
    ** Exceptions: ArgumentException if bits == null.
    =========================================================================*/
    public constructor7(bits: BitArray) {
        if (bits == null) {
            throw new ArgumentNullException("bits");
        }

        const arrayLength: int = BitArray.GetArrayLength(bits.m_length, BitArray.BitsPerInt32);
        this.m_array = New.IntArray(arrayLength);
        this.m_length = bits.m_length;

        TArray.Copy(bits.m_array, this.m_array, arrayLength);

        this._version = bits._version;
    }

    /*  public  Get( index:int):boolean {
     get {
         return Get(index);
     }
     set {
         Set(index, value);
     } */
    //}

    /*=========================================================================
    ** Returns the bit value at position index.
    **
    ** Exceptions: ArgumentOutOfRangeException if index < 0 or
    **             index >= GetLength().
    =========================================================================*/
    public Get(index: int): boolean {
        if (index < 0 || index >= this.Length) {
            throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_Index"));
        }

        return (this.m_array[index / 32] & (1 << (index % 32))) !== 0;
    }

    /*=========================================================================
    ** Sets the bit value at position index to value.
    **
    ** Exceptions: ArgumentOutOfRangeException if index < 0 or
    **             index >= GetLength().
    =========================================================================*/
    public Set(index: int, value: boolean): void {
        if (index < 0 || index >= this.Length) {
            throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_Index"));
        }

        if (value) {
            this.m_array[index / 32] |= (1 << (index % 32));
        } else {
            this.m_array[index / 32] &= ~(1 << (index % 32));
        }

        this._version++;
    }

    /*=========================================================================
    ** Sets all the bit values to value.
    =========================================================================*/
    public SetAll(value: boolean): void {
        const fillValue: int = value ? ((Convert.ToInt32(0xffffffff))) : 0;
        const ints: int = BitArray.GetArrayLength(this.m_length, BitArray.BitsPerInt32);
        for (let i: int = 0; i < ints; i++) {
            this.m_array[i] = fillValue;
        }

        this._version++;
    }

    /*=========================================================================
    ** Returns a reference to the current instance ANDed with value.
    **
    ** Exceptions: ArgumentException if value == null or
    **             value.Length != this.Length.
    =========================================================================*/
    public And(value: BitArray): BitArray {
        if (value == null)
            throw new ArgumentNullException("value");
        if (this.Length !== value.Length)
            throw new ArgumentException(Environment.GetResourceString("Arg_ArrayLengthsDiffer"));

        const ints: int = BitArray.GetArrayLength(this.m_length, BitArray.BitsPerInt32);
        for (let i: int = 0; i < ints; i++) {
            this.m_array[i] &= value.m_array[i];
        }

        this._version++;
        return this;
    }

    /*=========================================================================
    ** Returns a reference to the current instance ORed with value.
    **
    ** Exceptions: ArgumentException if value == null or
    **             value.Length != this.Length.
    =========================================================================*/
    public Or(value: BitArray): BitArray {
        if (value == null)
            throw new ArgumentNullException("value");
        if (this.Length !== value.Length)
            throw new ArgumentException(Environment.GetResourceString("Arg_ArrayLengthsDiffer"));

        const ints: int = BitArray.GetArrayLength(this.m_length, BitArray.BitsPerInt32);
        for (let i: int = 0; i < ints; i++) {
            this.m_array[i] |= value.m_array[i];
        }

        this._version++;
        return this;
    }

    /*=========================================================================
    ** Returns a reference to the current instance XORed with value.
    **
    ** Exceptions: ArgumentException if value == null or
    **             value.Length != this.Length.
    =========================================================================*/
    public Xor(value: BitArray): BitArray {
        if (value == null)
            throw new ArgumentNullException("value");
        if (this.Length != value.Length)
            throw new ArgumentException(Environment.GetResourceString("Arg_ArrayLengthsDiffer"));

        const ints: int = BitArray.GetArrayLength(this.m_length, BitArray.BitsPerInt32);
        for (let i: int = 0; i < ints; i++) {
            this.m_array[i] ^= value.m_array[i];
        }

        this._version++;
        return this;
    }

    /*=========================================================================
    ** Inverts all the bit values. On/true bit values are converted to
    ** off/false. Off/false bit values are turned on/true. The current instance
    ** is updated and returned.
    =========================================================================*/
    public Not(): BitArray {
        const ints: int = BitArray.GetArrayLength(this.m_length, BitArray.BitsPerInt32);
        for (let i: int = 0; i < ints; i++) {
            this.m_array[i] = ~this.m_array[i];
        }

        this._version++;
        return this;
    }

    public get Length(): int {
        return this.m_length;
    }
    public set Length(value: int) {
        if (value < 0) {
            throw new ArgumentOutOfRangeException("value", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
        }

        const newints: int = BitArray.GetArrayLength(value, BitArray.BitsPerInt32);
        if (newints > this.m_array.length || newints + BitArray._ShrinkThreshold < this.m_array.length) {
            // grow or shrink (if wasting more than _ShrinkThreshold ints)
            const newarray: IntArray = New.IntArray(newints);
            TArray.Copy(this.m_array, newarray, newints > this.m_array.length ? this.m_array.length : newints);
            this.m_array = newarray;
        }

        if (value > this.m_length) {
            // clear high bit values in the last int
            const last: int = BitArray.GetArrayLength(this.m_length, BitArray.BitsPerInt32) - 1;
            const bits: int = this.m_length % 32;
            if (bits > 0) {
                this.m_array[last] &= (1 << bits) - 1;
            }

            // clear remaining int values
            TArray.Clear(this.m_array, last + 1, newints - last - 1);
        }

        this.m_length = value;
        this._version++;
    }


    // ICollection implementation
    public CopyTo(array: Array<boolean> | IntArray | ByteArray, index: int): void {
        if (array == null)
            throw new ArgumentNullException("array");

        if (index < 0)
            throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));

        if ((array as any).Rank !== 1)
            throw new ArgumentException(Environment.GetResourceString("Arg_RankMultiDimNotSupported"));


        if (is.Int32Array(array)) {
            TArray.Copy(this.m_array, 0, array as any, index, BitArray.GetArrayLength(this.m_length, BitArray.BitsPerInt32));
        }
        else if (is.ByteArray(array)) {
            const arrayLength: int = BitArray.GetArrayLength(this.m_length, BitArray.BitsPerByte);
            if ((array.length - index) < arrayLength)
                throw new ArgumentException(Environment.GetResourceString("Argument_InvalidOffLen"));

            const b: ByteArray = array as any;
            for (let i: int = 0; i < arrayLength; i++)
                b[index + i] = Convert.ToByte((this.m_array[i / 4] >> ((i % 4) * 8)) & 0x000000FF); // Shift to bring the required byte to LSB, then mask
        }
        else if (is.boolean(array)) {
            if (array.length - index < this.m_length)
                throw new ArgumentException(Environment.GetResourceString("Argument_InvalidOffLen"));

            const b: boolean[] = array as any;
            for (let i: int = 0; i < this.m_length; i++) {
                b[index + i] = ((this.m_array[i / 32] >> (i % 32)) & 0x00000001) != 0;
            }
        }
        else
            throw new ArgumentException(Environment.GetResourceString("Arg_BitArrayTypeUnsupported"));
    }

    public get Count(): int {
        return this.m_length;
    }

    public Clone(): BitArray {
        const bitArray: BitArray = new BitArray(this.m_array);
        bitArray._version = this._version;
        bitArray.m_length = this.m_length;
        return bitArray;
    }

    public get IsReadOnly(): boolean {
        return false;
    }


    public GetEnumerator(): IEnumerator<boolean> {
        return new BitArrayEnumeratorSimple(this);
    }

    // XPerY=n means that n Xs can be stored in 1 Y.
    private static readonly BitsPerInt32: int = 32;
    private static readonly BytesPerInt32: int = 4;
    private static readonly BitsPerByte: int = 8;


    private static GetArrayLength(n: int, div: int): int {
        return n > 0 ? (((n - 1) / div) + 1) : 0;
    }
}

export class BitArrayEnumeratorSimple extends TObject implements IEnumerator<boolean>, ICloneable<BitArrayEnumeratorSimple>
{
    protected dispose(disposing: boolean): void {
        throw new Error("Method not implemented.");
    }

    private bitarray: BitArray = null as any;
    private index: int = 0;
    private version: int = 0;
    private currentElement: boolean = false;

    public /* internal */ constructor(bitarray: BitArray) {
        super();
        this.bitarray = bitarray;
        this.index = -1;
        this.version = (bitarray as any)._version;
    }
    CanMoveNext?: boolean | undefined;
    TryMoveNext(out: (value: boolean) => void): boolean {
        throw new Error("Method not implemented.");
    }
    End(): void {
        throw new Error("Method not implemented.");
    }
    NextValue(value?: any): boolean | undefined {
        throw new Error("Method not implemented.");
    }
    IsEndless?: boolean | undefined;
    Next(value?: any): IIteratorResult<boolean> {
        throw new Error("Method not implemented.");
    }

    public Clone(): BitArrayEnumeratorSimple {
        return this.MemberwiseClone();
    }

    @Virtual
    public MoveNext(): boolean {
        if (this.version !== (this.bitarray as any)._version) {
            throw new InvalidOperationException(Environment.GetResourceString('InvalidOperation_EnumFailedVersion'));
        }
        if (this.index < (this.bitarray.Count - 1)) {
            this.index++;
            this.currentElement = this.bitarray.Get(this.index);
            return true;
        }
        else
            this.index = this.bitarray.Count;

        return false;
    }

    public get Current(): boolean {
        if (this.index == -1)
            throw new InvalidOperationException(Environment.GetResourceString('InvalidOperation_EnumNotStarted'));
        if (this.index >= this.bitarray.Count)
            throw new InvalidOperationException(Environment.GetResourceString('InvalidOperation_EnumEnded'));
        return this.currentElement;
    }


    public Reset(): void {
        if (this.version !== (this.bitarray as any)._version) {
            throw new InvalidOperationException(Environment.GetResourceString('InvalidOperation_EnumFailedVersion'));
        }
        this.index = -1;
    }
}
