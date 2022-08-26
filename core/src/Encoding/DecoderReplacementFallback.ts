import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { TString } from "../Extensions";
import { int } from "../float";
import { Override } from "../Reflection/Decorators/ClassInfo";
import { DecoderFallback } from "./DecoderFallback";
import { DecoderFallbackBuffer } from "./DecoderFallbackBuffer";
import { DecoderReplacementFallbackBuffer } from "./DecoderReplacementFallbackBuffer";

export class DecoderReplacementFallback extends DecoderFallback {
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

	private replacement: string;

	public get DefaultString(): string {
		return this.replacement;
	}

	@Override
	protected Get_MaxCharCount(): int {
		return this.replacement.length;
	}

	@Override
	public CreateFallbackBuffer(): DecoderFallbackBuffer {
		return new DecoderReplacementFallbackBuffer(this);
	}

	@Override
	public Equals(value: any): boolean {
		const f: DecoderReplacementFallback = value as DecoderReplacementFallback;
		return f != null && this.replacement === f.replacement;
	}

	@Override
	public GetHashCode(): int {
		return TString.GetHashCode(this.replacement);
	}
}

(DecoderFallback as any).replacement_fallback = new DecoderReplacementFallback();
(DecoderFallback as any).standard_safe_fallback = new DecoderReplacementFallback("\uFFFD");