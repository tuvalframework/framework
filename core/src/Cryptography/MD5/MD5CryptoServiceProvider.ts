import { Convert } from '../../convert';
import { TArray } from '../../Extensions/TArray';
import { int, IntArray, UIntArray, ByteArray, New, uint } from '../../float';
import { bigInt, BigNumber } from '../../Math/BigNumber';
import { Override } from '../../Reflection/Decorators/ClassInfo';
import { MD5 } from "./MD5";

export class MD5CryptoServiceProvider extends MD5 {
    private static readonly BLOCK_SIZE_BYTES: int = 64;
    private _H: UIntArray = null as any;
    private buff: UIntArray = null as any;
    private count: int = 0;
    private _ProcessingBuffer: ByteArray = null as any;   // Used to start data when passed less than a block worth.
    private _ProcessingBufferCount: int = 0; // Counts how much data we have stored that still needs processed.

    public constructor() {
        super();
        this._H = New.UIntArray(4);
        this.buff = New.UIntArray(16);
        this._ProcessingBuffer = New.ByteArray(MD5CryptoServiceProvider.BLOCK_SIZE_BYTES);

        this.Initialize();
    }

    /* ~MD5CryptoServiceProvider ()
        {
        Dispose (false);
        } */

    @Override
    protected dispose(disposing: boolean): void {
        if (this._ProcessingBuffer != null) {
            TArray.Clear(this._ProcessingBuffer, 0, this._ProcessingBuffer.length);
            this._ProcessingBuffer = null as any;
        }
        if (this._H != null) {
            TArray.Clear(this._H, 0, this._H.length);
            this._H = null as any;
        }
        if (this.buff != null) {
            TArray.Clear(this.buff, 0, this.buff.length);
            this.buff = null as any;
        }
    }

    @Override
    protected HashCore(rgb: ByteArray, ibStart: int, cbSize: int): void {
        let i: int = 0;
        this.State = 1;

        if (this._ProcessingBufferCount !== 0) {
            if (cbSize < (MD5CryptoServiceProvider.BLOCK_SIZE_BYTES - this._ProcessingBufferCount)) {
                TArray.Copy(rgb, ibStart, this._ProcessingBuffer, this._ProcessingBufferCount, cbSize);
                this._ProcessingBufferCount += cbSize;
                return;
            }
            else {
                i = (MD5CryptoServiceProvider.BLOCK_SIZE_BYTES - this._ProcessingBufferCount);
                TArray.Copy(rgb, ibStart, this._ProcessingBuffer, this._ProcessingBufferCount, i);
                this.ProcessBlock(this._ProcessingBuffer, 0);
                this._ProcessingBufferCount = 0;
                ibStart += i;
                cbSize -= i;
            }
        }

        for (i = 0; i < cbSize - cbSize % MD5CryptoServiceProvider.BLOCK_SIZE_BYTES; i += MD5CryptoServiceProvider.BLOCK_SIZE_BYTES) {
            this.ProcessBlock(rgb, ibStart + i);
        }

        if (cbSize % MD5CryptoServiceProvider.BLOCK_SIZE_BYTES !== 0) {
            TArray.Copy(rgb, cbSize - cbSize % MD5CryptoServiceProvider.BLOCK_SIZE_BYTES + ibStart, this._ProcessingBuffer, 0, cbSize % MD5CryptoServiceProvider.BLOCK_SIZE_BYTES);
            this._ProcessingBufferCount = cbSize % MD5CryptoServiceProvider.BLOCK_SIZE_BYTES;
        }
    }

    @Override
    protected HashFinal(): ByteArray {
        const hash: ByteArray = New.ByteArray(16);
        let i: int, j: int;

        this.ProcessFinalBlock(this._ProcessingBuffer, 0, this._ProcessingBufferCount);

        for (i = 0; i < 4; i++) {
            for (j = 0; j < 4; j++) {
                hash[i * 4 + j] = Convert.ToByte(this._H[i] >> j * 8);
            }
        }

        return hash;
    }

    @Override
    public Initialize(): void {
        this.count = 0;
        this._ProcessingBufferCount = 0;

        this._H[0] = 0x67452301;
        this._H[1] = 0xefcdab89;
        this._H[2] = 0x98badcfe;
        this._H[3] = 0x10325476;
    }

