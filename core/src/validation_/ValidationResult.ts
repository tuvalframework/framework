import { IEquatable } from "../IEquatable";
import { IValidationResult } from "./IValidationResult"; // For compatibility with (let, const, function, class);

let VALID: ValidationResult | null = null;

/**
 * A class for generating responses to validation.
 */
export class ValidationResult implements IValidationResult, IEquatable<IValidationResult>
{
	/**
	 * Allows for rare cases that ValidationResult.valid and ValidationResult.invalid() don't cover.
	 */
	constructor(
		readonly isValid: boolean = false,
		readonly message?: string,
		readonly data: any = null) {
		this.isValid = isValid;
		this.message = message;
		this.data = data;

	}

	/**
	 * Allows for comparing another IValidationResult to see if they are equal.
	 */
	Equals(other: IValidationResult): boolean {
		const _ = this;
		return _.isValid === other.isValid
			&& _.message == _.message
			&& _.data == _.data;
	}


	/**
	 * Represents a single/shared instance of a valid result.
	 * Allows for returning this instance like you would return 'true'.
	 */
	static get valid(): IValidationResult {
		return VALID || (VALID = new ValidationResult(true));
	}

	/**
	 * Factory method for easily creating an invalid result.
	 */
	static invalid(
		message: string,
		data: any = null): IValidationResult {
		return new ValidationResult(false, message, data);
	}
}
