import { Convert } from "../convert";
import { Environment } from "../Environment";
import { ArgumentOutOfRangeException, NotImplementedException } from "../Exceptions";
import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { InvalidOperationException } from "../Exceptions/InvalidOperationException";
import { TObject, TString } from "../Extensions";
import { long, int, New, char } from "../float";
import { ICloneable } from "../ICloneable"
import { is } from "../is";
import { IntPtr } from "../Marshal/IntPtr";
import { Out } from "../Out";
import { Override, Virtual } from "../Reflection/Decorators/ClassInfo";
import { CompareOptions } from "./CompareInfo";
import { CultureData, CultureInfo } from "./CultureInfo";

enum Tristate {
    NotInitialized,
    True,
    False,
}

export class TextInfo extends TObject implements ICloneable<TextInfo>
{
    protected dispose(disposing: boolean): void {
        throw new Error("Method not implemented.");
    }

    //
    //  Variables.
    //

    private m_listSeparator: string = '';
    private m_isReadOnly: boolean = false;

    //
    // In Whidbey we had several names:
    //      m_win32LangID is the name of the culture, but only used for (de)serialization.
    //      customCultureName is the name of the creating custom culture (if custom)  In combination with m_win32LangID
    //              this is authoratative, ie when deserializing.
    //      m_cultureTableRecord was the data record of the creating culture.  (could have different name if custom)
    //      m_textInfoID is the LCID of the textinfo itself (no longer used)
    //      m_name is the culture name (from cultureinfo.name)
    //
    // In Silverlight/Arrowhead this is slightly different:
    //      m_cultureName is the name of the creating culture.  Note that we consider this authoratative,
    //              if the culture's textinfo changes when deserializing, then behavior may change.
    //              (ala Whidbey behavior).  This is the only string Arrowhead needs to serialize.
    //      m_cultureData is the data that backs this class.
    //      m_textInfoName  is the actual name of the textInfo (from cultureData.STEXTINFO)
    //              m_textInfoName can be the same as m_cultureName on Silverlight since the OS knows
    //              how to do the sorting. However in the desktop, when we call the sorting dll, it doesn't
    //              know how to resolve custom locle names to sort ids so we have to have alredy resolved this.
    //

    private m_cultureName: string = '';      // Name of the culture that created this text info
    private m_cultureData: CultureData;      // Data record for the culture that made us, not for this textinfo
    private m_textInfoName: string = '';     // Name of the text info we're using (ie: m_cultureData.STEXTINFO)
    private m_dataHandle: IntPtr = null as any;       // Sort handle
    private m_handleOrigin: IntPtr = null as any;
    private m_IsAsciiCasingSameAsInvariant: Tristate = Tristate.NotInitialized;

    public static s_Invariant: TextInfo;
    // Invariant text info
    public static get Invariant(): TextInfo {
        if (TextInfo.s_Invariant == null)
            TextInfo.s_Invariant = new TextInfo(CultureData.Invariant);
        return TextInfo.s_Invariant;
    }


    ////////////////////////////////////////////////////////////////////////
    //
    //  TextInfo Constructors
    //
    //  Implements CultureInfo.TextInfo.
    //
    ////////////////////////////////////////////////////////////////////////
    public constructor(cultureData: CultureData) {
        super();
        // This is our primary data source, we don't need most of the rest of this
        this.m_cultureData = cultureData;
        this.m_cultureName = this.m_cultureData.CultureName;
        this.m_textInfoName = this.m_cultureData.STEXTINFO;
    }


    //
    // Internal ordinal comparison functions
    //
    public static GetHashCodeOrdinalIgnoreCase(s: string): int;
    public /* internal */ static GetHashCodeOrdinalIgnoreCase(s: string, forceRandomizedHashing: boolean, additionalEntropy: int): int;
    public static GetHashCodeOrdinalIgnoreCase(...args: any[]): int {
        if (args.length === 1) {
            const s: string = args[0];
            return TextInfo.GetHashCodeOrdinalIgnoreCase(s, false, 0);
        } else if (args.length === 3) {
            const s: string = args[0];
            const forceRandomizedHashing: boolean = args[1];
            const additionalEntropy: int = args[2];
            // This is the same as an case insensitive hash for Invariant
            // (not necessarily true for sorting, but OK for casing & then we apply normal hash code rules)
            return TextInfo.Invariant.GetCaseInsensitiveHashCode(s, forceRandomizedHashing, additionalEntropy);
        }
        throw new ArgumentOutOfRangeException('');

    }


