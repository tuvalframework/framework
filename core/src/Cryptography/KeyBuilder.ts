import { RandomNumberGenerator } from "./RandomNumberGenerator";
import { ByteArray, int, New } from '../float';
import { ICryptoTransform } from "./ICryptoTransform";
import { TObject } from '../Extensions/TObject';
import { TArray } from '../Extensions/TArray';
import { is } from "../is";
import { System } from "../SystemTypes";
import { Convert } from '../convert';

export class KeyBuilder {

    private static rng: RandomNumberGenerator;

    private constructor() {
    }

    private static get Rng(): RandomNumberGenerator {
        if (KeyBuilder.rng == null)
            KeyBuilder.rng = RandomNumberGenerator.Create();
        return KeyBuilder.rng;
    }

    public static Key(size: int): ByteArray {
        const key: ByteArray = New.ByteArray(size);
        KeyBuilder.Rng.GetBytes(key);
        return key;
    }

    public static IV(size: int): ByteArray {
        const iv: ByteArray = New.ByteArray(size);
        KeyBuilder.Rng.GetBytes(iv);
        return iv;
    }
}

// Process an array as a sequence of blocks
export class BlockProcessor extends TObject {

    private transform: ICryptoTransform = null as any;
    private block: ByteArray = null as any;
    private blockSize: int = 0;	// in bytes (not in bits)
    private blockCount: int = 0;

    public constructor(transform: ICryptoTransform);
    // some Transforms (like HashAlgorithm descendant) return 1 for
    // block size (which isn't their real internal block size)
    public constructor(transform: ICryptoTransform, blockSize: int);
    public constructor(...args: any[]) {
        super();
        if (args.length === 1 && is.typeof<ICryptoTransform>(args[0], System.Types.Cryptography.ICryptoTransform)) {
            const transform: ICryptoTransform = args[0];
            this.transform = transform;
            this.blockSize = transform.InputBlockSize;
            this.block = New.ByteArray(this.blockSize);
        } else if (args.length === 2 && is.typeof<ICryptoTransform>(args[0], System.Types.Cryptography.ICryptoTransform) && is.int(args[1])) {
            const transform: ICryptoTransform = args[0];
            const blockSize: int = args[1];
            this.transform = transform;
            this.blockSize = blockSize;
            this.block = New.ByteArray(blockSize);
        }
    }

    protected dispose(disposing: boolean): void {
        TArray.Clear(this.block, 0, this.blockSize);
    }

    public Initialize(): void {
        TArray.Clear(this.block, 0, this.blockSize);
        this.blockCount = 0;
    }

    public Core(rgb: ByteArray): void;
    public Core(rgb: ByteArray, ib: int, cb: int): void;
    public Core(...args: any[]): void {
        if (args.length === 1 && is.ByteArray(args[0])) {
            const rgb: ByteArray = args[0];
            this.Core(rgb, 0, rgb.length);
        } else if (args.length === 3 && is.ByteArray(args[0]) && is.int(args[1]) && is.int(args[2])) {
            const rgb: ByteArray = args[0];
            const ib: int = args[1];
            const cb: int = args[2];
            // 1. fill the rest of the "block"
            let n: int = Math.min(this.blockSize - this.blockCount, cb);
            TArray.Copy(rgb, ib, this.block, this.blockCount, n);
            this.blockCount += n;

            // 2. if block is full then transform it
            if (this.blockCount === this.blockSize) {
                this.transform.TransformBlock(this.block, 0, this.blockSize, this.block, 0);

                // 3. transform any other full block in specified buffer
                const b: int = Convert.ToInt32((cb - n) / this.blockSize);
                for (let i: int = 0; i < b; i++) {
                    this.transform.TransformBlock(rgb, n + ib, this.blockSize, this.block, 0);
                    n += this.blockSize;
                }

                // 4. if data is still present fill the "block" with the remainder
                this.blockCount = cb - n;
                if (this.blockCount > 0)
                    TArray.Copy(rgb, n + ib, this.block, 0, this.blockCount);
            }
        }
    }

    public Final(): ByteArray {
        return this.transform.TransformFinalBlock(this.block, 0, this.blockCount);
    }
}