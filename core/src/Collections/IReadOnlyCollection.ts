import { IEnumerable } from "./enumeration_/IEnumerable";
import { IEnumerator } from "./enumeration_/IEnumerator";

export interface IReadOnlyCollection<T> extends IEnumerable<T> {
	Count: number;
	IsReadOnly: boolean;
	contains(entry: T): boolean;
	copyTo(target: Array<T>, index?: number): Array<T>;
	toArray(): T[];

	// IEnumerable
	GetEnumerator(): IEnumerator<T>;
	IsEndless?: boolean;
}