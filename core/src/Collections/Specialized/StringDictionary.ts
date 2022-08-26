import { NotImplementedException } from '../../Exceptions';
import { ArgumentNullException } from '../../Exceptions/ArgumentNullException';
import { int } from '../../float';
import { IEnumerable } from '../enumeration_/IEnumerable';
import { IEnumerator } from '../enumeration_/IEnumerator';
import { ICollection } from '../Generic/ICollection';
import { IDictionary } from '../Generic/IDictionary';
import { KeyValuePair } from '../Generic/KeyValuePair';
import { Hashtable } from '../Hashtable';

export class StringDictionary implements IEnumerable<KeyValuePair<string, string>> {

    // For compatibility, we want the Keys property to return values in lower-case.
    // That means using ToLower in each property on this type.  Also for backwards
    // compatibility, we will be converting strings to lower-case, which has a
    // problem for some Georgian alphabets.  Can't really fix it now though...
    public /* internal */  contents: Hashtable<string, string> = new Hashtable();


    /// <devdoc>
    /// <para>Initializes a new instance of the StringDictionary class.</para>
    /// <para>If you're using file names, registry keys, etc, you want to use
    /// a Dictionary&lt;String, Object&gt; and use
    /// StringComparer.OrdinalIgnoreCase.</para>
    /// </devdoc>
    public constructor() {
    }

    /// <devdoc>
    /// <para>Gets the number of key-and-value pairs in the StringDictionary.</para>
    /// </devdoc>
    public /* virtual */ get Count(): int {
        return this.contents.Count;
    }




    /// <devdoc>
    ///    <para>Gets or sets the value associated with the specified key.</para>
    /// </devdoc>
    public /* virtual */  Get(key: string): string {
        if (key == null) {
            throw new ArgumentNullException("key");
        }

        return this.contents.Get(key/* .ToLower(CultureInfo.InvariantCulture) */);
    }
    public Set(key: string, value: string) {
        if (key == null) {
            throw new ArgumentNullException("key");
        }

        this.contents.Set(key/* .ToLower(CultureInfo.InvariantCulture)] */, value);
    }

    /// <devdoc>
    /// <para>Gets a collection of keys in the StringDictionary.</para>
    /// </devdoc>
    public /* virtual */ get Keys(): ICollection<string> {
        return this.contents.Keys;
    }




    /// <devdoc>
    /// <para>Gets a collection of values in the StringDictionary.</para>
    /// </devdoc>
    public /* virtual */ get Values(): ICollection<string> {
        return this.contents.Values;
    }

    /// <devdoc>
    /// <para>Adds an entry with the specified key and value into the StringDictionary.</para>
    /// </devdoc>
    public /* virtual */  Add(key: string, value: string): void {
        if (key == null) {
            throw new ArgumentNullException("key");
        }

        this.contents.Add(key/* .ToLower(CultureInfo.InvariantCulture) */, value);
    }

    /// <devdoc>
    /// <para>Removes all entries from the StringDictionary.</para>
    /// </devdoc>
    public /* virtual */  Clear(): void {
        this.contents.Clear();
    }

    /// <devdoc>
    ///    <para>Determines if the string dictionary contains a specific key</para>
    /// </devdoc>
    public /* virtual */  ContainsKey(key: string): boolean {
        if (key == null) {
            throw new ArgumentNullException("key");
        }

        return this.contents.ContainsKey(key/* .ToLower(CultureInfo.InvariantCulture) */);
    }

    /// <devdoc>
    /// <para>Determines if the StringDictionary contains a specific value.</para>
    /// </devdoc>
    public /* virtual */  ContainsValue(value: string): boolean {
        return this.contents.ContainsValue(value);
    }

    /// <devdoc>
    /// <para>Copies the string dictionary values to a one-dimensional <see cref='System.Array'/> instance at the
    ///    specified index.</para>
    /// </devdoc>
    public /* virtual */  CopyTo(array: Array<KeyValuePair<string, string>>, index: int): void {
        this.contents.CopyTo(array, index);
    }

    /// <devdoc>
    ///    <para>Returns an enumerator that can iterate through the string dictionary.</para>
    /// </devdoc>
    public /* virtual */  GetEnumerator(): IEnumerator<KeyValuePair<string, string>> {
        return this.contents.GetEnumerator();
    }

    /// <devdoc>
    ///    <para>Removes the entry with the specified key from the string dictionary.</para>
    /// </devdoc>
    public /* virtual */  Remove(key: string): void {
        if (key == null) {
            throw new ArgumentNullException("key");
        }

        this.contents.Remove(key/* .ToLower(CultureInfo.InvariantCulture) */);
    }

    /// <summary>
    /// Make this StringDictionary subservient to some other collection.
    /// <para>Some code was replacing the contents field with a Hashtable created elsewhere.
    /// While it may not have been incorrect, we don't want to encourage that pattern, because
    /// it will replace the IEqualityComparer in the Hashtable, and creates a possibly-undesirable
    /// link between two seemingly different collections.  Let's discourage that somewhat by
    /// making this an explicit method call instead of an internal field assignment.</para>
    /// </summary>
    /// <param name="useThisHashtableInstead">Replaces the backing store with another, possibly aliased Hashtable.</param>
    public /* internal */  ReplaceHashtable(useThisHashtableInstead: Hashtable): void {
        this.contents = useThisHashtableInstead;
    }

    public /* internal */  AsGenericDictionary():IDictionary<string, string> {
        //return new GenericAdapter(this);
        throw new NotImplementedException('');
    }
}