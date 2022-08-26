////////////////////////////////////////////////////////////////////////////
//
//  Notes about JapaneseLunisolarCalendar
//
////////////////////////////////////////////////////////////////////////////
/*
**  Calendar support range:
**      Calendar               Minimum             Maximum
**      ==========             ==========          ==========
**      Gregorian              1960/01/28          2050/01/22
**      JapaneseLunisolar      1960/01/01          2049/12/29
*/

import { Environment } from "../Environment";
import { ArgumentOutOfRangeException } from "../Exceptions/ArgumentOutOfRangeException";
import { TArray } from "../Extensions/TArray";
import { int, IntArray, New } from '../float';
import { Override } from "../Reflection/Decorators/ClassInfo";
import { TString } from "../Text/TString";
import { DateTime } from "../Time/__DateTime";
import { EastAsianLunisolarCalendar } from "./EastAsianLunisolarCalendar";
import { EraInfo, GregorianCalendarHelper } from "./GregorianCalendarHelper";
import { JapaneseCalendar } from "./JapaneseCalendar";

export class JapaneseLunisolarCalendar extends EastAsianLunisolarCalendar {
    protected dispose(disposing: boolean): void {
        throw new Error("Method not implemented.");
    }

    //
    // The era value for the current era.
    //

    public static readonly JapaneseEra: int = 1;

    public /* internal */  helper: GregorianCalendarHelper;

    public /* internal */ static readonly MIN_LUNISOLAR_YEAR: int = 1960;
    public /* internal */ static readonly MAX_LUNISOLAR_YEAR: int = 2049;

    public /* internal */ static readonly MIN_GREGORIAN_YEAR: int = 1960;
    public /* internal */ static readonly MIN_GREGORIAN_MONTH: int = 1;
    public /* internal */ static readonly MIN_GREGORIAN_DAY: int = 28;

    public /* internal */ static readonly MAX_GREGORIAN_YEAR: int = 2050;
    public /* internal */ static readonly MAX_GREGORIAN_MONTH: int = 1;
    public /* internal */ static readonly MAX_GREGORIAN_DAY: int = 22;

    public /* internal */ static minDate: DateTime = new DateTime(JapaneseLunisolarCalendar.MIN_GREGORIAN_YEAR, JapaneseLunisolarCalendar.MIN_GREGORIAN_MONTH, JapaneseLunisolarCalendar.MIN_GREGORIAN_DAY);
    public /* internal */ static maxDate: DateTime = new DateTime((new DateTime(JapaneseLunisolarCalendar.MAX_GREGORIAN_YEAR, JapaneseLunisolarCalendar.MAX_GREGORIAN_MONTH, JapaneseLunisolarCalendar.MAX_GREGORIAN_DAY, 23, 59, 59, 999)).Ticks.add(9999));

    @Override
    protected Get_MinSupportedDateTime(): DateTime {
        return JapaneseLunisolarCalendar.minDate;
    }

    @Override
    protected Get_MaxSupportedDateTime(): DateTime {
        return JapaneseLunisolarCalendar.maxDate;
    }

    @Override
    protected Get_DaysInYearBeforeMinSupportedYear(): int {
        // 1959 from ChineseLunisolarCalendar
        return 354;
    }

