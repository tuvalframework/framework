import { SystemException } from "./SystemException";
const NAME: string = 'InvalidOperationException';

export class InvalidFilterCriteriaException extends SystemException {
	protected getName(): string {
		return NAME;
	}
}
