import { DecoderFallback } from "./DecoderFallback";
import { EncoderFallback } from "./EncoderFallback";
import { Encoding } from './Encoding';
import { char, CharArray, int, New, ByteArray, uint } from '../float';
import { ArgumentOutOfRangeException } from '../Exceptions/ArgumentOutOfRangeException';
import { Convert } from '../convert';
import { Out } from "../Out";
import { EncoderFallbackBuffer } from "./EncoderFallbackBuffer";
import { ArgumentException } from "../Exceptions/ArgumentException";
import { TString } from '../Text/TString';
import { ArgumentNullException, IndexOutOfRangeException } from "../Exceptions/ArgumentNullException";
import { DecoderFallbackBuffer } from "./DecoderFallbackBuffer";
import { System } from "../SystemTypes";
import { as } from "../as";
import { is } from "../is";
import { ClassInfo, Override } from "../Reflection/Decorators/ClassInfo";
import { Decoder } from "./Decoder";
import { Encoder } from "./Encoder";

@ClassInfo({
	fullName: System.Types.Encoding.UTF8Encoding,
	instanceof: [
		System.Types.Encoding.UTF8Encoding
	]
})
export class UTF8Encoding extends Encoding {
    protected dispose(disposing: boolean): void {
        throw new Error("Method not implemented.");
    }
    // Magic number used by Windows for UTF-8.
    //internal const int UTF8_CODE_PAGE = 65001;

    // Internal state.
    private emitIdentifier: boolean = false;

    // Constructors.
    /* 	public UTF8Encoding () : this (false, false) {}
        public UTF8Encoding (bool encoderShouldEmitUTF8Identifier)
                : this (encoderShouldEmitUTF8Identifier, false) {} */

    public constructor(encoderShouldEmitUTF8Identifier: boolean = false, throwOnInvalidBytes: boolean = false) {
        super(Encoding.UTF8_CODE_PAGE)
        this.emitIdentifier = encoderShouldEmitUTF8Identifier;
        if (throwOnInvalidBytes)
            this.SetFallbackInternal(EncoderFallback.ExceptionFallback, DecoderFallback.ExceptionFallback);
        else
            this.SetFallbackInternal(EncoderFallback.StandardSafeFallback, DecoderFallback.StandardSafeFallback);

        this.web_name = this.body_name = this.header_name = "utf-8";
        this.encoding_name = "Unicode (UTF-8)";
        this.is_browser_save = true;
        this.is_browser_display = true;
        this.is_mail_news_display = true;
        this.is_mail_news_save = true;
        this.windows_code_page = Encoding.UNICODE_CODE_PAGE;
    }

    // #region GetByteCount()

    // Internal version of "GetByteCount" which can handle a rolling
    // state between multiple calls to this method.
    public static InternalGetByteCount(chars: CharArray, index: int, count: int, fallback: EncoderFallback, leftOver: Out<char>, flush: boolean): int;
    public static InternalGetByteCount(chars: CharArray, count: int, fallback: EncoderFallback, leftOver: Out<char>, flush: boolean): int;
    public static InternalGetByteCount(...args: any[]): int {
        if (args.length === 6) {
            const chars: CharArray = args[0];
            const index: int = args[1];
            const count: int = args[2];
            const fallback: EncoderFallback = args[3];
            const leftOver: Out<char> = args[4];
            const flush: boolean = args[5];
            // Validate the parameters.
            if (chars == null) {
                throw new ArgumentNullException("chars");
            }
            if (index < 0 || index > chars.length) {
                throw new ArgumentOutOfRangeException("index", Encoding._("ArgRange_Array"));
            }
            if (count < 0 || count > (chars.length - index)) {
                throw new ArgumentOutOfRangeException("count", Encoding._("ArgRange_Array"));
            }

            if (index === chars.length) {
                if (flush && leftOver.value !== '\0'.charCodeAt(0)) {
                    // Flush the left-over surrogate pair start.
                    leftOver.value = '\0'.charCodeAt(0);
                    return 3;
                }
                return 0;
            }
            return UTF8Encoding.InternalGetByteCount(Convert.ToCharArray(chars, index), count, fallback, leftOver, flush);
        } else if (args.length === 5) {
            const chars: CharArray = args[0];
            const count: int = args[1];
            const fallback: EncoderFallback = args[2];
            const leftOver: Out<char> = args[3];
            const flush: boolean = args[4];
            let length: int = 0;
            const end: CharArray = Convert.ToCharArray(chars, count);
            const start: CharArray = Convert.ToCharArray(chars);
            let buffer: Out<EncoderFallbackBuffer> = New.Out();
            let charsIndex = 0;
            let endIndex = charsIndex + count;
            while (charsIndex < endIndex) {
                if (leftOver.value === 0) {
                    for (; charsIndex < endIndex; charsIndex++) {
                        if (chars[charsIndex] < 128/* '\x80'.charCodeAt(0) */) {
                            ++length;
                        } else if (chars[charsIndex] < 2048/* '\x800'.charCodeAt(0) */) {
                            length += 2;
                        } else if (chars[charsIndex] < 55296/* '\uD800'.charCodeAt(0) */ || chars[charsIndex] > 57343 /* '\uDFFF'.charCodeAt(0) */) {
                            length += 3;
                        } else if (chars[charsIndex] <= 56319 /* '\uDBFF'.charCodeAt(0) */) {
                            // This is a surrogate start char, exit the inner loop only
                            // if we don't find the complete surrogate pair.
                            if (charsIndex + 1 < endIndex && chars[charsIndex + 1] >= 56320/* '\uDC00'.charCodeAt(0) */ && chars[charsIndex + 1] <= 57343/* '\uDFFF'.charCodeAt(0) */) {
                                length += 4;
                                charsIndex++;
                                continue;
                            }
                            leftOver.value = chars[charsIndex];
                            charsIndex++;
                            break;
                        } else {
                            // We have a surrogate tail without
                            // leading surrogate.
                            const fallback_chars: CharArray = UTF8Encoding.GetFallbackChars(chars, charsIndex, fallback, buffer);
                            const dummy: Out<char> = New.Out('\0'.charCodeAt(0));
                            length += this.InternalGetByteCount(fallback_chars, fallback_chars.length, fallback, dummy, true);

                            leftOver.value = '\0'.charCodeAt(0);
                        }
                    }
                } else {
                    if (chars[charsIndex] >= 56320/* '\uDC00'.charCodeAt(0) */ && chars[charsIndex] <= 57343 /* '\uDFFF'.charCodeAt(0) */) {
                        // We have a correct surrogate pair.
                        length += 4;
                        charsIndex++;
                    } else {
                        // We have a surrogate start followed by a
                        // regular character.  Technically, this is
                        // invalid, but we have to do something.
                        // We write out the surrogate start and then
                        // re-visit the current character again.
                        const fallback_chars: CharArray = UTF8Encoding.GetFallbackChars(chars, charsIndex, fallback, buffer);
                        const dummy: Out<char> = New.Out('\0'.charCodeAt(0));
                        length += UTF8Encoding.InternalGetByteCount(fallback_chars, fallback_chars.length, fallback, dummy, true);
                    }
                    leftOver.value = '\0'.charCodeAt(0);
                }
            }
            if (flush) {
                // Flush the left-over surrogate pair start.
                if (leftOver.value !== '\0'.charCodeAt(0)) {
                    length += 3;
                    leftOver.value = '\0'.charCodeAt(0);
                }
            }
            return length;
        }
        throw new ArgumentOutOfRangeException('');
    }

