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
* Tuval Framework Created By Selim TAN in 2020                                                                                  *
******************************************************************************************************************************@*/

////////////////////////////////////////////////////////////////////////////
//
//  Class:    TimeSpan Parse
//
//  Purpose:  This class is called by TimeSpan to parse a time interval string.
//
//  Standard Format:
//  -=-=-=-=-=-=-=-
//  "c":  Constant format.  [-][d'.']hh':'mm':'ss['.'fffffff]
//  Not culture sensitive.  Default format (and null/empty format string) map to this format.
//
//  "g":  General format, short:  [-][d':']h':'mm':'ss'.'FFFFFFF
//  Only print what's needed.  Localized (if you want Invariant, pass in Invariant).
//  The fractional seconds separator is localized, equal to the culture's DecimalSeparator.
//
//  "G":  General format, long:  [-]d':'hh':'mm':'ss'.'fffffff
//  Always print days and 7 fractional digits.  Localized (if you want Invariant, pass in Invariant).
//  The fractional seconds separator is localized, equal to the culture's DecimalSeparator.
//
//
//  * "TryParseTimeSpan" is the main method for Parse/TryParse
//
//  - TimeSpanTokenizer.GetNextToken() is used to split the input string into number and literal tokens.
//  - TimeSpanRawInfo.ProcessToken() adds the next token into the parsing intermediary state structure
//  - ProcessTerminalState() uses the fully initialized TimeSpanRawInfo to find a legal parse match.
//    The terminal states are attempted as follows:
//    foreach (+InvariantPattern, -InvariantPattern, +LocalizedPattern, -LocalizedPattern) try
//       1 number  => d
//       2 numbers => h:m
//       3 numbers => h:m:s     | d.h:m   | h:m:.f
//       4 numbers => h:m:s.f   | d.h:m:s | d.h:m:.f
//       5 numbers => d.h:m:s.f
//
// Custom Format:
// -=-=-=-=-=-=-=
//
// * "TryParseExactTimeSpan" is the main method for ParseExact/TryParseExact methods
// * "TryParseExactMultipleTimeSpan" is the main method for ParseExact/TryparseExact
//    methods that take a String[] of formats
//
// - For single-letter formats "TryParseTimeSpan" is called (see above)
// - For multi-letter formats "TryParseByFormat" is called
// - TryParseByFormat uses helper methods (ParseExactLiteral, ParseExactDigits, etc)
//   which drive the underlying TimeSpanTokenizer.  However, unlike standard formatting which
//   operates on whole-tokens, ParseExact operates at the character-level.  As such,
//   TimeSpanTokenizer.NextChar and TimeSpanTokenizer.BackOne() are called directly.
//
////////////////////////////////////////////////////////////////////////////

import { Convert } from "../convert";
import { TimeSpan } from "../Timespan";
//import { FormatLiterals, TimeSpanFormat } from "./TimeSpanFormat";
import { Exception } from '../Exception';
import { FormatException } from "../Extensions/FormatException";
import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { OverflowException } from "../Extensions/OverflowException";
import { char, int, Int64, long, New } from '../float';
import { is } from "../is";
import { Internal } from "../Reflection/Decorators/ClassInfo";
import { TString } from "../Text/TString";
import { Environment } from "../Environment";
import { ArgumentException } from "../Exceptions/ArgumentException";
import { Out } from "../Out";
import { IFormatProvider } from "../IFormatProvider";
import { DateTimeFormat } from "./DateTimeFormat";
import { StringBuilder } from "../Text/StringBuilder";
import { DateTimeParse } from "./Datetimeparse";
import { DateTimeFormatInfo } from "./CultureInfo";

type FormatLiterals = any;
declare var TimeSpanFormat;
export enum TimeSpanStyles {
    None = 0x00000000,
    AssumeNegative = 0x00000001,
}

enum TimeSpanThrowStyle {
    None = 0,
    All = 1,
}

enum ParseFailureKind {
    None = 0,
    ArgumentNull = 1,
    Format = 2,
    FormatWithParameter = 3,
    Overflow = 4,
}

enum TimeSpanStandardStyles {     // Standard Format Styles
    None = 0x00000000,
    Invariant = 0x00000001, //Allow Invariant Culture
    Localized = 0x00000002, //Allow Localized Culture
    RequireFull = 0x00000004, //Require the input to be in DHMSF format
    Any = Invariant | Localized,
}



// TimeSpan Token Types
enum TTT {
    None = 0,    // None of the TimeSpanToken fields are set
    End = 1,    // '\0'
    Num = 2,    // Number
    Sep = 3,    // literal
    NumOverflow = 4,    // Number that overflowed
}

class TimeSpanToken {
    public /* internal */  ttt: TTT = TTT.None;
    public /* internal */  num: int = 0;           // Store the number that we are parsing (if any)
    public /* internal */  zeroes: int = 0;        // Store the number of leading zeroes (if any)
    public /* internal */  sep: string = '';        // Store the literal that we are parsing (if any)

    public constructor();
    public constructor(number: int);
    public constructor(leadingZeroes: int, number: int);
    public constructor(...args: any[]) {
        if (args.length === 0) {

        } else if (args.length === 1 && is.int(args[0])) {
            const number: int = args[0];
            this.ttt = TTT.Num;
            this.num = number;
            this.zeroes = 0;
            this.sep = null as any;
        } else if (args.length === 2 && is.int(args[0]) && is.int(args[1])) {
            const leadingZeroes: int = args[0];
            const number: int = args[1];
            this.ttt = TTT.Num;
            this.num = number;
            this.zeroes = leadingZeroes;
            this.sep = null as any;
        }
    }

    public IsInvalidNumber(maxValue: int, maxPrecision: int): boolean {
        /* Contract.Assert(this.ttt == TTT.Num);
        Contract.Assert(this.num > -1);
        Contract.Assert(maxValue > 0);
        Contract.Assert(maxPrecision === maxFractionDigits || maxPrecision == unlimitedDigits); */

        if (this.num > maxValue)
            return true;
        if (maxPrecision === /* unlimitedDigits */ -1)
            return false; // all validation past this point applies only to fields with precision limits
        if (this.zeroes > maxPrecision)
            return true;
        if (this.num === 0 || this.zeroes === 0)
            return false;

        // num > 0 && zeroes > 0 && num <= maxValue && zeroes <= maxPrecision
        return (this.num >= (Convert.ToLong(maxValue).div(Convert.ToLong(Math.pow(10, this.zeroes - 1)))).toNumber());
    }
}

//
//  TimeSpanTokenizer
//
//  Actions: TimeSpanTokenizer.GetNextToken() returns the next token in the input string.
//
class TimeSpanTokenizer {
    private m_pos: int = 0;
    private m_value: string = '';

    public /* internal */  Init(input: string): void;
    public /* internal */  Init(input: string, startPosition: int): void;
    public /* internal */  Init(...args: any[]): void {
        if (args.length === 1 && is.string(args[0])) {
            const input: string = args[0];
            this.Init(input, 0);
        } else if (args.length === 2 && is.string(args[0]) && is.int(args[1])) {
            const input: string = args[0];
            const startPosition: int = args[1];
            this.m_pos = startPosition;
            this.m_value = input;
        }
    }

    // used by the parsing routines that operate on standard-formats
    public /* internal */  GetNextToken(): TimeSpanToken {
        // Contract.Assert(m_pos > -1);

        const tok: TimeSpanToken = new TimeSpanToken();
        let ch: char = this.CurrentChar;

        if (ch === Convert.ToChar(0)) {
            tok.ttt = TTT.End;
            return tok;
        }

        if (ch >= '0'.charCodeAt(0) && ch <= '9'.charCodeAt(0)) {
            tok.ttt = TTT.Num;
            tok.num = 0;
            tok.zeroes = 0;
            do {
                if ((tok.num & 0xF0000000) !== 0) {
                    tok.ttt = TTT.NumOverflow;
                    return tok;
                }
                tok.num = tok.num * 10 + ch - '0'.charCodeAt(0);
                if (tok.num == 0) tok.zeroes++;
                if (tok.num < 0) {
                    tok.ttt = TTT.NumOverflow;
                    return tok;
                }
                ch = this.NextChar;
            } while (ch >= '0'.charCodeAt(0) && ch <= '9'.charCodeAt(0));
            return tok;
        }
        else {
            tok.ttt = TTT.Sep;
            let startIndex: int = this.m_pos;
            let length: int = 0;

            while (ch !== Convert.ToChar(0) && (ch < '0'.charCodeAt(0) || '9'.charCodeAt(0) < ch)) {
                ch = this.NextChar;
                length++;
            }
            tok.sep = this.m_value.substring(startIndex, length);
            return tok;
        }
    }

