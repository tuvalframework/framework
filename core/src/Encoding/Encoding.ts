import { Activator } from "../Activator";
import { ArgumentException } from "../Exceptions/ArgumentException";
import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { ArgumentOutOfRangeException } from '../Exceptions/ArgumentOutOfRangeException';
import { InvalidOperationException } from "../Exceptions/InvalidOperationException";
import { NotSupportedException } from "../Exceptions/NotSupportedException";
import { TString } from "../Extensions";
import { ByteArray, CharArray, int, New, IntArray } from '../float';
import { is } from "../is";
import { Assembly } from "../Reflection/Assembly";
import { BindingFlags } from "../Reflection/BindingFlags";
import { ClassInfo, Override, Virtual } from "../Reflection/Decorators/ClassInfo";
import { Type } from "../Reflection/Type";
import { Decoder } from "./Decoder";
import { DecoderFallback } from "./DecoderFallback";
import { Encoder } from "./Encoder";
import { EncoderFallback } from "./EncoderFallback";
import { TObject } from '../Extensions/TObject';
import { ICloneable } from "../ICloneable";
import { System } from '../SystemTypes';
import { EncodingInfo } from "./EncodingInfo";
import { NormalizationForm } from "./NormalizationForm";
import { Context } from '../Context/Context';
import { Out } from "../Out";
import { DecoderReplacementFallback } from "./DecoderReplacementFallback";
import { Convert } from '../convert';

@ClassInfo({
	fullName: System.Types.Encoding.Encoding,
	instanceof: [
		System.Types.Encoding.Encoding,
        System.Types.ICloneable
	]
})
export abstract class Encoding extends TObject implements ICloneable<Encoding>
{
    private static readonly UTF32_CODE_PAGE: int = 12000;
    private static readonly BIG_UTF32_CODE_PAGE: int = 12001;
    protected static readonly UTF8_CODE_PAGE: int = 65001;
    protected static readonly UNICODE_CODE_PAGE: int = 1200;
    private static readonly BIG_UNICODE_CODE_PAGE: int = 1201;
    // Magic number used by Windows for the ISO Latin1 code page.
    private static readonly ISOLATIN_CODE_PAGE: int = 28591;
    private static readonly UTF7_CODE_PAGE: int = 65000;
    private static readonly ASCII_CODE_PAGE: int = 20127;

    // Code page used by this encoding.
    public /* internal */  codePage: int = 0;
    public /* internal */  windows_code_page: int = 0;
    private is_readonly: boolean = true;

    // Constructor.
    protected constructor();
    protected constructor(codePage: int);
    protected constructor(...args: any[]) {
        super();
        if (args.length === 0) {

        } else if (args.length === 1 && is.int(args[0])) {
            const codePage: int = args[0];
            this.codePage = this.windows_code_page = codePage;
            switch (codePage) {
                default:
                    // MS has "InternalBestFit{Decoder|Encoder}Fallback
                    // here, but we dunno what they are for.
                    this.decoder_fallback = DecoderFallback.ReplacementFallback;
                    this.encoder_fallback = EncoderFallback.ReplacementFallback;
                    break;
                case 20127: // ASCII
                case 54936: // GB18030
                    this.decoder_fallback = DecoderFallback.ReplacementFallback;
                    this.encoder_fallback = EncoderFallback.ReplacementFallback;
                    break;
                case 1200: // UTF16
                case 1201: // UTF16
                case 12000: // UTF32
                case 12001: // UTF32
                case 65000: // UTF7
                case 65001: // UTF8
                    this.decoder_fallback = DecoderFallback.StandardSafeFallback;
                    this.encoder_fallback = EncoderFallback.StandardSafeFallback;
                    break;
            }
        }
    }



    // until we change the callers:
    public /* internal */ static _(arg: string): string {
        return arg;
    }

    private decoder_fallback: DecoderFallback = null as any;
    private encoder_fallback: EncoderFallback = null as any;

    public get IsReadOnly(): boolean {
        return this.is_readonly;
    }

    @Virtual
    protected Get_IsSingleByte(): boolean {
        return false;
    }
    public get IsSingleByte(): boolean {
        return this.Get_IsSingleByte();
    }

    public get DecoderFallback(): DecoderFallback {
        return this.decoder_fallback;
    }

    public set DecoderFallback(value: DecoderFallback) {
        if (this.IsReadOnly)
            throw new InvalidOperationException("This Encoding is readonly.");
        if (value == null)
            throw new ArgumentNullException('');
        this.decoder_fallback = value;
    }

    public get EncoderFallback(): EncoderFallback {
        return this.encoder_fallback;
    }
    public set EncoderFallback(value: EncoderFallback) {
        if (this.IsReadOnly)
            throw new InvalidOperationException("This Encoding is readonly.");
        if (value == null)
            throw new ArgumentNullException('');
        this.encoder_fallback = value;
    }


    public /* internal */  SetFallbackInternal(e: EncoderFallback, d: DecoderFallback): void {
        if (e != null)
            this.encoder_fallback = e;
        if (d != null)
            this.decoder_fallback = d;
    }

