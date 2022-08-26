import { ArgumentException } from "../../Exceptions/ArgumentException";
import { ArgumentNullException } from "../../Exceptions/ArgumentNullException";
import { ArgumentOutOfRangeException } from '../../Exceptions/ArgumentOutOfRangeException';
import { InvalidOperationException } from "../../Exceptions/InvalidOperationException";
import { int } from "../../float";
import { foreach } from "../../foreach";
import { is } from "../../is";
import { SR } from "../../SR";
import { IEnumerable } from "../enumeration_/IEnumerable";
import { IEnumerator } from "../enumeration_/IEnumerator";
import { EqualityComparer } from "./EqualityComparer";
import { ICollection } from "./ICollection";
import { IReadOnlyCollection } from "./IReadOnlyCollection";
import { LinkedListNode } from "./LinkedListNode";
import { System } from '../../SystemTypes';
import { IIteratorResult } from "../enumeration_";
import { ClassInfo } from "../../Reflection/Decorators/ClassInfo";

@ClassInfo({
    fullName: System.Types.Collections.Generics.LinkedList,
    instanceof: [
        System.Types.Collections.Generics.LinkedList,
        System.Types.Collections.ICollection,
        System.Types.Collections.Enumeration.IEnumerable,
        System.Types.Collections.IReadOnlyCollection
    ]
})
export class LinkedList<T> implements ICollection<T>, IReadOnlyCollection<T> {
    // This LinkedList is a doubly-Linked circular list.
    public /* internal */  head: LinkedListNode<T> = null as any;
    public /* internal */  count: int = 0;
    public /* internal */  version: int = 0;

    // names for serialization
    private static readonly VersionName: string = "Version";
    private static readonly CountName: string = "Count";
    private static readonly ValuesName: string = "Data";

    public constructor();
    public constructor(collection: IEnumerable<T>);
    public constructor(...args: any[]) {
        if (args.length === 0) {

        } else if (args.length === 1) {
            const collection: IEnumerable<T> = args[0];
            if (collection == null) {
                throw new ArgumentNullException("collection");
            }

            foreach(collection, (item: T) => {
                this.AddLast(item);
            });
        }
    }



    public get Count(): int {
        return this.count;
    }

    public get First(): LinkedListNode<T> {
        return this.head;
    }

    public get Last(): LinkedListNode<T> {
        return this.head == null ? null as any : this.head.prev;
    }


    public get IsReadOnly(): boolean {
        return false;
    }

    public Add(value: T): void {
        this.AddLast(value);
    }

    public AddAfter(node: LinkedListNode<T>, newNode: LinkedListNode<T>): void;
    public AddAfter(node: LinkedListNode<T>, value: T): LinkedListNode<T>;
    public AddAfter(...args: any[]): LinkedListNode<T> | void {
        if (args.length === 2 && is.typeof<LinkedListNode<T>>(args[0], System.Types.Collections.Generics.LinkedListNode) && is.typeof<LinkedListNode<T>>(args[1], System.Types.Collections.Generics.LinkedListNode)) {
            const node: LinkedListNode<T> = args[0];
            const newNode: LinkedListNode<T> = args[1];
            this.ValidateNode(node);
            this.ValidateNewNode(newNode);
            this.InternalInsertNodeBefore(node.next, newNode);
            newNode.list = this;
        } else if (args.length === 2 && is.typeof<LinkedListNode<T>>(args[0], System.Types.Collections.Generics.LinkedListNode)) {
            const node: LinkedListNode<T> = args[0];
            const value: T = args[1];
            this.ValidateNode(node);
            const result: LinkedListNode<T> = new LinkedListNode<T>(node.list, value);
            this.InternalInsertNodeBefore(node.next, result);
            return result;
        } else {
            throw new ArgumentOutOfRangeException('');
        }
    }

    public AddBefore(node: LinkedListNode<T>, newNode: LinkedListNode<T>): void;
    public AddBefore(node: LinkedListNode<T>, value: T): LinkedListNode<T>;
    public AddBefore(...args: any[]): LinkedListNode<T> | void {
        if (args.length === 2 && is.typeof<LinkedListNode<T>>(args[0], System.Types.Collections.Generics.LinkedListNode) && is.typeof<LinkedListNode<T>>(args[1], System.Types.Collections.Generics.LinkedListNode)) {
            const node: LinkedListNode<T> = args[0];
            const newNode: LinkedListNode<T> = args[1];
            this.ValidateNode(node);
            this.ValidateNewNode(newNode);
            this.InternalInsertNodeBefore(node, newNode);
            newNode.list = this;
            if (node == this.head) {
                this.head = newNode;
            }
        } else if (args.length === 2 && is.typeof<LinkedListNode<T>>(args[0], System.Types.Collections.Generics.LinkedListNode)) {
            const node: LinkedListNode<T> = args[0];
            const value: T = args[1];
            this.ValidateNode(node);
            const result: LinkedListNode<T> = new LinkedListNode<T>(node.list, value);
            this.InternalInsertNodeBefore(node, result);
            if (node === this.head) {
                this.head = result;
            }
            return result;
        } else {
            throw new ArgumentOutOfRangeException('');
        }
    }