    public /* internal */  get EOL(): boolean {
        return this.m_pos >= (this.m_value.length - 1);
    }

    // BackOne, NextChar, CurrentChar - used by ParseExact (ParseByFormat) to operate
    // on custom-formats where exact character-by-character control is allowed
    public /* internal */  BackOne(): void {
        if (this.m_pos > 0) --this.m_pos;
    }

    public /* internal */ get NextChar(): char {
        this.m_pos++;
        return this.CurrentChar;
    }
    public /* internal */ get CurrentChar(): char {
        if (this.m_pos > -1 && this.m_pos < this.m_value.length) {
            return this.m_value[this.m_pos].charCodeAt(0);
        }
        else {
            return Convert.ToChar(0);
        }
    }
}

// This stores intermediary parsing state for the standard formats
class TimeSpanRawInfo {
    public /* internal */ get PositiveInvariant(): FormatLiterals {
        return TimeSpanFormat.PositiveInvariantFormatLiterals;
    }
    public /* internal */ get NegativeInvariant(): FormatLiterals {
        return TimeSpanFormat.NegativeInvariantFormatLiterals;
    }

    public /* internal */ get PositiveLocalized(): FormatLiterals {
        if (!this.m_posLocInit) {
            throw new Exception('düzelt');
           /*  this.m_posLoc = new FormatLiterals();
            this.m_posLoc.Init(this.m_fullPosPattern, false);
            this.m_posLocInit = true; */
        }
        return this.m_posLoc;
    }
    public /* internal */ get NegativeLocalized(): FormatLiterals {
        if (!this.m_negLocInit) {
            throw new Exception('düzelt');
           /*  this.m_negLoc = new FormatLiterals();
            this.m_negLoc.Init(this.m_fullNegPattern, false);
            this.m_negLocInit = true; */
        }
        return this.m_negLoc;
    }
    //<
    @Internal
    public FullAppCompatMatch(pattern: FormatLiterals): boolean {
        return this.SepCount === 5
            && this.NumCount === 4
            && pattern.Start === this.literals[0]
            && pattern.DayHourSep === this.literals[1]
            && pattern.HourMinuteSep === this.literals[2]
            && pattern.AppCompatLiteral === this.literals[3]
            && pattern.End === this.literals[4];
    }
    //<
    @Internal
    public PartialAppCompatMatch(pattern: FormatLiterals): boolean {
        return this.SepCount === 4
            && this.NumCount === 3
            && pattern.Start === this.literals[0]
            && pattern.HourMinuteSep === this.literals[1]
            && pattern.AppCompatLiteral === this.literals[2]
            && pattern.End === this.literals[3];
    }
    // DHMSF (all values matched)
    @Internal
    public FullMatch(pattern: FormatLiterals): boolean {
        return this.SepCount === TimeSpanRawInfo.MaxLiteralTokens
            && this.NumCount === TimeSpanRawInfo.MaxNumericTokens
            && pattern.Start === this.literals[0]
            && pattern.DayHourSep === this.literals[1]
            && pattern.HourMinuteSep === this.literals[2]
            && pattern.MinuteSecondSep === this.literals[3]
            && pattern.SecondFractionSep === this.literals[4]
            && pattern.End === this.literals[5];
    }
    // D (no hours, minutes, seconds, or fractions)
    @Internal
    public FullDMatch(pattern: FormatLiterals): boolean {
        return this.SepCount === 2
            && this.NumCount === 1
            && pattern.Start === this.literals[0]
            && pattern.End == this.literals[1];
    }
    // HM (no days, seconds, or fractions)
    @Internal
    public FullHMMatch(pattern: FormatLiterals): boolean {
        return this.SepCount === 3
            && this.NumCount === 2
            && pattern.Start === this.literals[0]
            && pattern.HourMinuteSep === this.literals[1]
            && pattern.End === this.literals[2];
    }
    // DHM (no seconds or fraction)
    @Internal
    public FullDHMMatch(pattern: FormatLiterals): boolean {
        return this.SepCount === 4
            && this.NumCount === 3
            && pattern.Start === this.literals[0]
            && pattern.DayHourSep === this.literals[1]
            && pattern.HourMinuteSep === this.literals[2]
            && pattern.End === this.literals[3];

    }
    // HMS (no days or fraction)
    @Internal
    public FullHMSMatch(pattern: FormatLiterals): boolean {
        return this.SepCount === 4
            && this.NumCount === 3
            && pattern.Start === this.literals[0]
            && pattern.HourMinuteSep === this.literals[1]
            && pattern.MinuteSecondSep === this.literals[2]
            && pattern.End === this.literals[3];
    }
    // DHMS (no fraction)
    @Internal
    public FullDHMSMatch(pattern: FormatLiterals): boolean {
        return this.SepCount === 5
            && this.NumCount === 4
            && pattern.Start === this.literals[0]
            && pattern.DayHourSep === this.literals[1]
            && pattern.HourMinuteSep === this.literals[2]
            && pattern.MinuteSecondSep === this.literals[3]
            && pattern.End === this.literals[4];
    }
    // HMSF (no days)
    @Internal
    public FullHMSFMatch(pattern: FormatLiterals): boolean {
        return this.SepCount === 5
            && this.NumCount === 4
            && pattern.Start === this.literals[0]
            && pattern.HourMinuteSep === this.literals[1]
            && pattern.MinuteSecondSep === this.literals[2]
            && pattern.SecondFractionSep === this.literals[3]
            && pattern.End === this.literals[4];
    }

    public /* internal */  lastSeenTTT: TTT = TTT.None;
    public /* internal */  tokenCount: int = 0;
    public /* internal */  SepCount: int = 0;
    public /* internal */  NumCount: int = 0;
    public /* internal */  literals: string[] = null as any;
    public /* internal */  numbers: TimeSpanToken[] = null as any;  // raw numbers

    private m_posLoc: FormatLiterals = null as any;
    private m_negLoc: FormatLiterals = null as any;
    private m_posLocInit: boolean = false;
    private m_negLocInit: boolean = false;
    private m_fullPosPattern: string = '';
    private m_fullNegPattern: string = '';

    private static readonly MaxTokens: int = 11;
    private static readonly MaxLiteralTokens: int = 6;
    private static readonly MaxNumericTokens: int = 5;

    @Internal
    public Init(dtfi: DateTimeFormatInfo): void {
        //Contract.Assert(dtfi != null);

        this.lastSeenTTT = TTT.None;
        this.tokenCount = 0;
        this.SepCount = 0;
        this.NumCount = 0;

        this.literals = new Array(TimeSpanRawInfo.MaxLiteralTokens);
        this.numbers = new Array(TimeSpanRawInfo.MaxNumericTokens);

        this.m_fullPosPattern = dtfi.FullTimeSpanPositivePattern;
        this.m_fullNegPattern = dtfi.FullTimeSpanNegativePattern;
        this.m_posLocInit = false;
        this.m_negLocInit = false;
    }

    @Internal
    public ProcessToken(tok: TimeSpanToken, result: TimeSpanResult): boolean {
        if (tok.ttt === TTT.NumOverflow) {
            result.SetFailure(ParseFailureKind.Overflow, "Overflow_TimeSpanElementTooLarge", null);
            return false;
        }
        if (tok.ttt !== TTT.Sep && tok.ttt !== TTT.Num) {
            // Some unknown token or a repeat token type in the input
            result.SetFailure(ParseFailureKind.Format, "Format_BadTimeSpan", null);
            return false;
        }

        switch (tok.ttt) {
            case TTT.Sep:
                if (!this.AddSep(tok.sep, result)) return false;
                break;
            case TTT.Num:
                if (this.tokenCount === 0) {
                    if (!this.AddSep(TString.Empty, result)) return false;
                }
                if (!this.AddNum(tok, result)) return false;
                break;
            default:
                break;
        }

        this.lastSeenTTT = tok.ttt;
        // Contract.Assert(tokenCount == (SepCount + NumCount), "tokenCount == (SepCount + NumCount)");
        return true;
    }

