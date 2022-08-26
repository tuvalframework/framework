import { Type } from "../Reflection/Type";
import { Primitive } from "../Primitive";
import { copy } from "../Collections/Array/copy";
import { JsonMap, JsonArray } from "../JSON";
import { is } from "../is";

export function clone(source: Primitive | JsonMap | JsonArray, depth: number = 0): any {
	if (depth < 0)
		return source;

	// return primitives as is.
	if (!is.object(source))
		return source;

	if (is.arrayLike(source)) {
		// Make a copy first just in case there's some weird references.
		const result: any = copy(source as any);
		if (depth > 0) {
			const len = (source as any).length;
			for (let i = 0; i < len; i++) {
				result[i] = clone(result[i], depth - 1);
			}
		}
		return result;
	}
	else {
		const result: any = {};
		if (depth > 0) for (let k in <any>source) {
			//noinspection JSUnfilteredForInLoop
			result[k] = clone((<any>source)[k], depth - 1);
		}
		return result;
	}


}
