import { ArgumentException } from "../../Exceptions/ArgumentException";
import { ArgumentNullException } from "../../Exceptions/ArgumentNullException";
import { ArgumentOutOfRangeException } from "../../Exceptions/ArgumentOutOfRangeException";
import { InvalidOperationException } from "../../Exceptions/InvalidOperationException";
import { NotSupportedException } from "../../Exceptions/NotSupportedException";
import { int, New } from "../../float";
import { CultureInfo } from "../../Globalization/CultureInfo";
import { IComparable } from "../../IComparable";
import { is } from "../../is";
import { SR } from "../../SR";
import { ArrayList } from "../ArrayList";
import { CaseInsensitiveComparer } from "../CaseInsensitiveComparer";
import { IIteratorResult } from "../enumeration_";
import { IEnumerator } from "../enumeration_/IEnumerator";
import { ICollection } from "../Generic/ICollection";
import { Hashtable } from "../Hashtable";
import { IComparer } from "../IComparer";
import { IEqualityComparer } from "../IEqualityComparer";
import { IHashCodeProvider } from "../IHashCodeProvider";
import { StringComparer } from "./StringComparer";

declare var CaseInsensitiveHashCodeProvider;
type DBNull = any;

export abstract class NameObjectCollectionBase implements ICollection<any> {
    Add(item: any): void {
        throw new Error("Method not implemented.");
    }
    Clear(): void {
        throw new Error("Method not implemented.");
    }
    Contains(item: any): boolean {
        throw new Error("Method not implemented.");
    }
    Remove(item: any): boolean {
        throw new Error("Method not implemented.");
    }
    IsEndless?: boolean | undefined;
    // const names used for serialization
    private static readonly ReadOnlyName: string = "ReadOnly";
    private static readonly CountName: string = "Count";
    private static readonly ComparerName: string = "Comparer";
    private static readonly HashCodeProviderName: string = "HashProvider";
    private static readonly KeysName: string = "Keys";
    private static readonly ValuesName: string = "Values";
    private static readonly KeyComparerName: string = "KeyComparer";
    private static readonly VersionName: string = "Version";

    private _readOnly: boolean = false;
    private _entriesArray: ArrayList = null as any;
    private _keyComparer: IEqualityComparer<any> = null as any;
    private _entriesTable: Hashtable = null as any;
    private _nullKeyEntry: NameObjectEntry = null as any;
    private _keys: KeysCollection = null as any;
    private _version: int = 0;

    private static defaultComparer: StringComparer = StringComparer.InvariantCultureIgnoreCase;
    public constructor() {
        this.constructor1();
    }
    protected constructor1() {
        this.constructor2(NameObjectCollectionBase.defaultComparer);
    }

    protected constructor2(equalityComparer: IEqualityComparer<string>) {
        this._keyComparer = (equalityComparer == null) ? NameObjectCollectionBase.defaultComparer : equalityComparer;
        this.Reset();
    }

    protected constructor3(capacity: int, equalityComparer: IEqualityComparer<string>) {
        this.constructor2(equalityComparer);
        this.Reset(capacity);
    }


    protected constructor4(hashProvider: IHashCodeProvider, comparer: IComparer<any>) {
        this._keyComparer = new CompatibleComparer(comparer, hashProvider);
        this.Reset();
    }

    protected constructor5(capacity: int, hashProvider: IHashCodeProvider, comparer: IComparer<any>) {
        this._keyComparer = new CompatibleComparer(comparer, hashProvider);
        this.Reset(capacity);
    }

    protected constructor6(capacity: int) {
        this._keyComparer = StringComparer.InvariantCultureIgnoreCase;
        this.Reset(capacity);
    }

    // Allow internal extenders to avoid creating the hashtable/arraylist.
    public /* internal */ constructor7(dummy: DBNull) {
    }

    //
    // Serialization support
    //


