import { Convert } from "../convert";
import { ITimer } from "../timers_/ITimer";
import { TimeSpan } from "../Timespan";

function getTimestampMilliseconds(): number {
	return (new Date()).getTime();
}

export class Stopwatch implements ITimer {

	static getTimestampMilliseconds(): number {
		return getTimestampMilliseconds();
	}

	private _elapsed: number = 0;
	private _startTimeStamp: number = 0;

	private _isRunning: boolean = false;
	get isRunning(): boolean {
		return this._isRunning;
	}

	constructor() {
		this.reset();
	}

	static startNew(): Stopwatch {
		const s = new Stopwatch();
		s.start();
		return s;
	}

	static measure(closure: () => void): TimeSpan {
		const start = getTimestampMilliseconds();
		closure();
		return new TimeSpan(Convert.ToLong(getTimestampMilliseconds() - start));
	}

	start(): void {
		const _ = this;
		if (!_._isRunning) {
			_._startTimeStamp = getTimestampMilliseconds();
			_._isRunning = true;
		}
	}

	stop(): void {
		const _ = this;
		if (_._isRunning) {
			_._elapsed += _.currentLapMilliseconds;
			_._isRunning = false;
		}
	}

	reset(): void {
		const _ = this;
		_._elapsed = 0;
		_._isRunning = false;
		_._startTimeStamp = NaN;
	}


	lap(): TimeSpan {
		const _ = this;
		if (_._isRunning) {
			const t = getTimestampMilliseconds();
			const s = _._startTimeStamp;
			const e = t - s;
			_._startTimeStamp = t;
			_._elapsed += e;
			return new TimeSpan(Convert.ToLong(e));
		}
		else
			return TimeSpan.Zero;
	}

	get currentLapMilliseconds(): number {
		return this._isRunning
			? (getTimestampMilliseconds() - this._startTimeStamp)
			: 0;
	}

	get currentLap(): TimeSpan {
		return this._isRunning
			? new TimeSpan(Convert.ToLong(this.currentLapMilliseconds))
			: TimeSpan.Zero;
	}

	get elapsedMilliseconds(): number {
		const _ = this;
		let timeElapsed = _._elapsed;

		if (_._isRunning)
			timeElapsed += _.currentLapMilliseconds;

		return timeElapsed;
	}

	get elapsed(): TimeSpan {
		return new TimeSpan(Convert.ToLong(this.elapsedMilliseconds));
	}

}
