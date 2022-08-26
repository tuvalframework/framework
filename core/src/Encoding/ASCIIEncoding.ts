import { byte } from "../byte";
import { Convert } from "../convert";
import { ArgumentException } from "../Exceptions/ArgumentException";
import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { ArgumentOutOfRangeException } from "../Exceptions/ArgumentOutOfRangeException";
import { TChar } from "../Extensions/TChar";
import { ByteArray, char, CharArray, int, New } from "../float";
import { is } from "../is";
import { Out } from "../Out";
import { Override } from "../Reflection/Decorators/ClassInfo";
import { TString } from '../Text/TString';
import { DecoderFallbackBuffer } from "./DecoderFallbackBuffer";
import { EncoderFallbackBuffer } from "./EncoderFallbackBuffer";
import { Encoding } from "./Encoding";

export class ASCIIEncoding extends Encoding {
    protected dispose(disposing: boolean): void {
        throw new Error("Method not implemented.");
    }
    // Magic number used by Windows for "ASCII".
    private static readonly _ASCII_CODE_PAGE: int = 20127;

    // Constructor.
    public constructor() {

        super(ASCIIEncoding._ASCII_CODE_PAGE)
        this.body_name = this.header_name = this.web_name = "us-ascii";
        this.encoding_name = "US-ASCII";
        this.is_mail_news_display = true;
        this.is_mail_news_save = true;
    }

    @Override
    public get IsSingleByte(): boolean {
        return true;
    }


