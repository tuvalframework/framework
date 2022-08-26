import { IIterator } from "./IIterator";
import { SimpleEnumerableBase } from "./SimpleEnumerableBase";

/**
 * A simplified stripped down enumerator that until disposed will infinitely return the provided factory.
 * This is analogous to a 'generator' and has a compatible interface.
 *
 *
 */
export class IteratorEnumerator<T> extends SimpleEnumerableBase<T>
{
	/**
	 * @param _iterator
	 * @param _isEndless true and false are explicit where as undefined means 'unknown'.
	 */
	constructor(
		private readonly _iterator: IIterator<T>,
		private readonly _isEndless?: boolean) {
		super();
	}

	protected _canMoveNext(): boolean {
		return this._iterator != null;
	}

	MoveNext(value?: any): boolean {
		const _ = this;
		const i = _._iterator;
		if (i) {
			const r = arguments.length ? i.Next(value) : i.Next();
			_._current = r.value;
			if (r.done) _.Dispose();
			else return true;
		}
		return false;
	}

	Dispose(): void {
		super.Dispose();
		(<any>this)._iterator = null;
	}

	protected getIsEndless(): boolean {
		return Boolean(this._isEndless) && super.getIsEndless();
	}
}