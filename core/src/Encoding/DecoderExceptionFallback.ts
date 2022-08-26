import { int } from "../float";
import { is } from "../is";
import { Override } from "../Reflection/Decorators/ClassInfo";
import { System } from "../SystemTypes";
import { DecoderExceptionFallbackBuffer } from "./DecoderExceptionFallbackBuffer";
import { DecoderFallback } from "./DecoderFallback";
import { DecoderFallbackBuffer } from "./DecoderFallbackBuffer";

export class DecoderExceptionFallback extends DecoderFallback {
    protected dispose(disposing: boolean): void {
        throw new Error("Method not implemented.");
    }
    public constructor() {
        super();
    }

    @Override
    protected Get_MaxCharCount(): int {
        return 0;
    }

    @Override
    public CreateFallbackBuffer(): DecoderFallbackBuffer {
        return new DecoderExceptionFallbackBuffer();
    }

    @Override
    public Equals(value: any): boolean {
        return is.typeof<DecoderExceptionFallback>(value, System.Types.Encoding.DecoderExceptionFallback);
    }

    @Override
    public GetHashCode(): int {
        return 0;
    }
}

(DecoderFallback as any).exception_fallback = new DecoderExceptionFallback();