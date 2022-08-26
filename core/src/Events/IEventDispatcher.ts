import { IDisposable } from "../Disposable/IDisposable";
import { IEventListener } from "./IEventListener";

export interface IEventDispatcher extends IDisposable {
	addEventListener(type: string, listener: IEventListener): void;
	dispatchEvent(event: Event): boolean;
	hasEventListener(type: string): boolean;
	removeEventListener(type: string, listener: IEventListener): void;
}
