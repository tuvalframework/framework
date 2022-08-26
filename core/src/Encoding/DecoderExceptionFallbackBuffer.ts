import { ByteArray, char, int } from "../float";
import { Override } from "../Reflection/Decorators/ClassInfo";
import { DecoderFallbackBuffer } from "./DecoderFallbackBuffer";
import { DecoderFallbackException } from "./DecoderFallbackException";

export class DecoderExceptionFallbackBuffer extends DecoderFallbackBuffer {
    public constructor() {
        super();
    }

    @Override
    protected Get_Remaining(): int {
        return 0;
    }

    @Override
    public Fallback(bytesUnknown: ByteArray, index: int): boolean {
        throw new DecoderFallbackException(null, bytesUnknown, index);
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