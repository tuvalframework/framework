import { is } from "./is";
import { Exception } from "./Exception";

export type Out<T> = {
    value: T
};
export type Ref<T> = {
    value: T
};

const OutEmpty: Out<any> = {
    value: undefined
};

export function newOutEmpty<T>(): Out<T>;
export function newOutEmpty<T>(defaultValue:T): Out<T>;
export function newOutEmpty<T>(...args: any[]): Out<T> {
    if (args.length === 0) {
        return Object.create(OutEmpty);
    } else if (args.length === 1) {
        const obj: Out<T> = Object.create(OutEmpty);
        obj.value = args[0];
        return obj;
    }
    return null as any;
}
export function ref<T>(value: T): T {
    if (is.primitive(value)) {
        throw new Exception('ref can not be used with primitives.');
    }
    return value;
   /*  return Object.create({
        value: value
    }); */
}
export function out<T>(value: T): T {
    if (is.primitive(value)) {
        throw new Exception('ref can not be used with primitives.');
    }
    return value;
   /*  return Object.create({
        value: value
    }); */
}