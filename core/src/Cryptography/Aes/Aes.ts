import { Context } from "../../Context/Context";
import { Exception } from "../../Exception";
import { ClassInfo } from "../../Reflection/Decorators/ClassInfo";
import { System } from "../../SystemTypes";
import { CipherMode, KeySizes, SymmetricAlgorithm } from "../SymmetricAlgorithm";

@ClassInfo({
    fullName: System.Types.Cryptography.Aes,
    instanceof: [
        System.Types.Cryptography.Aes
    ]
})
export abstract class Aes extends SymmetricAlgorithm {
    private static s_legalBlockSizes: KeySizes[] = [new KeySizes(128, 128, 0)];
    private static s_legalKeySizes: KeySizes[] = [new KeySizes(128, 256, 64)];

    /// <summary>
    ///     Setup the default values for AES encryption
    /// </summary>
    protected constructor() {
        super();
        this.LegalBlockSizesValue = Aes.s_legalBlockSizes;
        this.LegalKeySizesValue = Aes.s_legalKeySizes;

        this.BlockSizeValue = 128;
        this.FeedbackSizeValue = 8;
        this.KeySizeValue = 256;
        this.ModeValue = CipherMode.CBC;
    }

    public static Create(): Aes {
        const aes = Context.Current.get('AES');
        if (aes != null) {
            return new aes();
        }
        throw new Exception('No provider for AES');
    }
}