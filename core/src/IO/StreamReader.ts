import { int, ByteArray, CharArray, New, char } from '../float';
import { TextReader } from "./TextReader";
import { Decoder } from '../Encoding/Decoder';
import { StringBuilder } from '../Text/StringBuilder';
import { Stream } from './Stream';
import { Encoding } from '../Encoding/Encoding';
import { ArgumentNullException } from '../Exceptions/ArgumentNullException';
import { Path } from './Path';
import { ArgumentException } from '../Exceptions/ArgumentException';
import { ArgumentOutOfRangeException } from '../Exceptions/ArgumentOutOfRangeException';
import { File } from './File';
import { TArray } from '../Extensions/TArray';
import { is } from '../is';
import { System } from '../SystemTypes';
import { Virtual } from '../Reflection';
import { Exception } from '../Exception';
import { Override } from '../Reflection/Decorators/ClassInfo';
import { TString } from '../Text/TString';
import { ObjectDisposedException } from '../Disposable/ObjectDisposedException';

export class StreamReader extends TextReader {
    private static readonly DefaultBufferSize: int = 1024;
    private static readonly DefaultFileBufferSize: int = 4096;
    private static readonly MinimumBufferSize: int = 128;

    //
    // The input buffer
    //
    private input_buffer: ByteArray = null as any;

    // Input buffer ready for recycling
    private static input_buffer_recycle: ByteArray = null as any;

    //
    // The decoded buffer from the above input buffer
    //
    private decoded_buffer: CharArray = null as any;
    static decoded_buffer_recycle: CharArray = null as any;

    private encoding: Encoding = null as any;
    private decoder: Decoder = null as any;
    private line_builder: StringBuilder = null as any;
    private base_stream: Stream = null as any;

    //
    // Decoded bytes in decoded_buffer.
    //
    private decoded_count: int = 0;

    //
    // Current position in the decoded_buffer
    //
    private pos: int = 0;

    //
    // The buffer size that we are using
    //
    private buffer_size: int = 0;
    private do_checks: int = 0;
    private mayBlock: boolean = false;
    public static readonly Null: StreamReader = null as any;
    private static _StaticConstructor() {
        (StreamReader as any).Null = new NullStreamReader();
    }

