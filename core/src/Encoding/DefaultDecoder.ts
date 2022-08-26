import { ByteArray, CharArray, int } from "../float";
import { Override } from "../Reflection/Decorators/ClassInfo";
import { Decoder } from "./Decoder";
import { Encoding } from "./Encoding";

//[Serializable]
/* export class DefaultDecoder extends Decoder {
    private encoding: Encoding;

    public constructor(encoding: Encoding) {
        super();
        this.encoding = encoding;
    }

    @Override
    public GetCharCount(bytes: ByteArray, index: int, count: int): int {
        return this.encoding.GetCharCount(bytes, index, count);
    }

    @Override
    public GetChars(bytes: ByteArray, byteIndex: int, byteCount: int, chars: CharArray, charIndex: int): int {
        return (this.encoding as any).GetCharsInternal(bytes, byteIndex, byteCount, chars, charIndex);
    }
} */