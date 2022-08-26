import { Exception } from "../../Exception";

export class FileNotFoundException extends Exception {
    constructor(...params: any[]) {
        super(params.join(''));
    }
}