import { Convert } from "../convert";
import { Environment } from "../Environment";
import { ArgumentOutOfRangeException } from "../Exceptions/ArgumentOutOfRangeException";
import { InvalidOperationException } from "../Exceptions/InvalidOperationException";
import { long, int, New, IntArray } from "../float";
import { is } from "../is";
import { Override } from "../Reflection/Decorators/ClassInfo";
import { TString } from "../Text/TString";
import { DayOfWeek } from "../Time/DayOfWeek";
import { DateTime } from "../Time/__DateTime";
import { Calendar } from "./Calendar";
import { CalendarAlgorithmType } from "./CalendarAlgorithmType";
import { CalendricalCalculationsHelper } from "./CalendricalCalculationsHelper";
import { CultureInfo } from "./CultureInfo";
import { GregorianCalendar } from "./GregorianCalendar";

export class PersianCalendar extends Calendar {
    protected dispose(disposing: boolean): void {
        throw new Error("Method not implemented.");
    }

    public static readonly PersianEra: int = 1;

    public /* internal */ static PersianEpoch: long = new DateTime(622, 3, 22).Ticks.div(GregorianCalendar.TicksPerDay);
    private static readonly ApproximateHalfYear: int = 180;

    public /* internal */ static readonly DatePartYear: int = 0;
    public /* internal */ static readonly DatePartDayOfYear: int = 1;
    public /* internal */ static readonly DatePartMonth: int = 2;
    public /* internal */ static readonly DatePartDay: int = 3;
    public /* internal */ static readonly MonthsPerYear: int = 12;

    public /* internal */ static DaysToMonth: int[] = [0, 31, 62, 93, 124, 155, 186, 216, 246, 276, 306, 336, 366];

    public /* internal */ static readonly MaxCalendarYear: int = 9378;
    public /* internal */ static readonly MaxCalendarMonth: int = 10;
    public /* internal */ static readonly MaxCalendarDay: int = 13;

    // Persian calendar (year: 1, month: 1, day:1 ) = Gregorian (year: 622, month: 3, day: 22)
    // This is the minimal Gregorian date that we support in the PersianCalendar.
    public /* internal */ static minDate: DateTime = new DateTime(622, 3, 22);
    public /* internal */ static maxDate: DateTime = DateTime.MaxValue;

    /*=================================GetDefaultInstance==========================
    **Action: Internal method to provide a default intance of PersianCalendar.  Used by NLS+ implementation
    **       and other calendars.
    **Returns:
    **Arguments:
    **Exceptions:
    ============================================================================*/
    /*
    internal static Calendar GetDefaultInstance() {
        if (m_defaultInstance == null) {
            m_defaultInstance = new PersianCalendar();
        }
        return (m_defaultInstance);
    }
    */



    @Override
    protected Get_MinSupportedDateTime(): DateTime {
        return PersianCalendar.minDate;
    }


    @Override
    protected Get_MaxSupportedDateTime(): DateTime {
        return PersianCalendar.maxDate;
    }

    // Return the type of the Persian calendar.
    //


    @Override
    protected Get_AlgorithmType(): CalendarAlgorithmType {
        return CalendarAlgorithmType.SolarCalendar;
    }

    // Construct an instance of Persian calendar.

    public constructor() {
        super();
    }


    @Override
    protected Get_BaseCalendarID() {
        return PersianCalendar.CAL_GREGORIAN;
    }

    @Override
    protected Get_ID(): int {
        return PersianCalendar.CAL_PERSIAN;
    }


    /*=================================GetAbsoluteDatePersian==========================
    **Action: Gets the Absolute date for the given Persian date.  The absolute date means
    **       the number of days from January 1st, 1 A.D.
    **Returns:
    **Arguments:
    **Exceptions:
    ============================================================================*/

    private GetAbsoluteDatePersian(year: int, month: int, day: int): long {
        if (year >= 1 && year <= PersianCalendar.MaxCalendarYear && month >= 1 && month <= 12) {
            const ordinalDay: int = PersianCalendar.DaysInPreviousMonths(month) + day - 1; // day is one based, make 0 based since this will be the number of days we add to beginning of year below
            const approximateDaysFromEpochForYearStart: int = (CalendricalCalculationsHelper.MeanTropicalYearInDays * (year - 1));
            let yearStart: long = Convert.ToLong(CalendricalCalculationsHelper.PersianNewYearOnOrBefore(PersianCalendar.PersianEpoch.add(approximateDaysFromEpochForYearStart).add(PersianCalendar.ApproximateHalfYear).toNumber()));
            yearStart = yearStart.add(ordinalDay);
            return yearStart;
        }
        throw new ArgumentOutOfRangeException(null as any, Environment.GetResourceString("ArgumentOutOfRange_BadYearMonthDay"));
    }

