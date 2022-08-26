import { Context } from "../Context/Context";
import { Exception } from "../Exception";
import { TArray } from "../Extensions/TArray";
import { ByteArray } from "../float";
import { Override, Virtual } from "../Reflection/Decorators/ClassInfo";
import { CryptographicException } from "./CryptographicException";
import { HashAlgorithm } from "./HashAlgorithm";

export abstract class KeyedHashAlgorithm extends HashAlgorithm {

    protected KeyValue: ByteArray = null as any;

    protected constructor() {
        super();
        // create a random 64 bits key
    }

    @Virtual
    protected Get_Key(): ByteArray {
        return TArray.Clone(this.KeyValue);
    }


    @Virtual
    protected Set_Key(value: ByteArray) {
        // can't change the key during a hashing ops
        if (this.State !== 0) {
            throw new CryptographicException("Key can't be changed at this state.");
        }
        // zeroize current key material for security
        this.ZeroizeKey();
        // copy new key
        this.KeyValue = TArray.Clone(value);
    }

    public get Key(): ByteArray {
        return this.Get_Key();
    }

    public set Key(value: ByteArray) {
        this.Set_Key(value);
    }

    @Override
    protected dispose(disposing: boolean): void {
        // zeroize key material for security
        this.ZeroizeKey();
        // dispose managed resources
        // none so far
        // dispose unmanaged resources
        // none so far
        // calling base class HashAlgorithm
        super.dispose(disposing);
    }

    private ZeroizeKey(): void {
        if (this.KeyValue != null)
            TArray.Clear(this.KeyValue, 0, this.KeyValue.length);
    }

    public static Create(): KeyedHashAlgorithm {
        const sha1 = Context.Current.get('HMACSHA1');
        if (sha1 != null) {
            return new sha1();
        }
        throw new Exception('No provider for HMACSHA1');
    }
}