import { TObject } from '../../Extensions/TObject';
import { UIntArray, ByteArray, New, uint, int } from '../../float';
import { TArray } from '../../Extensions/TArray';
import { Convert } from '../../convert';
import { bigInt, BigNumber } from '../../Math/BigNumber';
export class SHA1Internal extends TObject {

    protected dispose(disposing: boolean): void {
        this._H = undefined as any;
    }

    private static readonly BLOCK_SIZE_BYTES: int = 64;
    private _H: UIntArray = null as any;  // these are my chaining variables
    private count: int = 0; //ulong
    private _ProcessingBuffer: ByteArray = null as any;   // Used to start data when passed less than a block worth.
    private _ProcessingBufferCount: int = 0; // Counts how much data we have stored that still needs processed.
    private buff: UIntArray = null as any;

    public constructor() {
        super();
        this._H = New.UIntArray(5);
        this._ProcessingBuffer = New.ByteArray(SHA1Internal.BLOCK_SIZE_BYTES);
        this.buff = New.UIntArray(80);

        this.Initialize();
    }

    public HashCore(rgb: ByteArray, ibStart: int, cbSize: int): void {
        let i: int;

        if (this._ProcessingBufferCount !== 0) {
            if (cbSize < (SHA1Internal.BLOCK_SIZE_BYTES - this._ProcessingBufferCount)) {
                TArray.Copy(rgb, ibStart, this._ProcessingBuffer, this._ProcessingBufferCount, cbSize);
                this._ProcessingBufferCount += cbSize;
                return;
            }
            else {
                i = (SHA1Internal.BLOCK_SIZE_BYTES - this._ProcessingBufferCount);
                TArray.Copy(rgb, ibStart, this._ProcessingBuffer, this._ProcessingBufferCount, i);
                this.ProcessBlock(this._ProcessingBuffer, 0);
                this._ProcessingBufferCount = 0;
                ibStart += i;
                cbSize -= i;
            }
        }

        for (i = 0; i < cbSize - cbSize % SHA1Internal.BLOCK_SIZE_BYTES; i += SHA1Internal.BLOCK_SIZE_BYTES) {
            this.ProcessBlock(rgb, Convert.ToUInt32(ibStart + i));
        }

        if (cbSize % SHA1Internal.BLOCK_SIZE_BYTES !== 0) {
            TArray.Copy(rgb, cbSize - cbSize % SHA1Internal.BLOCK_SIZE_BYTES + ibStart, this._ProcessingBuffer, 0, cbSize % SHA1Internal.BLOCK_SIZE_BYTES);
            this._ProcessingBufferCount = cbSize % SHA1Internal.BLOCK_SIZE_BYTES;
        }
    }

    public HashFinal(): ByteArray {
        const hash: ByteArray = New.ByteArray(20);

        this.ProcessFinalBlock(this._ProcessingBuffer, 0, this._ProcessingBufferCount);

        for (let i: int = 0; i < 5; i++) {
            for (let j: int = 0; j < 4; j++) {
                hash[i * 4 + j] = Convert.ToByte(this._H[i] >> (8 * (3 - j)));
            }
        }

        return hash;
    }

    public Initialize(): void {
        this.count = 0;
        this._ProcessingBufferCount = 0;

        this._H[0] = 0x67452301;
        this._H[1] = 0xefcdab89;
        this._H[2] = 0x98badcfe;
        this._H[3] = 0x10325476;
        this._H[4] = 0xC3D2E1F0;
    }

