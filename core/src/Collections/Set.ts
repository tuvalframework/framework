import { Type } from "../Reflection/Type";
import { getIdentifier } from "./dictionaries_/getIdentifier";
import { ISymbolizable } from "./dictionaries_/IDictionary";
import { HashSet } from "./HashSet";
import { Primitive } from "../Primitive";
import { IEnumerableOrArray } from "./IEnumerableOrArray";


function getId(obj: any): string | number | symbol {
	return getIdentifier(obj, typeof obj != Type.BOOLEAN);
}

export class Set<T extends Primitive | ISymbolizable | symbol> extends HashSet<T>
{
	constructor(source?: IEnumerableOrArray<T>) {
		super(source, getId);
	}
}
