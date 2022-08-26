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
* Copyright (c) Tuvalsoft. All rights reserved.                                                                                 *
*                                                                                                                               *
* Licensed under the GNU General Public License v3.0.                                                                           *
* More info at: https://choosealicense.com/licenses/gpl-3.0/                                                                    *
*                                                                                                                               *
******************************************************************************************************************************@*/
const AppContextSwitches = {
    EnforceLegacyJapaneseDateParsing: false
};

import { Convert } from "../convert";
import { DateTimeKind } from "../DateTimeKind";
import { Delegate } from "../Delegate";
import { TChar } from "../Extensions/TChar";
import { IntArray, int, New, char, double, long, float } from "../float";
import { Out } from '../Out';
import { DateTimeStyles } from "../Time/DateTimeStyles";
import { DayOfWeek } from '../Time/DayOfWeek';
import { DateTime } from "../Time/__DateTime";
import { TimeSpan } from "../Timespan";
import { Calendar } from "./Calendar";
import { Environment } from '../Environment';
import { is } from "../is";
import { TString } from '../Text/TString';
import { ArgumentException } from '../Exceptions/ArgumentException';
import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { FormatException } from "../Extensions/FormatException";
import { System } from "../SystemTypes";
import { DateTimeFormatFlags } from "./DateTimeFormatFlags";
import { DateTimeFormat } from "./DateTimeFormat";
import { StringBuilder } from "../Text/StringBuilder";
import { Exception } from "../Exception";
import { CompareInfo, CompareOptions } from "./CompareInfo";
import { HebrewNumber, HebrewNumberParsingContext, HebrewNumberParsingState } from "./HebrewNumber";
import { ArgumentOutOfRangeException } from '../Exceptions/ArgumentOutOfRangeException';
import { DateTimeFormatInfo } from "./CultureInfo";
import { TokenType } from "./TokenType";
import { Context } from "../Context/Context";
import { ClassInfo } from '../Reflection/Decorators/ClassInfo';
import { EventBus } from '../Events/EventBus';

declare var  TimeZoneInfo, TimeZoneInfoOptions  ;
let DateTimeOffset: any = null as any;

export enum DTSubStringType {
    Unknown = 0,
    Invalid = 1,
    Number = 2,
    End = 3,
    Other = 4,
}

export class DTSubString {
    public /* internal */  s: string = '';
    public /* internal */  index: int = 0;
    public /* internal */  length: int = 0;
    public /* internal */  type: DTSubStringType = DTSubStringType.Unknown;
    public /* internal */  value: int = 0;

    public /* internal */  Get(relativeIndex: int): char {
        return this.s[this.index + relativeIndex].charCodeAt(0);
    }
}


export class __DTString {

    //
    // Value property: stores the real string to be parsed.
    //
    public /* internal */  Value: string = '';

    //
    // Index property: points to the character that we are currently parsing.
    //
    public /* internal */  Index: int = 0;

    // The length of Value string.
    public /* internal */  len: int = 0;

    // The current character to be looked at.
    public /* internal */  m_current: char = 0;

    private m_info: CompareInfo = null as any;
    // Flag to indicate if we encouter an digit, we should check for token or not.
    // In some cultures, such as mn-MN, it uses "\x0031\x00a0\x0434\x04af\x0433\x044d\x044d\x0440\x00a0\x0441\x0430\x0440" in month names.
    private m_checkDigitToken: boolean = false;

    public constructor(str: string, dtfi: DateTimeFormatInfo, checkDigitToken: boolean);
    public constructor(str: string, dtfi: DateTimeFormatInfo);
    public constructor(...args: any[]) {
        if (args.length === 3) {
            const str: string = args[0];
            const dtfi: DateTimeFormatInfo = args[1];
            const checkDigitToken: boolean = args[2];
            this.constructor1(str, dtfi, checkDigitToken);
        } else if (args.length === 2) {
            const str: string = args[0];
            const dtfi: DateTimeFormatInfo = args[1];
            this.constructor2(str, dtfi);
        }
    }
    public constructor1(str: string, dtfi: DateTimeFormatInfo, checkDigitToken: boolean) {
        this.constructor2(str, dtfi)
        this.m_checkDigitToken = checkDigitToken;
    }

    public constructor2(str: string, dtfi: DateTimeFormatInfo) {
        this.Index = -1;
        this.Value = str;
        this.len = this.Value.length;

        this.m_current = '\0'.charCodeAt(0);
        if (dtfi != null) {
            this.m_info = dtfi.CompareInfo;
            this.m_checkDigitToken = ((dtfi.FormatFlags & DateTimeFormatFlags.UseDigitPrefixInTokens) !== 0);
        } else {
            const _Thread = Context.Current.get('Thread');
            this.m_info = _Thread.CurrentThread.CurrentCulture.CompareInfo;
            this.m_checkDigitToken = false;
        }
    }

    public /* internal */ get CompareInfo(): CompareInfo {
        return this.m_info;
    }

    //
    // Advance the Index.
    // Return true if Index is NOT at the end of the string.
    //
    // Typical usage:
    // while (str.GetNext())
    // {
    //     char ch = str.GetChar()
    // }
    public /* internal */  GetNext(): boolean {
        this.Index++;
        if (this.Index < this.len) {
            this.m_current = this.Value[this.Index].charCodeAt(0);
            return (true);
        }
        return (false);
    }

    public /* internal */  AtEnd(): boolean {
        return this.Index < this.len ? false : true;
    }

    public/* internal */  Advance(count: int): boolean {
        //Contract.Assert(Index + count <= len, "__DTString::Advance: Index + count <= len");
        this.Index += count;
        if (this.Index < this.len) {
            this.m_current = this.Value[this.Index].charCodeAt(0);
            return (true);
        }
        return (false);
    }


    // Used by DateTime.Parse() to get the next token.
    public /* internal */  GetRegularToken(tokenType: Out<TokenType>, tokenValue: Out<int>, dtfi: DateTimeFormatInfo): void {
        tokenValue.value = 0;
        if (this.Index >= this.len) {
            tokenType.value = TokenType.EndOfString;
            return;
        }

        tokenType.value = TokenType.UnknownToken;
        const self = this;
        (function Start() {
            if (DateTimeParse.IsDigit(self.m_current)) {
                // This is a digit.
                tokenValue.value = self.m_current - '0'.charCodeAt(0);
                let value: int;
                let start: int = self.Index;

                //
                // Collect other digits.
                //
                while (++self.Index < self.len) {
                    self.m_current = self.Value[self.Index].charCodeAt(0);
                    value = self.m_current - '0'.charCodeAt(0);
                    if (value >= 0 && value <= 9) {
                        tokenValue.value = tokenValue.value * 10 + value;
                    } else {
                        break;
                    }
                }
                if (self.Index - start > DateTimeParse.MaxDateTimeNumberDigits) {
                    tokenType.value = TokenType.NumberToken;
                    tokenValue.value = -1;
                } else if (self.Index - start < 3) {
                    tokenType.value = TokenType.NumberToken;
                } else {
                    // If there are more than 3 digits, assume that it's a year value.
                    tokenType.value = TokenType.YearNumberToken;
                }
                if (self.m_checkDigitToken) {
                    const save: int = self.Index;
                    const saveCh: char = self.m_current;
                    // Re-scan using the staring Index to see if this is a token.
                    self.Index = start;  // To include the first digit.
                    self.m_current = self.Value[self.Index].charCodeAt(0);
                    let tempType: Out<TokenType> = New.Out(0);
                    let tempValue: Out<int> = New.Out(0);
                    // This DTFI has tokens starting with digits.
                    // E.g. mn-MN has month name like "\x0031\x00a0\x0434\x04af\x0433\x044d\x044d\x0440\x00a0\x0441\x0430\x0440"
                    if (dtfi.Tokenize(TokenType.RegularTokenMask, tempType, tempValue, this)) {
                        tokenType.value = tempType.value;
                        tokenValue.value = tempValue.value;
                        // This is a token, so the Index has been advanced propertly in DTFI.Tokenizer().
                    } else {
                        // Use the number token value.
                        // Restore the index.
                        self.Index = save;
                        self.m_current = saveCh;
                    }
                }

            } else if (TChar.IsWhiteSpace(self.m_current)) {
                // Just skip to the next character.
                while (++self.Index < self.len) {
                    self.m_current = self.Value[self.Index].charCodeAt(0);
                    if (!(TChar.IsWhiteSpace(self.m_current))) {
                        Start();
                    }
                }
                // We have reached the end of string.
                tokenType.value = TokenType.EndOfString;
            } else {
                dtfi.Tokenize(TokenType.RegularTokenMask, tokenType, tokenValue, this);
            }
        })();
    }

    public /* internal */  GetSeparatorToken(dtfi: DateTimeFormatInfo, indexBeforeSeparator: Out<int>, charBeforeSeparator: Out<char>): TokenType {
        indexBeforeSeparator.value = this.Index;
        charBeforeSeparator.value = this.m_current;
        const tokenType: Out<TokenType> = New.Out(0);
        if (!this.SkipWhiteSpaceCurrent()) {
            // Reach the end of the string.
            return (TokenType.SEP_End);
        }
        if (!DateTimeParse.IsDigit(this.m_current)) {
            // Not a digit.  Tokenize it.
            let tokenValue: Out<int> = New.Out(0);
            const found: boolean = dtfi.Tokenize(TokenType.SeparatorTokenMask, tokenType, tokenValue, this);
            if (!found) {
                tokenType.value = TokenType.SEP_Space;
            }
        } else {
            // Do nothing here.  If we see a number, it will not be a separator. There is no need wasting time trying to find the
            // separator token.
            tokenType.value = TokenType.SEP_Space;
        }
        return (tokenType.value);
    }

    public /* internal */  MatchSpecifiedWord(target: string): boolean;
    public /* internal */  MatchSpecifiedWord(target: string, endIndex: int): boolean;
    public /* internal */  MatchSpecifiedWord(...args: any[]): boolean {
        if (args.length === 1 && is.string(args[0])) {
            const target: string = args[0];
            return this.MatchSpecifiedWord(target, target.length + this.Index);
        } else if (args.length === 2 && is.string(args[0]) && is.int(args[1])) {
            const target: string = args[0];
            const endIndex: int = args[1];
            const count: int = endIndex - this.Index;

            if (count !== target.length) {
                return false;
            }

            if (this.Index + count > this.len) {
                return false;
            }

            return (this.m_info.Compare(this.Value, this.Index, count, target, 0, count, CompareOptions.IgnoreCase) === 0);
        }
        throw new ArgumentException('');
    }

    private static WhiteSpaceChecks: char[] = [' '.charCodeAt(0), '\u00A0'.charCodeAt(0)];

    public /* internal */  MatchSpecifiedWords(target: string, checkWordBoundary: boolean, matchLength: Out<int>): boolean {
        const valueRemaining: int = this.Value.length - this.Index;
        matchLength.value = target.length;

        if (matchLength.value > valueRemaining || this.m_info.Compare(this.Value, this.Index, matchLength.value, target, 0, matchLength.value, CompareOptions.IgnoreCase) !== 0) {
            // Check word by word
            let targetPosition: int = 0;                 // Where we are in the target string
            let thisPosition: int = this.Index;         // Where we are in this string
            let wsIndex: int = TString.IndexOfAny(target, TString.StringArrayFromCharArray(__DTString.WhiteSpaceChecks), targetPosition);
            if (wsIndex === -1) {
                return false;
            }
            do {
                const segmentLength: int = wsIndex - targetPosition;
                if (thisPosition >= this.Value.length - segmentLength) { // Subtraction to prevent overflow.
                    return false;
                }
                if (segmentLength === 0) {
                    // If segmentLength == 0, it means that we have leading space in the target string.
                    // In that case, skip the leading spaces in the target and this string.
                    matchLength.value--;
                } else {
                    // Make sure we also have whitespace in the input string
                    if (!TChar.IsWhiteSpace(this.Value[thisPosition + segmentLength].charCodeAt(0))) {
                        return false;
                    }
                    if (this.m_info.Compare(this.Value, thisPosition, segmentLength, target, targetPosition, segmentLength, CompareOptions.IgnoreCase) !== 0) {
                        return false;
                    }
                    // Advance the input string
                    thisPosition = thisPosition + segmentLength + 1;
                }
                // Advance our target string
                targetPosition = wsIndex + 1;


                // Skip past multiple whitespace
                while (thisPosition < this.Value.length && TChar.IsWhiteSpace(this.Value[thisPosition].charCodeAt(0))) {
                    thisPosition++;
                    matchLength.value++;
                }
            } while ((wsIndex = TString.IndexOfAny(target, TString.StringArrayFromCharArray(__DTString.WhiteSpaceChecks), targetPosition)) >= 0);
            // now check the last segment;
            if (targetPosition < target.length) {
                let segmentLength: int = target.length - targetPosition;
                if (thisPosition > this.Value.length - segmentLength) {
                    return false;
                }
                if (this.m_info.Compare(this.Value, thisPosition, segmentLength, target, targetPosition, segmentLength, CompareOptions.IgnoreCase) !== 0) {
                    return false;
                }
            }
        }

        if (checkWordBoundary) {
            const nextCharIndex: int = this.Index + matchLength.value;
            if (nextCharIndex < this.Value.length) {
                if (TChar.IsLetter(this.Value[nextCharIndex].charCodeAt(0))) {
                    return false;
                }
            }
        }
        return true;
    }

    //
    // Check to see if the string starting from Index is a prefix of
    // str.
    // If a match is found, true value is returned and Index is updated to the next character to be parsed.
    // Otherwise, Index is unchanged.
    //
    public /* internal */  Match(str: string): boolean;
    public /* internal */  Match(ch: char): boolean;
    public /* internal */  Match(...args: any[]): boolean {
        if (args.length === 1 && is.string(args[0])) {
            const str: string = args[0];
            if (++this.Index >= this.len) {
                return false;
            }

            if (str.length > (this.Value.length - this.Index)) {
                return false;
            }

            if (this.m_info.Compare(this.Value, this.Index, str.length, str, 0, str.length, CompareOptions.Ordinal) === 0) {
                // Update the Index to the end of the matching string.
                // So the following GetNext()/Match() opeartion will get
                // the next character to be parsed.
                this.Index += (str.length - 1);
                return true;
            }
            return false;
        } else if (args.length === 1 && is.char(args[0])) {
            const ch: char = args[0];
            if (++this.Index >= this.len) {
                return (false);
            }
            if (this.Value[this.Index].charCodeAt(0) === ch) {
                this.m_current = ch;
                return (true);
            }
            this.Index--;
            return (false);
        }
        throw new ArgumentException('');
    }

    //
    //  Actions: From the current position, try matching the longest word in the specified string array.
    //      E.g. words[] = {"AB", "ABC", "ABCD"}, if the current position points to a substring like "ABC DEF",
    //          MatchLongestWords(words, ref MaxMatchStrLen) will return 1 (the index), and maxMatchLen will be 3.
    //  Returns:
    //      The index that contains the longest word to match
    //  Arguments:
    //      words   The string array that contains words to search.
    //      maxMatchStrLen  [in/out] the initailized maximum length.  This parameter can be used to
    //          find the longest match in two string arrays.
    //
    public /* internal */  MatchLongestWords(words: string[], maxMatchStrLen: Out<int>): int {
        let result: int = -1;
        for (let i: int = 0; i < words.length; i++) {
            let word: string = words[i];
            let matchLength: Out<int> = New.Out(word.length);
            if (this.MatchSpecifiedWords(word, false, matchLength)) {
                if (matchLength.value > maxMatchStrLen.value) {
                    maxMatchStrLen.value = matchLength.value;
                    result = i;
                }
            }
        }
        return result;
    }

    //
    // Get the number of repeat character after the current character.
    // For a string "hh:mm:ss" at Index of 3. GetRepeatCount() = 2, and Index
    // will point to the second ':'.
    //
    public /* internal */  GetRepeatCount(): int {
        let repeatChar: char = this.Value[this.Index].charCodeAt(0);
        let pos: int = this.Index + 1;
        while ((pos < this.len) && (this.Value[pos].charCodeAt(0) === repeatChar)) {
            pos++;
        }
        const repeatCount: int = (pos - this.Index);
        // Update the Index to the end of the repeated characters.
        // So the following GetNext() opeartion will get
        // the next character to be parsed.
        this.Index = pos - 1;
        return repeatCount;
    }

    // Return false when end of string is encountered or a non-digit character is found.
    public /* internal */  GetNextDigit(): boolean {
        if (++this.Index >= this.len) {
            return (false);
        }
        return (DateTimeParse.IsDigit(this.Value[this.Index].charCodeAt(0)));
    }

    //
    // Get the current character.
    //
    public /* internal */  GetChar(): char {
        // Contract.Assert(Index >= 0 && Index < len, "Index >= 0 && Index < len");
        return this.Value[this.Index].charCodeAt(0);
    }

    //
    // Convert the current character to a digit, and return it.
    //
    public /* internal */  GetDigit(): int {
        /*  Contract.Assert(Index >= 0 && Index < len, "Index >= 0 && Index < len");
         Contract.Assert(DateTimeParse.IsDigit(Value[Index]), "IsDigit(Value[Index])"); */
        return (this.Value[this.Index].charCodeAt(0) - '0'.charCodeAt(0));
    }

    //
    // Eat White Space ahead of the current position
    //
    // Return false if end of string is encountered.
    //
    public /* internal */  SkipWhiteSpaces(): void {
        // Look ahead to see if the next character
        // is a whitespace.
        while (this.Index + 1 < this.len) {
            const ch: char = this.Value[this.Index + 1].charCodeAt(0);
            if (!TChar.IsWhiteSpace(ch)) {
                return;
            }
            this.Index++;
        }
        return;
    }

    //
    // Skip white spaces from the current position
    //
    // Return false if end of string is encountered.
    //
    public /* internal */  SkipWhiteSpaceCurrent(): boolean {
        if (this.Index >= this.len) {
            return (false);
        }

        if (!TChar.IsWhiteSpace(this.m_current)) {
            return (true);
        }

        while (++this.Index < this.len) {
            this.m_current = this.Value[this.Index].charCodeAt(0);
            if (!TChar.IsWhiteSpace(this.m_current)) {
                return (true);
            }
            // Nothing here.
        }
        return (false);
    }

    public /* internal */  TrimTail(): void {
        let i: int = this.len - 1;
        while (i >= 0 && TChar.IsWhiteSpace(this.Value[i].charCodeAt(0))) {
            i--;
        }
        this.Value = this.Value.substring(0, i + 1);
        this.len = this.Value.length;
    }

    // Trim the trailing spaces within a quoted string.
    // Call this after TrimTail() is done.
    public /* internal */  RemoveTrailingInQuoteSpaces(): void {
        let i: int = this.len - 1;
        if (i <= 1) {
            return;
        }
        let ch: char = this.Value[i].charCodeAt(0);
        // Check if the last character is a quote.
        if (ch === '\''.charCodeAt(0) || ch === '\"'.charCodeAt(0)) {
            if (TChar.IsWhiteSpace(this.Value[i - 1].charCodeAt(0))) {
                i--;
                while (i >= 1 && TChar.IsWhiteSpace(this.Value[i - 1].charCodeAt(0))) {
                    i--;
                }
                this.Value = TString.Remove(this.Value, i, this.Value.length - 1 - i);
                this.len = this.Value.length;
            }
        }
    }

    // Trim the leading spaces within a quoted string.
    // Call this after the leading spaces before quoted string are trimmed.
    public /* internal */  RemoveLeadingInQuoteSpaces(): void {
        if (this.len <= 2) {
            return;
        }
        let i: int = 0;
        const ch: char = this.Value[i].charCodeAt(0);
        // Check if the last character is a quote.
        if (ch === '\''.charCodeAt(0) || ch === '\"'.charCodeAt(0)) {
            while ((i + 1) < this.len && TChar.IsWhiteSpace(this.Value[i + 1].charCodeAt(0))) {
                i++;
            }
            if (i !== 0) {
                this.Value = TString.Remove(this.Value, 1, i);
                this.len = this.Value.length;
            }
        }
    }

    public /* internal */  GetSubString(): DTSubString {
        const sub: DTSubString = new DTSubString();
        sub.index = this.Index;
        sub.s = this.Value;
        while (this.Index + sub.length < this.len) {
            let currentType: DTSubStringType;
            const ch: char = this.Value[this.Index + sub.length].charCodeAt(0);
            if (ch >= '0'.charCodeAt(0) && ch <= '9'.charCodeAt(0)) {
                currentType = DTSubStringType.Number;
            }
            else {
                currentType = DTSubStringType.Other;
            }

            if (sub.length === 0) {
                sub.type = currentType;
            }
            else {
                if (sub.type !== currentType) {
                    break;
                }
            }
            sub.length++;
            if (currentType === DTSubStringType.Number) {
                // Incorporate the number into the value
                // Limit the digits to prevent overflow
                if (sub.length > DateTimeParse.MaxDateTimeNumberDigits) {
                    sub.type = DTSubStringType.Invalid;
                    return sub;
                }
                const number: int = ch - '0'.charCodeAt(0);
                //Contract.Assert(number >= 0 && number <= 9, "number >= 0 && number <= 9");
                sub.value = sub.value * 10 + number;
            }
            else {
                // For non numbers, just return this length 1 token. This should be expanded
                // to more types of thing if this parsing approach is used for things other
                // than numbers and single characters
                break;
            }
        }
        if (sub.length === 0) {
            sub.type = DTSubStringType.End;
            return sub;
        }

        return sub;
    }

    public /* internal */  ConsumeSubString(sub: DTSubString): void {
        /* Contract.Assert(sub.index == Index, "sub.index == Index");
        Contract.Assert(sub.index + sub.length <= len, "sub.index + sub.length <= len"); */
        this.Index = sub.index + sub.length;
        if (this.Index < this.len) {
            this.m_current = this.Value[this.Index].charCodeAt(0);
        }
    }
}

export class MatchNumberDelegate extends Delegate<(str: __DTString, digitLen: int, result: Out<int>) => boolean> { };



// This is the helper data structure used in ParseExact().
export class ParsingInfo {

    public /* internal */  calendar: Calendar = null as any;
    public /* internal */  dayOfWeek: int = 0;
    public /* internal */  timeMark: TM = TM.NotSet;

    public /* internal */  fUseHour12: boolean = false;
    public /* internal */  fUseTwoDigitYear: boolean = false;
    public /* internal */  fAllowInnerWhite: boolean = false;
    public /* internal */  fAllowTrailingWhite: boolean = false;
    public /* internal */  fCustomNumberParser: boolean = false;
    public /* internal */  parseNumberDelegate: MatchNumberDelegate = new Delegate();

    public Init(): void {
        this.dayOfWeek = -1;
        this.timeMark = TM.NotSet;
    }
}


//
// This will store the result of the parsing.  And it will be eventually
// used to construct a DateTime instance.
//
@ClassInfo({
    fullName: System.Types.Globalization.DateTimeResult,
    instanceof: [
        System.Types.Globalization.DateTimeResult
    ]
})
export class DateTimeResult {
    public /* internal */  Year: int = 0;
    public /* internal */  Month: int = 0;
    public /* internal */  Day: int = 0;
    //
    // Set time defualt to 00:00:00.
    //
    public /* internal */  Hour: int = 0;
    public /* internal */  Minute: int = 0;
    public /* internal */  Second: int = 0;
    public /* internal */  fraction: double = Convert.ToDouble(0);

    public /* internal */  era: int = 0;
    public /* internal */  flags: ParseFlags = 0;
    public /* internal */  timeZoneOffset: TimeSpan = TimeSpan.Zero;
    public /* internal */  calendar: Calendar = null as any;
    public /* internal */  parsedDate: DateTime = null as any;
    public /* internal */  failure: ParseFailureKind = ParseFailureKind.None;
    public /* internal */  failureMessageID: string = '';
    public /* internal */  failureMessageFormatArgument: any;
    public /* internal */  failureArgumentName: string = '';

    public /* internal */  Init(): void {
        this.Year = -1;
        this.Month = -1;
        this.Day = -1;
        this.fraction = Convert.ToDouble(-1);
        this.era = -1;
    }

