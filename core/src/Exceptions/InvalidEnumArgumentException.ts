import { SystemException } from "./SystemException";
const NAME: string = 'InvalidEnumArgumentException';

export class InvalidEnumArgumentException extends SystemException {
	protected getName(): string {
		return NAME;
	}
}