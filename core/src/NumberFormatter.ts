import { CharArray, int, uint, IntArray, char, long, New, float, double, ulong, UInt64MaxValue, decimal, Int64MaxValue, UInt32MaxValue } from './float';
import { Convert } from './convert';
import { NotImplementedException } from './Exceptions/NotImplementedException';
import { TArray } from './Extensions/TArray';
import { IFormatProvider } from './IFormatProvider';
import { NumberFormatInfo } from './Globalization/NumberFormatInfo';
import { CultureInfo } from './Globalization/CultureInfo';
import { FormatException } from './Extensions/FormatException';
import { TString } from './Text/TString';
import { Out } from './Out';
import { StringBuilder } from './Text/StringBuilder';
import { is } from './is';
import { TChar } from './Extensions/TChar';
import { ArgumentException } from './Exceptions/ArgumentException';
import { ArgumentOutOfRangeException } from './Exceptions/ArgumentOutOfRangeException';
import { TObject } from './Extensions/TObject';
import { ThreadWorker } from './Threading/ThreadWorker';
import { bigInt } from './Math/BigNumber';
import { BitConverter } from './BitConverter';
import { Context } from './Context';
declare var Double, Single;

//  public static String Format(XXX value, String format);
//  public static String Format(XXX value, String format, NumberFormatInfo info);
//
// where XXX is the name of the particular numeric class. The methods convert
// the numeric value to a string using the format string given by the
// format parameter. If the format parameter is null or
// an empty string, the number is formatted as if the string "G" (general
// format) was specified. The info parameter specifies the
// NumberFormatInfo instance to use when formatting the number. If the
// info parameter is null or omitted, the numeric formatting information
// is obtained from the current culture. The NumberFormatInfo supplies
// such information as the characters to use for decimal and thousand
// separators, and the spelling and placement of currency symbols in monetary
// values.
//
// Format strings fall into two categories: Standard format strings and
// user-defined format strings. A format string consisting of a single
// alphabetic character (A-Z or a-z), optionally followed by a sequence of
// digits (0-9), is a standard format string. All other format strings are
// used-defined format strings.
//
// A standard format string takes the form Axx, where A is an
// alphabetic character called the format specifier and xx is a
// sequence of digits called the precision specifier. The format
// specifier controls the type of formatting applied to the number and the
// precision specifier controls the number of significant digits or decimal
// places of the formatting operation. The following table describes the
// supported standard formats.
//
// C c - Currency format. The number is
// converted to a string that represents a currency amount. The conversion is
// controlled by the currency format information of the NumberFormatInfo
// used to format the number. The precision specifier indicates the desired
// number of decimal places. If the precision specifier is omitted, the default
// currency precision given by the NumberFormatInfo is used.
//
// D d - Decimal format. This format is
// supported for integral types only. The number is converted to a string of
// decimal digits, prefixed by a minus sign if the number is negative. The
// precision specifier indicates the minimum number of digits desired in the
// resulting string. If required, the number will be left-padded with zeros to
// produce the number of digits given by the precision specifier.
//
// E e Engineering (scientific) format.
// The number is converted to a string of the form
// "-d.ddd...E+ddd" or "-d.ddd...e+ddd", where each
// 'd' indicates a digit (0-9). The string starts with a minus sign if the
// number is negative, and one digit always precedes the decimal point. The
// precision specifier indicates the desired number of digits after the decimal
// point. If the precision specifier is omitted, a default of 6 digits after
// the decimal point is used. The format specifier indicates whether to prefix
// the exponent with an 'E' or an 'e'. The exponent is always consists of a
// plus or minus sign and three digits.
//
// F f Fixed point format. The number is
// converted to a string of the form "-ddd.ddd....", where each
// 'd' indicates a digit (0-9). The string starts with a minus sign if the
// number is negative. The precision specifier indicates the desired number of
// decimal places. If the precision specifier is omitted, the default numeric
// precision given by the NumberFormatInfo is used.
//
// G g - General format. The number is
// converted to the shortest possible decimal representation using fixed point
// or scientific format. The precision specifier determines the number of
// significant digits in the resulting string. If the precision specifier is
// omitted, the number of significant digits is determined by the type of the
// number being converted (10 for int, 19 for long, 7 for
// float, 15 for double, 19 for Currency, and 29 for
// Decimal). Trailing zeros after the decimal point are removed, and the
// resulting string contains a decimal point only if required. The resulting
// string uses fixed point format if the exponent of the number is less than
// the number of significant digits and greater than or equal to -4. Otherwise,
// the resulting string uses scientific format, and the case of the format
// specifier controls whether the exponent is prefixed with an 'E' or an
// 'e'.
//
// N n Number format. The number is
// converted to a string of the form "-d,ddd,ddd.ddd....", where
// each 'd' indicates a digit (0-9). The string starts with a minus sign if the
// number is negative. Thousand separators are inserted between each group of
// three digits to the left of the decimal point. The precision specifier
// indicates the desired number of decimal places. If the precision specifier
// is omitted, the default numeric precision given by the
// NumberFormatInfo is used.
//
// X x - Hexadecimal format. This format is
// supported for integral types only. The number is converted to a string of
// hexadecimal digits. The format specifier indicates whether to use upper or
// lower case characters for the hexadecimal digits above 9 ('X' for 'ABCDEF',
// and 'x' for 'abcdef'). The precision specifier indicates the minimum number
// of digits desired in the resulting string. If required, the number will be
// left-padded with zeros to produce the number of digits given by the
// precision specifier.
//
// Some examples of standard format strings and their results are shown in the
// table below. (The examples all assume a default NumberFormatInfo.)
//
// Value        Format  Result
// 12345.6789   C       $12,345.68
// -12345.6789  C       ($12,345.68)
// 12345        D       12345
// 12345        D8      00012345
// 12345.6789   E       1.234568E+004
// 12345.6789   E10     1.2345678900E+004
// 12345.6789   e4      1.2346e+004
// 12345.6789   F       12345.68
// 12345.6789   F0      12346
// 12345.6789   F6      12345.678900
// 12345.6789   G       12345.6789
// 12345.6789   G7      12345.68
// 123456789    G7      1.234568E8
// 12345.6789   N       12,345.68
// 123456789    N4      123,456,789.0000
// 0x2c45e      x       2c45e
// 0x2c45e      X       2C45E
// 0x2c45e      X8      0002C45E
//
// Format strings that do not start with an alphabetic character, or that start
// with an alphabetic character followed by a non-digit, are called
// user-defined format strings. The following table describes the formatting
// characters that are supported in user defined format strings.
//
//
// 0 - Digit placeholder. If the value being
// formatted has a digit in the position where the '0' appears in the format
// string, then that digit is copied to the output string. Otherwise, a '0' is
// stored in that position in the output string. The position of the leftmost
// '0' before the decimal point and the rightmost '0' after the decimal point
// determines the range of digits that are always present in the output
// string.
//
// # - Digit placeholder. If the value being
// formatted has a digit in the position where the '#' appears in the format
// string, then that digit is copied to the output string. Otherwise, nothing
// is stored in that position in the output string.
//
// . - Decimal point. The first '.' character
// in the format string determines the location of the decimal separator in the
// formatted value; any additional '.' characters are ignored. The actual
// character used as a the decimal separator in the output string is given by
// the NumberFormatInfo used to format the number.
//
// , - Thousand separator and number scaling.
// The ',' character serves two purposes. First, if the format string contains
// a ',' character between two digit placeholders (0 or #) and to the left of
// the decimal point if one is present, then the output will have thousand
// separators inserted between each group of three digits to the left of the
// decimal separator. The actual character used as a the decimal separator in
// the output string is given by the NumberFormatInfo used to format the
// number. Second, if the format string contains one or more ',' characters
// immediately to the left of the decimal point, or after the last digit
// placeholder if there is no decimal point, then the number will be divided by
// 1000 times the number of ',' characters before it is formatted. For example,
// the format string '0,,' will represent 100 million as just 100. Use of the
// ',' character to indicate scaling does not also cause the formatted number
// to have thousand separators. Thus, to scale a number by 1 million and insert
// thousand separators you would use the format string '#,##0,,'.
//
// % - Percentage placeholder. The presence of
// a '%' character in the format string causes the number to be multiplied by
// 100 before it is formatted. The '%' character itself is inserted in the
// output string where it appears in the format string.
//
// E+ E- e+ e-   - Scientific notation.
// If any of the strings 'E+', 'E-', 'e+', or 'e-' are present in the format
// string and are immediately followed by at least one '0' character, then the
// number is formatted using scientific notation with an 'E' or 'e' inserted
// between the number and the exponent. The number of '0' characters following
// the scientific notation indicator determines the minimum number of digits to
// output for the exponent. The 'E+' and 'e+' formats indicate that a sign
// character (plus or minus) should always precede the exponent. The 'E-' and
// 'e-' formats indicate that a sign character should only precede negative
// exponents.
//
// \ - Literal character. A backslash character
// causes the next character in the format string to be copied to the output
// string as-is. The backslash itself isn't copied, so to place a backslash
// character in the output string, use two backslashes (\\) in the format
// string.
//
// 'ABC' "ABC" - Literal string. Characters
// enclosed in single or double quotation marks are copied to the output string
// as-is and do not affect formatting.
//
// ; - Section separator. The ';' character is
// used to separate sections for positive, negative, and zero numbers in the
// format string.
//
// Other - All other characters are copied to
// the output string in the position they appear.
//
// For fixed point formats (formats not containing an 'E+', 'E-', 'e+', or
// 'e-'), the number is rounded to as many decimal places as there are digit
// placeholders to the right of the decimal point. If the format string does
// not contain a decimal point, the number is rounded to the nearest
// integer. If the number has more digits than there are digit placeholders to
// the left of the decimal point, the extra digits are copied to the output
// string immediately before the first digit placeholder.
//
// For scientific formats, the number is rounded to as many significant digits
// as there are digit placeholders in the format string.
//
// To allow for different formatting of positive, negative, and zero values, a
// user-defined format string may contain up to three sections separated by
// semicolons. The results of having one, two, or three sections in the format
// string are described in the table below.
//
// Sections:
//
// One - The format string applies to all values.
//
// Two - The first section applies to positive values
// and zeros, and the second section applies to negative values. If the number
// to be formatted is negative, but becomes zero after rounding according to
// the format in the second section, then the resulting zero is formatted
// according to the first section.
//
// Three - The first section applies to positive
// values, the second section applies to negative values, and the third section
// applies to zeros. The second section may be left empty (by having no
// characters between the semicolons), in which case the first section applies
// to all non-zero values. If the number to be formatted is non-zero, but
// becomes zero after rounding according to the format in the first or second
// section, then the resulting zero is formatted according to the third
// section.
//
// For both standard and user-defined formatting operations on values of type
// float and double, if the value being formatted is a NaN (Not
// a Number) or a positive or negative infinity, then regardless of the format
// string, the resulting string is given by the NaNSymbol,
// PositiveInfinitySymbol, or NegativeInfinitySymbol property of
// the NumberFormatInfo used to format the number.
//
// Parsing
//
// The Parse methods provided by the numeric classes are all of the form
//
//  public static XXX Parse(String s);
//  public static XXX Parse(String s, int style);
//  public static XXX Parse(String s, int style, NumberFormatInfo info);
//
// where XXX is the name of the particular numeric class. The methods convert a
// string to a numeric value. The optional style parameter specifies the
// permitted style of the numeric string. It must be a combination of bit flags
// from the NumberStyles enumeration. The optional info parameter
// specifies the NumberFormatInfo instance to use when parsing the
// string. If the info parameter is null or omitted, the numeric
// formatting information is obtained from the current culture.
//
// Numeric strings produced by the Format methods using the Currency,
// Decimal, Engineering, Fixed point, General, or Number standard formats
// (the C, D, E, F, G, and N format specifiers) are guaranteed to be parseable
// by the Parse methods if the NumberStyles.Any style is
// specified. Note, however, that the Parse methods do not accept
// NaNs or Infinities.

class CustomInfo {
    public UseGroup: boolean = false;
    public DecimalDigits: int = 0;
    public DecimalPointPos: int = -1;
    public DecimalTailSharpDigits: int = 0;
    public IntegerDigits: int = 0;
    public IntegerHeadSharpDigits: int = 0;
    public IntegerHeadPos: int = 0;
    public UseExponent: boolean = false;
    public ExponentDigits: int = 0;
    public ExponentTailSharpDigits: int = 0;
    public ExponentNegativeSignOnly: boolean = true;
    public DividePlaces: int = 0;
    public Percents: int = 0;
    public Permilles: int = 0;

    public static GetActiveSection(format: string, positive: Out<boolean>, zero: Out<boolean>, offset: Out<int>, length: Out<int>): void {
        const lens: IntArray = New.IntArray(3);
        let index: int = 0;
        let lastPos: int = 0;
        let quoted: boolean = false;

        for (let i: int = 0; i < format.length; i++) {
            let c: char = format[i].charCodeAt(0);

            if (c === '\"'.charCodeAt(0) || c === '\''.charCodeAt(0)) {
                if (i === 0 || format[i - 1] !== '\\')
                    quoted = !quoted;

                continue;
            }

            if (c === ';'.charCodeAt(0) && !quoted && (i == 0 || format[i - 1] !== '\\')) {
                lens[index++] = i - lastPos;
                lastPos = i + 1;
                if (index === 3)
                    break;
            }
        }

        if (index === 0) {
            offset.value = 0;
            length.value = format.length;
            return;
        }
        if (index === 1) {
            if (positive.value || zero.value) {
                offset.value = 0;
                length.value = lens[0];
                return;
            }
            if (lens[0] + 1 < format.length) {
                positive.value = true;
                offset.value = lens[0] + 1;
                length.value = format.length - offset.value;
                return;
            }
            else {
                offset.value = 0;
                length.value = lens[0];
                return;
            }
        }
        if (zero) {
            if (index === 2) {
                if (format.length - lastPos == 0) {
                    offset.value = 0;
                    length.value = lens[0];
                } else {
                    offset.value = lens[0] + lens[1] + 2;
                    length.value = format.length - offset.value;
                }
                return;
            }

            if (lens[2] == 0) {
                offset.value = 0;
                length.value = lens[0];
            } else {
                offset.value = lens[0] + lens[1] + 2;
                length.value = lens[2];
            }
            return;
        }
        if (positive.value) {
            offset.value = 0;
            length.value = lens[0];
            return;
        }
        if (lens[1] > 0) {
            positive.value = true;
            offset.value = lens[0] + 1;
            length.value = lens[1];
            return;
        }
        offset.value = 0;
        length.value = lens[0];
    }

    public static Parse(format: string, offset: int, length: int, nfi: NumberFormatInfo): CustomInfo {
        let literal: char = '\0'.charCodeAt(0);
        let integerArea: boolean = true;
        let decimalArea: boolean = false;
        let exponentArea: boolean = false;
        let sharpContinues: boolean = true;

        const info: CustomInfo = new CustomInfo();
        let groupSeparatorCounter: int = 0;

        for (let i: int = offset; i - offset < length; i++) {
            const c: char = format[i].charCodeAt(0);

            if (c === literal && c !== '\0'.charCodeAt(0)) {
                literal = '\0'.charCodeAt(0);
                continue;
            }
            if (literal !== '\0'.charCodeAt(0))
                continue;

            if (exponentArea && (c !== '\0'.charCodeAt(0) && c !== '0'.charCodeAt(0) && c !== '#'.charCodeAt(0))) {
                exponentArea = false;
                integerArea = (info.DecimalPointPos < 0);
                decimalArea = !integerArea;
                i--;
                continue;
            }

            switch (c) {
                case '\\'.charCodeAt(0):
                    i++;
                    continue;
                case '\''.charCodeAt(0):
                case '\"'.charCodeAt(0):
                    if (c === '\"'.charCodeAt(0) || c === '\''.charCodeAt(0)) {
                        literal = c;
                    }
                    continue;
                case '#'.charCodeAt(0):
                    if (sharpContinues && integerArea)
                        info.IntegerHeadSharpDigits++;
                    else if (decimalArea)
                        info.DecimalTailSharpDigits++;
                    else if (exponentArea)
                        info.ExponentTailSharpDigits++;

                //goto case '0';
                case '0'.charCodeAt(0):
                    if (c !== '#'.charCodeAt(0)) {
                        sharpContinues = false;
                        if (decimalArea)
                            info.DecimalTailSharpDigits = 0;
                        else if (exponentArea)
                            info.ExponentTailSharpDigits = 0;
                    }
                    if (info.IntegerHeadPos == -1)
                        info.IntegerHeadPos = i;

                    if (integerArea) {
                        info.IntegerDigits++;
                        if (groupSeparatorCounter > 0)
                            info.UseGroup = true;
                        groupSeparatorCounter = 0;
                    }
                    else if (decimalArea)
                        info.DecimalDigits++;
                    else if (exponentArea)
                        info.ExponentDigits++;
                    break;
                case 'e'.charCodeAt(0):
                case 'E'.charCodeAt(0):
                    if (info.UseExponent)
                        break;

                    info.UseExponent = true;
                    integerArea = false;
                    decimalArea = false;
                    exponentArea = true;
                    if (i + 1 - offset < length) {
                        const nc: char = format[i + 1].charCodeAt(0);
                        if (nc === '+'.charCodeAt(0))
                            info.ExponentNegativeSignOnly = false;
                        if (nc === '+'.charCodeAt(0) || nc === '-'.charCodeAt(0))
                            i++;
                        else if (nc !== '0'.charCodeAt(0) && nc !== '#'.charCodeAt(0)) {
                            info.UseExponent = false;
                            if (info.DecimalPointPos < 0)
                                integerArea = true;
                        }
                    }

                    break;
                case '.'.charCodeAt(0):
                    integerArea = false;
                    decimalArea = true;
                    exponentArea = false;
                    if (info.DecimalPointPos == -1)
                        info.DecimalPointPos = i;
                    break;
                case '%'.charCodeAt(0):
                    info.Percents++;
                    break;
                case '\u2030'.charCodeAt(0):
                    info.Permilles++;
                    break;
                case ','.charCodeAt(0):
                    if (integerArea && info.IntegerDigits > 0)
                        groupSeparatorCounter++;
                    break;
                default:
                    break;
            }
        }

        if (info.ExponentDigits == 0)
            info.UseExponent = false;
        else
            info.IntegerHeadSharpDigits = 0;

        if (info.DecimalDigits == 0)
            info.DecimalPointPos = -1;

        info.DividePlaces += groupSeparatorCounter * 3;

        return info;
    }

    public Format(format: string, offset: int, length: int, nfi: NumberFormatInfo, positive: boolean, sb_int: StringBuilder, sb_dec: StringBuilder, sb_exp: StringBuilder): string {
        const sb: StringBuilder = new StringBuilder();
        let literal: char = '\0'.charCodeAt(0);
        let integerArea: boolean = true;
        let decimalArea: boolean = false;
        let intSharpCounter: int = 0;
        let sb_int_index: int = 0;
        let sb_dec_index: int = 0;

        const groups: IntArray = nfi.NumberGroupSizes;
        const groupSeparator: string = nfi.NumberGroupSeparator;
        let intLen: int = 0, total: int = 0, groupIndex: int = 0, counter: int = 0, groupSize: int = 0;
        if (this.UseGroup && groups.length > 0) {
            intLen = sb_int.Length;
            for (let i: int = 0; i < groups.length; i++) {
                total += groups[i];
                if (total <= intLen)
                    groupIndex = i;
            }
            groupSize = groups[groupIndex];
            const fraction: int = intLen > total ? intLen - total : 0;
            if (groupSize == 0) {
                while (groupIndex >= 0 && groups[groupIndex] === 0)
                    groupIndex--;

                groupSize = fraction > 0 ? fraction : groups[groupIndex];
            }
            if (fraction == 0)
                counter = groupSize;
            else {
                groupIndex += fraction / groupSize;
                counter = fraction % groupSize;
                if (counter == 0)
                    counter = groupSize;
                else
                    groupIndex++;
            }
        }
        else
            this.UseGroup = false;

        for (let i: int = offset; i - offset < length; i++) {
            const c: char = format[i].charCodeAt(0);

            if (c == literal && c !== '\0'.charCodeAt(0)) {
                literal = '\0'.charCodeAt(0);
                continue;
            }
            if (literal !== '\0'.charCodeAt(0)) {
                sb.AppendChar(c);
                continue;
            }

            switch (c) {
                case '\\'.charCodeAt(0):
                    i++;
                    if (i - offset < length)
                        sb.Append(format[i]);
                    continue;
                case '\''.charCodeAt(0):
                case '\"'.charCodeAt(0):
                    if (c === '\"'.charCodeAt(0) || c === '\''.charCodeAt(0))
                        literal = c;
                    continue;
                case '#'.charCodeAt(0):
                // goto case '0';
                case '0'.charCodeAt(0):
                    if (integerArea) {
                        intSharpCounter++;
                        if (this.IntegerDigits - intSharpCounter < sb_int.Length + sb_int_index || c === '0'.charCodeAt(0))
                            while (this.IntegerDigits - intSharpCounter + sb_int_index < sb_int.Length) {
                                sb.Append(sb_int[sb_int_index++]);
                                if (this.UseGroup && --intLen > 0 && --counter == 0) {
                                    sb.Append(groupSeparator);
                                    if (--groupIndex < groups.length && groupIndex >= 0)
                                        groupSize = groups[groupIndex];
                                    counter = groupSize;
                                }
                            }
                        break;
                    }
                    else if (decimalArea) {
                        if (sb_dec_index < sb_dec.Length)
                            sb.Append(sb_dec[sb_dec_index++]);
                        break;
                    }

                    sb.AppendChar(c);
                    break;
                case 'e'.charCodeAt(0):
                case 'E'.charCodeAt(0):
                    if (sb_exp == null || !this.UseExponent) {
                        sb.AppendChar(c);
                        break;
                    }

                    let flag1: boolean = true;
                    let flag2: boolean = false;

                    let q: int;
                    for (q = i + 1; q - offset < length; q++) {
                        if (format[q] === '0') {
                            flag2 = true;
                            continue;
                        }
                        if (q === i + 1 && (format[q] === '+' || format[q] === '-'))
                            continue;
                        if (!flag2)
                            flag1 = false;
                        break;
                    }

                    if (flag1) {
                        i = q - 1;
                        integerArea = (this.DecimalPointPos < 0);
                        decimalArea = !integerArea;

                        sb.AppendChar(c);
                        sb.Append(sb_exp.ToString());
                        sb_exp = null as any;
                    }
                    else
                        sb.AppendChar(c);

                    break;
                case '.'.charCodeAt(0):
                    if (this.DecimalPointPos == i) {
                        if (this.DecimalDigits > 0) {
                            while (sb_int_index < sb_int.Length)
                                sb.Append(sb_int[sb_int_index++]);
                        }
                        if (sb_dec.Length > 0)
                            sb.Append(nfi.NumberDecimalSeparator);
                    }
                    integerArea = false;
                    decimalArea = true;
                    break;
                case ','.charCodeAt(0):
                    break;
                case '%'.charCodeAt(0):
                    sb.Append(nfi.PercentSymbol);
                    break;
                case '\u2030'.charCodeAt(0):
                    sb.Append(nfi.PerMilleSymbol);
                    break;
                default:
                    sb.AppendChar(c);
                    break;
            }
        }

        if (!positive)
            sb.Insert(0, nfi.NegativeSign);

        return sb.ToString();
    }
}