    private static readonly yinfo: int[][] =
        [
/*Y            LM        Lmon    Lday        DaysPerMonth    D1    D2    D3    D4    D5    D6    D7    D8    D9    D10    D11    D12    D13    #Days
1960    */[6, 1, 28, 44368],/*    30    29    30    29    30    30    29    30    29    30    29    30    29    384
1961    */[0, 2, 15, 43856],/*    30    29    30    29    30    29    30    30    29    30    29    30    0    355
1962    */[0, 2, 5, 19808],/*    29    30    29    29    30    30    29    30    29    30    30    29    0    354
1963    */[4, 1, 25, 42352],/*    30    29    30    29    29    30    29    30    29    30    30    30    29    384
1964    */[0, 2, 13, 42352],/*    30    29    30    29    29    30    29    30    29    30    30    30    0    355
1965    */[0, 2, 2, 21104],/*    29    30    29    30    29    29    30    29    29    30    30    30    0    354
1966    */[3, 1, 22, 26928],/*    29    30    30    29    30    29    29    30    29    29    30    30    29    383
1967    */[0, 2, 9, 55632],/*    30    30    29    30    30    29    29    30    29    30    29    30    0    355
1968    */[7, 1, 30, 27304],/*    29    30    30    29    30    29    30    29    30    29    30    29    30    384
1969    */[0, 2, 17, 22176],/*    29    30    29    30    29    30    30    29    30    29    30    29    0    354
1970    */[0, 2, 6, 39632],/*    30    29    29    30    30    29    30    29    30    30    29    30    0    355
1971    */[5, 1, 27, 19176],/*    29    30    29    29    30    29    30    29    30    30    30    29    30    384
1972    */[0, 2, 15, 19168],/*    29    30    29    29    30    29    30    29    30    30    30    29    0    354
1973    */[0, 2, 3, 42208],/*    30    29    30    29    29    30    29    29    30    30    30    29    0    354
1974    */[4, 1, 23, 53864],/*    30    30    29    30    29    29    30    29    29    30    30    29    30    384
1975    */[0, 2, 11, 53840],/*    30    30    29    30    29    29    30    29    29    30    29    30    0    354
1976    */[8, 1, 31, 54600],/*    30    30    29    30    29    30    29    30    29    30    29    29    30    384
1977    */[0, 2, 18, 46400],/*    30    29    30    30    29    30    29    30    29    30    29    29    0    354
1978    */[0, 2, 7, 54944],/*    30    30    29    30    29    30    30    29    30    29    30    29    0    355
1979    */[6, 1, 28, 38608],/*    30    29    29    30    29    30    30    29    30    30    29    30    29    384
1980    */[0, 2, 16, 38320],/*    30    29    29    30    29    30    29    30    30    29    30    30    0    355
1981    */[0, 2, 5, 18864],/*    29    30    29    29    30    29    29    30    30    29    30    30    0    354
1982    */[4, 1, 25, 42200],/*    30    29    30    29    29    30    29    29    30    30    29    30    30    384
1983    */[0, 2, 13, 42160],/*    30    29    30    29    29    30    29    29    30    29    30    30    0    354
1984    */[10, 2, 2, 45656],/*    30    29    30    30    29    29    30    29    29    30    29    30    30    384
1985    */[0, 2, 20, 27216],/*    29    30    30    29    30    29    30    29    29    30    29    30    0    354
1986    */[0, 2, 9, 27968],/*    29    30    30    29    30    30    29    30    29    30    29    29    0    354
1987    */[6, 1, 29, 46504],/*    30    29    30    30    29    30    29    30    30    29    30    29    30    385
1988    */[0, 2, 18, 11104],/*    29    29    30    29    30    29    30    30    29    30    30    29    0    354
1989    */[0, 2, 6, 38320],/*    30    29    29    30    29    30    29    30    30    29    30    30    0    355
1990    */[5, 1, 27, 18872],/*    29    30    29    29    30    29    29    30    30    29    30    30    30    384
1991    */[0, 2, 15, 18800],/*    29    30    29    29    30    29    29    30    29    30    30    30    0    354
1992    */[0, 2, 4, 25776],/*    29    30    30    29    29    30    29    29    30    29    30    30    0    354
1993    */[3, 1, 23, 27216],/*    29    30    30    29    30    29    30    29    29    30    29    30    29    383
1994    */[0, 2, 10, 59984],/*    30    30    30    29    30    29    30    29    29    30    29    30    0    355
1995    */[8, 1, 31, 27976],/*    29    30    30    29    30    30    29    30    29    30    29    29    30    384
1996    */[0, 2, 19, 23248],/*    29    30    29    30    30    29    30    29    30    30    29    30    0    355
1997    */[0, 2, 8, 11104],/*    29    29    30    29    30    29    30    30    29    30    30    29    0    354
1998    */[5, 1, 28, 37744],/*    30    29    29    30    29    29    30    30    29    30    30    30    29    384
1999    */[0, 2, 16, 37600],/*    30    29    29    30    29    29    30    29    30    30    30    29    0    354
2000    */[0, 2, 5, 51552],/*    30    30    29    29    30    29    29    30    29    30    30    29    0    354
2001    */[4, 1, 24, 58536],/*    30    30    30    29    29    30    29    29    30    29    30    29    30    384
2002    */[0, 2, 12, 54432],/*    30    30    29    30    29    30    29    29    30    29    30    29    0    354
2003    */[0, 2, 1, 55888],/*    30    30    29    30    30    29    30    29    29    30    29    30    0    355
2004    */[2, 1, 22, 23208],/*    29    30    29    30    30    29    30    29    30    29    30    29    30    384
2005    */[0, 2, 9, 22208],/*    29    30    29    30    29    30    30    29    30    30    29    29    0    354
2006    */[7, 1, 29, 43736],/*    30    29    30    29    30    29    30    29    30    30    29    30    30    385
2007    */[0, 2, 18, 9680],/*    29    29    30    29    29    30    29    30    30    30    29    30    0    354
2008    */[0, 2, 7, 37584],/*    30    29    29    30    29    29    30    29    30    30    29    30    0    354
2009    */[5, 1, 26, 51544],/*    30    30    29    29    30    29    29    30    29    30    29    30    30    384
2010    */[0, 2, 14, 43344],/*    30    29    30    29    30    29    29    30    29    30    29    30    0    354
2011    */[0, 2, 3, 46240],/*    30    29    30    30    29    30    29    29    30    29    30    29    0    354
2012    */[3, 1, 23, 47696],/*    30    29    30    30    30    29    30    29    29    30    29    30    29    384
2013    */[0, 2, 10, 46416],/*    30    29    30    30    29    30    29    30    29    30    29    30    0    355
2014    */[9, 1, 31, 21928],/*    29    30    29    30    29    30    29    30    30    29    30    29    30    384
2015    */[0, 2, 19, 19360],/*    29    30    29    29    30    29    30    30    30    29    30    29    0    354
2016    */[0, 2, 8, 42416],/*    30    29    30    29    29    30    29    30    30    29    30    30    0    355
2017    */[5, 1, 28, 21176],/*    29    30    29    30    29    29    30    29    30    29    30    30    30    384
2018    */[0, 2, 16, 21168],/*    29    30    29    30    29    29    30    29    30    29    30    30    0    354
2019    */[0, 2, 5, 43344],/*    30    29    30    29    30    29    29    30    29    30    29    30    0    354
2020    */[4, 1, 25, 46248],/*    30    29    30    30    29    30    29    29    30    29    30    29    30    384
2021    */[0, 2, 12, 27296],/*    29    30    30    29    30    29    30    29    30    29    30    29    0    354
2022    */[0, 2, 1, 44368],/*    30    29    30    29    30    30    29    30    29    30    29    30    0    355
2023    */[2, 1, 22, 21928],/*    29    30    29    30    29    30    29    30    30    29    30    29    30    384
2024    */[0, 2, 10, 19296],/*    29    30    29    29    30    29    30    30    29    30    30    29    0    354
2025    */[6, 1, 29, 42352],/*    30    29    30    29    29    30    29    30    29    30    30    30    29    384
2026    */[0, 2, 17, 42352],/*    30    29    30    29    29    30    29    30    29    30    30    30    0    355
2027    */[0, 2, 7, 21104],/*    29    30    29    30    29    29    30    29    29    30    30    30    0    354
2028    */[5, 1, 27, 26928],/*    29    30    30    29    30    29    29    30    29    29    30    30    29    383
2029    */[0, 2, 13, 55600],/*    30    30    29    30    30    29    29    30    29    29    30    30    0    355
2030    */[0, 2, 3, 23200],/*    29    30    29    30    30    29    30    29    30    29    30    29    0    354
2031    */[3, 1, 23, 43856],/*    30    29    30    29    30    29    30    30    29    30    29    30    29    384
2032    */[0, 2, 11, 38608],/*    30    29    29    30    29    30    30    29    30    30    29    30    0    355
2033    */[11, 1, 31, 19176],/*    29    30    29    29    30    29    30    29    30    30    30    29    30    384
2034    */[0, 2, 19, 19168],/*    29    30    29    29    30    29    30    29    30    30    30    29    0    354
2035    */[0, 2, 8, 42192],/*    30    29    30    29    29    30    29    29    30    30    29    30    0    354
2036    */[6, 1, 28, 53864],/*    30    30    29    30    29    29    30    29    29    30    30    29    30    384
2037    */[0, 2, 15, 53840],/*    30    30    29    30    29    29    30    29    29    30    29    30    0    354
2038    */[0, 2, 4, 54560],/*    30    30    29    30    29    30    29    30    29    29    30    29    0    354
2039    */[5, 1, 24, 55968],/*    30    30    29    30    30    29    30    29    30    29    30    29    29    384
2040    */[0, 2, 12, 46752],/*    30    29    30    30    29    30    30    29    30    29    30    29    0    355
2041    */[0, 2, 1, 38608],/*    30    29    29    30    29    30    30    29    30    30    29    30    0    355
2042    */[2, 1, 22, 19160],/*    29    30    29    29    30    29    30    29    30    30    29    30    30    384
2043    */[0, 2, 10, 18864],/*    29    30    29    29    30    29    29    30    30    29    30    30    0    354
2044    */[7, 1, 30, 42168],/*    30    29    30    29    29    30    29    29    30    29    30    30    30    384
2045    */[0, 2, 17, 42160],/*    30    29    30    29    29    30    29    29    30    29    30    30    0    354
2046    */[0, 2, 6, 45648],/*    30    29    30    30    29    29    30    29    29    30    29    30    0    354
2047    */[5, 1, 26, 46376],/*    30    29    30    30    29    30    29    30    29    29    30    29    30    384
2048    */[0, 2, 14, 27968],/*    29    30    30    29    30    30    29    30    29    30    29    29    0    354
2049    */[0, 2, 2, 44448],/*    30    29    30    29    30    30    29    30    30    29    30    29    0    355
        */ ];

