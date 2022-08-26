import { is } from "../is";
import { Type } from "../Reflection";
import { System } from "../SystemTypes";
import { IDisposable } from "./IDisposable";

export type DisposableItem = IDisposable | null | undefined;
export type DisposableItemArray = Array<DisposableItem> | null | undefined;

export function dispose(...disposables: DisposableItem[]): void {
	disposeTheseInternal(disposables, false);
}

export namespace dispose {
	export function single(disposable: DisposableItem, trapExceptions: boolean = false): void {
		if (disposable)
			disposeSingle(disposable, trapExceptions);
	}

	export function deferred(...disposables: DisposableItem[]): void {
		these.deferred(disposables);
	}


	export function withoutException(...disposables: DisposableItem[]): any[] | undefined {
		return disposeTheseInternal(disposables, true);
	}

	export function these(disposables: DisposableItemArray, trapExceptions?: boolean): any[] | undefined {
		return disposables && disposables.length
			? disposeTheseInternal(disposables.slice(), trapExceptions)
			: void 0;
	}

	export namespace these {
		export function deferred(disposables: DisposableItemArray, delay: number = 0): void {
			if (disposables && disposables.length) {
				if (!(delay >= 0)) delay = 0;
				setTimeout(disposeTheseInternal, delay, disposables.slice(), true);
			}
		}


		export function noCopy(disposables: DisposableItemArray, trapExceptions?: boolean): any[] | undefined {
			return disposables && disposables.length
				? disposeTheseInternal(disposables, trapExceptions)
				: void 0;
		}
	}

}


export function using<TDisposable extends IDisposable, TReturn>(
	disposable: TDisposable,
	closure: (disposable: TDisposable) => TReturn): TReturn {
	try {
		return closure(disposable);
	}
	finally {
		disposeSingle(disposable, false);
	}
}

function disposeSingle(disposable: IDisposable, trapExceptions: boolean): any {
	if (is.typeof<IDisposable>(disposable, System.Types.Disposable.IDisposable)) {
		if (trapExceptions) {
			try {
				disposable.Dispose();
				disposable = null as any;
			}
			catch (ex) {
				return ex;
			}
		}
		else {
			if (typeof (disposable as any).dispose === 'function') {
				(disposable as any).dispose(true);
			} else {
				disposable.Dispose();
			}
			disposable = null as any;
		}
	} else {
		console.warn('Can not use non IDisposable object in using. Class : ' + (disposable as any).constructor.name);
	}

	return null;
}
function disposeTheseInternal(
	disposables: DisposableItemArray,
	trapExceptions?: boolean,
	index: number = 0): any[] | undefined {
	let exceptions: any[] | undefined;
	const len = disposables ? disposables.length : 0;

	for (; index < len; index++) {
		let next = disposables![index];
		if (!next) continue;
		if (trapExceptions) {
			const ex = disposeSingle(next, true);
			if (ex) {
				if (!exceptions) exceptions = [];
				exceptions.push(ex);
			}
		}
		else {
			let success = false;
			try {
				disposeSingle(next, false);
				success = true;
			}
			finally {
				if (!success && index + 1 < len) {
					disposeTheseInternal(disposables, false, index + 1);
				}
			}
			if (!success) break;
		}
	}

	return exceptions;
}