export class NumberFormatter extends TObject {
    protected dispose(disposing: boolean): void {
        throw new Error('Method not implemented.');
    }

    private static readonly DefaultExpPrecision: int = 6;
    private static readonly HundredMillion: int = 100000000;
    private static readonly SeventeenDigitsThreshold: int = 10000000000000000;
    private static readonly ULongDivHundredMillion: int = UInt64MaxValue.div(NumberFormatter.HundredMillion).toNumber();
    private static readonly ULongModHundredMillion: int = 1 + UInt64MaxValue.mod(NumberFormatter.HundredMillion).toNumber();

    private static readonly DoubleBitsExponentShift: int = 52;
    private static readonly DoubleBitsExponentMask: int = 0x7ff;
    private static readonly DoubleBitsMantissaMask: int = 0xfffffffffffff;
    private static readonly DecimalBitsScaleMask: int = 0x1f0000;

    private static SingleDefPrecision: int = 7;
    private static DoubleDefPrecision: int = 15;
    private static Int32DefPrecision: int = 10;
    private static UInt32DefPrecision: int = 10;
    private static Int64DefPrecision: int = 19;
    private static UInt64DefPrecision: int = 20;
    private static DecimalDefPrecision: int = 100;
    private static TenPowersListLength: int = 19;

    private MinRoundtripVal: int = -1.79769313486231E+308;
    private MaxRoundtripVal: int = 1.79769313486231E+308;

    // The below arrays are taken from mono/metatdata/number-formatter.h