    private ProcessBlock(inputBuffer: ByteArray, inputOffset: uint): void {
        let a: uint, b: uint, c: uint, d: uint, e: uint;

        this.count += SHA1Internal.BLOCK_SIZE_BYTES;

        // abc removal would not work on the fields
        const _H: UIntArray = this._H;
        const buff: UIntArray = this.buff;
        SHA1Internal.InitialiseBuff(buff, inputBuffer, inputOffset);
        SHA1Internal.FillBuff(buff);

        a = _H[0];
        b = _H[1];
        c = _H[2];
        d = _H[3];
        e = _H[4];

        // This function was unrolled because it seems to be doubling our performance with current compiler/VM.
        // Possibly roll up if this changes.

        // ---- Round 1 --------
        let i: int = 0;
        while (i < 20) {
            e = Convert.ToUInt32(e + ((a << 5) | (a >>> 27)) + (((c ^ d) & b) ^ d) + 0x5A827999 + buff[i]);
            b = Convert.ToUInt32((b << 30) | (b >>> 2));

            d = Convert.ToUInt32(d + ((e << 5) | (e >>> 27)) + (((b ^ c) & a) ^ c) + 0x5A827999 + buff[i + 1]);
            a = Convert.ToUInt32((a << 30) | (a >>> 2));

            c = Convert.ToUInt32(c + ((d << 5) | (d >>> 27)) + (((a ^ b) & e) ^ b) + 0x5A827999 + buff[i + 2]);
            e = Convert.ToUInt32((e << 30) | (e >>> 2));

            b = Convert.ToUInt32( b + ((c << 5) | (c >>> 27)) + (((e ^ a) & d) ^ a) + 0x5A827999 + buff[i + 3]);
            d = Convert.ToUInt32((d << 30) | (d >>> 2));

            a = Convert.ToUInt32(a + ((b << 5) | (b >>> 27)) + (((d ^ e) & c) ^ e) + 0x5A827999 + buff[i + 4]);
            c = Convert.ToUInt32((c << 30) | (c >>> 2));
            i += 5;
        }

        // ---- Round 2 --------
        while (i < 40) {
            e = Convert.ToUInt32(e + ((a << 5) | (a >>> 27)) + (b ^ c ^ d) + 0x6ED9EBA1 + buff[i]);
            b = Convert.ToUInt32((b << 30) | (b >>> 2));

            d = Convert.ToUInt32(d + ((e << 5) | (e >>> 27)) + (a ^ b ^ c) + 0x6ED9EBA1 + buff[i + 1]);
            a = Convert.ToUInt32((a << 30) | (a >>> 2));

            c = Convert.ToUInt32(c + ((d << 5) | (d >>> 27)) + (e ^ a ^ b) + 0x6ED9EBA1 + buff[i + 2]);
            e = Convert.ToUInt32((e << 30) | (e >>> 2));

            b = Convert.ToUInt32(b + ((c << 5) | (c >>> 27)) + (d ^ e ^ a) + 0x6ED9EBA1 + buff[i + 3]);
            d = Convert.ToUInt32((d << 30) | (d >>> 2));

            a = Convert.ToUInt32(a + ((b << 5) | (b >>> 27)) + (c ^ d ^ e) + 0x6ED9EBA1 + buff[i + 4]);
            c = Convert.ToUInt32((c << 30) | (c >>> 2));
            i += 5;
        }

        // ---- Round 3 --------
        while (i < 60) {
            e = Convert.ToUInt32(e + ((a << 5) | (a >>> 27)) + ((b & c) | (b & d) | (c & d)) + 0x8F1BBCDC + buff[i]);
            b = Convert.ToUInt32((b << 30) | (b >>> 2));

            d = Convert.ToUInt32(d + ((e << 5) | (e >>> 27)) + ((a & b) | (a & c) | (b & c)) + 0x8F1BBCDC + buff[i + 1]);
            a = Convert.ToUInt32((a << 30) | (a >>> 2));

            c = Convert.ToUInt32(c + ((d << 5) | (d >>> 27)) + ((e & a) | (e & b) | (a & b)) + 0x8F1BBCDC + buff[i + 2]);
            e = Convert.ToUInt32((e << 30) | (e >>> 2));

            b = Convert.ToUInt32(b + ((c << 5) | (c >>> 27)) + ((d & e) | (d & a) | (e & a)) + 0x8F1BBCDC + buff[i + 3]);
            d = Convert.ToUInt32((d << 30) | (d >>> 2));

            a = Convert.ToUInt32(a + ((b << 5) | (b >>> 27)) + ((c & d) | (c & e) | (d & e)) + 0x8F1BBCDC + buff[i + 4]);
            c = Convert.ToUInt32((c << 30) | (c >>> 2));
            i += 5;
        }

        // ---- Round 4 --------
        while (i < 80) {
            e = Convert.ToUInt32(e + ((a << 5) | (a >>> 27)) + (b ^ c ^ d) + 0xCA62C1D6 + buff[i]);
            b = Convert.ToUInt32((b << 30) | (b >>> 2));

            d = Convert.ToUInt32(d + ((e << 5) | (e >>> 27)) + (a ^ b ^ c) + 0xCA62C1D6 + buff[i + 1]);
            a = Convert.ToUInt32((a << 30) | (a >>> 2));

            c = Convert.ToUInt32(c + ((d << 5) | (d >>> 27)) + (e ^ a ^ b) + 0xCA62C1D6 + buff[i + 2]);
            e = Convert.ToUInt32((e << 30) | (e >>> 2));

            b = Convert.ToUInt32(b + ((c << 5) | (c >>> 27)) + (d ^ e ^ a) + 0xCA62C1D6 + buff[i + 3]);
            d = Convert.ToUInt32((d << 30) | (d >>> 2));

            a = Convert.ToUInt32(a + ((b << 5) | (b >>> 27)) + (c ^ d ^ e) + 0xCA62C1D6 + buff[i + 4]);
            c = Convert.ToUInt32((c << 30) | (c >>> 2));
            i += 5;
        }

        _H[0] = Convert.ToUInt32(_H[0] + a);
        _H[1] = Convert.ToUInt32(_H[1] + b);
        _H[2] = Convert.ToUInt32(_H[2] + c);
        _H[3] = Convert.ToUInt32(_H[3] + d);
        _H[4] = Convert.ToUInt32(_H[4] + e);
    }