    private AddSep(sep: string, result: TimeSpanResult): boolean {
        if (this.SepCount >= TimeSpanRawInfo.MaxLiteralTokens || this.tokenCount >= TimeSpanRawInfo.MaxTokens) {
            result.SetFailure(ParseFailureKind.Format, "Format_BadTimeSpan", null);
            return false;
        }
        this.literals[this.SepCount++] = sep;
        this.tokenCount++;
        return true;
    }
    private AddNum(num: TimeSpanToken, result: TimeSpanResult): boolean {
        if (this.NumCount >= TimeSpanRawInfo.MaxNumericTokens || this.tokenCount >= TimeSpanRawInfo.MaxTokens) {
            result.SetFailure(ParseFailureKind.Format, "Format_BadTimeSpan", null);
            return false;
        }
        this.numbers[this.NumCount++] = num;
        this.tokenCount++;
        return true;
    }
}

class TimeSpanResult {
    public /* internal */  parsedTimeSpan: TimeSpan = null as any;
    public /* internal */  throwStyle: TimeSpanThrowStyle = TimeSpanThrowStyle.None;

    public /* internal */  m_failure: ParseFailureKind = ParseFailureKind.None;
    public /* internal */  m_failureMessageID: string = '';
    public /* internal */  m_failureMessageFormatArgument: any;
    public /* internal */  m_failureArgumentName: string = '';

    @Internal
    public Init(canThrow: TimeSpanThrowStyle): void {
        this.parsedTimeSpan = new TimeSpan();
        this.throwStyle = canThrow;
    }

    /* @Internal
        public  SetFailure( failure:ParseFailureKind,  failureMessageID:string):void {
            this.SetFailure(failure, failureMessageID, null, null);
        }


        public  SetFailure( failure:ParseFailureKind,  failureMessageID:string, failureMessageFormatArgument: boject):void {
            this.SetFailure(failure, failureMessageID, failureMessageFormatArgument, null);
        } */
    @Internal
    public SetFailure(failure: ParseFailureKind, failureMessageID: string, failureMessageFormatArgument: any = null, failureArgumentName: string = null as any): void {
        this.m_failure = failure;
        this.m_failureMessageID = failureMessageID;
        this.m_failureMessageFormatArgument = failureMessageFormatArgument;
        this.m_failureArgumentName = failureArgumentName;
        if (this.throwStyle !== TimeSpanThrowStyle.None) {
            throw this.GetTimeSpanParseException();
        }
    }

    @Internal
    public GetTimeSpanParseException(): Exception {
        switch (this.m_failure) {
            case ParseFailureKind.ArgumentNull:
                return new ArgumentNullException(this.m_failureArgumentName, Environment.GetResourceString(this.m_failureMessageID));

            case ParseFailureKind.FormatWithParameter:
                return new FormatException(Environment.GetResourceString(this.m_failureMessageID/* , this.m_failureMessageFormatArgument */));

            case ParseFailureKind.Format:
                return new FormatException(Environment.GetResourceString(this.m_failureMessageID));

            case ParseFailureKind.Overflow:
                return new OverflowException(Environment.GetResourceString(this.m_failureMessageID));

            default:
                //Contract.Assert(false, "Unknown TimeSpanParseFailure: " + m_failure);
                return new FormatException(Environment.GetResourceString("Format_InvalidString"));
        }
    }
}

export class TimeSpanParse {
    // ---- SECTION:  members for internal support ---------*
    public /* internal */ static ValidateStyles(style: TimeSpanStyles, parameterName: string): void {
        if (style !== TimeSpanStyles.None && style !== TimeSpanStyles.AssumeNegative)
            throw new ArgumentException(Environment.GetResourceString("Argument_InvalidTimeSpanStyles"), parameterName);
    }

    public /* internal */ static readonly unlimitedDigits: int = -1;
    public /* internal */ static readonly maxFractionDigits: int = 7;

    public /* internal */ static readonly maxDays: int = 10675199;
    public /* internal */ static readonly maxHours: int = 23;
    public /* internal */ static readonly maxMinutes: int = 59;
    public /* internal */ static readonly maxSeconds: int = 59;
    public /* internal */ static readonly maxFraction: int = 9999999;


    private static readonly zero: TimeSpanToken = new TimeSpanToken(0);


    // This will store the result of the parsing.  And it will eventually be used to construct a TimeSpan instance.


    private static TryTimeToTicks(positive: boolean, days: TimeSpanToken, hours: TimeSpanToken, minutes: TimeSpanToken, seconds: TimeSpanToken, fraction: TimeSpanToken, result: Out<long>): boolean {
        if (days.IsInvalidNumber(TimeSpanParse.maxDays, TimeSpanParse.unlimitedDigits)
            || hours.IsInvalidNumber(TimeSpanParse.maxHours, TimeSpanParse.unlimitedDigits)
            || minutes.IsInvalidNumber(TimeSpanParse.maxMinutes, TimeSpanParse.unlimitedDigits)
            || seconds.IsInvalidNumber(TimeSpanParse.maxSeconds, TimeSpanParse.unlimitedDigits)
            || fraction.IsInvalidNumber(TimeSpanParse.maxFraction, TimeSpanParse.maxFractionDigits)) {
            result.value = Convert.ToLong(0);
            return false;
        }

        const ticks: Int64 = (Convert.ToLong(days.num).mul(3600).mul(24).add(Convert.ToLong(hours.num).mul(3600).add(Convert.ToLong(minutes.num).mul(60).add(seconds.num)))).mul(1000);
        if (ticks.greaterThan(TimeSpan.MaxMilliSeconds) || ticks.lessThan(TimeSpan.MinMilliSeconds)) {
            result.value = Convert.ToLong(0);
            return false;
        }

        // Normalize the fraction component
        //
        // string representation => (zeroes,num) => resultant fraction ticks
        // ---------------------    ------------    ------------------------
        // ".9999999"            => (0,9999999)  => 9,999,999 ticks (same as constant maxFraction)
        // ".1"                  => (0,1)        => 1,000,000 ticks
        // ".01"                 => (1,1)        =>   100,000 ticks
        // ".001"                => (2,1)        =>    10,000 ticks
        let f: long = Convert.ToLong(fraction.num);
        if (f.notEquals(Convert.ToLong(0))) {
            let lowerLimit: long = TimeSpan.TicksPerTenthSecond;
            if (fraction.zeroes > 0) {
                const divisor: long = Convert.ToLong(Math.pow(10, fraction.zeroes));
                lowerLimit = lowerLimit.div(divisor);
            }
            while (f < lowerLimit) {
                f = f.mul(10);
            }
        }
        result.value = (ticks.mul(TimeSpan.TicksPerMillisecond)).add(f);
        if (positive && result.value.lessThan(0)) {
            result.value = Convert.ToLong(0);
            return false;
        }
        return true;
    }
    // ---- SECTION:  internal static methods called by System.TimeSpan ---------*
    //
    //  [Try]Parse, [Try]ParseExact, and [Try]ParseExactMultiple
    //
    //  Actions: Main methods called from TimeSpan.Parse
    //#region ParseMethods
    public /* internal */ static Parse(input: string, formatProvider: IFormatProvider): TimeSpan {
        const parseResult: TimeSpanResult = new TimeSpanResult();
        parseResult.Init(TimeSpanThrowStyle.All);

        if (TimeSpanParse.TryParseTimeSpan(input, TimeSpanStandardStyles.Any, formatProvider, parseResult)) {
            return parseResult.parsedTimeSpan;
        }
        else {
            throw parseResult.GetTimeSpanParseException();
        }
    }
    public /* internal */ static TryParse(input: string, formatProvider: IFormatProvider, result: Out<TimeSpan>): boolean {
        const parseResult: TimeSpanResult = new TimeSpanResult();
        parseResult.Init(TimeSpanThrowStyle.None);

        if (TimeSpanParse.TryParseTimeSpan(input, TimeSpanStandardStyles.Any, formatProvider, parseResult)) {
            result.value = parseResult.parsedTimeSpan;
            return true;
        }
        else {
            result.value = null as any;/* default(TimeSpan); */
            return false;
        }
    }
    public /* internal */ static ParseExact(input: string, format: string, formatProvider: IFormatProvider, styles: TimeSpanStyles): TimeSpan {
        const parseResult: TimeSpanResult = new TimeSpanResult();
        parseResult.Init(TimeSpanThrowStyle.All);

        if (TimeSpanParse.TryParseExactTimeSpan(input, format, formatProvider, styles, parseResult)) {
            return parseResult.parsedTimeSpan;
        }
        else {
            throw parseResult.GetTimeSpanParseException();
        }
    }
    public /* internal */ static TryParseExact(input: string, format: string, formatProvider: IFormatProvider, styles: TimeSpanStyles, result: Out<TimeSpan>): boolean {
        const parseResult: TimeSpanResult = new TimeSpanResult();
        parseResult.Init(TimeSpanThrowStyle.None);

        if (TimeSpanParse.TryParseExactTimeSpan(input, format, formatProvider, styles, parseResult)) {
            result.value = parseResult.parsedTimeSpan;
            return true;
        }
        else {
            result.value = null as any /* default (TimeSpan); */
            return false;
        }
    }
    public /* internal */ static ParseExactMultiple(input: string, formats: string[], formatProvider: IFormatProvider, styles: TimeSpanStyles): TimeSpan {
        const parseResult: TimeSpanResult = new TimeSpanResult();
        parseResult.Init(TimeSpanThrowStyle.All);

        if (TimeSpanParse.TryParseExactMultipleTimeSpan(input, formats, formatProvider, styles, parseResult)) {
            return parseResult.parsedTimeSpan;
        }
        else {
            throw parseResult.GetTimeSpanParseException();
        }
    }
    public /* internal */ static TryParseExactMultiple(input: string, formats: string[], formatProvider: IFormatProvider, styles: TimeSpanStyles, result: Out<TimeSpan>): boolean {
        const parseResult: TimeSpanResult = new TimeSpanResult();
        parseResult.Init(TimeSpanThrowStyle.None);

        if (TimeSpanParse.TryParseExactMultipleTimeSpan(input, formats, formatProvider, styles, parseResult)) {
            result.value = parseResult.parsedTimeSpan;
            return true;
        }
        else {
            result.value = null as any; /* default (TimeSpan); */
            return false;
        }
    }
    //#endregion