    public AddFirst(node: LinkedListNode<T>): void;
    public AddFirst(value: T): LinkedListNode<T>;
    public AddFirst(...args: any[]): LinkedListNode<T> | void {
        if (args.length === 1 && is.typeof<LinkedListNode<T>>(args[0], System.Types.Collections.Generics.LinkedListNode)) {
            const node: LinkedListNode<T> = args[0];
            this.ValidateNewNode(node);

            if (this.head == null) {
                this.InternalInsertNodeToEmptyList(node);
            }
            else {
                this.InternalInsertNodeBefore(this.head, node);
                this.head = node;
            }
            node.list = this;
        } else if (args.length === 1) {
            const value: T = args[0];
            const result: LinkedListNode<T> = new LinkedListNode<T>(this, value);
            if (this.head == null) {
                this.InternalInsertNodeToEmptyList(result);
            }
            else {
                this.InternalInsertNodeBefore(this.head, result);
                this.head = result;
            }
            return result;
        }
    }

    public AddLast(node: LinkedListNode<T>): void;
    public AddLast(value: T): LinkedListNode<T>;
    public AddLast(...args: any[]): LinkedListNode<T> | void {
        if (args.length === 1 && is.typeof<LinkedListNode<T>>(args[0], System.Types.Collections.Generics.LinkedListNode)) {
            const node: LinkedListNode<T> = args[0];
            this.ValidateNewNode(node);

            if (this.head == null) {
                this.InternalInsertNodeToEmptyList(node);
            }
            else {
                this.InternalInsertNodeBefore(this.head, node);
            }
            node.list = this;
        } else if (args.length === 1) {
            const value: T = args[0];
            const result: LinkedListNode<T> = new LinkedListNode<T>(this, value);
            if (this.head == null) {
                this.InternalInsertNodeToEmptyList(result);
            }
            else {
                this.InternalInsertNodeBefore(this.head, result);
            }
            return result;
        }
    }

    public Clear(): void {
        let current: LinkedListNode<T> = this.head;
        while (current != null) {
            const temp: LinkedListNode<T> = current;
            current = current.Next;   // use Next the instead of "next", otherwise it will loop forever
            temp.Invalidate();
        }

        this.head = null as any;
        this.count = 0;
        this.version++;
    }

    public Contains(value: T): boolean {
        return this.Find(value) != null;
    }

    public CopyTo(array: T[], index: int): void {
        if (array == null) {
            throw new ArgumentNullException("array");
        }

        if (index < 0 || index > array.length) {
            throw new ArgumentOutOfRangeException("index", SR.GetString(SR.IndexOutOfRange, index));
        }

        if (array.length - index < this.Count) {
            throw new ArgumentException(SR.GetString(SR.Arg_InsufficientSpace));
        }

        let node: LinkedListNode<T> = this.head;
        if (node != null) {
            do {
                array[index++] = node.item;
                node = node.next;
            } while (node !== this.head);
        }
    }

    public Find(value: T): LinkedListNode<T> {
        let node: LinkedListNode<T> = this.head;
        const c: EqualityComparer<T> = EqualityComparer.Default;
        if (node != null) {
            if (value != null) {
                do {
                    if (c.Equals(node.item, value)) {
                        return node;
                    }
                    node = node.next;
                } while (node !== this.head);
            }
            else {
                do {
                    if (node.item == null) {
                        return node;
                    }
                    node = node.next;
                } while (node !== this.head);
            }
        }
        return null as any;
    }

    public FindLast(value: T): LinkedListNode<T> {
        if (this.head == null) {
            return null as any;
        }

        const last: LinkedListNode<T> = this.head.prev;
        let node: LinkedListNode<T> = last;
        const c: EqualityComparer<T> = EqualityComparer.Default;
        if (node != null) {
            if (value != null) {
                do {
                    if (c.Equals(node.item, value)) {
                        return node;
                    }

                    node = node.prev;
                } while (node != last);
            }
            else {
                do {
                    if (node.item == null) {
                        return node;
                    }
                    node = node.prev;
                } while (node != last);
            }
        }
        return null as any;
    }

    public GetEnumerator(): IEnumerator<T> {
        return new LinkedListEnumerator(this);
    }

