import { Convert } from './convert';
import { ArgumentException } from './Exceptions/ArgumentException';
import { ArgumentOutOfRangeException } from './Exceptions/ArgumentOutOfRangeException';
import { TString } from './Extensions';
import { FormatException } from './Extensions/FormatException';
import { OverflowException } from './Extensions/OverflowException';
import { TChar } from './Extensions/TChar';
import { char, CharArray, int, long, New, uint, ulong } from './float';
import { is } from './is';
import { Out } from './Out';
import { SR } from './SR';

export class ParseNumbers {
    public /* internal */ static readonly LeftAlign: int = 0x0001;
    public /* internal */ static readonly RightAlign: int = 0x0004;
    public /* internal */ static readonly PrefixSpace: int = 0x0008;
    public /* internal */ static readonly PrintSign: int = 0x0010;
    public /* internal */ static readonly PrintBase: int = 0x0020;
    public /* internal */ static readonly PrintAsI1: int = 0x0040;
    public /* internal */ static readonly PrintAsI2: int = 0x0080;
    public /* internal */ static readonly PrintAsI4: int = 0x0100;
    public /* internal */ static readonly TreatAsUnsigned: int = 0x0200;
    public /* internal */ static readonly TreatAsI1: int = 0x0400;
    public /* internal */ static readonly TreatAsI2: int = 0x0800;
    public /* internal */ static readonly IsTight: int = 0x1000;
    public /* internal */ static readonly NoSpace: int = 0x2000;
    public /* internal */ static readonly PrintRadixBase: int = 0x4000;

    private static readonly MinRadix: int = 2;
    private static readonly MaxRadix: int = 36;

    public static StringToLong(s: string, radix: int, flags: int): long;
    public static StringToLong(s: CharArray, radix: int, flags: int): long;
    public static StringToLong(s: CharArray, radix: int, flags: int, currPos: Out<int>): long;
    public static StringToLong(...args: any[]): long {
        if (args.length === 3 && is.string(args[0]) && is.int(args[1]) && is.int(args[2])) {
            const s: string = args[0];
            const radix: int = args[1];
            const flags: int = args[2];
            return ParseNumbers.StringToLong(TString.ToCharArray(s), radix, flags);
        } else if (args.length === 3 && is.CharArray(args[0]) && is.int(args[1]) && is.int(args[2])) {
            const s: CharArray = args[0];
            const radix: int = args[1];
            const flags: int = args[2];
            const pos: Out<int> = New.Out(0);
            return ParseNumbers.StringToLong(s, radix, flags, pos);
        } else if (args.length === 4 && is.CharArray(args[0]) && is.int(args[1]) && is.int(args[2])) {
            const s: CharArray = args[0];
            const radix: int = args[1];
            const flags: int = args[2];
            let currPos: Out<int> = args[3];

            let i: Out<int> = New.Out(currPos.value);

            // Do some radix checking.
            // A radix of -1 says to use whatever base is spec'd on the number.
            // Parse in Base10 until we figure out what the base actually is.
            let r: int = (-1 === radix) ? 10 : radix;

            if (r !== 2 && r !== 10 && r !== 8 && r !== 16)
                throw new ArgumentException(SR.Arg_InvalidBase);

            const length: int = s.length;

            if (i.value < 0 || i.value >= length)
                throw new ArgumentOutOfRangeException(SR.ArgumentOutOfRange_Index);

            // Get rid of the whitespace and then check that we've still got some digits to parse.
            if (((flags & ParseNumbers.IsTight) === 0) && ((flags & ParseNumbers.NoSpace) === 0)) {
                ParseNumbers.EatWhiteSpace(s, i);
                if (i.value === length)
                    throw new FormatException(SR.Format_EmptyInputString);
            }

            // Check for a sign
            let sign: int = 1;
            if (s[i.value] === '-'.charCodeAt(0)) {
                if (r !== 10)
                    throw new ArgumentException(SR.Arg_CannotHaveNegativeValue);

                if ((flags & ParseNumbers.TreatAsUnsigned) !== 0)
                    throw new OverflowException(SR.Overflow_NegativeUnsigned);

                sign = -1;
                i.value++;
            }
            else if (s[i.value] === '+'.charCodeAt(0)) {
                i.value++;
            }

            if ((radix === -1 || radix === 16) && (i.value + 1 < length) && s[i.value] === '0'.charCodeAt(0)) {
                if (s[i.value + 1] === 'x'.charCodeAt(0) || s[i.value + 1] === 'X'.charCodeAt(0)) {
                    r = 16;
                    i.value += 2;
                }
            }

            let grabNumbersStart: int = i.value;
            let result: long = ParseNumbers.GrabLongs(r, s, i, (flags & ParseNumbers.TreatAsUnsigned) !== 0);

            // Check if they passed us a string with no parsable digits.
            if (i.value === grabNumbersStart)
                throw new FormatException(SR.Format_NoParsibleDigits);

            if ((flags & ParseNumbers.IsTight) !== 0) {
                // If we've got effluvia left at the end of the string, complain.
                if (i.value < length)
                    throw new FormatException(SR.Format_ExtraJunkAtEnd);
            }

            // Put the current index back into the correct place.
            currPos.value = i.value;

            // Return the value properly signed.
            if (result.equals(Convert.ToLong(0x8000000000000000)) && sign === 1 && r === 10 && ((flags & ParseNumbers.TreatAsUnsigned) === 0))
                throw new OverflowException('');

            if (r === 10) {
                result = result.mul(sign);
            }

            return result;
        }
        throw new ArgumentException('');
    }


