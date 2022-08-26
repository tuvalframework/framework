import { Convert } from "../convert";
import { Environment } from "../Environment";
import { ArgumentException } from "../Exceptions/ArgumentException";
import { ArgumentOutOfRangeException } from "../Exceptions/ArgumentOutOfRangeException";
import { IntArray, New, int, long } from "../float";
import { is } from "../is";
import { Out } from "../Out";
import { Internal, Override, Virtual } from "../Reflection/Decorators/ClassInfo";
import { TString } from "../Text/TString";
import { DayOfWeek } from "../Time/DayOfWeek";
import { DateTime } from "../Time/__DateTime";
import { Calendar } from "./Calendar";
import { CalendarAlgorithmType } from "./CalendarAlgorithmType";
import { CultureInfo } from "./CultureInfo";
import { GregorianCalendarTypes } from "./GregorianCalendarTypes";

export class GregorianCalendar extends Calendar {
    protected dispose(disposing: boolean): void {
        throw new Error("Method not implemented.");
    }

    /*
        A.D. = anno Domini
     */

    public static readonly ADEra: int = 1;


    public /* internal */ static readonly DatePartYear: int = 0;
    public /* internal */ static readonly DatePartDayOfYear: int = 1;
    public /* internal */ static readonly DatePartMonth: int = 2;
    public /* internal */ static readonly DatePartDay: int = 3;

    //
    // This is the max Gregorian year can be represented by DateTime class.  The limitation
    // is derived from DateTime class.
    //
    public /* internal */ static readonly MaxYear: int = 9999;
    public /* internal */ static readonly MinYear: int = 1; // needed for ISOWeek

    public /* internal */  m_type: GregorianCalendarTypes = GregorianCalendarTypes.Localized;

    public /* internal */ static readonly DaysToMonth365: IntArray = New.IntArray([0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365]);
    public /* internal */ static readonly DaysToMonth366: IntArray = New.IntArray([0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366]);

    private static s_defaultInstance: Calendar;

    @Override
    public Get_MinSupportedDateTime(): DateTime {
        return DateTime.MinValue;
    }

    @Override
    public Get_MaxSupportedDateTime(): DateTime {
        return DateTime.MaxValue;
    }

    // Return the type of the Gregorian calendar.
    //

    @Override
    public Get_AlgorithmType(): CalendarAlgorithmType {
        return CalendarAlgorithmType.SolarCalendar;
    }

    /*=================================GetDefaultInstance==========================
    **Action: Internal method to provide a default intance of GregorianCalendar.  Used by NLS+ implementation
    **       and other calendars.
    **Returns:
    **Arguments:
    **Exceptions:
    ============================================================================*/

    public /* internal */ static GetDefaultInstance(): Calendar {
        if (GregorianCalendar.s_defaultInstance == null) {
            GregorianCalendar.s_defaultInstance = new GregorianCalendar();
        }
        return (GregorianCalendar.s_defaultInstance);
    }

    // Construct an instance of gregorian calendar.

    public constructor(type: GregorianCalendarTypes = GregorianCalendarTypes.Localized) {
        super();
        if (type < GregorianCalendarTypes.Localized || type > GregorianCalendarTypes.TransliteratedFrench) {
            throw new ArgumentOutOfRangeException("type" + Environment.GetResourceString("ArgumentOutOfRange_Range" + GregorianCalendarTypes.Localized + GregorianCalendarTypes.TransliteratedFrench));
        }
        //Contract.EndContractBlock();
        this.m_type = type;
    }

    protected Get_CalendarType(): GregorianCalendarTypes {
        return this.m_type;
    }

    public get CalendarType(): GregorianCalendarTypes {
        return this.Get_CalendarType();
    }

    protected Set_CalendarType(value: GregorianCalendarTypes) {
        this.VerifyWritable();

        switch (value) {
            case GregorianCalendarTypes.Localized:
            case GregorianCalendarTypes.USEnglish:
            case GregorianCalendarTypes.MiddleEastFrench:
            case GregorianCalendarTypes.Arabic:
            case GregorianCalendarTypes.TransliteratedEnglish:
            case GregorianCalendarTypes.TransliteratedFrench:
                this.m_type = value;
                break;

            default:
                throw new ArgumentOutOfRangeException("m_type", Environment.GetResourceString("ArgumentOutOfRange_Enum"));
        }
    }
    public set CalendarType(value: GregorianCalendarTypes) {
        this.Set_CalendarType(value);
    }