    private static readonly MantissaBitsTable: long[] = [
        bigInt('4556951262222748432'),
        bigInt('9113902524445496865'),
        bigInt('1822780504889099373'),
        bigInt('3645561009778198746'),
        bigInt('7291122019556397492'),
        bigInt('14582244039112794984'),
        bigInt('2916448807822558996'),
        bigInt('5832897615645117993'),
        bigInt('11665795231290235987'),
        bigInt('2333159046258047197'),
        bigInt('4666318092516094394'),
        bigInt('9332636185032188789'),
        bigInt('1866527237006437757'),
        bigInt('3733054474012875515'),
        bigInt('7466108948025751031'),
        bigInt('14932217896051502063'),
        bigInt('2986443579210300412'),
        bigInt('5972887158420600825'),
        bigInt('11945774316841201651'),
        bigInt('2389154863368240330'),
        bigInt('4778309726736480660'),
        bigInt('9556619453472961320'),
        bigInt('1911323890694592264'),
        bigInt('3822647781389184528'),
        bigInt('7645295562778369056'),
        bigInt('15290591125556738113'),
        bigInt('3058118225111347622'),
        bigInt('6116236450222695245'),
        bigInt('12232472900445390490'),
        bigInt('2446494580089078098'),
        bigInt('4892989160178156196'),
        bigInt('9785978320356312392'),
        bigInt('1957195664071262478'),
        bigInt('3914391328142524957'),
        bigInt('7828782656285049914'),
        bigInt('15657565312570099828'),
        bigInt('3131513062514019965'),
        bigInt('6263026125028039931'),
        bigInt('12526052250056079862'),
        bigInt('2505210450011215972'),
        bigInt('5010420900022431944'),
        bigInt('10020841800044863889'),
        bigInt('2004168360008972777'),
        bigInt('4008336720017945555'),
        bigInt('8016673440035891111'),
        bigInt('16033346880071782223'),
        bigInt('3206669376014356444'),
        bigInt('6413338752028712889'),
        bigInt('12826677504057425779'),
        bigInt('2565335500811485155'),
        bigInt('5130671001622970311'),
        bigInt('10261342003245940623'),
        bigInt('2052268400649188124'),
        bigInt('4104536801298376249'),
        bigInt('8209073602596752498'),
        bigInt('16418147205193504997'),
        bigInt('3283629441038700999'),
        bigInt('6567258882077401998'),
        bigInt('13134517764154803997'),
        bigInt('2626903552830960799'),
        bigInt('5253807105661921599'),
        bigInt('10507614211323843198'),
        bigInt('2101522842264768639'),
        bigInt('4203045684529537279'),
        bigInt('8406091369059074558'),
        bigInt('16812182738118149117'),
        bigInt('3362436547623629823'),
        bigInt('6724873095247259646'),
        bigInt('13449746190494519293'),
        bigInt('2689949238098903858'),
        bigInt('5379898476197807717'),
        bigInt('10759796952395615435'),
        bigInt('2151959390479123087'),
        bigInt('4303918780958246174'),
        bigInt('8607837561916492348'),
        bigInt('17215675123832984696'),
        bigInt('3443135024766596939'),
        bigInt('6886270049533193878'),
        bigInt('13772540099066387756'),
        bigInt('2754508019813277551'),
        bigInt('5509016039626555102'),
        bigInt('11018032079253110205'),
        bigInt('2203606415850622041'),
        bigInt('4407212831701244082'),
        bigInt('8814425663402488164'),
        bigInt('17628851326804976328'),
        bigInt('3525770265360995265'),
        bigInt('7051540530721990531'),
        bigInt('14103081061443981063'),
        bigInt('2820616212288796212'),
        bigInt('5641232424577592425'),
        bigInt('11282464849155184850'),
        bigInt('2256492969831036970'),
        bigInt('4512985939662073940'),
        bigInt('9025971879324147880'),
        bigInt('18051943758648295760'),
        bigInt('3610388751729659152'),
        bigInt('7220777503459318304'),
        bigInt('14441555006918636608'),
        bigInt('2888311001383727321'),
        bigInt('5776622002767454643'),
        bigInt('11553244005534909286'),
        bigInt('2310648801106981857'),
        bigInt('4621297602213963714'),
        bigInt('9242595204427927429'),
        bigInt('1848519040885585485'),
        bigInt('3697038081771170971'),
        bigInt('7394076163542341943'),
        bigInt('14788152327084683887'),
        bigInt('2957630465416936777'),
        bigInt('5915260930833873554'),
        bigInt('11830521861667747109'),
        bigInt('2366104372333549421'),
        bigInt('4732208744667098843'),
        bigInt('9464417489334197687'),
        bigInt('1892883497866839537'),
        bigInt('3785766995733679075'),
        bigInt('7571533991467358150'),
        bigInt('15143067982934716300'),
        bigInt('3028613596586943260'),
        bigInt('6057227193173886520'),
        bigInt('12114454386347773040'),
        bigInt('2422890877269554608'),
        bigInt('4845781754539109216'),
        bigInt('9691563509078218432'),
        bigInt('1938312701815643686'),
        bigInt('3876625403631287372'),
        bigInt('7753250807262574745'),
        bigInt('15506501614525149491'),
        bigInt('3101300322905029898'),
        bigInt('6202600645810059796'),
        bigInt('12405201291620119593'),
        bigInt('2481040258324023918'),
        bigInt('4962080516648047837'),
        bigInt('9924161033296095674'),
        bigInt('1984832206659219134'),
        bigInt('3969664413318438269'),
        bigInt('7939328826636876539'),
        bigInt('15878657653273753079'),
        bigInt('3175731530654750615'),
        bigInt('6351463061309501231'),
        bigInt('12702926122619002463'),
        bigInt('2540585224523800492'),
        bigInt('5081170449047600985'),
        bigInt('10162340898095201970'),
        bigInt('2032468179619040394'),
        bigInt('4064936359238080788'),
        bigInt('8129872718476161576'),
        bigInt('16259745436952323153'),
        bigInt('3251949087390464630'),
        bigInt('6503898174780929261'),
        bigInt('13007796349561858522'),
        bigInt('2601559269912371704'),
        bigInt('5203118539824743409'),
        bigInt('10406237079649486818'),
        bigInt('2081247415929897363'),
        bigInt('4162494831859794727'),
        bigInt('8324989663719589454'),
        bigInt('16649979327439178909'),
        bigInt('3329995865487835781'),
        bigInt('6659991730975671563'),
        bigInt('13319983461951343127'),
        bigInt('2663996692390268625'),
        bigInt('5327993384780537250'),
        bigInt('10655986769561074501'),
        bigInt('2131197353912214900'),
        bigInt('4262394707824429800'),
        bigInt('8524789415648859601'),
        bigInt('17049578831297719202'),
        bigInt('3409915766259543840'),
        bigInt('6819831532519087681'),
        bigInt('13639663065038175362'),
        bigInt('2727932613007635072'),
        bigInt('5455865226015270144'),
        bigInt('10911730452030540289'),
        bigInt('2182346090406108057'),
        bigInt('4364692180812216115'),
        bigInt('8729384361624432231'),
        bigInt('17458768723248864463'),
        bigInt('3491753744649772892'),
        bigInt('6983507489299545785'),
        bigInt('13967014978599091570'),
        bigInt('2793402995719818314'),
        bigInt('5586805991439636628'),
        bigInt('11173611982879273256'),
        bigInt('2234722396575854651'),
        bigInt('4469444793151709302'),
        bigInt('8938889586303418605'),
        bigInt('17877779172606837210'),
        bigInt('3575555834521367442'),
        bigInt('7151111669042734884'),
        bigInt('14302223338085469768'),
        bigInt('2860444667617093953'),
        bigInt('5720889335234187907'),
        bigInt('11441778670468375814'),
        bigInt('2288355734093675162'),
        bigInt('4576711468187350325'),
        bigInt('9153422936374700651'),
        bigInt('1830684587274940130'),
        bigInt('3661369174549880260'),
        bigInt('7322738349099760521'),
        bigInt('14645476698199521043'),
        bigInt('2929095339639904208'),
        bigInt('5858190679279808417'),
        bigInt('11716381358559616834'),
        bigInt('2343276271711923366'),
        bigInt('4686552543423846733'),
        bigInt('9373105086847693467'),
        bigInt('1874621017369538693'),
        bigInt('3749242034739077387'),
        bigInt('7498484069478154774'),
        bigInt('14996968138956309548'),
        bigInt('2999393627791261909'),
        bigInt('5998787255582523819'),
        bigInt('11997574511165047638'),
        bigInt('2399514902233009527'),
        bigInt('4799029804466019055'),
        bigInt('9598059608932038110'),
        bigInt('1919611921786407622'),
        bigInt('3839223843572815244'),
        bigInt('7678447687145630488'),
        bigInt('15356895374291260977'),
        bigInt('3071379074858252195'),
        bigInt('6142758149716504390'),
        bigInt('12285516299433008781'),
        bigInt('2457103259886601756'),
        bigInt('4914206519773203512'),
        bigInt('9828413039546407025'),
        bigInt('1965682607909281405'),
        bigInt('3931365215818562810'),
        bigInt('7862730431637125620'),
        bigInt('15725460863274251240'),
        bigInt('3145092172654850248'),
        bigInt('6290184345309700496'),
        bigInt('12580368690619400992'),
        bigInt('2516073738123880198'),
        bigInt('5032147476247760397'),
        bigInt('10064294952495520794'),
        bigInt('2012858990499104158'),
        bigInt('4025717980998208317'),
        bigInt('8051435961996416635'),
        bigInt('16102871923992833270'),
        bigInt('3220574384798566654'),
        bigInt('6441148769597133308'),
        bigInt('12882297539194266616'),
        bigInt('2576459507838853323'),
        bigInt('5152919015677706646'),
        bigInt('10305838031355413293'),
        bigInt('2061167606271082658'),
        bigInt('4122335212542165317'),
        bigInt('8244670425084330634'),
        bigInt('16489340850168661269'),
        bigInt('3297868170033732253'),
        bigInt('6595736340067464507'),
        bigInt('13191472680134929015'),
        bigInt('2638294536026985803'),
        bigInt('5276589072053971606'),
        bigInt('10553178144107943212'),
        bigInt('2110635628821588642'),
        bigInt('4221271257643177284'),
        bigInt('8442542515286354569'),
        bigInt('16885085030572709139'),
        bigInt('3377017006114541827'),
        bigInt('6754034012229083655'),
        bigInt('13508068024458167311'),
        bigInt('2701613604891633462'),
        bigInt('5403227209783266924'),
        bigInt('10806454419566533849'),
        bigInt('2161290883913306769'),
        bigInt('4322581767826613539'),
        bigInt('8645163535653227079'),
        bigInt('17290327071306454158'),
        bigInt('3458065414261290831'),
        bigInt('6916130828522581663'),
        bigInt('13832261657045163327'),
        bigInt('2766452331409032665'),
        bigInt('5532904662818065330'),
        bigInt('11065809325636130661'),
        bigInt('2213161865127226132'),
        bigInt('4426323730254452264'),
        bigInt('8852647460508904529'),
        bigInt('17705294921017809058'),
        bigInt('3541058984203561811'),
        bigInt('7082117968407123623'),
        bigInt('14164235936814247246'),
        bigInt('2832847187362849449'),
        bigInt('5665694374725698898'),
        bigInt('11331388749451397797'),
        bigInt('2266277749890279559'),
        bigInt('4532555499780559119'),
        bigInt('9065110999561118238'),
        bigInt('1813022199912223647'),
        bigInt('3626044399824447295'),
        bigInt('7252088799648894590'),
        bigInt('14504177599297789180'),
        bigInt('2900835519859557836'),
        bigInt('5801671039719115672'),
        bigInt('11603342079438231344'),
        bigInt('2320668415887646268'),
        bigInt('4641336831775292537'),
        bigInt('9282673663550585075'),
        bigInt('1856534732710117015'),
        bigInt('3713069465420234030'),
        bigInt('7426138930840468060'),
        bigInt('14852277861680936121'),
        bigInt('2970455572336187224'),
        bigInt('5940911144672374448'),
        bigInt('11881822289344748896'),
        bigInt('2376364457868949779'),
        bigInt('4752728915737899558'),
        bigInt('9505457831475799117'),
        bigInt('1901091566295159823'),
        bigInt('3802183132590319647'),
        bigInt('7604366265180639294'),
        bigInt('15208732530361278588'),
        bigInt('3041746506072255717'),
        bigInt('6083493012144511435'),
        bigInt('12166986024289022870'),
        bigInt('2433397204857804574'),
        bigInt('4866794409715609148'),
        bigInt('9733588819431218296'),
        bigInt('1946717763886243659'),
        bigInt('3893435527772487318'),
        bigInt('7786871055544974637'),
        bigInt('15573742111089949274'),
        bigInt('3114748422217989854'),
        bigInt('6229496844435979709'),
        bigInt('12458993688871959419'),
        bigInt('2491798737774391883'),
        bigInt('4983597475548783767'),
        bigInt('9967194951097567535'),
        bigInt('1993438990219513507'),
        bigInt('3986877980439027014'),
        bigInt('7973755960878054028'),
        bigInt('15947511921756108056'),
        bigInt('3189502384351221611'),
        bigInt('6379004768702443222'),
        bigInt('12758009537404886445'),
        bigInt('2551601907480977289'),
        bigInt('5103203814961954578'),
        bigInt('10206407629923909156'),
        bigInt('2041281525984781831'),
        bigInt('4082563051969563662'),
        bigInt('8165126103939127325'),
        bigInt('16330252207878254650'),
        bigInt('3266050441575650930'),
        bigInt('6532100883151301860'),
        bigInt('13064201766302603720'),
        bigInt('2612840353260520744'),
        bigInt('5225680706521041488'),
        bigInt('10451361413042082976'),
        bigInt('2090272282608416595'),
        bigInt('4180544565216833190'),
        bigInt('8361089130433666380'),
        bigInt('16722178260867332761'),
        bigInt('3344435652173466552'),
        bigInt('6688871304346933104'),
        bigInt('13377742608693866209'),
        bigInt('2675548521738773241'),
        bigInt('5351097043477546483'),
        bigInt('10702194086955092967'),
        bigInt('2140438817391018593'),
        bigInt('4280877634782037187'),
        bigInt('8561755269564074374'),
        bigInt('17123510539128148748'),
        bigInt('3424702107825629749'),
        bigInt('6849404215651259499'),
        bigInt('13698808431302518998'),
        bigInt('2739761686260503799'),
        bigInt('5479523372521007599'),
        bigInt('10959046745042015198'),
        bigInt('2191809349008403039'),
        bigInt('4383618698016806079'),
        bigInt('8767237396033612159'),
        bigInt('17534474792067224318'),
        bigInt('3506894958413444863'),
        bigInt('7013789916826889727'),
        bigInt('14027579833653779454'),
        bigInt('2805515966730755890'),
        bigInt('5611031933461511781'),
        bigInt('11222063866923023563'),
        bigInt('2244412773384604712'),
        bigInt('4488825546769209425'),
        bigInt('8977651093538418850'),
        bigInt('17955302187076837701'),
        bigInt('3591060437415367540'),
        bigInt('7182120874830735080'),
        bigInt('14364241749661470161'),
        bigInt('2872848349932294032'),
        bigInt('5745696699864588064'),
        bigInt('11491393399729176129'),
        bigInt('2298278679945835225'),
        bigInt('4596557359891670451'),
        bigInt('9193114719783340903'),
        bigInt('1838622943956668180'),
        bigInt('3677245887913336361'),
        bigInt('7354491775826672722'),
        bigInt('14708983551653345445'),
        bigInt('2941796710330669089'),
        bigInt('5883593420661338178'),
        bigInt('11767186841322676356'),
        bigInt('2353437368264535271'),
        bigInt('4706874736529070542'),
        bigInt('9413749473058141084'),
        bigInt('1882749894611628216'),
        bigInt('3765499789223256433'),
        bigInt('7530999578446512867'),
        bigInt('15061999156893025735'),
        bigInt('3012399831378605147'),
        bigInt('6024799662757210294'),
        bigInt('12049599325514420588'),
        bigInt('2409919865102884117'),
        bigInt('4819839730205768235'),
        bigInt('9639679460411536470'),
        bigInt('1927935892082307294'),
        bigInt('3855871784164614588'),
        bigInt('7711743568329229176'),
        bigInt('15423487136658458353'),
        bigInt('3084697427331691670'),
        bigInt('6169394854663383341'),
        bigInt('12338789709326766682'),
        bigInt('2467757941865353336'),
        bigInt('4935515883730706673'),
        bigInt('9871031767461413346'),
        bigInt('1974206353492282669'),
        bigInt('3948412706984565338'),
        bigInt('7896825413969130677'),
        bigInt('15793650827938261354'),
        bigInt('3158730165587652270'),
        bigInt('6317460331175304541'),
        bigInt('12634920662350609083'),
        bigInt('2526984132470121816'),
        bigInt('5053968264940243633'),
        bigInt('10107936529880487266'),
        bigInt('2021587305976097453'),
        bigInt('4043174611952194906'),
        bigInt('8086349223904389813'),
        bigInt('16172698447808779626'),
        bigInt('3234539689561755925'),
        bigInt('6469079379123511850'),
        bigInt('12938158758247023701'),
        bigInt('2587631751649404740'),
        bigInt('5175263503298809480'),
        bigInt('10350527006597618960'),
        bigInt('2070105401319523792'),
        bigInt('4140210802639047584'),
        bigInt('8280421605278095168'),
        bigInt('16560843210556190337'),
        bigInt('3312168642111238067'),
        bigInt('6624337284222476135'),
        bigInt('13248674568444952270'),
        bigInt('2649734913688990454'),
        bigInt('5299469827377980908'),
        bigInt('10598939654755961816'),
        bigInt('2119787930951192363'),
        bigInt('4239575861902384726'),
        bigInt('8479151723804769452'),
        bigInt('16958303447609538905'),
        bigInt('3391660689521907781'),
        bigInt('6783321379043815562'),
        bigInt('13566642758087631124'),
        bigInt('2713328551617526224'),
        bigInt('5426657103235052449'),
        bigInt('10853314206470104899'),
        bigInt('2170662841294020979'),
        bigInt('4341325682588041959'),
        bigInt('8682651365176083919'),
        bigInt('17365302730352167839'),
        bigInt('3473060546070433567'),
        bigInt('6946121092140867135'),
        bigInt('13892242184281734271'),
        bigInt('2778448436856346854'),
        bigInt('5556896873712693708'),
        bigInt('11113793747425387417'),
        bigInt('2222758749485077483'),
        bigInt('4445517498970154966'),
        bigInt('8891034997940309933'),
        bigInt('17782069995880619867'),
        bigInt('3556413999176123973'),
        bigInt('7112827998352247947'),
        bigInt('14225655996704495894'),
        bigInt('2845131199340899178'),
        bigInt('5690262398681798357'),
        bigInt('11380524797363596715'),
        bigInt('2276104959472719343'),
        bigInt('4552209918945438686'),
        bigInt('9104419837890877372'),
        bigInt('1820883967578175474'),
        bigInt('3641767935156350948'),
        bigInt('7283535870312701897'),
        bigInt('14567071740625403795'),
        bigInt('2913414348125080759'),
        bigInt('5826828696250161518'),
        bigInt('11653657392500323036'),
        bigInt('2330731478500064607'),
        bigInt('4661462957000129214'),
        bigInt('9322925914000258429'),
        bigInt('1864585182800051685'),
        bigInt('3729170365600103371'),
        bigInt('7458340731200206743'),
        bigInt('14916681462400413486'),
        bigInt('2983336292480082697'),
        bigInt('5966672584960165394'),
        bigInt('11933345169920330789'),
        bigInt('2386669033984066157'),
        bigInt('4773338067968132315'),
        bigInt('9546676135936264631'),
        bigInt('1909335227187252926'),
        bigInt('3818670454374505852'),
        bigInt('7637340908749011705'),
        bigInt('15274681817498023410'),
        bigInt('3054936363499604682'),
        bigInt('6109872726999209364'),
        bigInt('12219745453998418728'),
        bigInt('2443949090799683745'),
        bigInt('4887898181599367491'),
        bigInt('9775796363198734982'),
        bigInt('1955159272639746996'),
        bigInt('3910318545279493993'),
        bigInt('7820637090558987986'),
        bigInt('15641274181117975972'),
        bigInt('3128254836223595194'),
        bigInt('6256509672447190388'),
        bigInt('12513019344894380777'),
        bigInt('2502603868978876155'),
        bigInt('5005207737957752311'),
        bigInt('10010415475915504622'),
        bigInt('2002083095183100924'),
        bigInt('4004166190366201848'),
        bigInt('8008332380732403697'),
        bigInt('16016664761464807395'),
        bigInt('3203332952292961479'),
        bigInt('6406665904585922958'),
        bigInt('12813331809171845916'),
        bigInt('2562666361834369183'),
        bigInt('5125332723668738366'),
        bigInt('10250665447337476733'),
        bigInt('2050133089467495346'),
        bigInt('4100266178934990693'),
        bigInt('8200532357869981386'),
        bigInt('16401064715739962772'),
        bigInt('3280212943147992554'),
        bigInt('6560425886295985109'),
        bigInt('13120851772591970218'),
        bigInt('2624170354518394043'),
        bigInt('5248340709036788087'),
        bigInt('10496681418073576174'),
        bigInt('2099336283614715234'),
        bigInt('4198672567229430469'),
        bigInt('8397345134458860939'),
        bigInt('16794690268917721879'),
        bigInt('3358938053783544375'),
        bigInt('6717876107567088751'),
        bigInt('13435752215134177503'),
        bigInt('2687150443026835500'),
        bigInt('5374300886053671001'),
        bigInt('10748601772107342002'),
        bigInt('2149720354421468400'),
        bigInt('4299440708842936801'),
        bigInt('8598881417685873602'),
        bigInt('17197762835371747204'),
        bigInt('3439552567074349440'),
        bigInt('6879105134148698881'),
        bigInt('13758210268297397763'),
        bigInt('2751642053659479552'),
        bigInt('5503284107318959105'),
        bigInt('11006568214637918210'),
        bigInt('2201313642927583642'),
        bigInt('4402627285855167284'),
        bigInt('8805254571710334568'),
        bigInt('17610509143420669137'),
        bigInt('3522101828684133827'),
        bigInt('7044203657368267654'),
        bigInt('14088407314736535309'),
        bigInt('2817681462947307061'),
        bigInt('5635362925894614123'),
        bigInt('11270725851789228247'),
        bigInt('2254145170357845649'),
        bigInt('4508290340715691299'),
        bigInt('9016580681431382598'),
        bigInt('18033161362862765196'),
        bigInt('3606632272572553039'),
        bigInt('7213264545145106078'),
        bigInt('14426529090290212157'),
        bigInt('2885305818058042431'),
        bigInt('5770611636116084862'),
        bigInt('11541223272232169725'),
        bigInt('2308244654446433945'),
        bigInt('4616489308892867890'),
        bigInt('9232978617785735780'),
        bigInt('1846595723557147156'),
        bigInt('3693191447114294312'),
        bigInt('7386382894228588624'),
        bigInt('14772765788457177249'),
        bigInt('2954553157691435449'),
        bigInt('5909106315382870899'),
        bigInt('11818212630765741799'),
        bigInt('2363642526153148359'),
        bigInt('4727285052306296719'),
        bigInt('9454570104612593439'),
        bigInt('1890914020922518687'),
        bigInt('3781828041845037375'),
        bigInt('7563656083690074751'),
        bigInt('15127312167380149503'),
        bigInt('3025462433476029900'),
        bigInt('6050924866952059801'),
        bigInt('12101849733904119602'),
        bigInt('2420369946780823920'),
        bigInt('4840739893561647841'),
        bigInt('9681479787123295682'),
        bigInt('1936295957424659136'),
        bigInt('3872591914849318272'),
        bigInt('7745183829698636545'),
        bigInt('15490367659397273091'),
        bigInt('3098073531879454618'),
        bigInt('6196147063758909236'),
        bigInt('12392294127517818473'),
        bigInt('2478458825503563694'),
        bigInt('4956917651007127389'),
        bigInt('9913835302014254778'),
        bigInt('1982767060402850955'),
        bigInt('3965534120805701911'),
        bigInt('7931068241611403822'),
        bigInt('15862136483222807645'),
        bigInt('3172427296644561529'),
        bigInt('6344854593289123058'),
        bigInt('12689709186578246116'),
        bigInt('2537941837315649223'),
        bigInt('5075883674631298446'),
        bigInt('10151767349262596893'),
        bigInt('2030353469852519378'),
        bigInt('4060706939705038757'),
        bigInt('8121413879410077514'),
        bigInt('16242827758820155028'),
        bigInt('3248565551764031005'),
        bigInt('6497131103528062011'),
        bigInt('12994262207056124023'),
        bigInt('2598852441411224804'),
        bigInt('5197704882822449609'),
        bigInt('10395409765644899218'),
        bigInt('2079081953128979843'),
        bigInt('4158163906257959687'),
        bigInt('8316327812515919374'),
        bigInt('16632655625031838749'),
        bigInt('3326531125006367749'),
        bigInt('6653062250012735499'),
        bigInt('13306124500025470999'),
        bigInt('2661224900005094199'),
        bigInt('5322449800010188399'),
        bigInt('10644899600020376799'),
        bigInt('2128979920004075359'),
        bigInt('4257959840008150719'),
        bigInt('8515919680016301439'),
        bigInt('17031839360032602879'),
        bigInt('3406367872006520575'),
        bigInt('6812735744013041151'),
        bigInt('13625471488026082303'),
        bigInt('2725094297605216460'),
        bigInt('5450188595210432921'),
        bigInt('10900377190420865842'),
        bigInt('2180075438084173168'),
        bigInt('4360150876168346337'),
        bigInt('8720301752336692674'),
        bigInt('17440603504673385348'),
        bigInt('3488120700934677069'),
        bigInt('6976241401869354139'),
        bigInt('13952482803738708279'),
        bigInt('2790496560747741655'),
        bigInt('5580993121495483311'),
        bigInt('11161986242990966623'),
        bigInt('2232397248598193324'),
        bigInt('4464794497196386649'),
        bigInt('8929588994392773298'),
        bigInt('17859177988785546597'),
        bigInt('3571835597757109319'),
        bigInt('7143671195514218638'),
        bigInt('14287342391028437277'),
        bigInt('2857468478205687455'),
        bigInt('5714936956411374911'),
        bigInt('11429873912822749822'),
        bigInt('2285974782564549964'),
        bigInt('4571949565129099928'),
        bigInt('9143899130258199857'),
        bigInt('1828779826051639971'),
        bigInt('3657559652103279943'),
        bigInt('7315119304206559886'),
        bigInt('14630238608413119772'),
        bigInt('2926047721682623954'),
        bigInt('5852095443365247908'),
        bigInt('11704190886730495817'),
        bigInt('2340838177346099163'),
        bigInt('4681676354692198327'),
        bigInt('9363352709384396654'),
        bigInt('1872670541876879330'),
        bigInt('3745341083753758661'),
        bigInt('7490682167507517323'),
        bigInt('14981364335015034646'),
        bigInt('2996272867003006929'),
        bigInt('5992545734006013858'),
        bigInt('11985091468012027717'),
        bigInt('2397018293602405543'),
        bigInt('4794036587204811087'),
        bigInt('9588073174409622174'),
        bigInt('1917614634881924434'),
        bigInt('3835229269763848869'),
        bigInt('7670458539527697739'),
        bigInt('15340917079055395478'),
        bigInt('3068183415811079095'),
        bigInt('6136366831622158191'),
        bigInt('12272733663244316382'),
        bigInt('2454546732648863276'),
        bigInt('4909093465297726553'),
        bigInt('9818186930595453106'),
        bigInt('1963637386119090621'),
        bigInt('3927274772238181242'),
        bigInt('7854549544476362484'),
        bigInt('15709099088952724969'),
        bigInt('3141819817790544993'),
        bigInt('6283639635581089987'),
        bigInt('12567279271162179975'),
        bigInt('2513455854232435995'),
        bigInt('5026911708464871990'),
        bigInt('10053823416929743980'),
        bigInt('2010764683385948796'),
        bigInt('4021529366771897592'),
        bigInt('8043058733543795184'),
        bigInt('16086117467087590369'),
        bigInt('3217223493417518073'),
        bigInt('6434446986835036147'),
        bigInt('12868893973670072295'),
        bigInt('2573778794734014459'),
        bigInt('5147557589468028918'),
        bigInt('10295115178936057836'),
        bigInt('2059023035787211567'),
        bigInt('4118046071574423134'),
        bigInt('8236092143148846269'),
        bigInt('16472184286297692538'),
        bigInt('3294436857259538507'),
        bigInt('6588873714519077015'),
        bigInt('13177747429038154030'),
        bigInt('2635549485807630806'),
        bigInt('5271098971615261612'),
        bigInt('10542197943230523224'),
        bigInt('2108439588646104644'),
        bigInt('4216879177292209289'),
        bigInt('8433758354584418579'),
        bigInt('16867516709168837158'),
        bigInt('3373503341833767431'),
        bigInt('6747006683667534863'),
        bigInt('13494013367335069727'),
        bigInt('2698802673467013945'),
        bigInt('5397605346934027890'),
        bigInt('10795210693868055781'),
        bigInt('2159042138773611156'),
        bigInt('4318084277547222312'),
        bigInt('8636168555094444625'),
        bigInt('17272337110188889250'),
        bigInt('3454467422037777850'),
        bigInt('6908934844075555700'),
        bigInt('13817869688151111400'),
        bigInt('2763573937630222280'),
        bigInt('5527147875260444560'),
        bigInt('11054295750520889120'),
        bigInt('2210859150104177824'),
        bigInt('4421718300208355648'),
        bigInt('8843436600416711296'),
        bigInt('17686873200833422592'),
        bigInt('3537374640166684518'),
        bigInt('7074749280333369037'),
        bigInt('14149498560666738074'),
        bigInt('2829899712133347614'),
        bigInt('5659799424266695229'),
        bigInt('11319598848533390459'),
        bigInt('2263919769706678091'),
        bigInt('4527839539413356183'),
        bigInt('9055679078826712367'),
        bigInt('1811135815765342473'),
        bigInt('3622271631530684947'),
        bigInt('7244543263061369894'),
        bigInt('14489086526122739788'),
        bigInt('2897817305224547957'),
        bigInt('5795634610449095915'),
        bigInt('11591269220898191830'),
        bigInt('2318253844179638366'),
        bigInt('4636507688359276732'),
        bigInt('9273015376718553464'),
        bigInt('1854603075343710692'),
        bigInt('3709206150687421385'),
        bigInt('7418412301374842771'),
        bigInt('14836824602749685542'),
        bigInt('2967364920549937108'),
        bigInt('5934729841099874217'),
        bigInt('11869459682199748434'),
        bigInt('2373891936439949686'),
        bigInt('4747783872879899373'),
        bigInt('9495567745759798747'),
        bigInt('1899113549151959749'),
        bigInt('3798227098303919498'),
        bigInt('7596454196607838997'),
        bigInt('15192908393215677995'),
        bigInt('3038581678643135599'),
        bigInt('6077163357286271198'),
        bigInt('12154326714572542396'),
        bigInt('2430865342914508479'),
        bigInt('4861730685829016958'),
        bigInt('9723461371658033917'),
        bigInt('1944692274331606783'),
        bigInt('3889384548663213566'),
        bigInt('7778769097326427133'),
        bigInt('15557538194652854267'),
        bigInt('3111507638930570853'),
        bigInt('6223015277861141707'),
        bigInt('12446030555722283414'),
        bigInt('2489206111144456682'),
        bigInt('4978412222288913365'),
        bigInt('9956824444577826731'),
        bigInt('1991364888915565346'),
        bigInt('3982729777831130692'),
        bigInt('7965459555662261385'),
        bigInt('15930919111324522770'),
        bigInt('3186183822264904554'),
        bigInt('6372367644529809108'),
        bigInt('12744735289059618216'),
        bigInt('2548947057811923643'),
        bigInt('5097894115623847286'),
        bigInt('10195788231247694572'),
        bigInt('2039157646249538914'),
        bigInt('4078315292499077829'),
        bigInt('8156630584998155658'),
        bigInt('16313261169996311316'),
        bigInt('3262652233999262263'),
        bigInt('6525304467998524526'),
        bigInt('13050608935997049053'),
        bigInt('2610121787199409810'),
        bigInt('5220243574398819621'),
        bigInt('10440487148797639242'),
        bigInt('2088097429759527848'),
        bigInt('4176194859519055697'),
        bigInt('8352389719038111394'),
        bigInt('16704779438076222788'),
        bigInt('3340955887615244557'),
        bigInt('6681911775230489115'),
        bigInt('13363823550460978230'),
        bigInt('2672764710092195646'),
        bigInt('5345529420184391292'),
        bigInt('10691058840368782584'),
        bigInt('2138211768073756516'),
        bigInt('4276423536147513033'),
        bigInt('8552847072295026067'),
        bigInt('17105694144590052135'),
        bigInt('3421138828918010427'),
        bigInt('6842277657836020854'),
        bigInt('13684555315672041708'),
        bigInt('2736911063134408341'),
        bigInt('5473822126268816683'),
        bigInt('10947644252537633366'),
        bigInt('2189528850507526673'),
        bigInt('4379057701015053346'),
        bigInt('8758115402030106693'),
        bigInt('17516230804060213386'),
        bigInt('3503246160812042677'),
        bigInt('7006492321624085354'),
        bigInt('14012984643248170709'),
        bigInt('2802596928649634141'),
        bigInt('5605193857299268283'),
        bigInt('11210387714598536567'),
        bigInt('2242077542919707313'),
        bigInt('4484155085839414626'),
        bigInt('8968310171678829253'),
        bigInt('17936620343357658507'),
        bigInt('3587324068671531701'),
        bigInt('7174648137343063403'),
        bigInt('14349296274686126806'),
        bigInt('2869859254937225361'),
        bigInt('5739718509874450722'),
        bigInt('11479437019748901445'),
        bigInt('2295887403949780289'),
        bigInt('4591774807899560578'),
        bigInt('9183549615799121156'),
        bigInt('1836709923159824231'),
        bigInt('3673419846319648462'),
        bigInt('7346839692639296924'),
        bigInt('14693679385278593849'),
        bigInt('2938735877055718769'),
        bigInt('5877471754111437539'),
        bigInt('11754943508222875079'),
        bigInt('2350988701644575015'),
        bigInt('4701977403289150031'),
        bigInt('9403954806578300063'),
        bigInt('1880790961315660012'),
        bigInt('3761581922631320025'),
        bigInt('7523163845262640050'),
        bigInt('15046327690525280101'),
        bigInt('3009265538105056020'),
        bigInt('6018531076210112040'),
        bigInt('12037062152420224081'),
        bigInt('2407412430484044816'),
        bigInt('4814824860968089632'),
        bigInt('9629649721936179265'),
        bigInt('1925929944387235853'),
        bigInt('3851859888774471706'),
        bigInt('7703719777548943412'),
        bigInt('15407439555097886824'),
        bigInt('3081487911019577364'),
        bigInt('6162975822039154729'),
        bigInt('12325951644078309459'),
        bigInt('2465190328815661891'),
        bigInt('4930380657631323783'),
        bigInt('9860761315262647567'),
        bigInt('1972152263052529513'),
        bigInt('3944304526105059027'),
        bigInt('7888609052210118054'),
        bigInt('15777218104420236108'),
        bigInt('3155443620884047221'),
        bigInt('6310887241768094443'),
        bigInt('12621774483536188886'),
        bigInt('2524354896707237777'),
        bigInt('5048709793414475554'),
        bigInt('10097419586828951109'),
        bigInt('2019483917365790221'),
        bigInt('4038967834731580443'),
        bigInt('8077935669463160887'),
        bigInt('16155871338926321774'),
        bigInt('3231174267785264354'),
        bigInt('6462348535570528709'),
        bigInt('12924697071141057419'),
        bigInt('2584939414228211483'),
        bigInt('5169878828456422967'),
        bigInt('10339757656912845935'),
        bigInt('2067951531382569187'),
        bigInt('4135903062765138374'),
        bigInt('8271806125530276748'),
        bigInt('16543612251060553497'),
        bigInt('3308722450212110699'),
        bigInt('6617444900424221398'),
        bigInt('13234889800848442797'),
        bigInt('2646977960169688559'),
        bigInt('5293955920339377119'),
        bigInt('10587911840678754238'),
        bigInt('2117582368135750847'),
        bigInt('4235164736271501695'),
        bigInt('8470329472543003390'),
        bigInt('16940658945086006781'),
        bigInt('3388131789017201356'),
        bigInt('6776263578034402712'),
        bigInt('13552527156068805425'),
        bigInt('2710505431213761085'),
        bigInt('5421010862427522170'),
        bigInt('10842021724855044340'),
        bigInt('2168404344971008868'),
        bigInt('4336808689942017736'),
        bigInt('8673617379884035472'),
        bigInt('17347234759768070944'),
        bigInt('3469446951953614188'),
        bigInt('6938893903907228377'),
        bigInt('13877787807814456755'),
        bigInt('2775557561562891351'),
        bigInt('5551115123125782702'),
        bigInt('11102230246251565404'),
        bigInt('2220446049250313080'),
        bigInt('4440892098500626161'),
        bigInt('8881784197001252323'),
        bigInt('17763568394002504646'),
        bigInt('3552713678800500929'),
        bigInt('7105427357601001858'),
        bigInt('14210854715202003717'),
        bigInt('2842170943040400743'),
        bigInt('5684341886080801486'),
        bigInt('11368683772161602973'),
        bigInt('2273736754432320594'),
        bigInt('4547473508864641189'),
        bigInt('9094947017729282379'),
        bigInt('1818989403545856475'),
        bigInt('3637978807091712951'),
        bigInt('7275957614183425903'),
        bigInt('14551915228366851806'),
        bigInt('2910383045673370361'),
        bigInt('5820766091346740722'),
        bigInt('11641532182693481445'),
        bigInt('2328306436538696289'),
        bigInt('4656612873077392578'),
        bigInt('9313225746154785156'),
        bigInt('1862645149230957031'),
        bigInt('3725290298461914062'),
        bigInt('7450580596923828125'),
        bigInt('14901161193847656250'),
        bigInt('2980232238769531250'),
        bigInt('5960464477539062500'),
        bigInt('11920928955078125000'),
        bigInt('2384185791015625000'),
        bigInt('4768371582031250000'),
        bigInt('9536743164062500000'),
        bigInt('1907348632812500000'),
        bigInt('3814697265625000000'),
        bigInt('7629394531250000000'),
        bigInt('15258789062500000000'),
        bigInt('3051757812500000000'),
        bigInt('6103515625000000000'),
        bigInt('12207031250000000000'),
        bigInt('2441406250000000000'),
        bigInt('4882812500000000000'),
        bigInt('9765625000000000000'),
        bigInt('1953125000000000000'),
        bigInt('3906250000000000000'),
        bigInt('7812500000000000000'),
        bigInt('15625000000000000000'),
        bigInt('3125000000000000000'),
        bigInt('6250000000000000000'),
        bigInt('12500000000000000000'),
        bigInt('2500000000000000000'),
        bigInt('5000000000000000000'),
        bigInt('10000000000000000000'),
        bigInt('2000000000000000000'),
        bigInt('4000000000000000000'),
        bigInt('8000000000000000000'),
        bigInt('16000000000000000000'),
        bigInt('3200000000000000000'),
        bigInt('6400000000000000000'),
        bigInt('12800000000000000000'),
        bigInt('2560000000000000000'),
        bigInt('5120000000000000000'),
        bigInt('10240000000000000000'),
        bigInt('2048000000000000000'),
        bigInt('4096000000000000000'),
        bigInt('8192000000000000000'),
        bigInt('16384000000000000000'),
        bigInt('3276800000000000000'),
        bigInt('6553600000000000000'),
        bigInt('13107200000000000000'),
        bigInt('2621440000000000000'),
        bigInt('5242880000000000000'),
        bigInt('10485760000000000000'),
        bigInt('2097152000000000000'),
        bigInt('4194304000000000000'),
        bigInt('8388608000000000000'),
        bigInt('16777216000000000000'),
        bigInt('3355443200000000000'),
        bigInt('6710886400000000000'),
        bigInt('13421772800000000000'),
        bigInt('2684354560000000000'),
        bigInt('5368709120000000000'),
        bigInt('10737418240000000000'),
        bigInt('2147483648000000000'),
        bigInt('4294967296000000000'),
        bigInt('8589934592000000000'),
        bigInt('17179869184000000000'),
        bigInt('3435973836800000000'),
        bigInt('6871947673600000000'),
        bigInt('13743895347200000000'),
        bigInt('2748779069440000000'),
        bigInt('5497558138880000000'),
        bigInt('10995116277760000000'),
        bigInt('2199023255552000000'),
        bigInt('4398046511104000000'),
        bigInt('8796093022208000000'),
        bigInt('17592186044416000000'),
        bigInt('3518437208883200000'),
        bigInt('7036874417766400000'),
        bigInt('14073748835532800000'),
        bigInt('2814749767106560000'),
        bigInt('5629499534213120000'),
        bigInt('11258999068426240000'),
        bigInt('2251799813685248000'),
        bigInt('4503599627370496000'),
        bigInt('9007199254740992000'),
        bigInt('18014398509481984000'),
        bigInt('3602879701896396800'),
        bigInt('7205759403792793600'),
        bigInt('14411518807585587200'),
        bigInt('2882303761517117440'),
        bigInt('5764607523034234880'),
        bigInt('11529215046068469760'),
        bigInt('2305843009213693952'),
        bigInt('4611686018427387904'),
        bigInt('9223372036854775808'),
        bigInt('1844674407370955161'),
        bigInt('3689348814741910323'),
        bigInt('7378697629483820646'),
        bigInt('14757395258967641292'),
        bigInt('2951479051793528258'),
        bigInt('5902958103587056517'),
        bigInt('11805916207174113034'),
        bigInt('2361183241434822606'),
        bigInt('4722366482869645213'),
        bigInt('9444732965739290427'),
        bigInt('1888946593147858085'),
        bigInt('3777893186295716170'),
        bigInt('7555786372591432341'),
        bigInt('15111572745182864683'),
        bigInt('3022314549036572936'),
        bigInt('6044629098073145873'),
        bigInt('12089258196146291747'),
        bigInt('2417851639229258349'),
        bigInt('4835703278458516698'),
        bigInt('9671406556917033397'),
        bigInt('1934281311383406679'),
        bigInt('3868562622766813359'),
        bigInt('7737125245533626718'),
        bigInt('15474250491067253436'),
        bigInt('3094850098213450687'),
        bigInt('6189700196426901374'),
        bigInt('12379400392853802748'),
        bigInt('2475880078570760549'),
        bigInt('4951760157141521099'),
        bigInt('9903520314283042199'),
        bigInt('1980704062856608439'),
        bigInt('3961408125713216879'),
        bigInt('7922816251426433759'),
        bigInt('15845632502852867518'),
        bigInt('3169126500570573503'),
        bigInt('6338253001141147007'),
        bigInt('12676506002282294014'),
        bigInt('2535301200456458802'),
        bigInt('5070602400912917605'),
        bigInt('10141204801825835211'),
        bigInt('2028240960365167042'),
        bigInt('4056481920730334084'),
        bigInt('8112963841460668169'),
        bigInt('16225927682921336339'),
        bigInt('3245185536584267267'),
        bigInt('6490371073168534535'),
        bigInt('12980742146337069071'),
        bigInt('2596148429267413814'),
        bigInt('5192296858534827628'),
        bigInt('10384593717069655257'),
        bigInt('2076918743413931051'),
        bigInt('4153837486827862102'),
        bigInt('8307674973655724205'),
        bigInt('16615349947311448411'),
        bigInt('3323069989462289682'),
        bigInt('6646139978924579364'),
        bigInt('13292279957849158729'),
        bigInt('2658455991569831745'),
        bigInt('5316911983139663491'),
        bigInt('10633823966279326983'),
        bigInt('2126764793255865396'),
        bigInt('4253529586511730793'),
        bigInt('8507059173023461586'),
        bigInt('17014118346046923173'),
        bigInt('3402823669209384634'),
        bigInt('6805647338418769269'),
        bigInt('13611294676837538538'),
        bigInt('2722258935367507707'),
        bigInt('5444517870735015415'),
        bigInt('10889035741470030830'),
        bigInt('2177807148294006166'),
        bigInt('4355614296588012332'),
        bigInt('8711228593176024664'),
        bigInt('17422457186352049329'),
        bigInt('3484491437270409865'),
        bigInt('6968982874540819731'),
        bigInt('13937965749081639463'),
        bigInt('2787593149816327892'),
        bigInt('5575186299632655785'),
        bigInt('11150372599265311570'),
        bigInt('2230074519853062314'),
        bigInt('4460149039706124628'),
        bigInt('8920298079412249256'),
        bigInt('17840596158824498513'),
        bigInt('3568119231764899702'),
        bigInt('7136238463529799405'),
        bigInt('14272476927059598810'),
        bigInt('2854495385411919762'),
        bigInt('5708990770823839524'),
        bigInt('11417981541647679048'),
        bigInt('2283596308329535809'),
        bigInt('4567192616659071619'),
        bigInt('9134385233318143238'),
        bigInt('1826877046663628647'),
        bigInt('3653754093327257295'),
        bigInt('7307508186654514591'),
        bigInt('14615016373309029182'),
        bigInt('2923003274661805836'),
        bigInt('5846006549323611672'),
        bigInt('11692013098647223345'),
        bigInt('2338402619729444669'),
        bigInt('4676805239458889338'),
        bigInt('9353610478917778676'),
        bigInt('1870722095783555735'),
        bigInt('3741444191567111470'),
        bigInt('7482888383134222941'),
        bigInt('14965776766268445882'),
        bigInt('2993155353253689176'),
        bigInt('5986310706507378352'),
        bigInt('11972621413014756705'),
        bigInt('2394524282602951341'),
        bigInt('4789048565205902682'),
        bigInt('9578097130411805364'),
        bigInt('1915619426082361072'),
        bigInt('3831238852164722145'),
        bigInt('7662477704329444291'),
        bigInt('15324955408658888583'),
        bigInt('3064991081731777716'),
        bigInt('6129982163463555433'),
        bigInt('12259964326927110866'),
        bigInt('2451992865385422173'),
        bigInt('4903985730770844346'),
        bigInt('9807971461541688693'),
        bigInt('1961594292308337738'),
        bigInt('3923188584616675477'),
        bigInt('7846377169233350954'),
        bigInt('15692754338466701909'),
        bigInt('3138550867693340381'),
        bigInt('6277101735386680763'),
        bigInt('12554203470773361527'),
        bigInt('2510840694154672305'),
        bigInt('5021681388309344611'),
        bigInt('10043362776618689222'),
        bigInt('2008672555323737844'),
        bigInt('4017345110647475688'),
        bigInt('8034690221294951377'),
        bigInt('16069380442589902755'),
        bigInt('3213876088517980551'),
        bigInt('6427752177035961102'),
        bigInt('12855504354071922204'),
        bigInt('2571100870814384440'),
        bigInt('5142201741628768881'),
        bigInt('10284403483257537763'),
        bigInt('2056880696651507552'),
        bigInt('4113761393303015105'),
        bigInt('8227522786606030210'),
        bigInt('16455045573212060421'),
        bigInt('3291009114642412084'),
        bigInt('6582018229284824168'),
        bigInt('13164036458569648337'),
        bigInt('2632807291713929667'),
        bigInt('5265614583427859334'),
        bigInt('10531229166855718669'),
        bigInt('2106245833371143733'),
        bigInt('4212491666742287467'),
        bigInt('8424983333484574935'),
        bigInt('16849966666969149871'),
        bigInt('3369993333393829974'),
        bigInt('6739986666787659948'),
        bigInt('13479973333575319897'),
        bigInt('2695994666715063979'),
        bigInt('5391989333430127958'),
        bigInt('10783978666860255917'),
        bigInt('2156795733372051183'),
        bigInt('4313591466744102367'),
        bigInt('8627182933488204734'),
        bigInt('17254365866976409468'),
        bigInt('3450873173395281893'),
        bigInt('6901746346790563787'),
        bigInt('13803492693581127574'),
        bigInt('2760698538716225514'),
        bigInt('5521397077432451029'),
        bigInt('11042794154864902059'),
        bigInt('2208558830972980411'),
        bigInt('4417117661945960823'),
        bigInt('8834235323891921647'),
        bigInt('17668470647783843295'),
        bigInt('3533694129556768659'),
        bigInt('7067388259113537318'),
        bigInt('14134776518227074636'),
        bigInt('2826955303645414927'),
        bigInt('5653910607290829854'),
        bigInt('11307821214581659709'),
        bigInt('2261564242916331941'),
        bigInt('4523128485832663883'),
        bigInt('9046256971665327767'),
        bigInt('18092513943330655534'),
        bigInt('3618502788666131106'),
        bigInt('7237005577332262213'),
        bigInt('14474011154664524427'),
        bigInt('2894802230932904885'),
        bigInt('5789604461865809771'),
        bigInt('11579208923731619542'),
        bigInt('2315841784746323908'),
        bigInt('4631683569492647816'),
        bigInt('9263367138985295633'),
        bigInt('1852673427797059126'),
        bigInt('3705346855594118253'),
        bigInt('7410693711188236507'),
        bigInt('14821387422376473014'),
        bigInt('2964277484475294602'),
        bigInt('5928554968950589205'),
        bigInt('11857109937901178411'),
        bigInt('2371421987580235682'),
        bigInt('4742843975160471364'),
        bigInt('9485687950320942729'),
        bigInt('1897137590064188545'),
        bigInt('3794275180128377091'),
        bigInt('7588550360256754183'),
        bigInt('15177100720513508366'),
        bigInt('3035420144102701673'),
        bigInt('6070840288205403346'),
        bigInt('12141680576410806693'),
        bigInt('2428336115282161338'),
        bigInt('4856672230564322677'),
        bigInt('9713344461128645354'),
        bigInt('1942668892225729070'),
        bigInt('3885337784451458141'),
        bigInt('7770675568902916283'),
        bigInt('15541351137805832567'),
        bigInt('3108270227561166513'),
        bigInt('6216540455122333026'),
        bigInt('12433080910244666053'),
        bigInt('2486616182048933210'),
        bigInt('4973232364097866421'),
        bigInt('9946464728195732843'),
        bigInt('1989292945639146568'),
        bigInt('3978585891278293137'),
        bigInt('7957171782556586274'),
        bigInt('15914343565113172548'),
        bigInt('3182868713022634509'),
        bigInt('6365737426045269019'),
        bigInt('12731474852090538039'),
        bigInt('2546294970418107607'),
        bigInt('5092589940836215215'),
        bigInt('10185179881672430431'),
        bigInt('2037035976334486086'),
        bigInt('4074071952668972172'),
        bigInt('8148143905337944345'),
        bigInt('16296287810675888690'),
        bigInt('3259257562135177738'),
        bigInt('6518515124270355476'),
        bigInt('13037030248540710952'),
        bigInt('2607406049708142190'),
        bigInt('5214812099416284380'),
        bigInt('10429624198832568761'),
        bigInt('2085924839766513752'),
        bigInt('4171849679533027504'),
        bigInt('8343699359066055009'),
        bigInt('16687398718132110018'),
        bigInt('3337479743626422003'),
        bigInt('6674959487252844007'),
        bigInt('13349918974505688014'),
        bigInt('2669983794901137602'),
        bigInt('5339967589802275205'),
        bigInt('10679935179604550411'),
        bigInt('2135987035920910082'),
        bigInt('4271974071841820164'),
        bigInt('8543948143683640329'),
        bigInt('17087896287367280659'),
        bigInt('3417579257473456131'),
        bigInt('6835158514946912263'),
        bigInt('13670317029893824527'),
        bigInt('2734063405978764905'),
        bigInt('5468126811957529810'),
        bigInt('10936253623915059621'),
        bigInt('2187250724783011924'),
        bigInt('4374501449566023848'),
        bigInt('8749002899132047697'),
        bigInt('17498005798264095394'),
        bigInt('3499601159652819078'),
        bigInt('6999202319305638157'),
        bigInt('13998404638611276315'),
        bigInt('2799680927722255263'),
        bigInt('5599361855444510526'),
        bigInt('11198723710889021052'),
        bigInt('2239744742177804210'),
        bigInt('4479489484355608421'),
        bigInt('8958978968711216842'),
        bigInt('17917957937422433684'),
        bigInt('3583591587484486736'),
        bigInt('7167183174968973473'),
        bigInt('14334366349937946947'),
        bigInt('2866873269987589389'),
        bigInt('5733746539975178779'),
        bigInt('11467493079950357558'),
        bigInt('2293498615990071511'),
        bigInt('4586997231980143023'),
        bigInt('9173994463960286046'),
        bigInt('1834798892792057209'),
        bigInt('3669597785584114418'),
        bigInt('7339195571168228837'),
        bigInt('14678391142336457674'),
        bigInt('2935678228467291534'),
        bigInt('5871356456934583069'),
        bigInt('11742712913869166139'),
        bigInt('2348542582773833227'),
        bigInt('4697085165547666455'),
        bigInt('9394170331095332911'),
        bigInt('1878834066219066582'),
        bigInt('3757668132438133164'),
        bigInt('7515336264876266329'),
        bigInt('15030672529752532658'),
        bigInt('3006134505950506531'),
        bigInt('6012269011901013063'),
        bigInt('12024538023802026126'),
        bigInt('2404907604760405225'),
        bigInt('4809815209520810450'),
        bigInt('9619630419041620901'),
        bigInt('1923926083808324180'),
        bigInt('3847852167616648360'),
        bigInt('7695704335233296721'),
        bigInt('15391408670466593442'),
        bigInt('3078281734093318688'),
        bigInt('6156563468186637376'),
        bigInt('12313126936373274753'),
        bigInt('2462625387274654950'),
        bigInt('4925250774549309901'),
        bigInt('9850501549098619803'),
        bigInt('1970100309819723960'),
        bigInt('3940200619639447921'),
        bigInt('7880401239278895842'),
        bigInt('15760802478557791684'),
        bigInt('3152160495711558336'),
        bigInt('6304320991423116673'),
        bigInt('12608641982846233347'),
        bigInt('2521728396569246669'),
        bigInt('5043456793138493339'),
        bigInt('10086913586276986678'),
        bigInt('2017382717255397335'),
        bigInt('4034765434510794671'),
        bigInt('8069530869021589342'),
        bigInt('16139061738043178685'),
        bigInt('3227812347608635737'),
        bigInt('6455624695217271474'),
        bigInt('12911249390434542948'),
        bigInt('2582249878086908589'),
        bigInt('5164499756173817179'),
        bigInt('10328999512347634358'),
        bigInt('2065799902469526871'),
        bigInt('4131599804939053743'),
        bigInt('8263199609878107486'),
        bigInt('16526399219756214973'),
        bigInt('3305279843951242994'),
        bigInt('6610559687902485989'),
        bigInt('13221119375804971979'),
        bigInt('2644223875160994395'),
        bigInt('5288447750321988791'),
        bigInt('10576895500643977583'),
        bigInt('2115379100128795516'),
        bigInt('4230758200257591033'),
        bigInt('8461516400515182066'),
        bigInt('16923032801030364133'),
        bigInt('3384606560206072826'),
        bigInt('6769213120412145653'),
        bigInt('13538426240824291306'),
        bigInt('2707685248164858261'),
        bigInt('5415370496329716522'),
        bigInt('10830740992659433045'),
        bigInt('2166148198531886609'),
        bigInt('4332296397063773218'),
        bigInt('8664592794127546436'),
        bigInt('17329185588255092872'),
        bigInt('3465837117651018574'),
        bigInt('6931674235302037148'),
        bigInt('13863348470604074297'),
        bigInt('2772669694120814859'),
        bigInt('5545339388241629719'),
        bigInt('11090678776483259438'),
        bigInt('2218135755296651887'),
        bigInt('4436271510593303775'),
        bigInt('8872543021186607550'),
        bigInt('17745086042373215101'),
        bigInt('3549017208474643020'),
        bigInt('7098034416949286040'),
        bigInt('14196068833898572081'),
        bigInt('2839213766779714416'),
        bigInt('5678427533559428832'),
        bigInt('11356855067118857664'),
        bigInt('2271371013423771532'),
        bigInt('4542742026847543065'),
        bigInt('9085484053695086131'),
        bigInt('1817096810739017226'),
        bigInt('3634193621478034452'),
        bigInt('7268387242956068905'),
        bigInt('14536774485912137810'),
        bigInt('2907354897182427562'),
        bigInt('5814709794364855124'),
        bigInt('11629419588729710248'),
        bigInt('2325883917745942049'),
        bigInt('4651767835491884099'),
        bigInt('9303535670983768199'),
        bigInt('1860707134196753639'),
        bigInt('3721414268393507279'),
        bigInt('7442828536787014559'),
        bigInt('14885657073574029118'),
        bigInt('2977131414714805823'),
        bigInt('5954262829429611647'),
        bigInt('11908525658859223294'),
        bigInt('2381705131771844658'),
        bigInt('4763410263543689317'),
        bigInt('9526820527087378635'),
        bigInt('1905364105417475727'),
        bigInt('3810728210834951454'),
        bigInt('7621456421669902908'),
        bigInt('15242912843339805817'),
        bigInt('3048582568667961163'),
        bigInt('6097165137335922326'),
        bigInt('12194330274671844653'),
        bigInt('2438866054934368930'),
        bigInt('4877732109868737861'),
        bigInt('9755464219737475723'),
        bigInt('1951092843947495144'),
        bigInt('3902185687894990289'),
        bigInt('7804371375789980578'),
        bigInt('15608742751579961156'),
        bigInt('3121748550315992231'),
        bigInt('6243497100631984462'),
        bigInt('12486994201263968925'),
        bigInt('2497398840252793785'),
        bigInt('4994797680505587570'),
        bigInt('9989595361011175140'),
        bigInt('1997919072202235028'),
        bigInt('3995838144404470056'),
        bigInt('7991676288808940112'),
        bigInt('15983352577617880224'),
        bigInt('3196670515523576044'),
        bigInt('6393341031047152089'),
        bigInt('12786682062094304179'),
        bigInt('2557336412418860835'),
        bigInt('5114672824837721671'),
        bigInt('10229345649675443343'),
        bigInt('2045869129935088668'),
        bigInt('4091738259870177337'),
        bigInt('8183476519740354675'),
        bigInt('16366953039480709350'),
        bigInt('3273390607896141870'),
        bigInt('6546781215792283740'),
        bigInt('13093562431584567480'),
        bigInt('2618712486316913496'),
        bigInt('5237424972633826992'),
        bigInt('10474849945267653984'),
        bigInt('2094969989053530796'),
        bigInt('4189939978107061593'),
        bigInt('8379879956214123187'),
        bigInt('16759759912428246374'),
        bigInt('3351951982485649274'),
        bigInt('6703903964971298549'),
        bigInt('13407807929942597099'),
        bigInt('2681561585988519419'),
        bigInt('5363123171977038839'),
        bigInt('10726246343954077679'),
        bigInt('2145249268790815535'),
        bigInt('4290498537581631071'),
        bigInt('8580997075163262143'),
        bigInt('17161994150326524287'),
        bigInt('3432398830065304857'),
        bigInt('6864797660130609714'),
        bigInt('13729595320261219429'),
        bigInt('2745919064052243885'),
        bigInt('5491838128104487771'),
        bigInt('10983676256208975543'),
        bigInt('2196735251241795108'),
        bigInt('4393470502483590217'),
        bigInt('8786941004967180435'),
        bigInt('17573882009934360870'),
        bigInt('3514776401986872174'),
        bigInt('7029552803973744348'),
        bigInt('14059105607947488696'),
        bigInt('2811821121589497739'),
        bigInt('5623642243178995478'),
        bigInt('11247284486357990957'),
        bigInt('2249456897271598191'),
        bigInt('4498913794543196382'),
        bigInt('8997827589086392765'),
        bigInt('17995655178172785531'),
        bigInt('3599131035634557106'),
        bigInt('7198262071269114212'),
        bigInt('14396524142538228424'),
        bigInt('2879304828507645684'),
        bigInt('5758609657015291369'),
        bigInt('11517219314030582739'),
        bigInt('2303443862806116547'),
        bigInt('4606887725612233095'),
        bigInt('9213775451224466191'),
        bigInt('1842755090244893238'),
        bigInt('3685510180489786476'),
        bigInt('7371020360979572953'),
        bigInt('14742040721959145907'),
        bigInt('2948408144391829181'),
        bigInt('5896816288783658362'),
        bigInt('11793632577567316725'),
        bigInt('2358726515513463345'),
        bigInt('4717453031026926690'),
        bigInt('9434906062053853380'),
        bigInt('1886981212410770676'),
        bigInt('3773962424821541352'),
        bigInt('7547924849643082704'),
        bigInt('15095849699286165408'),
        bigInt('3019169939857233081'),
        bigInt('6038339879714466163'),
        bigInt('12076679759428932327'),
        bigInt('2415335951885786465'),
        bigInt('4830671903771572930'),
        bigInt('9661343807543145861'),
        bigInt('1932268761508629172'),
        bigInt('3864537523017258344'),
        bigInt('7729075046034516689'),
        bigInt('15458150092069033378'),
        bigInt('3091630018413806675'),
        bigInt('6183260036827613351'),
        bigInt('12366520073655226703'),
        bigInt('2473304014731045340'),
        bigInt('4946608029462090681'),
        bigInt('9893216058924181362'),
        bigInt('1978643211784836272'),
        bigInt('3957286423569672544'),
        bigInt('7914572847139345089'),
        bigInt('15829145694278690179'),
        bigInt('3165829138855738035'),
        bigInt('6331658277711476071'),
        bigInt('12663316555422952143'),
        bigInt('2532663311084590428'),
        bigInt('5065326622169180857'),
        bigInt('10130653244338361715'),
        bigInt('2026130648867672343'),
        bigInt('4052261297735344686'),
        bigInt('8104522595470689372'),
        bigInt('16209045190941378744'),
        bigInt('3241809038188275748'),
        bigInt('6483618076376551497'),
        bigInt('12967236152753102995'),
        bigInt('2593447230550620599'),
        bigInt('5186894461101241198'),
        bigInt('10373788922202482396'),
        bigInt('2074757784440496479'),
        bigInt('4149515568880992958'),
        bigInt('8299031137761985917'),
        bigInt('16598062275523971834'),
        bigInt('3319612455104794366'),
        bigInt('6639224910209588733'),
        bigInt('13278449820419177467'),
        bigInt('2655689964083835493'),
        bigInt('5311379928167670986'),
        bigInt('10622759856335341973'),
        bigInt('2124551971267068394'),
        bigInt('4249103942534136789'),
        bigInt('8498207885068273579'),
        bigInt('16996415770136547158'),
        bigInt('3399283154027309431'),
        bigInt('6798566308054618863'),
        bigInt('13597132616109237726'),
        bigInt('2719426523221847545'),
        bigInt('5438853046443695090'),
        bigInt('10877706092887390181'),
        bigInt('2175541218577478036'),
        bigInt('4351082437154956072'),
        bigInt('8702164874309912144'),
        bigInt('17404329748619824289'),
        bigInt('3480865949723964857'),
        bigInt('6961731899447929715'),
        bigInt('13923463798895859431'),
        bigInt('2784692759779171886'),
        bigInt('5569385519558343772'),
        bigInt('11138771039116687545'),
        bigInt('2227754207823337509'),
        bigInt('4455508415646675018'),
        bigInt('8911016831293350036'),
        bigInt('17822033662586700072'),
        bigInt('3564406732517340014'),
        bigInt('7128813465034680029'),
        bigInt('14257626930069360058'),
        bigInt('2851525386013872011'),
        bigInt('5703050772027744023'),
        bigInt('11406101544055488046'),
        bigInt('2281220308811097609'),
        bigInt('4562440617622195218'),
        bigInt('9124881235244390437'),
        bigInt('1824976247048878087'),
        bigInt('3649952494097756174'),
        bigInt('7299904988195512349'),
        bigInt('14599809976391024699'),
        bigInt('2919961995278204939'),
        bigInt('5839923990556409879'),
        bigInt('11679847981112819759'),
        bigInt('2335969596222563951'),
        bigInt('4671939192445127903'),
        bigInt('9343878384890255807'),
        bigInt('1868775676978051161'),
        bigInt('3737551353956102323'),
        bigInt('7475102707912204646'),
        bigInt('14950205415824409292'),
        bigInt('2990041083164881858'),
        bigInt('5980082166329763716'),
        bigInt('11960164332659527433'),
        bigInt('2392032866531905486'),
        bigInt('4784065733063810973'),
        bigInt('9568131466127621947'),
        bigInt('1913626293225524389'),
        bigInt('3827252586451048778'),
        bigInt('7654505172902097557'),
        bigInt('15309010345804195115'),
        bigInt('3061802069160839023'),
        bigInt('6123604138321678046'),
        bigInt('12247208276643356092'),
        bigInt('2449441655328671218'),
        bigInt('4898883310657342436'),
        bigInt('9797766621314684873'),
        bigInt('1959553324262936974'),
        bigInt('3919106648525873949'),
        bigInt('7838213297051747899'),
        bigInt('15676426594103495798'),
        bigInt('3135285318820699159'),
        bigInt('6270570637641398319'),
        bigInt('12541141275282796638'),
        bigInt('2508228255056559327'),
        bigInt('5016456510113118655'),
        bigInt('10032913020226237310'),
        bigInt('2006582604045247462'),
        bigInt('4013165208090494924'),
        bigInt('8026330416180989848'),
        bigInt('16052660832361979697'),
        bigInt('3210532166472395939'),
        bigInt('6421064332944791878'),
        bigInt('12842128665889583757'),
        bigInt('2568425733177916751'),
        bigInt('5136851466355833503'),
        bigInt('10273702932711667006'),
        bigInt('2054740586542333401'),
        bigInt('4109481173084666802'),
        bigInt('8218962346169333605'),
        bigInt('16437924692338667210'),
        bigInt('3287584938467733442'),
        bigInt('6575169876935466884'),
        bigInt('13150339753870933768'),
        bigInt('2630067950774186753'),
        bigInt('5260135901548373507'),
        bigInt('10520271803096747014'),
        bigInt('2104054360619349402'),
        bigInt('4208108721238698805'),
        bigInt('8416217442477397611'),
        bigInt('16832434884954795223'),
        bigInt('3366486976990959044'),
        bigInt('6732973953981918089'),
        bigInt('13465947907963836178'),
        bigInt('2693189581592767235'),
        bigInt('5386379163185534471'),
        bigInt('10772758326371068942'),
        bigInt('2154551665274213788'),
        bigInt('4309103330548427577'),
        bigInt('8618206661096855154'),
        bigInt('17236413322193710308'),
        bigInt('3447282664438742061'),
        bigInt('6894565328877484123'),
        bigInt('13789130657754968246'),
        bigInt('2757826131550993649'),
        bigInt('5515652263101987298'),
        bigInt('11031304526203974597'),
        bigInt('2206260905240794919'),
        bigInt('4412521810481589838'),
        bigInt('8825043620963179677'),
        bigInt('17650087241926359355'),
        bigInt('3530017448385271871'),
        bigInt('7060034896770543742'),
        bigInt('14120069793541087484'),
        bigInt('2824013958708217496'),
        bigInt('5648027917416434993'),
        bigInt('11296055834832869987'),
        bigInt('2259211166966573997'),
        bigInt('4518422333933147995'),
        bigInt('9036844667866295990'),
        bigInt('18073689335732591980'),
        bigInt('3614737867146518396'),
        bigInt('7229475734293036792'),
        bigInt('14458951468586073584'),
        bigInt('2891790293717214716'),
        bigInt('5783580587434429433'),
        bigInt('11567161174868858867'),
        bigInt('2313432234973771773'),
        bigInt('4626864469947543547'),
        bigInt('9253728939895087094'),
        bigInt('1850745787979017418'),
        bigInt('3701491575958034837'),
        bigInt('7402983151916069675'),
        bigInt('14805966303832139350'),
        bigInt('2961193260766427870'),
        bigInt('5922386521532855740'),
        bigInt('11844773043065711480'),
        bigInt('2368954608613142296'),
        bigInt('4737909217226284592'),
        bigInt('9475818434452569184'),
        bigInt('1895163686890513836'),
        bigInt('3790327373781027673'),
        bigInt('7580654747562055347'),
        bigInt('15161309495124110694'),
        bigInt('3032261899024822138'),
        bigInt('6064523798049644277'),
        bigInt('12129047596099288555'),
        bigInt('2425809519219857711'),
        bigInt('4851619038439715422'),
        bigInt('9703238076879430844'),
        bigInt('1940647615375886168'),
        bigInt('3881295230751772337'),
        bigInt('7762590461503544675'),
        bigInt('15525180923007089351'),
        bigInt('3105036184601417870'),
        bigInt('6210072369202835740'),
        bigInt('12420144738405671481'),
        bigInt('2484028947681134296'),
        bigInt('4968057895362268592'),
        bigInt('9936115790724537184'),
        bigInt('1987223158144907436'),
        bigInt('3974446316289814873'),
        bigInt('7948892632579629747'),
        bigInt('15897785265159259495'),
        bigInt('3179557053031851899'),
        bigInt('6359114106063703798'),
        bigInt('12718228212127407596'),
        bigInt('2543645642425481519'),
        bigInt('5087291284850963038'),
        bigInt('10174582569701926077'),
        bigInt('2034916513940385215'),
        bigInt('4069833027880770430'),
        bigInt('8139666055761540861'),
        bigInt('16279332111523081723'),
        bigInt('3255866422304616344'),
        bigInt('6511732844609232689'),
        bigInt('13023465689218465379'),
        bigInt('2604693137843693075'),
        bigInt('5209386275687386151'),
        bigInt('10418772551374772303'),
        bigInt('2083754510274954460'),
        bigInt('4167509020549908921'),
        bigInt('8335018041099817842'),
        bigInt('16670036082199635685'),
        bigInt('3334007216439927137'),
        bigInt('6668014432879854274'),
        bigInt('13336028865759708548'),
        bigInt('2667205773151941709'),
        bigInt('5334411546303883419'),
        bigInt('10668823092607766838'),
        bigInt('2133764618521553367'),
        bigInt('4267529237043106735'),
        bigInt('8535058474086213470'),
        bigInt('17070116948172426941'),
        bigInt('3414023389634485388'),
        bigInt('6828046779268970776'),
        bigInt('13656093558537941553'),
        bigInt('2731218711707588310'),
        bigInt('5462437423415176621'),
        bigInt('10924874846830353242'),
        bigInt('2184974969366070648'),
        bigInt('4369949938732141297'),
        bigInt('8739899877464282594'),
        bigInt('17479799754928565188'),
        bigInt('3495959950985713037'),
        bigInt('6991919901971426075'),
        bigInt('13983839803942852150'),
        bigInt('2796767960788570430'),
        bigInt('5593535921577140860'),
        bigInt('11187071843154281720'),
        bigInt('2237414368630856344'),
        bigInt('4474828737261712688'),
        bigInt('8949657474523425376'),
        bigInt('17899314949046850752'),
        bigInt('3579862989809370150'),
        bigInt('7159725979618740301'),
        bigInt('14319451959237480602'),
        bigInt('2863890391847496120'),
        bigInt('5727780783694992240'),
        bigInt('11455561567389984481'),
        bigInt('2291112313477996896'),
        bigInt('4582224626955993792'),
        bigInt('9164449253911987585'),
        bigInt('1832889850782397517'),
        bigInt('3665779701564795034'),
        bigInt('7331559403129590068'),
        bigInt('14663118806259180136'),
        bigInt('2932623761251836027'),
        bigInt('5865247522503672054'),
        bigInt('11730495045007344109'),
        bigInt('2346099009001468821'),
        bigInt('4692198018002937643'),
        bigInt('9384396036005875287'),
        bigInt('1876879207201175057'),
        bigInt('3753758414402350114'),
        bigInt('7507516828804700229'),
        bigInt('15015033657609400459'),
        bigInt('3003006731521880091'),
        bigInt('6006013463043760183'),
        bigInt('12012026926087520367'),
        bigInt('2402405385217504073'),
        bigInt('4804810770435008147'),
        bigInt('9609621540870016294'),
        bigInt('1921924308174003258'),
        bigInt('3843848616348006517'),
        bigInt('7687697232696013035'),
        bigInt('15375394465392026070'),
        bigInt('3075078893078405214'),
        bigInt('6150157786156810428'),
        bigInt('12300315572313620856'),
        bigInt('2460063114462724171'),
        bigInt('4920126228925448342'),
        bigInt('9840252457850896685'),
        bigInt('1968050491570179337'),
        bigInt('3936100983140358674'),
        bigInt('7872201966280717348'),
        bigInt('15744403932561434696'),
        bigInt('3148880786512286939'),
        bigInt('6297761573024573878'),
        bigInt('12595523146049147757'),
        bigInt('2519104629209829551'),
        bigInt('5038209258419659102'),
        bigInt('10076418516839318205'),
        bigInt('2015283703367863641'),
        bigInt('4030567406735727282'),
        bigInt('8061134813471454564'),
        bigInt('16122269626942909129'),
        bigInt('3224453925388581825'),
        bigInt('6448907850777163651'),
        bigInt('12897815701554327303'),
        bigInt('2579563140310865460'),
        bigInt('5159126280621730921'),
        bigInt('10318252561243461842'),
        bigInt('2063650512248692368'),
        bigInt('4127301024497384737'),
        bigInt('8254602048994769474'),
        bigInt('16509204097989538948'),
        bigInt('3301840819597907789'),
        bigInt('6603681639195815579'),
        bigInt('13207363278391631158'),
        bigInt('2641472655678326231'),
        bigInt('5282945311356652463'),
        bigInt('10565890622713304927'),
        bigInt('2113178124542660985'),
        bigInt('4226356249085321970'),
        bigInt('8452712498170643941'),
        bigInt('16905424996341287883'),
        bigInt('3381084999268257576'),
        bigInt('6762169998536515153'),
        bigInt('13524339997073030306'),
        bigInt('2704867999414606061'),
        bigInt('5409735998829212122'),
        bigInt('10819471997658424245'),
        bigInt('2163894399531684849'),
        bigInt('4327788799063369698'),
        bigInt('8655577598126739396'),
        bigInt('17311155196253478792'),
        bigInt('3462231039250695758'),
        bigInt('6924462078501391516'),
        bigInt('13848924157002783033'),
        bigInt('2769784831400556606'),
        bigInt('5539569662801113213'),
        bigInt('11079139325602226427'),
        bigInt('2215827865120445285'),
        bigInt('4431655730240890570'),
        bigInt('8863311460481781141'),
        bigInt('17726622920963562283'),
        bigInt('3545324584192712456'),
        bigInt('7090649168385424913'),
        bigInt('14181298336770849826'),
        bigInt('2836259667354169965'),
        bigInt('5672519334708339930'),
        bigInt('11345038669416679861'),
        bigInt('2269007733883335972'),
        bigInt('4538015467766671944'),
        bigInt('9076030935533343889'),
        bigInt('18152061871066687778'),
        bigInt('3630412374213337555'),
        bigInt('7260824748426675111'),
        bigInt('14521649496853350222'),
        bigInt('2904329899370670044'),
        bigInt('5808659798741340089'),
        bigInt('11617319597482680178'),
        bigInt('2323463919496536035'),
        bigInt('4646927838993072071'),
        bigInt('9293855677986144142'),
        bigInt('1858771135597228828'),
        bigInt('3717542271194457656'),
        bigInt('7435084542388915313'),
        bigInt('14870169084777830627'),
        bigInt('2974033816955566125'),
        bigInt('5948067633911132251'),
        bigInt('11896135267822264502'),
        bigInt('2379227053564452900'),
        bigInt('4758454107128905800'),
        bigInt('9516908214257811601'),
        bigInt('1903381642851562320'),
        bigInt('3806763285703124640'),
        bigInt('7613526571406249281'),
        bigInt('15227053142812498563'),
        bigInt('3045410628562499712'),
        bigInt('6090821257124999425'),
        bigInt('12181642514249998850'),
        bigInt('2436328502849999770'),
        bigInt('4872657005699999540'),
        bigInt('9745314011399999080'),
        bigInt('1949062802279999816'),
        bigInt('3898125604559999632'),
        bigInt('7796251209119999264'),
        bigInt('15592502418239998528'),
        bigInt('3118500483647999705'),
        bigInt('6237000967295999411'),
        bigInt('12474001934591998822'),
        bigInt('2494800386918399764'),
        bigInt('4989600773836799529'),
        bigInt('9979201547673599058'),
        bigInt('1995840309534719811'),
        bigInt('3991680619069439623'),
        bigInt('7983361238138879246'),
        bigInt('15966722476277758493'),
        bigInt('3193344495255551698'),
        bigInt('6386688990511103397'),
        bigInt('12773377981022206794'),
        bigInt('2554675596204441358'),
        bigInt('5109351192408882717'),
        bigInt('10218702384817765435'),
        bigInt('2043740476963553087'),
        bigInt('4087480953927106174'),
        bigInt('8174961907854212348'),
        bigInt('16349923815708424697'),
        bigInt('3269984763141684939'),
        bigInt('6539969526283369878'),
        bigInt('13079939052566739757'),
        bigInt('2615987810513347951'),
        bigInt('5231975621026695903'),
        bigInt('10463951242053391806'),
        bigInt('2092790248410678361'),
        bigInt('4185580496821356722'),
        bigInt('8371160993642713444'),
        bigInt('16742321987285426889'),
        bigInt('3348464397457085377'),
        bigInt('6696928794914170755'),
        bigInt('13393857589828341511'),
        bigInt('2678771517965668302'),
        bigInt('5357543035931336604'),
        bigInt('10715086071862673209'),
        bigInt('2143017214372534641'),
        bigInt('4286034428745069283'),
        bigInt('8572068857490138567'),
        bigInt('17144137714980277135'),
        bigInt('3428827542996055427'),
        bigInt('6857655085992110854'),
        bigInt('13715310171984221708'),
        bigInt('2743062034396844341'),
        bigInt('5486124068793688683'),
        bigInt('10972248137587377366'),
        bigInt('2194449627517475473'),
        bigInt('4388899255034950946'),
        bigInt('8777798510069901893'),
        bigInt('17555597020139803786'),
        bigInt('3511119404027960757'),
        bigInt('7022238808055921514'),
        bigInt('14044477616111843029'),
        bigInt('2808895523222368605'),
        bigInt('5617791046444737211'),
        bigInt('11235582092889474423'),
        bigInt('2247116418577894884'),
        bigInt('4494232837155789769'),
        bigInt('8988465674311579538'),
        bigInt('17976931348623159077'),
        bigInt('3595386269724631815'),
        bigInt('7190772539449263630'),
        bigInt('14381545078898527261'),
        bigInt('2876309015779705452'),
        bigInt('5752618031559410904'),
        bigInt('11505236063118821809'),
        bigInt('2301047212623764361'),
        bigInt('4602094425247528723'),
        bigInt('9204188850495057447'),
        bigInt('1840837770099011489'),
        bigInt('3681675540198022979'),
        bigInt('7363351080396045958'),
    ];

