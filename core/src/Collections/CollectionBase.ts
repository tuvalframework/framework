import { forEach } from "./enumeration_/Enumerator";
import { areEqual } from "../Compare";
import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { InvalidOperationException } from "../Exceptions/InvalidOperationException";
import { _ICollection } from "./ICollection";
import { ActionWithIndex, EqualityComparison, PredicateWithIndex } from "../FunctionTypes";
import { IEnumerableOrArray } from "./IEnumerableOrArray";
// import {ILinqEnumerable} from "../../System.Linq/Enumerable";
import { IEnumerateEach } from "./enumeration_/IEnumerateEach";
import { IEnumerator } from "./enumeration_/IEnumerator";
import { ArrayLikeCollection } from "./ArrayLikeCollection";
import { ClassInfo } from "../Reflection/Decorators/ClassInfo";
import { System } from "../SystemTypes";
import { int } from "../float";
import { IList } from "./Generic/IList";
import { ICollection } from "./Generic/ICollection";
import { IEnumerable } from "./enumeration_/IEnumerable";
import { ArrayList } from "./ArrayList";
import { ArgumentOutOfRangeException } from './../Exceptions/ArgumentOutOfRangeException';
import { Environment } from "../Environment";
import { Virtual } from '../Reflection/Decorators/ClassInfo';
import { ArgumentException } from './../Exceptions/ArgumentException';

@ClassInfo({
    fullName: System.Types.Collections.CollectionBase,
    instanceof: [
        System.Types.Collections.CollectionBase,
        System.Types.Collections.ICollection,
        System.Types.Collections.IReadOnlyCollection,
        System.Types.Collections.Enumeration.IEnumerable,
        System.Types.Collections.Enumeration.IEnumerateEach,
    ]
})
export abstract class CollectionBase<T> implements IList<T>, ICollection<T>, IEnumerable<T>
{
    private list: ArrayList<T> = undefined as any;

    public get Capacity(): int {
        return this.InnerList.Capacity;
    }
    public set Capacity(value: int) {
        this.InnerList.Capacity = value;
    }


    public get Count() {
        if (this.list == null) {
            return 0;
        }
        return this.list.Count;
    }

    protected get InnerList(): ArrayList<T> {
        if (this.list == null) {
            this.list = new ArrayList();
        }
        return this.list;
    }

    protected get List(): IList<T> {
        return this;
    }


    public get IsFixedSize(): boolean {
        return this.InnerList.IsFixedSize;
    }

    public get IsReadOnly() {
        return this.InnerList.IsReadOnly;
    }

    public Get(index: int): T {
        if (index < 0 || index >= this.Count) {
            throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_Index"));
        }
        return this.InnerList.Get(index);
    }
    public Set(index: int, value: T) {
        {
            if (index < 0 || index >= this.Count) {
                throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_Index"));
            }
            this.OnValidate(value);
            const item: T = this.InnerList.Get(index);
            this.OnSet(index, item, value);
            this.InnerList.Set(index, value);
            try {
                this.OnSetComplete(index, item, value);
            }
            catch
            {
                this.InnerList[index] = item;
                throw '';
            }
        }
    }

    protected constructor(capacity?: int) {
        this.list = new ArrayList(capacity as any);
    }

    public Clear(): void {
        this.OnClear();
        this.InnerList.Clear();
        this.OnClearComplete();
    }


    public GetEnumerator(): IEnumerator<T> {
        return this.InnerList.GetEnumerator();
    }

    @Virtual
    protected OnClear(): void {
    }

    @Virtual
    protected OnClearComplete(): void {
    }

    @Virtual
    protected OnInsert(index: int, value: T): void {
    }

    @Virtual
    protected OnInsertComplete(index: int, value: T): void {
    }

    @Virtual
    protected OnRemove(index: int, value: T): void {
    }

    @Virtual
    protected OnRemoveComplete(index: int, value: T): void {
    }

    @Virtual
    protected OnSet(index: int, oldValue: T, newValue: T): void {
    }

    @Virtual
    protected OnSetComplete(index: int, oldValue: T, newValue: T): void {
    }

    @Virtual
    protected OnValidate(value: T): void {
        if (value == null) {
            throw new ArgumentNullException("value");
        }
    }

    public RemoveAt(index: int): void {
        if (index < 0 || index >= this.Count) {
            throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_Index"));
        }
        const item: T = this.InnerList.Get(index);
        this.OnValidate(item);
        this.OnRemove(index, item);
        this.InnerList.RemoveAt(index);
        try {
            this.OnRemoveComplete(index, item);
        }
        catch
        {
            this.InnerList.Insert(index, item);
            throw '';
        }
    }

    public CopyTo(array: Array<T>, index: int): void {
        this.InnerList.CopyTo(array, index);
    }

    public Add(value: T): int {
        this.OnValidate(value);
        this.OnInsert(this.InnerList.Count, value);
        this.InnerList.Add(value);
        const int32: int = this.InnerList.Count - 1;
        try {
            this.OnInsertComplete(int32, value);
        }
        catch
        {
            this.InnerList.RemoveAt(int32);
            throw '';
        }
        return int32;
    }

