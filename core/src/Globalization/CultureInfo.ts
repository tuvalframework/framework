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
* Created By Selim TAN in 2021                                                                                                  *
******************************************************************************************************************************@*/


import { Hashtable } from "../Collections/Hashtable";
import { Exception } from '../Exception';
import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { InvalidOperationException } from "../Exceptions/InvalidOperationException";
import { TChar } from "../Extensions/TChar";
import { ICloneable } from "../ICloneable";
import { IFormatProvider } from "../IFormatProvider";
import { Override, type, Virtual, ClassInfo } from '../Reflection/Decorators/ClassInfo';
import { Type } from "../Reflection/Type";
import { System } from "../SystemTypes";
//import { TimeZoneInfo } from "../TimeZoneInfo";

//import { ChineseLunisolarCalendar } from "./ChineseLunisolarCalendar";
import { CompareInfo } from "./CompareInfo";
//import { GregorianCalendar } from "./GregorianCalendar";
//import { HebrewCalendar } from "./HebrewCalendar";
//import { HijriCalendar } from "./HijriCalendar";
//import { JapaneseCalendar } from "./JapaneseCalendar";
//import { JapaneseLunisolarCalendar } from "./JapaneseLunisolarCalendar";
//import { KoreanCalendar } from "./KoreanCalendar";
//import { KoreanLunisolarCalendar } from "./KoreanLunisolarCalendar";
//import { PersianCalendar } from "./PersianCalendar";
import { RegionInfo } from "./RegionInfo";
//import { TaiwanCalendar } from "./TaiwanCalendar";
//import { TaiwanLunisolarCalendar } from "./TaiwanLunisolarCalendar";
import { TextInfo } from "./TextInfo";
//import { ThaiBuddhistCalendar } from "./ThaiBuddhistCalendar";
//import { UmAlQuraCalendar } from "./UmAlQuraCalendar";
import { Dictionary } from "../Collections/Generic/Dictionary";
import { ArgumentOutOfRangeException, NotImplementedException } from "../Exceptions";
import { TObject } from "../Extensions";
import { char, int, IntArray, New, uint } from '../float';
import { TString } from '../Text/TString';
import { Out } from '../Out';
import { StringComparison } from "../Text/StringComparison";
import { CultureTypes } from "./CultureTypes";
import { StringBuilder } from "../Text/StringBuilder";
import { CalendarData } from "./CalendarData";
import { NumberFormatInfo } from "./NumberFormatInfo";
import { is } from "../is";
import { ArgumentException } from '../Exceptions/ArgumentException';
import { Environment } from "../Environment";
import { Calendar } from "./Calendar";
import { TArray } from "../Extensions/TArray";
import { CultureNotFoundException } from "./Exceptions/CultureNotFoundException";

import { DayOfWeek } from '../Time/DayOfWeek';
import { CalendarWeekRule } from './CalendarWeekRule';
import { DateTimeFormatFlags } from './DateTimeFormatFlags';
import { DateTimeFormat } from './DateTimeFormat';
//import {  DateTimeParse,  TokenType, __DTString } from './Datetimeparse';
import { List } from '../Collections/Generic/List';
import { DateTimeFormatInfoScanner } from './DateTimeFormatInfoScanner';
import { MonthNameStyles } from './MonthNameStyles';
import { HebrewNumber, HebrewNumberParsingContext, HebrewNumberParsingState } from './HebrewNumber';
import { CompareOptions } from './CompareInfo';
import { DateTimeStyles } from '../Time/DateTimeStyles';
import { TokenType } from "./TokenType";
import { Cultures } from './Cultures/Cultures';
import { Console } from "../Console";
import { NativeCultures } from "./Cultures/NativeCultures";
import { Context } from "../Context/Context";
import { EventBus } from '../Events/EventBus';

const CompatibilitySwitches = {
    IsAppEarlierThanWindowsPhone8: false,
    IsCompatibilityBehaviorDefined: false
};

type __DTString = any;

@ClassInfo({
    fullName: System.Types.Globalization.CultureInfo,
    instanceof: [
        System.Types.Globalization.CultureInfo,
        System.Types.IFormatProvider
    ]
})
export class CultureInfo extends TObject implements ICloneable<CultureInfo>, IFormatProvider {
    protected dispose(disposing: boolean): void {
        throw new Error("Method not implemented.");
    }

    //--------------------------------------------------------------------//
    //                        Internal Information                        //
    //--------------------------------------------------------------------//

    //--------------------------------------------------------------------//
    // Data members to be serialized:
    //--------------------------------------------------------------------//

    // We use an RFC4646 type string to construct CultureInfo.
    // This string is stored in m_name and is authoritative.
    // We use the m_cultureData to get the data for our object

    // WARNING
    // WARNING: All member fields declared here must also be in ndp/clr/src/vm/object.h
    // WARNING: They aren't really private because object.h can access them, but other C# stuff cannot
    // WARNING: The type loader will rearrange class member offsets so the mscorwks!CultureInfoBaseObject
    // WARNING: must be manually structured to match the true loaded class layout
    // WARNING
    public /* internal */  m_isReadOnly: boolean = false;
    public /* internal */  compareInfo: CompareInfo = null as any;
    public /* internal */  textInfo: TextInfo = null as any;
    // Not serialized for now since we only build it privately for use in the CARIB (so rebuilding is OK)
    public /* internal */  regionInfo: RegionInfo = null as any;
    public /* internal */  numInfo: NumberFormatInfo = null as any;
    public /* internal */  dateTimeInfo: DateTimeFormatInfo = null as any;
    public /* internal */  calendar: Calendar = null as any;

    public /* internal */  m_dataItem: int = 0;       // NEVER USED, DO NOT USE THIS! (Serialized in Whidbey/Everett)

    public/* internal */  cultureID: int = 0x007f;  // NEVER USED, DO NOT USE THIS! (Serialized in Whidbey/Everett)

    //
    // The CultureData instance that we are going to read data from.
    // For supported culture, this will be the CultureData instance that read data from mscorlib assembly.
    // For customized culture, this will be the CultureData instance that read data from user customized culture binary file.
    //
    public /* internal */  m_cultureData: CultureData = null as any;
    public /* internal */  m_isInherited: boolean = false;
    private m_consoleFallbackCulture: CultureInfo = null as any;

    // Names are confusing.  Here are 3 names we have:
    //
    //  new CultureInfo()   m_name        m_nonSortName   m_sortName
    //      en-US           en-US           en-US           en-US
    //      de-de_phoneb    de-DE_phoneb    de-DE           de-DE_phoneb
    //      fj-fj (custom)  fj-FJ           fj-FJ           en-US (if specified sort is en-US)
    //      en              en
    //
    // Note that in Silverlight we ask the OS for the text and sort behavior, so the
    // textinfo and compareinfo names are the same as the name

    // Note that the name used to be serialized for Everett; it is now serialized
    // because alernate sorts can have alternate names.
    // This has a de-DE, de-DE_phoneb or fj-FJ style name
    public /* internal */  m_name: string = null as any;

    // This will hold the non sorting name to be returned from CultureInfo.Name property.
    // This has a de-DE style name even for de-DE_phoneb type cultures
    private m_nonSortName: string = null as any;

    // This will hold the sorting name to be returned from CultureInfo.SortName property.
    // This might be completely unrelated to the culture name if a custom culture.  Ie en-US for fj-FJ.
    // Otherwise its the sort name, ie: de-DE or de-DE_phoneb
    private m_sortName: string = null as any;


    //--------------------------------------------------------------------//
    //
    // Static data members
    //
    //--------------------------------------------------------------------//

    //Get the current user default culture.  This one is almost always used, so we create it by default.
    private static s_userDefaultCulture: CultureInfo;

    //
    // All of the following will be created on demand.
    //

    //The Invariant culture;
    private static s_InvariantCultureInfo: CultureInfo;

    //The culture used in the user interface. This is mostly used to load correct localized resources.
    private static s_userDefaultUICulture: CultureInfo;

    //This is the UI culture used to install the OS.
    private static s_InstalledUICultureInfo: CultureInfo;

    //These are defaults that we use if a thread has not opted into having an explicit culture
    private static s_DefaultThreadCurrentUICulture: CultureInfo;
    private static s_DefaultThreadCurrentCulture: CultureInfo;

    //This is a cache of all previously created cultures.  Valid keys are LCIDs or the name.  We use two hashtables to track them,
    // depending on how they are called.
    private static s_LcidCachedCultures: Hashtable;
    private static s_NameCachedCultures: Hashtable;

    //The parent culture.
    private m_parent: CultureInfo = null as any;

    // LOCALE constants of interest to us internally and privately for LCID functions
    // (ie: avoid using these and use names if possible)
    public/* internal */ static readonly LOCALE_NEUTRAL: int = 0x0000;
    private static readonly LOCALE_USER_DEFAULT: int = 0x0400;
    private static readonly LOCALE_SYSTEM_DEFAULT: int = 0x0800;
    public/* internal */ static readonly LOCALE_CUSTOM_DEFAULT: int = 0x0c00;
    public/* internal */ static readonly LOCALE_CUSTOM_UNSPECIFIED: int = 0x1000;
    public/* internal */ static readonly LOCALE_INVARIANT: int = 0x007F;
    private static readonly LOCALE_TRADITIONAL_SPANISH: int = 0x040a;

    //
    // The CultureData  instance that reads the data provided by our CultureData class.
    //
    //Using a field initializer rather than a static constructor so that the whole class can be lazy
    //init.

    private static Init(): boolean {

        if (CultureInfo.s_InvariantCultureInfo == null) {
            const temp: CultureInfo = new CultureInfo("", false);
            temp.m_isReadOnly = true;
            CultureInfo.s_InvariantCultureInfo = temp;
        }
        // First we set it to Invariant in case someone needs it before we're done finding it.
        // For example, if we throw an exception in InitUserDefaultCulture, we will still need an valid
        // s_userDefaultCulture to be used in Thread.CurrentCulture.
        CultureInfo.s_userDefaultCulture = CultureInfo.s_userDefaultUICulture = CultureInfo.s_InvariantCultureInfo;

        CultureInfo.s_userDefaultCulture = CultureInfo.InitUserDefaultCulture();
        CultureInfo.s_userDefaultUICulture = CultureInfo.InitUserDefaultUICulture();
        return true;
    }


    /*   private static _init: boolean = undefined as any;
      private static get init(): boolean {
          if (CultureInfo._init === undefined) {
              return CultureInfo._init = CultureInfo.Init();
          }
          return CultureInfo._init;
      } */

    private static InitUserDefaultCulture(): CultureInfo {
        let strDefault: string = CultureInfo.GetDefaultLocaleName(CultureInfo.LOCALE_USER_DEFAULT);
        if (strDefault == null) {
            strDefault = CultureInfo.GetDefaultLocaleName(CultureInfo.LOCALE_SYSTEM_DEFAULT);

            if (strDefault == null) {
                // If system default doesn't work, keep using the invariant
                return (CultureInfo.InvariantCulture);
            }
        }
        const temp: CultureInfo = CultureInfo.GetCultureByName(strDefault, true);

        temp.m_isReadOnly = true;

        return (temp);
    }

    private static InitUserDefaultUICulture(): CultureInfo {
        const strDefault: string = CultureInfo.GetUserDefaultUILanguage();

        // In most of cases, UserDefaultCulture == UserDefaultUICulture, so we should use the same instance if possible.
        if (strDefault === CultureInfo.UserDefaultCulture.Name) {
            return (CultureInfo.UserDefaultCulture);
        }

        const temp: CultureInfo = CultureInfo.GetCultureByName(strDefault, true);

        if (temp == null) {
            return (CultureInfo.InvariantCulture);
        }

        temp.m_isReadOnly = true;

        return (temp);
    }

    ////////////////////////////////////////////////////////////////////////
    //
    //  CultureInfo Constructors
    //
    ////////////////////////////////////////////////////////////////////////

    public constructor(name: string);
    public constructor(name: string, useUserOverride: boolean);
    public constructor(cultureData: CultureData);
    public constructor(culture: int);
    public constructor(culture: int, useUserOverride: boolean);
    public /* internal */ constructor(cultureName: string, textAndCompareCultureName: string);
    public constructor(...args: any[]) {
        super();
        if (args.length === 1 && is.string(args[0])) {
            const name: string = args[0];
            this.constructor1(name);
        } else if (args.length === 2 && is.string(args[0]) && is.boolean(args[1])) {
            const name: string = args[0];
            const useUserOverride: boolean = args[1];
            this.constructor2(name, useUserOverride);
        } else if (args.length === 1 && is.typeof<CultureData>(args[0], System.Types.Globalization.CultureData)) {
            const cultureData: CultureData = args[0];
            this.constructor3(cultureData);
        } else if (args.length === 1 && is.int(args[0])) {
            const culture: int = args[0];
            this.constructor4(culture);
        } else if (args.length === 2 && is.int(args[0]) && is.boolean(args[1])) {
            const culture: int = args[0];
            const useUserOverride: boolean = args[1];
            this.constructor5(culture, useUserOverride);
        } else if (args.length === 2 && is.string(args[0]) && is.string(args[1])) {
            const cultureName: string = args[0];
            const textAndCompareCultureName: string = args[1];
            this.constructor6(cultureName, textAndCompareCultureName);
        }
    }

    public constructor1(name: string) {
        this.constructor2(name, true);
    }


    public constructor2(name: string, useUserOverride: boolean) {
        if (name == null) {
            throw new ArgumentNullException("name", Environment.GetResourceString("ArgumentNull_String"));
        }
        //Contract.EndContractBlock();

        // Get our data providing record
        this.m_cultureData = CultureData.GetCultureData(name, useUserOverride);

        if (this.m_cultureData == null) {

            throw new CultureNotFoundException("name", name, Environment.GetResourceString("Argument_CultureNotSupported"));
        }

        this.m_name = this.m_cultureData.CultureName;
        this.m_isInherited = (this.GetType() !== type(System.Types.Globalization.CultureInfo));
    }

    private constructor3(cultureData: CultureData) {
        //Contract.Assert(cultureData != null);
        this.m_cultureData = cultureData;
        this.m_name = cultureData.CultureName;
        this.m_isInherited = false;
    }

    private static CreateCultureInfoNoThrow(name: string, useUserOverride: boolean): CultureInfo {
        // Contract.Assert(name != null);
        const cultureData: CultureData = CultureData.GetCultureData(name, useUserOverride);
        if (cultureData == null) {
            return null as any;
        }

        return new CultureInfo(cultureData);
    }


    public constructor4(culture: int) {
        this.constructor5(culture, true)
    }

    public constructor5(culture: int, useUserOverride: boolean) {
        // We don't check for other invalid LCIDS here...
        if (culture < 0) {
            throw new ArgumentOutOfRangeException("culture", Environment.GetResourceString("ArgumentOutOfRange_NeedPosNum"));
        }
        //Contract.EndContractBlock();

        this.InitializeFromCultureId(culture, useUserOverride);
    }

    private InitializeFromCultureId(culture: int, useUserOverride: boolean): void {
        switch (culture) {
            case CultureInfo.LOCALE_CUSTOM_DEFAULT:
            case CultureInfo.LOCALE_SYSTEM_DEFAULT:
            case CultureInfo.LOCALE_NEUTRAL:
            case CultureInfo.LOCALE_USER_DEFAULT:
            case CultureInfo.LOCALE_CUSTOM_UNSPECIFIED:
                // Can't support unknown custom cultures and we do not support neutral or
                // non-custom user locales.
                throw new CultureNotFoundException(
                    "culture", culture, Environment.GetResourceString("Argument_CultureNotSupported"));

            default:
                // Now see if this LCID is supported in the system default CultureData  table.
                this.m_cultureData = CultureData.GetCultureData(culture, useUserOverride);
                break;
        }
        this.m_isInherited = (this.GetType() !== type(System.Types.Globalization.CultureInfo));
        this.m_name = this.m_cultureData.CultureName;
    }

    // Constructor called by SQL Server's special munged culture - creates a culture with
    // a TextInfo and CompareInfo that come from a supplied alternate source. This object
    // is ALWAYS read-only.
    // Note that we really cannot use an LCID version of this override as the cached
    // name we create for it has to include both names, and the logic for this is in
    // the GetCultureInfo override *only*.
    public /* internal */ constructor6(cultureName: string, textAndCompareCultureName: string) {
        if (cultureName == null) {
            throw new ArgumentNullException("cultureName",
                Environment.GetResourceString("ArgumentNull_String"));
        }
        //Contract.EndContractBlock();

        this.m_cultureData = CultureData.GetCultureData(cultureName, false);
        if (this.m_cultureData == null)
            throw new CultureNotFoundException(
                "cultureName", cultureName, Environment.GetResourceString("Argument_CultureNotSupported"));

        this.m_name = this.m_cultureData.CultureName;

        const altCulture: CultureInfo = CultureInfo.GetCultureInfo(textAndCompareCultureName);
        this.compareInfo = altCulture.CompareInfo;
        this.textInfo = altCulture.TextInfo;
    }

    // We do this to try to return the system UI language and the default user languages
    // The callers should have a fallback if this fails (like Invariant)
    private static GetCultureByName(name: string, userOverride: boolean): CultureInfo {
        // Try to get our culture
        //try {
            return userOverride ? new CultureInfo(name) : CultureInfo.GetCultureInfo(name);
       /*  }
        catch (ArgumentException) {
        } */

        return null as any;
    }

    //
    // Return a specific culture.  A tad irrelevent now since we always return valid data
    // for neutral locales.
    //
    // Note that there's interesting behavior that tries to find a smaller name, ala RFC4647,
    // if we can't find a bigger name.  That doesn't help with things like "zh" though, so
    // the approach is of questionable value
    //
    public static CreateSpecificCulture(name: string): CultureInfo {
        //Contract.Ensures(Contract.Result<CultureInfo>() != null);

        let culture: CultureInfo;

        try {
            culture = new CultureInfo(name);
        } catch (ArgumentException) {
            // When CultureInfo throws this exception, it may be because someone passed the form
            // like "az-az" because it came out of an http accept lang. We should try a little
            // parsing to perhaps fall back to "az" here and use *it* to create the neutral.

            let idx: int;

            culture = null as any;
            for (idx = 0; idx < name.length; idx++) {
                if ('-' == name[idx]) {
                    try {
                        culture = new CultureInfo(name.substring(0, idx));
                        break;
                    } catch (ArgumentException) {
                        // throw the original exception so the name in the string will be right
                        throw new Exception('');
                    }
                }
            }

            if (null == culture) {
                // nothing to save here; throw the original exception
                throw new Exception('');
            }
        }

        //In the most common case, they've given us a specific culture, so we'll just return that.
        if (!(culture.IsNeutralCulture)) {
            return culture;
        }

        return (new CultureInfo(culture.m_cultureData.SSPECIFICCULTURE));
    }

    public /* internal */ static VerifyCultureName(cultureName: string, throwException: boolean): boolean;
    public /* internal */ static VerifyCultureName(culture: CultureInfo, throwException: boolean): boolean;
    public /* internal */ static VerifyCultureName(...args: any[]): boolean {
        if (args.length === 2 && is.string(args[0]) && is.boolean(args[1])) {
            const cultureName: string = args[0];
            const throwException: boolean = args[1];
            // This function is used by ResourceManager.GetResourceFileName().
            // ResourceManager searches for resource using CultureInfo.Name,
            // so we should check against CultureInfo.Name.

            for (let i: int = 0; i < cultureName.length; i++) {
                const c: char = cultureName[i].charCodeAt(0);
                //

                if (TChar.IsLetterOrDigit(c) || c === '-'.charCodeAt(0) || c === '_'.charCodeAt(0)) {
                    continue;
                }
                if (throwException) {
                    throw new ArgumentException(Environment.GetResourceString("Argument_InvalidResourceCultureName" + cultureName));
                }
                return false;
            }
            return true;
        } else if (args.length === 2 && is.typeof<CultureInfo>(args[0], System.Types.Globalization.CultureInfo)) {
            //Contract.Assert(culture != null, "[CultureInfo.VerifyCultureName]culture!=null");
            const culture: CultureInfo = args[0];
            const throwException: boolean = args[1];
            //If we have an instance of one of our CultureInfos, the user can't have changed the
            //name and we know that all names are valid in files.
            if (!culture.m_isInherited) {
                return true;
            }

            return CultureInfo.VerifyCultureName(culture.Name, throwException);
        }
        throw new ArgumentOutOfRangeException('');

    }


    ////////////////////////////////////////////////////////////////////////
    //
    //  CurrentCulture
    //
    //  This instance provides methods based on the current user settings.
    //  These settings are volatile and may change over the lifetime of the
    //  thread.
    //
    ////////////////////////////////////////////////////////////////////////


    public static get CurrentCulture(): CultureInfo {
        // Contract.Ensures(Contract.Result<CultureInfo>() != null);
        const _Thread = Context.Current.get('Thread');
        return _Thread.CurrentThread.CurrentCulture;
    }

    public static set CurrentCulture(value: CultureInfo) {
        const _Thread = Context.Current.get('Thread');
        _Thread.CurrentThread.CurrentCulture = value;
    }


    //
    // This is the equivalence of the Win32 GetUserDefaultLCID()
    //
    public /* internal */ static get UserDefaultCulture(): CultureInfo {
        // Contract.Ensures(Contract.Result<CultureInfo>() != null);

        let temp: CultureInfo = CultureInfo.s_userDefaultCulture;
        if (temp == null) {
            //
            // setting the s_userDefaultCulture with invariant culture before intializing it is a protection
            // against recursion problem just in case if somebody called CurrentCulture from the CultureInfo
            // creation path. the recursion can happen if the current user culture is a replaced custom culture.
            //

            CultureInfo.s_userDefaultCulture = CultureInfo.InvariantCulture;
            temp = CultureInfo.InitUserDefaultCulture();
            CultureInfo.s_userDefaultCulture = temp;
        }
        return (temp);
    }

    //
    //  This is the equivalence of the Win32 GetUserDefaultUILanguage()
    //
    public /* internal */ static get UserDefaultUICulture(): CultureInfo {
        // Contract.Ensures(Contract.Result<CultureInfo>() != null);

        let temp: CultureInfo = CultureInfo.s_userDefaultUICulture;
        if (temp == null) {
            //
            // setting the s_userDefaultCulture with invariant culture before intializing it is a protection
            // against recursion problem just in case if somebody called CurrentUICulture from the CultureInfo
            // creation path. the recursion can happen if the current user culture is a replaced custom culture.
            //

            CultureInfo.s_userDefaultUICulture = CultureInfo.InvariantCulture;

            temp = CultureInfo.InitUserDefaultUICulture();
            CultureInfo.s_userDefaultUICulture = temp;
        }
        return temp;
    }



    public static get CurrentUICulture(): CultureInfo {
        // Contract.Ensures(Contract.Result<CultureInfo>() != null);
        const _Thread = Context.Current.get('Thread');
        return _Thread.CurrentThread.CurrentUICulture;
    }

    public static set CurrentUICulture(value: CultureInfo) {
        const _Thread = Context.Current.get('Thread');
        _Thread.CurrentThread.CurrentUICulture = value;
    }



    //
    // This is the equivalence of the Win32 GetSystemDefaultUILanguage()
    //
    //
    public static get InstalledUICulture(): CultureInfo {
        // Contract.Ensures(Contract.Result<CultureInfo>() != null);

        let temp: CultureInfo = CultureInfo.s_InstalledUICultureInfo;
        if (temp == null) {
            const strDefault: string = CultureInfo.GetSystemDefaultUILanguage();
            temp = CultureInfo.GetCultureByName(strDefault, true);

            if (temp == null) {
                temp = CultureInfo.InvariantCulture;
            }

            temp.m_isReadOnly = true;
            CultureInfo.s_InstalledUICultureInfo = temp;
        }
        return temp;
    }


    public static get DefaultThreadCurrentCulture(): CultureInfo {
        return CultureInfo.s_DefaultThreadCurrentCulture;
    }
    public static set DefaultThreadCurrentCulture(value: CultureInfo) {

        // If you add pre-conditions to this method, check to see if you also need to
        // add them to Thread.CurrentCulture.set.

        CultureInfo.s_DefaultThreadCurrentCulture = value;
    }

    public static get DefaultThreadCurrentUICulture(): CultureInfo {
        return CultureInfo.s_DefaultThreadCurrentUICulture;
    }
    public static set DefaultThreadCurrentUICulture(value: CultureInfo) {

        //If they're trying to use a Culture with a name that we can't use in resource lookup,
        //don't even let them set it on the thread.

        // If you add more pre-conditions to this method, check to see if you also need to
        // add them to Thread.CurrentUICulture.set.

        if (value != null) {
            CultureInfo.VerifyCultureName(value, true);
        }

        CultureInfo.s_DefaultThreadCurrentUICulture = value;
    }


    ////////////////////////////////////////////////////////////////////////
    //
    //  InvariantCulture
    //
    //  This instance provides methods, for example for casing and sorting,
    //  that are independent of the system and current user settings.  It
    //  should be used only by processes such as some system services that
    //  require such invariant results (eg. file systems).  In general,
    //  the results are not linguistically correct and do not match any
    //  culture info.
    //
    ////////////////////////////////////////////////////////////////////////

    public static get InvariantCulture(): CultureInfo {
        //Contract.Ensures(Contract.Result<CultureInfo>() != null);
        return (CultureInfo.s_InvariantCultureInfo);
    }


    ////////////////////////////////////////////////////////////////////////
    //
    //  Parent
    //
    //  Return the parent CultureInfo for the current instance.
    //
    ////////////////////////////////////////////////////////////////////////

    public get Parent(): CultureInfo {
        //Contract.Ensures(Contract.Result<CultureInfo>() != null);
        let culture: CultureInfo = null as any;

        if (null == this.m_parent) {
            const parentName: string = this.m_cultureData.SPARENT;

            if (TString.IsNullOrEmpty(parentName)) {
                culture = CultureInfo.InvariantCulture;
            }
            else {
                culture = CultureInfo.CreateCultureInfoNoThrow(parentName, this.m_cultureData.UseUserOverride);
                if (culture == null) {
                    // For whatever reason our IPARENT or SPARENT wasn't correct, so use invariant
                    // We can't allow ourselves to fail.  In case of custom cultures the parent of the
                    // current custom culture isn't installed.
                    culture = CultureInfo.InvariantCulture;
                }
            }

            if (culture == null) {
                this.m_parent = null as any;
            }
            //Interlocked.CompareExchange<CultureInfo>(ref m_parent, culture, null);
        }
        return this.m_parent;
    }

    ////////////////////////////////////////////////////////////////////////
    //
    //  LCID
    //
    //  Returns a properly formed culture identifier for the current
    //  culture info.
    //
    ////////////////////////////////////////////////////////////////////////

    public get LCID(): int {
        return (this.m_cultureData.ILANGUAGE);
    }

    ////////////////////////////////////////////////////////////////////////
    //
    //  BaseInputLanguage
    //
    //  Essentially an LCID, though one that may be different than LCID in the case
    //  of a customized culture (LCID == LOCALE_CUSTOM_UNSPECIFIED).
    //
    ////////////////////////////////////////////////////////////////////////
    public get KeyboardLayoutId(): int {
        const keyId: int = this.m_cultureData.IINPUTLANGUAGEHANDLE;

        // Not a customized culture, return the default Keyboard layout ID, which is the same as the language ID.
        return (keyId);
    }

    public static GetCultures(types: CultureTypes): CultureInfo[] {
        //Contract.Ensures(Contract.Result<CultureInfo[]>() != null);
        // internally we treat UserCustomCultures as Supplementals but v2
        // treats as Supplementals and Replacements
        if ((types & CultureTypes.UserCustomCulture) === CultureTypes.UserCustomCulture) {
            types |= CultureTypes.ReplacementCultures;
        }
        return CultureData.GetCultures(types);
    }

    ////////////////////////////////////////////////////////////////////////
    //
    //  Name
    //
    //  Returns the full name of the CultureInfo. The name is in format like
    //  "en-US"  This version does NOT include sort information in the name.
    //
    ////////////////////////////////////////////////////////////////////////
    public get Name(): string {
        // Contract.Ensures(Contract.Result<String>() != null);

        // We return non sorting name here.
        if (this.m_nonSortName == null) {
            this.m_nonSortName = this.m_cultureData.SNAME;
            if (this.m_nonSortName == null) {
                this.m_nonSortName = String.Empty;
            }
        }
        return this.m_nonSortName;
    }


    // This one has the sort information (ie: de-DE_phoneb)
    public /* internal */ get SortName(): string {
        if (this.m_sortName == null) {
            this.m_sortName = this.m_cultureData.SCOMPAREINFO;
        }
        return this.m_sortName;
    }

    //
    public get IetfLanguageTag(): string {
        //Contract.Ensures(Contract.Result<String>() != null);

        // special case the compatibility cultures
        switch (this.Name) {
            case "zh-CHT":
                return "zh-Hant";
            case "zh-CHS":
                return "zh-Hans";
            default:
                return this.Name;
        }
    }

    ////////////////////////////////////////////////////////////////////////
    //
    //  DisplayName
    //
    //  Returns the full name of the CultureInfo in the localized language.
    //  For example, if the localized language of the runtime is Spanish and the CultureInfo is
    //  US English, "Ingles (Estados Unidos)" will be returned.
    //
    ////////////////////////////////////////////////////////////////////////
    public get DisplayName(): string {
        //Contract.Ensures(Contract.Result<String>() != null);
        //Contract.Assert(m_name != null, "[CultureInfo.DisplayName]Always expect m_name to be set");

        return this.m_cultureData.SLOCALIZEDDISPLAYNAME;
    }

    ////////////////////////////////////////////////////////////////////////
    //
    //  GetNativeName
    //
    //  Returns the full name of the CultureInfo in the native language.
    //  For example, if the CultureInfo is US English, "English
    //  (United States)" will be returned.
    //
    ////////////////////////////////////////////////////////////////////////
    public get NativeName(): string {
        // Contract.Ensures(Contract.Result<String>() != null);
        return this.m_cultureData.SNATIVEDISPLAYNAME;
    }

    ////////////////////////////////////////////////////////////////////////
    //
    //  GetEnglishName
    //
    //  Returns the full name of the CultureInfo in English.
    //  For example, if the CultureInfo is US English, "English
    //  (United States)" will be returned.
    //
    ////////////////////////////////////////////////////////////////////////
    public get EnglishName(): string {
        // Contract.Ensures(Contract.Result<String>() != null);
        return this.m_cultureData.SENGDISPLAYNAME;
    }

    // ie: en
    public get TwoLetterISOLanguageName(): string {
        // Contract.Ensures(Contract.Result<String>() != null);
        return this.m_cultureData.SISO639LANGNAME;
    }

    public get ThreeLetterISOLanguageName(): string {
        //Contract.Ensures(Contract.Result<String>() != null);
        return this.m_cultureData.SISO639LANGNAME2;
    }

    ////////////////////////////////////////////////////////////////////////
    //
    //  ThreeLetterWindowsLanguageName
    //
    //  Returns the 3 letter windows language name for the current instance.  eg: "ENU"
    //  The ISO names are much preferred
    //
    ////////////////////////////////////////////////////////////////////////
    public get ThreeLetterWindowsLanguageName(): string {
        // Contract.Ensures(Contract.Result<String>() != null);
        return (this.m_cultureData.SABBREVLANGNAME);
    }

    ////////////////////////////////////////////////////////////////////////
    //
    //  CompareInfo               Read-Only Property
    //
    //  Gets the CompareInfo for this culture.
    //
    ////////////////////////////////////////////////////////////////////////
    public get CompareInfo(): CompareInfo {
        //Contract.Ensures(Contract.Result<CompareInfo>() != null);

        if (this.compareInfo == null) {
            // Since CompareInfo's don't have any overrideable properties, get the CompareInfo from
            // the Non-Overridden CultureInfo so that we only create one CompareInfo per culture
            const temp: CompareInfo = this.UseUserOverride ? CultureInfo.GetCultureInfo(this.m_name).CompareInfo : new CompareInfo(this);
            if (CompatibilitySwitches.IsCompatibilityBehaviorDefined) {
                this.compareInfo = temp;
            }
            else {
                return temp;
            }
        }
        return this.compareInfo;
    }


    ////////////////////////////////////////////////////////////////////////
    //
    //  RegionInfo
    //
    //  Gets the RegionInfo for this culture.
    //
    ////////////////////////////////////////////////////////////////////////
    private get Region(): RegionInfo {
        if (this.regionInfo == null) {
            // Make a new regionInfo
            const tempRegionInfo: RegionInfo = new RegionInfo(this.m_cultureData);
            this.regionInfo = tempRegionInfo;
        }
        return (this.regionInfo);
    }




    ////////////////////////////////////////////////////////////////////////
    //
    //  TextInfo
    //
    //  Gets the TextInfo for this culture.
    //
    ////////////////////////////////////////////////////////////////////////


