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

import { TObject } from '../Extensions/TObject';
import { int, New, char, IntArray } from '../float';
import { TString } from '../Text/TString';
//import { Calendar } from './Calendar';
import { CultureData, CultureInfo } from './CultureInfo';
import { CalendarId } from './DateTimeFormatInfoScanner';
import { GlobalizationMode } from './GlobalizationMode';
import { NotImplementedException } from '../Exceptions/NotImplementedException';
import { PlatformNotSupportedException } from '../Exceptions/PlatformNotSupportedException';
import { NativeCultures } from './Cultures/NativeCultures';

export class CalendarData extends TObject {
    protected dispose(disposing: boolean): void {
        throw new Error('Method not implemented.');
    }

    // Max calendars
    public /* internal */ static readonly MAX_CALENDARS: int = 23;

    // Identity
    public /* internal */      sNativeName: string = ''; // Calendar Name for the locale

    // Formats
    public /* internal */    saShortDates: string[] = null as any; // Short Data format, default first
    public /* internal */    saYearMonths: string[] = null as any; // Year/Month Data format, default first
    public /* internal */    saLongDates: string[] = null as any; // Long Data format, default first
    public /* internal */      sMonthDay: string = ''; // Month/Day format

    // Calendar Parts Names
    public /* internal */    saEraNames: string[] = null as any; // Names of Eras
    public /* internal */    saAbbrevEraNames: string[] = null as any; // Abbreviated Era Names
    public /* internal */    saAbbrevEnglishEraNames: string[] = null as any; // Abbreviated Era Names in English
    public /* internal */    saDayNames: string[] = null as any; // Day Names, null to use locale data, starts on Sunday
    public /* internal */    saAbbrevDayNames: string[] = null as any; // Abbrev Day Names, null to use locale data, starts on Sunday
    public /* internal */    saSuperShortDayNames: string[] = null as any; // Super short Day of week names
    public /* internal */    saMonthNames: string[] = null as any; // Month Names (13)
    public /* internal */    saAbbrevMonthNames: string[] = null as any; // Abbrev Month Names (13)
    public /* internal */    saMonthGenitiveNames: string[] = null as any; // Genitive Month Names (13)
    public /* internal */    saAbbrevMonthGenitiveNames: string[] = null as any; // Genitive Abbrev Month Names (13)
    public /* internal */    saLeapYearMonthNames: string[] = null as any; // Multiple strings for the month names in a leap year.

    // Integers at end to make marshaller happier
    public /* internal */         iTwoDigitYearMax: int = 2029; // Max 2 digit year (for Y2K bug data entry)
    public /* internal */         iCurrentEra: int = 0;  // current era # (usually 1)

    // Use overrides?
    public /* internal */        bUseUserOverrides: boolean = false; // True if we want user overrides.

    // Static invariant for the invariant locale
    public /* internal */ static Invariant: CalendarData;

