import { ArgumentNullException } from '../Exceptions/ArgumentNullException';
import { ArgumentOutOfRangeException } from '../Exceptions/ArgumentOutOfRangeException';
import { NotImplementedException } from '../Exceptions/NotImplementedException';
import { char, int } from '../float';
import { is } from '../is';
import { Assembly } from '../Reflection/Assembly';
import { Override } from '../Reflection/Decorators/ClassInfo';
import { TString } from '../Text/TString';
import { CultureInfo } from './CultureInfo';

export enum CompareOptions {
    None = 0x00000000,
    IgnoreCase = 0x00000001,
    IgnoreNonSpace = 0x00000002,
    IgnoreSymbols = 0x00000004,
    IgnoreKanaType = 0x00000008,   // ignore kanatype
    IgnoreWidth = 0x00000010,   // ignore width
    OrdinalIgnoreCase = 0x10000000,   // This flag can not be used with other flags.
    StringSort = 0x20000000,   // use string sort method
    Ordinal = 0x40000000,   // This flag can not be used with other flags.

    // StopOnNull      = 0x10000000,

    // StopOnNull is defined in SortingTable.h, but we didn't enable this option here.
    // Do not use this value for other flags accidentally.
}

export class CompareInfo {
    // Mask used to check if IndexOf()/LastIndexOf()/IsPrefix()/IsPostfix() has the right flags.
    private static readonly ValidIndexMaskOffFlags: CompareOptions =
        ~(CompareOptions.IgnoreCase | CompareOptions.IgnoreSymbols | CompareOptions.IgnoreNonSpace |
            CompareOptions.IgnoreWidth | CompareOptions.IgnoreKanaType);

    // Mask used to check if Compare() has the right flags.
    private static readonly ValidCompareMaskOffFlags: CompareOptions =
        ~(CompareOptions.IgnoreCase | CompareOptions.IgnoreSymbols | CompareOptions.IgnoreNonSpace |
            CompareOptions.IgnoreWidth | CompareOptions.IgnoreKanaType | CompareOptions.StringSort);

    // Mask used to check if GetHashCodeOfString() has the right flags.
    private static readonly ValidHashCodeOfStringMaskOffFlags: CompareOptions =
        ~(CompareOptions.IgnoreCase | CompareOptions.IgnoreSymbols | CompareOptions.IgnoreNonSpace |
            CompareOptions.IgnoreWidth | CompareOptions.IgnoreKanaType);

    //
    // CompareInfos have an interesting identity.  They are attached to the locale that created them,
    // ie: en-US would have an en-US sort.  For haw-US (custom), then we serialize it as haw-US.
    // The interesting part is that since haw-US doesn't have its own sort, it has to point at another
    // locale, which is what SCOMPAREINFO does.
    private m_name: string;  // The name used to construct this CompareInfo

    private m_sortName: string; // The name that defines our behavior

    ////////////////////////////////////////////////////////////////////////
    //
    //  CompareInfo Constructor
    //
    //
    ////////////////////////////////////////////////////////////////////////
    // Constructs an instance that most closely corresponds to the NLS locale
    // identifier.
    public /* internal */ constructor(culture: CultureInfo) {
        this.m_name = culture.m_name;
        this.m_sortName = culture.SortName;
    }

    /*=================================GetCompareInfo==========================
    **Action: Get the CompareInfo constructed from the data table in the specified assembly for the specified culture.
    **       Warning: The assembly versioning mechanism is dead!
    **Returns: The CompareInfo for the specified culture.
    **Arguments:
    **   culture     the ID of the culture
    **   assembly   the assembly which contains the sorting table.
    **Exceptions:
    **  ArugmentNullException when the assembly is null
    **  ArgumentException if culture is invalid.
    ============================================================================*/
    //
    public static CurrentCompareInfo:CompareInfo;
    public static GetCompareInfo(name: string): CompareInfo;
    public static GetCompareInfo(culture: int): CompareInfo;
    public static GetCompareInfo(name: string, assembly: Assembly): CompareInfo;
    public static GetCompareInfo(culture: int, assembly: Assembly): CompareInfo;
    public static GetCompareInfo(...args: any[]): CompareInfo {
        if (!CompareInfo.CurrentCompareInfo) {
           CompareInfo.CurrentCompareInfo = new CompareInfo(CultureInfo.InvariantCulture);
        }
        return CompareInfo.CurrentCompareInfo;
        //throw new NotImplementedException('');
    }



