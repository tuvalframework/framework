import { IList } from "./Generic/IList";
import { IEnumerable } from "./enumeration_/IEnumerable";
import { ICloneable } from "../ICloneable";
import { int } from "../float";
import { ArgumentOutOfRangeException } from "../Exceptions/ArgumentOutOfRangeException";
import { TArray } from "../Extensions/TArray";
import { is } from "../is";
import { System } from "../SystemTypes";
import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { IEquatable } from "../IEquatable";
import { ArgumentException } from "../Exceptions/ArgumentException";
import { IEnumerator } from "./enumeration_/IEnumerator";
import { Comparer } from "./Comparer";
import { InvalidOperationException } from "../Exceptions/InvalidOperationException";
import { Environment } from "../Environment";
import { NotImplementedException } from "../Exceptions";
import { NotSupportedException } from "../Exceptions/NotSupportedException";
import { as } from "../as";
import { IIteratorResult } from "./enumeration_/IIterator";
import { ICollection } from "./Generic/ICollection";
import { ClassInfo } from "../Reflection/Decorators/ClassInfo";
import { IComparer } from "./IComparer";
import { foreach } from "../foreach";
import { TString } from '../Text/TString';

class EmptyArray {
    public static readonly Value: any[];
    public static EmptyArray() {
        (EmptyArray as any).Value = new Array(0);
    }
}


@ClassInfo({
    fullName: System.Types.Collections.ArrayList.ArrayList,
    instanceof: [
        System.Types.Collections.ArrayList.ArrayList,
        System.Types.Collections.Generics.IList,
        System.Types.Collections.Generics.ICollection,
        System.Types.Collections.Enumeration.IEnumerable,
        System.Types.ICloneable,
    ]
})
export class ArrayList<T = any> implements IList<T>, ICollection<T>, IEnumerable<T>, ICloneable<ArrayList<T>>  {
    importEntries(entries: IEnumerable<T> | ArrayLike<T> | IEnumerator<T>): number {
        throw new Error("Method not implemented.");
    }
    IsEndless?: boolean | undefined;
    private _items: T[] = [];
    private _size: int = 0;
    private _version: int = 0;
    private static readonly _defaultCapacity: int = 4;
    private static readonly emptyArray: any[] = [];

    public get Capacity(): int {
        return this.GetCapacity();
    }
    public set Capacity(value: int) {
        this.SetCapacity(value);
    }

    protected /**virtual */ GetCapacity(): int {
        return this._items.length;
    }
    protected /**virtual */ SetCapacity(value: int) {
        if (value < this._size) {
            throw new ArgumentOutOfRangeException("value", Environment.GetResourceString("ArgumentOutOfRange_SmallCapacity"));
        }
        if (value !== this._items.length) {
            if (value > 0) {
                const objArray: any[] = new Array(value);
                if (this._size > 0) {
                    TArray.Copy(this._items, 0, objArray, 0, this._size);
                }
                this._items = objArray;
                return;
            }
            this._items = new Array(4);
        }
    }
    public get Count(): int {
        return this.Get_Count();
    }
    public Get_Count(): int {
        return this._size;
    }

    public get IsFixedSize(): boolean {
        return this.Get_IsFixedSize();
    }
    public Get_IsFixedSize(): boolean {
        return false;
    }

    public get IsReadOnly(): boolean {
        return this.Get_IsReadOnly();
    }
    public Get_IsReadOnly(): boolean {
        return false;
    }

    public Get(index: int): T {
        if (index < 0 || index >= this._size) {
            throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_Index"));
        }
        return this._items[index];
    }
    public Set(index: int, value: T): boolean {
        if (index < 0 || index >= this._size) {
            throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_Index"));
        }
        this._items[index] = value;
        this._version++;
        return true;
    }

    public staticConstructor() {
        (ArrayList as any).emptyArray = EmptyArray.Value;
    }

    public constructor();
    public constructor(array: Array<any>);
    public constructor(trash: boolean);
    public constructor(capacity: int);
    public constructor(c: ICollection<T>);
    public constructor(...args: any[]) {
        //super();
        if (args.length === 0) {
            this._items = ArrayList.emptyArray;
        } else if (args.length === 1 && is.array(args[0])) {
            this._items = new Array(args[0].length);
            args[0].forEach((item) => {
                this.Add(item);
            });

        } else if (args.length === 1 && is.boolean(args[0])) {

        } else if (args.length === 1 && is.int(args[0])) {
            const capacity: int = args[0];
            if (capacity < 0) {
                throw new ArgumentOutOfRangeException("capacity", Environment.GetResourceString("ArgumentOutOfRange_MustBeNonNegNum"));
            }
            if (capacity === 0) {
                this._items = ArrayList.emptyArray;
                return;
            }
            this._items = new Array(capacity);
        } else if (args.length === 1 && is.typeof<ICollection<T>>(args[0], System.Types.Collections.ICollection)) {
            const c: ICollection<T> = args[0];
            if (c == null) {
                throw new ArgumentNullException("c", Environment.GetResourceString("ArgumentNull_Collection"));
            }
            const count: int = c.Count;
            if (count === 0) {
                this._items = ArrayList.emptyArray;
                return;
            }
            this._items = new Array(count);
            this.AddRange(c);
        }
    }

    public static Adapter<T>(list: IList<T>): ArrayList {
        if (list == null) {
            throw new ArgumentNullException("list");
        }
        return new ArrayList.IListWrapper(list);
    }

    public /* virtual */  Add(value: T): int {
        if (this._size === this._items.length) {
            this.ensureCapacity(this._size + 1);
        }
        this._items[this._size] = value;
        this._version++;
        const int32: int = this._size;
        this._size = int32 + 1;
        return int32;
    }

    public /* virtual */  AddRange(c: ICollection<T> | Array<T>): void {
        this.InsertRange(this._size, c as any);
    }

    public /* virtual */  Clear(): number {
        const clearedItemCount = this._size;
        if (this._size > 0) {
            TArray.Clear(this._items, 0, this._size);
            this._size = 0;
        }
        this._version++;
        return clearedItemCount;
    }

    public /* virtual */  Clone(): ArrayList<T> {
        const arrayLists: ArrayList = new ArrayList(this._size);
        arrayLists._size = this._size;
        arrayLists._version = this._version;
        TArray.Copy(this._items, 0, arrayLists._items, 0, this._size);
        return arrayLists;
    }

    public /* virtual */ Contains(item: T): boolean {
        if (item == null) {
            for (let i = 0; i < this._size; i++) {
                if (this._items[i] == null) {
                    return true;
                }
            }
            return false;
        }
        for (let j = 0; j < this._size; j++) {
            if (this._items[j] != null) {
                if (is.typeof<IEquatable<T>>(this._items[j], System.Types.IEquatable)) {
                    return (this._items[j] as any).equals(item);
                } else if (this._items[j] === item) {
                    return true;
                }
            }
        }
        return false;
    }

    public /* virtual */ CopyTo(array: Array<T>): Array<T>;
    public /* virtual */ CopyTo(array: Array<T>, arrayIndex: int): Array<T>;
    public /* virtual */ CopyTo(index: int, array: Array<T>, arrayIndex: int, count: int): Array<T>;
    public CopyTo(...args: any[]): Array<T> {
        if (args.length === 1 && is.array(args[0])) {
            const array: Array<T> = args[0];
            return this.CopyTo(array, 0);

        } else if (args.length === 2 && is.array(args[0]) && is.int(args[1])) {
            const array: Array<T> = args[0];
            const arrayIndex: int = args[1];
            TArray.Copy(this._items, 0, array, arrayIndex, this._size);
            return array;
        } else if (args.length === 4) {
            const index: int = args[0];
            const array: Array<T> = args[1];
            const arrayIndex: int = args[2];
            const count: int = args[3];
            if (this._size - index < count) {
                throw new ArgumentException(Environment.GetResourceString("Argument_InvalidOffLen"));
            }
            TArray.Copy(this._items, index, array, arrayIndex, count);
        }
        return undefined as any
    }

    private ensureCapacity(min: int): void {
        if (this._items.length < min) {
            let int32: int = (this._items.length === 0 ? 4 : this._items.length * 2);
            if (int32 > 2146435071) {
                int32 = 2146435071;
            }
            if (int32 < min) {
                int32 = min;
            }
            this.Capacity = int32;
        }
    }

    public static FixedSize<T>(list: IList<T>): IList<T>;
    public static FixedSize<T>(list: ArrayList<T>): ArrayList<T>;
    public static FixedSize<T>(...args: any[]): IList<T> | ArrayList<T> {
        if (args.length === 1 && is.typeof<IList<T>>(args[0], System.Types.Collections.Generics.IList)) {
            const list: IList<T> = args[0];
            if (list == null) {
                throw new ArgumentNullException("list");
            }
            return new ArrayList.FixedSizeList(list);
        } else if (args.length === 1 && is.typeof<ArrayList<T>>(args[0], System.Types.Collections.ArrayList.ArrayList)) {
            const list: ArrayList<T> = args[0];
            if (list == null) {
                throw new ArgumentNullException("list");
            }
            return new ArrayList.FixedSizeArrayList(list);
        }
        return undefined as any;
    }