    private static readonly TensExponentTable: IntArray = New.IntArray([
        -323, -323, -322, -322, -322, -322, -321, -321, -321, -320, -320, -320,
        -319, -319, -319, -319, -318, -318, -318, -317, -317, -317, -316, -316,
        -316, -316, -315, -315, -315, -314, -314, -314, -313, -313, -313, -313,
        -312, -312, -312, -311, -311, -311, -310, -310, -310, -310, -309, -309,
        -309, -308, -308, -308, -307, -307, -307, -307, -306, -306, -306, -305,
        -305, -305, -304, -304, -304, -304, -303, -303, -303, -302, -302, -302,
        -301, -301, -301, -301, -300, -300, -300, -299, -299, -299, -298, -298,
        -298, -298, -297, -297, -297, -296, -296, -296, -295, -295, -295, -295,
        -294, -294, -294, -293, -293, -293, -292, -292, -292, -291, -291, -291,
        -291, -290, -290, -290, -289, -289, -289, -288, -288, -288, -288, -287,
        -287, -287, -286, -286, -286, -285, -285, -285, -285, -284, -284, -284,
        -283, -283, -283, -282, -282, -282, -282, -281, -281, -281, -280, -280,
        -280, -279, -279, -279, -279, -278, -278, -278, -277, -277, -277, -276,
        -276, -276, -276, -275, -275, -275, -274, -274, -274, -273, -273, -273,
        -273, -272, -272, -272, -271, -271, -271, -270, -270, -270, -270, -269,
        -269, -269, -268, -268, -268, -267, -267, -267, -267, -266, -266, -266,
        -265, -265, -265, -264, -264, -264, -263, -263, -263, -263, -262, -262,
        -262, -261, -261, -261, -260, -260, -260, -260, -259, -259, -259, -258,
        -258, -258, -257, -257, -257, -257, -256, -256, -256, -255, -255, -255,
        -254, -254, -254, -254, -253, -253, -253, -252, -252, -252, -251, -251,
        -251, -251, -250, -250, -250, -249, -249, -249, -248, -248, -248, -248,
        -247, -247, -247, -246, -246, -246, -245, -245, -245, -245, -244, -244,
        -244, -243, -243, -243, -242, -242, -242, -242, -241, -241, -241, -240,
        -240, -240, -239, -239, -239, -239, -238, -238, -238, -237, -237, -237,
        -236, -236, -236, -235, -235, -235, -235, -234, -234, -234, -233, -233,
        -233, -232, -232, -232, -232, -231, -231, -231, -230, -230, -230, -229,
        -229, -229, -229, -228, -228, -228, -227, -227, -227, -226, -226, -226,
        -226, -225, -225, -225, -224, -224, -224, -223, -223, -223, -223, -222,
        -222, -222, -221, -221, -221, -220, -220, -220, -220, -219, -219, -219,
        -218, -218, -218, -217, -217, -217, -217, -216, -216, -216, -215, -215,
        -215, -214, -214, -214, -214, -213, -213, -213, -212, -212, -212, -211,
        -211, -211, -211, -210, -210, -210, -209, -209, -209, -208, -208, -208,
        -208, -207, -207, -207, -206, -206, -206, -205, -205, -205, -204, -204,
        -204, -204, -203, -203, -203, -202, -202, -202, -201, -201, -201, -201,
        -200, -200, -200, -199, -199, -199, -198, -198, -198, -198, -197, -197,
        -197, -196, -196, -196, -195, -195, -195, -195, -194, -194, -194, -193,
        -193, -193, -192, -192, -192, -192, -191, -191, -191, -190, -190, -190,
        -189, -189, -189, -189, -188, -188, -188, -187, -187, -187, -186, -186,
        -186, -186, -185, -185, -185, -184, -184, -184, -183, -183, -183, -183,
        -182, -182, -182, -181, -181, -181, -180, -180, -180, -180, -179, -179,
        -179, -178, -178, -178, -177, -177, -177, -176, -176, -176, -176, -175,
        -175, -175, -174, -174, -174, -173, -173, -173, -173, -172, -172, -172,
        -171, -171, -171, -170, -170, -170, -170, -169, -169, -169, -168, -168,
        -168, -167, -167, -167, -167, -166, -166, -166, -165, -165, -165, -164,
        -164, -164, -164, -163, -163, -163, -162, -162, -162, -161, -161, -161,
        -161, -160, -160, -160, -159, -159, -159, -158, -158, -158, -158, -157,
        -157, -157, -156, -156, -156, -155, -155, -155, -155, -154, -154, -154,
        -153, -153, -153, -152, -152, -152, -152, -151, -151, -151, -150, -150,
        -150, -149, -149, -149, -149, -148, -148, -148, -147, -147, -147, -146,
        -146, -146, -145, -145, -145, -145, -144, -144, -144, -143, -143, -143,
        -142, -142, -142, -142, -141, -141, -141, -140, -140, -140, -139, -139,
        -139, -139, -138, -138, -138, -137, -137, -137, -136, -136, -136, -136,
        -135, -135, -135, -134, -134, -134, -133, -133, -133, -133, -132, -132,
        -132, -131, -131, -131, -130, -130, -130, -130, -129, -129, -129, -128,
        -128, -128, -127, -127, -127, -127, -126, -126, -126, -125, -125, -125,
        -124, -124, -124, -124, -123, -123, -123, -122, -122, -122, -121, -121,
        -121, -121, -120, -120, -120, -119, -119, -119, -118, -118, -118, -117,
        -117, -117, -117, -116, -116, -116, -115, -115, -115, -114, -114, -114,
        -114, -113, -113, -113, -112, -112, -112, -111, -111, -111, -111, -110,
        -110, -110, -109, -109, -109, -108, -108, -108, -108, -107, -107, -107,
        -106, -106, -106, -105, -105, -105, -105, -104, -104, -104, -103, -103,
        -103, -102, -102, -102, -102, -101, -101, -101, -100, -100, -100, -99,
        -99, -99, -99, -98, -98, -98, -97, -97, -97, -96, -96, -96,
        -96, -95, -95, -95, -94, -94, -94, -93, -93, -93, -93, -92,
        -92, -92, -91, -91, -91, -90, -90, -90, -89, -89, -89, -89,
        -88, -88, -88, -87, -87, -87, -86, -86, -86, -86, -85, -85,
        -85, -84, -84, -84, -83, -83, -83, -83, -82, -82, -82, -81,
        -81, -81, -80, -80, -80, -80, -79, -79, -79, -78, -78, -78,
        -77, -77, -77, -77, -76, -76, -76, -75, -75, -75, -74, -74,
        -74, -74, -73, -73, -73, -72, -72, -72, -71, -71, -71, -71,
        -70, -70, -70, -69, -69, -69, -68, -68, -68, -68, -67, -67,
        -67, -66, -66, -66, -65, -65, -65, -65, -64, -64, -64, -63,
        -63, -63, -62, -62, -62, -62, -61, -61, -61, -60, -60, -60,
        -59, -59, -59, -58, -58, -58, -58, -57, -57, -57, -56, -56,
        -56, -55, -55, -55, -55, -54, -54, -54, -53, -53, -53, -52,
        -52, -52, -52, -51, -51, -51, -50, -50, -50, -49, -49, -49,
        -49, -48, -48, -48, -47, -47, -47, -46, -46, -46, -46, -45,
        -45, -45, -44, -44, -44, -43, -43, -43, -43, -42, -42, -42,
        -41, -41, -41, -40, -40, -40, -40, -39, -39, -39, -38, -38,
        -38, -37, -37, -37, -37, -36, -36, -36, -35, -35, -35, -34,
        -34, -34, -34, -33, -33, -33, -32, -32, -32, -31, -31, -31,
        -30, -30, -30, -30, -29, -29, -29, -28, -28, -28, -27, -27,
        -27, -27, -26, -26, -26, -25, -25, -25, -24, -24, -24, -24,
        -23, -23, -23, -22, -22, -22, -21, -21, -21, -21, -20, -20,
        -20, -19, -19, -19, -18, -18, -18, -18, -17, -17, -17, -16,
        -16, -16, -15, -15, -15, -15, -14, -14, -14, -13, -13, -13,
        -12, -12, -12, -12, -11, -11, -11, -10, -10, -10, -9, -9,
        -9, -9, -8, -8, -8, -7, -7, -7, -6, -6, -6, -6,
        -5, -5, -5, -4, -4, -4, -3, -3, -3, -3, -2, -2,
        -2, -1, -1, -1, 0, 0, 0, 1, 1, 1, 1, 2,
        2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5,
        6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 9, 9,
        9, 10, 10, 10, 10, 11, 11, 11, 12, 12, 12, 13,
        13, 13, 13, 14, 14, 14, 15, 15, 15, 16, 16, 16,
        16, 17, 17, 17, 18, 18, 18, 19, 19, 19, 19, 20,
        20, 20, 21, 21, 21, 22, 22, 22, 22, 23, 23, 23,
        24, 24, 24, 25, 25, 25, 25, 26, 26, 26, 27, 27,
        27, 28, 28, 28, 29, 29, 29, 29, 30, 30, 30, 31,
        31, 31, 32, 32, 32, 32, 33, 33, 33, 34, 34, 34,
        35, 35, 35, 35, 36, 36, 36, 37, 37, 37, 38, 38,
        38, 38, 39, 39, 39, 40, 40, 40, 41, 41, 41, 41,
        42, 42, 42, 43, 43, 43, 44, 44, 44, 44, 45, 45,
        45, 46, 46, 46, 47, 47, 47, 47, 48, 48, 48, 49,
        49, 49, 50, 50, 50, 50, 51, 51, 51, 52, 52, 52,
        53, 53, 53, 53, 54, 54, 54, 55, 55, 55, 56, 56,
        56, 56, 57, 57, 57, 58, 58, 58, 59, 59, 59, 60,
        60, 60, 60, 61, 61, 61, 62, 62, 62, 63, 63, 63,
        63, 64, 64, 64, 65, 65, 65, 66, 66, 66, 66, 67,
        67, 67, 68, 68, 68, 69, 69, 69, 69, 70, 70, 70,
        71, 71, 71, 72, 72, 72, 72, 73, 73, 73, 74, 74,
        74, 75, 75, 75, 75, 76, 76, 76, 77, 77, 77, 78,
        78, 78, 78, 79, 79, 79, 80, 80, 80, 81, 81, 81,
        81, 82, 82, 82, 83, 83, 83, 84, 84, 84, 84, 85,
        85, 85, 86, 86, 86, 87, 87, 87, 88, 88, 88, 88,
        89, 89, 89, 90, 90, 90, 91, 91, 91, 91, 92, 92,
        92, 93, 93, 93, 94, 94, 94, 94, 95, 95, 95, 96,
        96, 96, 97, 97, 97, 97, 98, 98, 98, 99, 99, 99,
        100, 100, 100, 100, 101, 101, 101, 102, 102, 102, 103, 103,
        103, 103, 104, 104, 104, 105, 105, 105, 106, 106, 106, 106,
        107, 107, 107, 108, 108, 108, 109, 109, 109, 109, 110, 110,
        110, 111, 111, 111, 112, 112, 112, 112, 113, 113, 113, 114,
        114, 114, 115, 115, 115, 116, 116, 116, 116, 117, 117, 117,
        118, 118, 118, 119, 119, 119, 119, 120, 120, 120, 121, 121,
        121, 122, 122, 122, 122, 123, 123, 123, 124, 124, 124, 125,
        125, 125, 125, 126, 126, 126, 127, 127, 127, 128, 128, 128,
        128, 129, 129, 129, 130, 130, 130, 131, 131, 131, 131, 132,
        132, 132, 133, 133, 133, 134, 134, 134, 134, 135, 135, 135,
        136, 136, 136, 137, 137, 137, 137, 138, 138, 138, 139, 139,
        139, 140, 140, 140, 140, 141, 141, 141, 142, 142, 142, 143,
        143, 143, 143, 144, 144, 144, 145, 145, 145, 146, 146, 146,
        147, 147, 147, 147, 148, 148, 148, 149, 149, 149, 150, 150,
        150, 150, 151, 151, 151, 152, 152, 152, 153, 153, 153, 153,
        154, 154, 154, 155, 155, 155, 156, 156, 156, 156, 157, 157,
        157, 158, 158, 158, 159, 159, 159, 159, 160, 160, 160, 161,
        161, 161, 162, 162, 162, 162, 163, 163, 163, 164, 164, 164,
        165, 165, 165, 165, 166, 166, 166, 167, 167, 167, 168, 168,
        168, 168, 169, 169, 169, 170, 170, 170, 171, 171, 171, 171,
        172, 172, 172, 173, 173, 173, 174, 174, 174, 175, 175, 175,
        175, 176, 176, 176, 177, 177, 177, 178, 178, 178, 178, 179,
        179, 179, 180, 180, 180, 181, 181, 181, 181, 182, 182, 182,
        183, 183, 183, 184, 184, 184, 184, 185, 185, 185, 186, 186,
        186, 187, 187, 187, 187, 188, 188, 188, 189, 189, 189, 190,
        190, 190, 190, 191, 191, 191, 192, 192, 192, 193, 193, 193,
        193, 194, 194, 194, 195, 195, 195, 196, 196, 196, 196, 197,
        197, 197, 198, 198, 198, 199, 199, 199, 199, 200, 200, 200,
        201, 201, 201, 202, 202, 202, 202, 203, 203, 203, 204, 204,
        204, 205, 205, 205, 206, 206, 206, 206, 207, 207, 207, 208,
        208, 208, 209, 209, 209, 209, 210, 210, 210, 211, 211, 211,
        212, 212, 212, 212, 213, 213, 213, 214, 214, 214, 215, 215,
        215, 215, 216, 216, 216, 217, 217, 217, 218, 218, 218, 218,
        219, 219, 219, 220, 220, 220, 221, 221, 221, 221, 222, 222,
        222, 223, 223, 223, 224, 224, 224, 224, 225, 225, 225, 226,
        226, 226, 227, 227, 227, 227, 228, 228, 228, 229, 229, 229,
        230, 230, 230, 230, 231, 231, 231, 232, 232, 232, 233, 233,
        233, 234, 234, 234, 234, 235, 235, 235, 236, 236, 236, 237,
        237, 237, 237, 238, 238, 238, 239, 239, 239, 240, 240, 240,
        240, 241, 241, 241, 242, 242, 242, 243, 243, 243, 243, 244,
        244, 244, 245, 245, 245, 246, 246, 246, 246, 247, 247, 247,
        248, 248, 248, 249, 249, 249, 249, 250, 250, 250, 251, 251,
        251, 252, 252, 252, 252, 253, 253, 253, 254, 254, 254, 255,
        255, 255, 255, 256, 256, 256, 257, 257, 257, 258, 258, 258,
        258, 259, 259, 259, 260, 260, 260, 261, 261, 261, 261, 262,
        262, 262, 263, 263, 263, 264, 264, 264, 265, 265, 265, 265,
        266, 266, 266, 267, 267, 267, 268, 268, 268, 268, 269, 269,
        269, 270, 270, 270, 271, 271, 271, 271, 272, 272, 272, 273,
        273, 273, 274, 274, 274, 274, 275, 275, 275, 276, 276, 276,
        277, 277, 277, 277, 278, 278, 278, 279, 279, 279, 280, 280,
        280, 280, 281, 281, 281, 282, 282, 282, 283, 283, 283, 283,
        284, 284, 284, 285, 285, 285, 286, 286, 286, 286, 287, 287,
        287, 288, 288, 288, 289, 289, 289, 289, 290, 290, 290, 291,
        291, 291, 292, 292, 292, 293, 293, 293,
    ]);

