import { Exception } from "../Exception";

export class InternalBufferOverflowException extends Exception {
    constructor(...params: any[]) {
        super(params.join(''));
    }
}