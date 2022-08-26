import { _CollectionBase } from './CollectionBase';
import { EnumeratorBase } from './enumeration_/EnumeratorBase';
import { IEnumerator } from './enumeration_/IEnumerator';
import { ClassInfo } from '../Reflection/Decorators/ClassInfo';
import { System } from '../SystemTypes';



/* export class CollectionEnumerator<T> implements IEnumerator<T>, IEnumerable<T> {
    private myArray: Collection<T>;
    private myForward: boolean;
    private myIndex: number;

    constructor(a: Collection<T>, forward: boolean) {
        this.myArray = a;
        this.myForward = forward;
        this.myIndex = -1;
        this.reset();
    }
    public get Current(): T {
        if (this.myIndex < 0 || this.myIndex >= this.myArray.Count) {
            throw new InvalidOperationException('CollectionEnumerator is not at a valid position for the List');
        }
        return this.myArray[this.myIndex];
    }

    public getEnumerator(): CollectionEnumerator<T> {
        const goGroupEnumerators: CollectionEnumerator<T> = this;
        goGroupEnumerators.reset();
        return goGroupEnumerators;
    }

    public moveNext(): boolean {
        if (!this.myForward) {
            if (this.myIndex - 1 < 0) {
                return false;
            }
            this.myIndex = this.myIndex - 1;
            return true;
        }
        if (this.myIndex + 1 >= this.myArray.Count) {
            return false;
        }
        this.myIndex = this.myIndex + 1;
        return true;
    }
    public reset(): void {
        if (this.myForward) {
            this.myIndex = -1;
            return;
        }
        this.myIndex = this.myArray.Count;
    }
} */

console.log('CollectionBase is ' + _CollectionBase);
@ClassInfo({
    fullName: System.Types.Collections.Collection,
    instanceof: [
        System.Types.Collections.Collection
    ]
})
export class Collection<T> extends _CollectionBase<T> {

    constructor(..._arguments: T[]) {
        const args = [].slice.call(_arguments);
        super(args);
    }

    protected getCount(): number {
        //throw new Error("Method not implemented.");
        return this.length;
    }

    protected _addInternal(entry: T): boolean {
        return this.push(entry) === 1;
    }
    protected _removeInternal(entry: T, max?: number): number {
        const index: number = this.indexOf(entry);
        if (index > -1) {
            this.splice(index, 1);
        }
        return 1;
    }
    protected _clearInternal(): number {
        const count = this.length;
        for (let key in this) {
            delete this[key];
        }
        return count;
    }

    public getRange(start: number, end: number): Collection<T> {
        const slice: T[] = this.slice(start, end);
        return new Collection<T>(...slice);
    }

    public static toCollection<T>(arr: Array<T>): Collection<T> {
        const collection = new Collection<T>();
        const len = arr.length;

        for (let i = 0; i < len; i++) {
            (<any>collection).push(arr[i]);
        }
        return collection;
    }

    GetEnumerator(): IEnumerator<T> {
        const that = this;
        that.throwIfDisposed();

        let source: T[], index: number, version: number;
        return new EnumeratorBase<T>(
            () => {
                source = <any>that;
                version = that._version;
                index = 0;
            },
            (yielder) => {
                if (index) that.throwIfDisposed();
                else if (that.wasDisposed) {
                    // We never actually started? Then no biggie.
                    return yielder.yieldBreak();
                }

                that.assertVersion(version);

                if (index >= source.length) // Just in case the size changes as we enumerate use '>='.
                    return yielder.yieldBreak();

                return yielder.yieldReturn(source[index++]);
            }
        );
    }


}


/*
export class DictionaryEnumerator<TKey, TValue>
    implements IEnumerator<KeyValuePair<TKey, TValue>>, IEnumerable<KeyValuePair<TKey, TValue>> {
    private myArray: _Dictionary<TKey, TValue>;
    private myForward: boolean;
    private myIndex: number;

    constructor(a: _Dictionary<TKey, TValue>, forward: boolean) {
        this.myArray = a;
        this.myForward = forward;
        this.myIndex = -1;
        this.reset();
    }
    public get Current(): { key: TKey; value: TValue } {
        if (this.myIndex < 0 || this.myIndex >= this.myArray.Count) {
            throw new InvalidOperationException('Group.GroupEnumerator is not at a valid position for the List');
        }
        const key = (<any>this.myArray).keys[this.myIndex];
        const value = (<any>this.myArray).values[this.myIndex];
        return { key: key, value: value };
    }

    public getEnumerator(): DictionaryEnumerator<TKey, TValue> {
        const goGroupEnumerators: DictionaryEnumerator<TKey, TValue> = this;
        goGroupEnumerators.reset();
        return goGroupEnumerators;
    }

    public moveNext(): boolean {
        if (!this.myForward) {
            if (this.myIndex - 1 < 0) {
                return false;
            }
            this.myIndex = this.myIndex - 1;
            return true;
        }
        if (this.myIndex + 1 >= this.myArray.Count) {
            return false;
        }
        this.myIndex = this.myIndex + 1;
        return true;
    }
    public reset(): void {
        if (this.myForward) {
            this.myIndex = -1;
            return;
        }
        this.myIndex = this.myArray.Count;
    }
} */


/* export class _Dictionary<TKey, TValue> implements IEnumerable<KeyValuePair<TKey, TValue>> {
    private keys: TKey[] = [];
    private values: TValue[] = [];

    public constructor(init?: _Dictionary<TKey, TValue>) {
        if (init != null) {
            const keys = init.getKeys();
            for (let i = 0; i < keys.length; i++) {
                this.add(keys[i], init.get(keys[i]));
            }
        }
    }
    public add(key: TKey, value: TValue): boolean {
        try {
            this.keys.push(key);
            this.values.push(value);
            return true;
        } catch {
            return false;
        }
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

    public tryGetValue(key: TKey,  result: Out<TValue>): boolean {
        if (result == null) {
            //throw new Exception("out parameter can not be null or undefined.");
            result = {};
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
        return undefined;
    }

    public clear() {
        const count = this.keys.length;
        this.keys = [];
        this.values = [];
        return count;
    }

    public getEnumerator(): DictionaryEnumerator<TKey, TValue> {
        return new DictionaryEnumerator<TKey, TValue>(this, true);
    }

    public getKeys(): TKey[] {
        return this.keys.slice();
    }
} */

//export class StringDictionary<TValue> extends _Dictionary<string, TValue> { }
