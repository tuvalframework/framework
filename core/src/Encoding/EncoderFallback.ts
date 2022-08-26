import { int } from "../float";
import { EncoderFallbackBuffer } from "./EncoderFallbackBuffer";
import { TObject } from '../Extensions/TObject';

export abstract class EncoderFallback extends TObject{
    private static readonly exception_fallback: EncoderFallback; /* = new EncoderExceptionFallback(); */ // EncoderExceptionFallback.ts  de ayarlıyoruz.
    private static readonly replacement_fallback: EncoderFallback;  /* = new EncoderReplacementFallback() */ //EncoderReplacementFallback.ts de ayarlanıyor.
    private static readonly standard_safe_fallback: EncoderFallback; /* = new EncoderReplacementFallback("\uFFFD"); */

    protected constructor() {
        super();
    }

    public static get ExceptionFallback(): EncoderFallback {
        return EncoderFallback.exception_fallback;
    }

    protected abstract Get_MaxCharCount(): int;
    public get MaxCharCount(): int {
        return this.Get_MaxCharCount();
    }


    public static get ReplacementFallback(): EncoderFallback {
        return EncoderFallback.replacement_fallback;
    }

    public /* internal */ static get StandardSafeFallback(): EncoderFallback {
        return EncoderFallback.standard_safe_fallback;
    }

    public abstract CreateFallbackBuffer(): EncoderFallbackBuffer;
}