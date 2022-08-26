let _nextId = 0;

/**
 * Global utility for generating sequential unique ID numbers.
 *
 * @memberof easeljs
 * @name easeljs.uid
 * @example
 * import { uid } from "@createjs/easeljs";
 * var ids = [];
 * while (ids.length <= 3) {
 *   ids.push(uid());
 * }
 * // ids == [0, 1, 2, 3]
 */
export function uid () {
	return _nextId++;
}