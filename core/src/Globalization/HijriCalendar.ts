////////////////////////////////////////////////////////////////////////////
//
//  Rules for the Hijri calendar:
//    - The Hijri calendar is a strictly Lunar calendar.
//    - Days begin at sunset.
//    - Islamic Year 1 (Muharram 1, 1 A.H.) is equivalent to absolute date
//        227015 (Friday, July 16, 622 C.E. - Julian).
//    - Leap Years occur in the 2, 5, 7, 10, 13, 16, 18, 21, 24, 26, & 29th
//        years of a 30-year cycle.  Year = leap iff ((11y+14) mod 30 < 11).
//    - There are 12 months which contain alternately 30 and 29 days.
//    - The 12th month, Dhu al-Hijjah, contains 30 days instead of 29 days
//        in a leap year.
//    - Common years have 354 days.  Leap years have 355 days.
//    - There are 10,631 days in a 30-year cycle.
//    - The Islamic months are:
//        1.  Muharram   (30 days)     7.  Rajab          (30 days)
//        2.  Safar      (29 days)     8.  Sha'ban        (29 days)
//        3.  Rabi I     (30 days)     9.  Ramadan        (30 days)
//        4.  Rabi II    (29 days)     10. Shawwal        (29 days)
//        5.  Jumada I   (30 days)     11. Dhu al-Qada    (30 days)
//        6.  Jumada II  (29 days)     12. Dhu al-Hijjah  (29 days) {30}
//
//  NOTENOTE
//      The calculation of the HijriCalendar is based on the absolute date.  And the
//      absolute date means the number of days from January 1st, 1 A.D.
//      Therefore, we do not support the days before the January 1st, 1 A.D.
//
////////////////////////////////////////////////////////////////////////////
/*
**  Calendar support range:
**      Calendar    Minimum     Maximum
**      ==========  ==========  ==========
**      Gregorian   0622/07/18   9999/12/31
**      Hijri       0001/01/01   9666/04/03
*/

import { Calendar } from "./Calendar";
import { IntArray, int, long, New } from '../float';
import { Int32 } from "../Int32";
import { DateTime } from "../Time/__DateTime";
import { Internal, Override, Virtual } from "../Reflection/Decorators/ClassInfo";
import { CalendarAlgorithmType } from "./CalendarAlgorithmType";
import { Convert } from '../convert';
import { ArgumentOutOfRangeException } from '../Exceptions/ArgumentOutOfRangeException';
import { TString } from "../Text/TString";
import { Environment } from "../Environment";
import { GregorianCalendar } from "./GregorianCalendar";
import { InvalidOperationException } from "../Exceptions/InvalidOperationException";
import { DayOfWeek } from "../Time/DayOfWeek";
import { is } from "../is";

export class HijriCalendar extends Calendar {
    protected dispose(disposing: boolean): void {
        throw new Error("Method not implemented.");
    }
    public static readonly HijriEra: int = 1;

    public /* internal */ static readonly DatePartYear: int = 0;
    public /* internal */ static readonly DatePartDayOfYear: int = 1;
    public /* internal */ static readonly DatePartMonth: int = 2;
    public /* internal */ static readonly DatePartDay: int = 3;

    public /* internal */ static readonly MinAdvancedHijri: int = -2;
    public /* internal */ static readonly MaxAdvancedHijri: int = 2;

    public /* internal */ static readonly HijriMonthDays: int[] = [0, 30, 59, 89, 118, 148, 177, 207, 236, 266, 295, 325, 355];

    //internal static Calendar m_defaultInstance;



    private m_HijriAdvance: int = Int32.MinValue;

    // DateTime.MaxValue = Hijri calendar (year:9666, month: 4, day: 3).
    public /* internal */ static readonly MaxCalendarYear: int = 9666;
    public /* internal */ static readonly MaxCalendarMonth: int = 4;
    public /* internal */ static readonly MaxCalendarDay: int = 3;
    // Hijri calendar (year: 1, month: 1, day:1 ) = Gregorian (year: 622, month: 7, day: 18)
    // This is the minimal Gregorian date that we support in the HijriCalendar.
    public /* internal */ static readonly calendarMinValue: DateTime = new DateTime(622, 7, 18);
    public /* internal */ static readonly calendarMaxValue: DateTime = DateTime.MaxValue;


