import { ParseNumbers } from "../ParseNumbers";
import { char, int, long } from "../float";
import { TString } from "../Text/TString";
import { DateTimeFormat } from "./DateTimeFormat";
import { StringBuilder } from "../Text/StringBuilder";
import { StringBuilderCache } from "../Text/StringBuilderCache";
import { TimeSpan } from "../Timespan";
import { IFormatProvider } from "../IFormatProvider";
import { FormatException } from "../Extensions/FormatException";
import { Environment } from "../Environment";
import { Convert } from "../convert";
import { CultureInfo, DateTimeFormatInfo } from "./CultureInfo";
import { Exception } from "../Exception";

export enum Pattern {
    None = 0,
    Minimum = 1,
    Full = 2,
}

export class FormatLiterals {
    public /* internal */ get Start(): string {
        return this.literals[0];
    }

    public /* internal */ get DayHourSep(): string {
        return this.literals[1];
    }

    public /* internal */  get HourMinuteSep(): string {
        return this.literals[2];
    }
    public /* internal */ get MinuteSecondSep(): string {
        return this.literals[3];
    }
    public /* internal */  get SecondFractionSep(): string {
        return this.literals[4];
    }
    public /* internal */ get End(): string {
        return this.literals[5];
    }
    public /* internal */  AppCompatLiteral: string = '';
    public /* internal */  dd: int = 0;
    public /* internal */  hh: int = 0;
    public /* internal */  mm: int = 0;
    public /* internal */  ss: int = 0;
    public /* internal */  ff: int = 0;

    private literals: string[] = null as any;


    /* factory method for static invariant FormatLiterals */
    public /* internal */ static InitInvariant(isNegative: boolean): FormatLiterals {
        const x: FormatLiterals = new FormatLiterals();
        x.literals = new Array(6);
        x.literals[0] = isNegative ? "-" : TString.Empty;
        x.literals[1] = ".";
        x.literals[2] = ":";
        x.literals[3] = ":";
        x.literals[4] = ".";
        x.literals[5] = TString.Empty;
        x.AppCompatLiteral = ":."; // MinuteSecondSep+SecondFractionSep;
        x.dd = 2;
        x.hh = 2;
        x.mm = 2;
        x.ss = 2;
        x.ff = DateTimeFormat.MaxSecondsFractionDigits;
        return x;
    }

