import { Environment } from "../Environment";
import { char, int, long, New } from "../float";
import { StringBuilder } from "../Text/StringBuilder";
import { StringBuilderCache } from "../Text/StringBuilderCache";
import { TString } from "../Text/TString";
//import { Calendar } from "./Calendar";
import { CultureInfo, DateTimeFormatInfo } from "./CultureInfo";
import { Convert } from '../convert';
import { DateTimeFormatFlags } from "./DateTimeFormatFlags";
import { DateTimeKind } from "../DateTimeKind";
import { Out } from '../Out';
import { List } from "../Collections/Generic/List";
import { DateTime } from "../Time/__DateTime";
import { FormatException } from "../Extensions/FormatException";
import { HebrewNumber } from "./HebrewNumber";
import { TimeSpan } from "../Timespan";
import { MonthNameStyles } from "./MonthNameStyles";
//import { TimeZoneInfo, TimeZoneInfoOptions } from "../TimeZoneInfo";
import { System } from '../SystemTypes';
import { ArgumentOutOfRangeException } from '../Exceptions/ArgumentOutOfRangeException';
import { is } from "../is";
import { Exception } from "../Exception";
import { TNumber } from "../Math/TNumber";
import { Context } from "../Context";
import { type } from "../Reflection/Decorators/ClassInfo";

type Calendar = any;
declare var TimeZoneInfo, TimeZoneInfoOptions;
export class DateTimeFormat {

    public /* internal */ static readonly MaxSecondsFractionDigits: int = 7;
    public /* internal */ static readonly NullOffset: TimeSpan = TimeSpan.MinValue;

    public /* internal */ static allStandardFormats: char[] =
        [
            'd'.charCodeAt(0), 'D'.charCodeAt(0), 'f'.charCodeAt(0), 'F'.charCodeAt(0), 'g'.charCodeAt(0), 'G'.charCodeAt(0),
            'm'.charCodeAt(0), 'M'.charCodeAt(0), 'o'.charCodeAt(0), 'O'.charCodeAt(0), 'r'.charCodeAt(0), 'R'.charCodeAt(0),
            's'.charCodeAt(0), 't'.charCodeAt(0), 'T'.charCodeAt(0), 'u'.charCodeAt(0), 'U'.charCodeAt(0), 'y'.charCodeAt(0), 'Y'.charCodeAt(0),
        ];

    public /* internal */ static readonly RoundtripFormat: string = "yyyy'-'MM'-'dd'T'HH':'mm':'ss.fffffffK";
    public /* internal */ static readonly RoundtripDateTimeUnfixed: string = "yyyy'-'MM'-'ddTHH':'mm':'ss zzz";

    private static readonly DEFAULT_ALL_DATETIMES_SIZE: int = 132;

    public /* internal */ static fixedNumberFormats: string[] = [
        "0",
        "00",
        "000",
        "0000",
        "00000",
        "000000",
        "0000000",
    ];

    ////////////////////////////////////////////////////////////////////////////
    //
    // Format the positive integer value to a string and perfix with assigned
    // length of leading zero.
    //
    // Parameters:
    //  value: The value to format
    //  len: The maximum length for leading zero.
    //  If the digits of the value is greater than len, no leading zero is added.
    //
    // Notes:
    //  The function can format to Int32.MaxValue.
    //
    ////////////////////////////////////////////////////////////////////////////
    public /* internal */ static FormatDigits(outputBuffer: StringBuilder, value: int, len: int): void;
    public /* internal */  static FormatDigits(outputBuffer: StringBuilder, value: int, len: int, overrideLengthLimit: boolean): void;
    public /* internal */ static FormatDigits(...args: any[]): void {
        if (args.length === 3) {
            const outputBuffer: StringBuilder = args[0];
            const value: int = args[1];
            const len: int = args[2];
            //Contract.Assert(value >= 0, "DateTimeFormat.FormatDigits(): value >= 0");
            DateTimeFormat.FormatDigits(outputBuffer, value, len, false);
        } else if (args.length === 4) {
            const outputBuffer: StringBuilder = args[0];
            const value: int = args[1];
            let len: int = args[2];
            const overrideLengthLimit: boolean = args[3];
            //Contract.Assert(value >= 0, "DateTimeFormat.FormatDigits(): value >= 0");

            // Limit the use of this function to be two-digits, so that we have the same behavior
            // as RTM bits.
            if (!overrideLengthLimit && len > 2) {
                len = 2;
            }

            /*  char * buffer = stackalloc char[16];
             char * p = buffer + 16;
             int n = value;
             do {
                 * --p = (char)(n % 10 + '0');
                 n /= 10;
             } while ((n != 0) && (p > buffer));

             int digits = (int)(buffer + 16 - p); */

            //If the repeat count is greater than 0, we're trying
            //to emulate the "00" format, so we have to prepend
            //a zero if the string only has one character.
            /* while ((digits < len) && (p > buffer)) {
                * --p='0';
                digits++;
            } */

            const s = "000000000" + value;

            outputBuffer.Append(s.substr(s.length - len));
        }
    }

    private static HebrewFormatDigits(outputBuffer: StringBuilder, digits: int): void {
        outputBuffer.Append(HebrewNumber.ToString(digits));
    }

