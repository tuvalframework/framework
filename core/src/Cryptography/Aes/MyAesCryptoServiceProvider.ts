import { Override } from "../../Reflection/Decorators/ClassInfo";
import { KeyBuilder } from "../KeyBuilder";
import { Aes } from "./Aes";
import { ByteArray } from '../../float';
import { ICryptoTransform } from "../ICryptoTransform";
import { CipherMode } from "../SymmetricAlgorithm";
import { CryptographicException } from "../CryptographicException";
import { ArgumentOutOfRangeException } from "../../Exceptions";
import { is } from "../../is";
import { AesTransform } from "./AesTransform";

export class MyAesCryptoServiceProvider extends Aes {
    public constructor() {
        super();
        this.FeedbackSizeValue = 8;
    }

    @Override
    public GenerateIV(): void {
        this.IVValue = KeyBuilder.IV(this.BlockSizeValue >> 3);
    }

    @Override
    public GenerateKey(): void {
        this.KeyValue = KeyBuilder.Key(this.KeySizeValue >> 3);
    }

    public CreateDecryptor(): ICryptoTransform;
    public /* override */ CreateDecryptor(rgbKey: ByteArray, rgbIV: ByteArray): ICryptoTransform;
    public CreateDecryptor(...args: any[]): ICryptoTransform {
        if (args.length === 0) {
            return this.CreateDecryptor(this.Key, this.IV);
        } else if (args.length === 2 && is.ByteArray(args[0]) && is.ByteArray(args[1])) {
            const rgbKey: ByteArray = args[0];
            const rgbIV: ByteArray = args[1];
            if ((this.Mode === CipherMode.CFB) && (this.FeedbackSize > 64))
                throw new CryptographicException("CFB with Feedbaack > 64 bits");
            return new AesTransform(this, false, rgbKey, rgbIV);
        } else {
            throw new ArgumentOutOfRangeException((this as any).constructor.name + '::' + arguments.callee.toString());
        }
    }

    public CreateEncryptor(): ICryptoTransform;
    public /* override */ CreateEncryptor(rgbKey: ByteArray, rgbIV: ByteArray): ICryptoTransform;
    public CreateEncryptor(...args: any[]): ICryptoTransform {
        if (args.length === 0) {
            return this.CreateEncryptor(this.Key, this.IV);
        } else if (args.length === 2 && is.ByteArray(args[0]) && is.ByteArray(args[1])) {
            const rgbKey: ByteArray = args[0];
            const rgbIV: ByteArray = args[1];
            if ((this.Mode === CipherMode.CFB) && (this.FeedbackSize > 64))
                throw new CryptographicException("CFB with Feedbaack > 64 bits");
            return new AesTransform(this, true, rgbKey, rgbIV);
        } else {
            throw new ArgumentOutOfRangeException((this as any).constructor.name + '::' + arguments.callee.toString());
        }
    }


    // I suppose some attributes differs ?!? because this does not look required

    /*     public override byte[] IV
                {
        get { return base.IV; }
        set { base.IV = value; }
    }

            public override byte[] Key
    {
        get { return base.Key; }
        set { base.Key = value; }
    } */

    /* 		public override int KeySize
    {
        get { return base.KeySize; }
        set { base.KeySize = value; }
    } */

    /* 		public override int FeedbackSize
    {
        get { return base.FeedbackSize; }
        set { base.FeedbackSize = value; }
    }
     */
    @Override
    protected Set_Mode(value: CipherMode) {
        switch (value) {
            case CipherMode.CTS:
                throw new CryptographicException("CTS is not supported");
            default:
                super.Set_Mode(value);
                break;
        }
    }

    /*
        protected override void Dispose(bool disposing)
    {
        base.Dispose(disposing);
    } */
}