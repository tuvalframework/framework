import { InvalidOperationException } from "../Exceptions/InvalidOperationException";
import { IDisposableAware } from "./IDisposableAware";

const NAME: string = 'ObjectDisposedException';

export class ObjectDisposedException extends InvalidOperationException {

    readonly objectName: string = '';

    constructor(
        objectName: string,
        message?: string,
        innerException?: Error) {
        super(message || '', innerException, (_) => {
            (_ as any).objectName = objectName;
        });
    }


    protected getName(): string {
        return NAME;
    }

    ToString(): string {
        const _ = this;
        let oName = _.objectName;
        oName = oName ? ('{' + oName + '} ') : '';

        return '[' + _.name + ': ' + oName + _.message + ']';
    }

    static throwIfDisposed(
        disposable: IDisposableAware,
        objectName: string,
        message?: string): true | never {
        if (disposable.wasDisposed) {
            throw new ObjectDisposedException(objectName, message);
        }
        return true;
    }
}
