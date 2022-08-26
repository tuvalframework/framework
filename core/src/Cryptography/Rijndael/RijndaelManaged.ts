import { ClassInfo, Override } from "../../Reflection/Decorators/ClassInfo";
import { Rijndael } from "./Rijndael";
import { ByteArray, int } from '../../float';
import { ICryptoTransform } from "../ICryptoTransform";
import { CipherMode } from "../SymmetricAlgorithm";
import { RijndaelManagedTransformMode } from "./RijndaelManagedTransformMode";
import { RijndaelManagedTransform } from "./RijndaelManagedTransform";
import { CryptographyUtils } from "../Aes/AESprng";
import { System } from "../../SystemTypes";
import { is } from "../../is";
import { ArgumentOutOfRangeException } from '../../Exceptions/ArgumentOutOfRangeException';

@ClassInfo({
    fullName: System.Types.Cryptography.RijndaelManaged,
    instanceof: [
        System.Types.Cryptography.RijndaelManaged
    ]
})
export class RijndaelManaged extends Rijndael {
    public constructor() {
        super();
    }


    public CreateEncryptor(): ICryptoTransform;
    public /* override */ CreateEncryptor(rgbKey: ByteArray, rgbIV: ByteArray): ICryptoTransform;
    public CreateEncryptor(...args: any[]):ICryptoTransform {
        if (args.length === 0) {
            return super.CreateEncryptor(this.Key, this.IV);
        } else if (args.length === 2 && is.ByteArray(args[0]) && is.ByteArray(args[1])) {
            const rgbKey: ByteArray = args[0];
            const rgbIV: ByteArray = args[1];
            return this.NewEncryptor(rgbKey,
                this.ModeValue,
                rgbIV,
                this.FeedbackSizeValue,
                RijndaelManagedTransformMode.Encrypt);
        } else {
            throw new ArgumentOutOfRangeException((this as any).constructor.name + '::' + arguments.callee.toString());
        }
    }

    public CreateDecryptor(): ICryptoTransform;
    public /* override */ CreateDecryptor(rgbKey: ByteArray, rgbIV: ByteArray): ICryptoTransform;
    public CreateDecryptor(...args: any[]): ICryptoTransform {
        if (args.length === 0) {
            return super.CreateDecryptor(this.Key, this.IV);
        } else if (args.length === 2 && is.ByteArray(args[0]) && is.ByteArray(args[1])) {
            const rgbKey: ByteArray = args[0];
            const rgbIV: ByteArray = args[1];
            return this.NewEncryptor(rgbKey,
                this.ModeValue,
                rgbIV,
                this.FeedbackSizeValue,
                RijndaelManagedTransformMode.Decrypt);
        } else {
            throw new ArgumentOutOfRangeException((this as any).constructor.name + '::' + arguments.callee.toString());
        }
    }

    @Override
    public GenerateKey(): void {
        this.KeyValue = CryptographyUtils.GenerateRandom(this.KeySizeValue / 8);
    }

    @Override
    public GenerateIV(): void {
        this.IVValue = CryptographyUtils.GenerateRandom(this.BlockSizeValue / 8);
    }

    private NewEncryptor(rgbKey: ByteArray, mode: CipherMode, rgbIV: ByteArray, feedbackSize: int, encryptMode: RijndaelManagedTransformMode): ICryptoTransform {
        // Build the key if one does not already exist
        if (rgbKey == null) {
            rgbKey = CryptographyUtils.GenerateRandom(this.KeySizeValue / 8);
        }

        // If not ECB mode, make sure we have an IV. In CoreCLR we do not support ECB, so we must have
        // an IV in all cases.
        if (mode !== CipherMode.ECB) {
            if (rgbIV == null) {
                rgbIV = CryptographyUtils.GenerateRandom(this.BlockSizeValue / 8);
            }
        }

        // Create the encryptor/decryptor object
        return new RijndaelManagedTransform(rgbKey,
            mode,
            rgbIV,
            this.BlockSizeValue,
            feedbackSize,
            this.PaddingValue,
            encryptMode);
    }
}