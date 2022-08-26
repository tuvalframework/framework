import { Encoding } from '../Encoding/Encoding';
import { Environment } from '../Environment';
import { ArgumentException } from '../Exceptions/ArgumentException';
import { ArgumentNullException } from '../Exceptions/ArgumentNullException';
import { ArgumentOutOfRangeException } from '../Exceptions/ArgumentOutOfRangeException';
import { char, CharArray, decimal, double, float, int, long, New, uint, ulong } from '../float';
import { IFormatProvider } from '../IFormatProvider';
import { IFormattable } from '../IFormattable';
import { Override, Virtual } from '../Reflection/Decorators/ClassInfo';
import { TObject } from './../Extensions/TObject';
import { TString } from './../Text/TString';
import { is } from './../is';
import { TBoolean } from './../SuperTypes/TBoolean';
import { TBuffer } from './Buffer/TBuffer';
import { Exception } from '../Exception';

function ToCharArray(s: string): CharArray {
    if (s == null || s.length === 0) {
        return null as any;
    }

    const buffer = new Uint16Array(s.length);
    for (let i = 0; i < s.length; i++) {
        buffer[i] = s.charCodeAt(i);
    }
    return buffer;
}

export abstract class TextWriter extends TObject {
    private static readonly InitialNewLine: string = "\r\n";

    protected CoreNewLine: CharArray = null as any;
    private InternalFormatProvider: IFormatProvider = null as any;

    private static _Null: TextWriter = null as any;
    public static get Null(): TextWriter {
        if (TextWriter._Null == null) {
            TextWriter._Null = new NullTextWriter();
        }
        return TextWriter._Null;
    }
    protected abstract Get_Encoding(): Encoding;
    public get Encoding() {
        return this.Get_Encoding();
    }

    @Virtual
    protected Get_FormatProvider(): IFormatProvider {
        if (this.InternalFormatProvider == null) {
            throw new Exception('Burası çokomelli.');
            //return Thread.CurrentThread.CurrentCulture;
        }
        return this.InternalFormatProvider;
    }
    public get FormatProvider(): IFormatProvider {
        return this.Get_FormatProvider();
    }

    protected Get_NewLine(): string {
        return TString.FromCharArray(this.CoreNewLine);
    }
    protected Set_NewLine(value: string) {
        if (value == null) {
            value = "\r\n";
        }
        this.CoreNewLine = TString.ToCharArray(value);
    }
    public get NewLine(): string {
        return this.Get_NewLine();
    }
    public set NewLine(value: string) {
        this.Set_NewLine(value);
    }

    //property e alındı.
    /* public static StaticConstructor() {
        (TextWriter as any).Null = new NullTextWriter();
    } */

    protected constructor(formatProvider: IFormatProvider = null as any) {
        super();
        this.CoreNewLine = ToCharArray("\r\n");
        this.InternalFormatProvider = formatProvider;
    }

    @Virtual
    public Close(): void {
        this.dispose(true);
    }

    @Virtual
    public Flush(): void {
    }


    @Virtual
    public WriteChar(value: char): void {
    }

    //@Virtual
    public WriteCharArray(buffer: CharArray): void;
    public WriteCharArray(buffer: CharArray, index: int, count: int): void
    public WriteCharArray(...args: any[]): void {
        if (args.length === 1 && is.CharArray(args[0])) {
            const buffer: CharArray = args[0];
            if (buffer != null) {
                this.WriteCharArray(buffer, 0, buffer.length);
            }
        } else if (args.length === 3 && is.CharArray(args[0]) && is.int(args[1]) && is.int(args[2])) {
            const buffer: CharArray = args[0];
            const index: int = args[1];
            const count: int = args[2];

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
            for (let i: int = 0; i < count; i++) {
                this.WriteChar(buffer[index + i]);
            }
        }
    }

    @Virtual
    public WriteBoolean(value: boolean): void {
        this.Write((value ? TBoolean.TrueString : TBoolean.FalseString));
    }

    @Virtual
    public WriteInt(value: int): void {
        this.Write(TString.ToString(value, this.FormatProvider));
    }

    @Virtual
    public WriteUInt(value: uint): void {
        this.Write(TString.ToString(value, this.FormatProvider));
    }

    @Virtual
    public WriteLong(value: long): void {
        this.Write(TString.ToString(value, this.FormatProvider));
    }

    @Virtual
    public WriteULong(value: ulong): void {
        this.Write(TString.ToString(value, this.FormatProvider));
    }

    @Virtual
    public WriteFloat(value: float): void {
        this.Write(TString.ToString(value, this.FormatProvider));
    }

    @Virtual
    public WriteDouble(value: double): void {
        this.Write(TString.ToString(value, this.FormatProvider));
    }

    @Virtual
    public WriteDecimal(value: decimal): void {
        this.Write(TString.ToString(value, this.FormatProvider));
    }

    @Virtual
    public Write(value: string): void {
        if (value != null) {
            this.WriteCharArray(TString.ToCharArray(value));
        }
    }

