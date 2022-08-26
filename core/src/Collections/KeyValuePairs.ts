export class KeyValuePairs {
    private key: any;
    private value: any;

    public constructor(key: any, value: any) {
        this.value = value;
        this.key = key;
    }

    public get Key(): any {
        return this.key;
    }

    public get Value(): any {
        return this.value;
    }
}