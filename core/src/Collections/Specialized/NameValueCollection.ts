import { ArgumentException } from "../../Exceptions/ArgumentException";
import { ArgumentNullException } from "../../Exceptions/ArgumentNullException";
import { ArgumentOutOfRangeException } from "../../Exceptions/ArgumentOutOfRangeException";
import { NotSupportedException } from "../../Exceptions/NotSupportedException";
import { int, New } from "../../float";
import { is } from "../../is";
import { StringBuilder } from "../../Text/StringBuilder";
import { ArrayList } from "../ArrayList";
import { NameObjectCollectionBase } from "./NameObjectCollectionBase";

export class NameValueCollection extends NameObjectCollectionBase {

    private _all: string[] = null as any;
    private _allKeys: string[] = null as any;

    public constructor() {
        super();
    }


    /*  public NameValueCollection(NameValueCollection col)
         : base( col != null? col.Comparer : null) {
         Add(col);
     } */
    /*

        public NameValueCollection(IHashCodeProvider hashProvider, IComparer comparer)
            : base(hashProvider, comparer) {
        }

        public NameValueCollection(int capacity) : base(capacity) {
        }

        public NameValueCollection(IEqualityComparer equalityComparer) : base( equalityComparer) {
        }

        public NameValueCollection(Int32 capacity, IEqualityComparer equalityComparer)
            : base(capacity, equalityComparer) {
        } */

    /*    public NameValueCollection(int capacity, NameValueCollection col)
           : base(capacity, (col != null ? col.Comparer : null)) {
           if( col == null) {
               throw new ArgumentNullException("col");
           }

           this.Comparer = col.Comparer;
           Add(col);
       } */

    /* public NameValueCollection(int capacity, IHashCodeProvider hashProvider, IComparer comparer)
        : base(capacity, hashProvider, comparer) {
    }
    internal NameValueCollection(DBNull dummy) : base(dummy)
    {
    } */


    protected InvalidateCachedArrays(): void {
        this._all = null as any;
        this._allKeys = null as any;
    }

    private static GetAsOneString(list: ArrayList): string {
        const n: int = (list != null) ? list.Count : 0;

        if (n == 1) {
            return list.Get(0);
        }
        else if (n > 1) {
            const s: StringBuilder = new StringBuilder(list.Get(0));

            for (let i: int = 1; i < n; i++) {
                s.Append(',');
                s.Append(list.Get(i));
            }

            return s.ToString();
        }
        else {
            return null as any;
        }
    }

    private static GetAsStringArray(list: ArrayList): string[] {
        const n: int = (list != null) ? list.Count : 0;
        if (n === 0)
            return null as any;

        const array: string[] = New.Array(n);
        list.CopyTo(0, array, 0, n);
        return array;
    }


    public Add(c: NameValueCollection): void;
    public /* virtual */  Add(name: string, value: string): void;
    public Add(...args: any[]): void {
        if (args.length === 1) {
            const c: NameValueCollection = args[0];
            if (c == null) {
                throw new ArgumentNullException("c");
            }

            this.InvalidateCachedArrays();

            const n: int = c.Count;

            for (let i: int = 0; i < n; i++) {
                const key: string = c.GetKey(i);
                const values: string[] = c.GetValues(i);

                if (values != null) {
                    for (let j: int = 0; j < values.length; j++)
                        this.Add(key, values[j]);
                }
                else {
                    this.Add(key, null as any);
                }
            }
        } else if (args.length === 2) {
            const name: string = args[0];
            const value: string = args[1];
            if (this.IsReadOnly)
                throw new NotSupportedException('SR.GetString(SR.CollectionReadOnly)');

            this.InvalidateCachedArrays();

            let values: ArrayList = this.BaseGet(name);

            if (values == null) {
                // new key - add new key with single value
                values = new ArrayList(1);
                if (value != null)
                    values.Add(value);
                this.BaseAdd(name, values);
            }
            else {
                // old key -- append value to the list of values
                if (value != null)
                    values.Add(value);
            }
        }
    }

    /// <devdoc>
    ///    <para>Invalidates the cached arrays and removes all entries
    ///       from the <see cref='System.Collections.Specialized.NameValueCollection'/>.</para>
    /// </devdoc>
    public /* virtual */  Clear(): void {
        if (this.IsReadOnly)
            throw new NotSupportedException('SR.GetString(SR.CollectionReadOnly)');

        this.InvalidateCachedArrays();
        this.BaseClear();
    }

