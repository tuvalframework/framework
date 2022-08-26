import { Exception } from "../Exception";

export class SecurityException extends Exception {
    constructor(...params: any[]) {
        super(params.join(''));
    }
}