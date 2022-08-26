import { Convert } from "../../convert";
import { TString } from "../../Extensions";
import { TArray } from "../../Extensions/TArray";
import { ByteArray, int, New, uint16, UInt16Array } from "../../float";
import { is } from "../../is";
import { Override } from "../../Reflection/Decorators/ClassInfo";
import { CryptographicException } from "../CryptographicException";
import { CryptographicUnexpectedOperationException } from "../CryptographicUnexpectedOperationException";
import { ICryptoTransform } from "../ICryptoTransform";
import { KeyBuilder } from "../KeyBuilder";
import { KeySizes } from "../SymmetricAlgorithm";
import { SymmetricTransform } from "../SymmetricTransform";
import { RC2 } from "./RC2";

export class RC2CryptoServiceProvider extends RC2 {
    private _useSalt: boolean = false;



    public constructor() {
        super();
    }

    @Override
    protected Set_EffectiveKeySize(value: int) {
        if (value !== this.KeySizeValue) {
            throw new CryptographicUnexpectedOperationException(("Effective key size must match key size for compatibility"));
        }
        super.Set_EffectiveKeySize(value);
    }

    public CreateDecryptor(): ICryptoTransform;
    public /* override */ CreateDecryptor(rgbKey: ByteArray, rgbIV: ByteArray): ICryptoTransform;
    public CreateDecryptor(...args: any[]) {
        if (args.length === 0) {
            return this.CreateDecryptor(this.Key, this.IV);
        } else if (args.length === 2 && is.ByteArray(args[0]) && is.ByteArray(args[1])) {
            const rgbKey: ByteArray = args[0]
            const rgbIV: ByteArray = args[1];
            return new RC2Transform(this, false, rgbKey, rgbIV);
        }
    }

    public CreateEncryptor(): ICryptoTransform;
    public /* override */ CreateEncryptor(rgbKey: ByteArray, rgbIV: ByteArray): ICryptoTransform;
    public CreateEncryptor(...args: any[]) {
        if (args.length === 0) {
            return this.CreateEncryptor(this.Key, this.IV);
        } else if (args.length === 2 && is.ByteArray(args[0]) && is.ByteArray(args[1])) {
            const rgbKey: ByteArray = args[0]
            const rgbIV: ByteArray = args[1];
            return new RC2Transform(this, true, rgbKey, rgbIV);
        }
    }


    @Override
    public GenerateIV(): void {
        this.IVValue = KeyBuilder.IV(this.BlockSizeValue >> 3);
    }

    @Override
    public GenerateKey(): void {
        this.KeyValue = KeyBuilder.Key(this.KeySizeValue >> 3);
    }


    public get UseSalt(): boolean {
        return this._useSalt;
    }
    public set UseSalt(value: boolean) {
        this._useSalt = value;
    }
}

export class RC2Transform extends SymmetricTransform {
    private R0: uint16 = 0;
    private R1: uint16 = 0;
    private R2: uint16 = 0;
    private R3: uint16 = 0; // state
    private K: UInt16Array = null as any; // expanded key
    private j: int = 0; // Key indexer