    public constructor();
    public constructor(stream: Stream);
    public constructor(stream: Stream, detectEncodingFromByteOrderMarks: boolean);
    public constructor(stream: Stream, encoding: Encoding);
    public constructor(stream: Stream, encoding: Encoding, detectEncodingFromByteOrderMarks: boolean);
    public constructor(stream: Stream, encoding: Encoding, detectEncodingFromByteOrderMarks: boolean, bufferSize: int);
    public constructor(path: string);
    public constructor(path: string, detectEncodingFromByteOrderMarks: boolean);
    public constructor(path: string, encoding: Encoding);
    public constructor(path: string, encoding: Encoding, detectEncodingFromByteOrderMarks: boolean);
    public constructor(path: string, encoding: Encoding, detectEncodingFromByteOrderMarks: boolean, bufferSize: int);
    public constructor(...args: any[]) {
        super();
        if (args.length === 0) {
            this.constructor1();
        } else if (args.length === 1 && is.typeof<Stream>(args[0], System.Types.IO.Stream)) {
            const stream: Stream = args[0];
            this.constructor2(stream);
        } else if (args.length === 2 && is.typeof<Stream>(args[0], System.Types.IO.Stream) && is.boolean(args[1])) {
            const stream: Stream = args[0];
            const detectEncodingFromByteOrderMarks: boolean = args[1];
            this.constructor3(stream, detectEncodingFromByteOrderMarks);
        } else if (args.length === 2 && is.typeof<Stream>(args[0], System.Types.IO.Stream) && is.typeof<Encoding>(args[1], System.Types.Encoding.Encoding)) {
            const stream: Stream = args[0];
            const encoding: Encoding = args[1];
            this.constructor4(stream, encoding);
        } else if (args.length === 3 && is.typeof<Stream>(args[0], System.Types.IO.Stream) && is.typeof<Encoding>(args[1], System.Types.Encoding.Encoding) && is.boolean(args[2])) {
            const stream: Stream = args[0];
            const encoding: Encoding = args[1];
            const detectEncodingFromByteOrderMarks: boolean = args[2];
            this.constructor5(stream, encoding, detectEncodingFromByteOrderMarks);
        } else if (args.length === 4 && is.typeof<Stream>(args[0], System.Types.IO.Stream) && is.typeof<Encoding>(args[1], System.Types.Encoding.Encoding) && is.boolean(args[2]) && is.int(args[3])) {
            const stream: Stream = args[0];
            const encoding: Encoding = args[1];
            const detectEncodingFromByteOrderMarks: boolean = args[2];
            const bufferSize: int = args[3];
            this.constructor6(stream, encoding, detectEncodingFromByteOrderMarks, bufferSize);
        } else if (args.length === 1 && is.string(args[0])) {
            const path: string = args[0];
            this.constructor7(path);
        } else if (args.length === 2 && is.string(args[0]) && is.boolean(args[1])) {
            const path: string = args[0];
            const detectEncodingFromByteOrderMarks: boolean = args[1];
            this.constructor8(path, detectEncodingFromByteOrderMarks);
        } else if (args.length === 2 && is.string(args[0]) && is.typeof<Encoding>(args[1], System.Types.Encoding.Encoding)) {
            const path: string = args[0];
            const encoding: Encoding = args[1];
            this.constructor9(path, encoding);
        } else if (args.length === 3 && is.string(args[0]) && is.typeof<Encoding>(args[1], System.Types.Encoding.Encoding) && is.boolean(args[2])) {
            const path: string = args[0];
            const encoding: Encoding = args[1];
            const detectEncodingFromByteOrderMarks: boolean = args[2];
            this.constructor10(path, encoding, detectEncodingFromByteOrderMarks);
        } else if (args.length === 4 && is.string(args[0]) && is.typeof<Encoding>(args[1], System.Types.Encoding.Encoding) && is.boolean(args[2]) && is.int(args[3])) {
            const path: string = args[0];
            const encoding: Encoding = args[1];
            const detectEncodingFromByteOrderMarks: boolean = args[2];
            const bufferSize: int = args[3];
            this.constructor11(path, encoding, detectEncodingFromByteOrderMarks, bufferSize);
        }
    }
    private constructor1() { }
    public constructor2(stream: Stream) {
        this.constructor6(stream, Encoding.UTF8Unmarked, true, StreamReader.DefaultBufferSize);
    }
    public constructor3(stream: Stream, detectEncodingFromByteOrderMarks: boolean) {
        this.constructor6(stream, Encoding.UTF8Unmarked, detectEncodingFromByteOrderMarks, StreamReader.DefaultBufferSize);
    }
    public constructor4(stream: Stream, encoding: Encoding) {
        this.constructor6(stream, encoding, true, StreamReader.DefaultBufferSize)
    }
    public constructor5(stream: Stream, encoding: Encoding, detectEncodingFromByteOrderMarks: boolean) {
        this.constructor6(stream, encoding, detectEncodingFromByteOrderMarks, StreamReader.DefaultBufferSize);
    }

    private static readonly leave_open: boolean = false;
    public constructor6(stream: Stream, encoding: Encoding, detectEncodingFromByteOrderMarks: boolean, bufferSize: int) {
        this.Initialize(stream, encoding, detectEncodingFromByteOrderMarks, bufferSize);
    }

    public constructor7(path: string) {
        this.constructor11(path, Encoding.UTF8Unmarked, true, StreamReader.DefaultFileBufferSize);
    }

    public constructor8(path: string, detectEncodingFromByteOrderMarks: boolean) {
        this.constructor11(path, Encoding.UTF8Unmarked, detectEncodingFromByteOrderMarks, StreamReader.DefaultFileBufferSize);
    }

    public constructor9(path: string, encoding: Encoding) {
        this.constructor11(path, encoding, true, StreamReader.DefaultFileBufferSize)
    }

    public constructor10(path: string, encoding: Encoding, detectEncodingFromByteOrderMarks: boolean) {
        this.constructor11(path, encoding, detectEncodingFromByteOrderMarks, StreamReader.DefaultFileBufferSize)
    }

