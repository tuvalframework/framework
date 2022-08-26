import { IDisposable } from '../../Disposable/IDisposable';
import { ArgumentException } from '../../Exceptions/ArgumentException';
import { ArgumentNullException } from '../../Exceptions/ArgumentNullException';
import { ArgumentOutOfRangeException } from '../../Exceptions/ArgumentOutOfRangeException';
import { int, ByteArray } from '../../float';
import { is } from '../../is';
import { ClassInfo, Override } from "../../Reflection/Decorators/ClassInfo";
import { SR } from '../../SR';
import { System } from '../../SystemTypes';
import { CryptographicException } from '../CryptographicException';
import { ICryptoTransform } from '../ICryptoTransform';
import { RijndaelManaged } from "../Rijndael/RijndaelManaged";
import { CipherMode, PaddingMode } from '../SymmetricAlgorithm';
import { Aes } from "./Aes";

@ClassInfo({
    fullName: System.Types.Cryptography.AesManaged,
    instanceof: [
        System.Types.Cryptography.AesManaged
    ]
})
export class AesManaged extends Aes {
    private m_rijndael: RijndaelManaged = null as any;

    public constructor() {
        super();
        //Contract.Ensures(m_rijndael != null);

        /* if (CryptoConfig.AllowOnlyFipsAlgorithms) {
            throw new InvalidOperationException(SR.GetString(SR.Cryptography_NonCompliantFIPSAlgorithm));
        } */

        this.m_rijndael = new RijndaelManaged();
        this.m_rijndael.BlockSize = this.BlockSize;
        this.m_rijndael.KeySize = this.KeySize;
    }

    @Override
    protected Get_FeedbackSize(): int {
        return this.m_rijndael.FeedbackSize;
    }

    @Override
    protected Set_FeedbackSize(value: int) {
        this.m_rijndael.FeedbackSize = value;
    }

    @Override
    protected Get_IV(): ByteArray {
        return this.m_rijndael.IV;
    }

    @Override
    protected Set_IV(value: ByteArray) {
        this.m_rijndael.IV = value;
    }

    @Override
    protected Get_Key(): ByteArray {
        return this.m_rijndael.Key;
    }

    @Override
    protected Set_Key(value: ByteArray) {
        this.m_rijndael.Key = value;
    }

    @Override
    protected Get_KeySize(): int {
        return this.m_rijndael.KeySize;
    }

    @Override
    protected Set_KeySize(value: int) {
        this.m_rijndael.KeySize = value;
    }


    @Override
    protected Get_Mode(): CipherMode {
        return this.m_rijndael.Mode;
    }

    @Override
    protected Set_Mode(value: CipherMode) {
        //Contract.Ensures(this.m_rijndael.Mode != CipherMode.CFB && this.m_rijndael.Mode != CipherMode.OFB);

        // RijndaelManaged will implicitly change the block size of an algorithm to match the number
        // of feedback bits being used. Since AES requires a block size of 128 bits, we cannot allow
        // the user to use the feedback modes, as this will end up breaking that invarient.
        if (value == CipherMode.CFB || value == CipherMode.OFB) {
            throw new CryptographicException(SR.GetString(SR.Cryptography_InvalidCipherMode));
        }

        this.m_rijndael.Mode = value;
    }


    @Override
    protected Get_Padding(): PaddingMode {
        return this.m_rijndael.Padding;
    }

    @Override
    protected Set_Padding(value: PaddingMode) {
        this.m_rijndael.Padding = value;
    }



    /* public override ICryptoTransform CreateDecryptor() {
    return m_rijndael.CreateDecryptor();
} */

    public CreateDecryptor(): ICryptoTransform;
    public /* override */ CreateDecryptor(rgbKey: ByteArray, rgbIV: ByteArray): ICryptoTransform;
    public CreateDecryptor(...args: any[]): ICryptoTransform {
        if (args.length === 0) {
            return super.CreateDecryptor(this.Key, this.IV);
        } else if (args.length === 2 && is.ByteArray(args[0]) && is.ByteArray(args[1])) {
            const key: ByteArray = args[0];
            const iv: ByteArray = args[1];
            if (key == null) {
                throw new ArgumentNullException("key");
            }
            if (!this.ValidKeySize(key.length * 8)) {
                throw new ArgumentException(SR.GetString(SR.Cryptography_InvalidKeySize), "key");
            }
            if (iv != null && iv.length * 8 !== this.BlockSizeValue) {
                throw new ArgumentException(SR.GetString(SR.Cryptography_InvalidIVSize), "iv");
            }

            return this.m_rijndael.CreateDecryptor(key, iv);
        } else {
            throw new ArgumentOutOfRangeException((this as any).constructor.name + '::' + arguments.callee.toString());
        }
    }



    public CreateEncryptor(): ICryptoTransform;
    public /* override */ CreateEncryptor(rgbKey: ByteArray, rgbIV: ByteArray): ICryptoTransform;
    public CreateEncryptor(...args: any[]):ICryptoTransform {
        if (args.length === 0) {
            return super.CreateEncryptor(this.Key, this.IV);
        } else if (args.length === 2 && is.ByteArray(args[0]) && is.ByteArray(args[1])) {
            const key: ByteArray = args[0];
            const iv: ByteArray = args[1];
            if (key == null) {
                throw new ArgumentNullException("key");
            }
            if (!this.ValidKeySize(key.length * 8)) {
                throw new ArgumentException(SR.GetString(SR.Cryptography_InvalidKeySize), "key");
            }
            if (iv != null && iv.length * 8 !== this.BlockSizeValue) {
                throw new ArgumentException(SR.GetString(SR.Cryptography_InvalidIVSize), "iv");
            }
            return this.m_rijndael.CreateEncryptor(key, iv);
        } else {
            throw new ArgumentOutOfRangeException((this as any).constructor.name + '::' + arguments.callee.toString());
        }
    }


    @Override
    protected dispose(disposing: boolean): void {
        try {
            if (disposing) {
                (this.m_rijndael as IDisposable).Dispose();
            }
        }
        finally {
            super.dispose(disposing);
        }
    }

    @Override
    public GenerateIV(): void {
        this.m_rijndael.GenerateIV();
    }

    @Override
    public GenerateKey(): void {
        this.m_rijndael.GenerateKey();
    }
}