    public /* internal */ static ParseRepeatPattern(format: string, pos: int, patternChar: char): int;
    public /* internal */ static ParseRepeatPattern(format: char, pos: int, patternChar: char): int;
    public /* internal */ static ParseRepeatPattern(...args: any[]): int {
        if (args.length === 3 && is.string(args[0]) && is.int(args[1]) && is.char(args[2])) {
            const format: string = args[0];
            const pos: int = args[1];
            const patternChar: char = args[2];
            const len: int = format.length;
            let index: int = pos + 1;
            while ((index < len) && (format[index].charCodeAt(0) === patternChar)) {
                index++;
            }
            return (index - pos);
        } else if (args.length === 3 && is.char(args[0]) && is.int(args[1]) && is.char(args[2])) {
            const format: char = args[0];
            const pos: int = args[1];
            const patternChar: char = args[2];
            return DateTimeFormat.ParseRepeatPattern(String.fromCharCode(format), pos, patternChar);
        }
        throw new ArgumentOutOfRangeException('');
    }

    private static FormatDayOfWeek(dayOfWeek: int, repeat: int, dtfi: DateTimeFormatInfo): string {
        //Contract.Assert(dayOfWeek >= 0 && dayOfWeek <= 6, "dayOfWeek >= 0 && dayOfWeek <= 6");
        if (repeat === 3) {
            return (dtfi.GetAbbreviatedDayName(dayOfWeek));
        }
        // Call dtfi.GetDayName() here, instead of accessing DayNames property, because we don't
        // want a clone of DayNames, which will hurt perf.
        return (dtfi.GetDayName(dayOfWeek));
    }

    private static FormatMonth(month: int, repeatCount: int, dtfi: DateTimeFormatInfo): string {
        //Contract.Assert(month >= 1 && month <= 12, "month >=1 && month <= 12");
        if (repeatCount === 3) {
            return (dtfi.GetAbbreviatedMonthName(month));
        }
        // Call GetMonthName() here, instead of accessing MonthNames property, because we don't
        // want a clone of MonthNames, which will hurt perf.
        return (dtfi.GetMonthName(month));
    }

    //
    //  FormatHebrewMonthName
    //
    //  Action: Return the Hebrew month name for the specified DateTime.
    //  Returns: The month name string for the specified DateTime.
    //  Arguments:
    //        time   the time to format
    //        month  The month is the value of HebrewCalendar.GetMonth(time).
    //        repeat Return abbreviated month name if repeat=3, or full month name if repeat=4
    //        dtfi    The DateTimeFormatInfo which uses the Hebrew calendars as its calendar.
    //  Exceptions: None.
    //

    /* Note:
        If DTFI is using Hebrew calendar, GetMonthName()/GetAbbreviatedMonthName() will return month names like this:
        1   Hebrew 1st Month
        2   Hebrew 2nd Month
        ..  ...
        6   Hebrew 6th Month
        7   Hebrew 6th Month II (used only in a leap year)
        8   Hebrew 7th Month
        9   Hebrew 8th Month
        10  Hebrew 9th Month
        11  Hebrew 10th Month
        12  Hebrew 11th Month
        13  Hebrew 12th Month
        Therefore, if we are in a regular year, we have to increment the month name if moth is greater or eqaul to 7.
    */
    private static FormatHebrewMonthName(time: DateTime, month: int, repeatCount: int, dtfi: DateTimeFormatInfo): string {
        //Contract.Assert(repeatCount != 3 || repeatCount != 4, "repeateCount should be 3 or 4");
        if (dtfi.Calendar.IsLeapYear(dtfi.Calendar.GetYear(time))) {
            // This month is in a leap year
            return (dtfi.internalGetMonthName(month, MonthNameStyles.LeapYear, (repeatCount == 3)));
        }
        // This is in a regular year.
        if (month >= 7) {
            month++;
        }
        if (repeatCount === 3) {
            return (dtfi.GetAbbreviatedMonthName(month));
        }
        return (dtfi.GetMonthName(month));
    }

    //
    // The pos should point to a quote character. This method will
    // get the string encloed by the quote character.
    //
    public /* internal */ static ParseQuoteString(format: string, pos: int, result: StringBuilder): int;
    public /* internal */ static ParseQuoteString(format: char, pos: int, result: StringBuilder): int;
    public /* internal */ static ParseQuoteString(...args: any[]): int {
        if (args.length === 3 && is.string(args[0]) && is.int(args[1]) && is.typeof<StringBuilder>(args[2], System.Types.Text.StringBuilder)) {
            const format: string = args[0];
            let pos: int = args[1];
            const result: StringBuilder = args[2];
            //
            // NOTE : pos will be the index of the quote character in the 'format' string.
            //
            let formatLen: int = format.length;
            let beginPos: int = pos;
            let quoteChar: char = format[pos++].charCodeAt(0); // Get the character used to quote the following string.

            let foundQuote: boolean = false;
            while (pos < formatLen) {
                let ch: char = format[pos++].charCodeAt(0);
                if (ch === quoteChar) {
                    foundQuote = true;
                    break;
                }
                else if (ch === '\\'.charCodeAt(0)) {
                    // The following are used to support escaped character.
                    // Escaped character is also supported in the quoted string.
                    // Therefore, someone can use a format like "'minute:' mm\"" to display:
                    //  minute: 45"
                    // because the second double quote is escaped.
                    if (pos < formatLen) {
                        result.Append(format[pos++]);
                    } else {
                        //
                        // This means that '\' is at the end of the formatting string.
                        //
                        throw new FormatException(Environment.GetResourceString("Format_InvalidString"));
                    }
                } else {
                    result.Append(String.fromCharCode(ch));
                }
            }

            if (!foundQuote) {
                // Here we can't find the matching quote.
                throw new FormatException(
                    TString.Format(
                        /* CultureInfo.CurrentCulture, */
                        Environment.GetResourceString("Format_BadQuote"), quoteChar));
            }

            //
            // Return the character count including the begin/end quote characters and enclosed string.
            //
            return (pos - beginPos);
        } else if (args.length === 3 && is.char(args[0]) && is.int(args[1]) && is.typeof<StringBuilder>(args[2], System.Types.Text.StringBuilder)) {
            const format: char = args[0];
            const pos: int = args[1];
            const result: StringBuilder = args[2];
            return DateTimeFormat.ParseQuoteString(String.fromCharCode(format), pos, result);
        }
        throw new ArgumentOutOfRangeException('');
    }

