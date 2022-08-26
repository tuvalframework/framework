import { Encoding } from "../Encoding/Encoding";
import { UnicodeEncoding } from "../Encoding/UnicodeEncoding";
import { Environment } from "../Environment";
import { Exception } from "../Exception";
import { ArgumentException } from "../Exceptions/ArgumentException";
import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { ArgumentOutOfRangeException } from "../Exceptions/ArgumentOutOfRangeException";
import { TString } from "../Extensions";
import { char, CharArray, int } from "../float";
import { IFormatProvider } from "../IFormatProvider";
import { is } from "../is";
import { Override, Virtual } from "../Reflection/Decorators/ClassInfo";
import { StringBuilder } from "../Text/StringBuilder";
import { TextWriter } from "./TextWriter";

export class StringWriter extends TextWriter {

    private static m_encoding: UnicodeEncoding;
    private _sb: StringBuilder = null as any;
    private _isOpen: boolean = false;

    @Override
    protected Get_Encoding(): Encoding {
        if (StringWriter.m_encoding == null) {
            StringWriter.m_encoding = new UnicodeEncoding(false, false);
        }
        return StringWriter.m_encoding;
    }

    public static StaticConstructor() {
        StringWriter.m_encoding = null as any;
    }



    public constructor(sb: StringBuilder = new StringBuilder(), formatProvider: IFormatProvider = null as any) {
        super(formatProvider);
        if (sb == null) {
            throw new ArgumentNullException("sb", Environment.GetResourceString("ArgumentNull_Buffer"));
        }
        this._sb = sb;
        this._isOpen = true;
    }

    @Override
    public Close(): void {
        this.dispose(true);
    }

    @Override
    public dispose(disposing: boolean): void {
        this._isOpen = false;
        //super.dispose(disposing);
    }

    @Virtual
    public GetStringBuilder(): StringBuilder {
        return this._sb;
    }

    @Override
    public ToString(): string {
        return this._sb.ToString();
    }

    @Override
    public WriteChar(value: char): void {
        if (!this._isOpen) {
            throw new Exception('Writer Closed.');
        }
        this._sb.Append(String.fromCharCode(value));
    }

    public WriteCharArray(buffer: CharArray): void;
    public WriteCharArray(buffer: CharArray, index: int, count: int): void
    public WriteCharArray(...args: any[]): void {
        if (args.length === 1 && is.CharArray(args[0])) {
            const buffer: CharArray = args[0];
            super.WriteCharArray(buffer);
        } else if (args.length === 3 && is.CharArray(args[0]) && is.int(args[1]) && is.int(args[2])) {
            const buffer: CharArray = args[0];
            const index: int = args[1];
            const count: int = args[2];
            if (!this._isOpen) {
                throw new Exception('Writer Closed.');
            }
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
            this._sb.Append(TString.FromCharArray(buffer, index, count));
        }
    }


    @Override
    public Write(value: string): void {
        if (!this._isOpen) {
            throw new Exception('Writer Closed.');
        }
        if (value != null) {
            this._sb.Append(value);
        }
    }
}

StringWriter.StaticConstructor();