import { int, New } from '../../float';
import { IEnumerable } from "../enumeration_/IEnumerable";
import { IReadOnlyCollection } from "../IReadOnlyCollection";
import { ICollection } from "./ICollection";
import { ThrowHelper } from '../../ThrowHelper';
import { ExceptionArgument } from '../../ExceptionArgument';
import { ExceptionResource } from '../../ExceptionResource';
import { is } from '../../is';
import { System } from '../../SystemTypes';
import { IEnumerator } from '../enumeration_/IEnumerator';
import { TArray } from '../../Extensions/TArray';
import { EqualityComparer } from './EqualityComparer';
import { using } from '../../Disposable';
import { IIteratorResult } from '../enumeration_';
import { Action } from '../../FunctionTypes';
import { ClassInfo } from '../../Reflection/Decorators/ClassInfo';

@ClassInfo({
    fullName: System.Types.Collections.Generics.Queue,
    instanceof: [
        System.Types.Collections.Generics.Queue,
        System.Types.Collections.ICollection,
        System.Types.Collections.Enumeration.IEnumerable,
        System.Types.ICloneable
    ]
})
export class Queue<T> implements IEnumerable<T>, ICollection<T>, IReadOnlyCollection<T> {
    private _array: T[] = null as any;
    private _head: int = 0;       // First valid element in the queue
    private _tail: int = 0;       // Last valid element in the queue
    private _size: int = 0;       // Number of elements.
    private _version: int = 0;

    private static readonly _MinimumGrow: int = 4;
    private static readonly _ShrinkThreshold: int = 32;
    private static readonly _GrowFactor: int = 200;  // double each time
    private static readonly _DefaultCapacity: int = 4;
    private static _emptyArray: any[] = [];

    IsEndless?: boolean | undefined;
    IsReadOnly: boolean = false;
    Add(item: T): void {
        throw new Error('Method not implemented.');
    }
    Remove(item: T): boolean {
        throw new Error('Method not implemented.');
    }
    contains(entry: T): boolean {
        throw new Error('Method not implemented.');
    }
    copyTo(target: T[], index?: number): T[] {
        throw new Error('Method not implemented.');
    }
    toArray(): T[] {
        throw new Error('Method not implemented.');
    }
    // Creates a queue with room for capacity objects. The default initial
    // capacity and grow factor are used.
    /// <include file='doc\Queue.uex' path='docs/doc[@for="Queue.Queue"]/*' />
    public constructor();
    public constructor(capacity: int);
    public constructor(collection: IEnumerable<T>);
    public constructor(array: ArrayLike<T>);
    public constructor(...args: any[]) {
        if (args.length === 0) {
            this._array = Queue._emptyArray;
        } else if (args.length === 1 && is.int(args[0])) {
            const capacity: int = args[0];
            if (capacity < 0)
                ThrowHelper.ThrowArgumentOutOfRangeException(ExceptionArgument.capacity, ExceptionResource.ArgumentOutOfRange_NeedNonNegNumRequired);

            this._array = New.Array(capacity);
            this._head = 0;
            this._tail = 0;
            this._size = 0;
        } else if (args.length === 1 && is.typeof<IEnumerable<T>>(args[0], System.Types.Collections.Enumeration.IEnumerable)) {
            const collection: IEnumerable<T> = args[0];
            if (collection == null)
                ThrowHelper.ThrowArgumentNullException(ExceptionArgument.collection);

            this._array = New.Array(Queue._DefaultCapacity);
            this._size = 0;
            this._version = 0;

            using(collection.GetEnumerator(), (en: IEnumerator<T>) => {
                while (en.MoveNext()) {
                    this.Enqueue(en.Current);
                }
            });
        } else if (args.length === 1 && is.array(args[0])) {
            const array: ArrayLike<T> = args[0];


            this._array = New.Array(Queue._DefaultCapacity);
            this._size = 0;
            this._version = 0;

            using(TArray.GetEnumerator(array), (en: IEnumerator<T>) => {
                while (en.MoveNext()) {
                    this.Enqueue(en.Current);
                }
            });
        }
    }

    public get Count(): int {
        return this._size;
    }

    public Clear(): void {
        if (this._head < this._tail)
            TArray.Clear(this._array, this._head, this._size);
        else {
            TArray.Clear(this._array, this._head, this._array.length - this._head);
            TArray.Clear(this._array, 0, this._tail);
        }

        this._head = 0;
        this._tail = 0;
        this._size = 0;
        this._version++;
    }

