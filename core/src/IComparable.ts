import { Primitive } from "./Primitive";

export interface IComparable<T> {
	CompareTo(other: T): number;
}

export declare type Comparable = Primitive | IComparable<any>;