    // For the "v1" TimeSpan localized patterns, the data is simply literal field separators with
    // the constants guaranteed to include DHMSF ordered greatest to least significant.
    // Once the data becomes more complex than this we will need to write a proper tokenizer for
    // parsing and formatting
    public /* internal */  Init(format: string, useInvariantFieldLengths: boolean): void {
        this.literals = new Array(6);
        for (let i: int = 0; i < this.literals.length; i++) {
            this.literals[i] = TString.Empty;
        }
        this.dd = 0;
        this.hh = 0;
        this.mm = 0;
        this.ss = 0;
        this.ff = 0;

        const sb: StringBuilder = StringBuilderCache.Acquire();
        let inQuote: boolean = false;
        let quote: char = '\''.charCodeAt(0);
        let field: int = 0;

        for (let i: int = 0; i < format.length; i++) {
            switch (format[i]) {
                case '\'':
                case '\"':
                    if (inQuote && (quote === format[i].charCodeAt(0))) {
                        /* we were in a quote and found a matching exit quote, so we are outside a quote now */
                        //Contract.Assert(field >= 0 && field <= 5, "field >= 0 && field <= 5");
                        if (field >= 0 && field <= 5) {
                            this.literals[field] = sb.ToString();
                            sb.Length = 0;
                            inQuote = false;
                        }
                        else {
                            return; // how did we get here?
                        }
                    }
                    else if (!inQuote) {
                        /* we are at the start of a new quote block */
                        quote = format[i].charCodeAt(0);
                        inQuote = true;
                    }
                    else {
                        /* we were in a quote and saw the other type of quote character, so we are still in a quote */
                    }
                    break;
                case '%':
                    //Contract.Assert(false, "Unexpected special token '%', Bug in DateTimeFormatInfo.FullTimeSpan[Positive|Negative]Pattern");
                    sb.Append(format[i]);
                case '\\':
                    if (!inQuote) {
                        i++; /* skip next character that is escaped by this backslash or percent sign */
                        break;
                    }
                    sb.Append(format[i]);
                case 'd':
                    if (!inQuote) {
                        //Contract.Assert((field == 0 && sb.Length == 0) || field == 1,
                        //    "field == 0 || field == 1, Bug in DateTimeFormatInfo.FullTimeSpan[Positive|Negative]Pattern");
                        field = 1; // DayHourSep
                        this.dd++;
                    }
                    break;
                case 'h':
                    if (!inQuote) {
                        //Contract.Assert((field == 1 && sb.Length == 0) || field == 2,
                        //    "field == 1 || field == 2, Bug in DateTimeFormatInfo.FullTimeSpan[Positive|Negative]Pattern");
                        field = 2; // HourMinuteSep
                        this.hh++;
                    }
                    break;
                case 'm':
                    if (!inQuote) {
                        // Contract.Assert((field == 2 && sb.Length == 0) || field == 3,
                        //"field == 2 || field == 3, Bug in DateTimeFormatInfo.FullTimeSpan[Positive|Negative]Pattern");
                        field = 3; // MinuteSecondSep
                        this.mm++;
                    }
                    break;
                case 's':
                    if (!inQuote) {
                        // Contract.Assert((field == 3 && sb.Length == 0) || field == 4,
                        //     "field == 3 || field == 4, Bug in DateTimeFormatInfo.FullTimeSpan[Positive|Negative]Pattern");
                        field = 4; // SecondFractionSep
                        this.ss++;
                    }
                    break;
                case 'f':
                case 'F':
                    if (!inQuote) {
                        //Contract.Assert((field == 4 && sb.Length == 0) || field == 5,
                        //    "field == 4 || field == 5, Bug in DateTimeFormatInfo.FullTimeSpan[Positive|Negative]Pattern");
                        field = 5; // End
                        this.ff++;
                    }
                    break;
                default:
                    sb.Append(format[i]);
                    break;
            }
        }

        //Contract.Assert(field == 5);
        this.AppCompatLiteral = this.MinuteSecondSep + this.SecondFractionSep;

        // Contract.Assert(0 < dd && dd < 3, "0 < dd && dd < 3, Bug in System.Globalization.DateTimeFormatInfo.FullTimeSpan[Positive|Negative]Pattern");
        // Contract.Assert(0 < hh && hh < 3, "0 < hh && hh < 3, Bug in System.Globalization.DateTimeFormatInfo.FullTimeSpan[Positive|Negative]Pattern");
        // Contract.Assert(0 < mm && mm < 3, "0 < mm && mm < 3, Bug in System.Globalization.DateTimeFormatInfo.FullTimeSpan[Positive|Negative]Pattern");
        // Contract.Assert(0 < ss && ss < 3, "0 < ss && ss < 3, Bug in System.Globalization.DateTimeFormatInfo.FullTimeSpan[Positive|Negative]Pattern");
        // Contract.Assert(0 < ff && ff < 8, "0 < ff && ff < 8, Bug in System.Globalization.DateTimeFormatInfo.FullTimeSpan[Positive|Negative]Pattern");

        if (useInvariantFieldLengths) {
            this.dd = 2;
            this.hh = 2;
            this.mm = 2;
            this.ss = 2;
            this.ff = DateTimeFormat.MaxSecondsFractionDigits;
        }
        else {
            if (this.dd < 1 || this.dd > 2) this.dd = 2;   // The DTFI property has a problem. let's try to make the best of the situation.
            if (this.hh < 1 || this.hh > 2) this.hh = 2;
            if (this.mm < 1 || this.mm > 2) this.mm = 2;
            if (this.ss < 1 || this.ss > 2) this.ss = 2;
            if (this.ff < 1 || this.ff > 7) this.ff = 7;
        }
        StringBuilderCache.Release(sb);
    }
} //end of struct FormatLiterals

