import { SimpleEnumerableBase } from "./SimpleEnumerableBase";

/**
 * An aggregate/reduce style factory function that expects a previous value and the current index of the enumeration.
 */
export interface InfiniteValueFactory<T> {
	(previous: T | undefined, index: number): T;
}

/**
 * A simplified stripped down enumerator that until disposed will infinitely return the provided factory.
 * This is analogous to a 'generator' and has a compatible interface.
 */
export class InfiniteEnumerator<T> extends SimpleEnumerableBase<T>
{
	/**
	 * See InfiniteValueFactory
	 * @param _factory
	 */
	constructor(private readonly _factory: InfiniteValueFactory<T>) {
		super();
	}

	protected _canMoveNext(): boolean {
		return this._factory != null;
	}

	MoveNext(): boolean {
		const _ = this;
		const f = _._factory;
		if (f) {
			_._current = f(_._current, _.incrementIndex());
			return true;
		}
		return false;
	}

	Dispose(): void {
		super.Dispose();
		(<any>this)._factory = null;
	}

}