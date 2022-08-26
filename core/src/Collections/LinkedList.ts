﻿import { areEqual } from "../Compare";
import { LinkedNodeList } from "./LinkedNodeList";
import { InvalidOperationException } from "../Exceptions/InvalidOperationException";
import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { CollectionBase, _CollectionBase } from "./CollectionBase";
import { ILinkedListNode, ILinkedNode, INodeWithValue } from "./ILinkedListNode";
import { ActionWithIndex, EqualityComparison, PredicateWithIndex } from "../FunctionTypes";
import { ILinkedList } from "./ILinkedList";
import { IEnumerableOrArray } from "./IEnumerableOrArray";
import { IDisposable } from "../Disposable/IDisposable";
import { IEnumerator } from "./enumeration_/IEnumerator";

const VOID0: undefined = void 0;


class InternalNode<T> implements ILinkedNode<InternalNode<T>>, INodeWithValue<T>
{
	constructor(
		public value: T,
		public previous?: InternalNode<T> | null,
		public next?: InternalNode<T> | null) {
	}

	external?: ILinkedListNode<T>;

	assertDetached(): true | never {
		if (this.next || this.previous)
			throw new InvalidOperationException(
				"Adding a node that is already placed.");
		return true;
	}

}

function ensureExternal<T>(
	node: InternalNode<T> | null | undefined,
	list: _LinkedList<T>): ILinkedListNode<T> | null {
	if (!node)
		return null;
	if (!list)
		throw new ArgumentNullException("list");

	let external = node.external;
	if (!external)
		node.external = external = new LinkedListNode<T>(list, node);

	return external || null;
}

function getInternal<T>(node: ILinkedListNode<T>, list: _LinkedList<T>): InternalNode<T> {
	if (!node)
		throw new ArgumentNullException("node");
	if (!list)
		throw new ArgumentNullException("list");

	if (node.list != list)
		throw new InvalidOperationException(
			"Provided node does not belong to this list.");

	let n: InternalNode<T> = (<any>node)._nodeInternal;
	if (!n)
		throw new InvalidOperationException(
			"Provided node is not valid.");

	return n;
}

function detachExternal(node: InternalNode<any>): void {
	if (node) {
		const e: any = node.external;
		if (e) {
			e._list = VOID0;
			e._nodeInternal = VOID0;
		}
		node.external = VOID0;
	}
}

export class _LinkedList<T> extends _CollectionBase<T> implements ILinkedList<T>
{
	private readonly _listInternal: LinkedNodeList<InternalNode<T>>;

	constructor(
		source?: IEnumerableOrArray<T>,
		equalityComparer: EqualityComparison<T> = areEqual) {
		super(VOID0, equalityComparer as any);
		this._listInternal = new LinkedNodeList<InternalNode<T>>();
		this._importEntries(source);
	}

	protected assertVersion(version: number): true | never {
		if (this._listInternal)
			return this._listInternal.assertVersion(version);
		else // In case it's been disposed.
			return super.assertVersion(version);
	}

	protected _onDispose(): void {
		super._onDispose();
		const l = this._listInternal;
		(<any>this)._listInternal = null;
		l.Dispose();
	}

	protected getCount(): number {
		const li = this._listInternal;
		return li ? li.unsafeCount : 0;
	}

	protected _addInternal(entry: T): boolean {
		this._listInternal.addNode(new InternalNode(entry));
		return true;
	}

	protected _removeInternal(entry: T, max: number = Infinity): number {
		const _ = this,
			equals = _._equalityComparer,
			list = _._listInternal;
		let removedCount = 0;

		list._forEach(node => {
			if (node && equals(entry, node.value) && _._removeNodeInternal(node))
				removedCount++;

			return removedCount < max;
		}, true /* override versioning check */);

		return removedCount;
	}

	protected _clearInternal(): number {
		const list = this._listInternal;
		list._forEach(node => detachExternal(node));
		return list.clear();
	}

	_forEach(action: ActionWithIndex<T>, useCopy?: boolean): number;
	_forEach(action: PredicateWithIndex<T>, useCopy?: boolean): number;
	_forEach(action: ActionWithIndex<T> | PredicateWithIndex<T>,
		useCopy: boolean = false): number {
		this.throwIfDisposed();
		return useCopy
			? super._forEach(action, useCopy)
			: this._listInternal._forEach((node, i) => action(<any>node.value, i));
	}

	// #endregion

	// #region IEnumerable<T>
	GetEnumerator(): IEnumerator<T> {
		this.throwIfDisposed();
		return LinkedNodeList.valueEnumeratorFrom<T>(<any>this._listInternal);
	}

	// #endregion

	private _findFirst(entry: T): InternalNode<T> | null {
		//noinspection UnnecessaryLocalVariableJS
		const
			_ = this,
			equals = _._equalityComparer;

		let next: any = _._listInternal && _._listInternal.first;
		while (next) {
			if (equals(entry, next.value))
				return next;
			next = next.next;
		}
		return null;
	}