    // ---- SECTION:  private static methods that do the actual work ---------*
    //#region TryParseTimeSpan
    //
    //  TryParseTimeSpan
    //
    //  Actions: Common private Parse method called by both Parse and TryParse
    //
    private static TryParseTimeSpan(input: string, style: TimeSpanStandardStyles, formatProvider: IFormatProvider, result: TimeSpanResult): boolean {
        if (input == null) {
            result.SetFailure(ParseFailureKind.ArgumentNull, "ArgumentNull_String", null, "input");
            return false;
        }

        input = input.trim();
        if (input === TString.Empty) {
            result.SetFailure(ParseFailureKind.Format, "Format_BadTimeSpan");
            return false;
        }

        const tokenizer: TimeSpanTokenizer = new TimeSpanTokenizer();
        tokenizer.Init(input);

        const raw: TimeSpanRawInfo = new TimeSpanRawInfo();
        raw.Init(DateTimeFormatInfo.GetInstance(formatProvider));

        let tok: TimeSpanToken = tokenizer.GetNextToken();

        /* The following loop will break out when we reach the end of the str or
         * when we can determine that the input is invalid. */
        while (tok.ttt != TTT.End) {
            if (!raw.ProcessToken(tok, result)) {
                result.SetFailure(ParseFailureKind.Format, "Format_BadTimeSpan");
                return false;
            }
            tok = tokenizer.GetNextToken();
        }
        if (!tokenizer.EOL) {
            // embedded nulls in the input string
            result.SetFailure(ParseFailureKind.Format, "Format_BadTimeSpan");
            return false;
        }
        if (!TimeSpanParse.ProcessTerminalState(raw, style, result)) {
            result.SetFailure(ParseFailureKind.Format, "Format_BadTimeSpan");
            return false;
        }
        return true;
    }



    //
    //  ProcessTerminalState
    //
    //  Actions: Validate the terminal state of a standard format parse.
    //           Sets result.parsedTimeSpan on success.
    //
    // Calculates the resultant TimeSpan from the TimeSpanRawInfo
    //
    // try => +InvariantPattern, -InvariantPattern, +LocalizedPattern, -LocalizedPattern
    // 1) Verify Start matches
    // 2) Verify End matches
    // 3) 1 number  => d
    //    2 numbers => h:m
    //    3 numbers => h:m:s | d.h:m | h:m:.f
    //    4 numbers => h:m:s.f | d.h:m:s | d.h:m:.f
    //    5 numbers => d.h:m:s.f
    private static ProcessTerminalState(raw: TimeSpanRawInfo, style: TimeSpanStandardStyles, result: TimeSpanResult): boolean {
        if (raw.lastSeenTTT == TTT.Num) {
            const tok: TimeSpanToken = new TimeSpanToken();
            tok.ttt = TTT.Sep;
            tok.sep = String.Empty;
            if (!raw.ProcessToken(tok, result)) {
                result.SetFailure(ParseFailureKind.Format, "Format_BadTimeSpan");
                return false;
            }
        }

        switch (raw.NumCount) {
            case 1:
                return TimeSpanParse.ProcessTerminal_D(raw, style, result);
            case 2:
                return TimeSpanParse.ProcessTerminal_HM(raw, style, result);
            case 3:
                return TimeSpanParse.ProcessTerminal_HM_S_D(raw, style, result);
            case 4:
                return TimeSpanParse.ProcessTerminal_HMS_F_D(raw, style, result);
            case 5:
                return TimeSpanParse.ProcessTerminal_DHMSF(raw, style, result);
            default:
                result.SetFailure(ParseFailureKind.Format, "Format_BadTimeSpan");
                return false;
        }
    }

    //
    //  ProcessTerminal_DHMSF
    //
    //  Actions: Validate the 5-number "Days.Hours:Minutes:Seconds.Fraction" terminal case.
    //           Sets result.parsedTimeSpan on success.
    //
    private static ProcessTerminal_DHMSF(raw: TimeSpanRawInfo, style: TimeSpanStandardStyles, result: TimeSpanResult): boolean {
        if (raw.SepCount != 6 || raw.NumCount != 5) {
            result.SetFailure(ParseFailureKind.Format, "Format_BadTimeSpan");
            return false;
        }

        const inv: boolean = ((style & TimeSpanStandardStyles.Invariant) !== 0);
        const loc: boolean = ((style & TimeSpanStandardStyles.Localized) !== 0);

        let positive: boolean = false;
        let match: boolean = false;

        if (inv) {
            if (raw.FullMatch(raw.PositiveInvariant)) {
                match = true;
                positive = true;
            }
            if (!match && raw.FullMatch(raw.NegativeInvariant)) {
                match = true;
                positive = false;
            }
        }
        if (loc) {
            if (!match && raw.FullMatch(raw.PositiveLocalized)) {
                match = true;
                positive = true;
            }
            if (!match && raw.FullMatch(raw.NegativeLocalized)) {
                match = true;
                positive = false;
            }
        }
        let ticks: Out<long> = New.Out(Convert.ToLong(0));
        if (match) {
            if (!TimeSpanParse.TryTimeToTicks(positive, raw.numbers[0], raw.numbers[1], raw.numbers[2], raw.numbers[3], raw.numbers[4], ticks)) {
                result.SetFailure(ParseFailureKind.Overflow, "Overflow_TimeSpanElementTooLarge");
                return false;
            }
            if (!positive) {
                ticks.value = ticks.value.neg();
                if (ticks.value.greaterThan(0)) {
                    result.SetFailure(ParseFailureKind.Overflow, "Overflow_TimeSpanElementTooLarge");
                    return false;
                }
            }
            result.parsedTimeSpan._ticks = ticks.value;
            return true;
        }

        result.SetFailure(ParseFailureKind.Format, "Format_BadTimeSpan");
        return false;
    }

