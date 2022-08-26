import { SystemException } from "./SystemException";
const NAME: string = 'InternalError';

export class InternalError extends SystemException {
    protected getName(): string {
        return NAME;
    }
}