    private static GetFallbackChars(chars: CharArray, startIndex: int, fallback: EncoderFallback, buffer: Out<EncoderFallbackBuffer>): CharArray {
        if (buffer.value == null)
            buffer.value = fallback.CreateFallbackBuffer();

        buffer.value.Fallback(chars[0], startIndex);

        const fallback_chars: CharArray = New.CharArray(buffer.value.Remaining);
        for (let i: int = 0; i < fallback_chars.length; i++)
            fallback_chars[i] = buffer.value.GetNextChar();

        buffer.value.Reset();

        return fallback_chars;
    }

    // Get the number of characters needed to encode a character buffer.
    public /* abstract */  GetByteCount(chars: CharArray, index: int, count: int): int;
    public /* virtual */  GetByteCount(s: string): int;
    public /* virtual */  GetByteCount(chars: CharArray): int;
    public /* virtual */  GetByteCount(chars: CharArray, count: int): int;
    public GetByteCount(...args: any[]): int {
        if (args.length === 3 && is.CharArray(args[0]) && is.int(args[1]) && is.int(args[2])) {
            const chars: CharArray = args[0];
            const index: int = args[1];
            const count: int = args[2];
            const dummy: Out<char> = New.Out('\0'.charCodeAt(0));
            return UTF8Encoding.InternalGetByteCount(chars, index, count, this.EncoderFallback, dummy, true);
        } else if (args.length === 1 && is.string(args[0])) {
            const s: string = args[0];
            return super.GetByteCount(s);
        } else if (args.length === 1 && is.CharArray(args[0])) {
            const chars: CharArray = args[0];
            return super.GetByteCount(chars);
        } else if (args.length === 2 && is.CharArray(args[0]) && is.int(args[1])) {
            const chars: CharArray = args[0];
            const count: int = args[1];
            if (chars == null)
                throw new ArgumentNullException("chars");
            if (count == 0)
                return 0;
            const dummy: Out<char> = New.Out('\0'.charCodeAt(0));
            return UTF8Encoding.InternalGetByteCount(chars, count, this.EncoderFallback, dummy, true);
        }
        throw new ArgumentOutOfRangeException('');
    }


    // Internal version of "GetBytes" which can handle a rolling
    // state between multiple calls to this method.
    public static InternalGetBytes(chars: CharArray, charIndex: int, charCount: int, bytes: ByteArray, byteIndex: int, fallback: EncoderFallback, buffer: Out<EncoderFallbackBuffer>, leftOver: Out<char>, flush: boolean): int;
    public static InternalGetBytes(chars: CharArray, count: int, bytes: ByteArray, bcount: int, fallback: EncoderFallback, buffer: Out<EncoderFallbackBuffer>, leftOver: Out<char>, flush: boolean): int;
    public static InternalGetBytes(...args: any[]): int {
        if (args.length === 9) {
            const chars: CharArray = args[0];
            const charIndex: int = args[1];
            const charCount: int = args[2];
            const bytes: ByteArray = args[3];
            const byteIndex: int = args[4];
            const fallback: EncoderFallback = args[5];
            const buffer: Out<EncoderFallbackBuffer> = args[6];
            const leftOver: Out<char> = args[7];
            const flush: boolean = args[8];
            // Validate the parameters.
            if (chars == null) {
                throw new ArgumentNullException("chars");
            }
            if (bytes == null) {
                throw new ArgumentNullException("bytes");
            }
            if (charIndex < 0 || charIndex > chars.length) {
                throw new ArgumentOutOfRangeException("charIndex", Encoding._("ArgRange_Array"));
            }
            if (charCount < 0 || charCount > (chars.length - charIndex)) {
                throw new ArgumentOutOfRangeException("charCount", Encoding._("ArgRange_Array"));
            }
            if (byteIndex < 0 || byteIndex > bytes.length) {
                throw new ArgumentOutOfRangeException("byteIndex", Encoding._("ArgRange_Array"));
            }

            if (charIndex === chars.length) {
                if (flush && leftOver.value !== '\0'.charCodeAt(0)) {
                    // FIXME: use EncoderFallback.
                    //
                    // By default it is empty, so I do nothing for now.
                    leftOver.value = '\0'.charCodeAt(0);
                }
                return 0;
            }

            //unsafe {
            //fixed(char * cptr = chars) {
            if (bytes.length === byteIndex)
                return UTF8Encoding.InternalGetBytes(Convert.ToCharArray(chars, charIndex), charCount, null as any, 0, fallback, buffer, leftOver, flush);
            //  fixed(byte * bptr = bytes) {
            return UTF8Encoding.InternalGetBytes(Convert.ToCharArray(chars, charIndex), charCount, Convert.ToByteArray(bytes, byteIndex), bytes.length - byteIndex, fallback, buffer, leftOver, flush);
            //}
            //}
            //}
        } else if (args.length === 8) {
            const chars: CharArray = args[0];
            const count: int = args[1];
            const bytes: ByteArray = args[2];
            const bcount: int = args[3];
            const fallback: EncoderFallback = args[4];
            const buffer: Out<EncoderFallbackBuffer> = args[5];
            const leftOver: Out<char> = args[6];
            const flush: boolean = args[7];
            let endIndex = count;
            let charsIndex = 0;
            let start = 0;
            let bytesIndex = 0;
            let end_bytesIndex = bcount;
            while (charsIndex < endIndex) {
                if (leftOver.value === 0) {
                    for (; charsIndex < endIndex; charsIndex++) {
                        const ch: int = Convert.ToInt32(chars[charsIndex]);
                        if (ch <  128/* '\x80'.charCodeAt(0) */) {
                            if (bytesIndex >= end_bytesIndex)
                                throw new ArgumentException("Insufficient Space", "bytes");
                            bytes[bytesIndex++] = Convert.ToByte(ch);
                        } else if (ch < 2048/* '\x800'.charCodeAt(0) */) {
                            if (bytesIndex + 1 >= end_bytesIndex)
                                throw new ArgumentException("Insufficient Space", "bytes");
                            bytes[bytesIndex] = Convert.ToByte(0xC0 | (ch >>> 6));
                            bytes[bytesIndex + 1] = Convert.ToByte(0x80 | (ch & 0x3F));
                            bytesIndex += 2;
                        } else if (ch < 55296/* '\uD800'.charCodeAt(0) */ || ch > 57343/* '\uDFFF'.charCodeAt(0) */) {
                            if (bytesIndex + 2 >= end_bytesIndex)
                                throw new ArgumentException("Insufficient Space", "bytes");
                            bytes[bytesIndex + 0] = Convert.ToByte(0xE0 | (ch >>> 12));
                            bytes[bytesIndex + 1] = Convert.ToByte(0x80 | ((ch >>> 6) & 0x3F));
                            bytes[bytesIndex + 2] = Convert.ToByte(0x80 | (ch & 0x3F));
                            bytesIndex += 3;
                        } else if (ch <= 56319/* '\uDBFF'.charCodeAt(0) */) {
                            // This is a surrogate char, exit the inner loop.
                            leftOver.value = chars[charsIndex];
                            charsIndex++;
                            break;
                        } else {
                            // We have a surrogate tail without
                            // leading surrogate.
                            const fallback_chars: CharArray = UTF8Encoding.GetFallbackChars(chars, charsIndex, fallback, buffer);
                            const dummy: Out<char> = New.Out('\0'.charCodeAt(0));
                            if (bytesIndex + UTF8Encoding.InternalGetByteCount(fallback_chars, 0, fallback_chars.length, fallback, dummy, true) > end_bytesIndex)
                                throw new ArgumentException("Insufficient Space", "bytes");
                            //fixed(char * fb_chars = fallback_chars) {
                            bytesIndex += UTF8Encoding.InternalGetBytes(fallback_chars, fallback_chars.length, bytes, bcount - Convert.ToInt32(bytesIndex), fallback, buffer, dummy, true);
                            // }

                            leftOver.value = '\0'.charCodeAt(0);
                        }
                    }
                } else {
                    if (chars[charsIndex] >= 56320/* '\uDC00'.charCodeAt(0) */ && chars[charsIndex] <= 57343/* '\uDFFF'.charCodeAt(0) */) {
                        // We have a correct surrogate pair.
                        const ch: int = Convert.ToInt32(0x10000 + Convert.ToInt32(chars[charsIndex]) - 0xDC00 + ((Convert.ToInt32(leftOver.value) - 0xD800) << 10));
                        if (bytesIndex + 3 >= end_bytesIndex)
                            throw new ArgumentException("Insufficient Space", "bytes");
                        bytes[bytesIndex + 0] = Convert.ToByte(0xF0 | (ch >>> 18));
                        bytes[bytesIndex + 1] = Convert.ToByte(0x80 | ((ch >>> 12) & 0x3F));
                        bytes[bytesIndex + 2] = Convert.ToByte(0x80 | ((ch >>> 6) & 0x3F));
                        bytes[bytesIndex + 3] = Convert.ToByte(0x80 | (ch & 0x3F));
                        bytesIndex += 4;
                        charsIndex++;
                    } else {
                        // We have a surrogate start followed by a
                        // regular character.  Technically, this is
                        // invalid, but we have to do something.
                        // We write out the surrogate start and then
                        // re-visit the current character again.
                        const fallback_chars: CharArray = UTF8Encoding.GetFallbackChars(chars, charsIndex, fallback, buffer);
                        const dummy: Out<char> = New.Out('\0'.charCodeAt(0));
                        if (bytesIndex + UTF8Encoding.InternalGetByteCount(fallback_chars, 0, fallback_chars.length, fallback, dummy, true) > end_bytesIndex)
                            throw new ArgumentException("Insufficient Space", "bytes");
                        // fixed(char * fb_chars = fallback_chars) {
                        UTF8Encoding.InternalGetBytes(fallback_chars, fallback_chars.length, bytes, bcount - Convert.ToInt32(bytesIndex), fallback, buffer, dummy, true);
                        // }

                        leftOver.value = '\0'.charCodeAt(0);
                    }
                    leftOver.value = '\0'.charCodeAt(0);
                }
            }
            if (flush) {
                // Flush the left-over surrogate pair start.
                if (leftOver.value !== '\0'.charCodeAt(0)) {
                    const ch: int = leftOver.value;
                    if (bytesIndex + 2 < end_bytesIndex) {
                        bytes[bytesIndex + 0] = Convert.ToByte(0xE0 | (ch >>> 12));
                        bytes[bytesIndex + 1] = Convert.ToByte(0x80 | ((ch >>> 6) & 0x3F));
                        bytes[bytesIndex + 2] = Convert.ToByte(0x80 | (ch & 0x3F));
                        bytesIndex += 3;
                    } else {
                        throw new ArgumentException("Insufficient Space", "bytes");
                    }
                    leftOver.value = '\0'.charCodeAt(0);
                }
            }
            return Convert.ToInt32(bytesIndex - (end_bytesIndex - bcount));
        }
        throw new ArgumentOutOfRangeException('');
    }