    //
    //  ProcessTerminal_HMS_F_D
    //
    //  Actions: Validate the ambiguous 4-number "Hours:Minutes:Seconds.Fraction", "Days.Hours:Minutes:Seconds", or "Days.Hours:Minutes:.Fraction" terminal case.
    //           Sets result.parsedTimeSpan on success.
    //
    private static ProcessTerminal_HMS_F_D(raw: TimeSpanRawInfo, style: TimeSpanStandardStyles, result: TimeSpanResult): boolean {
        if (raw.SepCount != 5 || raw.NumCount != 4 || (style & TimeSpanStandardStyles.RequireFull) != 0) {
            result.SetFailure(ParseFailureKind.Format, "Format_BadTimeSpan");
            return false;
        }

        let inv: boolean = ((style & TimeSpanStandardStyles.Invariant) !== 0);
        let loc: boolean = ((style & TimeSpanStandardStyles.Localized) !== 0);

        let ticks: Out<long> = New.Out(Convert.ToLong(0));
        let positive: boolean = false;
        let match: boolean = false;
        let overflow: boolean = false;

        if (inv) {
            if (raw.FullHMSFMatch(raw.PositiveInvariant)) {
                positive = true;
                match = TimeSpanParse.TryTimeToTicks(positive, TimeSpanParse.zero, raw.numbers[0], raw.numbers[1], raw.numbers[2], raw.numbers[3], ticks);
                overflow = overflow || !match;
            }
            if (!match && raw.FullDHMSMatch(raw.PositiveInvariant)) {
                positive = true;
                match = TimeSpanParse.TryTimeToTicks(positive, raw.numbers[0], raw.numbers[1], raw.numbers[2], raw.numbers[3], TimeSpanParse.zero, ticks);
                overflow = overflow || !match;
            }
            if (!match && raw.FullAppCompatMatch(raw.PositiveInvariant)) {
                positive = true;
                match = TimeSpanParse.TryTimeToTicks(positive, raw.numbers[0], raw.numbers[1], raw.numbers[2], TimeSpanParse.zero, raw.numbers[3], ticks);
                overflow = overflow || !match;
            }
            if (!match && raw.FullHMSFMatch(raw.NegativeInvariant)) {
                positive = false;
                match = TimeSpanParse.TryTimeToTicks(positive, TimeSpanParse.zero, raw.numbers[0], raw.numbers[1], raw.numbers[2], raw.numbers[3], ticks);
                overflow = overflow || !match;
            }
            if (!match && raw.FullDHMSMatch(raw.NegativeInvariant)) {
                positive = false;
                match = TimeSpanParse.TryTimeToTicks(positive, raw.numbers[0], raw.numbers[1], raw.numbers[2], raw.numbers[3], TimeSpanParse.zero, ticks);
                overflow = overflow || !match;
            }
            if (!match && raw.FullAppCompatMatch(raw.NegativeInvariant)) {
                positive = false;
                match = TimeSpanParse.TryTimeToTicks(positive, raw.numbers[0], raw.numbers[1], raw.numbers[2], TimeSpanParse.zero, raw.numbers[3], ticks);
                overflow = overflow || !match;
            }
        }
        if (loc) {
            if (!match && raw.FullHMSFMatch(raw.PositiveLocalized)) {
                positive = true;
                match = TimeSpanParse.TryTimeToTicks(positive, TimeSpanParse.zero, raw.numbers[0], raw.numbers[1], raw.numbers[2], raw.numbers[3], ticks);
                overflow = overflow || !match;
            }
            if (!match && raw.FullDHMSMatch(raw.PositiveLocalized)) {
                positive = true;
                match = TimeSpanParse.TryTimeToTicks(positive, raw.numbers[0], raw.numbers[1], raw.numbers[2], raw.numbers[3], TimeSpanParse.zero, ticks);
                overflow = overflow || !match;
            }
            if (!match && raw.FullAppCompatMatch(raw.PositiveLocalized)) {
                positive = true;
                match = TimeSpanParse.TryTimeToTicks(positive, raw.numbers[0], raw.numbers[1], raw.numbers[2], TimeSpanParse.zero, raw.numbers[3], ticks);
                overflow = overflow || !match;
            }
            if (!match && raw.FullHMSFMatch(raw.NegativeLocalized)) {
                positive = false;
                match = TimeSpanParse.TryTimeToTicks(positive, TimeSpanParse.zero, raw.numbers[0], raw.numbers[1], raw.numbers[2], raw.numbers[3], ticks);
                overflow = overflow || !match;
            }
            if (!match && raw.FullDHMSMatch(raw.NegativeLocalized)) {
                positive = false;
                match = TimeSpanParse.TryTimeToTicks(positive, raw.numbers[0], raw.numbers[1], raw.numbers[2], raw.numbers[3], TimeSpanParse.zero, ticks);
                overflow = overflow || !match;
            }
            if (!match && raw.FullAppCompatMatch(raw.NegativeLocalized)) {
                positive = false;
                match = TimeSpanParse.TryTimeToTicks(positive, raw.numbers[0], raw.numbers[1], raw.numbers[2], TimeSpanParse.zero, raw.numbers[3], ticks);
                overflow = overflow || !match;
            }
        }

        if (match) {
            if (!positive) {
                ticks.value = ticks.value.neg();
                if (ticks.value.greaterThan(0)) {
                    result.SetFailure(ParseFailureKind.Overflow, "Overflow_TimeSpanElementTooLarge");
                    return false;
                }
            }
            result.parsedTimeSpan._ticks = ticks.value;
            return true;
        }

        if (overflow) {
            // we found at least one literal pattern match but the numbers just didn't fit
            result.SetFailure(ParseFailureKind.Overflow, "Overflow_TimeSpanElementTooLarge");
            return false;
        }
        else {
            // we couldn't find a thing
            result.SetFailure(ParseFailureKind.Format, "Format_BadTimeSpan");
            return false;
        }
    }

    //
    //  ProcessTerminal_HM_S_D
    //
    //  Actions: Validate the ambiguous 3-number "Hours:Minutes:Seconds", "Days.Hours:Minutes", or "Hours:Minutes:.Fraction" terminal case
    //
    private static ProcessTerminal_HM_S_D(raw: TimeSpanRawInfo, style: TimeSpanStandardStyles, result: TimeSpanResult): boolean {
        if (raw.SepCount !== 4 || raw.NumCount !== 3 || (style & TimeSpanStandardStyles.RequireFull) !== 0) {
            result.SetFailure(ParseFailureKind.Format, "Format_BadTimeSpan");
            return false;
        }

        const inv: boolean = ((style & TimeSpanStandardStyles.Invariant) !== 0);
        const loc: boolean = ((style & TimeSpanStandardStyles.Localized) !== 0);

        let positive: boolean = false;
        let match: boolean = false;
        let overflow: boolean = false;

        let ticks: Out<long> = New.Out(Convert.ToLong(0));

        if (inv) {
            if (raw.FullHMSMatch(raw.PositiveInvariant)) {
                positive = true;
                match = TimeSpanParse.TryTimeToTicks(positive, TimeSpanParse.zero, raw.numbers[0], raw.numbers[1], raw.numbers[2], TimeSpanParse.zero, ticks);
                overflow = overflow || !match;
            }
            if (!match && raw.FullDHMMatch(raw.PositiveInvariant)) {
                positive = true;
                match = TimeSpanParse.TryTimeToTicks(positive, raw.numbers[0], raw.numbers[1], raw.numbers[2], TimeSpanParse.zero, TimeSpanParse.zero, ticks);
                overflow = overflow || !match;
            }
            if (!match && raw.PartialAppCompatMatch(raw.PositiveInvariant)) {
                positive = true;
                match = TimeSpanParse.TryTimeToTicks(positive, TimeSpanParse.zero, raw.numbers[0], raw.numbers[1], TimeSpanParse.zero, raw.numbers[2], ticks);
                overflow = overflow || !match;
            }
            if (!match && raw.FullHMSMatch(raw.NegativeInvariant)) {
                positive = false;
                match = TimeSpanParse.TryTimeToTicks(positive, TimeSpanParse.zero, raw.numbers[0], raw.numbers[1], raw.numbers[2], TimeSpanParse.zero, ticks);
                overflow = overflow || !match;
            }
            if (!match && raw.FullDHMMatch(raw.NegativeInvariant)) {
                positive = false;
                match = TimeSpanParse.TryTimeToTicks(positive, raw.numbers[0], raw.numbers[1], raw.numbers[2], TimeSpanParse.zero, TimeSpanParse.zero, ticks);
                overflow = overflow || !match;
            }
            if (!match && raw.PartialAppCompatMatch(raw.NegativeInvariant)) {
                positive = false;
                match = TimeSpanParse.TryTimeToTicks(positive, TimeSpanParse.zero, raw.numbers[0], raw.numbers[1], TimeSpanParse.zero, raw.numbers[2], ticks);
                overflow = overflow || !match;
            }
        }
        if (loc) {
            if (!match && raw.FullHMSMatch(raw.PositiveLocalized)) {
                positive = true;
                match = TimeSpanParse.TryTimeToTicks(positive, TimeSpanParse.zero, raw.numbers[0], raw.numbers[1], raw.numbers[2], TimeSpanParse.zero, ticks);
                overflow = overflow || !match;
            }
            if (!match && raw.FullDHMMatch(raw.PositiveLocalized)) {
                positive = true;
                match = TimeSpanParse.TryTimeToTicks(positive, raw.numbers[0], raw.numbers[1], raw.numbers[2], TimeSpanParse.zero, TimeSpanParse.zero, ticks);
                overflow = overflow || !match;
            }
            if (!match && raw.PartialAppCompatMatch(raw.PositiveLocalized)) {
                positive = true;
                match = TimeSpanParse.TryTimeToTicks(positive, TimeSpanParse.zero, raw.numbers[0], raw.numbers[1], TimeSpanParse.zero, raw.numbers[2], ticks);
                overflow = overflow || !match;
            }
            if (!match && raw.FullHMSMatch(raw.NegativeLocalized)) {
                positive = false;
                match = TimeSpanParse.TryTimeToTicks(positive, TimeSpanParse.zero, raw.numbers[0], raw.numbers[1], raw.numbers[2], TimeSpanParse.zero, ticks);
                overflow = overflow || !match;
            }
            if (!match && raw.FullDHMMatch(raw.NegativeLocalized)) {
                positive = false;
                match = TimeSpanParse.TryTimeToTicks(positive, raw.numbers[0], raw.numbers[1], raw.numbers[2], TimeSpanParse.zero, TimeSpanParse.zero, ticks);
                overflow = overflow || !match;
            }
            if (!match && raw.PartialAppCompatMatch(raw.NegativeLocalized)) {
                positive = false;
                match = TimeSpanParse.TryTimeToTicks(positive, TimeSpanParse.zero, raw.numbers[0], raw.numbers[1], TimeSpanParse.zero, raw.numbers[2], ticks);
                overflow = overflow || !match;
            }
        }

        if (match) {
            if (!positive) {
                ticks.value = ticks.value.neg();
                if (ticks.value.greaterThan(0)) {
                    result.SetFailure(ParseFailureKind.Overflow, "Overflow_TimeSpanElementTooLarge");
                    return false;
                }
            }
            result.parsedTimeSpan._ticks = ticks.value;
            return true;
        }

        if (overflow) {
            // we found at least one literal pattern match but the numbers just didn't fit
            result.SetFailure(ParseFailureKind.Overflow, "Overflow_TimeSpanElementTooLarge");
            return false;
        }
        else {
            // we couldn't find a thing
            result.SetFailure(ParseFailureKind.Format, "Format_BadTimeSpan");
            return false;
        }
    }