    private ProcessBlock(inputBuffer: ByteArray, inputOffset: int): void {
        let a: uint, b: uint, c: uint, d: uint;
        let i: int;

        this.count += MD5CryptoServiceProvider.BLOCK_SIZE_BYTES;

        for (i = 0; i < 16; i++) {
            this.buff[i] = Convert.ToUInt32(inputBuffer[inputOffset + 4 * i])
                | ((Convert.ToUInt32(inputBuffer[inputOffset + 4 * i + 1])) << 8)
                | ((Convert.ToUInt32(inputBuffer[inputOffset + 4 * i + 2])) << 16)
                | ((Convert.ToUInt32(inputBuffer[inputOffset + 4 * i + 3])) << 24);
        }

        a = this._H[0];
        b = this._H[1];
        c = this._H[2];
        d = this._H[3];

        // This function was unrolled because it seems to be doubling our performance with current compiler/VM.
        // Possibly roll up if this changes.

        // ---- Round 1 --------

        a += (((c ^ d) & b) ^ d) + Convert.ToUInt32(MD5CryptoServiceProvider.K[0]) + this.buff[0];
        a = (a << 7) | (a >> 25);
        a += b;

        d += (((b ^ c) & a) ^ c) + Convert.ToUInt32(MD5CryptoServiceProvider.K[1]) + this.buff[1];
        d = (d << 12) | (d >> 20);
        d += a;

        c += (((a ^ b) & d) ^ b) + Convert.ToUInt32(MD5CryptoServiceProvider.K[2]) + this.buff[2];
        c = (c << 17) | (c >> 15);
        c += d;

        b += (((d ^ a) & c) ^ a) + Convert.ToUInt32(MD5CryptoServiceProvider.K[3]) + this.buff[3];
        b = (b << 22) | (b >> 10);
        b += c;

        a += (((c ^ d) & b) ^ d) + Convert.ToUInt32(MD5CryptoServiceProvider.K[4]) + this.buff[4];
        a = (a << 7) | (a >> 25);
        a += b;

        d += (((b ^ c) & a) ^ c) + Convert.ToUInt32(MD5CryptoServiceProvider.K[5]) + this.buff[5];
        d = (d << 12) | (d >> 20);
        d += a;

        c += (((a ^ b) & d) ^ b) + Convert.ToUInt32(MD5CryptoServiceProvider.K[6]) + this.buff[6];
        c = (c << 17) | (c >> 15);
        c += d;

        b += (((d ^ a) & c) ^ a) + Convert.ToUInt32(MD5CryptoServiceProvider.K[7]) + this.buff[7];
        b = (b << 22) | (b >> 10);
        b += c;

        a += (((c ^ d) & b) ^ d) + Convert.ToUInt32(MD5CryptoServiceProvider.K[8]) + this.buff[8];
        a = (a << 7) | (a >> 25);
        a += b;

        d += (((b ^ c) & a) ^ c) + Convert.ToUInt32(MD5CryptoServiceProvider.K[9]) + this.buff[9];
        d = (d << 12) | (d >> 20);
        d += a;

        c += (((a ^ b) & d) ^ b) + Convert.ToUInt32(MD5CryptoServiceProvider.K[10]) + this.buff[10];
        c = (c << 17) | (c >> 15);
        c += d;

        b += (((d ^ a) & c) ^ a) + Convert.ToUInt32(MD5CryptoServiceProvider.K[11]) + this.buff[11];
        b = (b << 22) | (b >> 10);
        b += c;

        a += (((c ^ d) & b) ^ d) + Convert.ToUInt32(MD5CryptoServiceProvider.K[12]) + this.buff[12];
        a = (a << 7) | (a >> 25);
        a += b;

        d += (((b ^ c) & a) ^ c) + Convert.ToUInt32(MD5CryptoServiceProvider.K[13]) + this.buff[13];
        d = (d << 12) | (d >> 20);
        d += a;

        c += (((a ^ b) & d) ^ b) + Convert.ToUInt32(MD5CryptoServiceProvider.K[14]) + this.buff[14];
        c = (c << 17) | (c >> 15);
        c += d;

        b += (((d ^ a) & c) ^ a) + Convert.ToUInt32(MD5CryptoServiceProvider.K[15]) + this.buff[15];
        b = (b << 22) | (b >> 10);
        b += c;


        // ---- Round 2 --------

        a += (((b ^ c) & d) ^ c) + Convert.ToUInt32(MD5CryptoServiceProvider.K[16]) + this.buff[1];
        a = (a << 5) | (a >> 27);
        a += b;

        d += (((a ^ b) & c) ^ b) + Convert.ToUInt32(MD5CryptoServiceProvider.K[17]) + this.buff[6];
        d = (d << 9) | (d >> 23);
        d += a;

        c += (((d ^ a) & b) ^ a) + Convert.ToUInt32(MD5CryptoServiceProvider.K[18]) + this.buff[11];
        c = (c << 14) | (c >> 18);
        c += d;

        b += (((c ^ d) & a) ^ d) + MD5CryptoServiceProvider.K[19] + this.buff[0];
        b = (b << 20) | (b >> 12);
        b += c;

        a += (((b ^ c) & d) ^ c) + MD5CryptoServiceProvider.K[20] + this.buff[5];
        a = (a << 5) | (a >> 27);
        a += b;

        d += (((a ^ b) & c) ^ b) + MD5CryptoServiceProvider.K[21] + this.buff[10];
        d = (d << 9) | (d >> 23);
        d += a;

        c += (((d ^ a) & b) ^ a) + MD5CryptoServiceProvider.K[22] + this.buff[15];
        c = (c << 14) | (c >> 18);
        c += d;

        b += (((c ^ d) & a) ^ d) + MD5CryptoServiceProvider.K[23] + this.buff[4];
        b = (b << 20) | (b >> 12);
        b += c;

        a += (((b ^ c) & d) ^ c) + MD5CryptoServiceProvider.K[24] + this.buff[9];
        a = (a << 5) | (a >> 27);
        a += b;

        d += (((a ^ b) & c) ^ b) + MD5CryptoServiceProvider.K[25] + this.buff[14];
        d = (d << 9) | (d >> 23);
        d += a;

        c += (((d ^ a) & b) ^ a) + MD5CryptoServiceProvider.K[26] + this.buff[3];
        c = (c << 14) | (c >> 18);
        c += d;

        b += (((c ^ d) & a) ^ d) + MD5CryptoServiceProvider.K[27] + this.buff[8];
        b = (b << 20) | (b >> 12);
        b += c;

        a += (((b ^ c) & d) ^ c) + MD5CryptoServiceProvider.K[28] + this.buff[13];
        a = (a << 5) | (a >> 27);
        a += b;

        d += (((a ^ b) & c) ^ b) + MD5CryptoServiceProvider.K[29] + this.buff[2];
        d = (d << 9) | (d >> 23);
        d += a;

        c += (((d ^ a) & b) ^ a) + MD5CryptoServiceProvider.K[30] + this.buff[7];
        c = (c << 14) | (c >> 18);
        c += d;

        b += (((c ^ d) & a) ^ d) + MD5CryptoServiceProvider.K[31] + this.buff[12];
        b = (b << 20) | (b >> 12);
        b += c;


        // ---- Round 3 --------

        a += (b ^ c ^ d) + MD5CryptoServiceProvider.K[32] + this.buff[5];
        a = (a << 4) | (a >> 28);
        a += b;

        d += (a ^ b ^ c) + MD5CryptoServiceProvider.K[33] + this.buff[8];
        d = (d << 11) | (d >> 21);
        d += a;

        c += (d ^ a ^ b) + MD5CryptoServiceProvider.K[34] + this.buff[11];
        c = (c << 16) | (c >> 16);
        c += d;

        b += (c ^ d ^ a) + MD5CryptoServiceProvider.K[35] + this.buff[14];
        b = (b << 23) | (b >> 9);
        b += c;

        a += (b ^ c ^ d) + MD5CryptoServiceProvider.K[36] + this.buff[1];
        a = (a << 4) | (a >> 28);
        a += b;

        d += (a ^ b ^ c) + MD5CryptoServiceProvider.K[37] + this.buff[4];
        d = (d << 11) | (d >> 21);
        d += a;

        c += (d ^ a ^ b) + MD5CryptoServiceProvider.K[38] + this.buff[7];
        c = (c << 16) | (c >> 16);
        c += d;

        b += (c ^ d ^ a) + MD5CryptoServiceProvider.K[39] + this.buff[10];
        b = (b << 23) | (b >> 9);
        b += c;

        a += (b ^ c ^ d) + MD5CryptoServiceProvider.K[40] + this.buff[13];
        a = (a << 4) | (a >> 28);
        a += b;

        d += (a ^ b ^ c) + MD5CryptoServiceProvider.K[41] + this.buff[0];
        d = (d << 11) | (d >> 21);
        d += a;

        c += (d ^ a ^ b) + MD5CryptoServiceProvider.K[42] + this.buff[3];
        c = (c << 16) | (c >> 16);
        c += d;

        b += (c ^ d ^ a) + MD5CryptoServiceProvider.K[43] + this.buff[6];
        b = (b << 23) | (b >> 9);
        b += c;

        a += (b ^ c ^ d) + MD5CryptoServiceProvider.K[44] + this.buff[9];
        a = (a << 4) | (a >> 28);
        a += b;

        d += (a ^ b ^ c) + MD5CryptoServiceProvider.K[45] + this.buff[12];
        d = (d << 11) | (d >> 21);
        d += a;

        c += (d ^ a ^ b) + MD5CryptoServiceProvider.K[46] + this.buff[15];
        c = (c << 16) | (c >> 16);
        c += d;

        b += (c ^ d ^ a) + MD5CryptoServiceProvider.K[47] + this.buff[2];
        b = (b << 23) | (b >> 9);
        b += c;


        // ---- Round 4 --------

        a += (((~d) | b) ^ c) + MD5CryptoServiceProvider.K[48] + this.buff[0];
        a = (a << 6) | (a >> 26);
        a += b;

        d += (((~c) | a) ^ b) + MD5CryptoServiceProvider.K[49] + this.buff[7];
        d = (d << 10) | (d >> 22);
        d += a;

        c += (((~b) | d) ^ a) + MD5CryptoServiceProvider.K[50] + this.buff[14];
        c = (c << 15) | (c >> 17);
        c += d;

        b += (((~a) | c) ^ d) + MD5CryptoServiceProvider.K[51] + this.buff[5];
        b = (b << 21) | (b >> 11);
        b += c;

        a += (((~d) | b) ^ c) + MD5CryptoServiceProvider.K[52] + this.buff[12];
        a = (a << 6) | (a >> 26);
        a += b;

        d += (((~c) | a) ^ b) + MD5CryptoServiceProvider.K[53] + this.buff[3];
        d = (d << 10) | (d >> 22);
        d += a;

        c += (((~b) | d) ^ a) + MD5CryptoServiceProvider.K[54] + this.buff[10];
        c = (c << 15) | (c >> 17);
        c += d;

        b += (((~a) | c) ^ d) + MD5CryptoServiceProvider.K[55] + this.buff[1];
        b = (b << 21) | (b >> 11);
        b += c;

        a += (((~d) | b) ^ c) + MD5CryptoServiceProvider.K[56] + this.buff[8];
        a = (a << 6) | (a >> 26);
        a += b;

        d += (((~c) | a) ^ b) + MD5CryptoServiceProvider.K[57] + this.buff[15];
        d = (d << 10) | (d >> 22);
        d += a;

        c += (((~b) | d) ^ a) + MD5CryptoServiceProvider.K[58] + this.buff[6];
        c = (c << 15) | (c >> 17);
        c += d;

        b += (((~a) | c) ^ d) + MD5CryptoServiceProvider.K[59] + this.buff[13];
        b = (b << 21) | (b >> 11);
        b += c;

        a += (((~d) | b) ^ c) + MD5CryptoServiceProvider.K[60] + this.buff[4];
        a = (a << 6) | (a >> 26);
        a += b;

        d += (((~c) | a) ^ b) + MD5CryptoServiceProvider.K[61] + this.buff[11];
        d = (d << 10) | (d >> 22);
        d += a;

        c += (((~b) | d) ^ a) + MD5CryptoServiceProvider.K[62] + this.buff[2];
        c = (c << 15) | (c >> 17);
        c += d;

        b += (((~a) | c) ^ d) + MD5CryptoServiceProvider.K[63] + this.buff[9];
        b = (b << 21) | (b >> 11);
        b += c;

        this._H[0] += a;
        this._H[1] += b;
        this._H[2] += c;
        this._H[3] += d;
    }

