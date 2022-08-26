import { Calendar } from "./Calendar";
import { IntArray, New, int, long } from '../float';
import { Override, Virtual } from '../Reflection/Decorators/ClassInfo';
import { CalendarAlgorithmType } from "./CalendarAlgorithmType";
import { DateTime } from "../Time/__DateTime";
import { Out } from '../Out';
import { ArgumentOutOfRangeException } from "../Exceptions/ArgumentOutOfRangeException";
import { Environment } from "../Environment";
import { EraInfo } from "./GregorianCalendarHelper";
import { TString } from "../Text/TString";
import { is } from "../is";
import { GregorianCalendar } from "./GregorianCalendar";
import { DayOfWeek } from "../Time/DayOfWeek";

export abstract class EastAsianLunisolarCalendar extends Calendar {
    public /* internal */ static readonly LeapMonth: int = 0;
    public /* internal */ static readonly Jan1Month: int = 1;
    public /* internal */ static readonly Jan1Date: int = 2;
    public /* internal */ static readonly nDaysPerMonth: int = 3;

    // # of days so far in the solar year
    public /* internal */ static readonly DaysToMonth365: IntArray = New.IntArray([0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]);

    public /* internal */ static readonly DaysToMonth366: IntArray = New.IntArray([0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335]);

    public /* internal */ static readonly DatePartYear: int = 0;
    public /* internal */ static readonly DatePartDayOfYear: int = 1;
    public /* internal */ static readonly DatePartMonth: int = 2;
    public /* internal */ static readonly DatePartDay: int = 3;

    // Return the type of the East Asian Lunisolar calendars.
    //

    @Override
    public Get_AlgorithmType(): CalendarAlgorithmType {
        return CalendarAlgorithmType.LunisolarCalendar;
    }

    // Return the year number in the 60-year cycle.
    //

    @Virtual
    public GetSexagenaryYear(time: DateTime): int {
        this.CheckTicksRange(time.Ticks);

        const year: Out<int> = New.Out(0);
        const month: Out<int> = New.Out(0);
        const day: Out<int> = New.Out(0);
        this.TimeToLunar(time, year, month, day);

        return ((year.value - 4) % 60) + 1;
    }

    // Return the celestial year from the 60-year cycle.
    // The returned value is from 1 ~ 10.
    //

    public GetCelestialStem(sexagenaryYear: int): int {
        if ((sexagenaryYear < 1) || (sexagenaryYear > 60)) {
            throw new ArgumentOutOfRangeException(
                "sexagenaryYear",
                Environment.GetResourceString("ArgumentOutOfRange_Range", 1, 60));
        }
        //Contract.EndContractBlock();

        return ((sexagenaryYear - 1) % 10) + 1;
    }

    // Return the Terrestial Branch from the the 60-year cycle.
    // The returned value is from 1 ~ 12.
    //

    public GetTerrestrialBranch(sexagenaryYear: int): int {
        if ((sexagenaryYear < 1) || (sexagenaryYear > 60)) {
            throw new ArgumentOutOfRangeException(
                "sexagenaryYear",
                Environment.GetResourceString("ArgumentOutOfRange_Range", 1, 60));
        }
        //Contract.EndContractBlock();

        return ((sexagenaryYear - 1) % 12) + 1;
    }

    public /* internal */ abstract GetYearInfo(LunarYear: int, Index: int): int;

    public /* internal */ abstract GetGregorianYear(year: int, era: int): int;

    protected /* internal */ abstract Get_MinCalendarYear(): int;
    public get MinCalendarYear(): int {
        return this.Get_MinCalendarYear();
    }

    protected /* internal */ abstract Get_MaxCalendarYear(): int;
    public get MaxCalendarYear(): int {
        return this.Get_MaxCalendarYear();
    }

    protected /* internal */ abstract Get_CalEraInfo(): EraInfo[];
    public get CalEraInfo(): EraInfo[] {
        return this.Get_CalEraInfo();
    }

    protected /* internal */ abstract Get_MinDate(): DateTime;
    public get MinDate(): DateTime {
        return this.Get_MinDate();
    }

    protected /* internal */ abstract Get_MaxDate(): DateTime;
    public get MaxDate(): DateTime {
        return this.Get_MaxDate();
    }

