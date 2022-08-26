import { ByteArray, CharArray, int } from "../float";
import { Override } from "../Reflection/Decorators/ClassInfo";
import { Encoder } from "./Encoder";
import { Encoding } from "./Encoding";

/* export class DefaultEncoder extends Encoder {
    private encoding: Encoding;

    public constructor(encoding: Encoding) {
        super();
        this.encoding = encoding;
    }

    @Override
    public GetByteCount(chars: CharArray, index: int, count: int, flush: boolean): int {
        return (this.encoding as any).GetByteCountInternal(chars, index, count);
    }

    @Override
    public GetBytes(chars: CharArray, charIndex: int, charCount: int, bytes: ByteArray, byteIndex: int, flush: boolean): int {
        return (this.encoding as any).GetBytesInternal(chars, charIndex, charCount, bytes, byteIndex);
    }
} */