    public get TextInfo(): TextInfo {
        // Contract.Ensures(Contract.Result<TextInfo>() != null);

        if (this.textInfo == null) {
            // Make a new textInfo
            const tempTextInfo: TextInfo = new TextInfo(this.m_cultureData);
            tempTextInfo.SetReadOnlyState(this.m_isReadOnly);

            if (CompatibilitySwitches.IsCompatibilityBehaviorDefined) {
                this.textInfo = tempTextInfo;
            }
            else {
                return tempTextInfo;
            }
        }
        return this.textInfo;
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
    public Equals<CultureInfo>(value: CultureInfo): boolean {
        if ((TObject as any).ReferenceEquals(this, value))
            return true;

        const that: CultureInfo = value as CultureInfo;

        if (that != null) {
            // using CompareInfo to verify the data passed through the constructor
            // CultureInfo(String cultureName, String textAndCompareCultureName)

            return this.Name === (that as any).Name && this.CompareInfo.Equals((that as any).CompareInfo);
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
        return (TObject.GetHashCode(this.Name) + TObject.GetHashCode(this.CompareInfo));
    }


    ////////////////////////////////////////////////////////////////////////
    //
    //  ToString
    //
    //  Implements Object.ToString().  Returns the name of the CultureInfo,
    //  eg. "de-DE_phoneb", "en-US", or "fj-FJ".
    //
    ////////////////////////////////////////////////////////////////////////


    @Override
    public ToString(): string {
        //Contract.Ensures(Contract.Result<String>() != null);

        //Contract.Assert(m_name != null, "[CultureInfo.ToString]Always expect m_name to be set");
        return this.m_name;
    }


    @Virtual
    public GetFormat(formatType: Type): any {
        if (formatType === type(System.Types.Globalization.NumberFormatInfo)) {
            return (this.NumberFormat);
        }
        if (formatType == type(System.Types.Globalization.DateTimeFormatInfo)) {
            return (this.DateTimeFormat);
        }
        return null;
    }

    public get IsNeutralCulture(): boolean {
        return this.m_cultureData.IsNeutralCulture;
    }

    public get CultureTypes(): CultureTypes {
        let types: CultureTypes = 0;

        if (this.m_cultureData.IsNeutralCulture)
            types |= CultureTypes.NeutralCultures;
        else
            types |= CultureTypes.SpecificCultures;

        types |= this.m_cultureData.IsWin32Installed ? CultureTypes.InstalledWin32Cultures : 0;

        types |= this.m_cultureData.IsFramework ? CultureTypes.FrameworkCultures : 0;

        types |= this.m_cultureData.IsSupplementalCustomCulture ? CultureTypes.UserCustomCulture : 0;
        types |= this.m_cultureData.IsReplacementCulture ? CultureTypes.ReplacementCultures | CultureTypes.UserCustomCulture : 0;

        return types;
    }

    public get NumberFormat(): NumberFormatInfo {
        // Contract.Ensures(Contract.Result<NumberFormatInfo>() != null);

        if (this.numInfo == null) {
            const temp: NumberFormatInfo = new NumberFormatInfo(this.m_cultureData);
            temp.isReadOnly = this.m_isReadOnly;
            this.numInfo = temp;
        }
        return this.numInfo;
    }
    public set NumberFormat(value: NumberFormatInfo) {
        if (value == null) {
            throw new ArgumentNullException("value",
                Environment.GetResourceString("ArgumentNull_Obj"));
        }
        //Contract.EndContractBlock();
        this.VerifyWritable();
        this.numInfo = value;
    }


    ////////////////////////////////////////////////////////////////////////
    //
    // GetDateTimeFormatInfo
    //
    // Create a DateTimeFormatInfo, and fill in the properties according to
    // the CultureID.
    //
    ////////////////////////////////////////////////////////////////////////


    public get DateTimeFormat(): DateTimeFormatInfo {
        // Contract.Ensures(Contract.Result<DateTimeFormatInfo>() != null);

        if (this.dateTimeInfo == null) {
            // Change the calendar of DTFI to the specified calendar of this CultureInfo.
            const temp: DateTimeFormatInfo = new DateTimeFormatInfo(this.m_cultureData, this.Calendar);
            temp.m_isReadOnly = this.m_isReadOnly;
            //Thread.MemoryBarrier();
            this.dateTimeInfo = temp;
        }
        return this.dateTimeInfo;
    }

    public set DateTimeFormat(value: DateTimeFormatInfo) {
        if (value == null) {
            throw new ArgumentNullException("value",
                Environment.GetResourceString("ArgumentNull_Obj"));
        }
        //Contract.EndContractBlock();
        this.VerifyWritable();
        this.dateTimeInfo = value;
    }




    public ClearCachedData(): void {
        CultureInfo.s_userDefaultUICulture = null as any;
        CultureInfo.s_userDefaultCulture = null as any;

        RegionInfo.s_currentRegionInfo = null as any;
        throw new Exception('düzelt');
        //TimeZoneInfo.ClearCachedData();
        // Delete the cached cultures.
        CultureInfo.s_LcidCachedCultures = null as any;
        CultureInfo.s_NameCachedCultures = null as any;

        CultureData.ClearCachedData();
    }

    /*=================================GetCalendarInstance==========================
    **Action: Map a Win32 CALID to an instance of supported calendar.
    **Returns: An instance of calendar.
    **Arguments: calType    The Win32 CALID
    **Exceptions:
    **      Shouldn't throw exception since the calType value is from our data table or from Win32 registry.
    **      If we are in trouble (like getting a weird value from Win32 registry), just return the GregorianCalendar.
    ============================================================================*/
    public /* internal */ static GetCalendarInstance(calType: int): Calendar {
        if (calType === Calendar.CAL_GREGORIAN) {
            throw new Exception('düzelt');
            //return (new GregorianCalendar());
        }
        return CultureInfo.GetCalendarInstanceRare(calType);
    }

    //This function exists as a shortcut to prevent us from loading all of the non-gregorian
    //calendars unless they're required.
    public /* internal */ static GetCalendarInstanceRare(calType: int): Calendar {
        // Contract.Assert(calType != Calendar.CAL_GREGORIAN, "calType!=Calendar.CAL_GREGORIAN");

        switch (calType) {
            case Calendar.CAL_GREGORIAN_US:               // Gregorian (U.S.) calendar
            case Calendar.CAL_GREGORIAN_ME_FRENCH:        // Gregorian Middle East French calendar
            case Calendar.CAL_GREGORIAN_ARABIC:           // Gregorian Arabic calendar
            case Calendar.CAL_GREGORIAN_XLIT_ENGLISH:     // Gregorian Transliterated English calendar
            case Calendar.CAL_GREGORIAN_XLIT_FRENCH:      // Gregorian Transliterated French calendar
                // throw new Exception('düzelt');
                const gc = Context.Current.get('GregorianCalendar'); //for deps
                return new gc(calType);
                //return new GregorianCalendar(<GregorianCalendarTypes>calType);
            case Calendar.CAL_TAIWAN:                     // Taiwan Era calendar
                //  throw new Exception('düzelt');
                const tc = Context.Current.get('TaiwanCalendar');
                return new tc();
            // return new TaiwanCalendar();
            case Calendar.CAL_JAPAN:                      // Japanese Emperor Era calendar
                throw new Exception('düzelt');
            //return new JapaneseCalendar();
            case Calendar.CAL_KOREA:                      // Korean Tangun Era calendar
                throw new Exception('düzelt');
            // return new KoreanCalendar();
            case Calendar.CAL_THAI:                       // Thai calendar
                throw new Exception('düzelt');
            // return (new ThaiBuddhistCalendar());
            case Calendar.CAL_HIJRI:                      // Hijri (Arabic Lunar) calendar
                throw new Exception('düzelt');
            //return (new HijriCalendar());
            case Calendar.CAL_HEBREW:                     // Hebrew (Lunar) calendar
                throw new Exception('düzelt');
            // return (new HebrewCalendar());
            case Calendar.CAL_UMALQURA:
                throw new Exception('düzelt');
            //return (new UmAlQuraCalendar());
            case Calendar.CAL_PERSIAN:
                throw new Exception('düzelt');
            //return (new PersianCalendar());
            case Calendar.CAL_CHINESELUNISOLAR:
                new Exception('düzelt');
            //return new ChineseLunisolarCalendar();
            case Calendar.CAL_JAPANESELUNISOLAR:
                new Exception('düzelt');
            //return (new JapaneseLunisolarCalendar());
            case Calendar.CAL_KOREANLUNISOLAR:
                new Exception('düzelt');
            //return (new KoreanLunisolarCalendar());
            case Calendar.CAL_TAIWANLUNISOLAR:
                new Exception('düzelt');
            //return new TaiwanLunisolarCalendar();
        }
        //throw new Exception('düzelt');
        const gc = Context.Current.get('GregorianCalendar'); //for deps
        return new gc(calType);
    }


    /*=================================Calendar==========================
    **Action: Return/set the default calendar used by this culture.
    ** This value can be overridden by regional option if this is a current culture.
    **Returns:
    **Arguments:
    **Exceptions:
    **  ArgumentNull_Obj if the set value is null.
    ============================================================================*/


    public get Calendar(): Calendar {
        //Contract.Ensures(Contract.Result<Calendar>() != null);
        if (this.calendar == null) {
            //Contract.Assert(this.m_cultureData.CalendarIds.Length > 0, "this.m_cultureData.CalendarIds.Length > 0");
            // Get the default calendar for this culture.  Note that the value can be
            // from registry if this is a user default culture.
            const newObj: Calendar = this.m_cultureData.DefaultCalendar;

            //System.Threading.Thread.MemoryBarrier();
            newObj.SetReadOnlyState(this.m_isReadOnly);
            this.calendar = newObj;
        }
        return this.calendar;
    }

    /*=================================OptionCalendars==========================
    **Action: Return an array of the optional calendar for this culture.
    **Returns: an array of Calendar.
    **Arguments:
    **Exceptions:
    ============================================================================*/


    public get OptionalCalendars(): Calendar[] {
        // Contract.Ensures(Contract.Result<Calendar[]>() != null);

        //
        // This property always returns a new copy of the calendar array.
        //
        const calID: IntArray = this.m_cultureData.CalendarIds;
        const cals: Calendar[] = New.Array(calID.length);
        for (let i: int = 0; i < cals.length; i++) {
            cals[i] = CultureInfo.GetCalendarInstance(calID[i]);
        }
        return (cals);
    }



    public get UseUserOverride(): boolean {
        return this.m_cultureData.UseUserOverride;
    }

    public GetConsoleFallbackUICulture(): CultureInfo {
        //Contract.Ensures(Contract.Result<CultureInfo>() != null);

        let temp: CultureInfo = this.m_consoleFallbackCulture;
        if (temp == null) {
            throw new Exception('düzelt');
            /* temp = CultureInfo.CreateSpecificCulture(this.m_cultureData.SCONSOLEFALLBACKNAME);
            temp.m_isReadOnly = true;
            this.m_consoleFallbackCulture = temp; */
        }
        return (temp);
    }

    @Virtual
    public Clone(): CultureInfo {
        //Contract.Ensures(Contract.Result<Object>() != null);

        const ci: CultureInfo = this.MemberwiseClone();
        ci.m_isReadOnly = false;

        //If this is exactly our type, we can make certain optimizations so that we don't allocate NumberFormatInfo or DTFI unless
        //they've already been allocated.  If this is a derived type, we'll take a more generic codepath.
        if (!this.m_isInherited) {
            if (this.dateTimeInfo != null) {
                ci.dateTimeInfo = this.dateTimeInfo.Clone();
            }
            if (this.numInfo != null) {
                ci.numInfo = this.numInfo.Clone();
            }

        }
        else {
            ci.DateTimeFormat = this.DateTimeFormat.Clone();
            ci.NumberFormat = this.NumberFormat.Clone();
        }

        if (this.textInfo != null) {
            ci.textInfo = this.textInfo.Clone();
        }

        if (this.calendar != null) {
            ci.calendar = this.calendar.Clone();
        }

        return ci;
    }


    public static ReadOnly(ci: CultureInfo): CultureInfo {
        if (ci == null) {
            throw new ArgumentNullException("ci");
        }
        //Contract.Ensures(Contract.Result<CultureInfo>() != null);
        //Contract.EndContractBlock();

        if (ci.IsReadOnly) {
            return (ci);
        }
        const newInfo: CultureInfo = ci.MemberwiseClone();

        if (!ci.IsNeutralCulture) {
            //If this is exactly our type, we can make certain optimizations so that we don't allocate NumberFormatInfo or DTFI unless
            //they've already been allocated.  If this is a derived type, we'll take a more generic codepath.
            if (!ci.m_isInherited) {
                if (ci.dateTimeInfo != null) {
                    newInfo.dateTimeInfo = DateTimeFormatInfo.ReadOnly(ci.dateTimeInfo);
                }
                if (ci.numInfo != null) {
                    newInfo.numInfo = NumberFormatInfo.ReadOnly(ci.numInfo);
                }

            } else {
                newInfo.DateTimeFormat = DateTimeFormatInfo.ReadOnly(ci.DateTimeFormat);
                newInfo.NumberFormat = NumberFormatInfo.ReadOnly(ci.NumberFormat);
            }
        }

        if (ci.textInfo != null) {
            newInfo.textInfo = TextInfo.ReadOnly(ci.textInfo);
        }

        if (ci.calendar != null) {
            newInfo.calendar = Calendar.ReadOnly(ci.calendar);
        }

        // Don't set the read-only flag too early.
        // We should set the read-only flag here.  Otherwise, info.DateTimeFormat will not be able to set.
        newInfo.m_isReadOnly = true;

        return newInfo;
    }


    public get IsReadOnly(): boolean {
        return this.m_isReadOnly;
    }

    private VerifyWritable(): void {
        if (this.m_isReadOnly) {
            throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_ReadOnly"));
        }
        //Contract.EndContractBlock();
    }

    // For resource lookup, we consider a culture the invariant culture by name equality.
    // We perform this check frequently during resource lookup, so adding a property for
    // improved readability.
    public /* internal */ get HasInvariantCultureName(): boolean {
        return this.Name === CultureInfo.InvariantCulture.Name;
    }

    // Helper function both both overloads of GetCachedReadOnlyCulture.  If lcid is 0, we use the name.
    // If lcid is -1, use the altName and create one of those special SQL cultures.
    public /* internal */ static GetCultureInfoHelper(lcid: int, name: string, altName: string): CultureInfo {
        // There is a race condition in this code with the side effect that the second thread's value
        // clobbers the first in the dictionary. This is an acceptable ---- since the CultureInfo objects
        // are content equal (but not reference equal). Since we make no guarantees there, this ---- is
        // acceptable.
        // See code:Dictionary#DictionaryVersusHashtableThreadSafety for details on Dictionary versus
        // Hashtable thread safety.

        // retval is our return value.
        let retval: CultureInfo;

        // Temporary hashtable for the names.
        let tempNameHT: Hashtable = CultureInfo.s_NameCachedCultures;

        if (name != null) {
            name = CultureData.AnsiToLower(name);
        }

        if (altName != null) {
            altName = CultureData.AnsiToLower(altName);
        }

        // We expect the same result for both hashtables, but will test individually for added safety.
        if (tempNameHT == null) {
            tempNameHT = /* Hashtable.Synchronized( */new Hashtable()/* ) */;
        }
        else {
            // If we are called by name, check if the object exists in the hashtable.  If so, return it.
            if (lcid === -1) {
                retval = tempNameHT.Get(name + '\xfffd' + altName);
                if (retval != null) {
                    return retval;
                }
            }
            else if (lcid === 0) {
                retval = tempNameHT.Get(name);
                if (retval != null) {
                    return retval;
                }
            }
        }
        // Next, the Lcid table.
        let tempLcidHT: Hashtable = CultureInfo.s_LcidCachedCultures;

        if (tempLcidHT == null) {
            // Case insensitive is not an issue here, save the constructor call.
            tempLcidHT = new Hashtable();
        }
        else {
            // If we were called by Lcid, check if the object exists in the table.  If so, return it.
            if (lcid > 0) {
                retval = tempLcidHT.Get(lcid.toString());
                if (retval != null) {
                    return retval;
                }
            }
        }
        // We now have two temporary hashtables and the desired object was not found.
        // We'll construct it.  We catch any exceptions from the constructor call and return null.
        try {
            switch (lcid) {
                case -1:
                    // call the private constructor
                    retval = new CultureInfo(name, altName);
                    break;

                case 0:
                    retval = new CultureInfo(name, false);
                    break;

                default:
                    retval = new CultureInfo(lcid, false);
                    break;
            }
        }
        catch (ArgumentException) {
            return null as any;
        }

        // Set it to read-only
        retval.m_isReadOnly = true;

        if (lcid == -1) {
            // This new culture will be added only to the name hash table.
            tempNameHT[name + '\xfffd' + altName] = retval;

            // when lcid == -1 then TextInfo object is already get created and we need to set it as read only.
            retval.TextInfo.SetReadOnlyState(true);
        }
        else {
            // Remember our name (as constructed).  Do NOT use alternate sort name versions because
            // we have internal state representing the sort.  (So someone would get the wrong cached version)
            const newName = CultureData.AnsiToLower(retval.m_name);

            // We add this new culture info object to both tables.
            tempNameHT.Set(newName, retval);
            const LCID_ZH_CHS_HANS: int = 0x0004;
            const LCID_ZH_CHT_HANT: int = 0x7c04;

            if ((retval.LCID === LCID_ZH_CHS_HANS && newName === "zh-hans") || (retval.LCID === LCID_ZH_CHT_HANT && newName === "zh-hant")) {
                // do nothing because we only want zh-CHS and zh-CHT to cache
                // by lcid
            }
            else {
                tempLcidHT[retval.LCID] = retval;
            }

        }

        // Copy the two hashtables to the corresponding member variables.  This will potentially overwrite
        // new tables simultaneously created by a new thread, but maximizes thread safety.
        if (-1 !== lcid) {
            // Only when we modify the lcid hash table, is there a need to overwrite.
            CultureInfo.s_LcidCachedCultures = tempLcidHT;
        }

        CultureInfo.s_NameCachedCultures = tempNameHT;

        // Finally, return our new CultureInfo object.
        return retval;
    }

    // Gets a cached copy of the specified culture from an internal hashtable (or creates it
    // if not found).  (LCID version)... use named version
    public static GetCultureInfo(culture: int): CultureInfo;
    // Gets a cached copy of the specified culture from an internal hashtable (or creates it
    // if not found).  (Named version)
    public static GetCultureInfo(name: string): CultureInfo;
    // Gets a cached copy of the specified culture from an internal hashtable (or creates it
    // if not found).
    public static GetCultureInfo(name: string, altName: string): CultureInfo;
    public static GetCultureInfo(...args: any[]): CultureInfo {
        if (args.length === 1 && is.int(args[0])) {
            const culture: int = args[0];
            // Must check for -1 now since the helper function uses the value to signal
            // the altCulture code path for SQL Server.
            // Also check for zero as this would fail trying to add as a key to the hash.
            if (culture <= 0) {
                throw new ArgumentOutOfRangeException("culture",
                    Environment.GetResourceString("ArgumentOutOfRange_NeedPosNum"));
            }
            /* Contract.Ensures(Contract.Result<CultureInfo>() != null);
            Contract.EndContractBlock(); */
            const retval: CultureInfo = CultureInfo.GetCultureInfoHelper(culture, null as any, null as any);
            if (null == retval) {
                throw new CultureNotFoundException("culture", culture, Environment.GetResourceString("Argument_CultureNotSupported"));
            }
            return retval;
        } else if (args.length === 1 && is.string(args[0])) {
            const name: string = args[0];
            // Make sure we have a valid, non-zero length string as name
            if (name == null) {
                throw new ArgumentNullException("name");
            }
            /* Contract.Ensures(Contract.Result<CultureInfo>() != null);
            Contract.EndContractBlock(); */

            const retval: CultureInfo = CultureInfo.GetCultureInfoHelper(0, name, null as any);
            if (retval == null) {
                throw new CultureNotFoundException("name", name, Environment.GetResourceString("Argument_CultureNotSupported"));

            }
            return retval;
        } else if (args.length === 2 && is.string(args[0]) && is.string(args[1])) {
            const name: string = args[0];
            const altName: string = args[1];

            // Make sure we have a valid, non-zero length string as name
            if (null == name) {
                throw new ArgumentNullException("name");
            }

            if (null == altName) {
                throw new ArgumentNullException("altName");
            }
            /* Contract.Ensures(Contract.Result<CultureInfo>() != null);
            Contract.EndContractBlock(); */

            const retval: CultureInfo = CultureInfo.GetCultureInfoHelper(-1, name, altName);
            if (retval == null) {
                throw new CultureNotFoundException("name or altName",
                    TString.Format(
                        /* CultureInfo.CurrentCulture, */
                        Environment.GetResourceString("Argument_OneOfCulturesNotSupported") + name + altName));
            }
            return retval;
        }
        throw new ArgumentException('');
    }



    // This function is deprecated, we don't like it
    public static GetCultureInfoByIetfLanguageTag(name: string): CultureInfo {
        //Contract.Ensures(Contract.Result<CultureInfo>() != null);

        // Disallow old zh-CHT/zh-CHS names
        if (name == "zh-CHT" || name == "zh-CHS") {
            throw new CultureNotFoundException("name" + TString.Format(/* CultureInfo.CurrentCulture, */ Environment.GetResourceString("Argument_CultureIetfNotSupported") + name)
            );
        }

        const ci: CultureInfo = CultureInfo.GetCultureInfo(name);

        // Disallow alt sorts and es-es_TS
        if (ci.LCID > 0xffff || ci.LCID === 0x040a) {
            throw new CultureNotFoundException("name", TString.Format(/* CultureInfo.CurrentCulture, */ Environment.GetResourceString("Argument_CultureIetfNotSupported"), name)
            );
        }

        return ci;
    }
    private static s_isTaiwanSku: boolean;
    private static s_haveIsTaiwanSku: boolean;
    public /* internal */ static get IsTaiwanSku(): boolean {
        if (!CultureInfo.s_haveIsTaiwanSku) {
            CultureInfo.s_isTaiwanSku = (CultureInfo.GetSystemDefaultUILanguage() === "zh-TW");
            CultureInfo.s_haveIsTaiwanSku = true;
        }
        return CultureInfo.s_isTaiwanSku;
    }


    private static GetDefaultLocaleName(localeType: int): string {
        //Contract.Assert(localeType == LOCALE_USER_DEFAULT || localeType == LOCALE_SYSTEM_DEFAULT, "[CultureInfo.GetDefaultLocaleName] localeType must be LOCALE_USER_DEFAULT or LOCALE_SYSTEM_DEFAULT");

        let localeName: Out<string> = New.Out(null as any);
        if (CultureInfo.InternalGetDefaultLocaleName(localeType, localeName)) {
            return localeName.value;
        }
        return TString.Empty;
    }

    private static InternalGetDefaultLocaleName(localetype: int, localeString: Out<string>): boolean {
        localeString.value = 'tr-TR';
        return true;
        // throw new NotImplementedException('InternalGetDefaultLocaleName');
    }
    private static GetUserDefaultUILanguage(): string {
        let userDefaultUiLanguage: Out<string> = New.Out(null as any);
        if (CultureInfo.InternalGetUserDefaultUILanguage(userDefaultUiLanguage)) {
            return userDefaultUiLanguage.value;
        }
        return TString.Empty;
    }

    private static InternalGetUserDefaultUILanguage(userDefaultUiLanguage: Out<string>): boolean {
        userDefaultUiLanguage.value = 'tr-TR';
        return true;
        // throw new NotImplementedException('InternalGetUserDefaultUILanguage');
    };
    private static GetSystemDefaultUILanguage(): string {
        let systemDefaultUiLanguage: string = null as any;
        if (CultureInfo.InternalGetSystemDefaultUILanguage(systemDefaultUiLanguage)) {
            return systemDefaultUiLanguage;
        }
        return TString.Empty;

    }
    private static InternalGetSystemDefaultUILanguage(systemDefaultUiLanguage: any): boolean {
        throw new NotImplementedException('InternalGetSystemDefaultUILanguage');
    }

    // Added but disabled from desktop in .NET 4.0, stayed disabled in .NET 4.5
    public /* internal */ static nativeGetResourceFallbackArray(): string[] {
        throw new NotImplementedException('nativeGetResourceFallbackArray');
    }

    //private static readonly  init:boolean  =false;
}


//
// List of culture data
// Note the we cache overrides.
// Note that localized names (resource names) aren't available from here.
//

//
// Our names are a tad confusing.
//
// sWindowsName -- The name that windows thinks this culture is, ie:
//                            en-US if you pass in en-US
//                            de-DE_phoneb if you pass in de-DE_phoneb
//                            fj-FJ if you pass in fj (neutral, on a pre-Windows 7 machine)
//                            fj if you pass in fj (neutral, post-Windows 7 machine)
//
// sRealName -- The name you used to construct the culture, in pretty form
//                       en-US if you pass in EN-us
//                       en if you pass in en
//                       de-DE_phoneb if you pass in de-DE_phoneb
//
// sSpecificCulture -- The specific culture for this culture
//                             en-US for en-US
//                             en-US for en
//                             de-DE_phoneb for alt sort
//                             fj-FJ for fj (neutral)
//
// sName -- The IETF name of this culture (ie: no sort info, could be neutral)
//                en-US if you pass in en-US
//                en if you pass in en
//                de-DE if you pass in de-DE_phoneb
//

// StructLayout is needed here otherwise compiler can re-arrange the fields.
// We have to keep this in-sync with the definition in comnlsinfo.h
//
// WARNING WARNING WARNING
//
// WARNING: Anything changed here also needs to be updated on the native side (object.h see type CultureDataBaseObject)
// WARNING: The type loader will rearrange class member offsets so the mscorwks!CultureDataBaseObject
// WARNING: must be manually structured to match the true loaded class layout
//
const undef: int = -1;

@ClassInfo({
    fullName: System.Types.Globalization.CultureData,
    instanceof: [
        System.Types.Globalization.CultureData
    ]
})
export class CultureData extends TObject {
    protected dispose(disposing: boolean): void {
        throw new Error("Method not implemented.");
    }

    // Override flag
    private sRealName: string = ''; // Name you passed in (ie: en-US, en, or de-DE_phoneb)
    private sWindowsName: string = ''; // Name OS thinks the object is (ie: de-DE_phoneb, or en-US (even if en was passed in))

    // Identity
    private sName: string = null as any; // locale name (ie: en-us, NO sort info, but could be neutral)
    private sParent: string = null as any; // Parent name (which may be a custom locale/culture)
    private sLocalizedDisplayName: string = null as any; // Localized pretty name for this locale
    private sEnglishDisplayName: string = null as any; // English pretty name for this locale
    private sNativeDisplayName: string = null as any; // Native pretty name for this locale
    private sSpecificCulture: string = null as any; // The culture name to be used in CultureInfo.CreateSpecificCulture(), en-US form if neutral, sort name if sort

    // Language
    private sISO639Language: string = null as any; // ISO 639 Language Name
    private sLocalizedLanguage: string = null as any; // Localized name for this language
    private sEnglishLanguage: string = null as any; // English name for this language
    private sNativeLanguage: string = null as any; // Native name of this language

    // Region
    private sRegionName: string = null as any; // (RegionInfo)
    //        private int    iCountry=undef           ; // (user can override) ---- code (RegionInfo)
    private iGeoId: int = undefined as any; // GeoId
    private sLocalizedCountry: string = null as any; // localized country name
    private sEnglishCountry: string = null as any; // english country name (RegionInfo)
    private sNativeCountry: string = null as any; // native country name
    private sISO3166CountryName: string = null as any; // ISO 3166 (RegionInfo), ie: US

    // Numbers
    private sPositiveSign: string = null as any; // (user can override) positive sign
    private sNegativeSign: string = null as any; // (user can override) negative sign
    private saNativeDigits: string[] = null as any; // (user can override) native characters for digits 0-9
    // (nfi populates these 5, don't have to be = undef)
    private iDigitSubstitution: int = 0; // (user can override) Digit substitution 0=context, 1=none/arabic, 2=Native/national (2 seems to be unused)
    private iLeadingZeros: int = 0; // (user can override) leading zeros 0 = no leading zeros, 1 = leading zeros
    private iDigits: int = 0; // (user can override) number of fractional digits
    private iNegativeNumber: int = 0; // (user can override) negative number format
    private waGrouping: IntArray = null as any; // (user can override) grouping of digits
    private sDecimalSeparator: string = null as any; // (user can override) decimal separator
    private sThousandSeparator: string = null as any; // (user can override) thousands separator
    private sNaN: string = ''; // Not a Number
    private sPositiveInfinity: string = null as any; // + Infinity
    private sNegativeInfinity: string = null as any; // - Infinity

    // Percent
    private iNegativePercent: int = undefined as any; // Negative Percent (0-3)
    private iPositivePercent: int = undefined as any; // Positive Percent (0-11)
    private sPercent: string = null as any; // Percent (%) symbol
    private sPerMille: string = null as any; // PerMille (‰) symbol

    // Currency
    private sCurrency: string = null as any; // (user can override) local monetary symbol
    private sIntlMonetarySymbol: string = null as any; // international monetary symbol (RegionInfo)
    private sEnglishCurrency: string = null as any; // English name for this currency
    private sNativeCurrency: string = null as any; // Native name for this currency
    // (nfi populates these 4, don't have to be = undef)
    private iCurrencyDigits: int = 0; // (user can override) # local monetary fractional digits
    private iCurrency: int = 0; // (user can override) positive currency format
    private iNegativeCurrency: int = 0; // (user can override) negative currency format
    private waMonetaryGrouping: IntArray = null as any; // (user can override) monetary grouping of digits
    private sMonetaryDecimal: string = null as any; // (user can override) monetary decimal separator
    private sMonetaryThousand: string = null as any; // (user can override) monetary thousands separator

    // Misc
    private iMeasure: int = undefined as any; // (user can override) system of measurement 0=metric, 1=US (RegionInfo)
    private sListSeparator: string = null as any; // (user can override) list separator
    //        private int    iPaperSize               ; // default paper size (RegionInfo)

    // Time
    private sAM1159: string = null as any; // (user can override) AM designator
    private sPM2359: string = null as any; // (user can override) PM designator
    private sTimeSeparator: string = null as any;
    private /* volatile */  saLongTimes: string[] = null as any; // (user can override) time format
    private /* volatile */  saShortTimes: string[] = null as any; // short time format
    private /* volatile */  saDurationFormats: string[] = null as any; // time duration format

    // Calendar specific data
    private iFirstDayOfWeek: int = undefined as any; // (user can override) first day of week (gregorian really)
    private iFirstWeekOfYear: int = undefined as any; // (user can override) first week of year (gregorian really)
    private waCalendars: IntArray = null as any; // all available calendar type(s).  The first one is the default calendar

    // Store for specific data about each calendar
    private calendars: CalendarData[] = null as any; // Store for specific calendar data

    // Text information
    private iReadingLayout: int = undefined as any; // Reading layout data
    // 0 - Left to right (eg en-US)
    // 1 - Right to left (eg arabic locales)
    // 2 - Vertical top to bottom with columns to the left and also left to right (ja-JP locales)
    // 3 - Vertical top to bottom with columns proceeding to the right

    private sTextInfo: string = null as any; // Text info name to use for custom
    private sCompareInfo: string = null as any; // Compare info name (including sorting key) to use if custom
    private sScripts: string = null as any; // Typical Scripts for this locale (latn;cyrl; etc)

    // CoreCLR depends on this even though its not exposed publicly.

    private iDefaultAnsiCodePage: int = undefined as any; // default ansi code page ID (ACP)
    private iDefaultOemCodePage: int = undefined as any; // default oem code page ID (OCP or OEM)
    private iDefaultMacCodePage: int = undefined as any; // default macintosh code page
    private iDefaultEbcdicCodePage: int = undefined as any; // default EBCDIC code page

    // These are desktop only, not coreclr
    private iLanguage: int = 0; // locale ID (0409) - NO sort information
    private sAbbrevLang: string = null as any; // abbreviated language name (Windows Language Name) ex: ENU
    private sAbbrevCountry: string = null as any; // abbreviated country name (RegionInfo) (Windows Region Name) ex: USA
    private sISO639Language2: string = null as any; // 3 char ISO 639 lang name 2 ex: eng
    private sISO3166CountryName2: string = null as any; // 3 char ISO 3166 country name 2 2(RegionInfo) ex: USA (ISO)
    private iInputLanguageHandle: int = undefined as any;// input language handle
    private sConsoleFallbackName: string = null as any; // The culture name for the console fallback UI culture
    private sKeyboardsToInstall: string = null as any; // Keyboard installation string.
    private fontSignature: string = null as any; // Font signature (16 WORDS)

    // The bools all need to be in one spot
    private bUseOverrides: boolean = false; // use user overrides?
    private bNeutral: boolean = false; // Flags for the culture (ie: neutral or not right now)

    private bWin32Installed: boolean = false; // Flags indicate if the culture is Win32 installed
    private bFramework: boolean = false; // Flags for indicate if the culture is one of Whidbey cultures

    // Region Name to Culture Name mapping table
    // (In future would be nice to be in registry or something)

    //Using a property so we avoid creating the dictionary untill we need it
    private static get RegionNames(): Dictionary<string, string> {
        if (CultureData.s_RegionNames == null) {
            const regionNames = new Dictionary<string, string>();
            regionNames.Add("029", "en-029");
            regionNames.Add("AE", "ar-AE");
            regionNames.Add("AF", "prs-AF");
            regionNames.Add("AL", "sq-AL");
            regionNames.Add("AM", "hy-AM");
            regionNames.Add("AR", "es-AR");
            regionNames.Add("AT", "de-AT");
            regionNames.Add("AU", "en-AU");
            regionNames.Add("AZ", "az-Cyrl-AZ");
            regionNames.Add("BA", "bs-Latn-BA");
            regionNames.Add("BD", "bn-BD");
            regionNames.Add("BE", "nl-BE");
            regionNames.Add("BG", "bg-BG");
            regionNames.Add("BH", "ar-BH");
            regionNames.Add("BN", "ms-BN");
            regionNames.Add("BO", "es-BO");
            regionNames.Add("BR", "pt-BR");
            regionNames.Add("BY", "be-BY");
            regionNames.Add("BZ", "en-BZ");
            regionNames.Add("CA", "en-CA");
            regionNames.Add("CH", "it-CH");
            regionNames.Add("CL", "es-CL");
            regionNames.Add("CN", "zh-CN");
            regionNames.Add("CO", "es-CO");
            regionNames.Add("CR", "es-CR");
            regionNames.Add("CS", "sr-Cyrl-CS");
            regionNames.Add("CZ", "cs-CZ");
            regionNames.Add("DE", "de-DE");
            regionNames.Add("DK", "da-DK");
            regionNames.Add("DO", "es-DO");
            regionNames.Add("DZ", "ar-DZ");
            regionNames.Add("EC", "es-EC");
            regionNames.Add("EE", "et-EE");
            regionNames.Add("EG", "ar-EG");
            regionNames.Add("ES", "es-ES");
            regionNames.Add("ET", "am-ET");
            regionNames.Add("FI", "fi-FI");
            regionNames.Add("FO", "fo-FO");
            regionNames.Add("FR", "fr-FR");
            regionNames.Add("GB", "en-GB");
            regionNames.Add("GE", "ka-GE");
            regionNames.Add("GL", "kl-GL");
            regionNames.Add("GR", "el-GR");
            regionNames.Add("GT", "es-GT");
            regionNames.Add("HK", "zh-HK");
            regionNames.Add("HN", "es-HN");
            regionNames.Add("HR", "hr-HR");
            regionNames.Add("HU", "hu-HU");
            regionNames.Add("ID", "id-ID");
            regionNames.Add("IE", "en-IE");
            regionNames.Add("IL", "he-IL");
            regionNames.Add("IN", "hi-IN");
            regionNames.Add("IQ", "ar-IQ");
            regionNames.Add("IR", "fa-IR");
            regionNames.Add("IS", "is-IS");
            regionNames.Add("IT", "it-IT");
            regionNames.Add("IV", "");
            regionNames.Add("JM", "en-JM");
            regionNames.Add("JO", "ar-JO");
            regionNames.Add("JP", "ja-JP");
            regionNames.Add("KE", "sw-KE");
            regionNames.Add("KG", "ky-KG");
            regionNames.Add("KH", "km-KH");
            regionNames.Add("KR", "ko-KR");
            regionNames.Add("KW", "ar-KW");
            regionNames.Add("KZ", "kk-KZ");
            regionNames.Add("LA", "lo-LA");
            regionNames.Add("LB", "ar-LB");
            regionNames.Add("LI", "de-LI");
            regionNames.Add("LK", "si-LK");
            regionNames.Add("LT", "lt-LT");
            regionNames.Add("LU", "lb-LU");
            regionNames.Add("LV", "lv-LV");
            regionNames.Add("LY", "ar-LY");
            regionNames.Add("MA", "ar-MA");
            regionNames.Add("MC", "fr-MC");
            regionNames.Add("ME", "sr-Latn-ME");
            regionNames.Add("MK", "mk-MK");
            regionNames.Add("MN", "mn-MN");
            regionNames.Add("MO", "zh-MO");
            regionNames.Add("MT", "mt-MT");
            regionNames.Add("MV", "dv-MV");
            regionNames.Add("MX", "es-MX");
            regionNames.Add("MY", "ms-MY");
            regionNames.Add("NG", "ig-NG");
            regionNames.Add("NI", "es-NI");
            regionNames.Add("NL", "nl-NL");
            regionNames.Add("NO", "nn-NO");
            regionNames.Add("NP", "ne-NP");
            regionNames.Add("NZ", "en-NZ");
            regionNames.Add("OM", "ar-OM");
            regionNames.Add("PA", "es-PA");
            regionNames.Add("PE", "es-PE");
            regionNames.Add("PH", "en-PH");
            regionNames.Add("PK", "ur-PK");
            regionNames.Add("PL", "pl-PL");
            regionNames.Add("PR", "es-PR");
            regionNames.Add("PT", "pt-PT");
            regionNames.Add("PY", "es-PY");
            regionNames.Add("QA", "ar-QA");
            regionNames.Add("RO", "ro-RO");
            regionNames.Add("RS", "sr-Latn-RS");
            regionNames.Add("RU", "ru-RU");
            regionNames.Add("RW", "rw-RW");
            regionNames.Add("SA", "ar-SA");
            regionNames.Add("SE", "sv-SE");
            regionNames.Add("SG", "zh-SG");
            regionNames.Add("SI", "sl-SI");
            regionNames.Add("SK", "sk-SK");
            regionNames.Add("SN", "wo-SN");
            regionNames.Add("SV", "es-SV");
            regionNames.Add("SY", "ar-SY");
            regionNames.Add("TH", "th-TH");
            regionNames.Add("TJ", "tg-Cyrl-TJ");
            regionNames.Add("TM", "tk-TM");
            regionNames.Add("TN", "ar-TN");
            regionNames.Add("TR", "tr-TR");
            regionNames.Add("TT", "en-TT");
            regionNames.Add("TW", "zh-TW");
            regionNames.Add("UA", "uk-UA");
            regionNames.Add("US", "en-US");
            regionNames.Add("UY", "es-UY");
            regionNames.Add("UZ", "uz-Cyrl-UZ");
            regionNames.Add("VE", "es-VE");
            regionNames.Add("VN", "vi-VN");
            regionNames.Add("YE", "ar-YE");
            regionNames.Add("ZA", "af-ZA");
            regionNames.Add("ZW", "en-ZW");
            CultureData.s_RegionNames = regionNames;

            return CultureData.s_RegionNames;
        }
        return null as any
    }

    private static s_RegionNames: Dictionary<string, string>;

    /////////////////////////////////////////////////////////////////////////
    // Build our invariant information
    //
    // We need an invariant instance, which we build hard-coded
    /////////////////////////////////////////////////////////////////////////
    public /* internal */ static get Invariant(): CultureData {
        if (CultureData.s_Invariant == null) {
            // Make a new culturedata
            const invariant: CultureData = new CultureData();



            // Basics
            // Note that we override the resources since this IS NOT supposed to change (by definition)
            invariant.bUseOverrides = false;
            invariant.sRealName = "";                     // Name you passed in (ie: en-US, en, or de-DE_phoneb)
            invariant.sWindowsName = "";                     // Name OS thinks the object is (ie: de-DE_phoneb, or en-US (even if en was passed in))

            // Identity
            invariant.sName = "";                     // locale name (ie: en-us)
            invariant.sParent = "";                     // Parent name (which may be a custom locale/culture)
            invariant.bNeutral = false;                   // Flags for the culture (ie: neutral or not right now)


            invariant.sEnglishDisplayName = "Invariant Language (Invariant Country)"; // English pretty name for this locale
            invariant.sNativeDisplayName = "Invariant Language (Invariant Country)";  // Native pretty name for this locale
            invariant.sSpecificCulture = "";                     // The culture name to be used in CultureInfo.CreateSpecificCulture()

            // Language
            invariant.sISO639Language = "iv";                   // ISO 639 Language Name
            invariant.sLocalizedLanguage = "Invariant Language";   // Display name for this Language
            invariant.sEnglishLanguage = "Invariant Language";   // English name for this language
            invariant.sNativeLanguage = "Invariant Language";   // Native name of this language

            // Region
            invariant.sRegionName = "IV";                   // (RegionInfo)
            // Unused for now:
            //            invariant.iCountry              =1;                      // ---- code (RegionInfo)
            invariant.iGeoId = 244;                    // GeoId (Windows Only)
            invariant.sEnglishCountry = "Invariant Country";    // english country name (RegionInfo)
            invariant.sNativeCountry = "Invariant Country";    // native country name (Windows Only)
            invariant.sISO3166CountryName = "IV";                   // (RegionInfo), ie: US

            // Numbers
            invariant.sPositiveSign = "+";                    // positive sign
            invariant.sNegativeSign = "-";                    // negative sign
            invariant.saNativeDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]; // native characters for digits 0-9
            invariant.iDigitSubstitution = 1;                      // Digit substitution 0=context, 1=none/arabic, 2=Native/national (2 seems to be unused) (Windows Only)
            invariant.iLeadingZeros = 1;                      // leading zeros 0=no leading zeros, 1=leading zeros
            invariant.iDigits = 2;                      // number of fractional digits
            invariant.iNegativeNumber = 1;                      // negative number format
            invariant.waGrouping = New.IntArray(3);          // grouping of digits
            invariant.sDecimalSeparator = ".";                    // decimal separator
            invariant.sThousandSeparator = ",";                    // thousands separator
            invariant.sNaN = "NaN";                  // Not a Number
            invariant.sPositiveInfinity = "Infinity";             // + Infinity
            invariant.sNegativeInfinity = "-Infinity";            // - Infinity

            // Percent
            invariant.iNegativePercent = 0;                      // Negative Percent (0-3)
            invariant.iPositivePercent = 0;                      // Positive Percent (0-11)
            invariant.sPercent = "%";                    // Percent (%) symbol
            invariant.sPerMille = "\x2030";               // PerMille(‰) symbol

            // Currency
            invariant.sCurrency = "\x00a4";                // local monetary symbol "¤: for international monetary symbol
            invariant.sIntlMonetarySymbol = "XDR";                  // international monetary symbol (RegionInfo)
            invariant.sEnglishCurrency = "International Monetary Fund"; // English name for this currency (Windows Only)
            invariant.sNativeCurrency = "International Monetary Fund"; // Native name for this currency (Windows Only)
            invariant.iCurrencyDigits = 2;                      // # local monetary fractional digits
            invariant.iCurrency = 0;                      // positive currency format
            invariant.iNegativeCurrency = 0;                      // negative currency format
            invariant.waMonetaryGrouping = New.IntArray(3);          // monetary grouping of digits
            invariant.sMonetaryDecimal = ".";                    // monetary decimal separator
            invariant.sMonetaryThousand = ",";                    // monetary thousands separator

            // Misc
            invariant.iMeasure = 0;                      // system of measurement 0=metric, 1=US (RegionInfo)
            invariant.sListSeparator = ",";                    // list separator
            // Unused for now:
            //            invariant.iPaperSize            =9;                      // default paper size (RegionInfo)
            //            invariant.waFontSignature       ="\x0002\x0000\x0000\x0000\x0000\x0000\x0000\x8000\x0001\x0000\x0000\x8000\x0001\x0000\x0000\x8000"; // Font signature (16 WORDS) (Windows Only)

            // Time
            invariant.sAM1159 = "AM";                   // AM designator
            invariant.sPM2359 = "PM";                   // PM designator
            invariant.saLongTimes = ["HH:mm:ss"];                             // time format
            invariant.saShortTimes = ["HH:mm", "hh:mm tt", "H:mm", "h:mm tt"]; // short time format
            invariant.saDurationFormats = ["HH:mm:ss"];                             // time duration format

            // Calendar specific data
            invariant.iFirstDayOfWeek = 0;                      // first day of week
            invariant.iFirstWeekOfYear = 0;                      // first week of year
            //invariant.waCalendars = New.IntArray(CalendarData.GREGORIAN);       // all available calendar type(s).  The first one is the default calendar

            // Store for specific data about each calendar
            invariant.calendars = New.Array(CalendarData.MAX_CALENDARS);
            invariant.calendars[0] = CalendarData.Invariant;

            // Text information
            invariant.iReadingLayout = 0;                      // Reading Layout = RTL

            invariant.sTextInfo = "";                     // Text info name to use for custom
            invariant.sCompareInfo = "";                     // Compare info name (including sorting key) to use if custom
            invariant.sScripts = "Latn;";                // Typical Scripts for this locale (latn,cyrl, etc)

            // These are desktop only, not coreclr
            invariant.iLanguage = 0x007f;                 // locale ID (0409) - NO sort information
            invariant.iDefaultAnsiCodePage = 1252;                   // default ansi code page ID (ACP)
            invariant.iDefaultOemCodePage = 437;                    // default oem code page ID (OCP or OEM)
            invariant.iDefaultMacCodePage = 10000;                  // default macintosh code page
            invariant.iDefaultEbcdicCodePage = 0x37;                    // default EBCDIC code page
            invariant.sAbbrevLang = "IVL";                  // abbreviated language name (Windows Language Name)
            invariant.sAbbrevCountry = "IVC";                  // abbreviated country name (RegionInfo) (Windows Region Name)
            invariant.sISO639Language2 = "ivl";                  // 3 char ISO 639 lang name 2
            invariant.sISO3166CountryName2 = "ivc";                  // 3 char ISO 3166 country name 2 2(RegionInfo)
            invariant.iInputLanguageHandle = 0x007f;                 // input language handle
            invariant.sConsoleFallbackName = "";                     // The culture name for the console fallback UI culture
            invariant.sKeyboardsToInstall = "0409:00000409";        // Keyboard installation string.
            // Remember it
            CultureData.s_Invariant = invariant;
        }
        return CultureData.s_Invariant;
    }

    private static s_Invariant: CultureData;

    ///////////////
    // Constructors //
    ///////////////
    // Cache of cultures we've already looked up
    private static /* volatile */  s_cachedCultures: Dictionary<string, CultureData>;

    public /* internal */ static GetCultureData(cultureName: string, useUserOverride: boolean): CultureData;
    public /* internal */ static GetCultureData(culture: int, bUseUserOverride: boolean): CultureData;
    public /* internal */ static GetCultureData(...args: any[]): CultureData {
        if (args.length === 2 && is.string(args[0]) && is.boolean(args[1])) {
            let cultureName: string = args[0];
            const useUserOverride: boolean = args[1];
            // First do a shortcut for Invariant
            if (TString.IsNullOrEmpty(cultureName)) {
                return CultureData.Invariant;
            }

            if (CompatibilitySwitches.IsAppEarlierThanWindowsPhone8) {
                // WinCE named some locales differently than Windows.
                if (TString.Equals(cultureName, "iw", StringComparison.OrdinalIgnoreCase)) {
                    cultureName = "he";
                }
                else if (TString.Equals(cultureName, "tl", StringComparison.OrdinalIgnoreCase)) {
                    cultureName = "fil";
                }
                else if (TString.Equals(cultureName, "english", StringComparison.OrdinalIgnoreCase)) {
                    cultureName = "en";
                }
            }

            // Try the hash table first
            const hashName: string = CultureData.AnsiToLower(useUserOverride ? cultureName : cultureName + '*');
            let tempHashTable: Dictionary<string, CultureData> = CultureData.s_cachedCultures;
            if (tempHashTable == null) {
                // No table yet, make a new one
                tempHashTable = new Dictionary<string, CultureData>();
            }
            else {
                // Check the hash table
                let retVal: Out<CultureData> = New.Out(null as any);
                /*  lock(((ICollection)tempHashTable).SyncRoot)
                 { */
                tempHashTable.TryGetValue(hashName, retVal);
                //}
                if (retVal.value != null) {
                    return retVal.value;
                }
            }

            // Not found in the hash table, need to see if we can build one that works for us
            const culture: CultureData = CultureData.CreateCultureData(cultureName, useUserOverride);
            if (culture == null) {
                return null as any;
            }

            // Found one, add it to the cache
            /* lock(((ICollection)tempHashTable).SyncRoot)
            { */
            tempHashTable.Set(hashName, culture);
            //}

            // Copy the hashtable to the corresponding member variables.  This will potentially overwrite
            // new tables simultaneously created by a new thread, but maximizes thread safety.
            CultureData.s_cachedCultures = tempHashTable;

            return culture;
        } else if (args.length === 2 && is.int(args[0]) && is.boolean(args[1])) {
            const culture: int = args[0];
            const bUseUserOverride: boolean = args[1];
            let localeName: string = null as any;
            let retVal: CultureData = null as any;

            if (localeName == null) {
                // Convert the lcid to a name, then use that
                // Note that this'll return neutral names (unlike Vista native API)
                localeName = CultureData.LCIDToLocaleName(culture);
            }

            // If its not valid, then throw
            if (TString.IsNullOrEmpty(localeName)) {
                // Could be valid for Invariant
                if (culture === 0x007f)
                    return CultureData.Invariant;
            }
            else {
                // Valid name, use it
                retVal = CultureData.GetCultureData(localeName, bUseUserOverride);
            }

            // If not successful, throw
            if (retVal == null)
                throw new CultureNotFoundException("culture" + culture + Environment.GetResourceString("Argument_CultureNotSupported"));

            // Return the one we found
            return retVal;
        }
        throw new ArgumentException('');

    }



    private static CreateCultureData(cultureName: string, useUserOverride: boolean): CultureData {
        const culture: CultureData = new CultureData();
        culture.bUseOverrides = useUserOverride;
        culture.sRealName = cultureName;

        // Ask native code if that one's real
        if (culture.InitCultureData() === false) {
            return null as any;
        }

        return culture;
    }

    private InitCultureData(): boolean {
        if (CultureData.nativeInitCultureData(this) === false) {
            return false;
        }
        return true;
    }

    // Cache of regions we've already looked up
    private static /* volatile */  s_cachedRegions: Dictionary<string, CultureData>;

    public /* internal */ static GetCultureDataForRegion(cultureName: string, useUserOverride: boolean): CultureData {
        // First do a shortcut for Invariant
        if (String.IsNullOrEmpty(cultureName)) {
            return CultureData.Invariant;
        }

        //
        // First check if GetCultureData() can find it (ie: its a real culture)
        //
        const retVal: Out<CultureData> = New.Out(CultureData.GetCultureData(cultureName, useUserOverride));
        if (retVal.value != null && retVal.value.IsNeutralCulture === false)
            return retVal.value;

        //
        // Not a specific culture, perhaps it's region-only name
        // (Remember this isn't a core clr path where that's not supported)
        //

        // If it was neutral remember that so that RegionInfo() can throw the right exception
        let neutral: CultureData = retVal.value;

        // Try the hash table next
        const hashName: string = CultureData.AnsiToLower(useUserOverride ? cultureName : cultureName + '*');
        let tempHashTable: Dictionary<string, CultureData> = CultureData.s_cachedRegions;
        if (tempHashTable == null) {
            // No table yet, make a new one
            tempHashTable = new Dictionary<string, CultureData>();
        }
        else {
            // Check the hash table
            /* lock(((ICollection)tempHashTable).SyncRoot)
            { */
            tempHashTable.TryGetValue(hashName, retVal);
            //}
            if (retVal.value != null) {
                return retVal.value;
            }
        }

        // If not found in the hard coded table we'll have to find a culture that works for us
        if (retVal.value == null || (retVal.value.IsNeutralCulture === true)) {
            // Not found in the hard coded table, need to see if we can find a culture that works for us
            // Not a real culture name, see if it matches a region name
            // (we just return the first culture we match)
            const specifics: CultureInfo[] = CultureData.SpecificCultures;
            for (let i: int = 0; i < specifics.length; i++) {
                if (TString.Compare(specifics[i].m_cultureData.SREGIONNAME, cultureName, StringComparison.OrdinalIgnoreCase) === 0) {
                    // Matched, use this culture
                    retVal.value = specifics[i].m_cultureData;
                    break;
                }
            }
        }

        // If we found one we can use, then cash it for next time
        if (retVal != null && (retVal.value.IsNeutralCulture === false)) {
            // first add it to the cache
            /* lock(((ICollection)tempHashTable).SyncRoot)
            { */
            tempHashTable.Set(hashName, retVal.value);
            //}

            // Copy the hashtable to the corresponding member variables.  This will potentially overwrite
            // new tables simultaneously created by a new thread, but maximizes thread safety.
            CultureData.s_cachedRegions = tempHashTable;
        }
        else {
            // Unable to find a matching culture/region, return null or neutral
            // (regionInfo throws a more specific exception on neutrals)
            retVal.value = neutral;
        }

        // Return the found culture to use, null, or the neutral culture.
        return retVal.value;
    }


    // Obtain locale name from LCID
    // NOTE: This will get neutral names, unlike the OS API
    /*  [System.Security.SecuritySafeCritical]  // auto-generated
     [ResourceExposure(ResourceScope.None)]
     [MethodImplAttribute(MethodImplOptions.InternalCall)] */
    public /* internal */ static LCIDToLocaleName(lcid: int): string {
        switch (lcid) {
            case 127:
                return '';
            case 4096:
                return 'aa';
            case 4096:
                return 'aa-DJ';
            case 4096:
                return 'aa-ER';
            case 4096:
                return 'aa-ET';
            case 54:
                return 'af';
            case 4096:
                return 'af-NA';
            case 1078:
                return 'af-ZA';
            case 4096:
                return 'agq';
            case 4096:
                return 'agq-CM';
            case 4096:
                return 'ak';
            case 4096:
                return 'ak-GH';
            case 94:
                return 'am';
            case 1118:
                return 'am-ET';
            case 1:
                return 'ar';
            case 4096:
                return 'ar-001';
            case 14337:
                return 'ar-AE';
            case 15361:
                return 'ar-BH';
            case 4096:
                return 'ar-DJ';
            case 5121:
                return 'ar-DZ';
            case 3073:
                return 'ar-EG';
            case 4096:
                return 'ar-ER';
            case 4096:
                return 'ar-IL';
            case 2049:
                return 'ar-IQ';
            case 11265:
                return 'ar-JO';
            case 4096:
                return 'ar-KM';
            case 13313:
                return 'ar-KW';
            case 12289:
                return 'ar-LB';
            case 4097:
                return 'ar-LY';
            case 6145:
                return 'ar-MA';
            case 4096:
                return 'ar-MR';
            case 8193:
                return 'ar-OM';
            case 4096:
                return 'ar-PS';
            case 16385:
                return 'ar-QA';
            case 1025:
                return 'ar-SA';
            case 4096:
                return 'ar-SD';
            case 4096:
                return 'ar-SO';
            case 4096:
                return 'ar-SS';
            case 10241:
                return 'ar-SY';
            case 4096:
                return 'ar-TD';
            case 7169:
                return 'ar-TN';
            case 9217:
                return 'ar-YE';
            case 122:
                return 'arn';
            case 1146:
                return 'arn-CL';
            case 77:
                return 'as';
            case 1101:
                return 'as-IN';
            case 4096:
                return 'asa';
            case 4096:
                return 'asa-TZ';
            case 4096:
                return 'ast';
            case 4096:
                return 'ast-ES';
            case 44:
                return 'az';
            case 29740:
                return 'az-Cyrl';
            case 2092:
                return 'az-Cyrl-AZ';
            case 30764:
                return 'az-Latn';
            case 1068:
                return 'az-Latn-AZ';
            case 109:
                return 'ba';
            case 1133:
                return 'ba-RU';
            case 4096:
                return 'bas';
            case 4096:
                return 'bas-CM';
            case 35:
                return 'be';
            case 1059:
                return 'be-BY';
            case 4096:
                return 'bem';
            case 4096:
                return 'bem-ZM';
            case 4096:
                return 'bez';
            case 4096:
                return 'bez-TZ';
            case 2:
                return 'bg';
            case 1026:
                return 'bg-BG';
            case 102:
                return 'bin';
            case 1126:
                return 'bin-NG';
            case 4096:
                return 'bm';
            case 4096:
                return 'bm-Latn';
            case 4096:
                return 'bm-Latn-ML';
            case 69:
                return 'bn';
            case 2117:
                return 'bn-BD';
            case 1093:
                return 'bn-IN';
            case 81:
                return 'bo';
            case 1105:
                return 'bo-CN';
            case 4096:
                return 'bo-IN';
            case 126:
                return 'br';
            case 1150:
                return 'br-FR';
            case 4096:
                return 'brx';
            case 4096:
                return 'brx-IN';
            case 30746:
                return 'bs';
            case 25626:
                return 'bs-Cyrl';
            case 8218:
                return 'bs-Cyrl-BA';
            case 26650:
                return 'bs-Latn';
            case 5146:
                return 'bs-Latn-BA';
            case 4096:
                return 'byn';
            case 4096:
                return 'byn-ER';
            case 3:
                return 'ca';
            case 4096:
                return 'ca-AD';
            case 1027:
                return 'ca-ES';
            case 2051:
                return 'ca-ES-valencia';
            case 4096:
                return 'ca-FR';
            case 4096:
                return 'ca-IT';
            case 4096:
                return 'ccp';
            case 4096:
                return 'ccp-Cakm';
            case 4096:
                return 'ccp-Cakm-BD';
            case 4096:
                return 'ccp-Cakm-IN';
            case 4096:
                return 'ce';
            case 4096:
                return 'ce-RU';
            case 4096:
                return 'ceb';
            case 4096:
                return 'ceb-Latn';
            case 4096:
                return 'ceb-Latn-PH';
            case 4096:
                return 'cgg';
            case 4096:
                return 'cgg-UG';
            case 92:
                return 'chr';
            case 31836:
                return 'chr-Cher';
            case 1116:
                return 'chr-Cher-US';
            case 131:
                return 'co';
            case 1155:
                return 'co-FR';
            case 5:
                return 'cs';
            case 1029:
                return 'cs-CZ';
            case 4096:
                return 'cu';
            case 4096:
                return 'cu-RU';
            case 82:
                return 'cy';
            case 1106:
                return 'cy-GB';
            case 6:
                return 'da';
            case 1030:
                return 'da-DK';
            case 4096:
                return 'da-GL';
            case 4096:
                return 'dav';
            case 4096:
                return 'dav-KE';
            case 7:
                return 'de';
            case 3079:
                return 'de-AT';
            case 4096:
                return 'de-BE';
            case 2055:
                return 'de-CH';
            case 1031:
                return 'de-DE';
            case 4096:
                return 'de-IT';
            case 5127:
                return 'de-LI';
            case 4103:
                return 'de-LU';
            case 4096:
                return 'dje';
            case 4096:
                return 'dje-NE';
            case 31790:
                return 'dsb';
            case 2094:
                return 'dsb-DE';
            case 4096:
                return 'dua';
            case 4096:
                return 'dua-CM';
            case 101:
                return 'dv';
            case 1125:
                return 'dv-MV';
            case 4096:
                return 'dyo';
            case 4096:
                return 'dyo-SN';
            case 4096:
                return 'dz';
            case 3153:
                return 'dz-BT';
            case 4096:
                return 'ebu';
            case 4096:
                return 'ebu-KE';
            case 4096:
                return 'ee';
            case 4096:
                return 'ee-GH';
            case 4096:
                return 'ee-TG';
            case 8:
                return 'el';
            case 4096:
                return 'el-CY';
            case 1032:
                return 'el-GR';
            case 9:
                return 'en';
            case 4096:
                return 'en-001';
            case 9225:
                return 'en-029';
            case 4096:
                return 'en-150';
            case 19465:
                return 'en-AE';
            case 4096:
                return 'en-AG';
            case 4096:
                return 'en-AI';
            case 4096:
                return 'en-AS';
            case 4096:
                return 'en-AT';
            case 3081:
                return 'en-AU';
            case 4096:
                return 'en-BB';
            case 4096:
                return 'en-BE';
            case 4096:
                return 'en-BI';
            case 4096:
                return 'en-BM';
            case 4096:
                return 'en-BS';
            case 4096:
                return 'en-BW';
            case 10249:
                return 'en-BZ';
            case 4105:
                return 'en-CA';
            case 4096:
                return 'en-CC';
            case 4096:
                return 'en-CH';
            case 4096:
                return 'en-CK';
            case 4096:
                return 'en-CM';
            case 4096:
                return 'en-CX';
            case 4096:
                return 'en-CY';
            case 4096:
                return 'en-DE';
            case 4096:
                return 'en-DK';
            case 4096:
                return 'en-DM';
            case 4096:
                return 'en-ER';
            case 4096:
                return 'en-FI';
            case 4096:
                return 'en-FJ';
            case 4096:
                return 'en-FK';
            case 4096:
                return 'en-FM';
            case 2057:
                return 'en-GB';
            case 4096:
                return 'en-GD';
            case 4096:
                return 'en-GG';
            case 4096:
                return 'en-GH';
            case 4096:
                return 'en-GI';
            case 4096:
                return 'en-GM';
            case 4096:
                return 'en-GU';
            case 4096:
                return 'en-GY';
            case 15369:
                return 'en-HK';
            case 14345:
                return 'en-ID';
            case 6153:
                return 'en-IE';
            case 4096:
                return 'en-IL';
            case 4096:
                return 'en-IM';
            case 16393:
                return 'en-IN';
            case 4096:
                return 'en-IO';
            case 4096:
                return 'en-JE';
            case 8201:
                return 'en-JM';
            case 4096:
                return 'en-KE';
            case 4096:
                return 'en-KI';
            case 4096:
                return 'en-KN';
            case 4096:
                return 'en-KY';
            case 4096:
                return 'en-LC';
            case 4096:
                return 'en-LR';
            case 4096:
                return 'en-LS';
            case 4096:
                return 'en-MG';
            case 4096:
                return 'en-MH';
            case 4096:
                return 'en-MO';
            case 4096:
                return 'en-MP';
            case 4096:
                return 'en-MS';
            case 4096:
                return 'en-MT';
            case 4096:
                return 'en-MU';
            case 4096:
                return 'en-MW';
            case 17417:
                return 'en-MY';
            case 4096:
                return 'en-NA';
            case 4096:
                return 'en-NF';
            case 4096:
                return 'en-NG';
            case 4096:
                return 'en-NL';
            case 4096:
                return 'en-NR';
            case 4096:
                return 'en-NU';
            case 5129:
                return 'en-NZ';
            case 4096:
                return 'en-PG';
            case 13321:
                return 'en-PH';
            case 4096:
                return 'en-PK';
            case 4096:
                return 'en-PN';
            case 4096:
                return 'en-PR';
            case 4096:
                return 'en-PW';
            case 4096:
                return 'en-RW';
            case 4096:
                return 'en-SB';
            case 4096:
                return 'en-SC';
            case 4096:
                return 'en-SD';
            case 4096:
                return 'en-SE';
            case 18441:
                return 'en-SG';
            case 4096:
                return 'en-SH';
            case 4096:
                return 'en-SI';
            case 4096:
                return 'en-SL';
            case 4096:
                return 'en-SS';
            case 4096:
                return 'en-SX';
            case 4096:
                return 'en-SZ';
            case 4096:
                return 'en-TC';
            case 4096:
                return 'en-TK';
            case 4096:
                return 'en-TO';
            case 11273:
                return 'en-TT';
            case 4096:
                return 'en-TV';
            case 4096:
                return 'en-TZ';
            case 4096:
                return 'en-UG';
            case 4096:
                return 'en-UM';
            case 1033:
                return 'en-US';
            case 4096:
                return 'en-VC';
            case 4096:
                return 'en-VG';
            case 4096:
                return 'en-VI';
            case 4096:
                return 'en-VU';
            case 4096:
                return 'en-WS';
            case 7177:
                return 'en-ZA';
            case 4096:
                return 'en-ZM';
            case 12297:
                return 'en-ZW';
            case 4096:
                return 'eo';
            case 4096:
                return 'eo-001';
            case 10:
                return 'es';
            case 22538:
                return 'es-419';
            case 11274:
                return 'es-AR';
            case 16394:
                return 'es-BO';
            case 4096:
                return 'es-BR';
            case 4096:
                return 'es-BZ';
            case 13322:
                return 'es-CL';
            case 9226:
                return 'es-CO';
            case 5130:
                return 'es-CR';
            case 23562:
                return 'es-CU';
            case 7178:
                return 'es-DO';
            case 12298:
                return 'es-EC';
            case 3082:
                return 'es-ES';
            case 4096:
                return 'es-GQ';
            case 4106:
                return 'es-GT';
            case 18442:
                return 'es-HN';
            case 2058:
                return 'es-MX';
            case 19466:
                return 'es-NI';
            case 6154:
                return 'es-PA';
            case 10250:
                return 'es-PE';
            case 4096:
                return 'es-PH';
            case 20490:
                return 'es-PR';
            case 15370:
                return 'es-PY';
            case 17418:
                return 'es-SV';
            case 21514:
                return 'es-US';
            case 14346:
                return 'es-UY';
            case 8202:
                return 'es-VE';
            case 37:
                return 'et';
            case 1061:
                return 'et-EE';
            case 45:
                return 'eu';
            case 1069:
                return 'eu-ES';
            case 4096:
                return 'ewo';
            case 4096:
                return 'ewo-CM';
            case 41:
                return 'fa';
            case 1065:
                return 'fa-IR';
            case 103:
                return 'ff';
            case 31847:
                return 'ff-Latn';
            case 4096:
                return 'ff-Latn-BF';
            case 4096:
                return 'ff-Latn-CM';
            case 4096:
                return 'ff-Latn-GH';
            case 4096:
                return 'ff-Latn-GM';
            case 4096:
                return 'ff-Latn-GN';
            case 4096:
                return 'ff-Latn-GW';
            case 4096:
                return 'ff-Latn-LR';
            case 4096:
                return 'ff-Latn-MR';
            case 4096:
                return 'ff-Latn-NE';
            case 1127:
                return 'ff-Latn-NG';
            case 4096:
                return 'ff-Latn-SL';
            case 2151:
                return 'ff-Latn-SN';
            case 11:
                return 'fi';
            case 1035:
                return 'fi-FI';
            case 100:
                return 'fil';
            case 1124:
                return 'fil-PH';
            case 56:
                return 'fo';
            case 4096:
                return 'fo-DK';
            case 1080:
                return 'fo-FO';
            case 12:
                return 'fr';
            case 7180:
                return 'fr-029';
            case 2060:
                return 'fr-BE';
            case 4096:
                return 'fr-BF';
            case 4096:
                return 'fr-BI';
            case 4096:
                return 'fr-BJ';
            case 4096:
                return 'fr-BL';
            case 3084:
                return 'fr-CA';
            case 9228:
                return 'fr-CD';
            case 4096:
                return 'fr-CF';
            case 4096:
                return 'fr-CG';
            case 4108:
                return 'fr-CH';
            case 12300:
                return 'fr-CI';
            case 11276:
                return 'fr-CM';
            case 4096:
                return 'fr-DJ';
            case 4096:
                return 'fr-DZ';
            case 1036:
                return 'fr-FR';
            case 4096:
                return 'fr-GA';
            case 4096:
                return 'fr-GF';
            case 4096:
                return 'fr-GN';
            case 4096:
                return 'fr-GP';
            case 4096:
                return 'fr-GQ';
            case 15372:
                return 'fr-HT';
            case 4096:
                return 'fr-KM';
            case 5132:
                return 'fr-LU';
            case 14348:
                return 'fr-MA';
            case 6156:
                return 'fr-MC';
            case 4096:
                return 'fr-MF';
            case 4096:
                return 'fr-MG';
            case 13324:
                return 'fr-ML';
            case 4096:
                return 'fr-MQ';
            case 4096:
                return 'fr-MR';
            case 4096:
                return 'fr-MU';
            case 4096:
                return 'fr-NC';
            case 4096:
                return 'fr-NE';
            case 4096:
                return 'fr-PF';
            case 4096:
                return 'fr-PM';
            case 8204:
                return 'fr-RE';
            case 4096:
                return 'fr-RW';
            case 4096:
                return 'fr-SC';
            case 10252:
                return 'fr-SN';
            case 4096:
                return 'fr-SY';
            case 4096:
                return 'fr-TD';
            case 4096:
                return 'fr-TG';
            case 4096:
                return 'fr-TN';
            case 4096:
                return 'fr-VU';
            case 4096:
                return 'fr-WF';
            case 4096:
                return 'fr-YT';
            case 4096:
                return 'fur';
            case 4096:
                return 'fur-IT';
            case 98:
                return 'fy';
            case 1122:
                return 'fy-NL';
            case 60:
                return 'ga';
            case 2108:
                return 'ga-IE';
            case 145:
                return 'gd';
            case 1169:
                return 'gd-GB';
            case 86:
                return 'gl';
            case 1110:
                return 'gl-ES';
            case 116:
                return 'gn';
            case 1140:
                return 'gn-PY';
            case 132:
                return 'gsw';
            case 4096:
                return 'gsw-CH';
            case 1156:
                return 'gsw-FR';
            case 4096:
                return 'gsw-LI';
            case 71:
                return 'gu';
            case 1095:
                return 'gu-IN';
            case 4096:
                return 'guz';
            case 4096:
                return 'guz-KE';
            case 4096:
                return 'gv';
            case 4096:
                return 'gv-IM';
            case 104:
                return 'ha';
            case 31848:
                return 'ha-Latn';
            case 4096:
                return 'ha-Latn-GH';
            case 4096:
                return 'ha-Latn-NE';
            case 1128:
                return 'ha-Latn-NG';
            case 117:
                return 'haw';
            case 1141:
                return 'haw-US';
            case 13:
                return 'he';
            case 1037:
                return 'he-IL';
            case 57:
                return 'hi';
            case 1081:
                return 'hi-IN';
            case 26:
                return 'hr';
            case 4122:
                return 'hr-BA';
            case 1050:
                return 'hr-HR';
            case 46:
                return 'hsb';
            case 1070:
                return 'hsb-DE';
            case 14:
                return 'hu';
            case 1038:
                return 'hu-HU';
            case 43:
                return 'hy';
            case 1067:
                return 'hy-AM';
            case 4096:
                return 'ia';
            case 4096:
                return 'ia-001';
            case 105:
                return 'ibb';
            case 1129:
                return 'ibb-NG';
            case 33:
                return 'id';
            case 1057:
                return 'id-ID';
            case 112:
                return 'ig';
            case 1136:
                return 'ig-NG';
            case 120:
                return 'ii';
            case 1144:
                return 'ii-CN';
            case 15:
                return 'is';
            case 1039:
                return 'is-IS';
            case 16:
                return 'it';
            case 2064:
                return 'it-CH';
            case 1040:
                return 'it-IT';
            case 4096:
                return 'it-SM';
            case 4096:
                return 'it-VA';
            case 93:
                return 'iu';
            case 30813:
                return 'iu-Cans';
            case 1117:
                return 'iu-Cans-CA';
            case 31837:
                return 'iu-Latn';
            case 2141:
                return 'iu-Latn-CA';
            case 17:
                return 'ja';
            case 1041:
                return 'ja-JP';
            case 4096:
                return 'jgo';
            case 4096:
                return 'jgo-CM';
            case 4096:
                return 'jmc';
            case 4096:
                return 'jmc-TZ';
            case 4096:
                return 'jv';
            case 4096:
                return 'jv-Java';
            case 4096:
                return 'jv-Java-ID';
            case 4096:
                return 'jv-Latn';
            case 4096:
                return 'jv-Latn-ID';
            case 55:
                return 'ka';
            case 1079:
                return 'ka-GE';
            case 4096:
                return 'kab';
            case 4096:
                return 'kab-DZ';
            case 4096:
                return 'kam';
            case 4096:
                return 'kam-KE';
            case 4096:
                return 'kde';
            case 4096:
                return 'kde-TZ';
            case 4096:
                return 'kea';
            case 4096:
                return 'kea-CV';
            case 4096:
                return 'khq';
            case 4096:
                return 'khq-ML';
            case 4096:
                return 'ki';
            case 4096:
                return 'ki-KE';
            case 63:
                return 'kk';
            case 1087:
                return 'kk-KZ';
            case 4096:
                return 'kkj';
            case 4096:
                return 'kkj-CM';
            case 111:
                return 'kl';
            case 1135:
                return 'kl-GL';
            case 4096:
                return 'kln';
            case 4096:
                return 'kln-KE';
            case 83:
                return 'km';
            case 1107:
                return 'km-KH';
            case 75:
                return 'kn';
            case 1099:
                return 'kn-IN';
            case 18:
                return 'ko';
            case 4096:
                return 'ko-KP';
            case 1042:
                return 'ko-KR';
            case 87:
                return 'kok';
            case 1111:
                return 'kok-IN';
            case 113:
                return 'kr';
            case 4096:
                return 'kr-Latn';
            case 1137:
                return 'kr-Latn-NG';
            case 96:
                return 'ks';
            case 1120:
                return 'ks-Arab';
            case 4096:
                return 'ks-Arab-IN';
            case 4096:
                return 'ks-Deva';
            case 2144:
                return 'ks-Deva-IN';
            case 4096:
                return 'ksb';
            case 4096:
                return 'ksb-TZ';
            case 4096:
                return 'ksf';
            case 4096:
                return 'ksf-CM';
            case 4096:
                return 'ksh';
            case 4096:
                return 'ksh-DE';
            case 146:
                return 'ku';
            case 31890:
                return 'ku-Arab';
            case 1170:
                return 'ku-Arab-IQ';
            case 4096:
                return 'ku-Arab-IR';
            case 4096:
                return 'kw';
            case 4096:
                return 'kw-GB';
            case 64:
                return 'ky';
            case 1088:
                return 'ky-KG';
            case 118:
                return 'la';
            case 1142:
                return 'la-001';
            case 4096:
                return 'lag';
            case 4096:
                return 'lag-TZ';
            case 110:
                return 'lb';
            case 1134:
                return 'lb-LU';
            case 4096:
                return 'lg';
            case 4096:
                return 'lg-UG';
            case 4096:
                return 'lkt';
            case 4096:
                return 'lkt-US';
            case 4096:
                return 'ln';
            case 4096:
                return 'ln-AO';
            case 4096:
                return 'ln-CD';
            case 4096:
                return 'ln-CF';
            case 4096:
                return 'ln-CG';
            case 84:
                return 'lo';
            case 1108:
                return 'lo-LA';
            case 4096:
                return 'lrc';
            case 4096:
                return 'lrc-IQ';
            case 4096:
                return 'lrc-IR';
            case 39:
                return 'lt';
            case 1063:
                return 'lt-LT';
            case 4096:
                return 'lu';
            case 4096:
                return 'lu-CD';
            case 4096:
                return 'luo';
            case 4096:
                return 'luo-KE';
            case 4096:
                return 'luy';
            case 4096:
                return 'luy-KE';
            case 38:
                return 'lv';
            case 1062:
                return 'lv-LV';
            case 4096:
                return 'mas';
            case 4096:
                return 'mas-KE';
            case 4096:
                return 'mas-TZ';
            case 4096:
                return 'mer';
            case 4096:
                return 'mer-KE';
            case 4096:
                return 'mfe';
            case 4096:
                return 'mfe-MU';
            case 4096:
                return 'mg';
            case 4096:
                return 'mg-MG';
            case 4096:
                return 'mgh';
            case 4096:
                return 'mgh-MZ';
            case 4096:
                return 'mgo';
            case 4096:
                return 'mgo-CM';
            case 129:
                return 'mi';
            case 1153:
                return 'mi-NZ';
            case 47:
                return 'mk';
            case 1071:
                return 'mk-MK';
            case 76:
                return 'ml';
            case 1100:
                return 'ml-IN';
            case 80:
                return 'mn';
            case 30800:
                return 'mn-Cyrl';
            case 1104:
                return 'mn-MN';
            case 31824:
                return 'mn-Mong';
            case 2128:
                return 'mn-Mong-CN';
            case 3152:
                return 'mn-Mong-MN';
            case 88:
                return 'mni';
            case 1112:
                return 'mni-IN';
            case 124:
                return 'moh';
            case 1148:
                return 'moh-CA';
            case 78:
                return 'mr';
            case 1102:
                return 'mr-IN';
            case 62:
                return 'ms';
            case 2110:
                return 'ms-BN';
            case 1086:
                return 'ms-MY';
            case 4096:
                return 'ms-SG';
            case 58:
                return 'mt';
            case 1082:
                return 'mt-MT';
            case 4096:
                return 'mua';
            case 4096:
                return 'mua-CM';
            case 85:
                return 'my';
            case 1109:
                return 'my-MM';
            case 4096:
                return 'mzn';
            case 4096:
                return 'mzn-IR';
            case 4096:
                return 'naq';
            case 4096:
                return 'naq-NA';
            case 31764:
                return 'nb';
            case 1044:
                return 'nb-NO';
            case 4096:
                return 'nb-SJ';
            case 4096:
                return 'nd';
            case 4096:
                return 'nd-ZW';
            case 4096:
                return 'nds';
            case 4096:
                return 'nds-DE';
            case 4096:
                return 'nds-NL';
            case 97:
                return 'ne';
            case 2145:
                return 'ne-IN';
            case 1121:
                return 'ne-NP';
            case 19:
                return 'nl';
            case 4096:
                return 'nl-AW';
            case 2067:
                return 'nl-BE';
            case 4096:
                return 'nl-BQ';
            case 4096:
                return 'nl-CW';
            case 1043:
                return 'nl-NL';
            case 4096:
                return 'nl-SR';
            case 4096:
                return 'nl-SX';
            case 4096:
                return 'nmg';
            case 4096:
                return 'nmg-CM';
            case 30740:
                return 'nn';
            case 2068:
                return 'nn-NO';
            case 4096:
                return 'nnh';
            case 4096:
                return 'nnh-CM';
            case 20:
                return 'no';
            case 4096:
                return 'nqo';
            case 4096:
                return 'nqo-GN';
            case 4096:
                return 'nr';
            case 4096:
                return 'nr-ZA';
            case 108:
                return 'nso';
            case 1132:
                return 'nso-ZA';
            case 4096:
                return 'nus';
            case 4096:
                return 'nus-SS';
            case 4096:
                return 'nyn';
            case 4096:
                return 'nyn-UG';
            case 130:
                return 'oc';
            case 1154:
                return 'oc-FR';
            case 114:
                return 'om';
            case 1138:
                return 'om-ET';
            case 4096:
                return 'om-KE';
            case 72:
                return 'or';
            case 1096:
                return 'or-IN';
            case 4096:
                return 'os';
            case 4096:
                return 'os-GE';
            case 4096:
                return 'os-RU';
            case 70:
                return 'pa';
            case 31814:
                return 'pa-Arab';
            case 2118:
                return 'pa-Arab-PK';
            case 4096:
                return 'pa-Guru';
            case 1094:
                return 'pa-IN';
            case 121:
                return 'pap';
            case 1145:
                return 'pap-029';
            case 21:
                return 'pl';
            case 1045:
                return 'pl-PL';
            case 4096:
                return 'prg';
            case 4096:
                return 'prg-001';
            case 140:
                return 'prs';
            case 1164:
                return 'prs-AF';
            case 99:
                return 'ps';
            case 1123:
                return 'ps-AF';
            case 4096:
                return 'ps-PK';
            case 22:
                return 'pt';
            case 4096:
                return 'pt-AO';
            case 1046:
                return 'pt-BR';
            case 4096:
                return 'pt-CH';
            case 4096:
                return 'pt-CV';
            case 4096:
                return 'pt-GQ';
            case 4096:
                return 'pt-GW';
            case 4096:
                return 'pt-LU';
            case 4096:
                return 'pt-MO';
            case 4096:
                return 'pt-MZ';
            case 2070:
                return 'pt-PT';
            case 4096:
                return 'pt-ST';
            case 4096:
                return 'pt-TL';
            case 134:
                return 'quc';
            case 31878:
                return 'quc-Latn';
            case 1158:
                return 'quc-Latn-GT';
            case 107:
                return 'quz';
            case 1131:
                return 'quz-BO';
            case 2155:
                return 'quz-EC';
            case 3179:
                return 'quz-PE';
            case 23:
                return 'rm';
            case 1047:
                return 'rm-CH';
            case 4096:
                return 'rn';
            case 4096:
                return 'rn-BI';
            case 24:
                return 'ro';
            case 2072:
                return 'ro-MD';
            case 1048:
                return 'ro-RO';
            case 4096:
                return 'rof';
            case 4096:
                return 'rof-TZ';
            case 25:
                return 'ru';
            case 4096:
                return 'ru-BY';
            case 4096:
                return 'ru-KG';
            case 4096:
                return 'ru-KZ';
            case 2073:
                return 'ru-MD';
            case 1049:
                return 'ru-RU';
            case 4096:
                return 'ru-UA';
            case 135:
                return 'rw';
            case 1159:
                return 'rw-RW';
            case 4096:
                return 'rwk';
            case 4096:
                return 'rwk-TZ';
            case 79:
                return 'sa';
            case 1103:
                return 'sa-IN';
            case 133:
                return 'sah';
            case 1157:
                return 'sah-RU';
            case 4096:
                return 'saq';
            case 4096:
                return 'saq-KE';
            case 4096:
                return 'sbp';
            case 4096:
                return 'sbp-TZ';
            case 89:
                return 'sd';
            case 31833:
                return 'sd-Arab';
            case 2137:
                return 'sd-Arab-PK';
            case 4096:
                return 'sd-Deva';
            case 1113:
                return 'sd-Deva-IN';
            case 59:
                return 'se';
            case 3131:
                return 'se-FI';
            case 1083:
                return 'se-NO';
            case 2107:
                return 'se-SE';
            case 4096:
                return 'seh';
            case 4096:
                return 'seh-MZ';
            case 4096:
                return 'ses';
            case 4096:
                return 'ses-ML';
            case 4096:
                return 'sg';
            case 4096:
                return 'sg-CF';
            case 4096:
                return 'shi';
            case 4096:
                return 'shi-Latn';
            case 4096:
                return 'shi-Latn-MA';
            case 4096:
                return 'shi-Tfng';
            case 4096:
                return 'shi-Tfng-MA';
            case 91:
                return 'si';
            case 1115:
                return 'si-LK';
            case 27:
                return 'sk';
            case 1051:
                return 'sk-SK';
            case 36:
                return 'sl';
            case 1060:
                return 'sl-SI';
            case 30779:
                return 'sma';
            case 6203:
                return 'sma-NO';
            case 7227:
                return 'sma-SE';
            case 31803:
                return 'smj';
            case 4155:
                return 'smj-NO';
            case 5179:
                return 'smj-SE';
            case 28731:
                return 'smn';
            case 9275:
                return 'smn-FI';
            case 29755:
                return 'sms';
            case 8251:
                return 'sms-FI';
            case 4096:
                return 'sn';
            case 4096:
                return 'sn-Latn';
            case 4096:
                return 'sn-Latn-ZW';
            case 119:
                return 'so';
            case 4096:
                return 'so-DJ';
            case 4096:
                return 'so-ET';
            case 4096:
                return 'so-KE';
            case 1143:
                return 'so-SO';
            case 28:
                return 'sq';
            case 1052:
                return 'sq-AL';
            case 4096:
                return 'sq-MK';
            case 4096:
                return 'sq-XK';
            case 31770:
                return 'sr';
            case 27674:
                return 'sr-Cyrl';
            case 7194:
                return 'sr-Cyrl-BA';
            case 12314:
                return 'sr-Cyrl-ME';
            case 10266:
                return 'sr-Cyrl-RS';
            case 4096:
                return 'sr-Cyrl-XK';
            case 28698:
                return 'sr-Latn';
            case 6170:
                return 'sr-Latn-BA';
            case 11290:
                return 'sr-Latn-ME';
            case 9242:
                return 'sr-Latn-RS';
            case 4096:
                return 'sr-Latn-XK';
            case 4096:
                return 'ss';
            case 4096:
                return 'ss-SZ';
            case 4096:
                return 'ss-ZA';
            case 4096:
                return 'ssy';
            case 4096:
                return 'ssy-ER';
            case 48:
                return 'st';
            case 4096:
                return 'st-LS';
            case 1072:
                return 'st-ZA';
            case 29:
                return 'sv';
            case 4096:
                return 'sv-AX';
            case 2077:
                return 'sv-FI';
            case 1053:
                return 'sv-SE';
            case 65:
                return 'sw';
            case 4096:
                return 'sw-CD';
            case 1089:
                return 'sw-KE';
            case 4096:
                return 'sw-TZ';
            case 4096:
                return 'sw-UG';
            case 90:
                return 'syr';
            case 1114:
                return 'syr-SY';
            case 73:
                return 'ta';
            case 1097:
                return 'ta-IN';
            case 2121:
                return 'ta-LK';
            case 4096:
                return 'ta-MY';
            case 4096:
                return 'ta-SG';
            case 74:
                return 'te';
            case 1098:
                return 'te-IN';
            case 4096:
                return 'teo';
            case 4096:
                return 'teo-KE';
            case 4096:
                return 'teo-UG';
            case 40:
                return 'tg';
            case 31784:
                return 'tg-Cyrl';
            case 1064:
                return 'tg-Cyrl-TJ';
            case 30:
                return 'th';
            case 1054:
                return 'th-TH';
            case 115:
                return 'ti';
            case 2163:
                return 'ti-ER';
            case 1139:
                return 'ti-ET';
            case 4096:
                return 'tig';
            case 4096:
                return 'tig-ER';
            case 66:
                return 'tk';
            case 1090:
                return 'tk-TM';
            case 50:
                return 'tn';
            case 2098:
                return 'tn-BW';
            case 1074:
                return 'tn-ZA';
            case 4096:
                return 'to';
            case 4096:
                return 'to-TO';
            case 31:
                return 'tr';
            case 4096:
                return 'tr-CY';
            case 1055:
                return 'tr-TR';
            case 49:
                return 'ts';
            case 1073:
                return 'ts-ZA';
            case 68:
                return 'tt';
            case 1092:
                return 'tt-RU';
            case 4096:
                return 'twq';
            case 4096:
                return 'twq-NE';
            case 95:
                return 'tzm';
            case 4096:
                return 'tzm-Arab';
            case 1119:
                return 'tzm-Arab-MA';
            case 31839:
                return 'tzm-Latn';
            case 2143:
                return 'tzm-Latn-DZ';
            case 4096:
                return 'tzm-Latn-MA';
            case 30815:
                return 'tzm-Tfng';
            case 4191:
                return 'tzm-Tfng-MA';
            case 128:
                return 'ug';
            case 1152:
                return 'ug-CN';
            case 34:
                return 'uk';
            case 1058:
                return 'uk-UA';
            case 32:
                return 'ur';
            case 2080:
                return 'ur-IN';
            case 1056:
                return 'ur-PK';
            case 67:
                return 'uz';
            case 4096:
                return 'uz-Arab';
            case 4096:
                return 'uz-Arab-AF';
            case 30787:
                return 'uz-Cyrl';
            case 2115:
                return 'uz-Cyrl-UZ';
            case 31811:
                return 'uz-Latn';
            case 1091:
                return 'uz-Latn-UZ';
            case 4096:
                return 'vai';
            case 4096:
                return 'vai-Latn';
            case 4096:
                return 'vai-Latn-LR';
            case 4096:
                return 'vai-Vaii';
            case 4096:
                return 'vai-Vaii-LR';
            case 51:
                return 've';
            case 1075:
                return 've-ZA';
            case 42:
                return 'vi';
            case 1066:
                return 'vi-VN';
            case 4096:
                return 'vo';
            case 4096:
                return 'vo-001';
            case 4096:
                return 'vun';
            case 4096:
                return 'vun-TZ';
            case 4096:
                return 'wae';
            case 4096:
                return 'wae-CH';
            case 4096:
                return 'wal';
            case 4096:
                return 'wal-ET';
            case 136:
                return 'wo';
            case 1160:
                return 'wo-SN';
            case 52:
                return 'xh';
            case 1076:
                return 'xh-ZA';
            case 4096:
                return 'xog';
            case 4096:
                return 'xog-UG';
            case 4096:
                return 'yav';
            case 4096:
                return 'yav-CM';
            case 61:
                return 'yi';
            case 1085:
                return 'yi-001';
            case 106:
                return 'yo';
            case 4096:
                return 'yo-BJ';
            case 1130:
                return 'yo-NG';
            case 4096:
                return 'zgh';
            case 4096:
                return 'zgh-Tfng';
            case 4096:
                return 'zgh-Tfng-MA';
            case 30724:
                return 'zh';
            case 2052:
                return 'zh-CN';
            case 4:
                return 'zh-Hans';
            case 4096:
                return 'zh-Hans-HK';
            case 4096:
                return 'zh-Hans-MO';
            case 31748:
                return 'zh-Hant';
            case 3076:
                return 'zh-HK';
            case 5124:
                return 'zh-MO';
            case 4100:
                return 'zh-SG';
            case 1028:
                return 'zh-TW';
            case 53:
                return 'zu';
            case 1077:
                return 'zu-ZA';
            case 4:
                return 'zh-CHS';
            case 31748:
                return 'zh-CHT';
        }
        return '';

    }


    //#endif

    // Clear our internal caches
    public /* internal */ static ClearCachedData(): void {
        CultureData.s_cachedCultures = null as any;
    }

    //[System.Security.SecuritySafeCritical]  // auto-generated
    public /* internal */ static GetCultures(types: CultureTypes): CultureInfo[] {
        // Disable  warning 618: System.Globalization.CultureTypes.FrameworkCultures' is obsolete
        // Validate flags
        if (types <= 0 || (types & ~(CultureTypes.NeutralCultures | CultureTypes.SpecificCultures | CultureTypes.InstalledWin32Cultures | CultureTypes.UserCustomCulture |
            CultureTypes.ReplacementCultures | CultureTypes.WindowsOnlyCultures |
            CultureTypes.FrameworkCultures)) !== 0) {
            throw new ArgumentOutOfRangeException("types" + TString.Format(/* CultureInfo.CurrentCulture, */ Environment.GetResourceString("ArgumentOutOfRange_Range"), CultureTypes.NeutralCultures, CultureTypes.FrameworkCultures));
        }

        //
        // CHANGE FROM Whidbey
        //
        // We have deprecated CultureTypes.FrameworkCultures.
        // When this enum is used, we will enumerate Whidbey framework cultures (for compatability).
        //

        // We have deprecated CultureTypes.WindowsOnlyCultures.
        // When this enum is used, we will return an empty array for this enum.
        if ((types & CultureTypes.WindowsOnlyCultures) !== 0) {
            // Remove the enum as it is an no-op.
            types &= (~CultureTypes.WindowsOnlyCultures);
        }

        let cultureNames: string[] = null as any;

        //
        // Call nativeEnumCultureNames() to get a string array of culture names based on the specified
        // enumeration type.
        //
        // nativeEnumCulturNames is a QCall.  We need to use a reference to return the string array
        // allocated from the QCall.  That ref has to be wrapped as object handle.
        // See vm\qcall.h for details in QCall.
        //

        if (CultureData.nativeEnumCultureNames(types, cultureNames) === 0) {
            return new Array(0);
        }

        let arrayLength: int = cultureNames.length;

        if ((types & (CultureTypes.NeutralCultures | CultureTypes.FrameworkCultures)) !== 0) // add zh-CHT and zh-CHS
        {
            arrayLength += 2;
        }

        const cultures: CultureInfo[] = New.Array(arrayLength);

        for (let i: int = 0; i < cultureNames.length; i++) {
            cultures[i] = new CultureInfo(cultureNames[i]);
        }

        if ((types & (CultureTypes.NeutralCultures | CultureTypes.FrameworkCultures)) !== 0) // add zh-CHT and zh-CHS
        {
            //Contract.Assert(arrayLength == cultureNames.Length + 2, "CultureData.nativeEnumCultureNames() Incorrect array size");
            cultures[cultureNames.length] = new CultureInfo("zh-CHS");
            cultures[cultureNames.length + 1] = new CultureInfo("zh-CHT");
        }


        return cultures;
    }

    public /* internal */ get IsReplacementCulture(): boolean {
        return CultureData.IsReplacementCultureName(this.SNAME);
    }

    public /* internal */ static s_replacementCultureNames: string[];

    ////////////////////////////////////////////////////////////////////////
    //
    // Cache for the known replacement cultures.
    // This is used by CultureInfo.CultureType to check if a culture is a
    // replacement culture.
    //
    ////////////////////////////////////////////////////////////////////////


    private static IsReplacementCultureName(name: string): boolean {
        // Contract.Assert(name != null, "IsReplacementCultureName(): name should not be null");
        const replacementCultureNames: string[] = CultureData.s_replacementCultureNames;
        if (replacementCultureNames == null) {
            if (CultureData.nativeEnumCultureNames(CultureTypes.ReplacementCultures, replacementCultureNames) === 0) {
                return false;
            }

            // Even if we don't have any replacement cultures, the returned replacementCultureNames will still an empty string array, not null.
            //Contract.Assert(name != null, "IsReplacementCultureName(): replacementCultureNames should not be null");
            (TArray as any).Sort(replacementCultureNames);
            CultureData.s_replacementCultureNames = replacementCultureNames;
        }
        return TArray.BinarySearch(replacementCultureNames, name) >= 0;
    }

    public /* internal */ static specificCultures: CultureInfo[];

    private static get SpecificCultures(): CultureInfo[] {
        if (CultureData.specificCultures == null)
            CultureData.specificCultures = CultureData.GetCultures(CultureTypes.SpecificCultures);

        return CultureData.specificCultures;
    }



    ////////////////////////////////////////////////////////////////////////
    //
    //  All the accessors
    //
    //  Accessors for our data object items
    //
    ////////////////////////////////////////////////////////////////////////

    ///////////
    // Identity //
    ///////////

    // The real name used to construct the locale (ie: de-DE_phoneb)
    public /* internal */ get CultureName(): string {
        //Contract.Assert(this.sRealName != null, "[CultureData.CultureName] Expected this.sRealName to be populated by COMNlsInfo::nativeInitCultureData already");
        // since windows doesn't know about zh-CHS and zh-CHT,
        // we leave sRealName == zh-Hanx but we still need to
        // pretend that it was zh-CHX.
        switch (this.sName) {
            case "zh-CHS":
            case "zh-CHT":
                return this.sName;
        }
        return this.sRealName;
    }


    // Are overrides enabled?
    public /* internal */ get UseUserOverride(): boolean {
        return this.bUseOverrides;
    }

    // locale name (ie: de-DE, NO sort information)
    public /* internal */ get SNAME(): string {
        //                Contract.Assert(this.sName != null,
        //                    "[CultureData.SNAME] Expected this.sName to be populated by COMNlsInfo::nativeInitCultureData already");
        if (this.sName == null) {
            this.sName = TString.Empty;
        }
        return this.sName;
    }

    // Parent name (which may be a custom locale/culture)
    public /* internal */ get SPARENT(): string {
        if (this.sParent == null) {
            // Ask using the real name, so that we get parents of neutrals
            this.sParent = this.DoGetLocaleInfo(this.sRealName, CultureData.LOCALE_SPARENT);
        }
        return this.sParent;
    }


    // Localized pretty name for this locale (ie: Inglis (estados Unitos))
    public /* internal */ get SLOCALIZEDDISPLAYNAME(): string {
        if (this.sLocalizedDisplayName == null) {

            // If it hasn't been found (Windows 8 and up), fallback to the system
            if (String.IsNullOrEmpty(this.sLocalizedDisplayName)) {
                // If its neutral use the language name
                if (this.IsNeutralCulture) {
                    this.sLocalizedDisplayName = this.SLOCALIZEDLANGUAGE;
                }

                else {
                    // We have to make the neutral distinction in case the OS returns a specific name
                    const _Thread = Context.Current.get('Thread');
                    if (TString.Equals(CultureInfo.UserDefaultUICulture.Name, _Thread.CurrentThread.CurrentUICulture.Name)) {
                        this.sLocalizedDisplayName = this.DoGetLocaleInfo(CultureData.LOCALE_SLOCALIZEDDISPLAYNAME);
                    }
                    if (TString.IsNullOrEmpty(this.sLocalizedDisplayName)) {
                        this.sLocalizedDisplayName = this.SNATIVEDISPLAYNAME;
                    }
                }
            }
        }
        return this.sLocalizedDisplayName;
    }

    // English pretty name for this locale (ie: English (United States))
    public /* internal */ get SENGDISPLAYNAME(): string {
        if (this.sEnglishDisplayName == null) {
            // If its neutral use the language name
            if (this.IsNeutralCulture) {
                this.sEnglishDisplayName = this.SENGLISHLANGUAGE;


            }
            else {
                this.sEnglishDisplayName = this.DoGetLocaleInfo(CultureData.LOCALE_SENGLISHDISPLAYNAME);

                // if it isn't found build one:
                if (TString.IsNullOrEmpty(this.sEnglishDisplayName)) {
                    // Our existing names mostly look like:
                    // "English" + "United States" -> "English (United States)"
                    // "Azeri (Latin)" + "Azerbaijan" -> "Azeri (Latin, Azerbaijan)"
                    if (this.SENGLISHLANGUAGE.endsWith(')')) {
                        // "Azeri (Latin)" + "Azerbaijan" -> "Azeri (Latin, Azerbaijan)"
                        this.sEnglishDisplayName =
                            this.SENGLISHLANGUAGE.substring(0, this.sEnglishLanguage.length - 1) +
                            ", " + this.SENGCOUNTRY + ")";
                    }
                    else {
                        // "English" + "United States" -> "English (United States)"
                        this.sEnglishDisplayName = this.SENGLISHLANGUAGE + " (" + this.SENGCOUNTRY + ")";
                    }
                }
            }
        }
        return this.sEnglishDisplayName;
    }

    // ISO 3166 ---- Name
    public /* internal */ get SISO3166CTRYNAME2(): string {
        if (this.sISO3166CountryName2 == null) {
            this.sISO3166CountryName2 = this.DoGetLocaleInfo(CultureData.LOCALE_SISO3166CTRYNAME2);
        }
        return this.sISO3166CountryName2;
    }

    // Native pretty name for this locale (ie: Deutsch (Deutschland))
    public /* internal */ get SNATIVEDISPLAYNAME(): string {
        if (this.sNativeDisplayName == null) {
            // If its neutral use the language name
            if (this.IsNeutralCulture) {
                this.sNativeDisplayName = this.SNATIVELANGUAGE;

            }
            else {

                {
                    this.sNativeDisplayName = this.DoGetLocaleInfo(CultureData.LOCALE_SNATIVEDISPLAYNAME);
                }

                // if it isn't found build one:
                if (TString.IsNullOrEmpty(this.sNativeDisplayName)) {
                    // These should primarily be "Deutsch (Deutschland)" type names
                    this.sNativeDisplayName = this.SNATIVELANGUAGE + " (" + this.SNATIVECOUNTRY + ")";
                }
            }
        }
        return this.sNativeDisplayName;
    }


    // The culture name to be used in CultureInfo.CreateSpecificCulture()
    public /* internal */ get SSPECIFICCULTURE(): string {
        // This got populated when ComNlsInfo::nativeInitCultureData told us we had a culture
        // Contract.Assert(this.sSpecificCulture != null, "[CultureData.SSPECIFICCULTURE] Expected this.sSpecificCulture to be populated by COMNlsInfo::nativeInitCultureData already");
        return this.sSpecificCulture;
    }

    /////////////
    // Language //
    /////////////

    // iso 639 language name, ie: en
    public /* internal */ get SISO639LANGNAME(): string {
        if (this.sISO639Language == null) {
            this.sISO639Language = this.DoGetLocaleInfo(CultureData.LOCALE_SISO639LANGNAME);
        }
        return this.sISO639Language;
    }



    // Localized name for this language (Windows Only) ie: Inglis
    // This is only valid for Windows 8 and higher neutrals:
    public /* internal */  get SLOCALIZEDLANGUAGE(): string {
        if (this.sLocalizedLanguage == null) {
            const _Thread = Context.Current.get('Thread');
            if (TString.Equals(CultureInfo.UserDefaultUICulture.Name, _Thread.CurrentThread.CurrentUICulture.Name)) {
                this.sLocalizedLanguage = this.DoGetLocaleInfo(CultureData.LOCALE_SLOCALIZEDLANGUAGENAME);
            }
            // Some OS's might not have this resource or LCTYPE
            if (TString.IsNullOrEmpty(this.sLocalizedLanguage)) {
                this.sLocalizedLanguage = this.SNATIVELANGUAGE;
            }
        }
        return this.sLocalizedLanguage;
    }

    // English name for this language (Windows Only) ie: German
    public /* internal */ get SENGLISHLANGUAGE(): string {
        if (this.sEnglishLanguage == null) {
            this.sEnglishLanguage = this.DoGetLocaleInfo(CultureData.LOCALE_SENGLISHLANGUAGENAME);
        }
        return this.sEnglishLanguage;
    }

    // Native name of this language (Windows Only) ie: Deutsch
    public /* internal */ get SNATIVELANGUAGE(): string {
        if (this.sNativeLanguage == null) {
            this.sNativeLanguage = this.DoGetLocaleInfo(CultureData.LOCALE_SNATIVELANGUAGENAME);
        }
        return this.sNativeLanguage;
    }

    ///////////
    // Region //
    ///////////

    // region name (eg US)
    public /* internal */ get SREGIONNAME(): string {
        if (this.sRegionName == null) {
            this.sRegionName = this.DoGetLocaleInfo(CultureData.LOCALE_SISO3166CTRYNAME);
        }
        return this.sRegionName;
    }


    // (user can override) ---- code (RegionInfo)


    // GeoId
    public /* internal */ get IGEOID(): int {
        if (this.iGeoId == undef) {
            this.iGeoId = this.DoGetLocaleInfoInt(CultureData.LOCALE_IGEOID);
        }
        return this.iGeoId;
    }

    // localized name for the ----
    public /* internal */ get SLOCALIZEDCOUNTRY(): string {
        if (this.sLocalizedCountry == null) {

            // If it hasn't been found (Windows 8 and up), fallback to the system
            if (TString.IsNullOrEmpty(this.sLocalizedCountry)) {
                // We have to make the neutral distinction in case the OS returns a specific name
                const _Thread = Context.Current.get('Thread');
                if (CultureInfo.UserDefaultUICulture.Name === _Thread.CurrentThread.CurrentUICulture.Name) {
                    this.sLocalizedCountry = this.DoGetLocaleInfo(CultureData.LOCALE_SLOCALIZEDCOUNTRYNAME);
                }
                if (TString.IsNullOrEmpty(this.sLocalizedDisplayName)) {
                    this.sLocalizedCountry = this.SNATIVECOUNTRY;
                }
            }
        }
        return this.sLocalizedCountry;
    }

    // english ---- name (RegionInfo) ie: Germany
    public /* internal */ get SENGCOUNTRY(): string {
        if (this.sEnglishCountry == null) {
            this.sEnglishCountry = this.DoGetLocaleInfo(CultureData.LOCALE_SENGLISHCOUNTRYNAME);
        }
        return this.sEnglishCountry;
    }

    // native ---- name (RegionInfo) ie: Deutschland
    public /* internal */ get SNATIVECOUNTRY(): string {
        if (this.sNativeCountry == null) {
            this.sNativeCountry = this.DoGetLocaleInfo(CultureData.LOCALE_SNATIVECOUNTRYNAME);
        }
        return this.sNativeCountry;
    }

    public /* internal */ get IINPUTLANGUAGEHANDLE(): int {
        if (this.iInputLanguageHandle == undef) {
            if (this.IsSupplementalCustomCulture) {
                //
                this.iInputLanguageHandle = 0x0409;
            }
            else {
                // Input Language is same as LCID for built-in cultures
                this.iInputLanguageHandle = this.ILANGUAGE;
            }
        }
        return this.iInputLanguageHandle;
    }

    public /* internal */ get SABBREVCTRYNAME(): string {
        if (this.sAbbrevCountry == null) {
            this.sAbbrevCountry = this.DoGetLocaleInfo(CultureData.LOCALE_SABBREVCTRYNAME);
        }
        return this.sAbbrevCountry;
    }

    public /* internal */ get SISO639LANGNAME2(): string {
        if (this.sISO639Language2 == null) {
            this.sISO639Language2 = this.DoGetLocaleInfo(CultureData.LOCALE_SISO639LANGNAME2);
        }
        return this.sISO639Language2;
    }

    // abbreviated windows language name (ie: enu) (non-standard, avoid this)
    public /* internal */ get SABBREVLANGNAME(): string {
        if (this.sAbbrevLang == null) {
            this.sAbbrevLang = this.DoGetLocaleInfo(CultureData.LOCALE_SABBREVLANGNAME);
        }
        return this.sAbbrevLang;
    }

    // ISO 3166 ---- Name
    public /* internal */ get SISO3166CTRYNAME(): string {
        if (this.sISO3166CountryName == null) {
            this.sISO3166CountryName = this.DoGetLocaleInfo(CultureData.LOCALE_SISO3166CTRYNAME);
        }
        return this.sISO3166CountryName;
    }


    /////////////
    // Numbers //
    ////////////

    //                internal String sPositiveSign            ; // (user can override) positive sign
    //                internal String sNegativeSign            ; // (user can override) negative sign
    //                internal String[] saNativeDigits         ; // (user can override) native characters for digits 0-9
    //                internal int iDigitSubstitution       ; // (user can override) Digit substitution 0=context, 1=none/arabic, 2=Native/national (2 seems to be unused) (Windows Only)
    //                internal int iDigits                  ; // (user can override) number of fractional digits
    //                internal int iNegativeNumber          ; // (user can override) negative number format




    // (user can override) grouping of digits
    public /* internal */ get WAGROUPING(): IntArray {
        if (this.waGrouping == null) {
            this.waGrouping = CultureData.ConvertWin32GroupString(this.DoGetLocaleInfo(CultureData.LOCALE_SGROUPING));
        }
        return this.waGrouping;
    }


    //                internal String sDecimalSeparator        ; // (user can override) decimal separator
    //                internal String sThousandSeparator       ; // (user can override) thousands separator

    // Not a Number
    public /* internal */ get SNAN(): string {
        if (this.sNaN == null) {
            this.sNaN = this.DoGetLocaleInfo(CultureData.LOCALE_SNAN);
        }
        return this.sNaN;
    }

    // + Infinity
    public /* internal */ get SPOSINFINITY(): string {
        if (this.sPositiveInfinity == null) {
            this.sPositiveInfinity = this.DoGetLocaleInfo(CultureData.LOCALE_SPOSINFINITY);
        }
        return this.sPositiveInfinity;
    }

    // - Infinity
    public /* internal */ get SNEGINFINITY(): string {
        if (this.sNegativeInfinity == null) {
            this.sNegativeInfinity = this.DoGetLocaleInfo(CultureData.LOCALE_SNEGINFINITY);
        }
        return this.sNegativeInfinity;
    }


    ////////////
    // Percent //
    ///////////

    // Negative Percent (0-3)
    public /* internal */ get INEGATIVEPERCENT(): int {
        if (this.iNegativePercent == undef) {
            // Note that <= Windows Vista this is synthesized by native code
            this.iNegativePercent = this.DoGetLocaleInfoInt(CultureData.LOCALE_INEGATIVEPERCENT);
        }
        return this.iNegativePercent;
    }

    // Positive Percent (0-11)
    public /* internal */ get IPOSITIVEPERCENT(): int {
        if (this.iPositivePercent == undef) {
            // Note that <= Windows Vista this is synthesized by native code
            this.iPositivePercent = this.DoGetLocaleInfoInt(CultureData.LOCALE_IPOSITIVEPERCENT);
        }
        return this.iPositivePercent;
    }

    // Percent (%) symbol
    public /* internal */ get SPERCENT(): string {
        if (this.sPercent == null) {
            // Note that <= Windows Vista this is synthesized by native code
            this.sPercent = this.DoGetLocaleInfo(CultureData.LOCALE_SPERCENT);
        }
        return this.sPercent;
    }

    // PerMille (‰) symbol
    public /* internal */ get SPERMILLE(): string {
        if (this.sPerMille == null) {
            // Note that <= Windows Vista this is synthesized by native code
            this.sPerMille = this.DoGetLocaleInfo(CultureData.LOCALE_SPERMILLE);
        }
        return this.sPerMille;
    }

    /////////////
    // Currency //
    /////////////

    // (user can override) local monetary symbol, eg: $
    public /* internal */ get SCURRENCY(): string {
        if (this.sCurrency == null) {
            this.sCurrency = this.DoGetLocaleInfo(CultureData.LOCALE_SCURRENCY);
        }
        return this.sCurrency;
    }

    // international monetary symbol (RegionInfo), eg: USD
    public /* internal */ get SINTLSYMBOL(): string {
        if (this.sIntlMonetarySymbol == null) {
            this.sIntlMonetarySymbol = this.DoGetLocaleInfo(CultureData.LOCALE_SINTLSYMBOL);
        }
        return this.sIntlMonetarySymbol;
    }

    // English name for this currency (RegionInfo), eg: US Dollar
    public /* internal */ get SENGLISHCURRENCY(): string {
        if (this.sEnglishCurrency == null) {
            this.sEnglishCurrency = this.DoGetLocaleInfo(CultureData.LOCALE_SENGCURRNAME);
        }
        return this.sEnglishCurrency;
    }

    // Native name for this currency (RegionInfo), eg: Schweiz Frank
    public /* internal */ get SNATIVECURRENCY(): string {
        if (this.sNativeCurrency == null) {
            this.sNativeCurrency = this.DoGetLocaleInfo(CultureData.LOCALE_SNATIVECURRNAME);
        }
        return this.sNativeCurrency;
    }

    //                internal int iCurrencyDigits          ; // (user can override) # local monetary fractional digits
    //                internal int iCurrency                ; // (user can override) positive currency format
    //                internal int iNegativeCurrency        ; // (user can override) negative currency format

    // (user can override) monetary grouping of digits
    public /* internal */ get WAMONGROUPING(): IntArray {
        if (this.waMonetaryGrouping == null) {
            this.waMonetaryGrouping = CultureData.ConvertWin32GroupString(this.DoGetLocaleInfo(CultureData.LOCALE_SMONGROUPING));
        }
        return this.waMonetaryGrouping;
    }

    //                internal String sMonetaryDecimal         ; // (user can override) monetary decimal separator
    //                internal String sMonetaryThousand        ; // (user can override) monetary thousands separator

    /////////
    // Misc //
    /////////

    // (user can override) system of measurement 0=metric, 1=US (RegionInfo)
    public /* internal */ get IMEASURE(): int {
        if (this.iMeasure == undef) {
            this.iMeasure = this.DoGetLocaleInfoInt(CultureData.LOCALE_IMEASURE);
        }
        return this.iMeasure;
    }

    // (user can override) list Separator
    public/* internal */ get SLIST(): string {
        if (this.sListSeparator == null) {
            this.sListSeparator = this.DoGetLocaleInfo(CultureData.LOCALE_SLIST);
        }
        return this.sListSeparator;
    }



    ////////////////////////////
    // Calendar/Time (Gregorian) //
    ////////////////////////////

    // (user can override) AM designator
    public /* internal */ get SAM1159(): string {
        if (this.sAM1159 == null) {
            this.sAM1159 = this.DoGetLocaleInfo(CultureData.LOCALE_S1159);
        }
        return this.sAM1159;
    }

    // (user can override) PM designator
    public /* internal */ get SPM2359(): string {
        if (this.sPM2359 == null) {
            this.sPM2359 = this.DoGetLocaleInfo(CultureData.LOCALE_S2359);
        }
        return this.sPM2359;
    }

    // (user can override) time format
    public /* internal */ get LongTimes(): string[] {
        if (this.saLongTimes == null) {
            const longTimes: string[] = this.DoEnumTimeFormats();
            if (longTimes == null || longTimes.length === 0) {
                this.saLongTimes = CultureData.Invariant.saLongTimes;
            }
            else {
                this.saLongTimes = longTimes;
            }
        }
        return this.saLongTimes;
    }

    // short time format
    // Short times (derived from long times format)
    //
    public /* internal */ get ShortTimes(): string[] {
        if (this.saShortTimes == null) {
            // Try to get the short times from the OS/culture.dll
            let shortTimes: string[] = this.DoEnumShortTimeFormats();

            if (shortTimes == null || shortTimes.length === 0) {
                //
                // If we couldn't find short times, then compute them from long times
                // (eg: CORECLR on < Win7 OS & fallback for missing culture.dll)
                //
                shortTimes = this.DeriveShortTimesFromLong();
            }

            // Found short times, use them
            this.saShortTimes = shortTimes;
        }
        return this.saShortTimes;
    }


    private DeriveShortTimesFromLong(): string[] {
        // Our logic is to look for h,H,m,s,t.  If we find an s, then we check the string
        // between it and the previous marker, if any.  If its a short, unescaped separator,
        // then we don't retain that part.
        // We then check after the ss and remove anything before the next h,H,m,t...
        const shortTimes: string[] = New.Array(this.LongTimes.length);

        for (let i: int = 0; i < this.LongTimes.length; i++) {
            shortTimes[i] = CultureData.StripSecondsFromPattern(this.LongTimes[i]);
        }
        return shortTimes;
    }

    private static StripSecondsFromPattern(time: string): string {
        let bEscape: boolean = false;
        let iLastToken: int = -1;

        // Find the seconds
        for (let j: int = 0; j < time.length; j++) {
            // Change escape mode?
            if (time[j] === '\'') {
                // Continue
                bEscape = !bEscape;
                continue;
            }

            // See if there was a single \
            if (time[j] == '\\') {
                // Skip next char
                j++;
                continue;
            }

            if (bEscape) {
                continue;
            }

            switch (time[j]) {
                // Check for seconds
                case 's':
                    // Found seconds, see if there was something unescaped and short between
                    // the last marker and the seconds.  Windows says separator can be a
                    // maximum of three characters (without null)
                    // If 1st or last characters were ', then ignore it
                    if ((j - iLastToken) <= 4 && (j - iLastToken) > 1 &&
                        (time[iLastToken + 1] != '\'') &&
                        (time[j - 1] != '\'')) {
                        // There was something there we want to remember
                        if (iLastToken >= 0) {
                            j = iLastToken + 1;
                        }
                    }

                    let containsSpace: Out<boolean> = New.Out(false);;
                    let endIndex: int = CultureData.GetIndexOfNextTokenAfterSeconds(time, j, containsSpace);
                    const sb: StringBuilder = new StringBuilder(time.substring(0, j));
                    if (containsSpace) {
                        sb.Append(' ');
                    }
                    sb.Append(time.substring(endIndex));
                    time = sb.ToString();
                    break;
                case 'm':
                case 'H':
                case 'h':
                    iLastToken = j;
                    break;
            }
        }
        return time;
    }

    private static GetIndexOfNextTokenAfterSeconds(time: string, index: int, containsSpace: Out<boolean>): int {
        let bEscape: boolean = false;
        containsSpace.value = false;
        for (; index < time.length; index++) {
            switch (time[index]) {
                case '\'':
                    bEscape = !bEscape;
                    continue;
                case '\\':
                    index++;
                    if (time[index] === ' ') {
                        containsSpace.value = true;
                    }
                    continue;
                case ' ':
                    containsSpace.value = true;
                    break;
                case 't':
                case 'm':
                case 'H':
                case 'h':
                    if (bEscape) {
                        continue;
                    }
                    return index;
            }
        }
        containsSpace.value = false;
        return index;
    }

    // time duration format
    public /* internal */ get SADURATION(): string[] {
        //
        if (this.saDurationFormats == null) {
            const durationFormat: string = this.DoGetLocaleInfo(CultureData.LOCALE_SDURATION);
            this.saDurationFormats = [CultureData.ReescapeWin32String(durationFormat)];
        }
        return this.saDurationFormats;
    }

    // (user can override) first day of week
    public /* internal */ get IFIRSTDAYOFWEEK(): int {
        if (this.iFirstDayOfWeek == undef) {
            // Have to convert it from windows to .Net formats
            this.iFirstDayOfWeek = CultureData.ConvertFirstDayOfWeekMonToSun(this.DoGetLocaleInfoInt(CultureData.LOCALE_IFIRSTDAYOFWEEK));
        }
        return this.iFirstDayOfWeek;
    }

    // (user can override) first week of year
    public /* internal */ get IFIRSTWEEKOFYEAR(): int {
        if (this.iFirstWeekOfYear === undefined) {
            this.iFirstWeekOfYear = this.DoGetLocaleInfoInt(CultureData.LOCALE_IFIRSTWEEKOFYEAR);
        }
        return this.iFirstWeekOfYear;
    }

    // (user can override default only) short date format
    public /* internal */  ShortDates(calendarId: int): string[] {
        return this.GetCalendar(calendarId).saShortDates;
    }

    // (user can override default only) long date format
    public /* internal */  LongDates(calendarId: int): string[] {
        return this.GetCalendar(calendarId).saLongDates;
    }

    // (user can override) date year/month format.
    public /* internal */  YearMonths(calendarId: int): string[] {
        return this.GetCalendar(calendarId).saYearMonths;
    }

    // day names
    public /* internal */  DayNames(calendarId: int): string[] {
        return this.GetCalendar(calendarId).saDayNames;
    }

    // abbreviated day names
    public /* internal */  AbbreviatedDayNames(calendarId: int): string[] {
        // Get abbreviated day names for this calendar from the OS if necessary
        return this.GetCalendar(calendarId).saAbbrevDayNames;
    }

    // The super short day names
    public/* internal */  SuperShortDayNames(calendarId: int): string[] {
        return this.GetCalendar(calendarId).saSuperShortDayNames;
    }

    // month names
    public /* internal */  MonthNames(calendarId: int): string[] {
        return this.GetCalendar(calendarId).saMonthNames;
    }

    // Genitive month names
    public /* internal */  GenitiveMonthNames(calendarId: int): string[] {
        return this.GetCalendar(calendarId).saMonthGenitiveNames;
    }

    // month names
    public /* internal */  AbbreviatedMonthNames(calendarId: int): string[] {
        return this.GetCalendar(calendarId).saAbbrevMonthNames;
    }

    // Genitive month names
    public /* internal */  AbbreviatedGenitiveMonthNames(calendarId: int): string[] {
        return this.GetCalendar(calendarId).saAbbrevMonthGenitiveNames;
    }

    // Leap year month names
    // Note: This only applies to Hebrew, and it basically adds a "1" to the 6th month name
    // the non-leap names skip the 7th name in the normal month name array
    public /* internal */  LeapYearMonthNames(calendarId: int): string[] {
        return this.GetCalendar(calendarId).saLeapYearMonthNames;
    }

    // month/day format (single string, no override)
    public /* internal */  MonthDay(calendarId: int): string {
        return this.GetCalendar(calendarId).sMonthDay;
    }



    /////////////
    // Calendars //
    /////////////

    // all available calendar type(s), The first one is the default calendar.
    public /* internal */ get CalendarIds(): IntArray {
        if (this.waCalendars == null) {
            // We pass in an array of ints, and native side fills it up with count calendars.
            // We then have to copy that list to a new array of the right size.
            // Default calendar should be first
            //
            const calendarInts: IntArray = New.IntArray(23);
            //Contract.Assert(this.sWindowsName != null, "[CultureData.CalendarIds] Expected this.sWindowsName to be populated by COMNlsInfo::nativeInitCultureData already");
            let count: int = CalendarData.nativeGetCalendars(this.sWindowsName, this.bUseOverrides, calendarInts);

            // See if we had a calendar to add.
            if (count === 0) {
                // Failed for some reason, just grab Gregorian from Invariant
                this.waCalendars = CultureData.Invariant.waCalendars;
            }
            else {
                // The OS may not return calendar 4 for zh-TW, but we've always allowed it.
                //
                if (this.sWindowsName == "zh-TW") {
                    let found: boolean = false;

                    // Do we need to insert calendar 4?
                    for (let i: int = 0; i < count; i++) {
                        // Stop if we found calendar four
                        if (calendarInts[i] === Calendar.CAL_TAIWAN) {
                            found = true;
                            break;
                        }
                    }

                    // If not found then insert it
                    if (!found) {
                        // Insert it as the 2nd calendar
                        count++;
                        // Copy them from the 2nd position to the end, -1 for skipping 1st, -1 for one being added.
                        TArray.Copy(calendarInts, 1, calendarInts, 2, 23 - 1 - 1);
                        calendarInts[1] = Calendar.CAL_TAIWAN;
                    }
                }

                // It worked, remember the list
                const temp: IntArray = New.IntArray(count);
                TArray.Copy(calendarInts, temp, count);

                // Want 1st calendar to be default
                // Prior to Vista the enumeration didn't have default calendar first
                // Only a coreclr concern, culture.dll does the right thing.

                this.waCalendars = temp;
            }
        }

        return this.waCalendars;
    }


    // Native calendar names.  index of optional calendar - 1, empty if no optional calendar at that number
    public /* internal */  CalendarName(calendarId: int): string {
        // Get the calendar
        return this.GetCalendar(calendarId).sNativeName;
    }

    public /* internal */  GetCalendar(calendarId: int): CalendarData {
        //Contract.Assert(calendarId > 0 && calendarId <= CalendarData.MAX_CALENDARS,
        //"[CultureData.GetCalendar] Expect calendarId to be in a valid range");

        // arrays are 0 based, calendarIds are 1 based
        const calendarIndex: int = calendarId - 1;

        // Have to have calendars
        if (this.calendars == null) {
            this.calendars = New.Array(CalendarData.MAX_CALENDARS);
        }

        // we need the following local variable to avoid returning null
        // when another thread creates a new array of CalendarData (above)
        // right after we insert the newly created CalendarData (below)
        let calendarData: CalendarData = this.calendars[calendarIndex];
        // Make sure that calendar has data
        if (calendarData == null) {
            //Contract.Assert(this.sWindowsName != null, "[CultureData.GetCalendar] Expected this.sWindowsName to be populated by COMNlsInfo::nativeInitCultureData already");
            calendarData = new CalendarData(this.sWindowsName, calendarId, this.UseUserOverride);

            this.calendars[calendarIndex] = calendarData;
        }

        return calendarData;
    }

    public /* internal */  CurrentEra(calendarId: int): int {
        return this.GetCalendar(calendarId).iCurrentEra;
    }

    ///////////////////
    // Text Information //
    ///////////////////

    // IsRightToLeft
    public /* internal */ get IsRightToLeft(): boolean {
        // Returns one of the following 4 reading layout values:
        // 0 - Left to right (eg en-US)
        // 1 - Right to left (eg arabic locales)
        // 2 - Vertical top to bottom with columns to the left and also left to right (ja-JP locales)
        // 3 - Vertical top to bottom with columns proceeding to the right
        return (this.IREADINGLAYOUT == 1);
    }

    // IREADINGLAYOUT
    // Returns one of the following 4 reading layout values:
    // 0 - Left to right (eg en-US)
    // 1 - Right to left (eg arabic locales)
    // 2 - Vertical top to bottom with columns to the left and also left to right (ja-JP locales)
    // 3 - Vertical top to bottom with columns proceeding to the right
    //
    // If exposed as a public API, we'd have an enum with those 4 values
    private get IREADINGLAYOUT(): int {
        if (this.iReadingLayout == undef) {
            //Contract.Assert(this.sRealName != null, "[CultureData.IsRightToLeft] Expected this.sRealName to be populated by COMNlsInfo::nativeInitCultureData already");
            this.iReadingLayout = this.DoGetLocaleInfoInt(CultureData.LOCALE_IREADINGLAYOUT);
        }

        return (this.iReadingLayout);
    }

    // The TextInfo name never includes that alternate sort and is always specific
    // For customs, it uses the SortLocale (since the textinfo is not exposed in Win7)
    // en -> en-US
    // en-US -> en-US
    // fj (custom neutral) -> en-US (assuming that en-US is the sort locale for fj)
    // fj_FJ (custom specific) -> en-US (assuming that en-US is the sort locale for fj-FJ)
    // es-ES_tradnl -> es-ES
    public /* internal */ get STEXTINFO(): string               // Text info name to use for text information
    {

        // Note: Custom cultures might point at another culture's textinfo, however windows knows how
        // to redirect it to the desired textinfo culture, so this is OK.
        //Contract.Assert(this.sWindowsName != null, "[CultureData.STEXTINFO] Expected this.sWindowsName to be populated by COMNlsInfo::nativeInitCultureData already");
        return (this.sWindowsName);

    }

    // Compare info name (including sorting key) to use if custom
    public /* internal */ get SCOMPAREINFO(): string {
        // Note: Custom cultures might point at another culture's compareinfo, however windows knows how
        // to redirect it to the desired compareinfo culture, so this is OK.
        // Contract.Assert(this.sWindowsName != null, "[CultureData.SCOMPAREINFO] Expected this.sWindowsName to be populated by COMNlsInfo::nativeInitCultureData already");
        return this.sWindowsName;

    }

    public /* internal */ get IsSupplementalCustomCulture(): boolean {
        return false;
    }

    public /* internal */ get IDEFAULTANSICODEPAGE(): int   // default ansi code page ID (ACP)
    {
        if (this.iDefaultAnsiCodePage === undefined) {
            this.iDefaultAnsiCodePage = this.DoGetLocaleInfoInt(CultureData.LOCALE_IDEFAULTANSICODEPAGE);
        }
        return this.iDefaultAnsiCodePage;
    }

    public /* internal */ get IDEFAULTOEMCODEPAGE(): int   // default oem code page ID (OCP or OEM)
    {
        if (this.iDefaultOemCodePage == undef) {
            this.iDefaultOemCodePage = this.DoGetLocaleInfoInt(CultureData.LOCALE_IDEFAULTCODEPAGE);
        }
        return this.iDefaultOemCodePage;
    }

    public /* internal */ get IDEFAULTMACCODEPAGE(): int   // default macintosh code page
    {
        if (this.iDefaultMacCodePage == undef) {
            this.iDefaultMacCodePage = this.DoGetLocaleInfoInt(CultureData.LOCALE_IDEFAULTMACCODEPAGE);
        }
        return this.iDefaultMacCodePage;
    }

    public /* internal */ get IDEFAULTEBCDICCODEPAGE(): int   // default EBCDIC code page
    {
        if (this.iDefaultEbcdicCodePage === undefined) {
            this.iDefaultEbcdicCodePage = this.DoGetLocaleInfoInt(CultureData.LOCALE_IDEFAULTEBCDICCODEPAGE);
        }
        return this.iDefaultEbcdicCodePage;
    }


    // Obtain locale name from LCID
    public /* internal */ static LocaleNameToLCID(localeName: string): int {
        //throw new NotImplementedException('');
        let nativeCultureData = NativeCultures[localeName];

        if (nativeCultureData == null) {
            if (localeName.indexOf('-') > -1) {
                const splited: string[] = localeName.split('-');
                nativeCultureData = NativeCultures[splited[0] + '-' + splited[1].toUpperCase()];
            }
        }
        if (nativeCultureData == null) {
            throw new Exception('Culture Not Found. Culture Name:' + localeName);
        }

        if (nativeCultureData != null) {
            return nativeCultureData['LCID'];
        }
        throw new CultureNotFoundException(localeName);
    }

    // These are desktop only, not coreclr
    // locale ID (0409), including sort information
    public /* internal */ get ILANGUAGE(): int {
        if (this.iLanguage === 0) {
            // Contract.Assert(this.sRealName != null, "[CultureData.ILANGUAGE] Expected this.sRealName to be populated by COMNlsInfo::nativeInitCultureData already");
            this.iLanguage = CultureData.LocaleNameToLCID(this.sRealName);
        }
        return this.iLanguage;
    }

    public /* internal */ get IsWin32Installed(): boolean {
        return this.bWin32Installed;
    }

    public /* internal */  get IsFramework(): boolean {
        return this.bFramework;
    }




    ////////////////////
    // Derived properties //
    ////////////////////

    public /* internal */ get IsNeutralCulture(): boolean {
        // NlsInfo::nativeInitCultureData told us if we're neutral or not
        return this.bNeutral;
    }

    public /* internal */ get IsInvariantCulture(): boolean {
        return TString.IsNullOrEmpty(this.SNAME);
    }

    // Get an instance of our default calendar
    public /* internal */ get DefaultCalendar(): Calendar {
        let defaultCalId: int = this.DoGetLocaleInfoInt(CultureData.LOCALE_ICALENDARTYPE);
        if (defaultCalId === 0) {
            defaultCalId = this.CalendarIds[0];
        }
        return CultureInfo.GetCalendarInstance(defaultCalId);
    }

    // All of our era names
    public /* internal */ EraNames(calendarId: int): string[] {
        //Contract.Assert(calendarId > 0, "[CultureData.saEraNames] Expected Calendar.ID > 0");

        return this.GetCalendar(calendarId).saEraNames;
    }

    public /* internal */  AbbrevEraNames(calendarId: int): string[] {
        //Contract.Assert(calendarId > 0, "[CultureData.saAbbrevEraNames] Expected Calendar.ID > 0");

        return this.GetCalendar(calendarId).saAbbrevEraNames;
    }

    public /* internal */ AbbreviatedEnglishEraNames(calendarId: int): string[] {
        // Contract.Assert(calendarId > 0, "[CultureData.saAbbrevEraNames] Expected Calendar.ID > 0");
        return this.GetCalendar(calendarId).saAbbrevEnglishEraNames;
    }

    // String array DEFAULTS
    // Note: GetDTFIOverrideValues does the user overrides for these, so we don't have to.


    // Time separator (derived from time format)
    public /* internal */ get TimeSeparator(): string {

        if (this.sTimeSeparator == null) {
            let longTimeFormat: string = CultureData.ReescapeWin32String(this.DoGetLocaleInfo(CultureData.LOCALE_STIMEFORMAT));
            if (TString.IsNullOrEmpty(longTimeFormat)) {
                longTimeFormat = this.LongTimes[0];
            }

            // Compute STIME from time format
            this.sTimeSeparator = CultureData.GetTimeSeparator(longTimeFormat);
        }
        return this.sTimeSeparator;
    }

    // Date separator (derived from short date format)
    public /* internal */  DateSeparator(calendarId: int): string {
        return CultureData.GetDateSeparator(this.ShortDates(calendarId)[0]);
    }

    //////////////////////////////////////
    // Helper Functions to get derived properties //
    //////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////
    //
    // Unescape a NLS style quote string
    //
    // This removes single quotes:
    //      'fred' -> fred
    //      'fred -> fred
    //      fred' -> fred
    //      fred's -> freds
    //
    // This removes the first \ of escaped characters:
    //      fred\'s -> fred's
    //      a\\b -> a\b
    //      a\b -> ab
    //
    // We don't build the stringbuilder unless we find a ' or a \.  If we find a ' or a \, we
    // always build a stringbuilder because we need to remove the ' or \.
    //
    ////////////////////////////////////////////////////////////////////////////
    private static UnescapeNlsString(str: string, start: int, end: int): string {
        /*  Contract.Requires(str != null);
         Contract.Requires(start >= 0);
         Contract.Requires(end >= 0); */
        let result: StringBuilder = null as any;

        for (let i: int = start; i < str.length && i <= end; i++) {
            switch (str[i]) {
                case '\'':
                    if (result == null) {
                        result = new StringBuilder(str, start, i - start, str.length);
                    }
                    break;
                case '\\':
                    if (result == null) {
                        result = new StringBuilder(str, start, i - start, str.length);
                    }
                    ++i;
                    if (i < str.length) {
                        result.Append(str[i]);
                    }
                    break;
                default:
                    if (result != null) {
                        result.Append(str[i]);
                    }
                    break;
            }
        }

        if (result == null) {
            return (str.substring(start, end + 1));
        }

        return result.ToString();
    }

    ////////////////////////////////////////////////////////////////////////////
    //
    // Reescape a Win32 style quote string as a NLS+ style quoted string
    //
    // This is also the escaping style used by custom culture data files
    //
    // NLS+ uses \ to escape the next character, whether in a quoted string or
    // not, so we always have to change \ to \\.
    //
    // NLS+ uses \' to escape a quote inside a quoted string so we have to change
    // '' to \' (if inside a quoted string)
    //
    // We don't build the stringbuilder unless we find something to change
    ////////////////////////////////////////////////////////////////////////////
    public static /* internal */  ReescapeWin32String(str: string): string {
        // If we don't have data, then don't try anything
        if (str == null)
            return null as any;

        let result: StringBuilder = null as any;

        let inQuote: boolean = false;
        for (let i: int = 0; i < str.length; i++) {
            // Look for quote
            if (str[i] === '\'') {
                // Already in quote?
                if (inQuote) {
                    // See another single quote.  Is this '' of 'fred''s' or '''', or is it an ending quote?
                    if (i + 1 < str.length && str[i + 1] === '\'') {
                        // Found another ', so we have ''.  Need to add \' instead.
                        // 1st make sure we have our stringbuilder
                        if (result == null)
                            result = new StringBuilder(str, 0, i, str.length * 2);

                        // Append a \' and keep going (so we don't turn off quote mode)
                        result.Append("\\'");
                        i++;
                        continue;
                    }

                    // Turning off quote mode, fall through to add it
                    inQuote = false;
                }
                else {
                    // Found beginning quote, fall through to add it
                    inQuote = true;
                }
            }
            // Is there a single \ character?
            else if (str[i] === '\\') {
                // Found a \, need to change it to \\
                // 1st make sure we have our stringbuilder
                if (result == null)
                    result = new StringBuilder(str, 0, i, str.length * 2);

                // Append our \\ to the string & continue
                result.Append("\\\\");
                continue;
            }

            // If we have a builder we need to add our character
            if (result != null)
                result.Append(str[i]);
        }

        // Unchanged string? , just return input string
        if (result == null)
            return str;

        // String changed, need to use the builder
        return result.ToString();
    }

    public static /* internal */  ReescapeWin32Strings(array: string[]): string[] {
        if (array != null) {
            for (let i: int = 0; i < array.length; i++) {
                array[i] = CultureData.ReescapeWin32String(array[i]);
            }
        }

        return array;
    }

    // NOTE: this method is used through reflection by System.Globalization.CultureXmlParser.ReadDateElement()
    // and breaking changes here will not show up at build time, only at run time.
    private static GetTimeSeparator(format: string): string {
        // Time format separator (ie: : in 12:39:00)
        //
        // We calculate this from the provided time format
        //

        //
        //  Find the time separator so that we can pretend we know STIME.
        //
        return CultureData.GetSeparator(format, "Hhms");
    }

    // NOTE: this method is used through reflection by System.Globalization.CultureXmlParser.ReadDateElement()
    // and breaking changes here will not show up at build time, only at run time.
    private static GetDateSeparator(format: string): string {
        // Date format separator (ie: / in 9/1/03)
        //
        // We calculate this from the provided short date
        //

        //
        //  Find the date separator so that we can pretend we know SDATE.
        //
        return CultureData.GetSeparator(format, "dyM");
    }

    private static GetSeparator(format: string, timeParts: string): string {
        let index: int = CultureData.IndexOfTimePart(format, 0, timeParts);

        if (index !== -1) {
            // Found a time part, find out when it changes
            const cTimePart: char = format[index].charCodeAt(0);

            do {
                index++;
            } while (index < format.length && format[index].charCodeAt(0) === cTimePart);

            let separatorStart: int = index;

            // Now we need to find the end of the separator
            if (separatorStart < format.length) {
                const separatorEnd: int = CultureData.IndexOfTimePart(format, separatorStart, timeParts);
                if (separatorEnd !== -1) {
                    // From [separatorStart, count) is our string, except we need to unescape
                    const a = CultureData.UnescapeNlsString(format, separatorStart, separatorEnd - 1);
                    return a;
                }
            }
        }

        return TString.Empty;
    }

    private static IndexOfTimePart(format: string, startIndex: int, timeParts: string): int {
        /*  Contract.Assert(startIndex >= 0, "startIndex cannot be negative");
         Contract.Assert(timeParts.IndexOfAny(new char[] { '\'', '\\' }) == -1, "timeParts cannot include quote characters"); */
        let inQuote: boolean = false;
        for (let i: int = startIndex; i < format.length; ++i) {
            // See if we have a time Part
            if (!inQuote && timeParts.indexOf(format[i]) !== -1) {
                return i;
            }
            switch (format[i]) {
                case '\\':
                    if (i + 1 < format.length) {
                        ++i;
                        switch (format[i]) {
                            case '\'':
                            case '\\':
                                break;
                            default:
                                --i; //backup since we will move over this next
                                break;
                        }
                    }
                    break;
                case '\'':
                    inQuote = !inQuote;
                    break;
            }
        }

        return -1;
    }

    private DoGetLocaleInfo(lctype: string): string;
    private DoGetLocaleInfo(localeName: string, lctype: string): string;
    private DoGetLocaleInfo(...args: any[]): string {
        if (args.length === 1 && is.string(args[0])) {
            const lctype: string = args[0];
            //Contract.Assert(this.sWindowsName != null, "[CultureData.DoGetLocaleInfo] Expected this.sWindowsName to be populated by COMNlsInfo::nativeInitCultureData already");
            return this.DoGetLocaleInfo(this.sWindowsName, lctype);
        } else if (args.length === 2 && is.string(args[0]) && is.string(args[1])) {
            const localeName: string = args[0];
            let lctype: string = args[1];
            // Fix lctype if we don't want overrides
            if (!this.UseUserOverride) {
                //lctype |= CultureData.LOCALE_NOUSEROVERRIDE;
            }

            // Ask OS for data
            //Contract.Assert(localeName != null, "[CultureData.DoGetLocaleInfo] Expected localeName to be not be null");
            let result: string = CultureData.nativeGetLocaleInfoEx(localeName, lctype);
            if (result == null) {
                // Failed, just use empty string
                result = TString.Empty;
            }

            return result;
        }
        throw new ArgumentException('');
    }



    private DoGetLocaleInfoInt(lctype: string): int {
        // Fix lctype if we don't want overrides
        if (!this.UseUserOverride) {
            // lctype |= CultureData.LOCALE_NOUSEROVERRIDE;
        }

        // Ask OS for data, note that we presume it returns success, so we have to know that
        // sWindowsName is valid before calling.
        //Contract.Assert(this.sWindowsName != null, "[CultureData.DoGetLocaleInfoInt] Expected this.sWindowsName to be populated by COMNlsInfo::nativeInitCultureData already");
        const result: int = CultureData.nativeGetLocaleInfoExInt(this.sWindowsName, lctype);

        return result;
    }

    private DoEnumTimeFormats(): string[] {
        // Note that this gets overrides for us all the time
        //Contract.Assert(this.sWindowsName != null, "[CultureData.DoEnumTimeFormats] Expected this.sWindowsName to be populated by COMNlsInfo::nativeInitCultureData already");
        const result: string[] = CultureData.ReescapeWin32Strings(CultureData.nativeEnumTimeFormats(this.sWindowsName, 0, this.UseUserOverride));

        return result;
    }

    private DoEnumShortTimeFormats(): string[] {
        // Note that this gets overrides for us all the time
        //Contract.Assert(this.sWindowsName != null, "[CultureData.DoEnumShortTimeFormats] Expected this.sWindowsName to be populated by COMNlsInfo::nativeInitCultureData already");
        const result: string[] = CultureData.ReescapeWin32Strings(CultureData.nativeEnumTimeFormats(this.sWindowsName, CultureData.TIME_NOSECONDS, this.UseUserOverride));

        return result;
    }

    /////////////////
    // Static Helpers //
    ////////////////
    private /* internal */ static IsCustomCultureId(cultureId: int): boolean {
        if (cultureId === CultureInfo.LOCALE_CUSTOM_DEFAULT || cultureId === CultureInfo.LOCALE_CUSTOM_UNSPECIFIED) {
            return true;
        }
        return false;
    }

    ////////////////////////////////////////////////////////////////////////////
    //
    // Parameters:
    //      calendarValueOnly   Retrieve the values which are affected by the calendar change of DTFI.
    //                          This will cause values like longTimePattern not be retrieved since it is
    //                          not affected by the Calendar property in DTFI.
    //
    ////////////////////////////////////////////////////////////////////////////
    public /* internal */  GetNFIValues(nfi: NumberFormatInfo): void {
        if (this.IsInvariantCulture) {
            nfi.positiveSign = this.sPositiveSign;
            nfi.negativeSign = this.sNegativeSign;

            nfi.numberGroupSeparator = this.sThousandSeparator;
            nfi.numberDecimalSeparator = this.sDecimalSeparator;
            nfi.numberDecimalDigits = this.iDigits;
            nfi.numberNegativePattern = this.iNegativeNumber;

            nfi.currencySymbol = this.sCurrency;
            nfi.currencyGroupSeparator = this.sMonetaryThousand;
            nfi.currencyDecimalSeparator = this.sMonetaryDecimal;
            nfi.currencyDecimalDigits = this.iCurrencyDigits;
            nfi.currencyNegativePattern = this.iNegativeCurrency;
            nfi.currencyPositivePattern = this.iCurrency;
        }
        else {
            //
            // We don't have information for the following four.  All cultures use
            // the same value of the number formatting values.
            //
            // PercentDecimalDigits
            // PercentDecimalSeparator
            // PercentGroupSize
            // PercentGroupSeparator
            //

            //
            // Ask native side for our data.
            //
            //Contract.Assert(this.sWindowsName != null, "[CultureData.GetNFIValues] Expected this.sWindowsName to be populated by COMNlsInfo::nativeInitCultureData already");
            CultureData.nativeGetNumberFormatInfoValues(this.sWindowsName, nfi, this.UseUserOverride);
        }


        //
        // Gather additional data
        //
        nfi.numberGroupSizes = this.WAGROUPING;
        nfi.currencyGroupSizes = this.WAMONGROUPING;

        // prefer the cached value since these do not have user overrides
        nfi.percentNegativePattern = this.INEGATIVEPERCENT;
        nfi.percentPositivePattern = this.IPOSITIVEPERCENT;
        nfi.percentSymbol = this.SPERCENT;
        nfi.perMilleSymbol = this.SPERMILLE;

        nfi.negativeInfinitySymbol = this.SNEGINFINITY;
        nfi.positiveInfinitySymbol = this.SPOSINFINITY;
        nfi.nanSymbol = this.SNAN;

        //
        // We don't have percent values, so use the number values
        //
        nfi.percentDecimalDigits = nfi.numberDecimalDigits;
        nfi.percentDecimalSeparator = nfi.numberDecimalSeparator;
        nfi.percentGroupSizes = nfi.numberGroupSizes;
        nfi.percentGroupSeparator = nfi.numberGroupSeparator;

        //
        // Clean up a few odd values
        //

        // Windows usually returns an empty positive sign, but we like it to be "+"
        if (nfi.positiveSign == null || nfi.positiveSign.length === 0) nfi.positiveSign = "+";

        //Special case for Italian.  The currency decimal separator in the control panel is the empty string. When the user
        //specifies C4 as the currency format, this results in the number apparently getting multiplied by 10000 because the
        //decimal point doesn't show up.  We'll just hack this here because our default currency format will never use nfi.
        if (nfi.currencyDecimalSeparator == null || nfi.currencyDecimalSeparator.length === 0) {
            nfi.currencyDecimalSeparator = nfi.numberDecimalSeparator;
        }
    }

    private static ConvertFirstDayOfWeekMonToSun(iTemp: int): int {
        // Convert Mon-Sun to Sun-Sat format
        iTemp++;
        if (iTemp > 6) {
            // Wrap Sunday and convert invalid data to Sunday
            iTemp = 0;
        }
        return iTemp;
    }

    // Helper
    // This is ONLY used for caching names and shouldn't be used for anything else
    public /* internal */ static AnsiToLower(testString: string): string {
        const sb: StringBuilder = new StringBuilder(testString.length);

        for (let ich: int = 0; ich < testString.length; ich++) {
            const ch: char = testString[ich].charCodeAt(0);
            sb.AppendChar(ch <= 'Z'.charCodeAt(0) && ch >= 'A'.charCodeAt(0) ? (ch - 'A'.charCodeAt(0) + 'a'.charCodeAt(0)) : ch);
        }

        return (sb.ToString());
    }

    // If we get a group from windows, then its in 3;0 format with the 0 backwards
    // of how NLS+ uses it (ie: if the string has a 0, then the int[] shouldn't and vice versa)
    // EXCEPT in the case where the list only contains 0 in which NLS and NLS+ have the same meaning.
    private static ConvertWin32GroupString(win32Str: string): IntArray {
        // None of these cases make any sense
        if (win32Str == null || win32Str.length === 0) {
            return New.IntArray([3]);
        }

        if (win32Str[0] === '0') {
            return (New.IntArray(0));
        }

        // Since its in n;n;n;n;n format, we can always get the length quickly
        let values: IntArray;
        if (win32Str[win32Str.length - 1] === '0') {
            // Trailing 0 gets dropped. 1;0 -> 1
            values = New.IntArray(win32Str.length / 2);
        }
        else {
            // Need extra space for trailing zero 1 -> 1;0
            values = New.IntArray((win32Str.length / 2) + 2);
            values[values.length - 1] = 0;
        }

        let i: int;
        let j: int;
        for (i = 0, j = 0; i < win32Str.length && j < values.length; i += 2, j++) {
            // Note that this # shouldn't ever be zero, 'cause 0 is only at end
            // But we'll test because its registry that could be anything
            if (win32Str[i] < '1' || win32Str[i] > '9')
                return New.IntArray(3);

            values[j] = win32Str[i].charCodeAt(0) - '0'.charCodeAt(0);
        }

        return (values);
    }

    // LCTYPES for GetLocaleInfo
    private static readonly LOCALE_NOUSEROVERRIDE: uint = 0x80000000;   // do not use user overrides
    private static readonly LOCALE_RETURN_NUMBER: uint = 0x20000000;   // return number instead of string

    // Modifier for genitive names
    private static readonly LOCALE_RETURN_GENITIVE_NAMES: uint = 0x10000000;   //Flag to return the Genitive forms of month names

    //
    //  The following LCTypes are mutually exclusive in that they may NOT
    //  be used in combination with each other.
    //

    //
    // These are the various forms of the name of the locale:
    //
    private static readonly LOCALE_SLOCALIZEDDISPLAYNAME: string = 'LOCALE_SLOCALIZEDDISPLAYNAME'; //0x00000002;   // localized name of locale, eg "German (Germany)" in UI language
    private static readonly LOCALE_SENGLISHDISPLAYNAME: string = 'LOCALE_SENGLISHDISPLAYNAME'; //0x00000072;   // Display name (language + country usually) in English, eg "German (Germany)"
    private static readonly LOCALE_SNATIVEDISPLAYNAME: string = 'LOCALE_SNATIVEDISPLAYNAME'; //0x00000073;   // Display name in native locale language, eg "Deutsch (Deutschland)

    private static readonly LOCALE_SLOCALIZEDLANGUAGENAME: string = 'LOCALE_SLOCALIZEDLANGUAGENAME';//0x0000006f;   // Language Display Name for a language, eg "German" in UI language
    private static readonly LOCALE_SENGLISHLANGUAGENAME: string = 'LOCALE_SENGLISHLANGUAGENAME';// 0x00001001;   // English name of language, eg "German"
    private static readonly LOCALE_SNATIVELANGUAGENAME: string = 'LOCALE_SNATIVELANGUAGENAME';//0x00000004;   // native name of language, eg "Deutsch"

    private static readonly LOCALE_SLOCALIZEDCOUNTRYNAME: string = 'LOCALE_SLOCALIZEDCOUNTRYNAME'; //0x00000006;   // localized name of country, eg "Germany" in UI language
    private static readonly LOCALE_SENGLISHCOUNTRYNAME: string = 'LOCALE_SENGLISHCOUNTRYNAME'; // 0x00001002;   // English name of country, eg "Germany"
    private static readonly LOCALE_SNATIVECOUNTRYNAME: string = 'LOCALE_SNATIVECOUNTRYNAME'; // 0x00000008;   // native name of country, eg "Deutschland"


    //        private const uint LOCALE_ILANGUAGE              =0x00000001;   // language id // Don't use, use NewApis::LocaleNameToLCID instead (GetLocaleInfo doesn't return neutrals)

    //        private const uint LOCALE_SLANGUAGE              =LOCALE_SLOCALIZEDDISPLAYNAME;   // localized name of language (use LOCALE_SLOCALIZEDDISPLAYNAME instead)
    //        private const uint LOCALE_SENGLANGUAGE           =LOCALE_SENGLISHLANGUAGENAME;   // English name of language (use LOCALE_SENGLISHLANGUAGENAME instead)
    private static readonly LOCALE_SABBREVLANGNAME: string = 'LOCALE_SABBREVLANGNAME';// 0x00000003;   // abbreviated language name
    //        private const uint LOCALE_SNATIVELANGNAME        =LOCALE_SNATIVELANGUAGENAME;   // native name of language (use LOCALE_SNATIVELANGUAGENAME instead)

    private static readonly LOCALE_ICOUNTRY: string = 'LOCALE_ICOUNTRY'; // 0x00000005;   // country code
    //        private const uint LOCALE_SCOUNTRY               =LOCALE_SLOCALIZEDCOUNTRYNAME;   // localized name of country (use LOCALE_SLOCALIZEDCOUNTRYNAME instead)
    //        private const uint LOCALE_SENGCOUNTRY            =LOCALE_SENGLISHCOUNTRYNAME;   // English name of country (use LOCALE_SENGLISHCOUNTRYNAME instead)
    private static readonly LOCALE_SABBREVCTRYNAME: string = 'LOCALE_SABBREVCTRYNAME'; //0x00000007;   // abbreviated country name
    //        private const uint LOCALE_SNATIVECTRYNAME        =LOCALE_SNATIVECOUNTRYNAME;   // native name of country ( use LOCALE_SNATIVECOUNTRYNAME instead)
    private static readonly LOCALE_IGEOID: string = 'LOCALE_IGEOID'; // 0x0000005B;   // geographical location id

    private static readonly LOCALE_IDEFAULTLANGUAGE: string = 'LOCALE_IDEFAULTLANGUAGE'; //0x00000009;   // default language id
    private static readonly LOCALE_IDEFAULTCOUNTRY: string = 'LOCALE_IDEFAULTCOUNTRY'; //0x0000000A;   // default country code
    private static readonly LOCALE_IDEFAULTCODEPAGE: string = 'LOCALE_IDEFAULTCODEPAGE'; // 0x0000000B;   // default oem code page
    private static readonly LOCALE_IDEFAULTANSICODEPAGE: string = 'LOCALE_IDEFAULTANSICODEPAGE'; // 0x00001004;   // default ansi code page
    private static readonly LOCALE_IDEFAULTMACCODEPAGE: string = 'LOCALE_IDEFAULTMACCODEPAGE'; //0x00001011;   // default mac code page

    private static readonly LOCALE_SLIST: string = 'LOCALE_SLIST'; //0x0000000C;   // list item separator
    private static readonly LOCALE_IMEASURE: string = 'LOCALE_IMEASURE';//0x0000000D;   // 0 = metric, 1 = US

    private static readonly LOCALE_SDECIMAL: string = 'LOCALE_SDECIMAL';//0x0000000E;   // decimal separator
    private static readonly LOCALE_STHOUSAND: string = 'LOCALE_STHOUSAND';//0x0000000F;   // thousand separator
    private static readonly LOCALE_SGROUPING: string = 'LOCALE_SGROUPING';//0x00000010;   // digit grouping
    private static readonly LOCALE_IDIGITS: string = 'LOCALE_IDIGITS';//0x00000011;   // number of fractional digits
    private static readonly LOCALE_ILZERO: string = 'LOCALE_ILZERO';//0x00000012;   // leading zeros for decimal
    private static readonly LOCALE_INEGNUMBER: string = 'LOCALE_INEGNUMBER';//0x00001010;   // negative number mode
    private static readonly LOCALE_SNATIVEDIGITS: string = 'LOCALE_SNATIVEDIGITS';//0x00000013;   // native digits for 0-9

    private static readonly LOCALE_SCURRENCY: string = 'LOCALE_SCURRENCY'; //0x00000014;   // local monetary symbol
    private static readonly LOCALE_SINTLSYMBOL: string = 'LOCALE_SINTLSYMBOL'; //0x00000015;   // uintl monetary symbol
    private static readonly LOCALE_SMONDECIMALSEP: string = 'LOCALE_SMONDECIMALSEP'; //0x00000016;   // monetary decimal separator
    private static readonly LOCALE_SMONTHOUSANDSEP: string = 'LOCALE_SMONTHOUSANDSEP'; //0x00000017;   // monetary thousand separator
    private static readonly LOCALE_SMONGROUPING: string = 'LOCALE_SMONGROUPING'; //0x00000018;   // monetary grouping
    private static readonly LOCALE_ICURRDIGITS: string = 'LOCALE_ICURRDIGITS'; //0x00000019;   // # local monetary digits
    private static readonly LOCALE_IINTLCURRDIGITS: string = 'LOCALE_IINTLCURRDIGITS'; //0x0000001A;   // # uintl monetary digits
    private static readonly LOCALE_ICURRENCY: string = 'LOCALE_ICURRENCY'; //0x0000001B;   // positive currency mode
    private static readonly LOCALE_INEGCURR: string = 'LOCALE_INEGCURR'; //0x0000001C;   // negative currency mode

    private static readonly LOCALE_SDATE: string = 'LOCALE_SDATE';// 0x0000001D;   // date separator (derived from LOCALE_SSHORTDATE, use that instead)
    private static readonly LOCALE_STIME: string = 'LOCALE_STIME';// 0x0000001E;   // time separator (derived from LOCALE_STIMEFORMAT, use that instead)
    private static readonly LOCALE_SSHORTDATE: string = 'LOCALE_SSHORTDATE';// 0x0000001F;   // short date format string
    private static readonly LOCALE_SLONGDATE: string = 'LOCALE_SLONGDATE';// 0x00000020;   // long date format string
    private static readonly LOCALE_STIMEFORMAT: string = 'LOCALE_STIMEFORMAT';// 0x00001003;   // time format string
    private static readonly LOCALE_IDATE: string = 'LOCALE_IDATE';// 0x00000021;   // short date format ordering (derived from LOCALE_SSHORTDATE, use that instead)
    private static readonly LOCALE_ILDATE: string = 'LOCALE_ILDATE';// 0x00000022;   // long date format ordering (derived from LOCALE_SLONGDATE, use that instead)
    private static readonly LOCALE_ITIME: string = 'LOCALE_ITIME';// 0x00000023;   // time format specifier (derived from LOCALE_STIMEFORMAT, use that instead)
    private static readonly LOCALE_ITIMEMARKPOSN: string = 'LOCALE_ITIMEMARKPOSN';// 0x00001005;   // time marker position (derived from LOCALE_STIMEFORMAT, use that instead)
    private static readonly LOCALE_ICENTURY: string = 'LOCALE_ICENTURY';// 0x00000024;   // century format specifier (short date, LOCALE_SSHORTDATE is preferred)
    private static readonly LOCALE_ITLZERO: string = 'LOCALE_ITLZERO';// 0x00000025;   // leading zeros in time field (derived from LOCALE_STIMEFORMAT, use that instead)
    private static readonly LOCALE_IDAYLZERO: string = 'LOCALE_IDAYLZERO';// 0x00000026;   // leading zeros in day field (short date, LOCALE_SSHORTDATE is preferred)
    private static readonly LOCALE_IMONLZERO: string = 'LOCALE_IMONLZERO';// 0x00000027;   // leading zeros in month field (short date, LOCALE_SSHORTDATE is preferred)
    private static readonly LOCALE_S1159: string = 'LOCALE_S1159';// 0x00000028;   // AM designator
    private static readonly LOCALE_S2359: string = 'LOCALE_S2359';// 0x00000029;   // PM designator

    private static readonly LOCALE_ICALENDARTYPE: string = 'LOCALE_ICALENDARTYPE'; // 0x00001009;   // type of calendar specifier
    private static readonly LOCALE_IOPTIONALCALENDAR: string = 'LOCALE_IOPTIONALCALENDAR'; // 0x0000100B;   // additional calendar types specifier
    private static readonly LOCALE_IFIRSTDAYOFWEEK: string = 'LOCALE_IFIRSTDAYOFWEEK'; // 0x0000100C;   // first day of week specifier
    private static readonly LOCALE_IFIRSTWEEKOFYEAR: string = 'LOCALE_IFIRSTWEEKOFYEAR'; // 0x0000100D;   // first week of year specifier

    private static readonly LOCALE_SDAYNAME1: string = 'LOCALE_SDAYNAME1'; // 0x0000002A;   // long name for Monday
    private static readonly LOCALE_SDAYNAME2: string = 'LOCALE_SDAYNAME2'; // 0x0000002B;   // long name for Tuesday
    private static readonly LOCALE_SDAYNAME3: string = 'LOCALE_SDAYNAME3'; // 0x0000002C;   // long name for Wednesday
    private static readonly LOCALE_SDAYNAME4: string = 'LOCALE_SDAYNAME4'; // 0x0000002D;   // long name for Thursday
    private static readonly LOCALE_SDAYNAME5: string = 'LOCALE_SDAYNAME5'; // 0x0000002E;   // long name for Friday
    private static readonly LOCALE_SDAYNAME6: string = 'LOCALE_SDAYNAME6'; // 0x0000002F;   // long name for Saturday
    private static readonly LOCALE_SDAYNAME7: string = 'LOCALE_SDAYNAME7'; // 0x00000030;   // long name for Sunday
    private static readonly LOCALE_SABBREVDAYNAME1: string = 'LOCALE_SABBREVDAYNAME1'; // 0x00000031;   // abbreviated name for Monday
    private static readonly LOCALE_SABBREVDAYNAME2: string = 'LOCALE_SABBREVDAYNAME2'; // 0x00000032;   // abbreviated name for Tuesday
    private static readonly LOCALE_SABBREVDAYNAME3: string = 'LOCALE_SABBREVDAYNAME3'; // 0x00000033;   // abbreviated name for Wednesday
    private static readonly LOCALE_SABBREVDAYNAME4: string = 'LOCALE_SABBREVDAYNAME4'; // 0x00000034;   // abbreviated name for Thursday
    private static readonly LOCALE_SABBREVDAYNAME5: string = 'LOCALE_SABBREVDAYNAME5'; // 0x00000035;   // abbreviated name for Friday
    private static readonly LOCALE_SABBREVDAYNAME6: string = 'LOCALE_SABBREVDAYNAME6'; // 0x00000036;   // abbreviated name for Saturday
    private static readonly LOCALE_SABBREVDAYNAME7: string = 'LOCALE_SABBREVDAYNAME7'; // 0x00000037;   // abbreviated name for Sunday
    private static readonly LOCALE_SMONTHNAME1: string = 'LOCALE_SMONTHNAME1'; // 0x00000038;   // long name for January
    private static readonly LOCALE_SMONTHNAME2: string = 'LOCALE_SMONTHNAME2'; // 0x00000039;   // long name for February
    private static readonly LOCALE_SMONTHNAME3: string = 'LOCALE_SMONTHNAME3'; // 0x0000003A;   // long name for March
    private static readonly LOCALE_SMONTHNAME4: string = 'LOCALE_SMONTHNAME4'; // 0x0000003B;   // long name for April
    private static readonly LOCALE_SMONTHNAME5: string = 'LOCALE_SMONTHNAME5'; // 0x0000003C;   // long name for May
    private static readonly LOCALE_SMONTHNAME6: string = 'LOCALE_SMONTHNAME6'; // 0x0000003D;   // long name for June
    private static readonly LOCALE_SMONTHNAME7: string = 'LOCALE_SMONTHNAME7'; // 0x0000003E;   // long name for July
    private static readonly LOCALE_SMONTHNAME8: string = 'LOCALE_SMONTHNAME8'; // 0x0000003F;   // long name for August
    private static readonly LOCALE_SMONTHNAME9: string = 'LOCALE_SMONTHNAME9'; // 0x00000040;   // long name for September
    private static readonly LOCALE_SMONTHNAME10: string = 'LOCALE_SMONTHNAME10'; // 0x00000041;   // long name for October
    private static readonly LOCALE_SMONTHNAME11: string = 'LOCALE_SMONTHNAME11'; // 0x00000042;   // long name for November
    private static readonly LOCALE_SMONTHNAME12: string = 'LOCALE_SMONTHNAME12'; // 0x00000043;   // long name for December
    private static readonly LOCALE_SMONTHNAME13: string = 'LOCALE_SMONTHNAME13'; // 0x0000100E;   // long name for 13th month (if exists)
    private static readonly LOCALE_SABBREVMONTHNAME1: string = 'LOCALE_SABBREVMONTHNAME1'; // 0x00000044;   // abbreviated name for January
    private static readonly LOCALE_SABBREVMONTHNAME2: string = 'LOCALE_SABBREVMONTHNAME2'; // 0x00000045;   // abbreviated name for February
    private static readonly LOCALE_SABBREVMONTHNAME3: string = 'LOCALE_SABBREVMONTHNAME3'; // 0x00000046;   // abbreviated name for March
    private static readonly LOCALE_SABBREVMONTHNAME4: string = 'LOCALE_SABBREVMONTHNAME4'; // 0x00000047;   // abbreviated name for April
    private static readonly LOCALE_SABBREVMONTHNAME5: string = 'LOCALE_SABBREVMONTHNAME5'; // 0x00000048;   // abbreviated name for May
    private static readonly LOCALE_SABBREVMONTHNAME6: string = 'LOCALE_SABBREVMONTHNAME6'; // 0x00000049;   // abbreviated name for June
    private static readonly LOCALE_SABBREVMONTHNAME7: string = 'LOCALE_SABBREVMONTHNAME7'; // 0x0000004A;   // abbreviated name for July
    private static readonly LOCALE_SABBREVMONTHNAME8: string = 'LOCALE_SABBREVMONTHNAME8'; // 0x0000004B;   // abbreviated name for August
    private static readonly LOCALE_SABBREVMONTHNAME9: string = 'LOCALE_SABBREVMONTHNAME9'; // 0x0000004C;   // abbreviated name for September
    private static readonly LOCALE_SABBREVMONTHNAME10: string = 'LOCALE_SABBREVMONTHNAME10'; // 0x0000004D;   // abbreviated name for October
    private static readonly LOCALE_SABBREVMONTHNAME11: string = 'LOCALE_SABBREVMONTHNAME11'; // 0x0000004E;   // abbreviated name for November
    private static readonly LOCALE_SABBREVMONTHNAME12: string = 'LOCALE_SABBREVMONTHNAME12'; // 0x0000004F;   // abbreviated name for December
    private static readonly LOCALE_SABBREVMONTHNAME13: string = 'LOCALE_SABBREVMONTHNAME13'; // 0x0000100F;   // abbreviated name for 13th month (if exists)

    private static readonly LOCALE_SPOSITIVESIGN: string = 'LOCALE_SPOSITIVESIGN'; // 0x00000050;   // positive sign
    private static readonly LOCALE_SNEGATIVESIGN: string = 'LOCALE_SNEGATIVESIGN'; // 0x00000051;   // negative sign
    private static readonly LOCALE_IPOSSIGNPOSN: string = 'LOCALE_IPOSSIGNPOSN'; // 0x00000052;   // positive sign position (derived from INEGCURR)
    private static readonly LOCALE_INEGSIGNPOSN: string = 'LOCALE_INEGSIGNPOSN'; // 0x00000053;   // negative sign position (derived from INEGCURR)
    private static readonly LOCALE_IPOSSYMPRECEDES: string = 'LOCALE_IPOSSYMPRECEDES'; // 0x00000054;   // mon sym precedes pos amt (derived from ICURRENCY)
    private static readonly LOCALE_IPOSSEPBYSPACE: string = 'LOCALE_IPOSSEPBYSPACE'; // 0x00000055;   // mon sym sep by space from pos amt (derived from ICURRENCY)
    private static readonly LOCALE_INEGSYMPRECEDES: string = 'LOCALE_INEGSYMPRECEDES'; // 0x00000056;   // mon sym precedes neg amt (derived from INEGCURR)
    private static readonly LOCALE_INEGSEPBYSPACE: string = 'LOCALE_INEGSEPBYSPACE'; // 0x00000057;   // mon sym sep by space from neg amt (derived from INEGCURR)

    private static readonly LOCALE_FONTSIGNATURE: string = 'LOCALE_FONTSIGNATURE'; // 0x00000058;   // font signature
    private static readonly LOCALE_SISO639LANGNAME: string = 'LOCALE_SISO639LANGNAME'; // 0x00000059;   // ISO abbreviated language name
    private static readonly LOCALE_SISO3166CTRYNAME: string = 'LOCALE_SISO3166CTRYNAME'; // 0x0000005A;   // ISO abbreviated country name

    private static readonly LOCALE_IDEFAULTEBCDICCODEPAGE: string = 'LOCALE_IDEFAULTEBCDICCODEPAGE'; //0x00001012;   // default ebcdic code page
    private static readonly LOCALE_IPAPERSIZE: string = 'LOCALE_IPAPERSIZE'; //0x0000100A;   // 1 = letter, 5 = legal, 8 = a3, 9 = a4
    private static readonly LOCALE_SENGCURRNAME: string = 'LOCALE_SENGCURRNAME'; //0x00001007;   // english name of currency
    private static readonly LOCALE_SNATIVECURRNAME: string = 'LOCALE_SNATIVECURRNAME'; //0x00001008;   // native name of currency
    private static readonly LOCALE_SYEARMONTH: string = 'LOCALE_SYEARMONTH'; //0x00001006;   // year month format string
    private static readonly LOCALE_SSORTNAME: string = 'LOCALE_SSORTNAME'; //0x00001013;   // sort name
    private static readonly LOCALE_IDIGITSUBSTITUTION: string = 'LOCALE_IDIGITSUBSTITUTION'; //0x00001014;   // 0 = context, 1 = none, 2 = national

    private static readonly LOCALE_SNAME: string = 'LOCALE_SNAME';// 0x0000005c;   // locale name (with sort info) (ie: de-DE_phoneb)
    private static readonly LOCALE_SDURATION: string = 'LOCALE_SDURATION';// 0x0000005d;   // time duration format
    private static readonly LOCALE_SKEYBOARDSTOINSTALL: string = 'LOCALE_SKEYBOARDSTOINSTALL';// 0x0000005e;   // (windows only) keyboards to install
    private static readonly LOCALE_SSHORTESTDAYNAME1: string = 'LOCALE_SSHORTESTDAYNAME1';// 0x00000060;   // Shortest day name for Monday
    private static readonly LOCALE_SSHORTESTDAYNAME2: string = 'LOCALE_SSHORTESTDAYNAME2';// 0x00000061;   // Shortest day name for Tuesday
    private static readonly LOCALE_SSHORTESTDAYNAME3: string = 'LOCALE_SSHORTESTDAYNAME3';// 0x00000062;   // Shortest day name for Wednesday
    private static readonly LOCALE_SSHORTESTDAYNAME4: string = 'LOCALE_SSHORTESTDAYNAME4';// 0x00000063;   // Shortest day name for Thursday
    private static readonly LOCALE_SSHORTESTDAYNAME5: string = 'LOCALE_SSHORTESTDAYNAME5';// 0x00000064;   // Shortest day name for Friday
    private static readonly LOCALE_SSHORTESTDAYNAME6: string = 'LOCALE_SSHORTESTDAYNAME6';// 0x00000065;   // Shortest day name for Saturday
    private static readonly LOCALE_SSHORTESTDAYNAME7: string = 'LOCALE_SSHORTESTDAYNAME7';// 0x00000066;   // Shortest day name for Sunday
    private static readonly LOCALE_SISO639LANGNAME2: string = 'LOCALE_SISO639LANGNAME2';// 0x00000067;   // 3 character ISO abbreviated language name
    private static readonly LOCALE_SISO3166CTRYNAME2: string = 'LOCALE_SISO3166CTRYNAME2';// 0x00000068;   // 3 character ISO country name
    private static readonly LOCALE_SNAN: string = 'LOCALE_SNAN';// 0x00000069;   // Not a Number
    private static readonly LOCALE_SPOSINFINITY: string = 'LOCALE_SPOSINFINITY';// 0x0000006a;   // + Infinity
    private static readonly LOCALE_SNEGINFINITY: string = 'LOCALE_SNEGINFINITY';// 0x0000006b;   // - Infinity
    private static readonly LOCALE_SSCRIPTS: string = 'LOCALE_SSCRIPTS';// 0x0000006c;   // Typical scripts in the locale
    private static readonly LOCALE_SPARENT: string = 'LOCALE_SPARENT';// 0x0000006d;   // Fallback name for resources
    private static readonly LOCALE_SCONSOLEFALLBACKNAME: string = 'LOCALE_SCONSOLEFALLBACKNAME';// 0x0000006e;   // Fallback name for within the console
    //        private const uint LOCALE_SLANGDISPLAYNAME       =LOCALE_SLOCALIZEDLANGUAGENAME;   // Language Display Name for a language (use LOCALE_SLOCALIZEDLANGUAGENAME instead)

    // Windows 7 LCTYPES
    private static readonly LOCALE_IREADINGLAYOUT: string = 'LOCALE_IREADINGLAYOUT'; // 0x00000070;   // Returns one of the following 4 reading layout values:
    // 0 - Left to right (eg en-US)
    // 1 - Right to left (eg arabic locales)
    // 2 - Vertical top to bottom with columns to the left and also left to right (ja-JP locales)
    // 3 - Vertical top to bottom with columns proceeding to the right
    private static readonly LOCALE_INEUTRAL: string = 'LOCALE_INEUTRAL'; // 0x00000071;   // Returns 0 for specific cultures, 1 for neutral cultures.
    private static readonly LOCALE_INEGATIVEPERCENT: string = 'LOCALE_INEGATIVEPERCENT'; // 0x00000074;   // Returns 0-11 for the negative percent format
    private static readonly LOCALE_IPOSITIVEPERCENT: string = 'LOCALE_IPOSITIVEPERCENT'; // 0x00000075;   // Returns 0-3 for the positive percent formatIPOSITIVEPERCENT
    private static readonly LOCALE_SPERCENT: string = 'LOCALE_SPERCENT'; // 0x00000076;   // Returns the percent symbol
    private static readonly LOCALE_SPERMILLE: string = 'LOCALE_SPERMILLE'; // 0x00000077;   // Returns the permille (U+2030) symbol
    private static readonly LOCALE_SMONTHDAY: string = 'LOCALE_SMONTHDAY'; // 0x00000078;   // Returns the preferred month/day format
    private static readonly LOCALE_SSHORTTIME: string = 'LOCALE_SSHORTTIME'; // 0x00000079;   // Returns the preferred short time format (ie: no seconds, just h:mm)
    private static readonly LOCALE_SOPENTYPELANGUAGETAG: string = 'LOCALE_SOPENTYPELANGUAGETAG'; // 0x0000007a;   // Open type language tag, eg: "latn" or "dflt"
    private static readonly LOCALE_SSORTLOCALE: string = 'LOCALE_SSORTLOCALE'; // 0x0000007b;   // Name of locale to use for sorting/collation/casing behavior.

    // Time formats enumerations
    public /* internal */ static readonly TIME_NOSECONDS: uint = 0x00000002;   // Don't use seconds (get short time format for enumtimeformats on win7+)

    // Get our initial minimal culture data (name, parent, etc.)
    public /* internal */ static nativeInitCultureData(cultureData: CultureData): boolean {
        let nativeCultureInfo = NativeCultures[cultureData.CultureName];
        if (nativeCultureInfo == null) {
            if (cultureData.CultureName.indexOf('-') > -1) {
                const splited: string[] = cultureData.CultureName.split('-');
                nativeCultureInfo = NativeCultures[splited[0] + '-' + splited[1].toUpperCase()];
            }
        }
        if (nativeCultureInfo == null) {
            throw new Exception('Culture Not Found. Culture Name:' + cultureData.CultureName);
        }

        cultureData.sLocalizedDisplayName = nativeCultureInfo.LOCALE_SLOCALIZEDDISPLAYNAME;
        cultureData.sEnglishDisplayName = nativeCultureInfo.LOCALE_SENGLISHDISPLAYNAME;
        cultureData.sNativeDisplayName = nativeCultureInfo.LOCALE_SNATIVEDISPLAYNAME;
        cultureData.sName = nativeCultureInfo.LOCALE_SNAME;
        cultureData.sWindowsName = nativeCultureInfo.LOCALE_SNAME;
        cultureData.sParent = nativeCultureInfo.LOCALE_SPARENT;
        cultureData.bNeutral = nativeCultureInfo.LOCALE_INEUTRAL !== '0';

        cultureData.sISO639Language2 = nativeCultureInfo.LOCALE_SISO639LANGNAME2;

        //console.log(nativeCultureInfo);
        //throw new NotImplementedException('nativeInitCultureData');
        return true;
    }

    // Grab the NumberFormatInfo data
    public /* internal */ static nativeGetNumberFormatInfoValues(localeName: string, nfi: NumberFormatInfo, useUserOverride: boolean): boolean {
        //throw new NotImplementedException('nativeGetNumberFormatInfoValues');
        if (TString.IsNullOrEmpty(localeName)) {
            localeName = 'Invariant';
        }
        const nativeCultureInfo = NativeCultures[localeName];
        if (nativeCultureInfo != null) {
            /*   nfi.NumberDecimalSeparator = nativeCultureInfo.LOCALE_SDECIMAL;
              nfi.NumberGroupSeparator = nativeCultureInfo.LOCALE_STHOUSAND;
              nfi.NumberGroupSizes = New.IntArray(nativeCultureInfo.LOCALE_SGROUPING.split(';').map(str => Convert.ToInt32(str)));
              nfi.NumberDecimalDigits = Convert.ToInt32(nativeCultureInfo.LOCALE_IDIGITS);
              nfi.NativeDigits = nativeCultureInfo.LOCALE_SNATIVEDIGITS.map(c => c);
              nfi.CurrencySymbol = nativeCultureInfo.LOCALE_SCURRENCY; */
            nfi.CurrencyDecimalDigits = nativeCultureInfo.NumberFormat.CurrencyDecimalDigits;
            nfi.CurrencyDecimalSeparator = nativeCultureInfo.NumberFormat.CurrencyDecimalSeparator;
            //nfi.IsReadOnly = nativeCultureInfo.NumberFormat.IsReadOnly;
            nfi.CurrencyGroupSizes = nativeCultureInfo.NumberFormat.CurrencyGroupSizes;
            nfi.NumberGroupSizes = nativeCultureInfo.NumberFormat.NumberGroupSizes;
            nfi.PercentGroupSizes = nativeCultureInfo.NumberFormat.PercentGroupSizes;
            nfi.CurrencyGroupSeparator = nativeCultureInfo.NumberFormat.CurrencyGroupSeparator;
            nfi.CurrencySymbol = nativeCultureInfo.NumberFormat.CurrencySymbol;
            nfi.NaNSymbol = nativeCultureInfo.NumberFormat.NaNSymbol;
            nfi.CurrencyNegativePattern = nativeCultureInfo.NumberFormat.CurrencyNegativePattern;
            nfi.NumberNegativePattern = nativeCultureInfo.NumberFormat.NumberNegativePattern;
            nfi.PercentPositivePattern = nativeCultureInfo.NumberFormat.PercentPositivePattern;
            nfi.PercentNegativePattern = nativeCultureInfo.NumberFormat.PercentNegativePattern;
            nfi.NegativeInfinitySymbol = nativeCultureInfo.NumberFormat.NegativeInfinitySymbol;
            nfi.NegativeSign = nativeCultureInfo.NumberFormat.NegativeSign;
            nfi.NumberDecimalDigits = nativeCultureInfo.NumberFormat.NumberDecimalDigits;
            nfi.NumberDecimalSeparator = nativeCultureInfo.NumberFormat.NumberDecimalSeparator;
            nfi.NumberGroupSeparator = nativeCultureInfo.NumberFormat.NumberGroupSeparator;
            nfi.CurrencyPositivePattern = nativeCultureInfo.NumberFormat.CurrencyPositivePattern;
            nfi.PositiveInfinitySymbol = nativeCultureInfo.NumberFormat.PositiveInfinitySymbol;
            nfi.PositiveSign = nativeCultureInfo.NumberFormat.PositiveSign;
            nfi.PercentDecimalDigits = nativeCultureInfo.NumberFormat.PercentDecimalDigits;
            nfi.PercentDecimalSeparator = nativeCultureInfo.NumberFormat.PercentDecimalSeparator;
            nfi.PercentGroupSeparator = nativeCultureInfo.NumberFormat.PercentGroupSeparator;
            nfi.PercentSymbol = nativeCultureInfo.NumberFormat.PercentSymbol;
            nfi.PerMilleSymbol = nativeCultureInfo.NumberFormat.PerMilleSymbol;
            nfi.NativeDigits = nativeCultureInfo.NumberFormat.NativeDigits;
            //nfi.DigitSubstitution = nativeCultureInfo.NumberFormat.DigitSubstitution;

        }
        return true;
    }

    private static nativeEnumTimeFormats(localeName: string, dwFlags: uint, useUserOverride: boolean): string[] {
        throw new NotImplementedException('nativeEnumTimeFormats');
    }

    public /* internal */ static nativeEnumCultureNames(cultureTypes: int, retStringArray: any): int {
        throw new NotImplementedException('nativeEnumCultureNames');
    }

    //
    //  Helper Methods.
    //

    // Get Locale Info Ex calls.  So we don't have to muck with the different int/string return types we declared two of these:
    public /* internal */ static nativeGetLocaleInfoEx(localeName: string, field: string): string {
        if (TString.IsNullOrEmpty(localeName)) {
            localeName = 'Invariant';
        }
        const nativeCultureInfo = NativeCultures[localeName];
        if (nativeCultureInfo != null) {
            const fieldInfo = nativeCultureInfo[field];
            if (fieldInfo == null) {
                throw new Exception('nativeGetLocaleInfoEx de tanımlanmamış case : ' + field);
            }
            return fieldInfo;
            /*  switch (field) {
                 case CultureData.LOCALE_SLOCALIZEDDISPLAYNAME:
                     return nativeCultureInfo['SLOCALIZEDDISPLAYNAME'];
                 case CultureData.LOCALE_SENGLISHDISPLAYNAME:
                     return nativeCultureInfo['LOCALE_SENGLISHDISPLAYNAME'];
                 case CultureData.LOCALE_SNATIVEDISPLAYNAME:
                     return nativeCultureInfo['LOCALE_SNATIVEDISPLAYNAME'];
                 case CultureData.LOCALE_SPARENT:
                     return nativeCultureInfo['LOCALE_SPARENT'];
                 default:
                     throw new Exception('nativeGetLocaleInfoEx de tanımlanmamış case : ' + field);
             } */
        }
        Console.Error.WriteLine('localeName: {0} not found., field :{1}', localeName, field);
        throw new Exception('');
    }
    public /* internal */ static nativeGetLocaleInfoExInt(localeName: string, field: string): int {
        if (TString.IsNullOrEmpty(localeName)) {
            localeName = 'Invariant';
        }
        const nativeCultureInfo = NativeCultures[localeName];
        if (nativeCultureInfo != null) {
            const fieldInfo = nativeCultureInfo[field];
            if (fieldInfo == null) {
                throw new Exception('nativeGetLocaleInfoExInt de tanımlanmamış case : ' + field);
            }
            return fieldInfo;
            /*  switch (field) {
                 case CultureData.LOCALE_SLOCALIZEDDISPLAYNAME:
                     return nativeCultureInfo['SLOCALIZEDDISPLAYNAME'];
                 case CultureData.LOCALE_SENGLISHDISPLAYNAME:
                     return nativeCultureInfo['LOCALE_SENGLISHDISPLAYNAME'];
                 case CultureData.LOCALE_SNATIVEDISPLAYNAME:
                     return nativeCultureInfo['LOCALE_SNATIVEDISPLAYNAME'];
                 case CultureData.LOCALE_SPARENT:
                     return nativeCultureInfo['LOCALE_SPARENT'];
                 default:
                     throw new Exception('nativeGetLocaleInfoEx de tanımlanmamış case : ' + field);
             } */
        }
        Console.Error.WriteLine('localeName: {0} not found., field :{1}', localeName, field);
        throw new Exception('');
    }
    public /* internal */ static nativeSetThreadLocale(localeName: string): boolean {
        throw new NotImplementedException('nativeSetThreadLocale');
    }
}


//------*********************************************************************------------------------------------------------------------------------------
export class TokenHashValue {
    public /* internal */  tokenString: string;
    public /* internal */  tokenType: TokenType;
    public /* internal */  tokenValue: int;

