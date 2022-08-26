import { IDisposable } from "../Disposable/IDisposable";
import { Environment } from "../Environment";
import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { TArray } from '../Extensions/TArray';
import { int, ByteArray } from '../float';
import { Virtual, ClassInfo } from '../Reflection/Decorators/ClassInfo';
import { CryptographicException } from "./CryptographicException";
import { ICryptoTransform } from "./ICryptoTransform";
import { TObject } from '../Extensions/TObject';
import { System } from "../SystemTypes";
import { is } from "../is";
import { Exception } from '../Exception';
import { foreach } from "../foreach";

// This enum represents cipher chaining modes: cipher block chaining (CBC),
// electronic code book (ECB), output feedback (OFB), cipher feedback (CFB),
// and ciphertext-stealing (CTS).  Not all implementations will support all modes.
export enum CipherMode {            // Please keep in sync with wincrypt.h
    CBC = 1,
    ECB = 2,
    OFB = 3,
    CFB = 4,
    CTS = 5
}

// This enum represents the padding method to use for filling out short blocks.
// "None" means no padding (whole blocks required).
// "PKCS7" is the padding mode defined in RFC 2898, Section 6.1.1, Step 4, generalized
// to whatever block size is required.
// "Zeros" means pad with zero bytes to fill out the last block.
// "ISO 10126" is the same as PKCS5 except that it fills the bytes before the last one with
// random bytes. "ANSI X.923" fills the bytes with zeros and puts the number of padding
// bytes in the last byte.

export enum PaddingMode {
    None = 1,
    PKCS7 = 2,
    Zeros = 3,
    ANSIX923 = 4,
    ISO10126 = 5
}

export class KeySizes {
    private m_minSize: int = 0;
    private m_maxSize: int = 0;
    private m_skipSize: int = 0;

    public get MinSize(): int {
        return this.m_minSize;
    }

    public get MaxSize(): int {
        return this.m_maxSize;
    }

    public get SkipSize(): int {
        return this.m_skipSize;
    }

    public constructor(minSize: int, maxSize: int, skipSize: int) {
        this.m_minSize = minSize;
        this.m_maxSize = maxSize;
        this.m_skipSize = skipSize;
    }

    public /* internal */  IsLegal(keySize: int): boolean {
        const ks: int = keySize - this.MinSize;
        const result: boolean = ((ks >= 0) && (keySize <= this.MaxSize));
        return ((this.SkipSize === 0) ? result : (result && (ks % this.SkipSize === 0)));
    }

    public /* internal */ static IsLegalKeySize(legalKeys: KeySizes[], size: int): boolean {
        let result: boolean = false;
        foreach(legalKeys, (legalKeySize: KeySizes) => {
            if (legalKeySize.IsLegal(size))
                result = true;
        });
        return result;
    }
}

@ClassInfo({
    fullName: System.Types.Cryptography.SymmetricAlgorithm,
    instanceof: [
        System.Types.Cryptography.SymmetricAlgorithm
    ]
})
export abstract class SymmetricAlgorithm extends TObject {
    protected BlockSizeValue: int = 0;
    protected FeedbackSizeValue: int = 0;
    protected IVValue: ByteArray = null as any;
    protected KeyValue: ByteArray = null as any;
    protected LegalBlockSizesValue: KeySizes[] = null as any;
    protected LegalKeySizesValue: KeySizes[] = null as any;
    protected KeySizeValue: int = 0;
    protected ModeValue: CipherMode = CipherMode.CBC;
    protected PaddingValue: PaddingMode = PaddingMode.PKCS7;

    //
    // protected constructors
    //

    protected constructor() {
        super();
        // Default to cipher block chaining (CipherMode.CBC) and
        // PKCS-style padding (pad n bytes with value n)
        this.ModeValue = CipherMode.CBC;
        this.PaddingValue = PaddingMode.PKCS7;
    }

    // SymmetricAlgorithm implements IDisposable

    // To keep mscorlib compatibility with Orcas, CoreCLR's SymmetricAlgorithm has an explicit IDisposable
    // implementation. Post-Orcas the desktop has an implicit IDispoable implementation.