    // Get the bytes that result from encoding a character buffer.
    public /* override */ GetBytes(chars: CharArray, charIndex: int, charCount: int, bytes: ByteArray, byteIndex: int): int;
    public /* virtual */  GetBytes(s: string, charIndex: int, charCount: int, bytes: ByteArray, byteIndex: int): int;
    public /* virtual */  GetBytes(s: string): ByteArray;
    public /* virtual */  GetBytes(chars: CharArray, index: int, count: int): ByteArray;
    public /* virtual */  GetBytes(chars: CharArray): ByteArray;
    public /* virtual */  GetBytes(chars: CharArray, charCount: int, bytes: ByteArray, byteCount: int): int;
    public GetBytes(...args: any[]): int | ByteArray {
        if (args.length === 5 && is.CharArray(args[0]) && is.int(args[1]) && is.int(args[2]) && is.ByteArray(args[3]) && is.int(args[4])) {
            const chars: CharArray = args[0];
            const charIndex: int = args[1];
            const charCount: int = args[2];
            const bytes: ByteArray = args[3];
            const byteIndex: int = args[4];

            const leftOver: Out<char> = New.Out('\0'.charCodeAt(0));
            const buffer: Out<EncoderFallbackBuffer> = New.Out(null as any);
            return UTF8Encoding.InternalGetBytes(chars, charIndex, charCount, bytes, byteIndex, this.EncoderFallback, buffer, leftOver, true);
        } else if (args.length === 5 && is.string(args[0]) && is.int(args[1]) && is.int(args[2]) && is.ByteArray(args[3]) && is.int(args[4])) {
            const s: string = args[0];
            const charIndex: int = args[1];
            const charCount: int = args[2];
            const bytes: ByteArray = args[3];
            const byteIndex: int = args[4];
            // Validate the parameters.
            if (s == null) {
                throw new ArgumentNullException("s");
            }
            if (bytes == null) {
                throw new ArgumentNullException("bytes");
            }
            if (charIndex < 0 || charIndex > s.length) {
                throw new ArgumentOutOfRangeException("charIndex", Encoding._("ArgRange_StringIndex"));
            }
            if (charCount < 0 || charCount > (s.length - charIndex)) {
                throw new ArgumentOutOfRangeException("charCount", Encoding._("ArgRange_StringRange"));
            }
            if (byteIndex < 0 || byteIndex > bytes.length) {
                throw new ArgumentOutOfRangeException("byteIndex", Encoding._("ArgRange_Array"));
            }

            if (charIndex === s.length)
                return 0;

            // unsafe {
            //    fixed(char * cptr = s) {
            const cptr: CharArray = TString.ToCharArray(s);
            const dummy: Out<char> = New.Out('\0'.charCodeAt(0));
            const buffer: Out<EncoderFallbackBuffer> = New.Out(null as any);
            if (bytes.length === byteIndex) {
                return UTF8Encoding.InternalGetBytes(Convert.ToCharArray(cptr, charIndex), charCount, null as any, 0, this.EncoderFallback, buffer, dummy, true);
            }
            //         fixed(byte * bptr = bytes) {
            return UTF8Encoding.InternalGetBytes(Convert.ToCharArray(cptr, charIndex), charCount, Convert.ToByteArray(bytes, byteIndex), bytes.length - byteIndex, this.EncoderFallback, buffer, dummy, true);

        } else if (args.length === 1 && is.string(args[0])) {
            const s: string = args[0];
            return super.GetBytes(s);
        } else if (args.length === 3 && is.CharArray(args[0]) && is.int(args[1]) && is.int(args[2])) {
            const chars: CharArray = args[0];
            const index: int = args[1];
            const count: int = args[2];
            return super.GetBytes(chars, index, count);
        } else if (args.length === 1 && is.CharArray(args[0])) {
            const chars: CharArray = args[0];
            return super.GetBytes(chars);
        } else if (args.length === 4 && is.CharArray(args[0]) && is.int(args[1]) && is.ByteArray(args[2]) && is.int(args[3])) {
            const chars: CharArray = args[0];
            const charCount: int = args[1];
            const bytes: ByteArray = args[2];
            const byteCount: int = args[3];

            if (chars == null)
                throw new ArgumentNullException("chars");
            if (charCount < 0)
                throw new IndexOutOfRangeException("charCount");
            if (bytes == null)
                throw new ArgumentNullException("bytes");
            if (byteCount < 0)
                throw new IndexOutOfRangeException("charCount");

            if (charCount == 0)
                return 0;

            const dummy: Out<char> = New.Out('\0'.charCodeAt(0));
            const buffer: Out<EncoderFallbackBuffer> = New.Out(null as any);
            if (byteCount === 0)
                return UTF8Encoding.InternalGetBytes(chars, charCount, null as any, 0, this.EncoderFallback, buffer, dummy, true);
            else
                return UTF8Encoding.InternalGetBytes(chars, charCount, bytes, byteCount, this.EncoderFallback, buffer, dummy, true);

        }
        throw new ArgumentOutOfRangeException('');
    }