    //
    // Get the next character at the index of 'pos' in the 'format' string.
    // Return value of -1 means 'pos' is already at the end of the 'format' string.
    // Otherwise, return value is the int value of the next character.
    //
    public /* internal */ static ParseNextChar(format: string, pos: int): int;
    public /* internal */ static ParseNextChar(format: char, pos: int): int;
    public /* internal */ static ParseNextChar(...args: any[]): int {
        if (args.length === 2 && is.string(args[0]) && is.int(args[1])) {
            const format: string = args[0];
            const pos: int = args[1];
            if (pos >= format.length - 1) {
                return (-1);
            }
            return format[pos + 1].charCodeAt(0);
        } else if (args.length === 2 && is.char(args[0]) && is.int(args[1])) {
            const format: char = args[0];
            const pos: int = args[1];
            return DateTimeFormat.ParseNextChar(String.fromCharCode(0), pos);
        }
        throw new ArgumentOutOfRangeException('');
    }


    //
    //  IsUseGenitiveForm
    //
    //  Actions: Check the format to see if we should use genitive month in the formatting.
    //      Starting at the position (index) in the (format) string, look back and look ahead to
    //      see if there is "d" or "dd".  In the case like "d MMMM" or "MMMM dd", we can use
    //      genitive form.  Genitive form is not used if there is more than two "d".
    //  Arguments:
    //      format      The format string to be scanned.
    //      index       Where we should start the scanning.  This is generally where "M" starts.
    //      tokenLen    The len of the current pattern character.  This indicates how many "M" that we have.
    //      patternToMatch  The pattern that we want to search. This generally uses "d"
    //
    private static IsUseGenitiveForm(format: string, index: int, tokenLen: int, patternToMatch: char): boolean {
        let i: int;
        let repeat: int = 0;
        //
        // Look back to see if we can find "d" or "ddd"
        //

        // Find first "d".
        for (i = index - 1; i >= 0 && format[i].charCodeAt(0) !== patternToMatch; i--) {  /*Do nothing here */ };

        if (i >= 0) {
            // Find a "d", so look back to see how many "d" that we can find.
            while (--i >= 0 && format[i].charCodeAt(0) === patternToMatch) {
                repeat++;
            }
            //
            // repeat == 0 means that we have one (patternToMatch)
            // repeat == 1 means that we have two (patternToMatch)
            //
            if (repeat <= 1) {
                return (true);
            }
            // Note that we can't just stop here.  We may find "ddd" while looking back, and we have to look
            // ahead to see if there is "d" or "dd".
        }

        //
        // If we can't find "d" or "dd" by looking back, try look ahead.
        //

        // Find first "d"
        for (i = index + tokenLen; i < format.length && format[i].charCodeAt(0) !== patternToMatch; i++) { /* Do nothing here */ };

        if (i < format.length) {
            repeat = 0;
            // Find a "d", so contine the walk to see how may "d" that we can find.
            while (++i < format.length && format[i].charCodeAt(0) === patternToMatch) {
                repeat++;
            }
            //
            // repeat == 0 means that we have one (patternToMatch)
            // repeat == 1 means that we have two (patternToMatch)
            //
            if (repeat <= 1) {
                return (true);
            }
        }
        return (false);
    }


