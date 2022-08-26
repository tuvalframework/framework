import { CompatibleComparer } from "./CompatibleComparer";
import { IEqualityComparer } from "./IEqualityComparer";
import { Out, newOutEmpty } from "../Out";
import { is } from "../is";
import { double, int, float } from "../float";
import { HashHelpers } from "./HashHelpers";
import { System } from "../SystemTypes";
import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { IEnumerable } from "./enumeration_/IEnumerable";
import { ArgumentException } from "../Exceptions/ArgumentException";
import { Environment } from "../Environment";
import { IHashCodeProvider } from "./IHashCodeProvider";
import { ArgumentOutOfRangeException } from "../Exceptions/ArgumentOutOfRangeException";
import { IDictionary } from "./Generic/IDictionary";
import { ICollection } from "./Generic/ICollection";
import { DictionaryEntry } from "./DictionaryEntry";
import { IDictionaryEnumerator } from "./dictionaries_/IDictionaryEnumerator";
import { InvalidOperationException } from "../Exceptions/InvalidOperationException";
import { NotImplementedException } from "../Exceptions";
import { IEnumerator } from "./enumeration_/IEnumerator";
import { IEquatable } from "../IEquatable";
import { IIteratorResult } from "./enumeration_/IIterator";
import { RandomizedObjectEqualityComparer } from "./Generic/RandomizedObjectEqualityComparer";
import { ClassInfoInline, ClassInfo, Virtual } from "../Reflection/Decorators/ClassInfo";
import { KeyValuePair } from "./Generic/KeyValuePair";
import { TString } from "../Extensions";
import { Dictionary } from "./Generic/Dictionary";
import { foreach } from "../foreach";
import { IComparer } from "./IComparer";

class bucket<TKey, TValue> {
    public key: TKey = undefined as any;
    public val: TValue = undefined as any;
    public hash_coll: int = 0;
}

@ClassInfo({
    fullName: System.Types.Collections.Hashtable.KeyCollection,
    instanceof: [
        System.Types.Collections.Hashtable.Hashtable,
        System.Types.Collections.ICollection,
        System.Types.Collections.Enumeration.IEnumerable,
        System.Types.Disposable.IDisposable
    ]
})
export class Hashtable<TKey = string, TValue = any> implements IDictionary<TKey, TValue>
{
    public static readonly HashPrime: int = 101;
    private static readonly InitialSize: int = 3;
    private static readonly LoadFactorName: string = "LoadFactor";
    private static readonly VersionName: string = "Version";
    private static readonly ComparerName: string = "Comparer";
    private static readonly HashCodeProviderName: string = "HashCodeProvider";
    private static readonly HashSizeName: string = "HashSize";
    private static readonly KeysName: string = "Keys";
    private static readonly ValuesName: string = "Values";
    private static readonly KeyComparerName: string = "KeyComparer";
    private buckets: bucket<TKey, TValue>[] = undefined as any;
    private count: int = 0;
    private occupancy: int = 0;
    private loadsize: int = 0;
    private loadFactor: float = 0;
    private version: int = 0;
    private isWriterInProgress: boolean = false;
    private keys: ICollection<TKey> = undefined as any;
    private values: ICollection<TValue> = undefined as any;
    private _keycomparer: IEqualityComparer<TKey> = undefined as any;

    protected get comparer(): IComparer<TKey> {
        if (is.typeof<CompatibleComparer<TKey>>(this._keycomparer, System.Types.Collections.CompatibleComparer)) {
            return this._keycomparer.Comparer;
        }
        if (this._keycomparer != null) {
            throw new ArgumentException(Environment.GetResourceString("Arg_CannotMixComparisonInfrastructure"));
        }
        return null as any;
    }
    protected set comparer(value: IComparer<TKey>) {
        if (is.typeof<CompatibleComparer<TKey>>(this._keycomparer, System.Types.Collections.CompatibleComparer)) {

            const compatibleComparer: CompatibleComparer<TKey> = this._keycomparer;
            this._keycomparer = new CompatibleComparer(value, compatibleComparer.HashCodeProvider);
            return;
        }
        if (this._keycomparer != null) {
            throw new ArgumentException(Environment.GetResourceString("Arg_CannotMixComparisonInfrastructure"));
        }
        this._keycomparer = new CompatibleComparer(value, null as any);
    }


