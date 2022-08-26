import { int, short, ByteArray } from '@tuval/core';
export class PropertyItem {

    private id: int = 0;
    private len: int = 0;
    private type: short = 0;
    private value: ByteArray = null as any;

    //constructor
    public/* internal */ constructor() {
        //Nothing to be done here
    }


    // properties
    public get Id(): int {
        return this.id;
    }
    public set Id(value: int) {
        this.id = value;
    }

    public get Len(): int {
        return this.len;
    }
    public set Len(value: int) {
        this.len = value;
    }

    public get Type(): short {
        return this.type;
    }
    public set Type(value: short) {
        this.type = value;
    }

    public get Value(): ByteArray {
        return this.value;
    }
    public set Value(value: ByteArray) {
        this.value = value;
    }
}
