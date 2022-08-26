import { Environment } from '../../Environment';
import { int } from '../../float';
import { IArraySortHelper } from "./IArraySortHelper";
import { Comparer } from '../Comparer';
import { InvalidOperationException } from '../../Exceptions/InvalidOperationException';
import { IntrospectiveSortUtilities } from './IntrospectiveSortUtilities';
import { IComparer } from '../IComparer';

export class ArraySortHelper<T> implements IArraySortHelper<T>
{
    private static defaultArraySortHelper: IArraySortHelper<any>;

    public static get Default(): IArraySortHelper<any> {
        let arraySortHelper: IArraySortHelper<any> = ArraySortHelper.defaultArraySortHelper;
        if (arraySortHelper == null) {
            arraySortHelper = ArraySortHelper.CreateArraySortHelper();
        }
        return arraySortHelper;
    }

    public constructor() {
    }

    public BinarySearch(array: T[], index: int, length: int, value: T, comparer: IComparer<T>): int {
        let int32: int = 0;
        try {
            if (comparer == null) {
                comparer = Comparer.Default;
            }
            int32 = ArraySortHelper.InternalBinarySearch(array, index, length, value, comparer);
        }
        catch (exception: any) {
            throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_IComparerFailed"), exception);
        }
        return int32;
    }

    private static CreateArraySortHelper<T>(): IArraySortHelper<T> {
        /*  if (!typeof(IComparable<T>).IsAssignableFrom(typeof(T)))
         {
             ArraySortHelper<T>.defaultArraySortHelper = new ArraySortHelper<T>();
         }
         else
         {
             RuntimeTypeHandle typeHandle = typeof(GenericArraySortHelper<string>).TypeHandle;
             ArraySortHelper<T>.defaultArraySortHelper = (IArraySortHelper<T>)RuntimeTypeHandle.Allocate(typeHandle.Instantiate(new Type[] { typeof(T) }));
         } */
        return new ArraySortHelper(); //ArraySortHelper.defaultArraySortHelper;
    }

    public static DepthLimitedQuickSort<T>(keys: T[], left: int, right: int, comparer: IComparer<T>, depthLimit: int): void {
        do {
            if (depthLimit == 0) {
                ArraySortHelper.Heapsort<T>(keys, left, right, comparer);
                return;
            }
            let int32: int = left;
            let int321: int = right;
            const int322: int = int32 + (int321 - int32 >> 1);
            ArraySortHelper.SwapIfGreater<T>(keys, comparer, int32, int322);
            ArraySortHelper.SwapIfGreater<T>(keys, comparer, int32, int321);
            ArraySortHelper.SwapIfGreater<T>(keys, comparer, int322, int321);
            const t: T = keys[int322];
            do {
                if (comparer.Compare(keys[int32], t) < 0) {
                    int32++;
                    continue;
                }
                else {
                    while (comparer.Compare(t, keys[int321]) < 0) {
                        int321--;
                    }
                    if (int32 > int321) {
                        break;
                    }
                    if (int32 < int321) {
                        const t1: T = keys[int32];
                        keys[int32] = keys[int321];
                        keys[int321] = t1;
                    }
                    int32++;
                    int321--;
                }
            }
            while (int32 <= int321);
            depthLimit--;
            if (int321 - left > right - int32) {
                if (int32 < right) {
                    ArraySortHelper.DepthLimitedQuickSort<T>(keys, int32, right, comparer, depthLimit);
                }
                right = int321;
            }
            else {
                if (left < int321) {
                    ArraySortHelper.DepthLimitedQuickSort<T>(keys, left, int321, comparer, depthLimit);
                }
                left = int32;
            }
        }
        while (left < right);
    }

    private static DownHeap<T>(keys: T[], i: int, n: int, lo: int, comparer: IComparer<T>): void {
        const t: T = keys[lo + i - 1];
        while (i <= n / 2) {
            let int32: int = 2 * i;
            if (int32 < n && comparer.Compare(keys[lo + int32 - 1], keys[lo + int32]) < 0) {
                int32++;
            }
            if (comparer.Compare(t, keys[lo + int32 - 1]) >= 0) {
                break;
            }
            keys[lo + i - 1] = keys[lo + int32 - 1];
            i = int32;
        }
        keys[lo + i - 1] = t;
    }

    private static Heapsort<T>(keys: T[], lo: int, hi: int, comparer: IComparer<T>): void {
        const int32: int = hi - lo + 1;
        for (let i = int32 / 2; i >= 1; i--) {
            ArraySortHelper.DownHeap<T>(keys, i, int32, lo, comparer);
        }
        for (let j = int32; j > 1; j--) {
            ArraySortHelper.Swap<T>(keys, lo, lo + j - 1);
            ArraySortHelper.DownHeap<T>(keys, 1, j - 1, lo, comparer);
        }
    }

