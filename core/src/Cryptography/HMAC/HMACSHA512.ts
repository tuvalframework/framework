import { ByteArray } from "../../float";
import { KeyBuilder } from "../KeyBuilder";
import { SHA512Managed } from "../SHA512/SHA512Managed";
import { HMAC } from "./HMAC";

export class HMACSHA512 extends HMAC {
    private legacy: boolean = false;



    public constructor(key: ByteArray = KeyBuilder.Key(8)) {
        super();
        this.BlockSizeValue = 128;
        this.SetHash("SHA512", new SHA512Managed());
        this.HashSizeValue = 512;
        this.Key = key;
    }

    // this property will appear in the next .NET service pack
    // http://blogs.msdn.com/shawnfa/archive/2007/01/31/please-do-not-use-the-net-2-0-hmacsha512-and-hmacsha384-classes.aspx
    public get ProduceLegacyHmacValues(): boolean {
        return this.legacy;
    }
    public set ProduceLegacyHmacValues(value: boolean) {
        {
            this.legacy = value;
            this.BlockSizeValue = this.legacy ? 64 : 128;
        }
    }
}