    public /* internal */ static TryFastFindStringOrdinalIgnoreCase(searchFlags: int, source: string, startIndex: int, value: string, count: int, foundIndex: Out<int>): boolean {
        return TextInfo.InternalTryFindStringOrdinalIgnoreCase(searchFlags, source, count, startIndex, value, value.length, foundIndex);
    }

    // This function doesn't check arguments. Please do check in the caller.
    // The underlying unmanaged code will assert the sanity of arguments.
    public /* internal */ static CompareOrdinalIgnoreCase(str1: string, str2: string): int {
        // Compare the whole string and ignore case.
        return TextInfo.InternalCompareStringOrdinalIgnoreCase(str1, 0, str2, 0, str1.length, str2.length);
    }

    // This function doesn't check arguments. Please do check in the caller.
    // The underlying unmanaged code will assert the sanity of arguments.
    public /* internal */ static CompareOrdinalIgnoreCaseEx(strA: string, indexA: int, strB: string, indexB: int, lengthA: int, lengthB: int): int {
        // Contract.Assert(strA.Length >= indexA + lengthA, "[TextInfo.CompareOrdinalIgnoreCaseEx] Caller should've validated strA.Length >= indexA + lengthA");
        // Contract.Assert(strB.Length >= indexB + lengthB, "[TextInfo.CompareOrdinalIgnoreCaseEx]  Caller should've validated strB.Length >= indexB + lengthB");
        return TextInfo.InternalCompareStringOrdinalIgnoreCase(strA, indexA, strB, indexB, lengthA, lengthB);
    }

    public /* internal */ static IndexOfStringOrdinalIgnoreCase(source: string, value: string, startIndex: int, count: int): int {

        // We return 0 if both inputs are empty strings
        if (source.length === 0 && value.length === 0) {
            return 0;
        }

        // fast path
        let ret: Out<int> = New.Out(-1);
        if (TextInfo.TryFastFindStringOrdinalIgnoreCase(0/* FIND_FROMSTART */, source, startIndex, value, count, ret))
            return ret.value;

        // the search space within [source] starts at offset [startIndex] inclusive and includes
        // [count] characters (thus the last included character is at index [startIndex + count -1]
        // [end] is the index of the next character after the search space
        // (it points past the end of the search space)
        const end: int = startIndex + count;

        // maxStartIndex is the index beyond which we never *start* searching, inclusive; in other words;
        // a search could include characters beyond maxStartIndex, but we'd never begin a search at an
        // index strictly greater than maxStartIndex.
        const maxStartIndex: int = end - value.length;

        for (; startIndex <= maxStartIndex; startIndex++) {
            // We should always have the same or more characters left to search than our actual pattern
            //Contract.Assert(end - startIndex >= value.Length);
            // since this is an ordinal comparison, we can assume that the lengths must match
            if (TextInfo.CompareOrdinalIgnoreCaseEx(source, startIndex, value, 0, value.length, value.length) === 0) {
                return startIndex;
            }
        }

        // Not found
        return -1;
    }