    @Override
    protected Get_MinCalendarYear(): int {
        return JapaneseLunisolarCalendar.MIN_LUNISOLAR_YEAR;
    }

    @Override
    protected Get_MaxCalendarYear(): int {
        return JapaneseLunisolarCalendar.MAX_LUNISOLAR_YEAR;
    }

    protected Get_MinDate(): DateTime {
        return JapaneseLunisolarCalendar.minDate;
    }

    protected Get_MaxDate(): DateTime {
        return JapaneseLunisolarCalendar.maxDate;
    }

    protected Get_CalEraInfo(): EraInfo[] {
        return JapaneseCalendar.GetEraInfo();
    }

    @Override
    public /* internal */    GetYearInfo(LunarYear: int, Index: int): int {
        if ((LunarYear < JapaneseLunisolarCalendar.MIN_LUNISOLAR_YEAR) || (LunarYear > JapaneseLunisolarCalendar.MAX_LUNISOLAR_YEAR)) {
            throw new ArgumentOutOfRangeException(
                "year",
                TString.Format(
                    /* CultureInfo.CurrentCulture, */
                    Environment.GetResourceString("ArgumentOutOfRange_Range"),
                    JapaneseLunisolarCalendar.MIN_LUNISOLAR_YEAR,
                    JapaneseLunisolarCalendar.MAX_LUNISOLAR_YEAR));
        }
        //Contract.EndContractBlock();

        return JapaneseLunisolarCalendar.yinfo[LunarYear - JapaneseLunisolarCalendar.MIN_LUNISOLAR_YEAR][Index];
    }

