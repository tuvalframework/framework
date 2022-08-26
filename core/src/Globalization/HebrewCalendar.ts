////////////////////////////////////////////////////////////////////////////
//
//  Rules for the Hebrew calendar:
//    - The Hebrew calendar is both a Lunar (months) and Solar (years)
//        calendar, but allows for a week of seven days.
//    - Days begin at sunset.
//    - Leap Years occur in the 3, 6, 8, 11, 14, 17, & 19th years of a
//        19-year cycle.  Year = leap iff ((7y+1) mod 19 < 7).
//    - There are 12 months in a common year and 13 months in a leap year.
//    - In a common year, the 6th month, Adar, has 29 days.  In a leap
//        year, the 6th month, Adar I, has 30 days and the leap month,
//        Adar II, has 29 days.
//    - Common years have 353-355 days.  Leap years have 383-385 days.
//    - The Hebrew new year (Rosh HaShanah) begins on the 1st of Tishri,
//        the 7th month in the list below.
//        - The new year may not begin on Sunday, Wednesday, or Friday.
//        - If the new year would fall on a Tuesday and the conjunction of
//            the following year were at midday or later, the new year is
//            delayed until Thursday.
//        - If the new year would fall on a Monday after a leap year, the
//            new year is delayed until Tuesday.
//    - The length of the 8th and 9th months vary from year to year,
//        depending on the overall length of the year.
//        - The length of a year is determined by the dates of the new
//            years (Tishri 1) preceding and following the year in question.
//        - The 2th month is long (30 days) if the year has 355 or 385 days.
//        - The 3th month is short (29 days) if the year has 353 or 383 days.
//    - The Hebrew months are:
//        1.  Tishri        (30 days)
//        2.  Heshvan       (29 or 30 days)
//        3.  Kislev        (29 or 30 days)
//        4.  Teveth        (29 days)
//        5.  Shevat        (30 days)
//        6.  Adar I        (30 days)
//        7.  Adar {II}     (29 days, this only exists if that year is a leap year)
//        8.  Nisan         (30 days)
//        9.  Iyyar         (29 days)
//        10. Sivan         (30 days)
//        11. Tammuz        (29 days)
//        12. Av            (30 days)
//        13. Elul          (29 days)
//
////////////////////////////////////////////////////////////////////////////
/*
**  Calendar support range:
**      Calendar    Minimum     Maximum
**      ==========  ==========  ==========
**      Gregorian   1583/01/01  2239/09/29
**      Hebrew      5343/04/07  5999/13/29
*/

// Includes CHebrew implemetation;i.e All the code necessary for converting
// Gregorian to Hebrew Lunar from 1583 to 2239.

import { Convert } from '../convert';
import { Environment } from '../Environment';
import { ArgumentOutOfRangeException } from '../Exceptions/ArgumentOutOfRangeException';
import { InvalidOperationException } from '../Exceptions/InvalidOperationException';
import { int, IntArray, long, New } from '../float';
import { is } from '../is';
import { Override, Virtual } from '../Reflection/Decorators/ClassInfo';
import { TString } from '../Text/TString';
import { DayOfWeek } from '../Time/DayOfWeek';
import { DateTime } from '../Time/__DateTime';
import { Calendar } from './Calendar';
import { CalendarAlgorithmType } from './CalendarAlgorithmType';
import { GregorianCalendar } from './GregorianCalendar';

export class __DateBuffer {
    public /* internal */  year: int = 0;
    public /* internal */  month: int = 0;
    public /* internal */  day: int = 0;
}

export class HebrewCalendar extends Calendar {
    protected dispose(disposing: boolean): void {
        throw new Error('Method not implemented.');
    }

    public static readonly HebrewEra: int = 1;
    public /* internal */ static readonly DatePartYear: int = 0;
    public /* internal */ static readonly DatePartDayOfYear: int = 1;
    public /* internal */ static readonly DatePartMonth: int = 2;
    public /* internal */ static readonly DatePartDay: int = 3;
    public /* internal */ static readonly DatePartDayOfWeek: int = 4;

    //
    //  Hebrew Translation Table.
    //
    //  This table is used to get the following Hebrew calendar information for a
    //  given Gregorian year:
    //      1. The day of the Hebrew month corresponding to Gregorian January 1st
    //         for a given Gregorian year.
    //      2. The month of the Hebrew month corresponding to Gregorian January 1st
    //         for a given Gregorian year.
    //         The information is not directly in the table.  Instead, the info is decoded
    //          by special values (numbers above 29 and below 1).
    //      3. The type of the Hebrew year for a given Gregorian year.
    //

    /*
        More notes:
        This table includes 2 numbers for each year.
        The offset into the table determines the year. (offset 0 is Gregorian year 1500)
        1st number determines the day of the Hebrew month coresponeds to January 1st.
        2nd number determines the type of the Hebrew year. (the type determines how
         many days are there in the year.)
         normal years : 1 = 353 days   2 = 354 days   3 = 355 days.
         Leap years   : 4 = 383        5   384        6 = 385 days.
         A 99 means the year is not supported for translation.
         for convenience the table was defined for 750 year,
         but only 640 years are supported. (from 1583 to 2239)
         the years before 1582 (starting of Georgian calander)
         and after 2239, are filled with 99.
         Greogrian January 1st falls usually in Tevet (4th month). Tevet has always 29 days.
         That's why, there no nead to specify the lunar month in the table.
         There are exceptions, these are coded by giving numbers above 29 and below 1.
         Actual decoding is takenig place whenever fetching information from the table.
         The function for decoding is in GetLunarMonthDay().
         Example:
            The data for 2000 - 2005 A.D. is:
                23,6,6,1,17,2,27,6,7,3,         // 2000 - 2004
            For year 2000, we know it has a Hebrew year type 6, which means it has 385 days.
            And 1/1/2000 A.D. is Hebrew year 5760, 23rd day of 4th month.
    */

    //
    //  Jewish Era in use today is dated from the supposed year of the
    //  Creation with its beginning in 3761 B.C.
    //

