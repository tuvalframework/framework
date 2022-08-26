import { Convert } from "../convert";
import { Environment } from "../Environment";
import { ArgumentException } from "../Exceptions/ArgumentException";
import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { ArgumentOutOfRangeException } from "../Exceptions/ArgumentOutOfRangeException";
import { ByteArray, int, long, New } from "../float";
import { TBuffer } from "./Buffer/TBuffer";
import { Stream } from "./Stream";
import { is } from './../is';
import { ClassInfo, Internal, Override, Virtual } from "../Reflection/Decorators/ClassInfo";
import { SeekOrigin } from "./SeekOrigin";
import { TArray } from "../Extensions/TArray";
import { byte } from "../byte";
import { Exception } from '../Exception';
import { IOException } from "./IOException";
import { UnauthorizedAccessException } from "../Exceptions/UnauthorizedAccessException";
import { System } from "../SystemTypes";

@ClassInfo({
    fullName: System.Types.IO.MemoryStream,
    instanceof: [
        System.Types.IO.MemoryStream
    ]
})
export class MemoryStream extends Stream {
    protected dispose(disposing: boolean): void {
        try {
            if (disposing) {

            }
        }
        finally {
            // Call base.Close() to cleanup async IO resources
            super.dispose(disposing);
        }
    }
    private static readonly MemStreamMaxLength: int = 2147483647;
    private _buffer: ByteArray = null as any;
    private _origin: int = 0;
    private _position: int = 0;
    private _length: int = 0;
    private _capacity: int = 0;
    private _expandable: boolean = false;
    private _writable: boolean = false;
    private _exposable: boolean = false;
    private _isOpen: boolean = false;
    protected Get_CanRead(): boolean {
        return this._isOpen;
    }
    protected Get_CanSeek(): boolean {
        return this._isOpen;
    }
    protected Get_CanWrite(): boolean {
        return this._writable;
    }


    protected Get_Capacity(): int {
        if (!this._isOpen) {
            throw new Exception('StreamIsClosed');
        }
        return this._capacity - this._origin;
    }
    protected Set_Capacity(value: int) {
        if (!this._isOpen) {
            throw new Exception('StreamIsClosed');
        }
        if (value != this._capacity) {
            if (!this._expandable) {
                throw new Exception('MemoryStreamNotExpandable');
            }
            if (value < this._length) {
                throw new ArgumentOutOfRangeException("value", Environment.GetResourceString("ArgumentOutOfRange_SmallCapacity"));
            }
            if (value <= 0) {
                this._buffer = null as any;
            }
            else {
                const numArray: ByteArray = New.ByteArray(value);
                if (this._length > 0) {
                    TBuffer.InternalBlockCopy(this._buffer, 0, numArray, 0, this._length);
                }
                this._buffer = numArray;
            }
            this._capacity = value;
        }
    }


    public get Capacity(): int {
        return this.Get_Capacity();
    }
    public set Capacity(value: int) {
        this.Set_Capacity(value);
    }


    protected Get_Length(): int {
        if (!this._isOpen) {
            throw new Exception('StreamIsClosed');
        }
        return this._length - this._origin;
    }

