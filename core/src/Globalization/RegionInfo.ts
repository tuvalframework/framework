import { Environment } from "../Environment";
import { Exception } from "../Exception";
import { ArgumentException } from "../Exceptions/ArgumentException";
import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { TObject } from "../Extensions";
import { int } from "../float";
import { is } from "../is";
import { Override } from "../Reflection/Decorators/ClassInfo";
import { System } from "../SystemTypes";
import { TString } from "../Text/TString";
import { CultureData, CultureInfo } from "./CultureInfo";

export class RegionInfo extends TObject {
    protected dispose(disposing: boolean): void {
        throw new Error("Method not implemented.");
    }

    //--------------------------------------------------------------------//
    //                        Internal Information                        //
    //--------------------------------------------------------------------//

    //
    //  Variables.
    //

    //
    // Name of this region (ie: es-US): serialized, the field used for deserialization
    //
    public /* internal */  m_name: string = '';

    //
    // The CultureData instance that we are going to read data from.
    //
    public /* internal */  m_cultureData: CultureData = null as any;

    //
    // The RegionInfo for our current region
    //
    public /* internal */ static s_currentRegionInfo: RegionInfo;


    ////////////////////////////////////////////////////////////////////////
    //
    //  RegionInfo Constructors
    //
    //  Note: We prefer that a region be created with a full culture name (ie: en-US)
    //  because otherwise the native strings won't be right.
    //
    //  In Silverlight we enforce that RegionInfos must be created with a full culture name
    //
    ////////////////////////////////////////////////////////////////////////
    public constructor(name: string);
    public constructor(culture: int);
    public constructor(cultureData: CultureData);
    public constructor(...args: any[]) {
        super();
        if (args.length === 1 && is.string(args[0])) {
            const name: string = args[0];

            if (name == null)
                throw new ArgumentNullException("name");

            if (name.length === 0) //The InvariantCulture has no matching region
            {
                throw new ArgumentException(Environment.GetResourceString("Argument_NoRegionInvariantCulture"));
            }

            //Contract.EndContractBlock();

            //
            // First try it as an entire culture. We must have user override as true here so
            // that we can pick up custom cultures *before* built-in ones (if they want to
            // prefer built-in cultures they will pass "us" instead of "en-US").
            //
            this.m_cultureData = CultureData.GetCultureDataForRegion(name, true);
            // this.m_name = name.ToUpper(CultureInfo.InvariantCulture);

            if (this.m_cultureData == null)
                throw new ArgumentException(
                    TString.Format(
                        /* CultureInfo.CurrentCulture, */
                        Environment.GetResourceString("Argument_InvalidCultureName"), name), "name");


            // Not supposed to be neutral
            if (this.m_cultureData.IsNeutralCulture)
                throw new ArgumentException(Environment.GetResourceString("Argument_InvalidNeutralRegionName", name), "name");

            this.SetName(name);
        } else if (args.length === 1 && is.int(args[0])) {
            const culture: int = args[0];
            if (culture === CultureInfo.LOCALE_INVARIANT) //The InvariantCulture has no matching region
            {
                throw new ArgumentException(Environment.GetResourceString("Argument_NoRegionInvariantCulture"));
            }

            if (culture === CultureInfo.LOCALE_NEUTRAL) {
                // Not supposed to be neutral
                throw new ArgumentException(Environment.GetResourceString("Argument_CultureIsNeutral", culture), "culture");
            }

            if (culture === CultureInfo.LOCALE_CUSTOM_DEFAULT) {
                // Not supposed to be neutral
                throw new ArgumentException(Environment.GetResourceString("Argument_CustomCultureCannotBePassedByNumber", culture), "culture");
            }

            this.m_cultureData = CultureData.GetCultureData(culture, true);
            this.m_name = this.m_cultureData.SREGIONNAME;

            if (this.m_cultureData.IsNeutralCulture) {
                // Not supposed to be neutral
                throw new ArgumentException(Environment.GetResourceString("Argument_CultureIsNeutral", culture), "culture");
            }
            //m_cultureId = culture;
        } else if (args.length === 1 && is.typeof<CultureData>(args[0], System.Types.Globalization.CultureData)) {
            const cultureData: CultureData = args[0];
            this.m_cultureData = cultureData;
            this.m_name = this.m_cultureData.SREGIONNAME;
        }
    }

    private SetName(name: string): void {
        // Use the name of the region we found
        this.m_name = this.m_cultureData.SREGIONNAME;
        // when creating region by culture name, we keep the region name as the culture name so regions
        // created by custom culture names can be differentiated from built in regions.
        this.m_name = name === this.m_cultureData.SREGIONNAME ? this.m_cultureData.SREGIONNAME : this.m_cultureData.CultureName;
    }



    ////////////////////////////////////////////////////////////////////////
    //
    //  GetCurrentRegion
    //
    //  This instance provides methods based on the current user settings.
    //  These settings are volatile and may change over the lifetime of the
    //  thread.
    //
    ////////////////////////////////////////////////////////////////////////
    public static get CurrentRegion(): RegionInfo {
        let temp: RegionInfo = RegionInfo.s_currentRegionInfo;
        if (temp == null) {
            temp = new RegionInfo(CultureInfo.CurrentCulture.m_cultureData);

            // Need full name for custom cultures
            temp.m_name = temp.m_cultureData.SREGIONNAME;
            RegionInfo.s_currentRegionInfo = temp;
        }
        return temp;
    }


