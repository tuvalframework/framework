export class DictionaryEntry<TKey, TValue>
{
    private _key: TKey = undefined as any;
    private _value: TValue = undefined as any;

    public get Key(): TKey {
        return this._key;
    }
    public set Key(value: TKey) {
        this._key = value;
    }

    public get Value(): TValue {
        return this._value;
    }
    public set Value(value: TValue) {
        this._value = value;
    }

    public constructor(key: TKey, value: TValue) {
        this._key = key;
        this._value = value;
    }
}