    public static StringToInt(s: string, radix: int, flags: int): int;
    public static StringToInt(s: CharArray, radix: int, flags: int): int;
    public static StringToInt(s: CharArray, radix: int, flags: int, currPos: Out<int>): int;
    public static StringToInt(...args: any[]): int {
        if (args.length === 3 && is.string(args[0]) && is.int(args[1]) && is.int(args[2])) {
            const s: string = args[0];
            const radix: int = args[1];
            const flags: int = args[2];
            ParseNumbers.StringToInt(TString.ToCharArray(s), radix, flags);
        } else if (args.length === 3 && is.CharArray(args[0]) && is.int(args[1]) && is.int(args[2])) {
            const s: CharArray = args[0];
            const radix: int = args[1];
            const flags: int = args[2];
            const pos: Out<int> = New.Out(0);
            return ParseNumbers.StringToInt(s, radix, flags, pos);
        } else if (args.length === 4 && is.CharArray(args[0]) && is.int(args[1]) && is.int(args[2])) {
            const s: CharArray = args[0];
            const radix: int = args[1];
            const flags: int = args[2];
            const currPos: Out<int> = args[3];
            // They're requied to tell me where to start parsing.
            const i: Out<int> = New.Out(currPos.value);

            // Do some radix checking.
            // A radix of -1 says to use whatever base is spec'd on the number.
            // Parse in Base10 until we figure out what the base actually is.
            let r: int = (-1 === radix) ? 10 : radix;

            if (r !== 2 && r != 10 && r != 8 && r != 16)
                throw new ArgumentException(SR.Arg_InvalidBase);

            const length: int = s.length;

            if (i.value < 0 || i.value >= length)
                throw new ArgumentOutOfRangeException(SR.ArgumentOutOfRange_Index);

            // Get rid of the whitespace and then check that we've still got some digits to parse.
            if (((flags & ParseNumbers.IsTight) === 0) && ((flags & ParseNumbers.NoSpace) === 0)) {
                ParseNumbers.EatWhiteSpace(s, i);
                if (i.value === length)
                    throw new FormatException(SR.Format_EmptyInputString);
            }

            // Check for a sign
            let sign: int = 1;
            if (s[i.value] === '-'.charCodeAt(0)) {
                if (r !== 10)
                    throw new ArgumentException(SR.Arg_CannotHaveNegativeValue);

                if ((flags & ParseNumbers.TreatAsUnsigned) !== 0)
                    throw new OverflowException(SR.Overflow_NegativeUnsigned);

                sign = -1;
                i.value++;
            }
            else if (s[i.value] === '+'.charCodeAt(0)) {
                i.value++;
            }

            // Consume the 0x if we're in an unknown base or in base-16.
            if ((radix === -1 || radix === 16) && (i.value + 1 < length) && s[i.value] === '0'.charCodeAt(0)) {
                if (s[i.value + 1] === 'x'.charCodeAt(0) || s[i.value + 1] === 'X'.charCodeAt(0)) {
                    r = 16;
                    i.value += 2;
                }
            }

            let grabNumbersStart: int = i.value;
            let result: int = ParseNumbers.GrabInts(r, s, i, (flags & ParseNumbers.TreatAsUnsigned) !== 0);

            // Check if they passed us a string with no parsable digits.
            if (i.value === grabNumbersStart)
                throw new FormatException(SR.Format_NoParsibleDigits);

            if ((flags & ParseNumbers.IsTight) !== 0) {
                // If we've got effluvia left at the end of the string, complain.
                if (i.value < length)
                    throw new FormatException(SR.Format_ExtraJunkAtEnd);
            }

            // Put the current index back into the correct place.
            currPos.value = i.value;

            // Return the value properly signed.
            if ((flags & ParseNumbers.TreatAsI1) !== 0) {
                if (Convert.ToUInt32(result) > 0xFF)
                    throw new OverflowException('');
            }
            else if ((flags & ParseNumbers.TreatAsI2) !== 0) {
                if (Convert.ToUInt32(result) > 0xFFFF)
                    throw new OverflowException('');
            }
            else if (Convert.ToUInt32(result) === 0x80000000 && sign === 1 && r === 10 && ((flags & ParseNumbers.TreatAsUnsigned) === 0)) {
                throw new OverflowException('');
            }

            if (r === 10) {
                result *= sign;
            }

            return result;
        }

        throw new ArgumentException('');
    }

