import { CompareInfo, CompareOptions } from '../Globalization/CompareInfo';
import { IComparer } from "./IComparer";
import { TObject } from '../Extensions/TObject';
import { CultureInfo } from "../Globalization/CultureInfo";
import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { TString } from '../Text/TString';
import { Comparer } from './Comparer';
import { int } from '../float';

export class CaseInsensitiveComparer<T> extends TObject implements IComparer<T> {
    protected dispose(disposing: boolean): void {
        throw new Error('Method not implemented.');
    }

    private m_compareInfo: CompareInfo = null as any;
    private static m_InvariantCaseInsensitiveComparer: CaseInsensitiveComparer<any> = null as any;

    public constructor();
    public constructor(culture: CultureInfo);
    public constructor(...args: any[]) {
        super();
        if (args.length === 0) {
            this.m_compareInfo = CultureInfo.CurrentCulture.CompareInfo;
        } else if (args.length === 1) {
            const culture: CultureInfo = args[0];
            if (culture == null) {
                throw new ArgumentNullException("culture");
            }
            this.m_compareInfo = culture.CompareInfo;
        }
    }


    public static get Default(): CaseInsensitiveComparer<any> {
        return new CaseInsensitiveComparer(CultureInfo.CurrentCulture);
    }

    public static get DefaultInvariant(): CaseInsensitiveComparer<any> {

        if (CaseInsensitiveComparer.m_InvariantCaseInsensitiveComparer == null) {
            CaseInsensitiveComparer.m_InvariantCaseInsensitiveComparer = new CaseInsensitiveComparer(CultureInfo.InvariantCulture);
        }
        return CaseInsensitiveComparer.m_InvariantCaseInsensitiveComparer;
    }

    public Compare(a: T, b: T): int {
        const sa: string = TString.ToString(a);
        const sb: string = TString.ToString(b);
        if (sa != null && sb != null) {
            return this.m_compareInfo.Compare(sa, sb, CompareOptions.IgnoreCase);
        }
        else {
            return Comparer.Default.Compare(a, b);
        }
    }
}