    public /* internal */ constructor(tokenString: string, tokenType: TokenType, tokenValue: int) {
        this.tokenString = tokenString;
        this.tokenType = tokenType;
        this.tokenValue = tokenValue;
    }
}

@ClassInfo({
    fullName: System.Types.Globalization.DateTimeFormatInfo,
    instanceof: [
        System.Types.Globalization.DateTimeFormatInfo,
        System.Types.ICloneable,
        System.Types.IFormatProvider
    ]
})
export class DateTimeFormatInfo extends TObject implements ICloneable<DateTimeFormatInfo>, IFormatProvider {
    protected dispose(disposing: boolean): void {
        throw new Error("Method not implemented.");
    }

    //
    // Note, some fields are derived so don't really need to be serialized, but we can't mark as
    // optional because Whidbey was expecting them.  Post-Arrowhead we could fix that
    // once Whidbey serialization is no longer necessary.
    //

    // cache for the invariant culture.
    // invariantInfo is constant irrespective of your current culture.
    private static invariantInfo: DateTimeFormatInfo;

    // an index which points to a record in Culture Data Table.
    private m_cultureData: CultureData;

    // The culture name used to create this DTFI.
    public /* internal */  m_name: string = null as any;

    // The language name of the culture used to create this DTFI.
    private m_langName: string = null as any;

