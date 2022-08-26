import { TypeInitializationException } from "../Exceptions/TypeInitializationException";
import { Override } from "../Reflection";
import { DateTime } from "../Time/__DateTime";
import { Calendar } from "./Calendar";
import { CalendarAlgorithmType } from "./CalendarAlgorithmType";
import { CultureInfo } from "./CultureInfo";
import { int, IntArray } from '../float';
import { GregorianCalendar } from "./GregorianCalendar";
import { EraInfo, GregorianCalendarHelper } from "./GregorianCalendarHelper";
import { ArgumentOutOfRangeException } from '../Exceptions/ArgumentOutOfRangeException';
import { DayOfWeek } from "../Time/DayOfWeek";
import { CalendarWeekRule } from "./CalendarWeekRule";
import { is } from "../is";
import { Environment } from "../Environment";
import { TString } from "../Text/TString";
import { Exception } from "../Exception";

export class JapaneseCalendar extends Calendar {
    protected dispose(disposing: boolean): void {
        throw new Error("Method not implemented.");
    }

    public /* internal */ static readonly calendarMinValue: DateTime = new DateTime(1868, 9, 8);


    @Override
    public Get_MinSupportedDateTime(): DateTime {
        return JapaneseCalendar.calendarMinValue;
    }

    @Override
    public Get_MaxSupportedDateTime(): DateTime {
        return DateTime.MaxValue;
    }

    // Return the type of the Japanese calendar.
    //

    @Override
    public Get_AlgorithmType(): CalendarAlgorithmType {
        return CalendarAlgorithmType.SolarCalendar;
    }

    //
    // Using a field initializer rather than a static constructor so that the whole class can be lazy
    // init.
    public static /* internal */  japaneseEraInfo: EraInfo[];

    private static readonly c_japaneseErasHive: string = 'System\CurrentControlSet\Control\Nls\Calendars\Japanese\Eras2';
    private static readonly c_japaneseErasHivePermissionList: string = 'HKEY_LOCAL_MACHINE\" + c_japaneseErasHive';

    //
    // Read our era info
    //
    // m_EraInfo must be listed in reverse chronological order.  The most recent era
    // should be the first element.
    // That is, m_EraInfo[0] contains the most recent era.
    //
    // We know about 5 built-in eras, however users may add additional era(s) from the
    // registry, by adding values to HKLM\SYSTEM\CurrentControlSet\Control\Nls\Calendars\Japanese\Eras
    //
    // Registry values look like:
    //      yyyy.mm.dd=era_abbrev_english_englishabbrev
    //
    // Where yyyy.mm.dd is the registry value name, and also the date of the era start.
    // yyyy, mm, and dd are the year, month & day the era begins (4, 2 & 2 digits long)
    // era is the Japanese Era name
    // abbrev is the Abbreviated Japanese Era Name
    // english is the English name for the Era (unused)
    // englishabbrev is the Abbreviated English name for the era.
    // . is a delimiter, but the value of . doesn't matter.
    // '_' marks the space between the japanese era name, japanese abbreviated era name
    //     english name, and abbreviated english names.
    //
    public /* internal */ static GetEraInfo(): EraInfo[] {
        // See if we need to build it
        if (JapaneseCalendar.japaneseEraInfo == null) {
            // See if we have any eras from the registry
            JapaneseCalendar.japaneseEraInfo = JapaneseCalendar.GetErasFromRegistry();

            // See if we have to use the built-in eras
            if (JapaneseCalendar.japaneseEraInfo == null) {
                // We know about some built-in ranges
                const defaultEraRanges: EraInfo[] = new EraInfo[5];
                defaultEraRanges[0] = new EraInfo(5, 2019, 5, 1, 2018, 1, GregorianCalendar.MaxYear - 2018,
                    "\x4ee4\x548c", "\x4ee4", "R");    // era #5 start year/month/day, yearOffset, minEraYear
                defaultEraRanges[1] = new EraInfo(4, 1989, 1, 8, 1988, 1, 2019 - 1988,
                    "\x5e73\x6210", "\x5e73", "H");    // era #4 start year/month/day, yearOffset, minEraYear
                defaultEraRanges[2] = new EraInfo(3, 1926, 12, 25, 1925, 1, 1989 - 1925,
                    "\x662d\x548c", "\x662d", "S");    // era #3,start year/month/day, yearOffset, minEraYear
                defaultEraRanges[3] = new EraInfo(2, 1912, 7, 30, 1911, 1, 1926 - 1911,
                    "\x5927\x6b63", "\x5927", "T");    // era #2,start year/month/day, yearOffset, minEraYear
                defaultEraRanges[4] = new EraInfo(1, 1868, 1, 1, 1867, 1, 1912 - 1867,
                    "\x660e\x6cbb", "\x660e", "M");    // era #1,start year/month/day, yearOffset, minEraYear

                // Remember the ranges we built
                JapaneseCalendar.japaneseEraInfo = defaultEraRanges;
            }
        }

        // return the era we found/made
        return JapaneseCalendar.japaneseEraInfo;
    }