    public /* internal */ static readonly MaxCalendarMonth: int = 13;
    public /* internal */ static readonly MaxCalendarDay: int = 30;

    public /* internal */  MinEraCalendarYear(era: int): int {
        const mEraInfo: EraInfo[] = this.CalEraInfo;
        //ChineseLunisolarCalendar does not has m_EraInfo it is going to retuen null
        if (mEraInfo == null) {
            return this.MinCalendarYear;
        }

        if (era == Calendar.CurrentEra) {
            era = this.CurrentEraValue;
        }
        //era has to be in the supported range otherwise we will throw exception in CheckEraRange()
        if (era === this.GetEra(this.MinDate)) {
            return (this.GetYear(this.MinCalendarYear, this.MinDate));
        }

        for (let i: int = 0; i < mEraInfo.length; i++) {
            if (era === mEraInfo[i].era) {
                return (mEraInfo[i].minEraYear);
            }
        }
        throw new ArgumentOutOfRangeException("era", Environment.GetResourceString("ArgumentOutOfRange_InvalidEraValue"));
    }

    public /* internal */  MaxEraCalendarYear(era: int): int {
        const mEraInfo: EraInfo[] = this.CalEraInfo;
        //ChineseLunisolarCalendar does not has m_EraInfo it is going to retuen null
        if (mEraInfo == null) {
            return this.MaxCalendarYear;
        }

        if (era === Calendar.CurrentEra) {
            era = this.CurrentEraValue;
        }
        //era has to be in the supported range otherwise we will throw exception in CheckEraRange()
        if (era === this.GetEra(this.MaxDate)) {
            return this.GetYear(this.MaxCalendarYear, this.MaxDate);
        }

        for (let i = 0; i < mEraInfo.length; i++) {
            if (era === mEraInfo[i].era) {
                return mEraInfo[i].maxEraYear;
            }
        }
        throw new ArgumentOutOfRangeException("era", Environment.GetResourceString("ArgumentOutOfRange_InvalidEraValue"));
    }

    // Construct an instance of EastAsianLunisolar calendar.

    public /* internal */ constructor() {
        super();
    }

    public /* internal */  CheckTicksRange(ticks: long): void {
        if (ticks.lessThan(this.MinSupportedDateTime.Ticks) || ticks.greaterThan(this.MaxSupportedDateTime.Ticks)) {
            throw new ArgumentOutOfRangeException(
                "time",
                TString.Format(/* CultureInfo.InvariantCulture, */ Environment.GetResourceString("ArgumentOutOfRange_CalendarRange"),
                    this.MinSupportedDateTime, this.MaxSupportedDateTime));
        }
        //Contract.EndContractBlock();
    }

    public /* internal */  CheckEraRange(era: int): void {
        if (era == Calendar.CurrentEra) {
            era = this.CurrentEraValue;
        }

        if ((era < this.GetEra(this.MinDate)) || (era > this.GetEra(this.MaxDate))) {
            throw new ArgumentOutOfRangeException("era", Environment.GetResourceString("ArgumentOutOfRange_InvalidEraValue"));
        }
    }

    public /* internal */  CheckYearRange(year: int, era: int): int {
        this.CheckEraRange(era);
        year = this.GetGregorianYear(year, era);

        if ((year < this.MinCalendarYear) || (year > this.MaxCalendarYear)) {
            throw new ArgumentOutOfRangeException(
                "year",
                Environment.GetResourceString("ArgumentOutOfRange_Range", this.MinEraCalendarYear(era), this.MaxEraCalendarYear(era)));
        }
        return year;
    }

    public /* internal */  CheckYearMonthRange(year: int, month: int, era: int): int {
        year = this.CheckYearRange(year, era);

        if (month === 13) {
            //Reject if there is no leap month this year
            if (this.GetYearInfo(year, EastAsianLunisolarCalendar.LeapMonth) === 0)
                throw new ArgumentOutOfRangeException("month", Environment.GetResourceString("ArgumentOutOfRange_Month"));
        }

        if (month < 1 || month > 13) {
            throw new ArgumentOutOfRangeException("month", Environment.GetResourceString("ArgumentOutOfRange_Month"));
        }
        return year;
    }

