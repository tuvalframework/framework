import { Type } from "../Reflection";
import { ITimeStamp } from "./ITimeStamp";
import { Ticks } from "./HowMany";
import { IDateTime } from "./IDateTime";
import { Gregorian } from "./Calendars";

/**
 * An alternative to Date or DateTime.  Is a model representing the exact date and time.
 */
export class TimeStamp implements ITimeStamp, IDateTime {

	constructor(
		public readonly year: number,
		public readonly month: Gregorian.Month,
		public readonly day: number = 1,
		public readonly hour: number = 0,
		public readonly minute: number = 0,
		public readonly second: number = 0,
		public readonly millisecond: number = 0,
		public readonly tick: number = 0) {

		// Add validation or properly carry out of range values?

	}

	toJsDate(): Date {
		const _ = this;
		return new Date(_.year, _.month, _.day, _.hour, _.minute, _.second, _.millisecond + _.tick / Ticks.Per.Millisecond);
	}

	static from(d: Date | IDateTime): TimeStamp {
		if (!(d instanceof Date) && Type.hasMember(d, 'toJsDate'))
			d = (<IDateTime>d).toJsDate();
		if (d instanceof Date) {
			return new TimeStamp(
				d.getFullYear(),
				d.getMonth(),
				d.getDate(),
				d.getHours(),
				d.getMinutes(),
				d.getSeconds(),
				d.getMilliseconds()
			);
		}
		else {
			throw Error('Invalid date type.');
		}
	}
}