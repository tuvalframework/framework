import { IDisposable, ObjectDisposedException } from "../Disposable";
import { Decoder } from "../Encoding/Decoder";
import { UTF8Encoding } from "../Encoding/UTF8Encoding";
import { TObject } from '../Extensions/TObject';
import { int, ByteArray, CharArray, New, char, short, uint, long, ulong, float, double, sbyte, ushort } from '../float';
import { Stream } from "./Stream";
import { is } from '../is';
import { System } from "../SystemTypes";
import { Encoding } from '../Encoding/Encoding';
import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { ArgumentException } from "../Exceptions/ArgumentException";
import { Environment } from "../Environment";
import { UnicodeEncoding } from "../Encoding/UnicodeEncoding";
import {  Virtual } from "../Reflection";
import { Internal, Override, typeOf } from '../Reflection/Decorators/ClassInfo';
import { Exception } from '../Exception';
import { byte } from "../byte";
import { Convert } from '../convert';
import { as } from "../as";
import { MemoryStream } from "./MemoryStream";
import { bigInt, BigNumber } from '../Math/BigNumber';
import { BitConverter } from '../BitConverter';
import { IOException } from "./IOException";
import { TString } from "../Text/TString";
import { StringBuilder } from "../Text/StringBuilder";
import { StringBuilderCache } from "../Text/StringBuilderCache";
import { ArgumentOutOfRangeException } from "../Exceptions/ArgumentOutOfRangeException";
import { SeekOrigin } from "./SeekOrigin";
import { TArray } from '../Extensions/TArray';
import { FormatException } from "../Extensions/FormatException";
import { Out } from "../Out";
import { EndOfStreamException } from "./Exceptions/EndOfStreamException";

export class BinaryReader extends TObject implements IDisposable {
    private static readonly MaxCharBytesSize: int = 128;
    //
    // 128 chars should cover most strings in one grab.
    //
    private static readonly MaxBufferSize: int = 128;
    private m_stream: Stream = null as any;
    private m_buffer: ByteArray = null as any;
    private m_decoder: Decoder = null as any;
    private m_encoding:Encoding = null as any;
    private m_charBytes: ByteArray = null as any;
    private m_singleChar: CharArray = null as any;
    private m_charBuffer: CharArray = null as any;
    private m_maxCharsSize: int = 0;  // From MaxCharBytesSize & Encoding

    // Performance optimization for Read() w/ Unicode.  Speeds us up by ~40%
    private m_2BytesPerChar: boolean = false;
    private m_isMemoryStream: boolean = false; // "do we sit on MemoryStream?" for Read/ReadInt32 perf
    private m_leaveOpen: boolean = false;
    private m_disposed: boolean = false;

    public constructor(input: Stream);
    public constructor(input: Stream, encoding: Encoding);
    public constructor(input: Stream, encoding: Encoding, leaveOpen: boolean);
    public constructor(...args: any[]) {
        super();
        if (arguments.length === 1 && is.typeof<Stream>(args[0], System.Types.IO.Stream)) {
            const input: Stream = args[0];
            this.constructor1(input);
        } else if (args.length === 2 && is.typeof<Stream>(args[0], System.Types.IO.Stream) && is.typeof<Encoding>(args[1], System.Types.Encoding.Encoding)) {
            const input: Stream = args[0];
            const encoding: Encoding = args[1];
            this.constructor2(input, encoding);
        } else if (args.length === 3 && is.typeof<Stream>(args[0], System.Types.IO.Stream) && is.typeof<Encoding>(args[1], System.Types.Encoding.Encoding) && is.boolean(args[2])) {
            const input: Stream = args[0];
            const encoding: Encoding = args[1];
            const leaveOpen: boolean = args[2];
            this.constructor3(input, encoding, leaveOpen);
        }
    }

    public constructor1(input: Stream) {
        this.constructor3(input, new UTF8Encoding(), false);
    }

    public constructor2(input: Stream, encoding: Encoding) {
        this.constructor3(input, encoding, false)
    }

