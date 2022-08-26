import { IDictionary } from "./IDictionary";
import { ICollection } from "./ICollection";
import { IEnumerable } from "../enumeration_/IEnumerable";
import { IEqualityComparer } from "../IEqualityComparer";
import { KeyNotFoundException } from "../KeyNotFoundException";
import { IEnumerator } from "../enumeration_";
import { is } from "../../is";
import { System } from "../../SystemTypes";
import { KeyValuePair } from "./KeyValuePair";
import { TArray } from "../../Extensions/TArray";
import { ArgumentOutOfRangeException } from "../../Exceptions/ArgumentOutOfRangeException";
import { HashHelpers } from "../HashHelpers";
import { Out } from "../../Out";
import { int } from "../../float";
import { IDisposable } from "../../Disposable/IDisposable";
import { IDictionaryEnumerator } from "../IDictionaryEnumerator";
import { DictionaryEntry } from "../DictionaryEntry";
import { ExceptionResource } from "../../ExceptionResource";
import { ThrowHelper } from "../../ThrowHelper";
import { IReadOnlyCollection } from "./IReadOnlyCollection";
import { IReadOnlyDictionary } from "./IReadOnlyDictionary";
import { ArgumentNullException } from "../../Exceptions/ArgumentNullException";
import { foreach } from "../../foreach";
import { ArgumentException } from "../../Exceptions/ArgumentException";
import { ExceptionArgument } from "../../ExceptionArgument";
import { EqualityComparer } from "./EqualityComparer";
import { ClassInfo, ClassInfoInline } from "../../Reflection/Decorators/ClassInfo";

class Entry<TKey, TValue> {
    public hashCode: int = 0;
    public next: int = 0;
    public key: TKey = undefined as any;
    public value: TValue = undefined as any;
}


@ClassInfo({
	fullName: System.Types.Collections.Generics.Dictionaries.Dictionary,
	instanceof: [
		System.Types.Collections.Generics.Dictionaries.Dictionary,
        System.Types.Collections.Generics.Dictionaries.IDictionary,
        System.Types.Collections.ICollection,
        System.Types.Collections.Enumeration.IEnumerable,
        System.Types.Collections.Generics.Dictionaries.IReadOnlyDictionary,
        System.Types.Collections.IReadOnlyCollection
	]
})
export class Dictionary<TKey, TValue> implements IDictionary<TKey, TValue>, ICollection<KeyValuePair<TKey, TValue>>, IEnumerable<KeyValuePair<TKey, TValue>>, IReadOnlyDictionary<TKey, TValue>, IReadOnlyCollection<KeyValuePair<TKey, TValue>>{
    IsEndless?: boolean | undefined;
    private buckets: int[] = undefined as any;
    private entries: Entry<TKey, TValue>[] = undefined as any;
    private count = 0;
    private version = 0;
    private freeList = 0;
    private freeCount = 0;
    private comparer: IEqualityComparer<TKey> = undefined as any;
    private keys: ICollection<TKey> = undefined as any;
    private values: ICollection<TValue> = undefined as any;
    private static readonly VersionName: string = "Version";
    private static readonly HashSizeName: string = "HashSize";
    private static readonly KeyValuePairsName: string = "KeyValuePairs";
    private static readonly ComparerName: string = "Comparer";

    public get Comparer(): IEqualityComparer<TKey> {
        return this.comparer;
    }

    public get Count(): int {
        return this.count - this.freeCount;
    }

    private getInternal(key: TKey): TValue {
        return this.Get(key);
    }
    public Get(key: TKey): TValue {
        const int32: int = this.findEntry(key);
        if (int32 < 0) {
            throw new KeyNotFoundException('');
        }
        return this.entries[int32].value;
    }
    private setInternal(key: TKey, value: TValue): void {
        this.Set(key, value);
    }
    public Set(key: TKey, value: TValue) {
        this.insert(key, value, false);
    }

    public get Keys(): ICollection<TKey> {
        if (this.keys == null) {
            this.keys = new Dictionary.KeyCollection(this);
        }
        return this.keys;
    }

    public get IsReadOnly(): boolean {
        return false;
    }


    public get Values(): ICollection<TValue> {
        if (this.values == null) {
            this.values = new Dictionary.ValueCollection(this);
        }
        return this.values;
    }

