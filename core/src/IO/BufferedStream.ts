import { byte } from "../byte";
import { ObjectDisposedException } from "../Disposable/ObjectDisposedException";
import { ArgumentException } from "../Exceptions/ArgumentException";
import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { ArgumentOutOfRangeException } from "../Exceptions/ArgumentOutOfRangeException";
import { NotSupportedException } from "../Exceptions/NotSupportedException";
import { ByteArray, int, New } from "../float";
import { Override } from "../Reflection/Decorators/ClassInfo";
import { IOException } from "./IOException";
import { SeekOrigin } from "./SeekOrigin";
import { Stream } from "./Stream";
import { TArray } from '../Extensions/TArray';

export class BufferedStream extends Stream {
    private m_stream: Stream = null as any;
    private m_buffer: ByteArray = null as any;
    private m_buffer_pos: int = 0;
    private m_buffer_read_ahead: int = 0;
    private m_buffer_reading: boolean = false;
    private disposed: boolean = false;

    /*  public BufferedStream(Stream stream): this (stream, 4096)
         {
     } */

    public constructor(stream: Stream, bufferSize: int = 4096) {
        super();
        if (stream == null)
            throw new ArgumentNullException("stream");
        // LAMESPEC: documented as < 0
        if (bufferSize <= 0)
            throw new ArgumentOutOfRangeException("bufferSize", "<= 0");
        if (!stream.CanRead && !stream.CanWrite) {
            throw new ObjectDisposedException(
                ("Cannot access a closed Stream."));
        }

        this.m_stream = stream;
        this.m_buffer = New.ByteArray(bufferSize);
    }

    @Override
    protected Get_CanRead(): boolean {
        return this.m_stream.CanRead;
    }

    @Override
    protected Get_CanWrite(): boolean {
        return this.m_stream.CanWrite;
    }

    @Override
    protected Get_CanSeek(): boolean {
        return this.m_stream.CanSeek;
    }

    @Override
    protected Get_Length(): int {
        this.Flush();
        return this.m_stream.Length;
    }

    @Override
    protected Get_Position(): int {
        this.CheckObjectDisposedException();
        return this.m_stream.Position - this.m_buffer_read_ahead + this.m_buffer_pos;
    }
    @Override
    protected Set_Position(value: int) {
        if (value < this.Position && (this.Position - value <= this.m_buffer_pos) && this.m_buffer_reading) {
            this.m_buffer_pos -= (this.Position - value);
        }
        else if (value > this.Position && (value - this.Position < this.m_buffer_read_ahead - this.m_buffer_pos) && this.m_buffer_reading) {
            this.m_buffer_pos += (value - this.Position);
        }
        else {
            this.Flush();
            this.m_stream.Position = value;
        }
    }


    @Override
    protected dispose(disposing: boolean): void {
        if (this.disposed)
            return;
        if (this.m_buffer != null)
            this.Flush();

        this.m_stream.Close();
        this.m_buffer = null as any;
        this.disposed = true as any;
    }

    @Override
    public Flush(): void {
        this.CheckObjectDisposedException();

        if (this.m_buffer_reading) {
            if (this.CanSeek)
                this.m_stream.Position = this.Position;
        } else if (this.m_buffer_pos > 0) {
            this.m_stream.Write(this.m_buffer, 0, this.m_buffer_pos);
        }

        this.m_buffer_read_ahead = 0;
        this.m_buffer_pos = 0;
    }

    @Override
    public Seek(offset: int, origin: SeekOrigin): int {
        this.CheckObjectDisposedException();
        if (!this.CanSeek) {
            throw new NotSupportedException(
                ("Non seekable stream."));
        }
        this.Flush();
        return this.m_stream.Seek(offset, origin);
    }

    @Override
    public SetLength(value: int): void {
        this.CheckObjectDisposedException();

        if (value < 0)
            throw new ArgumentOutOfRangeException("value must be positive");

        if (!this.m_stream.CanWrite && !this.m_stream.CanSeek)
            throw new NotSupportedException("the stream cannot seek nor write.");

        if ((this.m_stream == null) || (!this.m_stream.CanRead && !this.m_stream.CanWrite))
            throw new IOException("the stream is not open");

        this.m_stream.SetLength(value);
        if (this.Position > value)
            this.Position = value;
    }

