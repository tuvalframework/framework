import { Type } from "../Reflection/Type";
import { OrderedStringKeyDictionary } from "../Collections/dictionaries_/OrderedStringKeyDictionary";
import { isEnumerableOrArrayLike } from "../Collections/enumeration_/Enumerator";
import { UriComponent } from "./UriComponent";
import { QueryParam } from "./QueryParam";
import { encode, parse } from "./QueryParams";
import { is } from "../is";

/**
 * Provides a means for parsing and building a set of parameters.
 *
 * In other languages, dictionaries are not reliable for retaining the order of stored values. So for certainty and flexibility we use an ordered dictionary as a base class.
 */
export class QueryBuilder extends OrderedStringKeyDictionary<UriComponent.Value | UriComponent.Value[]>
{

	constructor(
		query: QueryParam.Convertible,
		decodeValues: boolean = true) {
		super();

		this.importQuery(query, decodeValues);
	}


	static init(
		query: QueryParam.Convertible,
		decodeValues: boolean = true): QueryBuilder {
		return new QueryBuilder(query, decodeValues);
	}

	importQuery(
		query: QueryParam.Convertible,
		decodeValues: boolean = true): QueryBuilder {

		if (is.string(query)) {
			this.importFromString(query, decodeValues);
		}
		else if (isEnumerableOrArrayLike(query)) {
			this.importEntries(query);
		}
		else {
			this.importMap(query as any);
		}

		return this;
	}

	/**
	 * Property parses the components of an URI into their values or array of values.
	 * @param values
	 * @param deserialize
	 * @param decodeValues
	 * @returns {QueryBuilder}
	 */
	importFromString(
		values: string,
		deserialize: boolean = true,
		decodeValues: boolean = true): QueryBuilder {
		const _ = this;
		parse(values,
			(key, value) => {
				if (_.containsKey(key)) {
					const prev = _.getValue(key);
					if ((prev) instanceof (Array))
						prev.push(value);
					else
						_.setValue(key, [<UriComponent.Value>prev, value]);
				}
				else
					_.setValue(key, value);
			},
			deserialize,
			decodeValues);

		return this;
	}


	/**
	 * Returns the encoded URI string
	 */
	encode(prefixIfNotEmpty?: boolean): string {
		return encode(this, prefixIfNotEmpty);
	}

	ToString(): string {
		return this.encode();
	}
}