    @Virtual
    public WriteAny(value: any): void {
        if (value != null) {
            const formattable: IFormattable = value as IFormattable;
            if (formattable != null) {
                this.Write(formattable.ToString(null as any, this.FormatProvider));
                return;
            }
            this.Write(value.ToString());
        }
    }

    /*  public virtual void Write(string format, object arg0)
 {
     this.Write(string.Format(format, arg0));
 }

         public virtual void Write(string format, object arg0, object arg1)
 {
     this.Write(string.Format(format, arg0, arg1));
 }

         public virtual void Write(string format, object arg0, object arg1, object arg2)
 {
     this.Write(string.Format(format, arg0, arg1, arg2));
 }

         public virtual void Write(string format, params object[] arg)
 {
     this.Write(string.Format(format, arg));
 } */

    @Virtual
    public WriteLine(): void {
        this.WriteCharArray(this.CoreNewLine);
    }

    @Virtual
    public WriteLineChar(value: char): void {
        this.WriteChar(value);
        this.WriteLine();
    }

    //@Virtual
    public WriteLineCharArray(buffer: CharArray): void;
    public WriteLineCharArray(buffer: CharArray, index: int, count: int): void
    public WriteLineCharArray(...args: any[]): void {
        if (args.length === 1 && is.CharArray(args[0])) {
            const buffer: CharArray = args[0];
            this.WriteCharArray(buffer);
            this.WriteLine();
        } else if (args.length === 3 && is.CharArray(args[0]) && is.int(args[1]) && is.int(args[2])) {
            const buffer: CharArray = args[0];
            const index: int = args[1];
            const count: int = args[2];
            this.WriteCharArray(buffer, index, count);
            this.WriteLine();
        }
    }


    @Virtual
    public WriteLineBoolean(value: boolean): void {
        this.WriteBoolean(value);
        this.WriteLine();
    }

    @Virtual
    public WriteLineInt(value: int): void {
        this.WriteInt(value);
        this.WriteLine();
    }

    @Virtual
    public WriteLineUInt(value: uint): void {
        this.WriteUInt(value);
        this.WriteLine();
    }

    @Virtual
    public WriteLineLong(value: long): void {
        this.WriteLong(value);
        this.WriteLine();
    }

    @Virtual
    public WriteLineULong(value: ulong): void {
        this.WriteULong(value);
        this.WriteLine();
    }

    @Virtual
    public WriteLineFloat(value: float): void {
        this.WriteFloat(value);
        this.WriteLine();
    }

    @Virtual
    public WriteLineDouble(value: double): void {
        this.WriteDouble(value);
        this.WriteLine();
    }

    @Virtual
    public WriteLineDecimal(value: decimal): void {
        this.WriteDecimal(value);
        this.WriteLine();
    }


    @Virtual
    public WriteLineString(value: string, ...args: any[]): void {
        if (args.length === 0) {
            if (value == null) {
                this.WriteLine();
                return;
            }
            let length: int = value.length;
            let int32: int = this.CoreNewLine.length;
            const coreNewLine: CharArray = New.CharArray(length + int32);
            TString.CopyTo(value, 0, coreNewLine, 0, length);
            if (int32 === 2) {
                coreNewLine[length] = this.CoreNewLine[0];
                coreNewLine[length + 1] = this.CoreNewLine[1];
            }
            else if (int32 !== 1) {
                TBuffer.InternalBlockCopy(this.CoreNewLine, 0, coreNewLine, length * 2, int32 * 2);
            }
            else {
                coreNewLine[length] = this.CoreNewLine[0];
            }
            this.WriteCharArray(coreNewLine, 0, length + int32);
        } else {
            this.WriteLineString(TString.Format(value, args));
        }
    }
    /*  public WriteLineString(format: string, ...arg0: any[]): void {
         this.WriteLine(TString.Format(format, arg0));
     } */

    @Virtual
    public WriteLineAny(value: any): void {
        if (value == null) {
            this.WriteLine();
            return;
        }
        const formattable: IFormattable = value as IFormattable;
        if (formattable == null) {
            this.WriteLineString(TString.ToString(value));
            return;
        }
        this.WriteLineString(formattable.ToString(null as any, this.FormatProvider));
    }



    /*   public virtual void WriteLine(string format, object arg0, object arg1)
{
  this.WriteLine(string.Format(format, arg0, arg1));
}

      public virtual void WriteLine(string format, object arg0, object arg1, object arg2)
{
  this.WriteLine(string.Format(format, arg0, arg1, arg2));
}

      public virtual void WriteLine(string format, params object[] arg)
{
  this.WriteLine(string.Format(format, arg));
} */


}
class NullTextWriter extends TextWriter {
    protected dispose(disposing: boolean): void {
        throw new Error('Method not implemented.');
    }
    @Override
    protected Get_Encoding(): Encoding {
        return Encoding.Default;
    }

    public constructor() {
        super();
    }

    public WriteCharArray(buffer: CharArray): void;
    public WriteCharArray(buffer: CharArray, index: int, count: int): void
    public WriteCharArray(...args: any[]): void {

    }

    public Write(value: string): void {
    }
}

  //property e alındı.
//TextWriter.StaticConstructor();