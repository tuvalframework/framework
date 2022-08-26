import { Convert } from "../convert";
import { ArgumentException } from "../Exceptions/ArgumentException";
import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { ArgumentOutOfRangeException } from "../Exceptions/ArgumentOutOfRangeException";
import { TChar } from "../Extensions/TChar";
import { ByteArray, char, CharArray, int, New } from "../float";
import { is } from "../is";
import { Override } from "../Reflection/Decorators/ClassInfo";
import { TString } from "../Text/TString";
import { Decoder } from "./Decoder";
import { DecoderFallback } from "./DecoderFallback";
import { DecoderReplacementFallback } from "./DecoderReplacementFallback";
import { EncoderFallback } from "./EncoderFallback";
import { EncoderReplacementFallback } from "./EncoderReplacementFallback";
import { Encoding } from "./Encoding";

export class UTF32Encoding extends Encoding {
    protected dispose(disposing: boolean): void {
        throw new Error("Method not implemented.");
    }
    // Magic numbers used by Windows for UTF32.
    public /* internal */ static readonly _UTF32_CODE_PAGE: int = 12000;
    public /* internal */ static readonly _BIG_UTF32_CODE_PAGE: int = 12001;

    // Internal state.
    private bigEndian: boolean = false;
    private byteOrderMark: boolean = false;

    // Constructors.
    /*  public constructor1() {
         this(false, true, false)
     }

     public constructor2(bigEndian: boolean, byteOrderMark: boolean) {
         this(bigEndian, byteOrderMark, false)
     } */

