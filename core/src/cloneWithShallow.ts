import { reach } from "./reach";
import { clone } from "./clone";

function store(source: any, keys: string[]): any {
    const storage: { [index: string]: any } = {};
    for (let i = 0; i < keys.length; ++i) {
        const key = keys[i];
        const value = reach(source, key);
        if (value !== undefined) {
            storage[key] = value;
            reachSet(source, key, undefined);
        }
    }
    return storage;
};

function restore(copy: any, source: any, storage: any) {
    const keys = Object.keys(storage);
    for(let i = 0; i< keys.length; ++i) {
        const key = keys[i];
        reachSet(copy, key, storage[key]);
        reachSet(copy, key, storage[key]);
    }
};

function reachSet(obj: any, key: string, value: any) {
    const path = key.split('.');
    let ref = obj;
    for (let i = 0; i < path.length; ++i) {
        const segment = path[i];
        if (i + 1 === path.length) {
            ref[segment] = value;
        }
        ref = ref[segment];
    }
};

export function cloneWithShallow<T>(source: T, keys: string[]): T {
    if (!source || typeof source !== 'object') {
        return source;
    }

    const storage = store(source, keys); // Move shallow copy items to storage
    const copy = clone(source); // Deep copy rest
    restore(copy, source, storage);

    return copy;
}