    ////////////////////////////////////////////////////////////////////////
    //
    //  GetName
    //
    //  Returns the name of the region (ie: en-US)
    //
    ////////////////////////////////////////////////////////////////////////
    public get Name(): string {
        //Contract.Assert(m_name != null, "Expected RegionInfo.m_name to be populated already");
        return this.m_name;
    }

    ////////////////////////////////////////////////////////////////////////
    //
    //  GetEnglishName
    //
    //  Returns the name of the region in English. (ie: United States)
    //
    ////////////////////////////////////////////////////////////////////////
    public get EnglishName(): string {
        return this.m_cultureData.SENGCOUNTRY;
    }


    ////////////////////////////////////////////////////////////////////////
    //
    //  GetDisplayName
    //
    //  Returns the display name (localized) of the region. (ie: United States
    //  if the current UI language is en-US)
    //
    ////////////////////////////////////////////////////////////////////////
    public get DisplayName(): string {
        throw new Exception('Düzelt');
        //return this.m_cultureData.SLOCALIZED;
    }


    ////////////////////////////////////////////////////////////////////////
    //
    //  GetNativeName
    //
    //  Returns the native name of the region. (ie: Deutschland)
    //  WARNING: You need a full locale name for this to make sense.
    //
    ////////////////////////////////////////////////////////////////////////
    public get NativeName(): string {
        return this.m_cultureData.SNATIVECOUNTRY;
    }

    ////////////////////////////////////////////////////////////////////////
    //
    //  TwoLetterISORegionName
    //
    //  Returns the two letter ISO region name (ie: US)
    //
    ////////////////////////////////////////////////////////////////////////
    public get TwoLetterISORegionName(): string {
        return this.m_cultureData.SISO3166CTRYNAME;
    }


    ////////////////////////////////////////////////////////////////////////
    //
    //  ThreeLetterISORegionName
    //
    //  Returns the three letter ISO region name (ie: USA)
    //
    ////////////////////////////////////////////////////////////////////////
    public get ThreeLetterISORegionName(): string {
        return this.m_cultureData.SISO3166CTRYNAME2;
    }

    ////////////////////////////////////////////////////////////////////////
    //
    //  ThreeLetterWindowsRegionName
    //
    //  Returns the three letter windows region name (ie: USA)
    //
    ////////////////////////////////////////////////////////////////////////
    public get ThreeLetterWindowsRegionName(): string {
        return this.m_cultureData.SABBREVCTRYNAME;
    }

    ////////////////////////////////////////////////////////////////////////
    //
    //  IsMetric
    //
    //  Returns true if this region uses the metric measurement system
    //
    ////////////////////////////////////////////////////////////////////////
    public get IsMetric(): boolean {
        const value: int = this.m_cultureData.IMEASURE;
        return value === 0;
    }


    public GeoId(): int {
        return this.m_cultureData.IGEOID;
    }

    ////////////////////////////////////////////////////////////////////////
    //
    //  CurrencyEnglishName
    //
    //  English name for this region's currency, ie: Swiss Franc
    //
    ////////////////////////////////////////////////////////////////////////
    public get CurrencyEnglishName(): string {
        return this.m_cultureData.SENGLISHCURRENCY;
    }

    ////////////////////////////////////////////////////////////////////////
    //
    //  CurrencyEnglishName
    //
    //  English name for this region's currency, ie: Schweizer Franken
    //  WARNING: You need a full locale name for this to make sense.
    //
    ////////////////////////////////////////////////////////////////////////
    public get CurrencyNativeName(): string {
        return this.m_cultureData.SNATIVECURRENCY;
    }

    ////////////////////////////////////////////////////////////////////////
    //
    //  CurrencySymbol
    //
    //  Currency Symbol for this locale, ie: Fr. or $
    //
    ////////////////////////////////////////////////////////////////////////
    public get CurrencySymbol(): string {
        return this.m_cultureData.SCURRENCY;
    }

    ////////////////////////////////////////////////////////////////////////
    //
    //  ISOCurrencySymbol
    //
    //  ISO Currency Symbol for this locale, ie: CHF
    //
    ////////////////////////////////////////////////////////////////////////
    public get ISOCurrencySymbol(): string {
        return this.m_cultureData.SINTLSYMBOL;
    }

    ////////////////////////////////////////////////////////////////////////
    //
    //  Equals
    //
    //  Implements Object.Equals().  Returns a boolean indicating whether
    //  or not object refers to the same RegionInfo as the current instance.
    //
    //  RegionInfos are considered equal if and only if they have the same name
    //  (ie: en-US)
    //
    ////////////////////////////////////////////////////////////////////////
    @Override
    public Equals<RegionInfo>(value: RegionInfo): boolean {
        if (value != null) {
            return this.Name === (value as any).Name;
        }
        return false;
    }

    ////////////////////////////////////////////////////////////////////////
    //
    //  GetHashCode
    //
    //  Implements Object.GetHashCode().  Returns the hash code for the
    //  CultureInfo.  The hash code is guaranteed to be the same for RegionInfo
    //  A and B where A.Equals(B) is true.
    //
    ////////////////////////////////////////////////////////////////////////
    @Override
    public GetHashCode(): int {
        return TString.GetHashCode(this.Name);
    }


    ////////////////////////////////////////////////////////////////////////
    //
    //  ToString
    //
    //  Implements Object.ToString().  Returns the name of the Region, ie: es-US
    //
    ////////////////////////////////////////////////////////////////////////
    @Override
    public ToString(): string {
        return this.Name;
    }
}