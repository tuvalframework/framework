import { IteratorResult } from "./IteratorResult";
import { Functions } from "../../Functions";
import { IEnumerator } from "./IEnumerator";

const VOID0: undefined = void 0;


/**
 * A simplified stripped down enumerable that is always complete and has no results.
 * Frozen and exported as 'empty' to allow for reuse.
 */

export const EmptyEnumerator: IEnumerator<any> = Object.freeze({
	Current: VOID0,
	MoveNext: Functions.False,
	TryMoveNext: Functions.False,
	NextValue: Functions.Blank,
	Next: IteratorResult.GetDone,
	"return": IteratorResult.GetDone,
	End: Functions.Blank,
	Reset: Functions.Blank,
	Dispose: Functions.Blank,
	IsEndless: false
});