    public Contains(value: T): boolean {
        return this.InnerList.Contains(value);
    }


    public IndexOf(value: T): int {
        return this.InnerList.IndexOf(value);
    }

    public Insert(index: int, value: T): void {
        if (index < 0 || index > this.Count) {
            throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_Index"));
        }
        this.OnValidate(value);
        this.OnInsert(index, value);
        this.InnerList.Insert(index, value);
        try {
            this.OnInsertComplete(index, value);
        }
        catch
        {
            this.InnerList.RemoveAt(index);
            throw '';
        }
    }

    public Remove(value: T): boolean {
        this.OnValidate(value);
        const int32: int = this.InnerList.IndexOf(value);
        if (int32 < 0) {
            throw new ArgumentException(Environment.GetResourceString("Arg_RemoveArgNotFound"));
        }
        this.OnRemove(int32, value);
        this.InnerList.RemoveAt(int32);
        try {
            this.OnRemoveComplete(int32, value);
        }
        catch
        {
            this.InnerList.Insert(int32, value);
            throw '';
        }
        return true;
    }
}


const
    NAME = "CollectionBase",
    CMDC = "Cannot modify a disposed collection.",
    CMRO = "Cannot modify a read-only collection.";
const
    LINQ_PATH = "../../System.Linq/Linq";


export abstract class _CollectionBase<T> extends ArrayLikeCollection<T> implements _ICollection<T>, IEnumerateEach<T>
{

    constructor(
        source?: IEnumerableOrArray<T> | IEnumerator<T>,
        protected _equalityComparer: EqualityComparison<T | null | undefined> = areEqual) {
        super();
        const _ = this;
        _._disposableObjectName = NAME;
        _._importEntries(source);
        _._updateRecursion = 0;
        _._modifiedCount = 0;
        _._version = 0;
    }


    protected abstract getCount(): number;

    get Count(): number {
        return this.getCount();
    }

    protected getIsReadOnly(): boolean {
        return false;
    }

    //noinspection JSUnusedGlobalSymbols
    get IsReadOnly(): boolean {
        return this.getIsReadOnly();
    }

    protected assertModifiable(): true | never {
        this.throwIfDisposed(CMDC);
        if (this.getIsReadOnly())
            throw new InvalidOperationException(CMRO);
        return true;
    }

    protected _version: number = 0; // Provides an easy means of tracking changes and invalidating enumerables.


    protected assertVersion(version: number): true | never {
        if (version !== this._version)
            throw new InvalidOperationException("Collection was modified.");

        return true;
    }

	/*
	 * Note: Avoid changing modified count by any means but ++;
	 * If setting modified count by the result of a closure it may be a negative number or NaN and ruin the pattern.
	 */
    private _modifiedCount: number = 0;
    private _updateRecursion: number = 0;

    protected _onModified(): void { }

    protected _signalModification(increment?: boolean): boolean {
        const _ = this;
        if (increment) _._modifiedCount++;
        if (_._modifiedCount && !this._updateRecursion) {
            _._modifiedCount = 0;
            _._version++;
            try {
                _._onModified();
            }
            catch (ex) {
                // Avoid fatal errors which may have been caused by consumer.
                console.error(ex);
            }
            return true;
        }
        return false;
    }

    protected _incrementModified(): void { this._modifiedCount++; }

    //noinspection JSUnusedGlobalSymbols
    get isUpdating(): boolean { return this._updateRecursion != 0; }

	/**
	 * Takes a closure that if returning true will propagate an update signal.
	 * Multiple update operations can be occurring at once or recursively and the onModified signal will only occur once they're done.
	 * @param closure
	 * @returns {boolean}
	 */
    handleUpdate(closure?: () => boolean): boolean {
        if (!closure) return false;
        const _ = this;
        _.assertModifiable();
        _._updateRecursion++;
        let updated: boolean = false;

        try {
            if (updated = closure())
                _._modifiedCount++;
        }
        finally {
            _._updateRecursion--;
        }

        _._signalModification();

        return updated;
    }

    protected abstract _addInternal(entry: T): boolean;

	/*
	 * Note: for a slight amount more code, we avoid creating functions/closures.
	 * Calling handleUpdate is the correct pattern, but if possible avoid creating another function scope.
	 */

	/**
	 * Adds an entry to the collection.
	 * @param entry
	 */
    add(entry: T): int {
        const _ = this;
        _.assertModifiable();
        _._updateRecursion++;

        try { if (_._addInternal(entry)) _._modifiedCount++; }
        finally { _._updateRecursion--; }

        _._signalModification();

        return 1;
    }

    protected abstract _removeInternal(entry: T, max?: number): number;

	/**
	 * Removes entries from the collection allowing for a limit.
	 * For example if the collection not a distinct set, more than one entry could be removed.
	 * @param entry The entry to remove.
	 * @param max Limit of entries to remove.  Will remove all matches if no max specified.
	 * @returns {number} The number of entries removed.
	 */
    remove(entry: T, max: number = Infinity): number {
        const _ = this;
        _.assertModifiable();
        _._updateRecursion++;

        let n: number = NaN;
        try { if (n = _._removeInternal(entry, max)) _._modifiedCount++; }
        finally { _._updateRecursion--; }

        _._signalModification();
        return n;
    }

