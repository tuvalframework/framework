import { TString } from '../../Text/TString';
import { IEqualityComparer } from "../IEqualityComparer";
import { int } from "../../float";

export class StringEqualityComparer implements IEqualityComparer<string> {
    public static readonly Default: StringEqualityComparer = new StringEqualityComparer();
    public Equals(x: string, y: string): boolean {
        return x === y;
    }
    public GetHashCode(obj: string): int {
        return obj.hashCode();
    }
    private constructor() {

    }
}

export class NumberEqualityComparer implements IEqualityComparer<number> {
    public static readonly Default: NumberEqualityComparer = new NumberEqualityComparer();
    public Equals(x: number, y: number): boolean {
        return x === y;
    }
    public GetHashCode(obj: number): int {
        return obj.toString().hashCode();
    }
    private constructor() {

    }
}

export class BooleanEqualityComparer implements IEqualityComparer<boolean> {
    public static readonly Default: BooleanEqualityComparer = new BooleanEqualityComparer();
    public Equals(x: boolean, y: boolean): boolean {
        return x === y;
    }
    public GetHashCode(obj: boolean): int {
        return obj.toString().hashCode();
    }
    private constructor() {
    }
}

export abstract class EqualityComparer<T=any> implements IEqualityComparer<T>
{
    private static readonly  defaultComparer: EqualityComparer;


    public static get Default(): EqualityComparer {
        return EqualityComparer.defaultComparer;
    }

    public static staticConstructor() {
        (EqualityComparer as any).defaultComparer = EqualityComparer.CreateComparer();
    }


    protected constructor() {
    }

    private static CreateComparer<T>(): EqualityComparer<T> {
        return new class<T> extends EqualityComparer<T> {
            public Equals(x: T, y: T): boolean {
               if (x === y) {
                   return true;
               }
               return false;
            }
            public  GetHashCode(obj: T): number {
                return TString.GetHashCode((obj as any).toString());
            }
        }
    }


    public abstract Equals(x: T, y: T): boolean;
    public abstract GetHashCode(obj: T): int;

    public /* virtual */  IndexOf(array: T[], value: T, startIndex: int, count: int): int {
        const int32: int = startIndex + count;
        for (let i = startIndex; i < int32; i++) {
            if (this.Equals(array[i], value)) {
                return i;
            }
        }
        return -1;
    }

    public /* virtual */  LastIndexOf(array: T[], value: T, startIndex: int, count: int): int {
        const int32: int = startIndex - count + 1;
        for (let i = startIndex; i >= int32; i--) {
            if (this.Equals(array[i], value)) {
                return i;
            }
        }
        return -1;
    }
}

EqualityComparer.staticConstructor();