    public get IsFixedSize(): boolean {
        return false;
    }
    private _constructor1(): void {
        this._constructor4(0, null as any)
    }
    private _constructor2(capacity: int): void {
        this._constructor4(capacity, null as any)
    }
    private _constructor3(comparer: IEqualityComparer<TKey>): void {
        this._constructor4(0, comparer);
    }
    private _constructor4(capacity: int, comparer: IEqualityComparer<TKey>): void {
        if (capacity < 0) {
            ThrowHelper.ThrowArgumentOutOfRangeException(ExceptionArgument.capacity);
        }
        if (capacity > 0) {
            this.initialize(capacity);
        }
        let _default: any = comparer;
        if (_default == null) {
            _default = EqualityComparer.Default;
        }
        this.comparer = _default;
    }
    private _constructor5(dictionary: IDictionary<TKey, TValue>): void {
        this._constructor6(dictionary, null as any)
    }

    private _constructor6(dictionary: IDictionary<TKey, TValue>, comparer: IEqualityComparer<TKey>): void {
        this._constructor4((dictionary != null ? dictionary.Count : 0), comparer);
        if (dictionary == null) {
            throw new ArgumentNullException(ExceptionArgument.dictionary as any);
        }
        foreach(dictionary, (keyValuePair: KeyValuePair<TKey, TValue>) => {
            this.Add(keyValuePair.Key, keyValuePair.Value);
        });
    }

    public static staticConstructor() {
        ClassInfoInline({
            fullName: System.Types.Collections.Generics.Dictionaries.KeyCollection,
            instanceof: [
                System.Types.Collections.Generics.Dictionaries.KeyCollection,
                System.Types.Collections.ICollection,
                System.Types.Collections.Enumeration.IEnumerable,
            ]
        },
            (Dictionary as any).KeyCollection);
    }
    public constructor();
    public constructor(capacity: int);
    public constructor(comparer: IEqualityComparer<TKey>);
    public constructor(capacity: int, comparer: IEqualityComparer<TKey>);
    public constructor(dictionary: IDictionary<TKey, TValue>);
    public constructor(dictionary: IDictionary<TKey, TValue>, comparer: IEqualityComparer<TKey>);
    public constructor(...args: any[]) {
        if (args.length === 0) {
            this._constructor1();
        } else if (args.length === 1 && is.int(args[0])) {
            const capacity: int = args[0];
            this._constructor2(capacity);
        } else if (args.length === 1 && is.typeof<IEqualityComparer<TKey>>(args[0], System.Types.IEquatable)) {
            const comparer: IEqualityComparer<TKey> = args[0];
            this._constructor3(comparer);
        } else if (args.length === 2 && is.int(args[0]) && is.typeof<IEqualityComparer<TKey>>(args[1], System.Types.IEquatable)) {
            const capacity: int = args[0];
            const comparer: IEqualityComparer<TKey> = args[1];
            this._constructor4(capacity, comparer);
        } else if (args.length === 1 && is.typeof<IDictionary<TKey, TValue>>(args[0], System.Types.Collections.Generics.IDictionary)) {
            const dictionary: IDictionary<TKey, TValue> = args[0];
            this._constructor5(dictionary);
        } else if (args.length === 2 && is.typeof<IDictionary<TKey, TValue>>(args[0], System.Types.Collections.Generics.IDictionary) && is.typeof<IEqualityComparer<TKey>>(args[1], System.Types.IEquatable)) {
            const dictionary: IDictionary<TKey, TValue> = args[0];
            const comparer: IEqualityComparer<TKey> = args[1];
            this._constructor6(dictionary, comparer);
        }

       /*  return new Proxy(this, {
            get: (target, property) => {
                if (!isNaN(property as any)) {
                    const _target: Dictionary<TKey, TValue> = target;
                    if ((_target as any).getInternal) {
                        return (_target as any).getInternal(parseInt(property as any));
                    }

                }
                return target[property];
            },
            set: (target, property, value, receiver) => {
                if (!isNaN(property as any)) {
                    console.log('set çalıştı');
                    const _target: any = target;
                    //if (!isNaN(property as any)) {
                    property = parseInt(property as any);
                    //}
                    if (_target.setInternal) {
                        if ((property as any) < 0 || (property as any) >= _target.getCount()) {
                            _target.addInternal(value);
                        } else {
                            try {
                                _target.setInternal(property, value);
                            } catch (e) {
                                const a = '';
                            }
                        }
                    }
                    return true;
                }
                target[property] = value;
                // you have to return true to accept the changes
                return true;
            }
        }); */
    }

