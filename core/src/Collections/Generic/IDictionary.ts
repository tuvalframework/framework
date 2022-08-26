import { ICollection } from "./ICollection";
import { IEnumerable } from "../enumeration_/IEnumerable";
import { DictionaryEntry } from "../DictionaryEntry";
import { KeyValuePair } from "./KeyValuePair";

export interface IDictionary<TKey, TValue> extends ICollection<KeyValuePair<TKey, TValue>>, IEnumerable<KeyValuePair<TKey, TValue>> {
    Get(key: TKey): TValue;
    Keys: ICollection<TKey>;
    Values: ICollection<TValue>;
    Add(item: KeyValuePair<TKey, TValue>): void;
    Add(key: TKey, value: TValue): void;
    ContainsKey(key: TKey): boolean;
    Remove(key: KeyValuePair<TKey, TValue>): boolean;
    Remove(key: TKey): boolean;
}