    private static readonly pitable: ByteArray = New.ByteArray([
        0xd9, 0x78, 0xf9, 0xc4, 0x19, 0xdd, 0xb5, 0xed, 0x28, 0xe9, 0xfd, 0x79, 0x4a, 0xa0, 0xd8, 0x9d, 0xc6, 0x7e, 0x37, 0x83, 0x2b, 0x76, 0x53, 0x8e, 0x62, 0x4c,
        0x64, 0x88, 0x44, 0x8b, 0xfb, 0xa2, 0x17, 0x9a, 0x59, 0xf5, 0x87, 0xb3, 0x4f, 0x13, 0x61, 0x45, 0x6d, 0x8d, 0x09, 0x81, 0x7d, 0x32, 0xbd, 0x8f, 0x40, 0xeb,
        0x86, 0xb7, 0x7b, 0x0b, 0xf0, 0x95, 0x21, 0x22, 0x5c, 0x6b, 0x4e, 0x82, 0x54, 0xd6, 0x65, 0x93, 0xce, 0x60, 0xb2, 0x1c, 0x73, 0x56, 0xc0, 0x14, 0xa7, 0x8c,
        0xf1, 0xdc, 0x12, 0x75, 0xca, 0x1f, 0x3b, 0xbe, 0xe4, 0xd1, 0x42, 0x3d, 0xd4, 0x30, 0xa3, 0x3c, 0xb6, 0x26, 0x6f, 0xbf, 0x0e, 0xda, 0x46, 0x69, 0x07, 0x57,
        0x27, 0xf2, 0x1d, 0x9b, 0xbc, 0x94, 0x43, 0x03, 0xf8, 0x11, 0xc7, 0xf6, 0x90, 0xef, 0x3e, 0xe7, 0x06, 0xc3, 0xd5, 0x2f, 0xc8, 0x66, 0x1e, 0xd7, 0x08, 0xe8,
        0xea, 0xde, 0x80, 0x52, 0xee, 0xf7, 0x84, 0xaa, 0x72, 0xac, 0x35, 0x4d, 0x6a, 0x2a, 0x96, 0x1a, 0xd2, 0x71, 0x5a, 0x15, 0x49, 0x74, 0x4b, 0x9f, 0xd0, 0x5e,
        0x04, 0x18, 0xa4, 0xec, 0xc2, 0xe0, 0x41, 0x6e, 0x0f, 0x51, 0xcb, 0xcc, 0x24, 0x91, 0xaf, 0x50, 0xa1, 0xf4, 0x70, 0x39, 0x99, 0x7c, 0x3a, 0x85, 0x23, 0xb8,
        0xb4, 0x7a, 0xfc, 0x02, 0x36, 0x5b, 0x25, 0x55, 0x97, 0x31, 0x2d, 0x5d, 0xfa, 0x98, 0xe3, 0x8a, 0x92, 0xae, 0x05, 0xdf, 0x29, 0x10, 0x67, 0x6c, 0xba, 0xc9,
        0xd3, 0x00, 0xe6, 0xcf, 0xe1, 0x9e, 0xa8, 0x2c, 0x63, 0x16, 0x01, 0x3f, 0x58, 0xe2, 0x89, 0xa9, 0x0d, 0x38, 0x34, 0x1b, 0xab, 0x33, 0xff, 0xb0, 0xbb, 0x48,
        0x0c, 0x5f, 0xb9, 0xb1, 0xcd, 0x2e, 0xc5, 0xf3, 0xdb, 0x47, 0xe5, 0xa5, 0x9c, 0x77, 0x0a, 0xa6, 0x20, 0x68, 0xfe, 0x7f, 0xc1, 0xad
    ]);
    public constructor(rc2Algo: RC2, encryption: boolean, key: ByteArray, iv: ByteArray) {
        super(rc2Algo, encryption, iv);
        let t1: int = rc2Algo.EffectiveKeySize;
        if (key == null)
            key = KeyBuilder.Key(rc2Algo.KeySize >> 3);
        else {
            key = TArray.Clone(key);
            t1 = Math.min(t1, key.length << 3);
        }

        const t: int = key.length;
        if (!KeySizes.IsLegalKeySize(rc2Algo.LegalKeySizes, (t << 3))) {
            const msg: string = TString.Format("Key is too small ({0} bytes), it should be between {1} and {2} bytes long.", t, 5, 16);
            throw new CryptographicException(msg);
        }

        // Expand key into a byte array, then convert to word
        // array since we always access the key in 16bit chunks.
        const L: ByteArray = New.ByteArray(128);

        const t8: int = ((t1 + 7) >>> 3); // divide by 8
        const tm: int = 255 % (2 << (8 + t1 - (t8 << 3) - 1));

        for (let i: int = 0; i < t; i++)
            L[i] = key[i];
        for (let i: int = t; i < 128; i++)
            L[i] = Convert.ToByte(RC2Transform.pitable[Convert.ToByte(L[i - 1] + L[i - t]) & 0xff]);

        L[128 - t8] = RC2Transform.pitable[L[128 - t8] & tm];

        for (let i: int = 127 - t8; i >= 0; i--)
            L[i] = RC2Transform.pitable[Convert.ToByte(L[i + 1] ^ L[i + t8])];

        this.K = New.UInt16Array[64];
        let pos: int = 0;
        for (let i: int = 0; i < 64; i++)
            this.K[i] = Convert.ToUInt16(L[pos++] + (L[pos++] << 8));
    }

