import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { int } from "../float";
import { Override } from "../Reflection/Decorators/ClassInfo";
import { EncoderFallback } from "./EncoderFallback";
import { EncoderFallbackBuffer } from "./EncoderFallbackBuffer";
import { EncoderReplacementFallbackBuffer } from "./EncoderReplacementFallbackBuffer";
import { TString } from '../Text/TString';

export class EncoderReplacementFallback extends EncoderFallback {
    protected dispose(disposing: boolean): void {
        throw new Error("Method not implemented.");
    }
    public constructor(replacement: string = '?') {
        super();
        if (replacement == null)
            throw new ArgumentNullException('');
        // FIXME: check replacement validity (invalid surrogate)

        this.replacement = replacement;
    }

    private replacement: string = '';

    public get DefaultString(): string {
        return this.replacement;
    }

    @Override
    protected Get_MaxCharCount(): int {
        return this.replacement.length;
    }

    @Override
    public CreateFallbackBuffer(): EncoderFallbackBuffer {
        return new EncoderReplacementFallbackBuffer(this);
    }

    @Override
    public Equals(value: any): boolean {
        const f: EncoderReplacementFallback = value as EncoderReplacementFallback;
        return f != null && this.replacement === f.replacement;
    }

    @Override
    public GetHashCode(): int {
        return TString.GetHashCode(this.replacement);
    }
}

(EncoderFallback as any).replacement_fallback = new EncoderReplacementFallback();
(EncoderFallback as any).standard_safe_fallback = new EncoderReplacementFallback("\uFFFD");