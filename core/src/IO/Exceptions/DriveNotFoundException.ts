import { Exception } from "../../Exception";

export class DriveNotFoundException extends Exception {
    constructor(...params: any[]) {
        super(params.join(''));
    }
}