import { Exception } from "../Exception";

export class TypeInitializationException extends Exception {
    constructor(...params: any[]) {
        super(params.join(''));
    }
}