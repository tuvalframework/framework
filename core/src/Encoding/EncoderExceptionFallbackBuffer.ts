import { char, int } from '../float';
import { is } from '../is';
import { Override } from "../Reflection/Decorators/ClassInfo";
import { EncoderFallbackBuffer } from "./EncoderFallbackBuffer";
import { EncoderFallbackException } from "./EncoderFallbackException";
import { ArgumentOutOfRangeException } from '../Exceptions/ArgumentOutOfRangeException';

export class EncoderExceptionFallbackBuffer extends EncoderFallbackBuffer {
    public constructor() {
        super();
    }

    @Override
    protected Get_Remaining(): int {
        return 0;
    }

    //@Override
    public Fallback(charUnknown: char, index: int): boolean;
    public Fallback(charUnknownHigh: char, charUnknownLow: char, index: int): boolean;
    public Fallback(...args: any[]): boolean {
        if (args.length === 2 && is.char(args[0]) && is.int(args[1])) {
            const charUnknown: char = args[0];
            const index: int = args[1];
            throw new EncoderFallbackException(charUnknown, index);
        } else if (args.length === 3) {
            const charUnknownHigh: char = args[0];
            const charUnknownLow: char = args[1];
            const index: int = args[2];
            throw new EncoderFallbackException(charUnknownHigh, charUnknownLow, index);
        }
        throw new ArgumentOutOfRangeException('');
    }



    @Override
    public GetNextChar(): char {
        return 0/* char.MinValue */;
    }

    @Override
    public MovePrevious(): boolean {
        return false;
    }
}
