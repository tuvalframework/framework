import { SystemException } from "./SystemException";
const NAME: string = 'NotImplementedException';

export class NotImplementedException extends SystemException {
	protected getName(): string {
		return NAME;
	}
}