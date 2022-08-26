import { ArgumentException, } from "./ArgumentException";
import { SystemException } from "./SystemException";

const NAME: string = 'ArgumentNullException';


export class ArgumentNullException extends SystemException {
	constructor(
		paramName: string,
		message: string = `'${paramName}' is null (or undefined).`,
		innerException?: Error) {
		super(paramName,/*  message, */ innerException);
	}

	protected getName(): string {
		return NAME;
	}
}
export class IndexOutOfRangeException extends SystemException {
	constructor(
		paramName: string,
		message: string = `'${paramName}' is out of range (or undefined).`,
		innerException?: Error) {
		super(paramName,/*  message, */ innerException);
	}

	protected getName(): string {
		return NAME;
	}
}