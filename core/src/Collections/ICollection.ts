import { IReadOnlyCollection } from "./IReadOnlyCollection";
import { IEnumerableOrArray } from "./IEnumerableOrArray";
import { IEnumerator } from "./enumeration_/IEnumerator";
import { int } from "../float";

export interface  _ICollection<T> extends IReadOnlyCollection<T> {
	add(entry: T): int;
	remove(entry: T, max?: number): number;  // Number of times removed.
	clear(): number;
	importEntries(entries: IEnumerableOrArray<T> | IEnumerator<T>): number;
	toArray(): T[];
	removeAt(index: number): void;

	// IReadOnlyCollection
	Count: number;
	IsReadOnly: boolean;
	contains(entry: T): boolean;
	copyTo(target: Array<T>, index?: number): Array<T>;
	toArray(): T[];

	// IEnumerable
	GetEnumerator(): IEnumerator<T>;
	IsEndless?: boolean;
}
