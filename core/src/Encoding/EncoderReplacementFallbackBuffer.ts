import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { char, int } from "../float";
import { Override } from "../Reflection/Decorators/ClassInfo";
import { EncoderFallbackBuffer } from "./EncoderFallbackBuffer";
import { EncoderReplacementFallback } from "./EncoderReplacementFallback";
import { is } from '../is';
import { ArgumentOutOfRangeException } from '../Exceptions/ArgumentOutOfRangeException';
import { ArgumentException } from "../Exceptions/ArgumentException";

export class EncoderReplacementFallbackBuffer extends EncoderFallbackBuffer {
    private replacement: string = '';
    private current: int = 0;
    private fallback_assigned: boolean = false;

    public constructor(fallback: EncoderReplacementFallback) {
        super();
        if (fallback == null)
            throw new ArgumentNullException("fallback");
        this.replacement = fallback.DefaultString;
        this.current = 0;
    }

    @Override
    public Get_Remaining(): int {
        return this.replacement.length - this.current;
    }

    //@Override
    public Fallback(charUnknown: char, index: int): boolean;
    public Fallback(charUnknownHigh: char, charUnknownLow: char, index: int): boolean;
    public Fallback(...args: any[]): boolean {
        if (args.length === 2 && is.char(args[0]) && is.int(args[1])) {
            const charUnknown: char = args[0];
            const index: int = args[1];
            return this.fallback(index);
        } else if (args.length === 3 && is.char(args[0]) && is.char(args[1]) && is.int(args[2])) {
            const charUnknownHigh: char = args[0];
            const charUnknownLow: char = args[1];
            const index: int = args[2];
            return this.fallback(index);
        }
        throw new ArgumentOutOfRangeException('');
    }

    // hmm, what is this index for???
    private fallback(index: int): boolean {
        if (this.fallback_assigned && this.Remaining != 0)
            throw new ArgumentException("Reentrant Fallback method invocation occured. It might be because either this FallbackBuffer is incorrectly shared by multiple threads, invoked inside Encoding recursively, or Reset invocation is forgotten.");
        if (index < 0)
            throw new ArgumentOutOfRangeException("index");
        this.fallback_assigned = true;
        this.current = 0;

        return this.replacement.length > 0;
    }

    @Override
    public GetNextChar(): char {
        if (this.current >= this.replacement.length)
            return 0;/* char.MinValue */;
        return this.replacement[this.current++].charCodeAt(0);
    }

    @Override
    public MovePrevious(): boolean {
        if (this.current === 0)
            return false;
        this.current--;
        return true;
    }

    @Override
    public Reset(): void {
        this.fallback_assigned = false;
        this.current = 0;
    }
}