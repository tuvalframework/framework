
import { ICloneable } from "../../ICloneable";
import { IDictionary } from "./IDictionary";
import { int, New } from '../../float';
import { Comparer } from '../Comparer';
//import { CultureInfo } from "../../Globalization/CultureInfo";
import { is } from "../../is";
import { ArgumentOutOfRangeException } from "../../Exceptions/ArgumentOutOfRangeException";
import { Environment } from "../../Environment";
import { TArray } from "../../Extensions/TArray";
import { ArgumentNullException } from "../../Exceptions/ArgumentNullException";
import { System } from "../../SystemTypes";
import { ClassInfo, Internal, Override, Virtual } from "../../Reflection/Decorators/ClassInfo";
import { ArgumentException } from "../../Exceptions/ArgumentException";
import { ICollection } from "./ICollection";
import { KeyValuePair } from "./KeyValuePair";
import { TObject } from '../../Extensions/TObject';
import { DictionaryEntry } from "../DictionaryEntry";
import { KeyValuePairs } from "../KeyValuePairs";
import { IEnumerator } from "../enumeration_/IEnumerator";
import { IDictionaryEnumerator } from "../dictionaries_/IDictionaryEnumerator";
import { IList } from "./IList";
import { InvalidOperationException } from "../../Exceptions/InvalidOperationException";
import { NotSupportedException } from "../../Exceptions/NotSupportedException";
import { NotImplementedException } from "../../Exceptions";
import { IIteratorResult } from "../enumeration_/IIterator";
import { Context } from '../../Context/Context';
import { foreach } from "../../foreach";
import { TString } from '../../Text/TString';
import { IComparer } from "../IComparer";

@ClassInfo({
    fullName: System.Types.Collections.Generics.SortedList,
    instanceof: [
        System.Types.Collections.Generics.SortedList,
        System.Types.Collections.Generics.Dictionaries.IDictionary,
        System.Types.Collections.Generics.ICollection,
        System.Types.Collections.Enumeration.IEnumerable
    ]
})
export class SortedList<TKey, TValue> implements IDictionary<TKey, TValue>, ICloneable<SortedList<TKey, TValue>> {
    private keys: any[] = null as any;
    private values: any[] = null as any;
    private _size: int = 0;
    private version: int = 0;
    private comparer: IComparer<any> = null as any;
    private keyList: KeyList<TKey> = null as any;
    private valueList: ValueList<TValue> = null as any;

    private static readonly _defaultCapacity: int = 16;

    private static emptyArray: any[] = [];

    public constructor();
    public constructor(initialCapacity: int);
    public constructor(array2d:Array<any>);
    public constructor(comparer: IComparer<any>);
    public constructor(comparer: IComparer<any>, capacity: int);
    public constructor(d: IDictionary<TKey, TValue>);
    public constructor(d: IDictionary<TKey, TValue>, comparer: IComparer<any>)
    public constructor(...args: any[]) {
        if (args.length === 0) {
            this.constructor1();
        } else if (args.length === 1 && is.int(args[0])) {
            const initialCapacity: int = args[0];
            this.constructor2(initialCapacity);
        } else if (args.length === 1 && is.typeof<IComparer<any>>(args[0], System.Types.IComparer)) {
            const comparer: IComparer<any> = args[0];
            this.constructor3(comparer);
        } else if (args.length === 1 && is.array(args[0])) {
            this.constructor1();
            args[0].forEach((de) => {
                if (is.array(de)) {
                    if (de.length === 1) { //no value only key
                        this.Add(de[0], null as any);
                    } else if (de.length > 1) {
                        this.Add(de[0], de[1]);
                    }
                }
            });
        } else if (args.length === 2 && is.typeof<IComparer<any>>(args[0], System.Types.IComparer) && is.int(args[1])) {
            const comparer: IComparer<any> = args[0];
            const capacity: int = args[1];
            this.constructor4(comparer, capacity);
        } else if (args.length === 1 && is.typeof<IDictionary<TKey, TValue>>(args[0], System.Types.Collections.Generics.Dictionaries.IDictionary)) {
            const d: IDictionary<TKey, TValue> = args[0];
            this.constructor5(d);
        } else if (args.length === 2 && is.typeof<IDictionary<TKey, TValue>>(args[0], System.Types.Collections.Generics.Dictionaries.IDictionary) && is.typeof<IComparer<any>>(args[0], System.Types.IComparer)) {
            const d: IDictionary<TKey, TValue> = args[0];
            const comparer: IComparer<any> = args[1];
            this.constructor6(d, comparer);
        }
    }