    /*  "1868 01 01"="\\x660e\\x6cbb_\\x337e_Meiji_M"

      "1912 07 30"="\\x5927\\x6b63_\\x337d_Taisho_T"

      "1926 12 25"="\\x662d\\x548c_\\x337c_Showa_S"

      "1989 01 08"="\\x5e73\\x6210_\\x337b_Heisei_H"

      "2019 05 01"="\\x4ee4\\x548c_\\x32ff_Reiwa_R" */

    //
    // GetErasFromRegistry()
    //
    // We know about 4 built-in eras, however users may add additional era(s) from the
    // registry, by adding values to HKLM\SYSTEM\CurrentControlSet\Control\Nls\Calendars\Japanese\Eras
    //
    // Registry values look like:
    //      yyyy.mm.dd=era_abbrev_english_englishabbrev
    //
    // Where yyyy.mm.dd is the registry value name, and also the date of the era start.
    // yyyy, mm, and dd are the year, month & day the era begins (4, 2 & 2 digits long)
    // era is the Japanese Era name
    // abbrev is the Abbreviated Japanese Era Name
    // english is the English name for the Era (unused)
    // englishabbrev is the Abbreviated English name for the era.
    // . is a delimiter, but the value of . doesn't matter.
    // '_' marks the space between the japanese era name, japanese abbreviated era name
    //     english name, and abbreviated english names.
    private static GetErasFromRegistry(): EraInfo[] {

        return null as any;

    }

    //
    // Compare two era ranges, eg just the ticks
    // Remember the era array is supposed to be in reverse chronological order
    //
    private static CompareEraRanges(a: EraInfo, b: EraInfo): int {
        throw new Exception('düzelt');
        return (b.ticks as any).CompareTo(a.ticks);
    }

    //
    // GetEraFromValue
    //
    // Parse the registry value name/data pair into an era
    //
    // Registry values look like:
    //      yyyy.mm.dd=era_abbrev_english_englishabbrev
    //
    // Where yyyy.mm.dd is the registry value name, and also the date of the era start.
    // yyyy, mm, and dd are the year, month & day the era begins (4, 2 & 2 digits long)
    // era is the Japanese Era name
    // abbrev is the Abbreviated Japanese Era Name
    // english is the English name for the Era (unused)
    // englishabbrev is the Abbreviated English name for the era.
    // . is a delimiter, but the value of . doesn't matter.
    // '_' marks the space between the japanese era name, japanese abbreviated era name
    //     english name, and abbreviated english names.
    /* private static GetEraFromValue(value: string, data: string): EraInfo {
        // Need inputs
        if (value == null || data == null)
            return null as any;

        //
        // Get Date
        //
        // Need exactly 10 characters in name for date
        // yyyy.mm.dd although the . can be any character
        if (value.length !== 10)
            return null as any;

        int year;
        int month;
        int day;

        if (!Number.TryParseInt32(value.Substring(0, 4), NumberStyles.None, NumberFormatInfo.InvariantInfo, out year) ||
            !Number.TryParseInt32(value.Substring(5, 2), NumberStyles.None, NumberFormatInfo.InvariantInfo, out month) ||
            !Number.TryParseInt32(value.Substring(8, 2), NumberStyles.None, NumberFormatInfo.InvariantInfo, out day)) {
            // Couldn't convert integer, fail
            return null;
        }

        //
        // Get Strings
        //
        // Needs to be a certain length e_a_E_A at least (7 chars, exactly 4 groups)
        String[] names = data.Split(new char[] { '_'});

        // Should have exactly 4 parts
        // 0 - Era Name
        // 1 - Abbreviated Era Name
        // 2 - English Era Name
        // 3 - Abbreviated English Era Name
        if (names.Length != 4) return null;

        // Each part should have data in it
        if (names[0].Length == 0 ||
            names[1].Length == 0 ||
            names[2].Length == 0 ||
            names[3].Length == 0)
            return null;

        //
        // Now we have an era we can build
        // Note that the era # and max era year need cleaned up after sorting
        // Don't use the full English Era Name (names[2])
        //
        return new EraInfo(0, year, month, day, year - 1, 1, 0,
            names[0], names[1], names[3]);
    } */