    public /* internal */  SetDate(year: int, month: int, day: int): void {
        this.Year = year;
        this.Month = month;
        this.Day = day;
    }
    public /* internal */  SetFailure(failure: ParseFailureKind, failureMessageID: string, failureMessageFormatArgument: any): void;
    public /* internal */  SetFailure(failure: ParseFailureKind, failureMessageID: string, failureMessageFormatArgument: any, failureArgumentName: string): void;
    public /* internal */  SetFailure(...args: any[]): void {
        if (args.length === 3) {
            const failure: ParseFailureKind = args[0];
            const failureMessageID: string = args[1];
            const failureMessageFormatArgument: any = args[2];
            this.failure = failure;
            this.failureMessageID = failureMessageID;
            this.failureMessageFormatArgument = failureMessageFormatArgument;
        } else if (args.length === 4) {
            const failure: ParseFailureKind = args[0];
            const failureMessageID: string = args[1];
            const failureMessageFormatArgument: any = args[2];
            const failureArgumentName: string = args[3];
            this.failure = failure;
            this.failureMessageID = failureMessageID;
            this.failureMessageFormatArgument = failureMessageFormatArgument;
            this.failureArgumentName = failureArgumentName;
        }
    }
}

export enum ParseFlags {
    HaveYear = 0x00000001,
    HaveMonth = 0x00000002,
    HaveDay = 0x00000004,
    HaveHour = 0x00000008,
    HaveMinute = 0x00000010,
    HaveSecond = 0x00000020,
    HaveTime = 0x00000040,
    HaveDate = 0x00000080,
    TimeZoneUsed = 0x00000100,
    TimeZoneUtc = 0x00000200,
    ParsedMonthName = 0x00000400,
    CaptureOffset = 0x00000800,
    YearDefault = 0x00001000,
    Rfc1123Pattern = 0x00002000,
    UtcSortPattern = 0x00004000,
}

export enum ParseFailureKind {
    None = 0,
    ArgumentNull = 1,
    Format = 2,
    FormatWithParameter = 3,
    FormatBadDateTimeCalendar = 4,  // FormatException when ArgumentOutOfRange is thrown by a Calendar.TryToDateTime().
}


//
// The buffer to store temporary parsing information.
//
export class DateTimeRawInfo {
    private num: IntArray = null as any;
    public /* internal */  numCount: int = 0;
    public /* internal */  month: int = 0;
    public /* internal */  year: int = 0;
    public /* internal */  dayOfWeek: int = 0;
    public /* internal */  era: int = 0;
    public /* internal */  timeMark: TM = TM.NotSet;
    public /* internal */  fraction: float = Convert.ToFloat(0);
    public /* internal */  hasSameDateAndTimeSeparators: boolean = false;
    //
    // <


    public /* internal */  timeZone: boolean = false;

    public /* internal */  Init(numberBuffer: IntArray): void {
        this.month = -1;
        this.year = -1;
        this.dayOfWeek = -1;
        this.era = -1;
        this.timeMark = TM.NotSet;
        this.fraction = -1;
        this.num = numberBuffer;
    }
    public AddNumber(value: int): void {
        this.num[this.numCount++] = value;
    }
    public GetNumber(index: int): int {
        return this.num[index];
    }
}

//
// The buffer to store the parsing token.
//
export class DateTimeToken {
    public /* internal */  dtt: DTT = DTT.End;    // Store the token
    public /* internal */  suffix: TokenType = null as any; // Store the CJK Year/Month/Day suffix (if any)
    public /* internal */  num: int = 0;    // Store the number that we are parsing (if any)
}





//
// This is a string parsing helper which wraps a String object.
// It has a Index property which tracks
// the current parsing pointer of the string.
//


////////////////////////////////////////////////////////////////////////////
// Date Token Types
//
// Following is the set of tokens that can be generated from a date
// string. Notice that the legal set of trailing separators have been
// folded in with the date number, and month name tokens. This set
// of tokens is chosen to reduce the number of date parse states.
//
////////////////////////////////////////////////////////////////////////////

export enum DTT/* : int */ {

    End = 0,    // '\0'
    NumEnd = 1,    // Num[ ]*[\0]
    NumAmpm = 2,    // Num[ ]+AmPm
    NumSpace = 3,    // Num[ ]+^[Dsep|Tsep|'0\']
    NumDatesep = 4,    // Num[ ]*Dsep
    NumTimesep = 5,    // Num[ ]*Tsep
    MonthEnd = 6,    // Month[ ]*'\0'
    MonthSpace = 7,    // Month[ ]+^[Dsep|Tsep|'\0']
    MonthDatesep = 8,    // Month[ ]*Dsep
    NumDatesuff = 9,    // Month[ ]*DSuff
    NumTimesuff = 10,   // Month[ ]*TSuff
    DayOfWeek = 11,   // Day of week name
    YearSpace = 12,   // Year+^[Dsep|Tsep|'0\']
    YearDateSep = 13,  // Year+Dsep
    YearEnd = 14,  // Year+['\0']
    TimeZone = 15,  // timezone name
    Era = 16,  // era name
    NumUTCTimeMark = 17,      // Num + 'Z'
    // When you add a new token which will be in the
    // state table, add it after NumLocalTimeMark.
    Unk = 18,   // unknown
    NumLocalTimeMark = 19,    // Num + 'T'
    Max = 20,   // marker
}

export enum TM {
    NotSet = -1,
    AM = 0,
    PM = 1,
}


////////////////////////////////////////////////////////////////////////////
//
// DateTime parsing state enumeration (DS.*)
//
////////////////////////////////////////////////////////////////////////////

export enum DS {
    BEGIN = 0,
    N = 1,        // have one number
    NN = 2,        // have two numbers

    // The following are known to be part of a date

    D_Nd = 3,        // date string: have number followed by date separator
    D_NN = 4,        // date string: have two numbers
    D_NNd = 5,        // date string: have two numbers followed by date separator

    D_M = 6,        // date string: have a month
    D_MN = 7,        // date string: have a month and a number
    D_NM = 8,        // date string: have a number and a month
    D_MNd = 9,        // date string: have a month and number followed by date separator
    D_NDS = 10,       // date string: have one number followed a date suffix.

    D_Y = 11,        // date string: have a year.
    D_YN = 12,        // date string: have a year and a number
    D_YNd = 13,        // date string: have a year and a number and a date separator
    D_YM = 14,        // date string: have a year and a month
    D_YMd = 15,        // date string: have a year and a month and a date separator
    D_S = 16,       // have numbers followed by a date suffix.
    T_S = 17,       // have numbers followed by a time suffix.

    // The following are known to be part of a time

    T_Nt = 18,          // have num followed by time separator
    T_NNt = 19,       // have two numbers followed by time separator


    ERROR = 20,

    // The following are terminal states. These all have an action
    // associated with them; and transition back to BEGIN.

    DX_NN = 21,       // day from two numbers
    DX_NNN = 22,       // day from three numbers
    DX_MN = 23,       // day from month and one number
    DX_NM = 24,       // day from month and one number
    DX_MNN = 25,       // day from month and two numbers
    DX_DS = 26,       // a set of date suffixed numbers.
    DX_DSN = 27,       // day from date suffixes and one number.
    DX_NDS = 28,       // day from one number and date suffixes .
    DX_NNDS = 29,       // day from one number and date suffixes .

    DX_YNN = 30,       // date string: have a year and two number
    DX_YMN = 31,       // date string: have a year, a month, and a number.
    DX_YN = 32,       // date string: have a year and one number
    DX_YM = 33,       // date string: have a year, a month.
    TX_N = 34,       // time from one number (must have ampm)
    TX_NN = 35,       // time from two numbers
    TX_NNN = 36,       // time from three numbers
    TX_TS = 37,       // a set of time suffixed numbers.
    DX_NNY = 38,
}

export class DateTimeParse {

    public /* internal */ static readonly MaxDateTimeNumberDigits: int = 8;
    public /* internal */ static m_hebrewNumberParser: MatchNumberDelegate = new MatchNumberDelegate(DateTimeParse.MatchHebrewDigits);

    public /* internal */ static ParseExact(s: string, format: string, dtfi: DateTimeFormatInfo, style: DateTimeStyles): DateTime;
    public /* internal */ static ParseExact(s: string, format: string, dtfi: DateTimeFormatInfo, style: DateTimeStyles, offset: Out<TimeSpan>): DateTime;
    public /* internal */ static ParseExact(...args: any[]): DateTime {
        if (args.length === 4) {
            const s: string = args[0];
            const format: string = args[1];
            const dtfi: DateTimeFormatInfo = args[2];
            const style: DateTimeStyles = args[3];
            const result: DateTimeResult = new DateTimeResult();       // The buffer to store the parsing result.
            result.Init();
            if (DateTimeParse.TryParseExact(s, format, dtfi, style, result)) {
                return result.parsedDate;
            }
            else {
                throw DateTimeParse.GetDateTimeParseException(result);
            }
        } else if (args.length === 5) {
            const s: string = args[0];
            const format: string = args[1];
            const dtfi: DateTimeFormatInfo = args[2];
            const style: DateTimeStyles = args[3];
            const offset: Out<TimeSpan> = args[4];
            const result: DateTimeResult = new DateTimeResult();       // The buffer to store the parsing result.
            offset.value = TimeSpan.Zero;
            result.Init();
            result.flags |= ParseFlags.CaptureOffset;
            if (DateTimeParse.TryParseExact(s, format, dtfi, style, result)) {
                offset.value = result.timeZoneOffset;
                return result.parsedDate;
            }
            else {
                throw DateTimeParse.GetDateTimeParseException(result);
            }
        }
        throw new ArgumentException('');
    }


    public/* internal */ static TryParseExact(s: string, format: string, dtfi: DateTimeFormatInfo, style: DateTimeStyles, result: DateTimeResult): boolean;
    public /* internal */ static TryParseExact(s: string, format: string, dtfi: DateTimeFormatInfo, style: DateTimeStyles, result: Out<DateTime>): boolean;
    public /* internal */ static TryParseExact(s: string, format: string, dtfi: DateTimeFormatInfo, style: DateTimeStyles, result: Out<DateTime>, offset: Out<TimeSpan>): boolean;
    public /* internal */ static TryParseExact(...args: any[]): boolean {
        if (args.length === 5 && is.string(args[0]) &&
        is.string(args[1]) && is.typeof<DateTimeFormatInfo>(args[2],
            System.Types.Globalization.DateTimeFormatInfo) &&
            is.int(args[3]) && is.typeof<DateTimeResult>(args[4], System.Types.Globalization.DateTimeResult)) {
            const s: string = args[0];
            const format: string = args[1];
            const dtfi: DateTimeFormatInfo = args[2];
            const style: DateTimeStyles = args[3];
            const result: DateTimeResult = args[4];
            if (s == null) {
                result.SetFailure(ParseFailureKind.ArgumentNull, "ArgumentNull_String", null, "s");
                return false;
            }
            if (format == null) {
                result.SetFailure(ParseFailureKind.ArgumentNull, "ArgumentNull_String", null, "format");
                return false;
            }
            if (s.length === 0) {
                result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                return false;
            }

            if (format.length === 0) {
                result.SetFailure(ParseFailureKind.Format, "Format_BadFormatSpecifier", null);
                return false;
            }

            //Contract.Assert(dtfi != null, "dtfi == null");

            return DateTimeParse.DoStrictParse(s, format, style, dtfi, result);
        } else if (args.length === 5) {
            const s: string = args[0];
            const format: string = args[1];
            const dtfi: DateTimeFormatInfo = args[2];
            const style: DateTimeStyles = args[3];
            const result: Out<DateTime> = args[4];
            result.value = DateTime.MinValue;
            const resultData: DateTimeResult = new DateTimeResult();       // The buffer to store the parsing result.
            resultData.Init();
            if (DateTimeParse.TryParseExact(s, format, dtfi, style, resultData)) {
                result.value = resultData.parsedDate;
                return true;
            }
            return false;
        } else if (args.length === 6) {
            const s: string = args[0];
            const format: string = args[1];
            const dtfi: DateTimeFormatInfo = args[2];
            const style: DateTimeStyles = args[3];
            const result: Out<DateTime> = args[4];
            const offset: Out<TimeSpan> = args[5];
            result.value = DateTime.MinValue;
            offset.value = TimeSpan.Zero;
            const resultData: DateTimeResult = new DateTimeResult();       // The buffer to store the parsing result.
            resultData.Init();
            resultData.flags |= ParseFlags.CaptureOffset;
            if (DateTimeParse.TryParseExact(s, format, dtfi, style, resultData)) {
                result.value = resultData.parsedDate;
                offset.value = resultData.timeZoneOffset;
                return true;
            }
            return false;
        }
        throw new ArgumentException('');
    }

    public /* internal */ static ParseExactMultiple(s: string, formats: string[], dtfi: DateTimeFormatInfo, style: DateTimeStyles): DateTime;
    public /* internal */ static ParseExactMultiple(s: string, formats: string[], dtfi: DateTimeFormatInfo, style: DateTimeStyles, offset: Out<TimeSpan>): DateTime;
    public /* internal */ static ParseExactMultiple(...args: any[]): DateTime {
        if (args.length === 4) {
            const s: string = args[0];
            const formats: string[] = args[1];
            const dtfi: DateTimeFormatInfo = args[2];
            const style: DateTimeStyles = args[3];
            const result: DateTimeResult = new DateTimeResult();       // The buffer to store the parsing result.
            result.Init();
            if (DateTimeParse.TryParseExactMultiple(s, formats, dtfi, style, result)) {
                return result.parsedDate;
            }
            else {
                throw DateTimeParse.GetDateTimeParseException(result);
            }
        } else if (args.length === 5) {
            const s: string = args[0];
            const formats: string[] = args[1];
            const dtfi: DateTimeFormatInfo = args[2];
            const style: DateTimeStyles = args[3];
            const offset: Out<TimeSpan> = args[4];
            const result: DateTimeResult = new DateTimeResult();       // The buffer to store the parsing result.
            offset.value = TimeSpan.Zero;
            result.Init();
            result.flags |= ParseFlags.CaptureOffset;
            if (DateTimeParse.TryParseExactMultiple(s, formats, dtfi, style, result)) {
                offset.value = result.timeZoneOffset;
                return result.parsedDate;
            }
            else {
                throw DateTimeParse.GetDateTimeParseException(result);
            }
        }
        throw new ArgumentException('');
    }

    public /* internal */ static TryParseExactMultiple(s: string, formats: string[], dtfi: DateTimeFormatInfo, style: DateTimeStyles, result: DateTimeResult): boolean
    public /* internal */ static TryParseExactMultiple(s: string, formats: string[], dtfi: DateTimeFormatInfo, style: DateTimeStyles, result: Out<DateTime>): boolean;
    public /* internal */ static TryParseExactMultiple(s: string, formats: string[], dtfi: DateTimeFormatInfo, style: DateTimeStyles, result: Out<DateTime>, offset: Out<TimeSpan>): boolean;
    public /* internal */ static TryParseExactMultiple(...args: any[]): boolean {
        if (args.length === 5 && is.string(args[0]) && is.array(args[1]) && is.typeof<DateTimeFormatInfo>(args[2], System.Types.Globalization.DateTimeFormatInfo) && is.int(args[3]) && is.typeof<DateTimeResult>(args[0], System.Types.Globalization.DateTimeResult)) {
            const s: string = args[0];
            const formats: string[] = args[1];
            const dtfi: DateTimeFormatInfo = args[2];
            const style: DateTimeStyles = args[3];
            const result: DateTimeResult = args[4];
            if (s == null) {
                result.SetFailure(ParseFailureKind.ArgumentNull, "ArgumentNull_String", null, "s");
                return false;
            }
            if (formats == null) {
                result.SetFailure(ParseFailureKind.ArgumentNull, "ArgumentNull_String", null, "formats");
                return false;
            }

            if (s.length === 0) {
                result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                return false;
            }

            if (formats.length === 0) {
                result.SetFailure(ParseFailureKind.Format, "Format_BadFormatSpecifier", null);
                return false;
            }

            //Contract.Assert(dtfi != null, "dtfi == null");

            //
            // Do a loop through the provided formats and see if we can parse successfully in
            // one of the formats.
            //
            for (let i: int = 0; i < formats.length; i++) {
                if (formats[i] == null || formats[i].length === 0) {
                    result.SetFailure(ParseFailureKind.Format, "Format_BadFormatSpecifier", null);
                    return false;
                }
                // Create a new result each time to ensure the runs are independent. Carry through
                // flags from the caller and return the result.
                const innerResult: DateTimeResult = new DateTimeResult();       // The buffer to store the parsing result.
                innerResult.Init();
                innerResult.flags = result.flags;
                if (DateTimeParse.TryParseExact(s, formats[i], dtfi, style, innerResult)) {
                    result.parsedDate = innerResult.parsedDate;
                    result.timeZoneOffset = innerResult.timeZoneOffset;
                    return (true);
                }
            }
            result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
            return (false);

        } else if (args.length === 5) {
            const s: string = args[0];
            const formats: string[] = args[1];
            const dtfi: DateTimeFormatInfo = args[2];
            const style: DateTimeStyles = args[3];
            const result: Out<DateTime> = args[4];
            result.value = DateTime.MinValue;
            const resultData: DateTimeResult = new DateTimeResult();       // The buffer to store the parsing result.
            resultData.Init();
            if (DateTimeParse.TryParseExactMultiple(s, formats, dtfi, style, resultData)) {
                result.value = resultData.parsedDate;
                return true;
            }
            return false;
        } else if (args.length === 6) {
            const s: string = args[0];
            const formats: string[] = args[1];
            const dtfi: DateTimeFormatInfo = args[2];
            const style: DateTimeStyles = args[3];
            const result: Out<DateTime> = args[4];
            const offset: Out<TimeSpan> = args[5];
            result.value = DateTime.MinValue;
            offset.value = TimeSpan.Zero;
            const resultData: DateTimeResult = new DateTimeResult();       // The buffer to store the parsing result.
            resultData.Init();
            resultData.flags |= ParseFlags.CaptureOffset;
            if (DateTimeParse.TryParseExactMultiple(s, formats, dtfi, style, resultData)) {
                result.value = resultData.parsedDate;
                offset.value = resultData.timeZoneOffset;
                return true;
            }
            return false;
        }
        throw new ArgumentException('');
    }

    ////////////////////////////////////////////////////////////////////////////
    //
    // NOTE: The following state machine table is dependent on the order of the
    // DS and DTT enumerations.
    //
    // For each non terminal state, the following table defines the next state
    // for each given date token type.
    //
    ////////////////////////////////////////////////////////////////////////////

    //          End       NumEnd      NumAmPm     NumSpace    NumDaySep   NumTimesep  MonthEnd    MonthSpace  MonthDSep   NumDateSuff NumTimeSuff     DayOfWeek     YearSpace   YearDateSep YearEnd     TimeZone   Era         UTCTimeMark
    private static dateParsingStates: DS[][] = [
        // DS.BEGIN                                                                             // DS.BEGIN
        [DS.BEGIN, DS.ERROR, DS.TX_N, DS.N, DS.D_Nd, DS.T_Nt, DS.ERROR, DS.D_M, DS.D_M, DS.D_S, DS.T_S, DS.BEGIN, DS.D_Y, DS.D_Y, DS.ERROR, DS.BEGIN, DS.BEGIN, DS.ERROR],

        // DS.N                                                                                 // DS.N
        [DS.ERROR, DS.DX_NN, DS.ERROR, DS.NN, DS.D_NNd, DS.ERROR, DS.DX_NM, DS.D_NM, DS.D_MNd, DS.D_NDS, DS.ERROR, DS.N, DS.D_YN, DS.D_YNd, DS.DX_YN, DS.N, DS.N, DS.ERROR],

        // DS.NN                                                                                // DS.NN
        [DS.DX_NN, DS.DX_NNN, DS.TX_N, DS.DX_NNN, DS.ERROR, DS.T_Nt, DS.DX_MNN, DS.DX_MNN, DS.ERROR, DS.ERROR, DS.T_S, DS.NN, DS.DX_NNY, DS.ERROR, DS.DX_NNY, DS.NN, DS.NN, DS.ERROR],

        // DS.D_Nd                                                                              // DS.D_Nd
        [DS.ERROR, DS.DX_NN, DS.ERROR, DS.D_NN, DS.D_NNd, DS.ERROR, DS.DX_NM, DS.D_MN, DS.D_MNd, DS.ERROR, DS.ERROR, DS.D_Nd, DS.D_YN, DS.D_YNd, DS.DX_YN, DS.ERROR, DS.D_Nd, DS.ERROR],

        // DS.D_NN                                                                              // DS.D_NN
        [DS.DX_NN, DS.DX_NNN, DS.TX_N, DS.DX_NNN, DS.ERROR, DS.T_Nt, DS.DX_MNN, DS.DX_MNN, DS.ERROR, DS.DX_DS, DS.T_S, DS.D_NN, DS.DX_NNY, DS.ERROR, DS.DX_NNY, DS.ERROR, DS.D_NN, DS.ERROR],

        // DS.D_NNd                                                                             // DS.D_NNd
        [DS.ERROR, DS.DX_NNN, DS.DX_NNN, DS.DX_NNN, DS.ERROR, DS.ERROR, DS.DX_MNN, DS.DX_MNN, DS.ERROR, DS.DX_DS, DS.ERROR, DS.D_NNd, DS.DX_NNY, DS.ERROR, DS.DX_NNY, DS.ERROR, DS.D_NNd, DS.ERROR],

        // DS.D_M                                                                               // DS.D_M
        [DS.ERROR, DS.DX_MN, DS.ERROR, DS.D_MN, DS.D_MNd, DS.ERROR, DS.ERROR, DS.ERROR, DS.ERROR, DS.ERROR, DS.ERROR, DS.D_M, DS.D_YM, DS.D_YMd, DS.DX_YM, DS.ERROR, DS.D_M, DS.ERROR],

        // DS.D_MN                                                                              // DS.D_MN
        [DS.DX_MN, DS.DX_MNN, DS.DX_MNN, DS.DX_MNN, DS.ERROR, DS.T_Nt, DS.ERROR, DS.ERROR, DS.ERROR, DS.DX_DS, DS.T_S, DS.D_MN, DS.DX_YMN, DS.ERROR, DS.DX_YMN, DS.ERROR, DS.D_MN, DS.ERROR],

        // DS.D_NM                                                                              // DS.D_NM
        [DS.DX_NM, DS.DX_MNN, DS.DX_MNN, DS.DX_MNN, DS.ERROR, DS.T_Nt, DS.ERROR, DS.ERROR, DS.ERROR, DS.DX_DS, DS.T_S, DS.D_NM, DS.DX_YMN, DS.ERROR, DS.DX_YMN, DS.ERROR, DS.D_NM, DS.ERROR],

        // DS.D_MNd                                                                             // DS.D_MNd
        [DS.ERROR, DS.DX_MNN, DS.ERROR, DS.DX_MNN, DS.ERROR, DS.ERROR, DS.ERROR, DS.ERROR, DS.ERROR, DS.ERROR, DS.ERROR, DS.D_MNd, DS.DX_YMN, DS.ERROR, DS.DX_YMN, DS.ERROR, DS.D_MNd, DS.ERROR],

        // DS.D_NDS,                                                                            // DS.D_NDS,
        [DS.DX_NDS, DS.DX_NNDS, DS.DX_NNDS, DS.DX_NNDS, DS.ERROR, DS.T_Nt, DS.ERROR, DS.ERROR, DS.ERROR, DS.D_NDS, DS.T_S, DS.D_NDS, DS.ERROR, DS.ERROR, DS.ERROR, DS.ERROR, DS.D_NDS, DS.ERROR],

        // DS.D_Y                                                                               // DS.D_Y
        [DS.ERROR, DS.DX_YN, DS.ERROR, DS.D_YN, DS.D_YNd, DS.ERROR, DS.DX_YM, DS.D_YM, DS.D_YMd, DS.D_YM, DS.ERROR, DS.D_Y, DS.ERROR, DS.ERROR, DS.ERROR, DS.ERROR, DS.D_Y, DS.ERROR],

        // DS.D_YN                                                                              // DS.D_YN
        [DS.DX_YN, DS.DX_YNN, DS.DX_YNN, DS.DX_YNN, DS.ERROR, DS.ERROR, DS.DX_YMN, DS.DX_YMN, DS.ERROR, DS.ERROR, DS.ERROR, DS.D_YN, DS.ERROR, DS.ERROR, DS.ERROR, DS.ERROR, DS.D_YN, DS.ERROR],

        // DS.D_YNd                                                                             // DS.D_YNd
        [DS.ERROR, DS.DX_YNN, DS.DX_YNN, DS.DX_YNN, DS.ERROR, DS.ERROR, DS.DX_YMN, DS.DX_YMN, DS.ERROR, DS.ERROR, DS.ERROR, DS.D_YN, DS.ERROR, DS.ERROR, DS.ERROR, DS.ERROR, DS.D_YN, DS.ERROR],

        // DS.D_YM                                                                              // DS.D_YM
        [DS.DX_YM, DS.DX_YMN, DS.DX_YMN, DS.DX_YMN, DS.ERROR, DS.ERROR, DS.ERROR, DS.ERROR, DS.ERROR, DS.ERROR, DS.ERROR, DS.D_YM, DS.ERROR, DS.ERROR, DS.ERROR, DS.ERROR, DS.D_YM, DS.ERROR],

        // DS.D_YMd                                                                             // DS.D_YMd
        [DS.ERROR, DS.DX_YMN, DS.DX_YMN, DS.DX_YMN, DS.ERROR, DS.ERROR, DS.ERROR, DS.ERROR, DS.ERROR, DS.ERROR, DS.ERROR, DS.D_YM, DS.ERROR, DS.ERROR, DS.ERROR, DS.ERROR, DS.D_YM, DS.ERROR],

        // DS.D_S                                                                               // DS.D_S
        [DS.DX_DS, DS.DX_DSN, DS.TX_N, DS.T_Nt, DS.ERROR, DS.T_Nt, DS.ERROR, DS.ERROR, DS.ERROR, DS.D_S, DS.T_S, DS.D_S, DS.ERROR, DS.ERROR, DS.ERROR, DS.ERROR, DS.D_S, DS.ERROR],

        // DS.T_S                                                                               // DS.T_S
        [DS.TX_TS, DS.TX_TS, DS.TX_TS, DS.T_Nt, DS.D_Nd, DS.ERROR, DS.ERROR, DS.ERROR, DS.ERROR, DS.D_S, DS.T_S, DS.T_S, DS.ERROR, DS.ERROR, DS.ERROR, DS.T_S, DS.T_S, DS.ERROR],

        // DS.T_Nt                                                                              // DS.T_Nt
        [DS.ERROR, DS.TX_NN, DS.TX_NN, DS.TX_NN, DS.ERROR, DS.T_NNt, DS.DX_NM, DS.D_NM, DS.ERROR, DS.ERROR, DS.T_S, DS.ERROR, DS.ERROR, DS.ERROR, DS.ERROR, DS.T_Nt, DS.T_Nt, DS.TX_NN],

        // DS.T_NNt                                                                             // DS.T_NNt
        [DS.ERROR, DS.TX_NNN, DS.TX_NNN, DS.TX_NNN, DS.ERROR, DS.ERROR, DS.ERROR, DS.ERROR, DS.ERROR, DS.ERROR, DS.T_S, DS.T_NNt, DS.ERROR, DS.ERROR, DS.ERROR, DS.T_NNt, DS.T_NNt, DS.TX_NNN],

    ];
    //          End       NumEnd      NumAmPm     NumSpace    NumDaySep   NumTimesep  MonthEnd    MonthSpace  MonthDSep   NumDateSuff NumTimeSuff     DayOfWeek     YearSpace   YearDateSep YearEnd     TimeZone    Era        UTCMark

