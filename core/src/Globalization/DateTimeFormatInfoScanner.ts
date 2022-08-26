//
// from LocaleEx.txt header
//
//; IFORMATFLAGS

import { Dictionary } from "../Collections/Generic/Dictionary";
import { List } from "../Collections/Generic/List";
import { char, int, New } from "../float";
import { TString } from '../Text/TString';
import { TChar } from '../Extensions/TChar';
import { Out } from '../Out';
import { StringBuilder } from "../Text/StringBuilder";
import { DateTimeFormatInfo } from "./CultureInfo";
//
// Flag used to trace the date patterns (yy/yyyyy/M/MM/MMM/MMM/d/dd) that we have seen.
//
enum FoundDatePattern {
    None = 0x0000,
    FoundYearPatternFlag = 0x0001,
    FoundMonthPatternFlag = 0x0002,
    FoundDayPatternFlag = 0x0004,
    FoundYMDPatternFlag = 0x0007, // FoundYearPatternFlag | FoundMonthPatternFlag | FoundDayPatternFlag;
}

//;       Parsing/formatting flags.
export enum FORMATFLAGS {
    None = 0x00000000,
    UseGenitiveMonth = 0x00000001,
    UseLeapYearMonth = 0x00000002,
    UseSpacesInMonthNames = 0x00000004,
    UseHebrewParsing = 0x00000008,
    UseSpacesInDayNames = 0x00000010,   // Has spaces or non-breaking space in the day names.
    UseDigitPrefixInTokens = 0x00000020,   // Has token starting with numbers.
}

//
// To change in CalendarId you have to do the same change in Calendar.cs
// To do: make the definintion shared between these two files.
//

export enum CalendarId {
    GREGORIAN = 1,     // Gregorian (localized) calendar
    GREGORIAN_US = 2,     // Gregorian (U.S.) calendar
    JAPAN = 3,     // Japanese Emperor Era calendar
/* SSS_WARNINGS_OFF */         TAIWAN = 4,     // Taiwan Era calendar /* SSS_WARNINGS_ON */
    KOREA = 5,     // Korean Tangun Era calendar
    HIJRI = 6,     // Hijri (Arabic Lunar) calendar
    THAI = 7,     // Thai calendar
    HEBREW = 8,     // Hebrew (Lunar) calendar
    GREGORIAN_ME_FRENCH = 9,     // Gregorian Middle East French calendar
    GREGORIAN_ARABIC = 10,     // Gregorian Arabic calendar
    GREGORIAN_XLIT_ENGLISH = 11,     // Gregorian Transliterated English calendar
    GREGORIAN_XLIT_FRENCH = 12,
    // Note that all calendars after this point are MANAGED ONLY for now.
    JULIAN = 13,
    JAPANESELUNISOLAR = 14,
    CHINESELUNISOLAR = 15,
    SAKA = 16,     // reserved to match Office but not implemented in our code
    LUNAR_ETO_CHN = 17,     // reserved to match Office but not implemented in our code
    LUNAR_ETO_KOR = 18,     // reserved to match Office but not implemented in our code
    LUNAR_ETO_ROKUYOU = 19,     // reserved to match Office but not implemented in our code
    KOREANLUNISOLAR = 20,
    TAIWANLUNISOLAR = 21,
    PERSIAN = 22,
    UMALQURA = 23,
    LAST_CALENDAR = 23      // Last calendar ID
}

export class DateTimeFormatInfoScanner {
    // Special prefix-like flag char in DateWord array.

    // Use char in PUA area since we won't be using them in real data.
    // The char used to tell a read date word or a month postfix.  A month postfix
    // is "ta" in the long date pattern like "d. MMMM'ta 'yyyy" for fi-FI.
    // In this case, it will be stored as "\xfffeta" in the date word array.
    public /* internal */ static readonly MonthPostfixChar: char = '\xe000'.charCodeAt(0);

    // Add ignorable symbol in a DateWord array.

    // hu-HU has:
    //      shrot date pattern: yyyy. MM. dd.;yyyy-MM-dd;yy-MM-dd
    //      long date pattern: yyyy. MMMM d.
    // Here, "." is the date separator (derived from short date pattern). However,
    // "." also appear at the end of long date pattern.  In this case, we just
    // "." as ignorable symbol so that the DateTime.Parse() state machine will not
    // treat the additional date separator at the end of y,m,d pattern as an error
    // condition.
    public /* internal */ static readonly IgnorableSymbolChar: char = '\xe001'.charCodeAt(0);

