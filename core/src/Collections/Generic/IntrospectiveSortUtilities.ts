import { Environment } from '../../Environment';
import { int } from "../../float";
import { ArgumentException } from "../../Exceptions/ArgumentException";

export class IntrospectiveSortUtilities {
    public static readonly IntrosortSizeThreshold: int = 16;
    public static readonly QuickSortDepthThreshold: int = 32;
    public static FloorLog2(n: int): int {
        let int32: int = 0;
        while (n >= 1) {
            int32++;
            n /= 2;
        }
        return int32;
    }

    public static ThrowOrIgnoreBadComparer(comparer: any): void {
        throw new ArgumentException(Environment.GetResourceString("Arg_BogusIComparer"/* , [comparer] */));

    }

    public static FloorLog2PlusOne(value: int):int {
        return Math.log2(Math.floor(value)) + 1;
    }
}