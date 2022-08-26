import { DictionaryEntry } from "./DictionaryEntry";
import { IEnumerator } from "./enumeration_/IEnumerator";
import { KeyValuePair } from "./Generic/KeyValuePair";

export interface IDictionaryEnumerator<TKey, TValue> extends IEnumerator<KeyValuePair<TKey, TValue>> {

    Entry: DictionaryEntry<TKey, TValue>;
    Key: TKey;
    Value: TValue;
}