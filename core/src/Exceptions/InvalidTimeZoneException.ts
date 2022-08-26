import { Exception } from '../Exception';
export class InvalidTimeZoneException extends Exception {
    constructor(...params: any[]) {
        super(params.join(''));
    }
}