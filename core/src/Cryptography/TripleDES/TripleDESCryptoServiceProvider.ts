import { TArray } from "../../Extensions/TArray";
import { ByteArray, int, New } from "../../float";
import { is } from "../../is";
import { Override } from "../../Reflection/Decorators/ClassInfo";
import { CryptographicException } from "../CryptographicException";
import { DES } from "../DES/DES";
import { DESTransform } from "../DES/DESTransform";
import { ICryptoTransform } from "../ICryptoTransform";
import { KeyBuilder } from "../KeyBuilder";
import { CipherMode } from "../SymmetricAlgorithm";
import { SymmetricTransform } from "../SymmetricTransform";
import { TripleDES } from "./TripleDES";

export class TripleDESCryptoServiceProvider extends TripleDES {
    public constructor() {
        super();
    }

    @Override
    public GenerateIV(): void {
        this.IVValue = KeyBuilder.IV(this.BlockSizeValue >> 3);
    }

    @Override
    public GenerateKey(): void {
        this.KeyValue = TripleDESTransform.GetStrongKey();
    }

    public CreateDecryptor(): ICryptoTransform;
    public /* override */ CreateDecryptor(rgbKey: ByteArray, rgbIV: ByteArray): ICryptoTransform;
    public CreateDecryptor(...args: any[]) {
        if (args.length === 0) {
            return this.CreateDecryptor(this.Key, this.IV);
        } else if (args.length === 2 && is.ByteArray(args[0]) && is.ByteArray(args[1])) {
            const rgbKey: ByteArray = args[0];
            const rgbIV: ByteArray = args[1];
            return new TripleDESTransform(this, false, rgbKey, rgbIV);
        }
    }

    public CreateEncryptor(): ICryptoTransform;
    public /* override */ CreateEncryptor(rgbKey: ByteArray, rgbIV: ByteArray): ICryptoTransform;
    public CreateEncryptor(...args: any[]) {
        if (args.length === 0) {
            return this.CreateEncryptor(this.Key, this.IV);
        } else if (args.length === 2 && is.ByteArray(args[0]) && is.ByteArray(args[1])) {
            const rgbKey: ByteArray = args[0];
            const rgbIV: ByteArray = args[1];
            return new TripleDESTransform(this, true, rgbKey, rgbIV);
        }
    }

}

// TripleDES is just DES-EDE
export class TripleDESTransform extends SymmetricTransform {
    // for encryption
    private E1: DESTransform = null as any;
    private D2: DESTransform = null as any;
    private E3: DESTransform = null as any;

    // for decryption
    private D1: DESTransform = null as any;
    private E2: DESTransform = null as any;
    private D3: DESTransform = null as any;

    public constructor(algo: TripleDES, encryption: boolean, key: ByteArray, iv: ByteArray) {
        super(algo, encryption, iv);
        if (key == null)
            key = TripleDESTransform.GetStrongKey();
        // note: checking weak keys also checks valid key length
        if (TripleDES.IsWeakKey(key)) {
            const msg: string = "This is a known weak key.";
            throw new CryptographicException(msg);
        }

        const key1: ByteArray = New.ByteArray(8);
        const key2: ByteArray = New.ByteArray(8);
        const key3: ByteArray = New.ByteArray(8);
        const des: DES = DES.Create();
        TArray.Copy(key, 0, key1, 0, 8);
        TArray.Copy(key, 8, key2, 0, 8);
        if (key.length === 16)
            TArray.Copy(key, 0, key3, 0, 8);
        else
            TArray.Copy(key, 16, key3, 0, 8);

        // note: some modes (like CFB) requires encryption when decrypting
        if ((encryption) || (algo.Mode === CipherMode.CFB)) {
            this.E1 = new DESTransform(des, true, key1, iv);
            this.D2 = new DESTransform(des, false, key2, iv);
            this.E3 = new DESTransform(des, true, key3, iv);
        }
        else {
            this.D1 = new DESTransform(des, false, key3, iv);
            this.E2 = new DESTransform(des, true, key2, iv);
            this.D3 = new DESTransform(des, false, key1, iv);
        }
    }

    // note: this method is garanteed to be called with a valid blocksize
    // for both input and output
    @Override
    protected ECB(input: ByteArray, output: ByteArray) {
        DESTransform.Permutation(input, output, DESTransform.ipTab, false);
        if (this.encrypt) {
            this.E1.ProcessBlock(output, output);
            this.D2.ProcessBlock(output, output);
            this.E3.ProcessBlock(output, output);
        }
        else {
            this.D1.ProcessBlock(output, output);
            this.E2.ProcessBlock(output, output);
            this.D3.ProcessBlock(output, output);
        }
        DESTransform.Permutation(output, output, DESTransform.fpTab, true);
    }

    public static GetStrongKey(): ByteArray {
        const size: int = DESTransform.BLOCK_BYTE_SIZE * 3;
        let key: ByteArray = KeyBuilder.Key(size);
        while (TripleDES.IsWeakKey(key))
            key = KeyBuilder.Key(size);
        return key;
    }
}