export class TimeSpanFormat {
    private static IntToString(n: int, digits: int): string {
        return ParseNumbers.IntToString(n, 10, digits, '0'.charCodeAt(0), 0);
    }

    public /* internal */ static readonly PositiveInvariantFormatLiterals: FormatLiterals = FormatLiterals.InitInvariant(false /*isNegative*/);
    public /* internal */ static readonly NegativeInvariantFormatLiterals: FormatLiterals = FormatLiterals.InitInvariant(true  /*isNegative*/);

    //
    //  Format
    //
    //  Actions: Main method called from TimeSpan.ToString
    //
    public /* internal */ static Format(value: TimeSpan, format: string, formatProvider: IFormatProvider): string {
        if (format == null || format.length === 0) {
            format = "c";
        }

        // standard formats
        if (format.length === 1) {
            const f: char = format[0].charCodeAt(0);

            if (f === 'c'.charCodeAt(0) || f === 't'.charCodeAt(0) || f === 'T'.charCodeAt(0))
                return TimeSpanFormat.FormatStandard(value, true, format, Pattern.Minimum);

            if (f === 'g'.charCodeAt(0) || f === 'G'.charCodeAt(0)) {
                let pattern: Pattern;
                const dtfi: DateTimeFormatInfo = DateTimeFormatInfo.GetInstance(formatProvider);

                if ((value as any)._ticks < 0)
                    format = dtfi.FullTimeSpanNegativePattern;
                else
                    format = dtfi.FullTimeSpanPositivePattern;
                if (f === 'g'.charCodeAt(0))
                    pattern = Pattern.Minimum;
                else
                    pattern = Pattern.Full;

                return TimeSpanFormat.FormatStandard(value, false, format, pattern);
            }
            throw new FormatException(Environment.GetResourceString("Format_InvalidString"));
        }

        return (TimeSpanFormat as any).FormatCustomized(value, format, DateTimeFormatInfo.GetInstance(formatProvider));
    }

