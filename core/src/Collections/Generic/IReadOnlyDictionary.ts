import { IReadOnlyCollection } from "./IReadOnlyCollection";
import { KeyValuePair } from "./KeyValuePair";
import { IEnumerable } from "../enumeration_/IEnumerable";
import { Out } from "../../Out";

export interface IReadOnlyDictionary<TKey, TValue> extends IReadOnlyCollection<KeyValuePair<TKey, TValue>>, IEnumerable<KeyValuePair<TKey, TValue>> {
    Get(key: TKey): TValue;
    Keys: IEnumerable<TKey>;
    Values: IEnumerable<TValue>;
    ContainsKey(key: TKey): boolean;
    TryGetValue(key: TKey, value: Out<TValue>): boolean;
}