    // CompareInfo usually used by the parser.
    private m_compareInfo: CompareInfo = null as any;

    // Culture matches current DTFI. mainly used for string comparisons during parsing.
    private m_cultureInfo: CultureInfo = null as any;

    //
    // Caches for various properties.
    //

    //

    public /* internal */ amDesignator: string = null as any;
    public /* internal */ pmDesignator: string = null as any;
    public /* internal */  dateSeparator: string = null as any;            // derived from short date (whidbey expects, arrowhead doesn't)
    public /* internal */  generalShortTimePattern: string = null as any;     // short date + short time (whidbey expects, arrowhead doesn't)
    public /* internal */  generalLongTimePattern: string = null as any;     // short date + long time (whidbey expects, arrowhead doesn't)
    public /* internal */  timeSeparator: string = null as any;            // derived from long time (whidbey expects, arrowhead doesn't)
    public /* internal */  monthDayPattern: string = null as any;
    public /* internal */  dateTimeOffsetPattern: string = null as any;

    //
    // The following are constant values.
    //
    public /* internal */ static readonly rfc1123Pattern: string = "ddd, dd MMM yyyy HH':'mm':'ss 'GMT'";

    // The sortable pattern is based on ISO 8601.
    public /* internal */ static readonly sortableDateTimePattern: string = "yyyy'-'MM'-'dd'T'HH':'mm':'ss";
    public /* internal */ static readonly universalSortableDateTimePattern: string = "yyyy'-'MM'-'dd HH':'mm':'ss'Z'";

