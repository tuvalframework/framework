import { IDisposable } from "../Disposable/IDisposable";

export interface ISubscribable<TSubscriber> extends IDisposable {
	subscribe(observer: TSubscriber): IDisposable;
	unsubscribe(observer: TSubscriber): void;
}