    // Internal version of "GetCharCount" which can handle a rolling
    // state between multiple calls to this method.
    public static InternalGetCharCount(bytes: ByteArray, index: int, count: int, leftOverBits: uint, leftOverCount: uint, provider: any, fallbackBuffer: Out<DecoderFallbackBuffer>, bufferArg: Out<ByteArray>, flush: boolean): int;
    public static InternalGetCharCount(bytes: ByteArray, count: int, leftOverBits: uint, leftOverCount: uint, provider: any, fallbackBuffer: Out<DecoderFallbackBuffer>, bufferArg: Out<ByteArray>, flush: boolean): int;
    public static InternalGetCharCount(...args: any[]): int {
        if (args.length === 9) {
            const bytes: ByteArray = args[0];
            const index: int = args[1];
            const count: int = args[2];
            const leftOverBits: uint = args[3];
            const leftOverCount: uint = args[4];
            const provider: any = args[5];
            const fallbackBuffer: Out<DecoderFallbackBuffer> = args[6];
            const bufferArg: Out<ByteArray> = args[7];
            const flush: boolean = args[8];
            // Validate the parameters.
            if (bytes == null) {
                throw new ArgumentNullException("bytes");
            }
            if (index < 0 || index > bytes.length) {
                throw new ArgumentOutOfRangeException("index", Encoding._("ArgRange_Array"));
            }
            if (count < 0 || count > (bytes.length - index)) {
                throw new ArgumentOutOfRangeException("count", Encoding._("ArgRange_Array"));
            }

            if (count === 0) {
                return 0;
            }
            //fixed(byte * bptr = bytes)
            return UTF8Encoding.InternalGetCharCount(Convert.ToByteArray(bytes, index), count, leftOverBits, leftOverCount, provider, fallbackBuffer, bufferArg, flush);
        } else if (args.length === 8) {
            const bytes: ByteArray = args[0];
            let count: int = args[1];
            const leftOverBits: uint = args[2];
            const leftOverCount: uint = args[3];
            const provider: any = args[4];
            const fallbackBuffer: Out<DecoderFallbackBuffer> = args[5];
            const bufferArg: Out<ByteArray> = args[6];
            const flush: boolean = args[7];

            let index: int = 0;

            let length: int = 0;

            if (leftOverCount == 0) {
                const end: int = index + count;
                for (; index < end; index++, count--) {
                    if (bytes[index] < 0x80)
                        length++;
                    else
                        break;
                }
            }

            // Determine the number of characters that we have.
            let ch: uint = 0;
            let leftBits: uint = leftOverBits;
            let leftSoFar: uint = Convert.ToUInt32(leftOverCount & Convert.ToUInt32(0x0F));
            let leftSize: uint = Convert.ToUInt32((leftOverCount >>> 4) & Convert.ToUInt32(0x0F));
            while (count > 0) {
                ch = Convert.ToUInt32(bytes[index++]);
                --count;
                if (leftSize === 0) {
                    // Process a UTF-8 start character.
                    if (ch < Convert.ToUInt32(0x0080)) {
                        // Single-byte UTF-8 character.
                        ++length;
                    } else if ((ch & Convert.ToUInt32(0xE0)) === Convert.ToUInt32(0xC0)) {
                        // Double-byte UTF-8 character.
                        leftBits = Convert.ToUInt32(ch & Convert.ToUInt32(0x1F));
                        leftSoFar = 1;
                        leftSize = 2;
                    } else if ((ch & Convert.ToUInt32(0xF0)) === Convert.ToUInt32(0xE0)) {
                        // Three-byte UTF-8 character.
                        leftBits = Convert.ToUInt32(ch & Convert.ToUInt32(0x0F));
                        leftSoFar = 1;
                        leftSize = 3;
                    } else if ((ch & Convert.ToUInt32(0xF8)) === Convert.ToUInt32(0xF0)) {
                        // Four-byte UTF-8 character.
                        leftBits = Convert.ToUInt32(ch & Convert.ToUInt32(0x07));
                        leftSoFar = 1;
                        leftSize = 4;
                    } else if ((ch & Convert.ToUInt32(0xFC)) === Convert.ToUInt32(0xF8)) {
                        // Five-byte UTF-8 character.
                        leftBits = Convert.ToUInt32(ch & Convert.ToUInt32(0x03));
                        leftSoFar = 1;
                        leftSize = 5;
                    } else if ((ch & Convert.ToUInt32(0xFE)) === Convert.ToUInt32(0xFC)) {
                        // Six-byte UTF-8 character.
                        leftBits = (ch & Convert.ToUInt32(0x03));
                        leftSoFar = 1;
                        leftSize = 6;
                    } else {
                        // Invalid UTF-8 start character.
                        length += UTF8Encoding.Fallback(provider, fallbackBuffer, bufferArg, bytes, index - 1, 1);
                    }
                } else {
                    // Process an extra byte in a multi-byte sequence.
                    if ((ch & Convert.ToUInt32(0xC0)) === Convert.ToUInt32(0x80)) {
                        leftBits = ((leftBits << 6) | (ch & Convert.ToUInt32(0x3F)));
                        if (++leftSoFar >= leftSize) {
                            // We have a complete character now.
                            if (leftBits < Convert.ToUInt32(0x10000)) {
                                // is it an overlong ?
                                let overlong: boolean = false;
                                switch (leftSize) {
                                    case 2:
                                        overlong = (leftBits <= 0x7F);
                                        break;
                                    case 3:
                                        overlong = (leftBits <= 0x07FF);
                                        break;
                                    case 4:
                                        overlong = (leftBits <= 0xFFFF);
                                        break;
                                    case 5:
                                        overlong = (leftBits <= 0x1FFFFF);
                                        break;
                                    case 6:
                                        overlong = (leftBits <= 0x03FFFFFF);
                                        break;
                                }
                                if (overlong) {
                                    length += UTF8Encoding.Fallback(provider, fallbackBuffer, bufferArg, bytes, index - leftSoFar, leftSoFar);
                                }
                                else if ((leftBits & 0xF800) == 0xD800) {
                                    // UTF-8 doesn't use surrogate characters
                                    length += UTF8Encoding.Fallback(provider, fallbackBuffer, bufferArg, bytes, index - leftSoFar, leftSoFar);
                                }
                                else
                                    ++length;
                            } else if (leftBits < Convert.ToUInt32(0x110000)) {
                                length += 2;
                            } else {
                                length += UTF8Encoding.Fallback(provider, fallbackBuffer, bufferArg, bytes, index - leftSoFar, leftSoFar);
                            }
                            leftSize = 0;
                        }
                    } else {
                        // Invalid UTF-8 sequence: clear and restart.
                        length += UTF8Encoding.Fallback(provider, fallbackBuffer, bufferArg, bytes, index - leftSoFar, leftSoFar);
                        leftSize = 0;
                        --index;
                        ++count;
                    }
                }
            }
            if (flush && leftSize !== 0) {
                // We had left-over bytes that didn't make up
                // a complete UTF-8 character sequence.
                length += UTF8Encoding.Fallback(provider, fallbackBuffer, bufferArg, bytes, index - leftSoFar, leftSoFar);
            }

            // Return the final length to the caller.
            return length;
        }
        throw new ArgumentOutOfRangeException('');
    }