    //
    // The following are affected by calendar settings.
    //
    public /* internal */  calendar: Calendar = null as any;

    public /* internal */  firstDayOfWeek: int = -1;
    public /* internal */  calendarWeekRule: int = -1;

    public/* internal */  fullDateTimePattern: string = null as any;        // long date + long time (whidbey expects, arrowhead doesn't)

    public /* internal */  abbreviatedDayNames: string[] = null as any;

    public /* internal */  m_superShortDayNames: string[] = null as any;

    public /*internal */  dayNames: string[] = null as any;
    public /*internal */  abbreviatedMonthNames: string[] = null as any;
    public /*internal */  monthNames: string[] = null as any;
    // Cache the genitive month names that we retrieve from the data table.
    public /* internal */  genitiveMonthNames: string[] = null as any;

    // Cache the abbreviated genitive month names that we retrieve from the data table.
    public /* internal */  m_genitiveAbbreviatedMonthNames: string[] = null as any;

    // Cache the month names of a leap year that we retrieve from the data table.
    public /* internal */ leapYearMonthNames: string[] = null as any;

    // For our "patterns" arrays we have 2 variables, a string and a string[]
    //
    // The string[] contains the list of patterns, EXCEPT the default may not be included.
    // The string contains the default pattern.
    // When we initially construct our string[], we set the string to string[0]

