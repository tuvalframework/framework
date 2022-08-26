import { byte } from "../../byte";
import { Convert } from "../../convert";
import { ByteArray, int, New } from "../../float";
import { bigInt, BigNumber } from "../../Math/BigNumber";
import { Override } from "../../Reflection/Decorators/ClassInfo";
import { SHAConstants } from "../SHAConstants";
import { SHA512 } from "./SHA512";

export class SHA512Managed extends SHA512 {

    private xBuf: ByteArray = null as any;
    private xBufOff: int = 0;

    private byteCount1: BigNumber = null as any;
    private byteCount2: BigNumber = null as any;

    private H1: BigNumber = null as any;
    private H2: BigNumber = null as any;
    private H3: BigNumber = null as any;
    private H4: BigNumber = null as any;
    private H5: BigNumber = null as any;
    private H6: BigNumber = null as any;
    private H7: BigNumber = null as any;
    private H8: BigNumber = null as any;

    private W: BigNumber[] = null as any;
    private wOff: int = 0;

    public constructor() {
        super();
        this.xBuf = New.ByteArray(8);
        this.W = new Array(80);
        this.initialize(false); // limited initialization
    }

    private initialize(reuse: boolean): void {
        // SHA-512 initial hash value
        // The first 64 bits of the fractional parts of the square roots
        // of the first eight prime numbers
        this.H1 = bigInt('0x6a09e667f3bcc908');
        this.H2 = bigInt('0xbb67ae8584caa73b');
        this.H3 = bigInt('0x3c6ef372fe94f82b');
        this.H4 = bigInt('0xa54ff53a5f1d36f1');
        this.H5 = bigInt('0x510e527fade682d1');
        this.H6 = bigInt('0x9b05688c2b3e6c1f');
        this.H7 = bigInt('0x1f83d9abfb41bd6b');
        this.H8 = bigInt('0x5be0cd19137e2179');

        if (reuse) {
            this.byteCount1 = bigInt(0);
            this.byteCount2 = bigInt(0);

            this.xBufOff = bigInt(0);
            for (let i: int = 0; i < this.xBuf.length; i++)
                this.xBuf[i] = 0;

            this.wOff = 0;
            for (let i: int = 0; i !== this.W.length; i++)
                this.W[i] = bigInt(0);
        }
    }

    @Override
    public Initialize(): void {
        this.initialize(true); // reuse instance
    }

    // protected

    @Override
    protected HashCore(rgb: ByteArray, ibStart: int, cbSize: int): void {
        // fill the current word
        while ((this.xBufOff !== 0) && (cbSize > 0)) {
            this.update(rgb[ibStart]);
            ibStart++;
            cbSize--;
        }

        // process whole words.
        while (cbSize > this.xBuf.length) {
            this.processWord(rgb, ibStart);
            ibStart += this.xBuf.length;
            cbSize -= this.xBuf.length;
            this.byteCount1 = this.byteCount1.add(this.xBuf.length);
        }

        // load in the remainder.
        while (cbSize > 0) {
            this.update(rgb[ibStart]);
            ibStart++;
            cbSize--;
        }
    }

    @Override
    protected HashFinal(): ByteArray {
        this.adjustByteCounts();

        const lowBitLength: BigNumber = this.byteCount1.shl(3);
        const hiBitLength: BigNumber = bigInt(this.byteCount2);

        // add the pad bytes.
        this.update(128);
        while (this.xBufOff !== 0)
            this.update(0);

        this.processLength(lowBitLength, hiBitLength);
        this.processBlock();

        const output: ByteArray = New.ByteArray(64);
        this.unpackWord(this.H1, output, 0);
        this.unpackWord(this.H2, output, 8);
        this.unpackWord(this.H3, output, 16);
        this.unpackWord(this.H4, output, 24);
        this.unpackWord(this.H5, output, 32);
        this.unpackWord(this.H6, output, 40);
        this.unpackWord(this.H7, output, 48);
        this.unpackWord(this.H8, output, 56);

        this.Initialize();
        return output;
    }

    private update(input: byte): void {
        this.xBuf[this.xBufOff++] = input;
        if (this.xBufOff === this.xBuf.length) {
            this.processWord(this.xBuf, 0);
            this.xBufOff = 0;
        }
        this.byteCount1 = this.byteCount1.add(1);
    }