    public /* internal */ static readonly GMTName: string = "GMT";
    public /* internal */ static readonly ZuluName: string = "Z";

    //
    // Search from the index of str at str.Index to see if the target string exists in the str.
    //
    private static MatchWord(str: __DTString, target: string): boolean {
        const length: int = target.length;
        if (length > (str.Value.length - str.Index)) {
            return false;
        }

        if (str.CompareInfo.Compare(str.Value, str.Index, length, target, 0, length, CompareOptions.IgnoreCase) !== 0) {
            return (false);
        }

        const nextCharIndex: int = str.Index + target.length;

        if (nextCharIndex < str.Value.length) {
            const nextCh: char = str.Value[nextCharIndex].charCodeAt(0);
            if (TChar.IsLetter(nextCh)) {
                return (false);
            }
        }
        str.Index = nextCharIndex;
        if (str.Index < str.len) {
            str.m_current = str.Value[str.Index].charCodeAt(0);
        }
        return true;
    }


    //
    // Check the word at the current index to see if it matches GMT name or Zulu name.
    //
    private static GetTimeZoneName(str: __DTString): boolean {
        //
        // <

        if (DateTimeParse.MatchWord(str, DateTimeParse.GMTName)) {
            return (true);
        }

        if (DateTimeParse.MatchWord(str, DateTimeParse.ZuluName)) {
            return (true);
        }

        return (false);
    }

    public /* internal */ static IsDigit(ch: char): boolean {
        return (ch >= '0'.charCodeAt(0) && ch <= '9'.charCodeAt(0));
    }


    /*=================================ParseFraction==========================
    **Action: Starting at the str.Index, which should be a decimal symbol.
    ** if the current character is a digit, parse the remaining
    **      numbers as fraction.  For example, if the sub-string starting at str.Index is "123", then
    **      the method will return 0.123
    **Returns:      The fraction number.
    **Arguments:
    **      str the parsing string
    **Exceptions:
    ============================================================================*/

    private static ParseFraction(str: __DTString, result: Out<float>): boolean {
        //throw new Error('Decimal point ayarla.');
        result.value = 0;
        let decimalBase: number = Convert.ToFloat(0.1);
        let digits: int = 0;
        let ch: char;
        while (str.GetNext() && DateTimeParse.IsDigit(ch = str.m_current)) {
            result.value += (ch - '0'.charCodeAt(0)) * (decimalBase);
            decimalBase *= decimalBase * 0.1;
            digits++;
        }
        return (digits > 0);
    }

    /*=================================ParseTimeZone==========================
    **Action: Parse the timezone offset in the following format:
    **          "+8", "+08", "+0800", "+0800"
    **        This method is used by DateTime.Parse().
    **Returns:      The TimeZone offset.
    **Arguments:
    **      str the parsing string
    **Exceptions:
    **      FormatException if invalid timezone format is found.
    ============================================================================*/

    private static ParseTimeZone(str: __DTString, result: TimeSpan): boolean {
        // The hour/minute offset for timezone.
        let hourOffset: int = 0;
        let minuteOffset: int = 0;
        let sub: DTSubString;

        // Consume the +/- character that has already been read
        sub = str.GetSubString();
        if (sub.length !== 1) {
            return false;
        }
        const offsetChar: char = sub.Get(0);
        if (offsetChar !== '+'.charCodeAt(0) && offsetChar !== '-'.charCodeAt(0)) {
            return false;
        }
        str.ConsumeSubString(sub);

        sub = str.GetSubString();
        if (sub.type !== DTSubStringType.Number) {
            return false;
        }
        let value: char = sub.value;
        let length: int = sub.length;
        if (length === 1 || length === 2) {
            // Parsing "+8" or "+08"
            hourOffset = value;
            str.ConsumeSubString(sub);
            // See if we have minutes
            sub = str.GetSubString();
            if (sub.length === 1 && sub[0] === ':') {
                // Parsing "+8:00" or "+08:00"
                str.ConsumeSubString(sub);
                sub = str.GetSubString();
                if (sub.type !== DTSubStringType.Number || sub.length < 1 || sub.length > 2) {
                    return false;
                }
                minuteOffset = sub.value;
                str.ConsumeSubString(sub);
            }
        }
        else if (length === 3 || length === 4) {
            // Parsing "+800" or "+0800"
            hourOffset = value / 100;
            minuteOffset = value % 100;
            str.ConsumeSubString(sub);
        }
        else {
            // Wrong number of digits
            return false;
        }
        /* Contract.Assert(hourOffset >= 0 && hourOffset <= 99, "hourOffset >= 0 && hourOffset <= 99");
        Contract.Assert(minuteOffset >= 0 && minuteOffset <= 99, "minuteOffset >= 0 && minuteOffset <= 99"); */
        if (minuteOffset < 0 || minuteOffset >= 60) {
            return false;
        }

        result = new TimeSpan(hourOffset, minuteOffset, 0);
        if (offsetChar === '-'.charCodeAt(0)) {
            result = result.Negate();
        }
        return true;
    }

    // This is the helper function to handle timezone in string in the format like +/-0800
    private static HandleTimeZone(str: __DTString, result: DateTimeResult): boolean {
        if ((str.Index < str.len - 1)) {
            let nextCh: char = str.Value[str.Index].length;
            // Skip whitespace, but don't update the index unless we find a time zone marker
            let whitespaceCount: int = 0;
            while (TChar.IsWhiteSpace(nextCh) && str.Index + whitespaceCount < str.len - 1) {
                whitespaceCount++;
                nextCh = str.Value[str.Index + whitespaceCount].charCodeAt(0);
            }
            if (nextCh === '+'.charCodeAt(0) || nextCh === '-'.charCodeAt(0)) {
                str.Index += whitespaceCount;
                if ((result.flags & ParseFlags.TimeZoneUsed) !== 0) {
                    // Should not have two timezone offsets.
                    result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                    return false;
                }
                result.flags |= ParseFlags.TimeZoneUsed;
                if (!DateTimeParse.ParseTimeZone(str, result.timeZoneOffset)) {
                    result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                    return false;
                }
            }
        }
        return true;
    }

    //
    // This is the lexer. Check the character at the current index, and put the found token in dtok and
    // some raw date/time information in raw.
    //
    private static Lex(dps: DS, str: __DTString, dtok: DateTimeToken, raw: DateTimeRawInfo, result: DateTimeResult, dtfi: DateTimeFormatInfo, styles: DateTimeStyles): boolean {

        const tokenType: Out<TokenType> = New.Out(0);
        const tokenValue: Out<int> = New.Out(0);
        let indexBeforeSeparator: Out<int> = New.Out(0);
        let charBeforeSeparator: Out<char> = New.Out(0);

        let sep: TokenType;
        dtok.dtt = DTT.Unk;     // Assume the token is unkown.

        str.GetRegularToken(tokenType, tokenValue, dtfi);
        // Look at the regular token.
        switch (tokenType.value) {
            case TokenType.NumberToken:
            case TokenType.YearNumberToken:
                if (raw.numCount === 3 || tokenValue.value === -1) {
                    result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                    DateTimeParse.LexTraceExit("0010", dps);
                    return false;
                }
                //
                // This is a digit.
                //
                // If the previous parsing state is DS.T_NNt (like 12:01), and we got another number,
                // so we will have a terminal state DS.TX_NNN (like 12:01:02).
                // If the previous parsing state is DS.T_Nt (like 12:), and we got another number,
                // so we will have a terminal state DS.TX_NN (like 12:01).
                //
                // Look ahead to see if the following character is a decimal point or timezone offset.
                // This enables us to parse time in the forms of:
                //  "11:22:33.1234" or "11:22:33-08".
                if (dps === DS.T_NNt) {
                    if ((str.Index < str.len - 1)) {
                        const nextCh: char = str.Value[str.Index].charCodeAt(0);
                        if (nextCh === '.'.charCodeAt(0)) {
                            // While ParseFraction can fail, it just means that there were no digits after
                            // the dot. In this case ParseFraction just removes the dot. This is actually
                            // valid for cultures like Albanian, that join the time marker to the time with
                            // with a dot: e.g. "9:03.MD"
                            const fraction: Out<float> = New.Out(0);
                            DateTimeParse.ParseFraction(str, fraction);
                            raw.fraction = fraction.value;
                        }
                    }
                }
                if (dps === DS.T_NNt || dps == DS.T_Nt) {
                    if ((str.Index < str.len - 1)) {
                        if (false === DateTimeParse.HandleTimeZone(str, result)) {
                            DateTimeParse.LexTraceExit("0020 (value like \"12:01\" or \"12:\" followed by a non-TZ number", dps);
                            return false;
                        }
                    }
                }

                dtok.num = tokenValue.value;
                if (tokenType.value === TokenType.YearNumberToken) {
                    if (raw.year === -1) {
                        raw.year = tokenValue.value;
                        //
                        // If we have number which has 3 or more digits (like "001" or "0001"),
                        // we assume this number is a year. Save the currnet raw.numCount in
                        // raw.year.
                        //
                        switch (sep = str.GetSeparatorToken(dtfi, indexBeforeSeparator, charBeforeSeparator)) {
                            case TokenType.SEP_End:
                                dtok.dtt = DTT.YearEnd;
                                break;
                            case TokenType.SEP_Am:
                            case TokenType.SEP_Pm:
                                if (raw.timeMark === TM.NotSet) {
                                    raw.timeMark = (sep === TokenType.SEP_Am ? TM.AM : TM.PM);
                                    dtok.dtt = DTT.YearSpace;
                                } else {
                                    result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                                    DateTimeParse.LexTraceExit("0030 (TM.AM/TM.PM Happened more than 1x)", dps);
                                }
                                break;
                            case TokenType.SEP_Space:
                                dtok.dtt = DTT.YearSpace;
                                break;
                            case TokenType.SEP_Date:
                                dtok.dtt = DTT.YearDateSep;
                                break;

                            case TokenType.SEP_Time:
                                if (!raw.hasSameDateAndTimeSeparators) {
                                    result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                                    DateTimeParse.LexTraceExit("0040 (Invalid separator after number)", dps);
                                    return false;
                                }

                                // we have the date and time separators are same and getting a year number, then change the token to YearDateSep as
                                // we are sure we are not parsing time.
                                dtok.dtt = DTT.YearDateSep;
                                break;

                            case TokenType.SEP_DateOrOffset:
                                // The separator is either a date separator or the start of a time zone offset. If the token will complete the date then
                                // process just the number and roll back the index so that the outer loop can attempt to parse the time zone offset.
                                if ((DateTimeParse.dateParsingStates[dps][DTT.YearDateSep] === DS.ERROR)
                                    && (DateTimeParse.dateParsingStates[dps][DTT.YearSpace] > DS.ERROR)) {
                                    str.Index = indexBeforeSeparator.value;
                                    str.m_current = charBeforeSeparator.value;
                                    dtok.dtt = DTT.YearSpace;
                                }
                                else {
                                    dtok.dtt = DTT.YearDateSep;
                                }
                                break;
                            case TokenType.SEP_YearSuff:
                            case TokenType.SEP_MonthSuff:
                            case TokenType.SEP_DaySuff:
                                dtok.dtt = DTT.NumDatesuff;
                                dtok.suffix = sep;
                                break;
                            case TokenType.SEP_HourSuff:
                            case TokenType.SEP_MinuteSuff:
                            case TokenType.SEP_SecondSuff:
                                dtok.dtt = DTT.NumTimesuff;
                                dtok.suffix = sep;
                                break;
                            default:
                                // Invalid separator after number number.
                                result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                                DateTimeParse.LexTraceExit("0040 (Invalid separator after number)", dps);
                                return false;
                        }
                        //
                        // Found the token already. Return now.
                        //
                        DateTimeParse.LexTraceExit("0050 (success)", dps);
                        return true;
                    }
                    result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                    DateTimeParse.LexTraceExit("0060", dps);
                    return false;
                }
                switch (sep = str.GetSeparatorToken(dtfi, indexBeforeSeparator, charBeforeSeparator)) {
                    //
                    // Note here we check if the numCount is less than three.
                    // When we have more than three numbers, it will be caught as error in the state machine.
                    //
                    case TokenType.SEP_End:
                        dtok.dtt = DTT.NumEnd;
                        raw.AddNumber(dtok.num);
                        break;
                    case TokenType.SEP_Am:
                    case TokenType.SEP_Pm:
                        if (raw.timeMark == TM.NotSet) {
                            raw.timeMark = (sep == TokenType.SEP_Am ? TM.AM : TM.PM);
                            dtok.dtt = DTT.NumAmpm;
                            // Fix AM/PM parsing case, e.g. "1/10 5 AM"
                            if (dps === DS.D_NN) {
                                if (!DateTimeParse.ProcessTerminaltState(DS.DX_NN, result, styles, raw, dtfi)) {
                                    return false;
                                }
                            }

                            raw.AddNumber(dtok.num);
                        } else {
                            result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                            break;
                        }
                        if (dps === DS.T_NNt || dps === DS.T_Nt) {
                            if (false === DateTimeParse.HandleTimeZone(str, result)) {
                                DateTimeParse.LexTraceExit("0070 (HandleTimeZone returned false)", dps);
                                return false;
                            }
                        }
                        break;
                    case TokenType.SEP_Space:
                        dtok.dtt = DTT.NumSpace;
                        raw.AddNumber(dtok.num);
                        break;
                    case TokenType.SEP_Date:
                        dtok.dtt = DTT.NumDatesep;
                        raw.AddNumber(dtok.num);
                        break;
                    case TokenType.SEP_DateOrOffset:
                        // The separator is either a date separator or the start of a time zone offset. If the token will complete the date then
                        // process just the number and roll back the index so that the outer loop can attempt to parse the time zone offset.
                        if ((DateTimeParse.dateParsingStates[dps][DTT.NumDatesep] === DS.ERROR)
                            && (DateTimeParse.dateParsingStates[dps][DTT.NumSpace] > DS.ERROR)) {
                            str.Index = indexBeforeSeparator.value;
                            str.m_current = charBeforeSeparator.value;
                            dtok.dtt = DTT.NumSpace;
                        }
                        else {
                            dtok.dtt = DTT.NumDatesep;
                        }
                        raw.AddNumber(dtok.num);
                        break;
                    case TokenType.SEP_Time:
                        if (raw.hasSameDateAndTimeSeparators &&
                            (dps == DS.D_Y || dps == DS.D_YN || dps == DS.D_YNd || dps == DS.D_YM || dps == DS.D_YMd)) {
                            // we are parsing a date and we have the time separator same as date separator, so we mark the token as date separator
                            dtok.dtt = DTT.NumDatesep;
                            raw.AddNumber(dtok.num);
                            break;
                        }
                        dtok.dtt = DTT.NumTimesep;
                        raw.AddNumber(dtok.num);
                        break;
                    case TokenType.SEP_YearSuff:
                        try {
                            dtok.num = dtfi.Calendar.ToFourDigitYear(tokenValue.value);
                        }
                        catch (e) {
                            result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", e);
                            DateTimeParse.LexTraceExit("0075 (Calendar.ToFourDigitYear failed)", dps);
                            return false;
                        }
                        dtok.dtt = DTT.NumDatesuff;
                        dtok.suffix = sep;
                        break;
                    case TokenType.SEP_MonthSuff:
                    case TokenType.SEP_DaySuff:
                        dtok.dtt = DTT.NumDatesuff;
                        dtok.suffix = sep;
                        break;
                    case TokenType.SEP_HourSuff:
                    case TokenType.SEP_MinuteSuff:
                    case TokenType.SEP_SecondSuff:
                        dtok.dtt = DTT.NumTimesuff;
                        dtok.suffix = sep;
                        break;
                    case TokenType.SEP_LocalTimeMark:
                        dtok.dtt = DTT.NumLocalTimeMark;
                        raw.AddNumber(dtok.num);
                        break;
                    default:
                        // Invalid separator after number number.
                        result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                        DateTimeParse.LexTraceExit("0080", dps);
                        return false;
                }
                break;
            case TokenType.HebrewNumber:
                if (tokenValue.value >= 100) {
                    // This is a year number
                    if (raw.year === -1) {
                        raw.year = tokenValue.value;
                        //
                        // If we have number which has 3 or more digits (like "001" or "0001"),
                        // we assume this number is a year. Save the currnet raw.numCount in
                        // raw.year.
                        //
                        switch (sep = str.GetSeparatorToken(dtfi, indexBeforeSeparator, charBeforeSeparator)) {
                            case TokenType.SEP_End:
                                dtok.dtt = DTT.YearEnd;
                                break;
                            case TokenType.SEP_Space:
                                dtok.dtt = DTT.YearSpace;
                                break;
                            case TokenType.SEP_DateOrOffset:
                                // The separator is either a date separator or the start of a time zone offset. If the token will complete the date then
                                // process just the number and roll back the index so that the outer loop can attempt to parse the time zone offset.
                                if (DateTimeParse.dateParsingStates[dps][DTT.YearSpace] > DS.ERROR) {
                                    str.Index = indexBeforeSeparator.value;
                                    str.m_current = charBeforeSeparator.value;
                                    dtok.dtt = DTT.YearSpace;
                                    break;
                                }
                                // Invalid separator after number number.
                                result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                                DateTimeParse.LexTraceExit("0090", dps);
                                return false;
                            default:
                                // Invalid separator after number number.
                                result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                                DateTimeParse.LexTraceExit("0090", dps);
                                return false;
                        }
                    } else {
                        // Invalid separator after number number.
                        result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                        DateTimeParse.LexTraceExit("0100", dps);
                        return false;
                    }
                } else {
                    // This is a day number
                    dtok.num = tokenValue.value;
                    raw.AddNumber(dtok.num);

                    switch (sep = str.GetSeparatorToken(dtfi, indexBeforeSeparator, charBeforeSeparator)) {
                        //
                        // Note here we check if the numCount is less than three.
                        // When we have more than three numbers, it will be caught as error in the state machine.
                        //
                        case TokenType.SEP_End:
                            dtok.dtt = DTT.NumEnd;
                            break;
                        case TokenType.SEP_Space:
                        case TokenType.SEP_Date:
                            dtok.dtt = DTT.NumDatesep;
                            break;
                        case TokenType.SEP_DateOrOffset:
                            // The separator is either a date separator or the start of a time zone offset. If the token will complete the date then
                            // process just the number and roll back the index so that the outer loop can attempt to parse the time zone offset.
                            if ((DateTimeParse.dateParsingStates[dps][DTT.NumDatesep] === DS.ERROR)
                                && (DateTimeParse.dateParsingStates[dps][DTT.NumSpace] > DS.ERROR)) {
                                str.Index = indexBeforeSeparator.value;
                                str.m_current = charBeforeSeparator.value;
                                dtok.dtt = DTT.NumSpace;
                            }
                            else {
                                dtok.dtt = DTT.NumDatesep;
                            }
                            break;
                        default:
                            // Invalid separator after number number.
                            result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                            DateTimeParse.LexTraceExit("0110", dps);
                            return false;
                    }
                }
                break;
            case TokenType.DayOfWeekToken:
                if (raw.dayOfWeek === -1) {
                    //
                    // This is a day of week name.
                    //
                    raw.dayOfWeek = tokenValue.value;
                    dtok.dtt = DTT.DayOfWeek;
                } else {
                    result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                    DateTimeParse.LexTraceExit("0120 (DayOfWeek seen more than 1x)", dps);
                    return false;
                }
                break;
            case TokenType.MonthToken:
                if (raw.month === -1) {
                    //
                    // This is a month name
                    //
                    switch (sep = str.GetSeparatorToken(dtfi, indexBeforeSeparator, charBeforeSeparator)) {
                        case TokenType.SEP_End:
                            dtok.dtt = DTT.MonthEnd;
                            break;
                        case TokenType.SEP_Space:
                            dtok.dtt = DTT.MonthSpace;
                            break;
                        case TokenType.SEP_Date:
                            dtok.dtt = DTT.MonthDatesep;
                            break;
                        case TokenType.SEP_Time:
                            if (!raw.hasSameDateAndTimeSeparators) {
                                result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                                DateTimeParse.LexTraceExit("0130 (Invalid separator after month name)", dps);
                                return false;
                            }

                            // we have the date and time separators are same and getting a Month name, then change the token to MonthDatesep as
                            // we are sure we are not parsing time.
                            dtok.dtt = DTT.MonthDatesep;
                            break;
                        case TokenType.SEP_DateOrOffset:
                            // The separator is either a date separator or the start of a time zone offset. If the token will complete the date then
                            // process just the number and roll back the index so that the outer loop can attempt to parse the time zone offset.
                            if ((DateTimeParse.dateParsingStates[dps][DTT.MonthDatesep] === DS.ERROR) && (DateTimeParse.dateParsingStates[dps][DTT.MonthSpace] > DS.ERROR)) {
                                str.Index = indexBeforeSeparator.value;
                                str.m_current = charBeforeSeparator.value;
                                dtok.dtt = DTT.MonthSpace;
                            }
                            else {
                                dtok.dtt = DTT.MonthDatesep;
                            }
                            break;
                        default:
                            //Invalid separator after month name
                            result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                            DateTimeParse.LexTraceExit("0130 (Invalid separator after month name)", dps);
                            return false;
                    }
                    raw.month = tokenValue.value;
                } else {
                    result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                    DateTimeParse.LexTraceExit("0140 (MonthToken seen more than 1x)", dps);
                    return false;
                }
                break;
            case TokenType.EraToken:
                if (result.era !== -1) {
                    result.era = tokenValue.value;
                    dtok.dtt = DTT.Era;
                } else {
                    result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                    DateTimeParse.LexTraceExit("0150 (EraToken seen when result.era already set)", dps);
                    return false;
                }
                break;
            case TokenType.JapaneseEraToken:
                throw new Exception('düzelt');
                // Special case for Japanese.  We allow Japanese era name to be used even if the calendar is not Japanese Calendar.
               /*  result.calendar = JapaneseCalendar.GetDefaultInstance();
                dtfi = DateTimeFormatInfo.GetJapaneseCalendarDTFI();
                if (result.era !== -1) {
                    result.era = tokenValue.value;
                    dtok.dtt = DTT.Era;
                } else {
                    result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                    DateTimeParse.LexTraceExit("0160 (JapaneseEraToken seen when result.era already set)", dps);
                    return false;
                } */
                break;
            case TokenType.TEraToken:
                throw new Exception('düzelt');
                /*  */
                /* result.calendar = TaiwanCalendar.GetDefaultInstance();
                dtfi = DateTimeFormatInfo.GetTaiwanCalendarDTFI();
                if (result.era !== -1) {
                    result.era = tokenValue.value;
                    dtok.dtt = DTT.Era;
                } else {
                    result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                    DateTimeParse.LexTraceExit("0170 (TEraToken seen when result.era already set)", dps);
                    return false;
                } */
                break;
            case TokenType.TimeZoneToken:
                //
                // This is a timezone designator
                //
                // NOTENOTE : for now, we only support "GMT" and "Z" (for Zulu time).
                //
                if ((result.flags & ParseFlags.TimeZoneUsed) !== 0) {
                    // Should not have two timezone offsets.
                    result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                    DateTimeParse.LexTraceExit("0180 (seen GMT or Z more than 1x)", dps);
                    return false;
                }
                dtok.dtt = DTT.TimeZone;
                result.flags |= ParseFlags.TimeZoneUsed;
                result.timeZoneOffset = new TimeSpan(Convert.ToDouble(0));
                result.flags |= ParseFlags.TimeZoneUtc;
                break;
            case TokenType.EndOfString:
                dtok.dtt = DTT.End;
                break;
            case TokenType.DateWordToken:
            case TokenType.IgnorableSymbol:
                // Date words and ignorable symbols can just be skipped over
                break;
            case TokenType.Am:
            case TokenType.Pm:
                if (raw.timeMark == TM.NotSet) {
                    raw.timeMark = <TM>tokenValue.value;
                } else {
                    result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                    DateTimeParse.LexTraceExit("0190 (AM/PM timeMark already set)", dps);
                    return false;
                }
                break;
            case TokenType.UnknownToken:
                if (TChar.IsLetter(str.m_current)) {
                    result.SetFailure(ParseFailureKind.FormatWithParameter, "Format_UnknowDateTimeWord", str.Index);
                    DateTimeParse.LexTraceExit("0200", dps);
                    return (false);
                }

                if ((str.m_current === '-'.charCodeAt(0) || str.m_current === '+'.charCodeAt(0)) && ((result.flags & ParseFlags.TimeZoneUsed) === 0)) {
                    const originalIndex: int = str.Index;
                    if (DateTimeParse.ParseTimeZone(str, result.timeZoneOffset)) {
                        result.flags |= ParseFlags.TimeZoneUsed;
                        DateTimeParse.LexTraceExit("0220 (success)", dps);
                        return true;
                    }
                    else {
                        // Time zone parse attempt failed. Fall through to punctuation handling.
                        str.Index = originalIndex;
                    }
                }

                // Visual Basic implements string to date conversions on top of DateTime.Parse:
                //   CDate("#10/10/95#")
                //
                if (DateTimeParse.VerifyValidPunctuation(str)) {
                    DateTimeParse.LexTraceExit("0230 (success)", dps);
                    return true;
                }

                result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                DateTimeParse.LexTraceExit("0240", dps);
                return false;
        }

        DateTimeParse.LexTraceExit("0250 (success)", dps);
        return true;
    }

