import { SystemException } from "./SystemException";
const NAME: string = 'NotSupportedException';

export class NotSupportedException extends SystemException {
	protected getName(): string {
		return NAME;
	}
}