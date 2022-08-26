import { IDisposable } from "./IDisposable";

export interface IDisposableAware extends IDisposable {
    wasDisposed: boolean;
}