    private static VerifyValidPunctuation(str: __DTString): boolean {
        // Compatability Behavior. Allow trailing nulls and surrounding hashes
        let ch: char = str.Value[str.Index].charCodeAt(0);
        if (ch === '#'.charCodeAt(0)) {
            let foundStart: boolean = false;
            let foundEnd: boolean = false;
            for (let i: int = 0; i < str.len; i++) {
                ch = str.Value[i].charCodeAt(0);
                if (ch === '#'.charCodeAt(0)) {
                    if (foundStart) {
                        if (foundEnd) {
                            // Having more than two hashes is invalid
                            return false;
                        }
                        else {
                            foundEnd = true;
                        }
                    }
                    else {
                        foundStart = true;
                    }
                }
                else if (ch === '\0'.charCodeAt(0)) {
                    // Allow nulls only at the end
                    if (!foundEnd) {
                        return false;
                    }
                }
                else if ((!TChar.IsWhiteSpace(ch))) {
                    // Anthyhing other than whitespace outside hashes is invalid
                    if (!foundStart || foundEnd) {
                        return false;
                    }
                }
            }
            if (!foundEnd) {
                // The has was un-paired
                return false;
            }
            // Valid Hash usage: eat the hash and continue.
            str.GetNext();
            return true;
        }
        else if (ch === '\0'.charCodeAt(0)) {
            for (let i: int = str.Index; i < str.len; i++) {
                if (str.Value[i] !== '\0') {
                    // Nulls are only valid if they are the only trailing character
                    return false;
                }
            }
            // Move to the end of the string
            str.Index = str.len;
            return true;
        }
        return false;
    }

    private static readonly ORDER_YMD: int = 0;     // The order of date is Year/Month/Day.
    private static readonly ORDER_MDY: int = 1;     // The order of date is Month/Day/Year.
    private static readonly ORDER_DMY: int = 2;     // The order of date is Day/Month/Year.
    private static readonly ORDER_YDM: int = 3;     // The order of date is Year/Day/Month
    private static readonly ORDER_YM: int = 4;     // Year/Month order.
    private static readonly ORDER_MY: int = 5;     // Month/Year order.
    private static readonly ORDER_MD: int = 6;     // Month/Day order.
    private static readonly ORDER_DM: int = 7;     // Day/Month order.

    //
    // Decide the year/month/day order from the datePattern.
    //
    // Return 0 for YMD, 1 for MDY, 2 for DMY, otherwise -1.
    //
    private static GetYearMonthDayOrder(datePattern: string, dtfi: DateTimeFormatInfo, order: Out<int>): boolean {
        let yearOrder: int = -1;
        let monthOrder: int = -1;
        let dayOrder: int = -1;
        let orderCount: int = 0;

        let inQuote: boolean = false;

        for (let i: int = 0; i < datePattern.length && orderCount < 3; i++) {
            const ch: char = datePattern[i].charCodeAt(0);
            if (ch === '\\'.charCodeAt(0) || ch === '%'.charCodeAt(0)) {
                i++;
                continue;  // Skip next character that is escaped by this backslash
            }

            if (ch === '\''.charCodeAt(0) || ch === '"'.charCodeAt(0)) {
                inQuote = !inQuote;
            }

            if (!inQuote) {
                if (ch === 'y'.charCodeAt(0)) {
                    yearOrder = orderCount++;

                    //
                    // Skip all year pattern charaters.
                    //
                    for (; i + 1 < datePattern.length && datePattern[i + 1] === 'y'; i++) {
                        // Do nothing here.
                    }
                }
                else if (ch === 'M'.charCodeAt(0)) {
                    monthOrder = orderCount++;
                    //
                    // Skip all month pattern characters.
                    //
                    for (; i + 1 < datePattern.length && datePattern[i + 1] === 'M'; i++) {
                        // Do nothing here.
                    }
                }
                else if (ch === 'd'.charCodeAt(0)) {

                    let patternCount: int = 1;
                    //
                    // Skip all day pattern characters.
                    //
                    for (; i + 1 < datePattern.length && datePattern[i + 1] === 'd'; i++) {
                        patternCount++;
                    }
                    //
                    // Make sure this is not "ddd" or "dddd", which means day of week.
                    //
                    if (patternCount <= 2) {
                        dayOrder = orderCount++;
                    }
                }
            }
        }

        if (yearOrder === 0 && monthOrder === 1 && dayOrder === 2) {
            order.value = DateTimeParse.ORDER_YMD;
            return true;
        }
        if (monthOrder === 0 && dayOrder === 1 && yearOrder === 2) {
            order.value = DateTimeParse.ORDER_MDY;
            return true;
        }
        if (dayOrder === 0 && monthOrder === 1 && yearOrder === 2) {
            order.value = DateTimeParse.ORDER_DMY;
            return true;
        }
        if (yearOrder === 0 && dayOrder === 1 && monthOrder === 2) {
            order.value = DateTimeParse.ORDER_YDM;
            return true;
        }
        order.value = -1;
        return false;
    }

    //
    // Decide the year/month order from the pattern.
    //
    // Return 0 for YM, 1 for MY, otherwise -1.
    //
    private static GetYearMonthOrder(pattern: string, dtfi: DateTimeFormatInfo, order: Out<int>): boolean {
        let yearOrder: int = -1;
        let monthOrder: int = -1;
        let orderCount: int = 0;

        let inQuote: boolean = false;
        for (let i: int = 0; i < pattern.length && orderCount < 2; i++) {
            const ch: char = pattern[i].charCodeAt(0);
            if (ch === '\\'.charCodeAt(0) || ch === '%'.charCodeAt(0)) {
                i++;
                continue;  // Skip next character that is escaped by this backslash
            }

            if (ch === '\''.charCodeAt(0) || ch === '"'.charCodeAt(0)) {
                inQuote = !inQuote;
            }

            if (!inQuote) {
                if (ch === 'y'.charCodeAt(0)) {
                    yearOrder = orderCount++;

                    //
                    // Skip all year pattern charaters.
                    //
                    for (; i + 1 < pattern.length && pattern[i + 1] === 'y'; i++) {
                    }
                }
                else if (ch === 'M'.charCodeAt(0)) {
                    monthOrder = orderCount++;
                    //
                    // Skip all month pattern characters.
                    //
                    for (; i + 1 < pattern.length && pattern[i + 1] === 'M'; i++) {
                    }
                }
            }
        }

        if (yearOrder === 0 && monthOrder === 1) {
            order.value = DateTimeParse.ORDER_YM;
            return true;
        }
        if (monthOrder === 0 && yearOrder === 1) {
            order.value = DateTimeParse.ORDER_MY;
            return true;
        }
        order.value = -1;
        return false;
    }

    //
    // Decide the month/day order from the pattern.
    //
    // Return 0 for MD, 1 for DM, otherwise -1.
    //
    private static GetMonthDayOrder(pattern: string, dtfi: DateTimeFormatInfo, order: Out<int>): boolean {
        let monthOrder: int = -1;
        let dayOrder: int = -1;
        let orderCount: int = 0;

        let inQuote: boolean = false;
        for (let i: int = 0; i < pattern.length && orderCount < 2; i++) {
            let ch: char = pattern[i].charCodeAt(0);
            if (ch === '\\'.charCodeAt(0) || ch === '%'.charCodeAt(0)) {
                i++;
                continue;  // Skip next character that is escaped by this backslash
            }

            if (ch === '\''.charCodeAt(0) || ch === '"'.charCodeAt(0)) {
                inQuote = !inQuote;
            }

            if (!inQuote) {
                if (ch === 'd'.charCodeAt(0)) {
                    let patternCount: int = 1;
                    //
                    // Skip all day pattern charaters.
                    //
                    for (; i + 1 < pattern.length && pattern[i + 1] === 'd'; i++) {
                        patternCount++;
                    }

                    //
                    // Make sure this is not "ddd" or "dddd", which means day of week.
                    //
                    if (patternCount <= 2) {
                        dayOrder = orderCount++;
                    }

                }
                else if (ch === 'M'.charCodeAt(0)) {
                    monthOrder = orderCount++;
                    //
                    // Skip all month pattern characters.
                    //
                    for (; i + 1 < pattern.length && pattern[i + 1] === 'M'; i++) {
                    }
                }
            }
        }

        if (monthOrder === 0 && dayOrder === 1) {
            order.value = DateTimeParse.ORDER_MD;
            return true;
        }
        if (dayOrder === 0 && monthOrder === 1) {
            order.value = DateTimeParse.ORDER_DM;
            return true;
        }
        order.value = -1;
        return false;
    }

    //
    // Adjust the two-digit year if necessary.
    //
    private static TryAdjustYear(result: DateTimeResult, year: int, adjustedYear: Out<int>): boolean {
        if (year < 100) {
            try {
                // the Calendar classes need some real work.  Many of the calendars that throw
                // don't implement a fast/non-allocating (and non-throwing) IsValid{Year|Day|Month} method.
                // we are making a targeted try/catch fix in the in-place release but will revisit this code
                // in the next side-by-side release.
                year = result.calendar.ToFourDigitYear(year);
            }
            catch (ArgumentOutOfRangeException) {
                adjustedYear.value = -1;
                return false;
            }
        }
        adjustedYear.value = year;
        return true;
    }

    private static SetDateYMD(result: DateTimeResult, year: int, month: int, day: int): boolean {
        // Note, longer term these checks should be done at the end of the parse. This current
        // way of checking creates order dependence with parsing the era name.
        if (result.calendar.IsValidDay(year, month, day, result.era)) {
            result.SetDate(year, month, day);                           // YMD
            return (true);
        }
        return (false);
    }

    private static SetDateMDY(result: DateTimeResult, month: int, day: int, year: int): boolean {
        return (DateTimeParse.SetDateYMD(result, year, month, day));
    }

    private static SetDateDMY(result: DateTimeResult, day: int, month: int, year: int): boolean {
        return (DateTimeParse.SetDateYMD(result, year, month, day));
    }

    private static SetDateYDM(result: DateTimeResult, year: int, day: int, month: int): boolean {
        return (DateTimeParse.SetDateYMD(result, year, month, day));
    }

    private static GetDefaultYear(result: DateTimeResult, styles: DateTimeStyles): void {
        result.Year = result.calendar.GetYear(DateTimeParse.GetDateTimeNow(result, styles));
        result.flags |= ParseFlags.YearDefault;
    }

    // Processing teriminal case: DS.DX_NN
    private static GetDayOfNN(result: DateTimeResult, styles: DateTimeStyles, raw: DateTimeRawInfo, dtfi: DateTimeFormatInfo): boolean {

        if ((result.flags & ParseFlags.HaveDate) !== 0) {
            // Multiple dates in the input string
            result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
            return false;
        }

        const n1: int = raw.GetNumber(0);
        const n2: int = raw.GetNumber(1);

        DateTimeParse.GetDefaultYear(result, styles);

        let order: Out<int> = New.Out(0);
        if (!DateTimeParse.GetMonthDayOrder(dtfi.MonthDayPattern, dtfi, order)) {
            result.SetFailure(ParseFailureKind.FormatWithParameter, "Format_BadDatePattern", dtfi.MonthDayPattern);
            return false;
        }

        if (order.value === DateTimeParse.ORDER_MD) {
            if (DateTimeParse.SetDateYMD(result, result.Year, n1, n2))                           // MD
            {
                result.flags |= ParseFlags.HaveDate;
                return true;
            }
        } else {
            // ORDER_DM
            if (DateTimeParse.SetDateYMD(result, result.Year, n2, n1))                           // DM
            {
                result.flags |= ParseFlags.HaveDate;
                return true;
            }
        }
        result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
        return false;
    }

    // Processing teriminal case: DS.DX_NNN
    private static GetDayOfNNN(result: DateTimeResult, raw: DateTimeRawInfo, dtfi: DateTimeFormatInfo): boolean {
        if ((result.flags & ParseFlags.HaveDate) !== 0) {
            // Multiple dates in the input string
            result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
            return false;
        }

        let n1: int = raw.GetNumber(0);
        let n2: int = raw.GetNumber(1);;
        let n3: int = raw.GetNumber(2);

        const order: Out<int> = New.Out(0);
        if (!DateTimeParse.GetYearMonthDayOrder(dtfi.ShortDatePattern, dtfi, order)) {
            result.SetFailure(ParseFailureKind.FormatWithParameter, "Format_BadDatePattern", dtfi.ShortDatePattern);
            return false;
        }
        const year: Out<int> = New.Out(0);

        if (order.value === DateTimeParse.ORDER_YMD) {
            if (DateTimeParse.TryAdjustYear(result, n1, year) && DateTimeParse.SetDateYMD(result, year.value, n2, n3))         // YMD
            {
                result.flags |= ParseFlags.HaveDate;
                return true;
            }
        } else if (order.value === DateTimeParse.ORDER_MDY) {
            if (DateTimeParse.TryAdjustYear(result, n3, year) && DateTimeParse.SetDateMDY(result, n1, n2, year.value))         // MDY
            {
                result.flags |= ParseFlags.HaveDate;
                return true;
            }
        } else if (order.value === DateTimeParse.ORDER_DMY) {
            if (DateTimeParse.TryAdjustYear(result, n3, year) && DateTimeParse.SetDateDMY(result, n1, n2, year.value))         // DMY
            {
                result.flags |= ParseFlags.HaveDate;
                return true;
            }
        } else if (order.value === DateTimeParse.ORDER_YDM) {
            if (DateTimeParse.TryAdjustYear(result, n1, year) && DateTimeParse.SetDateYDM(result, year.value, n2, n3))         // YDM
            {
                result.flags |= ParseFlags.HaveDate;
                return true;
            }
        }
        result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
        return false;
    }

    private static GetDayOfMN(result: DateTimeResult, styles: DateTimeStyles, raw: DateTimeRawInfo, dtfi: DateTimeFormatInfo): boolean {

        if ((result.flags & ParseFlags.HaveDate) !== 0) {
            // Multiple dates in the input string
            result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
            return false;
        }

        // The interpretation is based on the MonthDayPattern and YearMonthPattern
        //
        //    MonthDayPattern   YearMonthPattern  Interpretation
        //    ---------------   ----------------  ---------------
        //    MMMM dd           MMMM yyyy         Day
        //    MMMM dd           yyyy MMMM         Day
        //    dd MMMM           MMMM yyyy         Year
        //    dd MMMM           yyyy MMMM         Day
        //
        // In the first and last cases, it could be either or neither, but a day is a better default interpretation
        // than a 2 digit year.

        const monthDayOrder: Out<int> = New.Out(0);
        if (!DateTimeParse.GetMonthDayOrder(dtfi.MonthDayPattern, dtfi, monthDayOrder)) {
            result.SetFailure(ParseFailureKind.FormatWithParameter, "Format_BadDatePattern", dtfi.MonthDayPattern);
            return false;
        }
        if (monthDayOrder.value === DateTimeParse.ORDER_DM) {
            const yearMonthOrder: Out<int> = New.Out(0);
            if (!DateTimeParse.GetYearMonthOrder(dtfi.YearMonthPattern, dtfi, yearMonthOrder)) {
                result.SetFailure(ParseFailureKind.FormatWithParameter, "Format_BadDatePattern", dtfi.YearMonthPattern);
                return false;
            }
            if (yearMonthOrder.value === DateTimeParse.ORDER_MY) {
                const year: Out<int> = New.Out(0);
                if (!DateTimeParse.TryAdjustYear(result, raw.GetNumber(0), year) || !DateTimeParse.SetDateYMD(result, year.value, raw.month, 1)) {
                    result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                    return false;
                }
                return true;
            }
        }

        DateTimeParse.GetDefaultYear(result, styles);
        if (!DateTimeParse.SetDateYMD(result, result.Year, raw.month, raw.GetNumber(0))) {
            result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
            return false;
        }
        return true;

    }

    ////////////////////////////////////////////////////////////////////////
    //  Actions:
    //  Deal with the terminal state for Hebrew Month/Day pattern
    //
    ////////////////////////////////////////////////////////////////////////

    private static GetHebrewDayOfNM(result: DateTimeResult, raw: DateTimeRawInfo, dtfi: DateTimeFormatInfo): boolean {
        const monthDayOrder: Out<int> = New.Out(0);
        if (!DateTimeParse.GetMonthDayOrder(dtfi.MonthDayPattern, dtfi, monthDayOrder)) {
            result.SetFailure(ParseFailureKind.FormatWithParameter, "Format_BadDatePattern", dtfi.MonthDayPattern);
            return false;
        }
        result.Month = raw.month;
        if (monthDayOrder.value === DateTimeParse.ORDER_DM || monthDayOrder.value === DateTimeParse.ORDER_MD) {
            if (result.calendar.IsValidDay(result.Year, result.Month, raw.GetNumber(0), result.era)) {
                result.Day = raw.GetNumber(0);
                return true;
            }
        }
        result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
        return false;
    }

    private static GetDayOfNM(result: DateTimeResult, styles: DateTimeStyles, raw: DateTimeRawInfo, dtfi: DateTimeFormatInfo): boolean {
        if ((result.flags & ParseFlags.HaveDate) != 0) {
            // Multiple dates in the input string
            result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
            return false;
        }

        // The interpretation is based on the MonthDayPattern and YearMonthPattern
        //
        //    MonthDayPattern   YearMonthPattern  Interpretation
        //    ---------------   ----------------  ---------------
        //    MMMM dd           MMMM yyyy         Day
        //    MMMM dd           yyyy MMMM         Year
        //    dd MMMM           MMMM yyyy         Day
        //    dd MMMM           yyyy MMMM         Day
        //
        // In the first and last cases, it could be either or neither, but a day is a better default interpretation
        // than a 2 digit year.

        const monthDayOrder: Out<int> = New.Out(0);
        if (!DateTimeParse.GetMonthDayOrder(dtfi.MonthDayPattern, dtfi, monthDayOrder)) {
            result.SetFailure(ParseFailureKind.FormatWithParameter, "Format_BadDatePattern", dtfi.MonthDayPattern);
            return false;
        }
        if (monthDayOrder.value === DateTimeParse.ORDER_MD) {
            const yearMonthOrder: Out<int> = New.Out(0);
            if (!DateTimeParse.GetYearMonthOrder(dtfi.YearMonthPattern, dtfi, yearMonthOrder)) {
                result.SetFailure(ParseFailureKind.FormatWithParameter, "Format_BadDatePattern", dtfi.YearMonthPattern);
                return false;
            }
            if (yearMonthOrder.value === DateTimeParse.ORDER_YM) {
                const year: Out<int> = New.Out(0);
                if (!DateTimeParse.TryAdjustYear(result, raw.GetNumber(0), year) || !DateTimeParse.SetDateYMD(result, year.value, raw.month, 1)) {
                    result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                    return false;
                }
                return true;
            }
        }

        DateTimeParse.GetDefaultYear(result, styles);
        if (!DateTimeParse.SetDateYMD(result, result.Year, raw.month, raw.GetNumber(0))) {
            result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
            return false;
        }
        return true;
    }

    private static GetDayOfMNN(result: DateTimeResult, raw: DateTimeRawInfo, dtfi: DateTimeFormatInfo): boolean {
        if ((result.flags & ParseFlags.HaveDate) != 0) {
            // Multiple dates in the input string
            result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
            return false;
        }

        let n1: int = raw.GetNumber(0);
        let n2: int = raw.GetNumber(1);

        const order: Out<int> = New.Out(0);
        if (!DateTimeParse.GetYearMonthDayOrder(dtfi.ShortDatePattern, dtfi, order)) {
            result.SetFailure(ParseFailureKind.FormatWithParameter, "Format_BadDatePattern", dtfi.ShortDatePattern);
            return false;
        }
        const year: Out<int> = New.Out(0);

        if (order.value === DateTimeParse.ORDER_MDY) {
            if (DateTimeParse.TryAdjustYear(result, n2, year) && result.calendar.IsValidDay(year.value, raw.month, n1, result.era)) {
                result.SetDate(year.value, raw.month, n1);      // MDY
                result.flags |= ParseFlags.HaveDate;
                return true;
            }
            else if (DateTimeParse.TryAdjustYear(result, n1, year) && result.calendar.IsValidDay(year.value, raw.month, n2, result.era)) {
                result.SetDate(year.value, raw.month, n2);      // YMD
                result.flags |= ParseFlags.HaveDate;
                return true;
            }
        }
        else if (order.value === DateTimeParse.ORDER_YMD) {
            if (DateTimeParse.TryAdjustYear(result, n1, year) && result.calendar.IsValidDay(year.value, raw.month, n2, result.era)) {
                result.SetDate(year.value, raw.month, n2);      // YMD
                result.flags |= ParseFlags.HaveDate;
                return true;
            }
            else if (DateTimeParse.TryAdjustYear(result, n2, year) && result.calendar.IsValidDay(year.value, raw.month, n1, result.era)) {
                result.SetDate(year.value, raw.month, n1);      // DMY
                result.flags |= ParseFlags.HaveDate;
                return true;
            }
        }
        else if (order.value === DateTimeParse.ORDER_DMY) {
            if (DateTimeParse.TryAdjustYear(result, n2, year) && result.calendar.IsValidDay(year.value, raw.month, n1, result.era)) {
                result.SetDate(year.value, raw.month, n1);      // DMY
                result.flags |= ParseFlags.HaveDate;
                return true;
            }
            else if (DateTimeParse.TryAdjustYear(result, n1, year) && result.calendar.IsValidDay(year.value, raw.month, n2, result.era)) {
                result.SetDate(year.value, raw.month, n2);      // YMD
                result.flags |= ParseFlags.HaveDate;
                return true;
            }
        }

        result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
        return false;
    }

