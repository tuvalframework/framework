import { SystemException } from "./SystemException";
const NAME: string = 'InvalidArgumentsException';

export class InvalidArgumentsException extends SystemException {

	protected getName(): string {
		return NAME;
	}

}