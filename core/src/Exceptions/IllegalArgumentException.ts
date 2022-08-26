import { SystemException } from "./SystemException";

const NAME: string = 'IllegalArgumentException';

export class IllegalArgumentException extends SystemException {
	protected getName(): string {
		return NAME;
	}
}