    private static readonly DigitLowerTable: CharArray = New.CharArray(['0'.charCodeAt(0), '1'.charCodeAt(0), '2'.charCodeAt(0), '3'.charCodeAt(0),
    '4'.charCodeAt(0), '5'.charCodeAt(0), '6'.charCodeAt(0), '7'.charCodeAt(0),
    '8'.charCodeAt(0), '9'.charCodeAt(0), 'a'.charCodeAt(0),
    'b'.charCodeAt(0), 'c'.charCodeAt(0), 'd'.charCodeAt(0), 'e'.charCodeAt(0), 'f'.charCodeAt(0)]);

    private static readonly DigitUpperTable: CharArray = New.CharArray([
        '0'.charCodeAt(0),
        '1'.charCodeAt(0),
        '2'.charCodeAt(0),
        '3'.charCodeAt(0),
        '4'.charCodeAt(0),
        '5'.charCodeAt(0),
        '6'.charCodeAt(0),
        '7'.charCodeAt(0),
        '8'.charCodeAt(0),
        '9'.charCodeAt(0),
        'A'.charCodeAt(0),
        'B'.charCodeAt(0),
        'C'.charCodeAt(0),
        'D'.charCodeAt(0),
        'E'.charCodeAt(0),
        'F'.charCodeAt(0)
    ]);