    public static IsSortable(text: string): boolean;
    public static IsSortable(ch: char): boolean;
    public static IsSortable(...args: any[]): boolean {
        throw new NotImplementedException('');
    }

    private win32LCID: int = 0;             // mapped sort culture id of this instance
    private culture: int = 0;               // the culture ID used to create this instance.



    ///////////////////////////----- Name -----/////////////////////////////////
    //
    //  Returns the name of the culture (well actually, of the sort).
    //  Very important for providing a non-LCID way of identifying
    //  what the sort is.
    //
    //  Note that this name isn't dereferenced in case the CompareInfo is a different locale
    //  which is consistent with the behaviors of earlier versions.  (so if you ask for a sort
    //  and the locale's changed behavior, then you'll get changed behavior, which is like
    //  what happens for a version update)
    //
    ////////////////////////////////////////////////////////////////////////

    public get Name(): string {
        // Contract.Assert(m_name != null, "CompareInfo.Name Expected m_name to be set");
        if (this.m_name === "zh-CHT" || this.m_name === "zh-CHS") {
            return this.m_name;
        }

        return (this.m_sortName);
    }

    // These flags are used in the native Win32. so we need to map the managed options to those flags
    private static readonly LINGUISTIC_IGNORECASE: int = 0x00000010;       // linguistically appropriate 'ignore case'
    private static readonly NORM_IGNORECASE: int = 0x00000001;       // Ignores case.  (use LINGUISTIC_IGNORECASE instead)
    private static readonly NORM_IGNOREKANATYPE: int = 0x00010000;       // Does not differentiate between Hiragana and Katakana characters. Corresponding Hiragana and Katakana will compare as equal.
    private static readonly LINGUISTIC_IGNOREDIACRITIC: int = 0x00000020;       // linguistically appropriate 'ignore nonspace'
    private static readonly NORM_IGNORENONSPACE: int = 0x00000002;       // Ignores nonspacing. This flag also removes Japanese accent characters.  (use LINGUISTIC_IGNOREDIACRITIC instead)
    private static readonly NORM_IGNORESYMBOLS: int = 0x00000004;       // Ignores symbols.
    private static readonly NORM_IGNOREWIDTH: int = 0x00020000;       // Does not differentiate between a single-byte character and the same character as a double-byte character.
    private static readonly SORT_STRINGSORT: int = 0x00001000;       // Treats punctuation the same as symbols.
    private static readonly COMPARE_OPTIONS_ORDINAL: int = 0x40000000;       // Ordinal (handled by Comnlsinfo)
    public /* internal */ static readonly NORM_LINGUISTIC_CASING: int = 0x08000000;       // use linguistic rules for casing


    private static readonly RESERVED_FIND_ASCII_STRING: int = 0x20000000;       // This flag used only to tell the sorting DLL can assume the string characters are in ASCII.

