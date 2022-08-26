import { Convert } from "../convert";
import { deflate } from "./deflate";
import { inflate } from "./inflate";


export class TCompress {
    public static CompressBytes(input: Uint8Array): Uint8Array {
        return deflate(input);
    }
    public static CompressString(input: string): string {
        return deflate(input, { to: 'string' });
    }

    public static DeCompressBytes(input: Uint8Array): Uint8Array {
        return inflate(input);
    }
    public static DeCompressString(input: string): string {
        return inflate(input, { to: 'string' });
    }

}