    // The Hebrew year of Gregorian 1st year AD.
    // 0001/01/01 AD is Hebrew 3760/01/01
    private static readonly HebrewYearOf1AD: int = 3760;

    // The first Gregorian year in HebrewTable.
    private static readonly FirstGregorianTableYear: int = 1583;   // == Hebrew Year 5343
    // The last Gregorian year in HebrewTable.
    private static readonly LastGregorianTableYear: int = 2239;    // == Hebrew Year 5999
    private static readonly TABLESIZE: int = (HebrewCalendar.LastGregorianTableYear - HebrewCalendar.FirstGregorianTableYear);

    private static readonly MinHebrewYear: int = HebrewCalendar.HebrewYearOf1AD + HebrewCalendar.FirstGregorianTableYear;   // == 5343
    private static readonly MaxHebrewYear: int = HebrewCalendar.HebrewYearOf1AD + HebrewCalendar.LastGregorianTableYear;    // == 5999

    private static readonly HebrewTable: int[] = [
        7, 3, 17, 3,         // 1583-1584  (Hebrew year: 5343 - 5344)
        0, 4, 11, 2, 21, 6, 1, 3, 13, 2,             // 1585-1589
        25, 4, 5, 3, 16, 2, 27, 6, 9, 1,             // 1590-1594
        20, 2, 0, 6, 11, 3, 23, 4, 4, 2,             // 1595-1599
        14, 3, 27, 4, 8, 2, 18, 3, 28, 6,            // 1600
        11, 1, 22, 5, 2, 3, 12, 3, 25, 4,      // 1605
        6, 2, 16, 3, 26, 6, 8, 2, 20, 1,      // 1610
        0, 6, 11, 2, 24, 4, 4, 3, 15, 2,      // 1615
        25, 6, 8, 1, 19, 2, 29, 6, 9, 3,      // 1620
        22, 4, 3, 2, 13, 3, 25, 4, 6, 3,      // 1625
        17, 2, 27, 6, 7, 3, 19, 2, 31, 4,      // 1630
        11, 3, 23, 4, 5, 2, 15, 3, 25, 6,      // 1635
        6, 2, 19, 1, 29, 6, 10, 2, 22, 4,      // 1640
        3, 3, 14, 2, 24, 6, 6, 1, 17, 3,      // 1645
        28, 5, 8, 3, 20, 1, 32, 5, 12, 3,      // 1650
        22, 6, 4, 1, 16, 2, 26, 6, 6, 3,      // 1655
        17, 2, 0, 4, 10, 3, 22, 4, 3, 2,      // 1660
        14, 3, 24, 6, 5, 2, 17, 1, 28, 6,      // 1665
        9, 2, 19, 3, 31, 4, 13, 2, 23, 6,      // 1670
        3, 3, 15, 1, 27, 5, 7, 3, 17, 3,      // 1675
        29, 4, 11, 2, 21, 6, 3, 1, 14, 2,      // 1680
        25, 6, 5, 3, 16, 2, 28, 4, 9, 3,      // 1685
        20, 2, 0, 6, 12, 1, 23, 6, 4, 2,      // 1690
        14, 3, 26, 4, 8, 2, 18, 3, 0, 4,      // 1695
        10, 3, 21, 5, 1, 3, 13, 1, 24, 5,      // 1700
        5, 3, 15, 3, 27, 4, 8, 2, 19, 3,      // 1705
        29, 6, 10, 2, 22, 4, 3, 3, 14, 2,      // 1710
        26, 4, 6, 3, 18, 2, 28, 6, 10, 1,      // 1715
        20, 6, 2, 2, 12, 3, 24, 4, 5, 2,      // 1720
        16, 3, 28, 4, 8, 3, 19, 2, 0, 6,      // 1725
        12, 1, 23, 5, 3, 3, 14, 3, 26, 4,      // 1730
        7, 2, 17, 3, 28, 6, 9, 2, 21, 4,      // 1735
        1, 3, 13, 2, 25, 4, 5, 3, 16, 2,      // 1740
        27, 6, 9, 1, 19, 3, 0, 5, 11, 3,      // 1745
        23, 4, 4, 2, 14, 3, 25, 6, 7, 1,      // 1750
        18, 2, 28, 6, 9, 3, 21, 4, 2, 2,      // 1755
        12, 3, 25, 4, 6, 2, 16, 3, 26, 6,      // 1760
        8, 2, 20, 1, 0, 6, 11, 2, 22, 6,      // 1765
        4, 1, 15, 2, 25, 6, 6, 3, 18, 1,      // 1770
        29, 5, 9, 3, 22, 4, 2, 3, 13, 2,      // 1775
        23, 6, 4, 3, 15, 2, 27, 4, 7, 3,      // 1780
        19, 2, 31, 4, 11, 3, 21, 6, 3, 2,      // 1785
        15, 1, 25, 6, 6, 2, 17, 3, 29, 4,      // 1790
        10, 2, 20, 6, 3, 1, 13, 3, 24, 5,      // 1795
        4, 3, 16, 1, 27, 5, 7, 3, 17, 3,      // 1800
        0, 4, 11, 2, 21, 6, 1, 3, 13, 2,      // 1805
        25, 4, 5, 3, 16, 2, 29, 4, 9, 3,      // 1810
        19, 6, 30, 2, 13, 1, 23, 6, 4, 2,      // 1815
        14, 3, 27, 4, 8, 2, 18, 3, 0, 4,      // 1820
        11, 3, 22, 5, 2, 3, 14, 1, 26, 5,      // 1825
        6, 3, 16, 3, 28, 4, 10, 2, 20, 6,      // 1830
        30, 3, 11, 2, 24, 4, 4, 3, 15, 2,      // 1835
        25, 6, 8, 1, 19, 2, 29, 6, 9, 3,      // 1840
        22, 4, 3, 2, 13, 3, 25, 4, 7, 2,      // 1845
        17, 3, 27, 6, 9, 1, 21, 5, 1, 3,      // 1850
        11, 3, 23, 4, 5, 2, 15, 3, 25, 6,      // 1855
        6, 2, 19, 1, 29, 6, 10, 2, 22, 4,      // 1860
        3, 3, 14, 2, 24, 6, 6, 1, 18, 2,      // 1865
        28, 6, 8, 3, 20, 4, 2, 2, 12, 3,      // 1870
        24, 4, 4, 3, 16, 2, 26, 6, 6, 3,      // 1875
        17, 2, 0, 4, 10, 3, 22, 4, 3, 2,      // 1880
        14, 3, 24, 6, 5, 2, 17, 1, 28, 6,      // 1885
        9, 2, 21, 4, 1, 3, 13, 2, 23, 6,      // 1890
        5, 1, 15, 3, 27, 5, 7, 3, 19, 1,      // 1895
        0, 5, 10, 3, 22, 4, 2, 3, 13, 2,      // 1900
        24, 6, 4, 3, 15, 2, 27, 4, 8, 3,      // 1905
        20, 4, 1, 2, 11, 3, 22, 6, 3, 2,      // 1910
        15, 1, 25, 6, 7, 2, 17, 3, 29, 4,      // 1915
        10, 2, 21, 6, 1, 3, 13, 1, 24, 5,      // 1920
        5, 3, 15, 3, 27, 4, 8, 2, 19, 6,      // 1925
        1, 1, 12, 2, 22, 6, 3, 3, 14, 2,      // 1930
        26, 4, 6, 3, 18, 2, 28, 6, 10, 1,      // 1935
        20, 6, 2, 2, 12, 3, 24, 4, 5, 2,      // 1940
        16, 3, 28, 4, 9, 2, 19, 6, 30, 3,      // 1945
        12, 1, 23, 5, 3, 3, 14, 3, 26, 4,      // 1950
        7, 2, 17, 3, 28, 6, 9, 2, 21, 4,      // 1955
        1, 3, 13, 2, 25, 4, 5, 3, 16, 2,      // 1960
        27, 6, 9, 1, 19, 6, 30, 2, 11, 3,      // 1965
        23, 4, 4, 2, 14, 3, 27, 4, 7, 3,      // 1970
        18, 2, 28, 6, 11, 1, 22, 5, 2, 3,      // 1975
        12, 3, 25, 4, 6, 2, 16, 3, 26, 6,      // 1980
        8, 2, 20, 4, 30, 3, 11, 2, 24, 4,      // 1985
        4, 3, 15, 2, 25, 6, 8, 1, 18, 3,      // 1990
        29, 5, 9, 3, 22, 4, 3, 2, 13, 3,      // 1995
        23, 6, 6, 1, 17, 2, 27, 6, 7, 3,         // 2000 - 2004
        20, 4, 1, 2, 11, 3, 23, 4, 5, 2,         // 2005 - 2009
        15, 3, 25, 6, 6, 2, 19, 1, 29, 6,        // 2010
        10, 2, 20, 6, 3, 1, 14, 2, 24, 6,      // 2015
        4, 3, 17, 1, 28, 5, 8, 3, 20, 4,      // 2020
        1, 3, 12, 2, 22, 6, 2, 3, 14, 2,      // 2025
        26, 4, 6, 3, 17, 2, 0, 4, 10, 3,      // 2030
        20, 6, 1, 2, 14, 1, 24, 6, 5, 2,      // 2035
        15, 3, 28, 4, 9, 2, 19, 6, 1, 1,      // 2040
        12, 3, 23, 5, 3, 3, 15, 1, 27, 5,      // 2045
        7, 3, 17, 3, 29, 4, 11, 2, 21, 6,      // 2050
        1, 3, 12, 2, 25, 4, 5, 3, 16, 2,      // 2055
        28, 4, 9, 3, 19, 6, 30, 2, 12, 1,      // 2060
        23, 6, 4, 2, 14, 3, 26, 4, 8, 2,      // 2065
        18, 3, 0, 4, 10, 3, 22, 5, 2, 3,      // 2070
        14, 1, 25, 5, 6, 3, 16, 3, 28, 4,      // 2075
        9, 2, 20, 6, 30, 3, 11, 2, 23, 4,      // 2080
        4, 3, 15, 2, 27, 4, 7, 3, 19, 2,      // 2085
        29, 6, 11, 1, 21, 6, 3, 2, 13, 3,      // 2090
        25, 4, 6, 2, 17, 3, 27, 6, 9, 1,      // 2095
        20, 5, 30, 3, 10, 3, 22, 4, 3, 2,      // 2100
        14, 3, 24, 6, 5, 2, 17, 1, 28, 6,      // 2105
        9, 2, 21, 4, 1, 3, 13, 2, 23, 6,      // 2110
        5, 1, 16, 2, 27, 6, 7, 3, 19, 4,      // 2115
        30, 2, 11, 3, 23, 4, 3, 3, 14, 2,      // 2120
        25, 6, 5, 3, 16, 2, 28, 4, 9, 3,      // 2125
        21, 4, 2, 2, 12, 3, 23, 6, 4, 2,      // 2130
        16, 1, 26, 6, 8, 2, 20, 4, 30, 3,      // 2135
        11, 2, 22, 6, 4, 1, 14, 3, 25, 5,      // 2140
        6, 3, 18, 1, 29, 5, 9, 3, 22, 4,      // 2145
        2, 3, 13, 2, 23, 6, 4, 3, 15, 2,      // 2150
        27, 4, 7, 3, 20, 4, 1, 2, 11, 3,      // 2155
        21, 6, 3, 2, 15, 1, 25, 6, 6, 2,      // 2160
        17, 3, 29, 4, 10, 2, 20, 6, 3, 1,      // 2165
        13, 3, 24, 5, 4, 3, 17, 1, 28, 5,      // 2170
        8, 3, 18, 6, 1, 1, 12, 2, 22, 6,      // 2175
        2, 3, 14, 2, 26, 4, 6, 3, 17, 2,      // 2180
        28, 6, 10, 1, 20, 6, 1, 2, 12, 3,    // 2185
        24, 4, 5, 2, 15, 3, 28, 4, 9, 2,     // 2190
        19, 6, 33, 3, 12, 1, 23, 5, 3, 3,    // 2195
        13, 3, 25, 4, 6, 2, 16, 3, 26, 6,    // 2200
        8, 2, 20, 4, 30, 3, 11, 2, 24, 4,    // 2205
        4, 3, 15, 2, 25, 6, 8, 1, 18, 6,     // 2210
        33, 2, 9, 3, 22, 4, 3, 2, 13, 3,     // 2215
        25, 4, 6, 3, 17, 2, 27, 6, 9, 1,     // 2220
        21, 5, 1, 3, 11, 3, 23, 4, 5, 2,     // 2225
        15, 3, 25, 6, 6, 2, 19, 4, 33, 3,    // 2230
        10, 2, 22, 4, 3, 3, 14, 2, 24, 6,    // 2235
        6, 1    // 2240 (Hebrew year: 6000)
    ];

