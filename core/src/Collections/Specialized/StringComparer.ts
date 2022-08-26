import { as } from "../../as";
import { Environment } from "../../Environment";
import { ArgumentException } from "../../Exceptions/ArgumentException";
import { ArgumentNullException } from "../../Exceptions/ArgumentNullException";
import { int, long } from "../../float";
import { CompareInfo, CompareOptions } from "../../Globalization/CompareInfo";
import { CultureInfo } from "../../Globalization/CultureInfo";
import { TextInfo } from "../../Globalization/TextInfo";
import { IComparable } from "../../IComparable";
import { is } from "../../is";
import { System } from "../../SystemTypes";
import { StringComparison } from "../../Text/StringComparison";
import { TString } from "../../Text/TString";
import { HashHelpers } from "../HashHelpers";
import { IComparer } from "../IComparer";
import { IEqualityComparer } from "../IEqualityComparer";

export abstract class StringComparer implements IComparer<string>, IEqualityComparer<string>{
    private static readonly _invariantCulture: StringComparer = null as any;
    private static readonly _invariantCultureIgnoreCase: StringComparer = null as any;
    private static readonly _ordinal: StringComparer = null as any;
    private static readonly _ordinalIgnoreCase: StringComparer = null as any;

    public static get InvariantCulture(): StringComparer {
        if (StringComparer._invariantCulture == null) {
            (StringComparer as any)._invariantCulture = new CultureAwareComparer(CultureInfo.InvariantCulture, false);
        }
        return StringComparer._invariantCulture;
    }

    public static get InvariantCultureIgnoreCase(): StringComparer {
        if (StringComparer._invariantCultureIgnoreCase == null) {
            (StringComparer as any)._invariantCultureIgnoreCase = new CultureAwareComparer(CultureInfo.InvariantCulture, true);
        }
        return StringComparer._invariantCultureIgnoreCase;
    }

    public static get CurrentCulture(): StringComparer {
        return new CultureAwareComparer(CultureInfo.CurrentCulture, false);
    }

    public static get CurrentCultureIgnoreCase(): StringComparer {
        return new CultureAwareComparer(CultureInfo.CurrentCulture, true);
    }

    public static get Ordinal(): StringComparer {
        if (StringComparer._ordinal == null) {
            (StringComparer as any)._ordinal = new OrdinalComparer(false)
        }
        return StringComparer._ordinal;
    }

    public static get OrdinalIgnoreCase(): StringComparer {
        if (StringComparer._ordinalIgnoreCase == null) {
            (StringComparer as any)._ordinalIgnoreCase = new OrdinalComparer(true);
        }
        return StringComparer._ordinalIgnoreCase;
    }

    public static Create(culture: CultureInfo, ignoreCase: boolean): StringComparer {
        if (culture == null) {
            throw new ArgumentNullException("culture");
        }
        return new CultureAwareComparer(culture, ignoreCase);
    }

    /*  public Compare(x: string, y: string): int {
         if (x === y) return 0;
         if (x == null) return -1;
         if (y == null) return 1;

         const sa: string = x;
         if (sa != null) {
             const sb: string = y;
             if (sb != null) {
                 return this.Compare(sa, sb);
             }
         }

         const ia:IComparable<string> = as<IComparable<string>>(x, System.Types.IComparable);
         if (ia != null) {
             return ia.CompareTo(y);
         }

         throw new ArgumentException(Environment.GetResourceString("Argument_ImplementIComparable"));
     } */


    /* public  Equals(x: any, y: any):boolean {
        if (x == y) return true;
        if (x == null || y == null) return false;

        String sa = x as String;
        if (sa != null) {
            String sb = y as String;
            if (sb != null) {
                return Equals(sa, sb);
            }
        }
        return x.Equals(y);
    } */

    /*  public  GetHashCode( obj: any):int {
         if (obj == null) {
             throw new ArgumentNullException("obj");
         }
         Contract.EndContractBlock();

         string s = obj as string;
         if (s != null) {
             return GetHashCode(s);
         }
         return obj.GetHashCode();
     } */

    public abstract Compare(x: string, y: string): int;
    public abstract Equals(x: string, y: string): boolean;
    public abstract GetHashCode(obj: string): int;
}

class CultureAwareComparer extends StringComparer {
    private _compareInfo: CompareInfo = null as any;
    private _ignoreCase: boolean = false;
    private _options: CompareOptions = null as any;
    private _initializing: boolean = false;