    // Convert between two encodings.
    public static Convert(srcEncoding: Encoding, dstEncoding: Encoding, bytes: ByteArray): ByteArray;
    public static Convert(srcEncoding: Encoding, dstEncoding: Encoding, bytes: ByteArray, index: int, count: int): ByteArray;
    public static Convert(...args: any[]): ByteArray {
        if (args.length === 3 && is.typeof<Encoding>(args[0], System.Types.Encoding.Encoding) && is.typeof<Encoding>(args[1], System.Types.Encoding.Encoding) && is.ByteArray(args[2])) {
            const srcEncoding: Encoding = args[0];
            const dstEncoding: Encoding = args[1];
            const bytes: ByteArray = args[2];
            if (srcEncoding == null) {
                throw new ArgumentNullException("srcEncoding");
            }
            if (dstEncoding == null) {
                throw new ArgumentNullException("dstEncoding");
            }
            if (bytes == null) {
                throw new ArgumentNullException("bytes");
            }
            return dstEncoding.GetBytes(srcEncoding.GetChars(bytes, 0, bytes.length));
        } else if (args.length === 3 && is.typeof<Encoding>(args[0], System.Types.Encoding.Encoding) && is.typeof<Encoding>(args[1], System.Types.Encoding.Encoding) && is.ByteArray(args[2]) && is.int(args[3]) && is.int(args[4])) {
            const srcEncoding: Encoding = args[0];
            const dstEncoding: Encoding = args[1];
            const bytes: ByteArray = args[2];
            const index: int = args[3];
            const count: int = args[4];

            if (srcEncoding == null) {
                throw new ArgumentNullException("srcEncoding");
            }
            if (dstEncoding == null) {
                throw new ArgumentNullException("dstEncoding");
            }
            if (bytes == null) {
                throw new ArgumentNullException("bytes");
            }
            if (index < 0 || index > bytes.length) {
                throw new ArgumentOutOfRangeException("index", Encoding._("ArgRange_Array"));
            }
            if (count < 0 || (bytes.length - index) < count) {
                throw new ArgumentOutOfRangeException("count", Encoding._("ArgRange_Array"));
            }
            return dstEncoding.GetBytes(srcEncoding.GetChars(bytes, index, count));
        }
        throw new ArgumentOutOfRangeException('');
    }