    @Override
    protected Get_MinSupportedDateTime(): DateTime {
        return HijriCalendar.calendarMinValue;
    }

    @Override
    protected Get_MaxSupportedDateTime(): DateTime {
        return HijriCalendar.calendarMaxValue;
    }

    // Return the type of the Hijri calendar.
    //

    @Override
    protected Get_AlgorithmType(): CalendarAlgorithmType {
        return CalendarAlgorithmType.LunarCalendar;
    }

    /*=================================GetDefaultInstance==========================
    **Action: Internal method to provide a default intance of HijriCalendar.  Used by NLS+ implementation
    **       and other calendars.
    **Returns:
    **Arguments:
    **Exceptions:
    ============================================================================*/
    /*
    internal static Calendar GetDefaultInstance() {
        if (m_defaultInstance == null) {
            m_defaultInstance = new HijriCalendar();
        }
        return (m_defaultInstance);
    }
    */

    // Construct an instance of Hijri calendar.

    public constructor() {
        super();
    }

    @Override
    protected Get_ID(): int {
        return HijriCalendar.CAL_HIJRI;
    }


    @Override
    protected Get_DaysInYearBeforeMinSupportedYear(): int {
        // the year before the 1st year of the cycle would have been the 30th year
        // of the previous cycle which is not a leap year. Common years have 354 days.
        return 354;
    }



    /*=================================GetAbsoluteDateHijri==========================
    **Action: Gets the Absolute date for the given Hijri date.  The absolute date means
    **       the number of days from January 1st, 1 A.D.
    **Returns:
    **Arguments:
    **Exceptions:
    ============================================================================*/

    private GetAbsoluteDateHijri(y: int, m: int, d: int): long {
        return this.DaysUpToHijriYear(y).add(HijriCalendar.HijriMonthDays[m - 1]).add(d).sub(1).sub(this.HijriAdjustment);
    }

    /*=================================DaysUpToHijriYear==========================
    **Action: Gets the total number of days (absolute date) up to the given Hijri Year.
    **       The absolute date means the number of days from January 1st, 1 A.D.
    **Returns: Gets the total number of days (absolute date) up to the given Hijri Year.
    **Arguments: HijriYear year value in Hijri calendar.
    **Exceptions: None
    **Notes:
    ============================================================================*/

    private DaysUpToHijriYear(HijriYear: int): long {
        let NumDays: long;           // number of absolute days
        let NumYear30: int;         // number of years up to current 30 year cycle
        let NumYearsLeft: int;      // number of years into 30 year cycle

        //
        //  Compute the number of years up to the current 30 year cycle.
        //
        NumYear30 = ((HijriYear - 1) / 30) * 30;

        //
        //  Compute the number of years left.  This is the number of years
        //  into the 30 year cycle for the given year.
        //
        NumYearsLeft = HijriYear - NumYear30 - 1;

        //
        //  Compute the number of absolute days up to the given year.
        //
        NumDays = Convert.ToLong(((NumYear30 * 10631) / 30) + 227013);
        while (NumYearsLeft > 0) {
            // Common year is 354 days, and leap year is 355 days.
            NumDays = NumDays.add(354 + (this.IsLeapYear(NumYearsLeft, HijriCalendar.CurrentEra) ? 1 : 0));
            NumYearsLeft--;
        }

        //
        //  Return the number of absolute days.
        //
        return NumDays;
    }


    public get HijriAdjustment(): int {
        if (this.m_HijriAdvance === Int32.MinValue) {
            // Never been set before.  Use the system value from registry.
            this.m_HijriAdvance = HijriCalendar.GetAdvanceHijriDate();
        }
        return this.m_HijriAdvance;
    }