    public/* internal */ static GetNativeCompareFlags(options: CompareOptions): int {
        // some NLS VM functions can handle COMPARE_OPTIONS_ORDINAL
        // in which case options should be simply cast to int instead of using this function
        // Does not look like the best approach to me but for now I am going to leave it as it is
        //
        //Contract.Assert(options != CompareOptions.OrdinalIgnoreCase, "[CompareInfo.GetNativeCompareFlags]CompareOptions.OrdinalIgnoreCase should be handled separately");

        // Use "linguistic casing" by default (load the culture's casing exception tables)
        let nativeCompareFlags: int = CompareInfo.NORM_LINGUISTIC_CASING;

        if ((options & CompareOptions.IgnoreCase) !== 0) { nativeCompareFlags |= CompareInfo.NORM_IGNORECASE; }
        if ((options & CompareOptions.IgnoreKanaType) !== 0) { nativeCompareFlags |= CompareInfo.NORM_IGNOREKANATYPE; }
        if ((options & CompareOptions.IgnoreNonSpace) !== 0) { nativeCompareFlags |= CompareInfo.NORM_IGNORENONSPACE; }
        if ((options & CompareOptions.IgnoreSymbols) !== 0) { nativeCompareFlags |= CompareInfo.NORM_IGNORESYMBOLS; }
        if ((options & CompareOptions.IgnoreWidth) !== 0) { nativeCompareFlags |= CompareInfo.NORM_IGNOREWIDTH; }
        if ((options & CompareOptions.StringSort) !== 0) { nativeCompareFlags |= CompareInfo.SORT_STRINGSORT; }

        // Suffix & Prefix shouldn't use this, make sure to turn off the NORM_LINGUISTIC_CASING flag
        if (options === CompareOptions.Ordinal) { nativeCompareFlags = CompareInfo.COMPARE_OPTIONS_ORDINAL; }

        /*  Contract.Assert(((options & ~(CompareOptions.IgnoreCase |
             CompareOptions.IgnoreKanaType |
             CompareOptions.IgnoreNonSpace |
             CompareOptions.IgnoreSymbols |
             CompareOptions.IgnoreWidth |
             CompareOptions.StringSort)) == 0) ||
             (options == CompareOptions.Ordinal), "[CompareInfo.GetNativeCompareFlags]Expected all flags to be handled");

         Contract.Assert((nativeCompareFlags & RESERVED_FIND_ASCII_STRING) == 0, "[CompareInfo.GetNativeCompareFlags] RESERVED_FIND_ASCII_STRING shouldn't be set here");
  */
        return nativeCompareFlags;
    }


    ////////////////////////////////////////////////////////////////////////
    //
    //  Compare
    //
    //  Compares the two strings with the given options.  Returns 0 if the
    //  two strings are equal, a number less than 0 if string1 is less
    //  than string2, and a number greater than 0 if string1 is greater
    //  than string2.
    //
    ////////////////////////////////////////////////////////////////////////


    public Compare(string1: string, string2: string): int;
    public Compare(string1: string, string2: string, options: CompareOptions): int;
    public Compare(string1: string, offset1: int, length1: int, string2: string, offset2: int, length2: int): int;
    public Compare(string1: String, offset1: int, string2: String, offset2: int, options: CompareOptions): int;
    public Compare(string1: string, offset1: int, string2: string, offset2: int): int;
    public Compare(string1: string, offset1: int, length1: int, string2: string, offset2: int, length2: int, options: CompareOptions): int;
    public Compare(...args: any[]): int {
        if (args.length === 2 && is.string(args[0]) && is.string(args[1])) {
            const string1 = args[0];
            const string2 = args[1];
            return string1.localeCompare(string2);
        } else if (args.length === 3 && is.string(args[0]) && is.string(args[1]) && is.int(args[2])) {
            const string1 = args[0];
            const string2 = args[1];
            return string1.localeCompare(string2);
        } else if (args.length === 6 && is.string(args[0]) && is.int(args[1]) && is.int(args[2]) && is.string(args[3]) && is.int(args[4]) && is.int(args[5])) {
            const string1: string = args[0];
            const offset1: int = args[1];
            const length1: int = args[2];
            const string2: string = args[3];
            const offset2: int = args[4];
            const length2: int = args[5];
            return string1.substr(offset1, length1).localeCompare(string2.substr(offset2, length2));
        } else if (args.length === 7 && is.string(args[0]) && is.int(args[1]) && is.int(args[2]) && is.string(args[3]) && is.int(args[4]) && is.int(args[5])) {
            const string1: string = args[0];
            const offset1: int = args[1];
            const length1: int = args[2];
            const string2: string = args[3];
            const offset2: int = args[4];
            const length2: int = args[5];
            return string1.substr(offset1, length1).localeCompare(string2.substr(offset2, length2));
        }
        throw new ArgumentOutOfRangeException('');
    }

