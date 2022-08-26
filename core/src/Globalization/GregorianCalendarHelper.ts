// Gregorian Calendars use Era Info
// Note: We shouldn't have to serialize this since the info doesn't change, but we have been.

import { Convert } from "../convert";
import { Environment } from "../Environment";
import { ArgumentOutOfRangeException } from "../Exceptions/ArgumentOutOfRangeException";
import { int, long, IntArray, New } from '../float';
import { Internal, Virtual } from "../Reflection/Decorators/ClassInfo";
import { SR } from "../SR";
import { TString } from "../Text/TString";
import { DayOfWeek } from "../Time/DayOfWeek";
import { DateTime } from "../Time/__DateTime";
import { TimeSpan } from "../Timespan";
import { Calendar } from "./Calendar";
import { TArray } from '../Extensions/TArray';
import { ArgumentException } from "../Exceptions/ArgumentException";
import { CalendarWeekRule } from "./CalendarWeekRule";
import { GregorianCalendar } from "./GregorianCalendar";
import { is } from "../is";
import { System } from '../SystemTypes';

const AppContextSwitches = {
    EnforceLegacyJapaneseDateParsing: false,
    EnforceJapaneseEraYearRanges: false
};

// (We really only need the calendar #, and maybe culture)
export class EraInfo {
    public /* internal */   era: int = 0;          // The value of the era.
    public /* internal */  ticks: long = Convert.ToLong(0);    // The time in ticks when the era starts
    public /* internal */   yearOffset: int = 0;   // The offset to Gregorian year when the era starts.
    // Gregorian Year = Era Year + yearOffset
    // Era Year = Gregorian Year - yearOffset
    public /* internal */   minEraYear: int = 0;   // Min year value in this era. Generally, this value is 1, but this may
    // be affected by the DateTime.MinValue;
    public /* internal */   maxEraYear: int = 0;   // Max year value in this era. (== the year length of the era + 1)

    public /* internal */  eraName: string = '';    // The era name
    public /* internal */  abbrevEraName: string = '';  // Abbreviated Era Name
    public /* internal */  englishEraName: string = ''; // English era name

    public /* internal */ constructor(era: int, startYear: int, startMonth: int, startDay: int, yearOffset: int, minEraYear: int, maxEraYear: int);
    public /* internal */ constructor(era: int, startYear: int, startMonth: int, startDay: int, yearOffset: int, minEraYear: int, maxEraYear: int, eraName: string, abbrevEraName: string, englishEraName: string);
    public constructor(...args: any[]) {
        if (args.length === 7) {
            const era: int = args[0];
            const startYear: int = args[1];
            const startMonth: int = args[2];
            const startDay: int = args[3];
            const yearOffset: int = args[4];
            const minEraYear: int = args[5];
            const maxEraYear: int = args[6];
            this.era = era;
            this.yearOffset = yearOffset;
            this.minEraYear = minEraYear;
            this.maxEraYear = maxEraYear;
            this.ticks = new DateTime(startYear, startMonth, startDay).Ticks;
        } else if (args.length === 10) {
            const era: int = args[0];
            const startYear: int = args[1];
            const startMonth: int = args[2];
            const startDay: int = args[3];
            const yearOffset: int = args[4];
            const minEraYear: int = args[5];
            const maxEraYear: int = args[6];
            const eraName: string = args[7];
            const abbrevEraName: string = args[8];
            const englishEraName: string = args[9];
            this.era = era;
            this.yearOffset = yearOffset;
            this.minEraYear = minEraYear;
            this.maxEraYear = maxEraYear;
            this.ticks = new DateTime(startYear, startMonth, startDay).Ticks;
            this.eraName = eraName;
            this.abbrevEraName = abbrevEraName;
            this.englishEraName = englishEraName;
        }
    }
}


