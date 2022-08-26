import { ObjectDisposedException } from "./ObjectDisposedException";
import { IDisposableAware } from "./IDisposableAware";
import { Closure } from "../FunctionTypes";

// console.log('DisposableBase oluşturuluyor');

export abstract class DisposableBase implements IDisposableAware {

    constructor(private readonly __finalizer?: Closure | null) {
    }

    private __wasDisposed: boolean = false;

    get wasDisposed(): boolean {
        return this.__wasDisposed;
    }

    protected _disposableObjectName: string = '';

    protected throwIfDisposed(
        message?: string,
        objectName: string = this._disposableObjectName): true | never {
        if (this.__wasDisposed)
            throw new ObjectDisposedException(objectName, message);
        return true;
    }


    Dispose(): void {
        const _ = this;
        if (!_.__wasDisposed) {

            _.__wasDisposed = true;
            try {
                _._onDispose();
            }
            finally {
                if (_.__finalizer)
                {
                    _.__finalizer();
                    (<any>_).__finalizer = void 0;
                }
            }
        }
    }

    protected _onDispose(): void { }

}
