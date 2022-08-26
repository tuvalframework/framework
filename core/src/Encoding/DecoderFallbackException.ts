import { SystemException } from "../Exceptions/SystemException";

export class DecoderFallbackException extends SystemException {
    public constructor(...args: any[]) {
        super('');
    }
}