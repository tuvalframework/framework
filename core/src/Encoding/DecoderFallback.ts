import { int } from "../float";
import { DecoderFallbackBuffer } from './DecoderFallbackBuffer';
import { TObject } from '../Extensions/TObject';

export abstract class DecoderFallback extends TObject {
   private static readonly exception_fallback: DecoderFallback /* = new DecoderExceptionFallback() */;
   private static readonly replacement_fallback: DecoderFallback /* = new DecoderReplacementFallback() */;
   private static readonly standard_safe_fallback: DecoderFallback /* = new DecoderReplacementFallback("\uFFFD") */;

    protected constructor() {
        super();
    }

    public static get ExceptionFallback(): DecoderFallback {
        return DecoderFallback.exception_fallback;
    }

    protected abstract Get_MaxCharCount(): int;
    public get MaxCharCount() {
        return this.Get_MaxCharCount();
    }

    public static get ReplacementFallback(): DecoderFallback {
        return DecoderFallback.replacement_fallback;
    }

    public /* internal */ static get StandardSafeFallback(): DecoderFallback {
        return DecoderFallback.standard_safe_fallback;
    }

    public abstract CreateFallbackBuffer(): DecoderFallbackBuffer;
}