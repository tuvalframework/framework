import { ByteArray } from "../../float";
import { KeyBuilder } from "../KeyBuilder";
import { SHA1Managed } from "../SHA1/SHA1Managed";
import { HMAC } from "./HMAC";

export class HMACSHA1 extends HMAC {
    public constructor(key: ByteArray = KeyBuilder.Key(8)) {
        super();
        this.SetHash("SHA1", new SHA1Managed());
        this.HashSizeValue = 160;
        this.Key = key;
    }

   /*  public HMACSHA1(byte[] key, bool useManagedSha1) {
        HashName = "SSMono.Security.Cryptography.SHA1" + (useManagedSha1 ? "Managed" : "CryptoServiceProvider");
        HashSizeValue = 160;
        Key = key;
    } */
}