    // for GetCharCount()
    private static Fallback(provider: any, buffer: Out<DecoderFallbackBuffer>, bufferArg: Out<ByteArray>, bytes: ByteArray, index: int /* long */, size: uint): int;
    private static Fallback(provider: any, buffer: Out<DecoderFallbackBuffer>, bufferArg: Out<ByteArray>, bytes: ByteArray, byteIndex: int, size: uint, chars: CharArray, charIndex: Out<int>): void;
    private static Fallback(...args: any[]): int | void {
        if (args.length === 6) {
            const provider: any = args[0];
            const buffer: Out<DecoderFallbackBuffer> = args[1];
            const bufferArg: Out<ByteArray> = args[2];
            const bytes: ByteArray = args[3];
            const index: int = args[4]; /* long */;
            const size: uint = args[5];

            if (buffer.value == null) {
                const fb: DecoderFallback = as<DecoderFallback>(provider, System.Types.Encoding.DecoderFallback);
                if (fb != null)
                    buffer.value = fb.CreateFallbackBuffer();
                else
                    buffer.value = provider.FallbackBuffer;
            }
            if (bufferArg.value == null)
                bufferArg.value = New.ByteArray(1);
            let ret: int = 0;
            for (let i: int = 0; i < size; i++) {
                bufferArg.value[0] = bytes[Convert.ToInt32(index) + i];
                buffer.value.Fallback(bufferArg.value, 0);
                ret += buffer.value.Remaining;
                buffer.value.Reset();
            }
            return ret;
        } else if (args.length === 8) {
            const provider: any = args[0];
            const buffer: Out<DecoderFallbackBuffer> = args[1];
            const bufferArg: Out<ByteArray> = args[2];
            const bytes: ByteArray = args[3];
            const byteIndex: int = args[4];
            const size: uint = args[5];
            const chars: CharArray = args[6];
            const charIndex: Out<int> = args[7];
            if (buffer.value == null) {
                const fb: DecoderFallback = as<DecoderFallback>(provider, System.Types.Encoding.DecoderFallback);
                if (fb != null)
                    buffer.value = fb.CreateFallbackBuffer();
                else
                    buffer.value = provider.FallbackBuffer;
            }
            if (bufferArg.value == null)
                bufferArg.value = New.ByteArray(1);
            for (let i: int = 0; i < size; i++) {
                bufferArg.value[0] = bytes[byteIndex + i];
                buffer.value.Fallback(bufferArg.value, 0);
                while (buffer.value.Remaining > 0)
                    chars[charIndex.value++] = buffer.value.GetNextChar();
                buffer.value.Reset();
            }
        } else {
            throw new ArgumentOutOfRangeException('');
        }
    }

    // Get the number of characters needed to decode a byte buffer.
    public /* override */  GetCharCount(bytes: ByteArray, index: int, count: int): int;
    public /* override */  GetCharCount(bytes: ByteArray): int;
    public /* override */  GetCharCount(bytes: ByteArray, count: int): int
    public GetCharCount(...args: any[]): int {
        if (args.length === 3 && is.ByteArray(args[0]) && is.int(args[1]) && is.int(args[2])) {
            const bytes: ByteArray = args[0];
            const index: int = args[1];
            const count: int = args[2];

            const buf: Out<DecoderFallbackBuffer> = New.Out(null as any);
            const bufferArg: Out<ByteArray> = New.Out(null as any);
            return UTF8Encoding.InternalGetCharCount(bytes, index, count, 0, 0, this.DecoderFallback, buf, bufferArg, true);
        } else if (args.length === 1 && is.ByteArray(args[0])) {
            const bytes: ByteArray = args[0];
            return super.GetCharCount(bytes);
        } else if (args.length === 2 && is.ByteArray(args[0]) && is.int(args[1])) {
            const bytes: ByteArray = args[0];
            const count: int = args[1];

            const buf: Out<DecoderFallbackBuffer> = New.Out(null as any);
            const bufferArg: Out<ByteArray> = New.Out(null as any);
            return UTF8Encoding.InternalGetCharCount(bytes, count, 0, 0, this.DecoderFallback, buf, bufferArg, true);
        }
        throw new ArgumentOutOfRangeException('');
    }