    // CopyTo copies a collection into an Array, starting at a particular
    // index into the array.
    //
    /// <include file='doc\Queue.uex' path='docs/doc[@for="Queue.CopyTo"]/*' />
    public CopyTo(array: T[], arrayIndex: int): void {
        if (array == null) {
            ThrowHelper.ThrowArgumentNullException(ExceptionArgument.array);
        }

        if (arrayIndex < 0 || arrayIndex > array.length) {
            ThrowHelper.ThrowArgumentOutOfRangeException(ExceptionArgument.arrayIndex, ExceptionResource.ArgumentOutOfRange_Index);
        }

        const arrayLen: int = array.length;
        if (arrayLen - arrayIndex < this._size) {
            ThrowHelper.ThrowArgumentException(ExceptionResource.Argument_InvalidOffLen);
        }

        let numToCopy = (arrayLen - arrayIndex < this._size) ? (arrayLen - arrayIndex) : this._size;
        if (numToCopy === 0) {
            return;
        }

        const firstPart: int = (this._array.length - this._head < numToCopy) ? this._array.length - this._head : numToCopy;
        TArray.Copy(this._array, this._head, array, arrayIndex, firstPart);
        numToCopy -= firstPart;
        if (numToCopy > 0) {
            TArray.Copy(this._array, 0, array, arrayIndex + this._array.length - this._head, numToCopy);
        }
    }

    // Adds item to the tail of the queue.
    //
    /// <include file='doc\Queue.uex' path='docs/doc[@for="Queue.Enqueue"]/*' />
    public Enqueue(item: T): void {
        if (this._size === this._array.length) {
            let newcapacity: int = (this._array.length * Queue._GrowFactor / 100);
            if (newcapacity < this._array.length + Queue._MinimumGrow) {
                newcapacity = this._array.length + Queue._MinimumGrow;
            }
            this.SetCapacity(newcapacity);
        }

        this._array[this._tail] = item;
        this._tail = (this._tail + 1) % this._array.length;
        this._size++;
        this._version++;
    }

    // GetEnumerator returns an IEnumerator over this Queue.  This
    // Enumerator will support removing.
    //
    /// <include file='doc\Queue.uex' path='docs/doc[@for="Queue.GetEnumerator"]/*' />
    public GetEnumerator(): IEnumerator<T> {
        return new QueueEnumerator(this);
    }


    // Removes the object at the head of the queue and returns it. If the queue
    // is empty, this method simply returns null.
    /// <include file='doc\Queue.uex' path='docs/doc[@for="Queue.Dequeue"]/*' />
    public Dequeue(): T {
        if (this._size === 0)
            ThrowHelper.ThrowInvalidOperationException(ExceptionResource.InvalidOperation_EmptyQueue);

        const removed: T = this._array[this._head];
        this._array[this._head] = undefined as any;//default(T);
        this._head = (this._head + 1) % this._array.length;
        this._size--;
        this._version++;
        return removed;
    }

    public TryDequeue(out: Action<T>): boolean {
        if (this.Count > 0) {
            out(this.Dequeue());
            return true;
        }
        return false;
    }

    // Returns the object at the head of the queue. The object remains in the
    // queue. If the queue is empty, this method throws an
    // InvalidOperationException.
    /// <include file='doc\Queue.uex' path='docs/doc[@for="Queue.Peek"]/*' />
    public Peek(): T {
        if (this._size === 0)
            ThrowHelper.ThrowInvalidOperationException(ExceptionResource.InvalidOperation_EmptyQueue);

        return this._array[this._head];
    }

    // Returns true if the queue contains at least one object equal to item.
    // Equality is determined using item.Equals().
    //
    // Exceptions: ArgumentNullException if item == null.
    /// <include file='doc\Queue.uex' path='docs/doc[@for="Queue.Contains"]/*' />
    public Contains(item: T): boolean {
        let index: int = this._head;
        let count: int = this._size;

        const c: EqualityComparer<T> = EqualityComparer.Default;
        while (count-- > 0) {
            if ((item) == null) {
                if ((this._array[index]) == null)
                    return true;
            }
            else if (this._array[index] != null && c.Equals(this._array[index], item)) {
                return true;
            }
            index = (index + 1) % this._array.length;
        }

        return false;
    }