    private addInternal(key: TKey, value: TValue) {
        this.Add(key, value);
    }
    public Add(item: KeyValuePair<TKey, TValue>): void;
    public Add(key: TKey, value: TValue): void;
    public Add(...args: any[]): void {
        if (args.length === 1 && is.typeof<KeyValuePair<TKey, TValue>>(args[0], System.Types.Collections.Generics.KeyValuePair)) {
            const item: KeyValuePair<TKey, TValue> = args[0];
            this.Add(item.Key, item.Value);
        } else if (args.length === 2) {
            const key: TKey = args[0];
            const value: TValue = args[1];
            this.insert(key, value, true);
        }
    }

    public Clear(): void {
        if (this.count > 0) {
            for (let i = 0; i < this.buckets.length; i++) {
                this.buckets[i] = -1;
            }
            TArray.Clear(this.entries, 0, this.count);
            this.freeList = -1;
            this.count = 0;
            this.freeCount = 0;
            this.version++;
        }
    }

    public ContainsKey(key: TKey): boolean {
        return this.findEntry(key) >= 0;
    }

    public ContainsValue(value: TValue): boolean {
        if (value != null) {
            const _default: EqualityComparer<TValue> = EqualityComparer.Default;
            for (let i = 0; i < this.count; i++) {
                if (this.entries[i].hashCode >= 0 && _default.Equals(this.entries[i].value, value)) {
                    return true;
                }
            }
        }
        else {
            for (let j = 0; j < this.count; j++) {
                if (this.entries[j].hashCode >= 0 && this.entries[j].value == null) {
                    return true;
                }
            }
        }
        return false;
    }

    public CopyTo(array: KeyValuePair<TKey, TValue>[], index: int): void {
        if (array == null) {
            throw new ArgumentNullException(ExceptionArgument.array as any);
        }
        if (index < 0 || index > array.length) {
            throw new ArgumentOutOfRangeException(ExceptionArgument.index as any, ExceptionResource.ArgumentOutOfRange_NeedNonNegNum);
        }
        if (array.length - index < this.Count) {
            throw new ArgumentException(ExceptionResource.Arg_ArrayPlusOffTooSmall as any);
        }
        const int32: int = this.count;
        const entryArray: Entry<TKey, TValue>[] = this.entries;
        for (let i = 0; i < int32; i++) {
            if (entryArray[i].hashCode >= 0) {
                const int321: int = index;
                index = int321 + 1;
                array[int321] = new KeyValuePair(entryArray[i].key, entryArray[i].value);
            }
        }
    }

    private findEntry(key: TKey): int {
        if (key == null) {
            throw new ArgumentNullException(ExceptionArgument.key as any);
        }
        if (this.buckets != null) {
            const hashCode: int = this.comparer.GetHashCode(key) & 2147483647;
            for (let i = this.buckets[hashCode % this.buckets.length]; i >= 0; i = this.entries[i].next) {
                if (this.entries[i].hashCode == hashCode && this.comparer.Equals(this.entries[i].key, key)) {
                    return i;
                }
            }
        }
        return -1;
    }

    public GetValueOrDefault(key: TKey): TValue {
        const int32: int = this.findEntry(key);
        if (int32 < 0) {
            return undefined as any; //_default(TValue);
        }
        return this.entries[int32].value;
    }

    private initialize(capacity: int): void {
        const prime: int = HashHelpers.GetPrime(capacity);
        this.buckets = new Array(prime);
        for (let i = 0; i < this.buckets.length; i++) {
            this.buckets[i] = -1;
        }
        this.entries = new Array(prime);
        for (let i = 0; i < prime; i++) {
            this.entries[i] = new Entry();
        }
        this.freeList = -1;
    }

