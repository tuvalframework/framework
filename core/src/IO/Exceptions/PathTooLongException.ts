import { Exception } from "../../Exception";

export class PathTooLongException extends Exception {
    constructor(...params: any[]) {
        super(params.join(''));
    }
}