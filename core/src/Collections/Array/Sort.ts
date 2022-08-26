import { createComparer } from "./Sorting/createComparer";
import { quickSort } from "./Sorting/quickSort";
import { Order } from "../Sorting/Order";
import { Selector } from "../../FunctionTypes";
import { Primitive } from "../../Primitive";

export class ArraySort {
	public static readonly quick = quickSort;

	public static using<TSource, TSelect extends Primitive>(
		target: TSource[],
		selector: Selector<TSource, TSelect | TSelect[]>,
		order: Order | Order[] = Order.Ascending,
		equivalentToNaN: any = NaN): TSource[] {
		return target.sort(createComparer(selector, order, equivalentToNaN));
	}
}