    // The "default" Date/time patterns
    public /* internal */  longDatePattern: string = null as any;
    public /* internal */  shortDatePattern: string = null as any;
    public /* internal */  yearMonthPattern: string = null as any;
    public /* internal */  longTimePattern: string = null as any;
    public /* internal */  shortTimePattern: string = null as any;

    // These are Whidbey-serialization compatable arrays (eg: default not included)
    // "all" is a bit of a misnomer since the "default" pattern stored above isn't
    // necessarily a member of the list
    private allYearMonthPatterns: string[] = null as any;   // This was wasn't serialized in Whidbey
    public /* internal */  allShortDatePatterns: string[] = null as any;
    public /* internal */  allLongDatePatterns: string[] = null as any;
    public /* internal */  allShortTimePatterns: string[] = null as any;
    public /* internal */  allLongTimePatterns: string[] = null as any;

    // Cache the era names for this DateTimeFormatInfo instance.
    public /* internal */  m_eraNames: string[] = null as any;
    public /* internal */  m_abbrevEraNames: string[] = null as any;
    public /* internal */  m_abbrevEnglishEraNames: string[] = null as any;

    public/* internal */  optionalCalendars: IntArray = null as any;

    private static readonly DEFAULT_ALL_DATETIMES_SIZE: int = 132;

    // CultureInfo updates this
    /* internal */  m_isReadOnly: boolean = false;

    public static InitPreferExistingTokens(): boolean {
        const ret: boolean = false;
        return ret;
    }
    // This flag gives hints about if formatting/parsing should perform special code path for things like
    // genitive form or leap year month names.
    public /* internal */  formatFlags: DateTimeFormatFlags = DateTimeFormatFlags.NotInitialized;
    public /* internal */ static preferExistingTokens: boolean = DateTimeFormatInfo.InitPreferExistingTokens();
    //
    private get CultureName(): string {
        if (this.m_name == null) {
            this.m_name = this.m_cultureData.CultureName;
        }
        return this.m_name;
    }

    private get Culture(): CultureInfo {
        if (this.m_cultureInfo == null) {
            this.m_cultureInfo = CultureInfo.GetCultureInfo(this.CultureName);
        }
        return this.m_cultureInfo;
    }


    //
    private get LanguageName(): string {
        if (this.m_langName == null) {
            this.m_langName = this.m_cultureData.SISO639LANGNAME;
        }
        return (this.m_langName);
    }

    ////////////////////////////////////////////////////////////////////////////
    //
    // Create an array of string which contains the abbreviated day names.
    //
    ////////////////////////////////////////////////////////////////////////////

    private internalGetAbbreviatedDayOfWeekNames(): string[] {
        if (this.abbreviatedDayNames == null) {
            // Get the abbreviated day names for our current calendar
            this.abbreviatedDayNames = this.m_cultureData.AbbreviatedDayNames(this.Calendar.ID);
            //Contract.Assert(this.abbreviatedDayNames.Length == 7, "[DateTimeFormatInfo.GetAbbreviatedDayOfWeekNames] Expected 7 day names in a week");
        }
        return (this.abbreviatedDayNames);
    }

    ////////////////////////////////////////////////////////////////////////
    //
    // Action: Returns the string array of the one-letter day of week names.
    // Returns:
    //  an array of one-letter day of week names
    // Arguments:
    //  None
    // Exceptions:
    //  None
    //
    ////////////////////////////////////////////////////////////////////////

    private internalGetSuperShortDayNames(): string[] {
        if (this.m_superShortDayNames == null) {
            // Get the super short day names for our current calendar
            this.m_superShortDayNames = this.m_cultureData.SuperShortDayNames(this.Calendar.ID);
            // Contract.Assert(this.m_superShortDayNames.Length == 7, "[DateTimeFormatInfo.internalGetSuperShortDayNames] Expected 7 day names in a week");
        }
        return (this.m_superShortDayNames);
    }

    ////////////////////////////////////////////////////////////////////////////
    //
    // Create an array of string which contains the day names.
    //
    ////////////////////////////////////////////////////////////////////////////

    private internalGetDayOfWeekNames(): string[] {
        if (this.dayNames == null) {
            // Get the day names for our current calendar
            this.dayNames = this.m_cultureData.DayNames(this.Calendar.ID);
            //Contract.Assert(this.dayNames.Length == 7, "[DateTimeFormatInfo.GetDayOfWeekNames] Expected 7 day names in a week");
        }
        return (this.dayNames);
    }

    ////////////////////////////////////////////////////////////////////////////
    //
    // Create an array of string which contains the abbreviated month names.
    //
    ////////////////////////////////////////////////////////////////////////////

    private internalGetAbbreviatedMonthNames(): string[] {
        if (this.abbreviatedMonthNames == null) {
            // Get the month names for our current calendar
            this.abbreviatedMonthNames = this.m_cultureData.AbbreviatedMonthNames(this.Calendar.ID);
            //Contract.Assert(this.abbreviatedMonthNames.Length === 12 || this.abbreviatedMonthNames.Length === 13, "[DateTimeFormatInfo.GetAbbreviatedMonthNames] Expected 12 or 13 month names in a year");
        }
        return this.abbreviatedMonthNames;
    }


    ////////////////////////////////////////////////////////////////////////////
    //
    // Create an array of string which contains the month names.
    //
    ////////////////////////////////////////////////////////////////////////////

    private internalGetMonthNames(): string[] {
        if (this.monthNames == null) {
            // Get the month names for our current calendar
            this.monthNames = this.m_cultureData.MonthNames(this.Calendar.ID);
            //Contract.Assert(this.monthNames.Length == 12 || this.monthNames.Length == 13, "[DateTimeFormatInfo.GetMonthNames] Expected 12 or 13 month names in a year");
        }

        return (this.monthNames);
    }


    //
    // Invariant DateTimeFormatInfo doesn't have user-overriden values
    // Default calendar is gregorian

    public /* internal */ constructor(cultureData: CultureData = CultureInfo.InvariantCulture.m_cultureData, cal?: Calendar) {

        super();
        if (cal === undefined) {
            throw new Exception('düzelt');
            //cal = GregorianCalendar.GetDefaultInstance()
        }
        //Contract.Requires(cultureData != null);
        //Contract.Requires(cal != null);

        // Remember our culture
        this.m_cultureData = cultureData;

        // m_isDefaultCalendar is set in the setter of Calendar below.
        this.Calendar = cal;
    }


    private InitializeOverridableProperties(cultureData: CultureData, calendarID: int): void {

    }

    //#region Serialization
    // The following fields are defined to keep the serialization compatibility with .NET V1.0/V1.1.
    private CultureID: int = 0;
    private m_useUserOverride: boolean = false;

    // This was synthesized by Whidbey so we knew what words might appear in the middle of a date string
    // Now we always synthesize so its not helpful
    public /* internal */  m_dateWords: string[] = null as any;               // calculated, no need to serialze  (whidbey expects, arrowhead doesn't)

    // Returns a default DateTimeFormatInfo that will be universally
    // supported and constant irrespective of the current culture.
    // Used by FromString methods.
    //

    public static get InvariantInfo(): DateTimeFormatInfo {
        // Contract.Ensures(Contract.Result<DateTimeFormatInfo>() != null);
        if (DateTimeFormatInfo.invariantInfo == null) {
            const info: DateTimeFormatInfo = new DateTimeFormatInfo();
            info.Calendar.SetReadOnlyState(true);
            info.m_isReadOnly = true;
            DateTimeFormatInfo.invariantInfo = info;
        }
        return (DateTimeFormatInfo.invariantInfo);
    }

    // Returns the current culture's DateTimeFormatInfo.  Used by Parse methods.
    //

    public static get CurrentInfo(): DateTimeFormatInfo {
        // Contract.Ensures(Contract.Result<DateTimeFormatInfo>() != null);
        const _Thread = Context.Current.get('Thread');
        const culture: CultureInfo = _Thread.CurrentThread.CurrentCulture;
        if (!culture.m_isInherited) {
            const info: DateTimeFormatInfo = culture.dateTimeInfo;
            if (info != null) {
                return info;
            }
        }
        return culture.GetFormat(type(System.Types.Globalization.DateTimeFormatInfo));
    }


    public static GetInstance(provider: IFormatProvider): DateTimeFormatInfo {
        // Fast case for a regular CultureInfo
        let info: DateTimeFormatInfo;
        const cultureProvider: CultureInfo = provider as CultureInfo;
        if (cultureProvider != null && !cultureProvider.m_isInherited) {
            return cultureProvider.DateTimeFormat;
        }
        // Fast case for a DTFI;
        info = provider as DateTimeFormatInfo;
        if (info != null) {
            return info;
        }
        // Wasn't cultureInfo or DTFI, do it the slower way
        if (provider != null) {
            info = provider.GetFormat(type(System.Types.Globalization.DateTimeFormatInfo)) as DateTimeFormatInfo;
            if (info != null) {
                return info;
            }
        }
        // Couldn't get anything, just use currentInfo as fallback
        return DateTimeFormatInfo.CurrentInfo;
    }


    public GetFormat(formatType: Type): any {
        return (formatType === type(System.Types.Globalization.DateTimeFormatInfo) ? this : null);
    }


    public Clone(): DateTimeFormatInfo {
        const n: DateTimeFormatInfo = this.MemberwiseClone();
        // We can use the data member calendar in the setter, instead of the property Calendar,
        // since the cloned copy should have the same state as the original copy.
        n.calendar = this.Calendar.Clone();
        n.m_isReadOnly = false;
        return n;
    }


    public get AMDesignator(): string {
        if (this.amDesignator == null) {
            this.amDesignator = this.m_cultureData.SAM1159;
        }
        //Contract.Assert(this.amDesignator != null, "DateTimeFormatInfo.AMDesignator, amDesignator != null");
        return (this.amDesignator);
    }

    public set AMDesignator(value: string) {
        if (this.IsReadOnly)
            throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_ReadOnly"));
        if (value == null) {
            throw new ArgumentNullException("value", Environment.GetResourceString("ArgumentNull_String"));
        }
        // Contract.EndContractBlock();
        this.ClearTokenHashTable();
        this.amDesignator = value;
    }



    public get Calendar(): Calendar {
        //Contract.Ensures(Contract.Result<Calendar>() != null);

        //Contract.Assert(this.calendar != null, "DateTimeFormatInfo.Calendar: calendar != null");
        return (this.calendar);
    }

    public set Calendar(value: Calendar) {
        if (this.IsReadOnly)
            throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_ReadOnly"));
        if (value == null) {
            throw new ArgumentNullException("value", Environment.GetResourceString("ArgumentNull_Obj"));
        }
        //Contract.EndContractBlock();
        if (value === this.calendar) {
            return;
        }

        //
        // Because the culture is agile object which can be attached to a thread and then thread can travel
        // to another app domain then we prevent attaching any customized object to culture that we cannot contol.
        //
        //CultureInfo.CheckDomainSafetyObject(value, this);

        for (let i: int = 0; i < this.OptionalCalendars.length; i++) {
            if (this.OptionalCalendars[i] == value.ID) {
                // We can use this one, so do so.

                // Clean related properties if we already had a calendar set
                if (this.calendar != null) {
                    // clean related properties which are affected by the calendar setting,
                    // so that they will be refreshed when they are accessed next time.
                    //

                    // These properites are in the order as appearing in calendar.xml.
                    this.m_eraNames = null as any;
                    this.m_abbrevEraNames = null as any;
                    this.m_abbrevEnglishEraNames = null as any;

                    this.monthDayPattern = null as any;

                    this.dayNames = null as any;
                    this.abbreviatedDayNames = null as any;
                    this.m_superShortDayNames = null as any;
                    this.monthNames = null as any;
                    this.abbreviatedMonthNames = null as any;
                    this.genitiveMonthNames = null as any;
                    this.m_genitiveAbbreviatedMonthNames = null as any;
                    this.leapYearMonthNames = null as any;
                    this.formatFlags = DateTimeFormatFlags.NotInitialized;

                    this.allShortDatePatterns = null as any;
                    this.allLongDatePatterns = null as any;
                    this.allYearMonthPatterns = null as any;
                    this.dateTimeOffsetPattern = null as any;

                    // The defaults need reset as well:
                    this.longDatePattern = null as any;
                    this.shortDatePattern = null as any;
                    this.yearMonthPattern = null as any;

                    // These properies are not in the OS data, but they are dependent on the values like shortDatePattern.
                    this.fullDateTimePattern = null as any; // Long date + long time
                    this.generalShortTimePattern = null as any; // short date + short time
                    this.generalLongTimePattern = null as any; // short date + long time

                    // Derived item that changes
                    this.dateSeparator = null as any;

                    // We don't need to do these because they are not changed by changing calendar
                    //      amDesignator
                    //      pmDesignator
                    //      timeSeparator
                    //      longTimePattern
                    //      firstDayOfWeek
                    //      calendarWeekRule

                    // We don't need to clear these because they're only used for whidbey compat serialization
                    // the only values we use are the all...Patterns[0]
                    //      longDatePattern
                    //      shortDatePattern
                    //      yearMonthPattern

                    // remember to reload tokens
                    this.ClearTokenHashTable();
                }

                // Remember the new calendar
                this.calendar = value;
                this.InitializeOverridableProperties(this.m_cultureData, this.calendar.ID);

                // We succeeded, return
                return;
            }
        }

        // The assigned calendar is not a valid calendar for this culture, throw
        throw new ArgumentOutOfRangeException("value", Environment.GetResourceString("Argument_InvalidCalendar"));
    }


    private get OptionalCalendars(): IntArray {
        if (this.optionalCalendars == null) {
            this.optionalCalendars = this.m_cultureData.CalendarIds;
        }
        return (this.optionalCalendars);
    }

    /*=================================GetEra==========================
    **Action: Get the era value by parsing the name of the era.
    **Returns: The era value for the specified era name.
    **      -1 if the name of the era is not valid or not supported.
    **Arguments: eraName    the name of the era.
    **Exceptions: None.
    ============================================================================*/


    public GetEra(eraName: string): int {
        if (eraName == null) {
            throw new ArgumentNullException("eraName",
                Environment.GetResourceString("ArgumentNull_String"));
        }
        //Contract.EndContractBlock();

        // For Geo-----al reasons, the Era Name and Abbreviated Era Name
        // for ---- Calendar on non----- SKU returns empty string (which
        // would be matched below) but we don't want the empty string to give
        // us an Era number
        // confer 85900 DTFI.GetEra("") should fail on all cultures
        if (eraName.length === 0) {
            return (-1);
        }

        // The following is based on the assumption that the era value is starting from 1, and has a
        // serial values.
        // If that ever changes, the code has to be changed.

        // The calls to String.Compare should use the current culture for the string comparisons, but the
        // invariant culture when comparing against the english names.
        for (let i: int = 0; i < this.EraNames.length; i++) {
            // Compare the era name in a case-insensitive way for the appropriate culture.
            if (this.m_eraNames[i].length > 0) {
                if (TString.Compare(eraName, this.m_eraNames[i], this.Culture, CompareOptions.IgnoreCase) === 0) {
                    return (i + 1);
                }
            }
        }
        for (let i: int = 0; i < this.AbbreviatedEraNames.length; i++) {
            // Compare the abbreviated era name in a case-insensitive way for the appropriate culture.
            if (TString.Compare(eraName, this.m_abbrevEraNames[i], this.Culture, CompareOptions.IgnoreCase) === 0) {
                return (i + 1);
            }
        }
        for (let i: int = 0; i < this.AbbreviatedEnglishEraNames.length; i++) {
            // this comparison should use the InvariantCulture.  The English name could have linguistically
            // interesting characters.
            if (TString.Compare(eraName, this.m_abbrevEnglishEraNames[i], StringComparison.InvariantCultureIgnoreCase) === 0) {
                return (i + 1);
            }
        }
        return (-1);
    }

