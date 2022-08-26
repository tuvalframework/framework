import { IEnumerable } from "../enumeration_/IEnumerable";
import { SimpleDictionaryEnumerator } from "./SimpleDictionaryEnumerator";
import { KeyValuePair } from "../../KeyValuePair";
import { System } from "../../SystemTypes";
import { Out, newOutEmpty } from "../../Out";
import { ClassInfo } from "../../Reflection/Decorators/ClassInfo";

@ClassInfo({
    fullName: System.Types.Collections.Generics.Dictionaries.SimpleDictionary,
    instanceof: [
        System.Types.Collections.Generics.Dictionaries.SimpleDictionary,
        System.Types.Collections.Enumeration.IEnumerable
    ]
})
export class SimpleDictionary<TKey, TValue> implements IEnumerable<KeyValuePair<TKey, TValue>>{
    private keys: TKey[] = [];
    private values: TValue[] = [];

    public get Values(): TValue[] {
        return this.values;
    }
    public constructor(init?: SimpleDictionary<TKey, TValue>) {
        if (init != null) {
            const keys = init.getKeys();
            for (let i = 0; i < keys.length; i++) {
                this.add(keys[i], init.get(keys[i]));
            }
        }
    }
    public add(key: TKey, value: TValue): boolean {
        this.keys.push(key);
        this.values.push(value);
        return true;
    }
    public set(key: TKey, value: TValue) {
        const index = this.keys.indexOf(key);
        if (index > -1) {
            this.values[index] = value;
        } else {
            this.keys.push(key);
            this.values.push(value);
        }
    }

    public get Count(): number {
        return this.keys.length;
    }

    public contains(value: TValue): boolean {
        return this.values.indexOf(value) > -1;
    }

    public containsKey(key: TKey): boolean {
        return this.keys.indexOf(key) > -1;
    }


    public remove(value: TValue): boolean {
        const index = this.values.indexOf(value);
        this.keys.splice(index, 1);
        this.values.splice(index, 1);
        return true;
    }

    public removeKey(key: TKey) {
        const index = this.keys.indexOf(key);
        this.keys.splice(index, 1);
        this.values.splice(index, 1);
    }

    public tryGetValue(key: TKey, /*out*/ result: Out<TValue>): boolean {
        if (result == null) {
            //throw new Exception("out parameter can not be null or undefined.");
            result = newOutEmpty();
        }
        const index = this.keys.indexOf(key);
        if (index > -1) {
            result.value = this.values[index];
            return true;
        }
        return false;
    }

    public get(key: TKey): TValue {
        const index = this.keys.indexOf(key);
        if (index > -1) {
            return this.values[index];
        }
        return undefined as any;
    }

    public clear() {
        this.keys = [];
        this.values = [];
        return 0;
    }

    public GetEnumerator(): SimpleDictionaryEnumerator<TKey, TValue> {
        return new SimpleDictionaryEnumerator<TKey, TValue>(this, true);
    }

    public getKeys(): TKey[] {
        return this.keys.slice();
    }
}