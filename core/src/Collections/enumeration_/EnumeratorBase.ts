import { DisposableBase } from "../../Disposable/DisposableBase";
import { ObjectPool } from "../../Disposable/ObjectPool";
import { IDisposable } from "../../Disposable/IDisposable";
import { IIteratorResult } from "./IIterator";
import { IYield } from "./IYield";
import { IteratorResult } from "./IteratorResult";
import { Action, Closure } from "../../FunctionTypes";
import { IEnumerator } from "./IEnumerator";
import { is } from "../../is";
// noinspection JSUnusedLocalSymbols

const VOID0: undefined = void 0;

let yielderPool: ObjectPool<Yielder<any>>;
function yielder(): Yielder<any>;
function yielder(recycle?: Yielder<any>): void;
//noinspection JSUnusedLocalSymbols
function yielder(recycle?: Yielder<any>): Yielder<any> | void {
	if (!yielderPool)
		yielderPool
			= new ObjectPool<Yielder<any>>(40, () => new Yielder<any>(), y => y.yieldBreak());
	if (!recycle) return yielderPool.take();
	yielderPool.add(recycle);
}

class Yielder<T> implements IYield<T>, IDisposable {
	private _current: T | undefined = VOID0;
	private _index: number = NaN;

	get current(): T | undefined { return this._current; } // this class is not entirely local/private.  Still needs protection.

	get index(): number { return this._index; }

	yieldReturn(value: T): boolean {
		this._current = value;
		if (isNaN(this._index))
			this._index = 0;
		else
			this._index++;
		return true;
	}

	yieldBreak(): boolean {
		this._current = VOID0;
		this._index = NaN;
		return false;
	}

	Dispose(): void {
		this.yieldBreak();
	}
}

// IEnumerator State
const enum EnumeratorState { Before, Active, Completed, Faulted, Interrupted, Disposed }

const NAME = "EnumeratorBase";

// "Enumerator" is conflict JScript's "Enumerator"
// Naming this class EnumeratorBase to avoid collision with IE.
export class EnumeratorBase<T> extends DisposableBase implements IEnumerator<T>
{

	private _yielder: Yielder<T>;
	private _state: EnumeratorState;
	private _disposer: () => void;

	get Current(): T {
		const y = this._yielder;
		return (y && y.current) as any;
	}

	get index(): number {
		const y = this._yielder;
		return y ? y.index : NaN;
	}

	constructor(
		initializer: Closure | null,
		tryGetNext: (yielder: IYield<T>) => boolean,
		isEndless?: boolean);
	constructor(
		initializer: Closure | null,
		tryGetNext: (yielder: IYield<T>) => boolean,
		disposer?: Closure | null,
		isEndless?: boolean);
	constructor(
		private _initializer: Closure,
		private _tryGetNext: (yielder: IYield<T>) => boolean,
		disposer?: Closure | boolean | null,
		isEndless?: boolean) {
		super();
		this._yielder = undefined as any;
		this._state = undefined as any;
		this._disposer = undefined as any;

		this._disposableObjectName = NAME;
		this.Reset();
		if (is.boolean(isEndless))
			this._isEndless = isEndless;
		else if (is.boolean(disposer))
			this._isEndless = disposer;

		if (is.function(disposer))
			this._disposer = disposer;
	}

	protected _isEndless: boolean = false;
	/*
	 * Provides a mechanism to indicate if this enumerable never ends.
	 * If set to true, some operations that expect a finite result may throw.
	 * Explicit false means it has an end.
	 * Implicit void means unknown.
	 */
	get IsEndless(): boolean | undefined {
		return this._isEndless;
	}

	/**
	 * Added for compatibility but only works if the enumerator is active.
	 */
	Reset(): void {
		const _ = this;
		_.throwIfDisposed();
		const y = _._yielder;
		_._yielder = <any>null;

		_._state = EnumeratorState.Before;

		if (y) yielder(y); // recycle until actually needed.
	}

	private _assertBadState() {
		const _ = this;
		switch (_._state) {
			case EnumeratorState.Faulted:
				_.throwIfDisposed("This enumerator caused a fault and was disposed.");
				break;
			case EnumeratorState.Disposed:
				_.throwIfDisposed("This enumerator was manually disposed.");
				break;
		}
	}

	/**
	 * Passes the current value to the out callback if the enumerator is active.
	 * Note: Will throw ObjectDisposedException if this has faulted or manually disposed.
	 */
	tryGetCurrent(out: Action<T>): boolean {
		this._assertBadState();
		if (this._state === EnumeratorState.Active) {
			out(this.Current);
			return true;
		}
		return false;
	}

	get CanMoveNext(): boolean {
		return this._state < EnumeratorState.Completed;
	}

	/**
	 * Safely moves to the next entry and returns true if there is one.
	 * Note: Will throw ObjectDisposedException if this has faulted or manually disposed.
	 */
	MoveNext(): boolean {
		const _ = this;

		_._assertBadState();

		try {
			switch (_._state) {
				case EnumeratorState.Before:
					_._yielder = _._yielder || yielder();
					_._state = EnumeratorState.Active;
					const initializer = _._initializer;
					if (initializer) {
						initializer();
					}
				// fall through
				case EnumeratorState.Active:
					if (_._tryGetNext(_._yielder)) {
						return true;
					}
					else {
						this.Dispose();
						_._state = EnumeratorState.Completed;
						return false;
					}
				default:
					return false;
			}
		}
		catch (e) {
			this.Dispose();
			_._state = EnumeratorState.Faulted;
			throw e;
		}
	}

	/**
	 * Moves to the next entry and emits the value through the out callback.
	 * Note: Will throw ObjectDisposedException if this has faulted or manually disposed.
	 */
	TryMoveNext(out: Action<T>): boolean {
		if (this.MoveNext()) {
			out(<T>this.Current);
			return true;
		}
		return false;
	}

	NextValue(): T | undefined {
		return this.MoveNext()
			? this.Current
			: VOID0;
	}

	/**
	 * Exposed for compatibility with generators.
	 */
	Next(): IIteratorResult<T> {
		return this.MoveNext()
			? new IteratorResult(this.Current, this.index)
			: IteratorResult.Done
	}

	End(): void {
		this._ensureDisposeState(EnumeratorState.Interrupted);
	}

	'return'(): IIteratorResult<void>
	'return'<TReturn>(value: TReturn): IIteratorResult<TReturn>
	'return'(value?: any): IIteratorResult<any> {
		const _ = this;
		_._assertBadState();

		try {
			return value === VOID0 || _._state === EnumeratorState.Completed || _._state === EnumeratorState.Interrupted
				? IteratorResult.Done
				: new IteratorResult(value, VOID0, true);
		}
		finally {
			_.End();
		}
	}

	private _ensureDisposeState(state: EnumeratorState): void {
		const _ = this;
		if (!_.wasDisposed) {
			_.Dispose();
			_._state = state;
		}
	}

	protected _onDispose(): void {
		const _ = this;
		_._isEndless = false;
		const disposer = _._disposer;

		_._initializer = <any>null;
		_._disposer = <any>null;


		const y = _._yielder;
		_._yielder = <any>null;
		this._state = EnumeratorState.Disposed;

		if (y) yielder(y);

		if (disposer)
			disposer();
	}

}

