import { Exception } from "../Exception";

export class MemberAccessException extends Exception {
    constructor(...params: any[]) {
        super(params.join(''));
    }
}