    public Dispose(): void {
        this.dispose(true);
    }

    public Clear(): void {
        (this as IDisposable).Dispose();
    }

    @Virtual
    protected dispose(disposing: boolean): void {
        if (disposing) {
            // Note: we always want to zeroize the sensitive key material
            if (this.KeyValue != null) {
                TArray.Clear(this.KeyValue, 0, this.KeyValue.length);
                this.KeyValue = null as any;
            }
            if (this.IVValue != null) {
                TArray.Clear(this.IVValue, 0, this.IVValue.length);
                this.IVValue = null as any;
            }
        }
    }


    //
    // public properties
    //
    protected Get_BlockSize(): int {
        return this.BlockSizeValue;
    }
    protected Set_BlockSize(value: int) {
        let i: int;
        let j: int;

        for (i = 0; i < this.LegalBlockSizesValue.length; i++) {
            // If a cipher has only one valid key size, MinSize == MaxSize and SkipSize will be 0
            if (this.LegalBlockSizesValue[i].SkipSize === 0) {
                if (this.LegalBlockSizesValue[i].MinSize === value) { // assume MinSize = MaxSize
                    this.BlockSizeValue = value;
                    this.IVValue = null as any;
                    return;
                }
            } else {
                for (j = this.LegalBlockSizesValue[i].MinSize; j <= this.LegalBlockSizesValue[i].MaxSize;
                    j += this.LegalBlockSizesValue[i].SkipSize) {
                    if (j == value) {
                        if (this.BlockSizeValue !== value) {
                            this.BlockSizeValue = value;
                            this.IVValue = null as any;      // Wrong length now
                        }
                        return;
                    }
                }
            }
        }
        throw new CryptographicException(Environment.GetResourceString("Cryptography_InvalidBlockSize"));
    }
    public get BlockSize(): int {
        return this.Get_BlockSize();
    }
    public set BlockSize(value: int) {
        this.Set_BlockSize(value);
    }

    protected Get_FeedbackSize(): int {
        return this.FeedbackSizeValue;
    }
    protected Set_FeedbackSize(value: int) {
        if (value <= 0 || value > this.BlockSizeValue || (value % 8) !== 0)
            throw new CryptographicException(Environment.GetResourceString("Cryptography_InvalidFeedbackSize"));

        this.FeedbackSizeValue = value;
    }

    public get FeedbackSize(): int {
        return this.Get_FeedbackSize();
    }
    public set FeedbackSize(value: int) {
        this.Set_FeedbackSize(value);
    }

    protected Get_IV(): ByteArray {
        if (this.IVValue == null) {
            this.GenerateIV();
        }
        return TArray.Clone(this.IVValue);
    }

    protected Set_IV(value: ByteArray) {
        if (value == null) throw new ArgumentNullException("value");
        //Contract.EndContractBlock();
        if (value.length !== this.BlockSizeValue / 8)
            throw new CryptographicException(Environment.GetResourceString("Cryptography_InvalidIVSize"));

        this.IVValue = TArray.Clone(value);
    }
    public get IV(): ByteArray {
        return this.Get_IV();
    }
    public set IV(value: ByteArray) {
        this.Set_IV(value);
    }

    protected Get_Key(): ByteArray {
        if (this.KeyValue == null) {
            this.GenerateKey();
        }
        return TArray.Clone(this.KeyValue);
    }
    protected Set_Key(value: ByteArray) {
        if (value == null) {
            throw new ArgumentNullException("value");
        }
        // Contract.EndContractBlock();
        if (!this.ValidKeySize(value.length * 8))
            throw new CryptographicException(Environment.GetResourceString("Cryptography_InvalidKeySize"));

        // must convert bytes to bits
        this.KeyValue = TArray.Clone(value);
        this.KeySizeValue = value.length * 8;
    }

    public get Key(): ByteArray {
        return this.Get_Key();
    }
    public set Key(value: ByteArray) {
        this.Set_Key(value);
    }


    protected Get_LegalBlockSizes(): KeySizes[] {
        return TArray.Clone(this.LegalBlockSizesValue);
    }
    public get LegalBlockSizes(): KeySizes[] {
        return this.Get_LegalBlockSizes();
    }

