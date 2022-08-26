import { char, int } from "../float";
import { Virtual } from "../Reflection/Decorators/ClassInfo";

export abstract class EncoderFallbackBuffer {
    protected constructor() {
    }

    protected abstract Get_Remaining(): int;
    public get Remaining(): int {
        return this.Get_Remaining();
    }
    public abstract Fallback(charUnknown: char, index: int): boolean;
    public abstract Fallback(charUnknownHigh: char, charUnknownLow: char, index: int): boolean;
    public abstract GetNextChar(): char;
    public abstract MovePrevious(): boolean;
    @Virtual
    public Reset(): void {
        while (this.GetNextChar() !== '\0'.charCodeAt(0))
            ;
    }
}