    public /* virtual */  GetEnumerator(): IEnumerator<T>;
    public /* virtual */ GetEnumerator(index: int, count: int): IEnumerator<T>;
    public /* virtual */  GetEnumerator(...args: any[]): IEnumerator<T> {
        if (args.length === 0) {
            return new ArrayListEnumeratorSimple(this);
        } else if (args.length === 2 && is.int(args[0]) && is.int(args[1])) {
            const index: int = args[0];
            const count: int = args[1];
            if (index < 0) {
                throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
            }
            if (count < 0) {
                throw new ArgumentOutOfRangeException("count", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
            }
            if (this._size - index < count) {
                throw new ArgumentException("Argument_InvalidOffLen");
            }
            return new ArrayList.ArrayListEnumerator(this, index, count);
        }

        return undefined as any;
    }

    public /* virtual */  GetRange(index: int, count: int): ArrayList<T> {
        if (index < 0 || count < 0) {
            throw new ArgumentOutOfRangeException((index < 0 ? "index" : "count"), Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
        }
        if (this._size - index < count) {
            throw new ArgumentException(Environment.GetResourceString("Argument_InvalidOffLen"));
        }
        return new Range(this, index, count);
    }

    public /* virtual */ IndexOf(value: T): int;
    public /* virtual */  IndexOf(value: T, startIndex: int): int;
    public /* virtual */  IndexOf(value: T, startIndex: int, count: int): int;
    public /* virtual */  IndexOf(...args: any[]): int {
        if (args.length === 1) {
            const value: T = args[0];
            return TArray.IndexOf(this._items, value, 0, this._size);
        } else if (args.length === 2 && is.int(args[1])) {
            const value: T = args[0];
            const startIndex: int = args[1];
            if (startIndex > this._size) {
                throw new ArgumentOutOfRangeException("startIndex", Environment.GetResourceString("ArgumentOutOfRange_Index"));
            }
            return TArray.IndexOf(this._items, value, startIndex, this._size - startIndex);
        } else if (args.length === 3 && is.int(args[1]) && is.int(args[2])) {
            const value: T = args[0];
            const startIndex: int = args[1];
            const count: int = args[2];

            if (startIndex > this._size) {
                throw new ArgumentOutOfRangeException("startIndex", Environment.GetResourceString("ArgumentOutOfRange_Index"));
            }
            if (count < 0 || startIndex > this._size - count) {
                throw new ArgumentOutOfRangeException("count", Environment.GetResourceString("ArgumentOutOfRange_Count"));
            }
            return TArray.IndexOf(this._items, value, startIndex, count);
        }
        return undefined as any;
    }

    public /* virtual */  Insert(index: int, value: T): void {
        if (index < 0 || index > this._size) {
            throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_ArrayListInsert"));
        }
        if (this._size === this._items.length) {
            this.ensureCapacity(this._size + 1);
        }
        if (index < this._size) {
            TArray.Copy(this._items, index, this._items, index + 1, this._size - index);
        }
        this._items[index] = value;
        this._size++;
        this._version++;
    }

    public /* virtual */  InsertRange(index: int, c: ICollection<T>): void;
    public /* virtual */  InsertRange(index: int, c: Array<T>): void;
    public /* virtual */  InsertRange(...args: any[]): void {
        if (args.length === 2 && is.int(args[0]) && is.typeof<ICollection<T>>(args[1], System.Types.Collections.ICollection)) {
            const index: int = args[0];
            const c: ICollection<T> = args[1];
            if (c == null) {
                throw new ArgumentNullException("c", Environment.GetResourceString("ArgumentNull_Collection"));
            }
            if (index < 0 || index > this._size) {
                throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_Index"));
            }
            const count: int = c.Count;
            if (count > 0) {
                this.ensureCapacity(this._size + count);
                if (index < this._size) {
                    TArray.Copy(this._items, index, this._items, index + count, this._size - index);
                }
                const objArray: any[] = new Array(count);
                c.CopyTo(objArray, 0);
                TArray.Copy(objArray, TArray.GetLowerBound(objArray, 0), this._items, index, objArray.length);
                this._size += count;
                this._version++;
            }
        } else if (args.length === 2 && is.int(args[0]) && is.array(args[1])) {
            const index: int = args[0];
            const c: Array<T> = args[1];

            const count: int = c.length;
            if (count > 0) {
                this.ensureCapacity(this._size + count);
                if (index < this._size) {
                    TArray.Copy(this._items, index, this._items, index + count, this._size - index);
                }
                const objArray: any[] = new Array(count);
                TArray.Copy(c, 0, objArray, 0, c.length);
                TArray.Copy(objArray, TArray.GetLowerBound(objArray, 0), this._items, index, objArray.length);
                this._size += count;
                this._version++;
            }
        }
    }

    public /* virtual */  LastIndexOf(value: T): int;
    public /* virtual */  LastIndexOf(value: T, startIndex: int): int;
    public /* virtual */  LastIndexOf(value: T, startIndex: int, count: int): int;
    public /* virtual */  LastIndexOf(...args: any[]): int {
        if (args.length === 1) {
            const value: T = args[0];
            return this.LastIndexOf(value, this._size - 1, this._size);
        } else if (args.length === 2 && is.int(args[1])) {
            const value: T = args[0];
            const startIndex: int = args[1];
            if (startIndex >= this._size) {
                throw new ArgumentOutOfRangeException("startIndex", Environment.GetResourceString("ArgumentOutOfRange_Index"));
            }
            return this.LastIndexOf(value, startIndex, startIndex + 1);
        } else if (args.length === 3 && is.int(args[1]) && is.int(args[2])) {
            const value: T = args[0];
            const startIndex: int = args[1];
            const count: int = args[2];

            if (this.Count !== 0 && (startIndex < 0 || count < 0)) {
                throw new ArgumentOutOfRangeException((startIndex < 0 ? "startIndex" : "count"), Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
            }
            if (this._size === 0) {
                return -1;
            }
            if (startIndex >= this._size || count > startIndex + 1) {
                throw new ArgumentOutOfRangeException((startIndex >= this._size ? "startIndex" : "count"), Environment.GetResourceString("ArgumentOutOfRange_BiggerThanCollection"));
            }
            return TArray.LastIndexOf(this._items, value, startIndex, count);
        }
        return undefined as any;
    }

    public static ReadOnly<T>(list: IList<T>): IList<T>;
    public static ReadOnly<T>(list: ArrayList<T>): ArrayList<T>;
    public static ReadOnly<T>(...args: any[]): IList<T> | ArrayList<T> {
        if (args.length === 1 && is.typeof<IList<T>>(args[0], System.Types.Collections.Generics.IList)) {
            const list: IList<T> = args[0];
            if (list == null) {
                throw new ArgumentNullException("list");
            }
            return new ReadOnlyList(list);
        } else if (args.length === 1 && is.typeof<ArrayList<T>>(args[0], System.Types.Collections.ArrayList.ArrayList)) {
            const list: ArrayList<T> = args[0];
            if (list == null) {
                throw new ArgumentNullException("list");
            }
            return new ReadOnlyArrayList(list);
        }
        return undefined as any;
    }
    public /* virtual */ Remove(obj: T): boolean {
        const int32: int = this.IndexOf(obj);
        if (int32 >= 0) {
            this.RemoveAt(int32);
        }
        return true;
    }

    public /* virtual */ RemoveAt(index: int): boolean {
        if (index < 0 || index >= this._size) {
            throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_Index"));
        }
        this._size--;
        if (index < this._size) {
            TArray.Copy(this._items, index + 1, this._items, index, this._size - index);
        }
        this._items[this._size] = null as any;
        this._version++;
        return true;
    }

    public /* virtual */  RemoveRange(index: int, count: int): void {
        if (index < 0) {
            throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
        }
        if (count < 0) {
            throw new ArgumentOutOfRangeException("count", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
        }
        if (this._size - index < count) {
            throw new ArgumentException(Environment.GetResourceString("Argument_InvalidOffLen"));
        }
        if (count > 0) {
            let int32: int = this._size;
            this._size -= count;
            if (index < this._size) {
                TArray.Copy(this._items, index + count, this._items, index, this._size - index);
            }
            while (int32 > this._size) {
                const int321: int = int32 - 1;
                int32 = int321;
                this._items[int321] = null as any;
            }
            this._version++;
        }
    }

    public static Repeat<T>(value: T, count: int): ArrayList<T> {
        if (count < 0) {
            throw new ArgumentOutOfRangeException("count", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
        }
        const arrayLists: ArrayList<T> = new ArrayList((count > 4 ? count : 4));
        for (let i = 0; i < count; i++) {
            arrayLists.Add(value);
        }
        return arrayLists;
    }
    public /* virtual */  Reverse(): void;
    public /* virtual */  Reverse(index: int, count: int): void;
    public /* virtual */  Reverse(...args: any[]): void {
        if (args.length === 0) {
            this.Reverse(0, this.Count);
        } else if (args.length === 2 && is.int(args[0]) && is.int(args[1])) {
            const index: int = args[0];
            const count: int = args[1];
            if (index < 0) {
                throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
            }
            if (count < 0) {
                throw new ArgumentOutOfRangeException("count", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
            }
            if (this._size - index < count) {
                throw new ArgumentException(Environment.GetResourceString("Argument_InvalidOffLen"));
            }
            TArray.Reverse(this._items, index, count);
            this._version++;
        }

    }

    public /* virtual */  SetRange(index: int, c: ICollection<T>): void {
        if (c == null) {
            throw new ArgumentNullException("c", Environment.GetResourceString("ArgumentNull_Collection"));
        }
        const count: int = c.Count;
        if (index < 0 || index > this._size - count) {
            throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_Index"));
        }
        if (count > 0) {
            c.CopyTo(this._items, index);
            this._version++;
        }
    }
    public /* virtual */  Sort(): void;
    public /* virtual */  Sort(comparer: IComparer<T>): void;
    public /* virtual */  Sort(index: int, count: int, comparer: IComparer<T>): void;
    public /* virtual */  Sort(...args: any[]): void {
        if (args.length === 0) {
            this.Sort(0, this.Count, Comparer.Default);
        } else if (args.length === 1 && is.typeof<IComparer<T>>(args[0], System.Types.IComparer)) {
            const comparer: IComparer<T> = args[0];
            this.Sort(0, this.Count, comparer);
        } else if (args.length === 3 && is.int(args[0]) && is.int(args[1]) && is.typeof<IComparer<T>>(args[2], System.Types.IComparer)) {
            const index: int = args[0];
            const count: int = args[1];
            const comparer: IComparer<T> = args[2];
            if (index < 0) {
                throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
            }
            if (count < 0) {
                throw new ArgumentOutOfRangeException("count", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
            }
            if (this._size - index < count) {
                throw new ArgumentException(Environment.GetResourceString("Argument_InvalidOffLen"));
            }
            TArray.Sort(this._items, index, count, comparer);
            this._version++;
        }
    }
    public /* virtual */  ToArray(): Array<T> {
        const array: T[] = new Array(this._size);
        TArray.Copy(this._items, 0, array, 0, this._size);
        return array;
    }

    public /* virtual */  TrimToSize(): void {
        this.Capacity = this._size;
    }

    public BinarySearch(value: T): int;
    public BinarySearch(value: T, comparer: IComparer<T>): int;
    public BinarySearch(index: int, count: int, value: T, comparer: IComparer<T>): int;
    public BinarySearch(...args: any[]): int {
        if (args.length === 1) {
            const value: any = args[0];
            return this.BinarySearch(0, this.Count, value, null as any);
        } else if (args.length === 2) {
            const value: T = args[0];
            const comparer: IComparer<T> = args[1];
            return this.BinarySearch(0, this.Count, value, comparer);
        } else if (args.length === 4) {
            const index: int = args[0];
            const count: int = args[1];
            const value: any = args[2];
            const comparer: IComparer<any> = args[3];

            if (index < 0 || count < 0) {
                throw new ArgumentOutOfRangeException((index < 0 ? "index" : "count"), Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
            }
            if (this._size - index < count) {
                throw new ArgumentException(Environment.GetResourceString("Argument_InvalidOffLen"));
            }
            return TArray.BinarySearch(this._items, index, count, value, comparer);
        }
        throw new Error('');
    }

    public ToString(): string {
        let result: string[] = [];
        foreach(this, (item: any) => {
            result.push(TString.ToString(item));
        });
        return result.join(' ,');
    }


    private static ArrayListEnumerator = class <T> implements IEnumerator<T>, ICloneable<T> {

        private list: ArrayList<T> = undefined as any;
        private index: int = 0;
        private endIndex: int = 0;
        private version: int = 0;
        private currentElement: T = undefined as any;
        private startIndex: int = 0;
        public get Current(): T {
            if (this.index < this.startIndex) {
                throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_EnumNotStarted"));
            }
            if (this.index > this.endIndex) {
                throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_EnumEnded"));
            }
            return this.currentElement;
        }

        public constructor(list: ArrayList<T>, index: int, count: int) {
            this.list = list;
            this.startIndex = index;
            this.index = index - 1;
            this.endIndex = this.index + count;
            this.version = list._version;
            this.currentElement = null as any;
        }

        public Clone(): T {
            throw new NotImplementedException('ArrayListEnumerator::clone');
        }

        public MoveNext(): boolean {
            if (this.version !== this.list._version) {
                throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_EnumFailedVersion"));
            }
            if (this.index >= this.endIndex) {
                this.index = this.endIndex + 1;
                return false;
            }
            const int32: int = this.index + 1;
            this.index = int32;
            this.currentElement = this.list[int32];
            return true;
        }

        public Reset(): void {
            if (this.version !== this.list._version) {
                throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_EnumFailedVersion"));
            }
            this.index = this.startIndex - 1;
        }

        public CanMoveNext?: boolean | undefined;
        public TryMoveNext(out: (value: T) => void): boolean {
            throw new Error("Method not implemented.");
        }
        public End(): void {
            throw new Error("Method not implemented.");
        }
        public NextValue(value?: any): T | undefined {
            throw new Error("Method not implemented.");
        }
        public IsEndless?: boolean | undefined;
        public Next(value?: any): IIteratorResult<T> {
            throw new Error("Method not implemented.");
        }
        public Dispose(): void {
            throw new Error("Method not implemented.");
        }
    }



    private static FixedSizeArrayList = class <T> extends ArrayList<T> {
        private _list: ArrayList<T> = undefined as any;

        public /* override */ GetCapacity(): int {
            return this._list.Capacity;
        }
        public SetCapacity(value: int) {
            throw new NotSupportedException(Environment.GetResourceString("NotSupported_FixedSizeCollection"));
        }

        public /* override */ Get_Count(): int {
            return this._list.Count;
        }

        public /* override */  Get_IsFixedSize(): boolean {
            return true;
        }

        public /* override */  Get_IsReadOnly(): boolean {
            return this._list.IsReadOnly;
        }

        public /* override */  Get(index: int): T {
            return this._list.Get(index);
        }
        public Set(index: int, value: T): boolean {
            this._list.Set(index, value);
            this._version = this._list._version;
            return true;
        }

        public constructor(l: ArrayList) {
            super();
            this._list = l;
            this._version = this._list._version;
        }

        public /* override */ Add(obj: T): int {
            throw new NotSupportedException(Environment.GetResourceString("NotSupported_FixedSizeCollection"));
        }

        public /* override */  AddRange(c: ICollection<T>): void {
            throw new NotSupportedException(Environment.GetResourceString("NotSupported_FixedSizeCollection"));
        }

        /*  public override int BinarySearch(int index, int count, object value, IComparer comparer) {
             return this._list.BinarySearch(index, count, value, comparer);
         } */

        public /* override */  Clear(): number {
            throw new NotSupportedException(Environment.GetResourceString("NotSupported_FixedSizeCollection"));
        }

        public /* override */ Clone(): ArrayList<T> {
            const fixedSizeArrayList: any = new ArrayList.FixedSizeArrayList(this._list)
            fixedSizeArrayList._list = this._list.Clone()
            return fixedSizeArrayList;
        }

        public /* override */  Contains(obj: T): boolean {
            return this._list.Contains(obj);
        }

        public /* virtual */ CopyTo(array: Array<T>): Array<T>;
        public /* virtual */ CopyTo(array: Array<T>, arrayIndex: int): Array<T>;
        public /* virtual */ CopyTo(index: int, array: Array<T>, arrayIndex: int, count: int): Array<T>;
        public /* override */ CopyTo(...args: any[]): Array<T> {
            if (args.length === 2 && is.array(args[0]) && is.int(args[1])) {
                const array: Array<T> = args[0];
                const index: int = args[1];
                this._list.CopyTo(array, index);
                return array;
            } else if (args.length === 4 && is.int(args[0]), is.array(args[1]) && is.int(args[2]) && is.int(args[3])) {
                const index: int = args[0];
                const array: Array<T> = args[1];
                const arrayIndex: int = args[2];
                const count: int = args[3];
                this._list.CopyTo(index, array, arrayIndex, count);
                return array;
            }
            return undefined as any;
        }


        public /* virtual */  GetEnumerator(): IEnumerator<T>;
        public /* virtual */ GetEnumerator(index: int, count: int): IEnumerator<T>;
        public /* virtual */  GetEnumerator(...args: any[]): IEnumerator<T> {
            if (args.length === 0) {
                return this._list.GetEnumerator();
            } else if (args.length === 2) {
                const index: int = args[0];
                const count: int = args[1];
                return this._list.GetEnumerator(index, count);
            }
            return undefined as any;
        }

        public /* override */  GetRange(index: int, count: int): ArrayList<T> {
            if (index < 0 || count < 0) {
                throw new ArgumentOutOfRangeException((index < 0 ? "index" : "count"), Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
            }
            if (this.Count - index < count) {
                throw new ArgumentException(Environment.GetResourceString("Argument_InvalidOffLen"));
            }
            return new Range(this, index, count);
        }

        public /* virtual */ IndexOf(value: T): int;
        public /* virtual */  IndexOf(value: T, startIndex: int): int;
        public /* virtual */  IndexOf(value: T, startIndex: int, count: int): int;
        public /* virtual */  IndexOf(...args: any[]): int {
            if (args.length === 1) {
                const value: T = args[0];
                return this._list.IndexOf(value);
            } else if (args.length === 2 && is.int(args[1])) {
                const value: T = args[0];
                const startIndex: int = args[1];
                return this._list.IndexOf(value, startIndex);

            } else if (args.length === 3 && is.int(args[1]) && is.int(args[2])) {
                const value: T = args[0];
                const startIndex: int = args[1];
                const count: int = args[2];
                return this._list.IndexOf(value, startIndex, count);
            }
            return undefined as any;
        }


        public /* override */ Insert(index: int, obj: T): void {
            throw new NotSupportedException(Environment.GetResourceString("NotSupported_FixedSizeCollection"));
        }

        public /* virtual */  InsertRange(index: int, c: ICollection<T>): void;
        public /* virtual */  InsertRange(index: int, c: Array<T>): void;
        public /* virtual */  InsertRange(...args: any[]): void {
            throw new NotSupportedException(Environment.GetResourceString("NotSupported_FixedSizeCollection"));
        }


        public /* virtual */  LastIndexOf(value: T): int;
        public /* virtual */  LastIndexOf(value: T, startIndex: int): int;
        public /* virtual */  LastIndexOf(value: T, startIndex: int, count: int): int;
        public /* virtual */  LastIndexOf(...args: any[]): int {
            if (args.length === 1) {
                const value: T = args[0];
                return this._list.LastIndexOf(value);
            } else if (args.length === 2 && is.int(args[1])) {
                const value: T = args[0];
                const startIndex: int = args[1];
                return this._list.LastIndexOf(value, startIndex);
            } else if (args.length === 3 && is.int(args[1]) && is.int(args[2])) {
                const value: T = args[0];
                const startIndex: int = args[1];
                const count: int = args[2];
                return this._list.LastIndexOf(value, startIndex, count);
            }
            return undefined as any;
        }

        public /* override */  Remove(value: T): boolean {
            throw new NotSupportedException(Environment.GetResourceString("NotSupported_FixedSizeCollection"));
        }

        public /* override */  RemoveAt(index: int): boolean {
            throw new NotSupportedException(Environment.GetResourceString("NotSupported_FixedSizeCollection"));
        }

        public /* override */  RemoveRange(index: int, count: int): void {
            throw new NotSupportedException(Environment.GetResourceString("NotSupported_FixedSizeCollection"));
        }

        public /* virtual */  Reverse(): void;
        public /* virtual */  Reverse(index: int, count: int): void;
        public /* virtual */  Reverse(...args: any[]): void {
            if (args.length === 0) {
                super.Reverse(0, this.Count);
            } else if (args.length === 2 && is.int(args[0]) && is.int(args[1])) {
                const index: int = args[0];
                const count: int = args[1];
                this._list.Reverse(index, count);
                this._version = this._list._version;
            }
        }

        public /* override */  SetRange(index: int, c: ICollection<T>): void {
            this._list.SetRange(index, c);
            this._version = this._list._version;
        }

        public /* virtual */  Sort(): void;
        public /* virtual */  Sort(comparer: IComparer<T>): void;
        public /* virtual */  Sort(index: int, count: int, comparer: IComparer<T>): void;
        public /* virtual */  Sort(...args: any[]): void {
            if (args.length === 0) {
                this._list.Sort();
            } else if (args.length === 1 && is.typeof<IComparer<T>>(args[0], System.Types.IComparer)) {
                const comparer: IComparer<T> = args[0];
                this._list.Sort(0, this.Count, comparer);
            } else if (args.length === 3 && is.int(args[0]) && is.int(args[1]) && is.typeof<IComparer<T>>(args[2], System.Types.IComparer)) {
                const index: int = args[0];
                const count: int = args[1];
                const comparer: IComparer<T> = args[2];
                this._list.Sort(index, count, comparer);
                this._version = this._list._version;
            }

        }

        public /* override */  ToArray(): T[] {
            return this._list.ToArray();
        }
        public /* override */  TrimToSize(): void {
            throw new NotSupportedException(Environment.GetResourceString("NotSupported_FixedSizeCollection"));
        }
    }

    private static FixedSizeList = class <T> implements IList<T>, ICollection<T>, IEnumerable<T>
    {

        private _list: IList<T> = undefined as any;

        public get Count(): int {
            return this._list.Count;
        }

        public get IsFixedSize(): boolean {
            return true;
        }

        public get IsReadOnly(): boolean {
            return (this._list as any).IsReadOnly;
        }



        public /* virtual */ Get(index: int): T {
            return this._list[index];
        }
        public Set(index: int, value: T): boolean {
            this._list[index] = value;
            return true;
        }

        public constructor(l: IList<T>) {
            this._list = l;
        }

        public /* virtual */ Add(obj: T): int {
            throw new NotSupportedException(Environment.GetResourceString("NotSupported_FixedSizeCollection"));
        }

        public /* virtual */  Clear(): number {
            throw new NotSupportedException(Environment.GetResourceString("NotSupported_FixedSizeCollection"));
        }

        public /* virtual */ Contains(obj: T): boolean {
            return (this._list as any).Contains(obj);
        }

        public /* virtual */  CopyTo(array: Array<T>, index: int): Array<T> {
            this._list.CopyTo(array, index);
            return array;
        }

        public /* virtual */  GetEnumerator(): IEnumerator<T> {
            return this._list.GetEnumerator();
        }

        public /* virtual */  IndexOf(value: T): int {
            return (this._list as any).indexOf(value);
        }

        public /* virtual */  Insert(index: int, obj: T): void {
            throw new NotSupportedException(Environment.GetResourceString("NotSupported_FixedSizeCollection"));
        }

        public /* virtual */  Remove(value: T): boolean {
            throw new NotSupportedException(Environment.GetResourceString("NotSupported_FixedSizeCollection"));
        }

        public /* virtual */  RemoveAt(index: int): boolean {
            throw new NotSupportedException(Environment.GetResourceString("NotSupported_FixedSizeCollection"));
        }

        public importEntries(entries: IEnumerable<T> | ArrayLike<T> | IEnumerator<T>): number {
            throw new Error("Method not implemented.");
        }
        public toArray(): T[] {
            throw new Error("Method not implemented.");
        }
        public IsEndless?: boolean | undefined;
    }


    private static IListWrapper = class <T> extends ArrayList<T> {
        private _list: IList<T> = undefined as any;

        public /* override */  GetCapacity(): int {
            return this._list.Count;
        }
        public /* override */    SetCapacity(value: int) {
            if (value < this.Count) {
                throw new ArgumentOutOfRangeException("value", "ArgumentOutOfRange_SmallCapacity");
            }
        }

        public /* override */  Get_Count(): int {
            return this._list.Count;
        }

        public /* override */  Get_IsFixedSize(): boolean {
            return (this._list as any).IsFixedSize;
        }

        public /* override */  Get_IsReadOnly(): boolean {
            return (this._list as any).IsReadOnly;
        }



        public /* override */ Get(index: int): T {

            return this._list[index];
        }
        public Set(index: int, value: T): boolean {
            this._list[index] = value;
            this._version++;
            return true;
        }


        public constructor(list: IList<T>) {
            super();
            this._list = list;
            this._version = 0;
        }

        public /* override */ Add(obj: T): int {
            (this._list as any).add(obj);
            this._version++;
            return 0;
        }

        public /* override */  AddRange(c: ICollection<T>): void {
            this.InsertRange(this.Count, c);
        }



        public /* override */  Clear(): number {
            if ((this._list as any).IsFixedSize) {
                throw new NotSupportedException(Environment.GetResourceString("NotSupported_FixedSizeCollection"));
            }
            (this._list as any).clear();
            this._version++;
            return 0;
        }

        public /* override */ Clone(): ArrayList<T> {
            return new ArrayList.IListWrapper(this._list);
        }

        public /* override */  Contains(obj: T): boolean {
            return (this._list as any).contains(obj);
        }

        public /* virtual */ CopyTo(array: Array<T>): Array<T>;
        public /* virtual */ CopyTo(array: Array<T>, arrayIndex: int): Array<T>;
        public /* virtual */ CopyTo(index: int, array: Array<T>, arrayIndex: int, count: int): Array<T>;
        public CopyTo(...args: any[]): Array<T> {
            if (args.length === 1 && is.array(args[0])) {
                const array: Array<T> = args[0];
                return super.CopyTo(array);

            } else if (args.length === 2 && is.array(args[0]) && is.int(args[1])) {
                const array: Array<T> = args[0];
                const arrayIndex: int = args[1];
                this._list.CopyTo(array, arrayIndex);
                return array;
            } else if (args.length === 4) {
                const index: int = args[0];
                const array: Array<T> = args[1];
                let arrayIndex: int = args[2];
                const count: int = args[3];

                if (array == null) {
                    throw new ArgumentNullException("array");
                }
                if (index < 0 || arrayIndex < 0) {
                    throw new ArgumentOutOfRangeException((index < 0 ? "index" : "arrayIndex"), Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
                }
                if (count < 0) {
                    throw new ArgumentOutOfRangeException("count", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
                }
                if (array.length - arrayIndex < count) {
                    throw new ArgumentException(Environment.GetResourceString("Argument_InvalidOffLen"));
                }

                if (this._list.Count - index < count) {
                    throw new ArgumentException(Environment.GetResourceString("Argument_InvalidOffLen"));
                }
                for (let i = index; i < index + count; i++) {
                    const int32: int = arrayIndex;
                    arrayIndex = int32 + 1;
                    array[int32] = this._list[i];
                }
                return array;
            }
            return undefined as any
        }

        public /* virtual */  GetEnumerator(): IEnumerator<T>;
        public /* virtual */ GetEnumerator(index: int, count: int): IEnumerator<T>;
        public /* virtual */  GetEnumerator(...args: any[]): IEnumerator<T> {
            if (args.length === 0) {
                return this._list.GetEnumerator();
            } else if (args.length === 2 && is.int(args[0]) && is.int(args[1])) {
                const index: int = args[0];
                const count: int = args[1];
                if (index < 0 || count < 0) {
                    throw new ArgumentOutOfRangeException((index < 0 ? "index" : "count"), Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
                }
                if (this._list.Count - index < count) {
                    throw new ArgumentException(Environment.GetResourceString("Argument_InvalidOffLen"));
                }
                return new ArrayList.IListWrapper.IListWrapperEnumWrapper(this, index, count);
            }

            return undefined as any;
        }



        public /* override */  GetRange(index: int, count: int): ArrayList<T> {
            if (index < 0 || count < 0) {
                throw new ArgumentOutOfRangeException((index < 0 ? "index" : "count"), Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
            }
            if (this._list.Count - index < count) {
                throw new ArgumentException(Environment.GetResourceString("Argument_InvalidOffLen"));
            }
            return new Range(this, index, count);
        }

        public /* virtual */ IndexOf(value: T): int;
        public /* virtual */  IndexOf(value: T, startIndex: int): int;
        public /* virtual */  IndexOf(value: T, startIndex: int, count: int): int;
        public /* virtual */  IndexOf(...args: any[]): int {
            if (args.length === 1) {
                const value: T = args[0];
                return (this._list as any).indexOf(value);
            } else if (args.length === 2 && is.int(args[1])) {
                const value: T = args[0];
                const startIndex: int = args[1];
                return this.IndexOf(value, startIndex, this._list.Count - startIndex);
            } else if (args.length === 3 && is.int(args[1]) && is.int(args[2])) {
                const value: T = args[0];
                const startIndex: int = args[1];
                const count: int = args[2];

                if (startIndex < 0 || startIndex > this.Count) {
                    throw new ArgumentOutOfRangeException("startIndex", Environment.GetResourceString("ArgumentOutOfRange_Index"));
                }
                if (count < 0 || startIndex > this.Count - count) {
                    throw new ArgumentOutOfRangeException("count", Environment.GetResourceString("ArgumentOutOfRange_Count"));
                }
                const int32: int = startIndex + count;
                if (value == null) {
                    for (let i = startIndex; i < int32; i++) {
                        if (this._list[i] == null) {
                            return i;
                        }
                    }
                    return -1;
                }
                for (let j = startIndex; j < int32; j++) {
                    if (this._list[j] != null && this._list[j].Equals(value)) {
                        return j;
                    }
                }
                return -1;
            }
            return undefined as any;
        }


        public /* override */  Insert(index: int, obj: T): void {
            this._list.Insert(index, obj);
            this._version++;
        }

        public /* virtual */  InsertRange(index: int, c: ICollection<T>): void;
        public /* virtual */  InsertRange(index: int, c: Array<T>): void;
        public /* virtual */  InsertRange(...args: any[]): void {
            if (args.length === 2 && is.int(args[0]) && is.typeof<ICollection<T>>(args[1], System.Types.Collections.Generics.ICollection)) {
                let index: int = args[0];
                const c: ICollection<T> = args[1];

                if (c == null) {
                    throw new ArgumentNullException("c", Environment.GetResourceString("ArgumentNull_Collection"));
                }
                if (index < 0 || index > this.Count) {
                    throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_Index"));
                }
                if (c.Count > 0) {
                    const arrayLists: ArrayList<T> = as(this._list, System.Types.Collections.ArrayList.ArrayList);
                    if (arrayLists == null) {
                        const enumerator: IEnumerator<T> = c.GetEnumerator();
                        while (enumerator.MoveNext()) {
                            const int32: int = index;
                            index = int32 + 1;
                            this._list.Insert(int32, enumerator.Current as any);
                        }
                    }
                    else {
                        arrayLists.InsertRange(index, c);
                    }
                    this._version++;
                }
            }
        }

        public /* virtual */  LastIndexOf(value: T): int;
        public /* virtual */  LastIndexOf(value: T, startIndex: int): int;
        public /* virtual */  LastIndexOf(value: T, startIndex: int, count: int): int;
        public /* virtual */  LastIndexOf(...args: any[]): int {
            if (args.length === 1) {
                const value: T = args[0];
                return this.LastIndexOf(value, this._list.Count - 1, this._list.Count);
            } else if (args.length === 2 && is.int(args[1])) {
                const value: T = args[0];
                const startIndex: int = args[1];
                return this.LastIndexOf(value, startIndex, startIndex + 1);
            } else if (args.length === 3 && is.int(args[1]) && is.int(args[2])) {
                const value: T = args[0];
                const startIndex: int = args[1];
                const count: int = args[2];

                if (this._list.Count === 0) {
                    return -1;
                }
                if (startIndex < 0 || startIndex >= this._list.Count) {
                    throw new ArgumentOutOfRangeException("startIndex", Environment.GetResourceString("ArgumentOutOfRange_Index"));
                }
                if (count < 0 || count > startIndex + 1) {
                    throw new ArgumentOutOfRangeException("count", Environment.GetResourceString("ArgumentOutOfRange_Count"));
                }
                const int32: int = startIndex - count + 1;
                if (value == null) {
                    for (let i = startIndex; i >= int32; i--) {
                        if (this._list[i] == null) {
                            return i;
                        }
                    }
                    return -1;
                }
                for (let j = startIndex; j >= int32; j--) {
                    if (this._list[j] != null && this._list[j].Equals(value)) {
                        return j;
                    }
                }
                return -1;
            }
            return undefined as any;
        }


        public /* override */  Remove(value: T): boolean {
            const int32: int = this.IndexOf(value);
            if (int32 >= 0) {
                this.RemoveAt(int32);
            }
            return true;
        }

        public /* override */  RemoveAt(index: int): boolean {
            this._list.RemoveAt(index);
            this._version++;
            return true;
        }

        public /* override */  RemoveRange(index: int, count: int): void {
            if (index < 0 || count < 0) {
                throw new ArgumentOutOfRangeException((index < 0 ? "index" : "count"), Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
            }
            if (this._list.Count - index < count) {
                throw new ArgumentException(Environment.GetResourceString("Argument_InvalidOffLen"));
            }
            if (count > 0) {
                this._version++;
            }
            while (count > 0) {
                this._list.RemoveAt(index);
                count--;
            }
        }

        public /* virtual */  Reverse(): void;
        public /* virtual */  Reverse(index: int, count: int): void;
        public /* virtual */  Reverse(...args: any[]): void {
            if (args.length === 0) {
                super.Reverse(0, this.Count);
            } else if (args.length === 2 && is.int(args[0]) && is.int(args[1])) {
                const index: int = args[0];
                const count: int = args[1];

                if (index < 0 || count < 0) {
                    throw new ArgumentOutOfRangeException((index < 0 ? "index" : "count"), Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
                }
                if (this._list.Count - index < count) {
                    throw new ArgumentException(Environment.GetResourceString("Argument_InvalidOffLen"));
                }
                let int32: int = index;
                let int321: int = index + count - 1;
                while (int32 < int321) {
                    const item: T = this._list[int32];
                    const item1: int = int32;
                    int32 = item1 + 1;
                    this._list.Set(item1, (this._list as any).get(int321));
                    const int322: int = int321;
                    int321 = int322 - 1;
                    this._list.Set(int322, item);
                }
                this._version++;
            }

        }




        public /* override */  SetRange(index: int, c: ICollection<T>): void {
            if (c == null) {
                throw new ArgumentNullException("c", Environment.GetResourceString("ArgumentNull_Collection"));
            }
            if (index < 0 || index > this._list.Count - c.Count) {
                throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_Index"));
            }
            if (c.Count > 0) {
                const enumerator: IEnumerator<T> = c.GetEnumerator();
                while (enumerator.MoveNext()) {
                    const current: int = index;
                    index = current + 1;
                    this._list.Set(current, enumerator.Current as any);
                }
                this._version++;
            }
        }

        public /* virtual */  Sort(): void;
        public /* virtual */  Sort(comparer: IComparer<T>): void;
        public /* virtual */  Sort(index: int, count: int, comparer: IComparer<T>): void;
        public /* virtual */  Sort(...args: any[]): void {
            if (args.length === 0) {
                super.Sort();
            } else if (args.length === 1 && is.typeof<IComparer<T>>(args[0], System.Types.IComparer)) {
                const comparer: IComparer<T> = args[0];
                super.Sort(comparer);
            } else if (args.length === 3 && is.int(args[0]) && is.int(args[1]) && is.typeof<IComparer<T>>(args[2], System.Types.IComparer)) {
                const index: int = args[0];
                const count: int = args[1];
                const comparer: IComparer<T> = args[2];
                if (index < 0 || count < 0) {
                    throw new ArgumentOutOfRangeException((index < 0 ? "index" : "count"), Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
                }
                if (this._list.Count - index < count) {
                    throw new ArgumentException(Environment.GetResourceString("Argument_InvalidOffLen"));
                }
                const objArray: T[] = new Array(count);
                this.CopyTo(index, objArray, 0, count);
                TArray.Sort(objArray, 0, count, comparer);
                for (let i = 0; i < count; i++) {
                    this._list.Set(i + index, objArray[i]);
                }
                this._version++;
            }
        }


        public /* override */  ToArray(): T[] {
            const objArray: T[] = new Array(this.Count);
            this._list.CopyTo(objArray, 0);
            return objArray;
        }

        private static IListWrapperEnumWrapper = class IListWrapperEnumWrapper<T> implements IEnumerator<T>, ICloneable<IListWrapperEnumWrapper<T>> {
            Current: T = undefined as any;
            CanMoveNext?: boolean | undefined;

            TryMoveNext(out: (value: T) => void): boolean {
                throw new Error("Method not implemented.");
            }

            End(): void {
                throw new Error("Method not implemented.");
            }
            NextValue(value?: any): T | undefined {
                throw new Error("Method not implemented.");
            }
            IsEndless?: boolean | undefined;
            Next(value?: any): IIteratorResult<T> {
                throw new Error("Method not implemented.");
            }
            Dispose(): void {
                throw new Error("Method not implemented.");
            }
            private _en: IEnumerator<T> = undefined as any;
            private _remaining: int = 0;
            private _initialStartIndex: int = 0;
            private _initialCount: int = 0;
            private _firstCall: boolean = false;
            public getCurrent(): boolean {
                if (this._firstCall) {
                    throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_EnumNotStarted"));
                }
                if (this._remaining < 0) {
                    throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_EnumEnded"));
                }
                return this._en.Current as any;
            }
            public constructor();
            public constructor(listWrapper: ArrayList<T>, startIndex: int, count: int);
            public constructor(...args: any[]) {
                if (args.length === 0) {

                } else if (args.length === 3) {
                    const listWrapper: ArrayList<T> = args[0];
                    let startIndex: int = args[1];
                    const count: int = args[2];

                    let int32: int;
                    this._en = listWrapper.GetEnumerator();
                    this._initialStartIndex = startIndex;
                    this._initialCount = count;
                    do {
                        int32 = startIndex;
                        startIndex = int32 - 1;
                    }
                    while (int32 > 0 && this._en.MoveNext());
                    this._remaining = count;
                    this._firstCall = true;
                }
            }

            public Clone(): IListWrapperEnumWrapper<T> {
                const listWrapperEnumWrapper: IListWrapperEnumWrapper<T> = new ArrayList.IListWrapper.IListWrapperEnumWrapper();
                listWrapperEnumWrapper._en = (this._en as any).clone(),
                    listWrapperEnumWrapper._initialStartIndex = this._initialStartIndex,
                    listWrapperEnumWrapper._initialCount = this._initialCount,
                    listWrapperEnumWrapper._remaining = this._remaining,
                    listWrapperEnumWrapper._firstCall = this._firstCall
                return listWrapperEnumWrapper as any;
            }

            public MoveNext(): boolean {
                let int32: int;
                if (!this._firstCall) {
                    if (this._remaining < 0) {
                        return false;
                    }
                    if (!this._en.MoveNext()) {
                        return false;
                    }
                    int32 = this._remaining;
                    this._remaining = int32 - 1;
                    return int32 > 0;
                }
                this._firstCall = false;
                int32 = this._remaining;
                this._remaining = int32 - 1;
                if (int32 <= 0) {
                    return false;
                }
                return this._en.MoveNext();
            }

            public Reset(): void {
                let int32: int;
                this._en.Reset();
                let int321: int = this._initialStartIndex;
                do {
                    int32 = int321;
                    int321 = int32 - 1;
                }
                while (int32 > 0 && this._en.MoveNext());
                this._remaining = this._initialCount;
                this._firstCall = true;
            }
        }
    }

}

export class Range<T> extends ArrayList<T> {
    private _baseList: ArrayList<T> = undefined as any;
    private _baseIndex: int = 0;
    private _baseSize: int = 0;
    private _baseVersion: int = 0;
    public /* override */  GetCapacity(): int {
        return this._baseList.Capacity;
    }
    public SetCapacity(value: int) {
        if (value < this.Count) {
            throw new ArgumentOutOfRangeException("value", Environment.GetResourceString("ArgumentOutOfRange_SmallCapacity"));
        }
    }

    public /* override */ Get_Count(): int {
        this.internalUpdateRange();
        return this._baseSize;
    }

    public /* override */  Get_IsFixedSize(): boolean {
        return this._baseList.IsFixedSize;
    }

    public /* override */  Get_IsReadOnly(): boolean {
        return this._baseList.IsReadOnly;
    }



    public /* override */ Get(index: int): T {
        this.internalUpdateRange();
        if (index < 0 || index >= this._baseSize) {
            throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_Index"));
        }
        return this._baseList.Get(this._baseIndex + index);
    }
    public Set(index: int, value: T): boolean {
        this.internalUpdateRange();
        if (index < 0 || index >= this._baseSize) {
            throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_Index"));
        }
        this._baseList.Set(this._baseIndex + index, value);
        this.internalUpdateVersion();
        return true;
    }

    public constructor(list: ArrayList<T>, index: int, count: int) {
        super(false);
        this._baseList = list;
        this._baseIndex = index;
        this._baseSize = count;
        this._baseVersion = (list as any)._version;
        (this as any)._version = (list as any)._version;
    }

    public /* override */  Add(value: T): int {
        this.internalUpdateRange();
        this._baseList.Insert(this._baseIndex + this._baseSize, value);
        this.internalUpdateVersion();
        const int32: int = this._baseSize;
        this._baseSize = int32 + 1;
        return int32;
    }

    public /* override */  AddRange(c: ICollection<T>): void {
        if (c == null) {
            throw new ArgumentNullException("c");
        }
        this.internalUpdateRange();
        const count: int = c.Count;
        if (count > 0) {
            this._baseList.InsertRange(this._baseIndex + this._baseSize, c);
            this.internalUpdateVersion();
            this._baseSize += count;
        }
    }


    /*  public override int BinarySearch(int index, int count, object value, IComparer comparer) {
         if (index < 0 || count < 0) {
             throw new ArgumentOutOfRangeException((index < 0 ? "index" : "count"), Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
         }
         if (this._baseSize - index < count) {
             throw new ArgumentException(Environment.GetResourceString("Argument_InvalidOffLen"));
         }
         this.InternalUpdateRange();
         int int32 = this._baseList.BinarySearch(this._baseIndex + index, count, value, comparer);
         if (int32 >= 0) {
             return int32 - this._baseIndex;
         }
         return int32 + this._baseIndex;
     } */

    public /* override */  Clear(): number {
        this.internalUpdateRange();
        if (this._baseSize !== 0) {
            this._baseList.RemoveRange(this._baseIndex, this._baseSize);
            this.internalUpdateVersion();
            this._baseSize = 0;
        }
        return 0;
    }

    public /* override */ Clone(): Range<T> {
        this.internalUpdateRange();
        const range: Range<T> = new Range(this._baseList, this._baseIndex, this._baseSize)

        range._baseList = this._baseList.Clone()
        return range;
    }

    public /* override */ Contains(item: T): boolean {
        this.internalUpdateRange();
        if (item == null) {
            for (let i = 0; i < this._baseSize; i++) {
                if (this._baseList.Get(this._baseIndex + i) == null) {
                    return true;
                }
            }
            return false;
        }
        for (let j = 0; j < this._baseSize; j++) {
            const o: T = this._baseList.Get(this._baseIndex + j);
            if (o != null) {
                if (is.typeof<IEquatable<T>>(o, System.Types.IEquatable) && (o as any).equals(item)) {
                    return true;
                } else if (o === item) {
                    return true;
                }
            }
        }
        return false;
    }

    public /* virtual */ CopyTo(array: Array<T>): Array<T>;
    public /* virtual */ CopyTo(array: Array<T>, arrayIndex: int): Array<T>;
    public /* virtual */ CopyTo(index: int, array: Array<T>, arrayIndex: int, count: int): Array<T>;
    public CopyTo(...args: any[]): Array<T> {
        if (args.length === 1 && is.array(args[0])) {
            const array: Array<T> = args[0];
            return super.CopyTo(array);

        } else if (args.length === 2 && is.array(args[0]) && is.int(args[1])) {
            const array: Array<T> = args[0];
            const index: int = args[1];

            if (array == null) {
                throw new ArgumentNullException("array");
            }

            if (index < 0) {
                throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
            }
            if (array.length - index < this._baseSize) {
                throw new ArgumentException(Environment.GetResourceString("Argument_InvalidOffLen"));
            }
            this.internalUpdateRange();
            this._baseList.CopyTo(this._baseIndex, array, index, this._baseSize);

        } else if (args.length === 4) {
            const index: int = args[0];
            const array: Array<T> = args[1];
            const arrayIndex: int = args[2];
            const count: int = args[3];

            if (array == null) {
                throw new ArgumentNullException("array");
            }

            if (index < 0 || count < 0) {
                throw new ArgumentOutOfRangeException((index < 0 ? "index" : "count"), Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
            }
            if (array.length - arrayIndex < count) {
                throw new ArgumentException(Environment.GetResourceString("Argument_InvalidOffLen"));
            }
            if (this._baseSize - index < count) {
                throw new ArgumentException(Environment.GetResourceString("Argument_InvalidOffLen"));
            }
            this.internalUpdateRange();
            this._baseList.CopyTo(this._baseIndex + index, array, arrayIndex, count);

        }
        return undefined as any
    }


    public /* virtual */  GetEnumerator(): IEnumerator<T>;
    public /* virtual */ GetEnumerator(index: int, count: int): IEnumerator<T>;
    public /* virtual */  GetEnumerator(...args: any[]): IEnumerator<T> {
        if (args.length === 0) {

            return this.GetEnumerator(0, this._baseSize);
        } else if (args.length === 2 && is.int(args[0]) && is.int(args[1])) {
            const index: int = args[0];
            const count: int = args[1];

            if (index < 0 || count < 0) {
                throw new ArgumentOutOfRangeException((index < 0 ? "index" : "count"), Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
            }
            if (this._baseSize - index < count) {
                throw new ArgumentException(Environment.GetResourceString("Argument_InvalidOffLen"));
            }
            this.internalUpdateRange();
            return this._baseList.GetEnumerator(this._baseIndex + index, count);

        }

        return undefined as any;
    }

    public /* override */  GetRange(index: int, count: int): ArrayList<T> {
        if (index < 0 || count < 0) {
            throw new ArgumentOutOfRangeException((index < 0 ? "index" : "count"), Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
        }
        if (this._baseSize - index < count) {
            throw new ArgumentException(Environment.GetResourceString("Argument_InvalidOffLen"));
        }
        this.internalUpdateRange();
        return new Range(this, index, count);
    }

    public /* virtual */ IndexOf(value: T): int;
    public /* virtual */  IndexOf(value: T, startIndex: int): int;
    public /* virtual */  IndexOf(value: T, startIndex: int, count: int): int;
    public /* virtual */  IndexOf(...args: any[]): int {
        if (args.length === 1) {
            const value: T = args[0];

            this.internalUpdateRange();
            const int32: int = this._baseList.IndexOf(value, this._baseIndex, this._baseSize);
            if (int32 < 0) {
                return -1;
            }
            return int32 - this._baseIndex;
        } else if (args.length === 2 && is.int(args[1])) {
            const value: T = args[0];
            const startIndex: int = args[1];

            if (startIndex < 0) {
                throw new ArgumentOutOfRangeException("startIndex", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
            }
            if (startIndex > this._baseSize) {
                throw new ArgumentOutOfRangeException("startIndex", Environment.GetResourceString("ArgumentOutOfRange_Index"));
            }
            this.internalUpdateRange();
            const int32: int = this._baseList.IndexOf(value, this._baseIndex + startIndex, this._baseSize - startIndex);
            if (int32 < 0) {
                return -1;
            }
            return int32 - this._baseIndex;

        } else if (args.length === 3 && is.int(args[1]) && is.int(args[2])) {
            const value: T = args[0];
            const startIndex: int = args[1];
            const count: int = args[2];

            if (startIndex < 0 || startIndex > this._baseSize) {
                throw new ArgumentOutOfRangeException("startIndex", Environment.GetResourceString("ArgumentOutOfRange_Index"));
            }
            if (count < 0 || startIndex > this._baseSize - count) {
                throw new ArgumentOutOfRangeException("count", Environment.GetResourceString("ArgumentOutOfRange_Count"));
            }
            this.internalUpdateRange();
            const int32: int = this._baseList.IndexOf(value, this._baseIndex + startIndex, count);
            if (int32 < 0) {
                return -1;
            }
            return int32 - this._baseIndex;
        }
        return undefined as any;
    }

    public /* override */  Insert(index: int, value: T): void {
        if (index < 0 || index > this._baseSize) {
            throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_Index"));
        }
        this.internalUpdateRange();
        this._baseList.Insert(this._baseIndex + index, value);
        this.internalUpdateVersion();
        this._baseSize++;
    }

    public /* virtual */  InsertRange(index: int, c: ICollection<T>): void;
    public /* virtual */  InsertRange(index: int, c: Array<T>): void;
    public /* virtual */  InsertRange(...args: any[]): void {
        if (args.length === 2 && is.int(args[0]) && is.typeof<ICollection<T>>(args[1], System.Types.Collections.Generics.ICollection)) {
            const index: int = args[0];
            const c: ICollection<T> = args[1];
            if (index < 0 || index > this._baseSize) {
                throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_Index"));
            }
            if (c == null) {
                throw new ArgumentNullException("c");
            }
            this.internalUpdateRange();
            const count: int = c.Count;
            if (count > 0) {
                this._baseList.InsertRange(this._baseIndex + index, c);
                this._baseSize += count;
                this.internalUpdateVersion();
            }
        }
    }

    private internalUpdateRange(): void {
        if (this._baseVersion !== (this._baseList as any)._version) {
            throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_UnderlyingArrayListChanged"));
        }
    }

    private internalUpdateVersion(): void {
        this._baseVersion++;
        (this as any)._version++;
    }

    public /* virtual */  LastIndexOf(value: T): int;
    public /* virtual */  LastIndexOf(value: T, startIndex: int): int;
    public /* virtual */  LastIndexOf(value: T, startIndex: int, count: int): int;
    public /* virtual */  LastIndexOf(...args: any[]): int {
        if (args.length === 1) {
            const value: T = args[0];

            this.internalUpdateRange();
            const int32: int = this._baseList.LastIndexOf(value, this._baseIndex + this._baseSize - 1, this._baseSize);
            if (int32 < 0) {
                return -1;
            }
            return int32 - this._baseIndex;

        } else if (args.length === 2 && is.int(args[1])) {
            const value: T = args[0];
            const startIndex: int = args[1];

            return this.LastIndexOf(value, startIndex, startIndex + 1);

        } else if (args.length === 3 && is.int(args[1]) && is.int(args[2])) {
            const value: T = args[0];
            const startIndex: int = args[1];
            const count: int = args[2];

            this.internalUpdateRange();
            if (this._baseSize === 0) {
                return -1;
            }
            if (startIndex >= this._baseSize) {
                throw new ArgumentOutOfRangeException("startIndex", Environment.GetResourceString("ArgumentOutOfRange_Index"));
            }
            if (startIndex < 0) {
                throw new ArgumentOutOfRangeException("startIndex", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
            }
            const int32: int = this._baseList.LastIndexOf(value, this._baseIndex + startIndex, count);
            if (int32 < 0) {
                return -1;
            }
            return int32 - this._baseIndex;
        }
        return undefined as any;
    }



    public /* override */  RemoveAt(index: int): boolean {
        if (index < 0 || index >= this._baseSize) {
            throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_Index"));
        }
        this.internalUpdateRange();
        this._baseList.RemoveAt(this._baseIndex + index);
        this.internalUpdateVersion();
        this._baseSize--;
        return true;
    }

    public /* override */  RemoveRange(index: int, count: int): void {
        if (index < 0 || count < 0) {
            throw new ArgumentOutOfRangeException((index < 0 ? "index" : "count"), Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
        }
        if (this._baseSize - index < count) {
            throw new ArgumentException(Environment.GetResourceString("Argument_InvalidOffLen"));
        }
        this.internalUpdateRange();
        if (count > 0) {
            this._baseList.RemoveRange(this._baseIndex + index, count);
            this.internalUpdateVersion();
            this._baseSize -= count;
        }
    }

    public /* virtual */  Reverse(): void;
    public /* virtual */  Reverse(index: int, count: int): void;
    public /* virtual */  Reverse(...args: any[]): void {
        if (args.length === 0) {
            super.Reverse();
        } else if (args.length === 2 && is.int(args[0]) && is.int(args[1])) {
            const index: int = args[0];
            const count: int = args[1];

            if (index < 0 || count < 0) {
                throw new ArgumentOutOfRangeException((index < 0 ? "index" : "count"), Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
            }
            if (this._baseSize - index < count) {
                throw new ArgumentException(Environment.GetResourceString("Argument_InvalidOffLen"));
            }
            this.internalUpdateRange();
            this._baseList.Reverse(this._baseIndex + index, count);
            this.internalUpdateVersion();

        }

    }



    public /* override */  SetRange(index: int, c: ICollection<T>): void {
        this.internalUpdateRange();
        if (index < 0 || index >= this._baseSize) {
            throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_Index"));
        }
        this._baseList.SetRange(this._baseIndex + index, c);
        if (c.Count > 0) {
            this.internalUpdateVersion();
        }
    }

    public /* virtual */  Sort(): void;
    public /* virtual */  Sort(comparer: IComparer<T>): void;
    public /* virtual */  Sort(index: int, count: int, comparer: IComparer<T>): void;
    public /* virtual */  Sort(...args: any[]): void {
        if (args.length === 0) {
            super.Sort();
        } else if (args.length === 1 && is.typeof<IComparer<T>>(args[0], System.Types.IComparer)) {
            const comparer: IComparer<T> = args[0];
            super.Sort(comparer);
        } else if (args.length === 3 && is.int(args[0]) && is.int(args[1]) && is.typeof<IComparer<T>>(args[2], System.Types.IComparer)) {
            const index: int = args[0];
            const count: int = args[1];
            const comparer: IComparer<T> = args[2];

            if (index < 0 || count < 0) {
                throw new ArgumentOutOfRangeException((index < 0 ? "index" : "count"), Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
            }
            if (this._baseSize - index < count) {
                throw new ArgumentException(Environment.GetResourceString("Argument_InvalidOffLen"));
            }
            this.internalUpdateRange();
            this._baseList.Sort(this._baseIndex + index, count, comparer);
            this.internalUpdateVersion();

        }
    }

    public /* override */ ToArray(): Array<T> {
        this.internalUpdateRange();
        const objArray: Array<T> = new Array[this._baseSize];
        TArray.Copy((this._baseList as any)._items, this._baseIndex, objArray, 0, this._baseSize);
        return objArray;
    }
}
export class ReadOnlyArrayList<T> extends ArrayList<T> {
    private _list: ArrayList<T> = undefined as any;

    public /* override */  GetCapacity(): int {
        return this._list.Capacity;
    }
    public SetCapacity(value: int) {
        throw new NotSupportedException(Environment.GetResourceString("NotSupported_ReadOnlyCollection"));
    }

    public /* override */  Get_Count(): int {
        return this._list.Count;
    }

    public /* override */  Get_IsFixedSize(): boolean {
        return true;
    }

    public /* override */  Get_IsReadOnly(): boolean {
        return true;
    }

    public /* override */ Get(index: int): T {
        return this._list[index];
    }
    public Set(index: int, value: T): boolean {
        throw new NotSupportedException(Environment.GetResourceString("NotSupported_ReadOnlyCollection"));
    }

    public constructor(l: ArrayList<T>) {
        super();
        this._list = l;
    }

    public /* override */  Add(obj: T): int {
        throw new NotSupportedException(Environment.GetResourceString("NotSupported_ReadOnlyCollection"));
    }

    public /* override */  AddRange(c: ICollection<T>): void {
        throw new NotSupportedException(Environment.GetResourceString("NotSupported_ReadOnlyCollection"));
    }

    /*   public override int BinarySearch(int index, int count, object value, IComparer comparer) {
          return this._list.BinarySearch(index, count, value, comparer);
      } */

    public /* override */  Clear(): number {
        throw new NotSupportedException(Environment.GetResourceString("NotSupported_ReadOnlyCollection"));
    }

    public /* override */  Clone(): ReadOnlyArrayList<T> {
        const readOnlyArrayList: ReadOnlyArrayList<T> = new ReadOnlyArrayList(this._list)
        readOnlyArrayList._list = this._list.Clone()
        return readOnlyArrayList;
    }

    public /* override */  Contains(obj: T): boolean {
        return this._list.Contains(obj);
    }

    public /* virtual */ CopyTo(array: Array<T>): Array<T>;
    public /* virtual */ CopyTo(array: Array<T>, arrayIndex: int): Array<T>;
    public /* virtual */ CopyTo(index: int, array: Array<T>, arrayIndex: int, count: int): Array<T>;
    public CopyTo(...args: any[]): Array<T> {
        if (args.length === 1 && is.array(args[0])) {
            const array: Array<T> = args[0];
            return super.CopyTo(array, 0);
        } else if (args.length === 2 && is.array(args[0]) && is.int(args[1])) {
            const array: Array<T> = args[0];
            const index: int = args[1];
            return this._list.CopyTo(array, index);
        } else if (args.length === 4) {
            const index: int = args[0];
            const array: Array<T> = args[1];
            const arrayIndex: int = args[2];
            const count: int = args[3];
            return this._list.CopyTo(index, array, arrayIndex, count);
        }
        return undefined as any
    }

    public /* virtual */  GetEnumerator(): IEnumerator<T>;
    public /* virtual */ GetEnumerator(index: int, count: int): IEnumerator<T>;
    public /* virtual */  GetEnumerator(...args: any[]): IEnumerator<T> {
        if (args.length === 0) {
            return this._list.GetEnumerator();
        } else if (args.length === 2 && is.int(args[0]) && is.int(args[1])) {
            const index: int = args[0];
            const count: int = args[1];
            return this._list.GetEnumerator(index, count);
        }
        return undefined as any;
    }



    public /* override */  GetRange(index: int, count: int): ArrayList<T> {
        if (index < 0 || count < 0) {
            throw new ArgumentOutOfRangeException((index < 0 ? "index" : "count"), Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
        }
        if (this.Count - index < count) {
            throw new ArgumentException(Environment.GetResourceString("Argument_InvalidOffLen"));
        }
        return new Range(this, index, count);
    }

    public /* virtual */ IndexOf(value: T): int;
    public /* virtual */  IndexOf(value: T, startIndex: int): int;
    public /* virtual */  IndexOf(value: T, startIndex: int, count: int): int;
    public /* virtual */  IndexOf(...args: any[]): int {
        if (args.length === 1) {
            const value: T = args[0];
            return this._list.IndexOf(value);
        } else if (args.length === 2 && is.int(args[1])) {
            const value: T = args[0];
            const startIndex: int = args[1];
            return this._list.IndexOf(value, startIndex);
        } else if (args.length === 3 && is.int(args[1]) && is.int(args[2])) {
            const value: T = args[0];
            const startIndex: int = args[1];
            const count: int = args[2];
            return this._list.IndexOf(value, startIndex, count);
        }
        return undefined as any;
    }


    public /* override */  Insert(index: int, obj: T): void {
        throw new NotSupportedException(Environment.GetResourceString("NotSupported_ReadOnlyCollection"));
    }

    public /* override */  InsertRange(index: int, c: ICollection<T>): void
    public /* override */  InsertRange(index: int, c: Array<T>): void
    public /* override */  InsertRange(...args: any[]): void {
        throw new NotSupportedException(Environment.GetResourceString("NotSupported_ReadOnlyCollection"));
    }

    public /* virtual */  LastIndexOf(value: T): int;
    public /* virtual */  LastIndexOf(value: T, startIndex: int): int;
    public /* virtual */  LastIndexOf(value: T, startIndex: int, count: int): int;
    public /* virtual */  LastIndexOf(...args: any[]): int {
        if (args.length === 1) {
            const value: T = args[0];
            return this._list.LastIndexOf(value);
        } else if (args.length === 2 && is.int(args[1])) {
            const value: T = args[0];
            const startIndex: int = args[1];
            return this._list.LastIndexOf(value, startIndex);
        } else if (args.length === 3 && is.int(args[1]) && is.int(args[2])) {
            const value: T = args[0];
            const startIndex: int = args[1];
            const count: int = args[2];
            return this._list.LastIndexOf(value, startIndex, count);
        }
        return undefined as any;
    }


    public /* override */  Remove(value: T): boolean {
        throw new NotSupportedException(Environment.GetResourceString("NotSupported_ReadOnlyCollection"));
    }

    public /* override */  RemoveAt(index: int): boolean {
        throw new NotSupportedException(Environment.GetResourceString("NotSupported_ReadOnlyCollection"));
    }

    public /* override */  RemoveRange(index: int, count: int): void {
        throw new NotSupportedException(Environment.GetResourceString("NotSupported_ReadOnlyCollection"));
    }

    public /* virtual */  Reverse(): void;
    public /* virtual */  Reverse(index: int, count: int): void;
    public /* virtual */  Reverse(...args: any[]): void {
        throw new NotSupportedException(Environment.GetResourceString("NotSupported_ReadOnlyCollection"));


    }


    public /* override */  SetRange(index: int, c: ICollection<T>): void {
        throw new NotSupportedException(Environment.GetResourceString("NotSupported_ReadOnlyCollection"));
    }

    public /* virtual */  Sort(): void;
    public /* virtual */  Sort(comparer: IComparer<T>): void;
    public /* virtual */  Sort(index: int, count: int, comparer: IComparer<T>): void;
    public /* virtual */  Sort(...args: any[]): void {
        throw new NotSupportedException(Environment.GetResourceString("NotSupported_ReadOnlyCollection"));
    }
    public /* override */  ToArray(): T[] {
        return this._list.ToArray();
    }
}

export class ReadOnlyList<T> implements IList<T>, ICollection<T>, IEnumerable<T>
{
    private _list: IList<T> = undefined as any;

    public get Count(): int {
        return this._list.Count;
    }

    public get IsFixedSize(): boolean {
        return true;
    }

    public get IsReadOnly(): boolean {
        return true;
    }
    public Get(index: int): T {

        return (this._list as any).get(index);
    }
    public Set(index: int, value: T): boolean {
        throw new NotSupportedException(Environment.GetResourceString("NotSupported_ReadOnlyCollection"));
    }

    public constructor(l: IList<T>) {
        this._list = l;
    }

    public /* virtual */  Add(obj: T): int {
        throw new NotSupportedException(Environment.GetResourceString("NotSupported_ReadOnlyCollection"));
    }

    public /* virtual */  Clear(): number {
        throw new NotSupportedException(Environment.GetResourceString("NotSupported_ReadOnlyCollection"));
    }

    public /* virtual */  Contains(obj: T): boolean {
        return (this._list as any).Contains(obj);
    }

    public /* virtual */  CopyTo(array: Array<T>, index: int): Array<T> {
        this._list.CopyTo(array, index);
        return array;
    }

    public /* virtual */  GetEnumerator(): IEnumerator<T> {
        return this._list.GetEnumerator();
    }

    public /* virtual */  IndexOf(value: T): int {
        return (this._list as any).indexOf(value);
    }

    public /* virtual */  Insert(index: int, obj: T): void {
        throw new NotSupportedException(Environment.GetResourceString("NotSupported_ReadOnlyCollection"));
    }

    public /* virtual */  Remove(value: T): boolean {
        throw new NotSupportedException(Environment.GetResourceString("NotSupported_ReadOnlyCollection"));
    }

    public /* virtual */  RemoveAt(index: int): boolean {
        throw new NotSupportedException(Environment.GetResourceString("NotSupported_ReadOnlyCollection"));
    }
}
@ClassInfo({
    fullName: System.Types.Collections.ArrayList.ArrayListEnumeratorSimple,
    instanceof: [
        System.Types.Collections.ArrayList.ArrayListEnumeratorSimple,
        System.Types.Collections.Enumeration.IEnumerator,
        System.Types.Collections.Enumeration.IIterator,
        System.Types.Disposable.IDisposable
    ]
})
export class ArrayListEnumeratorSimple<T> implements IEnumerator<T>, ICloneable<T>
{
    private list: ArrayList<T> = undefined as any;
    private index: int = 0;
    private version: int = 0;
    private currentElement: T = undefined as any;
    private isArrayList: boolean = false;
    private static dummyObject: any;

    public get Current(): T {
        const obj: T = this.currentElement;
        if (ArrayListEnumeratorSimple.dummyObject === obj) {
            if (this.index !== -1) {
                throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_EnumEnded"));
            }
            throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_EnumNotStarted"));
        }
        return obj;
    }


    public static staticConstructor() {
        ArrayListEnumeratorSimple.dummyObject = {};
    }

    public constructor(list: ArrayList<T>) {
        this.list = list;
        this.index = -1;
        this.version = (list as any)._version;
        this.isArrayList = is.typeof(list, System.Types.Collections.ArrayList.ArrayList);
        this.currentElement = ArrayListEnumeratorSimple.dummyObject;
    }

    public Clone(): T {
        throw new NotImplementedException('ArrayListEnumerator::clone');
    }

    public MoveNext(): boolean {
        let int32: int;
        if (this.version !== (this.list as any)._version) {
            throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_EnumFailedVersion"));
        }
        if (!this.isArrayList) {
            if (this.index >= this.list.Count - 1) {
                this.index = this.list.Count;
                this.currentElement = ArrayListEnumeratorSimple.dummyObject;
                return false;
            }
            int32 = this.index + 1;
            this.index = int32;
            this.currentElement = this.list.Get(int32);
            return true;
        }
        if (this.index >= (this.list as any)._size - 1) {
            this.currentElement = ArrayListEnumeratorSimple.dummyObject;
            this.index = (this.list as any)._size;
            return false;
        }
        int32 = this.index + 1;
        this.index = int32;
        this.currentElement = (this.list as any)._items[int32];
        return true;
    }

    public Reset(): void {
        if (this.version !== (this.list as any)._version) {
            throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_EnumFailedVersion"));
        }
        this.currentElement = ArrayListEnumeratorSimple.dummyObject;
        this.index = -1;
    }
    public CanMoveNext?: boolean | undefined;
    public TryMoveNext(out: (value: T) => void): boolean {
        throw new Error("Method not implemented.");
    }
    public End(): void {
        throw new Error("Method not implemented.");
    }
    public NextValue(value?: any): T | undefined {
        throw new Error("Method not implemented.");
    }
    public IsEndless?: boolean | undefined;
    public Next(value?: any): IIteratorResult<T> {
        throw new Error("Method not implemented.");
    }
    public Dispose(): void {
        throw new Error("Method not implemented.");
    }
}

//__ssextends(ArrayProxy, getProxy());
//__ssextends(ArrayProxy.prototype, ArrayList.prototype);

ArrayListEnumeratorSimple.staticConstructor();

