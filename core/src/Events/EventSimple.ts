import { IDisposable } from "../Disposable/IDisposable";

/**
 * A simple event dispatcher provided as an alternative to built-in event.
 * If just dispatching a payload to a uniform set of functions, it may be better to just use the utilities in System/Collections/Array/Dispatch.
 */
export class EventSimple<T extends Function> implements IDisposable {
	protected readonly _listeners: T[] = [];

	add(listener: T): void {
		this._listeners.push(listener);
	}

	remove(listener: T): void {
		const index = this._listeners.indexOf(listener);
		if (index < 0) return;
		this._listeners.splice(index, 1);
	}

	dispatch(...params: any[]): void {
		const listeners = this._listeners;
		for (let f of listeners) {
			f.call(this, ...params);
		}
	}

	toMulticastFunction(): Function {
		const listeners = this._listeners;
		return function () {
			for (let f of listeners) {
				f.call(arguments);
			}
		};
	}

	Dispose(): void {
		this._listeners.length = 0;
	}
}