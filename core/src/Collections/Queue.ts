﻿import { areEqual } from "../Compare";
import * as AU from "./Array/Utility";
import { Integer } from "../Integer";
import { EnumeratorBase } from "./enumeration_/EnumeratorBase";
import { NotImplementedException } from "../Exceptions/NotImplementedException";
import { InvalidOperationException } from "../Exceptions/InvalidOperationException";
import { ArgumentOutOfRangeException } from "../Exceptions/ArgumentOutOfRangeException";
import { CollectionBase, _CollectionBase } from "./CollectionBase";
import { Action, ActionWithIndex, EqualityComparison, PredicateWithIndex } from "../FunctionTypes";
import { IEnumerator } from "./enumeration_/IEnumerator";
import { IEnumerableOrArray } from "./IEnumerableOrArray";
import { Type } from "../Reflection/Type";
import { is } from "../is";

const VOID0: undefined = void 0;
const MINIMUM_GROW: number = 4;
const SHRINK_THRESHOLD: number = 32; // Unused?
// var GROW_FACTOR: number = 200;  // double each time
const GROW_FACTOR_HALF: number = 100;
const DEFAULT_CAPACITY: number = MINIMUM_GROW;
const emptyArray: any = Object.freeze([]);

export class _Queue<T> extends _CollectionBase<T>
{

    private _array: T[] = [];
    private _head: number = 0;       // First valid element in the queue
    private _tail: number = 0;       // Last valid element in the queue
    private _size: number = 0;       // Number of elements.
    private _capacity: number = 0;   // Maps to _array.length;

    constructor(
        source?: IEnumerableOrArray<T> | number,
        equalityComparer: EqualityComparison<T> = areEqual) {
        super(VOID0, equalityComparer as any);
        const _ = this;
        _._head = 0;
        _._tail = 0;
        _._size = 0;

        if (!source)
            _._array = emptyArray;
        else {
            if (is.number(source)) {
                const capacity = source;
                assertIntegerZeroOrGreater(capacity, "capacity");

                _._array = capacity
                    ? AU.initialize<T>(capacity)
                    : emptyArray;
            }
            else {
                const se = source;
                _._array = AU.initialize<T>(is.arrayLike(se) ? (se as any).length : DEFAULT_CAPACITY);

                _._importEntries(se);
            }
        }

        _._capacity = _._array.length;
    }

    protected getCount(): number {
        return this._size;
    }

    protected _addInternal(item: T): boolean {
        const _ = this;
        const size = _._size;
        let len = _._capacity;
        if (size == len) {
            let newCapacity = len * GROW_FACTOR_HALF;
            if (newCapacity < len + MINIMUM_GROW)
                newCapacity = len + MINIMUM_GROW;

            _.setCapacity(newCapacity);
            len = _._capacity;
        }

        const tail = _._tail;
        _._array[tail] = item;
        _._tail = (tail + 1) % len;
        _._size = size + 1;
        return true;
    }

    //noinspection JSUnusedLocalSymbols
    protected _removeInternal(item: T, max?: number): number {
        //noinspection HtmlUnknownTag
        throw new NotImplementedException(
            "ICollection\<T\>.remove is not implemented in Queue\<T\>" +
            " since it would require destroying the underlying array to remove the item."
        );
    }

    protected _clearInternal(): number {
        const _ = this;
        const array = _._array, head = _._head, tail = _._tail, size = _._size;
        if (head < tail)
            AU.clear(array, head, tail);
        else {
            AU.clear(array, head);
            AU.clear(array, 0, tail);
        }

        _._head = 0;
        _._tail = 0;
        _._size = 0;

        _.trimExcess();

        return size;
    }

    protected _onDispose(): void {
        super._onDispose();
        const _ = this;
        if (_._array != emptyArray) {
            _._array.length = _._capacity = 0;
            _._array = emptyArray;
        }
    }


	/**
	 * Dequeues entries into an array.
	 */
    dump(max: number = Infinity): T[] {
        const _ = this;
        const result: T[] = [];

        if (isFinite(max)) {
            Integer.assertZeroOrGreater(max);
            if (max !== 0) {
                while (max-- && _._tryDequeueInternal(value => {
                    result.push(value);
                })) { }
            }
        }
        else {
            while (_._tryDequeueInternal(value => {
                result.push(value);
            })) { }
        }

        _.trimExcess();
        _._signalModification();

        return result;
    }

	/* forEach(action:ActionWithIndex<T>):number
	forEach(action:PredicateWithIndex<T>):number
	forEach(action:ActionWithIndex<T> | PredicateWithIndex<T>):number
	{
		return super.forEach(action, true);
	} */

