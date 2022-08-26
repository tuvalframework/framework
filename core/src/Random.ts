import { int, double, long } from "./float";
import { Environment } from "./Environment";
import { Virtual } from "./Reflection/Decorators/ClassInfo";
import { is } from "./is";
import { ArgumentOutOfRangeException } from "./Exceptions/ArgumentOutOfRangeException";
import { Convert } from "./convert";
import { ArgumentNullException } from "./Exceptions/ArgumentNullException";

export class Random {
    private static readonly MBIG: int = 2147483647;
    private static readonly MSEED: int = 161803398;
    private static readonly MZ: int = 0;
    private inext: int = 0;
    private inextp: int = 0;
    private SeedArray: int[] = new Array(56);

    public constructor(Seed: int = Environment.TickCount) {
        Seed = Convert.ToInt32(Seed);
        let seedArray: int = 161803398 - (Seed === -2147483648 ? 2147483647 : Math.abs(Seed));
        this.SeedArray[55] = seedArray;
        let int32: int = 1;
        for (let i: int = 1; i < 55; i++) {
            let int321: int = 21 * i % 55;
            this.SeedArray[int321] = int32;
            int32 = seedArray - int32;
            if (int32 < 0) {
                int32 += 2147483647;
            }
            seedArray = this.SeedArray[int321];
        }
        for (let j: int = 1; j < 5; j++) {
            for (let k: int = 1; k < 56; k++) {
                this.SeedArray[k] -= this.SeedArray[1 + (k + 30) % 55];
                if (this.SeedArray[k] < 0) {
                    this.SeedArray[k] += 2147483647;
                }
            }
        }
        this.inext = 0;
        this.inextp = 21;
        Seed = 1;
    }


    private getSampleForLargeRange(): double {
        let int32: int = this.internalSample();
        if ((this.internalSample() % 2 === 0 ? true : false)) {
            int32 = -int32;
        }
        return Convert.ToDouble(int32 + 2147483646).div(4294967293);
    }

    private internalSample(): int {
        let int32: int = this.inext;
        let int321: int = this.inextp;
        let int322: int = int32 + 1;
        int32 = int322;
        if (int322 >= 56) {
            int32 = 1;
        }
        let int323: int = int321 + 1;
        int321 = int323;
        if (int323 >= 56) {
            int321 = 1;
        }
        let seedArray: int = this.SeedArray[int32] - this.SeedArray[int321];
        if (seedArray === 2147483647) {
            seedArray--;
        }
        if (seedArray < 0) {
            seedArray += 2147483647;
        }
        this.SeedArray[int32] = seedArray;
        this.inext = int32;
        this.inextp = int321;
        return seedArray;
    }

    public Next(): int;
    public Next(minValue: int, maxValue: int): int;
    public Next(maxValue: int): int;

    @Virtual
    public Next(...args: any[]): int {
        if (args.length === 0) {
            return this.internalSample();
        } else if (args.length === 2 && is.int(args[0]) && is.int(args[1])) {
            const minValue: int = args[0];
            const maxValue: int = args[1];
            if (minValue > maxValue) {
                throw new ArgumentOutOfRangeException("minValue", Environment.GetResourceString("Argument_MinMaxValue"/* , new object[] { "minValue", "maxValue" } */));
            }
            const int64: long = Convert.ToLong(maxValue - minValue);
            if (int64.lessThanOrEqual(2147483647)) {
                return Convert.ToInt32(int64.mul(this.sample())) + minValue;
            }
            return Convert.ToInt32(int64.mul(this.getSampleForLargeRange()).add(minValue));
        } else if (args.length === 1 && is.int(args[0])) {
            const maxValue: int = args[0];
            if (maxValue < 0) {
                throw new ArgumentOutOfRangeException("maxValue", Environment.GetResourceString("ArgumentOutOfRange_MustBePositive"/* , new object[] { "maxValue" } */));
            }
            return Convert.ToInt32(this.sample().mul(maxValue));
        }
        return 0;
    }

    @Virtual
    public NextBytes(buffer: Uint8Array): void {
        if (buffer == null) {
            throw new ArgumentNullException("buffer");
        }
        for (let i: int = 0; i < buffer.length; i++) {
            buffer[i] = Convert.ToByte(this.internalSample() % 256);
        }
    }

    @Virtual
    public nextDouble(): double {
        return this.sample();
    }

    @Virtual
    protected sample(): double {
        return Convert.ToDouble(this.internalSample() * 4.6566128752458E-10);
    }
}