    private Reset(): void;
    private Reset(capacity: int): void;
    private Reset(...args: any[]): void {
        if (args.length === 0) {
            this._entriesArray = new ArrayList();
            this._entriesTable = new Hashtable(this._keyComparer);
            this._nullKeyEntry = null as any;
            this._version++;
        } else if (args.length === 1) {
            const capacity: int = args[0];
            this._entriesArray = new ArrayList(capacity);
            this._entriesTable = new Hashtable(capacity, this._keyComparer);
            this._nullKeyEntry = null as any;
            this._version++;
        }
    }

    private FindEntry(key: string): NameObjectEntry {
        if (key != null)
            return this._entriesTable.Get(key);
        else
            return this._nullKeyEntry;
    }

    public /* internal */ get Comparer(): IEqualityComparer<any> {
        return this._keyComparer;
    }
    public /* internal */ set Comparer(value: IEqualityComparer<any>) {
        this._keyComparer = value;
    }



    /// <devdoc>
    /// <para>Gets or sets a value indicating whether the <see cref='System.Collections.Specialized.NameObjectCollectionBase'/> instance is read-only.</para>
    /// </devdoc>
    public get IsReadOnly(): boolean {
        return this._readOnly;
    }
    public set IsReadOnly(value: boolean) {
        this._readOnly = value;
    }

    /// <devdoc>
    /// <para>Gets a value indicating whether the <see cref='System.Collections.Specialized.NameObjectCollectionBase'/> instance contains entries whose
    ///    keys are not <see langword='null'/>.</para>
    /// </devdoc>
    protected BaseHasKeys(): boolean {
        return (this._entriesTable.Count > 0);  // any entries with keys?
    }

    //
    // Methods to add / remove entries
    //

    /// <devdoc>
    ///    <para>Adds an entry with the specified key and value into the
    ///    <see cref='System.Collections.Specialized.NameObjectCollectionBase'/> instance.</para>
    /// </devdoc>
    protected BaseAdd(name: string, value: any): void {
        if (this._readOnly)
            throw new NotSupportedException(SR.GetString(SR.CollectionReadOnly));

        const entry: NameObjectEntry = new NameObjectEntry(name, value);

        // insert entry into hashtable
        if (name != null) {
            if (this._entriesTable.Get(name) == null)
                this._entriesTable.Add(name, entry);
        }
        else { // null key -- special case -- hashtable doesn't like null keys
            if (this._nullKeyEntry == null)
                this._nullKeyEntry = entry;
        }

        // add entry to the list
        this._entriesArray.Add(entry);

        this._version++;
    }

    /// <devdoc>
    ///    <para>Removes the entries with the specified key from the
    ///    <see cref='System.Collections.Specialized.NameObjectCollectionBase'/> instance.</para>
    /// </devdoc>
    protected BaseRemove(name: string): void {
        if (this._readOnly)
            throw new NotSupportedException(SR.GetString(SR.CollectionReadOnly));

        if (name != null) {
            // remove from hashtable
            this._entriesTable.Remove(name);

            // remove from array
            for (let i: int = this._entriesArray.Count - 1; i >= 0; i--) {
                if (this._keyComparer.Equals(name, this.BaseGetKey(i)))
                    this._entriesArray.RemoveAt(i);
            }
        }
        else { // null key -- special case
            // null out special 'null key' entry
            this._nullKeyEntry = null as any;

            // remove from array
            for (let i: int = this._entriesArray.Count - 1; i >= 0; i--) {
                if (this.BaseGetKey(i) == null)
                    this._entriesArray.RemoveAt(i);
            }
        }

        this._version++;
    }