    public static IntToString(n: int, radix: int, width: int, paddingChar: char, flags: int): string {
        const buffer: CharArray = New.CharArray(66); // Longest possible string length for an integer in binary notation with prefix

        if (radix < ParseNumbers.MinRadix || radix > ParseNumbers.MaxRadix)
            throw new ArgumentException(SR.Arg_InvalidBase);

        // If the number is negative, make it positive and remember the sign.
        // If the number is MIN_VALUE, this will still be negative, so we'll have to
        // special case this later.
        let isNegative: boolean = false;
        let l: uint;
        if (n < 0) {
            isNegative = true;

            // For base 10, write out -num, but other bases write out the
            // 2's complement bit pattern
            l = (10 === radix) ? - n : n;
        }
        else {
            l = n;
        }

        // The conversion to a uint will sign extend the number.  In order to ensure
        // that we only get as many bits as we expect, we chop the number.
        if ((flags & ParseNumbers.PrintAsI1) !== 0) {
            l &= 0xFF;
        }
        else if ((flags & ParseNumbers.PrintAsI2) !== 0) {
            l &= 0xFFFF;
        }

        // Special case the 0.
        let index: int = 0;
        if (0 === l) {
            buffer[0] = '0'.charCodeAt(0);
            index = 1;
        }
        else {
            index = 0;
            for (let i: int = 0; i < buffer.length; i++) // for (...;i<buffer.Length;...) loop instead of do{...}while(l!=0) to help JIT eliminate span bounds checks
            {
                const div: uint = Convert.ToUInt32(l / Convert.ToUInt32(radix)); // TODO https://github.com/dotnet/runtime/issues/5213
                const charVal: uint = l - (div * Convert.ToUInt32(radix));
                l = div;

                buffer[i] = (charVal < 10) ? Convert.ToChar(charVal + '0'.charCodeAt(0)) : Convert.ToChar(charVal + 'a'.charCodeAt(0) - 10);

                if (l === 0) {
                    index = i + 1;
                    break;
                }
            }

            //Debug.Assert(l == 0, $"Expected {l} == 0");
        }

        // If they want the base, append that to the string (in reverse order)
        if (radix !== 10 && ((flags & ParseNumbers.PrintBase) !== 0)) {
            if (16 === radix) {
                buffer[index++] = 'x'.charCodeAt(0);
                buffer[index++] = '0'.charCodeAt(0);
            }
            else if (8 == radix) {
                buffer[index++] = '0'.charCodeAt(0);
            }
        }

        if (10 === radix) {
            // If it was negative, append the sign, else if they requested, add the '+'.
            // If they requested a leading space, put it on.
            if (isNegative) {
                buffer[index++] = '-'.charCodeAt(0);
            }
            else if ((flags & ParseNumbers.PrintSign) !== 0) {
                buffer[index++] = '+'.charCodeAt(0);
            }
            else if ((flags & ParseNumbers.PrefixSpace) !== 0) {
                buffer[index++] = ' '.charCodeAt(0);
            }
        }

        // Figure out the size of and allocate the resulting string
        const result: CharArray = New.CharArray(Math.max(width, index));

        // Put the characters into the string in reverse order.
        // Fill the remaining space, if there is any, with the correct padding character.

        const padding: int = result.length - index;
        let p: int = 0;
        if ((flags & ParseNumbers.LeftAlign) !== 0) {
            for (let i: int = 0; i < padding; i++) {
                result[p++] = paddingChar;
            }

            for (let i: int = 0; i < index; i++) {
                result[p++] = buffer[index - i - 1];
            }
        }
        else {
            for (let i: int = 0; i < index; i++) {
                result[p++] = buffer[index - i - 1];
            }

            for (let i: int = 0; i < padding; i++) {
                result[p++] = paddingChar;
            }
        }

        //Debug.Assert((p - resultPtr) == result.Length, $"Expected {p - resultPtr} == {result.Length}");

        return TString.FromCharArray(result);
    }

