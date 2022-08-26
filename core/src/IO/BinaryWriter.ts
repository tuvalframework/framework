import { TObject } from '../Extensions/TObject';
import { Stream } from './Stream';
import { Encoding } from '../Encoding/Encoding';
import { ByteArray, char, int, New, CharArray, decimal, short, long, sbyte, float, ushort, uint } from '../float';
import { ArgumentNullException } from '../Exceptions/ArgumentNullException';
import { ArgumentException } from '../Exceptions/ArgumentException';
import { UTF8Encoding } from '../Encoding/UTF8Encoding';
import { is } from '../is';
import { System } from '../SystemTypes';
import { Virtual } from '../Reflection/Decorators/ClassInfo';
import { SeekOrigin } from './SeekOrigin';
import { ObjectDisposedException } from '../Disposable/ObjectDisposedException';
import { Convert } from '../convert';
import { byte } from '../byte';
import { BitConverter } from '../BitConverter';
import { IDisposable } from '../Disposable';
export class BinaryWriter extends TObject implements IDisposable {

    // Null is a BinaryWriter with no backing store.
    public static readonly Null: BinaryWriter = new BinaryWriter();
    private readonly leave_open: boolean = false;
    protected OutStream: Stream = null as any;
    private m_encoding: Encoding = null as any;
    private buffer: ByteArray = null as any;
    private stringBuffer: ByteArray = null as any;
    private maxCharsPerRound: int = 0;
    private disposed: boolean = false;

