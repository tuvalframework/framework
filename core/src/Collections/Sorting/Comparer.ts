import { float } from "../../float";
import { IComparer } from "../IComparer";

export class FloatComparer implements IComparer<float>
{
    private static myDefaultComparer: FloatComparer;

    public static get Default(): FloatComparer {
        return FloatComparer.myDefaultComparer;
    }


    public Compare(a: float, b: float): number {
        if (a == null || b == null || a === b) {
            return 0;
        }
        if (a < b) {
            return -1;
        }
        if (a > b) {
            return 1;
        }

        return 0;
    }
}

(function FloatComparerStaticConstructor() {
    (<any>FloatComparer).myDefaultComparer = new FloatComparer();
})();