    // Known CJK suffix
    public /* internal */ static readonly CJKYearSuff: string = "\u5e74";
    public /* internal */ static readonly CJKMonthSuff: string = "\u6708";
    public /* internal */ static readonly CJKDaySuff: string = "\u65e5";

    public /* internal */ static readonly KoreanYearSuff: string = "\ub144";
    public /* internal */ static readonly KoreanMonthSuff: string = "\uc6d4";
    public /* internal */ static readonly KoreanDaySuff: string = "\uc77c";

    public /* internal */ static readonly KoreanHourSuff: string = "\uc2dc";
    public /* internal */ static readonly KoreanMinuteSuff: string = "\ubd84";
    public /* internal */ static readonly KoreanSecondSuff: string = "\ucd08";

    public /* internal */ static readonly CJKHourSuff: string = "\u6642";
    public /* internal */ static readonly ChineseHourSuff: string = "\u65f6";

    public /* internal */ static readonly CJKMinuteSuff: string = "\u5206";
    public /* internal */ static readonly CJKSecondSuff: string = "\u79d2";

    // The collection fo date words & postfix.
    public /* internal */  m_dateWords: List<string> = new List<string>();
    // Hashtable for the known words.
    private static /* volatile */  s_knownWords: Dictionary<string, string>;

    private static get KnownWords(): Dictionary<string, string> {
        if (DateTimeFormatInfoScanner.s_knownWords == null) {
            const temp: Dictionary<string, string> = new Dictionary<string, string>();
            // Add known words into the hash table.

            // Skip these special symbols.
            temp.Add("/", String.Empty);
            temp.Add("-", String.Empty);
            temp.Add(".", String.Empty);
            // Skip known CJK suffixes.
            temp.Add(DateTimeFormatInfoScanner.CJKYearSuff, TString.Empty);
            temp.Add(DateTimeFormatInfoScanner.CJKMonthSuff, TString.Empty);
            temp.Add(DateTimeFormatInfoScanner.CJKDaySuff, TString.Empty);
            temp.Add(DateTimeFormatInfoScanner.KoreanYearSuff, TString.Empty);
            temp.Add(DateTimeFormatInfoScanner.KoreanMonthSuff, TString.Empty);
            temp.Add(DateTimeFormatInfoScanner.KoreanDaySuff, TString.Empty);
            temp.Add(DateTimeFormatInfoScanner.KoreanHourSuff, TString.Empty);
            temp.Add(DateTimeFormatInfoScanner.KoreanMinuteSuff, TString.Empty);
            temp.Add(DateTimeFormatInfoScanner.KoreanSecondSuff, TString.Empty);
            temp.Add(DateTimeFormatInfoScanner.CJKHourSuff, TString.Empty);
            temp.Add(DateTimeFormatInfoScanner.ChineseHourSuff, TString.Empty);
            temp.Add(DateTimeFormatInfoScanner.CJKMinuteSuff, TString.Empty);
            temp.Add(DateTimeFormatInfoScanner.CJKSecondSuff, TString.Empty);

            DateTimeFormatInfoScanner.s_knownWords = temp;
        }
        return DateTimeFormatInfoScanner.s_knownWords;
    }


    ////////////////////////////////////////////////////////////////////////////
    //
    //  Parameters:
    //      pattern: The pattern to be scanned.
    //      currentIndex: the current index to start the scan.
    //
    //  Returns:
    //      Return the index with the first character that is a letter, which will
    //      be the start of a date word.
    //      Note that the index can be pattern.Length if we reach the end of the string.
    //
    ////////////////////////////////////////////////////////////////////////////
    public /* internal */ static SkipWhiteSpacesAndNonLetter(pattern: string, currentIndex: int): int {
        while (currentIndex < pattern.length) {
            let ch: char = pattern[currentIndex].charCodeAt(0);
            if (ch === '\\'.charCodeAt(0)) {
                // Escaped character. Look ahead one character.
                currentIndex++;
                if (currentIndex < pattern.length) {
                    ch = pattern[currentIndex].charCodeAt(0);
                    if (ch === '\''.charCodeAt(0)) {
                        // Skip the leading single quote.  We will
                        // stop at the first letter.
                        continue;
                    }
                    // Fall thru to check if this is a letter.
                } else {
                    // End of string
                    break;
                }
            }
            if (TChar.IsLetter(ch) || ch === '\''.charCodeAt(0) || ch === '.'.charCodeAt(0)) {
                break;
            }
            // Skip the current char since it is not a letter.
            currentIndex++;
        }
        return currentIndex;
    }