    public constructor11(path: string, encoding: Encoding, detectEncodingFromByteOrderMarks: boolean, bufferSize: int) {
        if (null == path)
            throw new ArgumentNullException("path");
        if (String.Empty == path)
            throw new ArgumentException("Empty path not allowed");
        if (path.indexOfAny(TString.FromCharArrayToStringArray(Path.InvalidPathChars)) !== -1)
            throw new ArgumentException("path contains invalid characters");
        if (null == encoding)
            throw new ArgumentNullException("encoding");
        if (bufferSize <= 0)
            throw new ArgumentOutOfRangeException("bufferSize", "The minimum size of the buffer must be positive");

        const stream: Stream = File.OpenRead(path);
        this.Initialize(stream, encoding, detectEncodingFromByteOrderMarks, bufferSize);
    }
    public /* internal */  Initialize(stream: Stream, encoding: Encoding, detectEncodingFromByteOrderMarks: boolean, bufferSize: int): void {
        if (null == stream)
            throw new ArgumentNullException("stream");
        if (null == encoding)
            throw new ArgumentNullException("encoding");
        if (!stream.CanRead)
            throw new ArgumentException("Cannot read stream");
        if (bufferSize <= 0)
            throw new ArgumentOutOfRangeException("bufferSize", "The minimum size of the buffer must be positive");

        if (bufferSize < StreamReader.MinimumBufferSize) {
            bufferSize = StreamReader.MinimumBufferSize;
        }

        // since GetChars() might add flushed character, it
        // should have additional char buffer for extra 1
        // (probably 1 is ok, but might be insufficient. I'm not sure)
        const decoded_buffer_size = encoding.GetMaxCharCount(bufferSize) + 1;

        //
        // Instead of allocating a new default buffer use the
        // last one if there is any available
        //
        if (bufferSize <= StreamReader.DefaultBufferSize && StreamReader.input_buffer_recycle != null) {
            //lock(input_buffer_recycle_lock) {
            if (StreamReader.input_buffer_recycle != null) {
                this.input_buffer = StreamReader.input_buffer_recycle;
                StreamReader.input_buffer_recycle = null as any;
            }

            if (StreamReader.decoded_buffer_recycle != null && decoded_buffer_size <= StreamReader.decoded_buffer_recycle.length) {
                this.decoded_buffer = StreamReader.decoded_buffer_recycle;
                StreamReader.decoded_buffer_recycle = null as any;
            }
            //}
        }

        if (this.input_buffer == null)
            this.input_buffer = New.ByteArray(bufferSize);
        else
            TArray.Clear(this.input_buffer, 0, bufferSize);

        if (this.decoded_buffer == null)
            this.decoded_buffer = New.CharArray(decoded_buffer_size);
        else
            TArray.Clear(this.decoded_buffer, 0, decoded_buffer_size);

        this.base_stream = stream;
        this.buffer_size = bufferSize;
        this.encoding = encoding;
        this.decoder = encoding.GetDecoder();

        const preamble: ByteArray = encoding.GetPreamble();
        this.do_checks = detectEncodingFromByteOrderMarks ? 1 : 0;
        this.do_checks += (preamble.length === 0) ? 0 : 2;

        this.decoded_count = 0;
        this.pos = 0;
    }

    @Virtual
    protected Get_BaseStream(): Stream {
        return this.base_stream;
    }
    public get BaseStream(): Stream {
        return this.Get_BaseStream();;
    }

    @Virtual
    protected Get_CurrentEncoding(): Encoding {
        if (this.encoding == null)
            throw new Exception('');
        return this.encoding;
    }

    public get CurrentEncoding(): Encoding {
        return this.Get_CurrentEncoding();
    }

    public get EndOfStream(): boolean {
        return this.Peek() < 0;
    }

    @Override
    public Close(): void {
        this.dispose(true);
    }

    @Override
    protected dispose(disposing: boolean): void {
        if (disposing && this.base_stream != null && !StreamReader.leave_open)
            this.base_stream.Close();

        if (this.input_buffer != null && this.input_buffer.length == StreamReader.DefaultBufferSize && StreamReader.input_buffer_recycle == null) {
            // lock(input_buffer_recycle_lock) {
            if (StreamReader.input_buffer_recycle == null) {
                StreamReader.input_buffer_recycle = this.input_buffer;
            }

            if (StreamReader.decoded_buffer_recycle == null) {
                StreamReader.decoded_buffer_recycle = this.decoded_buffer;
            }
            // }
        }

        this.input_buffer = null as any;
        this.decoded_buffer = null as any;
        this.encoding = null as any;
        this.decoder = null as any;
        this.base_stream = null as any;
        super.dispose(disposing);
    }