    setCapacity(capacity: number): this {
        const _ = this;
        assertIntegerZeroOrGreater(capacity, "capacity");

        const array = _._array, len = _._capacity;
        if (capacity > len) _.throwIfDisposed();
        if (capacity == len)
            return this;

        const head = _._head, tail = _._tail, size = _._size;

        // Special case where we can simply extend the length of the array. (JavaScript only)
        if (array != emptyArray && capacity > len && head < tail) {
            array.length = _._capacity = capacity;
            _._version++;
            return this;
        }

        // We create a new array because modifying an existing one could be slow.
        const newArray: T[] = AU.initialize<T>(capacity);
        if (size > 0) {
            if (head < tail) {
                AU.copyTo(array, newArray, head, 0, size);
            }
            else {
                AU.copyTo(array, newArray, head, 0, len - head);
                AU.copyTo(array, newArray, 0, len - head, tail);
            }
        }

        _._array = newArray;
        _._capacity = capacity;
        _._head = 0;
        _._tail = (size == capacity) ? 0 : size;

        _._signalModification(true);

        return this;
    }

    enqueue(item: T): this {
        return this.add(item) as any;
    }

    protected _tryDequeueInternal(out: Action<T>): boolean {
        const _ = this;
        if (!_._size) return false;

        const array = _._array, head = _._head;

        const removed = _._array[head];
        array[head] = <any>null;
        _._head = (head + 1) % _._capacity;

        _._size--;

        _._incrementModified();

        out(removed);

        return true;
    }

	/**
	 * Pulls an entry from the head of the queue and returns it.
	 * Returns undefined if the queue is already empty.
	 */
    dequeue(): T | undefined

	/**
	 * Pulls an entry from the head of the queue and returns it.
	 * Returns undefined if the queue is already empty and throwIfEmpty is false.
	 * Throws an InvalidOperationException if the queue is already empty and throwIfEmpty is true.
	 * @param throwIfEmpty
	 */
    dequeue(throwIfEmpty: true): T

	/**
	 * Pulls an entry from the head of the queue and returns it.
	 * Returns undefined if the queue is already empty and throwIfEmpty is false.
	 * Throws an InvalidOperationException if the queue is already empty and throwIfEmpty is true.
	 * @param throwIfEmpty
	 */
    dequeue(throwIfEmpty: boolean): T | undefined
    dequeue(throwIfEmpty: boolean = false): T | undefined {
        const _ = this;
        _.assertModifiable();

        let result: T | undefined = VOID0;
        if (!this.tryDequeue(value => { result = value; }) && throwIfEmpty)
            throw new InvalidOperationException("Cannot dequeue an empty queue.");
        return result;
    }

	/**
	 * Checks to see if the queue has entries an pulls an entry from the head of the queue and passes it to the out handler.
	 * @param out The 'out' handler that receives the value if it exists.
	 * @returns {boolean} True if a value was retrieved.  False if not.
	 */
    tryDequeue(out: Action<T>): boolean {
        const _ = this;
        if (!_._size) return false;
        _.assertModifiable();

        // A single dequeue shouldn't need update recursion tracking...
        if (this._tryDequeueInternal(out)) {
            // This may preemptively trigger the _onModified.
            if (_._size < _._capacity / 2)
                _.trimExcess(SHRINK_THRESHOLD);

            _._signalModification();
            return true;
        }

        return false;
    }

    private _getElement(index: number): T {
        assertIntegerZeroOrGreater(index, "index");

        const _ = this;
        return _._array[(_._head + index) % _._capacity];
    }

	/**
	 * Returns the entry at the head of the queue.
	 * Returns undefined if the queue is already empty.
	 */
    peek(): T | undefined

	/**
	 * Returns the entry at the head of the queue.
	 * Returns undefined if the queue is already empty and throwIfEmpty is false.
	 * Throws an InvalidOperationException if the queue is already empty and throwIfEmpty is true.
	 * @param throwIfEmpty
	 */
    peek(throwIfEmpty: true): T

	/**
	 * Returns the entry at the head of the queue.
	 * Returns undefined if the queue is already empty and throwIfEmpty is false.
	 * Throws an InvalidOperationException if the queue is already empty and throwIfEmpty is true.
	 * @param throwIfEmpty
	 */
    peek(throwIfEmpty: boolean): T | undefined
    peek(throwIfEmpty: boolean = false): T | undefined {
        if (this._size == 0) {
            if (throwIfEmpty)
                throw new InvalidOperationException("Cannot call peek on an empty queue.");
            return VOID0;
        }


        return this._array[this._head];
    }

    trimExcess(threshold?: number): void {
        const _ = this;
        const size = _._size;
        if (size < Math.floor(_._capacity * 0.9) && (!threshold && threshold !== 0 || isNaN(threshold) || threshold < size))
            _.setCapacity(size);
    }

    GetEnumerator(): IEnumerator<T> {
        const _ = this;
        _.throwIfDisposed();

        let index: number, version: number, size: number;
        return new EnumeratorBase<T>(
            () => {
                version = _._version;
                size = _._size;
                index = 0;
            },
            (yielder) => {
                _.throwIfDisposed();
                _.assertVersion(version);

                if (index == size)
                    return yielder.yieldBreak();

                return yielder.yieldReturn(_._getElement(index++));
            }
        );
    }
}

function assertZeroOrGreater(value: number, property: string): true | never {
    if (value < 0)
        throw new ArgumentOutOfRangeException(property, value, "Must be greater than zero");

    return true;
}

function assertIntegerZeroOrGreater(value: number, property: string): true | never {
    Integer.assert(value, property);
    return assertZeroOrGreater(value, property);
}
