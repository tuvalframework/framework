import * as Values from "../../Compare";
import { SortContext } from "./SortContext";
import { Functions } from "../../Functions";
import { Comparison, Selector } from "../../FunctionTypes";
import { Comparable } from "../../IComparable";
import { IComparer } from "../IComparer";
import { Order } from "./Order";

export class KeySortedContext<T, TKey extends Comparable> extends SortContext<T>
{
	constructor(
		next: IComparer<T> | null,
		protected _keySelector: Selector<T, TKey> | null,
		order: Order = Order.Ascending,
		comparer: Comparison<T> = Values.compare) {
		super(next, comparer, order);
	}

	Compare(a: T, b: T): number {
		const _ = this;
		let ks = _._keySelector;
		if (!ks || ks == Functions.Identity) return super.Compare(a, b);
		// We force <any> here since it can be a Primitive or IComparable<any>
		const d = Values.compare(<any>ks(a), <any>ks(b));
		if (d == 0 && _._next) return _._next.Compare(a, b);
		return _._order * d;
	}
}