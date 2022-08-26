import { Encoder } from '../Encoding/Encoder';
import { Encoding } from '../Encoding/Encoding';
import { UTF8Encoding } from '../Encoding/UTF8Encoding';
import { Environment } from '../Environment';
import { Exception } from '../Exception';
import { NotImplementedException } from '../Exceptions';
import { ArgumentException } from '../Exceptions/ArgumentException';
import { ArgumentNullException } from '../Exceptions/ArgumentNullException';
import { ArgumentOutOfRangeException } from '../Exceptions/ArgumentOutOfRangeException';
import { is } from '../is';
import { Override, Virtual } from '../Reflection/Decorators/ClassInfo';
import { System } from '../SystemTypes';
import { TString } from '../Text/TString';
import { ByteArray, char, CharArray, int, New } from './../float';
import { TBuffer } from './Buffer/TBuffer';
import { FileAccess } from './FileAccess';
import { FileMode } from './FileMode';
import { FileShare } from './FileShare';
import { FileStream } from './FileStream';
import { Stream } from './Stream';
import { TextWriter } from "./TextWriter";


export class StreamWriter extends TextWriter {
    private static readonly DefaultBufferSize: int = 1024;
    private static readonly DefaultFileStreamBufferSize: int = 4096;
    private static readonly MinBufferSize: int = 128;
    public /* internal */  stream: Stream = null as any;
    private encoding: Encoding = null as any;
    private encoder: Encoder = null as any;
    public /* internal */  byteBuffer: ByteArray = null as any;
    public /* internal */  charBuffer: CharArray = null as any;
    public /* internal */  charPos: int = 0;
    public /* internal */  charLen: int = 0;
    public /* internal */  autoFlush: boolean = false;
    private haveWrittenPreamble: boolean = false;
    private closable: boolean = false;

    @Virtual
    protected Get_AutoFlush(): boolean {
        return this.autoFlush;
    }
    public get AutoFlush(): boolean {
        return this.Get_AutoFlush();
    }

    @Virtual
    protected Set_AutoFlush(value: boolean) {
        this.autoFlush = value;
        if (value) {
            this.FlushInternal(true, false);
        }
    }
    public set AutoFlush(value: boolean) {
        this.Set_AutoFlush(value);
    }

    @Virtual
    protected Get_BaseStream(): Stream {
        return this.stream;
    }

    public get BaseStream(): Stream {
        return this.Get_BaseStream();
    }

    public /* internal */ get Closable(): boolean {
        return this.closable;
    }
    public /* internal */ set Closable(value: boolean) {
        this.closable = value;
    }

    @Override
    public Get_Encoding(): Encoding {
        return this.encoding;
    }

    private static  __Null:StreamWriter;
    public static get Null():StreamWriter {
        if (StreamWriter.__Null == null) {
            StreamWriter.__Null = new StreamWriter(Stream.Null, new UTF8Encoding(false, true), 128);
        }
        return StreamWriter.__Null;
    }