    public /* internal */ static LastIndexOfStringOrdinalIgnoreCase(source: string, value: string, startIndex: int, count: int): int {
        //Contract.Assert(source != null, "[TextInfo.LastIndexOfStringOrdinalIgnoreCase] Caller should've validated source != null");
        //Contract.Assert(value != null, "[TextInfo.LastIndexOfStringOrdinalIgnoreCase] Caller should've validated value != null");
        //Contract.Assert(startIndex - count + 1 >= 0, "[TextInfo.LastIndexOfStringOrdinalIgnoreCase] Caller should've validated startIndex - count+1 >= 0");
        //Contract.Assert(startIndex <= source.Length, "[TextInfo.LastIndexOfStringOrdinalIgnoreCase] Caller should've validated startIndex <= source.Length");

        // If value is Empty, the return value is startIndex
        if (value.length === 0) {
            return startIndex;
        }

        // fast path
        const ret: Out<int> = New.Out(-1);
        if (TextInfo.TryFastFindStringOrdinalIgnoreCase(0/* FIND_FROMEND */, source, startIndex, value, count, ret))
            return ret.value;

        // the search space within [source] ends at offset [startIndex] inclusive
        // and includes [count] characters
        // minIndex is the first included character and is at index [startIndex - count + 1]
        const minIndex: int = startIndex - count + 1;

        // First place we can find it is start index - (value.length -1)
        if (value.length > 0) {
            startIndex -= (value.length - 1);
        }

        for (; startIndex >= minIndex; startIndex--) {
            if (TextInfo.CompareOrdinalIgnoreCaseEx(source, startIndex, value, 0, value.length, value.length) == 0) {
                return startIndex;
            }
        }

        // Not found
        return -1;
    }


    ////////////////////////////////////////////////////////////////////////
    //
    //  LCID
    //
    //  We need a way to get an LCID from outside of the BCL. This prop is the way.
    //  NOTE: neutral cultures will cause GPS incorrect LCIDS from this
    //
    ////////////////////////////////////////////////////////////////////////

    public get LCID(): int {
        // Just use the LCID from our text info name
        return CultureInfo.GetCultureInfo(this.m_textInfoName).LCID;
    }
    ////////////////////////////////////////////////////////////////////////
    //
    //  CultureName
    //
    //  The name of the culture associated with the current TextInfo.
    //
    ////////////////////////////////////////////////////////////////////////
    //[System.Runtime.InteropServices.ComVisible(false)]
    public get CultureName(): string {
        return this.m_textInfoName;
    }

    ////////////////////////////////////////////////////////////////////////
    //
    //  IsReadOnly
    //
    //  Detect if the object is readonly.
    //
    ////////////////////////////////////////////////////////////////////////
    public get IsReadOnly(): boolean {
        return this.m_isReadOnly;
    }

    ////////////////////////////////////////////////////////////////////////
    //
    //  Clone
    //
    //  Is the implementation of IColnable.
    //
    ////////////////////////////////////////////////////////////////////////
    @Virtual
    public Clone(): TextInfo {
        const o: TextInfo = this.MemberwiseClone();
        o.SetReadOnlyState(false);
        return o;
    }

    ////////////////////////////////////////////////////////////////////////
    //
    //  ReadOnly
    //
    //  Create a cloned readonly instance or return the input one if it is
    //  readonly.
    //
    ////////////////////////////////////////////////////////////////////////
    public static ReadOnly(textInfo: TextInfo): TextInfo {
        if (textInfo == null) {
            throw new ArgumentNullException("textInfo");
        }
        // Contract.EndContractBlock();
        if (textInfo.IsReadOnly) { return (textInfo); }

        const clonedTextInfo: TextInfo = (textInfo.MemberwiseClone());
        clonedTextInfo.SetReadOnlyState(true);

        return clonedTextInfo;
    }

    private VerifyWritable(): void {
        if (this.m_isReadOnly) {
            throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_ReadOnly"));
        }
        //Contract.EndContractBlock();
    }

    public /* internal */  SetReadOnlyState(readOnly: boolean): void {
        this.m_isReadOnly = readOnly;
    }


    ////////////////////////////////////////////////////////////////////////
    //
    //  ListSeparator
    //
    //  Returns the string used to separate items in a list.
    //
    ////////////////////////////////////////////////////////////////////////

    public get ListSeparator(): string {
        if (this.m_listSeparator == null) {
            this.m_listSeparator = this.m_cultureData.SLIST;
        }
        return (this.m_listSeparator);
    }

    public set ListSeparator(value: string) {
        if (value == null) {
            throw new ArgumentNullException("value", Environment.GetResourceString("ArgumentNull_String"));
        }
        //Contract.EndContractBlock();
        this.VerifyWritable();
        this.m_listSeparator = value;
    }