    //
    // Provides auto-detection of the encoding, as well as skipping over
    // byte marks at the beginning of a stream.
    //
    private DoChecks(count: int): int {
        if ((this.do_checks & 2) === 2) {
            const preamble: ByteArray = this.encoding.GetPreamble();
            const c: int = preamble.length;
            if (count >= c) {
                let i: int;

                for (i = 0; i < c; i++)
                    if (this.input_buffer[i] !== preamble[i])
                        break;

                if (i == c)
                    return i;
            }
        }

        if ((this.do_checks & 1) === 1) {
            if (count < 2)
                return 0;

            if (this.input_buffer[0] === 0xfe && this.input_buffer[1] === 0xff) {
                this.encoding = Encoding.BigEndianUnicode;
                return 2;
            }
            if (this.input_buffer[0] === 0xff && this.input_buffer[1] === 0xfe && count < 4) {
                // If we don't have enough bytes we can't check for UTF32, so use Unicode
                this.encoding = Encoding.Unicode;
                return 2;
            }

            if (count < 3)
                return 0;

            if (this.input_buffer[0] === 0xef && this.input_buffer[1] === 0xbb && this.input_buffer[2] === 0xbf) {
                this.encoding = Encoding.UTF8Unmarked;
                return 3;
            }

            if (count < 4) {
                if (this.input_buffer[0] === 0xff && this.input_buffer[1] === 0xfe && this.input_buffer[2] !== 0) {
                    this.encoding = Encoding.Unicode;
                    return 2;
                }
                return 0;
            }

            if (this.input_buffer[0] === 0 && this.input_buffer[1] === 0 && this.input_buffer[2] === 0xfe && this.input_buffer[3] === 0xff) {
                this.encoding = Encoding.BigEndianUTF32;
                return 4;
            }

            if (this.input_buffer[0] === 0xff && this.input_buffer[1] === 0xfe) {
                if (this.input_buffer[2] === 0 && this.input_buffer[3] === 0) {
                    this.encoding = Encoding.UTF32;
                    return 4;
                }

                this.encoding = Encoding.Unicode;
                return 2;
            }
        }

        return 0;
    }

    public DiscardBufferedData(): void {
        this.CheckState();

        this.pos = this.decoded_count = 0;
        this.mayBlock = false;
        // Discard internal state of the decoder too.
        this.decoder = this.encoding.GetDecoder();
    }

    // the buffer is empty, fill it again
    // Keep in sync with ReadBufferAsync
    private ReadBuffer(): int {
        this.pos = 0;

        // keep looping until the decoder gives us some chars
        this.decoded_count = 0;
        do {
            var cbEncoded = this.base_stream.Read(this.input_buffer, 0, this.buffer_size);
            if (cbEncoded <= 0)
                return 0;

            this.decoded_count = this.ReadBufferCore(cbEncoded);
        } while (this.decoded_count === 0);

        return this.decoded_count;
    }

    private ReadBufferCore(cbEncoded: int): int {
        let parse_start: int = 0;

        this.mayBlock = cbEncoded < this.buffer_size;
        if (this.do_checks > 0) {
            const old: Encoding = this.encoding;
            parse_start = this.DoChecks(cbEncoded);
            if (!old.Equals(this.encoding)) {
                const old_decoded_size: int = old.GetMaxCharCount(this.buffer_size) + 1;
                const new_decoded_size: int = this.encoding.GetMaxCharCount(this.buffer_size) + 1;
                if (old_decoded_size !== new_decoded_size)
                    this.decoded_buffer = New.CharArray(new_decoded_size);
                this.decoder = this.encoding.GetDecoder();
            }
            this.do_checks = 0;
            cbEncoded -= parse_start;
        } else {
            parse_start = 0;
        }

        return this.decoder.GetChars(this.input_buffer, parse_start, cbEncoded, this.decoded_buffer, 0);
    }


    @Override
    public Peek(): int {
        this.CheckState();

        if (this.pos >= this.decoded_count && this.ReadBuffer() === 0)
            return -1;

        return this.decoded_buffer[this.pos];
    }

    //
    // Used internally by our console, as it previously depended on Peek() being a
    // routine that would not block.
    //
    public /* internal */  DataAvailable(): boolean {
        return this.pos < this.decoded_count;
    }

    public /* override */ Read(): int;
    public /* override */  Read(buffer: CharArray, index: int, count: int): int;
    public Read(...args: any[]): int {
        if (args.length === 0) {
            this.CheckState();

            if (this.pos >= this.decoded_count && this.ReadBuffer() === 0)
                return -1;

            return this.decoded_buffer[this.pos++];
        } else if (args.length === 3 && is.CharArray(args[0]) && is.int(args[1]) && is.int(args[2])) {
            const buffer: CharArray = args[0];
            let index: int = args[1];
            let count: int = args[2];
            if (buffer == null)
                throw new ArgumentNullException("buffer");
            if (index < 0)
                throw new ArgumentOutOfRangeException("index", "< 0");
            if (count < 0)
                throw new ArgumentOutOfRangeException("count", "< 0");
            // re-ordered to avoid possible integer overflow
            if (index > buffer.length - count)
                throw new ArgumentException("index + count > buffer.Length");

            this.CheckState();

            let chars_read: int = 0;
            while (count > 0) {
                if (this.pos >= this.decoded_count && this.ReadBuffer() === 0)
                    return chars_read > 0 ? chars_read : 0;

                const cch: int = Math.min(this.decoded_count - this.pos, count);
                TArray.Copy(this.decoded_buffer, this.pos, buffer, index, cch);
                this.pos += cch;
                index += cch;
                count -= cch;
                chars_read += cch;
                if (this.mayBlock)
                    break;
            }
            return chars_read;
        }
        throw new ArgumentOutOfRangeException('');
    }