    private static readonly TenPowersList: long[] = [
        bigInt('1'),
        bigInt('10'),
        bigInt('100'),
        bigInt('1000'),
        bigInt('10000'),
        bigInt('100000'),
        bigInt('1000000'),
        bigInt('10000000'),
        bigInt('100000000'),
        bigInt('1000000000'),
        bigInt('10000000000'),
        bigInt('100000000000'),
        bigInt('1000000000000'),
        bigInt('10000000000000'),
        bigInt('100000000000000'),
        bigInt('1000000000000000'),
        bigInt('10000000000000000'),
        bigInt('100000000000000000'),
        bigInt('1000000000000000000')
    ];

    // DecHexDigits s a translation table from a decimal number to its
    // digits hexadecimal representation (e.g. DecHexDigits [34] = 0x34).
    private static readonly DecHexDigits: IntArray = New.IntArray([
        0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09,
        0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19,
        0x20, 0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29,
        0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39,
        0x40, 0x41, 0x42, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49,
        0x50, 0x51, 0x52, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59,
        0x60, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69,
        0x70, 0x71, 0x72, 0x73, 0x74, 0x75, 0x76, 0x77, 0x78, 0x79,
        0x80, 0x81, 0x82, 0x83, 0x84, 0x85, 0x86, 0x87, 0x88, 0x89,
        0x90, 0x91, 0x92, 0x93, 0x94, 0x95, 0x96, 0x97, 0x98, 0x99,
    ]);

    /*

  // DecHexDigits s a translation table from a decimal number to its
  // digits hexadecimal representation (e.g. DecHexDigits [34] = 0x34).
  // private static readonly DecHexDigits:IntArray;

  /* private  static  void GetFormatterTables(out ulong * MantissaBitsTable, out int * TensExponentTable,
      out char * DigitLowerTable, out char * DigitUpperTable,
      out long * TenPowersList, out int * DecHexDigits); */
    /*
    unsafe static NumberFormatter()
    {
        GetFormatterTables(out MantissaBitsTable, out TensExponentTable,
            out DigitLowerTable, out DigitUpperTable, out TenPowersList, out DecHexDigits);
    }
*/
    private static GetTenPowerOf(i: int): long {
        return NumberFormatter.TenPowersList[i];
    }

    private _nfi: NumberFormatInfo = null as any;

    //part of the private stringbuffer
    private _cbuf: CharArray;

    private _NaN: boolean = false;
    private _infinity: boolean = false;
    private _isCustomFormat: boolean = false;
    private _specifierIsUpper: boolean = false;
    private _positive: boolean = false;
    private _specifier: char = 0;
    private _precision: int = 0;
    private _defPrecision: int = 0;

    private _digitsLen: int = 0;
    private _offset: int = 0; // Represent the first digit offset.
    private _decPointPos: int = 0;

    // The following fields are a hexadeimal representation of the digits.
    // For instance _val = 0x234 represents the digits '2', '3', '4'.
    private _val1: uint = 0; // Digits 0 - 7.
    private _val2: uint = 0; // Digits 8 - 15.
    private _val3: uint = 0; // Digits 16 - 23.
    private _val4: uint = 0; // Digits 23 - 31. Only needed for decimals.

    //#endregion Fields


    // Translate an unsigned int to hexadecimal digits.
    // i.e. 123456789 is represented by _val1 = 0x23456789 and _val2 = 0x1
    private InitDecHexDigits(value: uint): void;
    private InitDecHexDigits(value: ulong): void;
    private InitDecHexDigits(...args: any[]): void {
        if (args.length === 1 && is.int(args[0])) {
            let value: uint = args[0];
            if (value >= NumberFormatter.HundredMillion) {
                const div1: int = Convert.ToInt32(value / NumberFormatter.HundredMillion);
                value -= NumberFormatter.HundredMillion * Convert.ToUInt32(div1);
                this._val2 = NumberFormatter.FastToDecHex(div1);
            }
            this._val1 = NumberFormatter.ToDecHex(Convert.ToInt32(value));
        } else if (args.length === 1 && is.long(args[0])) {
            let value: ulong = args[0];
            if (value.greaterOrEquals(NumberFormatter.HundredMillion)) {
                let div1: long = value.div(NumberFormatter.HundredMillion);
                value = value.sub(div1.mul(NumberFormatter.HundredMillion));
                if (div1.greaterOrEquals(NumberFormatter.HundredMillion)) {
                    const div2: int = div1.div(NumberFormatter.HundredMillion).toNumber();
                    div1 = div1.sub(div2 * NumberFormatter.HundredMillion);
                    this._val3 = NumberFormatter.ToDecHex(div2);
                }
                if (div1.notEquals(0))
                    this._val2 = NumberFormatter.ToDecHex(div1.toNumber());
            }
            if (value.notEquals(0))
                this._val1 = NumberFormatter.ToDecHex(value.toNumber());
        }
    }


    // Translate a decimal integer to hexadecimal digits.
    // The decimal integer is 96 digits and its value is hi * 2^64 + lo.
    // is the lower 64 bits.
    /*   private void InitDecHexDigits(uint hi, ulong lo) {
          if (hi == 0) {
              InitDecHexDigits(lo); // Only the lower 64 bits matter.
              return;
          }

          // Compute (hi, lo) = (hi , lo) / HundredMillion.
          uint divhi = hi / HundredMillion;
          ulong remhi = hi - divhi * HundredMillion;
          ulong divlo = lo / HundredMillion;
          ulong remlo = lo - divlo * HundredMillion + remhi * ULongModHundredMillion;
          hi = divhi;
          lo = divlo + remhi * ULongDivHundredMillion;
          divlo = remlo / HundredMillion;
          remlo -= divlo * HundredMillion;
          lo += divlo;
          _val1 = ToDecHex((int)remlo);

          // Divide hi * 2 ^ 64 + lo by HundredMillion using the fact that
          // hi < HundredMillion.
          divlo = lo / HundredMillion;
          remlo = lo - divlo * HundredMillion;
          lo = divlo;
          if (hi != 0) {
              lo += hi * ULongDivHundredMillion;
              remlo += hi * ULongModHundredMillion;
              divlo = remlo / HundredMillion;
              lo += divlo;
              remlo -= divlo * HundredMillion;
          }
          _val2 = ToDecHex((int)remlo);

          // Now we are left with 64 bits store in lo.
          if (lo >= HundredMillion) {
              divlo = lo / HundredMillion;
              lo -= divlo * HundredMillion;
              _val4 = ToDecHex((int)divlo);
          }
          _val3 = ToDecHex((int)lo);
      } */

    // Helper to translate an int in the range 0 .. 9999 to its
    // Hexadecimal digits representation.
    private static FastToDecHex(val: int): uint {
        if (val < 100)
            return Convert.ToUInt32(NumberFormatter.DecHexDigits[val]);

        // Uses 2^19 (524288) to compute val / 100 for val < 10000.
        const v: int = (val * 5243) >> 19;
        return Convert.ToUInt32((NumberFormatter.DecHexDigits[v] << 8) | NumberFormatter.DecHexDigits[val - v * 100]);
    }

    // Helper to translate an int in the range 0 .. 99999999 to its
    // Hexadecimal digits representation.
    private static ToDecHex(val: int): uint {
        let res: uint = 0;
        if (val >= 10000) {
            const v: int = Convert.ToInt32(val / 10000);
            val -= v * 10000;
            res = NumberFormatter.FastToDecHex(v) << 16;
        }
        return res | NumberFormatter.FastToDecHex(val);
    }

    // Helper to count number of hexadecimal digits in a number.
    private static FastDecHexLen(val: int): int {
        if (val < 0x100)
            if (val < 0x10)
                return 1;
            else
                return 2;
        else if (val < 0x1000)
            return 3;
        else
            return 4;
    }

    private static DecHexLen(val: uint): int {
        if (val < 0x10000)
            return NumberFormatter.FastDecHexLen(Convert.ToInt32(val));
        return 4 + NumberFormatter.FastDecHexLen(Convert.ToInt32(val >> 16));
    }

    // Count number of hexadecimal digits stored in _val1 .. _val4.
    private DecHexLen(): int {
        if (this._val4 !== 0)
            return NumberFormatter.DecHexLen(this._val4) + 24;
        else if (this._val3 !== 0)
            return NumberFormatter.DecHexLen(this._val3) + 16;
        else if (this._val2 !== 0)
            return NumberFormatter.DecHexLen(this._val2) + 8;
        else if (this._val1 !== 0)
            return NumberFormatter.DecHexLen(this._val1);
        else
            return 0;
    }

    // Helper to count the 10th scale (number of digits) in a number
    private static ScaleOrder(hi: long): int {
        for (let i: int = NumberFormatter.TenPowersListLength - 1; i >= 0; i--)
            if (hi >= NumberFormatter.GetTenPowerOf(i))
                return i + 1;
        return 1;
    }

    // Compute the initial precision for rounding a floating number
    // according to the used format.
    private InitialFloatingPrecision(): int {
        if (this._specifier === 'R'.charCodeAt(0))
            return this._defPrecision + 2;
        if (this._precision < this._defPrecision)
            return this._defPrecision;
        if (this._specifier === 'G'.charCodeAt(0))
            return Math.min(this._defPrecision + 2, this._precision);
        if (this._specifier === 'E'.charCodeAt(0))
            return Math.min(this._defPrecision + 2, this._precision + 1);
        return this._defPrecision;
    }

    // Parse the given format and extract the precision in it.
    // Returns -1 for empty formats and -2 to indicate that the format
    // is a custom format.
    private static ParsePrecision(format: string): int {
        let precision: int = 0;
        for (let i: int = 1; i < format.length; i++) {
            const val: int = format[i].charCodeAt(0) - '0'.charCodeAt(0);
            precision = precision * 10 + val;
            if (val < 0 || val > 9 || precision > 99)
                return -2;
        }
        return precision;
    }



    // Parse the given format and initialize the following fields:
    //   _isCustomFormat, _specifierIsUpper, _specifier & _precision.
    public constructor(current: ThreadWorker) {
        super();
        this._cbuf = New.CharArray(0);//EmptyArray<char>.Value;
        if (current == null)
            return;

        this.CurrentCulture = current.CurrentCulture;
    }


    private Init(format: string): void {
        this._val1 = this._val2 = this._val3 = this._val4 = 0;
        this._offset = 0;
        this._NaN = this._infinity = false;
        this._isCustomFormat = false;
        this._specifierIsUpper = true;
        this._precision = -1;

        if (format == null || format.length === 0) {
            this._specifier = 'G'.charCodeAt(0);
            return;
        }

        let specifier: char = format[0].charCodeAt(0);
        if (specifier >= 'a'.charCodeAt(0) && specifier <= 'z'.charCodeAt(0)) {
            specifier = Convert.ToChar(specifier - 'a'.charCodeAt(0) + 'A'.charCodeAt(0));
            this._specifierIsUpper = false;
        }
        else if (specifier < 'A'.charCodeAt(0) || specifier > 'Z'.charCodeAt(0)) {
            this._isCustomFormat = true;
            this._specifier = '0'.charCodeAt(0);
            return;
        }
        this._specifier = specifier;
        if (format.length > 1) {
            this._precision = NumberFormatter.ParsePrecision(format);
            if (this._precision === -2) { // Is it a custom format?
                this._isCustomFormat = true;
                this._specifier = '0'.charCodeAt(0);
                this._precision = -1;
            }
        }
    }

    private InitHex(value: long): void {
        switch (this._defPrecision) {
            case NumberFormatter.Int32DefPrecision: value = value; break;
        }
        this._val1 = Convert.ToUInt32(value);
        this._val2 = Convert.ToInt32(value.shr(32));
        this._decPointPos = this._digitsLen = this.DecHexLen();
        if (value.equals(0))
            this._decPointPos = 1;
    }