    // Determine if two Encoding objects are equal.
    @Override
    public Equals<Encoding>(value: Encoding): boolean {
        const enc: Encoding = (value as Encoding);
        if (enc != null) {
            return this.codePage === (enc as any).codePage /* &&
                DecoderFallback.Equals(enc.DecoderFallback) &&
                EncoderFallback.Equals(enc.EncoderFallback) */;
        } else {
            return false;
        }
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
            // do nothing in this class.
        } else if (args.length === 1 && is.string(args[0])) {
            const s: string = args[0];
            if (s == null)
                throw new ArgumentNullException("s");

            if (s.length === 0) {
                return 0;
            }
            return this.GetByteCount(TString.ToCharArray(s), s.length);
        } else if (args.length === 1 && is.CharArray(args[0])) {
            const chars: CharArray = args[0];
            if (chars != null) {
                return this.GetByteCount(chars, 0, chars.length);
            } else {
                throw new ArgumentNullException("chars");
            }
        } else if (args.length === 2 && is.CharArray(args[0]) && is.int(args[1])) {
            const chars: CharArray = args[0];
            const count: int = args[1];
            if (chars == null)
                throw new ArgumentNullException("chars");
            if (count < 0)
                throw new ArgumentOutOfRangeException("count");
            const c: CharArray = New.CharArray(count);

            for (let p: int = 0; p < count; p++) {
                c[p] = chars[p];
            }

            return this.GetByteCount(c);
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
            // do nothing in this class.
        } else if (args.length === 5 && is.string(args[0]) && is.int(args[1]) && is.int(args[2]) && is.ByteArray(args[3]) && is.int(args[4])) {
            const s: string = args[0];
            const charIndex: int = args[1];
            const charCount: int = args[2];
            const bytes: ByteArray = args[3];
            const byteIndex: int = args[4];
            if (s == null)
                throw new ArgumentNullException("s");
            if (charIndex < 0 || charIndex > s.length)
                throw new ArgumentOutOfRangeException("charIndex", Encoding._("ArgRange_Array"));
            if (charCount < 0 || charIndex > (s.length - charCount))
                throw new ArgumentOutOfRangeException("charCount", Encoding._("ArgRange_Array"));
            if (byteIndex < 0 || byteIndex > bytes.length)
                throw new ArgumentOutOfRangeException("byteIndex", Encoding._("ArgRange_Array"));

            if (charCount === 0 || bytes.length === byteIndex)
                return 0;

            const cptr = TString.ToCharArray(s);
            return this.GetBytes(cptr.slice(charIndex), charCount, Convert.ToByteArray(bytes, byteIndex), bytes.length - byteIndex);
        } else if (args.length === 1 && is.string(args[0])) {
            const s: string = args[0];
            if (s == null)
                throw new ArgumentNullException("s");

            if (s.length === 0)
                return New.ByteArray(0);

            const byteCount: int = this.GetByteCount(s);
            if (byteCount === 0)
                return New.ByteArray(0);

            const cptr = TString.ToCharArray(s);
            const bytes: ByteArray = New.ByteArray(byteCount);
            this.GetBytes(cptr, s.length, bytes, byteCount);
            return bytes;
        } else if (args.length === 3 && is.CharArray(args[0]) && is.int(args[1]) && is.int(args[2])) {
            const chars: CharArray = args[0];
            const index: int = args[1];
            const count: int = args[2];
            const numBytes: int = this.GetByteCount(chars, index, count);
            const bytes: ByteArray = New.ByteArray(numBytes);
            this.GetBytes(chars, index, count, bytes, 0);
            return bytes;
        } else if (args.length === 1 && is.CharArray(args[0])) {
            const chars: CharArray = args[0];
            const numBytes: int = this.GetByteCount(chars, 0, chars.length);
            const bytes: ByteArray = New.ByteArray(numBytes);
            this.GetBytes(chars, 0, chars.length, bytes, 0);
            return bytes;
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

            const c: CharArray = New.CharArray(charCount);

            for (let i: int = 0; i < charCount; i++) {
                c[i] = chars[i];
            }

            const b: ByteArray = this.GetBytes(c, 0, charCount);
            const top: int = b.length;
            if (top > byteCount)
                throw new ArgumentException("byteCount is less that the number of bytes produced", "byteCount");

            for (let i: int = 0; i < top; i++) {
                bytes[i] = b[i];
            }

            return b.length;
        }
        throw new ArgumentOutOfRangeException('');
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
            // do nothing in this class. This method is abstract.
        } else if (args.length === 1 && is.ByteArray(args[0])) {
            const bytes: ByteArray = args[0];
            if (bytes == null) {
                throw new ArgumentNullException("bytes");
            }
            return this.GetCharCount(bytes, 0, bytes.length);
        } else if (args.length === 2 && is.ByteArray(args[0]) && is.int(args[1])) {
            const bytes: ByteArray = args[0];
            const count: int = args[1];

            if (bytes == null)
                throw new ArgumentNullException("bytes");
            if (count < 0)
                throw new ArgumentOutOfRangeException("count");

            const ba: ByteArray = New.ByteArray(count);
            for (let i: int = 0; i < count; i++)
                ba[i] = bytes[i];
            return this.GetCharCount(ba, 0, count);
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
            // do nothing in this class. This method is abstract.
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
            if (bytes == null)
                throw new ArgumentNullException("bytes");
            if (chars == null)
                throw new ArgumentNullException("chars");
            if (charCount < 0)
                throw new ArgumentOutOfRangeException("charCount");
            if (byteCount < 0)
                throw new ArgumentOutOfRangeException("byteCount");

            const ba: ByteArray = New.ByteArray(byteCount);
            for (let i: int = 0; i < byteCount; i++)
                ba[i] = bytes[i];
            const ret: CharArray = this.GetChars(ba, 0, byteCount);
            const top: int = ret.length;

            if (top > charCount)
                throw new ArgumentException("charCount is less than the number of characters produced", "charCount");

            for (let i: int = 0; i < top; i++)
                chars[i] = ret[i];
            return top;
        }
        throw new ArgumentOutOfRangeException('');
    }



    // Get a decoder that forwards requests to this object.
    @Virtual
    public GetDecoder(): Decoder {
        return new ForwardingDecoder(this);
    }

    // Get an encoder that forwards requests to this object.
    @Virtual
    public GetEncoder(): Encoder {
        return new ForwardingEncoder(this);
    }

    // Loaded copy of the "I18N" assembly.  We need to move
    // this into a class in "System.Private" eventually.
    private static i18nAssembly: Assembly;
    private static i18nDisabled: boolean;

    // Invoke a specific method on the "I18N" manager object.
    // Returns NULL if the method failed.
    private static InvokeI18N(name: string, ...args: any[]): any {
        // Bail out if we previously detected that there
        // is insufficent engine support for I18N handling.
        if (Encoding.i18nDisabled) {
            return null;
        }

        // Find or load the "I18N" assembly.
        if (Encoding.i18nAssembly == null) {
            try {
                try {
                    Encoding.i18nAssembly = null as any; // Assembly.Load(Consts.AssemblyI18N);
                } catch (NotImplementedException) {
                    // Assembly loading unsupported by the engine.
                    Encoding.i18nDisabled = true;
                    return null;
                }
                if (Encoding.i18nAssembly == null) {
                    return null;
                }
            } catch (SystemException) {
                return null;
            }
        }

        // Find the "I18N.Common.Manager" class.
        let managerClass: Type;
        try {
            managerClass = (Encoding.i18nAssembly as any).GetType("I18N.Common.Manager");
        } catch (NotImplementedException) {
            // "GetType" is not supported by the engine.
            Encoding.i18nDisabled = true;
            return null;
        }
        if (managerClass == null) {
            return null;
        }

        // Get the value of the "PrimaryManager" property.
        let manager: any;
        try {
            manager = (managerClass as any).InvokeMember
                ("PrimaryManager",
                    BindingFlags.GetProperty |
                    BindingFlags.Static |
                    BindingFlags.Public,
                    null, null, null, null, null, null);
            if (manager == null) {
                return null;
            }
        } catch (e) {
            // "InvokeMember" is not supported by the engine.
            Encoding.i18nDisabled = true;
            return null;
        }

        // Invoke the requested method on the manager.
        try {
            return (managerClass as any).InvokeMember
                (name,
                    BindingFlags.InvokeMethod |
                    BindingFlags.Instance |
                    BindingFlags.Public,
                    null, manager, args, null, null, null);
        } catch (SecurityException) {
            return null;
        }
    }

    // Get an encoder for a specific code page.
    public static GetEncoding(codepage: int): Encoding;
    public static GetEncoding(name: string): Encoding;
    public static GetEncoding(codepage: int, encoderFallback: EncoderFallback, decoderFallback: DecoderFallback): Encoding;
    public static GetEncoding(name: string, encoderFallback: EncoderFallback, decoderFallback: DecoderFallback): Encoding;
    public static GetEncoding(...args: any[]): Encoding {
        if (args.length === 1 && is.int(args[0])) {
            const codepage: int = args[0];
            if (codepage < 0 || codepage > 0xffff)
                throw new ArgumentOutOfRangeException("codepage",
                    "Valid values are between 0 and 65535, inclusive.");

            // Check for the builtin code pages first.
            switch (codepage) {
                case 0: return Encoding.Default;

                case Encoding.ASCII_CODE_PAGE:
                    return Encoding.ASCII;

                case Encoding.UTF7_CODE_PAGE:
                    return Encoding.UTF7;

                case Encoding.UTF8_CODE_PAGE:
                    return Encoding.UTF8;

                case Encoding.UTF32_CODE_PAGE:
                    return Encoding.UTF32;

                case Encoding.BIG_UTF32_CODE_PAGE:
                    return Encoding.BigEndianUTF32;

                case Encoding.UNICODE_CODE_PAGE:
                    return Encoding.Unicode;

                case Encoding.BIG_UNICODE_CODE_PAGE:
                    return Encoding.BigEndianUnicode;

                case Encoding.ISOLATIN_CODE_PAGE:
                    return Encoding.ISOLatin1;
                default: break;
            }
            // Try to obtain a code page handler from the I18N handler.
            let enc: Encoding = (Encoding.InvokeI18N("GetEncoding", codepage));
            if (enc != null) {
                enc.is_readonly = true;
                return enc;
            }

            // Build a code page class name.
            const cpName: string = "System.Text.CP" + codepage.toString();

            // Look for a code page converter in this assembly.
            const assembly = (Assembly as any).GetExecutingAssembly();
            let type: Type = assembly.GetType(cpName);
            if (type != null) {
                enc = Activator.CreateInstance(type) as Encoding;
                enc.is_readonly = true;
                return enc;
            }

            // Look in any assembly, in case the application
            // has provided its own code page handler.
            type = (Type as any).GetType(cpName);
            if (type != null) {
                enc = (Activator.CreateInstance(type)) as Encoding;
                enc.is_readonly = true;
                return enc;
            }
            // We have no idea how to handle this code page.
            throw new NotSupportedException(TString.Format("CodePage {0} not supported", codepage.toString()));
        } else if (args.length === 1 && is.string(args[0])) {
            const name: string = args[0];
            // Validate the parameters.
            if (name == null) {
                throw new ArgumentNullException("name");
            }

            const converted: string = name.toLowerCase().replace('-', '_');

            // Builtin web encoding names and the corresponding code pages.
            switch (converted) {
                case "ascii":
                case "us_ascii":
                case "us":
                case "ansi_x3.4_1968":
                case "ansi_x3.4_1986":
                case "cp367":
                case "csascii":
                case "ibm367":
                case "iso_ir_6":
                case "iso646_us":
                case "iso_646.irv:1991":
                    return Encoding.GetEncoding(Encoding.ASCII_CODE_PAGE);

                case "utf_7":
                case "csunicode11utf7":
                case "unicode_1_1_utf_7":
                case "unicode_2_0_utf_7":
                case "x_unicode_1_1_utf_7":
                case "x_unicode_2_0_utf_7":
                    return Encoding.GetEncoding(Encoding.UTF7_CODE_PAGE);

                case "utf_8":
                case "unicode_1_1_utf_8":
                case "unicode_2_0_utf_8":
                case "x_unicode_1_1_utf_8":
                case "x_unicode_2_0_utf_8":
                    return Encoding.GetEncoding(Encoding.UTF8_CODE_PAGE);

                case "utf_16":
                case "utf_16le":
                case "ucs_2":
                case "unicode":
                case "iso_10646_ucs2":
                    return Encoding.GetEncoding(Encoding.UNICODE_CODE_PAGE);

                case "unicodefffe":
                case "utf_16be":
                    return Encoding.GetEncoding(Encoding.BIG_UNICODE_CODE_PAGE);

                case "utf_32":
                case "utf_32le":
                case "ucs_4":
                    return Encoding.GetEncoding(Encoding.UTF32_CODE_PAGE);

                case "utf_32be":
                    return Encoding.GetEncoding(Encoding.BIG_UTF32_CODE_PAGE);

                case "iso_8859_1":
                case "latin1":
                    return Encoding.GetEncoding(Encoding.ISOLATIN_CODE_PAGE);
            }

            // Try to obtain a web encoding handler from the I18N handler.
            const enc: Encoding = Encoding.InvokeI18N("GetEncoding", name);
            if (enc != null) {
                return enc;
            }

            // Build a web encoding class name.
            const encName: string = "System.Text.ENC" + converted;


            // Look for a code page converter in this assembly.
            const assembly: Assembly = (Assembly as any).GetExecutingAssembly();
            let type: Type = (assembly as any).GetType(encName);
            if (type != null) {
                return (Activator.CreateInstance(type));
            }

            // Look in any assembly, in case the application
            // has provided its own code page handler.
            type = (Type as any).GetType(encName);
            if (type != null) {
                return (Activator.CreateInstance(type));
            }
            // We have no idea how to handle this encoding name.
            throw new ArgumentException(TString.Format("Encoding name '{0}' not " + "supported", name), "name");
        } else if (args.length === 3 && is.int(args[0]) && is.typeof<EncoderFallback>(args[0], System.Types.Encoding.EncoderFallback) && is.typeof<DecoderFallback>(args[0], System.Types.Encoding.DecoderFallback)) {
            const codepage: int = args[0];
            const encoderFallback: EncoderFallback = args[1];
            const decoderFallback: DecoderFallback = args[2];

            if (encoderFallback == null)
                throw new ArgumentNullException("encoderFallback");
            if (decoderFallback == null)
                throw new ArgumentNullException("decoderFallback");

            const e: Encoding = Encoding.GetEncoding(codepage).Clone() as Encoding;
            e.is_readonly = false;
            e.encoder_fallback = encoderFallback;
            e.decoder_fallback = decoderFallback;
            return e;
        } else if (args.length === 3 && is.string(args[0]) && is.typeof<EncoderFallback>(args[0], System.Types.Encoding.EncoderFallback) && is.typeof<DecoderFallback>(args[0], System.Types.Encoding.DecoderFallback)) {
            const name: string = args[0];
            const encoderFallback: EncoderFallback = args[1];
            const decoderFallback: DecoderFallback = args[2];
            if (encoderFallback == null)
                throw new ArgumentNullException("encoderFallback");
            if (decoderFallback == null)
                throw new ArgumentNullException("decoderFallback");

            const e: Encoding = Encoding.GetEncoding(name).Clone() as Encoding;
            e.is_readonly = false;
            e.encoder_fallback = encoderFallback;
            e.decoder_fallback = decoderFallback;
            return e;
        }
        throw new ArgumentOutOfRangeException('');
    }

    @Virtual
    public Clone(): Encoding {
        const e: Encoding = this.MemberwiseClone();
        e.is_readonly = false;
        return e;
    }


    private static encoding_infos: EncodingInfo[];

    // FIXME: As everyone would agree, this implementation is so *hacky*
    // and could be very easily broken. But since there is a test for
    // this method to make sure that this method always returns
    // the same number and content of encoding infos, this won't
    // matter practically.
    public static GetEncodings(): EncodingInfo[] {
        if (Encoding.encoding_infos == null) {
            const codepages: IntArray = New.IntArray([
                37, 437, 500, 708,
                850, 852, 855, 857, 858, 860, 861, 862, 863,
                864, 865, 866, 869, 870, 874, 875,
                932, 936, 949, 950,
                1026, 1047, 1140, 1141, 1142, 1143, 1144,
                1145, 1146, 1147, 1148, 1149,
                1200, 1201, 1250, 1251, 1252, 1253, 1254,
                1255, 1256, 1257, 1258,
                10000, 10079, 12000, 12001,
                20127, 20273, 20277, 20278, 20280, 20284,
                20285, 20290, 20297, 20420, 20424, 20866,
                20871, 21025, 21866, 28591, 28592, 28593,
                28594, 28595, 28596, 28597, 28598, 28599,
                28605, 38598,
                50220, 50221, 50222, 51932, 51949, 54936,
                57002, 57003, 57004, 57005, 57006, 57007,
                57008, 57009, 57010, 57011,
                65000, 65001]);

            Encoding.encoding_infos = New.Array(codepages.length);
            for (let i: int = 0; i < codepages.length; i++)
                Encoding.encoding_infos[i] = new EncodingInfo(codepages[i]);
        }
        return Encoding.encoding_infos;
    }

    public IsAlwaysNormalized(): boolean;
    public /* virtual */  IsAlwaysNormalized(form: NormalizationForm): boolean;
    public IsAlwaysNormalized(...args: any[]): boolean {
        if (args.length === 0) {
            return this.IsAlwaysNormalized(NormalizationForm.FormC);
        } else if (args.length === 1 && is.int(args[0])) {
            const form: NormalizationForm = args[0];
            // umm, ASCIIEncoding should have overriden this method, no?
            return form === NormalizationForm.FormC && is.typeof<any/* ASCIIEncoding */>(this, System.Types.Encoding.ASCIIEncoding);
        }
        throw new ArgumentOutOfRangeException('');
    }

    // Get a hash code for this instance.
    @Override
    public GetHashCode(): int {
        return DecoderFallback.GetHashCode() << 24 + EncoderFallback.GetHashCode() << 16 + this.codePage;
    }

    // Get the maximum number of bytes needed to encode a
    // specified number of characters.
    public abstract GetMaxByteCount(charCount: int): int;

    // Get the maximum number of characters needed to decode a
    // specified number of bytes.
    public abstract GetMaxCharCount(byteCount: int): int;

    // Get the identifying preamble for this encoding.
    @Virtual
    public GetPreamble(): ByteArray {
        return New.ByteArray(0);
    }

    // Decode a buffer of bytes into a string.
    public /* virtual */ GetString(bytes: ByteArray, index: int, count: int): string;
    public /* virtual */ GetString(bytes: ByteArray): string;
    public /* virtual */ GetString(...args: any[]): string {
        if (args.length === 3 && is.ByteArray(args[0]) && is.int(args[1]) && is.int(args[2])) {
            const bytes: ByteArray = args[0];
            const index: int = args[1];
            const count: int = args[2];
            return TString.FromCharArray(this.GetChars(bytes, index, count));
        } else if (args.length === 1 && is.ByteArray(args[0])) {
            const bytes: ByteArray = args[0];
            if (bytes == null)
                throw new ArgumentNullException("bytes");

            return this.GetString(bytes, 0, bytes.length);
        }
        throw new ArgumentOutOfRangeException('');
    }

    public /* internal */  is_mail_news_display: boolean = false;
    public /* internal */  is_mail_news_save: boolean = false;
    public /* internal */  is_browser_save: boolean = false;
    public /* internal */  is_browser_display: boolean = false;
    public /* internal */  body_name: string = '';
    public /* internal */  encoding_name: string = '';
    public /* internal */  header_name: string = '';
    public /* internal */  web_name: string = '';

    // Get the mail body name for this encoding.
    @Virtual
    protected Get_BodyName(): string {
        return this.body_name;
    }
    public get BodyName(): string {
        return this.Get_BodyName();
    }

    // Get the code page represented by this object.
    @Virtual
    protected Get_CodePage(): int {
        return this.codePage;
    }

    public get CodePage(): int {
        return this.Get_CodePage();
    }


    @Virtual
    protected Get_EncodingName(): string {
        return this.encoding_name;
    }
    // Get the human-readable name for this encoding.
    public get EncodingName(): string {
        return this.Get_EncodingName();
    }

    // Get the mail agent header name for this encoding.
    @Virtual
    protected Get_HeaderName(): string {
        return this.header_name;
    }
    public get HeaderName(): string {
        return this.Get_HeaderName();
    }

    // Determine if this encoding can be displayed in a Web browser.
    @Virtual
    protected Get_IsBrowserDisplay(): boolean {
        return this.is_browser_display;
    }
    public get IsBrowserDisplay(): boolean {
        return this.Get_IsBrowserDisplay();
    }

    // Determine if this encoding can be saved from a Web browser.
    @Virtual
    protected Get_IsBrowserSave(): boolean {
        return this.is_browser_save;
    }
    public get IsBrowserSave(): boolean {
        return this.Get_IsBrowserSave();
    }

    // Determine if this encoding can be displayed in a mail/news agent.
    @Virtual
    protected Get_IsMailNewsDisplay(): boolean {
        return this.is_mail_news_display;
    }
    public get IsMailNewsDisplay(): boolean {
        return this.Get_IsMailNewsDisplay();
    }

    // Determine if this encoding can be saved from a mail/news agent.
    @Virtual
    protected Get_IsMailNewsSave(): boolean {
        return this.is_mail_news_save;
    }
    public get IsMailNewsSave(): boolean {
        return this.Get_IsMailNewsSave();
    }

    // Get the IANA-preferred Web name for this encoding.
    @Virtual
    protected Get_WebName(): string {
        return this.web_name;
    }
    public get WebName(): string {
        return this.Get_WebName();
    }

    // Get the Windows code page represented by this object.
    @Virtual
    protected Get_WindowsCodePage(): int {
        return this.windows_code_page;
    }
    public get WindowsCodePage(): int {
        // We make no distinction between normal and
        // Windows code pages in this implementation.
        return this.Get_WindowsCodePage();
    }


    // Storage for standard encoding objects.
    private static asciiEncoding: Encoding;
    private static bigEndianEncoding: Encoding;
    private static defaultEncoding: Encoding;
    private static utf7Encoding: Encoding;
    private static utf8EncodingWithMarkers: Encoding;
    private static utf8EncodingWithoutMarkers: Encoding;
    private static unicodeEncoding: Encoding;
    private static isoLatin1Encoding: Encoding;
    private static utf8EncodingUnsafe: Encoding;
    private static utf32Encoding: Encoding;
    private static bigEndianUTF32Encoding: Encoding;

    // Get the standard ASCII encoding object.
    public static get ASCII(): Encoding {
        if (Encoding.asciiEncoding == null) {
            if (Encoding.asciiEncoding == null) {
                const _ASCIIEncoding = Context.Current.get('ASCIIEncoding');
                Encoding.asciiEncoding = new _ASCIIEncoding();
                //						asciiEncoding.is_readonly = true;
            }
        }

        return Encoding.asciiEncoding;
    }

    // Get the standard big-endian Unicode encoding object.
    public static get BigEndianUnicode(): Encoding {
        if (Encoding.bigEndianEncoding == null) {
            if (Encoding.bigEndianEncoding == null) {
                const _UnicodeEncoding = Context.Current.get('UnicodeEncoding');
                Encoding.bigEndianEncoding = new _UnicodeEncoding(true, true);
                //						bigEndianEncoding.is_readonly = true;
            }
        }

        return Encoding.bigEndianEncoding;
    }

    public /* internal */ static InternalCodePage(code_page: Out<int>): string {
        code_page.value = 3/* Encoding.UTF8_CODE_PAGE */;
        return 'utf_8';
    }

    // Get the default encoding object.
    public static get Default(): Encoding {
        if (Encoding.defaultEncoding == null) {
            {
                if (Encoding.defaultEncoding == null) {
                    // See if the underlying system knows what
                    // code page handler we should be using.
                    let code_page: Out<int> = New.Out(1);

                    const code_page_name: string = Encoding.InternalCodePage(code_page);
                    try {
                        if (code_page.value == -1)
                            Encoding.defaultEncoding = Encoding.GetEncoding(code_page_name);
                        else {
                            // map the codepage from internal to our numbers
                            code_page.value = code_page.value & 0x0fffffff;
                            switch (code_page.value) {
                                case 1: code_page.value = Encoding.ASCII_CODE_PAGE; break;
                                case 2: code_page.value = Encoding.UTF7_CODE_PAGE; break;
                                case 3: code_page.value = Encoding.UTF8_CODE_PAGE; break;
                                case 4: code_page.value = Encoding.UNICODE_CODE_PAGE; break;
                                case 5: code_page.value = Encoding.BIG_UNICODE_CODE_PAGE; break;
                                case 6: code_page.value = Encoding.ISOLATIN_CODE_PAGE; break;
                            }
                            Encoding.defaultEncoding = Encoding.GetEncoding(code_page.value);
                        }
                    } catch (e) {
                        // code_page is not supported on underlying platform
                        Encoding.defaultEncoding = Encoding.UTF8Unmarked;
                    } /* catch (ArgumentException) {
                        // code_page_name is not a valid code page, or is
                        // not supported by underlying OS
                        defaultEncoding = UTF8Unmarked;
                    } */
                    Encoding.defaultEncoding.is_readonly = true;
                }
            }
        }

        return Encoding.defaultEncoding;
    }



    // Get the ISO Latin1 encoding object.
    private static get ISOLatin1(): Encoding {
        if (Encoding.isoLatin1Encoding == null) {
            if (Encoding.isoLatin1Encoding == null) {
                const _Latin1Encoding = Context.Current.get('Latin1Encoding');
                Encoding.isoLatin1Encoding = new _Latin1Encoding();
                //						isoLatin1Encoding.is_readonly = true;
            }
        }

        return Encoding.isoLatin1Encoding;
    }

    // Get the standard UTF-7 encoding object.
    public static get UTF7(): Encoding {
        if (Encoding.utf7Encoding == null) {
            if (Encoding.utf7Encoding == null) {
                const _UTF7Encoding = Context.Current.get('UTF7Encoding');
                Encoding.utf7Encoding = new _UTF7Encoding();
                //						utf7Encoding.is_readonly = true;
            }
        }

        return Encoding.utf7Encoding;
    }

    // Get the standard UTF-8 encoding object.
    public static get UTF8(): Encoding {
        if (Encoding.utf8EncodingWithMarkers == null) {
            if (Encoding.utf8EncodingWithMarkers == null) {
                const _UTF8Encoding = Context.Current.get('UTF8Encoding');
                Encoding.utf8EncodingWithMarkers = new _UTF8Encoding(true);
                //						utf8EncodingWithMarkers.is_readonly = true;
            }
        }

        return Encoding.utf8EncodingWithMarkers;
    }

    //
    // Only internal, to be used by the class libraries: Unmarked and non-input-validating
    //
    public /* internal */ static get UTF8Unmarked(): Encoding {
        if (Encoding.utf8EncodingWithoutMarkers == null) {
            if (Encoding.utf8EncodingWithoutMarkers == null) {
                const _UTF8Encoding = Context.Current.get('UTF8Encoding');
                Encoding.utf8EncodingWithoutMarkers = new _UTF8Encoding(false, false);
                //						utf8EncodingWithoutMarkers.is_readonly = true;
            }
        }

        return Encoding.utf8EncodingWithoutMarkers;
    }

    //
    // Only internal, to be used by the class libraries: Unmarked and non-input-validating
    //
    public /* internal */ static get UTF8UnmarkedUnsafe(): Encoding {
        if (Encoding.utf8EncodingUnsafe == null) {
            if (Encoding.utf8EncodingUnsafe == null) {
                const _UTF8Encoding = Context.Current.get('UTF8Encoding');
                Encoding.utf8EncodingUnsafe = new _UTF8Encoding(false, false);
                Encoding.utf8EncodingUnsafe.is_readonly = false;
                Encoding.utf8EncodingUnsafe.DecoderFallback = new DecoderReplacementFallback(TString.Empty);
                Encoding.utf8EncodingUnsafe.is_readonly = true;
            }
        }

        return Encoding.utf8EncodingUnsafe;
    }

    // Get the standard little-endian Unicode encoding object.
    public static get Unicode(): Encoding {
        if (Encoding.unicodeEncoding == null) {
            if (Encoding.unicodeEncoding == null) {
                const _UnicodeEncoding = Context.Current.get('UnicodeEncoding');
                Encoding.unicodeEncoding = new _UnicodeEncoding(false, true);
                //						unicodeEncoding.is_readonly = true;
            }
        }

        return Encoding.unicodeEncoding;
    }

    // Get the standard little-endian UTF-32 encoding object.
    public static get UTF32(): Encoding {
        if (Encoding.utf32Encoding == null) {
            if (Encoding.utf32Encoding == null) {
                const _UTF32Encoding = Context.Current.get('UTF32Encoding');
                Encoding.utf32Encoding = new _UTF32Encoding(false, true);
                //						utf32Encoding.is_readonly = true;
            }
        }

        return Encoding.utf32Encoding;
    }

    // Get the standard big-endian UTF-32 encoding object.
    public /* internal */ static get BigEndianUTF32(): Encoding {
        if (Encoding.bigEndianUTF32Encoding == null) {
            if (Encoding.bigEndianUTF32Encoding == null) {
                const _UTF32Encoding = Context.Current.get('UTF32Encoding');
                Encoding.bigEndianUTF32Encoding = new _UTF32Encoding(true, true);
                //						bigEndianUTF32Encoding.is_readonly = true;
            }
        }

        return Encoding.bigEndianUTF32Encoding;
    }
}