    // Get the number of characters needed to encode a character buffer.
    public /* override */  GetByteCount(chars: CharArray, index: int, count: int): int;
    public /* override */  GetByteCount(s: string): int;
    public /* override */  GetByteCount(chars: CharArray): int;
    public /* override */  GetByteCount(chars: CharArray, count: int): int;
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
            return count;
        } else if (args.length === 1 && is.string(args[0])) {
            const chars: string = args[0];
            if (chars == null) {
                throw new ArgumentNullException("chars");
            }
            return chars.length;
        } else if (args.length === 1 && is.CharArray(args[0])) {
            const chars: CharArray = args[0];
            return super.GetByteCount(chars);
        } else if (args.length === 2 && is.CharArray(args[0]) && is.int(args[1])) {
            const chars: CharArray = args[0];
            const count: int = args[1];
            return count;
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
            const charIndex: int = args[1];
            const charCount: int = args[2];
            const bytes: ByteArray = args[3];
            const byteIndex: int = args[4];

            const buffer: Out<EncoderFallbackBuffer> = New.Out(null as any);
            const fallback_chars: Out<CharArray> = New.Out(null as any);

            return this.getBytes(chars, charIndex, charCount, bytes, byteIndex, buffer, fallback_chars);
        } else if (args.length === 5 && is.string(args[0]) && is.int(args[1]) && is.int(args[2]) && is.ByteArray(args[3]) && is.int(args[4])) {
            const chars: string = args[0];
            const charIndex: int = args[1];
            const charCount: int = args[2];
            const bytes: ByteArray = args[3];
            const byteIndex: int = args[4];

            const buffer: Out<EncoderFallbackBuffer> = New.Out(null as any);
            const fallback_chars: Out<CharArray> = New.Out(null as any);
            return this.getBytes(TString.ToCharArray(chars), charIndex, charCount, bytes, byteIndex, buffer, fallback_chars);

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
            if (bytes == null)
                throw new ArgumentNullException("bytes");
            if (charCount < 0)
                throw new ArgumentOutOfRangeException("charCount");
            if (byteCount < 0)
                throw new ArgumentOutOfRangeException("byteCount");

            if (byteCount < charCount)
                throw new ArgumentException("bytecount is less than the number of bytes required", "byteCount");

            for (let i: int = 0; i < charCount; i++) {
                const c: char = chars[i];
                bytes[i] = Convert.ToByte((c < Convert.ToChar(0x80)) ? c : '?'.charCodeAt(0));
            }
            return charCount;
        }
        throw new ArgumentOutOfRangeException('');
    }



    private getBytes(chars: CharArray, charIndex: int, charCount: int, bytes: ByteArray, byteIndex: int, buffer: Out<EncoderFallbackBuffer>, fallback_chars: Out<CharArray>): int {
        if (chars == null)
            throw new ArgumentNullException("chars");

        return this.InternalGetBytes(chars, chars.length, charIndex, charCount, bytes, byteIndex, buffer, fallback_chars);

    }



    /* private getBytes( chars: string,  charIndex:int,  charCount:int, bytes:ByteArray,  byteIndex:int, buffer:Out<EncoderFallbackBuffer>, fallback_chars:Out<CharArray>):int {
        if (chars == null)
            throw new ArgumentNullException("chars");

        const cptr = TString.ToCharArray(chars);
                return this.InternalGetBytes(cptr, chars.length, charIndex, charCount, bytes, byteIndex, buffer, fallback_chars);

        } */


    private InternalGetBytes(chars: CharArray, charLength: int, charIndex: int, charCount: int, bytes: ByteArray, byteIndex: int, buffer: Out<EncoderFallbackBuffer>, fallback_chars: Out<CharArray>): int {
        if (bytes == null)
            throw new ArgumentNullException("bytes");
        if (charIndex < 0 || charIndex > charLength)
            throw new ArgumentOutOfRangeException("charIndex", Encoding._("ArgRange_StringIndex"));
        if (charCount < 0 || charCount > (charLength - charIndex))
            throw new ArgumentOutOfRangeException("charCount", Encoding._("ArgRange_StringRange"));
        if (byteIndex < 0 || byteIndex > bytes.length)
            throw new ArgumentOutOfRangeException("byteIndex", Encoding._("ArgRange_Array"));
        if ((bytes.length - byteIndex) < charCount)
            throw new ArgumentException(Encoding._("Arg_InsufficientSpace"));

        let count: int = charCount;
        let ch: char;
        while (count-- > 0) {
            ch = chars[charIndex++];
            if (ch < Convert.ToChar(0x80)) {
                bytes[byteIndex++] = Convert.ToChar(ch);
            } else {
                if (buffer.value == null)
                    buffer.value = this.EncoderFallback.CreateFallbackBuffer();
                if (TChar.IsSurrogate(ch) && count > 1 && TChar.IsSurrogate(chars[charIndex]))
                    buffer.value.Fallback(ch, chars[charIndex], charIndex++ - 1);
                else
                    buffer.value.Fallback(ch, charIndex - 1);
                if (fallback_chars.value == null || fallback_chars.value.length < buffer.value.Remaining)
                    fallback_chars.value = New.CharArray(buffer.value.Remaining);
                for (let i: int = 0; i < fallback_chars.value.length; i++)
                    fallback_chars[i] = buffer.value.GetNextChar();
                byteIndex += this.getBytes(fallback_chars.value, 0, fallback_chars.value.length, bytes, byteIndex, buffer, fallback_chars);
            }
        }
        return charCount;
    }

    // Get the number of characters needed to decode a byte buffer.
    public /* abstract */  GetCharCount(bytes: ByteArray, index: int, count: int): int;
    public /* virtual */  GetCharCount(bytes: ByteArray): int;
    public /* virtual */  GetCharCount(bytes: ByteArray, count: int): int
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
            return count;
        } else if (args.length === 1 && is.ByteArray(args[0])) {
            const bytes: ByteArray = args[0];
            return super.GetCharCount(bytes);
        } else if (args.length === 2 && is.ByteArray(args[0]) && is.int(args[1])) {
            const bytes: ByteArray = args[0];
            const count: int = args[1];
            return count;
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

            const buffer: Out<DecoderFallbackBuffer> = New.Out(null as any);
            return this.getChars(bytes, byteIndex, byteCount, chars, charIndex, buffer);

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
            if (charCount < byteCount)
                throw new ArgumentException("charcount is less than the number of bytes required", "charCount");

            for (let i: int = 0; i < byteCount; i++) {
                const b: byte = bytes[i];
                chars[i] = b > 127 ? '?'.charCodeAt(0) : Convert.ToChar(b);
            }
            return byteCount;
        }
        throw new ArgumentOutOfRangeException('');
    }


    private getChars(bytes: ByteArray, byteIndex: int, byteCount: int, chars: CharArray, charIndex: int, buffer: Out<DecoderFallbackBuffer>): int {
        if (bytes == null)
            throw new ArgumentNullException("bytes");
        if (chars == null)
            throw new ArgumentNullException("chars");
        if (byteIndex < 0 || byteIndex > bytes.length)
            throw new ArgumentOutOfRangeException("byteIndex", Encoding._("ArgRange_Array"));
        if (byteCount < 0 || byteCount > (bytes.length - byteIndex))
            throw new ArgumentOutOfRangeException("byteCount", Encoding._("ArgRange_Array"));
        if (charIndex < 0 || charIndex > chars.length)
            throw new ArgumentOutOfRangeException("charIndex", Encoding._("ArgRange_Array"));

        if ((chars.length - charIndex) < byteCount)
            throw new ArgumentException(Encoding._("Arg_InsufficientSpace"));

        let count: int = byteCount;
        while (count-- > 0) {
            const c: char = Convert.ToChar(bytes[byteIndex++]);
            if (c < '\x80'.charCodeAt(0))
                chars[charIndex++] = c;
            else {
                if (buffer.value == null)
                    buffer.value = this.DecoderFallback.CreateFallbackBuffer();
                var thisByte = New.ByteArray([bytes[byteIndex - 1]]);
                buffer.value.Fallback(thisByte, 0);
                while (buffer.value.Remaining > 0) {
                    if (charIndex < chars.length) {
                        chars[charIndex++] = buffer.value.GetNextChar();
                        continue;
                    }
                    throw new ArgumentException(
                        "The output char buffer is too small to contain the " +
                        "decoded characters.");
                }
            }
        }
        return byteCount;
    }

    // Get the maximum number of bytes needed to encode a
    // specified number of characters.
    @Override
    public GetMaxByteCount(charCount: int): int {
        if (charCount < 0) {
            throw new ArgumentOutOfRangeException("charCount", Encoding._("ArgRange_NonNegative"));
        }
        return charCount;
    }

    // Get the maximum number of characters needed to decode a
    // specified number of bytes.
    @Override
    public GetMaxCharCount(byteCount: int): int {
        if (byteCount < 0) {
            throw new ArgumentOutOfRangeException("byteCount", Encoding._("ArgRange_NonNegative"));
        }
        return byteCount;
    }

    // Decode a buffer of bytes into a string.
    public /* virtual */ GetString(bytes: ByteArray, index: int, count: int): string;
    public /* virtual */ GetString(bytes: ByteArray): string;
    public /* virtual */ GetString(...args: any[]): string {
        if (args.length === 3 && is.ByteArray(args[0]) && is.int(args[1]) && is.int(args[2])) {
            const bytes: ByteArray = args[0];
            const byteIndex: int = args[1];
            const byteCount: int = args[2];

            if (bytes == null) {
                throw new ArgumentNullException("bytes");
            }
            if (byteIndex < 0 || byteIndex > bytes.length) {
                throw new ArgumentOutOfRangeException("byteIndex", Encoding._("ArgRange_Array"));
            }
            if (byteCount < 0 || byteCount > (bytes.length - byteIndex)) {
                throw new ArgumentOutOfRangeException("byteCount", Encoding._("ArgRange_Array"));
            }
            if (byteCount === 0)
                return TString.Empty;

            let currentByteIndex: int = 0;
            let charIndex: int = 0;
            /*   unsafe {
                  fixed(byte * bytePtr = bytes) { */
            const charPtr: CharArray = New.CharArray(byteCount);

            // fixed(char * charPtr = s) {
            let currByte: int = currentByteIndex + byteIndex;
            const lastByte: int = currByte + byteCount;
            //char * currChar = charPtr;

            while (currByte < lastByte) {
                const b: byte = bytes[currByte++];
                charPtr[charIndex++] = b <= 0x7F ? Convert.ToChar(b) : Convert.ToChar('?'.charCodeAt(0));
            }


            return TString.FromCharArray(charPtr);


        } else if (args.length === 1 && is.ByteArray(args[0])) {
            const bytes: ByteArray = args[0];
            return super.GetString(bytes);
        }
        throw new ArgumentOutOfRangeException('');
    }

} // class ASCIIEncoding