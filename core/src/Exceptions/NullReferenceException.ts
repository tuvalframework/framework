import { SystemException } from "./SystemException";

const NAME: string = 'NullReferenceException';

export class NullReferenceException extends SystemException {
	protected getName(): string {
		return NAME;
	}
}