    protected Get_Position(): int {
        if (!this._isOpen) {
            throw new Exception('StreamIsClosed');
        }
        return this._position - this._origin;
    }
    protected Set_Position(value: int) {
        if (!this._isOpen) {
            throw new Exception('StreamIsClosed');

        }
        if (value < 0) {
            throw new ArgumentOutOfRangeException("value", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
        }
        if (value > 2147483647) {
            throw new ArgumentOutOfRangeException("value", Environment.GetResourceString("ArgumentOutOfRange_MemStreamLength"));
        }
        this._position = this._origin + value;;
    }

    public constructor();
    public constructor(capacity: int);
    public constructor(buffer: ByteArray);
    public constructor(buffer: ByteArray, writable: boolean);
    public constructor(buffer: ByteArray, index: int, count: int);
    public constructor(buffer: ByteArray, index: int, count: int, writable: boolean);
    public constructor(buffer: ByteArray, index: int, count: int, writable: boolean, publiclyVisible: boolean);
    public constructor(...args: any[]) {
        super();
        if (args.length === 0) {
            this.constructor1();
        } else if (args.length === 1 && is.int(args[0])) {
            const capacity: int = args[0];
            this.constructor2(capacity);
        } else if (args.length === 1 && is.ByteArray(args[0])) {
            const buffer: ByteArray = args[0];
            this.constructor3(buffer);
        } else if (args.length === 2 && is.ByteArray(args[0]) && is.boolean(args[1])) {
            const buffer: ByteArray = args[0];
            const writable: boolean = args[1];
            this.constructor4(buffer, writable);
        } else if (args.length === 3 && is.ByteArray(args[0]) && is.int(args[1]) && is.int(args[2])) {
            const buffer: ByteArray = args[0];
            const index: int = args[1];
            const count: int = args[2];
            this.constructor5(buffer, index, count);
        } else if (args.length === 4 && is.ByteArray(args[0]) && is.int(args[1]) && is.int(args[2]) && is.boolean(args[3])) {
            const buffer: ByteArray = args[0];
            const index: int = args[1];
            const count: int = args[2];
            const writable: boolean = args[3];
            this.constructor6(buffer, index, count, writable);
        } else if (args.length === 5 && is.ByteArray(args[0]) && is.int(args[1]) && is.int(args[2]) && is.boolean(args[3]) && is.boolean(args[4])) {
            const buffer: ByteArray = args[0];
            const index: int = args[1];
            const count: int = args[2];
            const writable: boolean = args[3];
            const publiclyVisible: boolean = args[4];
            this.constructor7(buffer, index, count, writable, publiclyVisible);
        } else {
            throw new ArgumentOutOfRangeException('');
        }
    }

    public constructor1() {
        this.constructor2(0);
    }
    public constructor2(capacity: int) {

        if (capacity < 0) {
            throw new ArgumentOutOfRangeException(Environment.GetResourceString("ArgumentOutOfRange_NegativeCapacity"));
        }
        this._buffer = New.ByteArray(capacity);
        this._capacity = capacity;
        this._expandable = true;
        this._writable = true;
        this._exposable = true;
        this._origin = 0;
        this._isOpen = true;
    }

    public constructor3(buffer: ByteArray) {
        this.constructor4(buffer, true);
    }

    public constructor4(buffer: ByteArray, writable: boolean) {
        if (buffer == null) {
            throw new ArgumentNullException("buffer", Environment.GetResourceString("ArgumentNull_Buffer"));
        }
        this._buffer = buffer;
        const length: int = buffer.length;
        const int32: int = length;
        this._capacity = length;
        this._length = int32;
        this._writable = writable;
        this._exposable = false;
        this._origin = 0;
        this._isOpen = true;
    }

    public constructor5(buffer: ByteArray, index: int, count: int) {
        this.constructor7(buffer, index, count, true, false)
    }

    public constructor6(buffer: ByteArray, index: int, count: int, writable: boolean) {
        this.constructor7(buffer, index, count, writable, false)
    }

    public constructor7(buffer: ByteArray, index: int, count: int, writable: boolean, publiclyVisible: boolean) {
        if (buffer == null) {
            throw new ArgumentNullException("buffer", Environment.GetResourceString("ArgumentNull_Buffer"));
        }
        if (index < 0) {
            throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
        }
        if (count < 0) {
            throw new ArgumentOutOfRangeException("count", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
        }
        if (buffer.length - index < count) {
            throw new ArgumentException(Environment.GetResourceString("Argument_InvalidOffLen"));
        }
        this._buffer = buffer;
        const int32: int = index;
        let int321: int = int32;
        this._position = int32;
        this._origin = int321;
        const int322: int = index + count;
        int321 = int322;
        this._capacity = int322;
        this._length = int321;
        this._writable = writable;
        this._exposable = publiclyVisible;
        this._expandable = false;
        this._isOpen = true;
    }

    @Override
    public Close(): void {
        this._isOpen = false;
        this._writable = false;
        this._expandable = false;
    }

    private EnsureCapacity(value: int): boolean {
        if (value < 0) {
            throw new IOException(Environment.GetResourceString("IO.IO_StreamTooLong"));
        }
        if (value <= this._capacity) {
            return false;
        }
        let int32: int = value;
        if (int32 < 256) {
            int32 = 256;
        }
        if (int32 < this._capacity * 2) {
            int32 = this._capacity * 2;
        }
        this.Capacity = int32;
        return true;
    }

    @Override
    public Flush(): void {
    }

    @Virtual
    public GetBuffer(): ByteArray {
        if (!this._exposable) {
            throw new UnauthorizedAccessException(Environment.GetResourceString("UnauthorizedAccess_MemStreamBuffer"));
        }
        return this._buffer;
    }

    @Override
    public Read(buffer: ByteArray, offset: int, count: int): int {
        if (!this._isOpen) {
            throw new Exception('StreamIsClosed');
        }
        if (buffer == null) {
            throw new ArgumentNullException("buffer", Environment.GetResourceString("ArgumentNull_Buffer"));
        }
        if (offset < 0) {
            throw new ArgumentOutOfRangeException("offset", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
        }
        if (count < 0) {
            throw new ArgumentOutOfRangeException("count", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
        }
        if (buffer.length - offset < count) {
            throw new ArgumentException(Environment.GetResourceString("Argument_InvalidOffLen"));
        }
        let int32: int = this._length - this._position;
        if (int32 > count) {
            int32 = count;
        }
        if (int32 <= 0) {
            return 0;
        }
        if (int32 > 8) {
            TBuffer.InternalBlockCopy(this._buffer, this._position, buffer, offset, int32);
        }
        else {
            let int321: int = int32;
            while (true) {
                const int322: int = int321 - 1;
                int321 = int322;
                if (int322 < 0) {
                    break;
                }
                buffer[offset + int321] = this._buffer[this._position + int321];
            }
        }
        this._position += int32;
        return int32;
    }

    @Override
    public ReadByte(): int {
        if (!this._isOpen) {
            throw new Exception('StreamIsClosed');
        }
        if (this._position >= this._length) {
            return -1;
        }
        const numArray: ByteArray = this._buffer;
        const memoryStream: MemoryStream = this;
        const int32: int = memoryStream._position;
        const int321: int = int32;
        memoryStream._position = int32 + 1;
        return numArray[int321];
    }

    @Override
    public Seek(offset: int, loc: SeekOrigin): int {
        if (!this._isOpen) {
            throw new Exception('StreamIsClosed');
        }
        if (offset > 2147483647) {
            throw new ArgumentOutOfRangeException("offset", Environment.GetResourceString("ArgumentOutOfRange_MemStreamLength"));
        }
        switch (loc) {
            case SeekOrigin.Begin:
                {
                    if (offset < 0) {
                        throw new IOException(Environment.GetResourceString("IO.IO_SeekBeforeBegin"));
                    }
                    this._position = this._origin + offset;
                    break;
                }
            case SeekOrigin.Current:
                {
                    if (offset + this._position < this._origin) {
                        throw new IOException(Environment.GetResourceString("IO.IO_SeekBeforeBegin"));
                    }
                    this._position += offset;
                    break;
                }
            case SeekOrigin.End:
                {
                    if (this._length + offset < this._origin) {
                        throw new IOException(Environment.GetResourceString("IO.IO_SeekBeforeBegin"));
                    }
                    this._position = this._length + offset;
                    break;
                }
            default:
                {
                    throw new ArgumentException(Environment.GetResourceString("Argument_InvalidSeekOrigin"));
                }
        }
        return this._position;
    }

    @Override
    public SetLength(value: int): void {
        if (!this._writable) {
            throw new Exception('WriteNotSupported');
        }
        if (value > 2147483647) {
            throw new ArgumentOutOfRangeException("value", Environment.GetResourceString("ArgumentOutOfRange_MemStreamLength"));
        }
        if (value < 0 || value > (2147483647 - this._origin)) {
            throw new ArgumentOutOfRangeException("value", Environment.GetResourceString("ArgumentOutOfRange_MemStreamLength"));
        }
        const int32: int = this._origin + value;
        if (!this.EnsureCapacity(int32) && int32 > this._length) {
            TArray.Clear(this._buffer, this._length, int32 - this._length);
        }
        this._length = int32;
        if (this._position > int32) {
            this._position = int32;
        }
    }

    @Internal
    public InternalReadInt32(): int {
        if (!this._isOpen) {
            throw new Exception('StreamIsClosed');
        }

        const pos: int = (this._position += 4); // use temp to avoid ----
        if (pos > this._length) {
            this._position = this._length;
            throw new Exception('EndOfFile');
        }
        return Convert.ToInt32(this._buffer[pos - 4] | (this._buffer[pos - 3] << 8) | (this._buffer[pos - 2] << 16) | (this._buffer[pos - 1] << 24));
    }

    @Internal
    public InternalGetPosition(): int {
        if (!this._isOpen) {
            throw new Exception('StreamIsClosed');
        }
        return this._position;
    }

    @Internal
    public InternalEmulateRead(count: int): int {
        if (!this._isOpen) throw new Exception('StreamIsClosed');

        let n: int = this._length - this._position;
        if (n > count) n = count;
        if (n < 0) n = 0;

        //Contract.Assert(_position + n >= 0, "_position + n >= 0");  // len is less than 2^31 -1.
        this._position += n;
        return n;
    }
    @Internal
    public InternalGetBuffer(): ByteArray {
        return this._buffer;
    }

    @Virtual
    public ToArray(): ByteArray {
        const numArray: ByteArray = New.ByteArray(this._length - this._origin);
        TBuffer.InternalBlockCopy(this._buffer, this._origin, numArray, 0, this._length - this._origin);
        return numArray;
    }

    @Override
    public Write(buffer: ByteArray, offset: int, count: int): void {
        if (!this._isOpen) {
            throw new Exception('StreamIsClosed');
        }
        if (!this._writable) {
            throw new Exception('WriteNotSupported');
        }
        if (buffer == null) {
            throw new ArgumentNullException("buffer", Environment.GetResourceString("ArgumentNull_Buffer"));
        }
        if (offset < 0) {
            throw new ArgumentOutOfRangeException("offset", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
        }
        if (count < 0) {
            throw new ArgumentOutOfRangeException("count", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
        }
        if (buffer.length - offset < count) {
            throw new ArgumentException(Environment.GetResourceString("Argument_InvalidOffLen"));
        }
        const int32: int = this._position + count;
        if (int32 < 0) {
            throw new IOException(Environment.GetResourceString("IO.IO_StreamTooLong"));
        }
        if (int32 > this._length) {
            let flag: boolean = this._position > this._length;
            if (int32 > this._capacity && this.EnsureCapacity(int32)) {
                flag = false;
            }
            if (flag) {
                TArray.Clear(this._buffer, this._length, int32 - this._length);
            }
            this._length = int32;
        }
        if (count > 8) {
            TBuffer.InternalBlockCopy(buffer, offset, this._buffer, this._position, count);
        }
        else {
            let int321: int = count;
            while (true) {
                const int322: int = int321 - 1;
                int321 = int322;
                if (int322 < 0) {
                    break;
                }
                this._buffer[this._position + int321] = buffer[offset + int321];
            }
        }
        this._position = int32;
    }

    @Override
    public WriteByte(value: byte): void {
        value = Convert.ToByte(value);

        if (!this._isOpen) {
            throw new Exception('StreamIsClosed');
        }
        if (!this._writable) {
            throw new Exception('WriteNotSupported');
        }
        if (this._position >= this._length) {
            const int32: int = this._position + 1;
            let flag: boolean = this._position > this._length;
            if (int32 >= this._capacity && this.EnsureCapacity(int32)) {
                flag = false;
            }
            if (flag) {
                TArray.Clear(this._buffer, this._length, this._position - this._length);
            }
            this._length = int32;
        }
        const numArray: ByteArray = this._buffer;
        const memoryStream: MemoryStream = this;
        const int321: int = memoryStream._position;
        const int322: int = int321;
        memoryStream._position = int321 + 1;
        numArray[int322] = value;
    }

    @Virtual
    public WriteTo(stream: Stream): void {
        if (!this._isOpen) {
            throw new Exception('StreamIsClosed');
        }
        if (stream == null) {
            throw new ArgumentNullException("stream", Environment.GetResourceString("ArgumentNull_Stream"));
        }
        stream.Write(this._buffer, this._origin, this._length - this._origin);
    }
}