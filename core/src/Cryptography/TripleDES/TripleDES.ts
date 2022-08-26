import { Context } from "../../Context/Context";
import { Exception } from "../../Exception";
import { ArgumentNullException } from "../../Exceptions/ArgumentNullException";
import { TArray } from "../../Extensions/TArray";
import { ByteArray, int } from "../../float";
import { Override } from "../../Reflection/Decorators/ClassInfo";
import { CryptographicException } from "../CryptographicException";
import { KeySizes, SymmetricAlgorithm } from "../SymmetricAlgorithm";

export abstract class TripleDES extends SymmetricAlgorithm {
    protected constructor() {
        super();
        // from SymmetricAlgorithm
        this.KeySizeValue = 192;
        this.BlockSizeValue = 64;
        this.FeedbackSizeValue = 8;

        this.LegalKeySizesValue = new Array(1);
        this.LegalKeySizesValue[0] = new KeySizes(128, 192, 64);

        this.LegalBlockSizesValue = new Array(1);
        this.LegalBlockSizesValue[0] = new KeySizes(64, 64, 0);
    }

    @Override
    public Get_Key(): ByteArray {
        if (this.KeyValue == null) {
            // generate keys as long as we get weak keys
            this.GenerateKey();
            while (TripleDES.IsWeakKey(this.KeyValue)) {
                this.GenerateKey();
            }
        }
        return TArray.Clone(this.KeyValue);
    }
    @Override
    public Set_Key(value: ByteArray) {
        if (value == null)
            throw new ArgumentNullException("Key");
        // this will check for both key size and weak keys
        if (TripleDES.IsWeakKey(value))
            throw new CryptographicException("Weak Key");
        this.KeyValue = TArray.Clone(value);
    }


    // Triple DES is DES in EDE = Encrypt - Decrypt - Encrypt
    // with 2 keys (a,b)
    //	EDE = Encrypt (a) - Decrypt (b) - Encrypt (a)
    //	if a == b then TripleDES == DES(a) (hence weak key)
    // with 3 keys (a,b,c)
    //	EDE = Encrypt (a) - Decrypt (b) - Encrypt (c)
    //	if ( a == b ) then TripleDES == DES(c) (hence weak key)
    //	if ( b == c ) then TripleDES == DES(a) (hence weak key)
    public static IsWeakKey(rgbKey: ByteArray): boolean {
        if (rgbKey == null)
            throw new CryptographicException(("Null Key"));
        // 128 bits (16 bytes) is 3 DES with 2 keys
        if (rgbKey.length === 16) {
            // weak if first half == second half
            for (let i: int = 0; i < 8; i++) {
                if (rgbKey[i] !== rgbKey[i + 8]) {
                    return false;
                }
            }
        }
        // 192 bits (24 bytes) is 3 DES with 3 keys
        else if (rgbKey.length === 24) {
            let bFirstCase: boolean = true;
            // weak if first third == second third
            for (let i: int = 0; i < 8; i++) {
                if (rgbKey[i] !== rgbKey[i + 8]) {
                    bFirstCase = false;
                    break;
                }
            }
            // weak if second third == third third
            if (!bFirstCase) {
                for (let i: int = 8; i < 16; i++) {
                    if (rgbKey[i] != rgbKey[i + 8])
                        return false;
                }
            }
        }
        else
            throw new CryptographicException("Wrong Key Length");

        return true;
    }

    public static Create(): TripleDES {
        //return new TripleDESCryptoServiceProvider();
        const aes = Context.Current.get('TripleDES');
        if (aes != null) {
            return new aes();
        }
        throw new Exception('No provider for TripleDES');
    }
}