    // Private constructor
    public constructor();
    public /* internal */ constructor(localeName: string, calendarId: int, bUseUserOverrides: boolean);
    public constructor(...args: any[]) {
        super();
        if (args.length === 0) {

        } else if (args.length === 3) {
            const localeName: string = args[0];
            const calendarId: int = args[1];
            const bUseUserOverrides: boolean = args[2];

            // Call nativeGetCalendarData to populate the data
            this.bUseUserOverrides = bUseUserOverrides;
            if (!CalendarData.nativeGetCalendarData(this, localeName, calendarId)) {
                //Contract.Assert(false, "[CalendarData] nativeGetCalendarData call isn't expected to fail for calendar " + calendarId + " locale " + localeName);

                // Something failed, try invariant for missing parts
                // This is really not good, but we don't want the callers to crash.
                if (this.sNativeName == null) this.sNativeName = String.Empty;           // Calendar Name for the locale.

                // Formats
                if (this.saShortDates == null) this.saShortDates = CalendarData.Invariant.saShortDates; // Short Data format, default first
                if (this.saYearMonths == null) this.saYearMonths = CalendarData.Invariant.saYearMonths; // Year/Month Data format, default first
                if (this.saLongDates == null) this.saLongDates = CalendarData.Invariant.saLongDates;  // Long Data format, default first
                if (this.sMonthDay == null) this.sMonthDay = CalendarData.Invariant.sMonthDay;    // Month/Day format

                // Calendar Parts Names
                if (this.saEraNames == null) this.saEraNames = CalendarData.Invariant.saEraNames;              // Names of Eras
                if (this.saAbbrevEraNames == null) this.saAbbrevEraNames = CalendarData.Invariant.saAbbrevEraNames;        // Abbreviated Era Names
                if (this.saAbbrevEnglishEraNames == null) this.saAbbrevEnglishEraNames = CalendarData.Invariant.saAbbrevEnglishEraNames; // Abbreviated Era Names in English
                if (this.saDayNames == null) this.saDayNames = CalendarData.Invariant.saDayNames;              // Day Names, null to use locale data, starts on Sunday
                if (this.saAbbrevDayNames == null) this.saAbbrevDayNames = CalendarData.Invariant.saAbbrevDayNames;        // Abbrev Day Names, null to use locale data, starts on Sunday
                if (this.saSuperShortDayNames == null) this.saSuperShortDayNames = CalendarData.Invariant.saSuperShortDayNames;    // Super short Day of week names
                if (this.saMonthNames == null) this.saMonthNames = CalendarData.Invariant.saMonthNames;            // Month Names (13)
                if (this.saAbbrevMonthNames == null) this.saAbbrevMonthNames = CalendarData.Invariant.saAbbrevMonthNames;      // Abbrev Month Names (13)
                // Genitive and Leap names can follow the fallback below
            }

            // Clean up the escaping of the formats
            this.saShortDates = CultureData.ReescapeWin32Strings(this.saShortDates);
            this.saLongDates = CultureData.ReescapeWin32Strings(this.saLongDates);
            this.saYearMonths = CultureData.ReescapeWin32Strings(this.saYearMonths);
            this.sMonthDay = CultureData.ReescapeWin32String(this.sMonthDay);

            if (calendarId === CalendarId.TAIWAN) {
                // for Geo----al reasons, the ----ese native name should only be returned when
                // for ----ese SKU
                if (CultureInfo.IsTaiwanSku) {
                    // We got the month/day names from the OS (same as gregorian), but the native name is wrong
                    this.sNativeName = "\x4e2d\x83ef\x6c11\x570b\x66c6";
                }
                else {
                    this.sNativeName = TString.Empty;
                }
            }

            // Check for null genitive names (in case unmanaged side skips it for non-gregorian calendars, etc)
            if (this.saMonthGenitiveNames == null || TString.IsNullOrEmpty(this.saMonthGenitiveNames[0]))
                this.saMonthGenitiveNames = this.saMonthNames;              // Genitive month names (same as month names for invariant)
            if (this.saAbbrevMonthGenitiveNames == null || TString.IsNullOrEmpty(this.saAbbrevMonthGenitiveNames[0]))
                this.saAbbrevMonthGenitiveNames = this.saAbbrevMonthNames;    // Abbreviated genitive month names (same as abbrev month names for invariant)
            if (this.saLeapYearMonthNames == null || TString.IsNullOrEmpty(this.saLeapYearMonthNames[0]))
                this.saLeapYearMonthNames = this.saMonthNames;

            this.InitializeEraNames(localeName, calendarId);

            this.InitializeAbbreviatedEraNames(localeName, calendarId);

            // Abbreviated English Era Names are only used for the Japanese calendar.
            if (!GlobalizationMode.Invariant && calendarId === CalendarId.JAPAN) {
                this.saAbbrevEnglishEraNames = CalendarData.GetJapaneseEnglishEraNames();
            }
            else {
                // For all others just use the an empty string (doesn't matter we'll never ask for it for other calendars)
                this.saAbbrevEnglishEraNames = [""];
            }

            // Japanese is the only thing with > 1 era.  Its current era # is how many ever
            // eras are in the array.  (And the others all have 1 string in the array)
            this.iCurrentEra = this.saEraNames.length;
        }
    }