    private static GetDayOfYNN(result: DateTimeResult, raw: DateTimeRawInfo, dtfi: DateTimeFormatInfo): boolean {

        if ((result.flags & ParseFlags.HaveDate) !== 0) {
            // Multiple dates in the input string
            result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
            return false;
        }

        let n1: int = raw.GetNumber(0);
        let n2: int = raw.GetNumber(1);
        const pattern: string = dtfi.ShortDatePattern;

        // For compatability, don't throw if we can't determine the order, but default to YMD instead
        const order: Out<int> = New.Out(0);
        if (DateTimeParse.GetYearMonthDayOrder(pattern, dtfi, order) && order.value === DateTimeParse.ORDER_YDM) {
            if (DateTimeParse.SetDateYMD(result, raw.year, n2, n1)) {
                result.flags |= ParseFlags.HaveDate;
                return true; // Year + DM
            }
        }
        else {
            if (DateTimeParse.SetDateYMD(result, raw.year, n1, n2)) {
                result.flags |= ParseFlags.HaveDate;
                return true; // Year + MD
            }
        }
        result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
        return false;
    }

    private static GetDayOfNNY(result: DateTimeResult, raw: DateTimeRawInfo, dtfi: DateTimeFormatInfo): boolean {

        if ((result.flags & ParseFlags.HaveDate) != 0) {
            // Multiple dates in the input string
            result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
            return false;
        }

        const n1: int = raw.GetNumber(0);
        const n2: int = raw.GetNumber(1);

        const order: Out<int> = New.Out(0);
        if (!DateTimeParse.GetYearMonthDayOrder(dtfi.ShortDatePattern, dtfi, order)) {
            result.SetFailure(ParseFailureKind.FormatWithParameter, "Format_BadDatePattern", dtfi.ShortDatePattern);
            return false;
        }

        if (order.value === DateTimeParse.ORDER_MDY || order.value === DateTimeParse.ORDER_YMD) {
            if (DateTimeParse.SetDateYMD(result, raw.year, n1, n2)) {
                result.flags |= ParseFlags.HaveDate;
                return true; // MD + Year
            }
        } else {
            if (DateTimeParse.SetDateYMD(result, raw.year, n2, n1)) {
                result.flags |= ParseFlags.HaveDate;
                return true; // DM + Year
            }
        }
        result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
        return false;
    }


    private static GetDayOfYMN(result: DateTimeResult, raw: DateTimeRawInfo, dtfi: DateTimeFormatInfo): boolean {

        if ((result.flags & ParseFlags.HaveDate) !== 0) {
            // Multiple dates in the input string
            result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
            return false;
        }

        if (DateTimeParse.SetDateYMD(result, raw.year, raw.month, raw.GetNumber(0))) {
            result.flags |= ParseFlags.HaveDate;
            return true;
        }
        result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
        return false;
    }

    private static GetDayOfYN(result: DateTimeResult, raw: DateTimeRawInfo, dtfi: DateTimeFormatInfo): boolean {
        if ((result.flags & ParseFlags.HaveDate) !== 0) {
            // Multiple dates in the input string
            result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
            return false;
        }

        if (DateTimeParse.SetDateYMD(result, raw.year, raw.GetNumber(0), 1)) {
            result.flags |= ParseFlags.HaveDate;
            return true;
        }
        result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
        return false;
    }

    private static GetDayOfYM(result: DateTimeResult, raw: DateTimeRawInfo, dtfi: DateTimeFormatInfo): boolean {
        if ((result.flags & ParseFlags.HaveDate) !== 0) {
            // Multiple dates in the input string
            result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
            return false;
        }

        if (DateTimeParse.SetDateYMD(result, raw.year, raw.month, 1)) {
            result.flags |= ParseFlags.HaveDate;
            return true;
        }
        result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
        return false;
    }

    private static AdjustTimeMark(dtfi: DateTimeFormatInfo, raw: DateTimeRawInfo): void {
        // Specail case for culture which uses AM as empty string.
        // E.g. af-ZA (0x0436)
        //    S1159                  \x0000
        //    S2359                  nm
        // In this case, if we are parsing a string like "2005/09/14 12:23", we will assume this is in AM.

        if (raw.timeMark === TM.NotSet) {
            if (dtfi.AMDesignator != null && dtfi.PMDesignator != null) {
                if (dtfi.AMDesignator.length === 0 && dtfi.PMDesignator.length !== 0) {
                    raw.timeMark = TM.AM;
                }
                if (dtfi.PMDesignator.length === 0 && dtfi.AMDesignator.length !== 0) {
                    raw.timeMark = TM.PM;
                }
            }
        }
    }

    //
    // Adjust hour according to the time mark.
    //
    private static AdjustHour(hour: Out<int>, timeMark: TM): boolean {
        if (timeMark !== TM.NotSet) {

            if (timeMark === TM.AM) {
                if (hour.value < 0 || hour.value > 12) {
                    return false;
                }
                hour.value = (hour.value === 12) ? 0 : hour.value;
            }
            else {
                if (hour.value < 0 || hour.value > 23) {
                    return false;
                }
                if (hour.value < 12) {
                    hour.value += 12;
                }
            }
        }
        return true;
    }

    private static GetTimeOfN(dtfi: DateTimeFormatInfo, result: DateTimeResult, raw: DateTimeRawInfo): boolean {
        if ((result.flags & ParseFlags.HaveTime) !== 0) {
            // Multiple times in the input string
            result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
            return false;
        }
        //
        // In this case, we need a time mark. Check if so.
        //
        if (raw.timeMark === TM.NotSet) {
            result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
            return false;
        }

        result.Hour = raw.GetNumber(0);
        result.flags |= ParseFlags.HaveTime;
        return true;
    }

    private static GetTimeOfNN(dtfi: DateTimeFormatInfo, result: DateTimeResult, raw: DateTimeRawInfo): boolean {
        //Contract.Assert(raw.numCount >= 2, "raw.numCount >= 2");
        if ((result.flags & ParseFlags.HaveTime) !== 0) {
            // Multiple times in the input string
            result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
            return false;
        }

        result.Hour = raw.GetNumber(0);
        result.Minute = raw.GetNumber(1);
        result.flags |= ParseFlags.HaveTime;
        return true;
    }

    private static GetTimeOfNNN(dtfi: DateTimeFormatInfo, result: DateTimeResult, raw: DateTimeRawInfo): boolean {
        if ((result.flags & ParseFlags.HaveTime) !== 0) {
            // Multiple times in the input string
            result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
            return false;
        }
        //Contract.Assert(raw.numCount >= 3, "raw.numCount >= 3");
        result.Hour = raw.GetNumber(0);
        result.Minute = raw.GetNumber(1);
        result.Second = raw.GetNumber(2);
        result.flags |= ParseFlags.HaveTime;
        return true;
    }

    //
    // Processing terminal state: A Date suffix followed by one number.
    //
    private static GetDateOfDSN(result: DateTimeResult, raw: DateTimeRawInfo): boolean {
        if (raw.numCount !== 1 || result.Day !== -1) {
            result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
            return false;
        }
        result.Day = raw.GetNumber(0);
        return true;
    }

    private static GetDateOfNDS(result: DateTimeResult, raw: DateTimeRawInfo): boolean {
        if (result.Month === -1) {
            //Should have a month suffix
            result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
            return false;
        }
        if (result.Year !== -1) {
            // Aleady has a year suffix
            result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
            return false;
        }
        const year: Out<int> = New.Out(result.Year);
        if (!DateTimeParse.TryAdjustYear(result, raw.GetNumber(0), year)) {
            result.Year = year.value;
            // the year value is out of range
            result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
            return false;
        }
        result.Day = 1;
        return true;
    }

    private static GetDateOfNNDS(result: DateTimeResult, raw: DateTimeRawInfo, dtfi: DateTimeFormatInfo): boolean {

        // For partial CJK Dates, the only valid formats are with a specified year, followed by two numbers, which
        // will be the Month and Day, and with a specified Month, when the numbers are either the year and day or
        // day and year, depending on the short date pattern.

        if ((result.flags & ParseFlags.HaveYear) != 0) {
            if (((result.flags & ParseFlags.HaveMonth) == 0) && ((result.flags & ParseFlags.HaveDay) == 0)) {
                const year: Out<int> = New.Out(result.Year);
                if (DateTimeParse.TryAdjustYear(result, raw.year, year) && DateTimeParse.SetDateYMD(result, result.Year, raw.GetNumber(0), raw.GetNumber(1))) {
                    result.Year = year.value;
                    return true;
                }
            }
        }
        else if ((result.flags & ParseFlags.HaveMonth) !== 0) {
            if (((result.flags & ParseFlags.HaveYear) === 0) && ((result.flags & ParseFlags.HaveDay) === 0)) {
                const order: Out<int> = New.Out(0);
                if (!DateTimeParse.GetYearMonthDayOrder(dtfi.ShortDatePattern, dtfi, order)) {
                    result.SetFailure(ParseFailureKind.FormatWithParameter, "Format_BadDatePattern", dtfi.ShortDatePattern);
                    return false;
                }
                const year: Out<int> = New.Out(0);
                if (order.value === DateTimeParse.ORDER_YMD) {
                    if (DateTimeParse.TryAdjustYear(result, raw.GetNumber(0), year) && DateTimeParse.SetDateYMD(result, year.value, result.Month, raw.GetNumber(1))) {
                        return true;
                    }
                }
                else {
                    if (DateTimeParse.TryAdjustYear(result, raw.GetNumber(1), year) && DateTimeParse.SetDateYMD(result, year.value, result.Month, raw.GetNumber(0))) {
                        return true;
                    }
                }
            }
        }
        result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
        return false;
    }

    //
    // A date suffix is found, use this method to put the number into the result.
    //
    private static ProcessDateTimeSuffix(result: DateTimeResult, raw: DateTimeRawInfo, dtok: DateTimeToken): boolean {
        switch (dtok.suffix) {
            case TokenType.SEP_YearSuff:
                if ((result.flags & ParseFlags.HaveYear) !== 0) {
                    return false;
                }
                result.flags |= ParseFlags.HaveYear;
                result.Year = raw.year = dtok.num;
                break;
            case TokenType.SEP_MonthSuff:
                if ((result.flags & ParseFlags.HaveMonth) !== 0) {
                    return false;
                }
                result.flags |= ParseFlags.HaveMonth;
                result.Month = raw.month = dtok.num;
                break;
            case TokenType.SEP_DaySuff:
                if ((result.flags & ParseFlags.HaveDay) !== 0) {
                    return false;
                }
                result.flags |= ParseFlags.HaveDay;
                result.Day = dtok.num;
                break;
            case TokenType.SEP_HourSuff:
                if ((result.flags & ParseFlags.HaveHour) !== 0) {
                    return false;
                }
                result.flags |= ParseFlags.HaveHour;
                result.Hour = dtok.num;
                break;
            case TokenType.SEP_MinuteSuff:
                if ((result.flags & ParseFlags.HaveMinute) !== 0) {
                    return false;
                }
                result.flags |= ParseFlags.HaveMinute;
                result.Minute = dtok.num;
                break;
            case TokenType.SEP_SecondSuff:
                if ((result.flags & ParseFlags.HaveSecond) !== 0) {
                    return false;
                }
                result.flags |= ParseFlags.HaveSecond;
                result.Second = dtok.num;
                break;
        }
        return true;

    }

    ////////////////////////////////////////////////////////////////////////
    //
    // Actions:
    // This is used by DateTime.Parse().
    // Process the terminal state for the Hebrew calendar parsing.
    //
    ////////////////////////////////////////////////////////////////////////

    public /* internal */ static ProcessHebrewTerminalState(dps: DS, result: DateTimeResult, styles: DateTimeStyles, raw: DateTimeRawInfo, dtfi: DateTimeFormatInfo): boolean {
        // The following are accepted terminal state for Hebrew date.
        switch (dps) {
            case DS.DX_MNN:
                // Deal with the default long/short date format when the year number is ambigous (i.e. year < 100).
                raw.year = raw.GetNumber(1);
                const _year: Out<int> = New.Out(raw.year);
                const _month: Out<int> = New.Out(raw.month);
                if (!dtfi.YearMonthAdjustment(_year, _month, true)) {
                    raw.year = _year.value;
                    raw.month = _month.value;
                    result.SetFailure(ParseFailureKind.FormatBadDateTimeCalendar, "Format_BadDateTimeCalendar", null);
                    return false;
                }
                if (!DateTimeParse.GetDayOfMNN(result, raw, dtfi)) {
                    return false;
                }
                break;
            case DS.DX_YMN:
                // Deal with the default long/short date format when the year number is NOT ambigous (i.e. year >= 100).
                const __year: Out<int> = New.Out(raw.year);
                const __month: Out<int> = New.Out(raw.month);
                if (!dtfi.YearMonthAdjustment(__year, __month, true)) {
                    raw.year = __year.value;
                    raw.month = __month.value;
                    result.SetFailure(ParseFailureKind.FormatBadDateTimeCalendar, "Format_BadDateTimeCalendar", null);
                    return false;
                }
                if (!DateTimeParse.GetDayOfYMN(result, raw, dtfi)) {
                    return false;
                }
                break;
            case DS.DX_NM:
            case DS.DX_MN:
                // Deal with Month/Day pattern.
                DateTimeParse.GetDefaultYear(result, styles);
                const ___year: Out<int> = New.Out(result.Year);
                const ___month: Out<int> = New.Out(raw.month);
                if (!dtfi.YearMonthAdjustment(___year, ___month, true)) {
                    result.Year = ___year.value;
                    raw.month = ___month.value;
                    result.SetFailure(ParseFailureKind.FormatBadDateTimeCalendar, "Format_BadDateTimeCalendar", null);
                    return false;
                }
                if (!DateTimeParse.GetHebrewDayOfNM(result, raw, dtfi)) {
                    return false;
                }
                break;
            case DS.DX_YM:
                // Deal with Year/Month pattern.
                const ____year: Out<int> = New.Out(raw.year);
                const ____month: Out<int> = New.Out(raw.month);
                if (!dtfi.YearMonthAdjustment(____year, ____month, true)) {
                    raw.year = ____year.value;
                    raw.month = ____month.value;
                    result.SetFailure(ParseFailureKind.FormatBadDateTimeCalendar, "Format_BadDateTimeCalendar", null);
                    return false;
                }
                if (!DateTimeParse.GetDayOfYM(result, raw, dtfi)) {
                    return false;
                }
                break;
            case DS.TX_N:
                // Deal hour + AM/PM
                if (!DateTimeParse.GetTimeOfN(dtfi, result, raw)) {
                    return false;
                }
                break;
            case DS.TX_NN:
                if (!DateTimeParse.GetTimeOfNN(dtfi, result, raw)) {
                    return false;
                }
                break;
            case DS.TX_NNN:
                if (!DateTimeParse.GetTimeOfNNN(dtfi, result, raw)) {
                    return false;
                }
                break;
            default:
                result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                return false;

        }
        if (dps > DS.ERROR) {
            //
            // We have reached a terminal state. Reset the raw num count.
            //
            raw.numCount = 0;
        }
        return true;
    }

    //
    // A terminal state has been reached, call the appropriate function to fill in the parsing result.
    // Return true if the state is a terminal state.
    //
    public /* internal */ static ProcessTerminaltState(dps: DS, result: DateTimeResult, styles: DateTimeStyles, raw: DateTimeRawInfo, dtfi: DateTimeFormatInfo): boolean {

        let passed: boolean = true;
        switch (dps) {
            case DS.DX_NN:
                passed = DateTimeParse.GetDayOfNN(result, styles, raw, dtfi);
                break;
            case DS.DX_NNN:
                passed = DateTimeParse.GetDayOfNNN(result, raw, dtfi);
                break;
            case DS.DX_MN:
                passed = DateTimeParse.GetDayOfMN(result, styles, raw, dtfi);
                break;
            case DS.DX_NM:
                passed = DateTimeParse.GetDayOfNM(result, styles, raw, dtfi);
                break;
            case DS.DX_MNN:
                passed = DateTimeParse.GetDayOfMNN(result, raw, dtfi);
                break;
            case DS.DX_DS:
                // The result has got the correct value. No need to process.
                passed = true;
                break;
            case DS.DX_YNN:
                passed = DateTimeParse.GetDayOfYNN(result, raw, dtfi);
                break;
            case DS.DX_NNY:
                passed = DateTimeParse.GetDayOfNNY(result, raw, dtfi);
                break;
            case DS.DX_YMN:
                passed = DateTimeParse.GetDayOfYMN(result, raw, dtfi);
                break;
            case DS.DX_YN:
                passed = DateTimeParse.GetDayOfYN(result, raw, dtfi);
                break;
            case DS.DX_YM:
                passed = DateTimeParse.GetDayOfYM(result, raw, dtfi);
                break;
            case DS.TX_N:
                passed = DateTimeParse.GetTimeOfN(dtfi, result, raw);
                break;
            case DS.TX_NN:
                passed = DateTimeParse.GetTimeOfNN(dtfi, result, raw);
                break;
            case DS.TX_NNN:
                passed = DateTimeParse.GetTimeOfNNN(dtfi, result, raw);
                break;
            case DS.TX_TS:
                // The result has got the correct value. Nothing to do.
                passed = true;
                break;
            case DS.DX_DSN:
                passed = DateTimeParse.GetDateOfDSN(result, raw);
                break;
            case DS.DX_NDS:
                passed = DateTimeParse.GetDateOfNDS(result, raw);
                break;
            case DS.DX_NNDS:
                passed = DateTimeParse.GetDateOfNNDS(result, raw, dtfi);
                break;
        }

        DateTimeParse.PTSTraceExit(dps, passed);
        if (!passed) {
            return false;
        }

        if (dps > DS.ERROR) {
            //
            // We have reached a terminal state. Reset the raw num count.
            //
            raw.numCount = 0;
        }
        return true;
    }

    public /* internal */ static Parse(s: string, dtfi: DateTimeFormatInfo, styles: DateTimeStyles): DateTime;
    public /* internal */ static Parse(s: string, dtfi: DateTimeFormatInfo, styles: DateTimeStyles, offset: Out<TimeSpan>): DateTime;
    public /* internal */ static Parse(...args: any[]): DateTime {
        if (args.length === 3) {
            const s: string = args[0];
            const dtfi: DateTimeFormatInfo = args[1];
            const styles: DateTimeStyles = args[2];
            const result: DateTimeResult = new DateTimeResult();       // The buffer to store the parsing result.
            result.Init();
            if (DateTimeParse.TryParse(s, dtfi, styles, result)) {
                return result.parsedDate;
            }
            else {
                throw DateTimeParse.GetDateTimeParseException(result);
            }
        } else if (args.length === 4) {
            const s: string = args[0];
            const dtfi: DateTimeFormatInfo = args[1];
            const styles: DateTimeStyles = args[2];
            const offset: Out<TimeSpan> = args[3];
            const result: DateTimeResult = new DateTimeResult();       // The buffer to store the parsing result.
            result.Init();
            result.flags |= ParseFlags.CaptureOffset;
            if (DateTimeParse.TryParse(s, dtfi, styles, result)) {
                offset.value = result.timeZoneOffset;
                return result.parsedDate;
            }
            else {
                throw DateTimeParse.GetDateTimeParseException(result);
            }
        }
        throw new ArgumentException('');
    }