    public get Count(): int {
        return this.count;
    }

    protected get EqualityComparer(): IEqualityComparer<TKey> {
        return this._keycomparer;
    }

    protected get hcp(): IHashCodeProvider {
        if (is.typeof<CompatibleComparer<TKey>>(this._keycomparer, System.Types.Collections.CompatibleComparer)) {
            return this._keycomparer.HashCodeProvider;
        }
        if (this._keycomparer != null) {
            throw new ArgumentException(Environment.GetResourceString("Arg_CannotMixComparisonInfrastructure"));
        }
        return null as any;
    }
    protected set hcp(value: IHashCodeProvider) {
        if (is.typeof<CompatibleComparer<TKey>>(this._keycomparer, System.Types.Collections.CompatibleComparer)) {
            const compatibleComparer: CompatibleComparer<TKey> = this._keycomparer;
            this._keycomparer = new CompatibleComparer(compatibleComparer.Comparer, value);
            return;
        }
        if (this._keycomparer != null) {
            throw new ArgumentException(Environment.GetResourceString("Arg_CannotMixComparisonInfrastructure"));
        }
        this._keycomparer = new CompatibleComparer(null as any, value);
    }

    public get IsFixedSize(): boolean {
        return false;
    }

    public get IsReadOnly(): boolean {
        return false;
    }

    public /* virtual */ Get(key: TKey): TValue {
        let uInt32: Out<int> = newOutEmpty();
        let uInt321: Out<int> = newOutEmpty();
        let _bucket: bucket<TKey, TValue>;
        let int32: int;
        let int321: int;
        if (key == null) {
            throw new ArgumentNullException("key", Environment.GetResourceString("ArgumentNull_Key"));
        }
        const bucketArray: bucket<TKey, TValue>[] = this.buckets;
        const uInt322: int = this.initHash(key, bucketArray.length, uInt32, uInt321);
        let int322: int = 0;
        let length: int = uInt32.value % bucketArray.length;
        do {
            let int323: int = 0;
            do {
                int32 = this.version;
                _bucket = bucketArray[length];
                let int324: int = int323 + 1;
                int323 = int324;
                if (int324 % 8 != 0) {
                    continue;
                }
                //Thread.Sleep(1);
            }
            while (this.isWriterInProgress || int32 !== this.version);
            if (_bucket.key == null) {
                return null as any;
            }
            if ((_bucket.hash_coll & 2147483647) == uInt322 && this.keyEquals(_bucket.key, key)) {
                return _bucket.val;
            }
            length = ((length + uInt321.value) % (bucketArray.length));
            if (_bucket.hash_coll >= 0) {
                break;
            }
            int321 = int322 + 1;
            int322 = int321;
        }
        while (int321 < bucketArray.length);
        return null as any;
    }
    public Set(key: TKey, value: TValue) {
        this.insert(key, value, false);
    }

    public /* virtual */ get Keys(): ICollection<TKey> {
        if (this.keys == null) {
            this.keys = new Hashtable.KeyCollection(this);
        }
        return this.keys;
    }


    public get Values(): ICollection<TValue> {
        if (this.values == null) {
            this.values = new Hashtable.ValueCollection(this);
        }
        return this.values;
    }

