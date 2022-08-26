import { Exception } from "../Exception";

export class OverflowException extends Exception {
    constructor(...params: any[]) {
        super(params.join(''));
    }
}