    private insert(key: TKey, value: TValue, add: boolean): void {
        let int32: int;
        if (key == null) {
            throw new ArgumentNullException(ExceptionArgument.key as any);
        }
        if (this.buckets == null) {
            this.initialize(0);
        }
        const hashCode: int = this.comparer.GetHashCode(key) & 2147483647;
        let length: int = hashCode % this.buckets.length;
        let int321: int = 0;
        for (let i = this.buckets[length]; i >= 0; i = this.entries[i].next) {
            if (this.entries[i].hashCode === hashCode && this.comparer.Equals(this.entries[i].key, key)) {
                if (add) {
                    throw new ArgumentException(ExceptionResource.Argument_AddingDuplicate as any);
                }
                this.entries[i].value = value;
                this.version++;
                return;
            }
            int321++;
        }
        if (this.freeCount <= 0) {
            if (this.count === this.entries.length) {
                this.resize();
                length = hashCode % this.buckets.length;
            }
            int32 = this.count;
            this.count++;
        }
        else {
            int32 = this.freeList;
            this.freeList = this.entries[int32].next;
            this.freeCount--;
        }
        this.entries[int32].hashCode = hashCode;
        this.entries[int32].next = this.buckets[length];
        this.entries[int32].key = key;
        this.entries[int32].value = value;
        this.buckets[length] = int32;
        this.version++;
        if (int321 > 100 && HashHelpers.IsWellKnownEqualityComparer(this.comparer)) {
            this.comparer = HashHelpers.GetRandomizedEqualityComparer(this.comparer);
            this.resize(this.entries.length, true);
        }
    }

    private static IsCompatibleKey<TKey>(key: TKey): boolean {
        if (key == null) {
            throw new ArgumentNullException(ExceptionArgument.key as any);
        }
        return true;
    }




    private resize(): void;
    private resize(newSize: int, forceNewHashCodes: boolean): void;
    private resize(...args: any[]): void {
        if (args.length === 0) {
            this.resize(HashHelpers.ExpandPrime(this.count), false);
        } else if (args.length === 2 && is.int(args[0]) && is.boolean(args[1])) {
            const newSize: int = args[0];
            const forceNewHashCodes: boolean = args[1];

            const int32Array: int[] = new Array(newSize);
            for (let i = 0; i < int32Array.length; i++) {
                int32Array[i] = -1;
            }
            const hashCode: Entry<TKey, TValue>[] = new Array(newSize);
            for (let i = 0; i < newSize; i++) {
                hashCode[i] = new Entry();
            }
            TArray.Copy(this.entries, 0, hashCode, 0, this.count);
            if (forceNewHashCodes) {
                for (let j = 0; j < this.count; j++) {
                    if (hashCode[j].hashCode != -1) {
                        hashCode[j].hashCode = this.comparer.GetHashCode(hashCode[j].key) & 2147483647;
                    }
                }
            }
            for (let k = 0; k < this.count; k++) {
                if (hashCode[k].hashCode >= 0) {
                    const int32: int = hashCode[k].hashCode % newSize;
                    hashCode[k].next = int32Array[int32];
                    int32Array[int32] = k;
                }
            }
            this.buckets = int32Array;
            this.entries = hashCode;
        }
    }



    public Contains(keyValuePair: KeyValuePair<TKey, TValue>): boolean {
        const int32: int = this.findEntry(keyValuePair.Key);
        if (int32 >= 0 && EqualityComparer.Default.Equals(this.entries[int32].value, keyValuePair.Value)) {
            return true;
        }
        return false;
    }


    public Remove(keyValuePair: KeyValuePair<TKey, TValue>): boolean;
    public Remove(key: TKey): boolean;
    public Remove(...args: any[]): boolean {
        if (args.length === 1 && is.typeof<KeyValuePair<TKey, TValue>>(args[0], System.Types.Collections.Generics.KeyValuePair)) {
            const keyValuePair: KeyValuePair<TKey, TValue> = args[0];
            const int32: int = this.findEntry(keyValuePair.Key);
            if (int32 < 0 || !EqualityComparer.Default.Equals(this.entries[int32].value, keyValuePair.Value)) {
                return false;
            }
            this.Remove(keyValuePair.Key);
            return true;
        } else if (args.length === 1) {
            const key: TKey = args[0];
            if (key == null) {
                throw new ArgumentNullException(ExceptionArgument.key as any);
            }
            if (this.buckets != null) {
                const hashCode: int = this.comparer.GetHashCode(key) & 2147483647;
                const length: int = hashCode % this.buckets.length;
                let int32: int = -1;
                for (let i = this.buckets[length]; i >= 0; i = this.entries[i].next) {
                    if (this.entries[i].hashCode == hashCode && this.comparer.Equals(this.entries[i].key, key)) {
                        if (int32 >= 0) {
                            this.entries[int32].next = this.entries[i].next;
                        }
                        else {
                            this.buckets[length] = this.entries[i].next;
                        }
                        this.entries[i].hashCode = -1;
                        this.entries[i].next = this.freeList;
                        this.entries[i].key = undefined as any;//_default(TKey);
                        this.entries[i].value = undefined as any; //_default(TValue);
                        this.freeList = i;
                        this.freeCount++;
                        this.version++;
                        return true;
                    }
                    int32 = i;
                }
            }
            return false;
        }
        return false;
    }


