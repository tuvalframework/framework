import { Converter } from '../../Converter';
import { IReadOnlyCollection } from './IReadOnlyCollection';
import { ThrowHelper } from '../../ThrowHelper';
import { IList } from "./IList";
import { IEnumerable } from "../enumeration_/IEnumerable";
import { IReadOnlyList } from "./IReadOnlyList";
import { int } from '../../float';
import { ExceptionArgument } from '../../ExceptionArgument';
import { ExceptionResource } from '../../ExceptionResource';
import { TArray } from '../../Extensions/TArray';
import { is } from '../../is';
import { System } from '../../SystemTypes';
import { as } from '../../as';
import { foreach } from '../../foreach';
import { EqualityComparer } from './EqualityComparer';
import { Predicate, Action } from '../../FunctionTypes';
import { ICollection } from './ICollection';
import { IEnumerator } from '../enumeration_/IEnumerator';
import { IDisposable } from '../../Disposable/IDisposable';
import { ClassInfo, Override } from '../../Reflection/Decorators/ClassInfo';
import { TObject } from '../../Extensions/TObject';
import { Type } from '../../Reflection';
import { TString } from '../../Text/TString';
import { IComparer } from '../IComparer';

function createProxy<T>(thisarg) {
    return new Proxy(thisarg, {
        get: (target, property) => {
            if (!isNaN(property as any)) {
                const _target: List<T> = target;
                if ((_target as any).getInternal) {
                    return (_target as any).getInternal(property as any);
                }

            }
            return target[property];
        },
        set: (target, property, value, receiver) => {
            if (!isNaN(property as any)) {
                console.log('set çalıştı');
                const _target: any = target;
                if (_target.setInternal) {
                    if ((property as any) < 0 || (property as any) >= _target.getCount()) {
                        _target.addInternal(value);
                    } else {
                        try {
                            _target.setInternal(property, value);
                        } catch (e) {
                            const a = '';
                        }
                    }
                }
                return true;
            }
            target[property] = value;
            // you have to return true to accept the changes
            return true;
        }
    });
}
@ClassInfo({
    fullName: System.Types.Collections.Generics.List,
    instanceof: [
        System.Types.Collections.Generics.List,
        System.Types.Collections.Generics.IList,
        System.Types.Collections.Generics.ICollection,
        System.Types.Collections.Enumeration.IEnumerable
    ]
})
export class List<T> extends TObject implements IList<T>, ICollection<T>, IEnumerable<T>, IReadOnlyList<T>, IReadOnlyCollection<T>{
    [key: number]: T;
    protected dispose(disposing: boolean): void {
        throw new Error('Method not implemented.');
    }

    private static readonly _defaultCapacity: int = 4;
    private _items: T[] = [];
    private _size: int = 0;
    private _version: int = 0;
    private static readonly _emptyArray: any[] = [];
    public get Capacity(): int {
        return this._items.length;
    }

    public set Capacity(value: int) {
        if (value < this._size) {
            ThrowHelper.ThrowArgumentOutOfRangeException(ExceptionArgument.value, ExceptionResource.ArgumentOutOfRange_SmallCapacity);
        }
        if (value !== this._items.length) {
            if (value > 0) {
                const tArray: T[] = new Array(value);
                if (this._size > 0) {
                    TArray.Copy(this._items, 0, tArray, 0, this._size);
                }
                this._items = tArray;
                return;
            }
            this._items = List._emptyArray;
        }
    }

    public get Count(): int {
        return this._size;
    }

    private getInternal(index: int): T {
        return this.Get(index);
    }
    public Get(index: int): T {
        if (index >= this._size) {
            ThrowHelper.ThrowArgumentOutOfRangeException();
        }
        return this._items[index];
    }

    private setInternal(index: int, value: T): void {
        this.Set(index, value);
    }
    public Set(index: int, value: T): void {
        if (index >= this._size) {
            ThrowHelper.ThrowArgumentOutOfRangeException();
        }
        this._items[index] = value;
        this._version++;
    }

    public get IsReadOnly(): boolean {
        return false;
    }


    public get IsFixedSize(): boolean {
        return false;
    }