// This calendar recognizes two era values:
// 0 CurrentEra (AD)
// 1 BeforeCurrentEra (BC)
export /* internal */ class GregorianCalendarHelper {

    // 1 tick = 100ns = 10E-7 second
    // Number of ticks per time unit
    public /* internal */ static readonly TicksPerMillisecond: long = Convert.ToLong(10000);
    public /* internal */ static readonly TicksPerSecond: long = GregorianCalendarHelper.TicksPerMillisecond.mul(1000);
    public /* internal */ static readonly TicksPerMinute: long = GregorianCalendarHelper.TicksPerSecond.mul(60);
    public /* internal */ static readonly TicksPerHour: long = GregorianCalendarHelper.TicksPerMinute.mul(60);
    public /* internal */ static readonly TicksPerDay: long = GregorianCalendarHelper.TicksPerHour.mul(24);

    // Number of milliseconds per time unit
    public /* internal */ static readonly MillisPerSecond: int = 1000;
    public /* internal */ static readonly MillisPerMinute: int = GregorianCalendarHelper.MillisPerSecond * 60;
    public /* internal */ static readonly MillisPerHour: int = GregorianCalendarHelper.MillisPerMinute * 60;
    public /* internal */ static readonly MillisPerDay: int = GregorianCalendarHelper.MillisPerHour * 24;

    // Number of days in a non-leap year
    public /* internal */ static readonly DaysPerYear: int = 365;
    // Number of days in 4 years
    public /* internal */ static readonly DaysPer4Years: int = GregorianCalendarHelper.DaysPerYear * 4 + 1;
    // Number of days in 100 years
    public /* internal */ static readonly DaysPer100Years: int = GregorianCalendarHelper.DaysPer4Years * 25 - 1;
    // Number of days in 400 years
    public /* internal */ static readonly DaysPer400Years: int = GregorianCalendarHelper.DaysPer100Years * 4 + 1;

    // Number of days from 1/1/0001 to 1/1/10000
    public /* internal */ static readonly DaysTo10000: int = GregorianCalendarHelper.DaysPer400Years * 25 - 366;

    public /* internal */ static MaxMillis: long = Convert.ToLong(GregorianCalendarHelper.DaysTo10000).mul(GregorianCalendarHelper.MillisPerDay);

    public /* internal */ static readonly DatePartYear: int = 0;
    public /* internal */ static readonly DatePartDayOfYear: int = 1;
    public /* internal */ static readonly DatePartMonth: int = 2;
    public /* internal */ static readonly DatePartDay: int = 3;

    //
    // This is the max Gregorian year can be represented by DateTime class.  The limitation
    // is derived from DateTime class.
    //
    public /* internal */ get MaxYear(): int {
        return (this.m_maxYear);
    }

    public /* internal */ static readonly DaysToMonth365: IntArray = New.IntArray([0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365]);
    public /* internal */ static readonly DaysToMonth366: IntArray = New.IntArray([0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366]);

    // Strictly these don't need serialized since they can be recreated from the calendar id
    public /* internal */  m_maxYear: int = 9999;
    public /* internal */  m_minYear: int = 0;
    public /* internal */  m_Cal: Calendar = null as any;

    // Era information doesn't need serialized, its constant for the same calendars (ie: we can recreate it from the calendar id)
    public /* internal */  m_EraInfo: EraInfo[] = null as any;
    public /* internal */  m_eras: IntArray = null as any;

    // m_minDate is existing here just to keep the serialization compatibility.
    // it has nothing to do with the code anymore.
    public /* internal */  m_minDate: DateTime = null as any;

    // Construct an instance of gregorian calendar.
    public /* internal */ constructor(cal: Calendar, eraInfo: EraInfo[]) {
        this.m_Cal = cal;
        this.m_EraInfo = eraInfo;
        // m_minDate is existing here just to keep the serialization compatibility.
        // it has nothing to do with the code anymore.
        this.m_minDate = this.m_Cal.MinSupportedDateTime;
        this.m_maxYear = this.m_EraInfo[0].maxEraYear;
        this.m_minYear = this.m_EraInfo[0].minEraYear;;
    }

    // see https://github.com/dotnet/coreclr/pull/18209
    // EraInfo.yearOffset:  The offset to Gregorian year when the era starts. Gregorian Year = Era Year + yearOffset
    //                      Era Year = Gregorian Year - yearOffset
    // EraInfo.minEraYear:  Min year value in this era. Generally, this value is 1, but this may be affected by the DateTime.MinValue;
    // EraInfo.maxEraYear:  Max year value in this era. (== the year length of the era + 1)
    private GetYearOffset(year: int, era: int, throwOnError: boolean): int {
        if (year < 0) {
            if (throwOnError) {
                throw new ArgumentOutOfRangeException(''/* nameof(year), SR.ArgumentOutOfRange_NeedNonNegNum */);
            }
            return -1;
        }

        if (era == Calendar.CurrentEra) {
            era = this.m_Cal.CurrentEraValue;
        }

        for (let i: int = 0; i < this.m_EraInfo.length; i++) {
            if (era === this.m_EraInfo[i].era) {
                if (year >= this.m_EraInfo[i].minEraYear) {
                    if (year <= this.m_EraInfo[i].maxEraYear) {
                        return this.m_EraInfo[i].yearOffset;
                    }
                    else if (!AppContextSwitches.EnforceJapaneseEraYearRanges) {
                        // If we got the year number exceeding the era max year number, this still possible be valid as the date can be created before
                        // introducing new eras after the era we are checking. we'll loop on the eras after the era we have and ensure the year
                        // can exist in one of these eras. otherwise, we'll throw.
                        // Note, we always return the offset associated with the requested era.
                        //
                        // Here is some example:
                        // if we are getting the era number 4 (Heisei) and getting the year number 32. if the era 4 has year range from 1 to 31
                        // then year 32 exceeded the range of era 4 and we'll try to find out if the years difference (32 - 31 = 1) would lay in
                        // the subsequent eras (e.g era 5 and up)

                        let remainingYears: int = year - this.m_EraInfo[i].maxEraYear;

                        for (let j: int = i - 1; j >= 0; j--) {
                            if (remainingYears <= this.m_EraInfo[j].maxEraYear) {
                                return this.m_EraInfo[i].yearOffset;
                            }
                            remainingYears -= this.m_EraInfo[j].maxEraYear;
                        }
                    }
                }

                if (throwOnError) {
                    throw new ArgumentOutOfRangeException('');
                    /*  year,
                     TString.Format(
                        /*  CultureInfo.CurrentCulture, */
                    /*  SR.ArgumentOutOfRange_Range,
                     this.m_EraInfo[i].minEraYear,
                     this.m_EraInfo[i].maxEraYear));  */
                }

                break; // no need to iterate more on eras.
            }
        }

        if (throwOnError) {
            throw new ArgumentOutOfRangeException('');/* ;nameof(era), SR.ArgumentOutOfRange_InvalidEraValue); */
        }
        return -1;
    }


    /*=================================GetGregorianYear==========================
    **Action: Get the Gregorian year value for the specified year in an era.
    **Returns: The Gregorian year value.
    **Arguments:
    **      year    the year value in Japanese calendar
    **      era     the Japanese emperor era value.
    **Exceptions:
    **      ArgumentOutOfRangeException if year value is invalid or era value is invalid.
    ============================================================================*/

    public /* internal */  GetGregorianYear(year: int, era: int): int {
        return this.GetYearOffset(year, era, true) + year;
    }

    public /* internal */  IsValidYear(year: int, era: int): boolean {
        return this.GetYearOffset(year, era, false) >= 0;
    }

    // Returns a given date part of this DateTime. This method is used
    // to compute the year, day-of-year, month, or day part.
    @Internal
    @Virtual
    public GetDatePart(ticks: long, part: int): int {
        this.CheckTicksRange(ticks);
        // n = number of days since 1/1/0001
        let n: int = ticks.div(GregorianCalendarHelper.TicksPerDay).toNumber();
        // y400 = number of whole 400-year periods since 1/1/0001
        const y400: int = n / GregorianCalendarHelper.DaysPer400Years;
        // n = day number within 400-year period
        n -= y400 * GregorianCalendarHelper.DaysPer400Years;
        // y100 = number of whole 100-year periods within 400-year period
        let y100: int = n / GregorianCalendarHelper.DaysPer100Years;
        // Last 100-year period has an extra day, so decrement result if 4
        if (y100 == 4) y100 = 3;
        // n = day number within 100-year period
        n -= y100 * GregorianCalendarHelper.DaysPer100Years;
        // y4 = number of whole 4-year periods within 100-year period
        const y4: int = n / GregorianCalendarHelper.DaysPer4Years;
        // n = day number within 4-year period
        n -= y4 * GregorianCalendarHelper.DaysPer4Years;
        // y1 = number of whole years within 4-year period
        let y1: int = n / GregorianCalendarHelper.DaysPerYear;
        // Last year has an extra day, so decrement result if 4
        if (y1 == 4) y1 = 3;
        // If year was requested, compute and return it
        if (part === GregorianCalendarHelper.DatePartYear) {
            return (y400 * 400 + y100 * 100 + y4 * 4 + y1 + 1);
        }
        // n = day number within year
        n -= y1 * GregorianCalendarHelper.DaysPerYear;
        // If day-of-year was requested, return it
        if (part === GregorianCalendarHelper.DatePartDayOfYear) {
            return (n + 1);
        }
        // Leap year calculation looks different from IsLeapYear since y1, y4,
        // and y100 are relative to year 1, not year 0
        const leapYear: boolean = (y1 === 3 && (y4 !== 24 || y100 === 3));
        const days: IntArray = leapYear ? GregorianCalendarHelper.DaysToMonth366 : GregorianCalendarHelper.DaysToMonth365;
        // All months have less than 32 days, so n >> 5 is a good conservative
        // estimate for the month
        let m: int = n >> 5 + 1;
        // m = 1-based month number
        while (n >= days[m]) m++;
        // If month was requested, return it
        if (part === GregorianCalendarHelper.DatePartMonth) return (m);
        // Return 1-based day-of-month
        return (n - days[m - 1] + 1);
    }

    /*=================================GetAbsoluteDate==========================
    **Action: Gets the absolute date for the given Gregorian date.  The absolute date means
    **       the number of days from January 1st, 1 A.D.
    **Returns:  the absolute date
    **Arguments:
    **      year    the Gregorian year
    **      month   the Gregorian month
    **      day     the day
    **Exceptions:
    **      ArgumentOutOfRangException  if year, month, day value is valid.
    **Note:
    **      This is an internal method used by DateToTicks() and the calculations of Hijri and Hebrew calendars.
    **      Number of Days in Prior Years (both common and leap years) +
    **      Number of Days in Prior Months of Current Year +
    **      Number of Days in Current Month
    **
    ============================================================================*/

    public /* internal */ static GetAbsoluteDate(year: int, month: int, day: int): long {
        if (year >= 1 && year <= 9999 && month >= 1 && month <= 12) {
            const days: IntArray = ((year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0))) ? GregorianCalendarHelper.DaysToMonth366 : GregorianCalendarHelper.DaysToMonth365;
            if (day >= 1 && (day <= days[month] - days[month - 1])) {
                const y: int = year - 1;
                const absoluteDate: int = y * 365 + y / 4 - y / 100 + y / 400 + days[month - 1] + day - 1;
                return Convert.ToLong(absoluteDate);
            }
        }
        throw new ArgumentOutOfRangeException(Environment.GetResourceString("ArgumentOutOfRange_BadYearMonthDay"));
    }

    // Returns the tick count corresponding to the given year, month, and day.
    // Will check the if the parameters are valid.
    public /* internal */ static DateToTicks(year: int, month: int, day: int): long {
        return GregorianCalendarHelper.GetAbsoluteDate(year, month, day).mul(GregorianCalendarHelper.TicksPerDay);
    }

    // Return the tick count corresponding to the given hour, minute, second.
    // Will check the if the parameters are valid.
    public /* internal */ static TimeToTicks(hour: int, minute: int, second: int, millisecond: int): long {
        //TimeSpan.TimeToTicks is a family access function which does no error checking, so
        //we need to put some error checking out here.
        if (hour >= 0 && hour < 24 && minute >= 0 && minute < 60 && second >= 0 && second < 60) {
            if (millisecond < 0 || millisecond >= GregorianCalendarHelper.MillisPerSecond) {
                throw new ArgumentOutOfRangeException(
                    "millisecond",
                    TString.Format(
                        /* CultureInfo.CurrentCulture, */
                        Environment.GetResourceString("ArgumentOutOfRange_Range"),
                        0,
                        GregorianCalendarHelper.MillisPerSecond - 1));
            }
            return (TimeSpan.TimeToTicks(hour, minute, second).add(GregorianCalendarHelper.TicksPerMillisecond.mul(millisecond)));;
        }
        throw new ArgumentOutOfRangeException(Environment.GetResourceString("ArgumentOutOfRange_BadHourMinuteSecond"));
    }


    public /* internal */  CheckTicksRange(ticks: long): void {
        if (ticks.lessThan(this.m_Cal.MinSupportedDateTime.Ticks) || ticks.greaterThan(this.m_Cal.MaxSupportedDateTime.Ticks)) {
            throw new ArgumentOutOfRangeException(
                "time",
                TString.Format(
                    /* CultureInfo.InvariantCulture, */
                    Environment.GetResourceString("ArgumentOutOfRange_CalendarRange"),
                    this.m_Cal.MinSupportedDateTime,
                    this.m_Cal.MaxSupportedDateTime));
        }
        //Contract.EndContractBlock();
    }

    // Returns the DateTime resulting from adding the given number of
    // months to the specified DateTime. The result is computed by incrementing
    // (or decrementing) the year and month parts of the specified DateTime by
    // value months, and, if required, adjusting the day part of the
    // resulting date downwards to the last day of the resulting month in the
    // resulting year. The time-of-day part of the result is the same as the
    // time-of-day part of the specified DateTime.
    //
    // In more precise terms, considering the specified DateTime to be of the
    // form y / m / d + t, where y is the
    // year, m is the month, d is the day, and t is the
    // time-of-day, the result is y1 / m1 / d1 + t,
    // where y1 and m1 are computed by adding value months
    // to y and m, and d1 is the largest value less than
    // or equal to d that denotes a valid day in month m1 of year
    // y1.
    //
    public AddMonths(time: DateTime, months: int): DateTime {
        if (months < -120000 || months > 120000) {
            throw new ArgumentOutOfRangeException(
                "months",
                TString.Format(
                    /* CultureInfo.CurrentCulture, */
                    Environment.GetResourceString("ArgumentOutOfRange_Range"),
                    -120000,
                    120000));
        }
        //Contract.EndContractBlock();
        this.CheckTicksRange(time.Ticks);

        let y: int = this.GetDatePart(time.Ticks, GregorianCalendarHelper.DatePartYear);
        let m: int = this.GetDatePart(time.Ticks, GregorianCalendarHelper.DatePartMonth);
        let d: int = this.GetDatePart(time.Ticks, GregorianCalendarHelper.DatePartDay);
        const i: int = m - 1 + months;
        if (i >= 0) {
            m = i % 12 + 1;
            y = y + i / 12;
        }
        else {
            m = 12 + (i + 1) % 12;
            y = y + (i - 11) / 12;
        }
        const daysArray: IntArray = (y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0)) ? GregorianCalendarHelper.DaysToMonth366 : GregorianCalendarHelper.DaysToMonth365;
        const days: int = (daysArray[m] - daysArray[m - 1]);

        if (d > days) {
            d = days;
        }
        const ticks: long = GregorianCalendarHelper.DateToTicks(y, m, d).add(time.Ticks.mod(GregorianCalendarHelper.TicksPerDay));
        Calendar.CheckAddResult(ticks, this.m_Cal.MinSupportedDateTime, this.m_Cal.MaxSupportedDateTime);
        return (new DateTime(ticks));
    }

    // Returns the DateTime resulting from adding the given number of
    // years to the specified DateTime. The result is computed by incrementing
    // (or decrementing) the year part of the specified DateTime by value
    // years. If the month and day of the specified DateTime is 2/29, and if the
    // resulting year is not a leap year, the month and day of the resulting
    // DateTime becomes 2/28. Otherwise, the month, day, and time-of-day
    // parts of the result are the same as those of the specified DateTime.
    //
    public AddYears(time: DateTime, years: int): DateTime {
        return (this.AddMonths(time, years * 12));
    }

    // Returns the day-of-month part of the specified DateTime. The returned
    // value is an integer between 1 and 31.
    //
    public GetDayOfMonth(time: DateTime): int {
        return (this.GetDatePart(time.Ticks, GregorianCalendarHelper.DatePartDay));
    }

    // Returns the day-of-week part of the specified DateTime. The returned value
    // is an integer between 0 and 6, where 0 indicates Sunday, 1 indicates
    // Monday, 2 indicates Tuesday, 3 indicates Wednesday, 4 indicates
    // Thursday, 5 indicates Friday, and 6 indicates Saturday.
    //
    public GetDayOfWeek(time: DateTime): DayOfWeek {
        this.CheckTicksRange(time.Ticks);
        return (time.Ticks.div(GregorianCalendarHelper.TicksPerDay).add(1)).mod(7).toNumber();
    }

    // Returns the day-of-year part of the specified DateTime. The returned value
    // is an integer between 1 and 366.
    //
    public GetDayOfYear(time: DateTime): int {
        return (this.GetDatePart(time.Ticks, GregorianCalendarHelper.DatePartDayOfYear));
    }

    // Returns the number of days in the month given by the year and
    // month arguments.
    //
    public GetDaysInMonth(year: int, month: int, era: int): int {
        //
        // Convert year/era value to Gregorain year value.
        //
        year = this.GetGregorianYear(year, era);
        if (month < 1 || month > 12) {
            throw new ArgumentOutOfRangeException("month", Environment.GetResourceString("ArgumentOutOfRange_Month"));
        }
        const days: IntArray = ((year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? GregorianCalendarHelper.DaysToMonth366 : GregorianCalendarHelper.DaysToMonth365);
        return (days[month] - days[month - 1]);
    }

    // Returns the number of days in the year given by the year argument for the current era.
    //

    public GetDaysInYear(year: int, era: int): int {
        //
        // Convert year/era value to Gregorain year value.
        //
        year = this.GetGregorianYear(year, era);
        return ((year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 366 : 365);
    }

    // Returns the era for the specified DateTime value.
    public GetEra(time: DateTime): int {
        const ticks: long = time.Ticks;
        // The assumption here is that m_EraInfo is listed in reverse order.
        for (let i: int = 0; i < this.m_EraInfo.length; i++) {
            if (ticks >= this.m_EraInfo[i].ticks) {
                return (this.m_EraInfo[i].era);
            }
        }
        throw new ArgumentOutOfRangeException(Environment.GetResourceString("ArgumentOutOfRange_Era"));
    }


    public get Eras(): IntArray {
        if (this.m_eras == null) {
            this.m_eras = New.IntArray(this.m_EraInfo.length);
            for (let i: int = 0; i < this.m_EraInfo.length; i++) {
                this.m_eras[i] = this.m_EraInfo[i].era;
            }
        }
        return TArray.CloneInt32Array(this.m_eras);
    }

    // Returns the month part of the specified DateTime. The returned value is an
    // integer between 1 and 12.
    //
    public GetMonth(time: DateTime): int {
        return (this.GetDatePart(time.Ticks, GregorianCalendarHelper.DatePartMonth));
    }

    // Returns the number of months in the specified year and era.
    public GetMonthsInYear(year: int, era: int): int {
        year = this.GetGregorianYear(year, era);
        return 12;
    }

    // Returns the year part of the specified DateTime. The returned value is an
    // integer between 1 and 9999.
    //
    public GetYear(time: DateTime): int;
     // Returns the year that match the specified Gregorian year. The returned value is an
    // integer between 1 and 9999.
    //
    public GetYear(year: int, time: DateTime): int;
    public GetYear(...args: any[]): int {
        if (args.length === 1 && is.typeof<DateTime>(args[0], System.Types.DateTime)) {
            const time: DateTime = args[0];
            const ticks: long = time.Ticks;
            const year: int = this.GetDatePart(ticks, GregorianCalendarHelper.DatePartYear);
            for (let i: int = 0; i < this.m_EraInfo.length; i++) {
                if (ticks >= this.m_EraInfo[i].ticks) {
                    return (year - this.m_EraInfo[i].yearOffset);
                }
            }
            throw new ArgumentException(Environment.GetResourceString("Argument_NoEra"));
        } else if (args.length === 2 && is.int(args[0]) && is.typeof<DateTime>(args[1], System.Types.DateTime)) {
            const year: int = args[0];
            const time: DateTime = args[1];
            const ticks: long = time.Ticks;
            for (let i: int = 0; i < this.m_EraInfo.length; i++) {
                if (ticks >= this.m_EraInfo[i].ticks) {
                    return (year - this.m_EraInfo[i].yearOffset);
                }
            }
            throw new ArgumentException(Environment.GetResourceString("Argument_NoEra"));
        }
        throw new ArgumentOutOfRangeException('');
    }




    // Checks whether a given day in the specified era is a leap day. This method returns true if
    // the date is a leap day, or false if not.
    //
    public IsLeapDay(year: int, month: int, day: int, era: int): boolean {
        // year/month/era checking is done in GetDaysInMonth()
        if (day < 1 || day > this.GetDaysInMonth(year, month, era)) {
            throw new ArgumentOutOfRangeException(
                "day",
                TString.Format(
                    /*  CultureInfo.CurrentCulture, */
                    Environment.GetResourceString("ArgumentOutOfRange_Range"),
                    1,
                    this.GetDaysInMonth(year, month, era)));
        }
        //Contract.EndContractBlock();

        if (!this.IsLeapYear(year, era)) {
            return (false);
        }

        if (month === 2 && day === 29) {
            return (true);
        }

        return false;
    }

    // Returns  the leap month in a calendar year of the specified era. This method returns 0
    // if this calendar does not have leap month, or this year is not a leap year.
    //
    public GetLeapMonth(year: int, era: int): int {
        year = this.GetGregorianYear(year, era);
        return (0);
    }

    // Checks whether a given month in the specified era is a leap month. This method returns true if
    // month is a leap month, or false if not.
    //
    public IsLeapMonth(year: int, month: int, era: int): boolean {
        year = this.GetGregorianYear(year, era);
        if (month < 1 || month > 12) {
            throw new ArgumentOutOfRangeException(
                "month",
                TString.Format(
                    /* CultureInfo.CurrentCulture, */
                    Environment.GetResourceString("ArgumentOutOfRange_Range"),
                    1,
                    12));
        }
        return (false);
    }

    // Checks whether a given year in the specified era is a leap year. This method returns true if
    // year is a leap year, or false if not.
    //
    public IsLeapYear(year: int, era: int): boolean {
        year = this.GetGregorianYear(year, era);
        return (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0));
    }

    // Returns the date and time converted to a DateTime value.  Throws an exception if the n-tuple is invalid.
    //
    public ToDateTime(year: int, month: int, day: int, hour: int, minute: int, second: int, millisecond: int, era: int): DateTime {
        year = this.GetGregorianYear(year, era);
        const ticks: long = GregorianCalendarHelper.DateToTicks(year, month, day).add(GregorianCalendarHelper.TimeToTicks(hour, minute, second, millisecond));
        this.CheckTicksRange(ticks);
        return (new DateTime(ticks));
    }

    @Virtual
    public GetWeekOfYear(time: DateTime, rule: CalendarWeekRule, firstDayOfWeek: DayOfWeek): int {
        this.CheckTicksRange(time.Ticks);
        // Use GregorianCalendar to get around the problem that the implmentation in Calendar.GetWeekOfYear()
        // can call GetYear() that exceeds the supported range of the Gregorian-based calendars.
        return (GregorianCalendar.GetDefaultInstance().GetWeekOfYear(time, rule, firstDayOfWeek));
    }


    public ToFourDigitYear(year: int, twoDigitYearMax: int): int {
        if (year < 0) {
            throw new ArgumentOutOfRangeException("year",
                Environment.GetResourceString("ArgumentOutOfRange_NeedPosNum"));
        }
        //Contract.EndContractBlock();

        if (year < 100) {
            const y: int = year % 100;
            return ((twoDigitYearMax / 100 - (y > twoDigitYearMax % 100 ? 1 : 0)) * 100 + y);
        }

        if (year < this.m_minYear || year > this.m_maxYear) {
            throw new ArgumentOutOfRangeException(
                "year",
                TString.Format(
                    /* CultureInfo.CurrentCulture, */
                    Environment.GetResourceString("ArgumentOutOfRange_Range"), this.m_minYear, this.m_maxYear));
        }
        // If the year value is above 100, just return the year value.  Don't have to do
        // the TwoDigitYearMax comparison.
        return (year);
    }
}