    //
    //  FormatStandard
    //
    //  Actions: Format the TimeSpan instance using the specified format.
    //
    private static FormatStandard(value: TimeSpan, isInvariant: boolean, format: string, pattern: Pattern): string {
        const sb: StringBuilder = StringBuilderCache.Acquire();
        let day: int = Convert.ToInt32((value as any)._ticks.div(TimeSpan.TicksPerDay));
        let time: long = (value as any)._ticks.mod(TimeSpan.TicksPerDay);

        if ((value as any)._ticks < 0) {
            day = -day;
            time = time.neg();
        }
        const hours: int = Convert.ToInt32(time.div(TimeSpan.TicksPerHour).mod(24));
        const minutes: int = Convert.ToInt32(time.div(TimeSpan.TicksPerMinute).mod(60));
        const seconds: int = Convert.ToInt32(time.div(TimeSpan.TicksPerSecond).mod(60));
        let fraction: int = Convert.ToInt32(time.mod(TimeSpan.TicksPerSecond));

        let literal: FormatLiterals;
        if (isInvariant) {
            if ((value as any)._ticks.lessThan(0))
                literal = TimeSpanFormat.NegativeInvariantFormatLiterals;
            else
                literal = TimeSpanFormat.PositiveInvariantFormatLiterals;
        }
        else {
            literal = new FormatLiterals();
            literal.Init(format, pattern === Pattern.Full);
        }
        if (fraction !== 0) { // truncate the partial second to the specified length
            fraction = Convert.ToInt32(Convert.ToLong(fraction).div(Convert.ToLong(Math.pow(10, DateTimeFormat.MaxSecondsFractionDigits - literal.ff))));
        }

        // Pattern.Full: [-]dd.hh:mm:ss.fffffff
        // Pattern.Minimum: [-][d.]hh:mm:ss[.fffffff]

        sb.Append(literal.Start);                           // [-]
        if (pattern == Pattern.Full || day !== 0) {          //
            sb.AppendInt(day);                                 // [dd]
            sb.Append(literal.DayHourSep);                  // [.]
        }                                                   //
        sb.Append(TimeSpanFormat.IntToString(hours, literal.hh));          // hh
        sb.Append(literal.HourMinuteSep);                   // :
        sb.Append(TimeSpanFormat.IntToString(minutes, literal.mm));        // mm
        sb.Append(literal.MinuteSecondSep);                 // :
        sb.Append(TimeSpanFormat.IntToString(seconds, literal.ss));        // ss
        if (!isInvariant && pattern === Pattern.Minimum) {
            let effectiveDigits: int = literal.ff;
            while (effectiveDigits > 0) {
                if (fraction % 10 === 0) {
                    fraction = fraction / 10;
                    effectiveDigits--;
                }
                else {
                    break;
                }
            }
            if (effectiveDigits > 0) {
                sb.Append(literal.SecondFractionSep);           // [.FFFFFFF]
                throw new Exception('düzelt');
                sb.Append((fraction).toString(/* DateTimeFormat.fixedNumberFormats[effectiveDigits - 1] *//* , CultureInfo.InvariantCulture */));
            }
        }
        else if (pattern == Pattern.Full || fraction != 0) {
            sb.Append(literal.SecondFractionSep);           // [.]
            sb.Append(TimeSpanFormat.IntToString(fraction, literal.ff));   // [fffffff]
        }                                                   //
        sb.Append(literal.End);                             //

        return StringBuilderCache.GetStringAndRelease(sb);
    }

