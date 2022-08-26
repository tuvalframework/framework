console.log('%c ArrayLikeCollection Loading...', 'background: #222; color: #bada55');
import { _ICollection } from "./ICollection";
import { IComparer } from "./IComparer";
import { shalowExtend } from "../shalowExtend";
import { ClassInfo } from '../Reflection/Decorators/ClassInfo';
import { System } from '../SystemTypes';
import { DisposableBase } from "../Disposable/DisposableBase";
import { is } from "../is";


@ClassInfo({
    fullName: System.Types.Collections.ArrayLikeCollection,
    instanceof: [
        System.Types.Collections.ArrayLikeCollection,
        System.Types.Collections.CollectionBase,
        System.Types.Collections.ICollection,
        System.Types.Collections.Enumeration.IEnumerateEach,
        System.Types.Disposable.DisposableBase,
        System.Types.Disposable.IDisposableAware,
        System.Types.Disposable.IDisposable
    ]
})
export class ArrayLikeCollection<T> extends DisposableBase {
    [key: number]: T;
    [Symbol.unscopables](): { copyWithin: boolean; entries: boolean; fill: boolean; find: boolean; findIndex: boolean; keys: boolean; values: boolean; } {
        throw new Error('Symbol.iterator not implemented.');
    }

    private args: Array<T>;

    constructor(..._arguments: T[]) {
        super();
        // super(_arguments && _arguments.length);
        this.args = [].slice.call(_arguments);
        const length = ((<any>this).length = this.args.length);
        let i = 0;
        for (; i < length; i++) {
            this[i] = this.args[i];
        }
        return this;
    }



    public get IsEmpty(): boolean {
        return this.length === 0;
    }
    public each(func: Function) {
        for (let i = 0; i < this.length; i++) {
            func(this[i], i);
        }
    }

    public toArray(): Array<T> {
        const arr: Array<T> = [];
        const len = this.length;

        for (let i = 0; i < len; i++) {
            arr.push(this[i]);
        }
        return arr;
    }

    public copyArray(): Array<T> {
        return this.toArray();
    }
    public copyTo(array: Array<T>, index: number): Array<T> {
        if (!array) {
            array = [];
        }

        for (let i = index; i < this.length; i++) {
            array.push(this[i]);
        }

        return array;
    }

    public insert(index: number, item: T) {
        this.splice(index, 0, item);
    }
    public add(item: T) {
        this.push(item);
    }
    public addRange(coll: _ICollection<T> | T[]) {
        if (is.array(coll)) {
            for (let i = 0; i < coll.length; i++) {
                this.push(coll[i]);
            }
        } else {
            for (let i = 0; i < coll.Count; i++) {
                this.push((coll as any)[i]);
            }
        }
    }




    // map one method by it's name
    public static _mapMethod(methodName: string) {
        (<any>ArrayLikeCollection.prototype)[methodName] = function () {
            const len = this.length;

            const args = [].slice.call(arguments);
            for (let i = 0; i < len; i++) {
                this[i][methodName].apply(this[i], args);
            }

            return this;
        };
    }

    public static mapMethods(constructor: Function) {
        let prot = constructor.prototype;
        for (let methodName in prot) {
            ArrayLikeCollection._mapMethod(methodName);
        }
    }

    // Array Impls

    public ToString(): string {
        throw new Error('toString not implemented.');
    }
    /**
      * Returns a string representation of an array. The elements are converted to string using their toLocalString methods.
      */
    public toLocaleString(): string {
        throw new Error('toLocaleString not implemented.');
    }
    /**
      * Removes the last element from an array and returns it.
      */
    public pop(): T | undefined {
        throw new Error('pop not implemented.');
    }
    /**
      * Appends new elements to an array, and returns the new length of the array.
      * @param items New elements of the Array.
      */
    public push(...items: T[]): number {
        throw new Error('push not implemented.');
    }
    /**
      * Combines two or more arrays.
      * @param items Additional items to add to the end of array1.
      */
    public concat(...items: ConcatArray<T>[]): T[];
    public concat(...items: (T | ConcatArray<T>)[]): T[];
    public concat(...args: any[]): T[] {
        throw new Error('concat not implemented.');
    }
    /**
      * Combines two or more arrays.
      * @param items Additional items to add to the end of array1.
      */

