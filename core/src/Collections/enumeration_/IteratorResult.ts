import { IIteratorResult } from "./IIterator";

const VOID0: undefined = void 0;

export class IteratorResult<T> implements IIteratorResult<T>
{
	public readonly value: T;
	public readonly index?: number;
	public readonly done: boolean;

	constructor(value: T, done: boolean);
	constructor(value: T, index?: number, done?: boolean);
	constructor(value: T, index?: number | boolean, done: boolean = false) {
		// console.log('merhaba');
		this.value = value;
		if (typeof index == 'boolean')
			this.done = index;
		else {
			this.index = index;
			this.done = done;
		}
	}
	public static readonly Done: IteratorResult<any> = new IteratorResult<any>(VOID0, VOID0, true);

	public static GetDone(): IteratorResult<any> {
		return IteratorResult.Done;
	}
}

