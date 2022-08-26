import { int } from "../float";
import { hypot } from "./hypot";
import { ArgumentOutOfRangeException } from "../Exceptions/ArgumentOutOfRangeException";
import { Vector } from './Vector';


const PERLIN_YWRAPB = 4;
const PERLIN_YWRAP = 1 << PERLIN_YWRAPB;
const PERLIN_ZWRAPB = 8;

const PERLIN_ZWRAP = 1 << PERLIN_ZWRAPB;
const PERLIN_SIZE = 4095;

let perlin_octaves = 4; // default to medium smooth
let perlin_amp_falloff = 0.5; // 50% reduction/octave

const scaled_cosine = i => 0.5 * (1.0 - Math.cos(i * Math.PI));
const _PI = Math.PI;
let perlin: int[]; // will be initialized lazily by noise() or noiseSeed()

let seeded = false;
let previous = false;
let y2 = 0;


// Linear Congruential Generator
// Variant of a Lehman Generator
const lcg = (function () {
    // Set to values from http://en.wikipedia.org/wiki/Numerical_Recipes
    // m is basically chosen to be large (as it is the max period)
    // and for its relationships to a and c
    var m = 4294967296,
        // a - 1 should be divisible by m's prime factors
        a = 1664525,
        // c and m should be co-prime
        c = 1013904223,
        seed,
        z;
    return {
        setSeed: function (val) {
            // pick a random seed if val is undefined or null
            // the >>> 0 casts the seed to an unsigned 32-bit integer
            z = seed = (val == null ? Math.random() * m : val) >>> 0;
        },
        getSeed: function () {
            return seed;
        },
        rand: function () {
            // define the recurrence relationship
            z = (a * z + c) % m;
            // return a float in [0, 1)
            // if z = m then z / m = 0 therefore (z % m) / m < 1 always
            return z / m;
        }
    };
})();


export class TMath {
    public static readonly HALF_PI = _PI / 2;
    public static readonly PI = _PI;
    public static readonly QUARTER_PI = _PI / 4;
    public static readonly TAU = _PI * 2;
    public static readonly TWO_PI = _PI * 2;