    // Get the characters that result from decoding a byte buffer.
    public static InternalGetChars(bytes: ByteArray, byteIndex: int, byteCount: int, chars: CharArray, charIndex: int, leftOverBits: Out<uint>, leftOverCount: Out<uint>, provider: any, fallbackBuffer: Out<DecoderFallbackBuffer>, bufferArg: Out<ByteArray>, flush: boolean): int;
    public static InternalGetChars(bytes: ByteArray, byteCount: int, chars: CharArray, charCount: int, leftOverBits: Out<uint>, leftOverCount: Out<uint>, provider: any, fallbackBuffer: Out<DecoderFallbackBuffer>, bufferArg: Out<ByteArray>, flush: boolean): int;
    public static InternalGetChars(...args: any[]): int {
        if (args.length === 11) {
            const bytes: ByteArray = args[0];
            const byteIndex: int = args[1];
            const byteCount: int = args[2];
            const chars: CharArray = args[3];
            const charIndex: int = args[4];
            const leftOverBits: Out<uint> = args[5];
            const leftOverCount: Out<uint> = args[6];
            const provider: any = args[7];
            const fallbackBuffer: Out<DecoderFallbackBuffer> = args[8];
            const bufferArg: Out<ByteArray> = args[9];
            const flush: boolean = args[10];
            // Validate the parameters.
            if (bytes == null) {
                throw new ArgumentNullException("bytes");
            }
            if (chars == null) {
                throw new ArgumentNullException("chars");
            }
            if (byteIndex < 0 || byteIndex > bytes.length) {
                throw new ArgumentOutOfRangeException("byteIndex", Encoding._("ArgRange_Array"));
            }
            if (byteCount < 0 || byteCount > (bytes.length - byteIndex)) {
                throw new ArgumentOutOfRangeException("byteCount", Encoding._("ArgRange_Array"));
            }
            if (charIndex < 0 || charIndex > chars.length) {
                throw new ArgumentOutOfRangeException("charIndex", Encoding._("ArgRange_Array"));
            }

            if (charIndex === chars.length && byteCount === 0)
                return 0;

            //fixed(char * cptr = chars) {
            if (byteCount === 0 || byteIndex === bytes.length)
                return UTF8Encoding.InternalGetChars(null as any, 0, Convert.ToCharArray(chars, charIndex), chars.length - charIndex, leftOverBits, leftOverCount, provider, fallbackBuffer, bufferArg, flush);
            // otherwise...
            // fixed(byte * bptr = bytes)
            return UTF8Encoding.InternalGetChars(Convert.ToByteArray(bytes, byteIndex), byteCount, Convert.ToCharArray(chars, charIndex), chars.length - charIndex, leftOverBits, leftOverCount, provider, fallbackBuffer, bufferArg, flush);
            //}
        } else if (args.length === 10) {
            const bytes: ByteArray = args[0];
            let byteCount: int = args[1];
            const chars: CharArray = args[2];
            const charCount: int = args[3];
            const leftOverBits: Out<uint> = args[4];
            const leftOverCount: Out<uint> = args[5];
            const provider: any = args[6];
            const fallbackBuffer: Out<DecoderFallbackBuffer> = args[7];
            const bufferArg: Out<ByteArray> = args[8];
            const flush: boolean = args[9];

            let charIndex: int = 0;
            let byteIndex: int = 0;
            const length: int = charCount;
            let posn: int = charIndex;

            if (leftOverCount.value === 0) {
                const end: int = byteIndex + byteCount;
                for (; byteIndex < end; posn++, byteIndex++, byteCount--) {
                    if (bytes[byteIndex] < 0x80) {
                        if (posn >= length) {
                            throw new ArgumentException(Encoding._("Arg_InsufficientSpace"), "chars");
                        }
                        chars[posn] = Convert.ToChar(bytes[byteIndex]);
                    } else {
                        break;
                    }
                }
            }

            // Convert the bytes into the output buffer.
            let ch: uint = 0;
            let leftBits: uint = leftOverBits.value;
            let leftSoFar: uint = (leftOverCount.value & Convert.ToUInt32(0x0F));
            let leftSize: uint = ((leftOverCount.value >>> 4) & Convert.ToUInt32(0x0F));

            const byteEnd: int = byteIndex + byteCount;
            for (; byteIndex < byteEnd; byteIndex++) {
                // Fetch the next character from the byte buffer.
                ch = Convert.ToUInt32(bytes[byteIndex]);
                if (leftSize == 0) {
                    // Process a UTF-8 start character.
                    if (ch < Convert.ToUInt32(0x0080)) {
                        // Single-byte UTF-8 character.
                        if (posn >= length) {
                            throw new ArgumentException(Encoding._("Arg_InsufficientSpace"), "chars");
                        }
                        chars[posn++] = Convert.ToChar(ch);
                    } else if ((ch & Convert.ToUInt32(0xE0)) === Convert.ToUInt32(0xC0)) {
                        // Double-byte UTF-8 character.
                        leftBits = Convert.ToUInt32(ch & Convert.ToUInt32(0x1F));
                        leftSoFar = 1;
                        leftSize = 2;
                    } else if ((ch & Convert.ToUInt32(0xF0)) === Convert.ToUInt32(0xE0)) {
                        // Three-byte UTF-8 character.
                        leftBits = Convert.ToUInt32(ch & Convert.ToUInt32(0x0F));
                        leftSoFar = 1;
                        leftSize = 3;
                    } else if ((ch & Convert.ToUInt32(0xF8)) === Convert.ToUInt32(0xF0)) {
                        // Four-byte UTF-8 character.
                        leftBits = Convert.ToUInt32(ch & Convert.ToUInt32(0x07));
                        leftSoFar = 1;
                        leftSize = 4;
                    } else if ((ch & Convert.ToUInt32(0xFC)) === Convert.ToUInt32(0xF8)) {
                        // Five-byte UTF-8 character.
                        leftBits = Convert.ToUInt32(ch & Convert.ToUInt32(0x03));
                        leftSoFar = 1;
                        leftSize = 5;
                    } else if ((ch & Convert.ToUInt32(0xFE)) === Convert.ToUInt32(0xFC)) {
                        // Six-byte UTF-8 character.
                        leftBits = Convert.ToUInt32(ch & Convert.ToUInt32(0x03));
                        leftSoFar = 1;
                        leftSize = 6;
                    } else {
                        // Invalid UTF-8 start character.
                        const _posn: Out<uint> = New.Out(posn);
                        UTF8Encoding.Fallback(provider, fallbackBuffer, bufferArg, bytes, byteIndex, 1, chars, _posn);
                        posn = _posn.value;
                    }
                } else {
                    // Process an extra byte in a multi-byte sequence.
                    if ((ch & Convert.ToUInt32(0xC0)) === Convert.ToUInt32(0x80)) {
                        leftBits = ((leftBits << 6) | (ch & Convert.ToUInt32(0x3F)));
                        if (++leftSoFar >= leftSize) {
                            // We have a complete character now.
                            if (leftBits < Convert.ToUInt32(0x10000)) {
                                // is it an overlong ?
                                let overlong: boolean = false;
                                switch (leftSize) {
                                    case 2:
                                        overlong = (leftBits <= 0x7F);
                                        break;
                                    case 3:
                                        overlong = (leftBits <= 0x07FF);
                                        break;
                                    case 4:
                                        overlong = (leftBits <= 0xFFFF);
                                        break;
                                    case 5:
                                        overlong = (leftBits <= 0x1FFFFF);
                                        break;
                                    case 6:
                                        overlong = (leftBits <= 0x03FFFFFF);
                                        break;
                                }
                                if (overlong) {
                                    const _posn: Out<uint> = New.Out(posn);
                                    UTF8Encoding.Fallback(provider, fallbackBuffer, bufferArg, bytes, byteIndex - leftSoFar, leftSoFar, chars, _posn);
                                    posn = _posn.value;
                                }
                                else if ((leftBits & 0xF800) === 0xD800) {
                                    // UTF-8 doesn't use surrogate characters
                                    const _posn: Out<uint> = New.Out(posn);
                                    UTF8Encoding.Fallback(provider, fallbackBuffer, bufferArg, bytes, byteIndex - leftSoFar, leftSoFar, chars, _posn);
                                    posn = _posn.value;
                                }
                                else {
                                    if (posn >= length) {
                                        throw new ArgumentException
                                            (UTF8Encoding._("Arg_InsufficientSpace"), "chars");
                                    }
                                    chars[posn++] = Convert.ToChar(leftBits);
                                }
                            } else if (leftBits < Convert.ToUInt32(0x110000)) {
                                if ((posn + 2) > length) {
                                    throw new ArgumentException
                                        (UTF8Encoding._("Arg_InsufficientSpace"), "chars");
                                }
                                leftBits -= Convert.ToUInt32(0x10000);
                                chars[posn++] = Convert.ToChar((leftBits >>> 10) + Convert.ToUInt32(0xD800));
                                chars[posn++] = Convert.ToChar((leftBits & Convert.ToUInt32(0x3FF)) + Convert.ToUInt32(0xDC00));
                            } else {
                                const _posn: Out<uint> = New.Out(posn);
                                UTF8Encoding.Fallback(provider, fallbackBuffer, bufferArg, bytes, byteIndex - leftSoFar, leftSoFar, chars, _posn);
                                posn = _posn.value;
                            }
                            leftSize = 0;
                        }
                    } else {
                        // Invalid UTF-8 sequence: clear and restart.
                        const _posn: Out<uint> = New.Out(posn);
                        UTF8Encoding.Fallback(provider, fallbackBuffer, bufferArg, bytes, byteIndex - leftSoFar, leftSoFar, chars, _posn);
                        posn = _posn.value;
                        leftSize = 0;
                        --byteIndex;
                    }
                }
            }
            if (flush && leftSize !== 0) {
                // We had left-over bytes that didn't make up
                // a complete UTF-8 character sequence.
                const _posn: Out<uint> = New.Out(posn);
                UTF8Encoding.Fallback(provider, fallbackBuffer, bufferArg, bytes, byteIndex - leftSoFar, leftSoFar, chars, _posn);
                posn = _posn.value;
            }
            leftOverBits.value = leftBits;
            leftOverCount.value = (leftSoFar | (leftSize << 4));

            // Return the final length to the caller.
            return posn - charIndex;
        }
        throw new ArgumentOutOfRangeException('');
    }


