import { Primitive } from "../../../Primitive";
import { ArgumentNullException } from "../../../Exceptions/ArgumentNullException";
import { initialize } from "../Utility";
import { ArrayLikeWritable } from "../ArrayLikeWritable";

/**
 * Merge internalSort O(n log (n))
 * Warning: Uses recursion.
 * @param target
 * @returns {number[]}
 */
export function mergeSort<T extends Primitive, TArray extends ArrayLikeWritable<T>>(target: TArray): TArray {
	if (!target) throw new ArgumentNullException("target");
	const len = target.length;
	return len < 2 ? target : sort(target, 0, len, initialize<T>(len));
}

function sort<T extends Primitive, TArray extends ArrayLikeWritable<T>>(
	target: TArray,
	start: number,
	end: number,
	temp: ArrayLikeWritable<T>): TArray {
	if (end - start > 1) {
		// Step 1: Sort the left and right parts.
		const middle = Math.floor((start + end) / 2);
		sort(target, start, middle, temp);
		sort(target, middle, end, temp);

		// Step 2: Copy the original array
		for (let i = 0, len = target.length; i < len; i++) {
			temp[i] = target[i];
		}

		// Step 3: Create variables to traverse
		let k = start, i = start, j = middle;

		// Step 4: Merge: Move from the temp to target integers in order
		while (i < middle && j < end) {
			target[k++]
				= temp[i] > temp[j]
					? temp[j++]
					: temp[i++];
		}

		// Step 5: Finalize merging in case right side of the array is bigger.
		while (i < middle) {
			target[k++] = temp[i++];
		}

	}

	return target
}