    public static noise(x: int, y: int = 0, z: int = 0): int {
        if (perlin == null) {
            perlin = new Array(PERLIN_SIZE + 1);
            for (let i = 0; i < PERLIN_SIZE + 1; i++) {
                perlin[i] = Math.random();
            }
        }

        if (x < 0) {
            x = -x;
        }
        if (y < 0) {
            y = -y;
        }
        if (z < 0) {
            z = -z;
        }

        let xi = Math.floor(x),
            yi = Math.floor(y),
            zi = Math.floor(z);
        let xf = x - xi;
        let yf = y - yi;
        let zf = z - zi;
        let rxf, ryf;

        let r = 0;
        let ampl = 0.5;

        let n1, n2, n3;

        for (let o = 0; o < perlin_octaves; o++) {
            let of = xi + (yi << PERLIN_YWRAPB) + (zi << PERLIN_ZWRAPB);

            rxf = scaled_cosine(xf);
            ryf = scaled_cosine(yf);

            n1 = perlin[of & PERLIN_SIZE];
            n1 += rxf * (perlin[(of + 1) & PERLIN_SIZE] - n1);
            n2 = perlin[(of + PERLIN_YWRAP) & PERLIN_SIZE];
            n2 += rxf * (perlin[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n2);
            n1 += ryf * (n2 - n1);

            of += PERLIN_ZWRAP;
            n2 = perlin[of & PERLIN_SIZE];
            n2 += rxf * (perlin[(of + 1) & PERLIN_SIZE] - n2);
            n3 = perlin[(of + PERLIN_YWRAP) & PERLIN_SIZE];
            n3 += rxf * (perlin[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n3);
            n2 += ryf * (n3 - n2);

            n1 += scaled_cosine(zf) * (n2 - n1);

            r += n1 * ampl;
            ampl *= perlin_amp_falloff;
            xi <<= 1;
            xf *= 2;
            yi <<= 1;
            yf *= 2;
            zi <<= 1;
            zf *= 2;

            if (xf >= 1.0) {
                xi++;
                xf--;
            }
            if (yf >= 1.0) {
                yi++;
                yf--;
            }
            if (zf >= 1.0) {
                zi++;
                zf--;
            }
        }
        return r;
    }
    public static noiseDetail(lod: int, falloff: int): void {
        if (lod > 0) {
            perlin_octaves = lod;
        }
        if (falloff > 0) {
            perlin_amp_falloff = falloff;
        }
    }
    public static noiseSeed(seed: int) {
        // Linear Congruential Generator
        // Variant of a Lehman Generator
        const lcg = (() => {
            // Set to values from http://en.wikipedia.org/wiki/Numerical_Recipes
            // m is basically chosen to be large (as it is the max period)
            // and for its relationships to a and c
            const m = 4294967296;
            // a - 1 should be divisible by m's prime factors
            const a = 1664525;
            // c and m should be co-prime
            const c = 1013904223;
            let seed, z;
            return {
                setSeed(val) {
                    // pick a random seed if val is undefined or null
                    // the >>> 0 casts the seed to an unsigned 32-bit integer
                    z = seed = (val == null ? Math.random() * m : val) >>> 0;
                },
                getSeed() {
                    return seed;
                },
                rand() {
                    // define the recurrence relationship
                    z = (a * z + c) % m;
                    // return a float in [0, 1)
                    // if z = m then z / m = 0 therefore (z % m) / m < 1 always
                    return z / m;
                }
            };
        })();

        lcg.setSeed(seed);
        perlin = new Array(PERLIN_SIZE + 1);
        for (let i = 0; i < PERLIN_SIZE + 1; i++) {
            perlin[i] = lcg.rand();
        }
    }

    public static abs(x: int): int {
        return Math.abs(x);
    }
    public static ceil(x: int): int {
        return Math.ceil(x);
    }
    public static constrain(n: int, low: int, high: int) {
        return Math.max(Math.min(n, high), low);
    }
    public static dist(x1: int, y1: int, z1: int, x2: int, y2: int, z2: int): int;
    public static dist(x1: int, y1: int, x2: int, y2: int): int;
    public static dist(...args: any[]): int {
        if (args.length === 4) {
            //2D
            return hypot(args[2] - args[0], args[3] - args[1]);
        } else if (args.length === 6) {
            //3D
            return hypot(args[3] - args[0], args[4] - args[1], args[5] - args[2]);
        }
        throw new ArgumentOutOfRangeException('');
    }
    public static exp(x: int): int {
        return Math.exp(x);
    }
    public static floor(x: int): int {
        return Math.floor(x);
    }
    public static lerp(start: int, stop: int, amt: int): int {
        return amt * (stop - start) + start;
    }
    public static log(x: int): int {
        return Math.log(x);
    }
    public static mag(x: int, y: int) {
        return hypot(x, y);
    }
    public static map(n: int, start1: int, stop1: int, start2: int, stop2: int, withinBounds?: boolean): int {
        const newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
        if (!withinBounds) {
            return newval;
        }
        if (start2 < stop2) {
            return TMath.constrain(newval, start2, stop2);
        } else {
            return TMath.constrain(newval, stop2, start2);
        }
    }
    public static max(...values: int[]): int {
        return Math.max(...values);
    }
    public static min(...values: int[]): int {
        return Math.min(...values);
    }
    public static norm(n: int, start: int, stop: int): int {
        return TMath.map(n, start, stop, 0, 1);
    }
    public static pow(x: int, y: int): int {
        return Math.pow(x, y);
    }
    public static round(n: int, decimals: int = 1) {
        if (!decimals) {
            return Math.round(n);
        }
        return Number(Math.round(Number.parseFloat(n + 'e' + decimals.toString())) + 'e-' + decimals);
    }
    public static sq(n: int): int {
        return n * n;
    }
    public static sqrt(n: int): int {
        return Math.sqrt(n);
    }
    public fract(toConvert: int): int {
        let sign = 0;
        let num = Number(toConvert);
        if (isNaN(num) || Math.abs(num) === Infinity) {
            return num;
        } else if (num < 0) {
            num = -num;
            sign = 1;
        }
        if (String(num).includes('.') && !String(num).includes('e')) {
            let toFract: string | int = String(num);
            toFract = Number('0' + toFract.slice(toFract.indexOf('.')));
            return Math.abs(sign - toFract);
        } else if (num < 1) {
            return Math.abs(sign - num);
        } else {
            return 0;
        }
    }

    public static randomSeed(seed: number): void {
        lcg.setSeed(seed);
        seeded = true;
        previous = false;
    }

    public static random(min: int | int[], max?: int): int {
        var rand;

        if (seeded) {
            rand = lcg.rand();
        } else {
            rand = Math.random();
        }
        if (typeof min === 'undefined') {
            return rand;
        } else if (typeof max === 'undefined') {
            if (min instanceof Array) {
                return min[Math.floor(rand * min.length)];
            } else {
                return rand * min;
            }
        } else if (typeof min === 'number') {
            if (min > max) {
                var tmp = min;
                min = max;
                max = tmp;
            }

            return rand * (max - min) + min;
        }
        throw new ArgumentOutOfRangeException('');
    }

    public static randomGaussian(mean: number, sd: number): number {
        var y1, x1, x2, w;
        if (previous) {
            y1 = y2;
            previous = false;
        } else {
            do {
                x1 = TMath.random(2) - 1;
                x2 = TMath.random(2) - 1;
                w = x1 * x1 + x2 * x2;
            } while (w >= 1);
            w = Math.sqrt(-2 * Math.log(w) / w);
            y1 = x1 * w;
            y2 = x2 * w;
            previous = true;
        }

        var m = mean || 0;
        var s = sd || 1;
        return y1 * s + m;
    }
    public static createVector(x?: int, y?: int, z?: int): Vector {
        return new Vector(x, y, z);
    }

    // Clamp value to range <a, b>

    public static Clamp(x: number, a: number, b: number): number {
        return (x < a) ? a : ((x > b) ? b : x);
    }

    // Clamp value to range <a, inf)

    public static ClampBottom(x, a) {
        return x < a ? a : x;
    }

    // Linear mapping from range <a1, a2> to range <b1, b2>

    public static MapLinear(x: number, a1: number, a2: number, b1: number, b2: number): number {
        return b1 + (x - a1) * (b2 - b1) / (a2 - a1);
    }

    // http://en.wikipedia.org/wiki/Smoothstep

    public static SmoothStep(x: number, min: number, max: number): number {
        if (x <= min) return 0;
        if (x >= max) return 1;

        x = (x - min) / (max - min);

        return x * x * (3 - 2 * x);
    }

    public static SmootherStep(x: number, min: number, max: number): number {

        if (x <= min) return 0;
        if (x >= max) return 1;

        x = (x - min) / (max - min);

        return x * x * x * (x * (x * 6 - 15) + 10);

    }

    // Random float from <0, 1> with 16 bits of randomness
    // (standard Math.random() creates repetitive patterns when applied over larger space)

    public static Random16(): number {
        return (65280 * Math.random() + 255 * Math.random()) / 65535;
    }

    // Random integer from <low, high> interval

    public static RandInt(low: number, high: number): number {
        return low + Math.floor(Math.random() * (high - low + 1));
    }

    // Random float from <low, high> interval

    public static RandFloat(low: number, high: number): number {
        return low + Math.random() * (high - low);
    }

    // Random float from <-range/2, range/2> interval

    public static RandFloatSpread(range: number): number {
        return range * (0.5 - Math.random());
    }

    public static Sign(x: number): number {
        return (x < 0) ? - 1 : (x > 0) ? 1 : 0;
    }

    public static generateUUID: () => string;

    public static DegToRad: (degrees: number) => number;

    public static RadToDeg: (radians: number) => number;

    public static IsPowerOfTwo(value: number): boolean {
        return (value & (value - 1)) === 0 && value !== 0;
    }

}

TMath.RadToDeg = (function () {
    const radianToDegreesFactor = 180 / Math.PI;
    return function (radians) {
        return radians * radianToDegreesFactor;
    };
})();

TMath.generateUUID = (function () {

    // http://www.broofa.com/Tools/Math.uuid.htm

    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = new Array(36);
    var rnd = 0, r;

    return function () {
        for (var i = 0; i < 36; i++) {
            if (i == 8 || i == 13 || i == 18 || i == 23) {
                uuid[i] = '-';
            } else if (i == 14) {
                uuid[i] = '4';
            } else {
                if (rnd <= 0x02) rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
                r = rnd & 0xf;
                rnd = rnd >> 4;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }

        return uuid.join('');

    };

})();

TMath.DegToRad = (function () {
    const degreeToRadiansFactor = Math.PI / 180;
    return function (degrees) {
        return degrees * degreeToRadiansFactor;
    };
})();