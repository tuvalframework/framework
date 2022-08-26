
import { _ReadOnlyCollectionBase } from "./ReadOnlyCollectionBase";
import { IEnumerable } from "./enumeration_/IEnumerable";
import { Action } from "../FunctionTypes";
import { IReadOnlyList } from "./IList";
import { ArgumentOutOfRangeException } from "../Exceptions/ArgumentOutOfRangeException";
import { EnumeratorBase } from "./enumeration_/EnumeratorBase";
import { Integer } from "../Integer";
import { IEnumerator } from "./enumeration_/IEnumerator";

export class LazyList<T> extends _ReadOnlyCollectionBase<T> implements IReadOnlyList<T>
{

	private _enumerator: IEnumerator<T> | null;
	private _cached: T[] | null;

	constructor(source: IEnumerable<T>) {
		super();
		this._enumerator = source.GetEnumerator();
		this._cached = [];
	}

	protected _onDispose(): void {
		super._onDispose();
		const e = this._enumerator;
		this._enumerator = null;
		if (e) e.Dispose();

		const c = this._cached;
		this._cached = null;
		if (c) c.length = 0;
	}

	protected _getCount(): number {
		this.finish();
		const c = this._cached;
		return c ? c.length : 0;
	}

	protected _getEnumerator(): IEnumerator<T> {
		let current: number;
		return new EnumeratorBase<T>(
			() => {
				current = 0;
			},
			yielder => {
				this.throwIfDisposed();
				const c = this._cached!;
				return (current < c.length || this.getNext())
					? yielder.yieldReturn(c[current++])
					: yielder.yieldBreak();
			});
	}

	get(index: number): T {
		this.throwIfDisposed();
		Integer.assertZeroOrGreater(index);

		const c = this._cached!;
		while (c.length <= index && this.getNext()) { }

		if (index < c.length)
			return c[index];

		throw new ArgumentOutOfRangeException("index", "Greater than total count.");
	}

	indexOf(item: T): number {
		this.throwIfDisposed();
		const c = this._cached!;
		let result = c.indexOf(item);
		while (result == -1 && this.getNext(value => {
			if (value == item)
				result = c.length - 1;
		})) { }
		return result;
	}

	contains(item: T): boolean {
		return this.indexOf(item) != -1;
	}

	private getNext(out?: Action<T>): boolean {
		const e = this._enumerator;
		if (!e) return false;
		if (e.MoveNext()) {
			const value = e.Current!;
			this._cached!.push(value);
			if (out) out(value);
			return true;
		}
		else {
			e.Dispose();
			this._enumerator = <any>null;
		}
		return false;
	}


	private finish(): void {
		while (this.getNext()) { }
	}


}