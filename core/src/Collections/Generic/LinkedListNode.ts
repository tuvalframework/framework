import { ClassInfo } from "../../Reflection/Decorators/ClassInfo";
import { System } from "../../SystemTypes";
import { LinkedList } from "./LinkedList";


@ClassInfo({
    fullName: System.Types.Collections.Generics.LinkedListNode,
    instanceof: [
        System.Types.Collections.Generics.LinkedListNode
    ]
})
export class LinkedListNode<T> {
    public /* internal */  list: LinkedList<T> = null as any;
    public /* internal */  next: LinkedListNode<T> = null as any;
    public /* internal */ prev: LinkedListNode<T> = null as any;
    public /* internal */  item: T = null as any;

    public constructor(value: T);
    public constructor(list: LinkedList<T>, value: T);
    public constructor(...args: any[]) {
        if (args.length === 1) {
            const value: T = args[0];
            this.item = value;
        } else if (args.length === 2) {
            const list: LinkedList<T> = args[0];
            const value: T = args[1];
            this.list = list;
            this.item = value;
        }
    }


    public get List(): LinkedList<T> {
        return this.list;
    }

    public get Next(): LinkedListNode<T> {
        return this.next == null || this.next === this.list.head ? null as any : this.next;
    }

    public get Previous(): LinkedListNode<T> {
        return this.prev == null || this === this.list.head ? null as any : this.prev;
    }


    public get Value(): T {
        return this.item;
    }
    public set Value(value: T) {
        this.item = value;
    }

    public /* internal */  Invalidate(): void {
       this.list = null as any;
       this.next = null as any;
       this.prev = null as any;
    }
}