    public/* internal */ static TryParse(s: string, dtfi: DateTimeFormatInfo, styles: DateTimeStyles, result: Out<DateTime>): boolean;
    public /* internal */ static TryParse(s: string, dtfi: DateTimeFormatInfo, styles: DateTimeStyles, result: Out<DateTime>, offset: Out<TimeSpan>): boolean;
    public /* internal */ static TryParse(s: string, dtfi: DateTimeFormatInfo, styles: DateTimeStyles, result: DateTimeResult): boolean;
    public/* internal */ static TryParse(...args: any[]): boolean {
        if (args.length === 4 && is.string(args[0]) && is.typeof<DateTimeFormatInfo>(args[1], System.Types.Globalization.DateTimeFormatInfo) && is.int(args[3]) && is.typeof<DateTimeResult>(args[3], System.Types.Globalization.DateTimeResult)) {
            const s: string = args[0];
            const dtfi: DateTimeFormatInfo = args[1];
            const styles: DateTimeStyles = args[2];
            const result: DateTimeResult = args[3];
            if (s == null) {
                result.SetFailure(ParseFailureKind.ArgumentNull, "ArgumentNull_String", null, "s");
                return false;
            }
            if (s.length === 0) {
                result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                return false;
            }

            //Contract.Assert(dtfi != null, "dtfi == null");

            let time: Out<DateTime> = New.Out(null as any);
            //
            // First try the predefined format.
            //
            //<

            let dps: DS = DS.BEGIN;     // Date Parsing State.
            let reachTerminalState: boolean = false;

            const dtok: DateTimeToken = new DateTimeToken();      // The buffer to store the parsing token.
            dtok.suffix = TokenType.SEP_Unk;
            const raw: DateTimeRawInfo = new DateTimeRawInfo();    // The buffer to store temporary parsing information.
            const numberPointer: IntArray = New.IntArray(3);
            raw.Init(numberPointer);
            raw.hasSameDateAndTimeSeparators = dtfi.DateSeparator === dtfi.TimeSeparator/* , StringComparison.Ordinal) */;

            result.calendar = dtfi.Calendar;
            result.era = Calendar.CurrentEra;

            //
            // The string to be parsed. Use a __DTString wrapper so that we can trace the index which
            // indicates the begining of next token.
            //
            const str: __DTString = new __DTString(s, dtfi);

            str.GetNext();

            //
            // The following loop will break out when we reach the end of the str.
            //
            do {
                //
                // Call the lexer to get the next token.
                //
                // If we find a era in Lex(), the era value will be in raw.era.
                if (!DateTimeParse.Lex(dps, str, dtok, raw, result, dtfi, styles)) {
                    DateTimeParse.TPTraceExit("0000", dps);
                    return false;
                }

                //
                // If the token is not unknown, process it.
                // Otherwise, just discard it.
                //
                if (dtok.dtt !== DTT.Unk) {
                    //
                    // Check if we got any CJK Date/Time suffix.
                    // Since the Date/Time suffix tells us the number belongs to year/month/day/hour/minute/second,
                    // store the number in the appropriate field in the result.
                    //
                    if (dtok.suffix !== TokenType.SEP_Unk) {
                        if (!DateTimeParse.ProcessDateTimeSuffix(result, raw, dtok)) {
                            result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                            DateTimeParse.TPTraceExit("0010", dps);
                            return false;
                        }

                        dtok.suffix = TokenType.SEP_Unk;  // Reset suffix to SEP_Unk;
                    }

                    if (dtok.dtt === DTT.NumLocalTimeMark) {
                        if (dps === DS.D_YNd || dps == DS.D_YN) {
                            // Consider this as ISO 8601 format:
                            // "yyyy-MM-dd'T'HH:mm:ss"                 1999-10-31T02:00:00
                            DateTimeParse.TPTraceExit("0020", dps);
                            return (DateTimeParse.ParseISO8601(raw, str, styles, result));
                        }
                        else {
                            result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                            DateTimeParse.TPTraceExit("0030", dps);
                            return false;
                        }
                    }

                    if (raw.hasSameDateAndTimeSeparators) {
                        if (dtok.dtt === DTT.YearEnd || dtok.dtt === DTT.YearSpace || dtok.dtt === DTT.YearDateSep) {
                            // When time and date separators are same and we are hitting a year number while the first parsed part of the string was recognized
                            // as part of time (and not a date) DS.T_Nt, DS.T_NNt then change the state to be a date so we try to parse it as a date instead
                            if (dps === DS.T_Nt) {
                                dps = DS.D_Nd;
                            }
                            if (dps === DS.T_NNt) {
                                dps = DS.D_NNd;
                            }
                        }

                        const atEnd: boolean = str.AtEnd();
                        if (DateTimeParse.dateParsingStates[dps][dtok.dtt] === DS.ERROR || atEnd) {
                            switch (dtok.dtt) {
                                // we have the case of Serbia have dates in forms 'd.M.yyyy.' so we can expect '.' after the date parts.
                                // changing the token to end with space instead of Date Separator will avoid failing the parsing.

                                case DTT.YearDateSep: dtok.dtt = atEnd ? DTT.YearEnd : DTT.YearSpace; break;
                                case DTT.NumDatesep: dtok.dtt = atEnd ? DTT.NumEnd : DTT.NumSpace; break;
                                case DTT.NumTimesep: dtok.dtt = atEnd ? DTT.NumEnd : DTT.NumSpace; break;
                                case DTT.MonthDatesep: dtok.dtt = atEnd ? DTT.MonthEnd : DTT.MonthSpace; break;
                            }
                        }
                    }

                    //
                    // Advance to the next state, and continue
                    //
                    dps = DateTimeParse.dateParsingStates[dps][dtok.dtt];

                    if (dps === DS.ERROR) {
                        result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                        DateTimeParse.TPTraceExit("0040 (invalid state transition)", dps);
                        return false;
                    }
                    else if (dps > DS.ERROR) {
                        if ((dtfi.FormatFlags & DateTimeFormatFlags.UseHebrewRule) != 0) {
                            if (!DateTimeParse.ProcessHebrewTerminalState(dps, result, styles, raw, dtfi)) {
                                DateTimeParse.TPTraceExit("0050 (ProcessHebrewTerminalState)", dps);
                                return false;
                            }
                        } else {
                            if (!DateTimeParse.ProcessTerminaltState(dps, result, styles, raw, dtfi)) {
                                DateTimeParse.TPTraceExit("0060 (ProcessTerminaltState)", dps);
                                return false;
                            }
                        }
                        reachTerminalState = true;

                        //
                        // If we have reached a terminal state, start over from DS.BEGIN again.
                        // For example, when we parsed "1999-12-23 13:30", we will reach a terminal state at "1999-12-23",
                        // and we start over so we can continue to parse "12:30".
                        //
                        dps = DS.BEGIN;
                    }
                }
            } while (dtok.dtt !== DTT.End && dtok.dtt !== DTT.NumEnd && dtok.dtt !== DTT.MonthEnd);

            if (!reachTerminalState) {
                result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                DateTimeParse.TPTraceExit("0070 (did not reach terminal state)", dps);
                return false;
            }

            DateTimeParse.AdjustTimeMark(dtfi, raw);
            const _hour: Out<int> = New.Out(result.Hour);
            if (!DateTimeParse.AdjustHour(_hour, raw.timeMark)) {
                result.Hour = _hour.value;
                result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                DateTimeParse.TPTraceExit("0080 (AdjustHour)", dps);
                return false;
            }

            // Check if the parsed string only contains hour/minute/second values.
            const bTimeOnly: boolean = (result.Year === -1 && result.Month === -1 && result.Day === -1);

            //
            // Check if any year/month/day is missing in the parsing string.
            // If yes, get the default value from today's date.
            //
            if (!DateTimeParse.CheckDefaultDateTime(result, result.calendar, styles)) {
                DateTimeParse.TPTraceExit("0090 (failed to fill in missing year/month/day defaults)", dps);
                return false;
            }

            if (!result.calendar.TryToDateTime(result.Year, result.Month, result.Day,
                result.Hour, result.Minute, result.Second, 0, result.era, time)) {
                result.SetFailure(ParseFailureKind.FormatBadDateTimeCalendar, "Format_BadDateTimeCalendar", null);
                DateTimeParse.TPTraceExit("0100 (result.calendar.TryToDateTime)", dps);
                return false;
            }
            if (raw.fraction > 0) {
                time.value = time.value.AddTicks(Convert.ToLong(/* Math.round( */Calendar.TicksPerSecond.mul(raw.fraction)/* ) */));
            }

            //
            // We have to check day of week before we adjust to the time zone.
            // Otherwise, the value of day of week may change after adjustting to the time zone.
            //
            if (raw.dayOfWeek !== -1) {
                //
                // Check if day of week is correct.
                //
                if (raw.dayOfWeek !== Convert.ToInt32(result.calendar.GetDayOfWeek(time.value))) {
                    result.SetFailure(ParseFailureKind.Format, "Format_BadDayOfWeek", null);
                    DateTimeParse.TPTraceExit("0110 (dayOfWeek check)", dps);
                    return false;
                }
            }

            result.parsedDate = time.value;

            if (!DateTimeParse.DetermineTimeZoneAdjustments(result, styles, bTimeOnly)) {
                DateTimeParse.TPTraceExit("0120 (DetermineTimeZoneAdjustments)", dps);
                return false;
            }
            DateTimeParse.TPTraceExit("0130 (success)", dps);
            return true;
        } else if (args.length === 4) {
            const s: string = args[0];
            const dtfi: DateTimeFormatInfo = args[1];
            const styles: DateTimeStyles = args[2];
            const result: Out<DateTime> = args[3];
            result.value = DateTime.MinValue;
            const resultData: DateTimeResult = new DateTimeResult();       // The buffer to store the parsing result.
            resultData.Init();
            if (DateTimeParse.TryParse(s, dtfi, styles, resultData)) {
                result.value = resultData.parsedDate;
                return true;
            }
            return false;
        } else if (args.length === 5) {
            const s: string = args[0];
            const dtfi: DateTimeFormatInfo = args[1];
            const styles: DateTimeStyles = args[2];
            const result: Out<DateTime> = args[3];
            const offset: Out<TimeSpan> = args[4]
            result.value = DateTime.MinValue;
            offset.value = TimeSpan.Zero;
            const parseResult: DateTimeResult = new DateTimeResult();       // The buffer to store the parsing result.
            parseResult.Init();
            parseResult.flags |= ParseFlags.CaptureOffset;
            if (DateTimeParse.TryParse(s, dtfi, styles, parseResult)) {
                result.value = parseResult.parsedDate;
                offset.value = parseResult.timeZoneOffset;
                return true;
            }
            return false;
        }
        throw new ArgumentException('');
    }

    // Handles time zone adjustments and sets DateTimeKind values as required by the styles
    private static DetermineTimeZoneAdjustments(result: DateTimeResult, styles: DateTimeStyles, bTimeOnly: boolean): boolean {

        if ((result.flags & ParseFlags.CaptureOffset) !== 0) {
            // This is a DateTimeOffset parse, so the offset will actually be captured directly, and
            // no adjustment is required in most cases
            return DateTimeParse.DateTimeOffsetTimeZonePostProcessing(result, styles);
        }
        else {
            const offsetTicks: long = result.timeZoneOffset.Ticks;

            // the DateTime offset must be within +- 14:00 hours.
            if (offsetTicks.lessThan(DateTimeOffset.MinOffset) || offsetTicks.greaterThan(DateTimeOffset.MaxOffset)) {
                result.SetFailure(ParseFailureKind.Format, "Format_OffsetOutOfRange", null);
                return false;
            }
        }

        // The flags AssumeUniveral and AssumeLocal only apply when the input does not have a time zone
        if ((result.flags & ParseFlags.TimeZoneUsed) === 0) {

            // If AssumeLocal or AssumeLocal is used, there will always be a kind specified. As in the
            // case when a time zone is present, it will default to being local unless AdjustToUniversal
            // is present. These comparisons determine whether setting the kind is sufficient, or if a
            // time zone adjustment is required. For consistentcy with the rest of parsing, it is desirable
            // to fall through to the Adjust methods below, so that there is consist handling of boundary
            // cases like wrapping around on time-only dates and temporarily allowing an adjusted date
            // to exceed DateTime.MaxValue
            if ((styles & DateTimeStyles.AssumeLocal) !== 0) {
                if ((styles & DateTimeStyles.AdjustToUniversal) !== 0) {
                    result.flags |= ParseFlags.TimeZoneUsed;
                    result.timeZoneOffset = TimeZoneInfo.GetLocalUtcOffset(result.parsedDate, TimeZoneInfoOptions.NoThrowOnInvalidTime);
                }
                else {
                    result.parsedDate = DateTime.SpecifyKind(result.parsedDate, DateTimeKind.Local);
                    return true;
                }
            }
            else if ((styles & DateTimeStyles.AssumeUniversal) !== 0) {
                if ((styles & DateTimeStyles.AdjustToUniversal) !== 0) {
                    result.parsedDate = DateTime.SpecifyKind(result.parsedDate, DateTimeKind.Utc);
                    return true;
                }
                else {
                    result.flags |= ParseFlags.TimeZoneUsed;
                    result.timeZoneOffset = TimeSpan.Zero;
                }
            }
            else {
                // No time zone and no Assume flags, so DateTimeKind.Unspecified is fine
                //Contract.Assert(result.parsedDate.Kind == DateTimeKind.Unspecified, "result.parsedDate.Kind == DateTimeKind.Unspecified");
                return true;
            }
        }

        if (((styles & DateTimeStyles.RoundtripKind) !== 0) && ((result.flags & ParseFlags.TimeZoneUtc) !== 0)) {
            result.parsedDate = DateTime.SpecifyKind(result.parsedDate, DateTimeKind.Utc);
            return true;
        }

        if ((styles & DateTimeStyles.AdjustToUniversal) != 0) {
            return (DateTimeParse.AdjustTimeZoneToUniversal(result));
        }
        return (DateTimeParse.AdjustTimeZoneToLocal(result, bTimeOnly));
    }

    // Apply validation and adjustments specific to DateTimeOffset
    private static DateTimeOffsetTimeZonePostProcessing(result: DateTimeResult, styles: DateTimeStyles): boolean {

        // For DateTimeOffset, default to the Utc or Local offset when an offset was not specified by
        // the input string.
        if ((result.flags & ParseFlags.TimeZoneUsed) === 0) {
            if ((styles & DateTimeStyles.AssumeUniversal) !== 0) {
                // AssumeUniversal causes the offset to default to zero (0)
                result.timeZoneOffset = TimeSpan.Zero;
            }
            else {
                // AssumeLocal causes the offset to default to Local.  This flag is on by default for DateTimeOffset.
                result.timeZoneOffset = TimeZoneInfo.GetLocalUtcOffset(result.parsedDate, TimeZoneInfoOptions.NoThrowOnInvalidTime);
            }
        }

        const offsetTicks: long = result.timeZoneOffset.Ticks;

        // there should be no overflow, because the offset can be no more than -+100 hours and the date already
        // fits within a DateTime.
        const utcTicks: long = result.parsedDate.Ticks.sub(offsetTicks);

        // For DateTimeOffset, both the parsed time and the corresponding UTC value must be within the boundaries
        // of a DateTime instance.
        if (utcTicks.lessThan(DateTime.MinTicks) || utcTicks.greaterThan(DateTime.MaxTicks)) {
            result.SetFailure(ParseFailureKind.Format, "Format_UTCOutOfRange", null);
            return false;
        }

        // the offset must be within +- 14:00 hours.
        if (offsetTicks < DateTimeOffset.MinOffset || offsetTicks > DateTimeOffset.MaxOffset) {
            result.SetFailure(ParseFailureKind.Format, "Format_OffsetOutOfRange", null);
            return false;
        }

        // DateTimeOffset should still honor the AdjustToUniversal flag for consistency with DateTime. It means you
        // want to return an adjusted UTC value, so store the utcTicks in the DateTime and set the offset to zero
        if ((styles & DateTimeStyles.AdjustToUniversal) !== 0) {
            if (((result.flags & ParseFlags.TimeZoneUsed) === 0) && ((styles & DateTimeStyles.AssumeUniversal) === 0)) {
                // Handle the special case where the timeZoneOffset was defaulted to Local
                const toUtcResult: boolean = DateTimeParse.AdjustTimeZoneToUniversal(result);
                result.timeZoneOffset = TimeSpan.Zero;
                return toUtcResult;
            }

            // The constructor should always succeed because of the range check earlier in the function
            // Althought it is UTC, internally DateTimeOffset does not use this flag
            result.parsedDate = new DateTime(utcTicks, DateTimeKind.Utc);
            result.timeZoneOffset = TimeSpan.Zero;
        }

        return true;
    }


    //
    // Adjust the specified time to universal time based on the supplied timezone.
    // E.g. when parsing "2001/06/08 14:00-07:00",
    // the time is 2001/06/08 14:00, and timeZoneOffset = -07:00.
    // The result will be "2001/06/08 21:00"
    //
    private static AdjustTimeZoneToUniversal(result: DateTimeResult): boolean {
        let resultTicks: long = result.parsedDate.Ticks;
        resultTicks = resultTicks.sub(result.timeZoneOffset.Ticks);
        if (resultTicks.lessThan(0)) {
            resultTicks = resultTicks.add(Calendar.TicksPerDay);
        }

        if (resultTicks.lessThan(DateTime.MinTicks) || resultTicks.greaterThan(DateTime.MaxTicks)) {
            result.SetFailure(ParseFailureKind.Format, "Format_DateOutOfRange", null);
            return false;
        }
        result.parsedDate = new DateTime(resultTicks, DateTimeKind.Utc);
        return true;
    }

    //
    // Adjust the specified time to universal time based on the supplied timezone,
    // and then convert to local time.
    // E.g. when parsing "2001/06/08 14:00-04:00", and local timezone is GMT-7.
    // the time is 2001/06/08 14:00, and timeZoneOffset = -05:00.
    // The result will be "2001/06/08 11:00"
    //
    private static AdjustTimeZoneToLocal(result: DateTimeResult, bTimeOnly: boolean): boolean {
        let resultTicks: long = result.parsedDate.Ticks;
        // Convert to local ticks
        const tz: any/* TimeZoneInfo */ = TimeZoneInfo.Local;
        let isAmbiguousLocalDst: Out<boolean> = New.Out(false);
        if (resultTicks.lessThan(Calendar.TicksPerDay)) {
            //
            // This is time of day.
            //

            // Adjust timezone.
            resultTicks = resultTicks.sub(result.timeZoneOffset.Ticks);
            // If the time is time of day, use the current timezone offset.
            resultTicks = resultTicks.add(tz.GetUtcOffset(bTimeOnly ? DateTime.Now : result.parsedDate, TimeZoneInfoOptions.NoThrowOnInvalidTime).Ticks);

            if (resultTicks.lessThan(0)) {
                resultTicks = resultTicks.add(Calendar.TicksPerDay);
            }
        } else {
            // Adjust timezone to GMT.
            resultTicks = resultTicks.sub(result.timeZoneOffset.Ticks);
            if (resultTicks.lessThan(DateTime.MinTicks) || resultTicks.greaterThan(DateTime.MaxTicks)) {
                // If the result ticks is greater than DateTime.MaxValue, we can not create a DateTime from this ticks.
                // In this case, keep using the old code.
                resultTicks = resultTicks.add(tz.GetUtcOffset(result.parsedDate, TimeZoneInfoOptions.NoThrowOnInvalidTime).Ticks);
            } else {
                // Convert the GMT time to local time.
                const utcDt: DateTime = new DateTime(resultTicks, DateTimeKind.Utc);
                let isDaylightSavings: Out<boolean> = New.Out(false);
                resultTicks = resultTicks.add(TimeZoneInfo.GetUtcOffsetFromUtc(utcDt, TimeZoneInfo.Local, isDaylightSavings, isAmbiguousLocalDst).Ticks);
            }
        }
        if (resultTicks.lessThan(DateTime.MinTicks) || resultTicks.greaterThan(DateTime.MaxTicks)) {
            result.parsedDate = DateTime.MinValue;
            result.SetFailure(ParseFailureKind.Format, "Format_DateOutOfRange", null);
            return false;
        }
        result.parsedDate = new DateTime(resultTicks, DateTimeKind.Local, isAmbiguousLocalDst.value);
        return true;
    }

    //
    // Parse the ISO8601 format string found during Parse();
    //
    //
    private static ParseISO8601(raw: DateTimeRawInfo, str: __DTString, styles: DateTimeStyles, result: DateTimeResult): boolean {
        if (raw.year < 0 || raw.GetNumber(0) < 0 || raw.GetNumber(1) < 0) {
        }
        str.Index--;
        let hour: Out<int> = New.Out(0), minute: Out<int> = New.Out(0);
        let second: Out<int> = New.Out(0);
        let partSecond: Out<double> = New.Out(Convert.ToLong(0));

        str.SkipWhiteSpaces();
        if (!DateTimeParse.ParseDigits(str, 2, hour)) {
            result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
            return false;
        }
        str.SkipWhiteSpaces();
        if (!str.Match(':')) {
            result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
            return false;
        }
        str.SkipWhiteSpaces();
        if (!DateTimeParse.ParseDigits(str, 2, minute)) {
            result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
            return false;
        }
        str.SkipWhiteSpaces();
        if (str.Match(':')) {
            str.SkipWhiteSpaces();
            if (!DateTimeParse.ParseDigits(str, 2, second)) {
                result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                return false;
            }
            if (str.Match('.')) {
                if (!DateTimeParse.ParseFraction(str, partSecond.value.toNumber())) {
                    result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                    return false;
                }
                str.Index--;
            }
            str.SkipWhiteSpaces();
        }
        if (str.GetNext()) {
            const ch: char = str.GetChar();
            if (ch === '+'.charCodeAt(0) || ch === '-'.charCodeAt(0)) {
                result.flags |= ParseFlags.TimeZoneUsed;
                if (!DateTimeParse.ParseTimeZone(str, result.timeZoneOffset)) {
                    result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                    return false;
                }
            } else if (ch === 'Z'.charCodeAt(0) || ch === 'z'.charCodeAt(0)) {
                result.flags |= ParseFlags.TimeZoneUsed;
                result.timeZoneOffset = TimeSpan.Zero;
                result.flags |= ParseFlags.TimeZoneUtc;
            } else {
                str.Index--;
            }
            str.SkipWhiteSpaces();
            if (str.Match('#')) {
                if (!DateTimeParse.VerifyValidPunctuation(str)) {
                    result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                    return false;
                }
                str.SkipWhiteSpaces();
            }
            if (str.Match('\0')) {
                if (!DateTimeParse.VerifyValidPunctuation(str)) {
                    result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                    return false;
                }
            }
            if (str.GetNext()) {
                // If this is true, there were non-white space characters remaining in the DateTime
                result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                return false;
            }
        }

        let time: Out<DateTime> = New.Out();
        throw new Exception('düzelt');
       /*  const calendar: Calendar = GregorianCalendar.GetDefaultInstance();
        if (!calendar.TryToDateTime(raw.year, raw.GetNumber(0), raw.GetNumber(1),
            hour.value, minute.value, second.value, 0, result.era, time)) {
            result.SetFailure(ParseFailureKind.FormatBadDateTimeCalendar, "Format_BadDateTimeCalendar", null);
            return false;
        } */

        time.value = time.value.AddTicks(partSecond.value.mul(Calendar.TicksPerSecond));
        result.parsedDate = time.value;
        if (!DateTimeParse.DetermineTimeZoneAdjustments(result, styles, false)) {
            return false;
        }
        return true;
    }


    ////////////////////////////////////////////////////////////////////////
    //
    // Actions:
    //    Parse the current word as a Hebrew number.
    //      This is used by DateTime.ParseExact().
    //
    ////////////////////////////////////////////////////////////////////////

    /* internal */ static MatchHebrewDigits(str: __DTString, digitLen: int, number: Out<int>): boolean {
        number.value = 0;

        // Create a context object so that we can parse the Hebrew number text character by character.
        const context: HebrewNumberParsingContext = new HebrewNumberParsingContext(0);

        // Set this to ContinueParsing so that we will run the following while loop in the first time.
        let state: HebrewNumberParsingState = HebrewNumberParsingState.ContinueParsing;

        while (state === HebrewNumberParsingState.ContinueParsing && str.GetNext()) {
            state = HebrewNumber.ParseByChar(str.GetChar(), context);
        }

        if (state === HebrewNumberParsingState.FoundEndOfHebrewNumber) {
            // If we have reached a terminal state, update the result and returns.
            number.value = context.result;
            return (true);
        }

        // If we run out of the character before reaching FoundEndOfHebrewNumber, or
        // the state is InvalidHebrewNumber or ContinueParsing, we fail to match a Hebrew number.
        // Return an error.
        return false;
    }

    /*=================================ParseDigits==================================
    **Action: Parse the number string in __DTString that are formatted using
    **        the following patterns:
    **        "0", "00", and "000..0"
    **Returns: the integer value
    **Arguments:    str: a __DTString.  The parsing will start from the
    **              next character after str.Index.
    **Exceptions: FormatException if error in parsing number.
    ==============================================================================*/

    public /* internal */ static ParseDigits(str: __DTString, digitLen: int, result: Out<int>): boolean;
    public /* internal */ static ParseDigits(str: __DTString, minDigitLen: int, maxDigitLen: int, result: Out<int>): boolean;
    public /* internal */ static ParseDigits(...args: any[]): boolean {
        if (args.length === 3) {
            const str: __DTString = args[0];
            const digitLen: int = args[1];
            const result: Out<int> = args[2];
            if (digitLen === 1) {
                // 1 really means 1 or 2 for this call
                return DateTimeParse.ParseDigits(str, 1, 2, result);
            }
            else {
                return DateTimeParse.ParseDigits(str, digitLen, digitLen, result);
            }
        } else if (args.length === 4) {
            const str: __DTString = args[0];
            const minDigitLen: int = args[1];
            const maxDigitLen: int = args[2];
            const result: Out<int> = args[3];

            /*  Contract.Assert(minDigitLen > 0, "minDigitLen > 0");
                    Contract.Assert(maxDigitLen < 9, "maxDigitLen < 9");
                    Contract.Assert(minDigitLen <= maxDigitLen, "minDigitLen <= maxDigitLen"); */
            result.value = 0;
            let startingIndex: int = str.Index;
            let tokenLength: int = 0;
            while (tokenLength < maxDigitLen) {
                if (!str.GetNextDigit()) {
                    str.Index--;
                    break;
                }
                result.value = result.value * 10 + str.GetDigit();
                tokenLength++;
            }
            if (tokenLength < minDigitLen) {
                str.Index = startingIndex;
                return false;
            }
            return true;
        }
        throw new ArgumentOutOfRangeException('');
    }

    /*=================================ParseFractionExact==================================
    **Action: Parse the number string in __DTString that are formatted using
    **        the following patterns:
    **        "0", "00", and "000..0"
    **Returns: the fraction value
    **Arguments:    str: a __DTString.  The parsing will start from the
    **              next character after str.Index.
    **Exceptions: FormatException if error in parsing number.
    ==============================================================================*/

    private static ParseFractionExact(str: __DTString, maxDigitLen: int, result: Out<double>): boolean {
        if (!str.GetNextDigit()) {
            str.Index--;
            return false;
        }
        result.value = Convert.ToDouble(str.GetDigit());

        let digitLen: int = 1;
        for (; digitLen < maxDigitLen; digitLen++) {
            if (!str.GetNextDigit()) {
                str.Index--;
                break;
            }
            result.value = result.value.mul(10).add(str.GetDigit());
        }

        result.value = (result.value.div(Math.pow(10, digitLen)));
        return (digitLen === maxDigitLen);
    }

    /*=================================ParseSign==================================
    **Action: Parse a positive or a negative sign.
    **Returns:      true if postive sign.  flase if negative sign.
    **Arguments:    str: a __DTString.  The parsing will start from the
    **              next character after str.Index.
    **Exceptions:   FormatException if end of string is encountered or a sign
    **              symbol is not found.
    ==============================================================================*/

    private static ParseSign(str: __DTString, result: Out<boolean>): boolean {
        if (!str.GetNext()) {
            // A sign symbol ('+' or '-') is expected. However, end of string is encountered.
            return false;
        }
        const ch: char = str.GetChar();
        if (ch === '+'.charCodeAt(0)) {
            result.value = true;
            return (true);
        } else if (ch === '-'.charCodeAt(0)) {
            result.value = false;
            return (true);
        }
        // A sign symbol ('+' or '-') is expected.
        return false;
    }

    /*=================================ParseTimeZoneOffset==================================
    **Action: Parse the string formatted using "z", "zz", "zzz" in DateTime.Format().
    **Returns: the TimeSpan for the parsed timezone offset.
    **Arguments:    str: a __DTString.  The parsing will start from the
    **              next character after str.Index.
    **              len: the repeated number of the "z"
    **Exceptions: FormatException if errors in parsing.
    ==============================================================================*/