    protected abstract _clearInternal(): number;

	/**
	 * Clears the contents of the collection resulting in a count of zero.
	 * @returns {number}
	 */
    clear(): number {
        const _ = this;
        _.assertModifiable();
        _._updateRecursion++;

        let n: number = NaN;
        try { if (n = _._clearInternal()) _._modifiedCount++; }
        finally { _._updateRecursion--; }

        _._signalModification();

        return n;
    }

    protected _onDispose(): void {
        super._onDispose();
        this._clearInternal();
        this._version = 0;
        this._updateRecursion = 0;
        this._modifiedCount = 0;
		/* const l = this._linq;
		this._linq = void 0; */
        //if(l) l.dispose();
    }

    protected _importEntries(entries: IEnumerableOrArray<T> | IEnumerator<T> | null | undefined): number {
        let added = 0;
        if (entries) {
            if ((entries) instanceof (Array)) {
                // Optimize for avoiding a new closure.
                for (let e of entries) {
                    if (this._addInternal(e)) added++;
                }
            }
            else {
                forEach(entries, e => {
                    if (this._addInternal(e)) added++;
                });
            }
        }
        return added;
    }

	/**
	 * Safely imports any array enumerator, or enumerable.
	 * @param entries
	 * @returns {number}
	 */
    importEntries(entries: IEnumerableOrArray<T> | IEnumerator<T>): number {
        const _ = this;
        if (!entries) return 0;
        _.assertModifiable();
        _._updateRecursion++;

        let n: number = NaN;
        try { if (n = _._importEntries(entries)) _._modifiedCount++; }
        finally { _._updateRecursion--; }

        _._signalModification();
        return n;
    }
    /**
     * Returns a enumerator for this collection.
     */
    abstract GetEnumerator(): IEnumerator<T>;

    /**
     * Returns an array filtered by the provided predicate.
     * Provided for similarity to JS Array.
     * @param predicate
     * @returns {[]}
     */
    _filter(predicate: PredicateWithIndex<T>): T[] {
        if (!predicate) throw new ArgumentNullException('predicate');
        let count = !this.getCount();
        let result: T[] = [];
        if (count) {
            this.forEach((e, i) => {
                if (predicate(e, i))
                    result.push(e);
            });
        }
        return result;
    }

	/**
	 * Returns true the first time predicate returns true.  Otherwise false.
	 * Useful for searching through a collection.
	 * @param predicate
	 * @returns {any}
	 */
    any(predicate?: PredicateWithIndex<T>): boolean {
        let count = this.getCount();
        if (!count) return false;
        if (!predicate) return Boolean(count);

        let found: boolean = false;
        this.forEach((e, i) => !(found = predicate(e, i)));
        return found;
    }

	/**
	 * Returns true the first time predicate returns true.  Otherwise false.
	 * See '.any(predicate)'.  As this method is just just included to have similarity with a JS Array.
	 * @param predicate
	 * @returns {any}
	 */
    _some(predicate?: PredicateWithIndex<T>): boolean {
        return this.any(predicate);
    }


	/**
	 * Returns true if the equality comparer resolves true on any element in the collection.
	 * @param entry
	 * @returns {boolean}
	 */
    contains(entry: T): boolean {
        const equals = this._equalityComparer;
        return this.any(e => equals(entry, e));
    }


	/**
	 * Special implementation of 'forEach': If the action returns 'false' the enumeration will stop.
	 * @param action
	 * @param useCopy
	 */
    _forEach(action: ActionWithIndex<T>, useCopy?: boolean): number
    _forEach(action: PredicateWithIndex<T>, useCopy?: boolean): number
    _forEach(action: ActionWithIndex<T> | PredicateWithIndex<T>, useCopy?: boolean): number {
        if (this.wasDisposed)
            return 0;

        if (useCopy) {
            const a = this.toArray();
            try {
                return forEach(a, action);
            }
            finally {
                a.length = 0;
            }
        }
        else {
            return forEach(this.GetEnumerator(), action);
        }
    }

	/**
	 * Copies all values to numerically indexable object.
	 * @param target
	 * @param index
	 * @returns {TTarget}
	 */
    public copyTo(
        target: Array<T>,
        index: number = 0): Array<T> {
        if (!target) throw new ArgumentNullException('target');

        const count = this.getCount();
        if (count) {
            const newLength = count + index;
            if (target.length < newLength) target.length = newLength;

            const e = this.GetEnumerator();
            while (e.MoveNext()) // Disposes when finished.
            {
                target[index++] = <any>e.Current;
            }
        }
        return target;
    }

    /**
     * Returns an array of the collection contents.
     * @returns {any[]|Array}
     */
    toArray(): T[] {
        const count = this.getCount();
        return count
            ? this.copyTo(count > 65536 ? new Array<T>(count) : [])
            : [];
    }


}