    public Remove(node: LinkedListNode<T>): void;
    public Remove(value: T): boolean;
    public Remove(...args: any[]): boolean | void {
        if (args.length === 1 && is.typeof<LinkedListNode<T>>(args[0], System.Types.Collections.Generics.LinkedListNode)) {
            const node: LinkedListNode<T> = args[0];
            this.ValidateNode(node);
            this.InternalRemoveNode(node);
        } if (args.length === 1) {
            const value: T = args[0];
            const node: LinkedListNode<T> = this.Find(value);
            if (node != null) {
                this.InternalRemoveNode(node);
                return true;
            }
            return false;
        } else {
            throw new ArgumentOutOfRangeException('');
        }
    }

    public RemoveFirst(): void {
        if (this.head == null) {
            throw new InvalidOperationException(SR.GetString(SR.LinkedListEmpty));
        }
        this.InternalRemoveNode(this.head);
    }

    public RemoveLast(): void {
        if (this.head == null) {
            throw new InvalidOperationException(SR.GetString(SR.LinkedListEmpty));
        }
        this.InternalRemoveNode(this.head.prev);
    }

    private InternalInsertNodeBefore(node: LinkedListNode<T>, newNode: LinkedListNode<T>): void {
        newNode.next = node;
        newNode.prev = node.prev;
        node.prev.next = newNode;
        node.prev = newNode;
        this.version++;
        this.count++;
    }

    private InternalInsertNodeToEmptyList(newNode: LinkedListNode<T>): void {
        // Debug.Assert(this.head == null && this.count === 0, "LinkedList must be empty when this method is called!");
        newNode.next = newNode;
        newNode.prev = newNode;
        this.head = newNode;
        this.version++;
        this.count++;
    }

    public /* internal */  InternalRemoveNode(node: LinkedListNode<T>): void {
        // Debug.Assert(node.list == this, "Deleting the node from another list!");
        // Debug.Assert(this.head != null, "This method shouldn't be called on empty list!");
        if (node.next == node) {
            // Debug.Assert(this.count == 1 && this.head === node, "this should only be true for a list with only one node");
            this.head = null as any;
        }
        else {
            node.next.prev = node.prev;
            node.prev.next = node.next;
            if (this.head === node) {
                this.head = node.next;
            }
        }
        node.Invalidate();
        this.count--;
        this.version++;
    }

    public /* internal */  ValidateNewNode(node: LinkedListNode<T>): void {
        if (node == null) {
            throw new ArgumentNullException("node");
        }

        if (node.list != null) {
            throw new InvalidOperationException(SR.GetString(SR.LinkedListNodeIsAttached));
        }
    }


    public /* internal */  ValidateNode(node: LinkedListNode<T>): void {
        if (node == null) {
            throw new ArgumentNullException("node");
        }

        if (node.list != this) {
            throw new InvalidOperationException(SR.GetString(SR.ExternalLinkedListNode));
        }
    }
}
export class LinkedListEnumerator<T> implements IEnumerator<T> {
    private list: LinkedList<T> = null as any;
    private node: LinkedListNode<T> = null as any;
    private version: int = 0;
    private current: T = null as any;
    private index: int = 0;

    private static readonly LinkedListName: string = "LinkedList";
    private static readonly CurrentValueName: string = "Current";
    private static readonly VersionName: string = "Version";
    private static readonly IndexName: string = "Index";

    public /* internal */ constructor(list: LinkedList<T>) {
        this.list = list;
        this.version = list.version;
        this.node = list.head;
        this.current = undefined as any;
        this.index = 0;
    }
    CanMoveNext?: boolean | undefined;
    TryMoveNext(out: (value: T) => void): boolean {
        throw new Error("Method not implemented.");
    }
    End(): void {
        throw new Error("Method not implemented.");
    }
    NextValue(value?: any): T | undefined {
        throw new Error("Method not implemented.");
    }
    IsEndless?: boolean | undefined;
    Next(value?: any): IIteratorResult<T> {
        throw new Error("Method not implemented.");
    }

    public get Current(): T {
        return this.current;
    }

    public MoveNext(): boolean {
        if (this.version !== this.list.version) {
            throw new InvalidOperationException(SR.GetString(SR.InvalidOperation_EnumFailedVersion));
        }

        if (this.node == null) {
            this.index = this.list.Count + 1;
            return false;
        }

        ++this.index;
        this.current = this.node.item;
        this.node = this.node.next;
        if (this.node === this.list.head) {
            this.node = null as any;
        }
        return true;
    }

    public Reset(): void {
        if (this.version !== this.list.version) {
            throw new InvalidOperationException(SR.GetString(SR.InvalidOperation_EnumFailedVersion));
        }

        this.current = undefined as any;
        this.node = this.list.head;
        this.index = 0;
    }

    public Dispose(): void {
    }
}