    //
    //  ProcessTerminal_HM
    //
    //  Actions: Validate the 2-number "Hours:Minutes" terminal case
    //
    private static ProcessTerminal_HM(raw: TimeSpanRawInfo, style: TimeSpanStandardStyles, result: TimeSpanResult): boolean {
        if (raw.SepCount !== 3 || raw.NumCount !== 2 || (style & TimeSpanStandardStyles.RequireFull) !== 0) {
            result.SetFailure(ParseFailureKind.Format, "Format_BadTimeSpan");
            return false;
        }

        const inv: boolean = ((style & TimeSpanStandardStyles.Invariant) !== 0);
        const loc: boolean = ((style & TimeSpanStandardStyles.Localized) !== 0);

        let positive: boolean = false;
        let match: boolean = false;

        if (inv) {
            if (raw.FullHMMatch(raw.PositiveInvariant)) {
                match = true;
                positive = true;
            }
            if (!match && raw.FullHMMatch(raw.NegativeInvariant)) {
                match = true;
                positive = false;
            }
        }
        if (loc) {
            if (!match && raw.FullHMMatch(raw.PositiveLocalized)) {
                match = true;
                positive = true;
            }
            if (!match && raw.FullHMMatch(raw.NegativeLocalized)) {
                match = true;
                positive = false;
            }
        }

        const ticks: Out<long> = New.Out(Convert.ToLong(0));
        if (match) {
            if (!TimeSpanParse.TryTimeToTicks(positive, TimeSpanParse.zero, raw.numbers[0], raw.numbers[1], TimeSpanParse.zero, TimeSpanParse.zero, ticks)) {
                result.SetFailure(ParseFailureKind.Overflow, "Overflow_TimeSpanElementTooLarge");
                return false;
            }
            if (!positive) {
                ticks.value = ticks.value.neg();
                if (ticks.value.greaterThan(0)) {
                    result.SetFailure(ParseFailureKind.Overflow, "Overflow_TimeSpanElementTooLarge");
                    return false;
                }
            }
            result.parsedTimeSpan._ticks = ticks.value;
            return true;
        }

        result.SetFailure(ParseFailureKind.Format, "Format_BadTimeSpan");
        return false;
    }


    //
    //  ProcessTerminal_D
    //
    //  Actions: Validate the 1-number "Days" terminal case
    //
    private static ProcessTerminal_D(raw: TimeSpanRawInfo, style: TimeSpanStandardStyles, result: TimeSpanResult): boolean {
        if (raw.SepCount !== 2 || raw.NumCount !== 1 || (style & TimeSpanStandardStyles.RequireFull) !== 0) {
            result.SetFailure(ParseFailureKind.Format, "Format_BadTimeSpan");
            return false;
        }

        let inv: boolean = ((style & TimeSpanStandardStyles.Invariant) !== 0);
        let loc: boolean = ((style & TimeSpanStandardStyles.Localized) !== 0);

        let positive: boolean = false;
        let match: boolean = false;

        if (inv) {
            if (raw.FullDMatch(raw.PositiveInvariant)) {
                match = true;
                positive = true;
            }
            if (!match && raw.FullDMatch(raw.NegativeInvariant)) {
                match = true;
                positive = false;
            }
        }
        if (loc) {
            if (!match && raw.FullDMatch(raw.PositiveLocalized)) {
                match = true;
                positive = true;
            }
            if (!match && raw.FullDMatch(raw.NegativeLocalized)) {
                match = true;
                positive = false;
            }
        }

        const ticks: Out<long> = New.Out(Convert.ToLong(0));
        if (match) {
            if (!TimeSpanParse.TryTimeToTicks(positive, raw.numbers[0], TimeSpanParse.zero, TimeSpanParse.zero, TimeSpanParse.zero, TimeSpanParse.zero, ticks)) {
                result.SetFailure(ParseFailureKind.Overflow, "Overflow_TimeSpanElementTooLarge");
                return false;
            }
            if (!positive) {
                ticks.value = ticks.value.neg();
                if (ticks.value.greaterThan(0)) {
                    result.SetFailure(ParseFailureKind.Overflow, "Overflow_TimeSpanElementTooLarge");
                    return false;
                }
            }
            result.parsedTimeSpan._ticks = ticks.value;
            return true;
        }

        result.SetFailure(ParseFailureKind.Format, "Format_BadTimeSpan");
        return false;
    }
    //#endregion

    //#region TryParseExactTimeSpan
    //
    //  TryParseExactTimeSpan
    //
    //  Actions: Common private ParseExact method called by both ParseExact and TryParseExact
    //
    private static TryParseExactTimeSpan(input: string, format: string, formatProvider: IFormatProvider, styles: TimeSpanStyles, result: TimeSpanResult): boolean {
        if (input == null) {
            result.SetFailure(ParseFailureKind.ArgumentNull, "ArgumentNull_String", null, "input");
            return false;
        }
        if (format == null) {
            result.SetFailure(ParseFailureKind.ArgumentNull, "ArgumentNull_String", null, "format");
            return false;
        }
        if (format.length === 0) {
            result.SetFailure(ParseFailureKind.Format, "Format_BadFormatSpecifier");
            return false;
        }

        if (format.length === 1) {
            let style: TimeSpanStandardStyles = TimeSpanStandardStyles.None;

            if (format[0] === 'c' || format[0] === 't' || format[0] === 'T') {
                // fast path for legacy style TimeSpan formats.
                return TimeSpanParse.TryParseTimeSpanConstant(input, result);
            }
            else if (format[0] === 'g') {
                style = TimeSpanStandardStyles.Localized;
            }
            else if (format[0] === 'G') {
                style = TimeSpanStandardStyles.Localized | TimeSpanStandardStyles.RequireFull;
            }
            else {
                result.SetFailure(ParseFailureKind.Format, "Format_BadFormatSpecifier");
                return false;
            }
            return TimeSpanParse.TryParseTimeSpan(input, style, formatProvider, result);
        }

        return TimeSpanParse.TryParseByFormat(input, format, styles, result);
    }

