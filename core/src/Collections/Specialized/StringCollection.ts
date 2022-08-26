import { ArgumentNullException } from "../../Exceptions/ArgumentNullException";
import { int } from "../../float";
import { ArrayList } from "../ArrayList";
import { IIteratorResult } from "../enumeration_";
import { IEnumerable } from "../enumeration_/IEnumerable";
import { IEnumerator } from "../enumeration_/IEnumerator";
import { IList } from "../Generic/IList";

export class StringCollection implements IList<string> {
    private data: ArrayList = new ArrayList();

    /// <devdoc>
    /// <para>Represents the entry at the specified index of the <see cref='System.Collections.Specialized.StringCollection'/>.</para>
    /// </devdoc>
    public Get(index: int): string {
        return (this.data.Get(index));
    }
    public Set(index: int, value: string) {
        this.data.Set(index, value);
    }


    /// <devdoc>
    ///    <para>Gets the number of strings in the
    ///    <see cref='System.Collections.Specialized.StringCollection'/> .</para>
    /// </devdoc>
    public get Count(): int {
        return this.data.Count;
    }

    /*  public get IsReadOnly(): boolean {
         return false;
     } */

    public get IsFixedSize(): boolean {
        return false;
    }


    public Add(value: string): int {
        return this.data.Add(value);
    }

    /// <devdoc>
    /// <para>Copies the elements of a string array to the end of the <see cref='System.Collections.Specialized.StringCollection'/>.</para>
    /// </devdoc>
    public AddRange(value: string[]): void {
        if (value == null) {
            throw new ArgumentNullException("value");
        }
        this.data.AddRange(value);
    }

    /// <devdoc>
    ///    <para>Removes all the strings from the
    ///    <see cref='System.Collections.Specialized.StringCollection'/> .</para>
    /// </devdoc>
    public Clear(): void {
        this.data.Clear();
    }

    /// <devdoc>
    ///    <para>Gets a value indicating whether the
    ///    <see cref='System.Collections.Specialized.StringCollection'/> contains a string with the specified
    ///       value.</para>
    /// </devdoc>
    public Contains(value: string): boolean {
        return this.data.Contains(value);
    }

    public CopyTo(array: string[], index: int): void {
        this.data.CopyTo(array, index);
    }

    public GetEnumerator(): StringEnumerator {
        return new StringEnumerator(this);
    }

    /// <devdoc>
    ///    <para>Returns the index of the first occurrence of a string in
    ///       the <see cref='System.Collections.Specialized.StringCollection'/> .</para>
    /// </devdoc>
    public IndexOf(value: string): int {
        return this.data.IndexOf(value);
    }

    /// <devdoc>
    /// <para>Inserts a string into the <see cref='System.Collections.Specialized.StringCollection'/> at the specified
    ///    index.</para>
    /// </devdoc>
    public Insert(index: int, value: string): void {
        this.data.Insert(index, value);
    }

    /// <devdoc>
    /// <para>Gets a value indicating whether the <see cref='System.Collections.Specialized.StringCollection'/> is read-only.</para>
    /// </devdoc>
    public get IsReadOnly(): boolean {
        return false;
    }


    public Remove(value: string): boolean {
        return this.data.Remove(value);
    }

    public RemoveAt(index: int): void {
        this.data.RemoveAt(index);
    }
}

/// <devdoc>
///    <para>[To be supplied.]</para>
/// </devdoc>
export class StringEnumerator implements IEnumerator<string>  {
    private baseEnumerator: IEnumerator<string> = null as any;
    private temp: IEnumerable<string> = null as any;

    public/* internal */ constructor(mappings: StringCollection) {
        this.temp = (mappings);
        this.baseEnumerator = this.temp.GetEnumerator();
    }
    CanMoveNext?: boolean | undefined;
    TryMoveNext(out: (value: string) => void): boolean {
        throw new Error("Method not implemented.");
    }
    End(): void {
        throw new Error("Method not implemented.");
    }
    NextValue(value?: any): string | undefined {
        throw new Error("Method not implemented.");
    }
    IsEndless?: boolean | undefined;
    Next(value?: any): IIteratorResult<string> {
        throw new Error("Method not implemented.");
    }
    Dispose(): void {
        throw new Error("Method not implemented.");
    }

    /// <devdoc>
    ///    <para>[To be supplied.]</para>
    /// </devdoc>
    public get Current(): string {
        return this.baseEnumerator.Current;
    }

    /// <devdoc>
    ///    <para>[To be supplied.]</para>
    /// </devdoc>
    public MoveNext(): boolean {
        return this.baseEnumerator.MoveNext();
    }
    /// <devdoc>
    ///    <para>[To be supplied.]</para>
    /// </devdoc>
    public Reset(): void {
        this.baseEnumerator.Reset();
    }
}