    @Override
    protected ECB(input: ByteArray, output: ByteArray): void {
        // unrolled loop, eliminated mul
        this.R0 = Convert.ToUInt16(input[0] | (input[1] << 8));
        this.R1 = Convert.ToUInt16(input[2] | (input[3] << 8));
        this.R2 = Convert.ToUInt16(input[4] | (input[5] << 8));
        this.R3 = Convert.ToUInt16(input[6] | (input[7] << 8));

        if (this.encrypt) {
            this.j = 0;
            // inline, but looped, Mix(); Mix(); Mix(); Mix(); Mix();
            while (this.j <= 16) {
                this.R0 += Convert.ToUInt16(this.K[this.j++] + (this.R3 & this.R2) + ((~this.R3) & this.R1));
                this.R0 = Convert.ToUInt16((this.R0 << 1) | (this.R0 >>> 15));

                this.R1 += Convert.ToUInt16(this.K[this.j++] + (this.R0 & this.R3) + ((~this.R0) & this.R2));
                this.R1 = Convert.ToUInt16((this.R1 << 2) | (this.R1 >>> 14));

                this.R2 += Convert.ToUInt16(this.K[this.j++] + (this.R1 & this.R0) + ((~this.R1) & this.R3));
                this.R2 = Convert.ToUInt16((this.R2 << 3) | (this.R2 >>> 13));

                this.R3 += Convert.ToUInt16(this.K[this.j++] + (this.R2 & this.R1) + ((~this.R2) & this.R0));
                this.R3 = Convert.ToUInt16((this.R3 << 5) | (this.R3 >>> 11));
            }

            // inline Mash(); j == 20
            this.R0 += this.K[this.R3 & 63];
            this.R1 += this.K[this.R0 & 63];
            this.R2 += this.K[this.R1 & 63];
            this.R3 += this.K[this.R2 & 63];

            // inline, but looped, Mix(); Mix(); Mix(); Mix(); Mix(); Mix();
            while (this.j <= 40) {
                this.R0 += Convert.ToUInt16(this.K[this.j++] + (this.R3 & this.R2) + ((~this.R3) & this.R1));
                this.R0 = Convert.ToUInt16((this.R0 << 1) | (this.R0 >>> 15));

                this.R1 += Convert.ToUInt16(this.K[this.j++] + (this.R0 & this.R3) + ((~this.R0) & this.R2));
                this.R1 = Convert.ToUInt16((this.R1 << 2) | (this.R1 >>> 14));

                this.R2 += Convert.ToUInt16(this.K[this.j++] + (this.R1 & this.R0) + ((~this.R1) & this.R3));
                this.R2 = Convert.ToUInt16((this.R2 << 3) | (this.R2 >>> 13));

                this.R3 += Convert.ToUInt16(this.K[this.j++] + (this.R2 & this.R1) + ((~this.R2) & this.R0));
                this.R3 = Convert.ToUInt16((this.R3 << 5) | (this.R3 >>> 11));
            }

            // inline Mash(); j == 44
            this.R0 += this.K[this.R3 & 63];
            this.R1 += this.K[this.R0 & 63];
            this.R2 += this.K[this.R1 & 63];
            this.R3 += this.K[this.R2 & 63];

            // inline, but looped, Mix(); Mix(); Mix(); Mix(); Mix();
            while (this.j < 64) {
                this.R0 += Convert.ToUInt16(this.K[this.j++] + (this.R3 & this.R2) + ((~this.R3) & this.R1));
                this.R0 = Convert.ToUInt16((this.R0 << 1) | (this.R0 >>> 15));

                this.R1 += Convert.ToUInt16(this.K[this.j++] + (this.R0 & this.R3) + ((~this.R0) & this.R2));
                this.R1 = Convert.ToUInt16((this.R1 << 2) | (this.R1 >>> 14));

                this.R2 += Convert.ToUInt16(this.K[this.j++] + (this.R1 & this.R0) + ((~this.R1) & this.R3));
                this.R2 = Convert.ToUInt16((this.R2 << 3) | (this.R2 >>> 13));

                this.R3 += Convert.ToUInt16(this.K[this.j++] + (this.R2 & this.R1) + ((~this.R2) & this.R0));
                this.R3 = Convert.ToUInt16((this.R3 << 5) | (this.R3 >>> 11));
            }
        }
        else {
            this.j = 63;
            // inline, but looped, RMix(); RMix(); RMix(); RMix(); RMix();
            while (this.j >= 44) {
                this.R3 = Convert.ToUInt16((this.R3 >>> 5) | (this.R3 << 11));
                this.R3 -= Convert.ToUInt16(this.K[this.j--] + (this.R2 & this.R1) + ((~this.R2) & this.R0));

                this.R2 = Convert.ToUInt16((this.R2 >>> 3) | (this.R2 << 13));
                this.R2 -= Convert.ToUInt16(this.K[this.j--] + (this.R1 & this.R0) + ((~this.R1) & this.R3));

                this.R1 = Convert.ToUInt16((this.R1 >>> 2) | (this.R1 << 14));
                this.R1 -= Convert.ToUInt16(this.K[this.j--] + (this.R0 & this.R3) + ((~this.R0) & this.R2));

                this.R0 = Convert.ToUInt16((this.R0 >>> 1) | (this.R0 << 15));
                this.R0 -= Convert.ToUInt16(this.K[this.j--] + (this.R3 & this.R2) + ((~this.R3) & this.R1));
            }

            // inline RMash();
            this.R3 -= this.K[this.R2 & 63];
            this.R2 -= this.K[this.R1 & 63];
            this.R1 -= this.K[this.R0 & 63];
            this.R0 -= this.K[this.R3 & 63];

            // inline, but looped, RMix(); RMix(); RMix(); RMix(); RMix(); RMix();
            while (this.j >= 20) {
                this.R3 = Convert.ToUInt16((this.R3 >>> 5) | (this.R3 << 11));
                this.R3 -= Convert.ToUInt16(this.K[this.j--] + (this.R2 & this.R1) + ((~this.R2) & this.R0));

                this.R2 = Convert.ToUInt16((this.R2 >>> 3) | (this.R2 << 13));
                this.R2 -= Convert.ToUInt16(this.K[this.j--] + (this.R1 & this.R0) + ((~this.R1) & this.R3));

                this.R1 = Convert.ToUInt16((this.R1 >>> 2) | (this.R1 << 14));
                this.R1 -= Convert.ToUInt16(this.K[this.j--] + (this.R0 & this.R3) + ((~this.R0) & this.R2));

                this.R0 = Convert.ToUInt16((this.R0 >>> 1) | (this.R0 << 15));
                this.R0 -= Convert.ToUInt16(this.K[this.j--] + (this.R3 & this.R2) + ((~this.R3) & this.R1));
            }

            // inline RMash();
            this.R3 -= this.K[this.R2 & 63];
            this.R2 -= this.K[this.R1 & 63];
            this.R1 -= this.K[this.R0 & 63];
            this.R0 -= this.K[this.R3 & 63];

            // inline, but looped, RMix(); RMix(); RMix(); RMix(); RMix();
            while (this.j >= 0) {
                this.R3 = Convert.ToUInt16((this.R3 >>> 5) | (this.R3 << 11));
                this.R3 -= Convert.ToUInt16(this.K[this.j--] + (this.R2 & this.R1) + ((~this.R2) & this.R0));

                this.R2 = Convert.ToUInt16((this.R2 >>> 3) | (this.R2 << 13));
                this.R2 -= Convert.ToUInt16(this.K[this.j--] + (this.R1 & this.R0) + ((~this.R1) & this.R3));

                this.R1 = Convert.ToUInt16((this.R1 >>> 2) | (this.R1 << 14));
                this.R1 -= Convert.ToUInt16(this.K[this.j--] + (this.R0 & this.R3) + ((~this.R0) & this.R2));

                this.R0 = Convert.ToUInt16((this.R0 >>> 1) | (this.R0 << 15));
                this.R0 -= Convert.ToUInt16(this.K[this.j--] + (this.R3 & this.R2) + ((~this.R3) & this.R1));
            }
        }

        // unrolled loop
        output[0] = Convert.ToByte(this.R0);
        output[1] = Convert.ToByte(this.R0 >>> 8);
        output[2] = Convert.ToByte(this.R1);
        output[3] = Convert.ToByte(this.R1 >>> 8);
        output[4] = Convert.ToByte(this.R2);
        output[5] = Convert.ToByte(this.R2 >>> 8);
        output[6] = Convert.ToByte(this.R3);
        output[7] = Convert.ToByte(this.R3 >>> 8);
    }
}