    //
    //  FormatCustomized
    //
    //  Actions: Format the DateTime instance using the specified format.
    //
    private static FormatCustomized(dateTime: DateTime, format: string, dtfi: DateTimeFormatInfo, offset: TimeSpan): string {


        const cal: Calendar = dtfi.Calendar;
        const result: StringBuilder = StringBuilderCache.Acquire();
        // This is a flag to indicate if we are format the dates using Hebrew calendar.

        const isHebrewCalendar: boolean = (cal.ID === 8/*  Calendar.CAL_HEBREW */);
        // This is a flag to indicate if we are formating hour/minute/second only.
        let bTimeOnly: boolean = true;

        let i: int = 0;
        let tokenLen: int = 0, hour12: int = 0;

        while (i < format.length) {
            const ch: char = format[i].charCodeAt(0);
            let nextChar: int;
            switch (ch) {
                case 'g'.charCodeAt(0):
                    tokenLen = DateTimeFormat.ParseRepeatPattern(format, i, ch);
                    result.Append(dtfi.GetEraName(cal.GetEra(dateTime)));
                    break;
                case 'h'.charCodeAt(0):
                    tokenLen = DateTimeFormat.ParseRepeatPattern(format, i, ch);
                    hour12 = dateTime.Hour % 12;
                    if (hour12 == 0) {
                        hour12 = 12;
                    }
                    DateTimeFormat.FormatDigits(result, hour12, tokenLen);
                    break;
                case 'H'.charCodeAt(0):
                    tokenLen = DateTimeFormat.ParseRepeatPattern(format, i, ch);
                    DateTimeFormat.FormatDigits(result, dateTime.Hour, tokenLen);
                    break;
                case 'm'.charCodeAt(0):
                    tokenLen = DateTimeFormat.ParseRepeatPattern(format, i, ch);
                    DateTimeFormat.FormatDigits(result, dateTime.Minute, tokenLen);
                    break;
                case 's'.charCodeAt(0):
                    tokenLen = DateTimeFormat.ParseRepeatPattern(format, i, ch);
                    DateTimeFormat.FormatDigits(result, dateTime.Second, tokenLen);
                    break;
                case 'f'.charCodeAt(0):
                case 'F'.charCodeAt(0):
                    tokenLen = DateTimeFormat.ParseRepeatPattern(format, i, ch);
                    if (tokenLen <= DateTimeFormat.MaxSecondsFractionDigits) {
                        let fraction: long = (dateTime.Ticks.mod(Convert.ToLong(10000).mul(1000)/* Calendar.TicksPerSecond */));
                        fraction = fraction.div(Convert.ToLong(Math.pow(10, 7 - tokenLen)));
                        if (ch === 'f'.charCodeAt(0)) {
                            //throw new Exception('düzelt');
                            const _value = Convert.ToInt32(fraction);
                            result.Append(TNumber.ToString(DateTimeFormat.fixedNumberFormats[tokenLen - 1], _value));
                            //result.Append(().ToString(DateTimeFormat.fixedNumberFormats[tokenLen - 1], CultureInfo.InvariantCulture));
                        }
                        else {
                            let effectiveDigits: int = tokenLen;
                            while (effectiveDigits > 0) {
                                if (fraction.mod(10).equals(Convert.ToLong(0))) {
                                    fraction = fraction.div(10);
                                    effectiveDigits--;
                                }
                                else {
                                    break;
                                }
                            }
                            if (effectiveDigits > 0) {
                                //throw new Exception('Düzelt');
                                const _value = Convert.ToInt32(fraction);
                                result.Append(TNumber.ToString(DateTimeFormat.fixedNumberFormats[effectiveDigits - 1], _value));
                                //result.Append((Convert.ToInt32(fraction)).ToString(DateTimeFormat.fixedNumberFormats[effectiveDigits - 1], CultureInfo.InvariantCulture));
                            }
                            else {
                                // No fraction to emit, so see if we should remove decimal also.
                                if (result.Length > 0 && result[result.Length - 1] === '.') {
                                    result.Remove(result.Length - 1, 1);
                                }
                            }
                        }
                    } else {
                        throw new FormatException(Environment.GetResourceString("Format_InvalidString"));
                    }
                    break;
                case 't'.charCodeAt(0):
                    tokenLen = DateTimeFormat.ParseRepeatPattern(format, i, ch);
                    if (tokenLen == 1) {
                        if (dateTime.Hour < 12) {
                            if (dtfi.AMDesignator.length >= 1) {
                                result.Append(dtfi.AMDesignator[0]);
                            }
                        }
                        else {
                            if (dtfi.PMDesignator.length >= 1) {
                                result.Append(dtfi.PMDesignator[0]);
                            }
                        }

                    }
                    else {
                        result.Append((dateTime.Hour < 12 ? dtfi.AMDesignator : dtfi.PMDesignator));
                    }
                    break;
                case 'd'.charCodeAt(0):
                    //
                    // tokenLen == 1 : Day of month as digits with no leading zero.
                    // tokenLen == 2 : Day of month as digits with leading zero for single-digit months.
                    // tokenLen == 3 : Day of week as a three-leter abbreviation.
                    // tokenLen >= 4 : Day of week as its full name.
                    //
                    tokenLen = DateTimeFormat.ParseRepeatPattern(format, i, ch);
                    if (tokenLen <= 2) {
                        let day: int = cal.GetDayOfMonth(dateTime);
                        if (isHebrewCalendar) {
                            // For Hebrew calendar, we need to convert numbers to Hebrew text for yyyy, MM, and dd values.
                            DateTimeFormat.HebrewFormatDigits(result, day);
                        } else {
                            DateTimeFormat.FormatDigits(result, day, tokenLen);
                        }
                    }
                    else {
                        const dayOfWeek: int = Convert.ToInt32(cal.GetDayOfWeek(dateTime));
                        result.Append(DateTimeFormat.FormatDayOfWeek(dayOfWeek, tokenLen, dtfi));
                    }
                    bTimeOnly = false;
                    break;
                case 'M'.charCodeAt(0):
                    //
                    // tokenLen == 1 : Month as digits with no leading zero.
                    // tokenLen == 2 : Month as digits with leading zero for single-digit months.
                    // tokenLen == 3 : Month as a three-letter abbreviation.
                    // tokenLen >= 4 : Month as its full name.
                    //
                    tokenLen = DateTimeFormat.ParseRepeatPattern(format, i, ch);
                    const month: int = cal.GetMonth(dateTime);
                    if (tokenLen <= 2) {
                        if (isHebrewCalendar) {
                            // For Hebrew calendar, we need to convert numbers to Hebrew text for yyyy, MM, and dd values.
                            DateTimeFormat.HebrewFormatDigits(result, month);
                        } else {
                            DateTimeFormat.FormatDigits(result, month, tokenLen);
                        }
                    }
                    else {
                        if (isHebrewCalendar) {
                            result.Append(DateTimeFormat.FormatHebrewMonthName(dateTime, month, tokenLen, dtfi));
                        } else {
                            if ((dtfi.FormatFlags & DateTimeFormatFlags.UseGenitiveMonth) !== 0 && tokenLen >= 4) {
                                result.Append(
                                    dtfi.internalGetMonthName(
                                        month,
                                        DateTimeFormat.IsUseGenitiveForm(format, i, tokenLen, 'd'.charCodeAt(0)) ? MonthNameStyles.Genitive : MonthNameStyles.Regular,
                                        false));
                            } else {
                                result.Append(DateTimeFormat.FormatMonth(month, tokenLen, dtfi));
                            }
                        }
                    }
                    bTimeOnly = false;
                    break;
                case 'y'.charCodeAt(0):
                    // Notes about OS behavior:
                    // y: Always print (year % 100). No leading zero.
                    // yy: Always print (year % 100) with leading zero.
                    // yyy/yyyy/yyyyy/... : Print year value.  No leading zero.

                    const year: int = cal.GetYear(dateTime);
                    tokenLen = DateTimeFormat.ParseRepeatPattern(format, i, ch);
                    if (dtfi.HasForceTwoDigitYears) {
                        DateTimeFormat.FormatDigits(result, year, tokenLen <= 2 ? tokenLen : 2);
                    }
                    else if (cal.ID === 8 /* Calendar.CAL_HEBREW */) {
                        DateTimeFormat.HebrewFormatDigits(result, year);
                    }
                    else {
                        if (tokenLen <= 2) {
                            DateTimeFormat.FormatDigits(result, year % 100, tokenLen);
                        }
                        else {
                            const fmtPattern: string = "D" + tokenLen;
                            throw new Exception('düzelt');
                            //result.Append(year.ToString(fmtPattern, CultureInfo.InvariantCulture));
                        }
                    }
                    bTimeOnly = false;
                    break;
                case 'z'.charCodeAt(0):
                    tokenLen = DateTimeFormat.ParseRepeatPattern(format, i, ch);
                    DateTimeFormat.FormatCustomizedTimeZone(dateTime, offset, format, tokenLen, bTimeOnly, result);
                    break;
                case 'K'.charCodeAt(0):
                    tokenLen = 1;
                    DateTimeFormat.FormatCustomizedRoundripTimeZone(dateTime, offset, result);
                    break;
                case ':'.charCodeAt(0):
                    result.Append(dtfi.TimeSeparator);
                    tokenLen = 1;
                    break;
                case '/'.charCodeAt(0):
                    result.Append(dtfi.DateSeparator);
                    tokenLen = 1;
                    break;
                case '\''.charCodeAt(0):
                case '\"'.charCodeAt(0):
                    const enquotedString: StringBuilder = new StringBuilder();
                    tokenLen = DateTimeFormat.ParseQuoteString(format, i, enquotedString);
                    throw new Exception('düzelt');
                    result.Append(enquotedString as any);
                    break;
                case '%'.charCodeAt(0):
                    // Optional format character.
                    // For example, format string "%d" will print day of month
                    // without leading zero.  Most of the cases, "%" can be ignored.
                    nextChar = DateTimeFormat.ParseNextChar(format, i);
                    // nextChar will be -1 if we already reach the end of the format string.
                    // Besides, we will not allow "%%" appear in the pattern.
                    if (nextChar >= 0 && nextChar !== Convert.ToInt32('%'.charCodeAt(0))) {
                        result.Append(DateTimeFormat.FormatCustomized(dateTime, (Convert.ToChar(nextChar)).toString(), dtfi, offset));
                        tokenLen = 2;
                    }
                    else {
                        //
                        // This means that '%' is at the end of the format string or
                        // "%%" appears in the format string.
                        //
                        throw new FormatException(Environment.GetResourceString("Format_InvalidString"));
                    }
                    break;
                case '\\'.charCodeAt(0):
                    // Escaped character.  Can be used to insert character into the format string.
                    // For exmple, "\d" will insert the character 'd' into the string.
                    //
                    // NOTENOTE : we can remove this format character if we enforce the enforced quote
                    // character rule.
                    // That is, we ask everyone to use single quote or double quote to insert characters,
                    // then we can remove this character.
                    //
                    nextChar = DateTimeFormat.ParseNextChar(format, i);
                    if (nextChar >= 0) {
                        result.AppendChar((Convert.ToChar(nextChar)));
                        tokenLen = 2;
                    }
                    else {
                        //
                        // This means that '\' is at the end of the formatting string.
                        //
                        throw new FormatException(Environment.GetResourceString("Format_InvalidString"));
                    }
                    break;
                default:
                    // NOTENOTE : we can remove this rule if we enforce the enforced quote
                    // character rule.
                    // That is, if we ask everyone to use single quote or double quote to insert characters,
                    // then we can remove this default block.
                    result.AppendInt(ch);
                    tokenLen = 1;
                    break;
            }
            i += tokenLen;
        }
        return StringBuilderCache.GetStringAndRelease(result);
    }


