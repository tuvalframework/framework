import { LinkedNodeList } from "./LinkedNodeList";
import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { forEach } from "./enumeration_/Enumerator";
import { EmptyEnumerator } from "./enumeration_/EmptyEnumerator";
import { using } from "../Disposable/dispose";
import { areEqual } from "../Compare";
import {  _CollectionBase } from "./CollectionBase";
import { IDisposable } from "../Disposable/IDisposable";
import { ILinkedNodeWithValue } from "./ILinkedListNode";
import { IEnumerableOrArray } from "./IEnumerableOrArray";
import { ISet } from "./ISet";
import { IEnumerator } from "./enumeration_/IEnumerator";

const VOID0: undefined = void 0;
const OTHER = 'other';

export abstract class SetBase<T> extends _CollectionBase<T> implements ISet<T>, IDisposable {

	constructor(source?: IEnumerableOrArray<T>) {
		super(VOID0, areEqual);
		this._importEntries(source);
	}

	protected abstract newUsing(source?: IEnumerableOrArray<T>): SetBase<T>;

	protected _set: LinkedNodeList<ILinkedNodeWithValue<T>> = undefined as any;

	protected _getSet(): LinkedNodeList<ILinkedNodeWithValue<T>> {
		let s = this._set;
		if (!s) this._set = s = new LinkedNodeList<ILinkedNodeWithValue<T>>();
		return s;
	}

	protected getCount(): number {
		return this._set ? this._set.unsafeCount : 0;
	}

	public exceptWith(other: IEnumerableOrArray<T>): void {
		if (!other) {
			throw new ArgumentNullException(OTHER);
		}

		forEach(other, v => {
			if (this._removeInternal(v))
				this._incrementModified();
		});

		this._signalModification();
	}

	intersectWith(other: IEnumerableOrArray<T>): void {
		if (!other) throw new ArgumentNullException(OTHER);

		const _ = this;
		if (other instanceof SetBase) {
			let s = _._set;
			if (s) s._forEach(n => {
				if (!other.contains(n.value) && _._removeInternal(<any>n.value))
					_._incrementModified();
			}, true);

			_._signalModification();
		}
		else {
			using(_.newUsing(other), o => _.intersectWith(o));
		}
	}

	isProperSubsetOf(other: IEnumerableOrArray<T>): boolean {
		if (!other) throw new ArgumentNullException(OTHER);

		return other instanceof SetBase
			? other.isProperSupersetOf(this)
			: using(this.newUsing(other), o => o.isProperSupersetOf(this));
	}

	isProperSupersetOf(other: IEnumerableOrArray<T>): boolean {
		if (!other) throw new ArgumentNullException(OTHER);

		let result = true, count: number;
		if (other instanceof SetBase) {
			result = this.isSupersetOf(other);
			count = other.getCount();
		}
		else {
			count = using(this.newUsing(), o => {
				forEach(other, v => {
					o.add(v); // We have to add to another set in order to filter out duplicates.
					// contains == false will cause this to exit.
					return result = this.contains(v);
				});
				return o.getCount();
			});
		}

		return result && this.getCount() > count;
	}

	isSubsetOf(other: IEnumerableOrArray<T>): boolean {
		if (!other) throw new ArgumentNullException(OTHER);

		return other instanceof SetBase
			? other.isSupersetOf(this)
			: using(this.newUsing(other), o => o.isSupersetOf(this));
	}

	isSupersetOf(other: IEnumerableOrArray<T>): boolean {
		if (!other) throw new ArgumentNullException(OTHER);

		let result = true;
		forEach(other, v => {
			return result = this.contains(v);
		});
		return result;
	}

	overlaps(other: IEnumerableOrArray<T>): boolean {
		if (!other) throw new ArgumentNullException(OTHER);

		let result = false;
		forEach(other, v => !(result = this.contains(v)));
		return result;
	}

	setEquals(other: IEnumerableOrArray<T>): boolean {
		if (!other) throw new ArgumentNullException(OTHER);

		return this.getCount() == (
			other instanceof SetBase
				? other.getCount()
				: using(this.newUsing(other), o => o.getCount()))
			&& this.isSubsetOf(other);
	}

	symmetricExceptWith(other: IEnumerableOrArray<T>): void {
		if (!other) throw new ArgumentNullException(OTHER);

		const _ = this;
		if (other instanceof SetBase) {
			forEach(other, v => {
				if (_.contains(<any>v)) {
					if (_._removeInternal(<any>v))
						_._incrementModified();
				}
				else {
					if (_._addInternal(<any>v))
						_._incrementModified();
				}
			});

			_._signalModification();
		}
		else {
			using(this.newUsing(other), o => _.symmetricExceptWith(o));
		}
	}

	unionWith(other: IEnumerableOrArray<T>): void {
		this.importEntries(other);
	}


	protected _clearInternal(): number {
		const s = this._set;
		return s ? s.clear() : 0;
	}

	protected _onDispose(): void {
		super._onDispose();
		this._set = <any>null;
	}

	protected abstract _getNode(item: T): ILinkedNodeWithValue<T> | undefined;

	contains(item: T): boolean {
		return !(!this.getCount() || !this._getNode(item));
	}

	GetEnumerator(): IEnumerator<T> {
		const _ = this;
		_.throwIfDisposed();
		const s = _._set;
		return s && _.getCount()
			? LinkedNodeList.valueEnumeratorFrom<T>(s)
			: EmptyEnumerator;
	}

	/* 	forEach(action:ActionWithIndex<T>, useCopy?:boolean):number
		forEach(action:PredicateWithIndex<T>, useCopy?:boolean):number
		forEach(action:ActionWithIndex<T> | PredicateWithIndex<T>, useCopy?:boolean):number
		{
			return useCopy
				? super.forEach(action, useCopy)
				: this._set.forEach((node, i)=>action(<any>node.value, i));
		} */

	protected _removeNode(node: ILinkedNodeWithValue<T> | null | undefined): boolean {
		return !!node
			&& this.remove(<any>node.value) != 0;
	}

	removeFirst(): boolean {
		const s = this._set;
		return this._removeNode(s && s.first);
	}

	removeLast(): boolean {
		const s = this._set;
		return this._removeNode(s && s.last);
	}
}