    /// <devdoc>
    ///    <para> Removes the entry at the specified index of the
    ///    <see cref='System.Collections.Specialized.NameObjectCollectionBase'/> instance.</para>
    /// </devdoc>
    protected BaseRemoveAt(index: int): void {
        if (this._readOnly)
            throw new NotSupportedException(SR.GetString(SR.CollectionReadOnly));

        const key: string = this.BaseGetKey(index);

        if (key != null) {
            // remove from hashtable
            this._entriesTable.Remove(key);
        }
        else { // null key -- special case
            // null out special 'null key' entry
            this._nullKeyEntry = null as any;
        }

        // remove from array
        this._entriesArray.RemoveAt(index);

        this._version++;
    }

    /// <devdoc>
    /// <para>Removes all entries from the <see cref='System.Collections.Specialized.NameObjectCollectionBase'/> instance.</para>
    /// </devdoc>
    protected BaseClear(): void {
        if (this._readOnly)
            throw new NotSupportedException(SR.GetString(SR.CollectionReadOnly));

        this.Reset();
    }

    //
    // Access by name
    //

    /// <devdoc>
    ///    <para>Gets the value of the first entry with the specified key from
    ///       the <see cref='System.Collections.Specialized.NameObjectCollectionBase'/> instance.</para>
    /// </devdoc>
    protected BaseGet(name: string): any;
    protected BaseGet(index: int): any;
    protected BaseGet(...args: any[]): any {
        if (args.length === 1 && is.string(args[0])) {
            const name: string = args[0];
            const e: NameObjectEntry = this.FindEntry(name);
            return (e != null) ? e.Value : null;
        } else if (args.length === 1 && is.int(args[0])) {
            const index: int = args[0];
            const entry: NameObjectEntry = this._entriesArray.Get(index);
            return entry.Value;
        }
    }

    /// <devdoc>
    /// <para>Sets the value of the first entry with the specified key in the <see cref='System.Collections.Specialized.NameObjectCollectionBase'/>
    /// instance, if found; otherwise, adds an entry with the specified key and value
    /// into the <see cref='System.Collections.Specialized.NameObjectCollectionBase'/>
    /// instance.</para>
    /// </devdoc>
    protected BaseSet(name: string, value: any): void;
    protected BaseSet(index: int, value: any): void;
    protected BaseSet(...args: any[]): void {
        if (args.length === 2 && is.string(args[0])) {
            const name: string = args[0];
            const value: any = args[1];
            if (this._readOnly)
                throw new NotSupportedException(SR.GetString(SR.CollectionReadOnly));

            const entry: NameObjectEntry = this.FindEntry(name);
            if (entry != null) {
                entry.Value = value;
                this._version++;
            }
            else {
                this.BaseAdd(name, value);
            }
        } else if (args.length === 2 && is.int(args[0])) {
            const index: int = args[0];
            const value: any = args[1];
            if (this._readOnly)
                throw new NotSupportedException(SR.GetString(SR.CollectionReadOnly));

            const entry: NameObjectEntry = this._entriesArray.Get(index);
            entry.Value = value;
            this._version++;
        }
    }

    protected BaseGetKey(index: int): string {
        const entry: NameObjectEntry = this._entriesArray.Get(index);
        return entry.Key;
    }

    public /* virtual */  GetEnumerator(): IEnumerator<any> {
        return new NameObjectKeysEnumerator(this);
    }

    public /* virtual */ get Count(): int {
        return this._entriesArray.Count;
    }

    public CopyTo(array: Array<any>, index: int): void {
        if (array == null) {
            throw new ArgumentNullException("array");
        }

        if ((array as any).Rank != 1) {
            throw new ArgumentException(SR.GetString((SR as any).Arg_MultiRank));
        }

        if (index < 0) {
            throw new ArgumentOutOfRangeException("index  SR.GetString(SR.IndexOutOfRange, index.toString(/* CultureInfo.CurrentCulture */))");
        }

        if (array.length - index < this._entriesArray.Count) {
            throw new ArgumentException(SR.GetString(SR.Arg_InsufficientSpace));
        }

        for (let e: IEnumerator<any> = this.GetEnumerator(); e.MoveNext();) {
            array[e.Current] = index++;
        }
    }