    // output the 'z' famliy of formats, which output a the offset from UTC, e.g. "-07:30"
    private static FormatCustomizedTimeZone(dateTime: DateTime, offset: TimeSpan, format: string, tokenLen: int, timeOnly: boolean, result: StringBuilder): void {
        // See if the instance already has an offset
        const dateTimeFormat: boolean = (offset === DateTimeFormat.NullOffset);
        if (dateTimeFormat) {
            // No offset. The instance is a DateTime and the output should be the local time zone

            if (timeOnly && dateTime.Ticks.lessThan(Convert.ToLong(10000).mul(1000).mul(60).mul(60).mul(24) /* Calendar.TicksPerDay */)) {
                // For time only format and a time only input, the time offset on 0001/01/01 is less
                // accurate than the system's current offset because of daylight saving time.
                offset = TimeZoneInfo.GetLocalUtcOffset(DateTime.Now, TimeZoneInfoOptions.NoThrowOnInvalidTime);
            } else if (dateTime.Kind === DateTimeKind.Utc) {
                offset = TimeSpan.Zero;
            } else {
                offset = TimeZoneInfo.GetLocalUtcOffset(dateTime, TimeZoneInfoOptions.NoThrowOnInvalidTime);
            }
        }
        if (offset >= TimeSpan.Zero) {
            result.Append('+');
        }
        else {
            result.Append('-');
            // get a positive offset, so that you don't need a separate code path for the negative numbers.
            offset = offset.Negate();
        }

        if (tokenLen <= 1) {
            // 'z' format e.g "-7"
            result.AppendFormat(/* CultureInfo.InvariantCulture, */ "{0:0}", offset.Hours);
        }
        else {
            // 'zz' or longer format e.g "-07"
            result.AppendFormat(/* CultureInfo.InvariantCulture, */ "{0:00}", offset.Hours);
            if (tokenLen >= 3) {
                // 'zzz*' or longer format e.g "-07:30"
                result.AppendFormat(/* CultureInfo.InvariantCulture, */ ":{0:00}", offset.Minutes);
            }
        }
    }