    private static InitialiseBuff(buff: UIntArray, input: ByteArray, inputOffset: uint): void {
        buff[0] = Convert.ToUInt32((input[inputOffset + 0] << 24) | (input[inputOffset + 1] << 16) | (input[inputOffset + 2] << 8) | (input[inputOffset + 3]));
        buff[1] = Convert.ToUInt32((input[inputOffset + 4] << 24) | (input[inputOffset + 5] << 16) | (input[inputOffset + 6] << 8) | (input[inputOffset + 7]));
        buff[2] = Convert.ToUInt32((input[inputOffset + 8] << 24) | (input[inputOffset + 9] << 16) | (input[inputOffset + 10] << 8) | (input[inputOffset + 11]));
        buff[3] = Convert.ToUInt32((input[inputOffset + 12] << 24) | (input[inputOffset + 13] << 16) | (input[inputOffset + 14] << 8) | (input[inputOffset + 15]));
        buff[4] = Convert.ToUInt32((input[inputOffset + 16] << 24) | (input[inputOffset + 17] << 16) | (input[inputOffset + 18] << 8) | (input[inputOffset + 19]));
        buff[5] = Convert.ToUInt32((input[inputOffset + 20] << 24) | (input[inputOffset + 21] << 16) | (input[inputOffset + 22] << 8) | (input[inputOffset + 23]));
        buff[6] = Convert.ToUInt32((input[inputOffset + 24] << 24) | (input[inputOffset + 25] << 16) | (input[inputOffset + 26] << 8) | (input[inputOffset + 27]));
        buff[7] = Convert.ToUInt32((input[inputOffset + 28] << 24) | (input[inputOffset + 29] << 16) | (input[inputOffset + 30] << 8) | (input[inputOffset + 31]));
        buff[8] = Convert.ToUInt32((input[inputOffset + 32] << 24) | (input[inputOffset + 33] << 16) | (input[inputOffset + 34] << 8) | (input[inputOffset + 35]));
        buff[9] = Convert.ToUInt32((input[inputOffset + 36] << 24) | (input[inputOffset + 37] << 16) | (input[inputOffset + 38] << 8) | (input[inputOffset + 39]));
        buff[10] = Convert.ToUInt32((input[inputOffset + 40] << 24) | (input[inputOffset + 41] << 16) | (input[inputOffset + 42] << 8) | (input[inputOffset + 43]));
        buff[11] = Convert.ToUInt32((input[inputOffset + 44] << 24) | (input[inputOffset + 45] << 16) | (input[inputOffset + 46] << 8) | (input[inputOffset + 47]));
        buff[12] = Convert.ToUInt32((input[inputOffset + 48] << 24) | (input[inputOffset + 49] << 16) | (input[inputOffset + 50] << 8) | (input[inputOffset + 51]));
        buff[13] = Convert.ToUInt32((input[inputOffset + 52] << 24) | (input[inputOffset + 53] << 16) | (input[inputOffset + 54] << 8) | (input[inputOffset + 55]));
        buff[14] = Convert.ToUInt32((input[inputOffset + 56] << 24) | (input[inputOffset + 57] << 16) | (input[inputOffset + 58] << 8) | (input[inputOffset + 59]));
        buff[15] = Convert.ToUInt32((input[inputOffset + 60] << 24) | (input[inputOffset + 61] << 16) | (input[inputOffset + 62] << 8) | (input[inputOffset + 63]));
    }

