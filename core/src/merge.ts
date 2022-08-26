import { assert } from "./assert";
import { clone } from "./clone";

export type IndexType = {[index: string]: any };

/**
 * Merge all properties of source into target. source wins in conflict, and by default null and undefined
 * from source are applied.
 * @param target
 * @param source
 * @param isNullOverride
 * @param isMergeArray
 */
export function merge<T extends IndexType, K extends IndexType>(target_: T, source: K, isNullOverride: boolean = true, isMergeArray: boolean = true): T & K {
    let target = <T & K> target_; // typescript i mutlu etmek için.

    assert(target && typeof target === 'object', 'Invalid target value. Must be an object.');
    assert(source === null || source === undefined || typeof source === 'object', 'Invalid source value. Must be null, undefined, or an object.');

    // source boş ise birleştirilecek birşey yok.
    if (!source) {
        return target;
    }

    if (Array.isArray(source)) {
        assert(Array.isArray(target), 'Cannot merge array onto an object.');
        if (Array.isArray(target)) { // typescriptin target'ı array olarak görmesi için type guard.
            if (isMergeArray === false) {
                target.length = 0;
            }
        }
        for (let i = 0; i < source.length; ++i) {
            target.push(clone(source[i]));
        }
        return target;
    }

    const keys = Object.keys(source);
    for (let i = 0; i < keys.length; ++i) {
        const key = keys[i];
        const value = source[key];

        // key targetta bulunmuyorsa, key targetta bir object'te karşılık gelmiyorsa,
        if (value && typeof value === 'object') {
            if (!target[key]
                || typeof target[key] !== 'object'
                || (Array.isArray(target[key]) !== Array.isArray(value))
                || value instanceof Date
                || value instanceof RegExp) {
                (target as any)[key] = clone(value);
            } else {
                merge(target[key], value, isNullOverride, isMergeArray);
            }
        } else {
            // Buradaki null check explicit dediğimiz şekilde yapılıyor.
            // Bunun sebebi boş stringler de ('') null olarak değerlendirileceğinden.
            if (value !== null && value !== undefined) {
                (target as any)[key] = value;
            } else if (isNullOverride !== false) {
                (target as any)[key] = value;
            }
        }
    }

    return target;
}