    public /* internal */  InternalGetDaysInMonth(year: int, month: int): int {
        let nDays: int;
        let mask: int;        // mask for extracting bits

        mask = 0x8000;
        // convert the lunar day into a lunar month/date
        mask >>= (month - 1);
        if ((this.GetYearInfo(year, EastAsianLunisolarCalendar.nDaysPerMonth) & mask) === 0)
            nDays = 29;
        else
            nDays = 30;
        return nDays;
    }

    // Returns the number of days in the month given by the year and
    // month arguments.
    //

    public /* Override */  GetDaysInMonth(year: int, month: int, era: int): int;
    public GetDaysInMonth(year: int, month: int): int;
    public GetDaysInMonth(...args: any[]): int {
        if (args.length === 2) {
            const year: int = args[0];
            const month: int = args[1];
            return super.GetDaysInMonth(year, month);
        } else if (args.length === 3) {
            let year: int = args[0];
            const month: int = args[1];
            const era: int = args[2];
            year = this.CheckYearMonthRange(year, month, era);
            return this.InternalGetDaysInMonth(year, month);
        }
        throw new ArgumentOutOfRangeException('');
    }

    private static GregorianIsLeapYear(y: int): int {
        return ((((y) % 4) != 0) ? 0 : ((((y) % 100) != 0) ? 1 : ((((y) % 400) != 0) ? 0 : 1)));
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
            let year: int = args[0];
            const month: int = args[1];
            const day: int = args[2];
            const hour: int = args[3];
            const minute: int = args[4];
            const second: int = args[5];
            const millisecond: int = args[6];
            const era: int = args[7];

            year = this.CheckYearMonthRange(year, month, era);
            const daysInMonth: int = this.InternalGetDaysInMonth(year, month);
            if (day < 1 || day > daysInMonth) {
                // BCLDebug.Log("year = " + year + ", month = " + month + ", day = " + day);
                throw new ArgumentOutOfRangeException(
                    "day",
                    Environment.GetResourceString("ArgumentOutOfRange_Day", daysInMonth, month));
            }

            const gy: Out<int> = New.Out(0);
            const gm: Out<int> = New.Out(0);
            const gd: Out<int> = New.Out(0);

            if (this.LunarToGregorian(year, month, day, gy, gm, gd)) {
                return new DateTime(gy.value, gm.value, gd.value, hour, minute, second, millisecond);
            } else {
                throw new ArgumentOutOfRangeException(Environment.GetResourceString("ArgumentOutOfRange_BadYearMonthDay"));
            }

        }
        throw new ArgumentOutOfRangeException('');
    }

    //
    // GregorianToLunar calculates lunar calendar info for the given gregorian year, month, date.
    // The input date should be validated before calling this method.
    //
    public /* internal */  GregorianToLunar(nSYear: int, nSMonth: int, nSDate: int, nLYear: Out<int>, nLMonth: Out<int>, nLDate: Out<int>): void {
        //    unsigned int nLYear, nLMonth, nLDate;    // lunar ymd
        let nSolarDay: int = 0;        // day # in solar year
        let nLunarDay: int = 0;        // day # in lunar year
        let fLeap: int = 0;                    // is it a solar leap year?
        let LDpM: int = 0;        // lunar days/month bitfield
        let mask: int = 0;        // mask for extracting bits
        let nDays: int = 0;        // # days this lunar month
        let nJan1Month: int = 0, nJan1Date: int = 0;

        // calc the solar day of year
        fLeap = EastAsianLunisolarCalendar.GregorianIsLeapYear(nSYear);
        nSolarDay = (fLeap == 1) ? EastAsianLunisolarCalendar.DaysToMonth366[nSMonth - 1] : EastAsianLunisolarCalendar.DaysToMonth365[nSMonth - 1];
        nSolarDay += nSDate;

        // init lunar year info
        nLunarDay = nSolarDay;
        nLYear.value = nSYear;
        if (nLYear.value === (this.MaxCalendarYear + 1)) {
            nLYear.value--;
            nLunarDay += ((EastAsianLunisolarCalendar.GregorianIsLeapYear(nLYear.value) === 1) ? 366 : 365);
            nJan1Month = this.GetYearInfo(nLYear.value, EastAsianLunisolarCalendar.Jan1Month);
            nJan1Date = this.GetYearInfo(nLYear.value, EastAsianLunisolarCalendar.Jan1Date);
        } else {

            nJan1Month = this.GetYearInfo(nLYear.value, EastAsianLunisolarCalendar.Jan1Month);
            nJan1Date = this.GetYearInfo(nLYear.value, EastAsianLunisolarCalendar.Jan1Date);

            // check if this solar date is actually part of the previous
            // lunar year
            if ((nSMonth < nJan1Month) ||
                (nSMonth == nJan1Month && nSDate < nJan1Date)) {
                // the corresponding lunar day is actually part of the previous
                // lunar year
                nLYear.value--;

                // add a solar year to the lunar day #
                nLunarDay += ((EastAsianLunisolarCalendar.GregorianIsLeapYear(nLYear.value) === 1) ? 366 : 365);

                // update the new start of year
                nJan1Month = this.GetYearInfo(nLYear.value, EastAsianLunisolarCalendar.Jan1Month);
                nJan1Date = this.GetYearInfo(nLYear.value, EastAsianLunisolarCalendar.Jan1Date);
            }
        }

        // convert solar day into lunar day.
        // subtract off the beginning part of the solar year which is not
        // part of the lunar year.  since this part is always in Jan or Feb,
        // we don't need to handle Leap Year (LY only affects
        // and later).
        nLunarDay -= EastAsianLunisolarCalendar.DaysToMonth365[nJan1Month - 1];
        nLunarDay -= (nJan1Date - 1);

        // convert the lunar day into a lunar month/date
        mask = 0x8000;
        LDpM = this.GetYearInfo(nLYear.value, EastAsianLunisolarCalendar.nDaysPerMonth);
        nDays = ((LDpM & mask) !== 0) ? 30 : 29;
        nLMonth.value = 1;
        while (nLunarDay > nDays) {
            nLunarDay -= nDays;
            nLMonth.value++;
            mask >>= 1;
            nDays = ((LDpM & mask) != 0) ? 30 : 29;
        }
        nLDate.value = nLunarDay;
    }

    /*
    //Convert from Lunar to Gregorian
    //Highly inefficient, but it works based on the forward conversion
    */
    public /* internal */  LunarToGregorian(nLYear: int, nLMonth: int, nLDate: int, nSolarYear: Out<int>, nSolarMonth: Out<int>, nSolarDay: Out<int>): boolean {
        let numLunarDays: int;

        if (nLDate < 1 || nLDate > 30)
            return false;

        numLunarDays = nLDate - 1;

        //Add previous months days to form the total num of days from the first of the month.
        for (let i: int = 1; i < nLMonth; i++) {
            numLunarDays += this.InternalGetDaysInMonth(nLYear, i);
        }

        //Get Gregorian First of year
        const nJan1Month: int = this.GetYearInfo(nLYear, EastAsianLunisolarCalendar.Jan1Month);
        const nJan1Date: int = this.GetYearInfo(nLYear, EastAsianLunisolarCalendar.Jan1Date);

        // calc the solar day of year of 1 Lunar day
        const fLeap: int = EastAsianLunisolarCalendar.GregorianIsLeapYear(nLYear);
        const days: IntArray = (fLeap === 1) ? EastAsianLunisolarCalendar.DaysToMonth366 : EastAsianLunisolarCalendar.DaysToMonth365;

        nSolarDay.value = nJan1Date;

        if (nJan1Month > 1) {
            nSolarDay.value += days[nJan1Month - 1];
        }

        // Add the actual lunar day to get the solar day we want
        nSolarDay.value = nSolarDay.value + numLunarDays;// - 1;

        if (nSolarDay.value > (fLeap + 365)) {
            nSolarYear.value = nLYear + 1;
            nSolarDay.value -= (fLeap + 365);
        } else {
            nSolarYear.value = nLYear;
        }

        for (nSolarMonth.value = 1; nSolarMonth.value < 12; nSolarMonth.value++) {
            if (days[nSolarMonth.value] >= nSolarDay.value)
                break;
        }

        nSolarDay.value -= days[nSolarMonth.value - 1];
        return true;
    }

    public /* internal */  LunarToTime(time: DateTime, year: int, month: int, day: int): DateTime {
        const gy: Out<int> = New.Out(0);
        const gm: Out<int> = New.Out(0);
        const gd: Out<int> = New.Out(0);
        this.LunarToGregorian(year, month, day, gy, gm, gd);
        return (GregorianCalendar.GetDefaultInstance().ToDateTime(gy.value, gm.value, gd.value, time.Hour, time.Minute, time.Second, time.Millisecond));
    }

    public /* internal */  TimeToLunar(time: DateTime, year: Out<int>, month: Out<int>, day: Out<int>): void {
        const gy: Out<int> = New.Out(0);
        const gm: Out<int> = New.Out(0);
        const gd: Out<int> = New.Out(0);

        const Greg: Calendar = GregorianCalendar.GetDefaultInstance();
        gy.value = Greg.GetYear(time);
        gm.value = Greg.GetMonth(time);
        gd.value = Greg.GetDayOfMonth(time);

        this.GregorianToLunar(gy.value, gm.value, gd.value, year, month, day);
    }

    // Returns the DateTime resulting from adding the given number of
    // months to the specified DateTime. The result is computed by incrementing
    // (or decrementing) the year and month parts of the specified DateTime by
    // value months, and, if required, adjusting the day part of the
    // resulting date downwards to the last day of the resulting month in the
    // resulting year. The time-of-day part of the result is the same as the
    // time-of-day part of the specified DateTime.
    //

    @Override
    public AddMonths(time: DateTime, months: int): DateTime {
        if (months < -120000 || months > 120000) {
            throw new ArgumentOutOfRangeException(
                "months",
                Environment.GetResourceString("ArgumentOutOfRange_Range", -120000, 120000));
        }
        //Contract.EndContractBlock();

        this.CheckTicksRange(time.Ticks);

        const y: Out<int> = New.Out(0);
        const m: Out<int> = New.Out(0);
        const d: Out<int> = New.Out(0);
        this.TimeToLunar(time, y, m, d);

        let i: int = m.value + months;
        if (i > 0) {
            let monthsInYear: int = this.InternalIsLeapYear(y.value) ? 13 : 12;

            while (i - monthsInYear > 0) {
                i -= monthsInYear;
                y.value++;
                monthsInYear = this.InternalIsLeapYear(y.value) ? 13 : 12;
            }
            m.value = i;
        } else {
            let monthsInYear: int = 0;
            while (i <= 0) {
                monthsInYear = this.InternalIsLeapYear(y.value - 1) ? 13 : 12;
                i += monthsInYear;
                y.value--;
            }
            m.value = i;
        }

        const days: int = this.InternalGetDaysInMonth(y.value, m.value);
        if (d.value > days) {
            d.value = days;
        }
        const dt: DateTime = this.LunarToTime(time, y.value, m.value, d.value);

        EastAsianLunisolarCalendar.CheckAddResult(dt.Ticks, this.MinSupportedDateTime, this.MaxSupportedDateTime);
        return (dt);
    }


    @Override
    public AddYears(time: DateTime, years: int): DateTime {
        this.CheckTicksRange(time.Ticks);

        const y: Out<int> = New.Out(0);
        const m: Out<int> = New.Out(0);
        const d: Out<int> = New.Out(0);
        this.TimeToLunar(time, y, m, d);

        y.value += years;

        if (m.value === 13 && !this.InternalIsLeapYear(y.value)) {
            m.value = 12;
            d.value = this.InternalGetDaysInMonth(y.value, m.value);
        }
        const DaysInMonths: int = this.InternalGetDaysInMonth(y.value, m.value);
        if (d.value > DaysInMonths) {
            d.value = DaysInMonths;
        }

        const dt: DateTime = this.LunarToTime(time, y.value, m.value, d.value);
        EastAsianLunisolarCalendar.CheckAddResult(dt.Ticks, this.MinSupportedDateTime, this.MaxSupportedDateTime);
        return (dt);
    }

    // Returns the day-of-year part of the specified DateTime. The returned value
    // is an integer between 1 and [354|355 |383|384].
    //

    @Override
    public GetDayOfYear(time: DateTime): int {
        this.CheckTicksRange(time.Ticks);

        const y: Out<int> = New.Out(0);
        const m: Out<int> = New.Out(0);
        const d: Out<int> = New.Out(0);
        this.TimeToLunar(time, y, m, d);

        for (let i: int = 1; i < m.value; i++) {
            d.value = d.value + this.InternalGetDaysInMonth(y.value, i);
        }
        return d.value;
    }

    // Returns the day-of-month part of the specified DateTime. The returned
    // value is an integer between 1 and 29 or 30.
    //

    @Override
    public GetDayOfMonth(time: DateTime): int {
        this.CheckTicksRange(time.Ticks);

        const y: Out<int> = New.Out(0);
        const m: Out<int> = New.Out(0);
        const d: Out<int> = New.Out(0);
        this.TimeToLunar(time, y, m, d);

        return d.value;
    }

    // Returns the number of days in the year given by the year argument for the current era.
    //
    public GetDaysInYear(year: int): int;
    public /* abstract */  GetDaysInYear(year: int, era: int): int;
    public GetDaysInYear(...args: any[]): int {
        if (args.length === 1) {
            const year: int = args[0];
            return super.GetDaysInYear(year);
        } else if (args.length === 2) {
            let year: int = args[0];
            const era: int = args[1];
            year = this.CheckYearRange(year, era);

            let Days: int = 0;
            let monthsInYear: int = this.InternalIsLeapYear(year) ? 13 : 12;

            while (monthsInYear !== 0)
                Days += this.InternalGetDaysInMonth(year, monthsInYear--);

            return Days;
        }
        throw new ArgumentOutOfRangeException('');
    }

    // Returns the month part of the specified DateTime. The returned value is an
    // integer between 1 and 13.
    //

    @Override
    public GetMonth(time: DateTime): int {
        this.CheckTicksRange(time.Ticks);

        const y: Out<int> = New.Out(0);
        const m: Out<int> = New.Out(0);
        const d: Out<int> = New.Out(0);
        this.TimeToLunar(time, y, m, d);

        return m.value;
    }

    // Returns the year part of the specified DateTime. The returned value is an
    // integer between 1 and MaxCalendarYear.
    //
    public /* internal */ /* abstract */ GetYear(year: int, time: DateTime): int;
    public GetYear(time: DateTime): int;
    public GetYear(...args: any[]): int  {
        if (arguments.length === 1) {
            const time: DateTime = args[0];
            this.CheckTicksRange(time.Ticks);

            const y: Out<int> = New.Out(0);
            const m: Out<int> = New.Out(0);
            const d: Out<int> = New.Out(0);
            this.TimeToLunar(time, y, m, d);

            return this.GetYear(y.value, time);
        }
        throw new ArgumentOutOfRangeException('');
    }

    // Returns the day-of-week part of the specified DateTime. The returned value
    // is an integer between 0 and 6, where 0 indicates Sunday, 1 indicates
    // Monday, 2 indicates Tuesday, 3 indicates Wednesday, 4 indicates
    // Thursday, 5 indicates Friday, and 6 indicates Saturday.
    //

    @Override
    public GetDayOfWeek(time: DateTime): DayOfWeek {
        this.CheckTicksRange(time.Ticks);
        return ((time.Ticks.div(Calendar.TicksPerDay).add(1)).mod(7)).toNumber();
    }

    // Returns the number of months in the specified year and era.

    public /* Override */  GetMonthsInYear(year: int, era: int): int;
    public GetMonthsInYear(year: int): int;
    public GetMonthsInYear(...args: any[]): int {
        if (args.length === 1) {
            const year: int = args[0];
            return super.GetMonthsInYear(year);
        } else if (args.length === 2) {
            let year: int = args[0];
            const era: int = args[1];
            year = this.CheckYearRange(year, era);
            return (this.InternalIsLeapYear(year) ? 13 : 12);
        }
        throw new ArgumentOutOfRangeException('');
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
            let year: int = args[0];
            const month: int = args[1];
            const day: int = args[2];
            const era: int = args[3];
            year = this.CheckYearMonthRange(year, month, era);
            const daysInMonth: int = this.InternalGetDaysInMonth(year, month);

            if (day < 1 || day > daysInMonth) {
                throw new ArgumentOutOfRangeException(
                    "day",
                    Environment.GetResourceString("ArgumentOutOfRange_Day", daysInMonth, month));
            }
            const m: int = this.GetYearInfo(year, EastAsianLunisolarCalendar.LeapMonth);
            return ((m !== 0) && (month === (m + 1)));
        }
        throw new ArgumentOutOfRangeException('');
    }

    // Checks whether a given month in the specified era is a leap month. This method returns true if
    // month is a leap month, or false if not.
    //

    public /* abstract */  IsLeapMonth(year: int, month: int, era: int): boolean;
    public IsLeapMonth(year: int, month: int): boolean;
    public IsLeapMonth(...args: any[]): boolean {
        if (args.length === 2) {
            const year: int = args[0];
            const month: int = args[1];
            return super.IsLeapMonth(year, month);
        } else if (args.length === 3) {
            let year: int = args[0];
            const month: int = args[1];
            const era: int = args[2];
            year = this.CheckYearMonthRange(year, month, era);
            const m: int = this.GetYearInfo(year, EastAsianLunisolarCalendar.LeapMonth);
            return ((m !== 0) && (month === (m + 1)));
        }
        throw new ArgumentOutOfRangeException('');
    }
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
            return this.GetLeapMonth(year, Calendar.CurrentEra);
        } else if (args.length === 2 && is.int(args[0]) && is.int(args[1])) {
            let year: int = args[0];
            const era: int = args[1];
            year = this.CheckYearRange(year, era);
            const month: int = this.GetYearInfo(year, EastAsianLunisolarCalendar.LeapMonth);
            if (month > 0) {
                return (month + 1);
            }
            return 0;
        }
        throw new ArgumentOutOfRangeException('');
    }


    public /* internal */  InternalIsLeapYear(year: int): boolean {
        return (this.GetYearInfo(year, EastAsianLunisolarCalendar.LeapMonth) !== 0);
    }


    // Checks whether a given year in the current era is a leap year. This method returns true if
    // year is a leap year, or false if not.
    //
    public IsLeapYear(year: int): boolean;
    // Checks whether a given year in the specified era is a leap year. This method returns true if
    // year is a leap year, or false if not.
    //
    public /* abstract */  IsLeapYear(year: int, era: int): boolean;
    public IsLeapYear(...args: any[]): boolean {
        if (arguments.length === 1 && is.int(args[0])) {
            const year: int = args[0];
            return super.IsLeapYear(year);
        } else if (args.length === 2) {
            let year: int = args[0];
            const era: int = args[1];
            year = this.CheckYearRange(year, era);
            return this.InternalIsLeapYear(year);
        }
        throw new ArgumentOutOfRangeException('');
    }

    private static readonly DEFAULT_GREGORIAN_TWO_DIGIT_YEAR_MAX: int = 2029;

    protected Get_TwoDigitYearMax(): int {
        if (this.twoDigitYearMax === -1) {
            this.twoDigitYearMax = EastAsianLunisolarCalendar.GetSystemTwoDigitYearSetting(this.BaseCalendarID, this.GetYear(new DateTime(EastAsianLunisolarCalendar.DEFAULT_GREGORIAN_TWO_DIGIT_YEAR_MAX, 1, 1)));
        }
        return (this.twoDigitYearMax);
    }

    protected Set_TwoDigitYearMax(value: int) {
        this.VerifyWritable();
        if (value < 99 || value > this.MaxCalendarYear) {
            throw new ArgumentOutOfRangeException(
                "value",
                Environment.GetResourceString("ArgumentOutOfRange_Range", 99, this.MaxCalendarYear));
        }
        this.twoDigitYearMax = value;
    }



    @Override
    public ToFourDigitYear(year: int): int {
        if (year < 0) {
            throw new ArgumentOutOfRangeException("year",
                Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
        }
        // Contract.EndContractBlock();

        year = super.ToFourDigitYear(year);
        this.CheckYearRange(year, EastAsianLunisolarCalendar.CurrentEra);
        return year;
    }
}