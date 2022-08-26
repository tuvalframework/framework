import { int } from "../float";
import { StringBuilder } from "./StringBuilder";

export class StringBuilderCache {
    // The value 360 was chosen in discussion with performance experts as a compromise between using
    // as litle memory (per thread) as possible and still covering a large part of short-lived
    // StringBuilder creations on the startup path of VS designers.
    private static readonly MAX_BUILDER_SIZE: int = 360;
    private static CachedInstance: StringBuilder;

    public static Acquire(capacity: int = StringBuilder.DefaultCapacity): StringBuilder {
        if (capacity <= StringBuilderCache.MAX_BUILDER_SIZE) {
            const sb: StringBuilder = StringBuilderCache.CachedInstance;
            if (sb != null) {
                // Avoid stringbuilder block fragmentation by getting a new StringBuilder
                // when the requested size is larger than the current capacity
                if (capacity <= sb.Capacity) {
                    StringBuilderCache.CachedInstance = null as any;
                    sb.Clear();
                    return sb;
                }
            }
        }
        return new StringBuilder(capacity);
    }

    public static Release(sb: StringBuilder): void {
        if (sb.Capacity <= StringBuilderCache.MAX_BUILDER_SIZE) {
            StringBuilderCache.CachedInstance = sb;
        }
    }

    public static GetStringAndRelease(sb: StringBuilder): string {
        const result: string = sb.ToString();
        StringBuilderCache.Release(sb);
        return result;
    }
}