    public constructor(culture: CultureInfo, ignoreCase: boolean);
    public constructor(compareInfo: CompareInfo, ignoreCase: boolean);
    public constructor(compareInfo: CompareInfo, options: CompareOptions);
    public constructor(...args: any[]) {
        super();
        if (args.length === 2 && is.typeof<CultureInfo>(args[0], System.Types.Globalization.CultureInfo) && is.boolean(args[1])) {
            const culture: CultureInfo = args[0];
            const ignoreCase: boolean = args[1];
            this._compareInfo = culture.CompareInfo;
            this._ignoreCase = ignoreCase;
            this._options = ignoreCase ? CompareOptions.IgnoreCase : CompareOptions.None;
        } else if (args.length === 2 && is.typeof<CompareInfo>(args[0], System.Types.CompareInfo) && is.boolean(args[1])) {
            const compareInfo: CompareInfo = args[0];
            const ignoreCase: boolean = args[1];
            this._compareInfo = compareInfo;
            this._ignoreCase = ignoreCase;
            this._options = ignoreCase ? CompareOptions.IgnoreCase : CompareOptions.None;
        } else if (args.length === 2 && is.typeof<CompareInfo>(args[0], System.Types.CompareInfo) && is.int(args[1])) {
            const compareInfo: CompareInfo = args[0];
            const options: CompareOptions = args[1];
            this._compareInfo = compareInfo;
            this._options = options;

            // set the _ignoreCase flag to preserve compat in case this type is serialized on a
            // newer version of the framework and deserialized on an older version of the framework
            this._ignoreCase = ((options & CompareOptions.IgnoreCase) === CompareOptions.IgnoreCase ||
                (options & CompareOptions.OrdinalIgnoreCase) === CompareOptions.OrdinalIgnoreCase);
        }
    }

    public /* override */  Compare(x: string, y: string): int {
        this.EnsureInitialization();
        if (x === y)
            return 0;
        if (x == null)
            return -1;
        if (y == null)
            return 1;
        return this._compareInfo.Compare(x, y, this._options);
    }

    /* public   Equals( x:string,  y:string):boolean {
        this.EnsureInitialization();
        if (x === y) return true;
        if (x == null || y == null) return false;

        return (this._compareInfo.Compare(x, y, this._options) === 0);
    } */

    /*  public override int GetHashCode(string obj) {
         EnsureInitialization();
         if (obj == null) {
             throw new ArgumentNullException("obj");
         }
         Contract.EndContractBlock();

         return _compareInfo.GetHashCodeOfString(obj, _options);
     } */

    // Equals method for the comparer itself.
    public /* override */  Equals(obj: string): boolean {
        this.EnsureInitialization();
        const comparer: CultureAwareComparer = obj as any;
        if (comparer == null) {
            return false;
        }
        return (this._ignoreCase == comparer._ignoreCase) && (this._compareInfo.Equals(comparer._compareInfo) && this._options == comparer._options);
    }

    public /* override */  GetHashCode(): int {
        this.EnsureInitialization();
        const hashCode: int = this._compareInfo.GetHashCode();
        return this._ignoreCase ? (~hashCode) : hashCode;
    }

    // During the deserialization we want to ensure the _options field is initialized as we can deserialize from old object which
    // didn't include the _options field. We use OnDeserialized method to ensure this initialization.
    // There are some classes (e.g. ConcurrentDictionary) which include CultureAwareComparer object and provide OnDeserialized method too
    // and as the order of calling the OnDeserialized methods is not guaranteed, the OnDeserialized method of ConcurrentDictionary can be called
    // before calling OnDeserialized method of CultureAwareComparer and in same time it uses the CultureAwareComparer object there which didn't
    // initialize _options yet. To avoid this problem we implement OnDeserializing method and mark the object as not fully initialized there and then
    // in every operation we perform on CultureAwareComparer, we'll check to ensure the initialization by the method EnsureInitialization()

    private EnsureInitialization(): void {
        if (this._initializing) {
            // fix up the _options value in case we are getting old serialized object not having _options
            this._options |= this._ignoreCase ? CompareOptions.IgnoreCase : CompareOptions.None;
            this._initializing = false;
        }
    }
}

class CultureAwareRandomizedComparer extends StringComparer {

    private _compareInfo: CompareInfo;
    private _ignoreCase: boolean;
    private _entropy: long;

    public/* internal */ constructor(compareInfo: CompareInfo, ignoreCase: boolean) {
        super();
        this._compareInfo = compareInfo;
        this._ignoreCase = ignoreCase;
        this._entropy = HashHelpers.GetEntropy();
    }

    public /* override */  Compare(x: string, y: string): int {
        if (x === y) return 0;
        if (x == null) return -1;
        if (y == null) return 1;
        return this._compareInfo.Compare(x, y, this._ignoreCase ? CompareOptions.IgnoreCase : CompareOptions.None);
    }