    ////////////////////////////////////////////////////////////////////////
    //
    //  ToLower
    //
    //  Converts the character or string to lower case.  Certain locales
    //  have different casing semantics from the file systems in Win32.
    //
    ////////////////////////////////////////////////////////////////////////

    public ToLower(c: char): char;
    public ToLower(str: string): string;
    public ToLower(...args: any[]): string | char {
        if (args.length === 1 && is.char(args[0])) {
            const c: char = args[0];
            if (TextInfo.IsAscii(c) && this.IsAsciiCasingSameAsInvariant) {
                return TextInfo.ToLowerAsciiInvariant(c);
            }
            return TextInfo.InternalChangeCaseChar(this.m_dataHandle, this.m_handleOrigin, this.m_textInfoName, c, false);
        } else if (args.length === 1 && is.string(args[0])) {
            const str: string = args[0];
            if (str == null) {
                throw new ArgumentNullException("str");
            }

            return TextInfo.InternalChangeCaseString(this.m_dataHandle, this.m_handleOrigin, this.m_textInfoName, str, false);
        }
        throw new ArgumentOutOfRangeException('');
    }

    private static ToLowerAsciiInvariant(c: char): char {
        if ('A'.charCodeAt(0) <= c && c <= 'Z'.charCodeAt(0)) {
            c = Convert.ToChar(c | 0x20);
        }
        return c;
    }

    ////////////////////////////////////////////////////////////////////////
    //
    //  ToUpper
    //
    //  Converts the character or string to upper case.  Certain locales
    //  have different casing semantics from the file systems in Win32.
    //
    ////////////////////////////////////////////////////////////////////////
    public ToUpper(c: char): char;
    public ToUpper(str: string): string;
    public ToUpper(...args: any[]): string | char {
        if (args.length === 1 && is.char(args[0])) {
            const c: char = args[0];
            if (TextInfo.IsAscii(c) && this.IsAsciiCasingSameAsInvariant) {
                return TextInfo.ToUpperAsciiInvariant(c);
            }
            return (TextInfo.InternalChangeCaseChar(this.m_dataHandle, this.m_handleOrigin, this.m_textInfoName, c, true));
        } else if (args.length === 1 && is.string(args[0])) {
            const str: string = args[0];
            if (str == null) { throw new ArgumentNullException("str"); }
            return TextInfo.InternalChangeCaseString(this.m_dataHandle, this.m_handleOrigin, this.m_textInfoName, str, true);
        }
        throw new ArgumentOutOfRangeException('')
    }


    private static ToUpperAsciiInvariant(c: char): char {
        if ('a'.charCodeAt(0) <= c && c <= 'z'.charCodeAt(0)) {
            c = Convert.ToChar(c & ~0x20);
        }
        return c;
    }

    private static IsAscii(c: char): boolean {
        return c < 0x80;
    }

