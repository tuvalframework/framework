import { Exception } from "../../Exception";

export class CultureNotFoundException extends Exception {
    constructor(...params: any[]) {
        super(params.join(''));
    }
}