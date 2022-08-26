import { IIterator } from "./IIterator";
import { IDisposable } from "../../Disposable/IDisposable";
import { IIteratorResult } from "./IIterator";

// IIterator is added for future compatibility.
export interface IEnumerator<T> extends IIterator<T>, IDisposable {

	/**
	 * The current value within the enumeration.
	 */
	Current: T ;

	/**
	 * Will indicate if moveNext is safe.
	 */
	CanMoveNext?: boolean;

	/**
	 * Safely moves to the next entry and returns true if there is one.
	 */
	MoveNext(value?: any): boolean;

	/**
	 * Moves to the next entry and emits the value through the out callback.
	 */
	TryMoveNext(out: (value: T) => void): boolean;

	/**
	 * Restarts the enumeration.
	 */
	Reset(): void;

	/**
	 * Interrupts/completes the enumeration.
	 */
	End(): void;

	/**
	 * Calls .moveNext() and returns .current
	 */
	NextValue(value?: any): T | undefined;

	/**
	 * Provides a way of flagging endless enumerations that may cause issues.
	 */
	IsEndless?: boolean;

	// Iterator
	Next(value?: any): IIteratorResult<T>;
	'return'?<TReturn>(value?: TReturn): IIteratorResult<TReturn>;
	'throw'?(e?: any): IIteratorResult<T>;

	//IDisposable
	Dispose(): void;
}