    private static CompareOrdinal(string1: string, offset1: int, length1: int, string2: string, offset2: int, length2: int): int {
        throw new NotImplementedException('');
    }

    ////////////////////////////////////////////////////////////////////////
    //
    //  IsPrefix
    //
    //  Determines whether prefix is a prefix of string.  If prefix equals
    //  String.Empty, true is returned.
    //
    ////////////////////////////////////////////////////////////////////////

    public IsPrefix(source: string, prefix: string): boolean;
    public IsPrefix(source: string, prefix: string, options: CompareOptions): boolean;
    public IsPrefix(...args: any[]): boolean {
        throw new NotImplementedException('');
    }


    ////////////////////////////////////////////////////////////////////////
    //
    //  IsSuffix
    //
    //  Determines whether suffix is a suffix of string.  If suffix equals
    //  String.Empty, true is returned.
    //
    ////////////////////////////////////////////////////////////////////////

    public IsSuffix(source: string, suffix: string): boolean;
    public IsSuffix(source: string, suffix: string, options: CompareOptions): boolean;
    public IsSuffix(...args: any[]): boolean {
        throw new NotImplementedException('');
    }

    ////////////////////////////////////////////////////////////////////////
    //
    //  IndexOf
    //
    //  Returns the first index where value is found in string.  The
    //  search starts from startIndex and ends at endIndex.  Returns -1 if
    //  the specified value is not found.  If value equals String.Empty,
    //  startIndex is returned.  Throws IndexOutOfRange if startIndex or
    //  endIndex is less than zero or greater than the length of string.
    //  Throws ArgumentException if value is null.
    //
    ////////////////////////////////////////////////////////////////////////


    public IndexOf(source: string, value: char): int;
    public IndexOf(source: string, value: string): int;
    public IndexOf(source: string, value: char, options: CompareOptions): int;
    public IndexOf(source: string, value: string, options: CompareOptions): int;
    public IndexOf(source: string, value: char, startIndex: int): int;
    public IndexOf(source: string, value: string, startIndex: int): int;
    public IndexOf(source: string, value: char, startIndex: int, options: CompareOptions): int;
    public IndexOf(source: string, value: string, startIndex: int, options: CompareOptions): int;
    public IndexOf(source: string, value: char, startIndex: int, count: int): int;
    public IndexOf(source: string, value: string, startIndex: int, count: int): int;
    public IndexOf(source: string, value: char, startIndex: int, count: int, options: CompareOptions): int;
    public IndexOf(source: string, value: string, startIndex: int, count: int, options: CompareOptions): int;
    public IndexOf(...args: any[]): int {
        throw new NotImplementedException('');
    }




    ////////////////////////////////////////////////////////////////////////
    //
    //  LastIndexOf
    //
    //  Returns the last index where value is found in string.  The
    //  search starts from startIndex and ends at endIndex.  Returns -1 if
    //  the specified value is not found.  If value equals String.Empty,
    //  endIndex is returned.  Throws IndexOutOfRange if startIndex or
    //  endIndex is less than zero or greater than the length of string.
    //  Throws ArgumentException if value is null.
    //
    ////////////////////////////////////////////////////////////////////////


    public LastIndexOf(source: string, value: char): int;
    public LastIndexOf(source: string, value: string): int;
    public LastIndexOf(source: string, value: char, options: CompareOptions): int;
    public LastIndexOf(source: string, value: string, options: CompareOptions): int;
    public LastIndexOf(source: string, value: char, startIndex: int): int;
    public LastIndexOf(source: string, value: string, startIndex: int): int;
    public LastIndexOf(source: int, value: char, startIndex: int, options: CompareOptions): int;
    public LastIndexOf(source: string, value: string, startIndex: int, options: CompareOptions): int;
    public LastIndexOf(source: string, value: char, startIndex: int, count: int): int;
    public LastIndexOf(source: string, value: string, startIndex: int, count: int): int;
    public LastIndexOf(source: string, value: char, startIndex: int, count: int, options: CompareOptions): int;
    public LastIndexOf(source: string, value: string, startIndex: int, count: int, options: CompareOptions): int;
    public LastIndexOf(...args: any[]): int {
        throw new NotImplementedException('');
    }



