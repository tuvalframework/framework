export interface IKeyValuePair<TKey, TValue> {
	key: TKey;
	value: TValue;
}

export type KeyValuePair<TKey, TValue> = IKeyValuePair<TKey, TValue> | [TKey, TValue];

export interface IStringKeyValuePair<TValue> extends IKeyValuePair<string, TValue> { }
export type StringKeyValuePair<TValue> = IStringKeyValuePair<TValue> | [string, TValue];