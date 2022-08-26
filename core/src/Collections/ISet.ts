
import { _ICollection } from "./ICollection";
import { IEnumerableOrArray } from "./IEnumerableOrArray";

export interface ISet<T> extends _ICollection<T> {

	exceptWith(
		other: IEnumerableOrArray<T>): void;

	intersectWith(
		other: IEnumerableOrArray<T>): void;
	isProperSubsetOf(
		other: IEnumerableOrArray<T>): boolean;

	isProperSupersetOf(
		other: IEnumerableOrArray<T>): boolean;

	isSubsetOf(
		other: IEnumerableOrArray<T>): boolean;

	isSupersetOf(
		other: IEnumerableOrArray<T>): boolean;

	overlaps(
		other: IEnumerableOrArray<T>): boolean;

	setEquals(
		other: IEnumerableOrArray<T>): boolean;

	symmetricExceptWith(
		other: IEnumerableOrArray<T>): void;

	unionWith(
		other: IEnumerableOrArray<T>): void

}