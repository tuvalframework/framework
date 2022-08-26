import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { char, CharArray, int } from "../float";
import { Override } from "../Reflection/Decorators/ClassInfo";
import { TextReader } from "./TextReader";
import { is } from './../is';
import { Environment } from "../Environment";
import { ArgumentOutOfRangeException } from "../Exceptions/ArgumentOutOfRangeException";
import { ArgumentException } from "../Exceptions/ArgumentException";
import { TString } from "../Extensions";
import { Exception } from "../Exception";

export class StringReader extends TextReader {
    private _s: string;
    private _pos: int = 0;
    private _length: int;
    public constructor(s: string) {
        super();
        if (s == null) {
            throw new ArgumentNullException("s");
        }
        this._s = s;
        this._length = (s == null ? 0 : s.length);
    }

    @Override
    public Close(): void {
        this.dispose(true);
    }

    @Override
    public dispose(disposing: boolean): void {
        this._s = null as any;
        this._pos = 0;
        this._length = 0;
        super.dispose(disposing);
    }

    @Override
    public Peek(): int {
        if (this._s == null) {
            throw new Exception('Reader Closed.');
        }
        if (this._pos === this._length) {
            return -1;
        }
        return this._s[this._pos].charCodeAt(0);
    }

    public Read(): int;
    public Read(buffer: CharArray, index: int, count: int): int;
    public Read(...args: any[]): int {
        if (args.length === 0) {
            if (this._s == null) {
                throw new Exception('Reader Closed.');
            }
            if (this._pos === this._length) {
                return -1;
            }
            const str: string = this._s;
            const stringReader: StringReader = this;
            const int32: int = stringReader._pos;
            const int321: int = int32;
            stringReader._pos = int32 + 1;
            return str[int321].charCodeAt(0);
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
            if (this._s == null) {
                throw new Exception('Reader Closed.');
            }
            let int32: int = this._length - this._pos;
            if (int32 > 0) {
                if (int32 > count) {
                    int32 = count;
                }
                TString.CopyTo(this._s, this._pos, buffer, index, int32);
                this._pos += int32;
            }
            return int32;
        }
        throw new ArgumentOutOfRangeException('');
    }

    @Override
    public ReadLine(): string {
        let i: int;
        if (this._s == null) {
            throw new Exception('Reader Closed.');
        }
        for (i = this._pos; i < this._length; i++) {
            const chr: char = this._s[i].charCodeAt(0);
            if (chr === '\r'.charCodeAt(0) || chr === '\n'.charCodeAt(0)) {
                const str: string = this._s.substring(this._pos, i/*  - this._pos */);
                this._pos = i + 1;
                if ((chr === '\r'.charCodeAt(0) || chr === '\n'.charCodeAt(0)) && this._pos < this._length && this._s[this._pos] === '\n') {
                    this._pos++;
                }
                return str;
            }
        }
        if (i <= this._pos) {
            return null as any;
        }
        const str1: string = this._s.substring(this._pos, i - this._pos);
        this._pos = i;
        return str1;
    }

    @Override
    public ReadToEnd(): string {
        let str: string;
        if (this._s == null) {
            throw new Exception('Reader Closed.');
        }
        str = (this._pos !== 0 ? this._s.substring(this._pos, this._length - this._pos) : this._s);
        this._pos = this._length;
        return str;
    }
}