    public constructor3(input: Stream, encoding: Encoding, leaveOpen: boolean) {
        if (input == null) {
            throw new ArgumentNullException("input");
        }
        if (encoding == null) {
            throw new ArgumentNullException("encoding");
        }
        if (!input.CanRead)
            throw new ArgumentException(Environment.GetResourceString("Argument_StreamNotReadable"));
        //Contract.EndContractBlock();
        this.m_stream = input;
        this.m_encoding = encoding;
        this.m_decoder = encoding.GetDecoder();
        this.m_maxCharsSize = encoding.GetMaxCharCount(BinaryReader.MaxCharBytesSize);
        let minBufferSize: int = encoding.GetMaxByteCount(1);  // max bytes per one char
        if (minBufferSize < 16) {
            minBufferSize = 16;
        }
        this.m_buffer = New.ByteArray(minBufferSize);
        // m_charBuffer and m_charBytes will be left null.

        // For Encodings that always use 2 bytes per char (or more),
        // special case them here to make Read() & Peek() faster.
        this.m_2BytesPerChar = is.typeof<UnicodeEncoding>(encoding, System.Types.Encoding.UnicodeEncoding);
        // check if BinaryReader is based on MemoryStream, and keep this for it's life
        // we cannot use "as" operator, since derived classes are not allowed
        this.m_isMemoryStream = (this.m_stream.GetType() === typeOf(System.Types.IO.MemoryStream));
        this.m_leaveOpen = leaveOpen;

        // Contract.Assert(m_decoder != null, "[BinaryReader.ctor]m_decoder!=null");
    }

    @Virtual
    protected Get_BaseStream(): Stream {
        return this.m_stream;
    }
    public get BaseStream(): Stream {
        return this.Get_BaseStream();
    }

    @Virtual
    public Close(): void {
        this.dispose(true);
        this.m_disposed = true;
    }

    @Override
    protected dispose(disposing: boolean): void {
        if (disposing) {
            const copyOfStream: Stream = this.m_stream;
            this.m_stream = null as any;
            if (copyOfStream != null && !this.m_leaveOpen)
                copyOfStream.Close();
        }
        this.m_stream = null as any;
        this.m_buffer = null as any;
        this.m_decoder = null as any;
        this.m_charBytes = null as any;
        this.m_singleChar = null as any;
        this.m_charBuffer = null as any;
    }

    /*   public void Dispose() {
          Dispose(true);
      } */

    @Virtual
    public PeekChar(): int {
        //Contract.Ensures(Contract.Result<int>() >= -1);

        if (this.m_stream == null) {
            throw new Exception('FileNotOpen');
        }

        if (!this.m_stream.CanSeek) {
            return -1;
        }
        const origPos: int = this.m_stream.Position;
        const ch: int = this.Read();
        this.m_stream.Position = origPos;
        return ch;
    }



    @Virtual
    public ReadBoolean(): boolean {
        this.FillBuffer(1);
        return (this.m_buffer[0] !== 0);
    }

    @Virtual
    public ReadByte(): byte {
        // Inlined to avoid some method call overhead with FillBuffer.
        if (this.m_stream == null) {
            throw new Exception('FileNotOpen');
        }
        const b: int = this.m_stream.ReadByte();
        if (b == -1) {
            throw new Exception('EndOfFile');
        }
        return Convert.ToByte(b);
    }

    @Virtual
    public ReadSByte(): sbyte {
        this.FillBuffer(1);
        return Convert.ToSByte(this.m_buffer[0]);
    }

    @Virtual
    public ReadChar(): char {
        const value: int = this.Read();
        if (value === -1) {
            throw new Exception('EndOfFile');
        }
        return Convert.ToChar(value);
    }

    @Virtual
    public ReadInt16(): short {
        this.FillBuffer(2);
        return Convert.ToShort(this.m_buffer[0] | (this.m_buffer[1] << 8));
    }

    @Virtual
    public ReadUInt16(): ushort {
        this.FillBuffer(2);
        return Convert.ToUShort(this.m_buffer[0] | (this.m_buffer[1] << 8));
    }

    @Virtual
    public ReadInt32(): int {
        if (this.m_isMemoryStream) {
            if (this.m_stream == null) {
                throw new Exception('FileNotOpen');
            }
            // read directly from MemoryStream buffer
            const mStream: MemoryStream = as<MemoryStream>(this.m_stream, System.Types.IO.MemoryStream);
            //Contract.Assert(mStream != null, "m_stream as MemoryStream != null");

            return mStream.InternalReadInt32();
        }
        else {
            this.FillBuffer(4);
            return Convert.ToInt32(this.m_buffer[0] | (this.m_buffer[1] << 8) | (this.m_buffer[2] << 16) | (this.m_buffer[3] << 24));
        }
    }

    @Virtual
    public ReadUInt32(): uint {
        this.FillBuffer(4);
        return Convert.ToUInt32(this.m_buffer[0] | (this.m_buffer[1] << 8) | (this.m_buffer[2] << 16) | (this.m_buffer[3] << 24));
    }

