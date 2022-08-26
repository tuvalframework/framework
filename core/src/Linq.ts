import { Predicate } from './FunctionTypes';
import { is } from './is';
import { IEnumerable } from './Collections/enumeration_/IEnumerable';
import { IEnumerator } from './Collections/enumeration_/IEnumerator';
import { int } from './float';
import { ThrowHelper } from './ThrowHelper';
import { ExceptionResource } from './ExceptionResource';
import { IIteratorResult } from "./Collections/enumeration_/IIterator";

export class Linq<T = any> implements IEnumerable<T> {
    public GetEnumerator(): IEnumerator<T> {
        return new Linq.LinqEnumerator(this._items);
    }
    public IsEndless?: boolean | undefined;

    private _items: T[] = [];
    public constructor(array: T[]) {
        this._items = array;
    }
    public where(f: (item: T) => boolean): Linq<T> {
        const newList: any[] = [];
        for (let i = 0; i < this._items.length; i++) {
            if (is.notNull(this._items[i]) && f(this._items[i])) {
                newList.push(this._items[i]);
            }
        }
        return new Linq(newList);
    }
    public select(f: (item: T, index?: number) => any): Linq<T> {
        const newList: any[] = [];
        for (let i = 0; i < this._items.length; i++) {
            if (is.notNull(this._items[i])) {
                newList.push(f(this._items[i], i));
            }
        }
        return new Linq(newList);
    }
    public firstOrDefault(f: Predicate<T>, _default: T = null as any): T {
        for (let i = 0; i < this._items.length; i++) {
            if (is.notNull(this._items[i]) && f(this._items[i])) {
                return this._items[i];
            }
        }
        return _default;
    }

}

export namespace Linq {
    export class LinqEnumerator<T> implements IEnumerator<T> {
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
        private list: T[] = undefined as any;
        private index: int = 0;;
        private version: int = 0;
        private current: T = undefined as any;
        public get Current(): T {
            return this.current;
        }


        public constructor(list: T[]) {
            this.list = list;
            this.index = 0;
            this.version = (list as any)._version;
            this.current = null as any;
        }

        /// <summary>Releases all resources used by the <see cref="T:System.Collections.Generic.List`1.Enumerator" />.</summary>
        public Dispose(): void {
        }


        public MoveNext(): boolean {
            const ts: T[] = this.list;
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

export function from<T>(array: T[]): Linq<T> {
    return new Linq(array);
}