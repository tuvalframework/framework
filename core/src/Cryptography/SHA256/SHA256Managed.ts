import { Convert } from "../../convert";
import { TArray } from "../../Extensions/TArray";
import { ByteArray, int, New, uint, UIntArray } from "../../float";
import { bigInt, BigNumber } from "../../Math/BigNumber";
import { Override } from "../../Reflection/Decorators/ClassInfo";
import { SHAConstants } from "../SHAConstants";
import { SHA256 } from "./SHA256";

export class SHA256Managed extends SHA256 {

    private static readonly BLOCK_SIZE_BYTES: int = 64;
    private _H: UIntArray = null as any;
    private count: int = 0 /* ulong */;
    private _ProcessingBuffer: ByteArray = null as any;   // Used to start data when passed less than a block worth.
    private _ProcessingBufferCount: int = 0; // Counts how much data we have stored that still needs processed.
    private buff: UIntArray = null as any;

    public constructor() {
        super();
        this._H = New.UIntArray(8);
        this._ProcessingBuffer = New.ByteArray(SHA256Managed.BLOCK_SIZE_BYTES);
        this.buff = New.UIntArray(64);
        this.Initialize();
    }

    @Override
    protected HashCore(rgb: ByteArray, ibStart: int, cbSize: int): void {
        let i: int;
        this.State = 1;

        if (this._ProcessingBufferCount !== 0) {
            if (cbSize < (SHA256Managed.BLOCK_SIZE_BYTES - this._ProcessingBufferCount)) {
                TArray.Copy(rgb, ibStart, this._ProcessingBuffer, this._ProcessingBufferCount, cbSize);
                this._ProcessingBufferCount += cbSize;
                return;
            }
            else {
                i = (SHA256Managed.BLOCK_SIZE_BYTES - this._ProcessingBufferCount);
                TArray.Copy(rgb, ibStart, this._ProcessingBuffer, this._ProcessingBufferCount, i);
                this.ProcessBlock(this._ProcessingBuffer, 0);
                this._ProcessingBufferCount = 0;
                ibStart += i;
                cbSize -= i;
            }
        }

        for (i = 0; i < cbSize - cbSize % SHA256Managed.BLOCK_SIZE_BYTES; i += SHA256Managed.BLOCK_SIZE_BYTES) {
            this.ProcessBlock(rgb, ibStart + i);
        }

        if (cbSize % SHA256Managed.BLOCK_SIZE_BYTES != 0) {
            TArray.Copy(rgb, cbSize - cbSize % SHA256Managed.BLOCK_SIZE_BYTES + ibStart, this._ProcessingBuffer, 0, cbSize % SHA256Managed.BLOCK_SIZE_BYTES);
            this._ProcessingBufferCount = cbSize % SHA256Managed.BLOCK_SIZE_BYTES;
        }
    }

    @Override
    protected HashFinal(): ByteArray {
        const hash: ByteArray = New.ByteArray(32);
        let i: int, j: int;

        this.ProcessFinalBlock(this._ProcessingBuffer, 0, this._ProcessingBufferCount);

        for (i = 0; i < 8; i++) {
            for (j = 0; j < 4; j++) {
                hash[i * 4 + j] = Convert.ToByte(this._H[i] >>> (24 - j * 8));
            }
        }

        this.State = 0;
        return hash;
    }

    @Override
    public Initialize(): void {
        this.count = 0;
        this._ProcessingBufferCount = 0;

        this._H[0] = 0x6A09E667;
        this._H[1] = 0xBB67AE85;
        this._H[2] = 0x3C6EF372;
        this._H[3] = 0xA54FF53A;
        this._H[4] = 0x510E527F;
        this._H[5] = 0x9B05688C;
        this._H[6] = 0x1F83D9AB;
        this._H[7] = 0x5BE0CD19;
    }

