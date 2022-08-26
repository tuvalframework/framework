
import { Convert } from '../convert';
import { Environment } from '../Environment';
import { ArgumentException } from '../Exceptions/ArgumentException';
import { ArgumentNullException } from '../Exceptions/ArgumentNullException';
import { ArgumentOutOfRangeException } from '../Exceptions/ArgumentOutOfRangeException';
import { CharArray, int, New } from '../float';
import { Override, Virtual } from '../Reflection/Decorators/ClassInfo';
import { StringBuilder } from '../Text/StringBuilder';
import { TString } from '../Text/TString';
import { TObject } from './../Extensions/TObject';
import { is } from './../is';

export abstract class TextReader extends TObject {
    public static readonly Null: TextReader;

     public static StaticConstructor() {
        (TextReader as any).Null = new NullTextReader();
    }

    protected constructor() {
        super();
    }

    @Virtual
    public Close(): void {
        this.dispose(true);
    }

    @Override
    protected dispose(disposing: boolean = true): void {
    }
   /*  public Dispose(): void {
        this.Dispose(true);
    } */

    //@Virtual
    public Peek(): int {
        return -1;
    }

    //@Virtual
    public Read(): int;
    public Read(buffer: CharArray, index: int, count: int): int;
    public Read(...args: any[]): int {
        if (args.length === 0) {
            return -1;
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
            let int32: int = 0;
            do {
                let int321: int = this.Read();
                if (int321 = -1) {
                    break;
                }
                let int322: int = int32;
                int32 = int322 + 1;
                buffer[index + int322] = Convert.ToChar(int321);
            }
            while (int32 < count);
            return int32;
        }
        throw new ArgumentOutOfRangeException('');

    }


    @Virtual
    public ReadBlock(buffer: CharArray, index: int, count: int): int {
        let int32: int;
        let int321: int = 0;
        do {
            let int322: int = this.Read(buffer, index + int321, count - int321);
            int32 = int322;
            int321 += int322;
        }
        while (int32 > 0 && int321 < count);
        return int321;
    }

    @Virtual
    public ReadLine(): string {
        let int32: int;
        const stringBuilder: StringBuilder = new StringBuilder();
        while (true) {
            int32 = this.Read();
            if (int32 === -1) {
                if (stringBuilder.Length <= 0) {
                    return null as any;
                }
                return stringBuilder.ToString();
            }
            if (int32 === 13 || int32 === 10) {
                break;
            }
            stringBuilder.Append(String.fromCharCode(Convert.ToChar(int32)));
        }
        if (int32 === 13 && this.Peek() === 10) {
            this.Read();
        }
        return stringBuilder.ToString();
    }

    @Virtual
    public ReadToEnd(): string {
        const chrArray: CharArray = New.CharArray(4096);
        const stringBuilder: StringBuilder = new StringBuilder(/* 4096 */);
        while (true) {
            let int32: int = this.Read(chrArray, 0, chrArray.length);
            let int321: int = int32;
            if (int32 === 0) {
                break;
            }
            stringBuilder.Append(TString.FromCharArray(chrArray, 0, int321));
        }
        return stringBuilder.ToString();
    }
}

class NullTextReader extends TextReader {
    public constructor() {
        super();
    }

    public Read(): int;
    public Read(buffer: CharArray, index: int, count: int): int;
    public Read(...args: any[]): int {
        if (args.length === 0) {
           super.Read();
        } else if (args.length === 3 && is.CharArray(args[0]) && is.int(args[1]) && is.int(args[2])) {
            const buffer: CharArray = args[0];
            const index: int = args[1];
            const count: int = args[2];
            return 0;
        }
        throw new ArgumentOutOfRangeException('');

    }


    @Override
    public ReadLine(): string {
        return null as any;
    }
}

TextReader.StaticConstructor();