    public CopyTo(dest: Array<any>, index: int): void {
        if (dest == null) {
            throw new ArgumentNullException("dest");
        }

        if ((dest as any).Rank != 1) {
            throw new ArgumentException('SR.GetString(SR.Arg_MultiRank)');
        }

        if (index < 0) {
            throw new ArgumentOutOfRangeException("index");
        }

        if (dest.length - index < this.Count) {
            throw new ArgumentException('SR.GetString(SR.Arg_InsufficientSpace)');
        }

        const n: int = this.Count;
        if (this._all == null) {
            const all: string[] = New.Array(n);
            for (let i: int = 0; i < n; i++) {
                all[i] = this.Get(i);
                dest[all[i]] = i + index;
            }
            this._all = all; // wait until end of loop to set _all reference in case Get throws
        }
        else {
            for (let i: int = 0; i < n; i++) {
                dest[this._all[i]] = i + index;
            }
        }
    }

    /// <devdoc>
    /// <para>Gets a value indicating whether the <see cref='System.Collections.Specialized.NameValueCollection'/> contains entries whose keys are not <see langword='null'/>.</para>
    /// </devdoc>
    public HasKeys(): boolean {
        return this.InternalHasKeys();
    }

    /// <devdoc>
    /// <para>Allows derived classes to alter HasKeys().</para>
    /// </devdoc>
    public /* internal virtual */  InternalHasKeys(): boolean {
        return this.BaseHasKeys();
    }

    /// <devdoc>
    /// <para> Gets the values associated with the specified key from the <see cref='System.Collections.Specialized.NameValueCollection'/> combined into one comma-separated list.</para>
    /// </devdoc>
    public /* virtual */  Get(name: string): string;
    public /* virtual */  Get(index: int): string;
    public /* virtual */  Get(...args: any[]): string {
        if (args.length === 1 && is.string(args[0])) {
            const name: string = args[0];
            const values: ArrayList = this.BaseGet(name);
            return NameValueCollection.GetAsOneString(values);
        } else if (args.length === 1 && is.int(args[0])) {
            const index: int = args[0];
            const values: ArrayList = this.BaseGet(index);
            return NameValueCollection.GetAsOneString(values);
        }
        throw new ArgumentOutOfRangeException('');
    }


    /// <devdoc>
    /// <para>Gets the values associated with the specified key from the <see cref='System.Collections.Specialized.NameValueCollection'/>.</para>
    /// </devdoc>
    public /* virtual */  GetValues(name: string): string[];
    public /* virtual */  GetValues(index: int): string[];
    public /* virtual */  GetValues(...args: any[]): string[] {
        if (args.length === 1 && is.string(args[0])) {
            const name: string = args[0];
            const values: ArrayList = this.BaseGet(name);
            return NameValueCollection.GetAsStringArray(values);
        } else if (args.length === 1 && is.int(args[0])) {
            const index: int = args[0];
            const values: ArrayList = this.BaseGet(index);
            return NameValueCollection.GetAsStringArray(values);
        }
        throw new ArgumentOutOfRangeException('');
    }

    /// <devdoc>
    /// <para>Adds a value to an entry in the <see cref='System.Collections.Specialized.NameValueCollection'/>.</para>
    /// </devdoc>
    public /* virtual */  Set(name: string, value: string): void {
        if (this.IsReadOnly)
            throw new NotSupportedException('SR.GetString(SR.CollectionReadOnly)');

        this.InvalidateCachedArrays();

        const values: ArrayList = new ArrayList(1);
        values.Add(value);
        this.BaseSet(name, values);
    }

    /// <devdoc>
    /// <para>Removes the entries with the specified key from the <see cref='System.Collections.Specialized.NameObjectCollectionBase'/> instance.</para>
    /// </devdoc>
    public /* virtual */  Remove(name: string): boolean {
        this.InvalidateCachedArrays();
        this.BaseRemove(name);
        return true;
    }

    /*  /// <devdoc>
     ///    <para> Represents the entry with the specified key in the
     ///    <see cref='System.Collections.Specialized.NameValueCollection'/>.</para>
     /// </devdoc>
     public String this[String name] {
     get {
         return Get(name);
     }

     set {
         Set(name, value);
     }
 } */

    //
    // Indexed access
    //





    /// <devdoc>
    /// <para>Gets the key at the specified index of the <see cref='System.Collections.Specialized.NameValueCollection'/>.</para>
    /// </devdoc>
    public /* virtual */  GetKey(index: int): string {
        return this.BaseGetKey(index);
    }

    /*     public String this[int index] {
        get {
            return Get(index);
        }
    } */

    //
    // Access to keys and values as arrays
    //

    /// <devdoc>
    /// <para>Gets all the keys in the <see cref='System.Collections.Specialized.NameValueCollection'/>. </para>
    /// </devdoc>
    public /* virtual */ get AllKeys(): string[] {
        if (this._allKeys == null)
            this._allKeys = this.BaseGetAllKeys();
        return this._allKeys;
    }
}