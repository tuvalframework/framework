import { IEqualityComparer } from "../IEqualityComparer";
import { IWellKnownStringEqualityComparer } from "../../IWellKnownStringEqualityComparer";
import { long, int } from "../../float";
import { HashHelpers } from "../HashHelpers";
import { System } from "../../SystemTypes";
import { as } from "../../as";
import { is } from "../../is";
import { IEquatable } from "../../IEquatable";
import { Convert } from "../../convert";

export class RandomizedObjectEqualityComparer<T> implements IEqualityComparer<T>, IWellKnownStringEqualityComparer {
    private _entropy: long = Convert.ToLong(0);

    public constructor() {
        this._entropy = HashHelpers.GetEntropy();
    }
    public Equals(obj: RandomizedObjectEqualityComparer<T>): boolean;
    public Equals(x: T, y: T): boolean;
    public Equals(...args: any[]): boolean {
        if (args.length === 2) {
            const x: T = args[0];
            const y: T = args[1];

            if (x == null) {
                if (y != null) {
                    return false;
                }
                return true;
            }
            if (y == null) {
                return false;
            } else if (x === y) {
                return true;
            } else if (is.typeof<IEquatable<T>>(x, System.Types.IEquatable)) {
                return (x as any).equals(y);
            }
            return false;
        } else if (args.length === 1) {
            const obj: RandomizedObjectEqualityComparer<T> = args[0];
            const randomizedObjectEqualityComparer: RandomizedObjectEqualityComparer<T> = obj;
            if (randomizedObjectEqualityComparer == null) {
                return false;
            }
            return this._entropy == randomizedObjectEqualityComparer._entropy;
        }

        return false;
    }



    public GetHashCode(obj: any): int {
        if (obj == null) {
            return 0;
        }
        const str: string = as(obj, System.Types.Primitives.String);
        if (str == null) {
            return obj.getHashCode();
        }
        return this.internalMarvin32HashString(str, str.length * 4, this._entropy);
    }
    private internalMarvin32HashString(str: string, len: number, seed: long) {
        const buffer = new ArrayBuffer(64);
        const loView = new Uint32Array(buffer, 0, 1);
        loView[0] = seed.toNumber();
        const hiView = new Uint32Array(buffer, 1, 2);
        hiView[0] = seed.shr(32).toNumber();
        function ROTL32(x: number, k: number) {
            return (((x) << (k)) | ((x) >> (32 - k)));
        }
        function U8TO32_LE(p: Uint8Array, ptr: number): number {
            return p[ptr] | (Convert.ToInt32(p[ptr + 1] << 8)) | (Convert.ToInt32(p[ptr + 2] << 16)) | (Convert.ToInt32(p[ptr + 3] << 24));
        }
        function Marvin32_Mix(lo: Uint32Array, hi: Uint32Array, v: number) {
            lo[0] += v;
            hi[0] ^= lo[0];
            lo[0] = ROTL32(lo[0], 20) + hi[0];
            hi[0] = ROTL32(hi[0], 9) ^ lo[0];
            lo[0] = ROTL32(lo[0], 27) + hi[0];
            hi[0] = ROTL32(hi[0], 19);
        }
        const strBytes = str.getBytes();
        let ptr = 0;
        while (len >= 4) {
            Marvin32_Mix(loView, hiView, U8TO32_LE(strBytes, ptr));
            ptr += 4;
            len -= 4;
        }
        let final = 0x80;
        switch (len) {
            case 3: final = (final << 8) | strBytes[ptr + 2];
            case 2: final = (final << 8) | strBytes[ptr + 1];
            case 1: final = (final << 8) | strBytes[ptr + 0];
            case 0:
            default: ;
        }
        Marvin32_Mix(loView, hiView, final);
        Marvin32_Mix(loView, hiView, 0);

        return loView[0] ^ hiView[0];

    }

    /*  public override int GetHashCode() {
         return this.GetType().Name.GetHashCode() ^ (int)(this._entropy & (long)2147483647);
     } */

    public getEqualityComparerForSerialization(): IEqualityComparer<string> {
        return null as any;
    }

    public getRandomizedEqualityComparer(): IEqualityComparer<string> {
        return new RandomizedObjectEqualityComparer();
    }
}