    // Invariant constructor
    public static StaticContructor() {

        // Set our default/gregorian US calendar data
        // Calendar IDs are 1-based, arrays are 0 based.
        const invariant: CalendarData = new CalendarData();

        // Set default data for calendar
        // Note that we don't load resources since this IS NOT supposed to change (by definition)
        invariant.sNativeName = "Gregorian Calendar";  // Calendar Name

        // Year
        invariant.iTwoDigitYearMax = 2029; // Max 2 digit year (for Y2K bug data entry)
        invariant.iCurrentEra = 1; // Current era #

        // Formats
        invariant.saShortDates = ["MM/dd/yyyy", "yyyy-MM-dd"];          // short date format
        invariant.saLongDates = ["dddd, dd MMMM yyyy"];                 // long date format
        invariant.saYearMonths = ["yyyy MMMM"];                         // year month format
        invariant.sMonthDay = "MMMM dd";                                            // Month day pattern

        // Calendar Parts Names
        invariant.saEraNames = ["A.D."];     // Era names
        invariant.saAbbrevEraNames = ["AD"];      // Abbreviated Era names
        invariant.saAbbrevEnglishEraNames = ["AD"];     // Abbreviated era names in English
        invariant.saDayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];// day names
        invariant.saAbbrevDayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];     // abbreviated day names
        invariant.saSuperShortDayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];      // The super short day names
        invariant.saMonthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December", String.Empty]; // month names
        invariant.saAbbrevMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", String.Empty];// abbreviated month names
        invariant.saMonthGenitiveNames = invariant.saMonthNames;              // Genitive month names (same as month names for invariant)
        invariant.saAbbrevMonthGenitiveNames = invariant.saAbbrevMonthNames;    // Abbreviated genitive month names (same as abbrev month names for invariant)
        invariant.saLeapYearMonthNames = invariant.saMonthNames;              // leap year month names are unused in Gregorian English (invariant)

        invariant.bUseUserOverrides = false;

        // Calendar was built, go ahead and assign it...
        CalendarData.Invariant = invariant;
    }

    private InitializeEraNames(localeName: string, calendarId: CalendarId): void {
        // Note that the saEraNames only include "A.D."  We don't have localized names for other calendars available from windows
        switch (calendarId) {
            // For Localized Gregorian we really expect the data from the OS.
            case CalendarId.GREGORIAN:
                // Fallback for CoreCLR < Win7 or culture.dll missing
                if (this.saEraNames == null || this.saEraNames.length === 0 || TString.IsNullOrEmpty(this.saEraNames[0])) {
                    this.saEraNames = ["A.D."];
                }
                break;

            // The rest of the calendars have constant data, so we'll just use that
            case CalendarId.GREGORIAN_US:
            case CalendarId.JULIAN:
                this.saEraNames = ["A.D."];
                break;
            case CalendarId.HEBREW:
                this.saEraNames = ["C.E."];
                break;
            case CalendarId.HIJRI:
            case CalendarId.UMALQURA:
                if (localeName === "dv-MV") {
                    // Special case for Divehi
                    this.saEraNames = ["\x0780\x07a8\x0796\x07b0\x0783\x07a9"];
                }
                else {
                    this.saEraNames = ["\x0628\x0639\x062F \x0627\x0644\x0647\x062C\x0631\x0629"];
                }
                break;
            case CalendarId.GREGORIAN_ARABIC:
            case CalendarId.GREGORIAN_XLIT_ENGLISH:
            case CalendarId.GREGORIAN_XLIT_FRENCH:
                // These are all the same:
                this.saEraNames = ["\x0645"];
                break;

            case CalendarId.GREGORIAN_ME_FRENCH:
                this.saEraNames = ["ap. J.-C."];
                break;

            case CalendarId.TAIWAN:
                // for Geo----al reasons, the ----ese native name should only be returned when
                // for ----ese SKU
                if (CultureInfo.IsTaiwanSku) {
                    //
                    this.saEraNames = ["\x4e2d\x83ef\x6c11\x570b"];
                }
                else {
                    this.saEraNames = [TString.Empty];
                }
                break;

            case CalendarId.KOREA:
                this.saEraNames = ["\xb2e8\xae30"];
                break;

            case CalendarId.THAI:
                this.saEraNames = ["\x0e1e\x002e\x0e28\x002e"];
                break;

            case CalendarId.JAPAN:
            case CalendarId.JAPANESELUNISOLAR:
                this.saEraNames = CalendarData.GetJapaneseEraNames();
                break;

            case CalendarId.PERSIAN:
                if (this.saEraNames == null || this.saEraNames.length === 0 || TString.IsNullOrEmpty(this.saEraNames[0])) {
                    this.saEraNames = ["\x0647\x002e\x0634"];
                }
                break;

            default:
                // Most calendars are just "A.D."
                this.saEraNames = CalendarData.Invariant.saEraNames;
                break;
        }
    }

    private static GetJapaneseEraNames(): string[] {
        if (GlobalizationMode.Invariant) {
            throw new PlatformNotSupportedException();
        }
        throw new PlatformNotSupportedException();
        //return JapaneseCalendar.EraNames();
    }

    private static GetJapaneseEnglishEraNames(): string[] {
        if (GlobalizationMode.Invariant) {
            throw new PlatformNotSupportedException();
        }
        throw new PlatformNotSupportedException();
        //return JapaneseCalendar.EnglishEraNames();
    }

    private InitializeAbbreviatedEraNames(localeName: string, calendarId: CalendarId): void {
        // Note that the saAbbrevEraNames only include "AD"  We don't have localized names for other calendars available from windows
        switch (calendarId) {
            // For Localized Gregorian we really expect the data from the OS.
            case CalendarId.GREGORIAN:
                // Fallback for CoreCLR < Win7 or culture.dll missing
                if (this.saAbbrevEraNames == null || this.saAbbrevEraNames.length == 0 || TString.IsNullOrEmpty(this.saAbbrevEraNames[0])) {
                    this.saAbbrevEraNames = ["AD"];
                }
                break;

            // The rest of the calendars have constant data, so we'll just use that
            case CalendarId.GREGORIAN_US:
            case CalendarId.JULIAN:
                this.saAbbrevEraNames = ["AD"];
                break;
            case CalendarId.JAPAN:
            case CalendarId.JAPANESELUNISOLAR:
                if (GlobalizationMode.Invariant) {
                    throw new PlatformNotSupportedException();
                }
                this.saAbbrevEraNames = this.saEraNames;
                break;
            case CalendarId.HIJRI:
            case CalendarId.UMALQURA:
                if (localeName == "dv-MV") {
                    // Special case for Divehi
                    this.saAbbrevEraNames = ["\x0780\x002e"];
                }
                else {
                    this.saAbbrevEraNames = ["\x0647\x0640"];
                }
                break;
            case CalendarId.TAIWAN:
                // Get era name and abbreviate it
                this.saAbbrevEraNames = New.Array(1);
                if (this.saEraNames[0].length === 4) {
                    this.saAbbrevEraNames[0] = this.saEraNames[0].substring(2, 2);
                }
                else {
                    this.saAbbrevEraNames[0] = this.saEraNames[0];
                }
                break;

            case CalendarId.PERSIAN:
                if (this.saAbbrevEraNames == null || this.saAbbrevEraNames.length === 0 || TString.IsNullOrEmpty(this.saAbbrevEraNames[0])) {
                    this.saAbbrevEraNames = this.saEraNames;
                }
                break;

            default:
                // Most calendars just use the full name
                this.saAbbrevEraNames = this.saEraNames;
                break;
        }
    }

    public /* internal */ static GetCalendarData(calendarId: int): CalendarData {
        //
        // Get a calendar.
        // Unfortunately we depend on the locale in the OS, so we need a locale
        // no matter what.  So just get the appropriate calendar from the
        // appropriate locale here
        //

        // Get a culture name
        //
        const culture: string = CalendarData.CalendarIdToCultureName(calendarId);

        // Return our calendar
        return CultureInfo.GetCultureInfo(culture).m_cultureData.GetCalendar(calendarId);
    }

    //
    // Helper methods
    //
    private static CalendarIdToCultureName(calendarId: int): string {
        switch (calendarId) {
            case 2/* Calendar.CAL_GREGORIAN_US */:
                return "fa-IR";             // "fa-IR" Iran

            case 3 /* Calendar.CAL_JAPAN */:
                return "ja-JP";             // "ja-JP" Japan

            case 4 /* Calendar.CAL_TAIWAN */:
                return "zh-TW";             // zh-TW Taiwan

            case 5 /* Calendar.CAL_KOREA */:
                return "ko-KR";             // "ko-KR" Korea

            case 6 /* Calendar.CAL_HIJRI */:
            case 10 /* Calendar.CAL_GREGORIAN_ARABIC */:
            case 23 /* Calendar.CAL_UMALQURA */:
                return "ar-SA";             // "ar-SA" Saudi Arabia

            case 7 /* Calendar.CAL_THAI */:
                return "th-TH";             // "th-TH" Thailand

            case 8 /* Calendar.CAL_HEBREW */:
                return "he-IL";             // "he-IL" Israel

            case 9 /* Calendar.CAL_GREGORIAN_ME_FRENCH */:
                return "ar-DZ";             // "ar-DZ" Algeria

            case 11/* Calendar.CAL_GREGORIAN_XLIT_ENGLISH */:
            case 12/* Calendar.CAL_GREGORIAN_XLIT_FRENCH */:
                return "ar-IQ";             // "ar-IQ"; Iraq

            default:
                // Default to gregorian en-US
                break;
        }

        return "en-US";
    }

    public /* internal */  FixupWin7MonthDaySemicolonBug(): void {
        const unescapedCharacterIndex: int = CalendarData.FindUnescapedCharacter(this.sMonthDay, ';'.charCodeAt(0));
        if (unescapedCharacterIndex > 0) {
            this.sMonthDay = this.sMonthDay.substring(0, unescapedCharacterIndex);
        }
    }
    private static FindUnescapedCharacter(s: string, charToFind: char): int {
        let inComment: boolean = false;
        const length: int = s.length;
        for (let i: int = 0; i < length; i++) {
            let c: char = s[i].charCodeAt(0);

            switch (c) {
                case '\''.charCodeAt(0):
                    inComment = !inComment;
                    break;
                case '\\'.charCodeAt(0):
                    i++; // escape sequence -- skip next character
                    break;
                default:
                    if (!inComment && charToFind === c) {
                        return i;
                    }
                    break;
            }
        }
        return -1;
    }


    // Get native two digit year max
    public /* internal */ static nativeGetTwoDigitYearMax(calID: int): int {
        /* throw new NotImplementedException(''); */
        // düzelt.
        return 2029; // for georgean
    }

    private static nativeGetCalendarData(data: CalendarData, localeName: string, calendar: int): boolean {
        if (TString.IsNullOrEmpty(localeName)) {
            localeName = 'Invariant';
        }
        const nativeCultureInfo = NativeCultures[localeName];
        if (nativeCultureInfo != null) {
            data.iTwoDigitYearMax = nativeCultureInfo.DateTimeFormat.Calendar.TwoDigitYearMax;
            data.iCurrentEra = 1;
            data.saShortDates = [nativeCultureInfo.DateTimeFormat.ShortDatePattern];
            data.saLongDates = [nativeCultureInfo.DateTimeFormat.LongDatePattern];
            data.saYearMonths = [nativeCultureInfo.DateTimeFormat.YearMonthPattern];
            data.sMonthDay = nativeCultureInfo.DateTimeFormat.MonthDayPattern;
            data.saDayNames = nativeCultureInfo.DateTimeFormat.DayNames;
            data.saAbbrevDayNames = nativeCultureInfo.DateTimeFormat.AbbreviatedDayNames;
            data.saSuperShortDayNames = nativeCultureInfo.DateTimeFormat.ShortestDayNames;
            data.saMonthNames = nativeCultureInfo.DateTimeFormat.MonthNames;
            data.saAbbrevMonthNames = nativeCultureInfo.DateTimeFormat.AbbreviatedMonthNames;
            data.saMonthGenitiveNames = nativeCultureInfo.DateTimeFormat.MonthGenitiveNames;
            data.saAbbrevMonthGenitiveNames = nativeCultureInfo.DateTimeFormat.AbbreviatedMonthGenitiveNames;
            //data.saLeapYearMonthNames =
            return true;
        }
        return false;
    }

    // Call native side to figure out which calendars are allowed
    public /* internal */ static nativeGetCalendars(localeName: string, useUserOverride: boolean, calendars: IntArray): int {
        calendars[0] = 1;
        return 1;
        //throw new NotImplementedException('');
    }
    //#endif
}

CalendarData.StaticContructor();