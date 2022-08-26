/*@******************************************************************************************************************************
*                                                                                                                               *
* ████████╗██╗   ██╗██╗   ██╗ █████╗ ██╗         ███████╗██████╗  █████╗ ███╗   ███╗███████╗██╗    ██╗ ██████╗ ██████╗ ██╗  ██╗ *
* ╚══██╔══╝██║   ██║██║   ██║██╔══██╗██║         ██╔════╝██╔══██╗██╔══██╗████╗ ████║██╔════╝██║    ██║██╔═══██╗██╔══██╗██║ ██╔╝ *
*    ██║   ██║   ██║██║   ██║███████║██║         █████╗  ██████╔╝███████║██╔████╔██║█████╗  ██║ █╗ ██║██║   ██║██████╔╝█████╔╝  *
*    ██║   ██║   ██║╚██╗ ██╔╝██╔══██║██║         ██╔══╝  ██╔══██╗██╔══██║██║╚██╔╝██║██╔══╝  ██║███╗██║██║   ██║██╔══██╗██╔═██╗  *
*    ██║   ╚██████╔╝ ╚████╔╝ ██║  ██║███████╗    ██║     ██║  ██║██║  ██║██║ ╚═╝ ██║███████╗╚███╔███╔╝╚██████╔╝██║  ██║██║  ██╗ *
*    ╚═╝    ╚═════╝   ╚═══╝  ╚═╝  ╚═╝╚══════╝    ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝ ╚══╝╚══╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝ *
*                                                                                                                               *
*                                                                                                                               *
* This file is part of Tuval Framework.                                                                                         *
* Copyright (c) Tuvalsoft 2018 All rights reserved.                                                                             *
*                                                                                                                               *
* Licensed under the GNU General Public License v3.0.                                                                           *
* More info at: https://choosealicense.com/licenses/gpl-3.0/                                                                    *
* Created By Selim TAN in 2021                                                                                                  *
******************************************************************************************************************************@*/

import { Override } from "../Reflection/Decorators/ClassInfo";
import { DateTime } from "../Time/__DateTime";
import { Calendar } from "./Calendar";
import { CalendarAlgorithmType } from "./CalendarAlgorithmType";
import { CultureInfo } from "./CultureInfo";
import { GregorianCalendar } from "./GregorianCalendar";
import { EraInfo, GregorianCalendarHelper } from "./GregorianCalendarHelper";
import { int, IntArray } from '../float';
import { ArgumentOutOfRangeException } from '../Exceptions/ArgumentOutOfRangeException';
import { DayOfWeek } from "../Time/DayOfWeek";
import { CalendarWeekRule } from "./CalendarWeekRule";
import { is } from "../is";
import { TString } from "../Text/TString";
import { Environment } from "../Environment";
import { TypeInitializationException } from "../Exceptions/TypeInitializationException";

export class KoreanCalendar extends Calendar {
    protected dispose(disposing: boolean): void {
        throw new Error("Method not implemented.");
    }

    //
    // The era value for the current era.
    //

    public static readonly KoreanEra: int = 1;

    // Since
    //    Gregorian Year = Era Year + yearOffset
    // Gregorian Year 1 is Korean year 2334, so that
    //    1 = 2334 + yearOffset
    //  So yearOffset = -2333
    // Gregorian year 2001 is Korean year 4334.

    //m_EraInfo[0] = new EraInfo(1, new DateTime(1, 1, 1).Ticks, -2333, 2334, GregorianCalendar.MaxYear + 2333);

    // Initialize our era info.
    public static /* internal */  koreanEraInfo: EraInfo[] = [new EraInfo(1, 1, 1, 1, -2333, 2334, GregorianCalendar.MaxYear + 2333)]   // era #, start year/month/day, yearOffset, minEraYear

    public/* internal */  helper: GregorianCalendarHelper = null as any;


    @Override
    protected Get_MinSupportedDateTime(): DateTime {
        return DateTime.MinValue;
    }

    @Override
    protected Get_MaxSupportedDateTime(): DateTime {
        return DateTime.MaxValue;
    }

    // Return the type of the Korean calendar.
    //

    @Override
    protected Get_AlgorithmType(): CalendarAlgorithmType {
        return CalendarAlgorithmType.SolarCalendar;
    }

    /*=================================GetDefaultInstance==========================
    **Action: Internal method to provide a default intance of KoreanCalendar.  Used by NLS+ implementation
    **       and other calendars.
    **Returns:
    **Arguments:
    **Exceptions:
    ============================================================================*/
    /*
    internal static Calendar GetDefaultInstance() {
        if (m_defaultInstance == null) {
            m_defaultInstance = new KoreanCalendar();
        }
        return (m_defaultInstance);
    }
    */


    public constructor() {
        super();
        try {
            new CultureInfo("ko-KR");
        } catch (e) {
            throw new TypeInitializationException(this.GetType().FullName, e);
        }
        this.helper = new GregorianCalendarHelper(this, KoreanCalendar.koreanEraInfo);
    }

    @Override
    protected Get_ID(): int {
        return KoreanCalendar.CAL_KOREA;
    }


    @Override
    public AddMonths(time: DateTime, months: int): DateTime {
        return this.helper.AddMonths(time, months);
    }


    @Override
    public AddYears(time: DateTime, years: int): DateTime {
        return this.helper.AddYears(time, years);
    }

    /*=================================GetDaysInMonth==========================
    **Action: Returns the number of days in the month given by the year and month arguments.
    **Returns: The number of days in the given month.
    **Arguments:
    **      year The year in Korean calendar.
    **      month The month
    **      era     The Japanese era value.
    **Exceptions
    **  ArgumentException  If month is less than 1 or greater * than 12.
    ============================================================================*/


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
        return this.helper.GetDayOfYear(time);
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


    @Override
    public GetEra(time: DateTime): int {
        return this.helper.GetEra(time);
    }

    @Override
    public GetMonth(time: DateTime): int {
        return this.helper.GetMonth(time);
    }

    @Override
    public GetYear(time: DateTime): int {
        return this.helper.GetYear(time);
    }


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
    public /* abstract */  IsLeapYear(year: int, era: int): boolean;
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
            return this.helper.GetLeapMonth(year, era);
        }
        throw new ArgumentOutOfRangeException('');
    }

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

    public Get_Eras(): IntArray {
        return this.helper.Eras;
    }

    private static readonly DEFAULT_TWO_DIGIT_YEAR_MAX: int = 4362;


    @Override
    public Get_TwoDigitYearMax(): int {
        if (this.twoDigitYearMax === -1) {
            this.twoDigitYearMax = KoreanCalendar.GetSystemTwoDigitYearSetting(this.ID, KoreanCalendar.DEFAULT_TWO_DIGIT_YEAR_MAX);
        }
        return (this.twoDigitYearMax);
    }

    @Override
    public Set_TwoDigitYearMax(value: int) {
        this.VerifyWritable();
        if (value < 99 || value > this.helper.MaxYear) {
            throw new ArgumentOutOfRangeException(
                "year",
                TString.Format(
                    /* CultureInfo.CurrentCulture, */
                    Environment.GetResourceString("ArgumentOutOfRange_Range"),
                    99,
                    this.helper.MaxYear));

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
        return (this.helper.ToFourDigitYear(year, this.TwoDigitYearMax));
    }
}