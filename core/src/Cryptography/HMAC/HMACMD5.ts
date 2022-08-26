import { ByteArray } from "../../float";
import { KeyBuilder } from "../KeyBuilder";
import { MD5CryptoServiceProvider } from "../MD5/MD5CryptoServiceProvider";
import { HMAC } from "./HMAC"

export class HMACMD5 extends HMAC {

    public constructor(key: ByteArray = KeyBuilder.Key(8)) {
        super();
        this.SetHash("MD5", new MD5CryptoServiceProvider());
        this.HashSizeValue = 128;
        this.Key = key;
    }
}