    @Override
    public ReadByte(): int {
        this.CheckObjectDisposedException();

        if (!this.m_stream.CanRead) {
            throw new NotSupportedException(
                ("Cannot read from stream"));
        }

        if (!this.m_buffer_reading) {
            this.Flush();
            this.m_buffer_reading = true;
        }

        if (1 <= this.m_buffer_read_ahead - this.m_buffer_pos) {
            return this.m_buffer[this.m_buffer_pos++];
        }
        else {
            if (this.m_buffer_pos >= this.m_buffer_read_ahead) {
                this.m_buffer_pos = 0;
                this.m_buffer_read_ahead = 0;
            }

            this.m_buffer_read_ahead = this.m_stream.Read(this.m_buffer, 0, this.m_buffer.length);
            if (1 <= this.m_buffer_read_ahead) {
                return this.m_buffer[this.m_buffer_pos++];
            } else {
                return -1;
            }
        }
    }

    @Override
    public WriteByte(value: byte): void {
        this.CheckObjectDisposedException();
        if (!this.m_stream.CanWrite) {
            throw new NotSupportedException(
                ("Cannot write to stream"));
        }

        if (this.m_buffer_reading) {
            this.Flush();
            this.m_buffer_reading = false;
        }
        else
            // reordered to avoid possible integer overflow
            if (this.m_buffer_pos >= this.m_buffer.length - 1) {
                this.Flush();
            }

        this.m_buffer[this.m_buffer_pos++] = value;
    }

    @Override
    public Read(array: ByteArray, offset: int, count: int): int {
        if (array == null)
            throw new ArgumentNullException("array");
        this.CheckObjectDisposedException();
        if (!this.m_stream.CanRead) {
            throw new NotSupportedException(("Cannot read from stream"));
        }
        if (offset < 0)
            throw new ArgumentOutOfRangeException("offset", "< 0");
        if (count < 0)
            throw new ArgumentOutOfRangeException("count", "< 0");
        // re-ordered to avoid possible integer overflow
        if (array.length - offset < count)
            throw new ArgumentException("array.Length - offset < count");

        if (!this.m_buffer_reading) {
            this.Flush();
            this.m_buffer_reading = true;
        }

        if (count <= this.m_buffer_read_ahead - this.m_buffer_pos) {
            TArray.Copy(this.m_buffer, this.m_buffer_pos, array, offset, count);

            this.m_buffer_pos += count;
            if (this.m_buffer_pos === this.m_buffer_read_ahead) {
                this.m_buffer_pos = 0;
                this.m_buffer_read_ahead = 0;
            }

            return count;
        }

        let ret: int = this.m_buffer_read_ahead - this.m_buffer_pos;
        TArray.Copy(this.m_buffer, this.m_buffer_pos, array, offset, ret);
        this.m_buffer_pos = 0;
        this.m_buffer_read_ahead = 0;
        offset += ret;
        count -= ret;

        if (count >= this.m_buffer.length) {
            ret += this.m_stream.Read(array, offset, count);
        } else {
            this.m_buffer_read_ahead = this.m_stream.Read(this.m_buffer, 0, this.m_buffer.length);

            if (count < this.m_buffer_read_ahead) {
                TArray.Copy(this.m_buffer, 0, array, offset, count);
                this.m_buffer_pos = count;
                ret += count;
            } else {
                TArray.Copy(this.m_buffer, 0, array, offset, this.m_buffer_read_ahead);
                ret += this.m_buffer_read_ahead;
                this.m_buffer_read_ahead = 0;
            }
        }

        return ret;
    }

    @Override
    public Write(array: ByteArray, offset: int, count: int): void {
        if (array == null)
            throw new ArgumentNullException("array");
        this.CheckObjectDisposedException();
        if (!this.m_stream.CanWrite) {
            throw new NotSupportedException(
                ("Cannot write to stream"));
        }
        if (offset < 0)
            throw new ArgumentOutOfRangeException("offset", "< 0");
        if (count < 0)
            throw new ArgumentOutOfRangeException("count", "< 0");
        // avoid possible integer overflow
        if (array.length - offset < count)
            throw new ArgumentException("array.Length - offset < count");

        if (this.m_buffer_reading) {
            this.Flush();
            this.m_buffer_reading = false;
        }

        // reordered to avoid possible integer overflow
        if (this.m_buffer_pos >= this.m_buffer.length - count) {
            this.Flush();
            this.m_stream.Write(array, offset, count);
        }
        else {
            TArray.Copy(array, offset, this.m_buffer, this.m_buffer_pos, count);
            this.m_buffer_pos += count;
        }
    }

    private CheckObjectDisposedException(): void {
        if (this.disposed) {
            throw new ObjectDisposedException("BufferedStream", ("Stream is closed"));
        }
    }
}