    protected BaseGetAllKeys(): string[] {
        const n: int = this._entriesArray.Count;
        const allKeys: string[] = New.Array(n);

        for (let i: int = 0; i < n; i++)
            allKeys[i] = this.BaseGetKey(i);

        return allKeys;
    }

    /// <devdoc>
    /// <para>Returns an <see cref='System.Object' qualify='true'/> array containing all the values in the
    /// <see cref='System.Collections.Specialized.NameObjectCollectionBase'/> instance.</para>
    /// </devdoc>
    protected BaseGetAllValues(): any[] {
        const n: int = this._entriesArray.Count;
        const allValues: any[] = New.Array(n);

        for (let i: int = 0; i < n; i++)
            allValues[i] = this.BaseGet(i);

        return allValues;
    }


    /* protected object[] BaseGetAllValues(Type type) {
        int n = _entriesArray.Count;
        if (type == null) {
            throw new ArgumentNullException("type");
        }
        object[] allValues = (object[]) SecurityUtils.ArrayCreateInstance(type, n);

        for (int i = 0; i < n; i++) {
            allValues[i] = BaseGet(i);
        }

        return allValues;
    } */


    public /* virtual */ get Keys(): KeysCollection {
        if (this._keys == null)
            this._keys = new KeysCollection(this);
        return this._keys;
    }
}

//
// Simple entry class to allow substitution of values and indexed access to keys
//

export class NameObjectEntry {

    public/* internal */ constructor(name: string, value: any) {
        this.Key = name;
        this.Value = value;
    }

    public /* internal */  Key: string;
    public /* internal */  Value: any;
}

export class NameObjectKeysEnumerator implements IEnumerator<any> {
    private _pos: int = 0;
    private _coll: NameObjectCollectionBase = null as any;
    private _version: int = 0;

    public /* internal */ constructor(coll: NameObjectCollectionBase) {
        this._coll = coll;
        this._version = (this._coll as any)._version;
        this._pos = -1;
    }
    CanMoveNext?: boolean | undefined;
    TryMoveNext(out: (value: any) => void): boolean {
        throw new Error("Method not implemented.");
    }
    End(): void {
        throw new Error("Method not implemented.");
    }
    NextValue(value?: any) {
        throw new Error("Method not implemented.");
    }
    IsEndless?: boolean | undefined;
    Next(value?: any): IIteratorResult<any> {
        throw new Error("Method not implemented.");
    }
    Dispose(): void {
        throw new Error("Method not implemented.");
    }

    public MoveNext(): boolean {
        if (this._version != (this._coll as any)._version)
            throw new InvalidOperationException(SR.GetString(SR.InvalidOperation_EnumFailedVersion));

        if (this._pos < this._coll.Count - 1) {
            this._pos++;
            return true;
        }
        else {
            this._pos = this._coll.Count;
            return false;
        }

    }

    public Reset(): void {
        if (this._version !== (this._coll as any)._version)
            throw new InvalidOperationException(SR.GetString(SR.InvalidOperation_EnumFailedVersion));
        this._pos = -1;
    }

    public get Current(): any {
        if (this._pos >= 0 && this._pos < this._coll.Count) {
            return (this._coll as any).BaseGetKey(this._pos);
        }
        else {
            throw new InvalidOperationException(SR.GetString(SR.InvalidOperation_EnumOpCantHappen));
        }
    }
}

export class KeysCollection implements ICollection<any> {

    private _coll: NameObjectCollectionBase = null as any;

    public /* internal */ constructor(coll: NameObjectCollectionBase) {
        this._coll = coll;
    }
    IsReadOnly: boolean = false;
    Add(item: any): void {
        throw new Error("Method not implemented.");
    }
    Clear(): void {
        throw new Error("Method not implemented.");
    }
    Contains(item: any): boolean {
        throw new Error("Method not implemented.");
    }
    Remove(item: any): boolean {
        throw new Error("Method not implemented.");
    }
    IsEndless?: boolean | undefined;

