import { New, ByteArray, int } from '../../float';
import { Override } from '../../Reflection/Decorators/ClassInfo';
import { CryptographicException } from '../CryptographicException';
import { KeySizes, SymmetricAlgorithm } from "../SymmetricAlgorithm";
import { TArray } from '../../Extensions/TArray';
import { ArgumentNullException } from '../../Exceptions/ArgumentNullException';
import { ArgumentException } from '../../Exceptions/ArgumentException';
import { Context } from '../../Context/Context';
import { Exception } from '../../Exception';

export abstract class DES extends SymmetricAlgorithm {
    private static readonly keySizeByte: int = 8;

    protected constructor() {
        super();
        this.KeySizeValue = 64;
        this.BlockSizeValue = 64;
        this.FeedbackSizeValue = 8;

        this.LegalKeySizesValue = New.Array(1);
        this.LegalKeySizesValue[0] = new KeySizes(64, 64, 0);

        this.LegalBlockSizesValue = New.Array(1);
        this.LegalBlockSizesValue[0] = new KeySizes(64, 64, 0);
    }

    public static Create(): DES {
        //return new DESCryptoServiceProvider();
        const aes = Context.Current.get('DES');
        if (aes != null) {
            return new aes();
        }
        throw new Exception('No provider for DES');
    }



    // Ek(Ek(m)) = m
    public /* internal */ static readonly weakKeys: ByteArray[] = [
        New.ByteArray([0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01]),
        New.ByteArray([0x1F, 0x1F, 0x1F, 0x1F, 0x0F, 0x0F, 0x0F, 0x0F]),
        New.ByteArray([0xE1, 0xE1, 0xE1, 0xE1, 0xF1, 0xF1, 0xF1, 0xF1]),
        New.ByteArray([0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]),
    ];
    // Ek1(Ek2(m)) = m
    public /* internal */ static readonly semiWeakKeys: ByteArray[] = [
        New.ByteArray([0x00, 0x1E, 0x00, 0x1E, 0x00, 0x0E, 0x00, 0x0E]),
        New.ByteArray([0x00, 0xE0, 0x00, 0xE0, 0x00, 0xF0, 0x00, 0xF0]),
        New.ByteArray([0x00, 0xFE, 0x00, 0xFE, 0x00, 0xFE, 0x00, 0xFE]),
        New.ByteArray([0x1E, 0x00, 0x1E, 0x00, 0x0E, 0x00, 0x0E, 0x00]),
        New.ByteArray([0x1E, 0xE0, 0x1E, 0xE0, 0x0E, 0xF0, 0x0E, 0xF0]),
        New.ByteArray([0x1E, 0xFE, 0x1E, 0xFE, 0x0E, 0xFE, 0x0E, 0xFE]),
        New.ByteArray([0xE0, 0x00, 0xE0, 0x00, 0xF0, 0x00, 0xF0, 0x00]),
        New.ByteArray([0xE0, 0x1E, 0xE0, 0x1E, 0xF0, 0x0E, 0xF0, 0x0E]),
        New.ByteArray([0xE0, 0xFE, 0xE0, 0xFE, 0xF0, 0xFE, 0xF0, 0xFE]),
        New.ByteArray([0xFE, 0x00, 0xFE, 0x00, 0xFE, 0x00, 0xFE, 0x00]),
        New.ByteArray([0xFE, 0x1E, 0xFE, 0x1E, 0xFE, 0x0E, 0xFE, 0x0E]),
        New.ByteArray([0xFE, 0xE0, 0xFE, 0xE0, 0xFE, 0xF0, 0xFE, 0xF0]),
    ];

    public static IsWeakKey(rgbKey: ByteArray): boolean {
        if (rgbKey == null)
            throw new CryptographicException(("Null Key"));
        if (rgbKey.length !== DES.keySizeByte)
            throw new CryptographicException(("Wrong Key Length"));

        // (fast) pre-check with "weak bytes"
        for (let i: int = 0; i < rgbKey.length; i++) {
            switch (rgbKey[i] | 0x11) {
                case 0x11:
                case 0x1F:
                case 0xF1:
                case 0xFF:
                    break;
                default:
                    return false;
            }
        }

        // compare with known weak keys
        for (let i: int = 0; i < (DES.weakKeys.length >> 3); i++) {
            let j: int = 0;
            for (; j < rgbKey.length; j++) {
                if ((rgbKey[j] ^ DES.weakKeys[i][j]) > 1)
                    break;
            }
            if (j === 8)
                return true;
        }
        return false;
    }

    public static IsSemiWeakKey(rgbKey: ByteArray): boolean {
        if (rgbKey == null)
            throw new CryptographicException(("Null Key"));
        if (rgbKey.length !== DES.keySizeByte)
            throw new CryptographicException(("Wrong Key Length"));

        // (fast) pre-check with "weak bytes"
        for (let i: int = 0; i < rgbKey.length; i++) {
            switch (rgbKey[i] | 0x11) {
                case 0x11:
                case 0x1F:
                case 0xF1:
                case 0xFF:
                    break;
                default:
                    return false;
            }
        }

        // compare with known weak keys
        for (let i: int = 0; i < (DES.semiWeakKeys.length >> 3); i++) {
            let j: int = 0;
            for (; j < rgbKey.length; j++) {
                if ((rgbKey[j] ^ DES.semiWeakKeys[i][j]) > 1)
                    break;
            }
            if (j === 8)
                return true;
        }
        return false;
    }

    @Override
    protected Get_Key(): ByteArray {
        if (this.KeyValue == null) {
            // GenerateKey is responsible to return a valid key
            // e.g. no weak or semi-weak keys
            this.GenerateKey();
        }
        return TArray.Clone(this.KeyValue);
    }

    @Override
    protected Set_Key(value: ByteArray) {
        if (value == null)
            throw new ArgumentNullException("Key");
        if (value.length !== DES.keySizeByte)
            throw new ArgumentException(("Wrong Key Length"));
        if (DES.IsWeakKey(value))
            throw new CryptographicException(("Weak Key"));
        if (DES.IsSemiWeakKey(value))
            throw new CryptographicException(("Semi Weak Key"));

        this.KeyValue = TArray.Clone(value);
    }
}