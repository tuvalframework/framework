import { IIteratorResult } from "./IIterator";
import { IteratorResult } from "./IteratorResult";
import { Action } from "../../FunctionTypes";
import { IEnumerator } from "./IEnumerator";

const VOID0: undefined = void 0;

export abstract class SimpleEnumerableBase<T> implements IEnumerator<T>
{

	protected _current: T | undefined;
	protected _index: number = 0;

	constructor() {
		this.Reset();
	}

	get Current(): T  {
		return this._current as any;
	}

	protected abstract _canMoveNext(): boolean;

	get CanMoveNext(): boolean {
		return this._canMoveNext();
	}

	abstract MoveNext(): boolean;

	TryMoveNext(out: Action<T>): boolean {
		if (this.MoveNext()) {
			out(<T>this._current);
			return true;
		}
		return false;
	}


	protected incrementIndex(): number {
		let i = this._index;
		this._index = i = isNaN(i) ? 0 : (i + 1);
		return i;
	}

	NextValue(): T | undefined {
		this.MoveNext();
		return this._current;
	}

	Next(): IIteratorResult<T> {
		return this.MoveNext()
			? new IteratorResult(this._current, this._index)
			: IteratorResult.Done;
	}

	End(): void {
		this.Dispose();
	}

	'return'(): IIteratorResult<void>
	'return'<TReturn>(value: TReturn): IIteratorResult<TReturn>
	'return'(value?: any): IIteratorResult<any> {
		try {
			return value !== VOID0 && this._canMoveNext()
				? new IteratorResult(value, VOID0, true)
				: IteratorResult.Done;
		}
		finally {
			this.Dispose();
		}
	}

	Reset(): void {
		this._current = VOID0;
		this._index = NaN;
	}

	Dispose(): void {
		this.Reset();
	}

	protected getIsEndless(): boolean {
		return this._canMoveNext();
	}

	get IsEndless(): boolean | undefined {
		return this.getIsEndless();
	}
}