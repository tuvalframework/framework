import { SimpleDictionary } from "./SimpleDictionary";
import { InvalidOperationException } from "../../Exceptions";
import { error } from "../../error";
import { IIteratorResult } from "../enumeration_/IIterator";
import { KeyValuePair } from "../../KeyValuePair";
import { IEnumerator } from "../enumeration_/IEnumerator";
import { IEnumerable } from "../enumeration_/IEnumerable";
import { DisposableBase } from "../../Disposable/DisposableBase";

export class SimpleDictionaryEnumerator<TKey, TValue> extends DisposableBase implements IEnumerator<KeyValuePair<TKey, TValue>>, IEnumerable<KeyValuePair<TKey, TValue>>{
    private myArray: SimpleDictionary<TKey, TValue>;
    private myForward: boolean;
    private myIndex: number;

    constructor(a: SimpleDictionary<TKey, TValue>, forward: boolean) {
        super();
        this.myArray = a;
        this.myForward = forward;
        this.myIndex = -1;
        this.Reset();
    }
    public get Current(): { key: TKey, value: TValue } {
        if (this.myIndex < 0 || this.myIndex >= this.myArray.Count) {
            throw new InvalidOperationException("Group.GroupEnumerator is not at a valid position for the List");
        }
        const key = (<any>this.myArray).keys[this.myIndex];
        const value = (<any>this.myArray).values[this.myIndex];
        return { key: key, value: value }
    }

    public GetEnumerator(): SimpleDictionaryEnumerator<TKey, TValue> {
        const goGroupEnumerators: SimpleDictionaryEnumerator<TKey, TValue> = this;
        goGroupEnumerators.Reset();
        return goGroupEnumerators;
    }

    public MoveNext(): boolean {
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
    public Reset(): void {
        if (this.myForward) {
            this.myIndex = -1;
            return;
        }
        this.myIndex = this.myArray.Count;
    }

    public TryMoveNext(out: (value: KeyValuePair<TKey, TValue>) => void): boolean {
        throw error('tryMoveNext not implemented in SimpleDictionaryEnumerator');
    }

    public End() {
        throw error('end not implemented in SimpleDictionaryEnumerator');
    }

    public NextValue(value?: any): KeyValuePair<TKey, TValue> | undefined {
        throw error('nextValue not implemented in SimpleDictionaryEnumerator');
    }

    public IsEndless: boolean = false;

    public Next(value?: any): IIteratorResult<KeyValuePair<TKey, TValue>> {
        throw error('next not implemented in SimpleDictionaryEnumerator');
    }
    'return'?(value?: any): IIteratorResult<any> {
        throw error('return not implemented in SimpleDictionaryEnumerator');
    }
    'throw'?(e?: any): IIteratorResult<KeyValuePair<TKey, TValue>> {
        throw error('throw not implemented in SimpleDictionaryEnumerator');
    }
}