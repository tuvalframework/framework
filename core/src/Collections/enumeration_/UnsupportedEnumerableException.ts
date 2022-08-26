import { SystemException } from "../../Exceptions/SystemException";
const NAME: string = 'UnsupportedEnumerableException';

export class UnsupportedEnumerableException extends SystemException {

	constructor(message?: string) {
		super(message || "Unsupported enumerable.");
	}

	protected getName(): string {
		return NAME;
	}
}