    public set HijriAdjustment(value: int) {
        // NOTE: Check the value of Min/MaxAdavncedHijri with Arabic speakers to see if the assumption is good.
        if (value < HijriCalendar.MinAdvancedHijri || value > HijriCalendar.MaxAdvancedHijri) {
            throw new ArgumentOutOfRangeException(
                "HijriAdjustment",
                TString.Format(
                    /*  CultureInfo.CurrentCulture, */
                    Environment.GetResourceString("ArgumentOutOfRange_Bounds_Lower_Upper"),
                    HijriCalendar.MinAdvancedHijri,
                    HijriCalendar.MaxAdvancedHijri));
        }
        //Contract.EndContractBlock();
        this.VerifyWritable();

        this.m_HijriAdvance = value;
    }


    /*=================================GetAdvanceHijriDate==========================
    **Action: Gets the AddHijriDate value from the registry.
    **Returns:
    **Arguments:    None.
    **Exceptions:
    **Note:
    **  The HijriCalendar has a user-overidable calculation.  That is, use can set a value from the control
    **  panel, so that the calculation of the Hijri Calendar can move ahead or backwards from -2 to +2 days.
    **
    **  The valid string values in the registry are:
    **      "AddHijriDate-2"  =>  Add -2 days to the current calculated Hijri date.
    **      "AddHijriDate"    =>  Add -1 day to the current calculated Hijri date.
    **      ""              =>  Add 0 day to the current calculated Hijri date.
    **      "AddHijriDate+1"  =>  Add +1 days to the current calculated Hijri date.
    **      "AddHijriDate+2"  =>  Add +2 days to the current calculated Hijri date.
    ============================================================================*/
    private static GetAdvanceHijriDate(): int {

        const hijriAdvance: int = 0;

        return (hijriAdvance);
    }

    public static /* internal */  CheckTicksRange(ticks: long): void {
        if (ticks < HijriCalendar.calendarMinValue.Ticks || ticks > HijriCalendar.calendarMaxValue.Ticks) {
            throw new ArgumentOutOfRangeException(
                "time",
                TString.Format(
                    /* CultureInfo.InvariantCulture, */
                    Environment.GetResourceString("ArgumentOutOfRange_CalendarRange"),
                    HijriCalendar.calendarMinValue,
                    HijriCalendar.calendarMaxValue));
        }
    }

    public static /* internal */  CheckEraRange(era: int): void {
        if (era !== HijriCalendar.CurrentEra && era !== HijriCalendar.HijriEra) {
            throw new ArgumentOutOfRangeException("era", Environment.GetResourceString("ArgumentOutOfRange_InvalidEraValue"));
        }
    }

    public static /* internal */  CheckYearRange(year: int, era: int): void {
        HijriCalendar.CheckEraRange(era);
        if (year < 1 || year > HijriCalendar.MaxCalendarYear) {
            throw new ArgumentOutOfRangeException(
                "year",
                TString.Format(
                    /*  CultureInfo.CurrentCulture, */
                    Environment.GetResourceString("ArgumentOutOfRange_Range"),
                    1,
                    HijriCalendar.MaxCalendarYear));
        }
    }

    public static /* internal */  CheckYearMonthRange(year: int, month: int, era: int): void {
        HijriCalendar.CheckYearRange(year, era);
        if (year === HijriCalendar.MaxCalendarYear) {
            if (month > HijriCalendar.MaxCalendarMonth) {
                throw new ArgumentOutOfRangeException(
                    "month",
                    TString.Format(
                        /* CultureInfo.CurrentCulture, */
                        Environment.GetResourceString("ArgumentOutOfRange_Range"),
                        1,
                        HijriCalendar.MaxCalendarMonth));
            }
        }

        if (month < 1 || month > 12) {
            throw new ArgumentOutOfRangeException("month", Environment.GetResourceString("ArgumentOutOfRange_Month"));
        }
    }

    /*=================================GetDatePart==========================
    **Action: Returns a given date part of this <i>DateTime</i>. This method is used
    **       to compute the year, day-of-year, month, or day part.
    **Returns:
    **Arguments:
    **Exceptions:  ArgumentException if part is incorrect.
    **Notes:
    **      First, we get the absolute date (the number of days from January 1st, 1 A.C) for the given ticks.
    **      Use the formula (((AbsoluteDate - 227013) * 30) / 10631) + 1, we can a rough value for the Hijri year.
    **      In order to get the exact Hijri year, we compare the exact absolute date for HijriYear and (HijriYear + 1).
    **      From here, we can get the correct Hijri year.
    ============================================================================*/

