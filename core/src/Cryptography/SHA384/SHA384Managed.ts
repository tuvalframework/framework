import { byte } from "../../byte";
import { Convert } from "../../convert";
import { ByteArray, int, New } from "../../float";
import { bigInt, BigNumber } from "../../Math/BigNumber";
import { Override } from "../../Reflection/Decorators/ClassInfo";
import { SHAConstants } from "../SHAConstants";
import { SHA384 } from "./SHA384";

export class SHA384Managed extends SHA384 {

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
        // SHA-384 initial hash value
        // The first 64 bits of the fractional parts of the square roots
        // of the 9th through 16th prime numbers
        this.H1 = bigInt('0xcbbb9d5dc1059ed8');
        this.H2 = bigInt('0x629a292a367cd507');
        this.H3 = bigInt('0x9159015a3070dd17');
        this.H4 = bigInt('0x152fecd8f70e5939');
        this.H5 = bigInt('0x67332667ffc00b31');
        this.H6 = bigInt('0x8eb44a8768581511');
        this.H7 = bigInt('0xdb0c2e0d64f98fa7');
        this.H8 = bigInt('0x47b5481dbefa4fa4');

        if (reuse) {
            this.byteCount1 = bigInt(0);
            this.byteCount2 = bigInt(0);

            this.xBufOff = 0;
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
        const hiBitLength: BigNumber = this.byteCount2;

        // add the pad bytes.
        this.update(Convert.ToByte(128));
        while (this.xBufOff != 0)
            this.update(Convert.ToByte(0));

        this.processLength(lowBitLength, hiBitLength);
        this.processBlock();

        const output: ByteArray = New.ByteArray(48);
        this.unpackWord(this.H1, output, 0);
        this.unpackWord(this.H2, output, 8);
        this.unpackWord(this.H3, output, 16);
        this.unpackWord(this.H4, output, 24);
        this.unpackWord(this.H5, output, 32);
        this.unpackWord(this.H6, output, 40);

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
            this.byteCount2 = this.byteCount2.add((this.byteCount1.shr(61)));
            this.byteCount1 = this.byteCount1.and(bigInt('0x1fffffffffffffff'));
        }
    }

    private processLength(lowW: BigNumber, hiW: BigNumber): void {
        if (this.wOff > 14)
            this.processBlock();
        this.W[14] = hiW;
        this.W[15] = lowW;
    }

    private processBlock(): void {
        let a: BigNumber, b: BigNumber, c: BigNumber, d: BigNumber, e: BigNumber, f: BigNumber, g: BigNumber, h: BigNumber;

        // abcrem doesn't work on fields
        const W: BigNumber[] = this.W;
        const K2: BigNumber[] = SHAConstants.K2;

        this.adjustByteCounts();
        // expand 16 word block into 80 word blocks.
        for (let t: int = 16; t <= 79; t++) {
            a = W[t - 15];
            a = a.shr(1).or(a.shl(63)).pow((a.shr(8)).or(a.shl(56))).pow(a.shr(7));
            b = W[t - 2];
            b = ((b.shr(19)).or(b.shr(45))).pow((b.shr(61)).or(b.shl(3))).pow(b.shr(6));
            W[t] = b.add(W[t - 7]).add(a).add(W[t - 16]);
        }
        // set up working variables.
        a = this.H1;
        b = this.H2;
        c = this.H3;
        d = this.H4;
        e = this.H5;
        f = this.H6;
        g = this.H7;
        h = this.H8;

        for (let t: int = 0; t <= 79; t++) {
            let T1: BigNumber = ((e.shr(14)).or(e.shl(50))).pow((e.shr(18)).or(e.shl(46))).pow((e.shr(41)).or(e.shl(23)));
            T1 = T1.add(h).add(((e.and(f)).pow((e.not()).and(g)))).add(K2[t]).add(W[t]);

            let T2: BigNumber = ((a.shr(28)).or(a.shl(36))).pow((a.shr(34)).or(a.shl(30))).pow((a.shr(39)).or(a.shl(25)));
            T2 = T2.add((a.and(b)).pow(a.and(c)).pow(b.and(c)));

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
        for (let i: int = 0; i !== W.length; i++)
            W[i] = bigInt(0);
    }
}