import { ByteArray } from "../../float";
import { KeyBuilder } from "../KeyBuilder";
import { SHA256Managed } from "../SHA256/SHA256Managed";
import { HMAC } from "./HMAC"

export class HMACSHA256 extends HMAC {
    public constructor(key: ByteArray = KeyBuilder.Key(8)) {
        super();
        this.SetHash("SHA256", new SHA256Managed());
        this.HashSizeValue = 256;
        this.Key = key;
    }
}