    @Virtual
    public ReadInt64(): long {
        this.FillBuffer(8);
        const buffer0: BigNumber = bigInt(this.m_buffer[0]);
        const buffer1: BigNumber = bigInt(this.m_buffer[1]);
        const buffer2: BigNumber = bigInt(this.m_buffer[2]);
        const buffer3: BigNumber = bigInt(this.m_buffer[3]);
        const lo: BigNumber = buffer0.or(buffer1.shl(8)).or(buffer2.shl(16)).or(buffer3.shl(24));

        /* const lo:BigNumber = (uint)(m_buffer[0] | m_buffer[1] << 8 |
            m_buffer[2] << 16 | m_buffer[3] << 24); */

        const buffer4: BigNumber = bigInt(this.m_buffer[0]);
        const buffer5: BigNumber = bigInt(this.m_buffer[1]);
        const buffer6: BigNumber = bigInt(this.m_buffer[2]);
        const buffer7: BigNumber = bigInt(this.m_buffer[3]);
        const hi: BigNumber = buffer4.or(buffer5.shl(8)).or(buffer6.shl(16)).or(buffer7.shl(24));

        /* uint hi = (uint)(m_buffer[4] | m_buffer[5] << 8 |
            m_buffer[6] << 16 | m_buffer[7] << 24); */
        return hi.shl(32).or(lo);
        //return (long)((ulong)hi) << 32 | lo;
    }

    @Virtual
    public ReadUInt64(): ulong {
        /*  FillBuffer(8);
         uint lo = (uint)(m_buffer[0] | m_buffer[1] << 8 |
             m_buffer[2] << 16 | m_buffer[3] << 24);
         uint hi = (uint)(m_buffer[4] | m_buffer[5] << 8 |
             m_buffer[6] << 16 | m_buffer[7] << 24);
         return ((ulong)hi) << 32 | lo; */
        this.FillBuffer(8);
        const buffer0: BigNumber = bigInt(this.m_buffer[0]);
        const buffer1: BigNumber = bigInt(this.m_buffer[1]);
        const buffer2: BigNumber = bigInt(this.m_buffer[2]);
        const buffer3: BigNumber = bigInt(this.m_buffer[3]);
        const lo: BigNumber = buffer0.or(buffer1.shl(8)).or(buffer2.shl(16)).or(buffer3.shl(24));

        /* const lo:BigNumber = (uint)(m_buffer[0] | m_buffer[1] << 8 |
            m_buffer[2] << 16 | m_buffer[3] << 24); */

        const buffer4: BigNumber = bigInt(this.m_buffer[0]);
        const buffer5: BigNumber = bigInt(this.m_buffer[1]);
        const buffer6: BigNumber = bigInt(this.m_buffer[2]);
        const buffer7: BigNumber = bigInt(this.m_buffer[3]);
        const hi: BigNumber = buffer4.or(buffer5.shl(8)).or(buffer6.shl(16)).or(buffer7.shl(24));

        /* uint hi = (uint)(m_buffer[4] | m_buffer[5] << 8 |
            m_buffer[6] << 16 | m_buffer[7] << 24); */
        return hi.shl(32).or(lo);
        //return (long)((ulong)hi) << 32 | lo;
    }

    @Virtual
    public ReadSingle(): float {
        this.FillBuffer(4);
        /*  uint tmpBuffer = (uint)(m_buffer[0] | m_buffer[1] << 8 | m_buffer[2] << 16 | m_buffer[3] << 24);
         return * ((float *) & tmpBuffer); */
        return BitConverter.ToSingle(this.m_buffer, 0);
    }

    /*   @Virtual
      public   ReadDouble():double {
          FillBuffer(8);
          uint lo = (uint)(m_buffer[0] | m_buffer[1] << 8 |
              m_buffer[2] << 16 | m_buffer[3] << 24);
          uint hi = (uint)(m_buffer[4] | m_buffer[5] << 8 |
              m_buffer[6] << 16 | m_buffer[7] << 24);

          ulong tmpBuffer = ((ulong)hi) << 32 | lo;
          return * ((double *) & tmpBuffer);
      } */

    /* public virtual decimal ReadDecimal() {
        FillBuffer(16);
        try {
            return Decimal.ToDecimal(m_buffer);
        }
        catch (ArgumentException e) {
            // ReadDecimal cannot leak out ArgumentException
            throw new IOException(Environment.GetResourceString("Arg_DecBitCtor"), e);
        }
    } */