    protected Get_LegalKeySizes(): KeySizes[] {
        return TArray.Clone(this.LegalKeySizesValue);
    }
    public get LegalKeySizes(): KeySizes[] {
        return this.Get_LegalKeySizes();
    }

    protected Get_KeySize(): int {
        return this.KeySizeValue;
    }
    protected Set_KeySize(value: int) {
        if (!this.ValidKeySize(value))
            throw new CryptographicException(Environment.GetResourceString("Cryptography_InvalidKeySize"));

        this.KeySizeValue = value;
        this.KeyValue = null as any;
    }
    public get KeySize(): int {
        return this.Get_KeySize();
    }
    public set KeySize(value: int) {
        this.Set_KeySize(value);
    }

    protected Get_Mode(): CipherMode {
        return this.ModeValue;
    }

    protected Set_Mode(value: CipherMode) {
        if ((value < CipherMode.CBC) || (CipherMode.CFB < value))
            throw new CryptographicException(Environment.GetResourceString("Cryptography_InvalidCipherMode"));

        this.ModeValue = value;
    }

    public get Mode(): CipherMode {
        return this.Get_Mode();
    }
    public set Mode(value: CipherMode) {
        this.Set_Mode(value);
    }

    protected Get_Padding(): PaddingMode {
        return this.PaddingValue;
    }

    protected Set_Padding(value: PaddingMode) {
        if ((value < PaddingMode.None) || (PaddingMode.ISO10126 < value))
            throw new CryptographicException(Environment.GetResourceString("Cryptography_InvalidPaddingMode"));

        this.PaddingValue = value;
    }
    public get Padding(): PaddingMode {
        return this.Get_Padding();
    }
    public set Padding(value: PaddingMode) {
        this.Set_Padding(value);
    }

    //
    // public methods
    //

    // The following method takes a bit length input and returns whether that length is a valid size
    // according to LegalKeySizes
    public ValidKeySize(bitLength: int): boolean {
        const validSizes: KeySizes[] = this.LegalKeySizes;
        let i: int, j: int;

        if (validSizes == null) {
            return false;
        }
        for (i = 0; i < validSizes.length; i++) {
            if (validSizes[i].SkipSize === 0) {
                if (validSizes[i].MinSize === bitLength) { // assume MinSize = MaxSize
                    return true;
                }
            } else {
                for (j = validSizes[i].MinSize; j <= validSizes[i].MaxSize;
                    j += validSizes[i].SkipSize) {
                    if (j == bitLength) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    public static Create(): SymmetricAlgorithm {
        // use the crypto config system to return an instance of
        // the default SymmetricAlgorithm on this machine
        return null as any;//Create("System.Security.Cryptography.SymmetricAlgorithm");
    }

    /*   public static   Create(String algName):SymmetricAlgorithm {
          return (SymmetricAlgorithm) CryptoConfig.CreateFromName(algName);
      } */


    public CreateDecryptor(): ICryptoTransform;
    public /* abstract */ CreateDecryptor(rgbKey: ByteArray, rgbIV: ByteArray): ICryptoTransform;
    public CreateDecryptor(...args: any[]) {
        if (args.length === 0) {
            return this.CreateDecryptor(this.Key, this.IV);
        } else if (args.length === 2 && is.ByteArray(args[0]) && is.ByteArray(args[1])) {
            throw new Exception('Abstract method can not invoke without implementation.');
        }
    }


    public CreateEncryptor(): ICryptoTransform;
    public /* abstract */ CreateEncryptor(rgbKey: ByteArray, rgbIV: ByteArray): ICryptoTransform;
    public CreateEncryptor(...args: any[]) {
        if (args.length === 0) {
            return this.CreateEncryptor(this.Key, this.IV);
        } else if (args.length === 2 && is.ByteArray(args[0]) && is.ByteArray(args[1])) {
            throw new Exception('Abstract method can not invoke without implementation.');
        }
    }

    public abstract GenerateKey(): void;

    public abstract GenerateIV(): void;
}