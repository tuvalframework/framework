import { SystemException } from "./SystemException";

const NAME: string = 'ArgumentException';

export class ArgumentException extends SystemException {

    // For simplicity and consistency, lets stick with 1 signature.
    constructor(private paramName: string, message?: string, innerException?: Error, beforeSealing?: (ex: any) => void) {
        super((paramName ? ('{' + paramName + '} ') : '' + (message || '')), innerException, (_) => {
            _.paramName = paramName;
            if (beforeSealing) {
                beforeSealing(_);
            }
        });
    }


    protected getName(): string {
        return NAME;
    }

}