    // output the 'K' format, which is for round-tripping the data
    private static FormatCustomizedRoundripTimeZone(dateTime: DateTime, offset: TimeSpan, result: StringBuilder): void {

        // The objective of this format is to round trip the data in the type
        // For DateTime it should round-trip the Kind value and preserve the time zone.
        // DateTimeOffset instance, it should do so by using the internal time zone.

        if (offset === DateTimeFormat.NullOffset) {
            // source is a date time, so behavior depends on the kind.
            switch (dateTime.Kind) {
                case DateTimeKind.Local:
                    // This should output the local offset, e.g. "-07:30"
                    offset = TimeZoneInfo.GetLocalUtcOffset(dateTime, TimeZoneInfoOptions.NoThrowOnInvalidTime);
                    // fall through to shared time zone output code
                    break;
                case DateTimeKind.Utc:
                    // The 'Z' constant is a marker for a UTC date
                    result.Append("Z");
                    return;
                default:
                    // If the kind is unspecified, we output nothing here
                    return;
            }
        }
        if (offset >= TimeSpan.Zero) {
            result.Append('+');
        }
        else {
            result.Append('-');
            // get a positive offset, so that you don't need a separate code path for the negative numbers.
            offset = offset.Negate();
        }

        result.AppendFormat(/* CultureInfo.InvariantCulture, */ "{0:00}:{1:00}", offset.Hours, offset.Minutes);
    }


    public /* internal */ static GetRealFormat(format: string, dtfi: DateTimeFormatInfo): string {
        let realFormat: string = null as any;

        switch (format[0]) {
            case 'd':       // Short Date
                realFormat = dtfi.ShortDatePattern;
                break;
            case 'D':       // Long Date
                realFormat = dtfi.LongDatePattern;
                break;
            case 'f':       // Full (long date + short time)
                realFormat = dtfi.LongDatePattern + " " + dtfi.ShortTimePattern;
                break;
            case 'F':       // Full (long date + long time)
                realFormat = dtfi.FullDateTimePattern;
                break;
            case 'g':       // General (short date + short time)
                realFormat = dtfi.GeneralShortTimePattern;
                break;
            case 'G':       // General (short date + long time)
                realFormat = dtfi.GeneralLongTimePattern;
                break;
            case 'm':
            case 'M':       // Month/Day Date
                realFormat = dtfi.MonthDayPattern;
                break;
            case 'o':
            case 'O':
                realFormat = DateTimeFormat.RoundtripFormat;
                break;
            case 'r':
            case 'R':       // RFC 1123 Standard
                realFormat = dtfi.RFC1123Pattern;
                break;
            case 's':       // Sortable without Time Zone Info
                realFormat = dtfi.SortableDateTimePattern;
                break;
            case 't':       // Short Time
                realFormat = dtfi.ShortTimePattern;
                break;
            case 'T':       // Long Time
                realFormat = dtfi.LongTimePattern;
                break;
            case 'u':       // Universal with Sortable format
                realFormat = dtfi.UniversalSortableDateTimePattern;
                break;
            case 'U':       // Universal with Full (long date + long time) format
                realFormat = dtfi.FullDateTimePattern;
                break;
            case 'y':
            case 'Y':       // Year/Month Date
                realFormat = dtfi.YearMonthPattern;
                break;
            default:
                throw new FormatException(Environment.GetResourceString("Format_InvalidString"));
        }
        return (realFormat);
    }