    public constructor();
    public constructor(stream: Stream);
    public constructor(stream: Stream, encoding: Encoding);
    public constructor(stream: Stream, encoding: Encoding, bufferSize: int);
    public constructor(path: string);
    public constructor(path: string, append: boolean);
    public constructor(path: string, append: boolean, encoding: Encoding);
    public constructor(path: string, append: boolean, encoding: Encoding, bufferSize: int);
    public constructor(...args: any[]) {
        super();
        if (args.length === 0) {
            this.constructor1();
        } else if (args.length === 1 && is.typeof<Stream>(args[0], System.Types.IO.Stream)) {
            const stream: Stream = args[0];
            this.constructor2(stream);
        } else if (args.length === 2 && is.typeof<Stream>(args[0], System.Types.IO.Stream) && is.typeof<Encoding>(args[1], System.Types.Encoding.Encoding)) {
            const stream: Stream = args[0];
            const encoding: Encoding = args[1];
            this.constructor3(stream, encoding);
        } else if (args.length === 3 && is.typeof<Stream>(args[0], System.Types.IO.Stream) && is.typeof<Encoding>(args[1], System.Types.Encoding.Encoding) && is.int(args[2])) {
            const stream: Stream = args[0];
            const encoding: Encoding = args[1];
            const bufferSize: int = args[2];
            this.constructor4(stream, encoding, bufferSize);
        } else if (args.length === 1 && is.string(args[0])) {
            const path: string = args[0];
            this.constructor5(path);
        } else if (args.length === 2 && is.string(args[0]) && is.boolean(args[1])) {
            const path: string = args[0];
            const append: boolean = args[1];
            this.constructor6(path, append);
        } else if (args.length === 3 && is.string(args[0]) && is.boolean(args[1]) && is.typeof<Encoding>(args[2], System.Types.Encoding.Encoding)) {
            const path: string = args[0];
            const append: boolean = args[1];
            const encoding: Encoding = args[2];
            this.constructor7(path, append, encoding);
        } else if (args.length === 4 && is.string(args[0]) && is.boolean(args[1]) && is.typeof<Encoding>(args[2], System.Types.Encoding.Encoding) && is.int(args[3])) {
            const path: string = args[0];
            const append: boolean = args[1];
            const encoding: Encoding = args[2];
            const bufferSize: int = args[3];
            this.constructor8(path, append, encoding, bufferSize);
        }
    }
    public constructor1() {
    }

    public constructor2(stream: Stream) {
        this.constructor4(stream, new UTF8Encoding(false, true), 1024)
    }

    public constructor3(stream: Stream, encoding: Encoding) {
        this.constructor4(stream, encoding, 1024);
    }

    public constructor4(stream: Stream, encoding: Encoding, bufferSize: int) {
        if (stream == null || encoding == null) {
            throw new ArgumentNullException((stream == null ? "stream" : "encoding"));
        }
        if (!stream.CanWrite) {
            throw new ArgumentException(Environment.GetResourceString("Argument_StreamNotWritable"));
        }
        if (bufferSize <= 0) {
            throw new ArgumentOutOfRangeException(Environment.GetResourceString("ArgumentOutOfRange_NeedPosNum"));
        }
        this.Init(stream, encoding, bufferSize);
    }

    public constructor5(path: string) {
        this.constructor8(path, false, new UTF8Encoding(false, true), 1024);
    }

    public constructor6(path: string, append: boolean) {
        this.constructor8(path, append, new UTF8Encoding(false, true), 1024);
    }

    public constructor7(path: string, append: boolean, encoding: Encoding) {
        this.constructor8(path, append, encoding, 1024);
    }

    public constructor8(path: string, append: boolean, encoding: Encoding, bufferSize: int) {
        if (path == null || encoding == null) {
            throw new ArgumentNullException((path == null ? "path" : "encoding"));
        }
        if (bufferSize <= 0) {
            throw new ArgumentOutOfRangeException(Environment.GetResourceString("ArgumentOutOfRange_NeedPosNum"));
        }
        this.Init(StreamWriter.CreateFile(path, append), encoding, bufferSize);
    }

    @Override
    public Close(): void {
        this.dispose(true);
    }

    private static CreateFile(path: string, append: boolean): Stream {
        //throw new NotImplementedException('CreateFile');
        return new FileStream(path, (append ? FileMode.Append : FileMode.Create), FileAccess.Write, FileShare.Read, 4096);
    }

    @Override
    protected dispose(disposing: boolean): void {
        if (disposing && this.stream != null) {
            this.FlushInternal(true, true);
            if (this.Closable) {
                this.stream.Close();
            }
        }
        if (this.Closable && this.stream != null) {
            this.stream = null as any;
            this.byteBuffer = null as any;
            this.charBuffer = null as any;
            this.encoding = null as any;
            this.encoder = null as any;
            this.charLen = 0 as any;
            //super.dispose(disposing);
        }
    }

    @Override
    protected Finalize(): void {
        try {
            this.dispose(false);
        }
        finally {
            super.Finalize();
        }
    }

    @Override
    public Flush(): void {
        this.FlushInternal(true, true);
    }

