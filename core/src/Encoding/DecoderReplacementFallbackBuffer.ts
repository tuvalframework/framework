import { ArgumentException } from "../Exceptions/ArgumentException";
import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { ArgumentOutOfRangeException } from "../Exceptions/ArgumentOutOfRangeException";
import { ByteArray, char, int } from "../float";
import { Override } from "../Reflection/Decorators/ClassInfo";
import { DecoderFallbackBuffer } from "./DecoderFallbackBuffer";
import { DecoderReplacementFallback } from "./DecoderReplacementFallback";

export class DecoderReplacementFallbackBuffer extends DecoderFallbackBuffer {
	private fallback_assigned: boolean = false;
	private current: int = 0;
	private replacement: string = '';

	public constructor(fallback: DecoderReplacementFallback) {
		super();
		if (fallback == null)
			throw new ArgumentNullException("fallback");
		this.replacement = fallback.DefaultString;
		this.current = 0;
	}

	@Override
	protected Get_Remaining(): int {
		return this.fallback_assigned ? this.replacement.length - this.current : 0;
	}

	@Override
	public Fallback(bytesUnknown: ByteArray, index: int): boolean {
		if (bytesUnknown == null)
			throw new ArgumentNullException("bytesUnknown");
		if (this.fallback_assigned && this.Remaining !== 0)
			throw new ArgumentException("Reentrant Fallback method invocation occured. It might be because either this FallbackBuffer is incorrectly shared by multiple threads, invoked inside Encoding recursively, or Reset invocation is forgotten.");
		if (index < 0 || bytesUnknown.length < index)
			throw new ArgumentOutOfRangeException("index");
		this.fallback_assigned = true;
		this.current = 0;

		return this.replacement.length > 0;
	}

	@Override
	public GetNextChar(): char {
		if (!this.fallback_assigned)
			return '\0'.charCodeAt(0);
		if (this.current >= this.replacement.length)
			return 0/* char.MinValue */;
		return this.replacement[this.current++].charCodeAt(0);
	}

	@Override
	public MovePrevious(): boolean {
		if (this.current == 0)
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