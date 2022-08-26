import { Exception } from "../Exception";

export class TypeLoadException extends Exception {
    constructor(...params: any[]) {
        super(params.join(''));
    }
}