    private static InsertionSort<T>(keys: T[], lo: int, hi: int, comparer: IComparer<T>): void {
        for (let i = lo; i < hi; i++) {
            let int32: int = i;
            const t: T = keys[i + 1];
            while (int32 >= lo && comparer.Compare(t, keys[int32]) < 0) {
                keys[int32 + 1] = keys[int32];
                int32--;
            }
            keys[int32 + 1] = t;
        }
    }

    public static InternalBinarySearch<T>(array: T[], index: int, length: int, value: T, comparer: IComparer<T>): int {
        let int32: int = index;
        let int321: int = index + length - 1;
        while (int32 <= int321) {
            const int322: int = int32 + (int321 - int32 >> 1);
            const int323: int = comparer.Compare(array[int322], value);
            if (int323 == 0) {
                return int322;
            }
            if (int323 >= 0) {
                int321 = int322 - 1;
            }
            else {
                int32 = int322 + 1;
            }
        }
        return ~int32;
    }

    private static IntroSort<T>(keys: T[], lo: int, hi: int, depthLimit: int, comparer: IComparer<T>): void {
        while (hi > lo) {
            const int32: int = hi - lo + 1;
            if (int32 <= 16) {
                if (int32 == 1) {
                    return;
                }
                if (int32 == 2) {
                    ArraySortHelper.SwapIfGreater<T>(keys, comparer, lo, hi);
                    return;
                }
                if (int32 != 3) {
                    ArraySortHelper.InsertionSort<T>(keys, lo, hi, comparer);
                    return;
                }
                ArraySortHelper.SwapIfGreater<T>(keys, comparer, lo, hi - 1);
                ArraySortHelper.SwapIfGreater<T>(keys, comparer, lo, hi);
                ArraySortHelper.SwapIfGreater<T>(keys, comparer, hi - 1, hi);
                return;
            }
            if (depthLimit == 0) {
                ArraySortHelper.Heapsort<T>(keys, lo, hi, comparer);
                return;
            }
            depthLimit--;
            const int321: int = ArraySortHelper.PickPivotAndPartition<T>(keys, lo, hi, comparer);
            ArraySortHelper.IntroSort<T>(keys, int321 + 1, hi, depthLimit, comparer);
            hi = int321 - 1;
        }
    }

    public static IntrospectiveSort<T>(keys: T[], left: int, length: int, comparer: IComparer<T>): void {
        if (length < 2) {
            return;
        }
        ArraySortHelper.IntroSort<T>(keys, left, length + left - 1, 2 * IntrospectiveSortUtilities.FloorLog2(keys.length), comparer);
    }

    private static PickPivotAndPartition<T>(keys: T[], lo: int, hi: int, comparer: IComparer<T>): int {
        let int32: int;
        let int321: int;
        const int322: int = lo + (hi - lo) / 2;
        ArraySortHelper.SwapIfGreater<T>(keys, comparer, lo, int322);
        ArraySortHelper.SwapIfGreater<T>(keys, comparer, lo, hi);
        ArraySortHelper.SwapIfGreater<T>(keys, comparer, int322, hi);
        const t: T = keys[int322];
        ArraySortHelper.Swap<T>(keys, int322, hi - 1);
        let int323: int = lo;
        let int324: int = hi - 1;
        while (int323 < int324) {
            do {
                int32 = int323 + 1;
                int323 = int32;
            }
            while (comparer.Compare(keys[int32], t) < 0);
            do {
                int321 = int324 - 1;
                int324 = int321;
            }
            while (comparer.Compare(t, keys[int321]) < 0);
            if (int323 >= int324) {
                break;
            }
            ArraySortHelper.Swap<T>(keys, int323, int324);
        }
        ArraySortHelper.Swap<T>(keys, int323, hi - 1);
        return int323;
    }

    public Sort(keys: T[], index: int, length: int, comparer: IComparer<T>): void {
        try {
            if (comparer == null) {
                comparer = Comparer.Default;
            }
            /* if (!BinaryCompatibility.TargetsAtLeast_Desktop_V4_5) {
                ArraySortHelper<T>.DepthLimitedQuickSort(keys, index, length + index - 1, comparer, 32);
            }
            else { */
            ArraySortHelper.IntrospectiveSort<T>(keys, index, length, comparer);
            //}
        }
        /* catch (indexOutOfRangeException) {
            //IntrospectiveSortUtilities.ThrowOrIgnoreBadComparer(comparer);
        } */ catch (exception: any) {
            throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_IComparerFailed"), exception);
        }
    }

    private static Swap<T>(a: T[], i: int, j: int): void {
        if (i !== j) {
            const t: T = a[i];
            a[i] = a[j];
            a[j] = t;
        }
    }

    private static SwapIfGreater<T>(keys: T[], comparer: IComparer<T>, a: int, b: int) {
        if (a !== b && comparer.Compare(keys[a], keys[b]) > 0) {
            const t: T = keys[a];
            keys[a] = keys[b];
            keys[b] = t;
        }
    }
}