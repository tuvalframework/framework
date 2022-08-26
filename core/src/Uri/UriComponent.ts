import { Primitive } from "../Primitive";
import { ISerializable } from "../serialization_/ISerializable";
import { IMap } from "../IMap";

export namespace UriComponent {
	export interface Formattable {
		toUriComponent(): string;
	}

	export type Value = Primitive | ISerializable | Formattable;

	export interface Map extends IMap<Value | Value[]> {

	}
}