    public /* internal */ get EraNames(): string[] {
        if (this.m_eraNames == null) {
            this.m_eraNames = this.m_cultureData.EraNames(this.Calendar.ID);;
        }
        return (this.m_eraNames);
    }

    /*=================================GetEraName==========================
    **Action: Get the name of the era for the specified era value.
    **Returns: The name of the specified era.
    **Arguments:
    **      era the era value.
    **Exceptions:
    **      ArguementException if the era valie is invalid.
    ============================================================================*/

    // Era names are 1 indexed
    public GetEraName(era: int): string {
        if (era === Calendar.CurrentEra) {
            era = this.Calendar.CurrentEraValue;
        }

        // The following is based on the assumption that the era value is starting from 1, and has a
        // serial values.
        // If that ever changes, the code has to be changed.
        if ((--era) < this.EraNames.length && (era >= 0)) {
            return (this.m_eraNames[era]);
        }
        throw new ArgumentOutOfRangeException("era", Environment.GetResourceString("ArgumentOutOfRange_InvalidEraValue"));
    }

    public /* internal */ get AbbreviatedEraNames(): string[] {
        if (this.m_abbrevEraNames == null) {
            this.m_abbrevEraNames = this.m_cultureData.AbbrevEraNames(this.Calendar.ID);
        }
        return (this.m_abbrevEraNames);
    }

    // Era names are 1 indexed
    public GetAbbreviatedEraName(era: int): string {
        if (this.AbbreviatedEraNames.length === 0) {
            // If abbreviation era name is not used in this culture,
            // return the full era name.
            return (this.GetEraName(era));
        }
        if (era === Calendar.CurrentEra) {
            era = this.Calendar.CurrentEraValue;
        }
        if ((--era) < this.m_abbrevEraNames.length && (era >= 0)) {
            return (this.m_abbrevEraNames[era]);
        }
        throw new ArgumentOutOfRangeException("era", Environment.GetResourceString("ArgumentOutOfRange_InvalidEraValue"));
    }

    public /* internal */  get AbbreviatedEnglishEraNames(): string[] {
        if (this.m_abbrevEnglishEraNames == null) {
            //Contract.Assert(Calendar.ID > 0, "[DateTimeFormatInfo.AbbreviatedEnglishEraNames] Expected Calendar.ID > 0");
            this.m_abbrevEnglishEraNames = this.m_cultureData.AbbreviatedEnglishEraNames(this.Calendar.ID);
        }
        return (this.m_abbrevEnglishEraNames);
    }


    // Note that cultureData derives this from the short date format (unless someone's set this previously)
    // Note that this property is quite undesirable.
    public get DateSeparator(): string {
        if (this.dateSeparator == null) {
            this.dateSeparator = this.m_cultureData.DateSeparator(this.Calendar.ID);
        }
        // Contract.Assert(this.dateSeparator != null, "DateTimeFormatInfo.DateSeparator, dateSeparator != null");
        return (this.dateSeparator);
    }

    public get FirstDayOfWeek(): DayOfWeek {
        if (this.firstDayOfWeek === -1) {
            this.firstDayOfWeek = this.m_cultureData.IFIRSTDAYOFWEEK;
        }
        // Contract.Assert(this.firstDayOfWeek != -1, "DateTimeFormatInfo.FirstDayOfWeek, firstDayOfWeek != -1");

        return this.firstDayOfWeek;
    }

    public set FirstDayOfWeek(value: DayOfWeek) {
        if (this.IsReadOnly)
            throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_ReadOnly"));
        if (value >= DayOfWeek.Sunday && value <= DayOfWeek.Saturday) {
            this.firstDayOfWeek = value;
        } else {
            throw new ArgumentOutOfRangeException(
                "value", Environment.GetResourceString("ArgumentOutOfRange_Range",
                    DayOfWeek.Sunday, DayOfWeek.Saturday));
        }
    }



    public get CalendarWeekRule(): CalendarWeekRule {
        if (this.calendarWeekRule === -1) {
            this.calendarWeekRule = this.m_cultureData.IFIRSTWEEKOFYEAR;
        }
        // Contract.Assert(this.calendarWeekRule != -1, "DateTimeFormatInfo.CalendarWeekRule, calendarWeekRule != -1");
        return this.calendarWeekRule;
    }

    public set CalendarWeekRule(value: CalendarWeekRule) {
        if (this.IsReadOnly)
            throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_ReadOnly"));
        if (value >= CalendarWeekRule.FirstDay && value <= CalendarWeekRule.FirstFourDayWeek) {
            this.calendarWeekRule = value;
        } else {
            throw new ArgumentOutOfRangeException(
                "value", Environment.GetResourceString("ArgumentOutOfRange_Range",
                    CalendarWeekRule.FirstDay, CalendarWeekRule.FirstFourDayWeek));
        }
    }




    public get FullDateTimePattern(): string {
        if (this.fullDateTimePattern == null) {
            this.fullDateTimePattern = this.LongDatePattern + " " + this.LongTimePattern;
        }
        return (this.fullDateTimePattern);
    }

    public set FullDateTimePattern(value: string) {
        if (this.IsReadOnly)
            throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_ReadOnly"));
        if (value == null) {
            throw new ArgumentNullException("value", Environment.GetResourceString("ArgumentNull_String"));
        }
        //Contract.EndContractBlock();
        this.fullDateTimePattern = value;
    }


    // For our "patterns" arrays we have 2 variables, a string and a string[]
    //
    // The string[] contains the list of patterns, EXCEPT the default may not be included.
    // The string contains the default pattern.
    // When we initially construct our string[], we set the string to string[0]
    public get LongDatePattern(): string {
        // Initialize our long date pattern from the 1st array value if not set
        if (this.longDatePattern == null) {
            // Initialize our data
            this.longDatePattern = this.UnclonedLongDatePatterns[0];
        }

        return this.longDatePattern;
    }

    public set LongDatePattern(value: string) {
        if (this.IsReadOnly)
            throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_ReadOnly"));
        if (value == null) {
            throw new ArgumentNullException("value", Environment.GetResourceString("ArgumentNull_String"));
        }
        //Contract.EndContractBlock();

        // Remember the new string
        this.longDatePattern = value;

        // Clear the token hash table
        this.ClearTokenHashTable();

        // Clean up cached values that will be affected by this property.
        this.fullDateTimePattern = null as any;
    }


    // For our "patterns" arrays we have 2 variables, a string and a string[]
    //
    // The string[] contains the list of patterns, EXCEPT the default may not be included.
    // The string contains the default pattern.
    // When we initially construct our string[], we set the string to string[0]
    public get LongTimePattern(): string {
        // Initialize our long time pattern from the 1st array value if not set
        if (this.longTimePattern == null) {
            // Initialize our data
            this.longTimePattern = this.UnclonedLongTimePatterns[0];
        }

        return this.longTimePattern;
    }

    public set LongTimePattern(value: string) {
        if (this.IsReadOnly)
            throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_ReadOnly"));
        if (value == null) {
            throw new ArgumentNullException("value",
                Environment.GetResourceString("ArgumentNull_String"));
        }
        // Contract.EndContractBlock();

        // Remember the new string
        this.longTimePattern = value;

        // Clear the token hash table
        this.ClearTokenHashTable();

        // Clean up cached values that will be affected by this property.
        this.fullDateTimePattern = null as any;     // Full date = long date + long Time
        this.generalLongTimePattern = null as any;  // General long date = short date + long Time
        this.dateTimeOffsetPattern = null as any;
    }



    // Note: just to be confusing there's only 1 month day pattern, not a whole list
    public get MonthDayPattern(): string {
        if (this.monthDayPattern == null) {
            //Contract.Assert(Calendar.ID > 0, "[DateTimeFormatInfo.MonthDayPattern] Expected calID > 0");
            this.monthDayPattern = this.m_cultureData.MonthDay(this.Calendar.ID);
        }
        //Contract.Assert(this.monthDayPattern != null, "DateTimeFormatInfo.MonthDayPattern, monthDayPattern != null");
        return (this.monthDayPattern);
    }

    public set MonthDayPattern(value: string) {
        if (this.IsReadOnly)
            throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_ReadOnly"));
        if (value == null) {
            throw new ArgumentNullException("value", Environment.GetResourceString("ArgumentNull_String"));
        }
        //Contract.EndContractBlock();

        this.monthDayPattern = value;
    }

    public get PMDesignator(): string {

        if (this.pmDesignator == null) {
            this.pmDesignator = this.m_cultureData.SPM2359;
        }
        //Contract.Assert(this.pmDesignator != null, "DateTimeFormatInfo.PMDesignator, pmDesignator != null");
        return (this.pmDesignator);
    }

    public set PMDesignator(value: string) {
        if (this.IsReadOnly)
            throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_ReadOnly"));
        if (value == null) {
            throw new ArgumentNullException("value", Environment.GetResourceString("ArgumentNull_String"));
        }
        //Contract.EndContractBlock();
        this.ClearTokenHashTable();

        this.pmDesignator = value;
    }


    public get RFC1123Pattern(): string {
        return (DateTimeFormatInfo.rfc1123Pattern);
    }

    // For our "patterns" arrays we have 2 variables, a string and a string[]
    //
    // The string[] contains the list of patterns, EXCEPT the default may not be included.
    // The string contains the default pattern.
    // When we initially construct our string[], we set the string to string[0]
    public get ShortDatePattern(): string {
        // Initialize our short date pattern from the 1st array value if not set
        if (this.shortDatePattern == null) {
            // Initialize our data
            this.shortDatePattern = this.UnclonedShortDatePatterns[0];
        }

        return this.shortDatePattern;
    }

    public set ShortDatePattern(value: string) {
        if (this.IsReadOnly)
            throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_ReadOnly"));
        if (value == null)
            throw new ArgumentNullException("value", Environment.GetResourceString("ArgumentNull_String"));
        //Contract.EndContractBlock();

        // Remember the new string
        this.shortDatePattern = value;

        // Clear the token hash table, note that even short dates could require this
        this.ClearTokenHashTable();

        // Clean up cached values that will be affected by this property.
        this.generalLongTimePattern = null as any;   // General long time = short date + long time
        this.generalShortTimePattern = null as any;  // General short time = short date + short Time
        this.dateTimeOffsetPattern = null as any;
    }



    // For our "patterns" arrays we have 2 variables, a string and a string[]
    //
    // The string[] contains the list of patterns, EXCEPT the default may not be included.
    // The string contains the default pattern.
    // When we initially construct our string[], we set the string to string[0]
    public get ShortTimePattern(): string {
        // Initialize our short time pattern from the 1st array value if not set
        if (this.shortTimePattern == null) {
            // Initialize our data
            this.shortTimePattern = this.UnclonedShortTimePatterns[0];
        }
        return this.shortTimePattern;
    }

    public set ShortTimePattern(value: string) {
        if (this.IsReadOnly)
            throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_ReadOnly"));
        if (value == null) {
            throw new ArgumentNullException("value", Environment.GetResourceString("ArgumentNull_String"));
        }
        //Contract.EndContractBlock();

        // Remember the new string
        this.shortTimePattern = value;

        // Clear the token hash table, note that even short times could require this
        this.ClearTokenHashTable();

        // Clean up cached values that will be affected by this property.
        this.generalShortTimePattern = null as any; // General short date = short date + short time.
    }


    public get SortableDateTimePattern(): string {
        return (DateTimeFormatInfo.sortableDateTimePattern);
    }

    /*=================================GeneralShortTimePattern=====================
    **Property: Return the pattern for 'g' general format: shortDate + short time
    **Note: This is used by DateTimeFormat.cs to get the pattern for 'g'
    **      We put this internal property here so that we can avoid doing the
    **      concatation every time somebody asks for the general format.
    ==============================================================================*/

    public /* internal */ get GeneralShortTimePattern(): string {
        if (this.generalShortTimePattern == null) {
            this.generalShortTimePattern = this.ShortDatePattern + " " + this.ShortTimePattern;
        }
        return (this.generalShortTimePattern);
    }

    /*=================================GeneralLongTimePattern=====================
    **Property: Return the pattern for 'g' general format: shortDate + Long time
    **Note: This is used by DateTimeFormat.cs to get the pattern for 'g'
    **      We put this internal property here so that we can avoid doing the
    **      concatation every time somebody asks for the general format.
    ==============================================================================*/

    public /* internal */ get GeneralLongTimePattern(): string {
        if (this.generalLongTimePattern == null) {
            this.generalLongTimePattern = this.ShortDatePattern + " " + this.LongTimePattern;
        }
        return (this.generalLongTimePattern);
    }

    /*=================================DateTimeOffsetPattern==========================
    **Property: Return the default pattern DateTimeOffset : shortDate + long time + time zone offset
    **Note: This is used by DateTimeFormat.cs to get the pattern for short Date + long time +  time zone offset
    **      We put this internal property here so that we can avoid doing the
    **      concatation every time somebody uses this form
    ==============================================================================*/

    /*=================================DateTimeOffsetPattern==========================
    **Property: Return the default pattern DateTimeOffset : shortDate + long time + time zone offset
    **Note: This is used by DateTimeFormat.cs to get the pattern for short Date + long time +  time zone offset
    **      We put this internal property here so that we can avoid doing the
    **      concatation every time somebody uses this form
    ==============================================================================*/

    public /* internal */ get DateTimeOffsetPattern(): string {
        if (this.dateTimeOffsetPattern == null) {

            this.dateTimeOffsetPattern = this.ShortDatePattern + " " + this.LongTimePattern;

            /* LongTimePattern might contain a "z" as part of the format string in which case we don't want to append a time zone offset */

            let foundZ: boolean = false;
            let inQuote: boolean = false;
            let quote: char = '\''.charCodeAt(0);
            for (let i: int = 0; !foundZ && i < this.LongTimePattern.length; i++) {
                switch (this.LongTimePattern[i]) {
                    case 'z':
                        /* if we aren't in a quote, we've found a z */
                        foundZ = !inQuote;
                        /* we'll fall out of the loop now because the test includes !foundZ */
                        break;
                    case '\'':
                    case '\"':
                        if (inQuote && (quote === this.LongTimePattern[i].charCodeAt(0))) {
                            /* we were in a quote and found a matching exit quote, so we are outside a quote now */
                            inQuote = false;
                        } else if (!inQuote) {
                            quote = this.LongTimePattern[i].charCodeAt(0);
                            inQuote = true;
                        } else {
                            /* we were in a quote and saw the other type of quote character, so we are still in a quote */
                        }
                        break;
                    case '%':
                    case '\\':
                        i++; /* skip next character that is escaped by this backslash */
                        break;
                    default:
                        break;
                }
            }

            if (!foundZ) {
                this.dateTimeOffsetPattern = this.dateTimeOffsetPattern + " zzz";
            }
        }
        return (this.dateTimeOffsetPattern);
    }

    // Note that cultureData derives this from the long time format (unless someone's set this previously)
    // Note that this property is quite undesirable.
    //
    public get TimeSeparator(): string {
        if (this.timeSeparator == null) {
            this.timeSeparator = this.m_cultureData.TimeSeparator;
        }
        //Contract.Assert(this.timeSeparator != null, "DateTimeFormatInfo.TimeSeparator, timeSeparator != null");
        return (this.timeSeparator);
    }



    public get UniversalSortableDateTimePattern(): string {
        return (DateTimeFormatInfo.universalSortableDateTimePattern);
    }

    // For our "patterns" arrays we have 2 variables, a string and a string[]
    //
    // The string[] contains the list of patterns, EXCEPT the default may not be included.
    // The string contains the default pattern.
    // When we initially construct our string[], we set the string to string[0]
    public get YearMonthPattern(): string {
        // Initialize our year/month pattern from the 1st array value if not set
        if (this.yearMonthPattern == null) {
            // Initialize our data
            this.yearMonthPattern = this.UnclonedYearMonthPatterns[0];
        }
        return this.yearMonthPattern;
    }

    public set YearMonthPattern(value: string) {
        if (this.IsReadOnly)
            throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_ReadOnly"));
        if (value == null) {
            throw new ArgumentNullException("value", Environment.GetResourceString("ArgumentNull_String"));
        }
        //Contract.EndContractBlock();

        // Remember the new string
        this.yearMonthPattern = value;

        // Clear the token hash table, note that even short times could require this
        this.ClearTokenHashTable();
    }

    //
    // Check if a string array contains a null value, and throw ArgumentNullException with parameter name "value"
    //
    private static CheckNullValue(values: string[], length: int): void {
        /*  Contract.Requires(values != null, "value != null");
         Contract.Requires(values.Length >= length); */
        for (let i: int = 0; i < length; i++) {
            if (values[i] == null) {
                throw new ArgumentNullException("value", Environment.GetResourceString("ArgumentNull_ArrayValue"));
            }
        }
    }


    public get AbbreviatedDayNames(): string[] {
        return [...this.internalGetAbbreviatedDayOfWeekNames()];
    }

    public set AbbreviatedDayNames(value: string[]) {
        if (this.IsReadOnly)
            throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_ReadOnly"));
        if (value == null) {
            throw new ArgumentNullException("value", Environment.GetResourceString("ArgumentNull_Array"));
        }
        if (value.length !== 7) {
            throw new ArgumentException(Environment.GetResourceString("Argument_InvalidArrayLength", 7), "value");
        }
        // Contract.EndContractBlock();
        DateTimeFormatInfo.CheckNullValue(value, value.length);
        this.ClearTokenHashTable();

        this.abbreviatedDayNames = value;
    }


    // Returns the string array of the one-letter day of week names.
    public get ShortestDayNames(): string[] {
        return [...this.internalGetSuperShortDayNames()];
    }

    public set ShortestDayNames(value: string[]) {
        if (this.IsReadOnly)
            throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_ReadOnly"));
        if (value == null) {
            throw new ArgumentNullException("value", Environment.GetResourceString("ArgumentNull_Array"));
        }
        if (value.length !== 7) {
            throw new ArgumentException(Environment.GetResourceString("Argument_InvalidArrayLength", 7), "value");
        }
        //Contract.EndContractBlock();
        DateTimeFormatInfo.CheckNullValue(value, value.length);
        this.m_superShortDayNames = value;
    }



    public get DayNames(): string[] {
        return [...this.internalGetDayOfWeekNames()];
    }

    public set DayNames(value: string[]) {
        if (this.IsReadOnly)
            throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_ReadOnly"));
        if (value == null) {
            throw new ArgumentNullException("value", Environment.GetResourceString("ArgumentNull_Array"));
        }
        if (value.length !== 7) {
            throw new ArgumentException(Environment.GetResourceString("Argument_InvalidArrayLength", 7), "value");
        }
        // Contract.EndContractBlock();
        DateTimeFormatInfo.CheckNullValue(value, value.length);
        this.ClearTokenHashTable();

        this.dayNames = value;
    }


    public get AbbreviatedMonthNames(): string[] {
        return [...this.internalGetAbbreviatedMonthNames()];
    }

    public set AbbreviatedMonthNames(value: string[]) {
        if (this.IsReadOnly)
            throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_ReadOnly"));
        if (value == null) {
            throw new ArgumentNullException("value", Environment.GetResourceString("ArgumentNull_Array"));
        }
        if (value.length !== 13) {
            throw new ArgumentException(Environment.GetResourceString("Argument_InvalidArrayLength", 13), "value");
        }
        //Contract.EndContractBlock();
        DateTimeFormatInfo.CheckNullValue(value, value.length - 1);
        this.ClearTokenHashTable();
        this.abbreviatedMonthNames = value;
    }



    public get MonthNames(): string[] {
        return [...this.internalGetMonthNames()];
    }

    public set MonthNames(value: string[]) {
        if (this.IsReadOnly)
            throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_ReadOnly"));
        if (value == null) {
            throw new ArgumentNullException("value", Environment.GetResourceString("ArgumentNull_Array"));
        }
        if (value.length !== 13) {
            throw new ArgumentException(Environment.GetResourceString("Argument_InvalidArrayLength", 13), "value");
        }
        //Contract.EndContractBlock();
        DateTimeFormatInfo.CheckNullValue(value, value.length - 1);
        this.monthNames = value;
        this.ClearTokenHashTable();
    }


    public /* internal */ get HasSpacesInMonthNames(): boolean {
        return (this.FormatFlags & DateTimeFormatFlags.UseSpacesInMonthNames) !== 0;
    }

    public /* internal */ get HasSpacesInDayNames(): boolean {
        return (this.FormatFlags & DateTimeFormatFlags.UseSpacesInDayNames) !== 0;
    }


    //
    //  internalGetMonthName
    //
    // Actions: Return the month name using the specified MonthNameStyles in either abbreviated form
    //      or full form.
    // Arguments:
    //      month
    //      style           To indicate a form like regular/genitive/month name in a leap year.
    //      abbreviated     When true, return abbreviated form.  Otherwise, return a full form.
    //  Exceptions:
    //      ArgumentOutOfRangeException When month name is invalid.
    //
    public /* internal */  internalGetMonthName(month: int, style: MonthNameStyles, abbreviated: boolean): string {
        //
        // Right now, style is mutual exclusive, but I make the style to be flag so that
        // maybe we can combine flag if there is such a need.
        //
        let monthNamesArray: string[] = null as any;
        switch (style) {
            case MonthNameStyles.Genitive:
                monthNamesArray = this.internalGetGenitiveMonthNames(abbreviated);
                break;
            case MonthNameStyles.LeapYear:
                monthNamesArray = this.internalGetLeapYearMonthNames(/*abbreviated*/);
                break;
            default:
                monthNamesArray = (abbreviated ? this.internalGetAbbreviatedMonthNames() : this.internalGetMonthNames());
                break;
        }
        // The month range is from 1 ~ this.m_monthNames.Length
        // (actually is 13 right now for all cases)
        if ((month < 1) || (month > monthNamesArray.length)) {
            throw new ArgumentOutOfRangeException("month", Environment.GetResourceString("ArgumentOutOfRange_Range", 1, monthNamesArray.length));
        }
        return monthNamesArray[month - 1];
    }

    //
    //  internalGetGenitiveMonthNames
    //
    //  Action: Retrieve the array which contains the month names in genitive form.
    //      If this culture does not use the gentive form, the normal month name is returned.
    //  Arguments:
    //      abbreviated     When true, return abbreviated form.  Otherwise, return a full form.
    //
    private internalGetGenitiveMonthNames(abbreviated: boolean): string[] {
        if (abbreviated) {
            if (this.m_genitiveAbbreviatedMonthNames == null) {
                this.m_genitiveAbbreviatedMonthNames = this.m_cultureData.AbbreviatedGenitiveMonthNames(this.Calendar.ID);
                /*   Contract.Assert(this.m_genitiveAbbreviatedMonthNames.Length == 13,
                      "[DateTimeFormatInfo.GetGenitiveMonthNames] Expected 13 abbreviated genitive month names in a year"); */
            }
            return this.m_genitiveAbbreviatedMonthNames;
        }

        if (this.genitiveMonthNames == null) {
            this.genitiveMonthNames = this.m_cultureData.GenitiveMonthNames(this.Calendar.ID);
            /*  Contract.Assert(this.genitiveMonthNames.Length == 13,
                 "[DateTimeFormatInfo.GetGenitiveMonthNames] Expected 13 genitive month names in a year"); */
        }
        return this.genitiveMonthNames;
    }

    //
    //  internalGetLeapYearMonthNames
    //
    //  Actions: Retrieve the month names used in a leap year.
    //      If this culture does not have different month names in a leap year, the normal month name is returned.
    //  Agruments: None. (can use abbreviated later if needed)
    //
    public /* internal */  internalGetLeapYearMonthNames(/*bool abbreviated*/): string[] {
        if (this.leapYearMonthNames == null) {
            // Contract.Assert(Calendar.ID > 0, "[DateTimeFormatInfo.internalGetLeapYearMonthNames] Expected Calendar.ID > 0");
            this.leapYearMonthNames = this.m_cultureData.LeapYearMonthNames(this.Calendar.ID);
            /*  Contract.Assert(this.leapYearMonthNames.Length == 13,
                 "[DateTimeFormatInfo.internalGetLeapYearMonthNames] Expepcted 13 leap year month names"); */
        }
        return this.leapYearMonthNames;
    }


    public GetAbbreviatedDayName(dayofweek: DayOfWeek): string {

        if (dayofweek < 0 || dayofweek > 6) {
            throw new ArgumentOutOfRangeException(
                "dayofweek", Environment.GetResourceString("ArgumentOutOfRange_Range",
                    DayOfWeek.Sunday, DayOfWeek.Saturday));
        }
        // Contract.EndContractBlock();
        //
        // Don't call the public property AbbreviatedDayNames here since a clone is needed in that
        // property, so it will be slower.  Instead, use GetAbbreviatedDayOfWeekNames() directly.
        //
        return (this.internalGetAbbreviatedDayOfWeekNames()[dayofweek]);
    }


    // Returns the super short day of week names for the specified day of week.
    public GetShortestDayName(dayOfWeek: DayOfWeek): string {

        if (dayOfWeek < 0 || dayOfWeek > 6) {
            throw new ArgumentOutOfRangeException(
                "dayOfWeek", Environment.GetResourceString("ArgumentOutOfRange_Range",
                    DayOfWeek.Sunday, DayOfWeek.Saturday));
        }
        // Contract.EndContractBlock();
        //
        // Don't call the public property SuperShortDayNames here since a clone is needed in that
        // property, so it will be slower.  Instead, use internalGetSuperShortDayNames() directly.
        //
        return this.internalGetSuperShortDayNames()[dayOfWeek];
    }

    // Get all possible combination of inputs
    private static GetCombinedPatterns(patterns1: string[], patterns2: string[], connectString: string): string[] {
        /*  Contract.Requires(patterns1 != null);
         Contract.Requires(patterns2 != null); */

        // Get array size
        const result: string[] = new Array(patterns1.length * patterns2.length);

        // Counter of actual results
        let k: int = 0;
        for (let i: int = 0; i < patterns1.length; i++) {
            for (let j: int = 0; j < patterns2.length; j++) {
                // Can't combine if null or empty
                result[k++] = patterns1[i] + connectString + patterns2[j];
            }
        }

        // Return the combinations
        return (result);
    }


    public GetAllDateTimePatterns(): string[];
    public GetAllDateTimePatterns(format: char): string[];
    public GetAllDateTimePatterns(...args: any[]): string[] {
        if (args.length === 0) {
            const results: List<string> = new List<string>(DateTimeFormatInfo.DEFAULT_ALL_DATETIMES_SIZE);

            for (let i: int = 0; i < DateTimeFormat.allStandardFormats.length; i++) {
                const strings: string[] = this.GetAllDateTimePatterns(DateTimeFormat.allStandardFormats[i]);
                for (let j: int = 0; j < strings.length; j++) {
                    results.Add(strings[j]);
                }
            }
            return results.ToArray();
        } else if (args.length === 1 && is.char(args[0])) {
            const format: char = args[0];
            //Contract.Ensures(Contract.Result<String[]>() != null);
            let result: string[] = null as any;

            switch (format) {
                case 'd'.charCodeAt(0):
                    result = this.AllShortDatePatterns;
                    break;
                case 'D'.charCodeAt(0):
                    result = this.AllLongDatePatterns;
                    break;
                case 'f'.charCodeAt(0):
                    result = DateTimeFormatInfo.GetCombinedPatterns(this.AllLongDatePatterns, this.AllShortTimePatterns, " ");
                    break;
                case 'F'.charCodeAt(0):
                case 'U'.charCodeAt(0):
                    result = DateTimeFormatInfo.GetCombinedPatterns(this.AllLongDatePatterns, this.AllLongTimePatterns, " ");
                    break;
                case 'g'.charCodeAt(0):
                    result = DateTimeFormatInfo.GetCombinedPatterns(this.AllShortDatePatterns, this.AllShortTimePatterns, " ");
                    break;
                case 'G'.charCodeAt(0):
                    result = DateTimeFormatInfo.GetCombinedPatterns(this.AllShortDatePatterns, this.AllLongTimePatterns, " ");
                    break;
                case 'm'.charCodeAt(0):
                case 'M'.charCodeAt(0):
                    result = [this.MonthDayPattern];
                    break;
                case 'o'.charCodeAt(0):
                case 'O'.charCodeAt(0):
                    result = [DateTimeFormat.RoundtripFormat];
                    break;
                case 'r'.charCodeAt(0):
                case 'R'.charCodeAt(0):
                    result = [DateTimeFormatInfo.rfc1123Pattern];
                    break;
                case 's'.charCodeAt(0):
                    result = [DateTimeFormatInfo.sortableDateTimePattern];
                    break;
                case 't'.charCodeAt(0):
                    result = this.AllShortTimePatterns;
                    break;
                case 'T'.charCodeAt(0):
                    result = this.AllLongTimePatterns;
                    break;
                case 'u'.charCodeAt(0):
                    result = [this.UniversalSortableDateTimePattern];
                    break;
                case 'y'.charCodeAt(0):
                case 'Y'.charCodeAt(0):
                    result = this.AllYearMonthPatterns;
                    break;
                default:
                    throw new ArgumentException(Environment.GetResourceString("Format_BadFormatSpecifier"), "format");
            }
            return (result);
        }
        throw new ArgumentOutOfRangeException('');
    }


    public GetDayName(dayofweek: DayOfWeek): string {
        if (dayofweek < 0 || dayofweek > 6) {
            throw new ArgumentOutOfRangeException("dayofweek" + Environment.GetResourceString("ArgumentOutOfRange_Range" + DayOfWeek.Sunday + DayOfWeek.Saturday));
        }
        //Contract.EndContractBlock();

        // Use the internal one so that we don't clone the array unnecessarily
        return (this.internalGetDayOfWeekNames()[dayofweek]);
    }



    public GetAbbreviatedMonthName(month: int): string {
        if (month < 1 || month > 13) {
            throw new ArgumentOutOfRangeException("month" + Environment.GetResourceString("ArgumentOutOfRange_Range" + 1 + 13));
        }
        //Contract.EndContractBlock();
        // Use the internal one so we don't clone the array unnecessarily
        return this.internalGetAbbreviatedMonthNames()[month - 1];
    }


    public GetMonthName(month: int): string {
        if (month < 1 || month > 13) {
            throw new ArgumentOutOfRangeException(
                "month", Environment.GetResourceString("ArgumentOutOfRange_Range",
                    1, 13));
        }
        //Contract.EndContractBlock();
        // Use the internal one so we don't clone the array unnecessarily
        return (this.internalGetMonthNames()[month - 1]);
    }

    // For our "patterns" arrays we have 2 variables, a string and a string[]
    //
    // The string[] contains the list of patterns, EXCEPT the default may not be included.
    // The string contains the default pattern.
    // When we initially construct our string[], we set the string to string[0]
    //
    // The resulting [] can get returned to the calling app, so clone it.
    private static GetMergedPatterns(patterns: string[], defaultPattern: string): string[] {
        /* Contract.Assert(patterns != null && patterns.Length > 0,
            "[DateTimeFormatInfo.GetMergedPatterns]Expected array of at least one pattern");
        Contract.Assert(defaultPattern != null,
            "[DateTimeFormatInfo.GetMergedPatterns]Expected non null default string"); */

        // If the default happens to be the first in the list just return (a cloned) copy
        if (defaultPattern === patterns[0]) {
            return TString.Clone(patterns);
        }

        // We either need a bigger list, or the pattern from the list.
        let i: int;
        for (i = 0; i < patterns.length; i++) {
            // Stop if we found it
            if (defaultPattern === patterns[i]) {
                break;
            }
        }

        // Either way we're going to need a new array
        let newPatterns: string[];

        // Did we find it
        if (i < patterns.length) {
            // Found it, output will be same size
            newPatterns = TString.Clone(patterns);

            // Have to move [0] item to [i] so we can re-write default at [0]
            // (remember defaultPattern == [i] so this is OK)
            newPatterns[i] = newPatterns[0];
        }
        else {
            // Not found, make room for it
            newPatterns = new Array(patterns.length + 1);

            // Copy existing array
            TArray.Copy(patterns, 0, newPatterns, 1, patterns.length);
        }

        // Remember the default
        newPatterns[0] = defaultPattern;

        // Return the reconstructed list
        return newPatterns;
    }

    // Default string isn't necessarily in our string array, so get the
    // merged patterns of both
    private get AllYearMonthPatterns(): string[] {
        return DateTimeFormatInfo.GetMergedPatterns(this.UnclonedYearMonthPatterns, this.YearMonthPattern);
    }

    private get AllShortDatePatterns(): string[] {
        return DateTimeFormatInfo.GetMergedPatterns(this.UnclonedShortDatePatterns, this.ShortDatePattern);
    }

    private get AllShortTimePatterns(): string[] {
        return DateTimeFormatInfo.GetMergedPatterns(this.UnclonedShortTimePatterns, this.ShortTimePattern);
    }

    private get AllLongDatePatterns(): string[] {
        return DateTimeFormatInfo.GetMergedPatterns(this.UnclonedLongDatePatterns, this.LongDatePattern);
    }

    private get AllLongTimePatterns(): string[] {
        return DateTimeFormatInfo.GetMergedPatterns(this.UnclonedLongTimePatterns, this.LongTimePattern);
    }

    // NOTE: Clone this string array if you want to return it to user.  Otherwise, you are returning a writable cache copy.
    // This won't include default, call AllYearMonthPatterns
    private get UnclonedYearMonthPatterns(): string[] {
        if (this.allYearMonthPatterns == null) {
            //Contract.Assert(Calendar.ID > 0, "[DateTimeFormatInfo.UnclonedYearMonthPatterns] Expected Calendar.ID > 0");
            this.allYearMonthPatterns = this.m_cultureData.YearMonths(this.Calendar.ID);
            /*  Contract.Assert(this.allYearMonthPatterns.Length > 0,
                 "[DateTimeFormatInfo.UnclonedYearMonthPatterns] Expected some year month patterns"); */
        }

        return this.allYearMonthPatterns;
    }


    // NOTE: Clone this string array if you want to return it to user.  Otherwise, you are returning a writable cache copy.
    // This won't include default, call AllShortDatePatterns
    private get UnclonedShortDatePatterns(): string[] {
        if (this.allShortDatePatterns == null) {
            // Contract.Assert(Calendar.ID > 0, "[DateTimeFormatInfo.UnclonedShortDatePatterns] Expected Calendar.ID > 0");
            this.allShortDatePatterns = this.m_cultureData.ShortDates(this.Calendar.ID);
            /* Contract.Assert(this.allShortDatePatterns.Length > 0,
                "[DateTimeFormatInfo.UnclonedShortDatePatterns] Expected some short date patterns"); */
        }

        return this.allShortDatePatterns;
    }

    // NOTE: Clone this string array if you want to return it to user.  Otherwise, you are returning a writable cache copy.
    // This won't include default, call AllLongDatePatterns
    private get UnclonedLongDatePatterns(): string[] {
        if (this.allLongDatePatterns == null) {
            // Contract.Assert(Calendar.ID > 0, "[DateTimeFormatInfo.UnclonedLongDatePatterns] Expected Calendar.ID > 0");
            this.allLongDatePatterns = this.m_cultureData.LongDates(this.Calendar.ID);
            // Contract.Assert(this.allLongDatePatterns.Length > 0,
            //"[DateTimeFormatInfo.UnclonedLongDatePatterns] Expected some long date patterns");
        }

        return this.allLongDatePatterns;
    }

    // NOTE: Clone this string array if you want to return it to user.  Otherwise, you are returning a writable cache copy.
    // This won't include default, call AllShortTimePatterns
    private get UnclonedShortTimePatterns(): string[] {
        if (this.allShortTimePatterns == null) {
            this.allShortTimePatterns = this.m_cultureData.ShortTimes;
            /* Contract.Assert(this.allShortTimePatterns.Length > 0,
                "[DateTimeFormatInfo.UnclonedShortTimePatterns] Expected some short time patterns"); */
        }

        return this.allShortTimePatterns;
    }

    // NOTE: Clone this string array if you want to return it to user.  Otherwise, you are returning a writable cache copy.
    // This won't include default, call AllLongTimePatterns
    private get UnclonedLongTimePatterns(): string[] {
        if (this.allLongTimePatterns == null) {
            this.allLongTimePatterns = this.m_cultureData.LongTimes;
            /*  Contract.Assert(this.allLongTimePatterns.Length > 0,
                 "[DateTimeFormatInfo.UnclonedLongTimePatterns] Expected some long time patterns"); */
        }

        return this.allLongTimePatterns;
    }

    public static ReadOnly(dtfi: DateTimeFormatInfo): DateTimeFormatInfo {
        if (dtfi == null) {
            throw new ArgumentNullException("dtfi",
                Environment.GetResourceString("ArgumentNull_Obj"));
        }
        //Contract.EndContractBlock();
        if (dtfi.IsReadOnly) {
            return dtfi;
        }
        const newInfo: DateTimeFormatInfo = dtfi.MemberwiseClone();
        // We can use the data member calendar in the setter, instead of the property Calendar,
        // since the cloned copy should have the same state as the original copy.
        newInfo.calendar = Calendar.ReadOnly(dtfi.Calendar);
        newInfo.m_isReadOnly = true;
        return newInfo;
    }


    public get IsReadOnly(): boolean {
        return this.m_isReadOnly;
    }

    // Return the native name for the calendar in DTFI.Calendar.  The native name is referred to
    // the culture used to create the DTFI.  E.g. in the following example, the native language is Japanese.
    // DateTimeFormatInfo dtfi = new CultureInfo("ja-JP", false).DateTimeFormat.Calendar = new JapaneseCalendar();
    // String nativeName = dtfi.NativeCalendarName; // Get the Japanese name for the Japanese calendar.
    // DateTimeFormatInfo dtfi = new CultureInfo("ja-JP", false).DateTimeFormat.Calendar = new GregorianCalendar(GregorianCalendarTypes.Localized);
    // String nativeName = dtfi.NativeCalendarName; // Get the Japanese name for the Gregorian calendar.
    public get NativeCalendarName(): string {
        return this.m_cultureData.CalendarName(this.Calendar.ID);
    }

