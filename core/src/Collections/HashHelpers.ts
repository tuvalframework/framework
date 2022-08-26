import { int, long } from "../float";
import { ArgumentException } from "../Exceptions/ArgumentException";
import { IEqualityComparer } from "./IEqualityComparer";
import { BitConverter } from "../BitConverter";
import { RandomNumberGenerator } from "../security/cryptography/RandomNumberGenerator";
import { RandomizedObjectEqualityComparer } from "./Generic/RandomizedObjectEqualityComparer";
import { StringEqualityComparer } from "./Generic/EqualityComparer";
import { IWellKnownStringEqualityComparer } from "../IWellKnownStringEqualityComparer";
import { is } from "../is";
import { System } from "../SystemTypes";
import { Convert } from "../convert";

export class HashHelpers {
    public static readonly primes: int[];
    private static currentIndex: int;
    private static rng: RandomNumberGenerator;
    private static data: Uint8Array;

    private static readonly MaxPrimeArrayLength: int = 2146435069;

    public static staticConstructor() {
        (HashHelpers as any).primes = [3, 7, 11, 17, 23, 29, 37, 47, 59, 71, 89, 107, 131, 163, 197, 239, 293, 353, 431, 521, 631, 761, 919, 1103, 1327, 1597, 1931, 2333, 2801, 3371, 4049, 4861, 5839, 7013, 8419, 10103, 12143, 14591, 17519, 21023, 25229, 30293, 36353, 43627, 52361, 62851, 75431, 90523, 108631, 130363, 156437, 187751, 225307, 270371, 324449, 389357, 467237, 560689, 672827, 807403, 968897, 1162687, 1395263, 1674319, 2009191, 2411033, 2893249, 3471899, 4166287, 4999559, 5999471, 7199369];
    }

    public static ExpandPrime(oldSize: int): int {
        const int32: int = 2 * oldSize;
        if (int32 > 2146435069 && 2146435069 > oldSize) {
            return 2146435069;
        }
        return HashHelpers.GetPrime(int32);
    }

    public static GetPrime(min: int): int {
        if (min < 0) {
            throw new ArgumentException("min < 0");
        }
        for (let i = 0; i < HashHelpers.primes.length; i++) {
            const int32: int = HashHelpers.primes[i];
            if (int32 >= min) {
                return int32;
            }
        }
        for (let j = min | 1; j < 2147483647; j += 2) {
            if (HashHelpers.IsPrime(j) && (j - 1) % 101 !== 0) {
                return j;
            }
        }
        return min;
    }

    public static IsPrime(candidate: int): boolean {
        if ((candidate & 1) == 0) {
            return candidate == 2;
        }
        const int32: int = Math.sqrt(candidate);
        for (let i = 3; i <= int32; i += 2) {
            if (candidate % i == 0) {
                return false;
            }
        }
        return true;
    }
    public static GetEntropy(): long {
        let int64: long = Convert.ToLong(0);

        if (HashHelpers.currentIndex == 1024) {
            if (HashHelpers.rng == null) {
                HashHelpers.rng = RandomNumberGenerator.Create();
                HashHelpers.data = new Uint8Array(1024);
            }
            HashHelpers.rng.getBytes(HashHelpers.data);
            HashHelpers.currentIndex = 0;
        }
        const int641: long = BitConverter.ToInt64(HashHelpers.data, HashHelpers.currentIndex);
        HashHelpers.currentIndex += 8;
        int64 = int641;
        return int64;
    }

    public static IsWellKnownEqualityComparer(comparer: any): boolean {
        if (comparer == null || comparer === StringEqualityComparer.Default) {
            return true;
        }
        return is.typeof<IWellKnownStringEqualityComparer>(comparer,System.Types.IWellKnownStringEqualityComparer);
    }
    public static GetRandomizedEqualityComparer(comparer: any): IEqualityComparer<any> {
        if (comparer == null) {
            return new RandomizedObjectEqualityComparer();
        }
        if (comparer == StringEqualityComparer.Default) {
            return new RandomizedObjectEqualityComparer();
        }
        const wellKnownStringEqualityComparer: IWellKnownStringEqualityComparer = comparer as IWellKnownStringEqualityComparer;
        if (wellKnownStringEqualityComparer == null) {
            return null as any;
        }
        return wellKnownStringEqualityComparer.getRandomizedEqualityComparer();
    }
}

HashHelpers.staticConstructor();