    private static ParseTimeZoneOffset(str: __DTString, len: int, result: Out<TimeSpan>): boolean {
        let isPositive: Out<boolean> = New.Out(true);
        let hourOffset: Out<int> = New.Out(0);
        let minuteOffset: Out<int> = New.Out(0);

        switch (len) {
            case 1:
            case 2:
                if (!DateTimeParse.ParseSign(str, isPositive)) {
                    return (false);
                }
                if (!DateTimeParse.ParseDigits(str, len, hourOffset)) {
                    return (false);
                }
                break;
            default:
                if (!DateTimeParse.ParseSign(str, isPositive)) {
                    return (false);
                }

                // Parsing 1 digit will actually parse 1 or 2.
                if (!DateTimeParse.ParseDigits(str, 1, hourOffset)) {
                    return (false);
                }
                // ':' is optional.
                if (str.Match(":")) {
                    // Found ':'
                    if (!DateTimeParse.ParseDigits(str, 2, minuteOffset)) {
                        return (false);
                    }
                } else {
                    // Since we can not match ':', put the char back.
                    str.Index--;
                    if (!DateTimeParse.ParseDigits(str, 2, minuteOffset)) {
                        return (false);
                    }
                }
                break;
        }
        if (minuteOffset.value < 0 || minuteOffset.value >= 60) {
            return false;
        }

        result.value = (new TimeSpan(hourOffset.value, minuteOffset.value, 0));
        if (!isPositive) {
            result.value = result.value.Negate();
        }
        return (true);
    }

    /*=================================MatchAbbreviatedMonthName==================================
    **Action: Parse the abbreviated month name from string starting at str.Index.
    **Returns: A value from 1 to 12 for the first month to the twelveth month.
    **Arguments:    str: a __DTString.  The parsing will start from the
    **              next character after str.Index.
    **Exceptions: FormatException if an abbreviated month name can not be found.
    ==============================================================================*/

    private static MatchAbbreviatedMonthName(str: __DTString, dtfi: DateTimeFormatInfo, result: Out<int>): boolean {
        const maxMatchStrLen: Out<int> = New.Out(0);
        result.value = -1;
        if (str.GetNext()) {
            //
            // Scan the month names (note that some calendars has 13 months) and find
            // the matching month name which has the max string length.
            // We need to do this because some cultures (e.g. "cs-CZ") which have
            // abbreviated month names with the same prefix.
            //
            const monthsInYear: int = (dtfi.GetMonthName(13).length === 0 ? 12 : 13);
            for (let i: int = 1; i <= monthsInYear; i++) {
                const searchStr: string = dtfi.GetAbbreviatedMonthName(i);
                const matchStrLen: Out<int> = New.Out(searchStr.length);
                if (dtfi.HasSpacesInMonthNames
                    ? str.MatchSpecifiedWords(searchStr, false, matchStrLen)
                    : str.MatchSpecifiedWord(searchStr)) {
                    if (matchStrLen.value > maxMatchStrLen.value) {
                        maxMatchStrLen.value = matchStrLen.value;
                        result.value = i;
                    }
                }
            }

            // Search leap year form.
            if ((dtfi.FormatFlags & DateTimeFormatFlags.UseLeapYearMonth) !== 0) {
                const tempResult: int = str.MatchLongestWords(dtfi.internalGetLeapYearMonthNames(), maxMatchStrLen);
                // We found a longer match in the leap year month name.  Use this as the result.
                // The result from MatchLongestWords is 0 ~ length of word array.
                // So we increment the result by one to become the month value.
                if (tempResult >= 0) {
                    result.value = tempResult + 1;
                }
            }


        }
        if (result.value > 0) {
            str.Index += (maxMatchStrLen.value - 1);
            return (true);
        }
        return false;
    }

    /*=================================MatchMonthName==================================
    **Action: Parse the month name from string starting at str.Index.
    **Returns: A value from 1 to 12 indicating the first month to the twelveth month.
    **Arguments:    str: a __DTString.  The parsing will start from the
    **              next character after str.Index.
    **Exceptions: FormatException if a month name can not be found.
    ==============================================================================*/

    private static MatchMonthName(str: __DTString, dtfi: DateTimeFormatInfo, result: Out<int>): boolean {
        const maxMatchStrLen: Out<int> = New.Out(0);
        result.value = -1;
        if (str.GetNext()) {
            //
            // Scan the month names (note that some calendars has 13 months) and find
            // the matching month name which has the max string length.
            // We need to do this because some cultures (e.g. "vi-VN") which have
            // month names with the same prefix.
            //
            const monthsInYear: int = (dtfi.GetMonthName(13).length === 0 ? 12 : 13);
            for (let i: int = 1; i <= monthsInYear; i++) {
                const searchStr: string = dtfi.GetMonthName(i);
                const matchStrLen: Out<int> = New.Out(searchStr.length);
                if (dtfi.HasSpacesInMonthNames
                    ? str.MatchSpecifiedWords(searchStr, false, matchStrLen)
                    : str.MatchSpecifiedWord(searchStr)) {
                    if (matchStrLen.value > maxMatchStrLen.value) {
                        maxMatchStrLen.value = matchStrLen.value;
                        result.value = i;
                    }
                }
            }

            // Search genitive form.
            if ((dtfi.FormatFlags & DateTimeFormatFlags.UseGenitiveMonth) !== 0) {
                const tempResult: int = str.MatchLongestWords(dtfi.MonthGenitiveNames, maxMatchStrLen);
                // We found a longer match in the genitive month name.  Use this as the result.
                // The result from MatchLongestWords is 0 ~ length of word array.
                // So we increment the result by one to become the month value.
                if (tempResult >= 0) {
                    result.value = tempResult + 1;
                }
            }

            // Search leap year form.
            if ((dtfi.FormatFlags & DateTimeFormatFlags.UseLeapYearMonth) !== 0) {
                const tempResult: int = str.MatchLongestWords(dtfi.internalGetLeapYearMonthNames(), maxMatchStrLen);
                // We found a longer match in the leap year month name.  Use this as the result.
                // The result from MatchLongestWords is 0 ~ length of word array.
                // So we increment the result by one to become the month value.
                if (tempResult >= 0) {
                    result.value = tempResult + 1;
                }
            }
        }

        if (result.value > 0) {
            str.Index += (maxMatchStrLen.value - 1);
            return (true);
        }
        return false;
    }

    /*=================================MatchAbbreviatedDayName==================================
    **Action: Parse the abbreviated day of week name from string starting at str.Index.
    **Returns: A value from 0 to 6 indicating Sunday to Saturday.
    **Arguments:    str: a __DTString.  The parsing will start from the
    **              next character after str.Index.
    **Exceptions: FormatException if a abbreviated day of week name can not be found.
    ==============================================================================*/

    private static MatchAbbreviatedDayName(str: __DTString, dtfi: DateTimeFormatInfo, result: Out<int>): boolean {
        const maxMatchStrLen: Out<int> = New.Out(0);
        result.value = -1;
        if (str.GetNext()) {
            for (let i: DayOfWeek = DayOfWeek.Sunday; i <= DayOfWeek.Saturday; i++) {
                const searchStr: string = dtfi.GetAbbreviatedDayName(i);
                const matchStrLen: Out<int> = New.Out(searchStr.length);
                if (dtfi.HasSpacesInDayNames
                    ? str.MatchSpecifiedWords(searchStr, false, matchStrLen)
                    : str.MatchSpecifiedWord(searchStr)) {
                    if (matchStrLen.value > maxMatchStrLen.value) {
                        maxMatchStrLen.value = matchStrLen.value;
                        result.value = i;
                    }
                }
            }
        }
        if (result.value >= 0) {
            str.Index += maxMatchStrLen.value - 1;
            return true;
        }
        return false;
    }

    /*=================================MatchDayName==================================
    **Action: Parse the day of week name from string starting at str.Index.
    **Returns: A value from 0 to 6 indicating Sunday to Saturday.
    **Arguments:    str: a __DTString.  The parsing will start from the
    **              next character after str.Index.
    **Exceptions: FormatException if a day of week name can not be found.
    ==============================================================================*/

    private static MatchDayName(str: __DTString, dtfi: DateTimeFormatInfo, result: Out<int>): boolean {
        // Turkish (tr-TR) got day names with the same prefix.
        const maxMatchStrLen: Out<int> = New.Out(0);
        result.value = -1;
        if (str.GetNext()) {
            for (let i: DayOfWeek = DayOfWeek.Sunday; i <= DayOfWeek.Saturday; i++) {
                const searchStr: string = dtfi.GetDayName(i);
                const matchStrLen: Out<int> = New.Out(searchStr.length);
                if (dtfi.HasSpacesInDayNames
                    ? str.MatchSpecifiedWords(searchStr, false, matchStrLen)
                    : str.MatchSpecifiedWord(searchStr)) {
                    if (matchStrLen.value > maxMatchStrLen.value) {
                        maxMatchStrLen.value = matchStrLen.value;
                        result.value = i;
                    }
                }
            }
        }
        if (result.value >= 0) {
            str.Index += maxMatchStrLen.value - 1;
            return true;
        }
        return false;
    }

    /*=================================MatchEraName==================================
    **Action: Parse era name from string starting at str.Index.
    **Returns: An era value.
    **Arguments:    str: a __DTString.  The parsing will start from the
    **              next character after str.Index.
    **Exceptions: FormatException if an era name can not be found.
    ==============================================================================*/

    private static MatchEraName(str: __DTString, dtfi: DateTimeFormatInfo, result: Out<int>): boolean {
        if (str.GetNext()) {
            const eras: IntArray = dtfi.Calendar.Eras;

            if (eras != null) {
                for (let i: int = 0; i < eras.length; i++) {
                    let searchStr: string = dtfi.GetEraName(eras[i]);
                    if (str.MatchSpecifiedWord(searchStr)) {
                        str.Index += (searchStr.length - 1);
                        result.value = eras[i];
                        return (true);
                    }
                    searchStr = dtfi.GetAbbreviatedEraName(eras[i]);
                    if (str.MatchSpecifiedWord(searchStr)) {
                        str.Index += (searchStr.length - 1);
                        result.value = eras[i];
                        return (true);
                    }
                }
            }
        }
        return false;
    }

    /*=================================MatchTimeMark==================================
    **Action: Parse the time mark (AM/PM) from string starting at str.Index.
    **Returns: TM_AM or TM_PM.
    **Arguments:    str: a __DTString.  The parsing will start from the
    **              next character after str.Index.
    **Exceptions: FormatException if a time mark can not be found.
    ==============================================================================*/

    private static MatchTimeMark(str: __DTString, dtfi: DateTimeFormatInfo, result: Out<TM>): boolean {
        result.value = TM.NotSet;
        // In some cultures have empty strings in AM/PM mark. E.g. af-ZA (0x0436), the AM mark is "", and PM mark is "nm".
        if (dtfi.AMDesignator.length === 0) {
            result.value = TM.AM;
        }
        if (dtfi.PMDesignator.length === 0) {
            result.value = TM.PM;
        }

        if (str.GetNext()) {
            let searchStr: string = dtfi.AMDesignator;
            if (searchStr.length > 0) {
                if (str.MatchSpecifiedWord(searchStr)) {
                    // Found an AM timemark with length > 0.
                    str.Index += (searchStr.length - 1);
                    result.value = TM.AM;
                    return (true);
                }
            }
            searchStr = dtfi.PMDesignator;
            if (searchStr.length > 0) {
                if (str.MatchSpecifiedWord(searchStr)) {
                    // Found a PM timemark with length > 0.
                    str.Index += (searchStr.length - 1);
                    result.value = TM.PM;
                    return (true);
                }
            }
            str.Index--; // Undo the GetNext call.
        }
        if (result.value !== TM.NotSet) {
            // If one of the AM/PM marks is empty string, return the result.
            return true;
        }
        return false;
    }

    /*=================================MatchAbbreviatedTimeMark==================================
    **Action: Parse the abbreviated time mark (AM/PM) from string starting at str.Index.
    **Returns: TM_AM or TM_PM.
    **Arguments:    str: a __DTString.  The parsing will start from the
    **              next character after str.Index.
    **Exceptions: FormatException if a abbreviated time mark can not be found.
    ==============================================================================*/

    private static MatchAbbreviatedTimeMark(str: __DTString, dtfi: DateTimeFormatInfo, result: Out<TM>): boolean {
        // NOTENOTE : the assumption here is that abbreviated time mark is the first
        // character of the AM/PM designator.  If this invariant changes, we have to
        // change the code below.
        if (str.GetNext()) {
            if (str.GetChar() === dtfi.AMDesignator[0].charCodeAt(0)) {
                result.value = TM.AM;
                return (true);
            }
            if (str.GetChar() === dtfi.PMDesignator[0].charCodeAt(0)) {
                result.value = TM.PM;
                return (true);
            }
        }
        return false;
    }

    /*=================================CheckNewValue==================================
    **Action: Check if currentValue is initialized.  If not, return the newValue.
    **        If yes, check if the current value is equal to newValue.  Return false
    **        if they are not equal.  This is used to check the case like "d" and "dd" are both
    **        used to format a string.
    **Returns: the correct value for currentValue.
    **Arguments:
    **Exceptions:
    ==============================================================================*/

    private static CheckNewYearValue(newValue: int, patternChar: char, result: DateTimeResult): boolean {
        if (result.Year === -1) {
            result.Year = newValue;
            return (true);
        } else {
            if (newValue !== result.Year) {
                result.SetFailure(ParseFailureKind.FormatWithParameter, "Format_RepeatDateTimePattern", patternChar);
                return (false);
            }
        }
        return (true);
    }

    private static CheckNewMonthValue(newValue: int, patternChar: char, result: DateTimeResult): boolean {
        if (result.Month === -1) {
            result.Month = newValue;
            return (true);
        } else {
            if (newValue !== result.Month) {
                result.SetFailure(ParseFailureKind.FormatWithParameter, "Format_RepeatDateTimePattern", patternChar);
                return (false);
            }
        }
        return (true);
    }
    private static CheckNewDayValue(newValue: int, patternChar: char, result: DateTimeResult): boolean {
        if (result.Day === -1) {
            result.Day = newValue;
            return (true);
        } else {
            if (newValue !== result.Day) {
                result.SetFailure(ParseFailureKind.FormatWithParameter, "Format_RepeatDateTimePattern", patternChar);
                return (false);
            }
        }
        return (true);
    }
    private static CheckNewHourValue(newValue: int, patternChar: char, result: DateTimeResult): boolean {
        if (result.Hour === -1) {
            result.Hour = newValue;
            return (true);
        } else {
            if (newValue !== result.Hour) {
                result.SetFailure(ParseFailureKind.FormatWithParameter, "Format_RepeatDateTimePattern", patternChar);
                return (false);
            }
        }
        return (true);
    }
    private static CheckNewMinuteValue(newValue: int, patternChar: char, result: DateTimeResult): boolean {
        if (result.Minute === -1) {
            result.Minute = newValue;
            return (true);
        } else {
            if (newValue !== result.Minute) {
                result.SetFailure(ParseFailureKind.FormatWithParameter, "Format_RepeatDateTimePattern", patternChar);
                return (false);
            }
        }
        return (true);
    }
    private static CheckNewSecondValue(newValue: int, patternChar: char, result: DateTimeResult): boolean {
        if (result.Second === -1) {
            result.Second = newValue;
            return (true);
        } else {
            if (newValue !== result.Second) {
                result.SetFailure(ParseFailureKind.FormatWithParameter, "Format_RepeatDateTimePattern", patternChar);
                return (false);
            }
        }
        return (true);
    }
    private static CheckNewDayOfWeekValue(newValue: int, patternChar: char, result: ParsingInfo): boolean {
        if (result.dayOfWeek === -1) {
            result.dayOfWeek = newValue;
            return (true);
        } else {
            if (newValue !== result.dayOfWeek) {
                //result.SetFailure(ParseFailureKind.FormatWithParameter, "Format_RepeatDateTimePattern", patternChar);
                return (false);
            }
        }
        return (true);
    }
    private static GetDateTimeNow(result: DateTimeResult, styles: DateTimeStyles): DateTime {
        if ((result.flags & ParseFlags.CaptureOffset) !== 0) {
            if ((result.flags & ParseFlags.TimeZoneUsed) !== 0) {
                // use the supplied offset to calculate 'Now'
                return new DateTime(DateTime.UtcNow.Ticks.add(result.timeZoneOffset.Ticks), DateTimeKind.Unspecified);
            }
            else if ((styles & DateTimeStyles.AssumeUniversal) !== 0) {
                // assume the offset is Utc
                return DateTime.UtcNow;
            }
        }

        // assume the offset is Local
        return DateTime.Now;
    }

    private static CheckDefaultDateTime(result: DateTimeResult, cal: Calendar, styles: DateTimeStyles): boolean {

        if ((result.flags & ParseFlags.CaptureOffset) != 0) {
            // DateTimeOffset.Parse should allow dates without a year, but only if there is also no time zone marker;
            // e.g. "May 1 5pm" is OK, but "May 1 5pm -08:30" is not.  This is somewhat pragmatic, since we would
            // have to rearchitect parsing completely to allow this one case to correctly handle things like leap
            // years and leap months.  Is is an extremely corner case, and DateTime is basically incorrect in that
            // case today.
            //
            // values like "11:00Z" or "11:00 -3:00" are also acceptable
            //
            // if ((month or day is set) and (year is not set and time zone is set))
            //
            if (((result.Month !== -1) || (result.Day !== -1))
                && ((result.Year === -1 || ((result.flags & ParseFlags.YearDefault) !== 0)) && (result.flags & ParseFlags.TimeZoneUsed) !== 0)) {
                result.SetFailure(ParseFailureKind.Format, "Format_MissingIncompleteDate", null);
                return false;
            }
        }


        if ((result.Year === -1) || (result.Month === -1) || (result.Day === -1)) {
            /*
            The following table describes the behaviors of getting the default value
            when a certain year/month/day values are missing.
            An "X" means that the value exists.  And "--" means that value is missing.
            Year    Month   Day =>  ResultYear  ResultMonth     ResultDay       Note
            X       X       X       Parsed year Parsed month    Parsed day
            X       X       --      Parsed Year Parsed month    First day       If we have year and month, assume the first day of that month.
            X       --      X       Parsed year First month     Parsed day      If the month is missing, assume first month of that year.
            X       --      --      Parsed year First month     First day       If we have only the year, assume the first day of that year.
            --      X       X       CurrentYear Parsed month    Parsed day      If the year is missing, assume the current year.
            --      X       --      CurrentYear Parsed month    First day       If we have only a month value, assume the current year and current day.
            --      --      X       CurrentYear First month     Parsed day      If we have only a day value, assume current year and first month.
            --      --      --      CurrentYear Current month   Current day     So this means that if the date string only contains time, you will get current date.
            */

            const now: DateTime = DateTimeParse.GetDateTimeNow(result, styles);
            if (result.Month === -1 && result.Day === -1) {
                if (result.Year === -1) {
                    if ((styles & DateTimeStyles.NoCurrentDateDefault) !== 0) {
                        // If there is no year/month/day values, and NoCurrentDateDefault flag is used,
                        // set the year/month/day value to the beginning year/month/day of DateTime().
                        // Note we should be using Gregorian for the year/month/day.
                        throw new Exception('düzelt');
                        /* cal = GregorianCalendar.GetDefaultInstance();
                        result.Year = result.Month = result.Day = 1; */
                    } else {
                        // Year/Month/Day are all missing.
                        result.Year = cal.GetYear(now);
                        result.Month = cal.GetMonth(now);
                        result.Day = cal.GetDayOfMonth(now);
                    }
                } else {
                    // Month/Day are both missing.
                    result.Month = 1;
                    result.Day = 1;
                }
            } else {
                if (result.Year === -1) {
                    result.Year = cal.GetYear(now);
                }
                if (result.Month === -1) {
                    result.Month = 1;
                }
                if (result.Day === -1) {
                    result.Day = 1;
                }
            }
        }
        // Set Hour/Minute/Second to zero if these value are not in str.
        if (result.Hour === -1) result.Hour = 0;
        if (result.Minute === -1) result.Minute = 0;
        if (result.Second === -1) result.Second = 0;
        if (result.era === -1) result.era = Calendar.CurrentEra;
        return true;
    }

    // Expand a pre-defined format string (like "D" for long date) to the real format that
    // we are going to use in the date time parsing.
    // This method also set the dtfi according/parseInfo to some special pre-defined
    // formats.
    //
    private static ExpandPredefinedFormat(format: string, dtfi: DateTimeFormatInfo, parseInfo: ParsingInfo, result: DateTimeResult): string {
        //
        // Check the format to see if we need to override the dtfi to be InvariantInfo,
        // and see if we need to set up the userUniversalTime flag.
        //
        switch (format[0]) {
            case 'o':
            case 'O':       // Round Trip Format
            throw new Exception('düzelt');
                /* parseInfo.calendar = GregorianCalendar.GetDefaultInstance();
                dtfi = DateTimeFormatInfo.InvariantInfo; */
                break;
            case 'r':
            case 'R':       // RFC 1123 Standard.  (in Universal time)
            throw new Exception('düzelt');
               /*  parseInfo.calendar = GregorianCalendar.GetDefaultInstance();
                dtfi = DateTimeFormatInfo.InvariantInfo;

                if ((result.flags & ParseFlags.CaptureOffset) != 0) {
                    result.flags |= ParseFlags.Rfc1123Pattern;
                } */
                break;
            case 's':       // Sortable format (in local time)
            throw new Exception('düzelt');
               /*  dtfi = DateTimeFormatInfo.InvariantInfo;
                parseInfo.calendar = GregorianCalendar.GetDefaultInstance(); */
                break;
            case 'u':       // Universal time format in sortable format.
            throw new Exception('düzelt');
                /* parseInfo.calendar = GregorianCalendar.GetDefaultInstance();
                dtfi = DateTimeFormatInfo.InvariantInfo; */

                if ((result.flags & ParseFlags.CaptureOffset) != 0) {
                    result.flags |= ParseFlags.UtcSortPattern;
                }
                break;
            case 'U':       // Universal time format with culture-dependent format.
            throw new Exception('düzelt');
              /*   parseInfo.calendar = GregorianCalendar.GetDefaultInstance();
                result.flags |= ParseFlags.TimeZoneUsed;
                result.timeZoneOffset = new TimeSpan(Convert.ToDouble(0));
                result.flags |= ParseFlags.TimeZoneUtc;
                if (dtfi.Calendar.GetType() !== type(System.Types.Globalization.GregorianCalendar)) {
                    dtfi = dtfi.Clone();
                    dtfi.Calendar = GregorianCalendar.GetDefaultInstance();
                } */
                break;
        }

        //
        // Expand the pre-defined format character to the real format from DateTimeFormatInfo.
        //
        return DateTimeFormat.GetRealFormat(format, dtfi);
    }

    private static ParseJapaneseEraStart(str: __DTString, dtfi: DateTimeFormatInfo): boolean {
        // ParseJapaneseEraStart will be called when parsing the year number. We can have dates which not listing
        // the year as a number and listing it as JapaneseEraStart symbol (which means year 1).
        // This will be legitimate date to recognize.
        if (AppContextSwitches.EnforceLegacyJapaneseDateParsing || dtfi.Calendar.ID !== Calendar.CAL_JAPAN || !str.GetNext())
            return false;

        if (str.m_current !== DateTimeFormatInfo.JapaneseEraStart[0].charCodeAt(0)) {
            str.Index--;
            return false;
        }

        return true;
    }