    public constructor(bigEndian: boolean = false, byteOrderMark: boolean = true, throwOnInvalidCharacters: boolean = false) {
        super(bigEndian ? UTF32Encoding._BIG_UTF32_CODE_PAGE : UTF32Encoding._UTF32_CODE_PAGE);
        this.bigEndian = bigEndian;
        this.byteOrderMark = byteOrderMark;

        if (throwOnInvalidCharacters)
            this.SetFallbackInternal(EncoderFallback.ExceptionFallback, DecoderFallback.ExceptionFallback);
        else
            this.SetFallbackInternal(new EncoderReplacementFallback("\uFFFD"), new DecoderReplacementFallback("\uFFFD"));

        if (bigEndian) {
            this.body_name = "utf-32BE";
            this.encoding_name = "UTF-32 (Big-Endian)";
            this.header_name = "utf-32BE";
            this.web_name = "utf-32BE";
        } else {
            this.body_name = "utf-32";
            this.encoding_name = "UTF-32";
            this.header_name = "utf-32";
            this.web_name = "utf-32";
        }

        // Windows reports the same code page number for
        // both the little-endian and big-endian forms.
        this.windows_code_page = UTF32Encoding._UTF32_CODE_PAGE;
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
            if (chars == null) {
                throw new ArgumentNullException("chars");
            }
            if (index < 0 || index > chars.length) {
                throw new ArgumentOutOfRangeException("index", Encoding._("ArgRange_Array"));
            }
            if (count < 0 || count > (chars.length - index)) {
                throw new ArgumentOutOfRangeException("count", Encoding._("ArgRange_Array"));
            }
            let ret: int = 0;
            for (let i: int = index; i < index + count; i++) {
                if (TChar.IsSurrogate(chars[i])) {
                    if (i + 1 < chars.length && TChar.IsSurrogate(chars[i + 1]))
                        ret += 4;
                    else
                        // FIXME: handle fallback
                        //					ret += DecoderFallback.MaxCharCount;
                        ret += 4;
                }
                else
                    ret += 4;
            }
            return ret;
        } else if (args.length === 1 && is.string(args[0])) {
            const s: string = args[0];
            return super.GetByteCount(s);;
        } else if (args.length === 1 && is.CharArray(args[0])) {
            const chars: CharArray = args[0];
            return super.GetByteCount(chars);
        } else if (args.length === 2 && is.CharArray(args[0]) && is.int(args[1])) {
            const chars: CharArray = args[0];
            const count: int = args[1];
            if (chars == null)
                throw new ArgumentNullException("chars");
            return count * 4;
        }
        throw new ArgumentOutOfRangeException('');
    }

    // Get the bytes that result from encoding a character buffer.
    public /* abstract */ GetBytes(chars: CharArray, charIndex: int, charCount: int, bytes: ByteArray, byteIndex: int): int;
    public /* virtual */  GetBytes(s: string, charIndex: int, charCount: int, bytes: ByteArray, byteIndex: int): int;
    public /* virtual */  GetBytes(s: string): ByteArray;
    public /* virtual */  GetBytes(chars: CharArray, index: int, count: int): ByteArray;
    public /* virtual */  GetBytes(chars: CharArray): ByteArray;
    public /* virtual */  GetBytes(chars: CharArray, charCount: int, bytes: ByteArray, byteCount: int): int;
    public GetBytes(...args: any[]): int | ByteArray {
        if (args.length === 5 && is.CharArray(args[0]) && is.int(args[1]) && is.int(args[2]) && is.ByteArray(args[3]) && is.int(args[4])) {
            const chars: CharArray = args[0];
            let charIndex: int = args[1];
            let charCount: int = args[2];
            const bytes: ByteArray = args[3];
            const byteIndex: int = args[4];
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
            if ((bytes.length - byteIndex) < (charCount * 4)) {
                throw new ArgumentException(Encoding._("Arg_InsufficientSpace"));
            }
            let posn: int = byteIndex;
            let ch: char;

            while (charCount-- > 0) {
                ch = chars[charIndex++];
                if (TChar.IsSurrogate(ch)) {
                    if (charCount-- > 0) {
                        let value: int = 0x400 * (ch - 0xD800) + 0x10000 + chars[charIndex++] - 0xDC00;
                        if (this.bigEndian) {
                            for (let i: int = 0; i < 4; i++) {
                                bytes[posn + 3 - i] = Convert.ToByte(value % 0x100);
                                value >>= 8;
                            }
                            posn += 4;
                        } else {
                            for (let i: int = 0; i < 4; i++) {
                                bytes[posn++] = Convert.ToByte(value % 0x100);
                                value >>= 8;
                            }
                        }
                    } else {
                        // Illegal surrogate
                        // FIXME: use fallback
                        if (this.bigEndian) {
                            bytes[posn++] = 0;
                            bytes[posn++] = 0;
                            bytes[posn++] = 0;
                            bytes[posn++] = Convert.ToByte('?'.charCodeAt(0));
                        } else {
                            bytes[posn++] = Convert.ToByte('?'.charCodeAt(0));
                            bytes[posn++] = 0;
                            bytes[posn++] = 0;
                            bytes[posn++] = 0;
                        }
                    }
                } else {
                    if (this.bigEndian) {
                        bytes[posn++] = 0;
                        bytes[posn++] = 0;
                        bytes[posn++] = Convert.ToByte(ch >>> 8);
                        bytes[posn++] = Convert.ToByte(ch);
                    } else {
                        bytes[posn++] = Convert.ToByte(ch);
                        bytes[posn++] = Convert.ToByte(ch >> 8);
                        bytes[posn++] = 0;
                        bytes[posn++] = 0;
                    }
                }
            }

            return posn - byteIndex;
        } else if (args.length === 5 && is.string(args[0]) && is.int(args[1]) && is.int(args[2]) && is.ByteArray(args[3]) && is.int(args[4])) {
            const s: string = args[0];
            const charIndex: int = args[1];
            const charCount: int = args[2];
            const bytes: ByteArray = args[3];
            const byteIndex: int = args[4];
            return super.GetBytes(s, charIndex, charCount, bytes, byteIndex);
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
            return super.GetBytes(chars, charCount, bytes, byteCount);
        }
        throw new ArgumentOutOfRangeException('');
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
            if (bytes == null) {
                throw new ArgumentNullException("bytes");
            }
            if (index < 0 || index > bytes.length) {
                throw new ArgumentOutOfRangeException("index", Encoding._("ArgRange_Array"));
            }
            if (count < 0 || count > (bytes.length - index)) {
                throw new ArgumentOutOfRangeException("count", Encoding._("ArgRange_Array"));
            }
            return Convert.ToInt32(count / 4);
        } else if (args.length === 1 && is.ByteArray(args[0])) {
            const bytes: ByteArray = args[0];
            return super.GetCharCount(bytes);
        } else if (args.length === 2 && is.ByteArray(args[0]) && is.int(args[1])) {
            const bytes: ByteArray = args[0];
            const count: int = args[1];
            return super.GetCharCount(bytes, count);
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
            let byteIndex: int = args[1];
            let byteCount: int = args[2];
            const chars: CharArray = args[3];
            const charIndex: int = args[4];

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

            /*
                    // Determine the byte order in the incoming buffer.
                    bool isBigEndian;
                    if (byteCount >= 2) {
                        if (bytes[byteIndex] == (byte)0xFE && bytes[byteIndex + 1] == (byte)0xFF) {
                            isBigEndian = true;
                        } else if (bytes[byteIndex] == (byte)0xFF && bytes[byteIndex + 1] == (byte)0xFE) {
                            isBigEndian = false;
                        } else {
                            isBigEndian = bigEndian;
                        }
                    } else {
                        isBigEndian = bigEndian;
                    }
            */

            // Validate that we have sufficient space in "chars".
            if ((chars.length - charIndex) < Convert.ToInt32(byteCount / 4)) {
                throw new ArgumentException(Encoding._("Arg_InsufficientSpace"));
            }

            // Convert the characters.
            let posn: int = charIndex;
            if (this.bigEndian) {
                while (byteCount >= 4) {
                    chars[posn++] = Convert.ToChar(
                        bytes[byteIndex] << 24 |
                        bytes[byteIndex + 1] << 16 |
                        bytes[byteIndex + 2] << 8 |
                        bytes[byteIndex + 3]);
                    byteIndex += 4;
                    byteCount -= 4;
                }
            } else {
                while (byteCount >= 4) {
                    chars[posn++] = Convert.ToChar(
                        bytes[byteIndex] |
                        bytes[byteIndex + 1] << 8 |
                        bytes[byteIndex + 2] << 16 |
                        bytes[byteIndex + 3] << 24);
                    byteIndex += 4;
                    byteCount -= 4;
                }
            }
            return posn - charIndex;

        } else if (args.length === 3 && is.ByteArray(args[0]) && is.int(args[1]) && is.int(args[2])) {
            const bytes: ByteArray = args[0];
            const index: int = args[1];
            const count: int = args[2];
            return super.GetChars(bytes, index, count);
        } else if (args.length === 1 && is.ByteArray(args[0])) {
            const bytes: ByteArray = args[0];
            return super.GetChars(bytes);
        } else if (args.length === 4 && is.ByteArray(args[0]) && is.int(args[1]) && is.CharArray(args[2]) && is.int(args[3])) {
            const bytes: ByteArray = args[0];
            const byteCount: int = args[1];
            const chars: CharArray = args[2];
            const charCount: int = args[3];
            return super.GetChars(bytes, byteCount, chars, charCount);
        }
        throw new ArgumentOutOfRangeException('');
    }


    // Get the maximum number of bytes needed to encode a
    // specified number of characters.
    @Override
    public GetMaxByteCount(charCount: int): int {
        if (charCount < 0) {
            throw new ArgumentOutOfRangeException("charCount", Encoding._("ArgRange_NonNegative"));
        }
        return charCount * 4;
    }

    // Get the maximum number of characters needed to decode a
    // specified number of bytes.
    @Override
    public GetMaxCharCount(byteCount: int): int {
        if (byteCount < 0) {
            throw new ArgumentOutOfRangeException
                ("byteCount", Encoding._("ArgRange_NonNegative"));
        }
        return Convert.ToInt32(byteCount / 4);
    }

    // Get a UTF32-specific decoder that is attached to this instance.
    @Override
    public GetDecoder(): Decoder {
        return new UTF32Decoder(this.bigEndian);
    }

    // Get the UTF32 preamble.
    @Override
    public GetPreamble(): ByteArray {
        if (this.byteOrderMark) {
            const preamble: ByteArray = New.ByteArray(4);
            if (this.bigEndian) {
                preamble[2] = Convert.ToByte(0xFE);
                preamble[3] = Convert.ToByte(0xFF);
            } else {
                preamble[0] = Convert.ToByte(0xFF);
                preamble[1] = Convert.ToByte(0xFE);
            }
            return preamble;
        }

        return New.ByteArray(0);
    }

    // Determine if this object is equal to another.
    @Override
    public Equals<UTF32Encoding>(value: UTF32Encoding): boolean {
        const enc: any = (value as UTF32Encoding);
        if (enc != null) {
            return (this.codePage === enc.codePage &&
                this.bigEndian === enc.bigEndian &&
                this.byteOrderMark === enc.byteOrderMark &&
                super.Equals(value));
        } else {
            return false;
        }
    }

    // Get the hash code for this object.
    @Override
    public GetHashCode(): int {
        let basis: int = super.GetHashCode();
        if (this.bigEndian)
            basis ^= 0x1F;
        if (this.byteOrderMark)
            basis ^= 0x3F;
        return basis;
    }

    // UTF32 decoder implementation.



} // class UTF32Encoding

