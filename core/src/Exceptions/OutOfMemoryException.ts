import { Exception } from "../Exception";

export class OutOfMemoryException extends Exception {
    constructor(...params: any[]) {
        super(params.join(''));
    }
}