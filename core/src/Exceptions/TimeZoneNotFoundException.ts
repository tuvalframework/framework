import { Exception } from "../Exception";

export class TimeZoneNotFoundException extends Exception {
    constructor(...params: any[]) {
        super(params.join(''));
    }
}