import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { _ReadOnlyCollectionBase } from "./ReadOnlyCollectionBase";
import { _ICollection } from "./ICollection";
import { _from as enumeratorFrom } from "./enumeration_/Enumerator";
import { Type } from "../Reflection";
import { IEnumerator } from "./enumeration_/IEnumerator";
import { is } from "../is";
// noinspection JSUnusedLocalSymbols
// const __extends = __extendsImport;

export class ReadOnlyCollectionWrapper<T> extends _ReadOnlyCollectionBase<T>
{
	constructor(collection: _ICollection<T> | ArrayLike<T>) {
		super();

		if (!collection)
			throw new ArgumentNullException('collection');

		const _ = this;
		// Attempting to avoid contact with the original collection.
		if (is.arrayLike(collection)) {
			_._getCount = () => (collection as any).length;
			_._getEnumerator = () => enumeratorFrom(collection);
		} else {
			_._getCount = () => (collection as any).Count;
			_._getEnumerator = () => (collection as any).getEnumerator();
		}

	}

	private __getCount: () => number = null as any;
	private __getEnumerator: () => IEnumerator<T> = null as any;

	protected _getCount(): number {
		this.throwIfDisposed();
		return this.__getCount();
	}

	protected _getEnumerator(): IEnumerator<T> {
		this.throwIfDisposed();
		return this.__getEnumerator();
	}

	protected _onDispose() {
		super._onDispose();
		this.__getCount = <any>null;
		this.__getEnumerator = <any>null;
	}
}
