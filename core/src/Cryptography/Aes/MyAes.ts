import { Context } from "../../Context/Context";
import { Exception } from "../../Exception";
import { KeySizes, SymmetricAlgorithm } from "../SymmetricAlgorithm";

export abstract class MyAes extends SymmetricAlgorithm {
    public static Create(): MyAes {
        const aes = Context.Current.get('MYAES');
        if (aes != null) {
            return new aes();
        }
        throw new Exception('No provider for MYAES');
        //AesCryptoServiceProvider
    }
    protected constructor() {
        super();
        this.KeySizeValue = 256;
        this.BlockSizeValue = 128;
        this.FeedbackSizeValue = 128;

        this.LegalKeySizesValue = new KeySizes[1];
        this.LegalKeySizesValue[0] = new KeySizes(128, 256, 64);

        this.LegalBlockSizesValue = new KeySizes[1];
        this.LegalBlockSizesValue[0] = new KeySizes(128, 128, 0);
    }
}