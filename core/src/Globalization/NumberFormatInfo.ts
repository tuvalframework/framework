import { Environment } from "../Environment";
import { ArgumentException } from "../Exceptions/ArgumentException";
import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { ArgumentOutOfRangeException } from "../Exceptions/ArgumentOutOfRangeException";
import { InvalidOperationException } from "../Exceptions/InvalidOperationException";
import { TChar } from "../Extensions/TChar";
import { TObject } from "../Extensions/TObject";
import { int, IntArray, New, StringArray } from '../float';
import { ICloneable } from "../ICloneable";
import { IFormatProvider } from "../IFormatProvider";
import { TString } from "../Text/TString";
import { UnicodeCategory } from "./Unicodecategory";
import { CultureData, CultureInfo } from "./CultureInfo";
import { Type } from "../Reflection/Type";
import { NumberStyles } from "./NumberStyles";
import { GlobalizationMode } from "./GlobalizationMode";
import { System } from '../SystemTypes';
import { Context } from '../Context/Context';
import { typeOf } from '../Reflection/Decorators/ClassInfo';

export class NumberFormatInfo extends TObject implements ICloneable<NumberFormatInfo>, IFormatProvider {
    protected dispose(disposing: boolean): void {
        throw new Error("Method not implemented.");
    }

    // invariantInfo is constant irrespective of your current culture.
    private static invariantInfo: NumberFormatInfo;

    // READTHIS READTHIS READTHIS
    // This class has an exact mapping onto a native structure defined in COMNumber.cpp
    // DO NOT UPDATE THIS WITHOUT UPDATING THAT STRUCTURE. IF YOU ADD BOOL, ADD THEM AT THE END.
    // ALSO MAKE SURE TO UPDATE mscorlib.h in the VM directory to check field offsets.
    // READTHIS READTHIS READTHIS
    public /* internal */  numberGroupSizes: IntArray = New.IntArray(3);
    public /* internal */ currencyGroupSizes: IntArray = New.IntArray(3);
    public /* internal */  percentGroupSizes: IntArray = New.IntArray(3);
    public /* internal */  positiveSign: string = "+";
    public /* internal */  negativeSign: string = "-";
    public /* internal */  numberDecimalSeparator: string = ".";
    public /* internal */  numberGroupSeparator: string = ",";
    public /* internal */ currencyGroupSeparator: string = ",";
    public /* internal */  currencyDecimalSeparator: string = ".";
    public /* internal */  currencySymbol: string = "\x00a4";  // U+00a4 is the symbol for International Monetary Fund.
    // The alternative currency symbol used in Win9x ANSI codepage, that can not roundtrip between ANSI and Unicode.
    // Currently, only ja-JP and ko-KR has non-null values (which is U+005c, backslash)
    // NOTE: The only legal values for this string are null and "\x005c"
    public /* internal */  ansiCurrencySymbol: string = null as any;
    public /* internal */  nanSymbol: string = "NaN";
    public /* internal */  positiveInfinitySymbol: string = "Infinity";
    public /* internal */  negativeInfinitySymbol: string = "-Infinity";
    public /* internal */  percentDecimalSeparator: string = ".";
    public /* internal */  percentGroupSeparator: string = ",";
    public /* internal */  percentSymbol: string = "%";
    public /* internal */  perMilleSymbol: string = "\u2030";

    public /* internal */  nativeDigits: StringArray = New.StringArray("0", "1", "2", "3", "4", "5", "6", "7", "8", "9");

    // an index which points to a record in Culture Data Table.
    // We shouldn't be persisting dataItem (since its useless & we weren't using it),
    // but since COMNumber.cpp uses it and since serialization isn't implimented, its stuck for now.
    public /* internal */  m_dataItem: int = 0;    // NEVER USED, DO NOT USE THIS! (Serialized in Everett)

    public /* internal */  numberDecimalDigits: int = 2;
    public /* internal */  currencyDecimalDigits: int = 2;
    public /* internal */  currencyPositivePattern: int = 0;
    public /* internal */  currencyNegativePattern: int = 0;
    public /* internal */  numberNegativePattern: int = 1;
    public /* internal */  percentPositivePattern: int = 0;
    public /* internal */  percentNegativePattern: int = 0;
    public /* internal */  percentDecimalDigits: int = 2;



