import { SystemException } from "../Exceptions/SystemException";
import { char, int } from "../float";

export class EncoderFallbackException extends SystemException {
    public constructor(...args: any[]) {
        super('');
    }
}