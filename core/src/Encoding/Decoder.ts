import { ByteArray, CharArray, int, New } from '../float';
import { DecoderFallback } from "./DecoderFallback";
import { DecoderFallbackBuffer } from "./DecoderFallbackBuffer";
import { DecoderReplacementFallback } from "./DecoderReplacementFallback";
import { ArgumentNullException } from '../Exceptions/ArgumentNullException';
import { is } from "../is";
import { ArgumentOutOfRangeException } from '../Exceptions/ArgumentOutOfRangeException';
import { TArray } from '../Extensions/TArray';
import { Virtual } from "../Reflection/Decorators/ClassInfo";
import { Out } from "../Out";

/* export abstract class Decoder {
    protected constructor() {
    }
    public abstract GetCharCount(bytes: ByteArray, index: int, count: int): int;
    public abstract GetChars(bytes: ByteArray, byteIndex: int, byteCount: int, chars: CharArray, charIndex: int): int;
} */

export abstract class Decoder {

    // Constructor.
    protected constructor() { }

    private fallback: DecoderFallback = new DecoderReplacementFallback();
    private fallback_buffer: DecoderFallbackBuffer = null as any;

    public get Fallback(): DecoderFallback {
        return this.fallback;
    }
    public set Fallback(value: DecoderFallback) {
        if (value == null)
            throw new ArgumentNullException('');
        this.fallback = value;
        this.fallback_buffer = null as any;
    }

    public get FallbackBuffer(): DecoderFallbackBuffer {
        if (this.fallback_buffer == null)
            this.fallback_buffer = this.fallback.CreateFallbackBuffer();
        return this.fallback_buffer;
    }

    // Get the number of characters needed to decode a buffer.
    public /* abstract */  GetCharCount(bytes: ByteArray, index: int, count: int): int;
    public /* virtual */  GetCharCount(bytes: ByteArray, index: int, count: int, flush: boolean): int;
    public /* virtual */  GetCharCount(bytes: ByteArray, count: int, flush: boolean): int;
    public GetCharCount(...args: any[]) {
        if (args.length === 3 && is.ByteArray(args[0]) && is.int(args[1]) && is.int(args[2])) {
            const bytes: ByteArray = args[0];
            const index: int = args[1];
            const count: int = args[2];
            //do nothing in this class.
        } else if (args.length === 4 && is.ByteArray(args[0]) && is.int(args[1]) && is.int(args[2]) && is.boolean(args[3])) {
            const bytes: ByteArray = args[0];
            const index: int = args[1];
            const count: int = args[2];
            const flush: boolean = args[3];
            if (flush)
                this.Reset();
            return this.GetCharCount(bytes, index, count);
        } else if (args.length === 3 && is.ByteArray(args[0]) && is.int(args[1]) && is.boolean(args[2])) {
            const bytes: ByteArray = args[0];
            const count: int = args[1];
            const flush: boolean = args[2];
            if (bytes == null)
                throw new ArgumentNullException("bytes");
            if (count < 0)
                throw new ArgumentOutOfRangeException("count");

            const barr: ByteArray = New.ByteArray(count);
            TArray.Copy(bytes, 0, barr, 0, count);
            return this.GetCharCount(barr, 0, count, flush);
        }
    }

    // Get the characters that result from decoding a buffer.
    public /* abstract */ GetChars(bytes: ByteArray, byteIndex: int, byteCount: int, chars: CharArray, charIndex: int): int;
    public /* virtual */  GetChars(bytes: ByteArray, byteIndex: int, byteCount: int, chars: CharArray, charIndex: int, flush: boolean): int;
    public /* virtual */  GetChars(bytes: ByteArray, byteCount: int, chars: CharArray, charCount: int, flush: boolean): int;
    public GetChars(...args: any[]): int {
        if (args.length === 5 && is.ByteArray(args[0]) && is.int(args[1]) && is.int(args[2]) && is.CharArray(args[3]) && is.int(args[4])) {
            const bytes: ByteArray = args[0];
            const byteIndex: int = args[1];
            const byteCount: int = args[2];
            const chars: CharArray  =args[3];
            const charIndex: int = args[4];
            // do nothing in this class.
        } else if (args.length === 6 && is.ByteArray(args[0]) && is.int(args[1]) && is.int(args[2]) && is.CharArray(args[3]) && is.int(args[4]) && is.boolean(args[5])) {
            const bytes: ByteArray = args[0];
            const byteIndex: int = args[1];
            const byteCount: int = args[2];
            const chars: CharArray = args[3];
            const charIndex: int = args[4];
            const flush: boolean = args[5];
            this.CheckArguments(bytes, byteIndex, byteCount);
            this.CheckArguments(chars, charIndex);

            if (flush)
                this.Reset();
            return this.GetChars(bytes, byteIndex, byteCount, chars, charIndex);
        } else if (args.length === 5 && is.ByteArray(args[0]) && is.int(args[1]) && is.CharArray(args[2]) && is.int(args[3]) && is.boolean(args[4])) {
            const bytes: ByteArray = args[0];
            const byteCount: int = args[1];
            const chars: CharArray = args[2];
            const charCount: int = args[3];
            const flush: boolean = args[4];
            this.CheckArguments(chars, charCount, bytes, byteCount);

            const carr: CharArray = New.CharArray(charCount);
            TArray.Copy(chars, 0, carr, 0, charCount);
            const barr: ByteArray = New.ByteArray(byteCount);
            TArray.Copy(bytes, 0, barr, 0, byteCount);
            return this.GetChars(barr, 0, byteCount, carr, 0, flush);
        }
        throw new ArgumentOutOfRangeException('');
    }

