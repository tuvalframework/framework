import { ArgumentNullException } from "./Exceptions/ArgumentNullException";
import { IKeyValuePair, KeyValuePair } from "./KeyValuePair";
import { ArgumentException } from "./Exceptions";
import { Type } from "./Reflection/Type";
import { is } from "./is";

const
	VOID0: undefined = void 0,
	DOT: string = '.',
	KEY: string = 'key',
	VALUE: string = 'value',
	ITEM: string = 'item',
	ITEM_1: string = ITEM + '[1]',
	ITEM_VALUE: string = ITEM + DOT + VALUE,
	INVALID_KVP_MESSAGE: string = 'Invalid type.  Must be a KeyValuePair or Tuple of length 2.',
	CANNOT_BE_UNDEFINED: string = 'Cannot equal undefined.';

export function isKeyValuePair<TKey, TValue>(kvp: any): kvp is IKeyValuePair<TKey, TValue> {
	return kvp && kvp.hasOwnProperty(KEY) && kvp.hasOwnProperty(VALUE);
}

export function assertKey<TKey>(key: TKey, name: string = ITEM): TKey | never {
	assertNotUndefined(key, name + DOT + KEY);
	if (key === null)
		throw new ArgumentNullException(name + DOT + KEY);

	return key;
}


export function assertTuple(tuple: ArrayLike<any>, name: string = ITEM): void | never {
	if (tuple.length != 2)
		throw new ArgumentException(name, 'KeyValuePair tuples must be of length 2.');

	assertKey(tuple[0], name);
}


export function assertNotUndefined<T>(value: T, name: string): T | never {
	if (value === VOID0)
		throw new ArgumentException(name, CANNOT_BE_UNDEFINED);

	return value;
}


export function extractKeyValue<TKey, TValue, TResult>(item: KeyValuePair<TKey, TValue>, to: (key: TKey, value: TValue) => TResult): TResult {

	let key: TKey, value: TValue;
	if (is.arrayLike(item)) {
		assertTuple(item as any);
		key = item[0];
		value = assertNotUndefined(item[1], ITEM_1);
	}
	else if (isKeyValuePair<TKey, TValue>(item)) {
		key = assertKey((item as any).key);
		value = assertNotUndefined((item as any).value, ITEM_VALUE);
	}
	else {
		throw new ArgumentException(ITEM, INVALID_KVP_MESSAGE);
	}
	return to(key, value);
}