    public /* override */  Equals(x: string, y: string): boolean {
        if (x === y) return true;
        if (x == null || y == null) return false;

        return (this._compareInfo.Compare(x, y, this._ignoreCase ? CompareOptions.IgnoreCase : CompareOptions.None) === 0);
    }

    public /* override */  GetHashCode(obj: string): int {
        if (obj == null) {
            throw new ArgumentNullException("obj");
        }

        let options: CompareOptions = CompareOptions.None;

        if (this._ignoreCase) {
            options |= CompareOptions.IgnoreCase;
        }

        return this._compareInfo.GetHashCodeOfString(obj, options, true, this._entropy.toNumber());
    }

    /* // Equals method for the comparer itself.
    public override bool Equals(Object obj) {
        CultureAwareRandomizedComparer comparer = obj as CultureAwareRandomizedComparer;
        if (comparer == null) {
            return false;
        }
        return (this._ignoreCase == comparer._ignoreCase) && (this._compareInfo.Equals(comparer._compareInfo)) && (this._entropy == comparer._entropy);
    }
 */
    /*  public override int GetHashCode() {
         int hashCode = _compareInfo.GetHashCode();
         return ((_ignoreCase ? (~hashCode) : hashCode) ^ ((int)(_entropy & 0x7FFFFFFF)));
     } */
}

class OrdinalComparer extends StringComparer {
    private _ignoreCase: boolean = false;

    public /* internal */ constructor(ignoreCase: boolean) {
        super();
        this._ignoreCase = ignoreCase;
    }

    public /* override */  Compare(x: string, y: string): int {
        if (x === y) return 0;
        if (x == null) return -1;
        if (y == null) return 1;

        if (this._ignoreCase) {
            return TString.Compare(x, y, StringComparison.OrdinalIgnoreCase);
        }

        return (TString as any).CompareOrdinal(x, y);
    }

    public /* override */  Equals(x: string, y: string): boolean {
        if (x === y) return true;
        if (x == null || y == null) return false;

        if (this._ignoreCase) {
            if (x.length !== y.length) {
                return false;
            }
            return (TString.Compare(x, y, StringComparison.OrdinalIgnoreCase) === 0);
        }
        return TString.Equals(x, y);
    }

    public /* override */  GetHashCode(obj: string): int {
        if (obj == null) {
            throw new ArgumentNullException("obj");
        }
        //Contract.EndContractBlock();

        if (this._ignoreCase) {
            return TextInfo.GetHashCodeOrdinalIgnoreCase(obj);
        }

        return TString.GetHashCode(obj);
    }

    // Equals method for the comparer itself.
    /*  public override bool Equals(Object obj) {
         OrdinalComparer comparer = obj as OrdinalComparer;
         if (comparer == null) {
             return false;
         }
         return (this._ignoreCase == comparer._ignoreCase);
     } */

    /* public override int GetHashCode() {
        string name = "OrdinalComparer";
        int hashCode = name.GetHashCode();
        return _ignoreCase ? (~hashCode) : hashCode;
    } */
}

class OrdinalRandomizedComparer extends StringComparer {
    private _ignoreCase: boolean;
    private _entropy: long;

    public /* internal */ constructor(ignoreCase: boolean) {
        super();
        this._ignoreCase = ignoreCase;
        this._entropy = HashHelpers.GetEntropy();
    }

    public /* override */  Compare(x: string, y: string): int {
        if (x === y) return 0;
        if (x == null) return -1;
        if (y == null) return 1;

        if (this._ignoreCase) {
            return TString.Compare(x, y, StringComparison.OrdinalIgnoreCase);
        }

        return (TString as any).CompareOrdinal(x, y);
    }

    public /* override */  Equals(x: string, y: string): boolean {
        if (x === y) return true;
        if (x == null || y == null) return false;

        if (this._ignoreCase) {
            if (x.length !== y.length) {
                return false;
            }
            return (TString.Compare(x, y, StringComparison.OrdinalIgnoreCase) === 0);
        }
        return TString.Equals(x, y);
    }

    public /* override */  GetHashCode(obj: string): int {
        if (obj == null) {
            throw new ArgumentNullException("obj");
        }

        if (this._ignoreCase) {
            return TextInfo.GetHashCodeOrdinalIgnoreCase(obj, true, this._entropy.toNumber());
        }

        return (TString as any).InternalMarvin32HashString(obj, obj.length, this._entropy);
    }



    /*  public override int GetHashCode() {
         string name = "OrdinalRandomizedComparer";
         int hashCode = name.GetHashCode();
         return ((_ignoreCase ? (~hashCode) : hashCode) ^ ((int)(_entropy & 0x7FFFFFFF)));
     } */
}