    @Internal
    @Virtual
    public GetDatePart(ticks: long, part: int): int {
        let HijriYear: int;                   // Hijri year
        let HijriMonth: int;                  // Hijri month
        let HijriDay: int;                    // Hijri day
        let NumDays: long;                 // The calculation buffer in number of days.

        HijriCalendar.CheckTicksRange(ticks);

        //
        //  Get the absolute date.  The absolute date is the number of days from January 1st, 1 A.D.
        //  1/1/0001 is absolute date 1.
        //
        NumDays = ticks.div(GregorianCalendar.TicksPerDay).add(1);

        //
        //  See how much we need to backup or advance
        //
        NumDays = NumDays.add(this.HijriAdjustment);

        //
        //  Calculate the appromixate Hijri Year from this magic formula.
        //
        HijriYear = NumDays.sub(227013).mul(30).div(10631).add(1).toNumber();

        let daysToHijriYear: long = this.DaysUpToHijriYear(HijriYear);            // The absoulte date for HijriYear
        const daysOfHijriYear: long = Convert.ToLong(this.GetDaysInYear(HijriYear, HijriCalendar.CurrentEra));    // The number of days for (HijriYear+1) year.

        if (NumDays.lessThan(daysToHijriYear)) {
            daysToHijriYear = daysToHijriYear.sub(daysOfHijriYear);
            HijriYear--;
        } else if (NumDays.equals(daysToHijriYear)) {
            HijriYear--;
            daysToHijriYear = daysToHijriYear.sub(this.GetDaysInYear(HijriYear, HijriCalendar.CurrentEra));
        } else {
            if (NumDays.greaterThan(daysToHijriYear.add(daysOfHijriYear))) {
                daysToHijriYear = daysToHijriYear.add(daysOfHijriYear);
                HijriYear++;
            }
        }
        if (part == HijriCalendar.DatePartYear) {
            return HijriYear;
        }

        //
        //  Calculate the Hijri Month.
        //

        HijriMonth = 1;
        NumDays = NumDays.sub(daysToHijriYear);

        if (part === HijriCalendar.DatePartDayOfYear) {
            return NumDays.toNumber();
        }

        while ((HijriMonth <= 12) && (NumDays.greaterThan(HijriCalendar.HijriMonthDays[HijriMonth - 1]))) {
            HijriMonth++;
        }
        HijriMonth--;

        if (part === HijriCalendar.DatePartMonth) {
            return HijriMonth;
        }

        //
        //  Calculate the Hijri Day.
        //
        HijriDay = (NumDays.sub(HijriCalendar.HijriMonthDays[HijriMonth - 1])).toNumber();

        if (part === HijriCalendar.DatePartDay) {
            return (HijriDay);
        }
        // Incorrect part value.
        throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_DateTimeParsing"));
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
        // Get the date in Hijri calendar.
        let y: int = this.GetDatePart(time.Ticks, HijriCalendar.DatePartYear);
        let m: int = this.GetDatePart(time.Ticks, HijriCalendar.DatePartMonth);
        let d: int = this.GetDatePart(time.Ticks, HijriCalendar.DatePartDay);
        const i: int = m - 1 + months;
        if (i >= 0) {
            m = i % 12 + 1;
            y = y + i / 12;
        } else {
            m = 12 + (i + 1) % 12;
            y = y + (i - 11) / 12;
        }
        const days: int = this.GetDaysInMonth(y, m);
        if (d > days) {
            d = days;
        }
        const ticks: long = this.GetAbsoluteDateHijri(y, m, d).mul(HijriCalendar.TicksPerDay).add(time.Ticks.mod(HijriCalendar.TicksPerDay));
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
        return this.AddMonths(time, years * 12);
    }

    // Returns the day-of-month part of the specified DateTime. The returned
    // value is an integer between 1 and 31.
    //

    @Override
    public GetDayOfMonth(time: DateTime): int {
        return this.GetDatePart(time.Ticks, HijriCalendar.DatePartDay);
    }

