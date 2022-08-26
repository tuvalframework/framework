import { IEnumerable } from "./IEnumerable";
import { EmptyEnumerator } from "./EmptyEnumerator";
import { IEnumerator } from "./IEnumerator";
export class EmptyEnumerable implements IEnumerable<any>{

	constructor() {
		this.IsEndless = false;
	}

	GetEnumerator(): IEnumerator<any> {
		return EmptyEnumerator;
	}

	/**
	 * Provides a way of flagging endless enumerations that may cause issues.
	 */
	readonly IsEndless: boolean;
}
