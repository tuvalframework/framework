import { ICloneable } from "../../ICloneable";
import { IEnumerable } from "../enumeration_/IEnumerable";
import { ICollection } from "./ICollection";
import { int } from "../../float";
import { ArgumentOutOfRangeException } from '../../Exceptions/ArgumentOutOfRangeException';
import { Environment } from "../../Environment";
import { TArray } from "../../Extensions/TArray";
import { is } from "../../is";
import { ArgumentNullException } from "../../Exceptions/ArgumentNullException";
import { ArgumentException } from "../../Exceptions/ArgumentException";
import { InvalidOperationException } from "../../Exceptions/InvalidOperationException";
import { IEnumerator } from "../enumeration_/IEnumerator";
import { ClassInfo } from "../../Reflection/Decorators/ClassInfo";
import { System } from "../../SystemTypes";

@ClassInfo({
    fullName: System.Types.Collections.Generics.Stack,
    instanceof: [
        System.Types.Collections.Generics.Stack,
        System.Types.Collections.ICollection,
        System.Types.Collections.Enumeration.IEnumerable,
        System.Types.ICloneable
    ]
})
export class Stack<T> implements ICollection<T>, IEnumerable<T>, ICloneable<Stack<T>>
{
    IsReadOnly: boolean = false;
    Add(item: T): void {
        throw new Error("Method not implemented.");
    }
    Remove(item: T): boolean {
        throw new Error("Method not implemented.");
    }
    IsEndless?: boolean | undefined;
    private _array: T[] = undefined as any;
    private _size: int = 0;
    private _version: int = 0;
    private static readonly _defaultCapacity: int = 10;
    public get Count() {
        return this._size;
    }

    public constructor();
    public constructor(array: T[]);
    public constructor(initialCapacity: int);
    public constructor(...args: any[]) {
        if (args.length === 0) {
            this._array = new Array(10);
            this._size = 0;
            this._version = 0;
        } else if (args.length === 1 && is.array(args[0])) {
            const array: T[] = args[0];

            this._array = new Array(array.length);
            this._size = 0;
            this._version = 0;

            array.forEach(item => this.Push(item));

        } else if (args.length === 1 && is.int(args[0])) {
            let initialCapacity: int = args[0];
            if (initialCapacity < 0) {
                throw new ArgumentOutOfRangeException("initialCapacity", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
            }
            if (initialCapacity < 10) {
                initialCapacity = 10;
            }
            this._array = new Array(initialCapacity);
            this._size = 0;
            this._version = 0;
        } else {
            throw new ArgumentOutOfRangeException('');
        }
    }



    public /* virtual */  Clear(): void {
        TArray.Clear(this._array, 0, this._size);
        this._size = 0;
        this._version++;
    }

    public /* virtual */ Clone(): Stack<T> {
        const stacks: Stack<T> = new Stack(this._size);
        stacks._size = this._size;
        TArray.Copy(this._array, 0, stacks._array, 0, this._size);
        stacks._version = this._version;
        return stacks;
    }

    public /* virtual */  Contains(obj: T): boolean {
        let int32: int = this._size;
        do {
            let int321: int = int32;
            int32 = int321 - 1;
            if (int321 <= 0) {
                return false;
            }
            if (obj != null) {
                continue;
            }
            if (this._array[int32] == null) {
                return true;
            }
        }
        while (this._array[int32] == null || !is.equals(this._array[int32], obj))
        return true;
    }

    public /* virtual */  CopyTo(array: Array<T>, index: int): void {
        if (array == null) {
            throw new ArgumentNullException("array");
        }
        /* if (array.Rank != 1) {
            throw new ArgumentException(Environment.GetResourceString("Arg_RankMultiDimNotSupported"));
        } */
        if (index < 0) {
            throw new ArgumentOutOfRangeException("index", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
        }
        if (array.length - index < this._size) {
            throw new ArgumentException(Environment.GetResourceString("Argument_InvalidOffLen"));
        }
        let int32: int = 0;
        /* if (!(array is object[]))
        {
            while (int32 < this._size) {
                array.SetValue(this._array[this._size - int32 - 1], int32 + index);
                int32++;
            }
            return;
        } */
        //object[] objArray = (object[])array;
        while (int32 < this._size) {
            array[int32 + index] = this._array[this._size - int32 - 1];
            int32++;
        }
    }


    public /* virtual */  GetEnumerator(): IEnumerator<T> {
        return new Stack.StackEnumerator(this);
    }

    public /* virtual */ Peek(): T {
        if (this._size === 0) {
            throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_EmptyStack"));
        }
        return this._array[this._size - 1];
    }


    public /* virtual */ Pop(): T {
        if (this._size === 0) {
            throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_EmptyStack"));
        }
        this._version++;
        const int32: int = this._size - 1;
        this._size = int32;
        const obj: T = this._array[int32];
        this._array[this._size] = null as any;
        return obj;
    }

    public /* virtual */  Push(obj: T): void {
        if (this._size === this._array.length) {
            const objArray: T[] = new Array(2 * this._array.length);
            TArray.Copy(this._array, 0, objArray, 0, this._size);
            this._array = objArray;
        }
        const objArray1: T[] = this._array;
        const int32: int = this._size;
        this._size = int32 + 1;
        objArray1[int32] = obj;
        this._version++;
    }

    public /* virtual */  toArray(): T[] {
        const objArray: T[] = new Array(this._size);
        for (let i = 0; i < this._size; i++) {
            objArray[i] = this._array[this._size - i - 1];
        }
        return objArray;
    }
}

export namespace Stack {

    export class StackEnumerator<T> implements IEnumerator<T>, ICloneable<StackEnumerator<T>>
    {
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
        Dispose(): void {
            throw new Error("Method not implemented.");
        }
        private _stack: Stack<T> = undefined as any;
        private _index: int = 0;

        private _version: int = 0;

        private currentElement: T = undefined as any;

        public /* virtual */ get Current(): T {
            if (this._index == -2) {
                throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_EnumNotStarted"));
            }
            if (this._index == -1) {
                throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_EnumEnded"));
            }
            return this.currentElement;
        }

        public constructor(stack: Stack<T>) {
            this._stack = stack;
            this._version = (this._stack as any)._version;
            this._index = -2;
            this.currentElement = null as any;
        }

        public Clone(): StackEnumerator<T> {
            return null as any;
        }

        public /* virtual */  MoveNext(): boolean {
            let flag: boolean;
            if (this._version !== (this._stack as any)._version) {
                throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_EnumFailedVersion"));
            }
            if (this._index === -2) {
                this._index = (this._stack as any)._size - 1;
                flag = this._index >= 0;
                if (flag) {
                    this.currentElement = (this._stack as any)._array[this._index];
                }
                return flag;
            }
            if (this._index == -1) {
                return false;
            }
            const int32: int = this._index - 1;
            this._index = int32;
            flag = int32 >= 0;
            if (!flag) {
                this.currentElement = null as any;
            }
            else {
                this.currentElement = (this._stack as any)._array[this._index];
            }
            return flag;
        }

        public /* virtual */  Reset(): void {
            if (this._version !== (this._stack as any)._version) {
                throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_EnumFailedVersion"));
            }
            this._index = -2;
            this.currentElement = null as any;
        }
    }
}