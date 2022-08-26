import { ArgumentException } from "../Exceptions/ArgumentException";
import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { ArgumentOutOfRangeException } from "../Exceptions/ArgumentOutOfRangeException";
import { ByteArray, CharArray, int, New } from '../float';
import { is } from "../is";
import { DecoderExceptionFallback } from "./DecoderExceptionFallback";
import { DecoderReplacementFallback } from "./DecoderReplacementFallback";
import { Encoding } from "./Encoding";
import { TString } from '../Text/TString';
import { Convert } from "../convert";
import { BitConverter } from "../BitConverter";
import { NotImplementedException } from '../Exceptions/NotImplementedException';
import { Override } from "../Reflection/Decorators/ClassInfo";
import { Encoder } from "./Encoder";
import { Decoder } from "./Decoder";
import { TArray } from '../Extensions/TArray';

export class UnicodeEncoding extends Encoding {
    protected dispose(disposing: boolean): void {
        throw new Error("Method not implemented.");
    }
    // Magic numbers used by Windows for Unicode.
     private static readonly _UNICODE_CODE_PAGE: int = 1200;
    private static readonly _BIG_UNICODE_CODE_PAGE: int = 1201;

    // Size of characters in this encoding.
    public static readonly CharSize: int = 2;

    // Internal state.
    private bigEndian: boolean = false;
    private byteOrderMark: boolean = false;

    // Constructors.
    /* public constructor1 ()
    {
        this (false, true);
        this.bigEndian = false;
        this.byteOrderMark = true;
    }
    public constructor2( bigEndian:boolean,  byteOrderMark:boolean)	{
        this (bigEndian, byteOrderMark, false)
    } */

