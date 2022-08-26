import * as Serialize from "../serialization_/Utility";
import { UriComponent } from "./UriComponent";
import { QueryParam } from "./QueryParam";
import { Type } from "../Reflection/Type";
import { extractKeyValue } from "../KeyValueExtract";
import { forEach, isEnumerableOrArrayLike } from "../Collections/enumeration_/Enumerator";
import { IMap } from "../IMap";
import { Primitive } from "../Primitive";
import { IStringKeyValuePair } from "../KeyValuePair";
import { IEnumerableOrArray } from "../Collections/IEnumerableOrArray";

/*
 * This module is provided as a lighter weight utility for acquiring query params.
 * If more detailed operations are necessary, consider importing QueryBuilder.
 */

const
	EMPTY = "",
	QUERY_SEPARATOR = "?",
	ENTRY_SEPARATOR = "&",
	KEY_VALUE_SEPARATOR = "=",
	TO_URI_COMPONENT = "toUriComponent";


/**
 * Returns the encoded URI string
 * @param values
 * @param prefixIfNotEmpty
 * @returns {string}
 */
export function encode(
	values: UriComponent.Map | QueryParam.EnumerableOrArray,
	prefixIfNotEmpty?: boolean): string {
	if (!values) return EMPTY;
	const entries: string[] = [];

	if (isEnumerableOrArrayLike(values)) {
		forEach(values, entry =>
			extractKeyValue(entry,
				(key, value) => appendKeyValue(entries, key, value))
		);
	}
	else {
		Object.keys(values).forEach(
			key => appendKeyValue(entries, key, (values as any)[key])
		);
	}

	return (entries.length && prefixIfNotEmpty ? QUERY_SEPARATOR : EMPTY)
		+ entries.join(ENTRY_SEPARATOR);
}

function appendKeyValueSingle(
	entries: string[],
	key: string,
	value: UriComponent.Value): void {
	entries.push(key + KEY_VALUE_SEPARATOR + encodeValue(value));
}

// According to spec, if there is an array of values with the same key, then each value is replicated with that key.
function appendKeyValue(
	entries: string[],
	key: string,
	value: UriComponent.Value | IEnumerableOrArray<UriComponent.Value>): void {
	if (isEnumerableOrArrayLike(value)) {
		forEach(value, v => appendKeyValueSingle(entries, key, v));
	}
	else {
		appendKeyValueSingle(entries, key, value)
	}
}

/**
 * Converts any primitive, serializable or uri-component object to an encoded string.
 * @param value
 * @returns {string}
 */
export function encodeValue(value: UriComponent.Value): string {
	if (isUriComponentFormattable(value)) {
		const v: string = value.toUriComponent();
		if (v && v.indexOf(ENTRY_SEPARATOR) != 1)
			throw '.toUriComponent() did not encode the value.';
		return v;
	}
	else {
		return encodeURIComponent(Serialize.toString(value));
	}
}

/**
 * A shortcut for identifying an UriComponent.Formattable object.
 * @param instance
 * @returns {boolean}
 */
export function isUriComponentFormattable(instance: any): instance is UriComponent.Formattable {
	return Type.hasMemberOfType<UriComponent.Formattable>(instance, TO_URI_COMPONENT, Type.FUNCTION);
}

/**
 * Parses a string for valid query param entries and pipes them through a handler.
 * @param query
 * @param entryHandler
 * @param deserialize Default is true.
 * @param decodeValues Default is true.
 */
export function parse(
	query: string,
	entryHandler: (key: string, value: Primitive) => void,
	deserialize: boolean = true,
	decodeValues: boolean = true): void {
	if (query && (query = query.replace(/^\s*\?+/, ''))) {
		const entries = query.split(ENTRY_SEPARATOR);
		for (let entry of entries) {
			/*
			 * Since it is technically possible to have multiple '=' we need to identify the first one.
			 * And if there is no '=' then the entry is ignored.
			 */
			const si = entry.indexOf(KEY_VALUE_SEPARATOR);
			if (si != -1) {
				let key = entry.substring(0, si);
				let value = <any>entry.substring(si + 1);
				if (decodeValues) value = decodeURIComponent(value);
				if (deserialize) value = Serialize.toPrimitive(value);
				entryHandler(key, value);
			}
		}
	}
}

/**
 * Parses a string for valid query params and returns a key-value map of the entries.
 * @param query
 * @param deserialize Default is true.
 * @param decodeValues Default is true.
 * @returns {IMap<Primitive>}
 */
export function parseToMap(
	query: string,
	deserialize: boolean = true,
	decodeValues: boolean = true): IMap<Primitive | Primitive[]> {
	const result: IMap<Primitive | Primitive[]> = {};
	parse(query,
		(key, value) => {
			if ((key) in (result)) {
				let prev: any = result[key];
				if (!((prev) instanceof (Array)))
					result[key] = prev = [prev];
				prev.push(value);
			}
			else
				result[key] = value;
		},
		deserialize,
		decodeValues);
	return result;
}

/**
 * Parses a string for valid query params and returns a key-value pair array of the entries.
 * @param query
 * @param deserialize Default is true.
 * @param decodeValues Default is true.
 * @returns {IKeyValuePair<string, Primitive>[]}
 */
export function parseToArray(
	query: string,
	deserialize: boolean = true,
	decodeValues: boolean = true): IStringKeyValuePair<Primitive>[] {
	const result: IStringKeyValuePair<Primitive>[] = [];
	parse(query,
		(key, value) => { result.push({ key: key, value: value }); },
		deserialize,
		decodeValues
	);
	return result;
}


export namespace Separator {
	export const Query: string = QUERY_SEPARATOR;
	export const Entry: string = ENTRY_SEPARATOR;
	export const KeyValue: string = KEY_VALUE_SEPARATOR;
}