class UTF32Decoder extends Decoder {
    private bigEndian: boolean = false;
    private leftOverByte: int = 0;
    private leftOverLength: int = 0;

    // Constructor.
    public constructor(bigEndian: boolean) {
        super();
        this.bigEndian = bigEndian;
        this.leftOverByte = -1;
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
            if (bytes == null) {
                throw new ArgumentNullException("bytes");
            }
            if (index < 0 || index > bytes.length) {
                throw new ArgumentOutOfRangeException("index", Encoding._("ArgRange_Array"));
            }
            if (count < 0 || count > (bytes.length - index)) {
                throw new ArgumentOutOfRangeException("count", Encoding._("ArgRange_Array"));
            }
            if (this.leftOverByte !== -1) {
                return Convert.ToInt32((count + 1) / 4);
            } else {
                return Convert.ToInt32(count / 4);
            }
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
            let byteIndex: int = args[1];
            let byteCount: int = args[2];
            const chars: CharArray = args[3];
            const charIndex: int = args[4];
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

            // Convert the characters.
            let posn: int = charIndex;
            let leftOver: int = this.leftOverByte;
            const length: int = chars.length;
            let ch: char;

            const remain: int = 4 - this.leftOverLength;
            if (this.leftOverLength > 0 && byteCount > remain) {
                if (this.bigEndian) {
                    for (let i: int = 0; i < remain; i++)
                        leftOver += bytes[byteIndex++] << (4 - byteCount--);
                } else {
                    for (let i: int = 0; i < remain; i++)
                        leftOver += bytes[byteIndex++] << byteCount--;
                }
                if (leftOver > '\uffff'.charCodeAt(0) /* char.MaxValue */ && posn + 1 < length
                    || posn < length)
                    throw new ArgumentException(Encoding._("Arg_InsufficientSpace"));
                if (leftOver > '\uffff'.charCodeAt(0)) {
                    chars[posn++] = Convert.ToChar( Convert.ToInt32((leftOver - 10000) / 0x400) + 0xD800);
                    chars[posn++] = Convert.ToChar((leftOver - 10000) % 0x400 + 0xDC00);
                }
                else
                    chars[posn++] = Convert.ToChar(leftOver);

                leftOver = -1;
                this.leftOverLength = 0;
            }

            while (byteCount > 3) {
                if (this.bigEndian) {
                    ch = Convert.ToChar(
                        bytes[byteIndex++] << 24 |
                        bytes[byteIndex++] << 16 |
                        bytes[byteIndex++] << 8 |
                        bytes[byteIndex++]);
                } else {
                    ch = Convert.ToChar(
                        bytes[byteIndex++] |
                        bytes[byteIndex++] << 8 |
                        bytes[byteIndex++] << 16 |
                        bytes[byteIndex++] << 24);
                }
                byteCount -= 4;

                if (posn < length) {
                    chars[posn++] = ch;
                } else {
                    throw new ArgumentException(Encoding._("Arg_InsufficientSpace"));
                }
            }
            if (byteCount > 0) {
                this.leftOverLength = byteCount;
                leftOver = 0;
                if (this.bigEndian) {
                    for (let i:int = 0; i < byteCount; i++)
                    leftOver += bytes[byteIndex++] << (4 - byteCount--);
                } else {
                    for (let i:int = 0; i < byteCount; i++)
                    leftOver += bytes[byteIndex++] << byteCount--;
                }
                this.leftOverByte = leftOver;
            }

            // Finished - return the converted length.
            return posn - charIndex;
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
            return super.GetChars(bytes, 0, byteCount, chars, charCount, flush);
        }
        throw new ArgumentOutOfRangeException('');
    }
} // class UTF32Decoder