    private foundCR: boolean = false;
    private FindNextEOL(): int {
        let c: char = '\0'.charCodeAt(0);
        for (; this.pos < this.decoded_count; this.pos++) {
            c = this.decoded_buffer[this.pos];
            if (c === '\n'.charCodeAt(0)) {
                this.pos++;
                let res: int = (this.foundCR) ? (this.pos - 2) : (this.pos - 1);
                if (res < 0)
                    res = 0; // if a new buffer starts with a \n and there was a \r at
                // the end of the previous one, we get here.
                this.foundCR = false;
                return res;
            } else if (this.foundCR) {
                this.foundCR = false;
                if (this.pos === 0)
                    return -2; // Need to flush the current buffered line.
                // This is a \r at the end of the previous decoded buffer that
                // is not followed by a \n in the current decoded buffer.
                return this.pos - 1;
            }

            this.foundCR = (c === '\r'.charCodeAt(0));
        }
        return -1;
    }


    // Keep in sync with ReadLineAsync
    @Override
    public ReadLine(): string {
        this.CheckState();

        if (this.pos >= this.decoded_count && this.ReadBuffer() === 0)
            return null as any;

        let begin: int = this.pos;
        let end: int = this.FindNextEOL();
        if (end < this.decoded_count && end >= begin)
            return TString.FromCharArray(this.decoded_buffer, begin, end - begin);
        if (end === -2)
            return this.line_builder.ToString(0, this.line_builder.Length);

        if (this.line_builder == null)
            this.line_builder = new StringBuilder();
        else
            this.line_builder.Length = 0;

        while (true) {
            if (this.foundCR) // don't include the trailing CR if present
                this.decoded_count--;

            this.line_builder.AppendCharArray(this.decoded_buffer, begin, this.decoded_count - begin);
            if (this.ReadBuffer() === 0) {
                if (this.line_builder.Capacity > 32768) {
                    const sb: StringBuilder = this.line_builder;
                    this.line_builder = null as any;
                    return sb.ToString(0, sb.Length);
                }
                return this.line_builder.ToString(0, this.line_builder.Length);
            }

            begin = this.pos;
            end = this.FindNextEOL();
            if (end < this.decoded_count && end >= begin) {
                this.line_builder.AppendCharArray(this.decoded_buffer, begin, end - begin);
                if (this.line_builder.Capacity > 32768) {
                    const sb: StringBuilder = this.line_builder;
                    this.line_builder = null as any;
                    return sb.ToString(0, sb.Length);
                }
                return this.line_builder.ToString(0, this.line_builder.Length);
            }

            if (end === -2)
                return this.line_builder.ToString(0, this.line_builder.Length);
        }
    }

    // Keep in sync with ReadToEndAsync
    @Override
    public ReadToEnd(): string {
        this.CheckState();

        const text: StringBuilder = new StringBuilder();

        do {
            text.AppendCharArray(this.decoded_buffer, this.pos, this.decoded_count - this.pos);
        } while (this.ReadBuffer() !== 0);

        return text.ToString();
    }

    private CheckState(): void {
        if (this.base_stream == null)
            throw new ObjectDisposedException("StreamReader", "Cannot read from a closed StreamReader");
    }
}

class NullStreamReader extends StreamReader {
    @Override
    public Peek(): int {
        return -1;
    }


    public Read(): int;
    public Read(buffer: CharArray, index: int, count: int): int;
    public Read(...args: any[]): int {
        if (args.length === 0) {
            return -1;
        } else if (args.length === 3) {
            return 0;
        }
        throw new ArgumentOutOfRangeException('');
    }


    @Override
    public ReadLine(): string {
        return null as any;
    }

    @Override
    public ReadToEnd(): string {
        return TString.Empty;
    }

    @Override
    protected Get_BaseStream(): Stream {
        return Stream.Null;
    }

    @Override
    protected Get_CurrentEncoding(): Encoding {
        return Encoding.Unicode;
    }
}

(StreamReader as any)._StaticConstructor();