    private get IsAsciiCasingSameAsInvariant(): boolean {
        if (this.m_IsAsciiCasingSameAsInvariant === Tristate.NotInitialized) {
            this.m_IsAsciiCasingSameAsInvariant = CultureInfo.GetCultureInfo(this.m_textInfoName).CompareInfo.Compare("abcdefghijklmnopqrstuvwxyz",
                "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                CompareOptions.IgnoreCase) === 0 ? Tristate.True : Tristate.False;
        }
        return this.m_IsAsciiCasingSameAsInvariant == Tristate.True;
    }

    ////////////////////////////////////////////////////////////////////////
    //
    //  Equals
    //
    //  Implements Object.Equals().  Returns a boolean indicating whether
    //  or not object refers to the same CultureInfo as the current instance.
    //
    ////////////////////////////////////////////////////////////////////////


    @Override
    public Equals<TextInfo>(that: TextInfo): boolean {

        if (that != null) {
            return TString.Equals(this.CultureName, (that as any).CultureName);
        }

        return false;
    }


    ////////////////////////////////////////////////////////////////////////
    //
    //  GetHashCode
    //
    //  Implements Object.GetHashCode().  Returns the hash code for the
    //  CultureInfo.  The hash code is guaranteed to be the same for CultureInfo A
    //  and B where A.Equals(B) is true.
    //
    ////////////////////////////////////////////////////////////////////////


    @Override
    public GetHashCode(): int {
        return TString.GetHashCode(this.CultureName);
    }


    ////////////////////////////////////////////////////////////////////////
    //
    //  ToString
    //
    //  Implements Object.ToString().  Returns a string describing the
    //  TextInfo.
    //
    ////////////////////////////////////////////////////////////////////////

    @Override
    public ToString(): string {
        return "TextInfo - " + this.m_cultureData.CultureName;
    }


    //
    // Titlecasing:
    // -----------
    // Titlecasing refers to a casing practice wherein the first letter of a word is an uppercase letter
    // and the rest of the letters are lowercase.  The choice of which words to titlecase in headings
    // and titles is dependent on language and local conventions.  For example, "The Merry Wives of Windor"
    // is the appropriate titlecasing of that play's name in English, with the word "of" not titlecased.
    // In German, however, the title is "Die lustigen Weiber von Windsor," and both "lustigen" and "von"
    // are not titlecased.  In French even fewer words are titlecased: "Les joyeuses commeres de Windsor."
    //
    // Moreover, the determination of what actually constitutes a word is language dependent, and this can
    // influence which letter or letters of a "word" are uppercased when titlecasing strings.  For example
    // "l'arbre" is considered two words in French, whereas "can't" is considered one word in English.
    //
    //
    // Differences between UNICODE 5.0 and the .NET Framework (









    // IsRightToLeft
    //
    // Returns true if the dominant direction of text and UI such as the relative position of buttons and scroll bars
    //
    public get IsRightToLeft(): boolean {
        return this.m_cultureData.IsRightToLeft;
    }



    //
    // Get case-insensitive hash code for the specified string.
    //
    // NOTENOTE: this is an internal function.  The caller should verify the string
    // is not null before calling this.  Currenlty, CaseInsensitiveHashCodeProvider
    // does that.
    //
    public /* internal */   GetCaseInsensitiveHashCode(str: string): int;
    public /* internal */   GetCaseInsensitiveHashCode(str: string, forceRandomizedHashing: boolean, additionalEntropy: int): int;
    public /* internal */   GetCaseInsensitiveHashCode(...args: any[]): int {
        if (args.length === 1 && is.string(args[0])) {
            const str: string = args[0];
            return this.GetCaseInsensitiveHashCode(str, false, 0);
        } else if (args.length === 3) {
            const str: string = args[0];
            const forceRandomizedHashing: boolean = args[1];
            const additionalEntropy: long = args[2];
            // Validate inputs
            if (str == null) {
                throw new ArgumentNullException("str");
            }
            // Contract.EndContractBlock();

            // Return our result
            return TextInfo.InternalGetCaseInsHash(this.m_dataHandle, this.m_handleOrigin, this.m_textInfoName, str, forceRandomizedHashing, additionalEntropy);
        }
        throw new ArgumentOutOfRangeException('');
    }



    private static InternalChangeCaseChar(handle: IntPtr, handleOrigin: IntPtr, localeName: string, ch: char, isToUpper: boolean): char {
        throw new NotImplementedException('');
    }

    private static InternalChangeCaseString(handle: IntPtr, handleOrigin: IntPtr, localeName: string, str: string, isToUpper: boolean): string {
        throw new NotImplementedException('');
    }

    private static InternalGetCaseInsHash(handle: IntPtr, handleOrigin: IntPtr, localeName: string, str: string, forceRandomizedHashing: boolean, additionalEntropy: long): int {
        throw new NotImplementedException('');
    }

    private static InternalCompareStringOrdinalIgnoreCase(string1: string, index1: int, string2: string, index2: int, length1: int, length2: int): int {
        throw new NotImplementedException('');
    }

    private static InternalTryFindStringOrdinalIgnoreCase(searchFlags: int, source: string, sourceCount: int, startIndex: int, target: string, targetCount: int, foundIndex: Out<int>): boolean {
        throw new NotImplementedException('');
    }
}