    // Expand a pre-defined format string (like "D" for long date) to the real format that
    // we are going to use in the date time parsing.
    // This method also convert the dateTime if necessary (e.g. when the format is in Universal time),
    // and change dtfi if necessary (e.g. when the format should use invariant culture).
    //
    private static ExpandPredefinedFormat(format: string, dateTime: Out<DateTime>, dtfi: Out<DateTimeFormatInfo>, offset: Out<TimeSpan>): string {
        switch (format[0]) {
            case 'o':
            case 'O':       // Round trip format
                dtfi.value = DateTimeFormatInfo.InvariantInfo;
                break;
            case 'r':
            case 'R':       // RFC 1123 Standard
                if (!offset.value.Equals(DateTimeFormat.NullOffset)) {
                    // Convert to UTC invariants mean this will be in range
                    dateTime.value = dateTime.value.Subtract(offset.value);
                }
                else if (dateTime.value.Kind === DateTimeKind.Local) {
                    DateTimeFormat.InvalidFormatForLocal(format, dateTime.value);
                }
                dtfi.value = DateTimeFormatInfo.InvariantInfo;
                break;
            case 's':       // Sortable without Time Zone Info
                dtfi.value = DateTimeFormatInfo.InvariantInfo;
                break;
            case 'u':       // Universal time in sortable format.
                if (!offset.value.Equals(DateTimeFormat.NullOffset)) {
                    // Convert to UTC invariants mean this will be in range
                    dateTime.value = dateTime.value.Subtract(offset.value);
                }
                else if (dateTime.value.Kind === DateTimeKind.Local) {

                    DateTimeFormat.InvalidFormatForLocal(format, dateTime.value);
                }
                dtfi.value = DateTimeFormatInfo.InvariantInfo;
                break;
            case 'U':       // Universal time in culture dependent format.
                if (!offset.value.Equals(DateTimeFormat.NullOffset)) {
                    // This format is not supported by DateTimeOffset
                    throw new FormatException(Environment.GetResourceString("Format_InvalidString"));
                }
                // Universal time is always in Greogrian calendar.
                //
                // Change the Calendar to be Gregorian Calendar.
                //
                dtfi.value = dtfi.value.Clone();
                if (dtfi.value.Calendar.GetType() !== type(System.Types.Globalization.GregorianCalendar)) {
                    const GregorianCalendar = Context.Current.get('GregorianCalendar'); //for deps
                    dtfi.value.Calendar = GregorianCalendar.GetDefaultInstance();
                }
                dateTime.value = dateTime.value.ToUniversalTime();
                break;
        }
        format = DateTimeFormat.GetRealFormat(format, dtfi.value);
        return (format);
    }

    public /* internal */ static Format(dateTime: DateTime, format: string, dtfi: DateTimeFormatInfo): string;
    public /* internal */ static Format(dateTime: DateTime, format: string, dtfi: DateTimeFormatInfo, offset: TimeSpan): string;
    public /* internal */ static Format(...args: any[]): string {
        if (args.length === 3) {
            const dateTime: DateTime = args[0];
            const format: string = args[1];
            const dtfi: DateTimeFormatInfo = args[2];
            return DateTimeFormat.Format(dateTime, format, dtfi, DateTimeFormat.NullOffset);
        } else if (args.length === 4) {
            let dateTime: DateTime = args[0];
            const _dateTime: Out<DateTime> = New.Out(args[0]);
            let format: string = args[1];
            let dtfi: DateTimeFormatInfo = args[2];
            const _dtfi: Out<DateTimeFormatInfo> = New.Out(args[2]);
            let offset: TimeSpan = args[3];
            const _offset: Out<TimeSpan> = New.Out(args[3]);
            //Contract.Requires(dtfi != null);
            if (format == null || format.length === 0) {
                let timeOnlySpecialCase: boolean = false;
                if (dateTime.Ticks.lessThan(Convert.ToLong(10000).mul(1000).mul(60).mul(60).mul(24))/*  < Calendar.TicksPerDay */) {
                    // If the time is less than 1 day, consider it as time of day.
                    // Just print out the short time format.
                    //
                    // This is a workaround for VB, since they use ticks less then one day to be
                    // time of day.  In cultures which use calendar other than Gregorian calendar, these
                    // alternative calendar may not support ticks less than a day.
                    // For example, Japanese calendar only supports date after 1868/9/8.
                    // This will pose a problem when people in VB get the time of day, and use it
                    // to call ToString(), which will use the general format (short date + long time).
                    // Since Japanese calendar does not support Gregorian year 0001, an exception will be
                    // thrown when we try to get the Japanese year for Gregorian year 0001.
                    // Therefore, the workaround allows them to call ToString() for time of day from a DateTime by
                    // formatting as ISO 8601 format.
                    switch (dtfi.Calendar.ID) {
                        case 3/* Calendar.CAL_JAPAN */:
                        case 4/* Calendar.CAL_TAIWAN */:
                        case 6/* Calendar.CAL_HIJRI */:
                        case 8/* Calendar.CAL_HEBREW */:
                        case 13/* Calendar.CAL_JULIAN */:
                        case 23/* Calendar.CAL_UMALQURA */:
                        case 22/* Calendar.CAL_PERSIAN */:
                            timeOnlySpecialCase = true;
                            dtfi = DateTimeFormatInfo.InvariantInfo;
                            break;
                    }
                }
                if (offset.Equals(DateTimeFormat.NullOffset)) {
                    // Default DateTime.ToString case.
                    if (timeOnlySpecialCase) {
                        format = "s";
                    }
                    else {
                        format = "G";
                    }
                }
                else {
                    // Default DateTimeOffset.ToString case.
                    if (timeOnlySpecialCase) {
                        format = DateTimeFormat.RoundtripDateTimeUnfixed;
                    }
                    else {
                        format = dtfi.DateTimeOffsetPattern;
                    }
                }
            }

            if (format.length === 1) {
                _dateTime.value = dateTime;
                _dtfi.value = dtfi;
                _offset.value = offset;
                format = DateTimeFormat.ExpandPredefinedFormat(format, _dateTime, _dtfi, _offset);
                dateTime = _dateTime.value;
                dtfi = _dtfi.value;
                offset = _offset.value;
            }

            return (DateTimeFormat.FormatCustomized(dateTime, format, dtfi, offset));
        }
        throw new ArgumentOutOfRangeException('');
    }