    // Returns the day-of-week part of the specified DateTime. The returned value
    // is an integer between 0 and 6, where 0 indicates Sunday, 1 indicates
    // Monday, 2 indicates Tuesday, 3 indicates Wednesday, 4 indicates
    // Thursday, 5 indicates Friday, and 6 indicates Saturday.
    //

    @Override
    public GetDayOfWeek(time: DateTime): DayOfWeek {
        return time.Ticks.div(HijriCalendar.TicksPerDay).add(1).mod(7).toNumber();
    }

    // Returns the day-of-year part of the specified DateTime. The returned value
    // is an integer between 1 and 366.
    //
    @Override
    public GetDayOfYear(time: DateTime): int {
        return (this.GetDatePart(time.Ticks, HijriCalendar.DatePartDayOfYear));
    }


    // Returns the number of days in the month given by the year and
    // month arguments for the specified era.
    public /* override */  GetDaysInMonth(year: int, month: int, era: int): int;
    public GetDaysInMonth(year: int, month: int): int;
    public GetDaysInMonth(...args: any[]): int {
        if (args.length === 2) {
            const year: int = args[0];
            const month: int = args[1];
            return super.GetDaysInMonth(year, month);
        } else if (args.length === 3) {
            const year: int = args[0];
            const month: int = args[1];
            const era: int = args[2];
            HijriCalendar.CheckYearMonthRange(year, month, era);
            if (month === 12) {
                // For the 12th month, leap year has 30 days, and common year has 29 days.
                return (this.IsLeapYear(year, HijriCalendar.CurrentEra) ? 30 : 29);
            }
            // Other months contain 30 and 29 days alternatively.  The 1st month has 30 days.
            return (((month % 2) == 1) ? 30 : 29);
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
            HijriCalendar.CheckYearRange(year, era);
            // Common years have 354 days.  Leap years have 355 days.
            return this.IsLeapYear(year, HijriCalendar.CurrentEra) ? 355 : 354;
        }
        throw new ArgumentOutOfRangeException('');
    }

    // Returns the era for the specified DateTime value.

    @Override
    public GetEra(time: DateTime): int {
        HijriCalendar.CheckTicksRange(time.Ticks);
        return HijriCalendar.HijriEra;
    }


    @Override
    protected Get_Eras(): IntArray {
        return New.IntArray([HijriCalendar.HijriEra]);
    }

    // Returns the month part of the specified DateTime. The returned value is an
    // integer between 1 and 12.
    //
    @Override
    public GetMonth(time: DateTime): int {
        return this.GetDatePart(time.Ticks, HijriCalendar.DatePartMonth);
    }

    // Returns the number of months in the specified year in the current era.
    public /* override */  GetMonthsInYear(year: int, era: int): int;
    public GetMonthsInYear(year: int): int;
    public GetMonthsInYear(...args: any[]): int {
        if (args.length === 1) {
            const year: int = args[0];
            return super.GetMonthsInYear(year);
        } else if (args.length === 2) {
            const year: int = args[0];
            const era: int = args[1];
            HijriCalendar.CheckYearRange(year, era);
            return 12;
        }
        throw new ArgumentOutOfRangeException('');
    }

    // Returns the year part of the specified DateTime. The returned value is an
    // integer between 1 and MaxCalendarYear.
    //
    @Override
    public GetYear(time: DateTime): int {
        return this.GetDatePart(time.Ticks, HijriCalendar.DatePartYear);
    }