    private ProcessFinalBlock(inputBuffer: ByteArray, inputOffset: int, inputCount: int): void {
        const total: int = this.count + inputCount;
        let paddingSize: int = Convert.ToInt32(56 - total % MD5CryptoServiceProvider.BLOCK_SIZE_BYTES);

        if (paddingSize < 1)
            paddingSize += MD5CryptoServiceProvider.BLOCK_SIZE_BYTES;

        const fooBuffer: ByteArray = New.ByteArray(inputCount + paddingSize + 8);

        for (let i: int = 0; i < inputCount; i++) {
            fooBuffer[i] = inputBuffer[i + inputOffset];
        }

        fooBuffer[inputCount] = 0x80;
        for (let i: int = inputCount + 1; i < inputCount + paddingSize; i++) {
            fooBuffer[i] = 0x00;
        }

        // I deal in bytes. The algorithm deals in bits.
        const size: int = total << 3;
        this.AddLength(bigInt(size), fooBuffer, inputCount + paddingSize);
        this.ProcessBlock(fooBuffer, 0);

        if (inputCount + paddingSize + 8 == 128) {
            this.ProcessBlock(fooBuffer, 64);
        }
    }

    private /* internal */  AddLength(length: BigNumber, buffer: ByteArray, position: int): void {
        buffer[position++] = Convert.ToByte(length.toNumber());
        buffer[position++] = Convert.ToByte(length.shr(8));
        buffer[position++] = Convert.ToByte(length.shr(16));
        buffer[position++] = Convert.ToByte(length.shr(24));
        buffer[position++] = Convert.ToByte(length.shr(32));
        buffer[position++] = Convert.ToByte(length.shr(40));
        buffer[position++] = Convert.ToByte(length.shr(48));
        buffer[position] = Convert.ToByte(length.shr(56));
    }

    private  static readonly K: UIntArray = New.UIntArray([
        0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee,
        0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
        0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be,
        0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
        0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa,
        0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
        0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed,
        0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
        0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c,
        0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
        0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05,
        0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
        0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039,
        0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
        0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1,
        0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391
    ]);
}