    public /* internal */  isReadOnly: boolean = false;
    // We shouldn't be persisting m_useUserOverride (since its useless & we weren't using it),
    // but since COMNumber.cpp uses it and since serialization isn't implimented, its stuck for now.
    public /* internal */  m_useUserOverride: boolean = false;    // NEVER USED, DO NOT USE THIS! (Serialized in Everett)

    // Is this NumberFormatInfo for invariant culture?
    //[OptionalField(VersionAdded = 2)]
    public /* internal */  m_isInvariant: boolean = false;

    public constructor();
    public /* internal */ constructor(cultureData: CultureData);
    public constructor(...args: any[]) {
        super();
        if (args.length === 0) {

        } else if (args.length === 1) {
            const cultureData: CultureData = args[0];
            if (GlobalizationMode.Invariant) {
                this.m_isInvariant = true;
                return;
            }

            if (cultureData != null) {
                // We directly use fields here since these data is coming from data table or Win32, so we
                // don't need to verify their values (except for invalid parsing situations).
                cultureData.GetNFIValues(this);

                if (cultureData.IsInvariantCulture) {
                    // For invariant culture
                    this.m_isInvariant = true;
                }
            }
        }
    }
    private static VerifyDecimalSeparator(decSep: string, propertyName: string): void {
        if (decSep == null) {
            throw new ArgumentNullException(propertyName,
                Environment.GetResourceString("ArgumentNull_String"));
        }

        if (decSep.length === 0) {
            throw new ArgumentException(Environment.GetResourceString("Argument_EmptyDecString"));
        }
    }

    private static VerifyGroupSeparator(groupSep: string, propertyName: string): void {
        if (groupSep == null) {
            throw new ArgumentNullException(propertyName,
                Environment.GetResourceString("ArgumentNull_String"));
        }
    }

    private static VerifyNativeDigits(nativeDig: string[], propertyName: string): void {
        if (nativeDig == null) {
            throw new ArgumentNullException(propertyName,
                Environment.GetResourceString("ArgumentNull_Array"));
        }

        if (nativeDig.length !== 10) {
            throw new ArgumentException(Environment.GetResourceString("Argument_InvalidNativeDigitCount"), propertyName);
        }

        for (let i: int = 0; i < nativeDig.length; i++) {
            if (nativeDig[i] == null) {
                throw new ArgumentNullException(propertyName,
                    Environment.GetResourceString("ArgumentNull_ArrayValue"));
            }


            if (nativeDig[i].length !== 1) {
                if (nativeDig[i].length !== 2) {
                    // Not 1 or 2 UTF-16 code points
                    throw new ArgumentException(Environment.GetResourceString("Argument_InvalidNativeDigitValue"), propertyName);
                } else if (!TChar.IsSurrogatePair(nativeDig[i][0].charCodeAt(0), nativeDig[i][1].charCodeAt(0))) {
                    // 2 UTF-6 code points, but not a surrogate pair
                    throw new ArgumentException(Environment.GetResourceString("Argument_InvalidNativeDigitValue"), propertyName);
                }
            }

           /*  if (CharUnicodeInfo.GetDecimalDigitValue(nativeDig[i], 0) !== i &&
                CharUnicodeInfo.GetUnicodeCategory(nativeDig[i], 0) !== UnicodeCategory.PrivateUse) {
                // Not the appropriate digit according to the Unicode data properties
                // (Digit 0 must be a 0, etc.).
                throw new ArgumentException(Environment.GetResourceString("Argument_InvalidNativeDigitValue"), propertyName);
            } */
        }
    }


    private VerifyWritable(): void {
        if (this.isReadOnly) {
            throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_ReadOnly"));
        }
    }

    // Returns a default NumberFormatInfo that will be universally
    // supported and constant irrespective of the current culture.
    // Used by FromString methods.
    //