    public static /* internal */  CheckTicksRange(ticks: long): void {
        if (ticks < PersianCalendar.minDate.Ticks || ticks > PersianCalendar.maxDate.Ticks) {
            throw new ArgumentOutOfRangeException(
                "time",
                TString.Format(
                    /* CultureInfo.InvariantCulture, */
                    Environment.GetResourceString("ArgumentOutOfRange_CalendarRange"),
                    PersianCalendar.minDate,
                    PersianCalendar.maxDate));
        }
    }

    public static CheckEraRange(era: int): void {
        if (era !== PersianCalendar.CurrentEra && era !== PersianCalendar.PersianEra) {
            throw new ArgumentOutOfRangeException("era", Environment.GetResourceString("ArgumentOutOfRange_InvalidEraValue"));
        }
    }

    public static /* internal */  CheckYearRange(year: int, era: int): void {
        PersianCalendar.CheckEraRange(era);
        if (year < 1 || year > PersianCalendar.MaxCalendarYear) {
            throw new ArgumentOutOfRangeException(
                "year",
                TString.Format(
                    /* CultureInfo.CurrentCulture, */
                    Environment.GetResourceString("ArgumentOutOfRange_Range"),
                    1,
                    PersianCalendar.MaxCalendarYear));
        }
    }

    public static /* internal */  CheckYearMonthRange(year: int, month: int, era: int): void {
        PersianCalendar.CheckYearRange(year, era);
        if (year === PersianCalendar.MaxCalendarYear) {
            if (month > PersianCalendar.MaxCalendarMonth) {
                throw new ArgumentOutOfRangeException(
                    "month",
                    TString.Format(
                        /* CultureInfo.CurrentCulture, */
                        Environment.GetResourceString("ArgumentOutOfRange_Range"),
                        1,
                        PersianCalendar.MaxCalendarMonth));
            }
        }

        if (month < 1 || month > 12) {
            throw new ArgumentOutOfRangeException("month", Environment.GetResourceString("ArgumentOutOfRange_Month"));
        }
    }

    private static MonthFromOrdinalDay(ordinalDay: int): int {
        //Contract.Assert(ordinalDay <= 366);
        let index: int = 0;
        while (ordinalDay > PersianCalendar.DaysToMonth[index]) {
            index++;
        }

        return index;
    }

    private static DaysInPreviousMonths(month: int): int {
        //Contract.Assert(1 <= month && month <= 12);
        --month; // months are one based but for calculations use 0 based
        return PersianCalendar.DaysToMonth[month];
    }

    /*=================================GetDatePart==========================
    **Action: Returns a given date part of this <i>DateTime</i>. This method is used
    **       to compute the year, day-of-year, month, or day part.
    **Returns:
    **Arguments:
    **Exceptions:  ArgumentException if part is incorrect.
    ============================================================================*/