	private _findLast(entry: T): InternalNode<T> | null {
		//noinspection UnnecessaryLocalVariableJS
		const
			_ = this,
			equals = _._equalityComparer;

		let prev: any = _._listInternal && _._listInternal.last;
		while (prev) {
			if (equals(entry, prev.value))
				return prev;
			prev = prev.previous;
		}
		return null;
	}

	removeOnce(entry: T): boolean {
		return this.remove(entry, 1) !== 0;
	}

	get first(): ILinkedListNode<T> | null {
		const li = this._listInternal;
		return li && ensureExternal(li.first, this);
	}

	get firstValue(): T | undefined {
		const li = this._listInternal, node = li && li.first;
		return node ? node.value : VOID0;
	}

	get last(): ILinkedListNode<T> | null {
		const li = this._listInternal;
		return ensureExternal(li.last, this);
	}

	get lastValue(): T | undefined {
		const li = this._listInternal, node = li && li.last;
		return node ? node.value : VOID0;
	}

	// get methods are available for convenience but is an n*index operation.


	getValueAt(index: number): T | undefined {
		const li = this._listInternal, node = li && li.getNodeAt(index);
		return node ? node.value : VOID0;
	}

	getNodeAt(index: number): ILinkedListNode<T> | null {
		const li = this._listInternal;
		return li && ensureExternal(li.getNodeAt(index), this);
	}

	_find(entry: T): ILinkedListNode<T> | null {
		const li = this._listInternal;
		return li && ensureExternal(this._findFirst(entry), this);
	}

	findLast(entry: T): ILinkedListNode<T> | null {
		const li = this._listInternal;
		return li && ensureExternal(this._findLast(entry), this);
	}

	addFirst(entry: T): this {
		this.assertModifiable();
		this._listInternal.addNodeBefore(new InternalNode(entry));
		this._signalModification(true);
		return this;
	}

	addLast(entry: T): this {
		return this.add(entry) as any;
	}

	private _removeNodeInternal(node: InternalNode<T> | null | undefined): boolean {
		const _ = this;
		if (node && _._listInternal.removeNode(node)) {
			detachExternal(node);
			_._signalModification(true);
			return true;
		}
		return false;
	}

	removeFirst(): boolean {
		const _ = this;
		_.assertModifiable();
		return _._removeNodeInternal(_._listInternal.first);
	}

	removeLast(): boolean {
		const _ = this;
		_.assertModifiable();
		return _._removeNodeInternal(_._listInternal.last);
	}

	removeAt(index: number): boolean {
		const _ = this;
		_.assertModifiable();
		return _._removeNodeInternal(_._listInternal.getNodeAt(index));
	}

	// Returns true if successful and false if not found (already removed).
	removeNode(node: ILinkedListNode<T>): boolean {
		const _ = this;
		_.assertModifiable();
		return _._removeNodeInternal(getInternal(node, _));
	}

	addBefore(before: ILinkedListNode<T>, entry: T): this {
		const _ = this;
		_.assertModifiable();
		_._listInternal.addNodeBefore(
			new InternalNode(entry),
			getInternal(before, _)
		);

		_._signalModification(true);
		return this;
	}

	addAfter(after: ILinkedListNode<T>, entry: T): this {
		const _ = this;
		_.assertModifiable();
		_._listInternal.addNodeAfter(
			new InternalNode(entry),
			getInternal(after, _)
		);

		_._signalModification(true);
		return this;
	}

}

// Use an internal node class to prevent mucking up the LinkedList.
class LinkedListNode<T> implements ILinkedListNode<T>, IDisposable {
	constructor(
		private _list: _LinkedList<T>,
		private _nodeInternal: InternalNode<T>) {
	}

	private throwIfDetached(): void {
		if (!this._list)
			throw new Error("This node has been detached from its list and is no longer valid.");
	}

	get list(): _LinkedList<T> {
		return this._list;
	}

	get previous(): ILinkedListNode<T> | null {
		this.throwIfDetached();
		return ensureExternal(this._nodeInternal.previous, this._list);
	}

	get next(): ILinkedListNode<T> | null {
		this.throwIfDetached();
		return ensureExternal(this._nodeInternal.next, this._list);
	}

	get value(): T {
		this.throwIfDetached();
		return this._nodeInternal.value;
	}

	set value(v: T) {
		this.throwIfDetached();
		this._nodeInternal.value = v;
	}

	addBefore(entry: T): this {
		this.throwIfDetached();
		this._list.addBefore(this, entry);
		return this;
	}

	addAfter(entry: T): this {
		this.throwIfDetached();
		this._list.addAfter(this, entry);
		return this;
	}


	remove(): void {
		const _: any = this;
		const list = _._list;
		if (list) list.removeNode(this);
		_._list = VOID0;
		_._nodeInternal = VOID0;
	}

	Dispose(): void {
		this.remove();
	}

}
