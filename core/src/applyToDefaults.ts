import { assert } from "./assert";
import { clone } from "./clone";
import { merge } from "./merge";

export function applyToDefaults<T, K extends object | boolean>(defaults_: T, options: K,
    isNullOverride?: boolean): T & K | undefined {
    let defaults = <T & K>defaults_;

    assert(defaults && typeof defaults === 'object', 'Invalid defaults value: must be true, lasy or an object.');
    assert(!options || options === true || typeof options === 'object', 'Invalid options value: must be true, falsy or an object.');

    if (!options) {
        return <any>null;
    }

    const copy = clone(defaults as any);

    if (options === true) {
        return copy;
    }

    return merge(copy, <any>options, isNullOverride === true, false);
}