// Forwarding decoder implementation.
class ForwardingDecoder extends Decoder {
    private encoding: Encoding = null as any;

    // Constructor.
    public constructor(enc: Encoding) {
        super();
        this.encoding = enc;
        const fallback: DecoderFallback = this.encoding.DecoderFallback;
        if (fallback != null)
            this.Fallback = fallback;
    }

    // Get the number of characters needed to decode a buffer.
    public /* override */ GetCharCount(bytes: ByteArray, index: int, count: int): int;
    public /* override */  GetCharCount(bytes: ByteArray, index: int, count: int, flush: boolean): int;
    public /* override */  GetCharCount(bytes: ByteArray, count: int, flush: boolean): int;
    public GetCharCount(...args: any[]) {
        if (args.length === 3 && is.ByteArray(args[0]) && is.int(args[1]) && is.int(args[2])) {
            const bytes: ByteArray = args[0];
            const index: int = args[1];
            const count: int = args[2];
            return this.encoding.GetCharCount(bytes, index, count);
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
            return this.encoding.GetChars(bytes, byteIndex, byteCount, chars, charIndex);
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

} // class ForwardingDecoder

// Forwarding encoder implementation.
class ForwardingEncoder extends Encoder {
    private encoding: Encoding;

    // Constructor.
    public constructor(enc: Encoding) {
        super();
        this.encoding = enc;
        const fallback: EncoderFallback = this.encoding.EncoderFallback;
        if (fallback != null)
            this.Fallback = fallback;
    }

    public /* abstract */ GetByteCount(chars: CharArray, index: int, count: int, flush: boolean): int;
    public /* virtual */  GetByteCount(chars: CharArray, count: int, flush: boolean): int;
    public GetByteCount(...args: any[]): int {
        if (args.length === 4 && is.CharArray(args[0]) && is.int(args[1]) && is.int(args[2]) && is.boolean(args[3])) {
            const chars: CharArray = args[0];
            const index: int = args[1];
            const count: int = args[2];
            const flush: boolean = args[3];
            return this.encoding.GetByteCount(chars, index, count);
        } else if (args.length === 3 && is.CharArray(args[0]) && is.int(args[1]) && is.boolean(args[2])) {
            const chars: CharArray = args[0];
            const count: int = args[1];
            const flush: boolean = args[2];

            return super.GetByteCount(chars, count, flush);
        }
        throw new ArgumentOutOfRangeException('');
    }

    public /* abstract */ GetBytes(chars: CharArray, charIndex: int, charCount: int, bytes: ByteArray, byteIndex: int, flush: boolean): int;
    public /* virtual */  GetBytes(chars: CharArray, charCount: int, bytes: ByteArray, byteCount: int, flush: boolean): int;
    public GetBytes(...args: any[]): int {
        if (args.length === 6 && is.CharArray(args[0]) && is.int(args[1]) && is.int(args[2]) && is.ByteArray(args[3]) && is.int(args[4]) && is.boolean(args[5])) {
            const chars: CharArray = args[0];
            const charIndex: int = args[1];
            const charCount: int = args[2];
            const bytes: ByteArray = args[3];
            const byteCount: int = args[4];
            const flush: boolean = args[5];
            return this.encoding.GetBytes(chars, charIndex, charCount, bytes, byteCount);
        } else if (args.length === 5 && is.CharArray(args[0]) && is.int(args[1]) && is.ByteArray(args[2]) && is.int(args[3]) && is.boolean(args[4])) {
            const chars: CharArray = args[0];
            const charCount: int = args[1];
            const bytes: ByteArray = args[2];
            const byteCount: int = args[3];
            const flush: boolean = args[4];

            return super.GetBytes(chars, charCount, bytes, byteCount, flush);
        }
        throw new ArgumentOutOfRangeException('');
    }
} // class ForwardingEncoder