    public constructor();
    public constructor(capacity: int);
    public constructor(collection: IEnumerable<T>);
    public constructor(array: Array<T>);
    public constructor(...args: any[]) {
        super();
        if (args.length === 0) {

        } else if (args.length === 1 && is.int(args[0])) {
            const capacity: int = args[0];
            if (capacity < 0) {
                ThrowHelper.ThrowArgumentOutOfRangeException(ExceptionArgument.capacity, ExceptionResource.ArgumentOutOfRange_NeedNonNegNum);
            }
            if (capacity === 0) {
                this._items = List._emptyArray;
                return createProxy(this);
            }
            this._items = new Array(capacity);
        } else if (args.length === 1 && is.typeof<IEnumerable<T>>(args[0], System.Types.Collections.Enumeration.IEnumerable)) {
            const collection: IEnumerable<T> = args[0];
            if (collection == null) {
                ThrowHelper.ThrowArgumentNullException(ExceptionArgument.collection);
            }
            const ts: ICollection<T> = as(collection, System.Types.Collections.ICollection);
            if (ts == null) {
                this._size = 0;
                this._items = List._emptyArray;
                foreach(collection, (t: T) => {
                    this.Add(t);
                });
                return createProxy(this);;
            }
            const count: int = ts.Count;
            if (count === 0) {
                this._items = List._emptyArray;
                return createProxy(this);
            }
            this._items = new Array(count);
            ts.CopyTo(this._items, 0);
            this._size = count;
        } else if (args.length === 1 && is.array(args[0])) {
            const array: Array<T> = args[0];
            this._size = 0;
            this._items = List._emptyArray;
            foreach(array, (t: T) => {
                this.Add(t);
            });
            return createProxy(this);;
        }

        return createProxy(this);
    }
    private addInternal(item: T): number {
        return this.Add(item);
    }
    public Add(item: T): number {
        if (this._size === this._items.length) {
            this.ensureCapacity(this._size + 1);
        }
        const tArray: T[] = this._items;
        const int32: int = this._size;
        this._size = int32 + 1;
        tArray[int32] = item;
        this._version++;
        return 0;
    }

    public AddRange(collection: IEnumerable<T> | Array<T>): void {
        this.InsertRange(this._size, collection);
    }


    /*     public asReadOnly(): ReadOnlyCollection<T> {
            return new ReadOnlyCollection<T>(this);
        } */


    public BinarySearch(index: int, count: int, item: T, comparer: IComparer<T>): int {
        if (index < 0) {
            ThrowHelper.ThrowArgumentOutOfRangeException(ExceptionArgument.index, ExceptionResource.ArgumentOutOfRange_NeedNonNegNum);
        }
        if (count < 0) {
            ThrowHelper.ThrowArgumentOutOfRangeException(ExceptionArgument.count, ExceptionResource.ArgumentOutOfRange_NeedNonNegNum);
        }
        if (this._size - index < count) {
            ThrowHelper.ThrowArgumentException(ExceptionResource.Argument_InvalidOffLen);
        }
        return TArray.BinarySearch<T>(this._items, index, count, item, comparer);
    }

    /*
     public int BinarySearch(T item) {
         return this.BinarySearch(0, this.Count, item, null);
     }


     public int BinarySearch(T item, IComparer <T > comparer)
 {
     return this.BinarySearch(0, this.Count, item, comparer);
 }
  */

    public Clear(): number {
        if (this._size > 0) {
            TArray.Clear(this._items, 0, this._size);
            this._size = 0;
        }
        this._version++;
        return 0;
    }


    public Contains(item: T): boolean {
        if (item == null) {
            for (let i: int = 0; i < this._size; i++) {
                if (this._items[i] == null) {
                    return true;
                }
            }
            return false;
        }
        const _default: EqualityComparer<T> = EqualityComparer.Default;
        for (let j: int = 0; j < this._size; j++) {
            if (_default.Equals(this._items[j], item)) {
                return true;
            }
        }
        return false;
    }