    ////////////////////////////////////////////////////////////////////////
    //
    //  Equals
    //
    //  Implements Object.Equals().  Returns a boolean indicating whether
    //  or not object refers to the same CompareInfo as the current
    //  instance.
    //
    ////////////////////////////////////////////////////////////////////////


    @Override
    public Equals(value: CompareInfo): boolean {
        const that: CompareInfo = value as CompareInfo;

        if (that != null) {
            return this.Name == that.Name;
        }

        return false;
    }


    ////////////////////////////////////////////////////////////////////////
    //
    //  GetHashCode
    //
    //  Implements Object.GetHashCode().  Returns the hash code for the
    //  CompareInfo.  The hash code is guaranteed to be the same for
    //  CompareInfo A and B where A.Equals(B) is true.
    //
    ////////////////////////////////////////////////////////////////////////


    public GetHashCode(): int;
    public GetHashCode(source: string, options: CompareOptions): int;
    public GetHashCode(...args: any[]): int {
        if (args.length === 0) {
            return TString.GetHashCode(this.Name);
        } else if (args.length === 2) {
            const source: string = args[0];
            const options: CompareOptions = args[1];
            if (source == null) {
                throw new ArgumentNullException("source");
            }

            if (options === CompareOptions.Ordinal) {
                return TString.GetHashCode(source);
            }

            if (options == CompareOptions.OrdinalIgnoreCase) {
                throw new NotImplementedException('');
            }

            //
            // GetHashCodeOfString does more parameters validation. basically will throw when
            // having Ordinal, OrdinalIgnoreCase and StringSort
            //

            return this.GetHashCodeOfString(source, options, false, 0);
        }
        throw new ArgumentOutOfRangeException('');
    }


    ////////////////////////////////////////////////////////////////////////
    //
    //  GetHashCodeOfString
    //
    //  This internal method allows a method that allows the equivalent of creating a Sortkey for a
    //  string from CompareInfo, and generate a hashcode value from it.  It is not very convenient
    //  to use this method as is and it creates an unnecessary Sortkey object that will be GC'ed.
    //
    //  The hash code is guaranteed to be the same for string A and B where A.Equals(B) is true and both
    //  the CompareInfo and the CompareOptions are the same. If two different CompareInfo objects
    //  treat the string the same way, this implementation will treat them differently (the same way that
    //  Sortkey does at the moment).
    //
    //  This method will never be made public itself, but public consumers of it could be created, e.g.:
    //
    //      string.GetHashCode(CultureInfo)
    //      string.GetHashCode(CompareInfo)
    //      string.GetHashCode(CultureInfo, CompareOptions)
    //      string.GetHashCode(CompareInfo, CompareOptions)
    //      etc.
    //
    //  (the methods above that take a CultureInfo would use CultureInfo.CompareInfo)
    //
    ////////////////////////////////////////////////////////////////////////
    public /* internal */  GetHashCodeOfString(source: string, options: CompareOptions): int;
    public GetHashCodeOfString(source: string, options: CompareOptions, forceRandomizedHashing: boolean, additionalEntropy: number): int;
    public /* internal */  GetHashCodeOfString(...args: any[]): int {
        throw new NotImplementedException('');
    }




    ////////////////////////////////////////////////////////////////////////
    //
    //  ToString
    //
    //  Implements Object.ToString().  Returns a string describing the
    //  CompareInfo.
    //
    ////////////////////////////////////////////////////////////////////////


    @Override
    public ToString(): string {
        return ("CompareInfo - " + this.Name);
    }


    public get LCID(): int {
        return CultureInfo.GetCultureInfo(this.Name).LCID;
    }


    /*
        internal static IntPtr InternalInitSortHandle(String localeName, out IntPtr handleOrigin) {
            return NativeInternalInitSortHandle(localeName, out handleOrigin);
        } */


    private m_SortVersion: number = 0;

    public get Version(): number {
        return this.m_SortVersion;
    }
}