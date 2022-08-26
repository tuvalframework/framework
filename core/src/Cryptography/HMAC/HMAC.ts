import { byte } from "../../byte";
import { Context } from "../../Context/Context";
import { Convert } from "../../convert";
import { ObjectDisposedException } from "../../Disposable/ObjectDisposedException";
import { Exception } from "../../Exception";
import { TArray } from "../../Extensions/TArray";
import { ByteArray, int, New } from "../../float";
import { Override } from "../../Reflection/Decorators/ClassInfo";
import { HashAlgorithm } from "../HashAlgorithm";
import { BlockProcessor } from "../KeyBuilder";
import { KeyedHashAlgorithm } from "../KeyedHashAlgorithm";

export abstract class HMAC extends KeyedHashAlgorithm {

    private _disposed: boolean = false;
    private _hashName: string = '';
    private _algo: HashAlgorithm = null as any;
    private _block: BlockProcessor = null as any;
    private _blockSizeValue: int = 0;

    // constructors

    protected constructor() {
        super();
        this._disposed = false;
        this._blockSizeValue = 64;
    }

    // properties

    protected get BlockSizeValue(): int {
        return this._blockSizeValue;
    }
    protected set BlockSizeValue(value: int) {
        this._blockSizeValue = value;
    }

    public get HashName(): string {
        return this._hashName;
    }
    public set HashName(value: string) {
        this._hashName = value;
        throw new Exception('HashName not set.');
        //this._algo = HashAlgorithm.Create(this._hashName);
    }

    protected Set_Key(value: ByteArray) {
        if ((value != null) && (value.length > this.BlockSizeValue))
            super.Set_Key(this._algo.ComputeHash(value));
        else
            super.Set_Key(TArray.Clone(value));
    }


    public /* internal */ get Block(): BlockProcessor {
        if (this._block == null)
            this._block = new BlockProcessor(this._algo, (this.BlockSizeValue >> 3));
        return this._block;
    }

    // methods

    private KeySetup(key: ByteArray, padding: byte): ByteArray {
        const buf: ByteArray = New.ByteArray(this.BlockSizeValue);

        for (let i: int = 0; i < key.length; ++i)
            buf[i] = Convert.ToByte(key[i] ^ padding);

        for (let i: int = key.length; i < this.BlockSizeValue; ++i)
            buf[i] = padding;

        return buf;
    }

    @Override
    protected dispose(disposing: boolean): void {
        if (!this._disposed) {
            this._disposed = true;
            super.dispose(disposing);
        }
    }

    @Override
    protected HashCore(rgb: ByteArray, ib: int, cb: int): void {
        if (this._disposed)
            throw new ObjectDisposedException("HMACSHA1");

        if (this.State === 0) {
            this.Initialize();
            this.State = 1;
        }
        this.Block.Core(rgb, ib, cb);
    }

    protected HashFinal(): ByteArray {
        if (this._disposed)
            throw new ObjectDisposedException("HMAC");
        this.State = 0;

        this.Block.Final();
        const intermediate: ByteArray = this._algo.Hash;

        const buf: ByteArray = this.KeySetup(this.Key, 0x5C);
        this._algo.Initialize();
        this._algo.TransformBlock(buf, 0, buf.length, buf, 0);
        this._algo.TransformFinalBlock(intermediate, 0, intermediate.length);
        const hash: ByteArray = this._algo.Hash;
        this._algo.Initialize();
        // zeroize sensitive data
        TArray.Clear(buf, 0, buf.length);
        TArray.Clear(intermediate, 0, intermediate.length);
        return hash;
    }

    @Override
    public Initialize(): void {
        if (this._disposed)
            throw new ObjectDisposedException("HMAC");

        this.State = 0;
        this.Block.Initialize();
        const buf: ByteArray = this.KeySetup(this.Key, 0x36);
        this._algo.Initialize();
        this.Block.Core(buf);
        // zeroize key
        TArray.Clear(buf, 0, buf.length);
    }


    // Allow using HMAC without bringing (most of) the whole crypto stack (using CryptoConfig)
    // or even without bringing all the hash algorithms (using a common switch)
    public /* internal */  SetHash(name: string, instance: HashAlgorithm): void {
        this._hashName = name;
        this._algo = instance;
    }
    // static methods

    public static  Create():HMAC {
        const sha1 = Context.Current.get('HMACSHA1');
        if (sha1 != null) {
            return new sha1();
        }
        throw new Exception('No provider for HMACSHA1');
    }
}