    ////////////////////////////////////////////////////////////////////////////
    //
    // A helper to add the found date word or month postfix into ArrayList for date words.
    //
    // Parameters:
    //      formatPostfix: What kind of postfix this is.
    //          Possible values:
    //              null: This is a regular date word
    //              "MMMM": month postfix
    //      word: The date word or postfix to be added.
    //
    ////////////////////////////////////////////////////////////////////////////
    public /* internal */  AddDateWordOrPostfix(formatPostfix: string, str: string): void {
        if (str.length > 0) {
            // Some cultures use . like an abbreviation
            if (TString.Equals(str, ".")) {
                this.AddIgnorableSymbols(".");
                return;
            }
            let words: Out<string> = New.Out('');;
            if (DateTimeFormatInfoScanner.KnownWords.TryGetValue(str, words) === false) {
                if (this.m_dateWords == null) {
                    this.m_dateWords = new List<string>();
                }
                if (formatPostfix === "MMMM") {
                    // Add the word into the ArrayList as "\xfffe" + real month postfix.
                    const temp: string = DateTimeFormatInfoScanner.MonthPostfixChar + str;
                    if (!this.m_dateWords.Contains(temp)) {
                        this.m_dateWords.Add(temp);
                    }
                } else {
                    if (!this.m_dateWords.Contains(str)) {
                        this.m_dateWords.Add(str);
                    }
                    if (str[str.length - 1] == '.') {
                        // Old version ignore the trialing dot in the date words. Support this as well.
                        const strWithoutDot: string = str.substring(0, str.length - 1);
                        if (!this.m_dateWords.Contains(strWithoutDot)) {
                            this.m_dateWords.Add(strWithoutDot);
                        }

                    }
                }
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////
    //
    // Scan the pattern from the specified index and add the date word/postfix
    // when appropriate.
    //
    //  Parameters:
    //      pattern: The pattern to be scanned.
    //      index: The starting index to be scanned.
    //      formatPostfix: The kind of postfix to be scanned.
    //          Possible values:
    //              null: This is a regular date word
    //              "MMMM": month postfix
    //
    //
    ////////////////////////////////////////////////////////////////////////////
    public /* internal */  AddDateWords(pattern: string, index: int, formatPostfix: string): int {
        // Skip any whitespaces so we will start from a letter.
        const newIndex: int = DateTimeFormatInfoScanner.SkipWhiteSpacesAndNonLetter(pattern, index);
        if (newIndex !== index && formatPostfix != null) {
            // There are whitespaces. This will not be a postfix.
            formatPostfix = null as any;
        }
        index = newIndex;

        // This is the first char added into dateWord.
        // Skip all non-letter character.  We will add the first letter into DateWord.
        const dateWord: StringBuilder = new StringBuilder();
        // We assume that date words should start with a letter.
        // Skip anything until we see a letter.

        while (index < pattern.length) {
            const ch: char = pattern[index].charCodeAt(0);
            if (ch === '\''.charCodeAt(0)) {
                // We have seen the end of quote.  Add the word if we do not see it before,
                // and break the while loop.
                this.AddDateWordOrPostfix(formatPostfix, dateWord.ToString());
                index++;
                break;
            } else if (ch === '\\'.charCodeAt(0)) {
                //
                // Escaped character.  Look ahead one character
                //

                // Skip escaped backslash.
                index++;
                if (index < pattern.length) {
                    dateWord.Append(pattern[index]);
                    index++;
                }
            } else if (TChar.IsWhiteSpace(ch)) {
                // Found a whitespace.  We have to add the current date word/postfix.
                this.AddDateWordOrPostfix(formatPostfix, dateWord.ToString());
                if (formatPostfix != null) {
                    // Done with postfix.  The rest will be regular date word.
                    formatPostfix = null as any;
                }
                // Reset the dateWord.
                dateWord.Length = 0;
                index++;
            } else {
                dateWord.AppendChar(ch);
                index++;
            }
        }
        return (index);
    }

    ////////////////////////////////////////////////////////////////////////////
    //
    // A simple helper to find the repeat count for a specified char.
    //
    ////////////////////////////////////////////////////////////////////////////
    public /* internal */ static ScanRepeatChar(pattern: string, ch: char, index: int, count: Out<int>): int {
        count.value = 1;
        while (++index < pattern.length && pattern[index].charCodeAt(0) === ch) {
            count.value++;
        }
        // Return the updated position.
        return index;
    }

    ////////////////////////////////////////////////////////////////////////////
    //
    // Add the text that is a date separator but is treated like ignroable symbol.
    // E.g.
    // hu-HU has:
    //      shrot date pattern: yyyy. MM. dd.;yyyy-MM-dd;yy-MM-dd
    //      long date pattern: yyyy. MMMM d.
    // Here, "." is the date separator (derived from short date pattern). However,
    // "." also appear at the end of long date pattern.  In this case, we just
    // "." as ignorable symbol so that the DateTime.Parse() state machine will not
    // treat the additional date separator at the end of y,m,d pattern as an error
    // condition.
    //
    ////////////////////////////////////////////////////////////////////////////

    public /* internal */  AddIgnorableSymbols(text: string): void {
        if (this.m_dateWords == null) {
            // Create the date word array.
            this.m_dateWords = new List<string>();
        }
        // Add the ingorable symbol into the ArrayList.
        const temp: string = String.fromCharCode(DateTimeFormatInfoScanner.IgnorableSymbolChar) + text;
        if (!this.m_dateWords.Contains(temp)) {
            this.m_dateWords.Add(temp);
        }
    }

    // Check if we have found all of the year/month/day pattern.
    private m_ymdFlags: FoundDatePattern = FoundDatePattern.None;


    ////////////////////////////////////////////////////////////////////////////
    //
    // Given a date format pattern, scan for date word or postfix.
    //
    // A date word should be always put in a single quoted string.  And it will
    // start from a letter, so whitespace and symbols will be ignored before
    // the first letter.
    //
    // Examples of date word:
    //  'de' in es-SP: dddd, dd' de 'MMMM' de 'yyyy
    //  "\x0443." in bg-BG: dd.M.yyyy '\x0433.'
    //
    // Example of postfix:
    //  month postfix:
    //      "ta" in fi-FI: d. MMMM'ta 'yyyy
    //  Currently, only month postfix is supported.
    //
    // Usage:
    //  Always call this with Framework-style pattern, instead of Windows style pattern.
    //  Windows style pattern uses '' for single quote, while .NET uses \'
    //
    ////////////////////////////////////////////////////////////////////////////
    public /* internal */  ScanDateWord(pattern: string): void {

        // Check if we have found all of the year/month/day pattern.
        this.m_ymdFlags = FoundDatePattern.None;

        let i: int = 0;
        while (i < pattern.length) {
            let ch: char = pattern[i].charCodeAt(0);
            let chCount: Out<int> = New.Out(0);

            switch (ch) {
                case '\''.charCodeAt(0):
                    // Find a beginning quote.  Search until the end quote.
                    i = this.AddDateWords(pattern, i + 1, null as any);
                    break;
                case 'M'.charCodeAt(0):
                    i = DateTimeFormatInfoScanner.ScanRepeatChar(pattern, 'M'.charCodeAt(0), i, chCount);
                    if (chCount.value >= 4) {
                        if (i < pattern.length && pattern[i] === '\'') {
                            i = this.AddDateWords(pattern, i + 1, "MMMM");
                        }
                    }
                    this.m_ymdFlags |= FoundDatePattern.FoundMonthPatternFlag;
                    break;
                case 'y'.charCodeAt(0):
                    i = DateTimeFormatInfoScanner.ScanRepeatChar(pattern, 'y'.charCodeAt(0), i, chCount);
                    this.m_ymdFlags |= FoundDatePattern.FoundYearPatternFlag;
                    break;
                case 'd'.charCodeAt(0):
                    i = DateTimeFormatInfoScanner.ScanRepeatChar(pattern, 'd'.charCodeAt(0), i, chCount);
                    if (chCount.value <= 2) {
                        // Only count "d" & "dd".
                        // ddd, dddd are day names.  Do not count them.
                        this.m_ymdFlags |= FoundDatePattern.FoundDayPatternFlag;
                    }
                    break;
                case '\\'.charCodeAt(0):
                    // Found a escaped char not in a quoted string.  Skip the current backslash
                    // and its next character.
                    i += 2;
                    break;
                case '.'.charCodeAt(0):
                    if (this.m_ymdFlags === FoundDatePattern.FoundYMDPatternFlag) {
                        // If we find a dot immediately after the we have seen all of the y, m, d pattern.
                        // treat it as a ignroable symbol.  Check for comments in AddIgnorableSymbols for
                        // more details.
                        this.AddIgnorableSymbols(".");
                        this.m_ymdFlags = FoundDatePattern.None;
                    }
                    i++;
                    break;
                default:
                    if (this.m_ymdFlags === FoundDatePattern.FoundYMDPatternFlag && !TChar.IsWhiteSpace(ch)) {
                        // We are not seeing "." after YMD. Clear the flag.
                        this.m_ymdFlags = FoundDatePattern.None;
                    }
                    // We are not in quote.  Skip the current character.
                    i++;
                    break;
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////
    //
    // Given a DTFI, get all of the date words from date patterns and time patterns.
    //
    ////////////////////////////////////////////////////////////////////////////
    public /* internal */  GetDateWordsOfDTFI(dtfi: DateTimeFormatInfo): string[] {
        // Enumarate all LongDatePatterns, and get the DateWords and scan for month postfix.
        let datePatterns: string[] = dtfi.GetAllDateTimePatterns('D'.charCodeAt(0));
        let i: int;

        // Scan the long date patterns
        for (i = 0; i < datePatterns.length; i++) {
            this.ScanDateWord(datePatterns[i]);
        }

        // Scan the short date patterns
        datePatterns = dtfi.GetAllDateTimePatterns('d'.charCodeAt(0));
        for (i = 0; i < datePatterns.length; i++) {
            this.ScanDateWord(datePatterns[i]);
        }
        // Scan the YearMonth patterns.
        datePatterns = dtfi.GetAllDateTimePatterns('y'.charCodeAt(0));
        for (i = 0; i < datePatterns.length; i++) {
            this.ScanDateWord(datePatterns[i]);
        }

        // Scan the month/day pattern
        this.ScanDateWord(dtfi.MonthDayPattern);

        // Scan the long time patterns.
        datePatterns = dtfi.GetAllDateTimePatterns('T'.charCodeAt(0));
        for (i = 0; i < datePatterns.length; i++) {
            this.ScanDateWord(datePatterns[i]);
        }

        // Scan the short time patterns.
        datePatterns = dtfi.GetAllDateTimePatterns('t'.charCodeAt(0));
        for (i = 0; i < datePatterns.length; i++) {
            this.ScanDateWord(datePatterns[i]);
        }

        let result: string[] = null as any;
        if (this.m_dateWords != null && this.m_dateWords.Count > 0) {
            result = New.Array(this.m_dateWords.Count);
            for (i = 0; i < this.m_dateWords.Count; i++) {
                result[i] = this.m_dateWords[i];
            }
        }
        return (result);
    }

    ////////////////////////////////////////////////////////////////////////////
    //
    // Scan the month names to see if genitive month names are used, and return
    // the format flag.
    //
    ////////////////////////////////////////////////////////////////////////////
    public /* internal */ static GetFormatFlagGenitiveMonth(monthNames: string[], genitveMonthNames: string[], abbrevMonthNames: string[], genetiveAbbrevMonthNames: string[]): FORMATFLAGS {
        // If we have different names in regular and genitive month names, use genitive month flag.
        return ((!DateTimeFormatInfoScanner.EqualStringArrays(monthNames, genitveMonthNames) || !DateTimeFormatInfoScanner.EqualStringArrays(abbrevMonthNames, genetiveAbbrevMonthNames)) ? FORMATFLAGS.UseGenitiveMonth : 0);
    }

    ////////////////////////////////////////////////////////////////////////////
    //
    // Scan the month names to see if spaces are used or start with a digit, and return the format flag
    //
    ////////////////////////////////////////////////////////////////////////////
    public /* internal */ static GetFormatFlagUseSpaceInMonthNames(monthNames: string[], genitveMonthNames: string[], abbrevMonthNames: string[], genetiveAbbrevMonthNames: string[]): FORMATFLAGS {
        let formatFlags: FORMATFLAGS = 0;
        formatFlags |= (DateTimeFormatInfoScanner.ArrayElementsBeginWithDigit(monthNames) ||
            DateTimeFormatInfoScanner.ArrayElementsBeginWithDigit(genitveMonthNames) ||
            DateTimeFormatInfoScanner.ArrayElementsBeginWithDigit(abbrevMonthNames) ||
            DateTimeFormatInfoScanner.ArrayElementsBeginWithDigit(genetiveAbbrevMonthNames)
            ? FORMATFLAGS.UseDigitPrefixInTokens : 0);

        formatFlags |= (DateTimeFormatInfoScanner.ArrayElementsHaveSpace(monthNames) ||
            DateTimeFormatInfoScanner.ArrayElementsHaveSpace(genitveMonthNames) ||
            DateTimeFormatInfoScanner.ArrayElementsHaveSpace(abbrevMonthNames) ||
            DateTimeFormatInfoScanner.ArrayElementsHaveSpace(genetiveAbbrevMonthNames)
            ? FORMATFLAGS.UseSpacesInMonthNames : 0);
        return (formatFlags);
    }

    ////////////////////////////////////////////////////////////////////////////
    //
    // Scan the day names and set the correct format flag.
    //
    ////////////////////////////////////////////////////////////////////////////
    public /* internal */ static GetFormatFlagUseSpaceInDayNames(dayNames: string[], abbrevDayNames: string[]): FORMATFLAGS {
        return ((DateTimeFormatInfoScanner.ArrayElementsHaveSpace(dayNames) ||
            DateTimeFormatInfoScanner.ArrayElementsHaveSpace(abbrevDayNames))
            ? FORMATFLAGS.UseSpacesInDayNames : 0);

    }

    ////////////////////////////////////////////////////////////////////////////
    //
    // Check the calendar to see if it is HebrewCalendar and set the Hebrew format flag if necessary.
    //
    ////////////////////////////////////////////////////////////////////////////
    public /* internal */ static GetFormatFlagUseHebrewCalendar(calID: int): FORMATFLAGS {
        return (calID === CalendarId.HEBREW ? FORMATFLAGS.UseHebrewParsing | FORMATFLAGS.UseLeapYearMonth : 0);
    }


    //-----------------------------------------------------------------------------
    // EqualStringArrays
    //      compares two string arrays and return true if all elements of the first
    //      array equals to all elmentsof the second array.
    //      otherwise it returns false.
    //-----------------------------------------------------------------------------

    private static EqualStringArrays(array1: string[], array2: string[]): boolean {
        // Shortcut if they're the same array
        if (array1 == array2) {
            return true;
        }

        // This is effectively impossible
        if (array1.length !== array2.length) {
            return false;
        }

        // Check each string
        for (let i: int = 0; i < array1.length; i++) {
            if (!TString.Equals(array1[i], (array2[i]))) {
                return false;
            }
        }
        return true;
    }

    //-----------------------------------------------------------------------------
    // ArrayElementsHaveSpace
    //      It checks all input array elements if any of them has space character
    //      returns true if found space character in one of the array elements.
    //      otherwise returns false.
    //-----------------------------------------------------------------------------

    private static ArrayElementsHaveSpace(array: string[]): boolean {

        for (let i: int = 0; i < array.length; i++) {
            // it is faster to check for space character manually instead of calling IndexOf
            // so we don't have to go to native code side.
            for (let j: int = 0; j < array[i].length; j++) {
                if (TChar.IsWhiteSpace(array[i][j].charCodeAt(0))) {
                    return true;
                }
            }
        }

        return false;
    }


    ////////////////////////////////////////////////////////////////////////////
    //
    // Check if any element of the array start with a digit.
    //
    ////////////////////////////////////////////////////////////////////////////
    private static ArrayElementsBeginWithDigit(array: string[]): boolean {

        for (let i: int = 0; i < array.length; i++) {
            // it is faster to check for space character manually instead of calling IndexOf
            // so we don't have to go to native code side.
            if (array[i].length > 0 &&
                array[i][0] >= '0' && array[i][0] <= '9') {
                let index: int = 1;
                while (index < array[i].length && array[i][index] >= '0' && array[i][index] <= '9') {
                    // Skip other digits.
                    index++;
                }
                if (index == array[i].length) {
                    return (false);
                }

                if (index == array[i].length - 1) {
                    // Skip known CJK month suffix.
                    // CJK uses month name like "1\x6708", since \x6708 is a known month suffix,
                    // we don't need the UseDigitPrefixInTokens since it is slower.
                    switch (array[i][index]) {
                        case '\x6708': // CJKMonthSuff
                        case '\xc6d4': // KoreanMonthSuff
                            return (false);
                    }
                }

                if (index == array[i].length - 4) {
                    // Skip known CJK month suffix.
                    // Starting with Windows 8, the CJK months for some cultures looks like: "1' \x6708'"
                    // instead of just "1\x6708"
                    if (array[i][index] === '\'' && array[i][index + 1] === ' ' && array[i][index + 2] === '\x6708' && array[i][index + 3] === '\'') {
                        return (false);
                    }

                }
                return (true);
            }
        }
        return false;
    }
}