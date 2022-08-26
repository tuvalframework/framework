import { DictionaryEntry } from "../DictionaryEntry";
import { IEnumerator } from "../enumeration_/IEnumerator";
import { KeyValuePair } from "../Generic/KeyValuePair";

export interface IDictionaryEnumerator<TKey, TValue> extends IEnumerator<KeyValuePair<TKey, TValue>> {
    Entry: KeyValuePair<TKey, TValue>;
    Key: TKey;
    Value: TValue;
}