
export interface IComparer<T> {
	Compare(a: T, b: T): number;
}
