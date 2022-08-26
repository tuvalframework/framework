import { DateTime } from "../Time/__DateTime";
import { TimeSpan } from "../Timespan";

export class DaylightTimeStruct {
    public Start: DateTime;
    public End: DateTime;
    public Delta: TimeSpan;
    public constructor(start: DateTime, end: DateTime, delta: TimeSpan) {
        this.Start = start;
        this.End = end;
        this.Delta = delta;
    }
}
export class DaylightTime {
    public /*internal */  m_start: DateTime = null as any;
    public /*internal */  m_end: DateTime = null as any;
    public /*internal */  m_delta: TimeSpan = null as any;

    public constructor();
    public constructor(start: DateTime, end: DateTime, delta: TimeSpan);
    public constructor(...args: any[]) {
        if (args.length === 0) {

        } else if (args.length === 3) {
            const start: DateTime = args[0];
            const end: DateTime = args[1];
            const delta: TimeSpan = args[2];
            this.m_start = start;
            this.m_end = end;
            this.m_delta = delta;
        }
    }

    // The start date of a daylight saving period.
    public get Start(): DateTime {
        return this.m_start;
    }

    // The end date of a daylight saving period.
    public get End(): DateTime {
        return this.m_end;
    }

    // Delta to stardard offset in ticks.
    public get Delta(): TimeSpan {
        return this.m_delta;
    }
}

// Value type version of DaylightTime