    public static LongToString(n: long, radix: int, width: int, paddingChar: char, flags: int): string {
        const buffer: CharArray = New.CharArray(67); // Longest possible string length for an integer in binary notation with prefix

        if (radix < ParseNumbers.MinRadix || radix > ParseNumbers.MaxRadix)
            throw new ArgumentException(SR.Arg_InvalidBase);

        // If the number is negative, make it positive and remember the sign.
        let ul: ulong;
        let isNegative: boolean = false;
        if (n.lessThan(0)) {
            isNegative = true;

            // For base 10, write out -num, but other bases write out the
            // 2's complement bit pattern
            ul = (10 === radix) ? (n.neg()) : n;
        }
        else {
            ul = n;
        }

        if ((flags & ParseNumbers.PrintAsI1) !== 0) {
            ul = ul.and(Convert.ToLong(0xFF));
        }
        else if ((flags & ParseNumbers.PrintAsI2) != 0) {
            ul = ul.and(Convert.ToLong(0xFFFF));
        }
        else if ((flags & ParseNumbers.PrintAsI4) !== 0) {
            ul = ul.and(Convert.ToLong(0xFFFFFFFF));
        }

        // Special case the 0.
        let index: int = 0;
        if (ul.equals(Convert.ToLong(0))) {
            buffer[0] = '0'.charCodeAt(0);
            index = 1;
        }
        else {
            index = 0;
            for (let i: int = 0; i < buffer.length; i++) // for loop instead of do{...}while(l!=0) to help JIT eliminate span bounds checks
            {
                const div: ulong = ul.div(radix); // TODO https://github.com/dotnet/runtime/issues/5213
                const charVal: int = Convert.ToInt32(ul.sub(div.mul(radix)));
                ul = div;

                buffer[i] = (charVal < 10) ? Convert.ToChar(charVal + '0'.charCodeAt(0)) : Convert.ToChar(charVal + 'a'.charCodeAt(0) - 10);

                if (ul.equals(Convert.ToLong(0))) {
                    index = i + 1;
                    break;
                }
            }
            //Debug.Assert(ul == 0, $"Expected {ul} == 0");
        }

        // If they want the base, append that to the string (in reverse order)
        if (radix !== 10 && ((flags & ParseNumbers.PrintBase) !== 0)) {
            if (16 === radix) {
                buffer[index++] = 'x'.charCodeAt(0);
                buffer[index++] = '0'.charCodeAt(0);
            }
            else if (8 == radix) {
                buffer[index++] = '0'.charCodeAt(0);
            }
            else if ((flags & ParseNumbers.PrintRadixBase) !== 0) {
                buffer[index++] = '#'.charCodeAt(0);
                buffer[index++] = Convert.ToChar((radix % 10) + '0'.charCodeAt(0));
                buffer[index++] = Convert.ToChar((radix / 10) + '0'.charCodeAt(0));
            }
        }

        if (10 == radix) {
            // If it was negative, append the sign.
            if (isNegative) {
                buffer[index++] = '-'.charCodeAt(0);
            }

            // else if they requested, add the '+';
            else if ((flags & ParseNumbers.PrintSign) !== 0) {
                buffer[index++] = '+'.charCodeAt(0);
            }

            // If they requested a leading space, put it on.
            else if ((flags & ParseNumbers.PrefixSpace) !== 0) {
                buffer[index++] = ' '.charCodeAt(0);
            }
        }

        // Figure out the size of and allocate the resulting string
        const result: CharArray = New.CharArray(Math.max(width, index));

        // Put the characters into the string in reverse order.
        // Fill the remaining space, if there is any, with the correct padding character.

        const padding: int = result.length - index;
        let p: int = 0;
        if ((flags & ParseNumbers.LeftAlign) !== 0) {
            for (let i: int = 0; i < padding; i++) {
                result[p++] = paddingChar;
            }

            for (let i: int = 0; i < index; i++) {
                result[p++] = buffer[index - i - 1];
            }
        }
        else {
            for (let i: int = 0; i < index; i++) {
                result[p++] = buffer[index - i - 1];
            }

            for (let i: int = 0; i < padding; i++) {
                result[p++] = paddingChar;
            }
        }

        //Debug.Assert((p - resultPtr) == result.Length, $"Expected {p - resultPtr} == {result.Length}");
        return TString.FromCharArray(result);
    }