    public /* internal */ static GetAllDateTimes(dateTime: DateTime, dtfi: DateTimeFormatInfo): string[];
    public /* internal */ static GetAllDateTimes(dateTime: DateTime, format: char, dtfi: DateTimeFormatInfo): string[];
    public /* internal */ static GetAllDateTimes(...args: any[]): string[] {
        if (args.length === 2) {
            const dateTime: DateTime = args[0];
            const dtfi: DateTimeFormatInfo = args[1];
            const results: List<string> = new List<string>(DateTimeFormat.DEFAULT_ALL_DATETIMES_SIZE);

            for (let i: int = 0; i < DateTimeFormat.allStandardFormats.length; i++) {
                const strings: string[] = DateTimeFormat.GetAllDateTimes(dateTime, DateTimeFormat.allStandardFormats[i], dtfi);
                for (let j: int = 0; j < strings.length; j++) {
                    results.Add(strings[j]);
                }
            }
            const value: string[] = new Array(results.Count);
            results.CopyTo(0, value, 0, results.Count);
            return value;
        } else if (args.length === 3) {
            const dateTime: DateTime = args[0];
            const format: char = args[1];
            const dtfi: DateTimeFormatInfo = args[2];
            //Contract.Requires(dtfi != null);
            let allFormats: string[] = null as any;
            let results: string[] = null as any;

            switch (format) {
                case 'd'.charCodeAt(0):
                case 'D'.charCodeAt(0):
                case 'f'.charCodeAt(0):
                case 'F'.charCodeAt(0):
                case 'g'.charCodeAt(0):
                case 'G'.charCodeAt(0):
                case 'm'.charCodeAt(0):
                case 'M'.charCodeAt(0):
                case 't'.charCodeAt(0):
                case 'T'.charCodeAt(0):
                case 'y'.charCodeAt(0):
                case 'Y'.charCodeAt(0):
                    allFormats = dtfi.GetAllDateTimePatterns(format);
                    results = new Array(allFormats.length);
                    for (let i: int = 0; i < allFormats.length; i++) {
                        results[i] = DateTimeFormat.Format(dateTime, allFormats[i], dtfi);
                    }
                    break;
                case 'U'.charCodeAt(0):
                    const universalTime: DateTime = dateTime.ToUniversalTime();
                    allFormats = dtfi.GetAllDateTimePatterns(format);
                    results = new Array(allFormats.length);
                    for (let i: int = 0; i < allFormats.length; i++) {
                        results[i] = DateTimeFormat.Format(universalTime, allFormats[i], dtfi);
                    }
                    break;
                //
                // The following ones are special cases because these patterns are read-only in
                // DateTimeFormatInfo.
                //
                case 'r'.charCodeAt(0):
                case 'R'.charCodeAt(0):
                case 'o'.charCodeAt(0):
                case 'O'.charCodeAt(0):
                case 's'.charCodeAt(0):
                case 'u'.charCodeAt(0):
                    results = [DateTimeFormat.Format(dateTime, String.fromCharCode(format), dtfi)];
                    break;
                default:
                    throw new FormatException(Environment.GetResourceString("Format_InvalidString"));

            }
            return results;
        }
        throw new ArgumentOutOfRangeException('');
    }

    // This is a placeholder for an MDA to detect when the user is using a
    // local DateTime with a format that will be interpreted as UTC.
    /* internal */ static InvalidFormatForLocal(format: string, dateTime: DateTime): void {
    }

    // This is an MDA for cases when the user is using a local format with
    // a Utc DateTime.
    public /* internal */ static InvalidFormatForUtc(format: string, dateTime: DateTime): void {
    }
}