    public /* internal */ static s_defaultInstance: Calendar;
    public /* internal */  helper: GregorianCalendarHelper = null as any;

    /*=================================GetDefaultInstance==========================
    **Action: Internal method to provide a default intance of JapaneseCalendar.  Used by NLS+ implementation
    **       and other calendars.
    **Returns:
    **Arguments:
    **Exceptions:
    ============================================================================*/

    public /* internal */ static GetDefaultInstance(): Calendar {
        if (JapaneseCalendar.s_defaultInstance == null) {
            JapaneseCalendar.s_defaultInstance = new JapaneseCalendar();
        }
        return (JapaneseCalendar.s_defaultInstance);
    }


    public constructor() {
        super();
        try {
            new CultureInfo("ja-JP");
        } catch (e) {
            throw new TypeInitializationException(this.GetType().FullName, e);
        }
        this.helper = new GregorianCalendarHelper(this, JapaneseCalendar.GetEraInfo());
    }

    @Override
    protected Get_ID(): int {
        return JapaneseCalendar.CAL_JAPAN;
    }


    @Override
    public AddMonths(time: DateTime, months: int): DateTime {
        return (this.helper.AddMonths(time, months));
    }


    @Override
    public AddYears(time: DateTime, years: int): DateTime {
        return (this.helper.AddYears(time, years));
    }

    /*=================================GetDaysInMonth==========================
    **Action: Returns the number of days in the month given by the year and month arguments.
    **Returns: The number of days in the given month.
    **Arguments:
    **      year The year in Japanese calendar.
    **      month The month
    **      era     The Japanese era value.
    **Exceptions
    **  ArgumentException  If month is less than 1 or greater * than 12.
    ============================================================================*/

