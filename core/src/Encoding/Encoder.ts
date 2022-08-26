import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { ArgumentOutOfRangeException } from '../Exceptions/ArgumentOutOfRangeException';
import { TArray } from '../Extensions/TArray';
import { ByteArray, CharArray, int, New } from '../float';
import { is } from "../is";
import { Virtual } from "../Reflection/Decorators/ClassInfo";
import { EncoderFallback } from "./EncoderFallback";
import { EncoderFallbackBuffer } from "./EncoderFallbackBuffer";
import { EncoderReplacementFallback } from "./EncoderReplacementFallback";
import { Out } from '../Out';

/* export abstract class Encoder {
    protected constructor() {
    }
    public abstract GetByteCount(chars: CharArray, index: int, count: int, flush: boolean): int;
    public abstract GetBytes(chars: CharArray, charIndex: int, charCount: int, bytes: ByteArray, byteIndex: int, flush: boolean): int;
} */

export abstract class Encoder {

    // Constructor.
    protected constructor() { }

    private fallback: EncoderFallback = new EncoderReplacementFallback();
    private fallback_buffer: EncoderFallbackBuffer = null as any;

    public get Fallback(): EncoderFallback {
        return this.fallback;
    }
    public set Fallback(value: EncoderFallback) {
        if (value == null)
            throw new ArgumentNullException('');
        this.fallback = value;
        this.fallback_buffer = null as any;
    }

    public get FallbackBuffer(): EncoderFallbackBuffer {
        if (this.fallback_buffer == null)
            this.fallback_buffer = this.Fallback.CreateFallbackBuffer();
        return this.fallback_buffer;
    }

    // Get the number of bytes needed to encode a buffer.
    public /* abstract */ GetByteCount(chars: CharArray, index: int, count: int, flush: boolean): int;
    public /* virtual */  GetByteCount(chars: CharArray, count: int, flush: boolean): int;
    public GetByteCount(...args: any[]): int {
        if (args.length === 4 && is.CharArray(args[0]) && is.int(args[1]) && is.int(args[2]) && is.boolean(args[3])) {
            const chars: CharArray = args[0];
            const index: int = args[1];
            const count: int = args[2];
            const flush: boolean = args[3];
            // do nothing
        } else if (args.length === 3 && is.CharArray(args[0]) && is.int(args[1]) && is.boolean(args[2])) {
            const chars: CharArray = args[0];
            const count: int = args[1];
            const flush: boolean = args[2];
            if (chars == null)
                throw new ArgumentNullException("chars");
            if (count < 0)
                throw new ArgumentOutOfRangeException("count");

            const carr: CharArray = New.CharArray(count);
            TArray.Copy(chars, 0, carr, 0, count);
            return this.GetByteCount(carr, 0, count, flush);
        }
        throw new ArgumentOutOfRangeException('');
    }

    // Get the bytes that result from decoding a buffer.
    public /* abstract */ GetBytes(chars: CharArray, charIndex: int, charCount: int, bytes: ByteArray, byteIndex: int, flush: boolean): int;
    public /* virtual */  GetBytes(chars: CharArray, charCount: int, bytes: ByteArray, byteCount: int, flush: boolean): int;
    public GetBytes(...args: any[]): int {
        if (args.length === 6 && is.CharArray(args[0]) && is.int(args[1]) && is.int(args[2]) && is.ByteArray(args[3]) && is.int(args[4]) && is.boolean(args[5])) {
            const chars: CharArray = args[0];
            const charIndex: int = args[1];
            const charCount: int = args[2];
            const bytes: ByteArray = args[3];
            const byteIndex: int = args[4];
            const flush: boolean = args[5];
        } else if (args.length === 5 && is.CharArray(args[0]) && is.int(args[1]) && is.ByteArray(args[2]) && is.int(args[3]) && is.boolean(args[4])) {
            const chars: CharArray = args[0];
            const charCount: int = args[1];
            const bytes: ByteArray = args[2];
            const byteCount: int = args[3];
            const flush: boolean = args[4];
            this.CheckArguments(chars, charCount, bytes, byteCount);

            const carr: CharArray = New.CharArray(charCount);
            TArray.Copy(chars, 0, carr, 0, charCount);
            const barr: ByteArray = New.ByteArray(byteCount);
            TArray.Copy(bytes, 0, barr, 0, byteCount);
            return this.GetBytes(carr, 0, charCount, barr, 0, flush);
        }
        throw new ArgumentOutOfRangeException('');
    }