    private InitForInt(format: string, value: int, defPrecision: int): void {
        this.Init(format);
        this._defPrecision = defPrecision;
        this._positive = value >= 0;

        if (value === 0 || this._specifier === 'X'.charCodeAt(0)) {
            this.InitHex(Convert.ToLong(value));
            return;
        }

        if (value < 0)
            value = -value;
        this.InitDecHexDigits(Convert.ToUInt32(value));
        this._decPointPos = this._digitsLen = this.DecHexLen();
    }

    private InitForUInt(format: string, value: uint, defPrecision: int): void {
        this.Init(format);
        this._defPrecision = defPrecision;
        this._positive = true;

        if (value === 0 || this._specifier === 'X'.charCodeAt(0)) {
            this.InitHex(Convert.ToLong(value));
            return;
        }

        this.InitDecHexDigits(value);
        this._decPointPos = this._digitsLen = this.DecHexLen();
    }

    private InitForLong(format: string, value: long): void {
        this.Init(format);
        this._defPrecision = NumberFormatter.Int64DefPrecision;
        this._positive = value.greaterOrEquals(0);

        if (value.equals(0) || this._specifier === 'X'.charCodeAt(0)) {
            this.InitHex(Convert.ToLong(value));
            return;
        }

        if (value.lessThan(0)) {
            value = value.neg();
        }
        this.InitDecHexDigits(value);
        this._decPointPos = this._digitsLen = this.DecHexLen();
    }

    private InitForULong(format: string, value: ulong): void {
        this.Init(format);
        this._defPrecision = NumberFormatter.UInt64DefPrecision;
        this._positive = true;

        if (value.equals(0) || this._specifier === 'X'.charCodeAt(0)) {
            this.InitHex(Convert.ToLong(value));
            return;
        }

        this.InitDecHexDigits(value.toNumber());
        this._decPointPos = this._digitsLen = this.DecHexLen();
    }

    private InitForDouble(format: string, value: float, defPrecision: int): void {
        this.Init(format);

        this._defPrecision = defPrecision;
        let bits: long = BitConverter.DoubleToInt64Bits(value);
        this._positive = bits.greaterOrEquals(0);
        bits = bits.and(Int64MaxValue);
        if (bits.equals(0)) {
            this._decPointPos = 1;
            this._digitsLen = 0;
            this._positive = true;
            return;
        }

        let e: int = Convert.ToInt32(bits.shr(NumberFormatter.DoubleBitsExponentShift));
        let m: long = bits.and(NumberFormatter.DoubleBitsMantissaMask);
        if (e === NumberFormatter.DoubleBitsExponentMask) {
            this._NaN = m.notEquals(0);
            this._infinity = m.equals(0);
            return;
        }

        let expAdjust: int = 0;
        if (e === 0) {
            // We need 'm' to be large enough so we won't lose precision.
            e = 1;
            const scale: int = NumberFormatter.ScaleOrder(m);
            if (scale < NumberFormatter.DoubleDefPrecision) {
                expAdjust = scale - NumberFormatter.DoubleDefPrecision;
                m = m.mul(NumberFormatter.GetTenPowerOf(-expAdjust));
            }
        }
        else {
            m = (m.add(NumberFormatter.DoubleBitsMantissaMask).add(1)).mul(10);
            expAdjust = -1;
        }

        // multiply the mantissa by 10 ^ N
        const lo: uint = Convert.ToUInt32(m);
        const hi: uint = Convert.ToUInt32(m.shr(32));
        const lo2: long = NumberFormatter.MantissaBitsTable[e];
        const hi2: long = lo2.shr(32);
        const _lo2: uint = Convert.ToUInt32(lo2);
        let mm: long = Convert.ToLong(hi * _lo2).add(hi2.mul(lo)).add((Convert.ToLong(_lo2).mul(lo)).shr(32));
        let res: long = Convert.ToLong(hi).mul(hi2).add(mm.shr(32));
        while (res.lessThan(NumberFormatter.SeventeenDigitsThreshold)) {
            mm = mm.and(UInt32MaxValue).mul(10);
            res = res.mul(10).add(mm.shr(32));
            expAdjust--;
        }
        if ((mm.and(0x80000000)) !== 0) {
            res = res.add(1);
        }

        let order: int = NumberFormatter.DoubleDefPrecision + 2;
        this._decPointPos = NumberFormatter.TensExponentTable[e] + expAdjust + order;

        // Rescale 'res' to the initial precision (15-17 for doubles).
        const initialPrecision: int = this.InitialFloatingPrecision();
        if (order > initialPrecision) {
            const val: long = NumberFormatter.GetTenPowerOf(order - initialPrecision);
            res = (res.add(val.shr(1))).div(val);
            order = initialPrecision;
        }
        if (res >= NumberFormatter.GetTenPowerOf(order)) {
            order++;
            this._decPointPos++;
        }

        this.InitDecHexDigits(res);
        this._offset = this.CountTrailingZeros();
        this._digitsLen = order - this._offset;
    }
    /*
        private void Init(string format, decimal value) {
            Init(format);
            _defPrecision = DecimalDefPrecision;

            int[] bits = decimal.GetBits(value);
            int scale = (bits[3] & DecimalBitsScaleMask) >> 16;
            _positive = bits[3] >= 0;
            if (bits[0] == 0 && bits[1] == 0 && bits[2] == 0) {
                _decPointPos = -scale;
                _positive = true;
                _digitsLen = 0;
                return;
            }

            InitDecHexDigits((uint)bits[2], ((ulong)bits[1] << 32) | (uint)bits[0]);
            _digitsLen = DecHexLen();
            _decPointPos = _digitsLen - scale;
            if (_precision != -1 || _specifier != 'G') {
                _offset = CountTrailingZeros();
                _digitsLen -= _offset;
            }
        } */

    //#endregion Constructors


    //_cbuf moved to before other fields to improve layout
    private _ind: int = 0;

    private ResetCharBuf(size: int): void {
        this._ind = 0;
        if (this._cbuf.length < size)
            this._cbuf = New.CharArray(size);
    }

    private Resize(len: int): void {
        this._cbuf = TArray.Resize(this._cbuf, len) as any;
    }

    private Append(c: char): void;
    private Append(c: char, cnt: int): void;
    private Append(s: string): void;
    private Append(...args: any[]): void {
        if (args.length === 1 && is.char(args[0])) {
            const c: char = args[0];
            if (this._ind === this._cbuf.length) {
                this.Resize(this._ind + 10);
            }
            this._cbuf[this._ind++] = c;
        } else if (args.length === 2 && is.char(args[0]) && is.int(args[1])) {
            const c: char = args[0];
            let cnt: int = args[1];
            if (this._ind + cnt > this._cbuf.length) {
                this.Resize(this._ind + cnt + 10);
            }
            while (cnt-- > 0) {
                this._cbuf[this._ind++] = c;
            }
        } else if (args.length === 1 && is.string(args[0])) {
            const s: string = args[0];
            const slen: int = s.length;
            if (this._ind + slen > this._cbuf.length)
                this.Resize(this._ind + slen + 10);
            for (let i: int = 0; i < slen; i++)
                this._cbuf[this._ind++] = s[i].charCodeAt(0);
        }
    }

    private GetNumberFormatInstance(fp: IFormatProvider): NumberFormatInfo {
        if (this._nfi != null && fp == null) {
            return this._nfi;
        }
        return NumberFormatInfo.GetInstance(fp);
    }

    private set CurrentCulture(value: CultureInfo) {
        if (value != null && value.IsReadOnly)
            this._nfi = value.NumberFormat;
        else
            this._nfi = null as any;
    }

    private get IntegerDigits(): int {
        return this._decPointPos > 0 ? this._decPointPos : 1;
    }

    private get DecimalDigits(): int {
        return this._digitsLen > this._decPointPos ? this._digitsLen - this._decPointPos : 0;
    }

    private get IsFloatingSource(): boolean {
        return this._defPrecision === NumberFormatter.DoubleDefPrecision || this._defPrecision === NumberFormatter.SingleDefPrecision;
    }


    private get IsZero(): boolean {
        return this._digitsLen === 0;
    }

    private get IsZeroInteger(): boolean {
        return this._digitsLen === 0 || this._decPointPos <= 0;
    }


    private RoundPos(pos: int): void {
        this.RoundBits(this._digitsLen - pos);
    }

    private RoundDecimal(decimals: int): boolean {
        return this.RoundBits(this._digitsLen - this._decPointPos - decimals);
    }

    private RoundBits(shift: int): boolean {
        if (shift <= 0)
            return false;

        if (shift > this._digitsLen) {
            this._digitsLen = 0;
            this._decPointPos = 1;
            this._val1 = this._val2 = this._val3 = this._val4 = 0;
            this._positive = true;
            return false;
        }
        shift += this._offset;
        this._digitsLen += this._offset;
        while (shift > 8) {
            this._val1 = this._val2;
            this._val2 = this._val3;
            this._val3 = this._val4;
            this._val4 = 0;
            this._digitsLen -= 8;
            shift -= 8;
        }
        shift = (shift - 1) << 2;
        const v: uint = this._val1 >> shift;
        const rem16: uint = v & 0xf;
        this._val1 = (v ^ rem16) << shift;
        let res: boolean = false;
        if (rem16 >= 0x5) {
            this._val1 |= 0x99999999 >> (28 - shift);
            this.AddOneToDecHex();
            const newlen: int = this.DecHexLen();
            res = newlen !== this._digitsLen;
            this._decPointPos = this._decPointPos + newlen - this._digitsLen;
            this._digitsLen = newlen;
        }
        this.RemoveTrailingZeros();
        return res;
    }

    private RemoveTrailingZeros(): void {
        this._offset = this.CountTrailingZeros();
        this._digitsLen -= this._offset;
        if (this._digitsLen == 0) {
            this._offset = 0;
            this._decPointPos = 1;
            this._positive = true;
        }
    }

    private AddOneToDecHex(): void {
        if (this._val1 == 0x99999999) {
            this._val1 = 0;
            if (this._val2 == 0x99999999) {
                this._val2 = 0;
                if (this._val3 == 0x99999999) {
                    this._val3 = 0;
                    this._val4 = NumberFormatter.AddOneToDecHex(this._val4);
                }
                else
                    this._val3 = NumberFormatter.AddOneToDecHex(this._val3);
            }
            else
                this._val2 = NumberFormatter.AddOneToDecHex(this._val2);
        }
        else
            this._val1 = NumberFormatter.AddOneToDecHex(this._val1);
    }

    // Assume val != 0x99999999
    private static AddOneToDecHex(val: uint): uint {
        if ((val & 0xffff) === 0x9999)
            if ((val & 0xffffff) === 0x999999)
                if ((val & 0xfffffff) === 0x9999999)
                    return val + 0x06666667;
                else
                    return val + 0x00666667;
            else if ((val & 0xfffff) === 0x99999)
                return val + 0x00066667;
            else
                return val + 0x00006667;
        else if ((val & 0xff) === 0x99)
            if ((val & 0xfff) === 0x999)
                return val + 0x00000667;
            else
                return val + 0x00000067;
        else if ((val & 0xf) === 0x9)
            return val + 0x00000007;
        else
            return val + 1;
    }

    private CountTrailingZeros(): int {
        if (this._val1 !== 0)
            return NumberFormatter.CountTrailingZeros(this._val1);
        if (this._val2 !== 0)
            return NumberFormatter.CountTrailingZeros(this._val2) + 8;
        if (this._val3 !== 0)
            return NumberFormatter.CountTrailingZeros(this._val3) + 16;
        if (this._val4 !== 0)
            return NumberFormatter.CountTrailingZeros(this._val4) + 24;
        return this._digitsLen;
    }

    private static CountTrailingZeros(val: uint): int {
        if ((val & 0xffff) === 0)
            if ((val & 0xffffff) === 0)
                if ((val & 0xfffffff) === 0)
                    return 7;
                else
                    return 6;
            else if ((val & 0xfffff) === 0)
                return 5;
            else
                return 4;
        else if ((val & 0xff) === 0)
            if ((val & 0xfff) === 0)
                return 3;
            else
                return 2;
        else if ((val & 0xf) === 0)
            return 1;
        else
            return 0;
    }


    static threadNumberFormatter: NumberFormatter;
    static userFormatProvider: NumberFormatter;

    private static GetInstance(fp: IFormatProvider): NumberFormatter {
        if (fp != null) {
            if (NumberFormatter.userFormatProvider == null) {
                NumberFormatter.userFormatProvider = new NumberFormatter(null as any);
            }

            return NumberFormatter.userFormatProvider;
        }

        const res: NumberFormatter = NumberFormatter.threadNumberFormatter;
        NumberFormatter.threadNumberFormatter = null as any;
        const _Thread = Context.Current.get('Thread');
        if (res == null) {

            return new NumberFormatter(_Thread.CurrentThread);
        }
        res.CurrentCulture = _Thread.CurrentThread.CurrentCulture;
        return res;
    }

    private Release(): void {
        if (this !== NumberFormatter.userFormatProvider)
            NumberFormatter.threadNumberFormatter = this;
    }

    public static UIntToString(format: string, value: uint, fp: IFormatProvider): string {
        const inst: NumberFormatter = NumberFormatter.GetInstance(fp);
        inst.InitForUInt(format, value, NumberFormatter.Int32DefPrecision);
        const res: string = inst.IntegerToString(format, fp);
        inst.Release();
        return res;
    }

    public static IntToString(format: string, value: int, fp: IFormatProvider): string {
        const inst: NumberFormatter = NumberFormatter.GetInstance(fp);
        inst.InitForInt(format, value, NumberFormatter.UInt32DefPrecision);
        const res: string = inst.IntegerToString(format, fp);
        inst.Release();
        return res;
    }

    public static ULongToString(format: string, value: ulong, fp: IFormatProvider): string {
        const inst: NumberFormatter = NumberFormatter.GetInstance(fp);
        inst.InitForULong(format, value);
        const res: string = inst.IntegerToString(format, fp);
        inst.Release();
        return res;
    }

    public static LongToString(format: string, value: long, fp: IFormatProvider): string {
        const inst: NumberFormatter = NumberFormatter.GetInstance(fp);
        inst.InitForLong(format, value);
        const res: string = inst.IntegerToString(format, fp);
        inst.Release();
        return res;
    }

    public static FloatToString(format: string, value: float, fp: IFormatProvider): string {
        const inst: NumberFormatter = NumberFormatter.GetInstance(fp);
        inst.InitForDouble(format, value, NumberFormatter.SingleDefPrecision);
        const nfi: NumberFormatInfo = inst.GetNumberFormatInstance(fp);
        let res: string;
        if (inst._NaN)
            res = nfi.NaNSymbol;
        else if (inst._infinity)
            if (inst._positive)
                res = nfi.PositiveInfinitySymbol;
            else
                res = nfi.NegativeInfinitySymbol;
        else if (inst._specifier === 'R'.charCodeAt(0))
            res = inst.FormatRoundtripFloat(value as any, nfi);
        else
            res = inst.NumberToString(format, nfi);
        inst.Release();
        return res;
    }

    public static DoubleToString(format: string, value: double, fp: IFormatProvider): string {
        const inst: NumberFormatter = NumberFormatter.GetInstance(fp);
        (inst as any).InitDouble(format, value, NumberFormatter.DoubleDefPrecision);
        const nfi: NumberFormatInfo = inst.GetNumberFormatInstance(fp);
        let res: string;
        if (inst._NaN) {
            res = nfi.NaNSymbol;
        }
        else if (inst._infinity)
            if (inst._positive)
                res = nfi.PositiveInfinitySymbol;
            else
                res = nfi.NegativeInfinitySymbol;
        else if (inst._specifier === 'R'.charCodeAt(0)) {
            res = inst.FormatRoundtripDouble(value, nfi);
        }
        else {
            res = inst.NumberToString(format, nfi);
        }
        inst.Release();
        return res;
    }

    public static DecimalToString(format: string, value: decimal, fp: IFormatProvider): string {
        const inst: NumberFormatter = NumberFormatter.GetInstance(fp);
        (inst as any).InitDecimal(format, value);
        let res: string = inst.NumberToString(format, inst.GetNumberFormatInstance(fp));
        inst.Release();
        return res;
    }

    private IntegerToString(format: string, fp: IFormatProvider): string {
        const nfi: NumberFormatInfo = this.GetNumberFormatInstance(fp);
        switch (this._specifier) {
            case 'C'.charCodeAt(0):
                return this.FormatCurrency(this._precision, nfi);
            case 'D'.charCodeAt(0):
                return this.FormatDecimal(this._precision, nfi);
            case 'E'.charCodeAt(0):
                return this.FormatExponential(this._precision, nfi);
            case 'F'.charCodeAt(0):
                return this.FormatFixedPoint(this._precision, nfi);
            case 'G'.charCodeAt(0):
                if (this._precision <= 0)
                    return this.FormatDecimal(-1, nfi);
                return this.FormatGeneral(this._precision, nfi);
            case 'N'.charCodeAt(0):
                return this.FormatNumber(this._precision, nfi);
            case 'P'.charCodeAt(0):
                return this.FormatPercent(this._precision, nfi);
            case 'X'.charCodeAt(0):
                return this.FormatHexadecimal(this._precision);
            default:
                if (this._isCustomFormat)
                    return this.FormatCustom(format, nfi);
                throw new FormatException("The specified format '" + format + "' is invalid");
        }
    }

    private NumberToString(format: string, nfi: NumberFormatInfo): string {
        switch (this._specifier) {
            case 'C'.charCodeAt(0):
                return this.FormatCurrency(this._precision, nfi);
            case 'E'.charCodeAt(0):
                return this.FormatExponential(this._precision, nfi);
            case 'F'.charCodeAt(0):
                return this.FormatFixedPoint(this._precision, nfi);
            case 'G'.charCodeAt(0):
                return this.FormatGeneral(this._precision, nfi);
            case 'N'.charCodeAt(0):
                return this.FormatNumber(this._precision, nfi);
            case 'P'.charCodeAt(0):
                return this.FormatPercent(this._precision, nfi);
            case 'X'.charCodeAt(0):
            default:
                if (this._isCustomFormat)
                    return this.FormatCustom(format, nfi);
                throw new FormatException("The specified format '" + format + "' is invalid");
        }
    }

    private FormatCurrency(precision: int, nfi: NumberFormatInfo): string {
        precision = (precision >= 0 ? precision : nfi.CurrencyDecimalDigits);
        this.RoundDecimal(precision);
        this.ResetCharBuf(this.IntegerDigits * 2 + precision * 2 + 16);

        if (this._positive) {
            switch (nfi.CurrencyPositivePattern) {
                case 0:
                    this.Append(nfi.CurrencySymbol);
                    break;
                case 2:
                    this.Append(nfi.CurrencySymbol);
                    this.Append(' ');
                    break;
            }
        }
        else {
            switch (nfi.CurrencyNegativePattern) {
                case 0:
                    this.Append('(');
                    this.Append(nfi.CurrencySymbol);
                    break;
                case 1:
                    this.Append(nfi.NegativeSign);
                    this.Append(nfi.CurrencySymbol);
                    break;
                case 2:
                    this.Append(nfi.CurrencySymbol);
                    this.Append(nfi.NegativeSign);
                    break;
                case 3:
                    this.Append(nfi.CurrencySymbol);
                    break;
                case 4:
                    this.Append('(');
                    break;
                case 5:
                    this.Append(nfi.NegativeSign);
                    break;
                case 8:
                    this.Append(nfi.NegativeSign);
                    break;
                case 9:
                    this.Append(nfi.NegativeSign);
                    this.Append(nfi.CurrencySymbol);
                    this.Append(' ');
                    break;
                case 11:
                    this.Append(nfi.CurrencySymbol);
                    this.Append(' ');
                    break;
                case 12:
                    this.Append(nfi.CurrencySymbol);
                    this.Append(' ');
                    this.Append(nfi.NegativeSign);
                    break;
                case 14:
                    this.Append('(');
                    this.Append(nfi.CurrencySymbol);
                    this.Append(' ');
                    break;
                case 15:
                    this.Append('(');
                    break;
            }
        }

        this.AppendIntegerStringWithGroupSeparator(nfi.CurrencyGroupSizes, nfi.CurrencyGroupSeparator);

        if (precision > 0) {
            this.Append(nfi.CurrencyDecimalSeparator);
            this.AppendDecimalString(precision);
        }

        if (this._positive) {
            switch (nfi.CurrencyPositivePattern) {
                case 1:
                    this.Append(nfi.CurrencySymbol);
                    break;
                case 3:
                    this.Append(' ');
                    this.Append(nfi.CurrencySymbol);
                    break;
            }
        }
        else {
            switch (nfi.CurrencyNegativePattern) {
                case 0:
                    this.Append(')');
                    break;
                case 3:
                    this.Append(nfi.NegativeSign);
                    break;
                case 4:
                    this.Append(nfi.CurrencySymbol);
                    this.Append(')');
                    break;
                case 5:
                    this.Append(nfi.CurrencySymbol);
                    break;
                case 6:
                    this.Append(nfi.NegativeSign);
                    this.Append(nfi.CurrencySymbol);
                    break;
                case 7:
                    this.Append(nfi.CurrencySymbol);
                    this.Append(nfi.NegativeSign);
                    break;
                case 8:
                    this.Append(' ');
                    this.Append(nfi.CurrencySymbol);
                    break;
                case 10:
                    this.Append(' ');
                    this.Append(nfi.CurrencySymbol);
                    this.Append(nfi.NegativeSign);
                    break;
                case 11:
                    this.Append(nfi.NegativeSign);
                    break;
                case 13:
                    this.Append(nfi.NegativeSign);
                    this.Append(' ');
                    this.Append(nfi.CurrencySymbol);
                    break;
                case 14:
                    this.Append(')');
                    break;
                case 15:
                    this.Append(' ');
                    this.Append(nfi.CurrencySymbol);
                    this.Append(')');
                    break;
            }
        }

        return TString.FromCharArray(this._cbuf, 0, this._ind);
    }

