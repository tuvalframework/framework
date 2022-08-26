import { int } from "../float";
import { Override } from "../Reflection/Decorators/ClassInfo";
import { EncoderExceptionFallbackBuffer } from "./EncoderExceptionFallbackBuffer";
import { EncoderFallback } from "./EncoderFallback";
import { EncoderFallbackBuffer } from "./EncoderFallbackBuffer";
import { is } from '../is';
import { System } from "../SystemTypes";

export class EncoderExceptionFallback extends EncoderFallback {
    protected dispose(disposing: boolean): void {
        throw new Error("Method not implemented.");
    }
    public constructor() {
        super();
    }

    @Override
    public Get_MaxCharCount(): int {
        return 0;
    }

    @Override
    public CreateFallbackBuffer(): EncoderFallbackBuffer {
        return new EncoderExceptionFallbackBuffer();
    }

    @Override
    public Equals(value: any): boolean {
        return is.typeof<EncoderExceptionFallback>(value, System.Types.Encoding.EncoderExceptionFallback);
    }

    @Override
    public GetHashCode(): int {
        return 0;
    }
}

(EncoderFallback as any).exception_fallback = new EncoderExceptionFallback();