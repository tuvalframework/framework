import { Primitive } from "./Primitive";
import { IComparable } from "./IComparable";
import { CompareResult } from "./CompareResult";
import { Type } from "./Reflection/Type";
import { is } from "./is";

const VOID0: undefined = void 0;

/**
 * Used for special comparison including NaN.
 * @param a
 * @param b
 * @param strict
 * @returns {boolean|any}
 */
export function areEqual(a: any, b: any, strict: boolean = true): boolean {
	return a === b
		|| !strict && a == b
		|| is.trueNaN(a) && is.trueNaN(b);
}

const COMPARE_TO = "compareTo";

/**
 * Compares two comparable objects or primitives.
 * @param a
 * @param b
 */
export function compare<T>(a: IComparable<T>, b: IComparable<T>): number;
export function compare<T extends Primitive>(a: T, b: T, strict?: boolean): CompareResult;
export function compare(a: any, b: any, strict: boolean = true): CompareResult {

	if (areEqual(a, b, strict))
		return CompareResult.Equal;

	if (a && Type.hasMember(a, COMPARE_TO))
		return a.compareTo(b); // If a has compareTo, use it.
	else if (b && Type.hasMember(b, COMPARE_TO))
		return -b.compareTo(a); // a doesn't have compareTo? check if b does and invert.

	// Allow for special inequality..

	if (a > b || strict && (a === 0 && b == 0 || a === null && b === VOID0))
		return CompareResult.Greater;

	if (b > a || strict && (b === 0 && a == 0 || b === null && a === VOID0))
		return CompareResult.Less;

	return NaN;
}

/**
 * Determines if two primitives are equal or if two objects have the same key/value combinations.
 * @param a
 * @param b
 * @param nullEquivalency If true, null/undefined will be equivalent to an empty object {}.
 * @param extraDepth
 * @returns {boolean}
 */
export function areEquivalent(
	a: any, b: any, nullEquivalency: boolean = true,
	extraDepth: number = 0): boolean {

	// Take a step by step approach to ensure efficiency.
	if (areEqual(a, b, true)) return true;

	if (a == null || b == null) {
		if (!nullEquivalency) return false;

		if (is.object(a)) {
			return !Object.keys(a).length;
		}

		if (is.object(b)) {
			return !Object.keys(b).length;
		}

		return a == null && b == null;
	}

	if (is.object(a) && is.object(b)) {

		const aKeys = Object.keys(a), bKeys = Object.keys(b), len = aKeys.length;
		if (len != bKeys.length)
			return false;

		aKeys.sort();
		bKeys.sort();

		for (let i = 0; i < len; i++) {
			let key = aKeys[i];
			if (key !== bKeys[i] || !areEqual(a[key], b[key], true)) return false;
		}

		// Doesn't track circular references but allows for controlling the amount of recursion.
		if (extraDepth > 0) {

			for (let key of aKeys) {
				if (!areEquivalent(a[key], b[key], nullEquivalency, extraDepth - 1)) return false;
			}
		}

		return true;
	}

	return false;
}
