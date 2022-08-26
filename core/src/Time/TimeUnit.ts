import { Hours, Milliseconds, Minutes, Seconds, Ticks } from "./HowMany";
import { ITimeQuantity } from "./ITimeQuantity";

export enum TimeUnit {
	Ticks,
	Milliseconds,
	Seconds,
	Minutes,
	Hours,
	Days
} // Earth Days

export namespace TimeUnit {

	export function toMilliseconds(
		value: number,
		units: TimeUnit = TimeUnit.Milliseconds): number {
		// noinspection FallThroughInSwitchStatementJS
		switch (units) {
			case TimeUnit.Days:
				value *= Hours.Per.Day;
			case TimeUnit.Hours:
				value *= Minutes.Per.Hour;
			case TimeUnit.Minutes:
				value *= Seconds.Per.Minute;
			case TimeUnit.Seconds:
				value *= Milliseconds.Per.Second;
			case TimeUnit.Milliseconds:
				return value;
			case TimeUnit.Ticks:
				return value / Ticks.Per.Millisecond;
			default:
				throw new Error("Invalid TimeUnit.");
		}
	}

	export function fromMilliseconds(
		ms: number,
		units: TimeUnit) {
		switch (units) {
			case TimeUnit.Days:
				return ms / Milliseconds.Per.Day;
			case TimeUnit.Hours:
				return ms / Milliseconds.Per.Hour;
			case TimeUnit.Minutes:
				return ms / Milliseconds.Per.Minute;
			case TimeUnit.Seconds:
				return ms / Milliseconds.Per.Second;
			case TimeUnit.Milliseconds:
				return ms;
			case TimeUnit.Ticks:
				return ms * Ticks.Per.Millisecond;
			default:
				throw new Error("Invalid TimeUnit.");
		}
	}

	export function from(quantity: ITimeQuantity, unit: TimeUnit): number {
		return quantity && fromMilliseconds(quantity.getTotalMilliseconds(), unit);
	}


	export function assertValid(unit: TimeUnit): true | never {
		if (isNaN(unit) || unit > TimeUnit.Days || unit < TimeUnit.Ticks || Math.floor(unit) !== unit)
			throw new Error("Invalid TimeUnit.");

		return true;
	}

}