    @Virtual
    public ReadString(): string {
        // Contract.Ensures(Contract.Result<String>() != null);

        if (this.m_stream == null) {
            throw new Exception('FileNotOpen');
        }

        let currPos: int = 0;
        let n: int;
        let stringLength: int;
        let readLength: int;
        let charsRead: int;

        // Length of the string in bytes, not chars
        stringLength = this.Read7BitEncodedInt();
        if (stringLength < 0) {
            throw new IOException(Environment.GetResourceString("IO.IO_InvalidStringLen_Len", stringLength));
        }

        if (stringLength == 0) {
            return TString.Empty;
        }

        if (this.m_charBytes == null) {
            this.m_charBytes = New.ByteArray(BinaryReader.MaxCharBytesSize);
        }

        if (this.m_charBuffer == null) {
            this.m_charBuffer = New.CharArray(this.m_maxCharsSize);
        }

        let sb: StringBuilder = null as any;
        do {
            readLength = ((stringLength - currPos) > BinaryReader.MaxCharBytesSize) ? BinaryReader.MaxCharBytesSize : (stringLength - currPos);

            n = this.m_stream.Read(this.m_charBytes, 0, readLength);
            if (n == 0) {
                throw new Exception('EndOfFile');
            }

            charsRead = this.m_decoder.GetChars(this.m_charBytes, 0, n, this.m_charBuffer, 0);

            if (currPos == 0 && n == stringLength)
                return TString.FromCharArray(this.m_charBuffer, 0, charsRead);

            if (sb == null)
                sb = StringBuilderCache.Acquire(stringLength); // Actual string length in chars may be smaller.
            sb.AppendCharArray(this.m_charBuffer, 0, charsRead);
            currPos += n;

        } while (currPos < stringLength);

        return StringBuilderCache.GetStringAndRelease(sb);
    }