    // Indexed access

    /// <devdoc>
    ///    <para> Gets the key at the specified index of the collection.</para>
    /// </devdoc>
    public /* virtual */  Get(index: int): string {
        return (this._coll as any).BaseGetKey(index);
    }

    /// <devdoc>
    ///    <para>Represents the entry at the specified index of the collection.</para>
    /// </devdoc>
    /*  public String this[int index] {
     get {
         return Get(index);
     }
 } */

    public GetEnumerator(): IEnumerator<any> {
        return new NameObjectKeysEnumerator(this._coll);
    }

    /// <devdoc>
    /// <para>Gets the number of keys in the <see cref='System.Collections.Specialized.NameObjectCollectionBase.KeysCollection'/>.</para>
    /// </devdoc>
    public get Count(): int {
        return this._coll.Count;
    }

    public CopyTo(array: Array<any>, index: int): void {
        if (array == null) {
            throw new ArgumentNullException("array");
        }

        if ((array as any).Rank != 1) {
            throw new ArgumentException('SR.GetString(SR.Arg_MultiRank)');
        }

        if (index < 0) {
            throw new ArgumentOutOfRangeException("index", 'SR.GetString(SR.IndexOutOfRange, index.ToString(CultureInfo.CurrentCulture))');
        }

        if (array.length - index < this._coll.Count) {
            throw new ArgumentException(SR.GetString(SR.Arg_InsufficientSpace));
        }

        for (let e: IEnumerator<any> = this.GetEnumerator(); e.MoveNext();)
            array[e.Current] = index++;
    }
}

export class CompatibleComparer implements IEqualityComparer<any>  {
    private _comparer: IComparer<any> = null as any;
    private static /* volatile */  defaultComparer: IComparer<any>;
    // Needed for compatability
    private _hcp: IHashCodeProvider = null as any;

    private static /* volatile */  defaultHashProvider: IHashCodeProvider;

    public /* internal */ constructor(comparer: IComparer<any>, hashCodeProvider: IHashCodeProvider) {
        this._comparer = comparer;
        this._hcp = hashCodeProvider;
    }

    public Equals(a: any, b: any): boolean {
        if (a === b) return true;
        if (a == null || b == null) {
            return false;
        }

        // We must call Compare or CompareTo method
        // to make sure everything is fine, but the
        // guideline is that Equals should never throw.
        // So we need to ignore ArgumentException (note this
        // is the exception we should get if two objects are not
        // comparable.)

        try {
            if (this._comparer != null)
                return (this._comparer.Compare(a, b) === 0);

            const ia: IComparable<any> = a as IComparable<any>;
            if (ia != null)
                return (ia.CompareTo(b) === 0);
        }
        catch (ArgumentException) {
            return false;
        }

        return a.Equals(b);
    }

    public GetHashCode(obj: any): int {
        if (obj == null) {
            throw new ArgumentNullException("obj");
        }

        if (this._hcp != null)
            return this._hcp.GetHashCode(obj);
        return obj.GetHashCode();
    }

    public get Comparer(): IComparer<any> {
        return this._comparer;
    }

    public get HashCodeProvider(): IHashCodeProvider {
        return this._hcp;
    }

    public static get DefaultComparer(): IComparer<any> {
        if (CompatibleComparer.defaultComparer == null) {
            CompatibleComparer.defaultComparer = new CaseInsensitiveComparer(CultureInfo.InvariantCulture);
        }
        return CompatibleComparer.defaultComparer;
    }

    public static get DefaultHashCodeProvider(): IHashCodeProvider {
        if (CompatibleComparer.defaultHashProvider == null) {
            CompatibleComparer.defaultHashProvider = new CaseInsensitiveHashCodeProvider(CultureInfo.InvariantCulture);
        }
        return CompatibleComparer.defaultHashProvider;
    }
}