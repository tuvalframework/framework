import { ISubscribable } from "./ISubscribable";
import { IObserver } from "./IObserver";

export interface IObservable<T> extends ISubscribable<IObserver<T>> {
}