    // Get the characters that result from decoding a byte buffer.
    public /* abstract */  GetChars(bytes: ByteArray, byteIndex: int, byteCount: int, chars: CharArray, charIndex: int): int;
    public /* virtual */  GetChars(bytes: ByteArray, index: int, count: int): CharArray;
    public /* virtual */  GetChars(bytes: ByteArray, byteCount: int, chars: CharArray, charCount: int): int
    public /* virtual */ GetChars(bytes: ByteArray): CharArray;
    public GetChars(...args: any[]): int | CharArray {
        if (args.length === 5 && is.ByteArray(args[0]) && is.int(args[1]) && is.int(args[2]) && is.CharArray(args[3]) && is.int(args[4])) {
            const bytes: ByteArray = args[0];
            const byteIndex: int = args[1];
            const byteCount: int = args[2];
            const chars: CharArray = args[3];
            const charIndex: int = args[4];

            const leftOverBits: Out<uint> = New.Out(0);
            const leftOverCount: Out<uint> = New.Out(0);
            const buf: Out<DecoderFallbackBuffer> = New.Out(null as any);
            const bufferArg: Out<ByteArray> = New.Out(null as any);
            return UTF8Encoding.InternalGetChars(bytes, byteIndex, byteCount, chars, charIndex, leftOverBits, leftOverCount, DecoderFallback, buf, bufferArg, true);

        } else if (args.length === 3 && is.ByteArray(args[0]) && is.int(args[1]) && is.int(args[2])) {
            const bytes: ByteArray = args[0];
            const index: int = args[1];
            const count: int = args[2];
            const numChars: int = this.GetCharCount(bytes, index, count);
            const chars: CharArray = New.CharArray(numChars);
            this.GetChars(bytes, index, count, chars, 0);
            return chars;
        } else if (args.length === 1 && is.ByteArray(args[0])) {
            const bytes: ByteArray = args[0];
            if (bytes == null) {
                throw new ArgumentNullException("bytes");
            }
            const numChars: int = this.GetCharCount(bytes, 0, bytes.length);
            const chars: CharArray = New.CharArray(numChars);
            this.GetChars(bytes, 0, bytes.length, chars, 0);
            return chars;
        } else if (args.length === 4 && is.ByteArray(args[0]) && is.int(args[1]) && is.CharArray(args[2]) && is.int(args[3])) {
            const bytes: ByteArray = args[0];
            const byteCount: int = args[1];
            const chars: CharArray = args[2];
            const charCount: int = args[3];

            const buf: Out<DecoderFallbackBuffer> = New.Out(null as any);
            const bufferArg: Out<ByteArray> = New.Out(null as any);
            const leftOverBits: Out<uint> = New.Out(0);
            const leftOverCount: Out<uint> = New.Out(0);
            return UTF8Encoding.InternalGetChars(bytes, byteCount, chars, charCount, leftOverBits, leftOverCount, this.DecoderFallback, buf, bufferArg, true);
        }
        throw new ArgumentOutOfRangeException('');
    }

    // Get the maximum number of bytes needed to encode a
    // specified number of characters.
    @Override
    public GetMaxByteCount(charCount: int): int {
        if (charCount < 0) {
            throw new ArgumentOutOfRangeException("charCount", UTF8Encoding._("ArgRange_NonNegative"));
        }
        return charCount * 4;
    }

    // Get the maximum number of characters needed to decode a
    // specified number of bytes.
    @Override
    public GetMaxCharCount(byteCount: int): int {
        if (byteCount < 0) {
            throw new ArgumentOutOfRangeException("byteCount", UTF8Encoding._("ArgRange_NonNegative"));
        }
        return byteCount;
    }

    // Get a UTF8-specific decoder that is attached to this instance.
    @Override
    public GetDecoder(): Decoder {
        return new UTF8Decoder(this.DecoderFallback);
    }

    // Get a UTF8-specific encoder that is attached to this instance.
    @Override
    public GetEncoder(): Encoder {
        return new UTF8Encoder(this.EncoderFallback, this.emitIdentifier);
    }

    // Get the UTF8 preamble.
    @Override
    public GetPreamble(): ByteArray {
        if (this.emitIdentifier)
            return New.ByteArray([0xEF, 0xBB, 0xBF]);

        return New.ByteArray(0);
    }

    // Determine if this object is equal to another.
    @Override
    public Equals<UTF8Encoding>(value: UTF8Encoding): boolean {
        const enc: any = (value as UTF8Encoding);
        if (enc != null) {
            return (this.codePage === enc.codePage &&
                this.emitIdentifier === enc.emitIdentifier &&
                this.DecoderFallback.Equals(enc.DecoderFallback) &&
                this.EncoderFallback.Equals(enc.EncoderFallback));
        } else {
            return false;
        }
    }

    // Get the hash code for this object.
    @Override
    public GetHashCode(): int {
        return super.GetHashCode();
    }

}// class UTF8Encoding

// UTF-8 decoder implementation.
class UTF8Decoder extends Decoder {
    private leftOverBits: uint = 0;
    private leftOverCount: uint = 0;

    // Constructor.
    public constructor(fallback: DecoderFallback) {
        super();
        this.Fallback = fallback;
        this.leftOverBits = 0;
        this.leftOverCount = 0;
    }

