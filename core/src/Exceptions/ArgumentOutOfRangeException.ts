import { ArgumentException, } from "./ArgumentException";
import { Primitive } from "../Primitive";

const NAME: string = 'ArgumentOutOfRangeException';

export class ArgumentOutOfRangeException extends ArgumentException {
	actualValue: Primitive | null | undefined;

	constructor(
		paramName: string,
		actualValue?: Primitive | null | undefined,
		message: string = ' ',
		innerException?: Error) {
		super(paramName, `(${actualValue}) ` + message, innerException, (_) => {
			_.actualValue = actualValue;
		});
	}


	protected getName(): string {
		return NAME;
	}

}