    @Virtual
    public Reset(): void {
        if (this.fallback_buffer != null)
            this.fallback_buffer.Reset();
    }

    public /* virtual */  Convert(chars: CharArray, charCount: int, bytes: ByteArray, byteCount: int, flush: boolean, charsUsed: Out<int>, bytesUsed: Out<int>, completed: Out<boolean>): void;
    public /* virtual */  Convert(chars: CharArray, charIndex: int, charCount: int, bytes: ByteArray, byteIndex: int, byteCount: int, flush: boolean, charsUsed: Out<int>, bytesUsed: Out<int>, completed: Out<boolean>): void;
    public /* virtual */  Convert(...args: any[]): void {
        if (args.length === 8) {
            const chars: CharArray = args[0];
            const charCount: int = args[1];
            const bytes: ByteArray = args[2];
            const byteCount: int = args[3];
            let flush: boolean = args[4];
            const charsUsed: Out<int> = args[5];
            const bytesUsed: Out<int> = args[6];
            const completed: Out<boolean> = args[7];
            this.CheckArguments(chars, charCount, bytes, byteCount);

            charsUsed.value = charCount;
            while (true) {
                bytesUsed.value = this.GetByteCount(chars, charsUsed.value, flush);
                if (bytesUsed.value <= byteCount)
                    break;
                flush = false;
                charsUsed.value >>= 1;
            }
            completed.value = charsUsed.value === charCount;
            bytesUsed.value = this.GetBytes(chars, charsUsed.value, bytes, byteCount, flush);
        } else if (args.length === 10) {
            const chars: CharArray = args[0];
            const charIndex: int = args[1];
            const charCount: int = args[2];
            const bytes: ByteArray = args[3];
            const byteIndex: int = args[4];
            const byteCount: int = args[5];
            let flush: boolean = args[6];
            const charsUsed: Out<int> = args[7];
            const bytesUsed: Out<int> = args[8];
            const completed: Out<boolean> = args[9];
            if (chars == null)
                throw new ArgumentNullException("chars");
            if (bytes == null)
                throw new ArgumentNullException("bytes");
            if (charIndex < 0)
                throw new ArgumentOutOfRangeException("charIndex");
            if (charCount < 0 || chars.length < charIndex + charCount)
                throw new ArgumentOutOfRangeException("charCount");
            if (byteIndex < 0)
                throw new ArgumentOutOfRangeException("byteIndex");
            if (byteCount < 0 || bytes.length < byteIndex + byteCount)
                throw new ArgumentOutOfRangeException("byteCount");

            charsUsed.value = charCount;
            while (true) {
                bytesUsed.value = this.GetByteCount(chars, charIndex, charsUsed.value, flush);
                if (bytesUsed.value <= byteCount)
                    break;
                flush = false;
                charsUsed.value >>= 1;
            }
            completed.value = charsUsed.value === charCount;
            bytesUsed.value = this.GetBytes(chars, charIndex, charsUsed.value, bytes, byteIndex, flush);
        }
    }


    private CheckArguments(chars: CharArray, charCount: int, bytes: ByteArray, byteCount: int): void {
        if (chars == null)
            throw new ArgumentNullException("chars");
        if (bytes == null)
            throw new ArgumentNullException("bytes");
        if (charCount < 0)
            throw new ArgumentOutOfRangeException("charCount");
        if (byteCount < 0)
            throw new ArgumentOutOfRangeException("byteCount");
    }
};