    // Returns the year part of the specified DateTime. The returned value is an
    // integer between 1 and MaxCalendarYear.
    //
    public /* internal */ /* override */ GetYear(year: int, time: DateTime): int;
    public GetYear(time: DateTime): int;
    public GetYear(...args: any[]): int {
        if (arguments.length === 1) {
            const time: DateTime = args[0];

            return super.GetYear(time);
        } else if (args.length === 2) {
            const year: int = args[0];
            const time: DateTime = args[1];
            return this.helper.GetYear(year, time);
        }
        throw new ArgumentOutOfRangeException('');
    }

    @Override
    public/* internal */   GetGregorianYear(year: int, era: int): int {
        return this.helper.GetGregorianYear(year, era);
    }

    // Trim off the eras that are before our date range
    private static TrimEras(baseEras: EraInfo[]): EraInfo[] {
        const newEras: EraInfo[] = New.Array(baseEras.length);
        let newIndex: int = 0;

        // Eras have most recent first, so start with that
        for (let i: int = 0; i < baseEras.length; i++) {
            // If this one's minimum year is bigger than our maximum year
            // then we can't use it.
            if (baseEras[i].yearOffset + baseEras[i].minEraYear >= JapaneseLunisolarCalendar.MAX_LUNISOLAR_YEAR) {
                // skip this one.
                continue;
            }

            // If this one's maximum era is less than our minimum era
            // then we've gotten too low in the era #s, so we're done
            if (baseEras[i].yearOffset + baseEras[i].maxEraYear < JapaneseLunisolarCalendar.MIN_LUNISOLAR_YEAR) {
                break;
            }

            // Wasn't too large or too small, can use this one
            newEras[newIndex] = baseEras[i];
            newIndex++;
        }

        // If we didn't copy any then something was wrong, just return base
        if (newIndex === 0) return baseEras;

        // Resize the output array
        TArray.Resize(newEras, newIndex);
        return newEras;
    }


    // Construct an instance of JapaneseLunisolar calendar.
    public constructor() {
        super();
        this.helper = new GregorianCalendarHelper(this, JapaneseLunisolarCalendar.TrimEras(JapaneseCalendar.GetEraInfo()));
    }


    @Override
    public GetEra(time: DateTime): int {
        return (this.helper.GetEra(time));
    }

    @Override
    protected Get_BaseCalendarID(): int {
        return JapaneseLunisolarCalendar.CAL_JAPAN;
    }


    @Override
    protected Get_ID(): int {
        return JapaneseLunisolarCalendar.CAL_JAPANESELUNISOLAR;
    }


    @Override
    protected Get_Eras(): IntArray {
        return this.helper.Eras;
    }
}