    // Given a specified format character, parse and update the parsing result.
    //
    private static ParseByFormat(str: __DTString, format: __DTString, parseInfo: ParsingInfo, dtfi: DateTimeFormatInfo, result: DateTimeResult): boolean {

        const tokenLen: Out<int> = New.Out(0);
        const tempYear: Out<int> = New.Out(0);
        const tempMonth: Out<int> = New.Out(0);
        const tempDay: Out<int> = New.Out(0);
        const tempDayOfWeek: Out<int> = New.Out(0);
        const tempHour: Out<int> = New.Out(0);
        const tempMinute: Out<int> = New.Out(0);
        const tempSecond: Out<int> = New.Out(0);
        const tempFraction: Out<double> = New.Out(Convert.ToDouble(0));
        const tempTimeMark: Out<TM> = New.Out(0);

        const ch: char = format.GetChar();

        switch (ch) {
            case 'y'.charCodeAt(0):
                tokenLen.value = format.GetRepeatCount();
                let parseResult: boolean = false;
                if (DateTimeParse.ParseJapaneseEraStart(str, dtfi)) {
                    tempYear.value = 1;
                    parseResult = true;
                }
                else if (dtfi.HasForceTwoDigitYears) {
                    throw new Exception('düzelt');
                    //parseResult = DateTimeParse.ParseDigits(str, 1, 4, tempYear.value);
                }
                else {
                    if (tokenLen.value <= 2) {
                        parseInfo.fUseTwoDigitYear = true;
                    }
                    parseResult = DateTimeParse.ParseDigits(str, tokenLen.value, tempYear);
                }
                if (!parseResult && parseInfo.fCustomNumberParser) {
                    parseResult = parseInfo.parseNumberDelegate(str, tokenLen, tempYear);
                }
                if (!parseResult) {
                    result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                    return false;
                }
                if (!DateTimeParse.CheckNewYearValue(/* result.Year, */ tempYear.value, ch, result)) {
                    return false;
                }
                break;
            case 'M'.charCodeAt(0):
                tokenLen.value = format.GetRepeatCount();
                if (tokenLen.value <= 2) {
                    if (!DateTimeParse.ParseDigits(str, tokenLen.value, tempMonth)) {
                        if (!parseInfo.fCustomNumberParser ||
                            !parseInfo.parseNumberDelegate(str, tokenLen, tempMonth)) {
                            result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                            return false;
                        }
                    }
                } else {
                    if (tokenLen.value === 3) {
                        if (!DateTimeParse.MatchAbbreviatedMonthName(str, dtfi, tempMonth)) {
                            result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                            return false;
                        }
                    } else {
                        if (!DateTimeParse.MatchMonthName(str, dtfi, tempMonth)) {
                            result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                            return false;
                        }
                    }
                    result.flags |= ParseFlags.ParsedMonthName;
                }
                if (!DateTimeParse.CheckNewMonthValue(/* result.Month, */ tempMonth.value, ch, result)) {
                    return (false);
                }
                break;
            case 'd'.charCodeAt(0):
                // Day & Day of week
                tokenLen.value = format.GetRepeatCount();
                if (tokenLen.value <= 2) {
                    // "d" & "dd"

                    if (!DateTimeParse.ParseDigits(str, tokenLen.value, tempDay)) {
                        if (!parseInfo.fCustomNumberParser ||
                            !parseInfo.parseNumberDelegate(str, tokenLen, tempDay)) {
                            result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                            return false;
                        }
                    }
                    if (!DateTimeParse.CheckNewDayValue(/* result.Day, */ tempDay.value, ch, result)) {
                        return false;
                    }
                } else {
                    if (tokenLen.value === 3) {
                        // "ddd"
                        if (!DateTimeParse.MatchAbbreviatedDayName(str, dtfi, tempDayOfWeek)) {
                            result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                            return false;
                        }
                    } else {
                        // "dddd*"
                        if (!DateTimeParse.MatchDayName(str, dtfi, tempDayOfWeek)) {
                            result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                            return false;
                        }
                    }
                    if (!DateTimeParse.CheckNewDayOfWeekValue(/* parseInfo.dayOfWeek, */ tempDayOfWeek.value, ch, parseInfo/* result */)) {
                        return false;
                    }
                }
                break;
            case 'g'.charCodeAt(0):
                tokenLen.value = format.GetRepeatCount();
                // Put the era value in result.era.
                const value: Out<int> = New.Out(result.era);
                if (!DateTimeParse.MatchEraName(str, dtfi, value)) {
                    result.era = value.value;
                    result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                    return (false);
                }
                break;
            case 'h'.charCodeAt(0):
                parseInfo.fUseHour12 = true;
                tokenLen.value = format.GetRepeatCount();
                if (!DateTimeParse.ParseDigits(str, (tokenLen.value < 2 ? 1 : 2), tempHour)) {
                    result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                    return (false);
                }
                if (!DateTimeParse.CheckNewHourValue(/* result.Hour, */ tempHour.value, ch, result)) {
                    return (false);
                }
                break;
            case 'H'.charCodeAt(0):
                tokenLen.value = format.GetRepeatCount();
                if (!DateTimeParse.ParseDigits(str, (tokenLen.value < 2 ? 1 : 2), tempHour)) {
                    result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                    return (false);
                }
                if (!DateTimeParse.CheckNewHourValue(/* result.Hour, */ tempHour.value, ch, result)) {
                    return (false);
                }
                break;
            case 'm'.charCodeAt(0):
                tokenLen.value = format.GetRepeatCount();
                if (!DateTimeParse.ParseDigits(str, (tokenLen.value < 2 ? 1 : 2), tempMinute)) {
                    result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                    return (false);
                }
                if (!DateTimeParse.CheckNewMinuteValue(/* result.Minute, */ tempMinute.value, ch, result)) {
                    return (false);
                }
                break;
            case 's'.charCodeAt(0):
                tokenLen.value = format.GetRepeatCount();
                if (!DateTimeParse.ParseDigits(str, (tokenLen.value < 2 ? 1 : 2), tempSecond)) {
                    result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                    return (false);
                }
                if (!DateTimeParse.CheckNewSecondValue(/* result.Second, */ tempSecond.value, ch, result)) {
                    return (false);
                }
                break;
            case 'f'.charCodeAt(0):
            case 'F'.charCodeAt(0):
                tokenLen.value = format.GetRepeatCount();
                if (tokenLen.value <= DateTimeFormat.MaxSecondsFractionDigits) {
                    if (!DateTimeParse.ParseFractionExact(str, tokenLen.value, tempFraction)) {
                        if (ch === 'f'.charCodeAt(0)) {
                            result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                            return false;
                        }
                    }
                    if (result.fraction.lessThan(0)) {
                        result.fraction = tempFraction.value;
                    } else {
                        if (!tempFraction.value.equals(result.fraction)) {
                            result.SetFailure(ParseFailureKind.FormatWithParameter, "Format_RepeatDateTimePattern", ch);
                            return (false);
                        }
                    }
                } else {
                    result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                    return (false);
                }
                break;
            case 't'.charCodeAt(0):
                // AM/PM designator
                tokenLen.value = format.GetRepeatCount();
                if (tokenLen.value === 1) {
                    if (!DateTimeParse.MatchAbbreviatedTimeMark(str, dtfi, tempTimeMark)) {
                        result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                        return (false);
                    }
                } else {
                    if (!DateTimeParse.MatchTimeMark(str, dtfi, tempTimeMark)) {
                        result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                        return false;
                    }
                }

                if (parseInfo.timeMark === TM.NotSet) {
                    parseInfo.timeMark = tempTimeMark.value;
                }
                else {
                    if (parseInfo.timeMark !== tempTimeMark.value) {
                        result.SetFailure(ParseFailureKind.FormatWithParameter, "Format_RepeatDateTimePattern", ch);
                        return (false);
                    }
                }
                break;
            case 'z'.charCodeAt(0):
                // timezone offset
                tokenLen.value = format.GetRepeatCount();
                {
                    const tempTimeZoneOffset: Out<TimeSpan> = New.Out(new TimeSpan(Convert.ToDouble(0)));
                    if (!DateTimeParse.ParseTimeZoneOffset(str, tokenLen.value, tempTimeZoneOffset)) {
                        result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                        return (false);
                    }
                    if ((result.flags & ParseFlags.TimeZoneUsed) !== 0 && !tempTimeZoneOffset.value.Equals(result.timeZoneOffset)) {
                        result.SetFailure(ParseFailureKind.FormatWithParameter, "Format_RepeatDateTimePattern", 'z');
                        return (false);
                    }
                    result.timeZoneOffset = tempTimeZoneOffset.value;
                    result.flags |= ParseFlags.TimeZoneUsed;
                }
                break;
            case 'Z'.charCodeAt(0):
                if ((result.flags & ParseFlags.TimeZoneUsed) !== 0 && result.timeZoneOffset !== TimeSpan.Zero) {
                    result.SetFailure(ParseFailureKind.FormatWithParameter, "Format_RepeatDateTimePattern", 'Z');
                    return (false);
                }

                result.flags |= ParseFlags.TimeZoneUsed;
                result.timeZoneOffset = new TimeSpan(Convert.ToDouble(0));
                result.flags |= ParseFlags.TimeZoneUtc;

                // The updating of the indexes is to reflect that ParseExact MatchXXX methods assume that
                // they need to increment the index and Parse GetXXX do not. Since we are calling a Parse
                // method from inside ParseExact we need to adjust this. Long term, we should try to
                // eliminate this discrepancy.
                str.Index++;
                if (!DateTimeParse.GetTimeZoneName(str)) {
                    result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                    return false;
                }
                str.Index--;
                break;
            case 'K'.charCodeAt(0):
                // This should parse either as a blank, the 'Z' character or a local offset like "-07:00"
                if (str.Match('Z')) {
                    if ((result.flags & ParseFlags.TimeZoneUsed) !== 0 && !result.timeZoneOffset.Equals(TimeSpan.Zero)) {
                        result.SetFailure(ParseFailureKind.FormatWithParameter, "Format_RepeatDateTimePattern", 'K');
                        return (false);
                    }

                    result.flags |= ParseFlags.TimeZoneUsed;
                    result.timeZoneOffset = new TimeSpan(Convert.ToDouble(0));
                    result.flags |= ParseFlags.TimeZoneUtc;
                }
                else if (str.Match('+') || str.Match('-')) {
                    str.Index--; // Put the character back for the parser
                    const tempTimeZoneOffset: Out<TimeSpan> = New.Out(new TimeSpan(Convert.ToDouble(0)));
                    if (!DateTimeParse.ParseTimeZoneOffset(str, 3, tempTimeZoneOffset)) {
                        result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                        return (false);
                    }
                    if ((result.flags & ParseFlags.TimeZoneUsed) !== 0 && !tempTimeZoneOffset.value.Equals(result.timeZoneOffset)) {
                        result.SetFailure(ParseFailureKind.FormatWithParameter, "Format_RepeatDateTimePattern", 'K');
                        return false;
                    }
                    result.timeZoneOffset = tempTimeZoneOffset.value;
                    result.flags |= ParseFlags.TimeZoneUsed;
                }
                // Otherwise it is unspecified and we consume no characters
                break;
            case ':'.charCodeAt(0):
                // We match the separator in time pattern with the character in the time string if both equal to ':' or the date separator is matching the characters in the date string
                // We have to exclude the case when the time separator is more than one character and starts with ':' something like "::" for instance.
                if (((dtfi.TimeSeparator.length > 1 && dtfi.TimeSeparator[0] === ':') || !str.Match(':')) && !str.Match(dtfi.TimeSeparator)) {
                    // A time separator is expected.
                    result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                    return false;
                }
                break;
            case '/'.charCodeAt(0):
                // We match the separator in date pattern with the character in the date string if both equal to '/' or the date separator is matching the characters in the date string
                // We have to exclude the case when the date separator is more than one character and starts with '/' something like "//" for instance.
                if (((dtfi.DateSeparator.length > 1 && dtfi.DateSeparator[0] === '/') || !str.Match('/')) && !str.Match(dtfi.DateSeparator)) {
                    // A date separator is expected.
                    result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                    return false;
                }
                break;
            case '\"'.charCodeAt(0):
            case '\''.charCodeAt(0):
                const enquotedString: StringBuilder = new StringBuilder();
                // Use ParseQuoteString so that we can handle escape characters within the quoted string.
                if (!DateTimeParse.TryParseQuoteString(format.Value, format.Index, enquotedString, tokenLen)) {
                    result.SetFailure(ParseFailureKind.FormatWithParameter, "Format_BadQuote", ch);
                    return (false);
                }
                format.Index += tokenLen.value - 1;

                // Some cultures uses space in the quoted string.  E.g. Spanish has long date format as:
                // "dddd, dd' de 'MMMM' de 'yyyy".  When inner spaces flag is set, we should skip whitespaces if there is space
                // in the quoted string.
                const quotedStr: string = enquotedString.ToString();

                for (let i: int = 0; i < quotedStr.length; i++) {
                    if (quotedStr[i] === ' ' && parseInfo.fAllowInnerWhite) {
                        str.SkipWhiteSpaces();
                    } else if (!str.Match(quotedStr[i])) {
                        // Can not find the matching quoted string.
                        result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                        return false;
                    }
                }

                // The "r" and "u" formats incorrectly quoted 'GMT' and 'Z', respectively.  We cannot
                // correct this mistake for DateTime.ParseExact for compatibility reasons, but we can
                // fix it for DateTimeOffset.ParseExact as DateTimeOffset has not been publically released
                // with this issue.
                if ((result.flags & ParseFlags.CaptureOffset) !== 0) {
                    if ((result.flags & ParseFlags.Rfc1123Pattern) !== 0 && quotedStr === DateTimeParse.GMTName) {
                        result.flags |= ParseFlags.TimeZoneUsed;
                        result.timeZoneOffset = TimeSpan.Zero;
                    }
                    else if ((result.flags & ParseFlags.UtcSortPattern) !== 0 && quotedStr === DateTimeParse.ZuluName) {
                        result.flags |= ParseFlags.TimeZoneUsed;
                        result.timeZoneOffset = TimeSpan.Zero;
                    }
                }

                break;
            case '%'.charCodeAt(0):
                // Skip this so we can get to the next pattern character.
                // Used in case like "%d", "%y"

                // Make sure the next character is not a '%' again.
                if (format.Index >= format.Value.length - 1 || format.Value[format.Index + 1] === '%') {
                    result.SetFailure(ParseFailureKind.Format, "Format_BadFormatSpecifier", null);
                    return false;
                }
                break;
            case '\\'.charCodeAt(0):
                // Escape character. For example, "\d".
                // Get the next character in format, and see if we can
                // find a match in str.
                if (format.GetNext()) {
                    if (!str.Match(format.GetChar())) {
                        // Can not find a match for the escaped character.
                        result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                        return false;
                    }
                } else {
                    result.SetFailure(ParseFailureKind.Format, "Format_BadFormatSpecifier", null);
                    return false;
                }
                break;
            case '.'.charCodeAt(0):
                if (!str.Match(ch)) {
                    if (format.GetNext()) {
                        // If we encounter the pattern ".F", and the dot is not present, it is an optional
                        // second fraction and we can skip this format.
                        if (format.Match('F')) {
                            format.GetRepeatCount();
                            break;
                        }
                    }
                    result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                    return false;
                }
                break;
            default:
                if (ch === ' '.charCodeAt(0)) {
                    if (parseInfo.fAllowInnerWhite) {
                        // Skip whitespaces if AllowInnerWhite.
                        // Do nothing here.
                    } else {
                        if (!str.Match(ch)) {
                            // If the space does not match, and trailing space is allowed, we do
                            // one more step to see if the next format character can lead to
                            // successful parsing.
                            // This is used to deal with special case that a empty string can match
                            // a specific pattern.
                            // The example here is af-ZA, which has a time format like "hh:mm:ss tt".  However,
                            // its AM symbol is "" (empty string).  If fAllowTrailingWhite is used, and time is in
                            // the AM, we will trim the whitespaces at the end, which will lead to a failure
                            // when we are trying to match the space before "tt".
                            if (parseInfo.fAllowTrailingWhite) {
                                if (format.GetNext()) {
                                    if (DateTimeParse.ParseByFormat(str, format, parseInfo, dtfi, result)) {
                                        return (true);
                                    }
                                }
                            }
                            result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                            return false;
                        }
                        // Found a macth.
                    }
                } else {
                    if (format.MatchSpecifiedWord(DateTimeParse.GMTName)) {
                        format.Index += (DateTimeParse.GMTName.length - 1);
                        // Found GMT string in format.  This means the DateTime string
                        // is in GMT timezone.
                        result.flags |= ParseFlags.TimeZoneUsed;
                        result.timeZoneOffset = TimeSpan.Zero;
                        if (!str.Match(DateTimeParse.GMTName)) {
                            result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                            return false;
                        }
                    } else if (!str.Match(ch)) {
                        // ch is expected.
                        result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                        return false;
                    }
                }
                break;
        } // switch
        return (true);
    }

    //
    // The pos should point to a quote character. This method will
    // get the string enclosed by the quote character.
    //
    public /* internal */ static TryParseQuoteString(format: string, pos: int, result: StringBuilder, returnValue: Out<int>): boolean {
        //
        // NOTE : pos will be the index of the quote character in the 'format' string.
        //
        returnValue.value = 0;
        let formatLen: int = format.length;
        let beginPos: int = pos;
        const quoteChar: char = format[pos++].charCodeAt(0); // Get the character used to quote the following string.

        let foundQuote: boolean = false;
        while (pos < formatLen) {
            const ch: char = format[pos++].charCodeAt(0);
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
                    return false;
                }
            } else {
                result.Append(String.fromCharCode(ch));
            }
        }

        if (!foundQuote) {
            // Here we can't find the matching quote.
            return false;
        }

        //
        // Return the character count including the begin/end quote characters and enclosed string.
        //
        returnValue.value = (pos - beginPos);
        return true;
    }




    /*=================================DoStrictParse==================================
    **Action: Do DateTime parsing using the format in formatParam.
    **Returns: The parsed DateTime.
    **Arguments:
    **Exceptions:
    **
    **Notes:
    **  When the following general formats are used, InvariantInfo is used in dtfi:
    **      'r', 'R', 's'.
    **  When the following general formats are used, the time is assumed to be in Universal time.
    **
    **Limitations:
    **  Only GregorianCalendar is supported for now.
    **  Only support GMT timezone.
    ==============================================================================*/

    private static DoStrictParse(s: string, formatParam: string, styles: DateTimeStyles, dtfi: DateTimeFormatInfo, result: DateTimeResult): boolean {
        const parseInfo: ParsingInfo = new ParsingInfo();
        parseInfo.Init();

        parseInfo.calendar = dtfi.Calendar;
        parseInfo.fAllowInnerWhite = ((styles & DateTimeStyles.AllowInnerWhite) !== 0);
        parseInfo.fAllowTrailingWhite = ((styles & DateTimeStyles.AllowTrailingWhite) !== 0);

        // We need the original values of the following two below.
        const originalFormat: string = formatParam;

        if (formatParam.length === 1) {
            if (((result.flags & ParseFlags.CaptureOffset) !== 0) && formatParam[0] === 'U') {
                // The 'U' format is not allowed for DateTimeOffset
                result.SetFailure(ParseFailureKind.Format, "Format_BadFormatSpecifier", null);
                return false;
            }
            formatParam = DateTimeParse.ExpandPredefinedFormat(formatParam, dtfi, parseInfo, result);
        }

        let bTimeOnly: boolean = false;
        result.calendar = parseInfo.calendar;

        if (parseInfo.calendar.ID == Calendar.CAL_HEBREW) {
            parseInfo.parseNumberDelegate = DateTimeParse.m_hebrewNumberParser;
            parseInfo.fCustomNumberParser = true;
        }

        // Reset these values to negative one so that we could throw exception
        // if we have parsed every item twice.
        result.Hour = result.Minute = result.Second = -1;

        const format: __DTString = new __DTString(formatParam, dtfi, false);
        const str: __DTString = new __DTString(s, dtfi, false);

        if (parseInfo.fAllowTrailingWhite) {
            // Trim trailing spaces if AllowTrailingWhite.
            format.TrimTail();
            format.RemoveTrailingInQuoteSpaces();
            str.TrimTail();
        }

        if ((styles & DateTimeStyles.AllowLeadingWhite) != 0) {
            format.SkipWhiteSpaces();
            format.RemoveLeadingInQuoteSpaces();
            str.SkipWhiteSpaces();
        }

        //
        // Scan every character in format and match the pattern in str.
        //
        while (format.GetNext()) {
            // We trim inner spaces here, so that we will not eat trailing spaces when
            // AllowTrailingWhite is not used.
            if (parseInfo.fAllowInnerWhite) {
                str.SkipWhiteSpaces();
            }
            if (!DateTimeParse.ParseByFormat(str, format, parseInfo, dtfi, result)) {
                return (false);
            }
        }

        if (str.Index < str.Value.length - 1) {
            // There are still remaining character in str.
            result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
            return false;
        }

        if (parseInfo.fUseTwoDigitYear && ((dtfi.FormatFlags & DateTimeFormatFlags.UseHebrewRule) === 0)) {
            // A two digit year value is expected. Check if the parsed year value is valid.
            if (result.Year >= 100) {
                result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                return false;
            }
            try {
                result.Year = parseInfo.calendar.ToFourDigitYear(result.Year);
            }
            catch (/* ArgumentOutOfRangeException */ e) {
                result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", e);
                return false;
            }
        }

        if (parseInfo.fUseHour12) {
            if (parseInfo.timeMark === TM.NotSet) {
                // hh is used, but no AM/PM designator is specified.
                // Assume the time is AM.
                // Don't throw exceptions in here becasue it is very confusing for the caller.
                // I always got confused myself when I use "hh:mm:ss" to parse a time string,
                // and ParseExact() throws on me (because I didn't use the 24-hour clock 'HH').
                parseInfo.timeMark = TM.AM;
            }
            if (result.Hour > 12) {
                // AM/PM is used, but the value for HH is too big.
                result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                return false;
            }
            if (parseInfo.timeMark == TM.AM) {
                if (result.Hour === 12) {
                    result.Hour = 0;
                }
            } else {
                result.Hour = (result.Hour === 12) ? 12 : result.Hour + 12;
            }
        }
        else {
            // Military (24-hour time) mode
            //
            // AM cannot be set with a 24-hour time like 17:15.
            // PM cannot be set with a 24-hour time like 03:15.
            if ((parseInfo.timeMark === TM.AM && result.Hour >= 12)
                || (parseInfo.timeMark === TM.PM && result.Hour < 12)) {
                result.SetFailure(ParseFailureKind.Format, "Format_BadDateTime", null);
                return false;
            }
        }


        // Check if the parased string only contains hour/minute/second values.
        bTimeOnly = (result.Year === -1 && result.Month === -1 && result.Day === -1);
        if (!DateTimeParse.CheckDefaultDateTime(result, parseInfo.calendar, styles)) {
            return false;
        }

        if (!bTimeOnly && dtfi.HasYearMonthAdjustment) {
            const _year: Out<int> = New.Out(result.Year);
            const _month: Out<int> = New.Out(result.Month);
            if (!dtfi.YearMonthAdjustment(_year, _month, ((result.flags & ParseFlags.ParsedMonthName) !== 0))) {
                result.Year = _year.value;
                result.Month = _month.value;
                result.SetFailure(ParseFailureKind.FormatBadDateTimeCalendar, "Format_BadDateTimeCalendar", null);
                return false;
            }
        }

        const _parseddate: Out<DateTime> = New.Out(result.parsedDate)
        if (!parseInfo.calendar.TryToDateTime(result.Year, result.Month, result.Day, result.Hour, result.Minute, result.Second, 0, result.era, _parseddate)) {
            result.parsedDate = _parseddate.value;
            result.SetFailure(ParseFailureKind.FormatBadDateTimeCalendar, "Format_BadDateTimeCalendar", null);
            return false;
        } else {
            result.parsedDate = _parseddate.value;
        }
        if (result.fraction.greaterThan(0)) {
            result.parsedDate = result.parsedDate.AddTicks(/* Convert.ToLong(Math.round( */result.fraction.mul(Calendar.TicksPerSecond));
        }

        //
        // We have to check day of week before we adjust to the time zone.
        // It is because the value of day of week may change after adjusting
        // to the time zone.
        //
        if (parseInfo.dayOfWeek !== -1) {
            //
            // Check if day of week is correct.
            //
            if (parseInfo.dayOfWeek !== parseInfo.calendar.GetDayOfWeek(result.parsedDate)) {
                result.SetFailure(ParseFailureKind.Format, "Format_BadDayOfWeek", null);
                return false;
            }
        }


        if (!DateTimeParse.DetermineTimeZoneAdjustments(result, styles, bTimeOnly)) {
            return false;
        }
        return true;
    }

    private static GetDateTimeParseException(result: DateTimeResult): Exception {
        switch (result.failure) {
            case ParseFailureKind.ArgumentNull:
                return new ArgumentNullException(result.failureArgumentName, Environment.GetResourceString(result.failureMessageID));
            case ParseFailureKind.Format:
                return new FormatException(Environment.GetResourceString(result.failureMessageID));
            case ParseFailureKind.FormatWithParameter:
                return new FormatException(Environment.GetResourceString(result.failureMessageID, result.failureMessageFormatArgument));
            case ParseFailureKind.FormatBadDateTimeCalendar:
                return new FormatException(Environment.GetResourceString(result.failureMessageID,/*  result.calendar */));
            default:
                //Contract.Assert(false, "Unkown DateTimeParseFailure: " + result);
                return null as any;

        }
    }

    // <

    public /* internal */ static LexTraceExit(message: string, dps: DS): void {

    }

    public /* internal */ static PTSTraceExit(dps: DS, passed: boolean): void {

    }

    public /* internal */ static TPTraceExit(message: string, dps: DS): void {

    }

    public /* internal */ static DTFITrace(dtfi: DateTimeFormatInfo): void {

    }

}

EventBus.Default.on('DateTimeOffset_Loaded', (e) =>{
    DateTimeOffset = e.value
});