    private ProcessBlock(inputBuffer: ByteArray, inputOffset: int): void {
        let a: uint, b: uint, c: uint, d: uint, e: uint, f: uint, g: uint, h: uint;
        let t1: uint, t2: uint;
        let i: int;
        const K1: UIntArray = SHAConstants.K1;
        const buff: UIntArray = this.buff;

        this.count += SHA256Managed.BLOCK_SIZE_BYTES;

        for (i = 0; i < 16; i++) {
            buff[i] = Convert.ToUInt32(((inputBuffer[inputOffset + 4 * i]) << 24)
                | ((inputBuffer[inputOffset + 4 * i + 1]) << 16)
                | ((inputBuffer[inputOffset + 4 * i + 2]) << 8)
                | ((inputBuffer[inputOffset + 4 * i + 3])));
        }


        for (i = 16; i < 64; i++) {
            t1 = buff[i - 15];
            t1 = (((t1 >>> 7) | (t1 << 25)) ^ ((t1 >>> 18) | (t1 << 14)) ^ (t1 >>> 3));

            t2 = buff[i - 2];
            t2 = (((t2 >> 17) | (t2 << 15)) ^ ((t2 >> 19) | (t2 << 13)) ^ (t2 >> 10));
            buff[i] = t2 + buff[i - 7] + t1 + buff[i - 16];
        }

        a = Convert.ToUInt32(this._H[0]);
        b = Convert.ToUInt32(this._H[1]);
        c = Convert.ToUInt32(this._H[2]);
        d = Convert.ToUInt32(this._H[3]);
        e = Convert.ToUInt32(this._H[4]);
        f = Convert.ToUInt32(this._H[5]);
        g = Convert.ToUInt32(this._H[6]);
        h = Convert.ToUInt32(this._H[7]);

        for (i = 0; i < 64; i++) {
            t1 = Convert.ToUInt32(h + (((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7))) + ((e & f) ^ (~e & g)) + K1[i] + buff[i]);

            t2 = Convert.ToUInt32((((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >> 22) | (a << 10))));
            t2 = Convert.ToUInt32(t2 + ((a & b) ^ (a & c) ^ (b & c)));
            h = Convert.ToUInt32(g);
            g = Convert.ToUInt32(f);
            f = Convert.ToUInt32(e);
            e = Convert.ToUInt32(d + t1);
            d = Convert.ToUInt32(c);
            c = Convert.ToUInt32(b);
            b = Convert.ToUInt32(a);
            a = Convert.ToUInt32(t1 + t2);
        }

        this._H[0] += a;
        this._H[1] += b;
        this._H[2] += c;
        this._H[3] += d;
        this._H[4] += e;
        this._H[5] += f;
        this._H[6] += g;
        this._H[7] += h;
    }

    private ProcessFinalBlock(inputBuffer: ByteArray, inputOffset: int, inputCount: int): void {
        const total: int /* ulong */ = this.count + /* (ulong) */inputCount;
        let paddingSize: int = (56 - Convert.ToInt32(total % SHA256Managed.BLOCK_SIZE_BYTES));

        if (paddingSize < 1)
            paddingSize += SHA256Managed.BLOCK_SIZE_BYTES;

        const fooBuffer: ByteArray = New.ByteArray(inputCount + paddingSize + 8);

        for (let i: int = 0; i < inputCount; i++) {
            fooBuffer[i] = inputBuffer[i + inputOffset];
        }

        fooBuffer[inputCount] = 0x80;
        for (let i: int = inputCount + 1; i < inputCount + paddingSize; i++) {
            fooBuffer[i] = 0x00;
        }

        // I deal in bytes. The algorithm deals in bits.
        const/* ulong */ size: int = total << 3;
        this.AddLength(bigInt(size), fooBuffer, inputCount + paddingSize);
        this.ProcessBlock(fooBuffer, 0);

        if (inputCount + paddingSize + 8 == 128) {
            this.ProcessBlock(fooBuffer, 64);
        }
    }

    public /* internal */  AddLength(length: BigNumber /* ulong */, buffer: ByteArray, position: int): void {
        buffer[position++] = Convert.ToByte(length.shr(56));
        buffer[position++] = Convert.ToByte(length.shr(48));
        buffer[position++] = Convert.ToByte(length.shr(40));
        buffer[position++] = Convert.ToByte(length.shr(32));
        buffer[position++] = Convert.ToByte(length.shr(24));
        buffer[position++] = Convert.ToByte(length.shr(16));
        buffer[position++] = Convert.ToByte(length.shr(8));
        buffer[position] = Convert.ToByte(length.toNumber());
    }
}