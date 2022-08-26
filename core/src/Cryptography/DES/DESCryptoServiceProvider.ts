import { ByteArray, UIntArray, New, int, uint } from '../../float';
import { DES } from "./DES";
import { Override } from "../../Reflection/Decorators/ClassInfo";
import { ICryptoTransform } from "../ICryptoTransform";
import { DESTransform } from "./DESTransform";
import { is } from "../../is";
import { KeyBuilder } from "../KeyBuilder";

export class DESCryptoServiceProvider extends DES {
    public constructor() {
        super();
    }


    public CreateDecryptor(): ICryptoTransform;
    public /* abstract */ CreateDecryptor(rgbKey: ByteArray, rgbIV: ByteArray): ICryptoTransform;
    public CreateDecryptor(...args: any[]) {
        if (args.length === 0) {
            return this.CreateDecryptor(this.Key, this.IV);
        } else if (args.length === 2 && is.ByteArray(args[0]) && is.ByteArray(args[1])) {
            const rgbKey: ByteArray = args[0];
            const rgbIV: ByteArray = args[1];
            return new DESTransform(this, false, rgbKey, rgbIV);
        }
    }


    public CreateEncryptor(): ICryptoTransform;
    public /* abstract */ CreateEncryptor(rgbKey: ByteArray, rgbIV: ByteArray): ICryptoTransform;
    public CreateEncryptor(...args: any[]) {
        if (args.length === 0) {
            return this.CreateEncryptor(this.Key, this.IV);
        } else if (args.length === 2 && is.ByteArray(args[0]) && is.ByteArray(args[1])) {
            const rgbKey: ByteArray = args[0];
            const rgbIV: ByteArray = args[1];
            return new DESTransform(this, true, rgbKey, rgbIV);
        }
    }


    @Override
    public GenerateIV(): void {
        this.IVValue = KeyBuilder.IV(DESTransform.BLOCK_BYTE_SIZE);
    }

    @Override
    public GenerateKey(): void {
        this.KeyValue = DESTransform.GetStrongKey();
    }
}