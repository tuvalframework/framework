import { assert } from "./assert";

export interface ReachOptions {
    separator?: string;
    default?: any;
    strict?: boolean;
    functions?: boolean;
}
export function reach(obj: any, chain: string, options?: ReachOptions): any {

    if (chain === null || typeof chain === 'undefined') {
        return obj;
    }

    options = options || {};
    /* if (typeof options === 'string') {
        options = <any>{ separator: options };
    } */
    const test = chain.split('/');
    const path = chain.split(options.separator || '.');
    let ref = obj;
    for (let i = 0; i < path.length; ++i) {
        let key = path[i];
        if (key[0] === '-' && Array.isArray(ref)) {
            key = key.slice(1, key.length);
            key = <any>(ref.length - <any>key);
        }
        if (!ref ||
            !((typeof ref === 'object' || typeof ref === 'function') && key in ref) ||
            (typeof ref !== 'object' && options.functions === false)) { // Only object and function can have properties.
            assert(!options.strict || i + 1 === path.length, `Missing segment ${key} in reach path ${chain}`);
            assert(typeof ref === 'object' || options.functions === true || typeof ref !== 'function', `Invalid segment ${key} in reach.`);
            ref = options.default;
            break;
        }
        ref = ref[key];
    }
    return ref;
}