    //
    // Used by custom cultures and others to set the list of available formats. Note that none of them are
    // explicitly used unless someone calls GetAllDateTimePatterns and subsequently uses one of the items
    // from the list.
    //
    // Most of the format characters that can be used in GetAllDateTimePatterns are
    // not really needed since they are one of the following:
    //
    //  r/R/s/u     locale-independent constants -- cannot be changed!
    //  m/M/y/Y     fields with a single string in them -- that can be set through props directly
    //  f/F/g/G/U   derived fields based on combinations of various of the below formats
    //
    // NOTE: No special validation is done here beyond what is done when the actual respective fields
    // are used (what would be the point of disallowing here what we allow in the appropriate property?)
    //
    // WARNING: If more validation is ever done in one place, it should be done in the other.
    //
    public SetAllDateTimePatterns(patterns: string[], format: char): void {
        if (this.IsReadOnly)
            throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_ReadOnly"));
        if (patterns == null) {
            throw new ArgumentNullException("patterns", Environment.GetResourceString("ArgumentNull_Array"));
        }

        if (patterns.length === 0) {
            throw new ArgumentException(Environment.GetResourceString("Arg_ArrayZeroError"), "patterns");
        }
        //Contract.EndContractBlock();

        for (let i: int = 0; i < patterns.length; i++) {
            if (patterns[i] == null) {
                throw new ArgumentNullException(Environment.GetResourceString("ArgumentNull_ArrayValue"));
            }
        }

        // Remember the patterns, and use the 1st as default
        switch (format) {
            case 'd'.charCodeAt(0):
                this.allShortDatePatterns = patterns;
                this.shortDatePattern = this.allShortDatePatterns[0];
                break;

            case 'D'.charCodeAt(0):
                this.allLongDatePatterns = patterns;
                this.longDatePattern = this.allLongDatePatterns[0];
                break;

            case 't'.charCodeAt(0):
                this.allShortTimePatterns = patterns;
                this.shortTimePattern = this.allShortTimePatterns[0];
                break;

            case 'T'.charCodeAt(0):
                this.allLongTimePatterns = patterns;
                this.longTimePattern = this.allLongTimePatterns[0];
                break;

            case 'y'.charCodeAt(0):
            case 'Y'.charCodeAt(0):
                this.allYearMonthPatterns = patterns;
                this.yearMonthPattern = this.allYearMonthPatterns[0];
                break;

            default:
                throw new ArgumentException(Environment.GetResourceString("Format_BadFormatSpecifier"), "format");
        }

        // Clear the token hash table, note that even short dates could require this
        this.ClearTokenHashTable();

        return;
    }

    public get AbbreviatedMonthGenitiveNames(): string[] {
        return TString.Clone(this.internalGetGenitiveMonthNames(true));
    }

    public set AbbreviatedMonthGenitiveNames(value: string[]) {
        {
            if (this.IsReadOnly)
                throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_ReadOnly"));
            if (value == null) {
                throw new ArgumentNullException("value", Environment.GetResourceString("ArgumentNull_Array"));
            }
            if (value.length !== 13) {
                throw new ArgumentException(Environment.GetResourceString("Argument_InvalidArrayLength", 13), "value");
            }
            //Contract.EndContractBlock();
            DateTimeFormatInfo.CheckNullValue(value, value.length - 1);
            this.ClearTokenHashTable();
            this.m_genitiveAbbreviatedMonthNames = value;
        }
    }

    public get MonthGenitiveNames(): string[] {
        return TString.Clone(this.internalGetGenitiveMonthNames(false));
    }

    public set MonthGenitiveNames(value: string[]) {
        if (this.IsReadOnly)
            throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_ReadOnly"));
        if (value == null) {
            throw new ArgumentNullException("value", Environment.GetResourceString("ArgumentNull_Array"));
        }
        if (value.length != 13) {
            throw new ArgumentException(Environment.GetResourceString("Argument_InvalidArrayLength", 13), "value");
        }
        //Contract.EndContractBlock();
        DateTimeFormatInfo.CheckNullValue(value, value.length - 1);
        this.genitiveMonthNames = value;
        this.ClearTokenHashTable();
    }


    //
    // Positive TimeSpan Pattern
    //
    private m_fullTimeSpanPositivePattern: string = '';
    public /* internal */ get FullTimeSpanPositivePattern(): string {
        if (this.m_fullTimeSpanPositivePattern == null) {
            let cultureDataWithoutUserOverrides: CultureData;
            if (this.m_cultureData.UseUserOverride) {
                cultureDataWithoutUserOverrides = CultureData.GetCultureData(this.m_cultureData.CultureName, false);
            }
            else {
                cultureDataWithoutUserOverrides = this.m_cultureData;
            }

            const decimalSeparator: string = new NumberFormatInfo(cultureDataWithoutUserOverrides).NumberDecimalSeparator;

            this.m_fullTimeSpanPositivePattern = "d':'h':'mm':'ss'" + decimalSeparator + "'FFFFFFF";
        }
        return this.m_fullTimeSpanPositivePattern;
    }

    //
    // Negative TimeSpan Pattern
    //
    private m_fullTimeSpanNegativePattern: string = '';
    public /* internal */ get FullTimeSpanNegativePattern(): string {
        if (this.m_fullTimeSpanNegativePattern == null)
            this.m_fullTimeSpanNegativePattern = "'-'" + this.FullTimeSpanPositivePattern;
        return this.m_fullTimeSpanNegativePattern;
    }

    //
    // Get suitable CompareInfo from current DTFI object.
    //
    public /* internal */ get CompareInfo(): CompareInfo {
        if (this.m_compareInfo == null) {
            // We use the regular GetCompareInfo here to make sure the created CompareInfo object is stored in the
            // CompareInfo cache. otherwise we would just create CompareInfo using m_cultureData.
            this.m_compareInfo = CompareInfo.GetCompareInfo(this.m_cultureData.SCOMPAREINFO);
        }

        return this.m_compareInfo;
    }

    public /* internal */ static readonly InvalidDateTimeStyles: DateTimeStyles = ~(DateTimeStyles.AllowLeadingWhite | DateTimeStyles.AllowTrailingWhite
        | DateTimeStyles.AllowInnerWhite | DateTimeStyles.NoCurrentDateDefault
        | DateTimeStyles.AdjustToUniversal | DateTimeStyles.AssumeLocal
        | DateTimeStyles.AssumeUniversal | DateTimeStyles.RoundtripKind);

    public /* internal */ static ValidateStyles(style: DateTimeStyles, parameterName: string): void {
        if ((style & DateTimeFormatInfo.InvalidDateTimeStyles) !== 0) {
            throw new ArgumentException(Environment.GetResourceString("Argument_InvalidDateTimeStyles"), parameterName);
        }
        if (((style & (DateTimeStyles.AssumeLocal)) !== 0) && ((style & (DateTimeStyles.AssumeUniversal)) !== 0)) {
            throw new ArgumentException(Environment.GetResourceString("Argument_ConflictingDateTimeStyles"), parameterName);
        }
        //Contract.EndContractBlock();
        if (((style & DateTimeStyles.RoundtripKind) !== 0) && ((style & (DateTimeStyles.AssumeLocal | DateTimeStyles.AssumeUniversal | DateTimeStyles.AdjustToUniversal)) !== 0)) {
            throw new ArgumentException(Environment.GetResourceString("Argument_ConflictingDateTimeRoundtripStyles"), parameterName);
        }
    }

    //
    // Actions: Return the internal flag used in formatting and parsing.
    //  The flag can be used to indicate things like if genitive forms is used in this DTFi, or if leap year gets different month names.
    //
    public /* internal */ get FormatFlags(): DateTimeFormatFlags {
        if (this.formatFlags === DateTimeFormatFlags.NotInitialized) {
            // Build the format flags from the data in this DTFI
            this.formatFlags = DateTimeFormatFlags.None;
            this.formatFlags |= DateTimeFormatInfoScanner.GetFormatFlagGenitiveMonth(
                this.MonthNames, this.internalGetGenitiveMonthNames(false), this.AbbreviatedMonthNames, this.internalGetGenitiveMonthNames(true));
            this.formatFlags |= DateTimeFormatInfoScanner.GetFormatFlagUseSpaceInMonthNames(
                this.MonthNames, this.internalGetGenitiveMonthNames(false), this.AbbreviatedMonthNames, this.internalGetGenitiveMonthNames(true));
            this.formatFlags |= DateTimeFormatInfoScanner.GetFormatFlagUseSpaceInDayNames(this.DayNames, this.AbbreviatedDayNames);
            this.formatFlags |= DateTimeFormatInfoScanner.GetFormatFlagUseHebrewCalendar(this.Calendar.ID);
        }
        return this.formatFlags;
    }

    public /* internal */ get HasForceTwoDigitYears(): boolean {
        switch (this.calendar.ID) {
            /*  */
            // If is y/yy, do not get (year % 100). "y" will print
            // year without leading zero.  "yy" will print year with two-digit in leading zero.
            // If pattern is yyy/yyyy/..., print year value with two-digit in leading zero.
            // So year 5 is "05", and year 125 is "125".
            // The reason for not doing (year % 100) is for Taiwan calendar.
            // If year 125, then output 125 and not 25.
            // Note: OS uses "yyyy" for Taiwan calendar by default.
            case (Calendar.CAL_JAPAN):
            case (Calendar.CAL_TAIWAN):
                return true;
        }
        return false;
    }

    // Returns whether the YearMonthAdjustment function has any fix-up work to do for this culture/calendar.
    public /* internal */ get HasYearMonthAdjustment(): boolean {
        return ((this.FormatFlags & DateTimeFormatFlags.UseHebrewRule) !== 0);
    }

    // This is a callback that the parser can make back into the DTFI to let it fiddle with special
    // cases associated with that culture or calendar. Currently this only has special cases for
    // the Hebrew calendar, but this could be extended to other cultures.
    //
    // The return value is whether the year and month are actually valid for this calendar.
    public /* internal */  YearMonthAdjustment(year: Out<int>, month: Out<int>, parsedMonthName: boolean): boolean {
        if ((this.FormatFlags & DateTimeFormatFlags.UseHebrewRule) !== 0) {

            // Special rules to fix up the Hebrew year/month

            // When formatting, we only format up to the hundred digit of the Hebrew year, although Hebrew year is now over 5000.
            // E.g. if the year is 5763, we only format as 763.
            if (year.value < 1000) {
                year.value += 5000;
            }

            // Because we need to calculate leap year, we should fall out now for an invalid year.
            if (year.value < this.Calendar.GetYear(this.Calendar.MinSupportedDateTime) || year.value > this.Calendar.GetYear(this.Calendar.MaxSupportedDateTime)) {
                return false;
            }

            // To handle leap months, the set of month names in the symbol table does not always correspond to the numbers.
            // For non-leap years, month 7 (Adar Bet) is not present, so we need to make using this month invalid and
            // shuffle the other months down.
            if (parsedMonthName) {
                if (!this.Calendar.IsLeapYear(year.value)) {
                    if (month.value >= 8) {
                        month.value--;
                    }
                    else if (month.value === 7) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    //
    // DateTimeFormatInfo tokenizer.  This is used by DateTime.Parse() to break input string into tokens.
    //
    private m_dtfiTokenHash: TokenHashValue[] = null as any;

    private static readonly TOKEN_HASH_SIZE: int = 199;
    private static readonly SECOND_PRIME: int = 197;
    private static readonly dateSeparatorOrTimeZoneOffset: string = "-";
    private static readonly invariantDateSeparator: string = "/";
    private static readonly invariantTimeSeparator: string = ":";

    //
    // Common Ignorable Symbols
    //
    public /* internal */ static readonly IgnorablePeriod: string = ".";
    public /* internal */ static readonly IgnorableComma: string = ",";

    //
    // Year/Month/Day suffixes
    //
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

    public /* internal */ static readonly JapaneseEraStart: string = "\u5143";

    public /* internal */ static readonly LocalTimeMark: string = "T";

    public /* internal */ static readonly KoreanLangName: string = "ko";
    public /* internal */ static readonly JapaneseLangName: string = "ja";
    public /* internal */ static readonly EnglishLangName: string = "en";

    private static /* volatile */  s_jajpDTFI: DateTimeFormatInfo;
    private static /* volatile */  s_zhtwDTFI: DateTimeFormatInfo;

    //
    // Create a Japanese DTFI which uses JapaneseCalendar.  This is used to parse
    // date string with Japanese era name correctly even when the supplied DTFI
    // does not use Japanese calendar.
    // The created instance is stored in global s_jajpDTFI.
    //
    public /* internal */ static GetJapaneseCalendarDTFI(): DateTimeFormatInfo {
        let temp: DateTimeFormatInfo = DateTimeFormatInfo.s_jajpDTFI;
        if (temp == null) {
            temp = new CultureInfo("ja-JP", false).DateTimeFormat;
            throw new Exception('düzelt');
            /*  temp.Calendar = JapaneseCalendar.GetDefaultInstance();
             DateTimeFormatInfo.s_jajpDTFI = temp; */
        }
        return (temp);
    }

    /*
     */
    public /* internal */ static GetTaiwanCalendarDTFI(): DateTimeFormatInfo {
        let temp: DateTimeFormatInfo = DateTimeFormatInfo.s_zhtwDTFI;
        if (temp == null) {
            temp = new CultureInfo("zh-TW", false).DateTimeFormat;
            throw new Exception('düzelt');
            /* temp.Calendar = TaiwanCalendar.GetDefaultInstance();
            DateTimeFormatInfo.s_zhtwDTFI = temp; */
        }
        return (temp);
    }


    // DTFI properties should call this when the setter are called.
    private ClearTokenHashTable(): void {
        this.m_dtfiTokenHash = null as any;
        this.formatFlags = DateTimeFormatFlags.NotInitialized;
    }

    public /* internal */  CreateTokenHashTable(): TokenHashValue[] {
        let temp: TokenHashValue[] = this.m_dtfiTokenHash;
        if (temp == null) {
            temp = new Array(DateTimeFormatInfo.TOKEN_HASH_SIZE);

            const koreanLanguage: boolean = TString.Equals(this.LanguageName, DateTimeFormatInfo.KoreanLangName);

            const sep: string = this.TimeSeparator.trim();
            if (DateTimeFormatInfo.IgnorableComma !== sep) {
                this.InsertHash(temp, DateTimeFormatInfo.IgnorableComma, TokenType.IgnorableSymbol, 0);
            }
            if (DateTimeFormatInfo.IgnorablePeriod !== sep) {
                this.InsertHash(temp, DateTimeFormatInfo.IgnorablePeriod, TokenType.IgnorableSymbol, 0);
            }

            if (DateTimeFormatInfo.KoreanHourSuff !== sep && DateTimeFormatInfo.CJKHourSuff !== sep && DateTimeFormatInfo.ChineseHourSuff !== sep) {
                //
                // On the Macintosh, the default TimeSeparator is identical to the KoreanHourSuff, CJKHourSuff, or ChineseHourSuff for some cultures like
                // ja-JP and ko-KR.  In these cases having the same symbol inserted into the hash table with multiple TokenTypes causes undesirable
                // DateTime.Parse behavior.  For instance, the DateTimeFormatInfo.Tokenize() method might return SEP_DateOrOffset for KoreanHourSuff
                // instead of SEP_HourSuff.
                //
                this.InsertHash(temp, this.TimeSeparator, TokenType.SEP_Time, 0);
            }

            this.InsertHash(temp, this.AMDesignator, TokenType.SEP_Am | TokenType.Am, 0);
            this.InsertHash(temp, this.PMDesignator, TokenType.SEP_Pm | TokenType.Pm, 1);

            //
            if (TString.Equals(this.LanguageName, "sq")) {
                // Albanian allows time formats like "12:00.PD"
                this.InsertHash(temp, DateTimeFormatInfo.IgnorablePeriod + this.AMDesignator, TokenType.SEP_Am | TokenType.Am, 0);
                this.InsertHash(temp, DateTimeFormatInfo.IgnorablePeriod + this.PMDesignator, TokenType.SEP_Pm | TokenType.Pm, 1);
            }

            // CJK suffix
            this.InsertHash(temp, DateTimeFormatInfo.CJKYearSuff, TokenType.SEP_YearSuff, 0);
            this.InsertHash(temp, DateTimeFormatInfo.KoreanYearSuff, TokenType.SEP_YearSuff, 0);
            this.InsertHash(temp, DateTimeFormatInfo.CJKMonthSuff, TokenType.SEP_MonthSuff, 0);
            this.InsertHash(temp, DateTimeFormatInfo.KoreanMonthSuff, TokenType.SEP_MonthSuff, 0);
            this.InsertHash(temp, DateTimeFormatInfo.CJKDaySuff, TokenType.SEP_DaySuff, 0);
            this.InsertHash(temp, DateTimeFormatInfo.KoreanDaySuff, TokenType.SEP_DaySuff, 0);

            this.InsertHash(temp, DateTimeFormatInfo.CJKHourSuff, TokenType.SEP_HourSuff, 0);
            this.InsertHash(temp, DateTimeFormatInfo.ChineseHourSuff, TokenType.SEP_HourSuff, 0);
            this.InsertHash(temp, DateTimeFormatInfo.CJKMinuteSuff, TokenType.SEP_MinuteSuff, 0);
            this.InsertHash(temp, DateTimeFormatInfo.CJKSecondSuff, TokenType.SEP_SecondSuff, 0);

            //
            if (koreanLanguage) {
                // Korean suffix
                this.InsertHash(temp, DateTimeFormatInfo.KoreanHourSuff, TokenType.SEP_HourSuff, 0);
                this.InsertHash(temp, DateTimeFormatInfo.KoreanMinuteSuff, TokenType.SEP_MinuteSuff, 0);
                this.InsertHash(temp, DateTimeFormatInfo.KoreanSecondSuff, TokenType.SEP_SecondSuff, 0);
            }

            if (TString.Equals(this.LanguageName, "ky")) {
                // For some cultures, the date separator works more like a comma, being allowed before or after any date part
                this.InsertHash(temp, DateTimeFormatInfo.dateSeparatorOrTimeZoneOffset, TokenType.IgnorableSymbol, 0);
            }
            else {
                this.InsertHash(temp, DateTimeFormatInfo.dateSeparatorOrTimeZoneOffset, TokenType.SEP_DateOrOffset, 0);
            }

            let dateWords: string[] = null as any;
            let scanner: DateTimeFormatInfoScanner = null as any;

            // We need to rescan the date words since we're always synthetic
            scanner = new DateTimeFormatInfoScanner();
            // Enumarate all LongDatePatterns, and get the DateWords and scan for month postfix.
            // The only reason they're being assigned to m_dateWords is for Whidbey Deserialization
            this.m_dateWords = dateWords = scanner.GetDateWordsOfDTFI(this);
            // Ensure the formatflags is initialized.
            const flag: DateTimeFormatFlags = this.FormatFlags;

            // For some cultures, the date separator works more like a comma, being allowed before or after any date part.
            // In these cultures, we do not use normal date separator since we disallow date separator after a date terminal state.
            // This is determined in DateTimeFormatInfoScanner.  Use this flag to determine if we should treat date separator as ignorable symbol.
            let useDateSepAsIgnorableSymbol: boolean = false;

            let monthPostfix: string = null as any;
            if (dateWords != null) {
                // There are DateWords.  It could be a real date word (such as "de"), or a monthPostfix.
                // The monthPostfix starts with '\xfffe' (MonthPostfixChar), followed by the real monthPostfix.
                for (let i: int = 0; i < dateWords.length; i++) {
                    switch (dateWords[i][0].charCodeAt(0)) {
                        // This is a month postfix
                        case DateTimeFormatInfoScanner.MonthPostfixChar:
                            // Get the real month postfix.
                            monthPostfix = dateWords[i].substring(1);
                            // Add the month name + postfix into the token.
                            this.AddMonthNames(temp, monthPostfix);
                            break;
                        case DateTimeFormatInfoScanner.IgnorableSymbolChar:
                            const symbol: string = dateWords[i].substring(1);
                            this.InsertHash(temp, symbol, TokenType.IgnorableSymbol, 0);
                            if (this.DateSeparator.trim() === (symbol)) {
                                // The date separator is the same as the ingorable symbol.
                                useDateSepAsIgnorableSymbol = true;
                            }
                            break;
                        default:
                            this.InsertHash(temp, dateWords[i], TokenType.DateWordToken, 0);
                            //
                            if (this.LanguageName === "eu") {
                                // Basque has date words with leading dots
                                this.InsertHash(temp, DateTimeFormatInfo.IgnorablePeriod + dateWords[i], TokenType.DateWordToken, 0);
                            }
                            break;
                    }
                }
            }

            if (!useDateSepAsIgnorableSymbol) {
                // Use the normal date separator.
                this.InsertHash(temp, this.DateSeparator, TokenType.SEP_Date, 0);
            }
            // Add the regular month names.
            this.AddMonthNames(temp, null as any);

            // Add the abbreviated month names.
            for (let i: int = 1; i <= 13; i++) {
                this.InsertHash(temp, this.GetAbbreviatedMonthName(i), TokenType.MonthToken, i);
            }


            if ((this.FormatFlags & DateTimeFormatFlags.UseGenitiveMonth) != 0) {
                for (let i: int = 1; i <= 13; i++) {
                    let str: string;
                    str = this.internalGetMonthName(i, MonthNameStyles.Genitive, false);
                    this.InsertHash(temp, str, TokenType.MonthToken, i);
                }
            }

            if ((this.FormatFlags & DateTimeFormatFlags.UseLeapYearMonth) != 0) {
                for (let i: int = 1; i <= 13; i++) {
                    let str: string;
                    str = this.internalGetMonthName(i, MonthNameStyles.LeapYear, false);
                    this.InsertHash(temp, str, TokenType.MonthToken, i);
                }
            }

            for (let i: int = 0; i < 7; i++) {
                //String str = GetDayOfWeekNames()[i];
                // We have to call public methods here to work with inherited DTFI.
                let str: string = this.GetDayName(i);
                this.InsertHash(temp, str, TokenType.DayOfWeekToken, i);

                str = this.GetAbbreviatedDayName(i);
                this.InsertHash(temp, str, TokenType.DayOfWeekToken, i);

            }

            const eras: IntArray = this.calendar.Eras;
            for (let i: int = 1; i <= eras.length; i++) {
                this.InsertHash(temp, this.GetEraName(i), TokenType.EraToken, i);
                this.InsertHash(temp, this.GetAbbreviatedEraName(i), TokenType.EraToken, i);
            }

            //
            if (this.LanguageName === (DateTimeFormatInfo.JapaneseLangName)) {
                // Japanese allows day of week forms like: "(Tue)"
                for (let i: int = 0; i < 7; i++) {
                    const specialDayOfWeek: string = "(" + this.GetAbbreviatedDayName(i) + ")";
                    this.InsertHash(temp, specialDayOfWeek, TokenType.DayOfWeekToken, i);
                }
                if (this.Calendar.GetType() !== type(System.Types.Globalization.JapaneseCalendar)) {
                    // Special case for Japanese.  If this is a Japanese DTFI, and the calendar is not Japanese calendar,
                    // we will check Japanese Era name as well when the calendar is Gregorian.
                    const jaDtfi: DateTimeFormatInfo = DateTimeFormatInfo.GetJapaneseCalendarDTFI();
                    for (let i: int = 1; i <= jaDtfi.Calendar.Eras.length; i++) {
                        this.InsertHash(temp, jaDtfi.GetEraName(i), TokenType.JapaneseEraToken, i);
                        this.InsertHash(temp, jaDtfi.GetAbbreviatedEraName(i), TokenType.JapaneseEraToken, i);
                        // m_abbrevEnglishEraNames[0] contains the name for era 1, so the token value is i+1.
                        this.InsertHash(temp, jaDtfi.AbbreviatedEnglishEraNames[i - 1], TokenType.JapaneseEraToken, i);
                    }
                }
            }
            //
            else if (this.CultureName === "zh-TW") {
                const twDtfi: DateTimeFormatInfo = DateTimeFormatInfo.GetTaiwanCalendarDTFI();
                for (let i: int = 1; i <= twDtfi.Calendar.Eras.length; i++) {
                    if (twDtfi.GetEraName(i).length > 0) {
                        this.InsertHash(temp, twDtfi.GetEraName(i), TokenType.TEraToken, i);
                    }
                }
            }

            this.InsertHash(temp, DateTimeFormatInfo.InvariantInfo.AMDesignator, TokenType.SEP_Am | TokenType.Am, 0);
            this.InsertHash(temp, DateTimeFormatInfo.InvariantInfo.PMDesignator, TokenType.SEP_Pm | TokenType.Pm, 1);

            // Add invariant month names and day names.
            for (let i: int = 1; i <= 12; i++) {
                let str: string;
                // We have to call public methods here to work with inherited DTFI.
                // Insert the month name first, so that they are at the front of abbrevaited
                // month names.
                str = DateTimeFormatInfo.InvariantInfo.GetMonthName(i);
                this.InsertHash(temp, str, TokenType.MonthToken, i);
                str = DateTimeFormatInfo.InvariantInfo.GetAbbreviatedMonthName(i);
                this.InsertHash(temp, str, TokenType.MonthToken, i);
            }

            for (let i: int = 0; i < 7; i++) {
                // We have to call public methods here to work with inherited DTFI.
                let str: string = DateTimeFormatInfo.InvariantInfo.GetDayName(i);
                this.InsertHash(temp, str, TokenType.DayOfWeekToken, i);

                str = DateTimeFormatInfo.InvariantInfo.GetAbbreviatedDayName(i);
                this.InsertHash(temp, str, TokenType.DayOfWeekToken, i);

            }

            for (let i: int = 0; i < this.AbbreviatedEnglishEraNames.length; i++) {
                // m_abbrevEnglishEraNames[0] contains the name for era 1, so the token value is i+1.
                this.InsertHash(temp, this.AbbreviatedEnglishEraNames[i], TokenType.EraToken, i + 1);
            }

            this.InsertHash(temp, DateTimeFormatInfo.LocalTimeMark, TokenType.SEP_LocalTimeMark, 0);
            throw new Exception('düzelt'); {
                /* this.InsertHash(temp, DateTimeParse.GMTName, TokenType.TimeZoneToken, 0);
                this.InsertHash(temp, DateTimeParse.ZuluName, TokenType.TimeZoneToken, 0); */
            }

            this.InsertHash(temp, DateTimeFormatInfo.invariantDateSeparator, TokenType.SEP_Date, 0);
            this.InsertHash(temp, DateTimeFormatInfo.invariantTimeSeparator, TokenType.SEP_Time, 0);

            this.m_dtfiTokenHash = temp;
        }
        return temp;
    }

    private AddMonthNames(temp: TokenHashValue[], monthPostfix: string): void {
        for (let i: int = 1; i <= 13; i++) {
            let str: string;
            //str = internalGetMonthName(i, MonthNameStyles.Regular, false);
            // We have to call public methods here to work with inherited DTFI.
            // Insert the month name first, so that they are at the front of abbrevaited
            // month names.
            str = this.GetMonthName(i);
            if (str.length > 0) {
                if (monthPostfix != null) {
                    // Insert the month name with the postfix first, so it can be matched first.
                    this.InsertHash(temp, str + monthPostfix, TokenType.MonthToken, i);
                } else {
                    this.InsertHash(temp, str, TokenType.MonthToken, i);
                }
            }
            str = this.GetAbbreviatedMonthName(i);
            this.InsertHash(temp, str, TokenType.MonthToken, i);
        }

    }

    ////////////////////////////////////////////////////////////////////////
    //
    // Actions:
    // Try to parse the current word to see if it is a Hebrew number.
    // Tokens will be updated accordingly.
    // This is called by the Lexer of DateTime.Parse().
    //
    // Unlike most of the functions in this class, the return value indicates
    // whether or not it started to parse. The badFormat parameter indicates
    // if parsing began, but the format was bad.
    //
    ////////////////////////////////////////////////////////////////////////

    private static TryParseHebrewNumber(str: __DTString, badFormat: Out<boolean>, number: Out<int>): boolean {
        number.value = -1;
        badFormat.value = false;

        let i: int = str.Index;
        if (!HebrewNumber.IsDigit(str.Value[i].charCodeAt(0))) {
            // If the current character is not a Hebrew digit, just return false.
            // There is no chance that we can parse a valid Hebrew number from here.
            return (false);
        }
        // The current character is a Hebrew digit.  Try to parse this word as a Hebrew number.
        const context: HebrewNumberParsingContext = new HebrewNumberParsingContext(0);
        let state: HebrewNumberParsingState;

        do {
            state = HebrewNumber.ParseByChar(str.Value[i++].charCodeAt(0), context);
            switch (state) {
                case HebrewNumberParsingState.InvalidHebrewNumber:    // Not a valid Hebrew number.
                case HebrewNumberParsingState.NotHebrewDigit:         // The current character is not a Hebrew digit character.
                    // Break out so that we don't continue to try parse this as a Hebrew number.
                    return (false);
            }
        } while (i < str.Value.length && (state !== HebrewNumberParsingState.FoundEndOfHebrewNumber));

        // When we are here, we are either at the end of the string, or we find a valid Hebrew number.
        // Contract.Assert(state == HebrewNumberParsingState.ContinueParsing || state == HebrewNumberParsingState.FoundEndOfHebrewNumber,
        //    "Invalid returned state from HebrewNumber.ParseByChar()");

        if (state !== HebrewNumberParsingState.FoundEndOfHebrewNumber) {
            // We reach end of the string but we can't find a terminal state in parsing Hebrew number.
            return false;
        }

        // We have found a valid Hebrew number.  Update the index.
        str.Advance(i - str.Index);

        // Get the final Hebrew number value from the HebrewNumberParsingContext.
        number.value = context.result;

        return true;
    }

    private static IsHebrewChar(ch: char): boolean {
        return (ch >= '\x0590'.charCodeAt(0) && ch <= '\x05ff'.charCodeAt(0));
    }

    // [System.Security.SecurityCritical]  // auto-generated
    public /* internal */  Tokenize(TokenMask: TokenType, tokenType: Out<TokenType>, tokenValue: Out<int>, str: __DTString): boolean {
        tokenType.value = TokenType.UnknownToken;
        tokenValue.value = 0;

        let value: TokenHashValue;
        // Contract.Assert(str.Index < str.Value.Length, "DateTimeFormatInfo.Tokenize(): start < value.Length");

        let ch: char = str.m_current;
        let isLetter: boolean = TChar.IsLetter(ch);
        if (isLetter) {
            ch = TChar.ToLower(ch, this.Culture);
            if (DateTimeFormatInfo.IsHebrewChar(ch) && TokenMask === TokenType.RegularTokenMask) {
                let badFormat: Out<boolean> = New.Out(false);
                if (DateTimeFormatInfo.TryParseHebrewNumber(str, badFormat, tokenValue)) {
                    if (badFormat) {
                        tokenType.value = TokenType.UnknownToken;
                        return (false);
                    }
                    // This is a Hebrew number.
                    // Do nothing here.  TryParseHebrewNumber() will update token accordingly.
                    tokenType.value = TokenType.HebrewNumber;
                    return (true);
                }
            }
        }


        let hashcode: int = ch % DateTimeFormatInfo.TOKEN_HASH_SIZE;
        const hashProbe: int = 1 + ch % DateTimeFormatInfo.SECOND_PRIME;
        const remaining: int = str.len - str.Index;
        let i: int = 0;

        let hashTable: TokenHashValue[] = this.m_dtfiTokenHash;
        if (hashTable == null) {
            hashTable = this.CreateTokenHashTable();
        }
        do {
            value = hashTable[hashcode];
            if (value == null) {
                // Not found.
                break;
            }
            // Check this value has the right category (regular token or separator token) that we are looking for.
            if ((value.tokenType & TokenMask) > 0 && value.tokenString.length <= remaining) {
                if (TString.Compare(str.Value, str.Index, value.tokenString, 0, value.tokenString.length, this.Culture, CompareOptions.IgnoreCase) === 0) {
                    if (isLetter) {
                        // If this token starts with a letter, make sure that we won't allow partial match.  So you can't tokenize "MarchWed" separately.
                        let nextCharIndex: int;
                        if ((nextCharIndex = str.Index + value.tokenString.length) < str.len) {
                            // Check word boundary.  The next character should NOT be a letter.
                            const nextCh: char = str.Value[nextCharIndex].charCodeAt(0);
                            if (TChar.IsLetter(nextCh)) {
                                return (false);
                            }
                        }
                    }
                    tokenType.value = value.tokenType & TokenMask;
                    tokenValue.value = value.tokenValue;
                    str.Advance(value.tokenString.length);
                    return (true);
                } else if (value.tokenType == TokenType.MonthToken && this.HasSpacesInMonthNames) {
                    // For month token, we will match the month names which have spaces.
                    const matchStrLen: Out<int> = New.Out(0);
                    if (str.MatchSpecifiedWords(value.tokenString, true, matchStrLen)) {
                        tokenType.value = value.tokenType & TokenMask;
                        tokenValue.value = value.tokenValue;
                        str.Advance(matchStrLen.value);
                        return (true);
                    }
                } else if (value.tokenType == TokenType.DayOfWeekToken && this.HasSpacesInDayNames) {
                    // For month token, we will match the month names which have spaces.
                    const matchStrLen: Out<int> = New.Out(0);
                    if (str.MatchSpecifiedWords(value.tokenString, true, matchStrLen)) {
                        tokenType.value = value.tokenType & TokenMask;
                        tokenValue.value = value.tokenValue;
                        str.Advance(matchStrLen.value);
                        return (true);
                    }
                }
            }
            i++;
            hashcode += hashProbe;
            if (hashcode >= DateTimeFormatInfo.TOKEN_HASH_SIZE) hashcode -= DateTimeFormatInfo.TOKEN_HASH_SIZE;
        } while (i < DateTimeFormatInfo.TOKEN_HASH_SIZE);

        return false;
    }

    private InsertAtCurrentHashNode(hashTable: TokenHashValue[], str: string, ch: char, tokenType: TokenType, tokenValue: int, pos: int, hashcode: int, hashProbe: int): void {
        // Remember the current slot.
        let previousNode: TokenHashValue = hashTable[hashcode];

        //// Console.WriteLine("   Insert Key: {0} in {1}", str, slotToInsert);
        // Insert the new node into the current slot.
        hashTable[hashcode] = new TokenHashValue(str, tokenType, tokenValue);;

        while (++pos < DateTimeFormatInfo.TOKEN_HASH_SIZE) {
            hashcode += hashProbe;
            if (hashcode >= DateTimeFormatInfo.TOKEN_HASH_SIZE) hashcode -= DateTimeFormatInfo.TOKEN_HASH_SIZE;
            // Remember this slot
            const temp: TokenHashValue = hashTable[hashcode];

            if (temp != null && TChar.ToLower(temp.tokenString[0].charCodeAt(0), this.Culture) !== ch) {
                continue;
            }
            // Put the previous slot into this slot.
            hashTable[hashcode] = previousNode;
            //// Console.WriteLine("  Move {0} to slot {1}", previousNode.tokenString, hashcode);
            if (temp == null) {
                // Done
                return;
            }
            previousNode = temp;
        };
        // Contract.Assert(true, "The hashtable is full.  This should not happen.");
    }

    private InsertHash(hashTable: TokenHashValue[], str: string, tokenType: TokenType, tokenValue: int): void {
        // The month of the 13th month is allowed to be null, so make sure that we ignore null value here.
        if (str == null || str.length === 0) {
            return;
        }
        let value: TokenHashValue;
        let i: int = 0;
        // If there is whitespace characters in the beginning and end of the string, trim them since whitespaces are skipped by
        // DateTime.Parse().
        if (TChar.IsWhiteSpace(str[0].charCodeAt(0)) || TChar.IsWhiteSpace(str[str.length - 1].charCodeAt(0))) {
            str = str.trim();   // Trim white space characters.
            // Could have space for separators
            if (str.length === 0)
                return;
        }
        const ch: char = TChar.ToLower(str[0].charCodeAt(0), this.Culture);
        let hashcode: int = ch % DateTimeFormatInfo.TOKEN_HASH_SIZE;
        const hashProbe: int = 1 + ch % DateTimeFormatInfo.SECOND_PRIME;
        do {
            value = hashTable[hashcode];
            if (value == null) {
                //// Console.WriteLine("   Put Key: {0} in {1}", str, hashcode);
                hashTable[hashcode] = new TokenHashValue(str, tokenType, tokenValue);
                return;
            } else {
                // Collision happens. Find another slot.
                if (str.length >= value.tokenString.length) {
                    // If there are two tokens with the same prefix, we have to make sure that the longer token should be at the front of
                    // the shorter ones.
                    if (TString.Compare(str, 0, value.tokenString, 0, value.tokenString.length, this.Culture, CompareOptions.IgnoreCase) === 0) {
                        if (str.length > value.tokenString.length) {
                            // The str to be inserted has the same prefix as the current token, and str is longer.
                            // Insert str into this node, and shift every node behind it.
                            this.InsertAtCurrentHashNode(hashTable, str, ch, tokenType, tokenValue, i, hashcode, hashProbe);
                            return;
                        } else {
                            // Same token.  If they have different types (regular token vs separator token).  Add them.
                            // If we have the same regular token or separator token in the hash already, do NOT update the hash.
                            // Therefore, the order of inserting token is significant here regarding what tokenType will be kept in the hash.


                            //
                            // Check the current value of RegularToken (stored in the lower 8-bit of tokenType) , and insert the tokenType into the hash ONLY when we don't have a RegularToken yet.
                            // Also check the current value of SeparatorToken (stored in the upper 8-bit of token), and insert the tokenType into the hash ONLY when we don't have the SeparatorToken yet.
                            //

                            const nTokenType: int = tokenType;
                            const nCurrentTokenTypeInHash: int = value.tokenType;

                            // The idea behind this check is:
                            // - if the app is targetting 4.5.1 or above OR the compat flag is set, use the correct behavior by default.
                            // - if the app is targetting 4.5 or below AND the compat switch is set, use the correct behavior
                            // - if the app is targetting 4.5 or below AND the compat switch is NOT set, use the incorrect behavior
                            if (DateTimeFormatInfo.preferExistingTokens /* || BinaryCompatibility.TargetsAtLeast_Desktop_V4_5_1 */) {
                                if (((nCurrentTokenTypeInHash & TokenType.RegularTokenMask) === 0) && ((nTokenType & TokenType.RegularTokenMask) !== 0) ||
                                    ((nCurrentTokenTypeInHash & TokenType.SeparatorTokenMask) === 0) && ((nTokenType & TokenType.SeparatorTokenMask) !== 0)) {
                                    value.tokenType |= tokenType;
                                    if (tokenValue !== 0) {
                                        value.tokenValue = tokenValue;
                                    }
                                }
                            }
                            else {
                                // The following logic is incorrect and causes updates to happen depending on the bitwise relationship between the existing token type and the
                                // the stored token type.  It was this way in .NET 4 RTM.  The behavior above is correct and will be adopted going forward.

                                if ((((nTokenType | nCurrentTokenTypeInHash) & TokenType.RegularTokenMask) === nTokenType) ||
                                    (((nTokenType | nCurrentTokenTypeInHash) & TokenType.SeparatorTokenMask) === nTokenType)) {
                                    value.tokenType |= tokenType;
                                    if (tokenValue !== 0) {
                                        value.tokenValue = tokenValue;
                                    }
                                }
                            }
                            // The token to be inserted is already in the table.  Skip it.
                        }
                    }
                }
            }
            //// Console.WriteLine("  COLLISION. Old Key: {0}, New Key: {1}", hashTable[hashcode].tokenString, str);
            i++;
            hashcode += hashProbe;
            if (hashcode >= DateTimeFormatInfo.TOKEN_HASH_SIZE) hashcode -= DateTimeFormatInfo.TOKEN_HASH_SIZE;
        } while (i < DateTimeFormatInfo.TOKEN_HASH_SIZE);
        //Contract.Assert(true, "The hashtable is full.  This should not happen.");
    }
}   // class DateTimeFormatInfo


EventBus.Default.on('TStringLoaded', () =>{
    (CultureInfo as any).Init();
});
/* setTimeout(()=> *//* , 10); */// en sona koyuyoruz, tüm sınıf yüklendikten sonra çalışşsın.