    private static FillBuff(buff: UIntArray): void {
        let val: uint;
        for (let i: int = 16; i < 80; i += 8) {
            val = Convert.ToUInt32(buff[i - 3] ^ buff[i - 8] ^ buff[i - 14] ^ buff[i - 16]);
            buff[i] = (val << 1) | (val >>> 31);

            val = Convert.ToUInt32(buff[i - 2] ^ buff[i - 7] ^ buff[i - 13] ^ buff[i - 15]);
            buff[i + 1] = (val << 1) | (val >>> 31);

            val = Convert.ToUInt32(buff[i - 1] ^ buff[i - 6] ^ buff[i - 12] ^ buff[i - 14]);
            buff[i + 2] = (val << 1) | (val >>> 31);

            val = Convert.ToUInt32(buff[i + 0] ^ buff[i - 5] ^ buff[i - 11] ^ buff[i - 13]);
            buff[i + 3] = (val << 1) | (val >>> 31);

            val = Convert.ToUInt32(buff[i + 1] ^ buff[i - 4] ^ buff[i - 10] ^ buff[i - 12]);
            buff[i + 4] = (val << 1) | (val >>> 31);

            val = Convert.ToUInt32(buff[i + 2] ^ buff[i - 3] ^ buff[i - 9] ^ buff[i - 11]);
            buff[i + 5] = (val << 1) | (val >>> 31);

            val = Convert.ToUInt32(buff[i + 3] ^ buff[i - 2] ^ buff[i - 8] ^ buff[i - 10]);
            buff[i + 6] = (val << 1) | (val >>> 31);

            val = Convert.ToUInt32(buff[i + 4] ^ buff[i - 1] ^ buff[i - 7] ^ buff[i - 9]);
            buff[i + 7] = (val << 1) | (val >>> 31);
        }
    }

    private ProcessFinalBlock(inputBuffer: ByteArray, inputOffset: int, inputCount: int): void {
        const total: int /* ulong */ = this.count + /* (ulong) */inputCount;
        let paddingSize: int = (56 - Convert.ToInt32(total % SHA1Internal.BLOCK_SIZE_BYTES));

        if (paddingSize < 1)
            paddingSize += SHA1Internal.BLOCK_SIZE_BYTES;

        const length: int = inputCount + paddingSize + 8;
        const fooBuffer: ByteArray = (length == 64) ? this._ProcessingBuffer : New.ByteArray(length);

        for (let i: int = 0; i < inputCount; i++) {
            fooBuffer[i] = inputBuffer[i + inputOffset];
        }

        fooBuffer[inputCount] = 0x80;
        for (let i: int = inputCount + 1; i < inputCount + paddingSize; i++) {
            fooBuffer[i] = 0x00;
        }

        // I deal in bytes. The algorithm deals in bits.
        let size: int /* ulong */ = total << 3;
        this.AddLength(bigInt(size), fooBuffer, inputCount + paddingSize);
        this.ProcessBlock(fooBuffer, 0);

        if (length == 128)
            this.ProcessBlock(fooBuffer, 64);
    }

    public /* internal */  AddLength(length: BigNumber/* ulong */, buffer: ByteArray, position: int): void {
        buffer[position++] = Convert.ToByte(length.shr(56));
        buffer[position++] = Convert.ToByte(length.shr(length) >> 48);
        buffer[position++] = Convert.ToByte(length.shr(length) >> 40);
        buffer[position++] = Convert.ToByte(length.shr(length) >> 32);
        buffer[position++] = Convert.ToByte(length.shr(length) >> 24);
        buffer[position++] = Convert.ToByte(length.shr(length) >> 16);
        buffer[position++] = Convert.ToByte(length.shr(length) >> 8);
        buffer[position] = Convert.ToByte(length.toNumber());
    }
}