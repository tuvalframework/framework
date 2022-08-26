import { Exception } from "../../Exception";

export class EndOfStreamException extends Exception {
    constructor(...params: any[]) {
        super(params.join(''));
    }
}