import { ByteArray, char, int } from "../float";
import { Virtual } from "../Reflection/Decorators/ClassInfo";

export abstract class DecoderFallbackBuffer {
	protected constructor() {
	}

	protected abstract Get_Remaining(): int;
	public get Remaining(): int {
		return this.Get_Remaining();
	}

	public abstract Fallback(bytesUnknown: ByteArray, index: int): boolean;
	public abstract GetNextChar(): char;
	public abstract MovePrevious(): boolean;

	@Virtual
	public Reset(): void {
	}
}