import { dispose } from "./dispose";
import { DisposableBase } from "./DisposableBase";
import { TaskHandler } from "../Threading/tasks_/TaskHandler";
import { ArgumentOutOfRangeException } from "../Exceptions/ArgumentOutOfRangeException";
import { ArgumentException } from "../Exceptions/ArgumentException";

const
	OBJECT_POOL = "ObjectPool",
	_MAX_SIZE = "_maxSize",
	ABSOLUTE_MAX_SIZE = 65536,
	MUST_BE_GT1 = "Must be at valid number least 1.",
	MUST_BE_LTM = `Must be less than or equal to ${ABSOLUTE_MAX_SIZE}.`;

export class ObjectPool<T> extends DisposableBase {

	private _pool: T[] = [];
	private _trimmer: TaskHandler = null as any;
	private _flusher: TaskHandler = null as any;
	private _autoFlusher: TaskHandler = null as any;

	private _localAbsMaxSize: number;

	autoClearTimeout: number = 5000;

	constructor(
		private _maxSize: number,
		private _generator?: (...args: any[]) => T,
		private _recycler?: (o: T) => void) {
		super();
		if (isNaN(_maxSize) || _maxSize < 1)
			throw new ArgumentOutOfRangeException(_MAX_SIZE, _maxSize, MUST_BE_GT1);
		if (_maxSize > ABSOLUTE_MAX_SIZE)
			throw new ArgumentOutOfRangeException(_MAX_SIZE, _maxSize, MUST_BE_LTM);

		this._localAbsMaxSize = Math.min(_maxSize * 2, ABSOLUTE_MAX_SIZE);

		const _ = this;
		_._disposableObjectName = OBJECT_POOL;
		_._pool = [];
		_._trimmer = new TaskHandler(() => _._trim());
		const clear = () => _._clear();
		_._flusher = new TaskHandler(clear);
		_._autoFlusher = new TaskHandler(clear);
	}

	get maxSize(): number {
		return this._maxSize;
	}

	get count(): number {
		const p = this._pool;
		return p ? p.length : 0;
	}

	protected _trim(): void {
		const pool = this._pool;
		while (pool.length > this._maxSize) {
			dispose.single(<any>pool.pop(), true);
		}
	}

	trim(defer?: number): void {
		this.throwIfDisposed();
		this._trimmer.start(defer);
	}

	protected _clear(): void {
		const _ = this;
		const p = _._pool;
		_._trimmer.cancel();
		_._flusher.cancel();
		_._autoFlusher.cancel();
		dispose.these.noCopy(<any>p, true);
		p.length = 0;
	}



	clear(defer?: number): void {
		this.throwIfDisposed();
		this._flusher.start(defer);
	}

	toArrayAndClear(): T[] {
		const _ = this;
		_.throwIfDisposed();
		_._trimmer.cancel();
		_._flusher.cancel();
		const p = _._pool;
		_._pool = [];
		return p;
	}


	dump(): T[] {
		return this.toArrayAndClear();
	}


	protected _onDispose(): void {
		super._onDispose();
		const _: any = this;
		_._generator = null;
		_._recycler = null;
		dispose(
			_._trimmer,
			_._flusher,
			_._autoFlusher
		);
		_._trimmer = null;
		_._flusher = null;
		_._autoFlusher = null;

		_._pool.length = 0;
		_._pool = null;
	}

	extendAutoClear(): void {
		const _ = this;
		_.throwIfDisposed();
		const t = _.autoClearTimeout;
		if (isFinite(t) && !_._autoFlusher.isScheduled)
			_._autoFlusher.start(t);
	}

	add(o: T): void {
		const _ = this;
		_.throwIfDisposed();
		if (_._pool.length >= _._localAbsMaxSize) {
			dispose(<any>o);
		}
		else {
			if (_._recycler) _._recycler(o);
			_._pool.push(o);
			const m = _._maxSize;
			if (m < ABSOLUTE_MAX_SIZE && _._pool.length > m)
				_._trimmer.start(500);
		}
		_.extendAutoClear();

	}

	private _onTaken(): void {
		const _ = this, len = _._pool.length;
		if (len <= _._maxSize)
			_._trimmer.cancel();
		if (len)
			_.extendAutoClear();
	}

	tryTake(): T | undefined {
		const _ = this;
		_.throwIfDisposed();

		try {
			return _._pool.pop();
		}
		finally {
			_._onTaken();
		}
	}

	take(factory?: () => T): T {
		const _ = this;
		_.throwIfDisposed();
		if (!_._generator && !factory)
			throw new ArgumentException('factory', "Must provide a factory if on was not provided at construction time.");

		try {
			return _._pool.pop() || factory && factory() || _._generator!();
		}
		finally {
			_._onTaken();
		}
	}
}