    private FormatDecimal(precision: int, nfi: NumberFormatInfo): string {
        if (precision < this._digitsLen)
            precision = this._digitsLen;
        if (precision === 0)
            return "0";

        this.ResetCharBuf(precision + 1);
        if (!this._positive) {
            this.Append(nfi.NegativeSign);
        }
        this.AppendDigits(0, precision);

        return TString.FromCharArray(this._cbuf, 0, this._ind);
    }

    private FormatHexadecimal(precision: int): string {
        let size: int = Math.max(precision, this._decPointPos);
        const digits: CharArray = this._specifierIsUpper ? NumberFormatter.DigitUpperTable : NumberFormatter.DigitLowerTable;

        this.ResetCharBuf(size);
        this._ind = size;
        let val: ulong = Convert.ToLong(this._val1).or(Convert.ToLong(this._val2).shl(32));
        while (size > 0) {
            this._cbuf[--size] = digits[val.toNumber() & 0xf];
            val = val.shr(4);
        }
        return TString.FromCharArray(this._cbuf, 0, this._ind);
    }

    private FormatFixedPoint(precision: int, nfi: NumberFormatInfo) {
        if (precision == -1)
            precision = nfi.NumberDecimalDigits;

        this.RoundDecimal(precision);

        this.ResetCharBuf(this.IntegerDigits + precision + 2);

        if (!this._positive)
            this.Append(nfi.NegativeSign);

        this.AppendIntegerString(this.IntegerDigits);

        if (precision > 0) {
            this.Append(nfi.NumberDecimalSeparator);
            this.AppendDecimalString(precision);
        }

        return TString.FromCharArray(this._cbuf, 0, this._ind);
    }

    private FormatRoundtripDouble(origval: double, nfi: NumberFormatInfo): string {
        const nfc: NumberFormatter = this.GetClone();
        if (origval.greaterOrEquals(this.MinRoundtripVal) && origval.lessThanOrEqual(this.MaxRoundtripVal)) {
            const shortRep: string = this.FormatGeneral(this._defPrecision, nfi);
            if (origval === Double.Parse(shortRep, nfi))
                return shortRep;
        }
        return nfc.FormatGeneral(this._defPrecision + 2, nfi);
    }

    private FormatRoundtripFloat(origval: float, nfi: NumberFormatInfo): string {
        const nfc: NumberFormatter = this.GetClone();
        const shortRep: string = this.FormatGeneral(this._defPrecision, nfi);
        // Check roundtrip only for "normal" double values.
        /* if (origval === Single.Parse(shortRep, nfi)) {
            return shortRep;
        } */
        return nfc.FormatGeneral(this._defPrecision + 2, nfi);
    }

    private FormatGeneral(precision: int, nfi: NumberFormatInfo): string {
        let enableExp: boolean;
        if (precision === -1) {
            enableExp = this.IsFloatingSource;
            precision = this._defPrecision;
        }
        else {
            enableExp = true;
            if (precision == 0)
                precision = this._defPrecision;
            this.RoundPos(precision);
        }

        let intDigits: int = this._decPointPos;
        const digits: int = this._digitsLen;
        let decDigits: int = digits - intDigits;

        if ((intDigits > precision || intDigits <= -4) && enableExp)
            return this.FormatExponential(digits - 1, nfi, 2);

        if (decDigits < 0)
            decDigits = 0;
        if (intDigits < 0)
            intDigits = 0;
        this.ResetCharBuf(decDigits + intDigits + 3);

        if (!this._positive)
            this.Append(nfi.NegativeSign);

        if (intDigits == 0)
            this.Append('0');
        else
            this.AppendDigits(digits - intDigits, digits);

        if (decDigits > 0) {
            this.Append(nfi.NumberDecimalSeparator);
            this.AppendDigits(0, decDigits);
        }

        return TString.FromCharArray(this._cbuf, 0, this._ind);
    }

    private FormatNumber(precision: int, nfi: NumberFormatInfo): string {
        precision = (precision >= 0 ? precision : nfi.NumberDecimalDigits);
        this.ResetCharBuf(this.IntegerDigits * 3 + precision);
        this.RoundDecimal(precision);

        if (!this._positive) {
            switch (nfi.NumberNegativePattern) {
                case 0:
                    this.Append('(');
                    break;
                case 1:
                    this.Append(nfi.NegativeSign);
                    break;
                case 2:
                    this.Append(nfi.NegativeSign);
                    this.Append(' ');
                    break;
            }
        }

        this.AppendIntegerStringWithGroupSeparator(nfi.NumberGroupSizes, nfi.NumberGroupSeparator);

        if (precision > 0) {
            this.Append(nfi.NumberDecimalSeparator);
            this.AppendDecimalString(precision);
        }

        if (!this._positive) {
            switch (nfi.NumberNegativePattern) {
                case 0:
                    this.Append(')');
                    break;
                case 3:
                    this.Append(nfi.NegativeSign);
                    break;
                case 4:
                    this.Append(' ');
                    this.Append(nfi.NegativeSign);
                    break;
            }
        }

        return TString.FromCharArray(this._cbuf, 0, this._ind);
    }

    private FormatPercent(precision: int, nfi: NumberFormatInfo): string {
        precision = (precision >= 0 ? precision : nfi.PercentDecimalDigits);
        this.Multiply10(2);
        this.RoundDecimal(precision);
        this.ResetCharBuf(this.IntegerDigits * 2 + precision + 16);

        if (this._positive) {
            if (nfi.PercentPositivePattern == 2)
                this.Append(nfi.PercentSymbol);
        }
        else {
            switch (nfi.PercentNegativePattern) {
                case 0:
                    this.Append(nfi.NegativeSign);
                    break;
                case 1:
                    this.Append(nfi.NegativeSign);
                    break;
                case 2:
                    this.Append(nfi.NegativeSign);
                    this.Append(nfi.PercentSymbol);
                    break;
            }
        }

        this.AppendIntegerStringWithGroupSeparator(nfi.PercentGroupSizes, nfi.PercentGroupSeparator);

        if (precision > 0) {
            this.Append(nfi.PercentDecimalSeparator);
            this.AppendDecimalString(precision);
        }

        if (this._positive) {
            switch (nfi.PercentPositivePattern) {
                case 0:
                    this.Append(' ');
                    this.Append(nfi.PercentSymbol);
                    break;
                case 1:
                    this.Append(nfi.PercentSymbol);
                    break;
            }
        }
        else {
            switch (nfi.PercentNegativePattern) {
                case 0:
                    this.Append(' ');
                    this.Append(nfi.PercentSymbol);
                    break;
                case 1:
                    this.Append(nfi.PercentSymbol);
                    break;
            }
        }

        return TString.FromCharArray(this._cbuf, 0, this._ind);
    }

    private FormatExponential(precision: int, nfi: NumberFormatInfo): string;
    private FormatExponential(precision: int, nfi: NumberFormatInfo, expDigits: int): string;
    private FormatExponential(...args: any[]): string {
        if (args.length === 2) {
            let precision: int = args[0];
            const nfi: NumberFormatInfo = args[1];
            if (precision == -1)
                precision = NumberFormatter.DefaultExpPrecision;

            this.RoundPos(precision + 1);
            return this.FormatExponential(precision, nfi, 3);
        } else if (args.length === 3) {
            const precision: int = args[0];
            const nfi: NumberFormatInfo = args[1];
            const expDigits: int = args[2];
            let decDigits: int = this._decPointPos;
            const digits: int = this._digitsLen;
            const exponent: int = decDigits - 1;
            decDigits = this._decPointPos = 1;

            this.ResetCharBuf(precision + 8);

            if (!this._positive)
                this.Append(nfi.NegativeSign);

            this.AppendOneDigit(digits - 1);

            if (precision > 0) {
                this.Append(nfi.NumberDecimalSeparator);
                this.AppendDigits(digits - precision - 1, digits - this._decPointPos);
            }

            this.AppendExponent(nfi, exponent, expDigits);

            return TString.FromCharArray(this._cbuf, 0, this._ind);
        }
        throw new ArgumentOutOfRangeException('');
    }

    private FormatCustom(format: string, nfi: NumberFormatInfo): string {
        let p: Out<boolean> = New.Out(this._positive);
        const offset: Out<int> = New.Out(0);
        const length: Out<int> = New.Out(0);
        const _isZero: Out<boolean> = New.Out(this.IsZero);
        CustomInfo.GetActiveSection(format, p, _isZero, offset, length);
        if (length.value === 0)
            return this._positive ? TString.Empty : nfi.NegativeSign;
        this._positive = p.value;

        const info: CustomInfo = CustomInfo.Parse(format, offset.value, length.value, nfi);
        const sb_int: StringBuilder = new StringBuilder(info.IntegerDigits * 2);
        const sb_dec: StringBuilder = new StringBuilder(info.DecimalDigits * 2);
        const sb_exp: StringBuilder = (info.UseExponent ? new StringBuilder(info.ExponentDigits * 2) : null as any);

        let diff: int = 0;
        if (info.Percents > 0)
            this.Multiply10(2 * info.Percents);
        if (info.Permilles > 0)
            this.Multiply10(3 * info.Permilles);
        if (info.DividePlaces > 0)
            this.Divide10(info.DividePlaces);

        let expPositive: boolean = true;
        if (info.UseExponent && (info.DecimalDigits > 0 || info.IntegerDigits > 0)) {
            if (!_isZero) {
                this.RoundPos(info.DecimalDigits + info.IntegerDigits);
                diff -= this._decPointPos - info.IntegerDigits;
                this._decPointPos = info.IntegerDigits;
            }

            expPositive = diff <= 0;
            NumberFormatter.AppendNonNegativeNumber(sb_exp, diff < 0 ? -diff : diff);
        }
        else
            this.RoundDecimal(info.DecimalDigits);

        if (info.IntegerDigits !== 0 || !this.IsZeroInteger)
            this.AppendIntegerString(this.IntegerDigits, sb_int);

        this.AppendDecimalString(this.DecimalDigits, sb_dec);

        if (info.UseExponent) {
            if (info.DecimalDigits <= 0 && info.IntegerDigits <= 0)
                this._positive = true;

            if (sb_int.Length < info.IntegerDigits)
                sb_int.Insert(0, "0", info.IntegerDigits - sb_int.Length);

            while (sb_exp.Length < info.ExponentDigits - info.ExponentTailSharpDigits)
                sb_exp.Insert(0, '0');

            if (expPositive && !info.ExponentNegativeSignOnly)
                sb_exp.Insert(0, nfi.PositiveSign);
            else if (!expPositive)
                sb_exp.Insert(0, nfi.NegativeSign);
        }
        else {
            if (sb_int.Length < info.IntegerDigits - info.IntegerHeadSharpDigits)
                sb_int.Insert(0, "0", info.IntegerDigits - info.IntegerHeadSharpDigits - sb_int.Length);
            if (info.IntegerDigits == info.IntegerHeadSharpDigits && NumberFormatter.IsZeroOnly(sb_int))
                sb_int.Remove(0, sb_int.Length);
        }

        NumberFormatter.ZeroTrimEnd(sb_dec, true);
        while (sb_dec.Length < info.DecimalDigits - info.DecimalTailSharpDigits)
            sb_dec.Append('0');
        if (sb_dec.Length > info.DecimalDigits)
            sb_dec.Remove(info.DecimalDigits, sb_dec.Length - info.DecimalDigits);

        return info.Format(format, offset.value, length.value, nfi, this._positive, sb_int, sb_dec, sb_exp);
    }

    private static ZeroTrimEnd(sb: StringBuilder, canEmpty: boolean): void {
        let len: int = 0;
        for (let i: int = sb.Length - 1; (canEmpty ? i >= 0 : i > 0); i--) {
            if (sb[i] !== '0'.charCodeAt(0))
                break;
            len++;
        }

        if (len > 0)
            sb.Remove(sb.Length - len, len);
    }

    private static IsZeroOnly(sb: StringBuilder): boolean {
        for (let i: int = 0; i < sb.Length; i++)
            if (TChar.IsDigit(sb[i]) && sb[i] !== '0')
                return false;
        return true;
    }

    private static AppendNonNegativeNumber(sb: StringBuilder, v: int): void {
        if (v < 0)
            throw new ArgumentException('');

        let i: int = NumberFormatter.ScaleOrder(Convert.ToLong(v)) - 1;
        do {
            const n: int = v / Convert.ToInt32(NumberFormatter.GetTenPowerOf(i));
            sb.AppendChar(Convert.ToChar('0'.charCodeAt(0) | n));
            v -= Convert.ToInt32(NumberFormatter.GetTenPowerOf(i--)) * n;
        } while (i >= 0);
    }

    private AppendIntegerString(minLength: int): void;
    private AppendIntegerString(minLength: int, sb: StringBuilder): void;
    private AppendIntegerString(...args: any[]): void {
        if (args.length === 1) {
            const minLength: int = args[0];
            if (this._decPointPos <= 0) {
                this.Append('0'.charCodeAt(0), minLength);
                return;
            }

            if (this._decPointPos < minLength)
                this.Append('0'.charCodeAt(0), minLength - this._decPointPos);

            this.AppendDigits(this._digitsLen - this._decPointPos, this._digitsLen);
            return;
        } else if (args.length === 2) {
            const minLength: int = args[0];
            const sb: StringBuilder = args[1];
            if (this._decPointPos <= 0) {
                sb.AppendChar('0'.charCodeAt(0), minLength);
                return;
            }

            if (this._decPointPos < minLength)
                sb.AppendChar('0', minLength - this._decPointPos);

            this.AppendDigits(this._digitsLen - this._decPointPos, this._digitsLen, sb);
            return;
        }
        throw new ArgumentOutOfRangeException('');
    }

    private AppendDecimalString(precision: int): void;
    private AppendDecimalString(precision: int, sb: StringBuilder): void;
    private AppendDecimalString(...args: any[]): void {
        if (args.length === 1) {
            const precision: int = args[0];
            this.AppendDigits(this._digitsLen - precision - this._decPointPos, this._digitsLen - this._decPointPos);
        } else if (args.length === 2) {
            const precision: int = args[0];
            const sb: StringBuilder = args[1];
            this.AppendDigits(this._digitsLen - precision - this._decPointPos, this._digitsLen - this._decPointPos, sb);
        }
    }

    private AppendIntegerStringWithGroupSeparator(groups: IntArray, groupSeparator: string): void {
        if (this.IsZeroInteger) {
            this.Append('0');
            return;
        }

        let total: int = 0;
        let groupIndex: int = 0;
        for (let i: int = 0; i < groups.length; i++) {
            total += groups[i];
            if (total <= this._decPointPos)
                groupIndex = i;
            else
                break;
        }

        if (groups.length > 0 && total > 0) {
            let counter: int;
            let groupSize: int = groups[groupIndex];
            const fraction: int = this._decPointPos > total ? this._decPointPos - total : 0;
            if (groupSize == 0) {
                while (groupIndex >= 0 && groups[groupIndex] == 0)
                    groupIndex--;

                groupSize = fraction > 0 ? fraction : groups[groupIndex];
            }
            if (fraction == 0)
                counter = groupSize;
            else {
                groupIndex += Convert.ToInt32(fraction / groupSize);
                counter = fraction % groupSize;
                if (counter === 0)
                    counter = groupSize;
                else
                    groupIndex++;
            }

            if (total >= this._decPointPos) {
                let lastGroupSize: int = groups[0];
                if (total > lastGroupSize) {
                    let lastGroupDiff: int = -(lastGroupSize - this._decPointPos);
                    let lastGroupMod: int;

                    if (lastGroupDiff < lastGroupSize)
                        counter = lastGroupDiff;
                    else if (lastGroupSize > 0 && (lastGroupMod = this._decPointPos % lastGroupSize) > 0)
                        counter = lastGroupMod;
                }
            }

            for (let i: int = 0; ;) {
                if ((this._decPointPos - i) <= counter || counter == 0) {
                    this.AppendDigits(this._digitsLen - this._decPointPos, this._digitsLen - i);
                    break;
                }
                this.AppendDigits(this._digitsLen - i - counter, this._digitsLen - i);
                i += counter;
                this.Append(groupSeparator);
                if (--groupIndex < groups.length && groupIndex >= 0)
                    groupSize = groups[groupIndex];
                counter = groupSize;
            }
        }
        else {
            this.AppendDigits(this._digitsLen - this._decPointPos, this._digitsLen);
        }
    }

    // minDigits is in the range 1..3
    private AppendExponent(nfi: NumberFormatInfo, exponent: int, minDigits: int): void {
        if (this._specifierIsUpper || this._specifier === 'R'.charCodeAt(0))
            this.Append('E');
        else
            this.Append('e');

        if (exponent >= 0)
            this.Append(nfi.PositiveSign);
        else {
            this.Append(nfi.NegativeSign);
            exponent = -exponent;
        }

        if (exponent == 0)
            this.Append('0'.charCodeAt(0), minDigits);
        else if (exponent < 10) {
            this.Append('0'.charCodeAt(0), minDigits - 1);
            this.Append(Convert.ToChar('0'.charCodeAt(0) | exponent));
        }
        else {
            const hexDigit: uint = NumberFormatter.FastToDecHex(exponent);
            if (exponent >= 100 || minDigits == 3)
                this.Append(Convert.ToChar('0'.charCodeAt(0) | (hexDigit >> 8)));
            this.Append(('0'.charCodeAt(0) | ((hexDigit >> 4) & 0xf)));
            this.Append(Convert.ToChar('0'.charCodeAt(0) | (hexDigit & 0xf)));
        }
    }

    private AppendOneDigit(start: int): void {
        if (this._ind === this._cbuf.length)
            this.Resize(this._ind + 10);

        start += this._offset;
        let v: uint;
        if (start < 0)
            v = 0;
        else if (start < 8)
            v = this._val1;
        else if (start < 16)
            v = this._val2;
        else if (start < 24)
            v = this._val3;
        else if (start < 32)
            v = this._val4;
        else
            v = 0;
        v >>= (start & 0x7) << 2;
        this._cbuf[this._ind++] = Convert.ToChar('0'.charCodeAt(0) | v & 0xf);
    }

    private AppendDigits(start: int, end: int): void;
    private AppendDigits(start: int, end: int, sb: StringBuilder): void;
    private AppendDigits(...args: any[]): void {
        if (args.length === 2) {
            let start: int = args[0];
            let end: int = args[1];

            if (start >= end)
                return;

            let i: int = this._ind + (end - start);
            if (i > this._cbuf.length)
                this.Resize(i + 10);
            this._ind = i;

            end += this._offset;
            start += this._offset;

            for (let next: int = start + 8 - (start & 0x7); ; start = next, next += 8) {
                let v: uint;
                if (next === 8)
                    v = this._val1;
                else if (next == 16)
                    v = this._val2;
                else if (next == 24)
                    v = this._val3;
                else if (next == 32)
                    v = this._val4;
                else
                    v = 0;
                v >>= (start & 0x7) << 2;
                if (next > end)
                    next = end;

                this._cbuf[--i] = Convert.ToChar('0'.charCodeAt(0) | v & 0xf);
                switch (next - start) {
                    case 8:
                        this._cbuf[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        this._cbuf[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        this._cbuf[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        this._cbuf[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        this._cbuf[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        this._cbuf[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        this._cbuf[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        if (next == end)
                            return;
                        continue;
                    case 7:
                        this._cbuf[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        this._cbuf[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        this._cbuf[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        this._cbuf[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        this._cbuf[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        this._cbuf[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        if (next == end)
                            return;
                        continue;
                    case 6:
                        this._cbuf[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        this._cbuf[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        this._cbuf[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        this._cbuf[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        this._cbuf[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        if (next == end)
                            return;
                        continue;
                    case 5:
                        this._cbuf[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        this._cbuf[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        this._cbuf[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        this._cbuf[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        if (next == end)
                            return;
                        continue;
                    case 4:
                        this._cbuf[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        this._cbuf[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        this._cbuf[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        if (next == end)
                            return;
                        continue;


                    case 3:
                        this._cbuf[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        this._cbuf[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        if (next == end)
                            return;
                        continue;


                    case 2:
                        this._cbuf[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        if (next == end)
                            return;
                        continue;


                    case 1:
                        if (next == end)
                            return;
                        continue;
                }
            }
        } else if (args.length === 3) {
            let start: int = args[0];
            let end: int = args[1];
            const sb: StringBuilder = args[2];
            if (start >= end)
                return;

            let i: int = sb.Length + (end - start);
            sb.Length = i;

            end += this._offset;
            start += this._offset;

            for (let next: int = start + 8 - (start & 0x7); ; start = next, next += 8) {
                let v: uint;
                if (next === 8)
                    v = this._val1;
                else if (next === 16)
                    v = this._val2;
                else if (next === 24)
                    v = this._val3;
                else if (next === 32)
                    v = this._val4;
                else
                    v = 0;
                v >>= (start & 0x7) << 2;
                if (next > end)
                    next = end;
                sb[--i] = Convert.ToChar('0'.charCodeAt(0) | v & 0xf);
                switch (next - start) {
                    case 8:
                        sb[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        sb[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        sb[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        sb[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        sb[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        sb[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        sb[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        if (next == end)
                            return;
                        continue;
                    case 7:
                        sb[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        sb[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        sb[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        sb[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        sb[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        sb[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        if (next == end)
                            return;
                        continue;
                    case 6:
                        sb[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        sb[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        sb[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        sb[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        sb[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        if (next == end)
                            return;
                        continue;
                    case 5:
                        sb[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        sb[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        sb[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        sb[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        if (next == end)
                            return;
                        continue;
                    case 4:
                        sb[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        sb[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        sb[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        if (next == end)
                            return;
                        continue;
                    case 3:
                        sb[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        sb[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        if (next == end)
                            return;
                        continue;
                    case 2:
                        sb[--i] = Convert.ToChar('0'.charCodeAt(0) | (v >>= 4) & 0xf);
                        if (next == end)
                            return;
                        continue;
                    case 1:
                        if (next == end)
                            return;
                        continue;
                }
            }
        }
    }


    private Multiply10(count: int): void {
        if (count <= 0 || this._digitsLen == 0)
            return;

        this._decPointPos += count;
    }

    private Divide10(count: int): void {
        if (count <= 0 || this._digitsLen === 0)
            return;

        this._decPointPos -= count;
    }

    private GetClone(): NumberFormatter {
        return <NumberFormatter>this.MemberwiseClone();
    }


}