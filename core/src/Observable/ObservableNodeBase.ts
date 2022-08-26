// Can be used as a base class, mixin, or simply reference on how to implement the pattern.
import { ObservableBase } from "./ObservableBase";
import { IObserver } from "./IObserver";


export class ObservableNodeBase<T> 	extends ObservableBase<T> implements IObserver<T>
{

	onNext(value: T): void {
		this._onNext(value);
	}

	onError(error: any): void {
		this._onError(error);
	}

	onCompleted(): void {
		this._onCompleted();
	}
}