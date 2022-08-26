import { ISerializable } from "../serialization_/ISerializable";
import { System } from "../SystemTypes";
import { as } from "../as";
import { IComparable } from "../IComparable";
import { ArgumentException } from "../Exceptions/ArgumentException";
import { int } from "../float";
//import { CultureInfo } from "../Globalization/CultureInfo";
import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { is } from "../is";
import { IComparer } from "./IComparer";

export class Comparer<T = any> implements IComparer<T> {
    private m_compareInfo: any;

    public static readonly Default: Comparer;
    public static readonly DefaultInvariant: Comparer;

    private static readonly CompareInfoName: string = "CompareInfo";

    public static staticConstructor() {
        (Comparer as any).Default = new Comparer();
        (Comparer as any).DefaultInvariant = new Comparer();
    }

    public constructor();
    public constructor(culture: any) // Bağımlılığı azaltmak için
    public constructor(...args: any[]) {
        if (args.length === 1) {
            const culture: any = args[0];
            this.m_compareInfo = culture.CompareInfo;
        } else if (args.length === 1) {
            const culture = args[0];
            if (culture == null) {
                throw new ArgumentNullException("culture");
            }
            this.m_compareInfo = culture.CompareInfo;
        }
    }

    public Compare(a: T, b: T): int {
        if (is.function((a as any).equals)) {
            if ((a as any).equals(b)) {
                return 0;
            }
        }
        if (a === b) {
            return 0;
        }
        if (a == null) {
            return -1;
        }
        if (b == null) {
            return 1;
        }

        if (is.int(a) && is.int(b)) {
            if (a < b) {
                return -1;
            }
            if (a > b) {
                return 1;
            }
        }

        if (is.string(a) && is.string(b)) {
            return a.localeCompare(b);
        }

        const comparable: IComparable<T> = as(a, System.Types.IComparable);
        if (comparable != null) {
            return comparable.CompareTo(b);
        }
        const comparable1: IComparable<T> = as(b, System.Types.IComparable);
        if (comparable1 == null) {
            throw new ArgumentException("Argument_ImplementIComparable");
        }
        return -comparable1.CompareTo(a);
    }
}

Comparer.staticConstructor();