    private processWord(input: ByteArray, inOff: int): void {
        this.W[this.wOff++] = bigInt(input[inOff]).shl(56)
            .or(bigInt(input[inOff + 1]).shl(48))
            .or(bigInt(input[inOff + 2]).shl(40))
            .or(bigInt(input[inOff + 3]).shl(32))
            .or(bigInt(input[inOff + 4]).shl(24))
            .or(bigInt(input[inOff + 5]).shl(16))
            .or(bigInt(input[inOff + 6]).shl(8))
            .or(bigInt(input[inOff + 7]));

        if (this.wOff === 16)
            this.processBlock();
    }

    private unpackWord(word: BigNumber, output: ByteArray, outOff: int): void {
        output[outOff] = Convert.ToByte(word.shr(56));
        output[outOff + 1] = Convert.ToByte(word.shr(48));
        output[outOff + 2] = Convert.ToByte(word.shr(40));
        output[outOff + 3] = Convert.ToByte(word.shr(32));
        output[outOff + 4] = Convert.ToByte(word.shr(24));
        output[outOff + 5] = Convert.ToByte(word.shr(16));
        output[outOff + 6] = Convert.ToByte(word.shr(8));
        output[outOff + 7] = Convert.ToByte(word.toNumber());
    }

    // adjust the byte counts so that byteCount2 represents the
    // upper long (less 3 bits) word of the byte count.
    private adjustByteCounts(): void {
        if (this.byteCount1.greaterThan(bigInt('0x1fffffffffffffff'))) {
            this.byteCount2 = this.byteCount2.add(this.byteCount1.shr(61));
            this.byteCount1 = this.byteCount1.and('0x1fffffffffffffff');
        }
    }

    private processLength(lowW: BigNumber, hiW: BigNumber): void {
        if (this.wOff > 14)
            this.processBlock();
        this.W[14] = hiW;
        this.W[15] = lowW;
    }

    private processBlock(): void {
        this.adjustByteCounts();
        // expand 16 word block into 80 word blocks.
        for (let t: int = 16; t <= 79; t++) {
            this.W[t] = this.Sigma1(this.W[t - 2]).add(this.W[t - 7]).add(this.Sigma0(this.W[t - 15])).add(this.W[t - 16]);
        }

        // set up working variables.
        let a: BigNumber = this.H1;
        let b: BigNumber = this.H2;
        let c: BigNumber = this.H3;
        let d: BigNumber = this.H4;
        let e: BigNumber = this.H5;
        let f: BigNumber = this.H6;
        let g: BigNumber = this.H7;
        let h: BigNumber = this.H8;

        for (let t: int = 0; t <= 79; t++) {
            let T1: BigNumber = h.add(this.Sum1(e)).add(this.Ch(e, f, g)).add(SHAConstants.K2[t]).add(this.W[t]);
            let T2: BigNumber = this.Sum0(a).add(this.Maj(a, b, c));
            h = g;
            g = f;
            f = e;
            e = d.add(T1);
            d = c;
            c = b;
            b = a;
            a = T1.add(T2);
        }

        this.H1 = this.H1.add(a);
        this.H2 = this.H2.add(b);
        this.H3 = this.H3.add(c);
        this.H4 = this.H4.add(d);
        this.H5 = this.H5.add(e);
        this.H6 = this.H6.add(f);
        this.H7 = this.H7.add(g);
        this.H8 = this.H8.add(h);
        // reset the offset and clean out the word buffer.
        this.wOff = 0;
        for (let i: int = 0; i !== this.W.length; i++)
            this.W[i] = bigInt(0);
    }

    private rotateRight(x: BigNumber, n: int): BigNumber {
        return (x.shr(n)).or(x.shl(64 - n));
    }

    /* SHA-512 and SHA-512 functions (as for SHA-256 but for longs) */
    private Ch(x: BigNumber, y: BigNumber, z: BigNumber): BigNumber {
        return ((x.and(y)).pow((x.not()).and(z)));
    }

    private Maj(x: BigNumber, y: BigNumber, z: BigNumber): BigNumber {
        return ((x.and(y)).pow(x.and(z)).pow(y.and(z)));
    }

    private Sum0(x: BigNumber): BigNumber {
        return this.rotateRight(x, 28).pow(this.rotateRight(x, 34)).pow(this.rotateRight(x, 39));
    }

    private Sum1(x: BigNumber): BigNumber {
        return this.rotateRight(x, 14).pow(this.rotateRight(x, 18)).pow(this.rotateRight(x, 41));
    }

    private Sigma0(x: BigNumber): BigNumber {
        return this.rotateRight(x, 1).pow(this.rotateRight(x, 8)).pow(x.shr(7));
    }

    private Sigma1(x: BigNumber): BigNumber {
        return this.rotateRight(x, 19).pow(this.rotateRight(x, 61)).pow(x.shr(6));
    }
}