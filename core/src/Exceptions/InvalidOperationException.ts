import { SystemException } from "./SystemException";

const NAME: string = 'InvalidOperationException';

export class InvalidOperationException extends SystemException {

	protected getName(): string {
		return NAME;
	}

}