    public GetEnumerator(): IEnumerator<KeyValuePair<TKey, TValue>> {
        return new Dictionary.Enumerator<TKey, TValue>(this, 2);
    }


    public TryGetValue(key: TKey, value: Out<TValue>): boolean {
        const int32: int = this.findEntry(key);
        if (int32 < 0) {
            value.value = undefined as any;// _default(TValue);
            return false;
        }
        value.value = this.entries[int32].value;
        return true;
    }



    private static Enumerator = class Enumerator<TKey, TValue> implements IEnumerator<KeyValuePair<TKey, TValue>>, IDisposable, IDictionaryEnumerator<TKey, TValue>
    {
        CanMoveNext?: boolean | undefined;
        TryMoveNext(out: (value: KeyValuePair<TKey, TValue>) => void): boolean {
            throw new Error("Method not implemented.");
        }
        End(): void {
            throw new Error("Method not implemented.");
        }
        NextValue(value?: any): KeyValuePair<TKey, TValue> | undefined {
            throw new Error("Method not implemented.");
        }
        IsEndless?: boolean | undefined;
        Next(value?: any): import("../enumeration_").IIteratorResult<KeyValuePair<TKey, TValue>> {
            throw new Error("Method not implemented.");
        }
        private dictionary: Dictionary<TKey, TValue> = undefined as any;
        private version: int = 0;
        private index: int = 0;
        private current: KeyValuePair<TKey, TValue> = undefined as any;
        private getEnumeratorRetType: int = 0;
        public static readonly DictEntry: int = 1;
        public static readonly KeyValuePair: int = 2;

        public get Current(): KeyValuePair<TKey, TValue> {
            return this.current;
        }

        public get Entry(): DictionaryEntry<TKey, TValue> {
            if (this.index === 0 || this.index === this.dictionary.count + 1) {
                ThrowHelper.ThrowInvalidOperationException(ExceptionResource.InvalidOperation_EnumOpCantHappen);
            }
            return new DictionaryEntry(this.current.Key, this.current.Value);
        }

        public get Key(): TKey {
            if (this.index === 0 || this.index === this.dictionary.count + 1) {
                ThrowHelper.ThrowInvalidOperationException(ExceptionResource.InvalidOperation_EnumOpCantHappen);
            }
            return this.current.Key;
        }

        public get Value(): TValue {
            if (this.index === 0 || this.index === this.dictionary.count + 1) {
                ThrowHelper.ThrowInvalidOperationException(ExceptionResource.InvalidOperation_EnumOpCantHappen);
            }
            return this.current.Value;
        }



        public constructor(dictionary: Dictionary<TKey, TValue>, getEnumeratorRetType: int) {
            this.dictionary = dictionary;
            this.version = dictionary.version;
            this.index = 0;
            this.getEnumeratorRetType = getEnumeratorRetType;
            this.current = new KeyValuePair<TKey, TValue>();
        }

        public Dispose(): void {
        }

        public MoveNext(): boolean {
            if (this.version !== this.dictionary.version) {
                ThrowHelper.ThrowInvalidOperationException(ExceptionResource.InvalidOperation_EnumFailedVersion);
            }
            while (this.index < this.dictionary.count) {
                if (this.dictionary.entries[this.index].hashCode >= 0) {
                    this.current = new KeyValuePair<TKey, TValue>(this.dictionary.entries[this.index].key, this.dictionary.entries[this.index].value);
                    this.index++;
                    return true;
                }
                this.index++;
            }
            this.index = this.dictionary.count + 1;
            this.current = new KeyValuePair<TKey, TValue>();
            return false;
        }

        public Reset(): void {
            if (this.version != this.dictionary.version) {
                ThrowHelper.ThrowInvalidOperationException(ExceptionResource.InvalidOperation_EnumFailedVersion);
            }
            this.index = 0;
            this.current = new KeyValuePair<TKey, TValue>();
        }
    }

