import { UriComponent } from "./UriComponent";
import { StringKeyValuePair } from "../KeyValuePair";
import { IEnumerable } from "../Collections/enumeration_/IEnumerable";
import { IEnumerableOrArray } from "../Collections/IEnumerableOrArray";

export namespace QueryParam {
	export type Array
		= ArrayLike<StringKeyValuePair<UriComponent.Value | UriComponent.Value[]>>;

	export type Enumerable
		= IEnumerable<StringKeyValuePair<UriComponent.Value | UriComponent.Value[]>>;

	export type EnumerableOrArray
		= IEnumerableOrArray<StringKeyValuePair<UriComponent.Value | UriComponent.Value[]>>;

	export type Convertible
		= string | UriComponent.Map | EnumerableOrArray;
}

