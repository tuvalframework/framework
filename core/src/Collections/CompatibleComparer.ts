import { IEqualityComparer } from "./IEqualityComparer";
import { IHashCodeProvider } from "./IHashCodeProvider";
import { IComparable } from "../IComparable";
import { as } from "../as";
import { System } from "../SystemTypes";
import { ArgumentException } from "../Exceptions/ArgumentException";
import { Environment } from "../Environment";
import { int } from "../float";
import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { IComparer } from "./IComparer";

export class CompatibleComparer<T> implements IEqualityComparer<T> {
    private _comparer: IComparer<T> = undefined as any;
    private _hcp: IHashCodeProvider = undefined as any;
    public get Comparer(): IComparer<T> {
        return this._comparer;
    }
    public get HashCodeProvider(): IHashCodeProvider {
        return this._hcp;
    }

    public constructor(comparer: IComparer<T>, hashCodeProvider: IHashCodeProvider) {
        this._comparer = comparer;
        this._hcp = hashCodeProvider;
    }

    public compare(a: T, b: T): int {
        if (a === b) {
            return 0;
        }
        if (a == null) {
            return -1;
        }
        if (b == null) {
            return 1;
        }
        if (this._comparer != null) {
            return this._comparer.Compare(a, b);
        }
        const comparable: IComparable<T> = as(a, System.Types.IComparable);
        if (comparable == null) {
            throw new ArgumentException(Environment.GetResourceString("Argument_ImplementIComparable"));
        }
        return comparable.CompareTo(b);
    }

    public Equals(a: T, b: T): boolean {
        return this.compare(a, b) == 0;
    }

    public GetHashCode(obj: any): int {
        if (obj == null) {
            throw new ArgumentNullException("obj");
        }
        if (this._hcp == null) {
            return obj.GetHashCode();
        }
        return this._hcp.GetHashCode(obj);
    }
}