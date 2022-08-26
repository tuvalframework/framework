import { Exception } from "../../Exception";

export class DirectoryNotFoundException extends Exception {
    constructor(...params: any[]) {
        super(params.join(''));
    }
}