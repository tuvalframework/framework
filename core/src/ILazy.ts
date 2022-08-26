import { IDisposable } from "./Disposable/IDisposable";
import { IEquatable } from "./IEquatable";

export interface ILazy<T> extends IDisposable, IEquatable<ILazy<T>> {
	value: T;
	isValueCreated: boolean;
}