    private static EatWhiteSpace(s: CharArray, i: Out<int>): void {
        let localIndex: int = i.value;
        for (; localIndex < s.length && TChar.IsWhiteSpace(s[localIndex]); localIndex++);
        i.value = localIndex;
    }

    private static GrabLongs(radix: int, s: CharArray, i: Out<int>, isUnsigned: boolean): long {
        let result: ulong = Convert.ToLong(0);
        let maxVal: ulong;

        // Allow all non-decimal numbers to set the sign bit.
        if (radix == 10 && !isUnsigned) {
            maxVal = Convert.ToLong(0x7FFFFFFFFFFFFFFF).div(10);

            // Read all of the digits and convert to a number
            const value: Out<int> = New.Out(0);
            while (i.value < s.length && ParseNumbers.IsDigit(s[i.value], radix, value)) {
                // Check for overflows - this is sufficient & correct.
                if (result > maxVal || (Convert.ToLong(result)).lessThan(0)) {
                    throw new OverflowException('');
                }

                result = result.mul(radix).add(value.value);
                i.value++;
            }

            if (Convert.ToLong(result).lessThan(0) && !result.equals(Convert.ToLong(0x8000000000000000))) {
               throw new OverflowException('');
            }
        }
        else {
            //Debug.Assert(radix == 2 || radix == 8 || radix == 10 || radix == 16);
            maxVal =
                radix === 10 ? Convert.ToLong(0xffffffffffffffff).div(10) :
                    radix === 16 ? Convert.ToLong(0xffffffffffffffff).div(16) :
                        radix === 8 ? Convert.ToLong(0xffffffffffffffff).div(8) :
                            Convert.ToLong(0xffffffffffffffff).div(2);

            // Read all of the digits and convert to a number
            const value: Out<int> = New.Out(0);
            while (i.value < s.length && ParseNumbers.IsDigit(s[i.value], radix, value)) {
                // Check for overflows - this is sufficient & correct.
                if (result > maxVal) {
                   throw new OverflowException('');
                }

                const temp: ulong = result.mul(radix).add(value.value);

                if (temp < result) // this means overflow as well
                {
                    throw new OverflowException('');
                }

                result = temp;
                i.value++;
            }
        }

        return result;
    }