    public /* internal */  GetDatePart(ticks: long, part: int): int {
        let NumDays: long;                 // The calculation buffer in number of days.

        PersianCalendar.CheckTicksRange(ticks);

        //
        //  Get the absolute date.  The absolute date is the number of days from January 1st, 1 A.D.
        //  1/1/0001 is absolute date 1.
        //
        NumDays = ticks.div(GregorianCalendar.TicksPerDay).add(1);

        //
        //  Calculate the appromixate Persian Year.
        //

        let yearStart: long = Convert.ToLong(CalendricalCalculationsHelper.PersianNewYearOnOrBefore(NumDays.toNumber()));
        const y: int = Math.floor(((yearStart.sub(PersianCalendar.PersianEpoch)).div(CalendricalCalculationsHelper.MeanTropicalYearInDays).add(0.5)).toNumber()) + 1;
        //Contract.Assert(y >= 1);

        if (part === PersianCalendar.DatePartYear) {
            return y;
        }

        //
        //  Calculate the Persian Month.
        //

        const ordinalDay: int = (NumDays.sub(CalendricalCalculationsHelper.GetNumberOfDays(this.ToDateTime(y, 1, 1, 0, 0, 0, 0, 1)))).toNumber();

        if (part === PersianCalendar.DatePartDayOfYear) {
            return ordinalDay;
        }

        const m: int = PersianCalendar.MonthFromOrdinalDay(ordinalDay);
        /*  Contract.Assert(ordinalDay >= 1);
         Contract.Assert(m >= 1 && m <= 12); */
        if (part == PersianCalendar.DatePartMonth) {
            return m;
        }

        const d: int = ordinalDay - PersianCalendar.DaysInPreviousMonths(m);
        // Contract.Assert(1 <= d);
        // Contract.Assert(d <= 31);

        //
        //  Calculate the Persian Day.
        //

        if (part === PersianCalendar.DatePartDay) {
            return d;
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
                    /* CultureInfo.CurrentCulture, */
                    Environment.GetResourceString("ArgumentOutOfRange_Range"),
                    -120000,
                    120000));
        }
        //Contract.EndContractBlock();
        // Get the date in Persian calendar.
        let y: int = this.GetDatePart(time.Ticks, PersianCalendar.DatePartYear);
        let m: int = this.GetDatePart(time.Ticks, PersianCalendar.DatePartMonth);
        let d: int = this.GetDatePart(time.Ticks, PersianCalendar.DatePartDay);
        let i: int = m - 1 + months;
        if (i >= 0) {
            m = i % 12 + 1;
            y = y + i / 12;
        } else {
            m = 12 + (i + 1) % 12;
            y = y + (i - 11) / 12;
        }
        let days: int = this.GetDaysInMonth(y, m);
        if (d > days) {
            d = days;
        }
        const ticks: long = this.GetAbsoluteDatePersian(y, m, d).mul(PersianCalendar.TicksPerDay).add(time.Ticks.mod(PersianCalendar.TicksPerDay));
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
    @Override
    public GetDayOfMonth(time: DateTime): int {
        return this.GetDatePart(time.Ticks, PersianCalendar.DatePartDay);
    }

    // Returns the day-of-week part of the specified DateTime. The returned value
    // is an integer between 0 and 6, where 0 indicates Sunday, 1 indicates
    // Monday, 2 indicates Tuesday, 3 indicates Wednesday, 4 indicates
    // Thursday, 5 indicates Friday, and 6 indicates Saturday.
    @Override
    public GetDayOfWeek(time: DateTime): DayOfWeek {
        return time.Ticks.div(PersianCalendar.TicksPerDay).add(1).mod(7).toNumber();
    }

    // Returns the day-of-year part of the specified DateTime. The returned value
    // is an integer between 1 and 366.
    //


    @Override
    public GetDayOfYear(time: DateTime): int {
        return (this.GetDatePart(time.Ticks, PersianCalendar.DatePartDayOfYear));
    }


    // Returns the number of days in the month given by the year and
    // month arguments for the specified era.
    public /* override */  GetDaysInMonth(year: int, month: int, era: int): int;
    public GetDaysInMonth(year: int, month: int): int;
    public GetDaysInMonth(...args: any[]): int {
        if (args.length === 2) {
            const year: int = args[0];
            const month: int = args[1];
            return (this.GetDaysInMonth(year, month, Calendar.CurrentEra));
        } else if (args.length === 3) {
            const year: int = args[0];
            const month: int = args[1];
            const era: int = args[2];
            PersianCalendar.CheckYearMonthRange(year, month, era);

            if ((month === PersianCalendar.MaxCalendarMonth) && (year === PersianCalendar.MaxCalendarYear)) {
                return PersianCalendar.MaxCalendarDay;
            }

            let daysInMonth: int = PersianCalendar.DaysToMonth[month] - PersianCalendar.DaysToMonth[month - 1];
            if ((month === PersianCalendar.MonthsPerYear) && !this.IsLeapYear(year)) {
                // Contract.Assert(daysInMonth == 30);
                --daysInMonth;
            }
            return daysInMonth;
        }
        throw new ArgumentOutOfRangeException('');
    }


    // Returns the number of days in the year given by the year argument for the current era.
    public GetDaysInYear(year: int): int;
    public /* abstract */  GetDaysInYear(year: int, era: int): int;
    public GetDaysInYear(...args: any[]): int {
        if (args.length === 1) {
            const year: int = args[0];
            return (this.GetDaysInYear(year, Calendar.CurrentEra));
        } else if (args.length === 2) {
            const year: int = args[0];
            const era: int = args[1];
            PersianCalendar.CheckYearRange(year, era);
            if (year === PersianCalendar.MaxCalendarYear) {
                return PersianCalendar.DaysToMonth[PersianCalendar.MaxCalendarMonth - 1] + PersianCalendar.MaxCalendarDay;
            }
            // Common years have 365 days.  Leap years have 366 days.
            return this.IsLeapYear(year, PersianCalendar.CurrentEra) ? 366 : 365;
        }
        throw new ArgumentOutOfRangeException('');
    }

    // Returns the era for the specified DateTime value.
    @Override
    public GetEra(time: DateTime): int {
        PersianCalendar.CheckTicksRange(time.Ticks);
        return (PersianCalendar.PersianEra);
    }


    @Override
    public Get_Eras(): IntArray {
        return New.IntArray([PersianCalendar.PersianEra]);
    }


    // Returns the month part of the specified DateTime. The returned value is an
    // integer between 1 and 12.
    @Override
    public GetMonth(time: DateTime): int {
        return this.GetDatePart(time.Ticks, PersianCalendar.DatePartMonth);
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
            PersianCalendar.CheckYearRange(year, era);
            if (year === PersianCalendar.MaxCalendarYear) {
                return PersianCalendar.MaxCalendarMonth;
            }
            return 12;
        }
        throw new ArgumentOutOfRangeException('');
    }

    // Returns the year part of the specified DateTime. The returned value is an
    // integer between 1 and MaxCalendarYear.
    @Override
    public GetYear(time: DateTime): int {
        return (this.GetDatePart(time.Ticks, PersianCalendar.DatePartYear));
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
    public GetLeapMonth(year: int): int;
    public GetLeapMonth(year: int, era: int): int;
    public GetLeapMonth(...args: any[]): int {
        if (args.length === 1 && is.int(args[0])) {
            const year: int = args[0];
            return super.GetLeapMonth(year);
        } else if (args.length === 2 && is.int(args[0]) && is.int(args[1])) {
            const year: int = args[0];
            const era: int = args[1];
            PersianCalendar.CheckYearRange(year, era);
            return 0;
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
            PersianCalendar.CheckYearMonthRange(year, month, era);
            return false;
        }
        throw new ArgumentOutOfRangeException('');
    }

    // Checks whether a given year in the current era is a leap year. This method returns true if
    // year is a leap year, or false if not.
    public IsLeapYear(year: int): boolean;
    public /* override */  IsLeapYear(year: int, era: int): boolean;
    public IsLeapYear(...args: any[]): boolean {
        if (arguments.length === 1 && is.int(args[0])) {
            const year: int = args[0];
            return (this.IsLeapYear(year, Calendar.CurrentEra));
        } else if (args.length === 2) {
            const year: int = args[0];
            const era: int = args[1];
            PersianCalendar.CheckYearRange(year, era);

            if (year === PersianCalendar.MaxCalendarYear) {
                return false;
            }

            return (this.GetAbsoluteDatePersian(year + 1, 1, 1).toNumber() - this.GetAbsoluteDatePersian(year, 1, 1).toNumber()) === 366;
        }
        throw new ArgumentOutOfRangeException('');
    }


    public ToDateTime(year: int, month: int, day: int, hour: int, minute: int, second: int, millisecond: int): DateTime;
    public /* abstract */  ToDateTime(year: int, month: int, day: int, hour: int, minute: int, second: int, millisecond: int, era: int): DateTime;
    public ToDateTime(...args: any[]): DateTime {
        if (args.length === 7 && is.int(args[0]) && is.int(args[1]) && is.int(args[2]) && is.int(args[3]) && is.int(args[4]) && is.int(args[5]) && is.int(args[6])) {
            const year: int = args[0];
            const month: int = args[1];
            const day: int = args[2];
            const hour: int = args[3];
            const minute: int = args[4];
            const second: int = args[5];
            const millisecond: int = args[6];
            return this.ToDateTime(year, month, day, hour, minute, second, millisecond, Calendar.CurrentEra);
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
                        /* CultureInfo.CurrentCulture, */
                        Environment.GetResourceString("ArgumentOutOfRange_Day"),
                        daysInMonth,
                        month));
            }

            const lDate: long = this.GetAbsoluteDatePersian(year, month, day);

            if (lDate.greaterThanOrEqual(0)) {
                return (new DateTime(lDate.mul(GregorianCalendar.TicksPerDay).add(PersianCalendar.TimeToTicks(hour, minute, second, millisecond))));
            } else {
                throw new ArgumentOutOfRangeException(null as any, Environment.GetResourceString("ArgumentOutOfRange_BadYearMonthDay"));
            }
        }
        throw new ArgumentOutOfRangeException('');
    }

    private static readonly DEFAULT_TWO_DIGIT_YEAR_MAX: int = 1410;

    @Override
    public Get_TwoDigitYearMax(): int {
        if (this.twoDigitYearMax == -1) {
            this.twoDigitYearMax = PersianCalendar.GetSystemTwoDigitYearSetting(this.ID, PersianCalendar.DEFAULT_TWO_DIGIT_YEAR_MAX);
        }
        return this.twoDigitYearMax;
    }

    @Override
    public Set_TwoDigitYearMax(value: int) {
        this.VerifyWritable();
        if (value < 99 || value > PersianCalendar.MaxCalendarYear) {
            throw new ArgumentOutOfRangeException(
                "value",
                TString.Format(
                    /* CultureInfo.CurrentCulture, */
                    Environment.GetResourceString("ArgumentOutOfRange_Range"),
                    99,
                    PersianCalendar.MaxCalendarYear));
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

        if (year > PersianCalendar.MaxCalendarYear) {
            throw new ArgumentOutOfRangeException(
                "year",
                TString.Format(
                    /* CultureInfo.CurrentCulture, */
                    Environment.GetResourceString("ArgumentOutOfRange_Range"),
                    1,
                    PersianCalendar.MaxCalendarYear));
        }
        return year;
    }
}