    public static get InvariantInfo(): NumberFormatInfo {
        if (NumberFormatInfo.invariantInfo == null) {
            // Lazy create the invariant info. This cannot be done in a .cctor because exceptions can
            // be thrown out of a .cctor stack that will need this.
            const nfi: NumberFormatInfo = new NumberFormatInfo();
            nfi.m_isInvariant = true;
            NumberFormatInfo.invariantInfo = NumberFormatInfo.ReadOnly(nfi);
        }
        return NumberFormatInfo.invariantInfo;
    }


    public static GetInstance(formatProvider: IFormatProvider): NumberFormatInfo {
        // Fast case for a regular CultureInfo
        let info: NumberFormatInfo;
        const cultureProvider: CultureInfo = formatProvider as CultureInfo;
        if (cultureProvider != null && !cultureProvider.m_isInherited) {
            info = cultureProvider.numInfo;
            if (info != null) {
                return info;
            }
            else {
                return cultureProvider.NumberFormat;
            }
        }
        // Fast case for an NFI;
        info = formatProvider as NumberFormatInfo;
        if (info != null) {
            return info;
        }
        if (formatProvider != null) {
            info = formatProvider.GetFormat(typeof (NumberFormatInfo)) as NumberFormatInfo;
            if (info != null) {
                return info;
            }
        }
        return NumberFormatInfo.CurrentInfo;
    }



    public Clone(): NumberFormatInfo {
        const n: NumberFormatInfo = this.MemberwiseClone();
        n.isReadOnly = false;
        return n;
    }


    public get CurrencyDecimalDigits(): int {
        return this.currencyDecimalDigits;
    }
    public set CurrencyDecimalDigits(value: int) {
        if (value < 0 || value > 99) {
            throw new ArgumentOutOfRangeException(
                "CurrencyDecimalDigits",
                TString.Format(
                    /* CultureInfo.CurrentCulture, */
                    Environment.GetResourceString("ArgumentOutOfRange_Range"),
                    0,
                    99));
        }
        this.VerifyWritable();
        this.currencyDecimalDigits = value;
    }



    public get CurrencyDecimalSeparator(): string {
        return this.currencyDecimalSeparator;
    }
    public set CurrencyDecimalSeparator(value: string) {
        this.VerifyWritable();
        NumberFormatInfo.VerifyDecimalSeparator(value, "CurrencyDecimalSeparator");
        this.currencyDecimalSeparator = value;
    }


    public get IsReadOnly(): boolean {
        return this.isReadOnly;
    }

    //
    // Check the values of the groupSize array.
    //
    // Every element in the groupSize array should be between 1 and 9
    // excpet the last element could be zero.
    //
    private static /* internal */  CheckGroupSize(propName: string, groupSize: IntArray): void {
        for (let i: int = 0; i < groupSize.length; i++) {
            if (groupSize[i] < 1) {
                if (i == groupSize.length - 1 && groupSize[i] == 0)
                    return;
                throw new ArgumentException(Environment.GetResourceString("Argument_InvalidGroupSize"), propName);
            }
            else if (groupSize[i] > 9) {
                throw new ArgumentException(Environment.GetResourceString("Argument_InvalidGroupSize"), propName);
            }
        }
    }


    public get CurrencyGroupSizes(): IntArray {
        return New.IntArray(this.currencyGroupSizes);
    }
    public set CurrencyGroupSizes(value: IntArray) {
        if (value == null) {
            throw new ArgumentNullException("CurrencyGroupSizes",
                Environment.GetResourceString("ArgumentNull_Obj"));
        }
        this.VerifyWritable();

        const inputSizes: IntArray = New.IntArray(value)/* .Clone() */;
        NumberFormatInfo.CheckGroupSize("CurrencyGroupSizes", inputSizes);
        this.currencyGroupSizes = inputSizes;
    }

    public get NumberGroupSizes(): IntArray {
        return New.IntArray(this.numberGroupSizes);
    }
    public set NumberGroupSizes(value: IntArray) {
        if (value == null) {
            throw new ArgumentNullException("NumberGroupSizes",
                Environment.GetResourceString("ArgumentNull_Obj"));
        }
        this.VerifyWritable();

        const inputSizes: IntArray = New.IntArray(value);
        NumberFormatInfo.CheckGroupSize("NumberGroupSizes", inputSizes);
        this.numberGroupSizes = inputSizes;
    }