    public constructor1() {
        this.Init();
    }
    private Init(): void {
        this.keys = SortedList.emptyArray;
        this.values = SortedList.emptyArray;
        this._size = 0;
        const CultureInfo = Context.Current.get('CultureInfo');
        this.comparer = new Comparer(CultureInfo.CurrentCulture);
    }


    public constructor2(initialCapacity: int) {
        if (initialCapacity < 0)
            throw new ArgumentOutOfRangeException("initialCapacity", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
        this.keys = New.Array(initialCapacity);
        this.values = New.Array(initialCapacity);
        const CultureInfo = Context.Current.get('CultureInfo');
        this.comparer = new Comparer(CultureInfo.CurrentCulture);
    }



    public constructor3(comparer: IComparer<any>) {
        this.constructor1();
        if (comparer != null) {
            this.comparer = comparer;
        }
    }


    public constructor4(comparer: IComparer<any>, capacity: int) {
        this.constructor3(comparer);
        this.Capacity = capacity;
    }


    public constructor5(d: IDictionary<TKey, TValue>) {
        this.constructor6(d, null as any);
    }


    public constructor6(d: IDictionary<TKey, TValue>, comparer: IComparer<any>) {
        this.constructor4(comparer, (d != null ? d.Count : 0))
        if (d == null) {
            throw new ArgumentNullException("d", Environment.GetResourceString("ArgumentNull_Dictionary"));
        }
        d.Keys.CopyTo(this.keys, 0);
        d.Values.CopyTo(this.values, 0);
        TArray.SortImpl(this.keys, this.values, comparer);
        this._size = d.Count;
    }


    public Add(keyValuePair: KeyValuePair<TKey, TValue>): void;
    public Add(key: TKey, value: TValue): void;
    public Add(...args: any[]): void {
        if (args.length === 1) {
            const keyValuePair: KeyValuePair<TKey, TValue> = args[0];
            this.Add(keyValuePair.Key, keyValuePair.Value);
        } else if (args.length === 2) {
            const key: TKey = args[0];
            const value: TValue = args[1];
            if (key == null) {
                throw new ArgumentNullException("key", Environment.GetResourceString("ArgumentNull_Key"));
            }
            const i: int = TArray.BinarySearch(this.keys, 0, this._size, key, this.comparer);
            if (i >= 0)
                throw new ArgumentException(Environment.GetResourceString("Argument_AddingDuplicate__", this.GetKey(i) as any, key as any));
            this.Insert(~i, key, value);
        }
    }


    public get Capacity(): int {
        return this.keys.length;
    }
    public set Capacity(value: int) {
        if (value < this.Count) {
            throw new ArgumentOutOfRangeException("value", Environment.GetResourceString("ArgumentOutOfRange_SmallCapacity"));
        }

        if (value !== this.keys.length) {
            if (value > 0) {
                const newKeys: TKey[] = New.Array(value);
                const newValues: TValue[] = New.Array(value);
                if (this._size > 0) {
                    TArray.Copy(this.keys, 0, newKeys, 0, this._size);
                    TArray.Copy(this.values, 0, newValues, 0, this._size);
                }
                this.keys = newKeys;
                this.values = newValues;
            }
            else {
                // size can only be zero here.
                //Contract.Assert(_size == 0, "Size is not zero");
                this.keys = SortedList.emptyArray;
                this.values = SortedList.emptyArray;
            }
        }
    }


    // Returns the number of entries in this sorted list.
    public get Count(): int {
        return this._size;
    }

    // Returns a collection representing the keys of this sorted list. This
    // method returns the same object as GetKeyList, but typed as an
    // ICollection instead of an IList.
    //
    public get Keys(): ICollection<TKey> {
        return this.GetKeyList();
    }

    // Returns a collection representing the values of this sorted list. This
    // method returns the same object as GetValueList, but typed as an
    // ICollection instead of an IList.
    //
    public get Values(): ICollection<TValue> {
        return this.GetValueList();
    }

    // Is this SortedList read-only?
    public get IsReadOnly(): boolean {
        return false;
    }

    public get IsFixedSize(): boolean {
        return false;
    }


    // Removes all entries from this sorted list.
    @Virtual
    public Clear(): void {
        // clear does not change the capacity
        this.version++;
        TArray.Clear(this.keys, 0, this._size); // Don't need to doc this but we clear the elements so that the gc can reclaim the references.
        TArray.Clear(this.values, 0, this._size); // Don't need to doc this but we clear the elements so that the gc can reclaim the references.
        this._size = 0;

    }

    @Virtual
    public Clone(): SortedList<TKey, TValue> {
        const sl: SortedList<TKey, TValue> = new SortedList(this._size);
        TArray.Copy(this.keys, 0, sl.keys, 0, this._size);
        TArray.Copy(this.values, 0, sl.values, 0, this._size);
        sl._size = this._size;
        sl.version = this.version;
        sl.comparer = this.comparer;
        // Don't copy keyList nor valueList.
        return sl;
    }


    // Checks if this sorted list contains an entry with the given key.
    //
    public Contains(keyValuePair: KeyValuePair<TKey, TValue>): boolean;
    public Contains(key: TKey): boolean;
    public Contains(...args: any[]): boolean {
        if (args.length === 1 && is.typeof<KeyValuePair<TKey, TValue>>(args[0], System.Types.Collections.Generics.KeyValuePair)) {
            const keyValuePair: KeyValuePair<TKey, TValue> = args[0];
            const index: int = this.IndexOfKey(keyValuePair.Key);
            if (index >= 0 && TObject.Equals(this.values[index], keyValuePair.Value)) {
                return true;
            }
            return false;
        } else if (args.length === 1) {
            const key: TKey = args[0];
            return this.IndexOfKey(key) >= 0;
        }
        throw new ArgumentOutOfRangeException('');
    }


    // Checks if this sorted list contains an entry with the given key.
    @Virtual
    public ContainsKey(key: TKey): boolean {
        // Yes, this is a SPEC'ed duplicate of Contains().
        return this.IndexOfKey(key) >= 0;
    }

    // Checks if this sorted list contains an entry with the given value. The
    // values of the entries of the sorted list are compared to the given value
    // using the Object.Equals method. This method performs a linear
    // search and is substantially slower than the Contains
    // method.
    //
    @Virtual
    public ContainsValue(value: TValue): boolean {
        return this.IndexOfValue(value) >= 0;
    }

    // Copies the values in this SortedList to an array.
    @Virtual
    public CopyTo(array: Array<any>, arrayIndex: int): void {
        if (array == null)
            throw new ArgumentNullException("array", Environment.GetResourceString("ArgumentNull_Array"));
        /*  if (array.Rank != 1)
             throw new ArgumentException(Environment.GetResourceString("Arg_RankMultiDimNotSupported")); */
        if (arrayIndex < 0)
            throw new ArgumentOutOfRangeException("arrayIndex", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
        if (array.length - arrayIndex < this.Count)
            throw new ArgumentException(Environment.GetResourceString("Arg_ArrayPlusOffTooSmall"));
        //Contract.EndContractBlock();
        for (let i: int = 0; i < this.Count; i++) {
            const entry: DictionaryEntry<TKey, TValue> = new DictionaryEntry(this.keys[i], this.values[i]);
            array[i + arrayIndex] = entry;
        }
    }

    // Copies the values in this SortedList to an KeyValuePairs array.
    // KeyValuePairs is different from Dictionary Entry in that it has special
    // debugger attributes on its fields.

    @Internal
    @Virtual
    public ToKeyValuePairsArray(): KeyValuePairs[] {
        const array: KeyValuePairs[] = New.Array(this.Count);
        for (let i: int = 0; i < this.Count; i++) {
            array[i] = new KeyValuePairs(this.keys[i], this.values[i]);
        }
        return array;
    }

    // Ensures that the capacity of this sorted list is at least the given
    // minimum value. If the currect capacity of the list is less than
    // min, the capacity is increased to twice the current capacity or
    // to min, whichever is larger.
    private EnsureCapacity(min: int): void {
        let newCapacity: int = this.keys.length === 0 ? 16 : this.keys.length * 2;
        // Allow the list to grow to maximum possible capacity (~2G elements) before encountering overflow.
        // Note that this check works even when _items.Length overflowed thanks to the (uint) cast
        if (newCapacity > TArray.MaxArrayLength) {
            newCapacity = TArray.MaxArrayLength;
        }
        if (newCapacity < min) {
            newCapacity = min;
        }
        this.Capacity = newCapacity;
    }

    // Returns the value of the entry at the given index.
    //
    @Virtual
    public GetByIndex(index: int): TValue {
        if (index < 0 || index >= this.Count)
            throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_Index"));
        //Contract.EndContractBlock();
        return this.values[index];
    }

    // Returns an IEnumerator for this sorted list.  If modifications
    // made to the sorted list while an enumeration is in progress,
    // the MoveNext and Remove methods
    // of the enumerator will throw an exception.
    //
    public GetEnumerator(): IEnumerator<KeyValuePair<TKey, TValue>> {
        return new SortedListEnumerator(this, 0, this._size, SortedListEnumerator.DictEntry);
    }

    // Returns an IDictionaryEnumerator for this sorted list.  If modifications
    // made to the sorted list while an enumeration is in progress,
    // the MoveNext and Remove methods
    // of the enumerator will throw an exception.
    //
    /*  public  GetEnumerator():IDictionaryEnumerator<TKey,TValue> {
         return new SortedListEnumerator(this, 0, _size, SortedListEnumerator.DictEntry);
     } */

    // Returns the key of the entry at the given index.
    //
    @Virtual
    public GetKey(index: int): TKey {
        if (index < 0 || index >= this.Count) {
            throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_Index"));
        }
        //Contract.EndContractBlock();
        return this.keys[index];
    }

    // Returns an IList representing the keys of this sorted list. The
    // returned list is an alias for the keys of this sorted list, so
    // modifications made to the returned list are directly reflected in the
    // underlying sorted list, and vice versa. The elements of the returned
    // list are ordered in the same way as the elements of the sorted list. The
    // returned list does not support adding, inserting, or modifying elements
    // (the Add, AddRange, Insert, InsertRange,
    // Reverse, Set, SetRange, and Sort methods
    // throw exceptions), but it does allow removal of elements (through the
    // Remove and RemoveRange methods or through an enumerator).
    // Null is an invalid key value.
    //
    @Virtual
    public GetKeyList(): KeyList<TKey> {
        if (this.keyList == null) {
            this.keyList = new KeyList(this);
        }
        return this.keyList;
    }

    // Returns an IList representing the values of this sorted list. The
    // returned list is an alias for the values of this sorted list, so
    // modifications made to the returned list are directly reflected in the
    // underlying sorted list, and vice versa. The elements of the returned
    // list are ordered in the same way as the elements of the sorted list. The
    // returned list does not support adding or inserting elements (the
    // Add, AddRange, Insert and InsertRange
    // methods throw exceptions), but it does allow modification and removal of
    // elements (through the Remove, RemoveRange, Set and
    // SetRange methods or through an enumerator).
    //
    @Virtual
    public GetValueList(): IList<TValue> {
        if (this.valueList == null) {
            this.valueList = new ValueList(this);
        }
        return this.valueList;
    }

    // Returns the value associated with the given key. If an entry with the
    // given key is not found, the returned value is null.
    //
    @Virtual
    public Get(key: TKey): TValue {
        const i: int = this.IndexOfKey(key);
        if (i >= 0) {
            return this.values[i];
        }
        return null as any;
    }
    @Virtual
    public Set(key: TKey, value: TValue): void {
        if (key == null) {
            throw new ArgumentNullException("key", Environment.GetResourceString("ArgumentNull_Key"));
        }
        //Contract.EndContractBlock();
        const i: int = TArray.BinarySearch(this.keys, 0, this._size, key, this.comparer);
        if (i >= 0) {
            this.values[i] = value;
            this.version++;
            return;
        }
        this.Insert(~i, key, value);
    }

    // Returns the index of the entry with a given key in this sorted list. The
    // key is located through a binary search, and thus the average execution
    // time of this method is proportional to Log2(size), where
    // size is the size of this sorted list. The returned value is -1 if
    // the given key does not occur in this sorted list. Null is an invalid
    // key value.
    //
    @Virtual
    public IndexOfKey(key: TKey): int {
        if (key == null) {
            throw new ArgumentNullException("key", Environment.GetResourceString("ArgumentNull_Key"));
        }
        //Contract.EndContractBlock();
        const ret: int = TArray.BinarySearch(this.keys, 0, this._size, key, this.comparer);
        return ret >= 0 ? ret : -1;
    }

    // Returns the index of the first occurrence of an entry with a given value
    // in this sorted list. The entry is located through a linear search, and
    // thus the average execution time of this method is proportional to the
    // size of this sorted list. The elements of the list are compared to the
    // given value using the Object.Equals method.
    //
    @Virtual
    public IndexOfValue(value: TValue): int {
        return TArray.IndexOf(this.values, value, 0, this._size);
    }

    // Inserts an entry with a given key and value at a given index.
    private Insert(index: int, key: TKey, value: TValue): void {
        if (this._size === this.keys.length) {
            this.EnsureCapacity(this._size + 1);
        }
        if (index < this._size) {
            TArray.Copy(this.keys, index, this.keys, index + 1, this._size - index);
            TArray.Copy(this.values, index, this.values, index + 1, this._size - index);
        }
        this.keys[index] = key;
        this.values[index] = value;
        this._size++;
        this.version++;
    }

    // Removes the entry at the given index. The size of the sorted list is
    // decreased by one.
    //
    @Virtual
    public RemoveAt(index: int): void {
        if (index < 0 || index >= this.Count) {
            throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_Index"));
        }
        //Contract.EndContractBlock();
        this._size--;
        if (index < this._size) {
            TArray.Copy(this.keys, index + 1, this.keys, index, this._size - index);
            TArray.Copy(this.values, index + 1, this.values, index, this._size - index);
        }
        this.keys[this._size] = null;
        this.values[this._size] = null;
        this.version++;
    }

    // Removes an entry from this sorted list. If an entry with the specified
    // key exists in the sorted list, it is removed. An ArgumentException is
    // thrown if the key is null.
    //
    @Virtual
    public Remove(key: TKey | KeyValuePair<TKey, TValue>): boolean {
        const i: int = this.IndexOfKey(key as any);
        if (i >= 0)
            this.RemoveAt(i);
        return i >= 0;
    }

    // Sets the value at an index to a given value.  The previous value of
    // the given entry is overwritten.
    //
    @Virtual
    public SetByIndex(index: int, value: TValue): void {
        if (index < 0 || index >= this.Count) throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_Index"));
        //Contract.EndContractBlock();
        this.values[index] = value;
        this.version++;
    }


    // Sets the capacity of this sorted list to the size of the sorted list.
    // This method can be used to minimize a sorted list's memory overhead once
    // it is known that no new elements will be added to the sorted list. To
    // completely clear a sorted list and release all memory referenced by the
    // sorted list, execute the following statements:
    //
    // sortedList.Clear();
    // sortedList.TrimToSize();
    //
    @Virtual
    public TrimToSize(): void {
        this.Capacity = this._size;
    }

    @Override
    public ToString(): string {
        let result = '';
        foreach(this, (item) => {
            if (item == null) {
                result += 'null';
            } else {
                result += TString.ToString(item) + ',';
            }
        });
        return result.substr(0, result.lastIndexOf(','));
    }
}



export class SortedListEnumerator<TKey, TValue> extends TObject implements IDictionaryEnumerator<TKey, TValue>, ICloneable<SortedListEnumerator<TValue, TKey>> {
    protected dispose(disposing: boolean): void {
        throw new Error("Method not implemented.");
    }

    private sortedList: SortedList<TKey, TValue> = null as any;
    private key: TKey = null as any;
    private value: TValue = null as any;
    private index: int = 0;
    private startIndex: int = 0;        // Store for Reset.
    private endIndex: int = 0;
    private version: int = 0;
    private current: boolean = false;       // Is the current element valid?
    private getObjectRetType: int = 0;  // What should GetObject return?

    public static readonly/* internal */   Keys: int = 1;
    public static readonly/* internal */   Values: int = 2;
    public static readonly/* internal */   DictEntry: int = 3;

    public /* internal */ constructor(sortedList: SortedList<TKey, TValue>, index: int, count: int, getObjRetType: int) {
        super();
        this.sortedList = sortedList;
        this.index = index;
        this.startIndex = index;
        this.endIndex = index + count;
        this.version = (sortedList as any).version;
        this.getObjectRetType = getObjRetType;
        this.current = false;
    }

    /**
     * Moves to the next entry and emits the value through the out callback.
     */
    TryMoveNext(out: (value: KeyValuePair<TKey, TValue>) => void): boolean {
        throw new NotImplementedException('');
    }
    End(): void {

    }
    NextValue(value?: any): KeyValuePair<TKey, TValue> | undefined {
        throw new NotImplementedException('');
    }
    Next(value?: any): IIteratorResult<KeyValuePair<TKey, TValue>> {
        throw new NotImplementedException('');
    }
    public Clone(): any {
        return this.MemberwiseClone();
    }

    public get Key(): TKey {
        if (this.version !== (this.sortedList as any).version) {
            throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_EnumFailedVersion"));
        }
        if (this.current === false) {
            throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_EnumOpCantHappen"));
        }
        return this.key;
    }

    @Virtual
    public MoveNext(): boolean {
        if (this.version !== (this.sortedList as any).version) {
            throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_EnumFailedVersion"));
        }
        if (this.index < this.endIndex) {
            this.key = (this.sortedList as any).keys[this.index];
            this.value = (this.sortedList as any).values[this.index];
            this.index++;
            this.current = true;
            return true;
        }
        this.key = null as any;
        this.value = null as any;
        this.current = false;
        return false;
    }

    public get Entry(): KeyValuePair<TKey, TValue> {
        if (this.version !== (this.sortedList as any).version) throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_EnumFailedVersion"));
        if (this.current == false) {
            throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_EnumOpCantHappen"));
        }
        return new KeyValuePair<TKey, TValue>(this.key, this.value);
    }

    public get Current(): KeyValuePair<TKey, TValue> {
        return new KeyValuePair<TKey, TValue>(this.key, this.value);
    }


    public get Value(): TValue {
        if (this.version !== (this.sortedList as any).version) {
            throw new InvalidOperationException(Environment.GetResourceString('InvalidOperation_EnumFailedVersion'));
        }
        if (this.current === false) {
            throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_EnumOpCantHappen"));
        }
        return this.value;
    }

    @Virtual
    public Reset(): void {
        if (this.version !== (this.sortedList as any).version) {
            throw new InvalidOperationException(Environment.GetResourceString('InvalidOperation_EnumFailedVersion'));
        }
        this.index = this.startIndex;
        this.current = false;
        this.key = null as any;
        this.value = null as any;
    }
}

export class KeyList<TKey> implements IList<TKey>
{
    private sortedList: SortedList<TKey, any> = null as any;

    public /* internal */ constructor(sortedList: SortedList<TKey, any>) {
        this.sortedList = sortedList;
    }

    public get Count(): int {
        return (this.sortedList as any)._size;
    }

    public get IsReadOnly(): boolean {
        return true;
    }

    public get IsFixedSize(): boolean {
        return true;
    }


    @Virtual
    public Add(key: TKey): int {
        throw new NotSupportedException(Environment.GetResourceString('NotSupported_SortedListNestedWrite'));
        //            return 0; // suppress compiler warning
    }

    @Virtual
    public Clear(): void {
        throw new NotSupportedException(Environment.GetResourceString('NotSupported_SortedListNestedWrite'));
    }

    @Virtual
    public Contains(key: TKey): boolean {
        return this.sortedList.Contains(key);
    }

    @Virtual
    public CopyTo(array: Array<TKey>, arrayIndex: int): void {
        /*  if (array != null && array.Rank != 1)
             throw new ArgumentException(Environment.GetResourceString("Arg_RankMultiDimNotSupported"));
         Contract.EndContractBlock(); */

        // defer error checking to Array.Copy
        TArray.Copy((this.sortedList as any).keys, 0, array, arrayIndex, this.sortedList.Count);
    }

    @Virtual
    public Insert(index: int, value: TKey): void {
        throw new NotSupportedException(Environment.GetResourceString('NotSupported_SortedListNestedWrite'));
    }

    @Virtual
    public Get(index: int): TKey {
        return this.sortedList.GetKey(index);
    }
    @Virtual
    public Set(index: int, value: TKey) {
        throw new NotSupportedException(Environment.GetResourceString("NotSupported_KeyCollectionSet"));
    }


    @Virtual
    public GetEnumerator(): IEnumerator<TKey> {
        return new SortedListEnumerator(this.sortedList, 0, this.sortedList.Count, SortedListEnumerator.Keys) as any;
    }

    @Virtual
    public IndexOf(key: TKey): int {
        if (key == null)
            throw new ArgumentNullException("key", Environment.GetResourceString("ArgumentNull_Key"));
        //Contract.EndContractBlock();

        const i: int = TArray.BinarySearch((this.sortedList as any).keys, 0, this.sortedList.Count, key, (this.sortedList as any).comparer);
        if (i >= 0) {
            return i;
        }
        return -1;
    }

    @Virtual
    public Remove(key: TKey): boolean {
        throw new NotSupportedException(Environment.GetResourceString('NotSupported_SortedListNestedWrite'));
    }

    @Virtual
    public RemoveAt(index: int): void {
        throw new NotSupportedException(Environment.GetResourceString('NotSupported_SortedListNestedWrite'));
    }
}

export class ValueList<TValue> implements IList<TValue>
{
    private sortedList: SortedList<any, TValue> = null as any;

    public /* internal */ constructor(sortedList: SortedList<any, TValue>) {
        this.sortedList = sortedList;
    }

    public get Count(): int {
        return (this.sortedList as any)._size;
    }

    public get IsReadOnly(): boolean {
        return true;
    }

    public get IsFixedSize(): boolean {
        return true;
    }

    @Virtual
    public Add(key: TValue): int {
        throw new NotSupportedException(Environment.GetResourceString('NotSupported_SortedListNestedWrite'));
    }

    @Virtual
    public Clear(): void {
        throw new NotSupportedException(Environment.GetResourceString('NotSupported_SortedListNestedWrite'));
    }

    @Virtual
    public Contains(value: TValue): boolean {
        return this.sortedList.ContainsValue(value);
    }

    @Virtual
    public CopyTo(array: Array<TValue>, arrayIndex: int): void {
        /*  if (array != null && array.Rank != 1)
             throw new ArgumentException(Environment.GetResourceString("Arg_RankMultiDimNotSupported"));
         Contract.EndContractBlock(); */

        // defer error checking to Array.Copy
        TArray.Copy((this.sortedList as any).values, 0, array, arrayIndex, this.sortedList.Count);
    }

    @Virtual
    public Insert(index: int, value: TValue): void {
        throw new NotSupportedException(Environment.GetResourceString('NotSupported_SortedListNestedWrite'));
    }

    public Get(index: int): TValue {
        return this.sortedList.GetByIndex(index);
    }
    public Set(index: int, value: TValue) {
        throw new NotSupportedException(Environment.GetResourceString('NotSupported_SortedListNestedWrite'));
    }


    @Virtual
    public GetEnumerator(): IEnumerator<TValue> {
        return new SortedListEnumerator(this.sortedList, 0, this.sortedList.Count, SortedListEnumerator.Values) as any;
    }

    @Virtual
    public IndexOf(value: TValue): int {
        return TArray.IndexOf((this.sortedList as any).values, value, 0, this.sortedList.Count);
    }

    @Virtual
    public Remove(value: TValue): boolean {
        throw new NotSupportedException(Environment.GetResourceString('NotSupported_SortedListNestedWrite'));
    }
    @Virtual
    public RemoveAt(index: int): void {
        throw new NotSupportedException(Environment.GetResourceString('NotSupported_SortedListNestedWrite'));
    }

}