    private static KeyCollection = class KeyCollection<TKey, TValue> implements ICollection<TKey>, IEnumerable<TKey>, IReadOnlyCollection<TKey>
    {
        private dictionary: Dictionary<TKey, TValue> = undefined as any;

        public get Count(): int {
            return this.dictionary.Count;
        }

        public get IsReadOnly(): boolean {
            return true;
        }

        public constructor(dictionary: Dictionary<TKey, TValue>) {
            if (dictionary == null) {
                ThrowHelper.ThrowArgumentNullException(ExceptionArgument.dictionary);
            }
            this.dictionary = dictionary;
        }


        public CopyTo(array: TKey[], index: int): void {
            if (array == null) {
                ThrowHelper.ThrowArgumentNullException(ExceptionArgument.array);
            }
            if (index < 0 || index > array.length) {
                ThrowHelper.ThrowArgumentOutOfRangeException(ExceptionArgument.index, ExceptionResource.ArgumentOutOfRange_NeedNonNegNum);
            }
            if (array.length - index < this.dictionary.Count) {
                ThrowHelper.ThrowArgumentException(ExceptionResource.Arg_ArrayPlusOffTooSmall);
            }
            const int32: int = this.dictionary.count;
            const entryArray = this.dictionary.entries;
            for (let i = 0; i < int32; i++) {
                if (entryArray[i].hashCode >= 0) {
                    const int321: int = index;
                    index = int321 + 1;
                    array[int321] = entryArray[i].key;
                }
            }
        }

        public GetEnumerator(): IEnumerator<TKey> {
            return new Dictionary.KeyCollection.Enumerator<TKey, TValue>(this.dictionary);
        }

        public Add(item: TKey): void {
            ThrowHelper.ThrowNotSupportedException(ExceptionResource.NotSupported_KeyCollectionSet);
        }

        public Clear(): void {
            ThrowHelper.ThrowNotSupportedException(ExceptionResource.NotSupported_KeyCollectionSet);
        }

        public Contains(item: TKey): boolean {
            return this.dictionary.ContainsKey(item);
        }

        public Remove(item: TKey): boolean {
            ThrowHelper.ThrowNotSupportedException(ExceptionResource.NotSupported_KeyCollectionSet);
            return false;
        }

        private static Enumerator = class Enumerator<TKey, TValue> implements IEnumerator<TKey>, IDisposable {
            CanMoveNext?: boolean | undefined;
            TryMoveNext(out: (value: TKey) => void): boolean {
                throw new Error("Method not implemented.");
            }
            End(): void {
                throw new Error("Method not implemented.");
            }
            NextValue(value?: any): TKey | undefined {
                throw new Error("Method not implemented.");
            }
            IsEndless?: boolean | undefined;
            Next(value?: any): import("../enumeration_").IIteratorResult<TKey> {
                throw new Error("Method not implemented.");
            }
            private dictionary: Dictionary<TKey, TValue> = undefined as any;
            private index: int = 0;
            private version: int = 0;
            private currentKey: TKey = undefined as any;

            public get Current(): TKey {
                return this.currentKey;
            }


            public constructor(dictionary: Dictionary<TKey, TValue>) {
                this.dictionary = dictionary;
                this.version = dictionary.version;
                this.index = 0;
                this.currentKey = undefined as any; //_default(TKey);
            }

            public Dispose(): void {
            }

            public MoveNext(): boolean {
                if (this.version !== this.dictionary.version) {
                    ThrowHelper.ThrowInvalidOperationException(ExceptionResource.InvalidOperation_EnumFailedVersion);
                }
                while (this.index < this.dictionary.count) {
                    if (this.dictionary.entries[this.index].hashCode >= 0) {
                        this.currentKey = this.dictionary.entries[this.index].key;
                        this.index++;
                        return true;
                    }
                    this.index++;
                }
                this.index = this.dictionary.count + 1;
                this.currentKey = undefined as any; //_default(TKey);
                return false;
            }

            public Reset(): void {
                if (this.version != this.dictionary.version) {
                    ThrowHelper.ThrowInvalidOperationException(ExceptionResource.InvalidOperation_EnumFailedVersion);
                }
                this.index = 0;
                this.currentKey = undefined as any; //_default(TKey);
            }
        }
    }