    public /* internal */ Get_ID(): int {
        // By returning different ID for different variations of GregorianCalendar,
        // we can support the Transliterated Gregorian calendar.
        // DateTimeFormatInfo will use this ID to get formatting information about
        // the calendar.
        return this.m_type;
    }


    // Returns a given date part of this DateTime. This method is used
    // to compute the year, day-of-year, month, or day part.
    @Virtual
    public /* internal */   GetDatePart(ticks: long, part: int): int {
        // n = number of days since 1/1/0001
        let n: int = (ticks.div(GregorianCalendar.TicksPerDay)).toNumber();
        // y400 = number of whole 400-year periods since 1/1/0001
        const y400: int = n / GregorianCalendar.DaysPer400Years;
        // n = day number within 400-year period
        n -= y400 * GregorianCalendar.DaysPer400Years;
        // y100 = number of whole 100-year periods within 400-year period
        let y100: int = n / GregorianCalendar.DaysPer100Years;
        // Last 100-year period has an extra day, so decrement result if 4
        if (y100 === 4) {
            y100 = 3;
        }
        // n = day number within 100-year period
        n -= y100 * GregorianCalendar.DaysPer100Years;
        // y4 = number of whole 4-year periods within 100-year period
        const y4: int = n / GregorianCalendar.DaysPer4Years;
        // n = day number within 4-year period
        n -= y4 * GregorianCalendar.DaysPer4Years;
        // y1 = number of whole years within 4-year period
        let y1: int = n / GregorianCalendar.DaysPerYear;
        // Last year has an extra day, so decrement result if 4
        if (y1 === 4) {
            y1 = 3;
        }
        // If year was requested, compute and return it
        if (part === GregorianCalendar.DatePartYear) {
            return (y400 * 400 + y100 * 100 + y4 * 4 + y1 + 1);
        }
        // n = day number within year
        n -= y1 * GregorianCalendar.DaysPerYear;
        // If day-of-year was requested, return it
        if (part === GregorianCalendar.DatePartDayOfYear) {
            return (n + 1);
        }
        // Leap year calculation looks different from IsLeapYear since y1, y4,
        // and y100 are relative to year 1, not year 0
        const leapYear: boolean = (y1 === 3 && (y4 !== 24 || y100 === 3));
        const days: IntArray = leapYear ? GregorianCalendar.DaysToMonth366 : GregorianCalendar.DaysToMonth365;
        // All months have less than 32 days, so n >> 5 is a good conservative
        // estimate for the month
        let m: int = n >> 5 + 1;
        // m = 1-based month number
        while (n >= days[m]) {
            m++;
        }
        // If month was requested, return it
        if (part === GregorianCalendar.DatePartMonth) {
            return (m);
        }
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
        if (year >= 1 && year <= GregorianCalendar.MaxYear && month >= 1 && month <= 12) {
            const days: IntArray = ((year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0))) ? GregorianCalendar.DaysToMonth366 : GregorianCalendar.DaysToMonth365;
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
    @Virtual
    public /* internal */   DateToTicks(year: int, month: int, day: int): long {
        return GregorianCalendar.GetAbsoluteDate(year, month, day).mul(GregorianCalendar.TicksPerDay);
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

    @Override
    public AddMonths(time: DateTime, months: int): DateTime {
        if (months < -120000 || months > 120000) {
            throw new ArgumentOutOfRangeException(
                "months",
                TString.Format(
                    /*  CultureInfo.CurrentCulture, */
                    Environment.GetResourceString("ArgumentOutOfRange_Range"),
                    -120000,
                    120000));
        }
        //Contract.EndContractBlock();
        let y: int = this.GetDatePart(time.Ticks, GregorianCalendar.DatePartYear);
        let m: int = this.GetDatePart(time.Ticks, GregorianCalendar.DatePartMonth);
        let d: int = this.GetDatePart(time.Ticks, GregorianCalendar.DatePartDay);
        const i: int = m - 1 + months;
        if (i >= 0) {
            m = i % 12 + 1;
            y = y + i / 12;
        }
        else {
            m = 12 + (i + 1) % 12;
            y = y + (i - 11) / 12;
        }
        const daysArray: IntArray = (y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0)) ? GregorianCalendar.DaysToMonth366 : GregorianCalendar.DaysToMonth365;
        const days: int = (daysArray[m] - daysArray[m - 1]);

        if (d > days) {
            d = days;
        }
        const ticks: long = this.DateToTicks(y, m, d).add(time.Ticks.mod(GregorianCalendar.TicksPerDay));
        Calendar.CheckAddResult(ticks, this.MinSupportedDateTime, this.MaxSupportedDateTime);

        return new DateTime(ticks);
    }


    // Returns the DateTime resulting from adding the given number of
    // years to the specified DateTime. The result is computed by incrementing
    // (or decrementing) the year part of the specified DateTime by value
    // years. If the month and day of the specified DateTime is 2/29, and if the
    // resulting year is not a leap year, the month and day of the resulting
    // DateTime becomes 2/28. Otherwise, the month, day, and time-of-day
    // parts of the result are the same as those of the specified DateTime.
    //

    @Override
    public AddYears(time: DateTime, years: int): DateTime {
        return (this.AddMonths(time, years * 12));
    }

    // Returns the day-of-month part of the specified DateTime. The returned
    // value is an integer between 1 and 31.
    //

    @Override
    public GetDayOfMonth(time: DateTime): int {
        return this.GetDatePart(time.Ticks, GregorianCalendar.DatePartDay);
    }

    // Returns the day-of-week part of the specified DateTime. The returned value
    // is an integer between 0 and 6, where 0 indicates Sunday, 1 indicates
    // Monday, 2 indicates Tuesday, 3 indicates Wednesday, 4 indicates
    // Thursday, 5 indicates Friday, and 6 indicates Saturday.
    //

    @Override
    public GetDayOfWeek(time: DateTime): DayOfWeek {
        return (time.Ticks.div(GregorianCalendar.TicksPerDay).add(1)).mod(7).toNumber();
    }

    // Returns the day-of-year part of the specified DateTime. The returned value
    // is an integer between 1 and 366.
    //

    @Override
    public GetDayOfYear(time: DateTime): int {
        return (this.GetDatePart(time.Ticks, GregorianCalendar.DatePartDayOfYear));
    }

    // Returns the number of days in the month given by the year and
    // month arguments.
    //

    public /* override */  GetDaysInMonth(year: int, month: int, era: int): int;
    public GetDaysInMonth(year: int, month: int): int;
    public GetDaysInMonth(...args: any[]): int {
        if (args.length === 2) {
            const year: int = args[0];
            const month: int = args[1];
            return super.GetDaysInYear(year, month);
        } else if (args.length === 3) {
            const year: int = args[0];
            const month: int = args[1];
            const era: int = args[2];
            if (era == GregorianCalendar.CurrentEra || era === GregorianCalendar.ADEra) {
                if (year < 1 || year > GregorianCalendar.MaxYear) {
                    throw new ArgumentOutOfRangeException("year" + Environment.GetResourceString("ArgumentOutOfRange_Range" + 1 + GregorianCalendar.MaxYear));
                }
                if (month < 1 || month > 12) {
                    throw new ArgumentOutOfRangeException("month", Environment.GetResourceString("ArgumentOutOfRange_Month"));
                }
                const days: IntArray = ((year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? GregorianCalendar.DaysToMonth366 : GregorianCalendar.DaysToMonth365);
                return (days[month] - days[month - 1]);
            }
            throw new ArgumentOutOfRangeException("era", Environment.GetResourceString("ArgumentOutOfRange_InvalidEraValue"));
        }
        throw new ArgumentOutOfRangeException('');
    }



    // Returns the number of days in the year given by the year argument for the current era.
    //

    public GetDaysInYear(year: int): int;
    public /* override */  GetDaysInYear(year: int, era: int): int;
    public GetDaysInYear(...args: any[]): int {
        if (args.length === 1) {
            const year: int = args[0];
            return super.GetDaysInYear(year);
        } else if (args.length === 2) {
            const year: int = args[0];
            const era: int = args[1];
            if (era === GregorianCalendar.CurrentEra || era === GregorianCalendar.ADEra) {
                if (year >= 1 && year <= GregorianCalendar.MaxYear) {
                    return ((year % 4 == 0 && (year % 100 != 0 || year % 400 == 0)) ? 366 : 365);
                }
                throw new ArgumentOutOfRangeException(
                    "year",
                    TString.Format(
                        /*  CultureInfo.CurrentCulture, */
                        Environment.GetResourceString("ArgumentOutOfRange_Range"), 1, GregorianCalendar.MaxYear));
            }
            throw new ArgumentOutOfRangeException("era", Environment.GetResourceString("ArgumentOutOfRange_InvalidEraValue"));
        }
        throw new ArgumentOutOfRangeException('');
    }

    // Returns the era for the specified DateTime value.

    @Override
    public GetEra(time: DateTime): int {
        return (GregorianCalendar.ADEra);
    }


    @Override
    protected Get_Eras(): IntArray {
        return New.IntArray([GregorianCalendar.ADEra]);
    }


    // Returns the month part of the specified DateTime. The returned value is an
    // integer between 1 and 12.
    //

    @Override
    public GetMonth(time: DateTime): int {
        return (this.GetDatePart(time.Ticks, GregorianCalendar.DatePartMonth));
    }

    // Returns the number of months in the specified year and era.

    public /* override */  GetMonthsInYear(year: int, era: int): int;
    public GetMonthsInYear(year: int): int;
    public GetMonthsInYear(...args: any[]): int {
        if (args.length === 1) {
            const year: int = args[0];
            return super.GetMonthsInYear(year);
        } else if (args.length === 2) {
            const year: int = args[0];
            const era: int = args[1];
            if (era === GregorianCalendar.CurrentEra || era === GregorianCalendar.ADEra) {
                if (year >= 1 && year <= GregorianCalendar.MaxYear) {
                    return (12);
                }
                throw new ArgumentOutOfRangeException(
                    "year",
                    TString.Format(
                        /* CultureInfo.CurrentCulture, */
                        Environment.GetResourceString("ArgumentOutOfRange_Range"),
                        1,
                        GregorianCalendar.MaxYear));
            }
            throw new ArgumentOutOfRangeException("era", Environment.GetResourceString("ArgumentOutOfRange_InvalidEraValue"));
        }
        throw new ArgumentOutOfRangeException('');
    }



    // Returns the year part of the specified DateTime. The returned value is an
    // integer between 1 and 9999.
    //

    @Override
    public GetYear(time: DateTime): int {
        return (this.GetDatePart(time.Ticks, GregorianCalendar.DatePartYear));
    }

    // Checks whether a given day in the specified era is a leap day. This method returns true if
    // the date is a leap day, or false if not.
    //

    public /* abstract */  IsLeapDay(year: int, month: int, day: int, era: int): boolean;
    public IsLeapDay(year: int, month: int, day: int): boolean;
    public IsLeapDay(...args: any[]): boolean {
        if (arguments.length === 3) {
            const year: int = args[0];
            const month: int = args[1];
            const day: int = args[2];
            return super.IsLeapDay(year, month, day);
        } else if (args.length === 4) {
            const year: int = args[0];
            const month: int = args[1];
            const day: int = args[2];
            const era: int = args[3];

            if (month < 1 || month > 12) {
                throw new ArgumentOutOfRangeException("month", Environment.GetResourceString("ArgumentOutOfRange_Range",
                    1, 12));
            }
            //Contract.EndContractBlock();

            if (era !== GregorianCalendar.CurrentEra && era !== GregorianCalendar.ADEra) {
                throw new ArgumentOutOfRangeException("era", Environment.GetResourceString("ArgumentOutOfRange_InvalidEraValue"));
            }
            if (year < 1 || year > GregorianCalendar.MaxYear) {
                throw new ArgumentOutOfRangeException(
                    "year",
                    Environment.GetResourceString("ArgumentOutOfRange_Range", 1, GregorianCalendar.MaxYear));
            }

            if (day < 1 || day > this.GetDaysInMonth(year, month)) {
                throw new ArgumentOutOfRangeException("day", Environment.GetResourceString("ArgumentOutOfRange_Range") + this.GetDaysInMonth(year, month));
            }
            if (!this.IsLeapYear(year)) {
                return (false);
            }
            if (month == 2 && day == 29) {
                return (true);
            }
            return (false);
        }
        throw new ArgumentException('');
    }

    // Returns  the leap month in a calendar year of the specified era. This method returns 0
    // if this calendar does not have leap month, or this year is not a leap year.
    //
    // Returns  the leap month in a calendar year of the current era. This method returns 0
    // if this calendar does not have leap month, or this year is not a leap year.
    //
    public GetLeapMonth(year: int): int;
    // Returns  the leap month in a calendar year of the specified era. This method returns 0
    // if this calendar does not have leap month, or this year is not a leap year.
    //
    public GetLeapMonth(year: int, era: int): int;
    public GetLeapMonth(...args: any[]): int {
        if (args.length === 1 && is.int(args[0])) {
            const year: int = args[0];
            return super.GetLeapMonth(year);
        } else if (args.length === 2 && is.int(args[0]) && is.int(args[1])) {
            const year: int = args[0];
            const era: int = args[1];
            if (era !== GregorianCalendar.CurrentEra && era !== GregorianCalendar.ADEra) {
                throw new ArgumentOutOfRangeException("era", Environment.GetResourceString("ArgumentOutOfRange_InvalidEraValue"));
            }
            if (year < 1 || year > GregorianCalendar.MaxYear) {
                throw new ArgumentOutOfRangeException(
                    "year",
                    TString.Format(
                        /*  CultureInfo.CurrentCulture, */
                        Environment.GetResourceString("ArgumentOutOfRange_Range"), 1, GregorianCalendar.MaxYear));
            }
            //Contract.EndContractBlock();
            return 0;
        }
        throw new ArgumentOutOfRangeException('');
    }


    // Checks whether a given month in the specified era is a leap month. This method returns true if
    // month is a leap month, or false if not.
    //

    public /* override */  IsLeapMonth(year: int, month: int, era: int): boolean;
    public IsLeapMonth(year: int, month: int): boolean;
    public IsLeapMonth(...args: any[]): boolean {
        if (args.length === 2) {
            const year: int = args[0];
            const month: int = args[1];
            return super.IsLeapMonth(year, month);
        } else if (args.length === 3) {
            const year: int = args[0];
            const month: int = args[1];
            const era: int = args[2];
            if (era != GregorianCalendar.CurrentEra && era !== GregorianCalendar.ADEra) {
                throw new ArgumentOutOfRangeException("era", Environment.GetResourceString("ArgumentOutOfRange_InvalidEraValue"));
            }

            if (year < 1 || year > GregorianCalendar.MaxYear) {
                throw new ArgumentOutOfRangeException(
                    "year",
                    TString.Format(
                        /* CultureInfo.CurrentCulture, */
                        Environment.GetResourceString("ArgumentOutOfRange_Range"), 1, GregorianCalendar.MaxYear));
            }

            if (month < 1 || month > 12) {
                throw new ArgumentOutOfRangeException("month", Environment.GetResourceString("ArgumentOutOfRange_Range", 1, 12));
            }
            //Contract.EndContractBlock();
            return (false);
        }
        throw new ArgumentException('');
    }

    // Checks whether a given year in the specified era is a leap year. This method returns true if
    // year is a leap year, or false if not.
    //

    // Checks whether a given year in the current era is a leap year. This method returns true if
    // year is a leap year, or false if not.
    //
    public IsLeapYear(year: int): boolean;
    // Checks whether a given year in the specified era is a leap year. This method returns true if
    // year is a leap year, or false if not.
    //
    public /* override */  IsLeapYear(year: int, era: int): boolean;
    public IsLeapYear(...args: any[]): boolean {
        if (arguments.length === 1 && is.int(args[0])) {
            const year: int = args[0];
            return super.IsLeapYear(year);
        } else if (args.length === 2) {
            const year: int = args[0];
            const era: int = args[1];

            if (era === GregorianCalendar.CurrentEra || era === GregorianCalendar.ADEra) {
                if (year >= 1 && year <= GregorianCalendar.MaxYear) {
                    return (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0));
                }

                throw new ArgumentOutOfRangeException(
                    "year",
                    TString.Format(
                        /* CultureInfo.CurrentCulture, */
                        Environment.GetResourceString("ArgumentOutOfRange_Range"), 1, GregorianCalendar.MaxYear));
            }
            throw new ArgumentOutOfRangeException("era", Environment.GetResourceString("ArgumentOutOfRange_InvalidEraValue"));
        }
        throw new ArgumentException('');
    }

    // Returns the date and time converted to a DateTime value.  Throws an exception if the n-tuple is invalid.
    //

    public ToDateTime(year: int, month: int, day: int, hour: int, minute: int, second: int, millisecond: int): DateTime;
    public /* override */  ToDateTime(year: int, month: int, day: int, hour: int, minute: int, second: int, millisecond: int, era: int): DateTime;
    public ToDateTime(...args: any[]): DateTime {
        if (args.length === 7 && is.int(args[0]) && is.int(args[1]) && is.int(args[2]) && is.int(args[3]) && is.int(args[4]) && is.int(args[5]) && is.int(args[6])) {
            const year: int = args[0];
            const month: int = args[1];
            const day: int = args[2];
            const hour: int = args[3];
            const minute: int = args[4];
            const second: int = args[5];
            const millisecond: int = args[6];
            return super.ToDateTime(year, month, day, hour, minute, second, millisecond);
        } else if (args.length === 8) {
            const year: int = args[0];
            const month: int = args[1];
            const day: int = args[2];
            const hour: int = args[3];
            const minute: int = args[4];
            const second: int = args[5];
            const millisecond: int = args[6];
            const era: int = args[7];
            if (era === GregorianCalendar.CurrentEra || era === GregorianCalendar.ADEra) {
                return new DateTime(year, month, day, hour, minute, second, millisecond);
            }
            throw new ArgumentOutOfRangeException("era", Environment.GetResourceString("ArgumentOutOfRange_InvalidEraValue"));
        }
        throw new ArgumentOutOfRangeException('');
    }



    @Internal
    @Override
    public TryToDateTime(year: int, month: int, day: int, hour: int, minute: int, second: int, millisecond: int, era: int, result: Out<DateTime>): boolean {
        if (era === GregorianCalendar.CurrentEra || era === GregorianCalendar.ADEra) {
            return DateTime.TryCreate(year, month, day, hour, minute, second, millisecond, result);
        }
        result.value = DateTime.MinValue;
        return false;
    }

    private static readonly DEFAULT_TWO_DIGIT_YEAR_MAX: int = 2029;

    protected Get_TwoDigitYearMax(): int {
        if (this.twoDigitYearMax == -1) {
            this.twoDigitYearMax = GregorianCalendar.GetSystemTwoDigitYearSetting(this.ID, GregorianCalendar.DEFAULT_TWO_DIGIT_YEAR_MAX);
        }
        return this.twoDigitYearMax;
    }

    protected Set_TwoDigitYearMax(value: int) {
        this.VerifyWritable();
        if (value < 99 || value > GregorianCalendar.MaxYear) {
            throw new ArgumentOutOfRangeException(
                "year",
                TString.Format(
                    /* CultureInfo.CurrentCulture, */
                    Environment.GetResourceString("ArgumentOutOfRange_Range"),
                    99,
                    GregorianCalendar.MaxYear));

        }
        this.twoDigitYearMax = value;
    }


    @Override
    public ToFourDigitYear(year: int): int {
        if (year < 0) {
            throw new ArgumentOutOfRangeException("year",
                Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
        }
        //Contract.EndContractBlock();

        if (year > GregorianCalendar.MaxYear) {
            throw new ArgumentOutOfRangeException(
                "year",
                TString.Format(
                    /* CultureInfo.CurrentCulture, */
                    Environment.GetResourceString("ArgumentOutOfRange_Range"), 1, GregorianCalendar.MaxYear));
        }
        return super.ToFourDigitYear(year);
    }
}