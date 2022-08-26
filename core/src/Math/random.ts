
var seeded = false;
var previous = false;
var y2 = 0;


// Linear Congruential Generator
// Variant of a Lehman Generator
var lcg = (function () {
    // Set to values from http://en.wikipedia.org/wiki/Numerical_Recipes
    // m is basically chosen to be large (as it is the max period)
    // and for its relationships to a and c
    var m = 4294967296,
        // a - 1 should be divisible by m's prime factors
        a = 1664525,
        // c and m should be co-prime
        c = 1013904223,
        seed: any,
        z: any;
    return {
        setSeed: function (val: any) {
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

const randomSeed = function (seed: number) {
    lcg.setSeed(seed);
    seeded = true;
    previous = false;
}

export const random = function (min: number | number[], max: number): number {
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
    return undefined as any;
}

export const randomGaussian = function (mean: number, sd: number): number {
    var y1, x1, x2, w;
    if (previous) {
        y1 = y2;
        previous = false;
    } else {
        do {
            x1 = this.random(2) - 1;
            x2 = this.random(2) - 1;
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
