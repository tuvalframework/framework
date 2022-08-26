import { Action, Closure } from "../FunctionTypes";
export interface IObserver<T> {
	// onNext is optional because an observer may only care about onCompleted.
	onNext?: Action<T>;
	onError?: Action<any>;
	onCompleted?: Closure;
}