    public get PercentGroupSizes(): IntArray {
        return New.IntArray(this.percentGroupSizes);
    }
    public set PercentGroupSizes(value: IntArray) {
        if (value == null) {
            throw new ArgumentNullException("PercentGroupSizes",
                Environment.GetResourceString("ArgumentNull_Obj"));
        }

        this.VerifyWritable();
        const inputSizes: IntArray = New.IntArray(value);
        NumberFormatInfo.CheckGroupSize("PercentGroupSizes", inputSizes);
        this.percentGroupSizes = inputSizes;
    }


    public get CurrencyGroupSeparator(): string {
        return this.currencyGroupSeparator;
    }
    public set CurrencyGroupSeparator(value: string) {
        this.VerifyWritable();
        NumberFormatInfo.VerifyGroupSeparator(value, "CurrencyGroupSeparator");
        this.currencyGroupSeparator = value;
    }



    public get CurrencySymbol(): string {
        return this.currencySymbol;
    }
    public set CurrencySymbol(value: string) {
        if (value == null) {
            throw new ArgumentNullException("CurrencySymbol",
                Environment.GetResourceString("ArgumentNull_String"));
        }
        this.VerifyWritable();
        this.currencySymbol = value;
    }

    // Returns the current culture's NumberFormatInfo.  Used by Parse methods.
    //

    public static get CurrentInfo(): NumberFormatInfo {
        const _Thread = Context.Current.get('Thread');
        const culture: CultureInfo = _Thread.CurrentThread.CurrentCulture;
        if (!culture.m_isInherited) {
            const info: NumberFormatInfo = culture.numInfo;
            if (info != null) {
                return info;
            }
        }
        return culture.GetFormat(typeOf (System.Types.Globalization.NumberFormatInfo));
    }



    public get NaNSymbol(): string {
        return this.nanSymbol;
    }
    public set NaNSymbol(value: string) {
        if (value == null) {
            throw new ArgumentNullException("NaNSymbol",
                Environment.GetResourceString("ArgumentNull_String"));
        }
        this.VerifyWritable();
        this.nanSymbol = value;
    }

    public get CurrencyNegativePattern(): int {
        return this.currencyNegativePattern;
    }
    public set CurrencyNegativePattern(value: int) {
        if (value < 0 || value > 15) {
            throw new ArgumentOutOfRangeException(
                "CurrencyNegativePattern",
                TString.Format(
                    /* CultureInfo.CurrentCulture, */
                    Environment.GetResourceString("ArgumentOutOfRange_Range"),
                    0,
                    15));
        }
        this.VerifyWritable();
        this.currencyNegativePattern = value;
    }


    public get NumberNegativePattern(): int {
        return this.numberNegativePattern;
    }
    public set NumberNegativePattern(value: int) {
        //
        // NOTENOTE: the range of value should correspond to negNumberFormats[] in vm\COMNumber.cpp.
        //
        if (value < 0 || value > 4) {
            throw new ArgumentOutOfRangeException(
                "NumberNegativePattern",
                TString.Format(
                   /*  CultureInfo.CurrentCulture, */
                    Environment.GetResourceString("ArgumentOutOfRange_Range"),
                    0,
                    4));
        }
        this.VerifyWritable();
        this.numberNegativePattern = value;
    }


    public get PercentPositivePattern(): int {
        return this.percentPositivePattern;
    }
    public set PercentPositivePattern(value: int) {
        //
        // NOTENOTE: the range of value should correspond to posPercentFormats[] in vm\COMNumber.cpp.
        //
        if (value < 0 || value > 3) {
            throw new ArgumentOutOfRangeException(
                "PercentPositivePattern",
                TString.Format(
                   /*  CultureInfo.CurrentCulture, */
                    Environment.GetResourceString("ArgumentOutOfRange_Range"),
                    0,
                    3));
        }
        this.VerifyWritable();
        this.percentPositivePattern = value;
    }