    public /* virtual */ Read(): int;
    public /* virtual */ Read(buffer: CharArray, index: int, count: int): int;
    public /* virtual */ Read(buffer: ByteArray, index: int, count: int): int;
    public /* virtual */ Read(...args: any[]): int {
        if (args.length === 0) {
            //Contract.Ensures(Contract.Result<int>() >= -1);

            if (this.m_charBuffer == null)
                this.m_charBuffer = New.CharArray(BinaryReader.MaxBufferSize);

            const count: int = this.Read(this.m_charBuffer, 0, 1);
            if (count === 0) {
                /* No chars available */
                return -1;
            }

            return this.m_charBuffer[0];
        } else if (args.length === 3 && is.CharArray(args[0]) && is.int(args[1]) && is.int(args[2])) {
            const buffer: CharArray = args[0];
            const index: int = args[1];
            const count: int = args[2];
            if (this.m_stream == null) {

                if (this.m_disposed)
                    throw new ObjectDisposedException("BinaryReader", "Cannot read from a closed BinaryReader.");

                throw new IOException("Stream is invalid");
            }

            if (buffer == null) {
                throw new ArgumentNullException("buffer is null");
            }
            if (index < 0) {
                throw new ArgumentOutOfRangeException("index is less than 0");
            }
            if (count < 0) {
                throw new ArgumentOutOfRangeException("count is less than 0");
            }
            if (buffer.length - index < count) {
                throw new ArgumentException("buffer is too small");
            }

            const bytes_read: Out<int> = New.Out();
            return this.ReadCharBytes(buffer, index, count, bytes_read);
        } else if (args.length === 3 && is.ByteArray(args[0]) && is.int(args[1]) && is.int(args[2])) {
            const buffer: ByteArray = args[0];
            const index: int = args[1];
            const count: int = args[2];
            if (buffer == null)
                throw new ArgumentNullException("buffer", Environment.GetResourceString("ArgumentNull_Buffer"));
            if (index < 0)
                throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
            if (count < 0)
                throw new ArgumentOutOfRangeException("count", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
            if (buffer.length - index < count)
                throw new ArgumentException(Environment.GetResourceString("Argument_InvalidOffLen"));
            /* Contract.Ensures(Contract.Result<int>() >= 0);
            Contract.Ensures(Contract.Result<int>() <= count);
            Contract.EndContractBlock(); */

            if (this.m_stream == null) throw new Exception('FileNotOpen');
            return this.m_stream.Read(buffer, index, count);
        }
        throw new ArgumentOutOfRangeException('');
    }

    @Virtual
    public ReadChars(count: int): CharArray {
        if (count < 0) {
            throw new ArgumentOutOfRangeException("count is less than 0");
        }

        if (this.m_stream == null) {
            if (this.m_disposed)
                throw new ObjectDisposedException("BinaryReader", "Cannot read from a closed BinaryReader.");

            throw new IOException("Stream is invalid");
        }

        if (count == 0)
            return New.CharArray(0);

        const full: CharArray = New.CharArray(count);
        let bytes_read: Out<int> = New.Out();
        const chars: int = this.ReadCharBytes(full, 0, count, bytes_read);

        if (chars === 0)
            throw new EndOfStreamException();

        if (chars != count) {
            var new_buffer = New.CharArray(chars);
            TArray.Copy(full, 0, new_buffer, 0, 2 * chars);
            return new_buffer;
        }

        return full;
    }

    private ReadCharBytes(buffer: CharArray, index: int, count: int, bytes_read: Out<int>): int {
        let chars_read: int = 0;
        bytes_read.value = 0;

        while (chars_read < count) {
            let pos: int = 0;
            while (true) {
                this.CheckBuffer(pos + 1);

                const read_byte: int = this.m_stream.ReadByte();

                if (read_byte === -1)
                    /* EOF */
                    return chars_read;

                this.m_buffer[pos++] = Convert.ToByte(read_byte);
                bytes_read.value++;

                const n: int = this.m_encoding.GetChars(this.m_buffer, 0, pos, buffer, index + chars_read);
                if (n > 0)
                    break;
            }
            chars_read++;
        }

        return chars_read;
    }

    @Virtual
    public ReadBytes(count: int): ByteArray {
        if (count < 0) throw new ArgumentOutOfRangeException("count", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
        /*  Contract.Ensures(Contract.Result<byte[]>() != null);
         Contract.Ensures(Contract.Result<byte[]>().Length <= Contract.OldValue(count));
         Contract.EndContractBlock(); */
        if (this.m_stream == null) throw new Exception('FileNotOpen');

        if (count === 0) {
            return New.ByteArray(0);
        }

        let result: ByteArray = New.ByteArray(count);

        let numRead: int = 0;
        do {
            const n: int = this.m_stream.Read(result, numRead, count);
            if (n === 0) {
                break;
            }
            numRead += n;
            count -= n;
        } while (count > 0);

        if (numRead !== result.length) {
            // Trim array.  This should happen on EOF & possibly net streams.
            const copy: ByteArray = New.ByteArray(numRead);
            TArray.Copy(result, 0, copy, 0, numRead);
            result = copy;
        }

        return result;
    }

    @Virtual
    protected FillBuffer(numBytes: int): void {
        if (this.m_buffer != null && (numBytes < 0 || numBytes > this.m_buffer.length)) {
            throw new ArgumentOutOfRangeException("numBytes", Environment.GetResourceString("ArgumentOutOfRange_BinaryReaderFillBuffer"));
        }
        let bytesRead: int = 0;
        let n: int = 0;

        if (this.m_stream == null) throw new Exception('FileNotOpen');

        // Need to find a good threshold for calling ReadByte() repeatedly
        // vs. calling Read(byte[], int, int) for both buffered & unbuffered
        // streams.
        if (numBytes === 1) {
            n = this.m_stream.ReadByte();
            if (n == -1)
                throw new Exception('EndOfFile');
            this.m_buffer[0] = Convert.ToByte(n);
            return;
        }

        do {
            n = this.m_stream.Read(this.m_buffer, bytesRead, numBytes - bytesRead);
            if (n == 0) {
                throw new Exception('EndOfFile');
            }
            bytesRead += n;
        } while (bytesRead < numBytes);
    }

    @Internal
    protected Read7BitEncodedInt(): int {
        // Read out an Int32 7 bits at a time.  The high bit
        // of the byte when on means to continue reading more bytes.
        let count: int = 0;
        let shift: int = 0;
        let b: byte;
        do {
            // Check for a corrupted stream.  Read a max of 5 bytes.
            // In a future version, add a DataFormatException.
            if (shift == 5 * 7)  // 5 bytes max per Int32, shift += 7
                throw new FormatException(Environment.GetResourceString("Format_Bad7BitInt32"));

            // ReadByte handles end of stream cases for us.
            b = this.ReadByte();
            count |= (b & 0x7F) << shift;
            shift += 7;
        } while ((b & 0x80) !== 0);
        return count;
    }

    private CheckBuffer(length: int): void {
        if (this.m_buffer.length <= length) {
            const new_buffer: ByteArray = New.ByteArray(length);
            TArray.Copy(this.m_buffer, 0, new_buffer, 0, this.m_buffer.length);
            this.m_buffer = new_buffer;
        }
    }
}