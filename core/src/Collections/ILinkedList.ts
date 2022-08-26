import { _ICollection } from "./ICollection";
import { ILinkedListNode, ILinkedNode } from "./ILinkedListNode";
import { IEnumerateEach } from "./enumeration_/IEnumerateEach";

export interface ILinkedNodeList<TNode extends ILinkedNode<TNode>> {
	first: TNode | null;
	last: TNode | null;

	getNodeAt(index: number): TNode | null;
	removeNode(node: TNode): boolean;
}

export interface ILinkedList<T>
	extends ILinkedNodeList<ILinkedListNode<T>>,
	_ICollection<T>,
	IEnumerateEach<T> {
	first: ILinkedListNode<T> | null;
	last: ILinkedListNode<T> | null;

	getValueAt(index: number): T | undefined;
	_find(entry: T): ILinkedListNode<T> | null;
	findLast(entry: T): ILinkedListNode<T> | null;
	addFirst(entry: T): void;
	addLast(entry: T): void;
	removeFirst(): void;
	removeLast(): void;
	addAfter(node: ILinkedListNode<T>, entry: T): void;
}