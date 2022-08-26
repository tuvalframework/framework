import { InvalidOperationException } from "../../Exceptions/InvalidOperationException";
import { int } from "../../float";
import { Internal } from "../../Reflection/Decorators/ClassInfo";
import { Comparer } from "../Comparer";
import { IntrospectiveSortUtilities } from "../Generic/IntrospectiveSortUtilities";
import { IComparer } from "../IComparer";

export class SorterObjectArray {
    private keys: any[] = null as any;
    private items: any[] = null as any;
    private comparer: IComparer<any> = null as any;

    public /* internal */ constructor(keys: any[], items: any[], comparer: IComparer<any>) {
        if (comparer == null) comparer = Comparer.Default;
        this.keys = keys;
        this.items = items;
        this.comparer = comparer;
    }

    @Internal
    public SwapIfGreaterWithItems(a: int, b: int): void {
        if (a !== b) {
            if (this.comparer.Compare(this.keys[a], this.keys[b]) > 0) {
                const temp: any = this.keys[a];
                this.keys[a] = this.keys[b];
                this.keys[b] = temp;
                if (this.items != null) {
                    const item: any = this.items[a];
                    this.items[a] = this.items[b];
                    this.items[b] = item;
                }
            }
        }
    }

    private Swap(i: int, j: int): void {
        const t: any = this.keys[i];
        this.keys[i] = this.keys[j];
        this.keys[j] = t;

        if (this.items != null) {
            const item: any = this.items[i];
            this.items[i] = this.items[j];
            this.items[j] = item;
        }
    }

    @Internal
    public Sort(left: int, length: int): void {
        this.IntrospectiveSort(left, length);
    }

    private IntrospectiveSort(left: int, length: int): void {
        if (length < 2)
            return;

        try {
            this.IntroSort(left, length + left - 1, 2 * IntrospectiveSortUtilities.FloorLog2PlusOne(this.keys.length));
        }
        /* catch (IndexOutOfRangeException)
        {
            throw new IndexOutOfRangeException('');
        } */
        catch (e:any) {
            throw new InvalidOperationException('InvalidOperation_IComparerFailed', e);
        }
    }

    private IntroSort(lo: int, hi: int, depthLimit: int): void {
        while (hi > lo) {
            const partitionSize: int = hi - lo + 1;
            if (partitionSize <= IntrospectiveSortUtilities.IntrosortSizeThreshold) {
                if (partitionSize == 1) {
                    return;
                }
                if (partitionSize == 2) {
                    this.SwapIfGreaterWithItems(lo, hi);
                    return;
                }
                if (partitionSize == 3) {
                    this.SwapIfGreaterWithItems(lo, hi - 1);
                    this.SwapIfGreaterWithItems(lo, hi);
                    this.SwapIfGreaterWithItems(hi - 1, hi);
                    return;
                }

                this.InsertionSort(lo, hi);
                return;
            }

            if (depthLimit === 0) {
                this.Heapsort(lo, hi);
                return;
            }
            depthLimit--;

            const p: int = this.PickPivotAndPartition(lo, hi);
            this.IntroSort(p + 1, hi, depthLimit);
            hi = p - 1;
        }
    }

    private PickPivotAndPartition(lo: int, hi: int): int {
        // Compute median-of-three.  But also partition them, since we've done the comparison.
        const mid: int = lo + (hi - lo) / 2;
        // Sort lo, mid and hi appropriately, then pick mid as the pivot.
        this.SwapIfGreaterWithItems(lo, mid);
        this.SwapIfGreaterWithItems(lo, hi);
        this.SwapIfGreaterWithItems(mid, hi);

        const pivot: any = this.keys[mid];
        this.Swap(mid, hi - 1);
        let left: int = lo, right = hi - 1;  // We already partitioned lo and hi and put the pivot in hi - 1.  And we pre-increment & decrement below.

        while (left < right) {
            while (this.comparer.Compare(this.keys[++left], pivot) < 0);
            while (this.comparer.Compare(pivot, this.keys[--right]) < 0);

            if (left >= right)
                break;

            this.Swap(left, right);
        }

        // Put pivot in the right location.
        this.Swap(left, (hi - 1));
        return left;
    }

    private Heapsort(lo: int, hi: int): void {
        const n: int = hi - lo + 1;
        for (let i: int = n / 2; i >= 1; i = i - 1) {
            this.DownHeap(i, n, lo);
        }
        for (let i: int = n; i > 1; i = i - 1) {
            this.Swap(lo, lo + i - 1);

            this.DownHeap(1, i - 1, lo);
        }
    }

    private DownHeap(i: int, n: int, lo: int): void {
        const d: any = this.keys[lo + i - 1];
        const dt: any = (this.items != null) ? this.items[lo + i - 1] : null;
        let child: int;
        while (i <= n / 2) {
            child = 2 * i;
            if (child < n && this.comparer.Compare(this.keys[lo + child - 1], this.keys[lo + child]) < 0) {
                child++;
            }
            if (!(this.comparer.Compare(d, this.keys[lo + child - 1]) < 0))
                break;
            this.keys[lo + i - 1] = this.keys[lo + child - 1];
            if (this.items != null)
                this.items[lo + i - 1] = this.items[lo + child - 1];
            i = child;
        }
        this.keys[lo + i - 1] = d;
        if (this.items != null)
            this.items[lo + i - 1] = dt;
    }

    private InsertionSort(lo: int, hi: int): void {
        let i: int, j: int;
        let t: any, ti: any;
        for (i = lo; i < hi; i++) {
            j = i;
            t = this.keys[i + 1];
            ti = (this.items != null) ? this.items[i + 1] : null;
            while (j >= lo && this.comparer.Compare(t, this.keys[j]) < 0) {
                this.keys[j + 1] = this.keys[j];
                if (this.items != null)
                    this.items[j + 1] = this.items[j];
                j--;
            }
            this.keys[j + 1] = t;
            if (this.items != null)
                this.items[j + 1] = ti;
        }
    }
}