    private static ValueCollection = class ValueCollection<TKey, TValue> implements ICollection<TValue>, IEnumerable<TValue>, IReadOnlyCollection<TValue>
    {
        private dictionary: Dictionary<TKey, TValue> = undefined as any;

        public get Count(): int {
            return this.dictionary.Count;
        }

        public get IsReadOnly(): boolean {
            return true;
        }

        public constructor(dictionary: Dictionary<TKey, TValue>) {
            if (dictionary == null) {
                ThrowHelper.ThrowArgumentNullException(ExceptionArgument.dictionary);
            }
            this.dictionary = dictionary;
        }


        public CopyTo(array: TValue[], index: int): void {
            if (array == null) {
                ThrowHelper.ThrowArgumentNullException(ExceptionArgument.array);
            }
            if (index < 0 || index > array.length) {
                ThrowHelper.ThrowArgumentOutOfRangeException(ExceptionArgument.index, ExceptionResource.ArgumentOutOfRange_NeedNonNegNum);
            }
            if (array.length - index < this.dictionary.Count) {
                ThrowHelper.ThrowArgumentException(ExceptionResource.Arg_ArrayPlusOffTooSmall);
            }
            const int32: int = this.dictionary.count;
            const entryArray: Entry<TKey, TValue>[] = this.dictionary.entries;
            for (let i = 0; i < int32; i++) {
                if (entryArray[i].hashCode >= 0) {
                    const int321: int = index;
                    index = int321 + 1;
                    array[int321] = entryArray[i].value;
                }
            }
        }

        public GetEnumerator(): IEnumerator<TValue> {
            return new Dictionary.ValueCollection.Enumerator<TValue>(this.dictionary);
        }

        public Add(item: TValue): void {
            ThrowHelper.ThrowNotSupportedException(ExceptionResource.NotSupported_ValueCollectionSet);
        }

        public Clear(): void {
            ThrowHelper.ThrowNotSupportedException(ExceptionResource.NotSupported_ValueCollectionSet);
        }

        public Contains(item: TValue): boolean {
            return this.dictionary.ContainsValue(item);
        }

        public Remove(item: TValue): boolean {
            ThrowHelper.ThrowNotSupportedException(ExceptionResource.NotSupported_ValueCollectionSet);
            return false;
        }

        private static Enumerator = class Enumerator<TValue> implements IEnumerator<TValue>, IDisposable {
            CanMoveNext?: boolean | undefined;
            TryMoveNext(out: (value: TValue) => void): boolean {
                throw new Error("Method not implemented.");
            }
            End(): void {
                throw new Error("Method not implemented.");
            }
            NextValue(value?: any): TValue | undefined {
                throw new Error("Method not implemented.");
            }
            IsEndless?: boolean | undefined;
            Next(value?: any): import("../enumeration_").IIteratorResult<TValue> {
                throw new Error("Method not implemented.");
            }
            private dictionary: Dictionary<any, TValue> = undefined as any;
            private index: int = 0;
            private version: int = 0;
            private currentValue: TValue = undefined as any;
            public get Current(): TValue {
                return this.currentValue;
            }

            public constructor(dictionary: Dictionary<any, TValue>) {
                this.dictionary = dictionary;
                this.version = dictionary.version;
                this.index = 0;
                this.currentValue = undefined as any; //_default(TValue);
            }

            public Dispose(): void {
            }

            public MoveNext(): boolean {
                if (this.version !== this.dictionary.version) {
                    ThrowHelper.ThrowInvalidOperationException(ExceptionResource.InvalidOperation_EnumFailedVersion);
                }
                while (this.index < this.dictionary.count) {
                    if (this.dictionary.entries[this.index].hashCode >= 0) {
                        this.currentValue = this.dictionary.entries[this.index].value;
                        this.index++;
                        return true;
                    }
                    this.index++;
                }
                this.index = this.dictionary.count + 1;
                this.currentValue = undefined as any; //_default(TValue);
                return false;
            }

            public Reset(): void {
                if (this.version != this.dictionary.version) {
                    ThrowHelper.ThrowInvalidOperationException(ExceptionResource.InvalidOperation_EnumFailedVersion);
                }
                this.index = 0;
                this.currentValue = undefined as any; //_default(TValue);
            }
        }
    }
}

Dictionary.staticConstructor();