    // Checks whether a given day in the current era is a leap day. This method returns true if
    // the date is a leap day, or false if not.
    public /* override */  IsLeapDay(year: int, month: int, day: int, era: int): boolean;
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
            // The year/month/era value checking is done in GetDaysInMonth().
            const daysInMonth: int = this.GetDaysInMonth(year, month, era);
            if (day < 1 || day > daysInMonth) {
                throw new ArgumentOutOfRangeException(
                    "day",
                    TString.Format(
                        /* CultureInfo.CurrentCulture, */
                        Environment.GetResourceString("ArgumentOutOfRange_Day"),
                        daysInMonth,
                        month));
            }
            return this.IsLeapYear(year, era) && month === 12 && day === 30;
        }
        throw new ArgumentOutOfRangeException('');
    }


    // Returns  the leap month in a calendar year of the current era. This method returns 0
    // if this calendar does not have leap month, or this year is not a leap year.
    //
    public GetLeapMonth(year: int): int;
    public GetLeapMonth(year: int, era: int): int;
    public GetLeapMonth(...args: any[]): int {
        if (args.length === 1 && is.int(args[0])) {
            const year: int = args[0];
            return super.GetLeapMonth(year);
        } else if (args.length === 2 && is.int(args[0]) && is.int(args[1])) {
            const year: int = args[0];
            const era: int = args[1];
            HijriCalendar.CheckYearRange(year, era);
            return (0);
        }
        throw new ArgumentOutOfRangeException('');
    }


    // Checks whether a given month in the specified era is a leap month. This method returns true if
    // month is a leap month, or false if not.
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
            HijriCalendar.CheckYearMonthRange(year, month, era);
            return (false);
        }
        throw new ArgumentOutOfRangeException('');
    }


    // Checks whether a given year in the current era is a leap year. This method returns true if
    // year is a leap year, or false if not.
    //
    public IsLeapYear(year: int): boolean;
    public /* override */  IsLeapYear(year: int, era: int): boolean;
    public IsLeapYear(...args: any[]): boolean {
        if (arguments.length === 1 && is.int(args[0])) {
            const year: int = args[0];
            return super.IsLeapYear(year);
        } else if (args.length === 2) {
            const year: int = args[0];
            const era: int = args[1];
            HijriCalendar.CheckYearRange(year, era);
            return ((((year * 11) + 14) % 30) < 11);
        }
        throw new ArgumentOutOfRangeException('');
    }


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
            // The year/month/era checking is done in GetDaysInMonth().
            const daysInMonth: int = this.GetDaysInMonth(year, month, era);
            if (day < 1 || day > daysInMonth) {
                //BCLDebug.Log("year = " + year + ", month = " + month + ", day = " + day);
                throw new ArgumentOutOfRangeException(
                    "day",
                    TString.Format(
                        /*  CultureInfo.CurrentCulture, */
                        Environment.GetResourceString("ArgumentOutOfRange_Day"),
                        daysInMonth,
                        month));
            }

            const lDate: long = this.GetAbsoluteDateHijri(year, month, day);

            if (lDate.greaterThanOrEqual(0)) {
                return (new DateTime(lDate.mul(GregorianCalendar.TicksPerDay).add(HijriCalendar.TimeToTicks(hour, minute, second, millisecond))));
            } else {
                throw new ArgumentOutOfRangeException(null as any, Environment.GetResourceString("ArgumentOutOfRange_BadYearMonthDay"));
            }
        }
        throw new ArgumentOutOfRangeException('');
    }

    private static readonly DEFAULT_TWO_DIGIT_YEAR_MAX: int = 1451;


    @Override
    protected Get_TwoDigitYearMax(): int {
        if (this.twoDigitYearMax == -1) {
            this.twoDigitYearMax = HijriCalendar.GetSystemTwoDigitYearSetting(this.ID, HijriCalendar.DEFAULT_TWO_DIGIT_YEAR_MAX);
        }
        return this.twoDigitYearMax;
    }

    @Override
    protected Set_TwoDigitYearMax(value: int) {
        this.VerifyWritable();
        if (value < 99 || value > HijriCalendar.MaxCalendarYear) {
            throw new ArgumentOutOfRangeException(
                "value",
                TString.Format(
                    /*  CultureInfo.CurrentCulture, */
                    Environment.GetResourceString("ArgumentOutOfRange_Range"),
                    99,
                    HijriCalendar.MaxCalendarYear));

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

        if (year < 100) {
            return (super.ToFourDigitYear(year));
        }

        if (year > HijriCalendar.MaxCalendarYear) {
            throw new ArgumentOutOfRangeException(
                "year",
                TString.Format(
                    /* CultureInfo.CurrentCulture, */
                    Environment.GetResourceString("ArgumentOutOfRange_Range"),
                    1,
                    HijriCalendar.MaxCalendarYear));
        }
        return year;
    }

}