    // Returns the number of days in the month given by the year and
    // month arguments for the specified era.
    //
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
            return this.helper.GetDaysInMonth(year, month, era);
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
            return this.helper.GetDaysInYear(year, era);
        }
        throw new ArgumentOutOfRangeException('');
    }

    @Override
    public GetDayOfMonth(time: DateTime): int {
        return this.helper.GetDayOfMonth(time);
    }

    @Override
    public GetDayOfWeek(time: DateTime): DayOfWeek {
        return this.helper.GetDayOfWeek(time);
    }

    @Override
    public GetDayOfYear(time: DateTime): int {
        return (this.helper.GetDayOfYear(time));
    }


    public /* override */  GetMonthsInYear(year: int, era: int): int;
    public GetMonthsInYear(year: int): int;
    public GetMonthsInYear(...args: any[]): int {
        if (args.length === 1) {
            const year: int = args[0];
            return super.GetMonthsInYear(year);
        } else if (args.length === 2) {
            const year: int = args[0];
            const era: int = args[1];
            return this.helper.GetMonthsInYear(year, era);
        }
        throw new ArgumentOutOfRangeException('');
    }

    @Override
    public GetWeekOfYear(time: DateTime, rule: CalendarWeekRule, firstDayOfWeek: DayOfWeek): int {
        return (this.helper.GetWeekOfYear(time, rule, firstDayOfWeek));
    }

    /*=================================GetEra==========================
    **Action: Get the era value of the specified time.
    **Returns: The era value for the specified time.
    **Arguments:
    **      time the specified date time.
    **Exceptions: ArgumentOutOfRangeException if time is out of the valid era ranges.
    ============================================================================*/


    @Override
    public GetEra(time: DateTime): int {
        return (this.helper.GetEra(time));
    }

    @Override
    public GetMonth(time: DateTime): int {
        return this.helper.GetMonth(time);
    }

    @Override
    public GetYear(time: DateTime): int {
        return this.helper.GetYear(time);
    }

    // Checks whether a given day in the current era is a leap day. This method returns true if
    // the date is a leap day, or false if not.
    //

    public /* override */  IsLeapDay(year: int, month: int, day: int, era: int): boolean;
    public IsLeapDay(year: int, month: int, day: int): boolean;
    public IsLeapDay(...args: any[]): boolean {
        if (arguments.length === 3) {
            const year: int = args[0];
            const month: int = args[1];
            const day: int = args[2];
            return this.IsLeapDay(year, month, day);
        } else if (args.length === 4) {
            const year: int = args[0];
            const month: int = args[1];
            const day: int = args[2];
            const era: int = args[3];
            return this.helper.IsLeapDay(year, month, day, era);
        }
        throw new ArgumentOutOfRangeException('');
    }


    // Checks whether a given year in the current era is a leap year. This method returns true if
    // year is a leap year, or false if not.
    //
    public IsLeapYear(year: int): boolean;
    // Checks whether a given year in the specified era is a leap year. This method returns true if
    // year is a leap year, or false if not.
    //
    public /* oveeride */  IsLeapYear(year: int, era: int): boolean;
    public IsLeapYear(...args: any[]): boolean {
        if (arguments.length === 1 && is.int(args[0])) {
            const year: int = args[0];
            return super.IsLeapYear(year);
        } else if (args.length === 2) {
            const year: int = args[0];
            const era: int = args[1];
            return this.helper.IsLeapYear(year, era);
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
            return this.helper.GetLeapMonth(year, era);
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
            return this.helper.IsLeapMonth(year, month, era);
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
            return this.helper.ToDateTime(year, month, day, hour, minute, second, millisecond, era);
        }
        throw new ArgumentOutOfRangeException('');
    }

    // For Japanese calendar, four digit year is not used.  Few emperors will live for more than one hundred years.
    // Therefore, for any two digit number, we just return the original number.

    @Override
    public ToFourDigitYear(year: int): int {
        if (year <= 0) {
            throw new ArgumentOutOfRangeException("year",
                Environment.GetResourceString("ArgumentOutOfRange_NeedPosNum"));
        }
        //Contract.EndContractBlock();

        if (year > this.helper.MaxYear) {
            throw new ArgumentOutOfRangeException(
                "year",
                TString.Format(
                    /*  CultureInfo.CurrentCulture, */
                    Environment.GetResourceString("ArgumentOutOfRange_Range"),
                    1,
                    this.helper.MaxYear));
        }
        return year;
    }


    @Override
    protected Get_Eras(): IntArray {
        return this.helper.Eras;
    }

    //
    // Return the various era strings
    // Note: The arrays are backwards of the eras
    //
    public /* internal */ static EraNames(): string[] {
        const eras: EraInfo[] = JapaneseCalendar.GetEraInfo();
        const eraNames: string[] = new Array(eras.length);

        for (let i: int = 0; i < eras.length; i++) {
            // Strings are in chronological order, eras are backwards order.
            eraNames[i] = eras[eras.length - i - 1].eraName;
        }

        return eraNames;
    }

    public /* internal */ static AbbrevEraNames(): string[] {
        const eras: EraInfo[] = JapaneseCalendar.GetEraInfo();
        const erasAbbrev: string[] = new Array(eras.length);

        for (let i: int = 0; i < eras.length; i++) {
            // Strings are in chronological order, eras are backwards order.
            erasAbbrev[i] = eras[eras.length - i - 1].abbrevEraName;
        }

        return erasAbbrev;
    }

    public /* internal */ static EnglishEraNames(): string[] {
        const eras: EraInfo[] = JapaneseCalendar.GetEraInfo();
        const erasEnglish: string[] = new Array[eras.length];

        for (let i: int = 0; i < eras.length; i++) {
            // Strings are in chronological order, eras are backwards order.
            erasEnglish[i] = eras[eras.length - i - 1].englishEraName;
        }

        return erasEnglish;
    }

    private static readonly DEFAULT_TWO_DIGIT_YEAR_MAX: int = 99;

    @Override
    public /* internal */   IsValidYear(year: int, era: int): boolean {
        return this.helper.IsValidYear(year, era);
    }

    @Override
    protected Get_TwoDigitYearMax(): int {
        if (this.twoDigitYearMax === -1) {
            this.twoDigitYearMax = JapaneseCalendar.GetSystemTwoDigitYearSetting(this.ID, JapaneseCalendar.DEFAULT_TWO_DIGIT_YEAR_MAX);
        }
        return (this.twoDigitYearMax);
    }

    protected Set_TwoDigitYearMax(value: int) {
        this.VerifyWritable();
        if (value < 99 || value > this.helper.MaxYear) {
            throw new ArgumentOutOfRangeException(
                "year",
                TString.Format(
                    /*  CultureInfo.CurrentCulture, */
                    Environment.GetResourceString("ArgumentOutOfRange_Range"),
                    99,
                    this.helper.MaxYear));
        }
        this.twoDigitYearMax = value;
    }
}