    // Get the number of characters needed to decode a buffer.
    public /* override */  GetCharCount(bytes: ByteArray, index: int, count: int): int;
    public /* override */  GetCharCount(bytes: ByteArray, index: int, count: int, flush: boolean): int;
    public /* override */  GetCharCount(bytes: ByteArray, count: int, flush: boolean): int;
    public GetCharCount(...args: any[]) {
        if (args.length === 3 && is.ByteArray(args[0]) && is.int(args[1]) && is.int(args[2])) {
            const bytes: ByteArray = args[0];
            const index: int = args[1];
            const count: int = args[2];
            const buf: Out<DecoderFallbackBuffer> = New.Out(null as any);
            const bufferArg: Out<ByteArray> = New.Out(null as any);
            return UTF8Encoding.InternalGetCharCount(bytes, index, count, this.leftOverBits, this.leftOverCount, this, buf, bufferArg, false);
        } else if (args.length === 4 && is.ByteArray(args[0]) && is.int(args[1]) && is.int(args[2]) && is.boolean(args[3])) {
            const bytes: ByteArray = args[0];
            const index: int = args[1];
            const count: int = args[2];
            const flush: boolean = args[3];
            return super.GetCharCount(bytes, index, count, flush);
        } else if (args.length === 3 && is.ByteArray(args[0]) && is.int(args[1]) && is.boolean(args[2])) {
            const bytes: ByteArray = args[0];
            const count: int = args[1];
            const flush: boolean = args[2];
            return super.GetCharCount(bytes, count, flush);
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
            const chars: CharArray = args[3];
            const charIndex: int = args[4];
            const buf: Out<DecoderFallbackBuffer> = New.Out(null as any);
            const bufferArg: Out<ByteArray> = New.Out(null as any);
            const _leftOverBits: Out<char> = New.Out(this.leftOverBits);
            const _leftOverCount: Out<char> = New.Out(this.leftOverCount);
            const result = UTF8Encoding.InternalGetChars(bytes, byteIndex, byteCount, chars, charIndex, _leftOverBits, _leftOverCount, this, buf, bufferArg, false);
            this.leftOverBits = _leftOverBits.value;
            this.leftOverCount = _leftOverCount.value;
            return result;

        } else if (args.length === 6 && is.ByteArray(args[0]) && is.int(args[1]) && is.int(args[2]) && is.CharArray(args[3]) && is.int(args[4]) && is.boolean(args[5])) {
            const bytes: ByteArray = args[0];
            const byteIndex: int = args[1];
            const byteCount: int = args[2];
            const chars: CharArray = args[3];
            const charIndex: int = args[4];
            const flush: boolean = args[5];
            return super.GetChars(bytes, byteIndex, byteCount, chars, charIndex, flush);
        } else if (args.length === 5 && is.ByteArray(args[0]) && is.int(args[1]) && is.CharArray(args[2]) && is.int(args[3]) && is.boolean(args[4])) {
            const bytes: ByteArray = args[0];
            const byteCount: int = args[1];
            const chars: CharArray = args[2];
            const charCount: int = args[3];
            const flush: boolean = args[4];
            return super.GetChars(bytes, byteCount, chars, charCount, flush);
        }
        throw new ArgumentOutOfRangeException('');
    }

} // class UTF8Decoder

// UTF-8 encoder implementation.

class UTF8Encoder extends Encoder {
    //		private bool emitIdentifier;
    private leftOverForCount: char = 0;
    private leftOverForConv: char = 0;

    // Constructor.
    public constructor(fallback: EncoderFallback, emitIdentifier: boolean) {
        super();
        this.Fallback = fallback;
        //			this.emitIdentifier = emitIdentifier;
        this.leftOverForCount = '\0'.charCodeAt(0);
        this.leftOverForConv = '\0'.charCodeAt(0);
    }

    // Get the number of bytes needed to encode a buffer.
    public /* override */ GetByteCount(chars: CharArray, index: int, count: int, flush: boolean): int;
    public /* override */  GetByteCount(chars: CharArray, count: int, flush: boolean): int;
    public GetByteCount(...args: any[]): int {
        if (args.length === 4 && is.CharArray(args[0]) && is.int(args[1]) && is.int(args[2]) && is.boolean(args[3])) {
            const chars: CharArray = args[0];
            const index: int = args[1];
            const count: int = args[2];
            const flush: boolean = args[3];
            const _leftOverForCount: Out<char> = New.Out(this.leftOverForCount);
            const result = UTF8Encoding.InternalGetByteCount(chars, index, count, this.Fallback, _leftOverForCount, flush);
            this.leftOverForCount = _leftOverForCount.value;
            return result;
        } else if (args.length === 3 && is.CharArray(args[0]) && is.int(args[1]) && is.boolean(args[2])) {
            const chars: CharArray = args[0];
            const count: int = args[1];
            const flush: boolean = args[2];
            const _leftOverForCount: Out<char> = New.Out(this.leftOverForCount);
            const result = UTF8Encoding.InternalGetByteCount(chars, count, this.Fallback, _leftOverForCount, flush);
            this.leftOverForCount = _leftOverForCount.value;
            return result;
        }
        throw new ArgumentOutOfRangeException('');
    }


    // Get the bytes that result from decoding a buffer.
    public /* override */ GetBytes(chars: CharArray, charIndex: int, charCount: int, bytes: ByteArray, byteIndex: int, flush: boolean): int;
    public /* override */  GetBytes(chars: CharArray, charCount: int, bytes: ByteArray, byteCount: int, flush: boolean): int;
    public GetBytes(...args: any[]): int {
        if (args.length === 6 && is.CharArray(args[0]) && is.int(args[1]) && is.int(args[2]) && is.ByteArray(args[3]) && is.int(args[4]) && is.boolean(args[5])) {
            const chars: CharArray = args[0];
            const charIndex: int = args[1];
            const charCount: int = args[2];
            const bytes: ByteArray = args[3];
            const byteIndex: int = args[4];
            const flush: boolean = args[5];
            let result: int = 0;
            const buffer: Out<EncoderFallbackBuffer> = New.Out(null as any);
            const _leftOverForConv: Out<char> = New.Out(this.leftOverForConv);
            result = UTF8Encoding.InternalGetBytes(chars, charIndex, charCount, bytes, byteIndex, this.Fallback, buffer, _leftOverForConv, flush);
            this.leftOverForConv = _leftOverForConv.value;
            //			emitIdentifier = false;
            return result;
        } else if (args.length === 5 && is.CharArray(args[0]) && is.int(args[1]) && is.ByteArray(args[2]) && is.int(args[3]) && is.boolean(args[4])) {
            const chars: CharArray = args[0];
            const charCount: int = args[1];
            const bytes: ByteArray = args[2];
            const byteCount: int = args[3];
            const flush: boolean = args[4];

            let result: int = 0;
            const buffer: Out<EncoderFallbackBuffer> = New.Out(null as any);
            const _leftOverForConv: Out<char> = New.Out(this.leftOverForConv);
            result = UTF8Encoding.InternalGetBytes(chars, charCount, bytes, byteCount, this.Fallback, buffer, _leftOverForConv, flush);
            this.leftOverForConv = _leftOverForConv.value;
            //			emitIdentifier = false;
            return result;
        }
        throw new ArgumentOutOfRangeException('');
    }
}