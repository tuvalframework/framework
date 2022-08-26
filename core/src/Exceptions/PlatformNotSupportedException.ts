import { Exception } from "../Exception";

export class PlatformNotSupportedException extends Exception {
    constructor(...params: any[]) {
        super(params.join(''));
    }
}