    //
    //  The lunar calendar has 6 different variations of month lengths
    //  within a year.
    //
    private static readonly LunarMonthLen: int[][] = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 30, 29, 29, 29, 30, 29, 30, 29, 30, 29, 30, 29, 0],     // 3 common year variations
        [0, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 0],
        [0, 30, 30, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 0],
        [0, 30, 29, 29, 29, 30, 30, 29, 30, 29, 30, 29, 30, 29],    // 3 leap year variations
        [0, 30, 29, 30, 29, 30, 30, 29, 30, 29, 30, 29, 30, 29],
        [0, 30, 30, 30, 29, 30, 30, 29, 30, 29, 30, 29, 30, 29]
    ];

    //internal static Calendar m_defaultInstance;

    public /* internal */ static readonly calendarMinValue: DateTime = new DateTime(1583, 1, 1);
    // Gregorian 2239/9/29 = Hebrew 5999/13/29 (last day in Hebrew year 5999).
    // We can only format/parse Hebrew numbers up to 999, so we limit the max range to Hebrew year 5999.
    public /* internal */ static readonly calendarMaxValue: DateTime = new DateTime((new DateTime(2239, 9, 29, 23, 59, 59, 999)).Ticks.add(9999));

    @Override
    public Get_MinSupportedDateTime(): DateTime {
        return HebrewCalendar.calendarMinValue;
    }

    @Override
    protected Get_MaxSupportedDateTime(): DateTime {
        return HebrewCalendar.calendarMaxValue;
    }


    // Return the type of the Hebrew calendar.
    //
    @Override
    protected Get_AlgorithmType(): CalendarAlgorithmType {
        return CalendarAlgorithmType.LunisolarCalendar;
    }

    /*=================================GetDefaultInstance==========================
    **Action: Internal method to provide a default intance of HebrewCalendar.  Used by NLS+ implementation
    **       and other calendars.
    **Returns:
    **Arguments:
    **Exceptions:
    ============================================================================*/

    /*
    internal static Calendar GetDefaultInstance() {
        if (m_defaultInstance == null) {
            m_defaultInstance = new HebrewCalendar();
        }
        return (m_defaultInstance);
    }
    */


    // Construct an instance of gregorian calendar.

    public constructor() {
        super();
    }

    @Override
    protected Get_ID(): int {
        return HebrewCalendar.CAL_HEBREW;
    }


    /*=================================CheckHebrewYearValue==========================
    **Action: Check if the Hebrew year value is supported in this class.
    **Returns:  None.
    **Arguments: y  Hebrew year value
    **          ear Hebrew era value
    **Exceptions: ArgumentOutOfRange_Range if the year value is not supported.
    **Note:
    **  We use a table for the Hebrew calendar calculation, so the year supported is limited.
    ============================================================================*/

    private static CheckHebrewYearValue(y: int, era: int, varName: string): void {
        HebrewCalendar.CheckEraRange(era);
        if (y > HebrewCalendar.MaxHebrewYear || y < HebrewCalendar.MinHebrewYear) {
            throw new ArgumentOutOfRangeException(
                varName,
                TString.Format(
                    /* CultureInfo.CurrentCulture, */
                    Environment.GetResourceString("ArgumentOutOfRange_Range"),
                    HebrewCalendar.MinHebrewYear,
                    HebrewCalendar.MaxHebrewYear));
        }
    }

    /*=================================CheckHebrewMonthValue==========================
    **Action: Check if the Hebrew month value is valid.
    **Returns:  None.
    **Arguments: year  Hebrew year value
    **          month Hebrew month value
    **Exceptions: ArgumentOutOfRange_Range if the month value is not valid.
    **Note:
    **  Call CheckHebrewYearValue() before calling this to verify the year value is supported.
    ============================================================================*/

    private CheckHebrewMonthValue(year: int, month: int, era: int): void {
        const monthsInYear: int = this.GetMonthsInYear(year, era);
        if (month < 1 || month > monthsInYear) {
            throw new ArgumentOutOfRangeException(
                "month",
                TString.Format(
                    /* CultureInfo.CurrentCulture, */
                    Environment.GetResourceString("ArgumentOutOfRange_Range"),
                    1,
                    monthsInYear));
        }
    }

    /*=================================CheckHebrewDayValue==========================
    **Action: Check if the Hebrew day value is valid.
    **Returns:  None.
    **Arguments: year  Hebrew year value
    **          month Hebrew month value
    **          day     Hebrew day value.
    **Exceptions: ArgumentOutOfRange_Range if the day value is not valid.
    **Note:
    **  Call CheckHebrewYearValue()/CheckHebrewMonthValue() before calling this to verify the year/month values are valid.
    ============================================================================*/

    private CheckHebrewDayValue(year: int, month: int, day: int, era: int): void {
        const daysInMonth: int = this.GetDaysInMonth(year, month, era);
        if (day < 1 || day > daysInMonth) {
            throw new ArgumentOutOfRangeException(
                "day",
                TString.Format(
                    /* CultureInfo.CurrentCulture, */
                    Environment.GetResourceString("ArgumentOutOfRange_Range"),
                    1,
                    daysInMonth));
        }
    }

    public static /* internal */  CheckEraRange(era: int): void {
        if (era !== HebrewCalendar.CurrentEra && era !== HebrewCalendar.HebrewEra) {
            throw new ArgumentOutOfRangeException("era", Environment.GetResourceString("ArgumentOutOfRange_InvalidEraValue"));
        }
    }

    private static CheckTicksRange(ticks: long): void {
        if (ticks.lessThan(HebrewCalendar.calendarMinValue.Ticks) || ticks.greaterThan(HebrewCalendar.calendarMaxValue.Ticks)) {
            throw new ArgumentOutOfRangeException(
                "time",
                // Print out the date in Gregorian using InvariantCulture since the DateTime is based on GreograinCalendar.
                TString.Format(
                    /* CultureInfo.InvariantCulture, */
                    Environment.GetResourceString("ArgumentOutOfRange_CalendarRange"),
                    HebrewCalendar.calendarMinValue,
                    HebrewCalendar.calendarMaxValue));
        }
    }

    public static /* internal */  GetResult(result: __DateBuffer, part: int): int {
        switch (part) {
            case HebrewCalendar.DatePartYear:
                return (result.year);
            case HebrewCalendar.DatePartMonth:
                return (result.month);
            case HebrewCalendar.DatePartDay:
                return (result.day);
        }

        throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_DateTimeParsing"));
    }

    /*=================================GetLunarMonthDay==========================
    **Action: Using the Hebrew table (HebrewTable) to get the Hebrew month/day value for Gregorian January 1st
    ** in a given Gregorian year.
    ** Greogrian January 1st falls usually in Tevet (4th month). Tevet has always 29 days.
    **     That's why, there no nead to specify the lunar month in the table.  There are exceptions, and these
    **     are coded by giving numbers above 29 and below 1.
    **     Actual decoding is takenig place in the switch statement below.
    **Returns:
    **     The Hebrew year type. The value is from 1 to 6.
    **     normal years : 1 = 353 days   2 = 354 days   3 = 355 days.
    **     Leap years   : 4 = 383        5   384        6 = 385 days.
    **Arguments:
    **      gregorianYear   The year value in Gregorian calendar.  The value should be between 1500 and 2239.
    **      lunarDate       Object to take the result of the Hebrew year/month/day.
    **Exceptions:
    ============================================================================*/

    public static /* internal */  GetLunarMonthDay(gregorianYear: int, lunarDate: __DateBuffer): int {
        //
        //  Get the offset into the LunarMonthLen array and the lunar day
        //  for January 1st.
        //
        let index: int = gregorianYear - HebrewCalendar.FirstGregorianTableYear;
        if (index < 0 || index > HebrewCalendar.TABLESIZE) {
            throw new ArgumentOutOfRangeException("gregorianYear");
        }

        index *= 2;
        lunarDate.day = HebrewCalendar.HebrewTable[index];

        // Get the type of the year. The value is from 1 to 6
        const LunarYearType: int = HebrewCalendar.HebrewTable[index + 1];

        //
        //  Get the Lunar Month.
        //
        switch (lunarDate.day) {
            case (0):                   // 1/1 is on Shvat 1
                lunarDate.month = 5;
                lunarDate.day = 1;
                break;
            case (30):                  // 1/1 is on Kislev 30
                lunarDate.month = 3;
                break;
            case (31):                  // 1/1 is on Shvat 2
                lunarDate.month = 5;
                lunarDate.day = 2;
                break;
            case (32):                  // 1/1 is on Shvat 3
                lunarDate.month = 5;
                lunarDate.day = 3;
                break;
            case (33):                  // 1/1 is on Kislev 29
                lunarDate.month = 3;
                lunarDate.day = 29;
                break;
            default:                      // 1/1 is on Tevet (This is the general case)
                lunarDate.month = 4;
                break;
        }
        return (LunarYearType);
    }

    // Returns a given date part of this DateTime. This method is used
    // to compute the year, day-of-year, month, or day part.

    @Virtual
    public /* internal */   GetDatePart(ticks: long, part: int): int {
        // The Gregorian year, month, day value for ticks.
        let gregorianYear: int = 0, gregorianMonth: int = 0, gregorianDay: int = 0;
        let hebrewYearType: int = 0;                // lunar year type
        let AbsoluteDate: int = 0;                // absolute date - absolute date 1/1/1600

        //
        //  Make sure we have a valid Gregorian date that will fit into our
        //  Hebrew conversion limits.
        //
        HebrewCalendar.CheckTicksRange(ticks);

        const time: DateTime = new DateTime(ticks);

        //
        //  Save the Gregorian date values.
        //
        gregorianYear = time.Year;
        gregorianMonth = time.Month;
        gregorianDay = time.Day;

        const lunarDate: __DateBuffer = new __DateBuffer();    // lunar month and day for Jan 1

        // From the table looking-up value of HebrewTable[index] (stored in lunarDate.day), we get the the
        // lunar month and lunar day where the Gregorian date 1/1 falls.
        lunarDate.year = gregorianYear + HebrewCalendar.HebrewYearOf1AD;
        hebrewYearType = HebrewCalendar.GetLunarMonthDay(gregorianYear, lunarDate);

        // This is the buffer used to store the result Hebrew date.
        const result: __DateBuffer = new __DateBuffer();

        //
        //  Store the values for the start of the new year - 1/1.
        //
        result.year = lunarDate.year;
        result.month = lunarDate.month;
        result.day = lunarDate.day;

        //
        //  Get the absolute date from 1/1/1600.
        //
        AbsoluteDate = GregorianCalendar.GetAbsoluteDate(gregorianYear, gregorianMonth, gregorianDay).toNumber();

        //
        //  If the requested date was 1/1, then we're done.
        //
        if ((gregorianMonth === 1) && (gregorianDay === 1)) {
            return (HebrewCalendar.GetResult(result, part));
        }

        //
        //  Calculate the number of days between 1/1 and the requested date.
        //
        let NumDays: long;                      // number of days since 1/1
        NumDays = Convert.ToLong(AbsoluteDate - GregorianCalendar.GetAbsoluteDate(gregorianYear, 1, 1).toNumber());

        //
        //  If the requested date is within the current lunar month, then
        //  we're done.
        //
        if ((NumDays.add(lunarDate.day)).lessThanOrEqual(HebrewCalendar.LunarMonthLen[hebrewYearType][lunarDate.month])) {
            result.day += NumDays.toNumber();
            return HebrewCalendar.GetResult(result, part);
        }

        //
        //  Adjust for the current partial month.
        //
        result.month++;
        result.day = 1;

        //
        //  Adjust the Lunar Month and Year (if necessary) based on the number
        //  of days between 1/1 and the requested date.
        //
        //  Assumes Jan 1 can never translate to the last Lunar month, which
        //  is true.
        //
        NumDays = NumDays.sub(HebrewCalendar.LunarMonthLen[hebrewYearType][lunarDate.month] - lunarDate.day);
        //Contract.Assert(NumDays >= 1, "NumDays >= 1");

        // If NumDays is 1, then we are done.  Otherwise, find the correct Hebrew month
        // and day.
        if (NumDays.greaterThan(1)) {
            //
            //  See if we're on the correct Lunar month.
            //
            while (NumDays.greaterThan(HebrewCalendar.LunarMonthLen[hebrewYearType][result.month])) {
                //
                //  Adjust the number of days and move to the next month.
                //
                NumDays = NumDays.sub(HebrewCalendar.LunarMonthLen[hebrewYearType][result.month++]);

                //
                //  See if we need to adjust the Year.
                //  Must handle both 12 and 13 month years.
                //
                if ((result.month > 13) || (HebrewCalendar.LunarMonthLen[hebrewYearType][result.month] === 0)) {
                    //
                    //  Adjust the Year.
                    //
                    result.year++;
                    hebrewYearType = HebrewCalendar.HebrewTable[(gregorianYear + 1 - HebrewCalendar.FirstGregorianTableYear) * 2 + 1];

                    //
                    //  Adjust the Month.
                    //
                    result.month = 1;
                }
            }
            //
            //  Found the right Lunar month.
            //
            result.day += NumDays.sub(1).toNumber();
        }
        return HebrewCalendar.GetResult(result, part);
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
        try {
            let y: int = this.GetDatePart(time.Ticks, HebrewCalendar.DatePartYear);
            let m: int = this.GetDatePart(time.Ticks, HebrewCalendar.DatePartMonth);
            let d: int = this.GetDatePart(time.Ticks, HebrewCalendar.DatePartDay);


            let monthsInYear: int;
            let i: int;
            if (months >= 0) {
                i = m + months;
                while (i > (monthsInYear = this.GetMonthsInYear(y, HebrewCalendar.CurrentEra))) {
                    y++;
                    i -= monthsInYear;
                }
            } else {
                if ((i = m + months) <= 0) {
                    months = -months;
                    months -= m;
                    y--;

                    while (months > (monthsInYear = this.GetMonthsInYear(y, HebrewCalendar.CurrentEra))) {
                        y--;
                        months -= monthsInYear;
                    }
                    monthsInYear = this.GetMonthsInYear(y, HebrewCalendar.CurrentEra);
                    i = monthsInYear - months;
                }
            }

            let days: int = this.GetDaysInMonth(y, i);
            if (d > days) {
                d = days;
            }
            return new DateTime(this.ToDateTime(y, i, d, 0, 0, 0, 0).Ticks.add(time.Ticks.mod(HebrewCalendar.TicksPerDay)));
        }
        // We expect ArgumentException and ArgumentOutOfRangeException (which is subclass of ArgumentException)
        // If exception is thrown in the calls above, we are out of the supported range of this calendar.
        catch (ArgumentException) {
            throw new ArgumentOutOfRangeException(
                "months",
                TString.Format(
                    /* CultureInfo.CurrentCulture, */
                    Environment.GetResourceString("ArgumentOutOfRange_AddValue")));
        }
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
        let y: int = this.GetDatePart(time.Ticks, HebrewCalendar.DatePartYear);
        let m: int = this.GetDatePart(time.Ticks, HebrewCalendar.DatePartMonth);
        let d: int = this.GetDatePart(time.Ticks, HebrewCalendar.DatePartDay);

        y += years;
        HebrewCalendar.CheckHebrewYearValue(y, Calendar.CurrentEra, "years");

        let months: int = this.GetMonthsInYear(y, HebrewCalendar.CurrentEra);
        if (m > months) {
            m = months;
        }

        let days: int = this.GetDaysInMonth(y, m);
        if (d > days) {
            d = days;
        }

        let ticks: long = this.ToDateTime(y, m, d, 0, 0, 0, 0).Ticks.add(time.Ticks.mod(HebrewCalendar.TicksPerDay));
        Calendar.CheckAddResult(ticks, this.MinSupportedDateTime, this.MaxSupportedDateTime);
        return (new DateTime(ticks));
    }

    // Returns the day-of-month part of the specified DateTime. The returned
    // value is an integer between 1 and 31.
    //

    @Override
    public GetDayOfMonth(time: DateTime): int {
        return this.GetDatePart(time.Ticks, HebrewCalendar.DatePartDay);
    }

    // Returns the day-of-week part of the specified DateTime. The returned value
    // is an integer between 0 and 6, where 0 indicates Sunday, 1 indicates
    // Monday, 2 indicates Tuesday, 3 indicates Wednesday, 4 indicates
    // Thursday, 5 indicates Friday, and 6 indicates Saturday.
    //

    @Override
    public GetDayOfWeek(time: DateTime): DayOfWeek {
        // If we calculate back, the Hebrew day of week for Gregorian 0001/1/1 is Monday (1).
        // Therfore, the fomula is:
        return time.Ticks.div(HebrewCalendar.TicksPerDay).add(1).mod(7).toNumber();
    }

    public static /* internal */  GetHebrewYearType(year: int, era: int): int {
        HebrewCalendar.CheckHebrewYearValue(year, era, "year");
        // The HebrewTable is indexed by Gregorian year and starts from FirstGregorianYear.
        // So we need to convert year (Hebrew year value) to Gregorian Year below.
        return (HebrewCalendar.HebrewTable[(year - HebrewCalendar.HebrewYearOf1AD - HebrewCalendar.FirstGregorianTableYear) * 2 + 1]);
    }

    // Returns the day-of-year part of the specified DateTime. The returned value
    // is an integer between 1 and 366.
    //

    @Override
    public GetDayOfYear(time: DateTime): int {
        // Get Hebrew year value of the specified time.
        const year: int = this.GetYear(time);
        let beginOfYearDate: DateTime;
        if (year === 5343) {
            // Gregorian 1583/01/01 corresponds to Hebrew 5343/04/07 (MinSupportedDateTime)
            // To figure out the Gregorian date associated with Hebrew 5343/01/01, we need to
            // count the days from 5343/01/01 to 5343/04/07 and subtract that from Gregorian
            // 1583/01/01.
            //        1.  Tishri        (30 days)
            //        2.  Heshvan       (30 days since 5343 has 355 days)
            //        3.  Kislev        (30 days since 5343 has 355 days)
            // 96 days to get from 5343/01/01 to 5343/04/07
            // Gregorian 1583/01/01 - 96 days = 1582/9/27

            // the beginning of Hebrew year 5343 corresponds to Gregorian September 27, 1582.
            beginOfYearDate = new DateTime(1582, 9, 27);
        }
        else {
            // following line will fail when year is 5343 (first supported year)
            beginOfYearDate = this.ToDateTime(year, 1, 1, 0, 0, 0, 0, HebrewCalendar.CurrentEra);
        }
        return (time.Ticks.sub(beginOfYearDate.Ticks)).div(HebrewCalendar.TicksPerDay).add(1).toNumber();
    }

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

            HebrewCalendar.CheckEraRange(era);
            const hebrewYearType: int = HebrewCalendar.GetHebrewYearType(year, era);
            this.CheckHebrewMonthValue(year, month, era);

            //Contract.Assert(hebrewYearType >= 1 && hebrewYearType <= 6,
            //"hebrewYearType should be from  1 to 6, but now hebrewYearType = " + hebrewYearType + " for hebrew year " + year);
            const monthDays: int = HebrewCalendar.LunarMonthLen[hebrewYearType][month];
            if (monthDays === 0) {
                throw new ArgumentOutOfRangeException("month", Environment.GetResourceString("ArgumentOutOfRange_Month"));
            }
            return (monthDays);
        }
        throw new ArgumentOutOfRangeException('');
    }


    // Returns the number of days in the year given by the year argument for the current era.
    public GetDaysInYear(year: int): int;
    public /* override */  GetDaysInYear(year: int, era: int): int;
    public GetDaysInYear(...args: any[]): int {
        if (args.length === 1) {
            const year: int = args[0];
            return (this.GetDaysInYear(year, Calendar.CurrentEra));
        } else if (args.length === 2) {
            const year: int = args[0];
            const era: int = args[1];
            HebrewCalendar.CheckEraRange(era);
            // normal years : 1 = 353 days   2 = 354 days   3 = 355 days.
            // Leap years   : 4 = 383        5   384        6 = 385 days.

            // LunarYearType is from 1 to 6
            const LunarYearType: int = HebrewCalendar.GetHebrewYearType(year, era);
            if (LunarYearType < 4) {
                // common year: LunarYearType = 1, 2, 3
                return 352 + LunarYearType;
            }
            return 382 + (LunarYearType - 3);
        }
        throw new ArgumentOutOfRangeException('');
    }

    // Returns the era for the specified DateTime value.
    @Override
    public GetEra(time: DateTime): int {
        return HebrewCalendar.HebrewEra;
    }


    @Override
    public Get_Eras(): IntArray {
        return New.IntArray([HebrewCalendar.HebrewEra]);
    }

    // Returns the month part of the specified DateTime. The returned value is an
    // integer between 1 and 12.
    @Override
    public GetMonth(time: DateTime): int {
        return this.GetDatePart(time.Ticks, HebrewCalendar.DatePartMonth);
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
            return (this.IsLeapYear(year, era) ? 13 : 12);
        }
        throw new ArgumentOutOfRangeException('');
    }



    // Returns the year part of the specified DateTime. The returned value is an
    // integer between 1 and 9999.
    //

    @Override
    public GetYear(time: DateTime): int {
        return (this.GetDatePart(time.Ticks, HebrewCalendar.DatePartYear));
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
            if (this.IsLeapMonth(year, month, era)) {
                // Every day in a leap month is a leap day.
                this.CheckHebrewDayValue(year, month, day, era);
                return (true);
            } else if (this.IsLeapYear(year, Calendar.CurrentEra)) {
                // There is an additional day in the 6th month in the leap year (the extra day is the 30th day in the 6th month),
                // so we should return true for 6/30 if that's in a leap year.
                if (month === 6 && day === 30) {
                    return (true);
                }
            }
            this.CheckHebrewDayValue(year, month, day, era);
            return (false);
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
            return super.GetLeapMonth(year, Calendar.CurrentEra);
        } else if (args.length === 2 && is.int(args[0]) && is.int(args[1])) {
            const year: int = args[0];
            const era: int = args[1];
            // Year/era values are checked in IsLeapYear().
            if (this.IsLeapYear(year, era)) {
                // The 7th month in a leap year is a leap month.
                return (7);
            }
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
            // Year/era values are checked in IsLeapYear().
            const isLeapYear: boolean = this.IsLeapYear(year, era);
            this.CheckHebrewMonthValue(year, month, era);
            // The 7th month in a leap year is a leap month.
            if (isLeapYear) {
                if (month == 7) {
                    return (true);
                }
            }
            return (false);
        }
        throw new ArgumentOutOfRangeException('');
    }

    // Checks whether a given year in the current era is a leap year. This method returns true if
    // year is a leap year, or false if not.
    public IsLeapYear(year: int): boolean;
    public /* abstract */  IsLeapYear(year: int, era: int): boolean;
    public IsLeapYear(...args: any[]): boolean {
        if (arguments.length === 1 && is.int(args[0])) {
            const year: int = args[0];
            return super.IsLeapYear(year);
        } else if (args.length === 2) {
            const year: int = args[0];
            const era: int = args[1];
            HebrewCalendar.CheckHebrewYearValue(year, era, "year");
            return (((7 * year + 1) % 19) < 7);
        }
        throw new ArgumentOutOfRangeException('');
    }

    // (month1, day1) - (month2, day2)
    private static GetDayDifference(lunarYearType: int, month1: int, day1: int, month2: int, day2: int): int {
        if (month1 == month2) {
            return (day1 - day2);
        }

        // Make sure that (month1, day1) < (month2, day2)
        const swap: boolean = (month1 > month2);
        if (swap) {
            // (month1, day1) < (month2, day2).  Swap the values.
            // The result will be a negative number.
            let tempMonth: int, tempDay: int;
            tempMonth = month1; tempDay = day1;
            month1 = month2; day1 = day2;
            month2 = tempMonth; day2 = tempDay;
        }

        // Get the number of days from (month1,day1) to (month1, end of month1)
        let days: int = HebrewCalendar.LunarMonthLen[lunarYearType][month1] - day1;

        // Move to next month.
        month1++;

        // Add up the days.
        while (month1 < month2) {
            days += HebrewCalendar.LunarMonthLen[lunarYearType][month1++];
        }
        days += day2;

        return swap ? days : -days;
    }

    /*=================================HebrewToGregorian==========================
    **Action: Convert Hebrew date to Gregorian date.
    **Returns:
    **Arguments:
    **Exceptions:
    **  The algorithm is like this:
    **      The hebrew year has an offset to the Gregorian year, so we can guess the Gregorian year for
    **      the specified Hebrew year.  That is, GreogrianYear = HebrewYear - FirstHebrewYearOf1AD.
    **
    **      From the Gregorian year and HebrewTable, we can get the Hebrew month/day value
    **      of the Gregorian date January 1st.  Let's call this month/day value [hebrewDateForJan1]
    **
    **      If the requested Hebrew month/day is less than [hebrewDateForJan1], we know the result
    **      Gregorian date falls in previous year.  So we decrease the Gregorian year value, and
    **      retrieve the Hebrew month/day value of the Gregorian date january 1st again.
    **
    **      Now, we get the answer of the Gregorian year.
    **
    **      The next step is to get the number of days between the requested Hebrew month/day
    **      and [hebrewDateForJan1].  When we get that, we can create the DateTime by adding/subtracting
    **      the ticks value of the number of days.
    **
    ============================================================================*/


    public static HebrewToGregorian(hebrewYear: int, hebrewMonth: int, hebrewDay: int, hour: int, minute: int, second: int, millisecond: int): DateTime {
        // Get the rough Gregorian year for the specified hebrewYear.
        //
        const gregorianYear: int = hebrewYear - HebrewCalendar.HebrewYearOf1AD;

        const hebrewDateOfJan1: __DateBuffer = new __DateBuffer(); // year value is unused.
        const lunarYearType: int = HebrewCalendar.GetLunarMonthDay(gregorianYear, hebrewDateOfJan1);

        if ((hebrewMonth === hebrewDateOfJan1.month) && (hebrewDay === hebrewDateOfJan1.day)) {
            return new DateTime(gregorianYear, 1, 1, hour, minute, second, millisecond);
        }

        const days: int = HebrewCalendar.GetDayDifference(lunarYearType, hebrewMonth, hebrewDay, hebrewDateOfJan1.month, hebrewDateOfJan1.day);

        const gregorianNewYear: DateTime = new DateTime(gregorianYear, 1, 1);
        return new DateTime(gregorianNewYear.Ticks.add(HebrewCalendar.TicksPerDay.mul(days)).add(HebrewCalendar.TimeToTicks(hour, minute, second, millisecond)));
    }

    // Returns the date and time converted to a DateTime value.  Throws an exception if the n-tuple is invalid.
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
            HebrewCalendar.CheckHebrewYearValue(year, era, "year");
            this.CheckHebrewMonthValue(year, month, era);
            this.CheckHebrewDayValue(year, month, day, era);
            const dt: DateTime = HebrewCalendar.HebrewToGregorian(year, month, day, hour, minute, second, millisecond);
            HebrewCalendar.CheckTicksRange(dt.Ticks);
            return (dt);
        }
        throw new ArgumentOutOfRangeException('');
    }

    private static readonly DEFAULT_TWO_DIGIT_YEAR_MAX: int = 5790;


    @Override
    public Get_TwoDigitYearMax(): int {
        if (this.twoDigitYearMax === -1) {
            this.twoDigitYearMax = HebrewCalendar.GetSystemTwoDigitYearSetting(this.ID, HebrewCalendar.DEFAULT_TWO_DIGIT_YEAR_MAX);
        }
        return this.twoDigitYearMax;
    }

    public Set_TwoDigitYearMax(value: int) {
        this.VerifyWritable();
        if (value === 99) {
            // Do nothing here.  Year 99 is allowed so that TwoDitYearMax is disabled.
        }
        else {
            HebrewCalendar.CheckHebrewYearValue(value, HebrewCalendar.HebrewEra, "value");
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

        if (year < 100) {
            return (super.ToFourDigitYear(year));
        }

        if (year > HebrewCalendar.MaxHebrewYear || year < HebrewCalendar.MinHebrewYear) {
            throw new ArgumentOutOfRangeException(
                "year",
                TString.Format(
                    /* CultureInfo.CurrentCulture, */
                    Environment.GetResourceString("ArgumentOutOfRange_Range"),
                    HebrewCalendar.MinHebrewYear,
                    HebrewCalendar.MaxHebrewYear));
        }
        return year;
    }
}