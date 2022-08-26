import { Context } from "../../Context";
import { Exception } from "../../Exception";
import { int } from "../../float";
import { Override, Virtual } from "../../Reflection/Decorators/ClassInfo";
import { KeySizes, SymmetricAlgorithm } from "../SymmetricAlgorithm";

export abstract class RC2 extends SymmetricAlgorithm {
    public static Create(): RC2 {
        //return new RC2CryptoServiceProvider();
        //return new DESCryptoServiceProvider();
        const aes = Context.Current.get('RC2');
        if (aes != null) {
            return new aes();
        }
        throw new Exception('No provider for RC2');
    }

    protected EffectiveKeySizeValue: int = 0;

    @Virtual
    protected Get_EffectiveKeySize(): int {
        if (this.EffectiveKeySizeValue == 0)
            return this.KeySizeValue;
        else
            return this.EffectiveKeySizeValue;
    }

    protected Set_EffectiveKeySize(value: int) {
        this.EffectiveKeySizeValue = value;
    }
    public get EffectiveKeySize(): int {
        return this.Get_EffectiveKeySize();
    }
    public set EffectiveKeySize(value: int) {
        this.Set_EffectiveKeySize(value);
    }

    @Override
    protected Set_KeySize(value: int) {
        super.Set_KeySize(value);
        this.EffectiveKeySizeValue = value;
    }

    protected constructor() {
        super();
        this.KeySizeValue = 128;
        this.BlockSizeValue = 64;
        this.FeedbackSizeValue = 8;

        // The RFC allows keys of 1 to 128 bytes, but MS impl only supports
        // 40 to 128 bits, sigh.
        this.LegalKeySizesValue = new Array(1);
        this.LegalKeySizesValue[0] = new KeySizes(40, 128, 8);

        this.LegalBlockSizesValue = new Array(1);
        this.LegalBlockSizesValue[0] = new KeySizes(64, 64, 0);
    }
}