    private FlushInternal(flushStream: boolean, flushEncoder: boolean): void {
        if (this.stream == null) {
            //__Error.WriterClosed();
            throw new Exception('WriterClosed');
        }
        if (this.charPos == 0 && !flushStream && !flushEncoder) {
            return;
        }
        if (!this.haveWrittenPreamble) {
            this.haveWrittenPreamble = true;
            const preamble: ByteArray = this.encoding.GetPreamble();
            if (preamble.length > 0) {
                this.stream.Write(preamble, 0, preamble.length);
            }
        }
        const bytes: int = this.encoder.GetBytes(this.charBuffer, 0, this.charPos, this.byteBuffer, 0, flushEncoder);
        this.charPos = 0;
        if (bytes > 0) {
            this.stream.Write(this.byteBuffer, 0, bytes);
        }
        if (flushStream) {
            this.stream.Flush();
        }
    }

    private Init(stream: Stream, encoding: Encoding, bufferSize: int) {
        this.stream = stream;
        this.encoding = encoding;
        this.encoder = encoding.GetEncoder();
        if (bufferSize < 128) {
            bufferSize = 128;
        }
        this.charBuffer = New.CharArray(bufferSize);
        this.byteBuffer = New.ByteArray(encoding.GetMaxByteCount(bufferSize));
        this.charLen = bufferSize;
        if (stream.CanSeek && stream.Position > 0) {
            this.haveWrittenPreamble = true;
        }
        this.closable = true;
    }

    @Override
    public WriteChar(value: char): void {
        if (this.charPos == this.charLen) {
            this.FlushInternal(false, false);
        }
        const chrArray: CharArray = this.charBuffer;
        const streamWriter: StreamWriter = this;
        const int32: int = streamWriter.charPos;
        const int321: int = int32;
        streamWriter.charPos = int32 + 1;
        chrArray[int321] = value;
        if (this.autoFlush) {
            this.FlushInternal(true, false);
        }
    }

    public WriteCharArray(buffer: CharArray): void;
    public WriteCharArray(buffer: CharArray, index: int, count: int): void
    public WriteCharArray(...args: any[]): void {
        if (args.length === 1 && is.CharArray(args[0])) {
            const buffer: CharArray = args[0];
            let int32: int = 0;
            if (buffer == null) {
                return;
            }
            let int321: int = 0;
            for (let i: int = buffer.length; i > 0; i -= int32) {
                if (this.charPos === this.charLen) {
                    this.FlushInternal(false, false);
                }
                int32 = this.charLen - this.charPos;
                if (int32 > i) {
                    int32 = i;
                }
                TBuffer.InternalBlockCopy(buffer, int321 * 2, this.charBuffer, this.charPos * 2, int32 * 2);
                this.charPos += int32;
                int321 += int32;
            }
            if (this.autoFlush) {
                this.FlushInternal(true, false);
            }
        } else if (args.length === 3 && is.CharArray(args[0]) && is.int(args[1]) && is.int(args[2])) {
            const buffer: CharArray = args[0];
            let index: int = args[1];
            let count: int = args[2];
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
            while (count > 0) {
                if (this.charPos == this.charLen) {
                    this.FlushInternal(false, false);
                }
                let int32: int = this.charLen - this.charPos;
                if (int32 > count) {
                    int32 = count;
                }
                TBuffer.InternalBlockCopy(buffer, index * 2, this.charBuffer, this.charPos * 2, int32 * 2);
                this.charPos += int32;
                index += int32;
                count -= int32;
            }
            if (this.autoFlush) {
                this.FlushInternal(true, false);
            }
        }
    }

    @Override
    public Write(value: string): void {
        if (value != null) {
            let length: int = value.length;
            let int32: int = 0;
            while (length > 0) {
                if (this.charPos == this.charLen) {
                    this.FlushInternal(false, false);
                }
                let int321: int = this.charLen - this.charPos;
                if (int321 > length) {
                    int321 = length;
                }
                TString.CopyTo(value, int32, this.charBuffer, this.charPos, int321);
                this.charPos += int321;
                int32 += int321;
                length -= int321;
            }
            if (this.autoFlush) {
                this.FlushInternal(true, false);
            }
        }
    }
}