    /**
      * Adds all the elements of an array separated by the specified separator string.
      * @param separator A string used to separate one element of an array from the next in the resulting String. If omitted, the array elements are separated with a comma.
      */
    public join(separator?: string): string {
        throw new Error('join not implemented.');
    }
    /**
      * Reverses the elements in an Array.
      */
    public reverse(): T[] {
        throw new Error('join not implemented.');
    }
    /**
      * Removes the first element from an array and returns it.
      */
    public shift(): T | undefined {
        throw new Error('join not implemented.');
    }
    /**
      * Returns a section of an array.
      * @param start The beginning of the specified portion of the array.
      * @param end The end of the specified portion of the array.
      */
    public slice(start?: number, end?: number): T[] {
        throw new Error('join not implemented.');
    }

    /**
      * Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.
      * @param start The zero-based location in the array from which to start removing elements.
      * @param deleteCount The number of elements to remove.
      */
    public splice(start: number, deleteCount?: number): T[];
    public splice(start: number, deleteCount: number, ...items: T[]): T[];
    public splice(...args: any[]): T[] {
        throw new Error('splice not implemented.');
    }
    /**
      * Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.
      * @param start The zero-based location in the array from which to start removing elements.
      * @param deleteCount The number of elements to remove.
      * @param items Elements to insert into the array in place of the deleted elements.
      */