    public get PercentNegativePattern(): int {
        return this.percentNegativePattern;
    }
    public set PercentNegativePattern(value: int) {
        //
        // NOTENOTE: the range of value should correspond to posPercentFormats[] in vm\COMNumber.cpp.
        //
        if (value < 0 || value > 11) {
            throw new ArgumentOutOfRangeException(
                "PercentNegativePattern",
                TString.Format(
                   /*  CultureInfo.CurrentCulture, */
                    Environment.GetResourceString("ArgumentOutOfRange_Range"),
                    0,
                    11));
        }
        this.VerifyWritable();
        this.percentNegativePattern = value;
    }


    public get NegativeInfinitySymbol(): string {
        return this.negativeInfinitySymbol;
    }
    public set NegativeInfinitySymbol(value: string) {
        if (value == null) {
            throw new ArgumentNullException("NegativeInfinitySymbol",
                Environment.GetResourceString("ArgumentNull_String"));
        }
        this.VerifyWritable();
        this.negativeInfinitySymbol = value;
    }



    public get NegativeSign(): string {
        return this.negativeSign;
    }
    public set NegativeSign(value: string) {
        if (value == null) {
            throw new ArgumentNullException("NegativeSign",
                Environment.GetResourceString("ArgumentNull_String"));
        }
        this.VerifyWritable();
        this.negativeSign = value;
    }



    public get NumberDecimalDigits(): int {
        return this.numberDecimalDigits;
    }
    public set NumberDecimalDigits(value: int) {
        if (value < 0 || value > 99) {
            throw new ArgumentOutOfRangeException(
                "NumberDecimalDigits",
                TString.Format(
                    /* CultureInfo.CurrentCulture, */
                    Environment.GetResourceString("ArgumentOutOfRange_Range"),
                    0,
                    99));
        }
        this.VerifyWritable();
        this.numberDecimalDigits = value;
    }



    public get NumberDecimalSeparator(): string {
        return this.numberDecimalSeparator;
    }
    public set NumberDecimalSeparator(value: string) {
        this.VerifyWritable();
        NumberFormatInfo.VerifyDecimalSeparator(value, "NumberDecimalSeparator");
        this.numberDecimalSeparator = value;
    }


    public get NumberGroupSeparator(): string {
        return this.numberGroupSeparator;
    }
    public set NumberGroupSeparator(value: string) {
        this.VerifyWritable();
        NumberFormatInfo.VerifyGroupSeparator(value, "NumberGroupSeparator");
        this.numberGroupSeparator = value;
    }


    public get CurrencyPositivePattern(): int {
        return this.currencyPositivePattern;
    }
    public set CurrencyPositivePattern(value: int) {
        if (value < 0 || value > 3) {
            throw new ArgumentOutOfRangeException(
                "CurrencyPositivePattern",
                TString.Format(
                    /* CultureInfo.CurrentCulture, */
                    Environment.GetResourceString("ArgumentOutOfRange_Range"),
                    0,
                    3));
        }
        this.VerifyWritable();
        this.currencyPositivePattern = value;
    }



    public get PositiveInfinitySymbol(): string {
        return this.positiveInfinitySymbol;
    }
    public set PositiveInfinitySymbol(value: string) {
        if (value == null) {
            throw new ArgumentNullException("PositiveInfinitySymbol",
                Environment.GetResourceString("ArgumentNull_String"));
        }
        this.VerifyWritable();
        this.positiveInfinitySymbol = value;
    }



    public get PositiveSign(): string {
        return this.positiveSign;
    }
    public set PositiveSign(value: string) {
        if (value == null) {
            throw new ArgumentNullException("PositiveSign",
                Environment.GetResourceString("ArgumentNull_String"));
        }
        this.VerifyWritable();
        this.positiveSign = value;
    }



    public get PercentDecimalDigits(): int {
        return this.percentDecimalDigits;
    }
    public set PercentDecimalDigits(value: int) {
        if (value < 0 || value > 99) {
            throw new ArgumentOutOfRangeException(
                "PercentDecimalDigits",
                TString.Format(
                   /*  CultureInfo.CurrentCulture, */
                    Environment.GetResourceString("ArgumentOutOfRange_Range"),
                    0,
                    99));
        }
        this.VerifyWritable();
        this.percentDecimalDigits = value;
    }