    public _constructor(capacity: int, loadFactor: float) {
        if (capacity < 0) {
            throw new ArgumentOutOfRangeException("capacity", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
        }
        if (loadFactor < 0.1 || loadFactor > 1) {
            throw new ArgumentOutOfRangeException("loadFactor", Environment.GetResourceString("ArgumentOutOfRange_HashtableLoadFactor"));
        }
        this.loadFactor = 0.72 * loadFactor;
        const num: int = (capacity / this.loadFactor);
        if (num > 2147483647) {
            throw new ArgumentException(Environment.GetResourceString("Arg_HTCapacityOverflow"));
        }
        const int32: int = (num > 3 ? HashHelpers.GetPrime(num) : 3);
        this.buckets = new Array(int32);
        for (let i = 0; i < int32; i++) {
            this.buckets[i] = new bucket();
        }
        this.loadsize = (this.loadFactor * int32);
        this.isWriterInProgress = false;
    }

    public static staticConstructor() {
        ClassInfoInline({
            fullName: System.Types.Collections.Hashtable.KeyCollection,
            instanceof: [
                System.Types.Collections.Hashtable.KeyCollection,
                System.Types.Collections.ICollection,
                System.Types.Collections.Enumeration.IEnumerable,
            ]
        },
            (Hashtable as any).KeyCollection);
    }
    public constructor();
    public constructor(trash: boolean);
    public constructor(array: Array<any>);
    public constructor(dictionary: Dictionary<any, any>);
    public constructor(capacity: int);
    public constructor(capacity: int, loadFactor: float);
    public constructor(capacity: int, loadFactor: float, hcp: IHashCodeProvider, comparer: IComparer<TKey>);
    public constructor(capacity: int, loadFactor: float, equalityComparer: IEqualityComparer<TKey>);
    public constructor(hcp: IHashCodeProvider, comparer: IComparer<TKey>);
    public constructor(equalityComparer: IEqualityComparer<TKey>);
    public constructor(capacity: int, equalityComparer: IEqualityComparer<TKey>);

    public constructor(...args: any[]) {
        if (args.length === 0) {
            this._constructor(0, 1);
        } else if (args.length === 1 && is.boolean(args[0])) {

        } else if (args.length === 1 && is.array(args[0])) {
            this._constructor(0, 1);
            args[0].forEach((de) => {
                if (is.array(de)) {
                    if (de.length === 1) { //no value only key
                        this.Add(de[0], null as any);
                    } else if (de.length > 1) {
                        this.Add(de[0], de[1]);
                    }
                }
            });
        } else if (args.length === 1 && is.typeof<Dictionary<any, any>>(args[0], System.Types.Collections.Generics.Dictionaries.Dictionary)) {
            this._constructor(0, 1);
            const dic: Dictionary<any, any> = args[0];
            foreach(dic.Keys, (key: any) => {
                this.Add(key, dic.Get(key));
            });
        } else if (args.length === 1 && is.int(args[0])) {
            const capacity: int = args[0];
            this._constructor(capacity, 1);
        } else if (args.length === 2 && is.int(args[0]) && is.int(args[1])) {
            const capacity: int = args[0];
            const loadFactor: float = args[1];
            this._constructor(capacity, loadFactor);
        } else if (args.length === 4) {
            const capacity: int = args[0];
            const loadFactor: float = args[1];
            const hcp: IHashCodeProvider = args[2];
            const comparer: IComparer<TKey> = args[3];
            this._constructor(capacity, loadFactor);
            if (hcp == null && comparer == null) {
                this._keycomparer = null as any;
                return;
            }
            this._keycomparer = new CompatibleComparer(comparer, hcp);
        } else if (args.length === 3) {
            const capacity: int = args[0];
            const loadFactor: float = args[1];
            const equalityComparer: IEqualityComparer<TKey> = args[2];
            this._constructor(capacity, loadFactor);
            this._keycomparer = equalityComparer;
        } else if (args.length === 2 && is.typeof<IHashCodeProvider>(args[0], System.Types.Collections.IHashCodeProvider) && is.typeof<IComparer<TKey>>(args[1], System.Types.IComparer)) {
            const hcp: IHashCodeProvider = args[0];
            const comparer: IComparer<TKey> = args[1];
            //this._constructor(0, 1, hcp, comparer);
        } else if (args.length === 1 && is.typeof<IEqualityComparer<TKey>>(args[0], System.Types.IEqualityComparer)) {
            const equalityComparer: IEqualityComparer<TKey> = args[0];
            //this._constructor(0, 1, equalityComparer);
        }


    }

    public /* virtual */  Add(item: KeyValuePair<TKey, TValue>): void;
    public /* virtual */  Add(key: TKey, value: TValue): void;
    public /* virtual */  Add(...args: any[]): void {
        if (args.length === 2) {
            const key: TKey = args[0];
            const value: TValue = args[1];
            this.insert(key, value, true);
        }

    }


    public /* virtual */  Clear(): number {
        if (this.count === 0 && this.occupancy === 0) {
            return 0;
        }

        this.isWriterInProgress = true;
        for (let i = 0; i < this.buckets.length; i++) {
            this.buckets[i].hash_coll = 0;
            this.buckets[i].key = null as any;
            this.buckets[i].val = null as any;
        }
        this.count = 0;
        this.occupancy = 0;
        this.updateVersion();
        this.isWriterInProgress = false;
        return 0;
    }


    public /* virtual */ Clone(): Hashtable<TKey, TValue> {
        const bucketArray: bucket<TKey, TValue>[] = this.buckets;
        const hashtables: Hashtable<TKey, TValue> = new Hashtable(this.count, this._keycomparer);
        hashtables.version = this.version;
        hashtables.loadFactor = this.loadFactor;
        hashtables.count = 0;
        let length: int = bucketArray.length;
        while (length > 0) {
            length--;
            const obj: TKey = bucketArray[length].key;
            if (obj == null || obj === bucketArray as any) {
                continue;
            }
            hashtables.Set(obj, bucketArray[length].val);
        }
        return hashtables;
    }

    public /* virtual */  Contains(item: KeyValuePair<TKey, TValue>): boolean
    public /* virtual */  Contains(key: TKey): boolean;
    public /* virtual */  Contains(...args: any[]): boolean {
        if (args.length === 1 && !is.typeof<DictionaryEntry<TKey, TValue>>(args[0], System.Types.Collections.Generics.DictionaryEntry)) {
            const key: TKey = args[0];
            return this.ContainsKey(key);
        }
        return false;
    }

    public /* virtual */  ContainsKey(key: TKey): boolean {
        let uInt32: Out<int> = newOutEmpty();
        let uInt321: Out<int> = newOutEmpty();
        let int32: int;
        if (key == null) {
            throw new ArgumentNullException("key", Environment.GetResourceString("ArgumentNull_Key"));
        }
        const bucketArray: bucket<TKey, TValue>[] = this.buckets;
        const uInt322: int = this.initHash(key, bucketArray.length, uInt32, uInt321);
        let int321: int = 0;
        let length: int = (uInt32.value % bucketArray.length);
        do {
            const _bucket: bucket<TKey, TValue> = bucketArray[length];
            if (_bucket.key == null) {
                return false;
            }
            if ((_bucket.hash_coll & 2147483647) == uInt322 && this.keyEquals(_bucket.key, key)) {
                return true;
            }
            length = ((length + uInt321.value) % (bucketArray.length));
            if (_bucket.hash_coll >= 0) {
                break;
            }
            int32 = int321 + 1;
            int321 = int32;
        }
        while (int32 < bucketArray.length);
        return false;
    }

    public /* virtual */  ContainsValue(value: TValue): boolean {
        let obj: TValue;
        if (value != null) {
            let length: int = this.buckets.length;
            do {
                let int32: int = length - 1;
                length = int32;
                if (int32 < 0) {
                    return false;
                }
                obj = this.buckets[length].val;
            }
            while (obj == null || !(obj as any).equals(value));
            return true;
        }
        else {
            let length1: int = this.buckets.length;
            do {
                const int321: int = length1 - 1;
                length1 = int321;
                if (int321 >= 0) {
                    continue;
                }
                return false;
            }
            while (this.buckets[length1].key == null || this.buckets[length1].key === (this.buckets as any) || this.buckets[length1].val != null);
            return true;
        }
        return false;
    }

    private CopyEntries(array: Array<KeyValuePair<TKey, TValue>>, arrayIndex: int): Array<KeyValuePair<TKey, TValue>> {
        const bucketArray: bucket<TKey, TValue>[] = this.buckets;
        let length: int = bucketArray.length;
        while (true) {
            const int32: int = length - 1;
            length = int32;
            if (int32 < 0) {
                break;
            }
            const obj: TKey = bucketArray[length].key;
            if (obj != null && obj !== this.buckets as any) {
                const dictionaryEntry: KeyValuePair<TKey, TValue> = new KeyValuePair(obj, bucketArray[length].val);
                const int321: int = arrayIndex;
                arrayIndex = int321 + 1;
                array[int321] = dictionaryEntry;
            }
        }
        return array;
    }

    private CopyKeys(array: Array<TKey>, arrayIndex: int): Array<TKey> {
        const bucketArray: bucket<TKey, TValue>[] = this.buckets;
        let length: int = bucketArray.length;
        while (true) {
            const int32: int = length - 1;
            length = int32;
            if (int32 < 0) {
                break;
            }
            const obj: TKey = bucketArray[length].key;
            if (obj != null && obj !== this.buckets as any) {
                const int321: int = arrayIndex;
                arrayIndex = int321 + 1;
                array[int321] = obj;
            }
        }
        return array;
    }

    public /* virtual */  CopyTo(array: Array<KeyValuePair<TKey, TValue>>, arrayIndex: int): Array<KeyValuePair<TKey, TValue>> {
        if (array == null) {
            throw new ArgumentNullException("array", Environment.GetResourceString("ArgumentNull_Array"));
        }

        if (arrayIndex < 0) {
            throw new ArgumentOutOfRangeException("arrayIndex", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
        }
        if (array.length - arrayIndex < this.Count) {
            throw new ArgumentException(Environment.GetResourceString("Arg_ArrayPlusOffTooSmall"));
        }
        return this.CopyEntries(array, arrayIndex);
    }

    private CopyValues(array: Array<TValue>, arrayIndex: int): Array<TValue> {
        const bucketArray: bucket<TKey, TValue>[] = this.buckets;
        let length: int = bucketArray.length;
        while (true) {
            const int32: int = length - 1;
            length = int32;
            if (int32 < 0) {
                break;
            }
            const obj: TKey = bucketArray[length].key;
            if (obj != null && obj !== this.buckets as any) {
                const int321: int = arrayIndex;
                arrayIndex = int321 + 1;
                array[int321] = bucketArray[length].val;
            }
        }
        return array;
    }

    private expand(): void {
        const int32: int = HashHelpers.ExpandPrime(this.buckets.length);
        this.rehash(int32, false);
    }

    public /* virtual */  GetEnumerator(): IEnumerator<KeyValuePair<TKey, TValue>> {
        return new Hashtable.HashtableEnumerator(this, 3);
    }

    /**
     * Eklenen key için bir hash code oluşturur.
     * @param key
     */
    @Virtual
    protected GetHash(key: TKey): int {
        if (this._keycomparer == null) {
            if (typeof key === 'string') {
                return key.hashCode();
            } if (typeof key === 'number') {
                return key;
            } else if (is.function((key as any).GetHashCode)) {
                return (key as any).GetHashCode();
            } else {
                TString.GetHashCode((key as any).toString());
            }
        }
        return this._keycomparer.GetHashCode(key);
    }


    private initHash(key: TKey, hashsize: int, seed: Out<int>, incr: Out<int>): int {
        const hash: int = (this.GetHash(key) & 2147483647);
        seed.value = hash;
        incr.value = 1 + seed.value * 101 % (hashsize - 1);
        return hash;
    }

    private insert(key: TKey, nvalue: TValue, add: boolean): void {
        const uInt32: Out<int> = newOutEmpty();
        const uInt321: Out<int> = newOutEmpty();
        let int32: int;
        if (key == null) {
            throw new ArgumentNullException("key", Environment.GetResourceString("ArgumentNull_Key"));
        }
        if (this.count >= this.loadsize) {
            this.expand();
        }
        else if (this.occupancy > this.loadsize && this.count > 100) {
            this.rehash();
        }
        const uInt322: int = this.initHash(key, this.buckets.length, uInt32, uInt321);
        let int321: int = 0;
        let int322: int = -1;
        let length: int = (uInt32.value % this.buckets.length);
        do {
            if (int322 == -1 && this.buckets[length].key === (this.buckets as any) && this.buckets[length].hash_coll < 0) {
                int322 = length;
            }
            if (this.buckets[length].key == null || this.buckets[length].key === (this.buckets as any) && (this.buckets[length].hash_coll & - 2147483648) === 0) {
                if (int322 != -1) {
                    length = int322;
                }
                this.isWriterInProgress = true;
                this.buckets[length].val = nvalue;
                this.buckets[length].key = key;
                this.buckets[length].hash_coll |= uInt322;
                this.count++;
                this.updateVersion();
                this.isWriterInProgress = false;
                if (int321 > 100 && HashHelpers.IsWellKnownEqualityComparer(this._keycomparer) && (this._keycomparer == null || !(is.typeof<RandomizedObjectEqualityComparer<TKey>>(this._keycomparer, System.Types.Collections.Generics.RandomizedObjectEqualityComparer)))) {
                    this._keycomparer = HashHelpers.GetRandomizedEqualityComparer(this._keycomparer);
                    this.rehash(this.buckets.length, true);
                }
                return;
            }
            if ((this.buckets[length].hash_coll & 2147483647) === uInt322 && this.keyEquals(this.buckets[length].key, key)) {
                if (add) {
                    throw new ArgumentException(Environment.GetResourceString("Argument_AddingDuplicate__"));
                }
                this.isWriterInProgress = true;
                this.buckets[length].val = nvalue;
                this.updateVersion();
                this.isWriterInProgress = false;
                if (int321 > 100 && HashHelpers.IsWellKnownEqualityComparer(this._keycomparer) && (this._keycomparer == null || !(is.typeof<RandomizedObjectEqualityComparer<TKey>>(this._keycomparer, System.Types.Collections.Generics.RandomizedObjectEqualityComparer)))) {
                    this._keycomparer = HashHelpers.GetRandomizedEqualityComparer(this._keycomparer);
                    this.rehash(this.buckets.length, true);
                }
                return;
            }
            if (int322 == -1 && this.buckets[length].hash_coll >= 0) {
                this.buckets[length].hash_coll |= -2147483648;
                this.occupancy++;
            }
            length = ((length + uInt321.value) % (this.buckets.length));
            int32 = int321 + 1;
            int321 = int32;
        }
        while (int32 < this.buckets.length);
        if (int322 === -1) {
            throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_HashInsertFailed"));
        }
        this.isWriterInProgress = true;
        this.buckets[int322].val = nvalue;
        this.buckets[int322].key = key;
        this.buckets[int322].hash_coll |= uInt322;
        this.count++;
        this.updateVersion();
        this.isWriterInProgress = false;
        if (this.buckets.length > 100 && HashHelpers.IsWellKnownEqualityComparer(this._keycomparer) &&
            (this._keycomparer == null || !(is.typeof<RandomizedObjectEqualityComparer<TKey>>(this._keycomparer, System.Types.Collections.Generics.RandomizedObjectEqualityComparer)))) {
            this._keycomparer = HashHelpers.GetRandomizedEqualityComparer(this._keycomparer);
            this.rehash(this.buckets.length, true);
        }
    }


    protected /* virtual */  keyEquals(item: TKey, key: TKey): boolean {
        if (this.buckets === item as any) {
            return false;
        }
        if (item === key) {
            return true;
        }
        if (this._keycomparer != null) {
            return this._keycomparer.Equals(item, key);
        }
        if (item == null) {
            return false;
        }
        if (is.typeof<IEquatable<TKey>>(item, System.Types.IEquatable)) {
            return (item as any).equals(key);
        }
        return false;
    }



    private putEntry(newBuckets: bucket<TKey, TValue>[], key: TKey, nvalue: TValue, hashcode: int): void {
        let i: int;
        const uInt32: int = hashcode;
        const length: int = 1 + uInt32 * 101 % (newBuckets.length - 1);
        for (i = (uInt32 % newBuckets.length); newBuckets[i].key != null && newBuckets[i].key != this.buckets as any; i = ((i + length) % (newBuckets.length))) {
            if (newBuckets[i].hash_coll >= 0) {
                newBuckets[i].hash_coll |= -2147483648;
                this.occupancy++;
            }
        }
        newBuckets[i].val = nvalue;
        newBuckets[i].key = key;
        newBuckets[i].hash_coll |= hashcode;
    }

    private rehash(): void;
    private rehash(newsize: int, forceNewHashCode: boolean): void;
    private rehash(...args: any[]): void {
        if (args.length === 1) {
            this.rehash(this.buckets.length, false);
        } else if (args.length === 2 && is.int(args[0]) && is.boolean(args[1])) {
            const newsize: int = args[0];
            const forceNewHashCode: boolean = args[1];

            this.occupancy = 0;
            const bucketArray: bucket<TKey, TValue>[] = new Array(newsize);
            for (let i = 0; i < newsize; i++) {
                bucketArray[i] = new bucket();
            }
            for (let i = 0; i < this.buckets.length; i++) {
                const _bucket = this.buckets[i];
                if (_bucket.key != null && _bucket.key != this.buckets as any) {
                    const int32: int = (forceNewHashCode ? this.GetHash(_bucket.key) : _bucket.hash_coll) & 2147483647;
                    this.putEntry(bucketArray, _bucket.key, _bucket.val, int32);
                }
            }
            this.isWriterInProgress = true;
            this.buckets = bucketArray;
            this.loadsize = (this.loadFactor * newsize);
            this.updateVersion();
            this.isWriterInProgress = false;
        }
    }


    public /* virtual */  Remove(key: KeyValuePair<TKey, TValue>): boolean;
    public /* virtual */  Remove(key: TKey): boolean;
    public Remove(...args: any[]): boolean {
        if (args.length === 1) {
            const key: TKey = args[0];
            const uInt32: Out<int> = newOutEmpty();
            const uInt321: Out<int> = newOutEmpty();
            let int32: int = 0;
            if (key == null) {
                throw new ArgumentNullException("key", Environment.GetResourceString("ArgumentNull_Key"));
            }
            const uInt322: int = this.initHash(key, this.buckets.length, uInt32, uInt321);
            let int321: int = 0;
            let length: int = uInt32.value % this.buckets.length;
            do {
                const _bucket: bucket<TKey, TValue> = this.buckets[length];
                if ((_bucket.hash_coll & 2147483647) === uInt322 && this.keyEquals(_bucket.key, key)) {
                    this.isWriterInProgress = true;
                    this.buckets[length].hash_coll &= -2147483648;
                    if (this.buckets[length].hash_coll == 0) {
                        this.buckets[length].key = null as any;
                    }
                    else {
                        this.buckets[length].key = this.buckets as any;
                    }
                    this.buckets[length].val = null as any;
                    this.count--;
                    this.updateVersion();
                    this.isWriterInProgress = false;
                    return true;
                }
                length = ((length + uInt321.value) % (this.buckets.length));
                if (_bucket.hash_coll >= 0) {
                    break;
                }
                int32 = int321 + 1;
                int321 = int32;
            }
            while (int32 < this.buckets.length);
        }
        return true;
    }



    private updateVersion(): void {
        this.version++;
    }



    private static HashtableEnumerator = class HashtableEnumerator<TKey, TValue> implements IDictionaryEnumerator<TKey, TValue>
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
        Next(value?: any): IIteratorResult<KeyValuePair<TKey, TValue>> {
            throw new Error("Method not implemented.");
        }
        Dispose(): void {
            throw new Error("Method not implemented.");
        }
        private hashtable: Hashtable<TKey, TValue> = undefined as any;
        private bucket: int = 0;
        private version: int = 0;
        private current: boolean = false;
        private getObjectRetType: int = 0;
        private currentKey: TKey = undefined as any;
        private currentValue: TValue = undefined as any;
        public static readonly Keys: int = 1;
        public static readonly Values: int = 2;
        public static readonly DictEntry: int = 3;
        private index: int = 0;
        public get Current(): KeyValuePair<TKey, TValue> {
            if (!this.current) {
                throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_EnumOpCantHappen"));
            }
            if (this.getObjectRetType == 1) {
                return this.currentKey as any;
            }
            if (this.getObjectRetType == 2) {
                return this.currentValue as any;
            }
            return new KeyValuePair(this.currentKey, this.currentValue);
        }

        public get Entry(): KeyValuePair<TKey, TValue> {
            if (!this.current) {
                throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_EnumOpCantHappen"));
            }
            return new KeyValuePair(this.currentKey, this.currentValue);
        }

        public get Key(): TKey {
            if (!this.current) {
                throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_EnumNotStarted"));
            }
            return this.currentKey;
        }

        public get Value(): TValue {
            if (!this.current) {
                throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_EnumOpCantHappen"));
            }
            return this.currentValue;
        }

        public constructor(hashtable: Hashtable<TKey, TValue>, getObjRetType: int) {
            this.hashtable = hashtable;
            this.bucket = hashtable.buckets.length;
            this.version = hashtable.version;
            this.current = false;
            this.getObjectRetType = getObjRetType;
        }

        public clone(): any {
            throw new NotImplementedException('clone');
        }

        public /* virtual */  MoveNext(): boolean {
            if (this.version != this.hashtable.version) {
                throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_EnumFailedVersion"));
            }
            while (this.bucket > 0) {
                this.bucket--;
                const obj: TKey = this.hashtable.buckets[this.bucket].key;
                if (obj == null || obj === this.hashtable.buckets as any) {
                    continue;
                }
                this.currentKey = obj;
                this.currentValue = this.hashtable.buckets[this.bucket].val;
                this.current = true;
                return true;
            }
            this.current = false;
            return false;
        }

        public /* virtual */  Reset(): void {
            if (this.version != this.hashtable.version) {
                throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_EnumFailedVersion"));
            }
            this.current = false;
            this.bucket = this.hashtable.buckets.length;
            this.currentKey = null as any;
            this.currentValue = null as any;
        }
    }


    private static KeyCollection = class KeyCollection<TKey> implements ICollection<TKey>, IEnumerable<TKey>
    {
        IsReadOnly: boolean = false;
        Add(item: TKey): void {
            throw new Error("Method not implemented.");
        }
        Clear(): void {
            throw new Error("Method not implemented.");
        }
        Contains(item: TKey): boolean {
            throw new Error("Method not implemented.");
        }
        Remove(item: TKey): boolean {
            throw new Error("Method not implemented.");
        }
        IsEndless?: boolean | undefined;

        private _hashtable: Hashtable<TKey, any> = undefined as any;

        public get Count(): int {
            return this._hashtable.count;
        }



        public constructor(hashtable: Hashtable<TKey, any>) {
            this._hashtable = hashtable;
        }

        public /* virtual */  CopyTo(array: Array<TKey>, arrayIndex: int): Array<TKey> {
            if (array == null) {
                throw new ArgumentNullException("array");
            }

            if (arrayIndex < 0) {
                throw new ArgumentOutOfRangeException("arrayIndex", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
            }
            if (array.length - arrayIndex < this._hashtable.count) {
                throw new ArgumentException(Environment.GetResourceString("Arg_ArrayPlusOffTooSmall"));
            }
            return this._hashtable.CopyKeys(array, arrayIndex);
        }

        public /* virtual */  GetEnumerator(): IEnumerator<TKey> {
            return new Hashtable.HashtableEnumerator(this._hashtable, 1) as any;
        }
        public toArray(): Array<TKey> {
            const array: Array<TKey> = [];
            for (let i = 0; i < this._hashtable.buckets.length; i++) {
                if (this._hashtable.buckets[i].key != null) {
                    array.push(this._hashtable.buckets[i].key);
                }
            }
            return array;
        }
    }




    private static ValueCollection = class ValueCollection<TValue> implements ICollection<TValue>, IEnumerable<TValue>
    {
        IsReadOnly: boolean = false;
        Add(item: TValue): void {
            throw new Error("Method not implemented.");
        }
        Clear(): void {
            throw new Error("Method not implemented.");
        }
        Contains(item: TValue): boolean {
            throw new Error("Method not implemented.");
        }
        Remove(item: TValue): boolean {
            throw new Error("Method not implemented.");
        }
        IsEndless?: boolean | undefined;

        private _hashtable: Hashtable<any, TValue> = undefined as any;

        public get Count(): int {
            return this._hashtable.count;
        }


        public constructor(hashtable: Hashtable<any, TValue>) {
            this._hashtable = hashtable;
        }

        public /* virtual */ CopyTo(array: Array<TValue>, arrayIndex: int): Array<TValue> {
            if (array == null) {
                throw new ArgumentNullException("array");
            }

            if (arrayIndex < 0) {
                throw new ArgumentOutOfRangeException("arrayIndex", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
            }
            if (array.length - arrayIndex < this._hashtable.count) {
                throw new ArgumentException(Environment.GetResourceString("Arg_ArrayPlusOffTooSmall"));
            }
            return this._hashtable.CopyValues(array, arrayIndex);
        }

        public /* virtual */  GetEnumerator(): IEnumerator<TValue> {
            return new Hashtable.HashtableEnumerator(this._hashtable, 2) as any;
        }
    }
}

Hashtable.staticConstructor();