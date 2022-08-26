import { StringBuilder } from "../../Text/StringBuilder";
import { int } from "../../float";

export class KeyValuePair<TKey, TValue> {
    private key: TKey = undefined as any;
    private value: TValue = undefined as any;

    public get Key(): TKey {
        return this.key;
    }

    public get Value(): TValue {
        return this.value;
    }

    public constructor(key?: TKey, value?: TValue) {
        this.key = key as any;
        this.value = value as any;
    }

    public static CreateArray<TKey, TValue>(len: int): Array<KeyValuePair<TKey, TValue>> {
        const array:KeyValuePair<TKey, TValue>[] = new Array(len);
        for(let i=0;i< len;i++) {
            array[i] = new KeyValuePair(undefined, undefined) as any;
        }

        return array;

    }

    public /* override */  toString(): string {
        return `[ Key : ${this.Key} Value: ${this.Value}]`;
    }
}