    public get PercentDecimalSeparator(): string {
        return this.percentDecimalSeparator;
    }
    public set PercentDecimalSeparator(value: string) {
        this.VerifyWritable();
        NumberFormatInfo.VerifyDecimalSeparator(value, "PercentDecimalSeparator");
        this.percentDecimalSeparator = value;
    }


    public get PercentGroupSeparator(): string {
        return this.percentGroupSeparator;
    }
    public set PercentGroupSeparator(value: string) {
        this.VerifyWritable();
        NumberFormatInfo.VerifyGroupSeparator(value, "PercentGroupSeparator");
        this.percentGroupSeparator = value;
    }


    public get PercentSymbol(): string {
        return this.percentSymbol;
    }
    public set PercentSymbol(value: string) {
        if (value == null) {
            throw new ArgumentNullException("PercentSymbol",
                Environment.GetResourceString("ArgumentNull_String"));
        }
        this.VerifyWritable();
        this.percentSymbol = value;
    }


    public get PerMilleSymbol(): string {
        return this.perMilleSymbol;
    }
    public set PerMilleSymbol(value: string) {
        if (value == null) {
            throw new ArgumentNullException("PerMilleSymbol",
                Environment.GetResourceString("ArgumentNull_String"));
        }
        this.VerifyWritable();
        this.perMilleSymbol = value;
    }


    public get NativeDigits(): string[] {
        return [...this.nativeDigits];
    }
    public set NativeDigits(value: string[]) {
        this.VerifyWritable();
        NumberFormatInfo.VerifyNativeDigits(value, "NativeDigits");
        this.nativeDigits = value;
    }


    public GetFormat(formatType: Type): any {
        return formatType == typeOf(NumberFormatInfo) ? this : null;
    }

    public static ReadOnly(nfi: NumberFormatInfo): NumberFormatInfo {
        if (nfi == null) {
            throw new ArgumentNullException("nfi");
        }

        if (nfi.IsReadOnly) {
            return (nfi);
        }
        const info: NumberFormatInfo = nfi.MemberwiseClone();
        info.isReadOnly = true;
        return info;
    }

    // private const NumberStyles InvalidNumberStyles = unchecked((NumberStyles) 0xFFFFFC00);
    private static readonly InvalidNumberStyles: NumberStyles = ~(NumberStyles.AllowLeadingWhite | NumberStyles.AllowTrailingWhite
        | NumberStyles.AllowLeadingSign | NumberStyles.AllowTrailingSign
        | NumberStyles.AllowParentheses | NumberStyles.AllowDecimalPoint
        | NumberStyles.AllowThousands | NumberStyles.AllowExponent
        | NumberStyles.AllowCurrencySymbol | NumberStyles.AllowHexSpecifier);

    public /* internal */ static ValidateParseStyleInteger(style: NumberStyles): void {
        // Check for undefined flags
        if ((style & NumberFormatInfo.InvalidNumberStyles) !== 0) {
            throw new ArgumentException(Environment.GetResourceString("Argument_InvalidNumberStyles"), "style");
        }
        if ((style & NumberStyles.AllowHexSpecifier) !== 0) { // Check for hex number
            if ((style & ~NumberStyles.HexNumber) !== 0) {
                throw new ArgumentException(Environment.GetResourceString("Arg_InvalidHexStyle"));
            }
        }
    }

    public /* internal */ static ValidateParseStyleFloatingPoint(style: NumberStyles): void {
        // Check for undefined flags
        if ((style & NumberFormatInfo.InvalidNumberStyles) !== 0) {
            throw new ArgumentException(Environment.GetResourceString("Argument_InvalidNumberStyles"), "style");
        }
        if ((style & NumberStyles.AllowHexSpecifier) !== 0) { // Check for hex number
            throw new ArgumentException(Environment.GetResourceString("Arg_HexStyleNotSupported"));
        }
    }
} // NumberFormatInfo