    public constructor();
    public constructor(input: Stream);
    public constructor(input: Stream, encoding: Encoding);
    public constructor(input: Stream, encoding: Encoding, leaveOpen: boolean);
    public constructor(...args: any[]) {
        super();
        if (args.length === 0) {
            this.constructor2(Stream.Null, new UTF8Encoding());
        } else if (arguments.length === 1 && is.typeof<Stream>(args[0], System.Types.IO.Stream)) {
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

    public constructor3(output: Stream, encoding: Encoding, leaveOpen: boolean) {
        if (output == null)
            throw new ArgumentNullException("output");
        if (encoding == null)
            throw new ArgumentNullException("encoding");
        if (!output.CanWrite)
            throw new ArgumentException(("Stream does not support writing or already closed."));

        (this as any).leave_open = leaveOpen;
        this.OutStream = output;
        this.m_encoding = encoding;
        this.buffer = New.ByteArray(16);
    }

    @Virtual
    protected Get_BaseStream(): Stream {
        this.Flush();
        return this.OutStream;
    }
    public get BaseStream(): Stream {
        return this.Get_BaseStream();
    }

    @Virtual
    public Close(): void {
        this.dispose(true);
    }



    @Virtual
    protected dispose(disposing: boolean): void {
        if (disposing && this.OutStream != null && !this.leave_open)
            this.OutStream.Close();

        this.buffer = null as any;
        this.m_encoding = null as any;
        this.disposed = true as any;
    }

    @Virtual
    public Flush(): void {
        this.OutStream.Flush();
    }

    @Virtual
    public Seek(offset: int, origin: SeekOrigin): int {

        return this.OutStream.Seek(offset, origin);
    }

    @Virtual
    public WriteBoolean(value: boolean): void {

        if (this.disposed)
            throw new ObjectDisposedException("BinaryWriter", "Cannot write to a closed BinaryWriter");

        this.buffer[0] = Convert.ToByte(value ? 1 : 0);
        this.OutStream.Write(this.buffer, 0, 1);
    }

    @Virtual
    public WriteByte(value: byte): void {

        if (this.disposed)
            throw new ObjectDisposedException("BinaryWriter", "Cannot write to a closed BinaryWriter");

        this.OutStream.WriteByte(value);
    }


    // @Virtual
    public WriteByteArray(buffer: ByteArray): void;
    public WriteByteArray(buffer: ByteArray, index: int, count: int): void;
    public WriteByteArray(...args: any[]): void {
        if (args.length === 1 && is.ByteArray(args[0])) {
            const buffer: ByteArray = args[0];
            if (this.disposed)
                throw new ObjectDisposedException("BinaryWriter", "Cannot write to a closed BinaryWriter");

            if (buffer == null)
                throw new ArgumentNullException("buffer");
            this.OutStream.Write(buffer, 0, buffer.length);
        } else if (args.length === 3 && is.ByteArray(args[0]) && is.int(args[1]) && is.int(args[2])) {
            const buffer: ByteArray = args[0];
            const index: int = args[1];
            const count: int = args[2];
            if (this.disposed)
                throw new ObjectDisposedException("BinaryWriter", "Cannot write to a closed BinaryWriter");

            if (buffer == null)
                throw new ArgumentNullException("buffer");
            this.OutStream.Write(buffer, index, count);
        }
    }

    @Virtual
    public WriteChar(ch: char): void {

        if (this.disposed)
            throw new ObjectDisposedException("BinaryWriter", "Cannot write to a closed BinaryWriter");

        const dec: CharArray = New.CharArray(1);
        dec[0] = ch;
        const enc: ByteArray = this.m_encoding.GetBytes(dec, 0, 1);
        this.OutStream.Write(enc, 0, enc.length);
    }

    //@Virtual
    public WriteCharArray(chars: CharArray): void;
    public WriteCharArray(chars: CharArray, index: int, count: int): void ;
    public WriteCharArray(...args: any[]): void {
        if (args.length === 1 && is.CharArray(args[0])) {
            const chars: CharArray = args[0];

            if (this.disposed)
                throw new ObjectDisposedException("BinaryWriter", "Cannot write to a closed BinaryWriter");

            if (chars == null)
                throw new ArgumentNullException("chars");
            const enc: ByteArray = this.m_encoding.GetBytes(chars, 0, chars.length);
            this.OutStream.Write(enc, 0, enc.length);
        } else if (args.length === 3 && is.CharArray(args[0]) && is.int(args[1]) && is.int(args[2])) {
            const chars: CharArray = args[0];
            const index: int = args[1];
            const count: int = args[2];
            if (this.disposed)
            throw new ObjectDisposedException("BinaryWriter", "Cannot write to a closed BinaryWriter");

        if (chars == null)
            throw new ArgumentNullException("chars");
        const enc: ByteArray = this.m_encoding.GetBytes(chars, index, count);
        this.OutStream.Write(enc, 0, enc.length);
        }
    }


    /*   @Virtual
      public   Write( value:decimal):void {

      if (this.disposed)
          throw new ObjectDisposedException("BinaryWriter", "Cannot write to a closed BinaryWriter");

          value.
      byte * value_ptr = (byte *) & value; */

    /*
     * decimal in stream is lo32, mi32, hi32, ss32
     * but its internal structure si ss32, hi32, lo32, mi32
     */

    /*   if (BitConverter.IsLittleEndian) {
          for (int i = 0; i < 16; i++) {
              if (i < 4)
                  buffer[i + 12] = value_ptr[i];
              else if (i < 8)
                  buffer[i + 4] = value_ptr[i];
              else if (i < 12)
                  buffer[i - 8] = value_ptr[i];
              else
                  buffer[i - 8] = value_ptr[i];
          }
      } else {
          for (int i = 0; i < 16; i++) {
              if (i < 4)
                  buffer[15 - i] = value_ptr[i];
              else if (i < 8)
                  buffer[15 - i] = value_ptr[i];
              else if (i < 12)
                  buffer[11 - i] = value_ptr[i];
              else
                  buffer[19 - i] = value_ptr[i];
          }
      }

      OutStream.Write(buffer, 0, 16);
  }

                  public virtual void Write(double value) {

      if (disposed)
          throw new ObjectDisposedException("BinaryWriter", "Cannot write to a closed BinaryWriter");

      OutStream.Write(BitConverterLE.GetBytes(value), 0, 8);
  } */

    @Virtual
    public WriteShort(value: short): void {

        if (this.disposed)
            throw new ObjectDisposedException("BinaryWriter", "Cannot write to a closed BinaryWriter");

        this.buffer[0] = Convert.ToByte(value);
        this.buffer[1] = Convert.ToByte(value >>> 8);
        this.OutStream.Write(this.buffer, 0, 2);
    }

    @Virtual
    public WriteInt(value: int): void {

        if (this.disposed)
            throw new ObjectDisposedException("BinaryWriter", "Cannot write to a closed BinaryWriter");

        this.buffer[0] = Convert.ToByte(value);
        this.buffer[1] = Convert.ToByte(value >>> 8);
        this.buffer[2] = Convert.ToByte(value >>> 16);
        this.buffer[3] = Convert.ToByte(value >>> 24);
        this.OutStream.Write(this.buffer, 0, 4);
    }

    @Virtual
    public WriteLong(value: long): void {

        if (this.disposed)
            throw new ObjectDisposedException("BinaryWriter", "Cannot write to a closed BinaryWriter");

        for (let i: int = 0, sh = 0; i < 8; i++, sh += 8)
            this.buffer[i] = Convert.ToByte(value.shr(sh).toNumber());
        this.OutStream.Write(this.buffer, 0, 8);
    }

    @Virtual
    public WriteSByte(value: sbyte): void {

        if (this.disposed)
            throw new ObjectDisposedException("BinaryWriter", "Cannot write to a closed BinaryWriter");

        this.buffer[0] = Convert.ToByte(value);
        this.OutStream.Write(this.buffer, 0, 1);
    }

    @Virtual
    public WriteFloat(value: float): void {

        if (this.disposed)
            throw new ObjectDisposedException("BinaryWriter", "Cannot write to a closed BinaryWriter");

        this.OutStream.Write(BitConverter.GetFloatBytes(value), 0, 4);
    }

    @Virtual
    public WriteString(value: string): void {

        if (this.disposed)
            throw new ObjectDisposedException("BinaryWriter", "Cannot write to a closed BinaryWriter");

        const len: int = this.m_encoding.GetByteCount(value);
        this.Write7BitEncodedInt(len);

        if (this.stringBuffer == null) {
            this.stringBuffer = New.ByteArray(512);
            this.maxCharsPerRound = Convert.ToInt32(512 / this.m_encoding.GetMaxByteCount(1));
        }

        let chpos: int = 0;
        let chrem: int = value.length;
        while (chrem > 0) {
            let cch: int = (chrem > this.maxCharsPerRound) ? this.maxCharsPerRound : chrem;
            let blen: int = this.m_encoding.GetBytes(value, chpos, cch, this.stringBuffer, 0);
            this.OutStream.Write(this.stringBuffer, 0, blen);

            chpos += cch;
            chrem -= cch;
        }
    }

    @Virtual
    public WriteUShort(value: ushort): void {

        if (this.disposed)
            throw new ObjectDisposedException("BinaryWriter", "Cannot write to a closed BinaryWriter");

        this.buffer[0] = Convert.ToByte(value);
        this.buffer[1] = Convert.ToByte(value >>> 8);
        this.OutStream.Write(this.buffer, 0, 2);
    }

    @Virtual
    public WriteUInt(value: uint): void {

        if (this.disposed)
            throw new ObjectDisposedException("BinaryWriter", "Cannot write to a closed BinaryWriter");

        this.buffer[0] = Convert.ToByte(value);
        this.buffer[1] = Convert.ToByte(value >>> 8);
        this.buffer[2] = Convert.ToByte(value >>> 16);
        this.buffer[3] = Convert.ToByte(value >>> 24);
        this.OutStream.Write(this.buffer, 0, 4);
    }
    /* @Virtual
                    public  Write(ulong value):void {

        if (disposed)
            throw new ObjectDisposedException("BinaryWriter", "Cannot write to a closed BinaryWriter");

        for (int i = 0, sh = 0; i < 8; i++, sh += 8)
        buffer[i] = (byte)(value >> sh);
        OutStream.Write(buffer, 0, 8);
    }
     */
    protected Write7BitEncodedInt(value: int): void {
        do {
            const high: int = (value >>> 7) & 0x01ffffff;
            let b: byte = Convert.ToByte(value & 0x7f);

            if (high != 0) {
                b = Convert.ToByte(b | 0x80);
            }

            this.WriteByte(b);
            value = high;
        } while (value !== 0);
    }
}