    /**
      * Inserts new elements at the start of an array.
      * @param items  Elements to insert at the start of the Array.
      */
    public unshift(...items: T[]): number {
        throw new Error('splice not implemented.');
    }
    /**
      * Returns the index of the first occurrence of a value in an array.
      * @param searchElement The value to locate in the array.
      * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the search starts at index 0.
      */
    public indexOf(searchElement: T, fromIndex?: number): number {
        throw new Error('indexOf not implemented.');
    }
    /**
      * Returns the index of the last occurrence of a specified value in an array.
      * @param searchElement The value to locate in the array.
      * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the search starts at the last index in the array.
      */
    public lastIndexOf(searchElement: T, fromIndex?: number): number {
        throw new Error('splice not implemented.');
    }
    /**
      * Determines whether all the members of an array satisfy the specified test.
      * @param callbackfn A function that accepts up to three arguments. The every method calls the callbackfn function for each element in array1 until the callbackfn returns false, or until the end of the array.
      * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
      */
    public every(callbackfn: (value: T, index: number, array: T[]) => boolean, thisArg?: any): boolean {
        throw new Error('splice not implemented.');
    }
    /**
      * Determines whether the specified callback function returns true for any element of an array.
      * @param callbackfn A function that accepts up to three arguments. The some method calls the callbackfn function for each element in array1 until the callbackfn returns true, or until the end of the array.
      * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
      */
    public some(callbackfn: (value: T, index: number, array: T[]) => boolean, thisArg?: any): boolean {
        throw new Error('splice not implemented.');
    }
    /**
      * Performs the specified action for each element in an array.
      * @param callbackfn  A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
      * @param thisArg  An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
      */
    public forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void {
        throw new Error('splice not implemented.');
    }
    /**
      * Calls a defined callback function on each element of an array, and returns an array that contains the results.
      * @param callbackfn A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
      * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
      */
    public map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): U[] {
        throw new Error('splice not implemented.');
    }
    /**
     * Returns the elements of an array that meet the condition specified in a callback function.
     * @param callbackfn A function that accepts up to three arguments. The filter method calls the callbackfn function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     */
    public filter<S extends T>(callbackfn: (value: T, index: number, array: T[]) => value is S, thisArg?: any): S[];
    public filter(callbackfn: (value: T, index: number, array: T[]) => any, thisArg?: any): T[];
    public filter(...args: any[]): T[] {
        throw new Error('splice not implemented.');
    }

    /**
      * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
      * @param callbackfn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.
      * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
      */
    public reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T): T;
    public reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T, initialValue: T): T;
    public reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U
    public reduce(...args: any[]): T {
        throw new Error('reduce not implemented.');
    }


    /**
      * Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
      * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array.
      * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
      */
    public reduceRight(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T): T;
    public reduceRight(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T, initialValue: T): T;
    public reduceRight<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U;
    public reduceRight(...args: any[]): T {
        throw new Error('reduceRight not implemented.');
    }

    public find<S extends T>(predicate: (this: void, value: T, index: number, obj: T[]) => value is S, thisArg?: any): S | undefined;
    public find(predicate: (value: T, index: number, obj: T[]) => boolean, thisArg?: any): T | undefined;
    public find(...args: any[]): T | undefined {
        throw new Error('find not implemented.');
    }


    public findIndex(predicate: (value: T, index: number, obj: T[]) => boolean, thisArg?: any): number {
        throw new Error('findIndex not implemented.');
    }


    public fill(value: T, start?: number, end?: number): T[] {
        throw new Error('fill not implemented.');
    }

    public copyWithin(target: number, start: number, end?: number): T[] {
        throw new Error('copyWithin not implemented.');
    }

    /** Iterator */
    public [Symbol.iterator](): IterableIterator<T> {
        throw new Error('Symbol.iterator not implemented.');
    }

    /**
     * Returns an iterable of key, value pairs for every entry in the array
     */
    public entries(): IterableIterator<[number, T]> {
        throw new Error('entries not implemented.');
    }


    public keys(): IterableIterator<number> {
        throw new Error('keys not implemented.Use Keys property insted of this.');
    }


    public values(): IterableIterator<T> {
        throw new Error('Values() not implemented.Use Values property insted of this.');
    }

    public getUpperBound(index: number): number {
        throw new Error('getUpperBound not implemented.');
    }

    public equals(array: Array<T>): boolean {
        throw new Error('equals not implemented.');
    }

    public clone(): Array<T> {
        throw new Error('clone not implemented.');
    }

    public length: number = 0;


    public sort(compareFn?: (a: T, b: T) => number): T[] {
        return Array.prototype.sort.call(this, compareFn);
    }
    public sortItems(comparer: IComparer<T>, index?: number, count?: number): void {
        const that = this;
        if (index && count) {
            const array = Array.prototype.slice.call(that, index, count);
            ArrayLikeCollection.prototype.sortItems.call(this, comparer);
            const length = array.length;
            for (let i = 0; i < length; i++) {
                this[index + i] = array[i];
            }
        } else {
            Array.prototype.sort.call(this, comparer.Compare);
        }
    }

    public contains(obj: T): boolean {
        if (obj === undefined) {
            return false;
        }
        return this.indexOf(obj) > -1;
    }

    public get Count(): number {
        return this.length;
    }
    public get IsReadOnly(): boolean {
        return false;
    }


    public removeAt(index: number) {
        if (index > -1) {
            this.splice(index, 1);
        }
    }



    public static FastRemove<T>(a: ArrayLikeCollection<T>, o: T): number {
        let int32 = -1;
        const count = a.Count;
        if (count > 1000) {
            int32 = a.indexOf(o, count - 50);
        }
        if (int32 < 0) {
            int32 = a.indexOf(o);
        }
        if (int32 >= 0) {
            a.removeAt(int32);
        }
        return int32;
    }
}

shalowExtend(ArrayLikeCollection, Array, ['sort']);


// console.log('ArrayLikeCollection loading successful.');