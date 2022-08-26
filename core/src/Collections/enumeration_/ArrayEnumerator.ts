import { IndexEnumerator } from "./IndexEnumerator";
import { is } from "../../is";
// noinspection JSUnusedLocalSymbols
// const __extends = __extendsImport;

export class ArrayEnumerator<T> extends IndexEnumerator<T>
{
	constructor(arrayFactory: () => ArrayLike<T>, start?: number, step?: number);
	constructor(array: ArrayLike<T>, start?: number, step?: number);
	constructor(arrayOrFactory: any, start: number = 0, step: number = 1) {
		super(
			() => {
				const array = is.function(arrayOrFactory) ? arrayOrFactory() : arrayOrFactory;
				return {
					source: array,
					pointer: start,
					length: array ? array.length : 0,
					step: step
				};
			}
		);
	}
}