    public /* internal */  GetElement(i: int): T {
        return this._array[(this._head + i) % this._array.length];
    }

    // Iterates over the objects in the queue, returning an array of the
    // objects in the Queue, or an empty array if the queue is empty.
    // The order of elements in the array is first in to last in, the same
    // order produced by successive calls to Dequeue.
    /// <include file='doc\Queue.uex' path='docs/doc[@for="Queue.ToArray"]/*' />
    public ToArray(): T[] {
        const arr: T[] = New.Array(this._size);
        if (this._size === 0)
            return arr;

        if (this._head < this._tail) {
            TArray.Copy(this._array, this._head, arr, 0, this._size);
        } else {
            TArray.Copy(this._array, this._head, arr, 0, this._array.length - this._head);
            TArray.Copy(this._array, 0, arr, this._array.length - this._head, this._tail);
        }

        return arr;
    }


    // PRIVATE Grows or shrinks the buffer to hold capacity objects. Capacity
    // must be >= _size.
    private SetCapacity(capacity: int): void {
        const newarray: T[] = New.Array(capacity);
        if (this._size > 0) {
            if (this._head < this._tail) {
                TArray.Copy(this._array, this._head, newarray, 0, this._size);
            } else {
                TArray.Copy(this._array, this._head, newarray, 0, this._array.length - this._head);
                TArray.Copy(this._array, 0, newarray, this._array.length - this._head, this._tail);
            }
        }

        this._array = newarray;
        this._head = 0;
        this._tail = (this._size === capacity) ? 0 : this._size;
        this._version++;
    }

    public TrimExcess(): void {
        const threshold: int = ((this._array.length) * 0.9);
        if (this._size < threshold) {
            this.SetCapacity(this._size);
        }
    }
}
export class QueueEnumerator<T> implements IEnumerator<T>
{
    private _q: Queue<T> = null as any;
    private _index: int = 0;   // -1 = not started, -2 = ended/disposed
    private _version: int = 0;
    private _currentElement: T = null as any;

    public /* internal */ constructor(q: Queue<T>) {
        this._q = q;
        this._version = (this._q as any)._version;
        this._index = -1;
        this._currentElement = undefined as any;
    }
    CanMoveNext?: boolean | undefined;
    TryMoveNext(out: (value: T) => void): boolean {
        throw new Error('Method not implemented.');
    }
    End(): void {
        throw new Error('Method not implemented.');
    }
    NextValue(value?: any): T | undefined {
        throw new Error('Method not implemented.');
    }
    IsEndless?: boolean | undefined;
    Next(value?: any): IIteratorResult<T> {
        throw new Error('Method not implemented.');
    }

    /// <include file='doc\Queue.uex' path='docs/doc[@for="QueueEnumerator.Dispose"]/*' />
    public Dispose(): void {
        this._index = -2;
        this._currentElement = undefined as any;
    }

    /// <include file='doc\Queue.uex' path='docs/doc[@for="QueueEnumerator.MoveNext"]/*' />
    public MoveNext(): boolean {
        if (this._version !== (this._q as any)._version) {
            ThrowHelper.ThrowInvalidOperationException(ExceptionResource.InvalidOperation_EnumFailedVersion);
        }

        if (this._index === -2)
            return false;

        this._index++;

        if (this._index === (this._q as any)._size) {
            this._index = -2;
            this._currentElement = undefined as any;
            return false;
        }

        this._currentElement = this._q.GetElement(this._index);
        return true;
    }

    /// <include file='doc\Queue.uex' path='docs/doc[@for="QueueEnumerator.Current"]/*' />
    public get Current(): T {
        if (this._index < 0) {
            if (this._index == -1)
                ThrowHelper.ThrowInvalidOperationException(ExceptionResource.InvalidOperation_EnumNotStarted);
            else
                ThrowHelper.ThrowInvalidOperationException(ExceptionResource.InvalidOperation_EnumEnded);
        }
        return this._currentElement;
    }



    public Reset(): void {
        if (this._version !== (this._q as any)._version) {
            ThrowHelper.ThrowInvalidOperationException(ExceptionResource.InvalidOperation_EnumFailedVersion);
        }
        this._index = -1;
        this._currentElement = undefined as any;
    }
}