    //
    //  TryParseByFormat
    //
    //  Actions: Parse the TimeSpan instance using the specified format.  Used by TryParseExactTimeSpan.
    //
    private static TryParseByFormat(input: string, format: string, styles: TimeSpanStyles, result: TimeSpanResult): boolean {
        /*  Contract.Assert(input != null, "input != null");
         Contract.Assert(format != null, "format != null"); */

        let seenDD: boolean = false;      // already processed days?
        let seenHH: boolean = false;      // already processed hours?
        let seenMM: boolean = false;      // already processed minutes?
        let seenSS: boolean = false;      // already processed seconds?
        let seenFF: boolean = false;      // already processed fraction?
        let dd: Out<int> = New.Out(0);               // parsed days
        let hh: Out<int> = New.Out(0);               // parsed hours
        let mm: Out<int> = New.Out(0);               // parsed minutes
        let ss: Out<int> = New.Out(0);               // parsed seconds
        let leadingZeroes: Out<int> = New.Out(0);    // number of leading zeroes in the parsed fraction
        let ff: Out<int> = New.Out(0);               // parsed fraction
        let i: int = 0;                // format string position
        let tokenLen: Out<int> = New.Out(0);         // length of current format token, used to update index 'i'

        const tokenizer: TimeSpanTokenizer = new TimeSpanTokenizer();
        tokenizer.Init(input, -1);

        while (i < format.length) {
            const ch: char = format[i].charCodeAt(0);
            let nextFormatChar: int = 0;
            switch (ch) {
                case 'h'.charCodeAt(0):
                    tokenLen.value = DateTimeFormat.ParseRepeatPattern(format, i, ch);
                    if (tokenLen.value > 2 || seenHH || !TimeSpanParse.ParseExactDigits(tokenizer, tokenLen.value, hh)) {
                        result.SetFailure(ParseFailureKind.Format, "Format_InvalidString");
                        return false;
                    }
                    seenHH = true;
                    break;
                case 'm'.charCodeAt(0):
                    tokenLen.value = DateTimeFormat.ParseRepeatPattern(format, i, ch);
                    if (tokenLen.value > 2 || seenMM || !TimeSpanParse.ParseExactDigits(tokenizer, tokenLen.value, mm)) {
                        result.SetFailure(ParseFailureKind.Format, "Format_InvalidString");
                        return false;
                    }
                    seenMM = true;
                    break;
                case 's'.charCodeAt(0):
                    tokenLen.value = DateTimeFormat.ParseRepeatPattern(format, i, ch);
                    if (tokenLen.value > 2 || seenSS || !TimeSpanParse.ParseExactDigits(tokenizer, tokenLen.value, ss)) {
                        result.SetFailure(ParseFailureKind.Format, "Format_InvalidString");
                        return false;
                    }
                    seenSS = true;
                    break;
                case 'f'.charCodeAt(0):
                    tokenLen.value = DateTimeFormat.ParseRepeatPattern(format, i, ch);
                    if (tokenLen.value > DateTimeFormat.MaxSecondsFractionDigits || seenFF || !TimeSpanParse.ParseExactDigits(tokenizer, tokenLen.value, tokenLen.value, leadingZeroes, ff)) {
                        result.SetFailure(ParseFailureKind.Format, "Format_InvalidString");
                        return false;
                    }
                    seenFF = true;
                    break;
                case 'F'.charCodeAt(0):
                    tokenLen.value = DateTimeFormat.ParseRepeatPattern(format, i, ch);
                    if (tokenLen.value > DateTimeFormat.MaxSecondsFractionDigits || seenFF) {
                        result.SetFailure(ParseFailureKind.Format, "Format_InvalidString");
                        return false;
                    }
                    TimeSpanParse.ParseExactDigits(tokenizer, tokenLen.value, tokenLen.value, leadingZeroes, ff);
                    seenFF = true;
                    break;
                case 'd'.charCodeAt(0):
                    tokenLen.value = DateTimeFormat.ParseRepeatPattern(format, i, ch);
                    const tmp: Out<int> = New.Out(0);
                    if (tokenLen.value > 8 || seenDD || !TimeSpanParse.ParseExactDigits(tokenizer, (tokenLen.value < 2) ? 1 : tokenLen.value, (tokenLen.value < 2) ? 8 : tokenLen.value, tmp, dd)) {
                        result.SetFailure(ParseFailureKind.Format, "Format_InvalidString");
                        return false;
                    }
                    seenDD = true;
                    break;
                case '\''.charCodeAt(0):
                case '\"'.charCodeAt(0):
                    const enquotedString: StringBuilder = new StringBuilder();
                    if (!DateTimeParse.TryParseQuoteString(format, i, enquotedString, tokenLen)) {
                        result.SetFailure(ParseFailureKind.FormatWithParameter, "Format_BadQuote", ch);
                        return false;
                    }
                    if (!TimeSpanParse.ParseExactLiteral(tokenizer, enquotedString)) {
                        result.SetFailure(ParseFailureKind.Format, "Format_InvalidString");
                        return false;
                    }
                    break;
                case '%'.charCodeAt(0):
                    // Optional format character.
                    // For example, format string "%d" will print day
                    // Most of the cases, "%" can be ignored.
                    nextFormatChar = DateTimeFormat.ParseNextChar(format, i);
                    // nextFormatChar will be -1 if we already reach the end of the format string.
                    // Besides, we will not allow "%%" appear in the pattern.
                    if (nextFormatChar >= 0 && nextFormatChar != Convert.ToInt32('%'.charCodeAt(0))) {
                        tokenLen.value = 1; // skip the '%' and process the format character
                        break;
                    }
                    else {
                        // This means that '%' is at the end of the format string or
                        // "%%" appears in the format string.
                        result.SetFailure(ParseFailureKind.Format, "Format_InvalidString");
                        return false;
                    }
                case '\\'.charCodeAt(0):
                    // Escaped character.  Can be used to insert character into the format string.
                    // For example, "\d" will insert the character 'd' into the string.
                    //
                    nextFormatChar = DateTimeFormat.ParseNextChar(format, i);
                    if (nextFormatChar >= 0 && tokenizer.NextChar == Convert.ToChar(nextFormatChar)) {
                        tokenLen.value = 2;
                    }
                    else {
                        // This means that '\' is at the end of the format string or the literal match failed.
                        result.SetFailure(ParseFailureKind.Format, "Format_InvalidString");
                        return false;
                    }
                    break;
                default:
                    result.SetFailure(ParseFailureKind.Format, "Format_InvalidString");
                    return false;
            }
            i += tokenLen.value;
        }


        if (!tokenizer.EOL) {
            // the custom format didn't consume the entire input
            result.SetFailure(ParseFailureKind.Format, "Format_BadTimeSpan");
            return false;
        }

        const ticks: Out<long> = New.Out(Convert.ToLong(0));
        const positive: boolean = (styles & TimeSpanStyles.AssumeNegative) === 0;
        if (TimeSpanParse.TryTimeToTicks(positive, new TimeSpanToken(dd.value),
            new TimeSpanToken(hh.value),
            new TimeSpanToken(mm.value),
            new TimeSpanToken(ss.value),
            new TimeSpanToken(leadingZeroes.value, ff.value), ticks)) {
            if (!positive) {
                ticks.value = ticks.value.neg();
            }
            result.parsedTimeSpan._ticks = ticks.value;
            return true;
        }
        else {
            result.SetFailure(ParseFailureKind.Overflow, "Overflow_TimeSpanElementTooLarge");
            return false;

        }
    }

    private static ParseExactDigits(tokenizer: TimeSpanTokenizer, minDigitLength: int, result: Out<int>): boolean;
    private static ParseExactDigits(tokenizer: TimeSpanTokenizer, minDigitLength: int, maxDigitLength: int, zeroes: Out<int>, result: Out<int>): boolean;
    private static ParseExactDigits(...args: any[]): boolean {
        if (args.length === 3) {
            const tokenizer: TimeSpanTokenizer = args[0];
            const minDigitLength: int = args[1];
            const result: Out<int> = args[2];
            result.value = 0;
            let zeroes: Out<int> = New.Out(0);
            let maxDigitLength: int = (minDigitLength === 1) ? 2 : minDigitLength;
            return TimeSpanParse.ParseExactDigits(tokenizer, minDigitLength, maxDigitLength, zeroes, result);
        } else if (args.length === 5) {
            const tokenizer: TimeSpanTokenizer = args[0];
            const minDigitLength: int = args[1];
            const maxDigitLength: int = args[2];
            const zeroes: Out<int> = args[3];
            const result: Out<int> = args[4];
            result.value = 0;
            zeroes.value = 0;

            let tokenLength: int = 0;
            while (tokenLength < maxDigitLength) {
                let ch: char = tokenizer.NextChar;
                if (ch < '0'.charCodeAt(0) || ch > '9'.charCodeAt(0)) {
                    tokenizer.BackOne();
                    break;
                }
                result.value = result.value * 10 + (ch - '0'.charCodeAt(0));
                if (result.value === 0) {
                    zeroes.value++;
                }
                tokenLength++;
            }
            return (tokenLength >= minDigitLength);
        }
        throw new ArgumentException('')

    }