    @Virtual
    public Reset(): void {
        if (this.fallback_buffer != null)
            this.fallback_buffer.Reset();
    }

    public /* virtual */  Convert(bytes: ByteArray, byteCount: int, chars: CharArray, charCount: int, flush: boolean, bytesUsed: Out<int>, charsUsed: Out<int>, completed: Out<boolean>): void;
    public /* virtual */  Convert(bytes: ByteArray, byteIndex: int, byteCount: int, chars: CharArray, charIndex: int, charCount: int, flush: boolean, bytesUsed: Out<int>, charsUsed: Out<int>, completed: Out<boolean>): void;
    public /* virtual */  Convert(...args: any[]): void {
        if (args.length === 8) {
            const bytes: ByteArray = args[0];
            const byteCount: int = args[1];
            const chars: CharArray = args[2];
            const charCount: int = args[3];
            let flush: boolean = args[4];
            const bytesUsed: Out<int> = args[5];
            const charsUsed: Out<int> = args[6];
            const completed: Out<boolean> = args[7];

            this.CheckArguments(chars, charCount, bytes, byteCount);

            bytesUsed.value = byteCount;
            while (true) {
                charsUsed.value = this.GetCharCount(bytes, bytesUsed.value, flush);
                if (charsUsed.value <= charCount)
                    break;
                flush = false;
                bytesUsed.value >>= 1;
            }
            completed.value = bytesUsed.value === byteCount;
            charsUsed.value = this.GetChars(bytes, bytesUsed.value, chars, charCount, flush);
        } else if (args.length === 10) {
            const bytes: ByteArray = args[0];
            const byteIndex: int = args[1];
            const byteCount: int = args[2];
            const chars: CharArray = args[3];
            const charIndex: int = args[4];
            const charCount: int = args[5];
            let flush: boolean = args[6];
            const bytesUsed: Out<int> = args[7];
            const charsUsed: Out<int> = args[8];
            const completed: Out<boolean> = args[9];
            this.CheckArguments(bytes, byteIndex, byteCount);
            if (chars == null)
                throw new ArgumentNullException("chars");
            if (charIndex < 0)
                throw new ArgumentOutOfRangeException("charIndex");
            if (charCount < 0 || chars.length < charIndex + charCount)
                throw new ArgumentOutOfRangeException("charCount");

            bytesUsed.value = byteCount;
            while (true) {
                charsUsed.value = this.GetCharCount(bytes, byteIndex, bytesUsed.value, flush);
                if (charsUsed.value <= charCount)
                    break;
                flush = false;
                bytesUsed.value >>= 1;
            }
            completed.value = bytesUsed.value === byteCount;
            charsUsed.value = this.GetChars(bytes, byteIndex, bytesUsed.value, chars, charIndex, flush);
        }
    }



    private CheckArguments(chars: CharArray, charIndex: int): void;
    private CheckArguments(bytes: ByteArray, byteIndex: int, byteCount: int): void;
    private CheckArguments(chars: CharArray, charCount: int, bytes: ByteArray, byteCount: int): void;
    private CheckArguments(...args: any[]): void {
        if (args.length === 2 && is.CharArray(args[0]) && is.int(args[1])) {
            const chars: CharArray = args[0];
            const charIndex: int = args[1];
            if (chars == null)
                throw new ArgumentNullException("chars");
            if (charIndex < 0 || chars.length < charIndex)
                throw new ArgumentOutOfRangeException("charIndex");
        } else if (args.length === 3 && is.ByteArray(args[0]) && is.int(args[1]) && is.int(args[2])) {
            const bytes: ByteArray = args[0];
            const byteIndex: int = args[1];
            const byteCount: int = args[2];
            if (bytes == null)
                throw new ArgumentNullException("bytes");
            if (byteIndex < 0)
                throw new ArgumentOutOfRangeException("byteIndex");
            if (byteCount < 0 || bytes.length < byteIndex + byteCount)
                throw new ArgumentOutOfRangeException("byteCount");
        } else if (args.length === 4 && is.CharArray(args[0]) && is.int(args[1]) && is.ByteArray(args[2]) && is.int(args[3])) {
            const chars: CharArray = args[0];
            const charCount: int = args[1];
            const bytes: ByteArray = args[2];
            const byteCount: int = args[3];
            if (chars == null)
                throw new ArgumentNullException("chars");
            if (bytes == null)
                throw new ArgumentNullException("bytes");
            if (charCount < 0)
                throw new ArgumentOutOfRangeException("charCount");
            if (byteCount < 0)
                throw new ArgumentOutOfRangeException("byteCount");
        }
    }
}