    public constructor(bigEndian: boolean = false, byteOrderMark: boolean = true, throwOnInvalidBytes: boolean = false) {

        super((bigEndian ? UnicodeEncoding._BIG_UNICODE_CODE_PAGE : UnicodeEncoding._UNICODE_CODE_PAGE))
        if (throwOnInvalidBytes)
            this.SetFallbackInternal(null as any, new DecoderExceptionFallback());
        else
            this.SetFallbackInternal(null as any, new DecoderReplacementFallback("\uFFFD"));

        this.bigEndian = bigEndian;
        this.byteOrderMark = byteOrderMark;

        if (bigEndian) {
            this.body_name = "unicodeFFFE";
            this.encoding_name = "Unicode (Big-Endian)";
            this.header_name = "unicodeFFFE";
            this.is_browser_save = false;
            this.web_name = "unicodeFFFE";
        } else {
            this.body_name = "utf-16";
            this.encoding_name = "Unicode";
            this.header_name = "utf-16";
            this.is_browser_save = true;
            this.web_name = "utf-16";
        }

        // Windows reports the same code page number for
        // both the little-endian and big-endian forms.
        this.windows_code_page = UnicodeEncoding._UNICODE_CODE_PAGE;
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
            return count * 2;
        } else if (args.length === 1 && is.string(args[0])) {
            const s: string = args[0];
            if (s == null) {
                throw new ArgumentNullException("s");
            }
            return s.length * 2;
        } else if (args.length === 1 && is.CharArray(args[0])) {
            const chars: CharArray = args[0];
            return super.GetByteCount(chars);
        } else if (args.length === 2 && is.CharArray(args[0]) && is.int(args[1])) {
            const chars: CharArray = args[0];
            const count: int = args[1];
            if (chars == null)
                throw new ArgumentNullException("chars");
            if (count < 0)
                throw new ArgumentOutOfRangeException("count");

            return count * 2;
        }
        throw new ArgumentOutOfRangeException('');
    }


    // Get the bytes that result from encoding a character buffer.
    public /* override */  GetBytes(chars: CharArray, charIndex: int, charCount: int, bytes: ByteArray, byteIndex: int): int;
    public /* override */  GetBytes(s: string, charIndex: int, charCount: int, bytes: ByteArray, byteIndex: int): int;
    public /* override */  GetBytes(s: string): ByteArray;
    public /* override */  GetBytes(chars: CharArray, index: int, count: int): ByteArray;
    public /* override */  GetBytes(chars: CharArray): ByteArray;
    public /* override */  GetBytes(chars: CharArray, charCount: int, bytes: ByteArray, byteCount: int): int;
    public GetBytes(...args: any[]): int | ByteArray {
        if (args.length === 5 && is.CharArray(args[0]) && is.int(args[1]) && is.int(args[2]) && is.ByteArray(args[3]) && is.int(args[4])) {
            const chars: CharArray = args[0];
            const charIndex: int = args[1];
            const charCount: int = args[2];
            let bytes: ByteArray = args[3];
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

            if (charCount == 0)
                return 0;

            const byteCount: int = bytes.length - byteIndex;
            if (bytes.length === 0)
                bytes = New.ByteArray(1);

            return this.GetBytesInternal(chars.slice(charIndex), charCount, bytes.slice(byteIndex), byteCount);

        } else if (args.length === 5 && is.string(args[0]) && is.int(args[1]) && is.int(args[2]) && is.ByteArray(args[3]) && is.int(args[4])) {
            const s: string = args[0];
            const charIndex: int = args[1];
            const charCount: int = args[2];
            let bytes: ByteArray = args[3];
            const byteIndex: int = args[4];

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

            // For consistency
            if (charCount == 0)
                return 0;

            const byteCount: int = bytes.length - byteIndex;
            if (bytes.length === 0)
                bytes = New.ByteArray(1);

            return this.GetBytesInternal(TString.ToCharArray(s).slice(charIndex), charCount, bytes.slice(byteIndex), byteCount);

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
            if (bytes == null)
                throw new ArgumentNullException("bytes");
            if (chars == null)
                throw new ArgumentNullException("chars");
            if (charCount < 0)
                throw new ArgumentOutOfRangeException("charCount");
            if (byteCount < 0)
                throw new ArgumentOutOfRangeException("byteCount");

            return this.GetBytesInternal(chars, charCount, bytes, byteCount);

        }
        throw new ArgumentOutOfRangeException('');
    }


    private GetBytesInternal(chars: CharArray, charCount: int, bytes: ByteArray, byteCount: int): int {
        const count: int = charCount * 2;

        if (byteCount < count)
            throw new ArgumentException(Encoding._("Arg_InsufficientSpace"));

        UnicodeEncoding.CopyChars(Convert.ToByteArray(chars), bytes, count, this.bigEndian);
        return count;
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
            return Convert.ToInt32(count / 2);
        } else if (args.length === 1 && is.ByteArray(args[0])) {
            const bytes: ByteArray = args[0];
            return super.GetCharCount(bytes);
        } else if (args.length === 2 && is.ByteArray(args[0]) && is.int(args[1])) {
            const bytes: ByteArray = args[0];
            const count: int = args[1];
            if (bytes == null)
                throw new ArgumentNullException("bytes");
            if (count < 0)
                throw new ArgumentOutOfRangeException("count");

            return Convert.ToInt32(count / 2);
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
            let chars: CharArray = args[3];
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

            if (byteCount === 0)
                return 0;

            const charCount: int = chars.length - charIndex;
            if (chars.length == 0)
                chars = New.CharArray(1);

            return this.GetCharsInternal(bytes.slice(byteIndex), byteCount, Convert.ToCharArray(chars, charIndex), charCount);
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
            if (bytes == null)
                throw new ArgumentNullException("bytes");
            if (chars == null)
                throw new ArgumentNullException("chars");
            if (charCount < 0)
                throw new ArgumentOutOfRangeException("charCount");
            if (byteCount < 0)
                throw new ArgumentOutOfRangeException("byteCount");

            return this.GetCharsInternal(bytes, byteCount, chars, charCount);
        }
        throw new ArgumentOutOfRangeException('');
    }


    // Decode a buffer of bytes into a string.
    public /* virtual */ GetString(bytes: ByteArray, index: int, count: int): string;
    public /* virtual */ GetString(bytes: ByteArray): string;
    public /* virtual */ GetString(...args: any[]): string {
        if (args.length === 3 && is.ByteArray(args[0]) && is.int(args[1]) && is.int(args[2])) {
            const bytes: ByteArray = args[0];
            const index: int = args[1];
            const count: int = args[2];
            if (bytes == null)
                throw new ArgumentNullException("bytes");
            if (index < 0 || index > bytes.length)
                throw new ArgumentOutOfRangeException("index", Encoding._("ArgRange_Array"));
            if (count < 0 || count > (bytes.length - index))
                throw new ArgumentOutOfRangeException("count", Encoding._("ArgRange_Array"));

            if (count === 0)
                return TString.Empty;

            // GetCharCountInternal
            let charCount: int = Convert.ToInt32(count / 2);
            const charPtr: CharArray = New.CharArray(charCount);
            this.GetCharsInternal(bytes.slice(index), count, charPtr, charCount);

            return TString.FromCharArray(charPtr);
        } else if (args.length === 1 && is.ByteArray(args[0])) {
            const bytes: ByteArray = args[0];

            return super.GetString(bytes);
        }
        throw new ArgumentOutOfRangeException('');
    }


    private GetCharsInternal(bytes: ByteArray, byteCount: int, chars: CharArray, charCount: int): int {
        const count: int = Convert.ToInt32(byteCount / 2);

        // Validate that we have sufficient space in "chars".
        if (charCount < count)
            throw new ArgumentException(Encoding._("Arg_InsufficientSpace"));

        UnicodeEncoding.CopyChars(bytes, Convert.ToByteArray(chars), byteCount, this.bigEndian);
        return count;
    }

    @Override
    public GetEncoder(): Encoder {
        return (super.GetEncoder());
    }

    // Get the maximum number of bytes needed to encode a
    // specified number of characters.
    @Override
    public GetMaxByteCount(charCount: int): int {
        if (charCount < 0) {
            throw new ArgumentOutOfRangeException("charCount", Encoding._("ArgRange_NonNegative"));
        }
        return charCount * 2;
    }

    // Get the maximum number of characters needed to decode a
    // specified number of bytes.
    @Override
    public GetMaxCharCount(byteCount: int): int {
        if (byteCount < 0) {
            throw new ArgumentOutOfRangeException
                ("byteCount", UnicodeEncoding._("ArgRange_NonNegative"));
        }
        return Convert.ToInt32(byteCount / 2);
    }

    // Get a Unicode-specific decoder that is attached to this instance.
    @Override
    public GetDecoder(): Decoder {
        return new UnicodeDecoder(this.bigEndian);
    }

    // Get the Unicode preamble.
    @Override
    public GetPreamble(): ByteArray {
        if (this.byteOrderMark) {
            const preamble: ByteArray = New.ByteArray(2);
            if (this.bigEndian) {
                preamble[0] = Convert.ToByte(0xFE);
                preamble[1] = Convert.ToByte(0xFF);
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
    public Equals<UnicodeEncoding>(value: UnicodeEncoding): boolean {
        const enc: any = (value as UnicodeEncoding);
        if (enc != null) {
            return (this.codePage === enc.codePage &&
                this.bigEndian == enc.bigEndian &&
                this.byteOrderMark == enc.byteOrderMark);
        } else {
            return false;
        }
    }

    // Get the hash code for this object.
    @Override
    public GetHashCode(): int {
        return super.GetHashCode();
    }

    private static CopyChars(src: ByteArray, dest: ByteArray, count: int, bigEndian: boolean): void {
        if (BitConverter.IsLittleEndian !== bigEndian) {
            //throw new NotImplementedException('');
            TArray.Copy(src,dest,count & (Convert.ToInt32(0xFFFFFFFE)));
            //string.memcpy(dest, src, count & unchecked((int) 0xFFFFFFFE));
            return;
        }

        let destIndex = 0;
        let sourceIndex = 0;

        switch (count) {
            case 0:
                return;
            case 1:
                return;
            case 2:
                dest[destIndex + 0] = src[sourceIndex + 1];
                dest[destIndex + 1] = src[sourceIndex + 0];
                return;
            case 3:
                dest[destIndex + 0] = src[sourceIndex + 1];
                dest[destIndex + 1] = src[sourceIndex + 0];
                return
            case 4:
                dest[destIndex + 0] = src[sourceIndex + 1];
                dest[destIndex + 1] = src[sourceIndex + 0];
                dest[destIndex + 2] = src[sourceIndex + 3];
                dest[destIndex + 3] = src[sourceIndex + 2];
                destIndex += 4;
                sourceIndex += 4;

                if ((count & 2) === 0)
                    return;

                dest[destIndex + 0] = src[sourceIndex + 1];
                dest[destIndex + 1] = src[sourceIndex + 0];
                return;
            case 5:
                dest[destIndex + 0] = src[sourceIndex + 1];
                dest[destIndex + 1] = src[sourceIndex + 0];
                dest[destIndex + 2] = src[sourceIndex + 3];
                dest[destIndex + 3] = src[sourceIndex + 2];
                destIndex += 4;
                sourceIndex += 4;

                if ((count & 2) == 0)
                    return;

                dest[destIndex + 0] = src[sourceIndex + 1];
                dest[destIndex + 1] = src[sourceIndex + 0];
                return;
            case 6:
                dest[destIndex + 0] = src[sourceIndex + 1];
                dest[destIndex + 1] = src[sourceIndex + 0];
                dest[destIndex + 2] = src[sourceIndex + 3];
                dest[destIndex + 3] = src[sourceIndex + 2];
                destIndex += 4;
                sourceIndex += 4;

                if ((count & 2) == 0)
                    return;

                dest[destIndex + 0] = src[sourceIndex + 1];
                dest[destIndex + 1] = src[sourceIndex + 0];
                return;
            case 7:
                dest[destIndex + 0] = src[sourceIndex + 1];
                dest[destIndex + 1] = src[sourceIndex + 0];
                dest[destIndex + 2] = src[sourceIndex + 3];
                dest[destIndex + 3] = src[sourceIndex + 2];
                destIndex += 4;
                sourceIndex += 4;

                if ((count & 2) == 0)
                    return;

                dest[destIndex + 0] = src[sourceIndex + 1];
                dest[destIndex + 1] = src[sourceIndex + 0];
                return;
            case 8:
                dest[destIndex + 0] = src[sourceIndex + 1];
                dest[destIndex + 1] = src[sourceIndex + 0];
                dest[destIndex + 2] = src[sourceIndex + 3];
                dest[destIndex + 3] = src[sourceIndex + 2];
                dest[destIndex + 4] = src[sourceIndex + 5];
                dest[destIndex + 5] = src[sourceIndex + 4];
                dest[destIndex + 6] = src[sourceIndex + 7];
                dest[destIndex + 7] = src[sourceIndex + 6];
                destIndex += 8;
                sourceIndex += 8;

                if ((count & 4) == 0) {
                    if ((count & 2) === 0)
                        return;
                    dest[destIndex + 0] = src[sourceIndex + 1];
                    dest[destIndex + 1] = src[sourceIndex + 0];
                    return;
                }


                dest[destIndex + 0] = src[sourceIndex + 1];
                dest[destIndex + 1] = src[sourceIndex + 0];
                dest[destIndex + 2] = src[sourceIndex + 3];
                dest[destIndex + 3] = src[sourceIndex + 2];
                destIndex += 4;
                sourceIndex += 4;


                if ((count & 2) === 0)
                    return;

                dest[destIndex + 0] = src[sourceIndex + 1];
                dest[destIndex + 1] = src[sourceIndex + 0];
                return;
            case 9:
                dest[destIndex + 0] = src[sourceIndex + 1];
                dest[destIndex + 1] = src[sourceIndex + 0];
                dest[destIndex + 2] = src[sourceIndex + 3];
                dest[destIndex + 3] = src[sourceIndex + 2];
                dest[destIndex + 4] = src[sourceIndex + 5];
                dest[destIndex + 5] = src[sourceIndex + 4];
                dest[destIndex + 6] = src[sourceIndex + 7];
                dest[destIndex + 7] = src[sourceIndex + 6];
                destIndex += 8;
                sourceIndex += 8;

                if ((count & 4) == 0) {
                    if ((count & 2) === 0)
                        return;
                    dest[destIndex + 0] = src[sourceIndex + 1];
                    dest[destIndex + 1] = src[sourceIndex + 0];
                    return;
                }


                dest[destIndex + 0] = src[sourceIndex + 1];
                dest[destIndex + 1] = src[sourceIndex + 0];
                dest[destIndex + 2] = src[sourceIndex + 3];
                dest[destIndex + 3] = src[sourceIndex + 2];
                destIndex += 4;
                sourceIndex += 4;


                if ((count & 2) === 0)
                    return;

                dest[destIndex + 0] = src[sourceIndex + 1];
                dest[destIndex + 1] = src[sourceIndex + 0];
                return;
            case 10:
                dest[destIndex + 0] = src[sourceIndex + 1];
                dest[destIndex + 1] = src[sourceIndex + 0];
                dest[destIndex + 2] = src[sourceIndex + 3];
                dest[destIndex + 3] = src[sourceIndex + 2];
                dest[destIndex + 4] = src[sourceIndex + 5];
                dest[destIndex + 5] = src[sourceIndex + 4];
                dest[destIndex + 6] = src[sourceIndex + 7];
                dest[destIndex + 7] = src[sourceIndex + 6];
                destIndex += 8;
                sourceIndex += 8;

                if ((count & 4) == 0) {
                    if ((count & 2) === 0)
                        return;
                    dest[destIndex + 0] = src[sourceIndex + 1];
                    dest[destIndex + 1] = src[sourceIndex + 0];
                    return;
                }


                dest[destIndex + 0] = src[sourceIndex + 1];
                dest[destIndex + 1] = src[sourceIndex + 0];
                dest[destIndex + 2] = src[sourceIndex + 3];
                dest[destIndex + 3] = src[sourceIndex + 2];
                destIndex += 4;
                sourceIndex += 4;


                if ((count & 2) === 0)
                    return;

                dest[destIndex + 0] = src[sourceIndex + 1];
                dest[destIndex + 1] = src[sourceIndex + 0];
                return;
            case 11:
                dest[destIndex + 0] = src[sourceIndex + 1];
                dest[destIndex + 1] = src[sourceIndex + 0];
                dest[destIndex + 2] = src[sourceIndex + 3];
                dest[destIndex + 3] = src[sourceIndex + 2];
                dest[destIndex + 4] = src[sourceIndex + 5];
                dest[destIndex + 5] = src[sourceIndex + 4];
                dest[destIndex + 6] = src[sourceIndex + 7];
                dest[destIndex + 7] = src[sourceIndex + 6];
                destIndex += 8;
                sourceIndex += 8;

                if ((count & 4) == 0) {
                    if ((count & 2) === 0)
                        return;
                    dest[destIndex + 0] = src[sourceIndex + 1];
                    dest[destIndex + 1] = src[sourceIndex + 0];
                    return;
                }


                dest[destIndex + 0] = src[sourceIndex + 1];
                dest[destIndex + 1] = src[sourceIndex + 0];
                dest[destIndex + 2] = src[sourceIndex + 3];
                dest[destIndex + 3] = src[sourceIndex + 2];
                destIndex += 4;
                sourceIndex += 4;


                if ((count & 2) === 0)
                    return;

                dest[destIndex + 0] = src[sourceIndex + 1];
                dest[destIndex + 1] = src[sourceIndex + 0];
                return;
            case 12:
                dest[destIndex + 0] = src[sourceIndex + 1];
                dest[destIndex + 1] = src[sourceIndex + 0];
                dest[destIndex + 2] = src[sourceIndex + 3];
                dest[destIndex + 3] = src[sourceIndex + 2];
                dest[destIndex + 4] = src[sourceIndex + 5];
                dest[destIndex + 5] = src[sourceIndex + 4];
                dest[destIndex + 6] = src[sourceIndex + 7];
                dest[destIndex + 7] = src[sourceIndex + 6];
                destIndex += 8;
                sourceIndex += 8;

                if ((count & 4) == 0) {
                    if ((count & 2) === 0)
                        return;
                    dest[destIndex + 0] = src[sourceIndex + 1];
                    dest[destIndex + 1] = src[sourceIndex + 0];
                    return;
                }


                dest[destIndex + 0] = src[sourceIndex + 1];
                dest[destIndex + 1] = src[sourceIndex + 0];
                dest[destIndex + 2] = src[sourceIndex + 3];
                dest[destIndex + 3] = src[sourceIndex + 2];
                destIndex += 4;
                sourceIndex += 4;


                if ((count & 2) === 0)
                    return;

                dest[destIndex + 0] = src[sourceIndex + 1];
                dest[destIndex + 1] = src[sourceIndex + 0];
                return;
            case 13:
                dest[destIndex + 0] = src[sourceIndex + 1];
                dest[destIndex + 1] = src[sourceIndex + 0];
                dest[destIndex + 2] = src[sourceIndex + 3];
                dest[destIndex + 3] = src[sourceIndex + 2];
                dest[destIndex + 4] = src[sourceIndex + 5];
                dest[destIndex + 5] = src[sourceIndex + 4];
                dest[destIndex + 6] = src[sourceIndex + 7];
                dest[destIndex + 7] = src[sourceIndex + 6];
                destIndex += 8;
                sourceIndex += 8;

                if ((count & 4) == 0) {
                    if ((count & 2) === 0)
                        return;
                    dest[destIndex + 0] = src[sourceIndex + 1];
                    dest[destIndex + 1] = src[sourceIndex + 0];
                    return;
                }


                dest[destIndex + 0] = src[sourceIndex + 1];
                dest[destIndex + 1] = src[sourceIndex + 0];
                dest[destIndex + 2] = src[sourceIndex + 3];
                dest[destIndex + 3] = src[sourceIndex + 2];
                destIndex += 4;
                sourceIndex += 4;


                if ((count & 2) === 0)
                    return;

                dest[destIndex + 0] = src[sourceIndex + 1];
                dest[destIndex + 1] = src[sourceIndex + 0];
                return;
            case 14:
                dest[destIndex + 0] = src[sourceIndex + 1];
                dest[destIndex + 1] = src[sourceIndex + 0];
                dest[destIndex + 2] = src[sourceIndex + 3];
                dest[destIndex + 3] = src[sourceIndex + 2];
                dest[destIndex + 4] = src[sourceIndex + 5];
                dest[destIndex + 5] = src[sourceIndex + 4];
                dest[destIndex + 6] = src[sourceIndex + 7];
                dest[destIndex + 7] = src[sourceIndex + 6];
                destIndex += 8;
                sourceIndex += 8;

                if ((count & 4) == 0) {
                    if ((count & 2) === 0)
                        return;
                    dest[destIndex + 0] = src[sourceIndex + 1];
                    dest[destIndex + 1] = src[sourceIndex + 0];
                    return;
                }


                dest[destIndex + 0] = src[sourceIndex + 1];
                dest[destIndex + 1] = src[sourceIndex + 0];
                dest[destIndex + 2] = src[sourceIndex + 3];
                dest[destIndex + 3] = src[sourceIndex + 2];
                destIndex += 4;
                sourceIndex += 4;


                if ((count & 2) === 0)
                    return;

                dest[destIndex + 0] = src[sourceIndex + 1];
                dest[destIndex + 1] = src[sourceIndex + 0];
                return;
            case 15:
                dest[destIndex + 0] = src[sourceIndex + 1];
                dest[destIndex + 1] = src[sourceIndex + 0];
                dest[destIndex + 2] = src[sourceIndex + 3];
                dest[destIndex + 3] = src[sourceIndex + 2];
                dest[destIndex + 4] = src[sourceIndex + 5];
                dest[destIndex + 5] = src[sourceIndex + 4];
                dest[destIndex + 6] = src[sourceIndex + 7];
                dest[destIndex + 7] = src[sourceIndex + 6];
                destIndex += 8;
                sourceIndex += 8;

                if ((count & 4) == 0) {
                    if ((count & 2) === 0)
                        return;
                    dest[destIndex + 0] = src[sourceIndex + 1];
                    dest[destIndex + 1] = src[sourceIndex + 0];
                    return;
                }


                dest[destIndex + 0] = src[sourceIndex + 1];
                dest[destIndex + 1] = src[sourceIndex + 0];
                dest[destIndex + 2] = src[sourceIndex + 3];
                dest[destIndex + 3] = src[sourceIndex + 2];
                destIndex += 4;
                sourceIndex += 4;


                if ((count & 2) === 0)
                    return;

                dest[destIndex + 0] = src[sourceIndex + 1];
                dest[destIndex + 1] = src[sourceIndex + 0];
                return;
        }

        do {
            dest[destIndex + 0] = src[sourceIndex + 1];
            dest[destIndex + 1] = src[sourceIndex + 0];
            dest[destIndex + 2] = src[sourceIndex + 3];
            dest[destIndex + 3] = src[sourceIndex + 2];
            dest[destIndex + 4] = src[sourceIndex + 5];
            dest[destIndex + 5] = src[sourceIndex + 4];
            dest[destIndex + 6] = src[sourceIndex + 7];
            dest[destIndex + 7] = src[sourceIndex + 6];
            dest[destIndex + 8] = src[sourceIndex + 9];
            dest[destIndex + 9] = src[sourceIndex + 8];
            dest[destIndex + 10] = src[sourceIndex + 11];
            dest[destIndex + 11] = src[sourceIndex + 10];
            dest[destIndex + 12] = src[sourceIndex + 13];
            dest[destIndex + 13] = src[sourceIndex + 12];
            dest[destIndex + 14] = src[sourceIndex + 15];
            dest[destIndex + 15] = src[sourceIndex + 14];
            destIndex += 16;
            sourceIndex += 16;
            count -= 16;
        } while ((count & (Convert.ToInt32(0xFFFFFFF0))) !== 0);

        switch (count) {
            case 0:
                return;
            case 1:
                return;
            case 2:
                dest[destIndex + 0] = src[sourceIndex + 1];
                dest[destIndex + 1] = src[sourceIndex + 0];
                return;
            case 3:
                dest[destIndex + 0] = src[sourceIndex + 1];
                dest[destIndex + 1] = src[sourceIndex + 0];
                return;
            case 4:
                dest[destIndex + 0] = src[sourceIndex + 1];
                dest[destIndex + 1] = src[sourceIndex + 0];
                dest[destIndex + 2] = src[sourceIndex + 3];
                dest[destIndex + 3] = src[sourceIndex + 2];
                destIndex += 4;
                sourceIndex += 4;

                if ((count & 2) == 0)
                    return;

                dest[destIndex + 0] = src[sourceIndex + 1];
                dest[destIndex + 1] = src[sourceIndex + 0];
                return;
            case 5:
                dest[destIndex + 0] = src[sourceIndex + 1];
                dest[destIndex + 1] = src[sourceIndex + 0];
                dest[destIndex + 2] = src[sourceIndex + 3];
                dest[destIndex + 3] = src[sourceIndex + 2];
                destIndex += 4;
                sourceIndex += 4;

                if ((count & 2) == 0)
                    return;

                dest[destIndex + 0] = src[sourceIndex + 1];
                dest[destIndex + 1] = src[sourceIndex + 0];
                return;
            case 6:
                dest[destIndex + 0] = src[sourceIndex + 1];
                dest[destIndex + 1] = src[sourceIndex + 0];
                dest[destIndex + 2] = src[sourceIndex + 3];
                dest[destIndex + 3] = src[sourceIndex + 2];
                destIndex += 4;
                sourceIndex += 4;

                if ((count & 2) == 0)
                    return;

                dest[destIndex + 0] = src[sourceIndex + 1];
                dest[destIndex + 1] = src[sourceIndex + 0];
                return;
            case 7:
                dest[destIndex + 0] = src[sourceIndex + 1];
                dest[destIndex + 1] = src[sourceIndex + 0];
                dest[destIndex + 2] = src[sourceIndex + 3];
                dest[destIndex + 3] = src[sourceIndex + 2];
                destIndex += 4;
                sourceIndex += 4;

                if ((count & 2) == 0)
                    return;

                dest[destIndex + 0] = src[sourceIndex + 1];
                dest[destIndex + 1] = src[sourceIndex + 0];
                return;
        }
    }
}
// Unicode decoder implementation.
class UnicodeDecoder extends Decoder {
    private bigEndian: boolean = false;
    private leftOverByte: int = 0;

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
                return Convert.ToUInt32((count + 1) / 2);
            } else {
                return Convert.ToInt32(count / 2);
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
            let charIndex: int = args[4];
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

            if (byteCount === 0)
                return 0;

            const leftOver: int = this.leftOverByte;
            let count: int;

            if (leftOver !== -1)
                count = Convert.ToInt32((byteCount + 1) / 2);
            else
                count = Convert.ToInt32(byteCount / 2);

            if (chars.length - charIndex < count)
                throw new ArgumentException(Encoding._("Arg_InsufficientSpace"));

            if (leftOver != -1) {
                if (this.bigEndian)
                    chars[charIndex] = Convert.ToChar((leftOver) << 8 | Convert.ToInt32(bytes[byteIndex]));
                else
                    chars[charIndex] = Convert.ToChar((Convert.ToInt32(bytes[byteIndex]) << 8) | leftOver);
                charIndex++;
                byteIndex++;
                byteCount--;
            }

            if ((byteCount & (Convert.ToInt32(0xFFFFFFFE))) !== 0)
                (UnicodeEncoding as any).CopyChars(bytes.slice(byteIndex), Convert.ToByteArray(chars, charIndex * 2), byteCount, this.bigEndian);

            if ((byteCount & 1) === 0)
                this.leftOverByte = -1;
            else
                this.leftOverByte = bytes[byteCount + byteIndex - 1];

            return count;
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

} // class UnicodeDecoder