    public ConvertAll<TOutput>(converter: Converter<T, TOutput>): List<TOutput> {
        if (converter == null) {
            ThrowHelper.ThrowArgumentNullException(ExceptionArgument.converter);
        }
        const tOutputs: List<TOutput> = new List<TOutput>(this._size);
        for (let i: int = 0; i < this._size; i++) {
            tOutputs._items[i] = converter(this._items[i]);
        }
        tOutputs._size = this._size;
        return tOutputs;
    }


    public CopyTo(array: T[]): T[];
    public CopyTo(index: int, array: T[], arrayIndex: int, count: int): T[];
    public CopyTo(array: T[], arrayIndex: int): T[];
    public CopyTo(...args: any[]): T[] {
        if (args.length === 1 && is.array(args[0])) {
            const array: T[] = args[0];
            return this.CopyTo(array, 0);
        } else if (args.length === 4 && is.int(args[0]) && is.array(args[1]) && is.int(args[2]) && is.int(args[3])) {
            const index: int = args[0];
            const array: T[] = args[1];
            const arrayIndex: int = args[2];
            const count: int = args[3];
            if (this._size - index < count) {
                ThrowHelper.ThrowArgumentException(ExceptionResource.Argument_InvalidOffLen);
            }
            TArray.Copy(this._items, index, array, arrayIndex, count);
            return array;
        } else if (args.length === 2 && is.array(args[0]) && is.int(args[1])) {
            const array: T[] = args[0];
            const arrayIndex: int = args[1];
            TArray.Copy(this._items, 0, array, arrayIndex, this._size);
            return array;
        }
        return undefined as any;
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


    public Exists(match: Predicate<T>): boolean {
        return this.FindIndex(match) !== -1;
    }


    public Find(match: Predicate<T>): T {
        if (match == null) {
            ThrowHelper.ThrowArgumentNullException(ExceptionArgument.match);
        }
        for (let i = 0; i < this._size; i++) {
            if (match(this._items[i])) {
                return this._items[i];
            }
        }
        return undefined as any;
    }


    public FindAll(match: Predicate<T>): List<T> {
        if (match == null) {
            ThrowHelper.ThrowArgumentNullException(ExceptionArgument.match);
        }
        const ts: List<T> = new List<T>();
        for (let i = 0; i < this._size; i++) {
            if (match(this._items[i])) {
                ts.Add(this._items[i]);
            }
        }
        return ts;
    }

    public FindIndex(match: Predicate<T>): int;
    public FindIndex(startIndex: int, match: Predicate<T>): int;
    public FindIndex(startIndex: int, count: int, match: Predicate<T>): int;
    public FindIndex(...args: any[]): int {
        if (args.length === 1 && is.function(args[0])) {
            const match: Predicate<T> = args[0];
            return this.FindIndex(0, this._size, match);
        } else if (args.length === 2 && is.int(args[0]) && is.function(args[1])) {
            const startIndex: int = args[0];
            const match: Predicate<T> = args[1];
            return this.FindIndex(startIndex, this._size - startIndex, match);
        } else if (args.length === 3 && is.int(args[0]) && is.int(args[1]) && is.function(args[2])) {
            const startIndex: int = args[0];
            const count: int = args[1];
            const match: Predicate<T> = args[2];
            if (startIndex > this._size) {
                ThrowHelper.ThrowArgumentOutOfRangeException(ExceptionArgument.startIndex, ExceptionResource.ArgumentOutOfRange_Index);
            }
            if (count < 0 || startIndex > this._size - count) {
                ThrowHelper.ThrowArgumentOutOfRangeException(ExceptionArgument.count, ExceptionResource.ArgumentOutOfRange_Count);
            }
            if (match == null) {
                ThrowHelper.ThrowArgumentNullException(ExceptionArgument.match);
            }
            const int32: int = startIndex + count;
            for (let i = startIndex; i < int32; i++) {
                if (match(this._items[i])) {
                    return i;
                }
            }
            return -1;
        }
        return undefined as any;
    }
    public FindLast(match: Predicate<T>): T {
        if (match == null) {
            ThrowHelper.ThrowArgumentNullException(ExceptionArgument.match);
        }
        for (let i = this._size - 1; i >= 0; i--) {
            if (match(this._items[i])) {
                return this._items[i];
            }
        }
        return undefined as any
    }


    public FindLastIndex(match: Predicate<T>): int;
    public FindLastIndex(startIndex: int, match: Predicate<T>): int;
    public FindLastIndex(startIndex: int, count: int, match: Predicate<T>): int;
    public FindLastIndex(...args: any[]): int {
        if (args.length === 1 && is.function(args[0])) {
            const match: Predicate<T> = args[0];
            return this.FindLastIndex(this._size - 1, this._size, match);
        } else if (args.length === 2 && is.int(args[0]) && is.function(args[1])) {
            const startIndex: int = args[0];
            const match: Predicate<T> = args[1];
            return this.FindLastIndex(startIndex, startIndex + 1, match);
        } else if (args.length === 3 && is.int(args[0]) && is.int(args[1]) && is.function(args[2])) {
            const startIndex: int = args[0];
            const count: int = args[1];
            const match: Predicate<T> = args[2];

            if (match == null) {
                ThrowHelper.ThrowArgumentNullException(ExceptionArgument.match);
            }
            if (this._size === 0) {
                if (startIndex !== -1) {
                    ThrowHelper.ThrowArgumentOutOfRangeException(ExceptionArgument.startIndex, ExceptionResource.ArgumentOutOfRange_Index);
                }
            }
            else if (startIndex >= this._size) {
                ThrowHelper.ThrowArgumentOutOfRangeException(ExceptionArgument.startIndex, ExceptionResource.ArgumentOutOfRange_Index);
            }
            if (count < 0 || startIndex - count + 1 < 0) {
                ThrowHelper.ThrowArgumentOutOfRangeException(ExceptionArgument.count, ExceptionResource.ArgumentOutOfRange_Count);
            }
            const int32: int = startIndex - count;
            for (let i = startIndex; i > int32; i--) {
                if (match(this._items[i])) {
                    return i;
                }
            }
            return -1;
        }
        return undefined as any;
    }

    public ForEach(action: Action<T>): void {
        if (action == null) {
            ThrowHelper.ThrowArgumentNullException(ExceptionArgument.match);
        }
        const int32: int = this._version;
        for (let i = 0; i < this._size && (int32 === this._version); i++) {
            action(this._items[i]);
        }
        if (int32 !== this._version) {
            ThrowHelper.ThrowInvalidOperationException(ExceptionResource.InvalidOperation_EnumFailedVersion);
        }
    }

    public GetEnumerator(): List.Enumerator<T> {
        return new List.Enumerator(this);
    }

    public GetRange(index: int, count: int): List<T> {
        if (index < 0) {
            ThrowHelper.ThrowArgumentOutOfRangeException(ExceptionArgument.index, ExceptionResource.ArgumentOutOfRange_NeedNonNegNum);
        }
        if (count < 0) {
            ThrowHelper.ThrowArgumentOutOfRangeException(ExceptionArgument.count, ExceptionResource.ArgumentOutOfRange_NeedNonNegNum);
        }
        if (this._size - index < count) {
            ThrowHelper.ThrowArgumentException(ExceptionResource.Argument_InvalidOffLen);
        }
        const ts: List<T> = new List<T>(count);
        TArray.Copy(this._items, index, ts._items, 0, count);
        ts._size = count;
        return ts;
    }


    public IndexOf(item: T): int;
    public IndexOf(item: T, index: int): int;
    public IndexOf(item: T, index: int, count: int): int;
    public IndexOf(...args: any[]): int {
        if (args.length === 1) {
            const item: T = args[0];
            return TArray.IndexOf<T>(this._items, item, 0, this._size);
        } else if (args.length === 2 && is.int(args[1])) {
            const item: T = args[0];
            const index: int = args[1];
            if (index > this._size) {
                ThrowHelper.ThrowArgumentOutOfRangeException(ExceptionArgument.index, ExceptionResource.ArgumentOutOfRange_Index);
            }
            return TArray.IndexOf<T>(this._items, item, index, this._size - index);
        } else if (args.length === 3 && is.int(args[1]) && is.int(args[2])) {
            const item: T = args[0];
            const index: int = args[1];
            const count: int = args[2];
            if (index > this._size) {
                ThrowHelper.ThrowArgumentOutOfRangeException(ExceptionArgument.index, ExceptionResource.ArgumentOutOfRange_Index);
            }
            if (count < 0 || index > this._size - count) {
                ThrowHelper.ThrowArgumentOutOfRangeException(ExceptionArgument.count, ExceptionResource.ArgumentOutOfRange_Count);
            }
            return TArray.IndexOf<T>(this._items, item, index, count);
        }
        return undefined as any;
    }

    public Insert(index: int, item: T): void {
        if (index > this._size) {
            ThrowHelper.ThrowArgumentOutOfRangeException(ExceptionArgument.index, ExceptionResource.ArgumentOutOfRange_ListInsert);
        }
        if (this._size === this._items.length) {
            this.ensureCapacity(this._size + 1);
        }
        if (index < this._size) {
            TArray.Copy(this._items, index, this._items, index + 1, this._size - index);
        }
        this._items[index] = item;
        this._size++;
        this._version++;
    }

    public InsertRange(index: int, collection: IEnumerable<T> | Array<T>): void {
        if (collection == null) {
            ThrowHelper.ThrowArgumentNullException(ExceptionArgument.collection);
        }
        if (index > this._size) {
            ThrowHelper.ThrowArgumentOutOfRangeException(ExceptionArgument.index, ExceptionResource.ArgumentOutOfRange_Index);
        }
        const ts: ICollection<T> = as(collection, System.Types.Collections.ICollection);
        if (ts == null) {
            foreach(collection, (t: T) => {
                let int32: int = index;
                index = int32 + 1;
                this.Insert(int32, t);
            });

        }
        else {
            const count: int = ts.Count;
            if (count > 0) {
                this.ensureCapacity(this._size + count);
                if (index < this._size) {
                    TArray.Copy(this._items, index, this._items, index + count, this._size - index);
                }
                if (this !== (ts as any)) {
                    const tArray: T[] = new Array(count);
                    ts.CopyTo(tArray, 0);
                    TArray.Copy(this._items, index, tArray, 0);
                    TArray.Copy(tArray, index, this._items, 0);
                    //tArray.copyTo(this._items, index);
                }
                else {
                    TArray.Copy(this._items, 0, this._items, index, index);
                    TArray.Copy(this._items, index + count, this._items, index * 2, this._size - index);
                }
                this._size += count;
            }
        }
        this._version++;
    }
    public LastIndexOf(item: T): int;
    public LastIndexOf(item: T, index: int): int;
    public LastIndexOf(item: T, index: int, count: int): int;
    public LastIndexOf(...args: any[]): int {
        if (args.length === 1) {
            const item: T = args[0];
            if (this._size === 0) {
                return -1;
            }
            return this.LastIndexOf(item, this._size - 1, this._size);
        } else if (args.length === 2 && is.int(args[1])) {
            const item: T = args[0];
            const index: int = args[1];
            if (index >= this._size) {
                ThrowHelper.ThrowArgumentOutOfRangeException(ExceptionArgument.index, ExceptionResource.ArgumentOutOfRange_Index);
            }
            return this.LastIndexOf(item, index, index + 1);
        } else if (args.length === 3 && is.int(args[1]) && is.int(args[2])) {
            const item: T = args[0];
            const index: int = args[1];
            const count: int = args[2];
            if (this.Count !== 0 && index < 0) {
                ThrowHelper.ThrowArgumentOutOfRangeException(ExceptionArgument.index, ExceptionResource.ArgumentOutOfRange_NeedNonNegNum);
            }
            if (this.Count !== 0 && count < 0) {
                ThrowHelper.ThrowArgumentOutOfRangeException(ExceptionArgument.count, ExceptionResource.ArgumentOutOfRange_NeedNonNegNum);
            }
            if (this._size === 0) {
                return -1;
            }
            if (index >= this._size) {
                ThrowHelper.ThrowArgumentOutOfRangeException(ExceptionArgument.index, ExceptionResource.ArgumentOutOfRange_BiggerThanCollection);
            }
            if (count > index + 1) {
                ThrowHelper.ThrowArgumentOutOfRangeException(ExceptionArgument.count, ExceptionResource.ArgumentOutOfRange_BiggerThanCollection);
            }
            return TArray.LastIndexOf<T>(this._items, item, index, count);
        }
        return undefined as any;
    }

    public Remove(item: T): boolean {
        const int32: int = this.IndexOf(item);
        if (int32 < 0) {
            return false;
        }
        this.RemoveAt(int32);
        return true;
    }

    public RemoveAll(match: Predicate<T>): int {
        if (match == null) {
            ThrowHelper.ThrowArgumentNullException(ExceptionArgument.match);
        }
        let int32: int = 0;
        while (int32 < this._size && !match(this._items[int32])) {
            int32++;
        }
        if (int32 >= this._size) {
            return 0;
        }
        let int321: int = int32 + 1;
        while (int321 < this._size) {
            while (int321 < this._size && match(this._items[int321])) {
                int321++;
            }
            if (int321 >= this._size) {
                continue;
            }
            const tArray: T[] = this._items;
            const int322: int = int32;
            int32 = int322 + 1;
            const int323: int = int321;
            int321 = int323 + 1;
            tArray[int322] = this._items[int323];
        }
        TArray.Clear(this._items, int32, this._size - int32);
        const int324: int = this._size - int32;
        this._size = int32;
        this._version++;
        return int324;

    }


    public RemoveAt(index: int): void {
        if (index >= this._size) {
            ThrowHelper.ThrowArgumentOutOfRangeException();
        }
        this._size--;
        if (index < this._size) {
            TArray.Copy(this._items, index + 1, this._items, index, this._size - index);
        }
        this._items[this._size] = null as any;
        this._version++;
    }


    public RemoveRange(index: int, count: int): void {
        if (index < 0) {
            ThrowHelper.ThrowArgumentOutOfRangeException(ExceptionArgument.index, ExceptionResource.ArgumentOutOfRange_NeedNonNegNum);
        }
        if (count < 0) {
            ThrowHelper.ThrowArgumentOutOfRangeException(ExceptionArgument.count, ExceptionResource.ArgumentOutOfRange_NeedNonNegNum);
        }
        if (this._size - index < count) {
            ThrowHelper.ThrowArgumentException(ExceptionResource.Argument_InvalidOffLen);
        }
        if (count > 0) {
            const int32: int = this._size;
            this._size -= count;
            if (index < this._size) {
                TArray.Copy(this._items, index + count, this._items, index, this._size - index);
            }
            TArray.Clear(this._items, this._size, count);
            this._version++;
        }
    }

    public Reverse(): void;
    public Reverse(index: int, count: int): void;
    public Reverse(...args: any[]): void {
        if (args.length === 0) {
            this.Reverse(0, this.Count);
        } else if (args.length === 2 && is.int(args[0]) && is.int(args[1])) {
            const index: int = args[0];
            const count: int = args[1];
            if (index < 0) {
                ThrowHelper.ThrowArgumentOutOfRangeException(ExceptionArgument.index, ExceptionResource.ArgumentOutOfRange_NeedNonNegNum);
            }
            if (count < 0) {
                ThrowHelper.ThrowArgumentOutOfRangeException(ExceptionArgument.count, ExceptionResource.ArgumentOutOfRange_NeedNonNegNum);
            }
            if (this._size - index < count) {
                ThrowHelper.ThrowArgumentException(ExceptionResource.Argument_InvalidOffLen);
            }
            TArray.Reverse(this._items, index, count);
            this._version++;
        }
    }


    public Sort(): void;
    public Sort(comparer: IComparer<T>): void;
    public Sort(index: int, count: int, comparer: IComparer<T>): void;
    public Sort(...args: any[]): void {
        if (args.length === 0) {
            this.Sort(0, this.Count, null as any);
        } else if (args.length === 1 && is.function(args[0])) {
            const comparer: IComparer<T> = args[0];
            this.Sort(0, this.Count, comparer);
        } else if (args.length === 3 && is.int(args[0]) && is.int(args[1]) && is.function(args[2])) {
            const index: int = args[0];
            const count: int = args[1];
            const comparer: IComparer<T> = args[2];
            if (index < 0) {
                ThrowHelper.ThrowArgumentOutOfRangeException(ExceptionArgument.index, ExceptionResource.ArgumentOutOfRange_NeedNonNegNum);
            }
            if (count < 0) {
                ThrowHelper.ThrowArgumentOutOfRangeException(ExceptionArgument.count, ExceptionResource.ArgumentOutOfRange_NeedNonNegNum);
            }
            if (this._size - index < count) {
                ThrowHelper.ThrowArgumentException(ExceptionResource.Argument_InvalidOffLen);
            }
            TArray.Sort<T>(this._items, index, count, comparer);
            this._version++;
        }
    }

    /*     public void Sort(Comparison <T > comparison)
    {
        if (comparison == null) {
            ThrowHelper.ThrowArgumentNullException(ExceptionArgument.match);
        }
        if (this._size > 0) {
            IComparer < T > functorComparer = new Array.FunctorComparer<T>(comparison);
            Array.Sort<T>(this._items, 0, this._size, functorComparer);
        }
    } */



    public ToArray(type?: Type): T[] {
        const tArray: T[] = new Array(this._size);
        TArray.Copy(this._items, 0, tArray, 0, this._size);
        return tArray;
    }

    public TrimExcess(): void {
        const length: int = this._items.length * 0.9;
        if (this._size < length) {
            this.Capacity = this._size;
        }
    }

    public TrueForAll(match: Predicate<T>): boolean {
        if (match == null) {
            ThrowHelper.ThrowArgumentNullException(ExceptionArgument.match);
        }
        for (let i = 0; i < this._size; i++) {
            if (!match(this._items[i])) {
                return false;
            }
        }
        return true;
    }
    public Where(f: (item: T) => boolean): List<T> {
        const newList = new List<T>();
        for (let i = 0; i < this._items.length; i++) {
            if (is.notNull(this._items[i]) && f(this._items[i])) {
                newList.Add(this._items[i]);
            }
        }
        return newList;
    }
    public Select(f: (item: T, index?: number) => boolean): List<any> {
        const newList = new List<any>();
        for (let i = 0; i < this._items.length; i++) {
            if (is.notNull(this._items[i])) {
                newList.Add(f(this._items[i], i));
            }
        }
        return newList;
    }
    public FirstOrDefault(f: Predicate<T>, _default: T): T {
        for (let i = 0; i < this._items.length; i++) {
            if (is.notNull(this._items[i]) && f(this._items[i])) {
                return this._items[i];
            }
        }
        return _default;
    }
    @Override
    public ToString(): string {
        let result = '';
        foreach(this, (item) => {
            if (item == null) {
                result += 'null';
            } else {
                result += TString.ToString(item) + ',';
            }
        });
        return result.substr(0, result.lastIndexOf(','));
    }
}

export namespace List {
    export class Enumerator<T> implements IEnumerator<T>, IDisposable {
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
        Next(value?: any): import("..").IIteratorResult<T> {
            throw new Error("Method not implemented.");
        }
        private list: List<T> = undefined as any;
        private index: int = 0;;
        private version: int = 0;
        private current: T = undefined as any;
        public get Current(): T {
            return this.current;
        }


        public constructor(list: List<T>) {
            this.list = list;
            this.index = 0;
            this.version = (list as any)._version;
            this.current = null as any;
        }

        /// <summary>Releases all resources used by the <see cref="T:System.Collections.Generic.List`1.Enumerator" />.</summary>
        public Dispose(): void {
        }


        public MoveNext(): boolean {
            const ts: List<T> = this.list;
            if (this.version !== (ts as any)._version || this.index >= (ts as any)._size) {
                return this.moveNextRare();
            }
            this.current = (ts as any)._items[this.index];
            this.index++;
            return true;
        }

        private moveNextRare(): boolean {
            if (this.version !== (this.list as any)._version) {
                ThrowHelper.ThrowInvalidOperationException(ExceptionResource.InvalidOperation_EnumFailedVersion);
            }
            this.index = (this.list as any)._size + 1;
            this.current = null as any;
            return false;
        }


        public Reset(): void {
            if (this.version !== (this.list as any)._version) {
                ThrowHelper.ThrowInvalidOperationException(ExceptionResource.InvalidOperation_EnumFailedVersion);
            }
            this.index = 0;
            this.current = undefined as any;
        }


    }
}