    private static ParseExactLiteral(tokenizer: TimeSpanTokenizer, enquotedString: StringBuilder): boolean {
        for (let i: int = 0; i < enquotedString.Length; i++) {
            if (enquotedString[i] !== tokenizer.NextChar)
                return false;
        }
        return true;
    }
    //#endregion

    //#region TryParseTimeSpanConstant
    //
    // TryParseTimeSpanConstant
    //
    // Actions: Parses the "c" (constant) format.  This code is 100% identical to the non-globalized v1.0-v3.5 TimeSpan.Parse() routine
    //          and exists for performance/appcompat with legacy callers who cannot move onto the globalized Parse overloads.
    //
    private static TryParseTimeSpanConstant(input: string, result: TimeSpanResult): boolean {
        return (new StringParser().TryParse(input, result));
    }

    //#region TryParseExactMultipleTimeSpan
    //
    //  TryParseExactMultipleTimeSpan
    //
    //  Actions: Common private ParseExactMultiple method called by both ParseExactMultiple and TryParseExactMultiple
    //
    private static TryParseExactMultipleTimeSpan(input: string, formats: string[], formatProvider: IFormatProvider, styles: TimeSpanStyles, result: TimeSpanResult): boolean {
        if (input == null) {
            result.SetFailure(ParseFailureKind.ArgumentNull, "ArgumentNull_String", null, "input");
            return false;
        }
        if (formats == null) {
            result.SetFailure(ParseFailureKind.ArgumentNull, "ArgumentNull_String", null, "formats");
            return false;
        }

        if (input.length === 0) {
            result.SetFailure(ParseFailureKind.Format, "Format_BadTimeSpan");
            return false;
        }

        if (formats.length === 0) {
            result.SetFailure(ParseFailureKind.Format, "Format_BadFormatSpecifier");
            return false;
        }

        //
        // Do a loop through the provided formats and see if we can parse succesfully in
        // one of the formats.
        //
        for (let i: int = 0; i < formats.length; i++) {
            if (formats[i] == null || formats[i].length === 0) {
                result.SetFailure(ParseFailureKind.Format, "Format_BadFormatSpecifier");
                return false;
            }

            // Create a new non-throwing result each time to ensure the runs are independent.
            const innerResult: TimeSpanResult = new TimeSpanResult();
            innerResult.Init(TimeSpanThrowStyle.None);

            if (TimeSpanParse.TryParseExactTimeSpan(input, formats[i], formatProvider, styles, innerResult)) {
                result.parsedTimeSpan = innerResult.parsedTimeSpan;
                return true;
            }
        }

        result.SetFailure(ParseFailureKind.Format, "Format_BadTimeSpan");
        return (false);
    }
    //#endregion
}

class StringParser {
    private str: string = '';
    private ch: char = 0;
    private pos: int = 0;
    private len: int = 0;

    @Internal
    public NextChar(): void {
        if (this.pos < this.len)
            this.pos++;
        this.ch = this.pos < this.len ? this.str[this.pos].charCodeAt(0) : Convert.ToChar(0);
    }

    @Internal
    public NextNonDigit(): char {
        let i: int = this.pos;
        while (i < this.len) {
            let ch: char = this.str[i].charCodeAt(0);
            if (ch < '0'.charCodeAt(0) || ch > '9'.charCodeAt(0)) {
                return ch;
            }
            i++;
        }
        return Convert.ToChar(0);
    }

    @Internal
    public TryParse(input: string, result: TimeSpanResult): boolean {
        result.parsedTimeSpan._ticks = Convert.ToLong(0);

        if (input == null) {
            result.SetFailure(ParseFailureKind.ArgumentNull, "ArgumentNull_String", null, "input");
            return false;
        }
        this.str = input;
        this.len = input.length;
        this.pos = -1;
        this.NextChar();
        this.SkipBlanks();
        let negative: boolean = false;
        if (this.ch === '-'.charCodeAt(0)) {
            negative = true;
            this.NextChar();
        }
        let time: Out<long> = New.Out(Convert.ToLong(0));
        if (this.NextNonDigit() === ':'.charCodeAt(0)) {
            if (!this.ParseTime(time, result)) {
                return false;
            };
        }
        else {
            let days: Out<int> = New.Out(0);
            if (!this.ParseInt(Convert.ToInt32(Convert.ToLong(0x7FFFFFFFFFFFFFFF).div(TimeSpan.TicksPerDay)), days, result)) {
                return false;
            }
            time.value = TimeSpan.TicksPerDay.mul(days.value);
            if (this.ch === '.'.charCodeAt(0)) {
                this.NextChar();
                const remainingTime: Out<long> = New.Out(Convert.ToLong(0));
                if (!this.ParseTime(remainingTime, result)) {
                    return false;
                };
                time.value = time.value.add(remainingTime.value);
            }
        }
        if (negative) {
            time.value = time.value.neg();
            // Allow -0 as well
            if (time.value.greaterThan(0)) {
                result.SetFailure(ParseFailureKind.Overflow, "Overflow_TimeSpanElementTooLarge");
                return false;
            }
        }
        else {
            if (time.value.lessThan(0)) {
                result.SetFailure(ParseFailureKind.Overflow, "Overflow_TimeSpanElementTooLarge");
                return false;
            }
        }
        this.SkipBlanks();
        if (this.pos < this.len) {
            result.SetFailure(ParseFailureKind.Format, "Format_BadTimeSpan");
            return false;
        }
        result.parsedTimeSpan._ticks = time.value;
        return true;
    }

    @Internal
    public ParseInt(max: int, i: Out<int>, result: TimeSpanResult): boolean {
        i.value = 0;
        let p: int = this.pos;
        while (this.ch >= '0'.charCodeAt(0) && this.ch <= '9'.charCodeAt(0)) {
            if ((i.value & 0xF0000000) !== 0) {
                result.SetFailure(ParseFailureKind.Overflow, "Overflow_TimeSpanElementTooLarge");
                return false;
            }
            i.value = i.value * 10 + this.ch - '0'.charCodeAt(0);
            if (i.value < 0) {
                result.SetFailure(ParseFailureKind.Overflow, "Overflow_TimeSpanElementTooLarge");
                return false;
            }
            this.NextChar();
        }
        if (p === this.pos) {
            result.SetFailure(ParseFailureKind.Format, "Format_BadTimeSpan");
            return false;
        }
        if (i.value > max) {
            result.SetFailure(ParseFailureKind.Overflow, "Overflow_TimeSpanElementTooLarge");
            return false;
        }
        return true;
    }

    @Internal
    public ParseTime(time: Out<long>, result: TimeSpanResult): boolean {
        time.value = Convert.ToLong(0);
        let unit: Out<int> = New.Out(0);
        if (!this.ParseInt(23, unit, result)) {
            return false;
        }
        time.value = TimeSpan.TicksPerHour.mul(unit.value);
        if (this.ch !== ':'.charCodeAt(0)) {
            result.SetFailure(ParseFailureKind.Format, "Format_BadTimeSpan");
            return false;
        }
        this.NextChar();
        if (!this.ParseInt(59, unit, result)) {
            return false;
        }
        time.value = time.value.add(TimeSpan.TicksPerMinute.mul(unit.value));
        if (this.ch === ':'.charCodeAt(0)) {
            this.NextChar();
            // allow seconds with the leading zero
            if (this.ch !== '.'.charCodeAt(0)) {
                if (!this.ParseInt(59, unit, result)) {
                    return false;
                }
                time.value = time.value.add(TimeSpan.TicksPerSecond.mul(unit.value));
            }
            if (this.ch === '.'.charCodeAt(0)) {
                this.NextChar();
                let f: int = Convert.ToInt32(TimeSpan.TicksPerSecond);
                while (f > 1 && this.ch >= '0'.charCodeAt(0) && this.ch <= '9'.charCodeAt(0)) {
                    f /= 10;
                    time.value = time.value.add(Convert.ToLong((this.ch - '0'.charCodeAt(0)) * f));
                    this.NextChar();
                }
            }
        }
        return true;
    }

    @Internal
    public SkipBlanks(): void {
        while (this.ch === ' '.charCodeAt(0) || this.ch === '\t'.charCodeAt(0)) {
            this.NextChar();
        }
    }
}