    private static GrabInts(radix: int, s: CharArray, i: Out<int>, isUnsigned: boolean): int {
        let result: uint = 0;
        let maxVal: uint;

        // Allow all non-decimal numbers to set the sign bit.
        if (radix === 10 && !isUnsigned) {
            maxVal = (0x7FFFFFFF / 10);

            // Read all of the digits and convert to a number
            const value: Out<int> = New.Out(0);
            while (i.value < s.length && ParseNumbers.IsDigit(s[i.value], radix, value)) {
                // Check for overflows - this is sufficient & correct.
                if (result > maxVal || Convert.ToInt32(result) < 0) {
                    throw new OverflowException('');
                }
                result = result * Convert.ToUInt32(radix) + Convert.ToUInt32(value);
                i.value++;
            }
            if (Convert.ToInt32(result) < 0 && result !== 0x80000000) {
                throw new OverflowException('');
            }
        }
        else {
            //Debug.Assert(radix == 2 || radix == 8 || radix == 10 || radix == 16);
            maxVal =
                radix == 10 ? 0xffffffff / 10 :
                    radix == 16 ? 0xffffffff / 16 :
                        radix == 8 ? 0xffffffff / 8 :
                            0xffffffff / 2;

            // Read all of the digits and convert to a number
            const value: Out<int> = New.Out(0);
            while (i.value < s.length && ParseNumbers.IsDigit(s[i.value], radix, value)) {
                // Check for overflows - this is sufficient & correct.
                if (result > maxVal) {
                    throw new OverflowException('');
                }

                const temp: uint = result * Convert.ToUInt32(radix) + Convert.ToUInt32(value);

                if (temp < result) // this means overflow as well
                {
                    throw new OverflowException('');
                }

                result = temp;
                i.value++;
            }
        }

        return Convert.ToInt32(result);
    }

    private static IsDigit(c: char, radix: int, result: Out<int>): boolean {
        let tmp: int;
        if (Convert.ToUInt32(c - '0'.charCodeAt(0)) <= 9) {
            result.value = tmp = c - '0'.charCodeAt(0);
        }
        else if (Convert.ToUInt32(c - 'A'.charCodeAt(0)) <= 'Z'.charCodeAt(0) - 'A'.charCodeAt(0)) {
            result.value = tmp = c - 'A'.charCodeAt(0) + 10;
        }
        else if (Convert.ToUInt32(c - 'a'.charCodeAt(0)) <= 'z'.charCodeAt(0) - 'a'.charCodeAt(0)) {
            result.value = tmp = c - 'a'.charCodeAt(0) + 10;
        }
        else {
            result.value = -1;
            return false;
        }

        return tmp < radix;
    }
}