    //
    //  FormatCustomized
    //
    //  Actions: Format the TimeSpan instance using the specified format.
    //
    public /* internal */ static FormatCustomized(value: string, format: string, dtfi: DateTimeFormatInfo): string {

        // Contract.Assert(dtfi != null, "dtfi == null");

        let day: int = Convert.ToInt32((value as any)._ticks.div(TimeSpan.TicksPerDay));
        let time: long = (value as any)._ticks.mod(TimeSpan.TicksPerDay);

        if ((value as any)._ticks < 0) {
            day = -day;
            time = time.neg();
        }
        let hours: int = Convert.ToInt32(time.div(TimeSpan.TicksPerHour).mod(24));
        let minutes: int = Convert.ToInt32(time.div(TimeSpan.TicksPerMinute).mod(60));
        let seconds: int = Convert.ToInt32(time.div(TimeSpan.TicksPerSecond).mod(60));
        let fraction: int = Convert.ToInt32(time.mod(TimeSpan.TicksPerSecond));

        let tmp: long = Convert.ToLong(0);
        let i: int = 0;
        let tokenLen: int;
        const result: StringBuilder = StringBuilderCache.Acquire();

        while (i < format.length) {
            const ch: char = format[i].charCodeAt(0);
            let nextChar: int;
            switch (ch) {
                case 'h'.charCodeAt(0):
                    tokenLen = DateTimeFormat.ParseRepeatPattern(format, i, ch);
                    if (tokenLen > 2)
                        throw new FormatException(Environment.GetResourceString("Format_InvalidString"));
                    DateTimeFormat.FormatDigits(result, hours, tokenLen);
                    break;
                case 'm'.charCodeAt(0):
                    tokenLen = DateTimeFormat.ParseRepeatPattern(format, i, ch);
                    if (tokenLen > 2)
                        throw new FormatException(Environment.GetResourceString("Format_InvalidString"));
                    DateTimeFormat.FormatDigits(result, minutes, tokenLen);
                    break;
                case 's'.charCodeAt(0):
                    tokenLen = DateTimeFormat.ParseRepeatPattern(format, i, ch);
                    if (tokenLen > 2)
                        throw new FormatException(Environment.GetResourceString("Format_InvalidString"));
                    DateTimeFormat.FormatDigits(result, seconds, tokenLen);
                    break;
                case 'f'.charCodeAt(0):
                    //
                    // The fraction of a second in single-digit precision. The remaining digits are truncated.
                    //
                    tokenLen = DateTimeFormat.ParseRepeatPattern(format, i, ch);
                    if (tokenLen > DateTimeFormat.MaxSecondsFractionDigits)
                        throw new FormatException(Environment.GetResourceString("Format_InvalidString"));

                    tmp = Convert.ToLong(fraction);
                    tmp = tmp.div(Convert.ToLong(Math.pow(10, DateTimeFormat.MaxSecondsFractionDigits - tokenLen)));
                    result.Append(tmp.toString(DateTimeFormat.fixedNumberFormats[tokenLen - 1], CultureInfo.InvariantCulture));
                    break;
                case 'F'.charCodeAt(0):
                    //
                    // Displays the most significant digit of the seconds fraction. Nothing is displayed if the digit is zero.
                    //
                    tokenLen = DateTimeFormat.ParseRepeatPattern(format, i, ch);
                    if (tokenLen > DateTimeFormat.MaxSecondsFractionDigits)
                        throw new FormatException(Environment.GetResourceString("Format_InvalidString"));

                    tmp = Convert.ToLong(fraction);
                    tmp = tmp.div(Convert.ToLong(Math.pow(10, DateTimeFormat.MaxSecondsFractionDigits - tokenLen)));
                    let effectiveDigits: int = tokenLen;
                    while (effectiveDigits > 0) {
                        if (tmp.mod(10).equals(Convert.ToLong(0))) {
                            tmp = tmp.div(10);
                            effectiveDigits--;
                        }
                        else {
                            break;
                        }
                    }
                    if (effectiveDigits > 0) {
                        result.Append(tmp.toString(DateTimeFormat.fixedNumberFormats[effectiveDigits - 1], CultureInfo.InvariantCulture));
                    }
                    break;
                case 'd'.charCodeAt(0):
                    //
                    // tokenLen == 1 : Day as digits with no leading zero.
                    // tokenLen == 2+: Day as digits with leading zero for single-digit days.
                    //
                    tokenLen = DateTimeFormat.ParseRepeatPattern(format, i, ch);
                    if (tokenLen > 8)
                        throw new FormatException(Environment.GetResourceString("Format_InvalidString"));
                    DateTimeFormat.FormatDigits(result, day, tokenLen, true);
                    break;
                case '\''.charCodeAt(0):
                case '\"'.charCodeAt(0):
                    const enquotedString: StringBuilder = new StringBuilder();
                    tokenLen = DateTimeFormat.ParseQuoteString(format, i, enquotedString);
                    result.Append(enquotedString.ToString());
                    break;
                case '%'.charCodeAt(0):
                    // Optional format character.
                    // For example, format string "%d" will print day
                    // Most of the cases, "%" can be ignored.
                    nextChar = DateTimeFormat.ParseNextChar(format, i);
                    // nextChar will be -1 if we already reach the end of the format string.
                    // Besides, we will not allow "%%" appear in the pattern.
                    if (nextChar >= 0 && nextChar != Convert.ToInt32('%'.charCodeAt(0))) {
                        result.Append(TimeSpanFormat.FormatCustomized(value, Convert.ToChar(nextChar).toString(), dtfi));
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
                    // For example, "\d" will insert the character 'd' into the string.
                    //
                    nextChar = DateTimeFormat.ParseNextChar(format, i);
                    if (nextChar >= 0) {
                        result.Append(Convert.ToChar(nextChar).toString());
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
                    throw new FormatException(Environment.GetResourceString("Format_InvalidString"));
            }
            i += tokenLen;
        }
        return StringBuilderCache.GetStringAndRelease(result);
    }
}

