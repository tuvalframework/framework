import { NotImplementedException } from '../Exceptions/NotImplementedException';


var BASE = 1e7,
    LOG_BASE = 7,
    MAX_INT = 9007199254740992,
    MAX_INT_ARR = smallToArray(MAX_INT),
    DEFAULT_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";

var supportsNativeBigInt = typeof BigInt === "function";

function Integer(v, radix?, alphabet?, caseSensitive?) {
    // public constructor() {
    if (typeof v === "undefined") return Integer[0];
    if (typeof radix !== "undefined") return +radix === 10 && !alphabet ? parseValue(v) : parseBase(v, radix, alphabet, caseSensitive);
    return parseValue(v);
    //  }
}

export class BigInteger {
    private value: number = 0;
    private sign: boolean = false;
    private isSmall: boolean = false;
    public constructor(value: any, sign: boolean) {
        this.value = value;
        this.sign = sign;
        this.isSmall = false;
    }
    public add(v: any): any { }
    public plus(v: any): any { }
    public subtract(v: any): any { }
    public sub(v: any): any { }
    public minus(v: any): any { }
    public negate(): any { }
    public neg(): any { }
    public abs(): any { }
    public multiply(v: any): any { }
    public mul(v: any): BigNumber { throw new NotImplementedException(''); }
    public times(v: any): any { }
    public _multiplyBySmall(a: any): any { }
    public square(): any { }
    public divmod(a: any): any { }
    public divide(a: any): any { }
    public div(a: any): BigNumber {  throw new NotImplementedException('');}
    public over(a: any): any { }
    public mod(a: any): BigNumber { throw new NotImplementedException(''); }
    public remainder(a: any): any { }
    public pow(a: any): any { }
    public modPow(exp, mod): any { }
    public compareAbs(a: any): any { }
    public compare(a: any): any { }
    public compareTo(a: any): any { }
    public equals(a: any): any { }
    public eq(a: any): any { }
    public notEquals(a: any): any { }
    public neq(a: any): any { }
    public greater(a: any): any { }
    public greaterThan(a: any): any { }
    public gt(a: any): any { }
    public lesser(a: any): any { }
    public lessThan(a: any): any { }
    public lt(a: any): any { }
    public greaterOrEquals(a: any): any { }
    public greaterThanOrEqual(a: any): any { }
    public geq(a: any): any { }
    public lesserOrEquals(a: any): any { }
    public lessThanOrEqual(a: any): any { }
    public leq(a: any): any { }
    public isEven(): any { }
    public isOdd(): any { }
    public isPositive(): any { }
    public isNegative(): any { }
    public isUnit(): any { }
    public isZero(): any { }
    public isDivisibleBy(a: any): any { }
    public isPrime(a: any): any { }
    public isProbablePrime(iterations, rng): any { }
    public modInv(n: any): any { }
    public next(): any { }
    public prev(): any { }
    public shiftLeft(n: any): any { }
    public shl(n: any): any { }
    public shiftRight(n: any): any { }
    public shr(n: any): any { }
    public not(): any { }
    public and(n: any): any { }
    public or(n: any): any { }
    public xor(n: any): any { }
    public toArray(radix: any): any { }
    public toString(radix, alphabet): any { }
    public toJSON(): any { }
    public toJSNumber(): any { }
    public toNumber(): any { }
    public bitLength(): any { }
}

BigInteger.prototype = Object.create(Integer.prototype);

export class SmallInteger {
    private value: number = 0;
    public sign: boolean = false;
    private isSmall: boolean = false;
    public constructor(value: number) {
        this.value = value;
        this.sign = value < 0;
        this.isSmall = true;
    }
    public add(v: any): any { }
    public plus(v: any): any { }
    public subtract(v: any): any { }
    public sub(v: any): any { }
    public minus(v: any): any { }
    public negate(): any { }
    public neg(): any { }
    public abs(): any { }
    public _multiplyBySmall(a: any): any { }
    public multiply(v: any): any { }
    public mul(v: any): BigNumber { throw new NotImplementedException(''); }
    public times(v: any): any { }
    public square(): any { }
    public divmod(a: any): any { }
    public divide(a: any): any { }
    public div(a: any): BigNumber {  throw new NotImplementedException('');}
    public over(a: any): any { }
    public mod(a: any): BigNumber { throw new NotImplementedException(''); }
    public remainder(a: any): any { }
    public pow(a: any): any { }
    public modPow(exp, mod): any { }
    public compareAbs(a: any): any { }
    public compare(a: any): any { }
    public compareTo(a: any): any { }
    public equals(a: any): any { }
    public eq(a: any): any { }
    public notEquals(a: any): any { }
    public neq(a: any): any { }
    public greater(a: any): any { }
    public greaterThan(a: any): any { }
    public gt(a: any): any { }
    public lesser(a: any): any { }
    public lessThan(a: any): any { }
    public lt(a: any): any { }
    public greaterOrEquals(a: any): any { }
    public greaterThanOrEqual(a: any): any { }
    public geq(a: any): any { }
    public lesserOrEquals(a: any): any { }
    public lessThanOrEqual(a: any): any { }
    public leq(a: any): any { }
    public isEven(): any { }
    public isOdd(): any { }
    public isPositive(): any { }
    public isNegative(): any { }
    public isUnit(): any { }
    public isZero(): any { }
    public isDivisibleBy(a: any): any { }
    public isPrime(a: any): any { }
    public isProbablePrime(iterations, rng): any { }
    public modInv(n: any): any { }
    public next(): any { }
    public prev(): any { }
    public shiftLeft(n: any): any { }
    public shl(n: any): any { }
    public shiftRight(n: any): any { }
    public shr(n: any): any { }
    public not(): any { }
    public and(n: any): any { }
    public or(n: any): any { }
    public xor(n: any): any { }
    public toArray(radix: any): any { }
    public toString(radix, alphabet): any { }
    public toJSON(): any { }
    public toJSNumber(): any { }
    public bitLength(): any { }
    public toNumber(): any { }
}
SmallInteger.prototype = Object.create(Integer.prototype);

export class NativeBigInt {
    private value: number = 0;
    public constructor(value: any) {
        this.value = value;
    }
    public add(v: any): any { }
    public plus(v: any): any { }
    public subtract(v: any): any { }
    public sub(v: any): any { }
    public minus(v: any): any { }
    public negate(): any { }
    public neg(): any { }
    public abs(): any { }
    public multiply(v: any): any { }
    public mul(v: any): BigNumber { throw new NotImplementedException(''); }
    public times(v: any): any { }
    public square(v): any { }
    public divmod(a: any): any { }
    public divide(a: any): any { }
    public div(a: any): BigNumber {  throw new NotImplementedException('');}
    public over(a: any): any { }
    public mod(a: any): BigNumber { throw new NotImplementedException(''); }
    public remainder(a: any): any { }
    public pow(a: any): any { }
    public modPow(exp, mod): any { }
    public compareAbs(a: any): any { }
    public compare(a: any): any { }
    public compareTo(a: any): any { }
    public equals(a: any): any { }
    public eq(a: any): any { }
    public notEquals(a: any): any { }
    public neq(a: any): any { }
    public greater(a: any): any { }
    public greaterThan(a: any): any { }
    public gt(a: any): any { }
    public lesser(a: any): any { }
    public lessThan(a: any): any { }
    public lt(a: any): any { }
    public greaterOrEquals(a: any): any { }
    public greaterThanOrEqual(a: any): any { }
    public geq(a: any): any { }
    public lesserOrEquals(a: any): any { }
    public lessThanOrEqual(a: any): any { }
    public leq(a: any): any { }
    public isEven(): any { }
    public isOdd(): any { }
    public isPositive(): any { }
    public isNegative(): any { }
    public isUnit(): any { }
    public isZero(): any { }
    public isDivisibleBy(a: any): any { }
    public isPrime(a: any): any { }
    public isProbablePrime(iterations, rng): any { }
    public modInv(n: any): any { }
    public next(): any { }
    public prev(): any { }
    public shiftLeft(n: any): any { }
    public shl(n: any): any { }
    public shiftRight(n: any): any { }
    public shr(n: any): any { }
    public not(): any { }
    public and(n: any): any { }
    public or(n: any): any { }
    public xor(n: any): any { }
    public toArray(radix: any): any { }
    public toString(radix, alphabet): any { }
    public toJSON(): any { }
    public toJSNumber(): any { }
    public bitLength(): any { }
    public toNumber(): any { }
}
NativeBigInt.prototype = Object.create(Integer.prototype);

function isPrecise(n) {
    return -MAX_INT < n && n < MAX_INT;
}

function smallToArray(n) { // For performance reasons doesn't reference BASE, need to change this function if BASE changes
    if (n < 1e7)
        return [n];
    if (n < 1e14)
        return [n % 1e7, Math.floor(n / 1e7)];
    return [n % 1e7, Math.floor(n / 1e7) % 1e7, Math.floor(n / 1e14)];
}

function arrayToSmall(arr) { // If BASE changes this function may need to change
    trim(arr);
    var length = arr.length;
    if (length < 4 && compareAbs(arr, MAX_INT_ARR) < 0) {
        switch (length) {
            case 0: return 0;
            case 1: return arr[0];
            case 2: return arr[0] + arr[1] * BASE;
            default: return arr[0] + (arr[1] + arr[2] * BASE) * BASE;
        }
    }
    return arr;
}

function trim(v) {
    var i = v.length;
    while (v[--i] === 0);
    v.length = i + 1;
}

function createArray(length) { // function shamelessly stolen from Yaffle's library https://github.com/Yaffle/BigInteger
    var x = new Array(length);
    var i = -1;
    while (++i < length) {
        x[i] = 0;
    }
    return x;
}

function truncate(n) {
    if (n > 0) return Math.floor(n);
    return Math.ceil(n);
}

function add(a, b) { // assumes a and b are arrays with a.length >= b.length
    var l_a = a.length,
        l_b = b.length,
        r = new Array(l_a),
        carry = 0,
        base = BASE,
        sum, i;
    for (i = 0; i < l_b; i++) {
        sum = a[i] + b[i] + carry;
        carry = sum >= base ? 1 : 0;
        r[i] = sum - carry * base;
    }
    while (i < l_a) {
        sum = a[i] + carry;
        carry = sum === base ? 1 : 0;
        r[i++] = sum - carry * base;
    }
    if (carry > 0) r.push(carry);
    return r;
}

function addAny(a, b) {
    if (a.length >= b.length) return add(a, b);
    return add(b, a);
}

function addSmall(a, carry) { // assumes a is array, carry is number with 0 <= carry < MAX_INT
    var l = a.length,
        r = new Array(l),
        base = BASE,
        sum, i;
    for (i = 0; i < l; i++) {
        sum = a[i] - base + carry;
        carry = Math.floor(sum / base);
        r[i] = sum - carry * base;
        carry += 1;
    }
    while (carry > 0) {
        r[i++] = carry % base;
        carry = Math.floor(carry / base);
    }
    return r;
}

BigInteger.prototype.add = function (v) {
    var n = parseValue(v);
    if (this.sign !== n.sign) {
        return this.subtract(n.negate());
    }
    var a = this.value, b = n.value;
    if (n.isSmall) {
        return new BigInteger(addSmall(a, Math.abs(b)), this.sign);
    }
    return new BigInteger(addAny(a, b), this.sign);
};

BigInteger.prototype.plus = BigInteger.prototype.add;

SmallInteger.prototype.add = function (v) {
    var n = parseValue(v);
    var a = this.value;
    if (a < 0 !== n.sign) {
        return this.subtract(n.negate());
    }
    var b = n.value;
    if (n.isSmall) {
        if (isPrecise(a + b)) return new SmallInteger(a + b);
        b = smallToArray(Math.abs(b));
    }
    return new BigInteger(addSmall(b, Math.abs(a)), a < 0);
};
SmallInteger.prototype.plus = SmallInteger.prototype.add;

NativeBigInt.prototype.add = function (v) {
    return new NativeBigInt(this.value + parseValue(v).value);
}
NativeBigInt.prototype.plus = NativeBigInt.prototype.add;

function subtract(a, b) { // assumes a and b are arrays with a >= b
    var a_l = a.length,
        b_l = b.length,
        r = new Array(a_l),
        borrow = 0,
        base = BASE,
        i, difference;
    for (i = 0; i < b_l; i++) {
        difference = a[i] - borrow - b[i];
        if (difference < 0) {
            difference += base;
            borrow = 1;
        } else borrow = 0;
        r[i] = difference;
    }
    for (i = b_l; i < a_l; i++) {
        difference = a[i] - borrow;
        if (difference < 0) difference += base;
        else {
            r[i++] = difference;
            break;
        }
        r[i] = difference;
    }
    for (; i < a_l; i++) {
        r[i] = a[i];
    }
    trim(r);
    return r;
}

function subtractAny(a, b, sign) {
    var value;
    if (compareAbs(a, b) >= 0) {
        value = subtract(a, b);
    } else {
        value = subtract(b, a);
        sign = !sign;
    }
    value = arrayToSmall(value);
    if (typeof value === "number") {
        if (sign) value = -value;
        return new SmallInteger(value);
    }
    return new BigInteger(value, sign);
}

function subtractSmall(a, b, sign) { // assumes a is array, b is number with 0 <= b < MAX_INT
    var l = a.length,
        r: any = new Array(l),
        carry = -b,
        base = BASE,
        i, difference;
    for (i = 0; i < l; i++) {
        difference = a[i] + carry;
        carry = Math.floor(difference / base);
        difference %= base;
        r[i] = difference < 0 ? difference + base : difference;
    }
    r = arrayToSmall(r);
    if (typeof r === "number") {
        if (sign) r = -r;
        return new SmallInteger(r);
    } return new BigInteger(r, sign);
}

BigInteger.prototype.subtract = BigInteger.prototype.sub = function (v) {
    var n = parseValue(v);
    if (this.sign !== n.sign) {
        return this.add(n.negate());
    }
    var a = this.value, b = n.value;
    if (n.isSmall)
        return subtractSmall(a, Math.abs(b), this.sign);
    return subtractAny(a, b, this.sign);
};
BigInteger.prototype.minus = BigInteger.prototype.subtract;

SmallInteger.prototype.subtract = SmallInteger.prototype.sub = function (v) {
    var n = parseValue(v);
    var a = this.value;
    if (a < 0 !== n.sign) {
        return this.add(n.negate());
    }
    var b = n.value;
    if (n.isSmall) {
        return new SmallInteger(a - b);
    }
    return subtractSmall(b, Math.abs(a), a >= 0);
};
SmallInteger.prototype.minus = SmallInteger.prototype.subtract;

NativeBigInt.prototype.subtract = function (v) {
    return new NativeBigInt(this.value - parseValue(v).value);
}
NativeBigInt.prototype.minus = NativeBigInt.prototype.sub = NativeBigInt.prototype.subtract;

BigInteger.prototype.negate = BigInteger.prototype.neg = function () {
    return new BigInteger(this.value, !this.sign);
};
SmallInteger.prototype.negate = SmallInteger.prototype.neg = function () {
    var sign = this.sign;
    var small = new SmallInteger(-this.value);
    small.sign = !sign;
    return small;
};
NativeBigInt.prototype.negate = NativeBigInt.prototype.neg = function () {
    return new NativeBigInt(-this.value);
}

BigInteger.prototype.abs = function () {
    return new BigInteger(this.value, false);
};
SmallInteger.prototype.abs = function () {
    return new SmallInteger(Math.abs(this.value));
};
NativeBigInt.prototype.abs = function () {
    return new NativeBigInt(this.value >= 0 ? this.value : -this.value);
}


function multiplyLong(a, b) {
    var a_l = a.length,
        b_l = b.length,
        l = a_l + b_l,
        r = createArray(l),
        base = BASE,
        product, carry, i, a_i, b_j;
    for (i = 0; i < a_l; ++i) {
        a_i = a[i];
        for (var j = 0; j < b_l; ++j) {
            b_j = b[j];
            product = a_i * b_j + r[i + j];
            carry = Math.floor(product / base);
            r[i + j] = product - carry * base;
            r[i + j + 1] += carry;
        }
    }
    trim(r);
    return r;
}

function multiplySmall(a, b) { // assumes a is array, b is number with |b| < BASE
    var l = a.length,
        r = new Array(l),
        base = BASE,
        carry = 0,
        product, i;
    for (i = 0; i < l; i++) {
        product = a[i] * b + carry;
        carry = Math.floor(product / base);
        r[i] = product - carry * base;
    }
    while (carry > 0) {
        r[i++] = carry % base;
        carry = Math.floor(carry / base);
    }
    return r;
}

function shiftLeft(x, n) {
    var r: any[] = [];
    while (n-- > 0) r.push(0);
    return r.concat(x);
}

function multiplyKaratsuba(x, y) {
    var n = Math.max(x.length, y.length);

    if (n <= 30) return multiplyLong(x, y);
    n = Math.ceil(n / 2);

    var b = x.slice(n),
        a = x.slice(0, n),
        d = y.slice(n),
        c = y.slice(0, n);

    var ac = multiplyKaratsuba(a, c),
        bd = multiplyKaratsuba(b, d),
        abcd = multiplyKaratsuba(addAny(a, b), addAny(c, d));

    var product = addAny(addAny(ac, shiftLeft(subtract(subtract(abcd, ac), bd), n)), shiftLeft(bd, 2 * n));
    trim(product);
    return product;
}

// The following function is derived from a surface fit of a graph plotting the performance difference
// between long multiplication and karatsuba multiplication versus the lengths of the two arrays.
function useKaratsuba(l1, l2) {
    return -0.012 * l1 - 0.012 * l2 + 0.000015 * l1 * l2 > 0;
}

BigInteger.prototype.multiply = function (v) {
    var n = parseValue(v),
        a = this.value, b = n.value,
        sign = this.sign !== n.sign,
        abs;
    if (n.isSmall) {
        if (b === 0) return Integer[0];
        if (b === 1) return this;
        if (b === -1) return this.negate();
        abs = Math.abs(b);
        if (abs < BASE) {
            return new BigInteger(multiplySmall(a, abs), sign);
        }
        b = smallToArray(abs);
    }
    if (useKaratsuba(a.length, b.length)) // Karatsuba is only faster for certain array sizes
        return new BigInteger(multiplyKaratsuba(a, b), sign);
    return new BigInteger(multiplyLong(a, b), sign);
};

BigInteger.prototype.times = BigInteger.prototype.mul = BigInteger.prototype.multiply;

function multiplySmallAndArray(a, b, sign) { // a >= 0
    if (a < BASE) {
        return new BigInteger(multiplySmall(b, a), sign);
    }
    return new BigInteger(multiplyLong(b, smallToArray(a)), sign);
}
SmallInteger.prototype._multiplyBySmall = function (a) {
    if (isPrecise(a.value * this.value)) {
        return new SmallInteger(a.value * this.value);
    }
    return multiplySmallAndArray(Math.abs(a.value), smallToArray(Math.abs(this.value)), this.sign !== a.sign);
};
BigInteger.prototype._multiplyBySmall = function (a) {
    if (a.value === 0) return Integer[0];
    if (a.value === 1) return this;
    if (a.value === -1) return this.negate();
    return multiplySmallAndArray(Math.abs(a.value), this.value, this.sign !== a.sign);
};
SmallInteger.prototype.multiply = function (v) {
    return parseValue(v)._multiplyBySmall(this);
};
SmallInteger.prototype.times = SmallInteger.prototype.mul = SmallInteger.prototype.multiply;

NativeBigInt.prototype.multiply = function (v) {
    return new NativeBigInt(this.value * parseValue(v).value);
}
NativeBigInt.prototype.times = NativeBigInt.prototype.mul = NativeBigInt.prototype.multiply;

function square(a) {
    //console.assert(2 * BASE * BASE < MAX_INT);
    var l = a.length,
        r = createArray(l + l),
        base = BASE,
        product, carry, i, a_i, a_j;
    for (i = 0; i < l; i++) {
        a_i = a[i];
        carry = 0 - a_i * a_i;
        for (var j = i; j < l; j++) {
            a_j = a[j];
            product = 2 * (a_i * a_j) + r[i + j] + carry;
            carry = Math.floor(product / base);
            r[i + j] = product - carry * base;
        }
        r[i + l] = carry;
    }
    trim(r);
    return r;
}

BigInteger.prototype.square = function () {
    return new BigInteger(square(this.value), false);
};

SmallInteger.prototype.square = function () {
    var value = this.value * this.value;
    if (isPrecise(value)) return new SmallInteger(value);
    return new BigInteger(square(smallToArray(Math.abs(this.value))), false);
};

NativeBigInt.prototype.square = function (v) {
    return new NativeBigInt(this.value * this.value);
}

function divMod1(a, b) { // Left over from previous version. Performs faster than divMod2 on smaller input sizes.
    var a_l = a.length,
        b_l = b.length,
        base = BASE,
        result = createArray(b.length),
        divisorMostSignificantDigit = b[b_l - 1],
        // normalization
        lambda = Math.ceil(base / (2 * divisorMostSignificantDigit)),
        remainder: any = multiplySmall(a, lambda),
        divisor = multiplySmall(b, lambda),
        quotientDigit, shift, carry, borrow, i, l, q;
    if (remainder.length <= a_l) remainder.push(0);
    divisor.push(0);
    divisorMostSignificantDigit = divisor[b_l - 1];
    for (shift = a_l - b_l; shift >= 0; shift--) {
        quotientDigit = base - 1;
        if (remainder[shift + b_l] !== divisorMostSignificantDigit) {
            quotientDigit = Math.floor((remainder[shift + b_l] * base + remainder[shift + b_l - 1]) / divisorMostSignificantDigit);
        }
        // quotientDigit <= base - 1
        carry = 0;
        borrow = 0;
        l = divisor.length;
        for (i = 0; i < l; i++) {
            carry += quotientDigit * divisor[i];
            q = Math.floor(carry / base);
            borrow += remainder[shift + i] - (carry - q * base);
            carry = q;
            if (borrow < 0) {
                remainder[shift + i] = borrow + base;
                borrow = -1;
            } else {
                remainder[shift + i] = borrow;
                borrow = 0;
            }
        }
        while (borrow !== 0) {
            quotientDigit -= 1;
            carry = 0;
            for (i = 0; i < l; i++) {
                carry += remainder[shift + i] - base + divisor[i];
                if (carry < 0) {
                    remainder[shift + i] = carry + base;
                    carry = 0;
                } else {
                    remainder[shift + i] = carry;
                    carry = 1;
                }
            }
            borrow += carry;
        }
        result[shift] = quotientDigit;
    }
    // denormalization
    remainder = divModSmall(remainder, lambda)[0];
    return [arrayToSmall(result), arrayToSmall(remainder)];
}

function divMod2(a, b) { // Implementation idea shamelessly stolen from Silent Matt's library http://silentmatt.com/biginteger/
    // Performs faster than divMod1 on larger input sizes.
    var a_l = a.length,
        b_l = b.length,
        result: any[] = [],
        part: any[] = [],
        base = BASE,
        guess, xlen, highx, highy, check;
    while (a_l) {
        part.unshift(a[--a_l]);
        trim(part);
        if (compareAbs(part, b) < 0) {
            result.push(0);
            continue;
        }
        xlen = part.length;
        highx = part[xlen - 1] * base + part[xlen - 2];
        highy = b[b_l - 1] * base + b[b_l - 2];
        if (xlen > b_l) {
            highx = (highx + 1) * base;
        }
        guess = Math.ceil(highx / highy);
        do {
            check = multiplySmall(b, guess);
            if (compareAbs(check, part) <= 0) break;
            guess--;
        } while (guess);
        result.push(guess);
        part = subtract(part, check);
    }
    result.reverse();
    return [arrayToSmall(result), arrayToSmall(part)];
}

function divModSmall(value, lambda) {
    var length = value.length,
        quotient = createArray(length),
        base = BASE,
        i, q, remainder, divisor;
    remainder = 0;
    for (i = length - 1; i >= 0; --i) {
        divisor = remainder * base + value[i];
        q = truncate(divisor / lambda);
        remainder = divisor - q * lambda;
        quotient[i] = q | 0;
    }
    return [quotient, remainder | 0];
}

function divModAny(self, v) {
    var value, n = parseValue(v);
    if (supportsNativeBigInt) {
        return [new NativeBigInt(self.value / n.value), new NativeBigInt(self.value % n.value)];
    }
    var a = self.value, b = n.value;
    var quotient;
    if (b === 0) throw new Error("Cannot divide by zero");
    if (self.isSmall) {
        if (n.isSmall) {
            return [new SmallInteger(truncate(a / b)), new SmallInteger(a % b)];
        }
        return [Integer[0], self];
    }
    if (n.isSmall) {
        if (b === 1) return [self, Integer[0]];
        if (b == -1) return [self.negate(), Integer[0]];
        var abs = Math.abs(b);
        if (abs < BASE) {
            value = divModSmall(a, abs);
            quotient = arrayToSmall(value[0]);
            var remainder = value[1];
            if (self.sign) remainder = -remainder;
            if (typeof quotient === "number") {
                if (self.sign !== n.sign) quotient = -quotient;
                return [new SmallInteger(quotient), new SmallInteger(remainder)];
            }
            return [new BigInteger(quotient, self.sign !== n.sign), new SmallInteger(remainder)];
        }
        b = smallToArray(abs);
    }
    var comparison = compareAbs(a, b);
    if (comparison === -1) return [Integer[0], self];
    if (comparison === 0) return [Integer[self.sign === n.sign ? 1 : -1], Integer[0]];

    // divMod1 is faster on smaller input sizes
    if (a.length + b.length <= 200)
        value = divMod1(a, b);
    else value = divMod2(a, b);

    quotient = value[0];
    var qSign = self.sign !== n.sign,
        mod = value[1],
        mSign = self.sign;
    if (typeof quotient === "number") {
        if (qSign) quotient = -quotient;
        quotient = new SmallInteger(quotient);
    } else quotient = new BigInteger(quotient, qSign);
    if (typeof mod === "number") {
        if (mSign) mod = -mod;
        mod = new SmallInteger(mod);
    } else mod = new BigInteger(mod, mSign);
    return [quotient, mod];
}

BigInteger.prototype.divmod = function (v) {
    var result = divModAny(this, v);
    return {
        quotient: result[0],
        remainder: result[1]
    };
};
NativeBigInt.prototype.divmod = SmallInteger.prototype.divmod = BigInteger.prototype.divmod;


BigInteger.prototype.divide = BigInteger.prototype.div = function (v) {
    return divModAny(this, v)[0];
};
NativeBigInt.prototype.over = NativeBigInt.prototype.divide = NativeBigInt.prototype.div = function (v) {
    return new NativeBigInt(this.value / parseValue(v).value);
};
SmallInteger.prototype.over = SmallInteger.prototype.divide = SmallInteger.prototype.div = BigInteger.prototype.over = BigInteger.prototype.divide;

BigInteger.prototype.mod = function (v) {
    return divModAny(this, v)[1];
};
NativeBigInt.prototype.mod = NativeBigInt.prototype.remainder = function (v) {
    return new NativeBigInt(this.value % parseValue(v).value);
};
SmallInteger.prototype.remainder = SmallInteger.prototype.mod = BigInteger.prototype.remainder = BigInteger.prototype.mod;

BigInteger.prototype.pow = function (v) {
    var n = parseValue(v),
        a = this.value,
        b = n.value,
        value, x, y;
    if (b === 0) return Integer[1];
    if (a === 0) return Integer[0];
    if (a === 1) return Integer[1];
    if (a === -1) return n.isEven() ? Integer[1] : Integer[-1];
    if (n.sign) {
        return Integer[0];
    }
    if (!n.isSmall) throw new Error("The exponent " + n.toString() + " is too large.");
    if (this.isSmall) {
        if (isPrecise(value = Math.pow(a, b)))
            return new SmallInteger(truncate(value));
    }
    x = this;
    y = Integer[1];
    while (true) {
        if ((b & 1) === 1) {
            y = y.times(x);
            --b;
        }
        if (b === 0) break;
        b /= 2;
        x = x.square();
    }
    return y;
};
SmallInteger.prototype.pow = BigInteger.prototype.pow;

NativeBigInt.prototype.pow = function (v) {
    var n = parseValue(v);
    var a = this.value, b = n.value;
    var _0: any = BigInt(0), _1 = BigInt(1), _2 = BigInt(2);
    if (b === _0) return Integer[1];
    if (a === _0) return Integer[0];
    if (a === _1) return Integer[1];
    if (a === BigInt(-1)) return n.isEven() ? Integer[1] : Integer[-1];
    if (n.isNegative()) return new NativeBigInt(_0);
    var x = this;
    var y = Integer[1];
    while (true) {
        if ((b & _1) === _1) {
            y = y.times(x);
            --b;
        }
        if (b === _0) break;
        b /= _2;
        x = x.square();
    }
    return y;
}

BigInteger.prototype.modPow = function (exp, mod) {
    exp = parseValue(exp);
    mod = parseValue(mod);
    if (mod.isZero()) throw new Error("Cannot take modPow with modulus 0");
    var r = Integer[1],
        base = this.mod(mod);
    if (exp.isNegative()) {
        exp = exp.multiply(Integer[-1]);
        base = base.modInv(mod);
    }
    while (exp.isPositive()) {
        if (base.isZero()) return Integer[0];
        if (exp.isOdd()) r = r.multiply(base).mod(mod);
        exp = exp.divide(2);
        base = base.square().mod(mod);
    }
    return r;
};
NativeBigInt.prototype.modPow = SmallInteger.prototype.modPow = BigInteger.prototype.modPow;

function compareAbs(a, b) {
    if (a.length !== b.length) {
        return a.length > b.length ? 1 : -1;
    }
    for (var i = a.length - 1; i >= 0; i--) {
        if (a[i] !== b[i]) return a[i] > b[i] ? 1 : -1;
    }
    return 0;
}

BigInteger.prototype.compareAbs = function (v) {
    var n = parseValue(v),
        a = this.value,
        b = n.value;
    if (n.isSmall) return 1;
    return compareAbs(a, b);
};
SmallInteger.prototype.compareAbs = function (v) {
    var n = parseValue(v),
        a = Math.abs(this.value),
        b = n.value;
    if (n.isSmall) {
        b = Math.abs(b);
        return a === b ? 0 : a > b ? 1 : -1;
    }
    return -1;
};
NativeBigInt.prototype.compareAbs = function (v) {
    var a = this.value;
    var b = parseValue(v).value;
    a = a >= 0 ? a : -a;
    b = b >= 0 ? b : -b;
    return a === b ? 0 : a > b ? 1 : -1;
}

BigInteger.prototype.compare = function (v) {
    // See discussion about comparison with Infinity:
    // https://github.com/peterolson/BigInteger.js/issues/61
    if (v === Infinity) {
        return -1;
    }
    if (v === -Infinity) {
        return 1;
    }

    var n = parseValue(v),
        a = this.value,
        b = n.value;
    if (this.sign !== n.sign) {
        return n.sign ? 1 : -1;
    }
    if (n.isSmall) {
        return this.sign ? -1 : 1;
    }
    return compareAbs(a, b) * (this.sign ? -1 : 1);
};
BigInteger.prototype.compareTo = BigInteger.prototype.compare;

SmallInteger.prototype.compare = function (v) {
    if (v === Infinity) {
        return -1;
    }
    if (v === -Infinity) {
        return 1;
    }

    var n = parseValue(v),
        a = this.value,
        b = n.value;
    if (n.isSmall) {
        return a == b ? 0 : a > b ? 1 : -1;
    }
    if (a < 0 !== n.sign) {
        return a < 0 ? -1 : 1;
    }
    return a < 0 ? 1 : -1;
};
SmallInteger.prototype.compareTo = SmallInteger.prototype.compare;

NativeBigInt.prototype.compare = function (v) {
    if (v === Infinity) {
        return -1;
    }
    if (v === -Infinity) {
        return 1;
    }
    var a = this.value;
    var b = parseValue(v).value;
    return a === b ? 0 : a > b ? 1 : -1;
}
NativeBigInt.prototype.compareTo = NativeBigInt.prototype.compare;

BigInteger.prototype.equals = function (v) {
    return this.compare(v) === 0;
};
NativeBigInt.prototype.eq = NativeBigInt.prototype.equals = SmallInteger.prototype.eq = SmallInteger.prototype.equals = BigInteger.prototype.eq = BigInteger.prototype.equals;

BigInteger.prototype.notEquals = function (v) {
    return this.compare(v) !== 0;
};
NativeBigInt.prototype.neq = NativeBigInt.prototype.notEquals = SmallInteger.prototype.neq = SmallInteger.prototype.notEquals = BigInteger.prototype.neq = BigInteger.prototype.notEquals;

BigInteger.prototype.greater = function (v) {
    return this.compare(v) > 0;
};
NativeBigInt.prototype.greaterThan = NativeBigInt.prototype.gt = NativeBigInt.prototype.greater = SmallInteger.prototype.greaterThan = SmallInteger.prototype.gt = SmallInteger.prototype.greater = BigInteger.prototype.greaterThan = BigInteger.prototype.gt = BigInteger.prototype.greater;

BigInteger.prototype.lesser = function (v) {
    return this.compare(v) < 0;
};
NativeBigInt.prototype.lessThan = NativeBigInt.prototype.lt = NativeBigInt.prototype.lesser = SmallInteger.prototype.lessThan = SmallInteger.prototype.lt = SmallInteger.prototype.lesser = BigInteger.prototype.lessThan = BigInteger.prototype.lt = BigInteger.prototype.lesser;

BigInteger.prototype.greaterOrEquals = function (v) {
    return this.compare(v) >= 0;
};
NativeBigInt.prototype.greaterThanOrEqual = NativeBigInt.prototype.geq = NativeBigInt.prototype.greaterOrEquals = SmallInteger.prototype.greaterThanOrEqual = SmallInteger.prototype.geq = SmallInteger.prototype.greaterOrEquals = BigInteger.prototype.greaterThanOrEqual = BigInteger.prototype.geq = BigInteger.prototype.greaterOrEquals;

BigInteger.prototype.lesserOrEquals = function (v) {
    return this.compare(v) <= 0;
};
NativeBigInt.prototype.lessThanOrEqual = NativeBigInt.prototype.leq = NativeBigInt.prototype.lesserOrEquals = SmallInteger.prototype.lessThanOrEqual = SmallInteger.prototype.leq = SmallInteger.prototype.lesserOrEquals = BigInteger.prototype.leq = BigInteger.prototype.lessThanOrEqual = BigInteger.prototype.lesserOrEquals;

BigInteger.prototype.isEven = function () {
    return (this.value[0] & 1) === 0;
};
SmallInteger.prototype.isEven = function () {
    return (this.value & 1) === 0;
};
NativeBigInt.prototype.isEven = function () {
    return (this.value & BigInt(1)) === BigInt(0);
}

BigInteger.prototype.isOdd = function () {
    return (this.value[0] & 1) === 1;
};
SmallInteger.prototype.isOdd = function () {
    return (this.value & 1) === 1;
};
NativeBigInt.prototype.isOdd = function () {
    return (this.value & BigInt(1)) === BigInt(1);
}

BigInteger.prototype.isPositive = function () {
    return !this.sign;
};
SmallInteger.prototype.isPositive = function () {
    return this.value > 0;
};
NativeBigInt.prototype.isPositive = SmallInteger.prototype.isPositive;

BigInteger.prototype.isNegative = function () {
    return this.sign;
};
SmallInteger.prototype.isNegative = function () {
    return this.value < 0;
};
NativeBigInt.prototype.isNegative = SmallInteger.prototype.isNegative;

BigInteger.prototype.isUnit = function () {
    return false;
};
SmallInteger.prototype.isUnit = function () {
    return Math.abs(this.value) === 1;
};
NativeBigInt.prototype.isUnit = function () {
    return this.abs().value === BigInt(1);
}

BigInteger.prototype.isZero = function () {
    return false;
};
SmallInteger.prototype.isZero = function () {
    return this.value === 0;
};
NativeBigInt.prototype.isZero = function () {
    return this.value === BigInt(0);
}

BigInteger.prototype.isDivisibleBy = function (v) {
    var n = parseValue(v);
    if (n.isZero()) return false;
    if (n.isUnit()) return true;
    if (n.compareAbs(2) === 0) return this.isEven();
    return this.mod(n).isZero();
};
NativeBigInt.prototype.isDivisibleBy = SmallInteger.prototype.isDivisibleBy = BigInteger.prototype.isDivisibleBy;

function isBasicPrime(v) {
    var n = v.abs();
    if (n.isUnit()) return false;
    if (n.equals(2) || n.equals(3) || n.equals(5)) return true;
    if (n.isEven() || n.isDivisibleBy(3) || n.isDivisibleBy(5)) return false;
    if (n.lesser(49)) return true;
    // we don't know if it's prime: let the other functions figure it out
}

function millerRabinTest(n, a) {
    var nPrev = n.prev(),
        b = nPrev,
        r = 0,
        d, t, i, x;
    while (b.isEven()) b = b.divide(2), r++;
    next: for (i = 0; i < a.length; i++) {
        if (n.lesser(a[i])) continue;
        x = bigInt(a[i]).modPow(b, n);
        if (x.isUnit() || x.equals(nPrev)) continue;
        for (d = r - 1; d != 0; d--) {
            x = x.square().mod(n);
            if (x.isUnit()) return false;
            if (x.equals(nPrev)) continue next;
        }
        return false;
    }
    return true;
}

// Set "strict" to true to force GRH-supported lower bound of 2*log(N)^2
BigInteger.prototype.isPrime = function (strict) {
    var isPrime = isBasicPrime(this);
    if (isPrime !== undefined) return isPrime;
    var n = this.abs();
    var bits = n.bitLength();
    if (bits <= 64)
        return millerRabinTest(n, [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]);
    var logN = Math.log(2) * bits.toJSNumber();
    var t = Math.ceil((strict === true) ? (2 * Math.pow(logN, 2)) : logN);
    for (var a: any[] = [], i = 0; i < t; i++) {
        a.push(bigInt(i + 2));
    }
    return millerRabinTest(n, a);
};
NativeBigInt.prototype.isPrime = SmallInteger.prototype.isPrime = BigInteger.prototype.isPrime;

BigInteger.prototype.isProbablePrime = function (iterations, rng) {
    var isPrime = isBasicPrime(this);
    if (isPrime !== undefined) return isPrime;
    var n = this.abs();
    var t = iterations === undefined ? 5 : iterations;
    for (var a: any[] = [], i = 0; i < t; i++) {
        a.push((bigInt as any).randBetween(2, n.minus(2), rng));
    }
    return millerRabinTest(n, a);
};
NativeBigInt.prototype.isProbablePrime = SmallInteger.prototype.isProbablePrime = BigInteger.prototype.isProbablePrime;

BigInteger.prototype.modInv = function (n) {
    var t = (bigInt as any).zero, newT = (bigInt as any).one, r = parseValue(n), newR = this.abs(), q, lastT, lastR;
    while (!newR.isZero()) {
        q = r.divide(newR);
        lastT = t;
        lastR = r;
        t = newT;
        r = newR;
        newT = lastT.subtract(q.multiply(newT));
        newR = lastR.subtract(q.multiply(newR));
    }
    if (!r.isUnit()) throw new Error(this.toString() + " and " + n.toString() + " are not co-prime");
    if (t.compare(0) === -1) {
        t = t.add(n);
    }
    if (this.isNegative()) {
        return t.negate();
    }
    return t;
};

NativeBigInt.prototype.modInv = SmallInteger.prototype.modInv = BigInteger.prototype.modInv;

BigInteger.prototype.next = function () {
    var value = this.value;
    if (this.sign) {
        return subtractSmall(value, 1, this.sign);
    }
    return new BigInteger(addSmall(value, 1), this.sign);
};
SmallInteger.prototype.next = function () {
    var value = this.value;
    if (value + 1 < MAX_INT) return new SmallInteger(value + 1);
    return new BigInteger(MAX_INT_ARR, false);
};
NativeBigInt.prototype.next = function () {
    return new NativeBigInt(this.value + BigInt(1));
}

BigInteger.prototype.prev = function () {
    var value = this.value;
    if (this.sign) {
        return new BigInteger(addSmall(value, 1), true);
    }
    return subtractSmall(value, 1, this.sign);
};
SmallInteger.prototype.prev = function () {
    var value = this.value;
    if (value - 1 > -MAX_INT) return new SmallInteger(value - 1);
    return new BigInteger(MAX_INT_ARR, true);
};
NativeBigInt.prototype.prev = function () {
    return new NativeBigInt(this.value - BigInt(1));
}

var powersOfTwo = [1];
while (2 * powersOfTwo[powersOfTwo.length - 1] <= BASE) powersOfTwo.push(2 * powersOfTwo[powersOfTwo.length - 1]);
var powers2Length = powersOfTwo.length, highestPower2 = powersOfTwo[powers2Length - 1];

function shift_isSmall(n) {
    return Math.abs(n) <= BASE;
}

BigInteger.prototype.shiftLeft = function (v) {
    var n = parseValue(v).toJSNumber();
    if (!shift_isSmall(n)) {
        throw new Error(String(n) + " is too large for shifting.");
    }
    if (n < 0) return this.shiftRight(-n);
    var result = this;
    if (result.isZero()) return result;
    while (n >= powers2Length) {
        result = result.multiply(highestPower2);
        n -= powers2Length - 1;
    }
    return result.multiply(powersOfTwo[n]);
};
NativeBigInt.prototype.shl = NativeBigInt.prototype.shiftLeft = SmallInteger.prototype.shiftLeft = BigInteger.prototype.shl = BigInteger.prototype.shiftLeft;

BigInteger.prototype.shiftRight = function (v) {
    var remQuo;
    var n = parseValue(v).toJSNumber();
    if (!shift_isSmall(n)) {
        throw new Error(String(n) + " is too large for shifting.");
    }
    if (n < 0) return this.shiftLeft(-n);
    var result = this;
    while (n >= powers2Length) {
        if (result.isZero() || (result.isNegative() && result.isUnit())) return result;
        remQuo = divModAny(result, highestPower2);
        result = remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
        n -= powers2Length - 1;
    }
    remQuo = divModAny(result, powersOfTwo[n]);
    return remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
};
NativeBigInt.prototype.shr = NativeBigInt.prototype.shiftRight = SmallInteger.prototype.shr = SmallInteger.prototype.shiftRight = BigInteger.prototype.shr = BigInteger.prototype.shiftRight;

function bitwise(x, y, fn) {
    y = parseValue(y);
    var xSign = x.isNegative(), ySign = y.isNegative();
    var xRem = xSign ? x.not() : x,
        yRem = ySign ? y.not() : y;
    var xDigit = 0, yDigit = 0;
    var xDivMod: any = null, yDivMod: any = null;
    var result: any[] = [];
    while (!xRem.isZero() || !yRem.isZero()) {
        xDivMod = divModAny(xRem, highestPower2);
        xDigit = xDivMod[1].toJSNumber();
        if (xSign) {
            xDigit = highestPower2 - 1 - xDigit; // two's complement for negative numbers
        }

        yDivMod = divModAny(yRem, highestPower2);
        yDigit = yDivMod[1].toJSNumber();
        if (ySign) {
            yDigit = highestPower2 - 1 - yDigit; // two's complement for negative numbers
        }

        xRem = xDivMod[0];
        yRem = yDivMod[0];
        result.push(fn(xDigit, yDigit));
    }
    var sum = fn(xSign ? 1 : 0, ySign ? 1 : 0) !== 0 ? bigInt(-1) : bigInt(0);
    for (var i = result.length - 1; i >= 0; i -= 1) {
        sum = sum.multiply(highestPower2).add(bigInt(result[i]));
    }
    return sum;
}

BigInteger.prototype.not = function () {
    return this.negate().prev();
};
NativeBigInt.prototype.not = SmallInteger.prototype.not = BigInteger.prototype.not;

BigInteger.prototype.and = function (n) {
    return bitwise(this, n, function (a, b) { return a & b; });
};
NativeBigInt.prototype.and = SmallInteger.prototype.and = BigInteger.prototype.and;

BigInteger.prototype.or = function (n) {
    return bitwise(this, n, function (a, b) { return a | b; });
};
NativeBigInt.prototype.or = SmallInteger.prototype.or = BigInteger.prototype.or;

BigInteger.prototype.xor = function (n) {
    return bitwise(this, n, function (a, b) { return a ^ b; });
};
NativeBigInt.prototype.xor = SmallInteger.prototype.xor = BigInteger.prototype.xor;

var LOBMASK_I = 1 << 30, LOBMASK_BI = (BASE & -BASE) * (BASE & -BASE) | LOBMASK_I;
function roughLOB(n) { // get lowestOneBit (rough)
    // SmallInteger: return Min(lowestOneBit(n), 1 << 30)
    // BigInteger: return Min(lowestOneBit(n), 1 << 14) [BASE=1e7]
    var v = n.value,
        x = typeof v === "number" ? v | LOBMASK_I :
            typeof v === "bigint" ? v | BigInt(LOBMASK_I) :
                v[0] + v[1] * BASE | LOBMASK_BI;
    return (x as any) & (-x as any);
}

function integerLogarithm(value, base) {
    if (base.compareTo(value) <= 0) {
        var tmp = integerLogarithm(value, base.square(base));
        var p = tmp.p;
        var e = tmp.e;
        var t = p.multiply(base);
        return t.compareTo(value) <= 0 ? { p: t, e: e * 2 + 1 } : { p: p, e: e * 2 };
    }
    return { p: bigInt(1), e: 0 };
}

BigInteger.prototype.bitLength = function () {
    var n = this;
    if (n.compareTo(bigInt(0)) < 0) {
        n = n.negate().subtract(bigInt(1));
    }
    if (n.compareTo(bigInt(0)) === 0) {
        return bigInt(0);
    }
    return bigInt(integerLogarithm(n, bigInt(2)).e).add(bigInt(1));
}
NativeBigInt.prototype.bitLength = SmallInteger.prototype.bitLength = BigInteger.prototype.bitLength;

function max(a, b) {
    a = parseValue(a);
    b = parseValue(b);
    return a.greater(b) ? a : b;
}
function min(a, b) {
    a = parseValue(a);
    b = parseValue(b);
    return a.lesser(b) ? a : b;
}
function gcd(a, b) {
    a = parseValue(a).abs();
    b = parseValue(b).abs();
    if (a.equals(b)) return a;
    if (a.isZero()) return b;
    if (b.isZero()) return a;
    var c = Integer[1], d, t;
    while (a.isEven() && b.isEven()) {
        d = min(roughLOB(a), roughLOB(b));
        a = a.divide(d);
        b = b.divide(d);
        c = c.multiply(d);
    }
    while (a.isEven()) {
        a = a.divide(roughLOB(a));
    }
    do {
        while (b.isEven()) {
            b = b.divide(roughLOB(b));
        }
        if (a.greater(b)) {
            t = b; b = a; a = t;
        }
        b = b.subtract(a);
    } while (!b.isZero());
    return c.isUnit() ? a : a.multiply(c);
}
function lcm(a, b) {
    a = parseValue(a).abs();
    b = parseValue(b).abs();
    return a.divide(gcd(a, b)).multiply(b);
}
function randBetween(a, b, rng) {
    a = parseValue(a);
    b = parseValue(b);
    var usedRNG = rng || Math.random;
    var low = min(a, b), high = max(a, b);
    var range = high.subtract(low).add(1);
    if (range.isSmall) return low.add(Math.floor(usedRNG() * range));
    var digits = toBase(range, BASE).value;
    var result: any[] = [], restricted = true;
    for (var i = 0; i < digits.length; i++) {
        var top = restricted ? digits[i] : BASE;
        var digit = truncate(usedRNG() * top);
        result.push(digit);
        if (digit < top) restricted = false;
    }
    return low.add((Integer as any).fromArray(result, BASE, false));
}

var parseBase = function (text, base, alphabet, caseSensitive) {
    alphabet = alphabet || DEFAULT_ALPHABET;
    text = String(text);
    if (!caseSensitive) {
        text = text.toLowerCase();
        alphabet = alphabet.toLowerCase();
    }
    var length = text.length;
    var i;
    var absBase = Math.abs(base);
    var alphabetValues = {};
    for (i = 0; i < alphabet.length; i++) {
        alphabetValues[alphabet[i]] = i;
    }
    for (i = 0; i < length; i++) {
        var c = text[i];
        if (c === "-") continue;
        if (c in alphabetValues) {
            if (alphabetValues[c] >= absBase) {
                if (c === "1" && absBase === 1) continue;
                throw new Error(c + " is not a valid digit in base " + base + ".");
            }
        }
    }
    base = parseValue(base);
    var digits: any[] = [];
    var isNegative = text[0] === "-";
    for (i = isNegative ? 1 : 0; i < text.length; i++) {
        var c = text[i];
        if (c in alphabetValues) digits.push(parseValue(alphabetValues[c]));
        else if (c === "<") {
            var start = i;
            do { i++; } while (text[i] !== ">" && i < text.length);
            digits.push(parseValue(text.slice(start + 1, i)));
        }
        else throw new Error(c + " is not a valid character");
    }
    return parseBaseFromArray(digits, base, isNegative);
};

function parseBaseFromArray(digits, base, isNegative) {
    var val = Integer[0], pow = Integer[1], i;
    for (i = digits.length - 1; i >= 0; i--) {
        val = val.add(digits[i].times(pow));
        pow = pow.times(base);
    }
    return isNegative ? val.negate() : val;
}

function stringify(digit, alphabet) {
    alphabet = alphabet || DEFAULT_ALPHABET;
    if (digit < alphabet.length) {
        return alphabet[digit];
    }
    return "<" + digit + ">";
}

function toBase(n, base) {
    base = bigInt(base);
    if (base.isZero()) {
        if (n.isZero()) return { value: [0], isNegative: false };
        throw new Error("Cannot convert nonzero numbers to base 0.");
    }
    if (base.equals(-1)) {
        if (n.isZero()) return { value: [0], isNegative: false };
        if (n.isNegative())
            return {
                value: ([] as any).concat.apply([], Array.apply(null, Array(-n.toJSNumber()))
                    .map(Array.prototype.valueOf, [1, 0])
                ),
                isNegative: false
            };

        var arr: any[] = Array.apply(null, Array(n.toJSNumber() - 1))
            .map(Array.prototype.valueOf, [0, 1]);
        arr.unshift([1]);
        return {
            value: [].concat.apply([], arr),
            isNegative: false
        };
    }

    var neg = false;
    if (n.isNegative() && base.isPositive()) {
        neg = true;
        n = n.abs();
    }
    if (base.isUnit()) {
        if (n.isZero()) return { value: [0], isNegative: false };

        return {
            value: Array.apply(null, Array(n.toJSNumber()))
                .map(Number.prototype.valueOf, 1),
            isNegative: neg
        };
    }
    var out: any[] = [];
    var left = n, divmod;
    while (left.isNegative() || left.compareAbs(base) >= 0) {
        divmod = left.divmod(base);
        left = divmod.quotient;
        var digit = divmod.remainder;
        if (digit.isNegative()) {
            digit = base.minus(digit).abs();
            left = left.next();
        }
        out.push(digit.toJSNumber());
    }
    out.push(left.toJSNumber());
    return { value: out.reverse(), isNegative: neg };
}

function toBaseString(n, base, alphabet) {
    var arr = toBase(n, base);
    return (arr.isNegative ? "-" : "") + arr.value.map(function (x) {
        return stringify(x, alphabet);
    }).join('');
}

BigInteger.prototype.toArray = function (radix) {
    return toBase(this, radix);
};

SmallInteger.prototype.toArray = function (radix) {
    return toBase(this, radix);
};

NativeBigInt.prototype.toArray = function (radix) {
    return toBase(this, radix);
};

BigInteger.prototype.toString = function (radix, alphabet) {
    if (radix === undefined) radix = 10;
    if (radix !== 10) return toBaseString(this, radix, alphabet);
    var v = this.value, l = v.length, str = String(v[--l]), zeros = "0000000", digit;
    while (--l >= 0) {
        digit = String(v[l]);
        str += zeros.slice(digit.length) + digit;
    }
    var sign = this.sign ? "-" : "";
    return sign + str;
};

SmallInteger.prototype.toString = function (radix, alphabet) {
    if (radix === undefined) radix = 10;
    if (radix != 10) return toBaseString(this, radix, alphabet);
    return String(this.value);
};

NativeBigInt.prototype.toString = SmallInteger.prototype.toString;

NativeBigInt.prototype.toJSON = BigInteger.prototype.toJSON = SmallInteger.prototype.toJSON = function () { return this.toString(); }

BigInteger.prototype.valueOf = function () {
    return parseInt(this.toString(), 10);
};
BigInteger.prototype.toJSNumber = BigInteger.prototype.toNumber = BigInteger.prototype.valueOf;

SmallInteger.prototype.valueOf = function () {
    return this.value;
};
SmallInteger.prototype.toNumber = SmallInteger.prototype.toJSNumber = SmallInteger.prototype.valueOf;
NativeBigInt.prototype.valueOf = NativeBigInt.prototype.toJSNumber = NativeBigInt.prototype.toNumber = function () {
    return parseInt(this.toString(), 10);
}

function parseStringValue(v) {
    if (isPrecise(+v)) {
        var x = +v;
        if (x === truncate(x))
            return supportsNativeBigInt ? new NativeBigInt(BigInt(x)) : new SmallInteger(x);
        throw new Error("Invalid integer: " + v);
    }
    var sign = v[0] === "-";
    if (sign) v = v.slice(1);
    var split = v.split(/e/i);
    if (split.length > 2) throw new Error("Invalid integer: " + split.join("e"));
    if (split.length === 2) {
        var exp = split[1];
        if (exp[0] === "+") exp = exp.slice(1);
        exp = +exp;
        if (exp !== truncate(exp) || !isPrecise(exp)) throw new Error("Invalid integer: " + exp + " is not a valid exponent.");
        var text = split[0];
        var decimalPlace = text.indexOf(".");
        if (decimalPlace >= 0) {
            exp -= text.length - decimalPlace - 1;
            text = text.slice(0, decimalPlace) + text.slice(decimalPlace + 1);
        }
        if (exp < 0) throw new Error("Cannot include negative exponent part for integers");
        text += (new Array(exp + 1)).join("0");
        v = text;
    }
    var isValid = /^([0-9][0-9]*)$/.test(v);
    if (!isValid) throw new Error("Invalid integer: " + v);
    if (supportsNativeBigInt) {
        return new NativeBigInt(BigInt(sign ? "-" + v : v));
    }
    var r: any[] = [], max = v.length, l = LOG_BASE, min = max - l;
    while (max > 0) {
        r.push(+v.slice(min, max));
        min -= l;
        if (min < 0) min = 0;
        max -= l;
    }
    trim(r);
    return new BigInteger(r, sign);
}

function parseNumberValue(v) {
    if (supportsNativeBigInt) {
        return new NativeBigInt(BigInt(Math.round(v)));
    }
    if (isPrecise(v)) {
        if (v !== truncate(v)) throw new Error(v + " is not an integer.");
        return new SmallInteger(v);
    }
    return parseStringValue(v.toString());
}

function parseValue(v) {
    if (typeof v === "number") {
        return parseNumberValue(v);
    }
    if (typeof v === "string") {
        return parseStringValue(v);
    }
    if (typeof v === "bigint") {
        return new NativeBigInt(v);
    }
    return v;
}
// Pre-define numbers in range [-999,999]
for (var i = 0; i < 1000; i++) {
    Integer[i] = parseValue(i);
    if (i > 0) Integer[-i] = parseValue(-i);
}
// Backwards compatibility
(Integer as any).one = Integer[1];
(Integer as any).zero = Integer[0];
(Integer as any).minusOne = Integer[-1];
(Integer as any).max = max;
(Integer as any).min = min;
(Integer as any).gcd = gcd;
(Integer as any).lcm = lcm;
(Integer as any).isInstance = function (x) { return x instanceof BigInteger || x instanceof SmallInteger || x instanceof NativeBigInt; };
(Integer as any).randBetween = randBetween;

(Integer as any).fromArray = function (digits, base, isNegative) {
    return parseBaseFromArray(digits.map(parseValue), parseValue(base || 10), isNegative);
};

export const bigInt = Integer;

export type BigNumber = /* number | bigint | string | */ BigInteger | NativeBigInt;


// Array constant accessors
interface BigIntegerStatic {
    '-999': BigInteger;
    '-998': BigInteger;
    '-997': BigInteger;
    '-996': BigInteger;
    '-995': BigInteger;
    '-994': BigInteger;
    '-993': BigInteger;
    '-992': BigInteger;
    '-991': BigInteger;
    '-990': BigInteger;
    '-989': BigInteger;
    '-988': BigInteger;
    '-987': BigInteger;
    '-986': BigInteger;
    '-985': BigInteger;
    '-984': BigInteger;
    '-983': BigInteger;
    '-982': BigInteger;
    '-981': BigInteger;
    '-980': BigInteger;
    '-979': BigInteger;
    '-978': BigInteger;
    '-977': BigInteger;
    '-976': BigInteger;
    '-975': BigInteger;
    '-974': BigInteger;
    '-973': BigInteger;
    '-972': BigInteger;
    '-971': BigInteger;
    '-970': BigInteger;
    '-969': BigInteger;
    '-968': BigInteger;
    '-967': BigInteger;
    '-966': BigInteger;
    '-965': BigInteger;
    '-964': BigInteger;
    '-963': BigInteger;
    '-962': BigInteger;
    '-961': BigInteger;
    '-960': BigInteger;
    '-959': BigInteger;
    '-958': BigInteger;
    '-957': BigInteger;
    '-956': BigInteger;
    '-955': BigInteger;
    '-954': BigInteger;
    '-953': BigInteger;
    '-952': BigInteger;
    '-951': BigInteger;
    '-950': BigInteger;
    '-949': BigInteger;
    '-948': BigInteger;
    '-947': BigInteger;
    '-946': BigInteger;
    '-945': BigInteger;
    '-944': BigInteger;
    '-943': BigInteger;
    '-942': BigInteger;
    '-941': BigInteger;
    '-940': BigInteger;
    '-939': BigInteger;
    '-938': BigInteger;
    '-937': BigInteger;
    '-936': BigInteger;
    '-935': BigInteger;
    '-934': BigInteger;
    '-933': BigInteger;
    '-932': BigInteger;
    '-931': BigInteger;
    '-930': BigInteger;
    '-929': BigInteger;
    '-928': BigInteger;
    '-927': BigInteger;
    '-926': BigInteger;
    '-925': BigInteger;
    '-924': BigInteger;
    '-923': BigInteger;
    '-922': BigInteger;
    '-921': BigInteger;
    '-920': BigInteger;
    '-919': BigInteger;
    '-918': BigInteger;
    '-917': BigInteger;
    '-916': BigInteger;
    '-915': BigInteger;
    '-914': BigInteger;
    '-913': BigInteger;
    '-912': BigInteger;
    '-911': BigInteger;
    '-910': BigInteger;
    '-909': BigInteger;
    '-908': BigInteger;
    '-907': BigInteger;
    '-906': BigInteger;
    '-905': BigInteger;
    '-904': BigInteger;
    '-903': BigInteger;
    '-902': BigInteger;
    '-901': BigInteger;
    '-900': BigInteger;
    '-899': BigInteger;
    '-898': BigInteger;
    '-897': BigInteger;
    '-896': BigInteger;
    '-895': BigInteger;
    '-894': BigInteger;
    '-893': BigInteger;
    '-892': BigInteger;
    '-891': BigInteger;
    '-890': BigInteger;
    '-889': BigInteger;
    '-888': BigInteger;
    '-887': BigInteger;
    '-886': BigInteger;
    '-885': BigInteger;
    '-884': BigInteger;
    '-883': BigInteger;
    '-882': BigInteger;
    '-881': BigInteger;
    '-880': BigInteger;
    '-879': BigInteger;
    '-878': BigInteger;
    '-877': BigInteger;
    '-876': BigInteger;
    '-875': BigInteger;
    '-874': BigInteger;
    '-873': BigInteger;
    '-872': BigInteger;
    '-871': BigInteger;
    '-870': BigInteger;
    '-869': BigInteger;
    '-868': BigInteger;
    '-867': BigInteger;
    '-866': BigInteger;
    '-865': BigInteger;
    '-864': BigInteger;
    '-863': BigInteger;
    '-862': BigInteger;
    '-861': BigInteger;
    '-860': BigInteger;
    '-859': BigInteger;
    '-858': BigInteger;
    '-857': BigInteger;
    '-856': BigInteger;
    '-855': BigInteger;
    '-854': BigInteger;
    '-853': BigInteger;
    '-852': BigInteger;
    '-851': BigInteger;
    '-850': BigInteger;
    '-849': BigInteger;
    '-848': BigInteger;
    '-847': BigInteger;
    '-846': BigInteger;
    '-845': BigInteger;
    '-844': BigInteger;
    '-843': BigInteger;
    '-842': BigInteger;
    '-841': BigInteger;
    '-840': BigInteger;
    '-839': BigInteger;
    '-838': BigInteger;
    '-837': BigInteger;
    '-836': BigInteger;
    '-835': BigInteger;
    '-834': BigInteger;
    '-833': BigInteger;
    '-832': BigInteger;
    '-831': BigInteger;
    '-830': BigInteger;
    '-829': BigInteger;
    '-828': BigInteger;
    '-827': BigInteger;
    '-826': BigInteger;
    '-825': BigInteger;
    '-824': BigInteger;
    '-823': BigInteger;
    '-822': BigInteger;
    '-821': BigInteger;
    '-820': BigInteger;
    '-819': BigInteger;
    '-818': BigInteger;
    '-817': BigInteger;
    '-816': BigInteger;
    '-815': BigInteger;
    '-814': BigInteger;
    '-813': BigInteger;
    '-812': BigInteger;
    '-811': BigInteger;
    '-810': BigInteger;
    '-809': BigInteger;
    '-808': BigInteger;
    '-807': BigInteger;
    '-806': BigInteger;
    '-805': BigInteger;
    '-804': BigInteger;
    '-803': BigInteger;
    '-802': BigInteger;
    '-801': BigInteger;
    '-800': BigInteger;
    '-799': BigInteger;
    '-798': BigInteger;
    '-797': BigInteger;
    '-796': BigInteger;
    '-795': BigInteger;
    '-794': BigInteger;
    '-793': BigInteger;
    '-792': BigInteger;
    '-791': BigInteger;
    '-790': BigInteger;
    '-789': BigInteger;
    '-788': BigInteger;
    '-787': BigInteger;
    '-786': BigInteger;
    '-785': BigInteger;
    '-784': BigInteger;
    '-783': BigInteger;
    '-782': BigInteger;
    '-781': BigInteger;
    '-780': BigInteger;
    '-779': BigInteger;
    '-778': BigInteger;
    '-777': BigInteger;
    '-776': BigInteger;
    '-775': BigInteger;
    '-774': BigInteger;
    '-773': BigInteger;
    '-772': BigInteger;
    '-771': BigInteger;
    '-770': BigInteger;
    '-769': BigInteger;
    '-768': BigInteger;
    '-767': BigInteger;
    '-766': BigInteger;
    '-765': BigInteger;
    '-764': BigInteger;
    '-763': BigInteger;
    '-762': BigInteger;
    '-761': BigInteger;
    '-760': BigInteger;
    '-759': BigInteger;
    '-758': BigInteger;
    '-757': BigInteger;
    '-756': BigInteger;
    '-755': BigInteger;
    '-754': BigInteger;
    '-753': BigInteger;
    '-752': BigInteger;
    '-751': BigInteger;
    '-750': BigInteger;
    '-749': BigInteger;
    '-748': BigInteger;
    '-747': BigInteger;
    '-746': BigInteger;
    '-745': BigInteger;
    '-744': BigInteger;
    '-743': BigInteger;
    '-742': BigInteger;
    '-741': BigInteger;
    '-740': BigInteger;
    '-739': BigInteger;
    '-738': BigInteger;
    '-737': BigInteger;
    '-736': BigInteger;
    '-735': BigInteger;
    '-734': BigInteger;
    '-733': BigInteger;
    '-732': BigInteger;
    '-731': BigInteger;
    '-730': BigInteger;
    '-729': BigInteger;
    '-728': BigInteger;
    '-727': BigInteger;
    '-726': BigInteger;
    '-725': BigInteger;
    '-724': BigInteger;
    '-723': BigInteger;
    '-722': BigInteger;
    '-721': BigInteger;
    '-720': BigInteger;
    '-719': BigInteger;
    '-718': BigInteger;
    '-717': BigInteger;
    '-716': BigInteger;
    '-715': BigInteger;
    '-714': BigInteger;
    '-713': BigInteger;
    '-712': BigInteger;
    '-711': BigInteger;
    '-710': BigInteger;
    '-709': BigInteger;
    '-708': BigInteger;
    '-707': BigInteger;
    '-706': BigInteger;
    '-705': BigInteger;
    '-704': BigInteger;
    '-703': BigInteger;
    '-702': BigInteger;
    '-701': BigInteger;
    '-700': BigInteger;
    '-699': BigInteger;
    '-698': BigInteger;
    '-697': BigInteger;
    '-696': BigInteger;
    '-695': BigInteger;
    '-694': BigInteger;
    '-693': BigInteger;
    '-692': BigInteger;
    '-691': BigInteger;
    '-690': BigInteger;
    '-689': BigInteger;
    '-688': BigInteger;
    '-687': BigInteger;
    '-686': BigInteger;
    '-685': BigInteger;
    '-684': BigInteger;
    '-683': BigInteger;
    '-682': BigInteger;
    '-681': BigInteger;
    '-680': BigInteger;
    '-679': BigInteger;
    '-678': BigInteger;
    '-677': BigInteger;
    '-676': BigInteger;
    '-675': BigInteger;
    '-674': BigInteger;
    '-673': BigInteger;
    '-672': BigInteger;
    '-671': BigInteger;
    '-670': BigInteger;
    '-669': BigInteger;
    '-668': BigInteger;
    '-667': BigInteger;
    '-666': BigInteger;
    '-665': BigInteger;
    '-664': BigInteger;
    '-663': BigInteger;
    '-662': BigInteger;
    '-661': BigInteger;
    '-660': BigInteger;
    '-659': BigInteger;
    '-658': BigInteger;
    '-657': BigInteger;
    '-656': BigInteger;
    '-655': BigInteger;
    '-654': BigInteger;
    '-653': BigInteger;
    '-652': BigInteger;
    '-651': BigInteger;
    '-650': BigInteger;
    '-649': BigInteger;
    '-648': BigInteger;
    '-647': BigInteger;
    '-646': BigInteger;
    '-645': BigInteger;
    '-644': BigInteger;
    '-643': BigInteger;
    '-642': BigInteger;
    '-641': BigInteger;
    '-640': BigInteger;
    '-639': BigInteger;
    '-638': BigInteger;
    '-637': BigInteger;
    '-636': BigInteger;
    '-635': BigInteger;
    '-634': BigInteger;
    '-633': BigInteger;
    '-632': BigInteger;
    '-631': BigInteger;
    '-630': BigInteger;
    '-629': BigInteger;
    '-628': BigInteger;
    '-627': BigInteger;
    '-626': BigInteger;
    '-625': BigInteger;
    '-624': BigInteger;
    '-623': BigInteger;
    '-622': BigInteger;
    '-621': BigInteger;
    '-620': BigInteger;
    '-619': BigInteger;
    '-618': BigInteger;
    '-617': BigInteger;
    '-616': BigInteger;
    '-615': BigInteger;
    '-614': BigInteger;
    '-613': BigInteger;
    '-612': BigInteger;
    '-611': BigInteger;
    '-610': BigInteger;
    '-609': BigInteger;
    '-608': BigInteger;
    '-607': BigInteger;
    '-606': BigInteger;
    '-605': BigInteger;
    '-604': BigInteger;
    '-603': BigInteger;
    '-602': BigInteger;
    '-601': BigInteger;
    '-600': BigInteger;
    '-599': BigInteger;
    '-598': BigInteger;
    '-597': BigInteger;
    '-596': BigInteger;
    '-595': BigInteger;
    '-594': BigInteger;
    '-593': BigInteger;
    '-592': BigInteger;
    '-591': BigInteger;
    '-590': BigInteger;
    '-589': BigInteger;
    '-588': BigInteger;
    '-587': BigInteger;
    '-586': BigInteger;
    '-585': BigInteger;
    '-584': BigInteger;
    '-583': BigInteger;
    '-582': BigInteger;
    '-581': BigInteger;
    '-580': BigInteger;
    '-579': BigInteger;
    '-578': BigInteger;
    '-577': BigInteger;
    '-576': BigInteger;
    '-575': BigInteger;
    '-574': BigInteger;
    '-573': BigInteger;
    '-572': BigInteger;
    '-571': BigInteger;
    '-570': BigInteger;
    '-569': BigInteger;
    '-568': BigInteger;
    '-567': BigInteger;
    '-566': BigInteger;
    '-565': BigInteger;
    '-564': BigInteger;
    '-563': BigInteger;
    '-562': BigInteger;
    '-561': BigInteger;
    '-560': BigInteger;
    '-559': BigInteger;
    '-558': BigInteger;
    '-557': BigInteger;
    '-556': BigInteger;
    '-555': BigInteger;
    '-554': BigInteger;
    '-553': BigInteger;
    '-552': BigInteger;
    '-551': BigInteger;
    '-550': BigInteger;
    '-549': BigInteger;
    '-548': BigInteger;
    '-547': BigInteger;
    '-546': BigInteger;
    '-545': BigInteger;
    '-544': BigInteger;
    '-543': BigInteger;
    '-542': BigInteger;
    '-541': BigInteger;
    '-540': BigInteger;
    '-539': BigInteger;
    '-538': BigInteger;
    '-537': BigInteger;
    '-536': BigInteger;
    '-535': BigInteger;
    '-534': BigInteger;
    '-533': BigInteger;
    '-532': BigInteger;
    '-531': BigInteger;
    '-530': BigInteger;
    '-529': BigInteger;
    '-528': BigInteger;
    '-527': BigInteger;
    '-526': BigInteger;
    '-525': BigInteger;
    '-524': BigInteger;
    '-523': BigInteger;
    '-522': BigInteger;
    '-521': BigInteger;
    '-520': BigInteger;
    '-519': BigInteger;
    '-518': BigInteger;
    '-517': BigInteger;
    '-516': BigInteger;
    '-515': BigInteger;
    '-514': BigInteger;
    '-513': BigInteger;
    '-512': BigInteger;
    '-511': BigInteger;
    '-510': BigInteger;
    '-509': BigInteger;
    '-508': BigInteger;
    '-507': BigInteger;
    '-506': BigInteger;
    '-505': BigInteger;
    '-504': BigInteger;
    '-503': BigInteger;
    '-502': BigInteger;
    '-501': BigInteger;
    '-500': BigInteger;
    '-499': BigInteger;
    '-498': BigInteger;
    '-497': BigInteger;
    '-496': BigInteger;
    '-495': BigInteger;
    '-494': BigInteger;
    '-493': BigInteger;
    '-492': BigInteger;
    '-491': BigInteger;
    '-490': BigInteger;
    '-489': BigInteger;
    '-488': BigInteger;
    '-487': BigInteger;
    '-486': BigInteger;
    '-485': BigInteger;
    '-484': BigInteger;
    '-483': BigInteger;
    '-482': BigInteger;
    '-481': BigInteger;
    '-480': BigInteger;
    '-479': BigInteger;
    '-478': BigInteger;
    '-477': BigInteger;
    '-476': BigInteger;
    '-475': BigInteger;
    '-474': BigInteger;
    '-473': BigInteger;
    '-472': BigInteger;
    '-471': BigInteger;
    '-470': BigInteger;
    '-469': BigInteger;
    '-468': BigInteger;
    '-467': BigInteger;
    '-466': BigInteger;
    '-465': BigInteger;
    '-464': BigInteger;
    '-463': BigInteger;
    '-462': BigInteger;
    '-461': BigInteger;
    '-460': BigInteger;
    '-459': BigInteger;
    '-458': BigInteger;
    '-457': BigInteger;
    '-456': BigInteger;
    '-455': BigInteger;
    '-454': BigInteger;
    '-453': BigInteger;
    '-452': BigInteger;
    '-451': BigInteger;
    '-450': BigInteger;
    '-449': BigInteger;
    '-448': BigInteger;
    '-447': BigInteger;
    '-446': BigInteger;
    '-445': BigInteger;
    '-444': BigInteger;
    '-443': BigInteger;
    '-442': BigInteger;
    '-441': BigInteger;
    '-440': BigInteger;
    '-439': BigInteger;
    '-438': BigInteger;
    '-437': BigInteger;
    '-436': BigInteger;
    '-435': BigInteger;
    '-434': BigInteger;
    '-433': BigInteger;
    '-432': BigInteger;
    '-431': BigInteger;
    '-430': BigInteger;
    '-429': BigInteger;
    '-428': BigInteger;
    '-427': BigInteger;
    '-426': BigInteger;
    '-425': BigInteger;
    '-424': BigInteger;
    '-423': BigInteger;
    '-422': BigInteger;
    '-421': BigInteger;
    '-420': BigInteger;
    '-419': BigInteger;
    '-418': BigInteger;
    '-417': BigInteger;
    '-416': BigInteger;
    '-415': BigInteger;
    '-414': BigInteger;
    '-413': BigInteger;
    '-412': BigInteger;
    '-411': BigInteger;
    '-410': BigInteger;
    '-409': BigInteger;
    '-408': BigInteger;
    '-407': BigInteger;
    '-406': BigInteger;
    '-405': BigInteger;
    '-404': BigInteger;
    '-403': BigInteger;
    '-402': BigInteger;
    '-401': BigInteger;
    '-400': BigInteger;
    '-399': BigInteger;
    '-398': BigInteger;
    '-397': BigInteger;
    '-396': BigInteger;
    '-395': BigInteger;
    '-394': BigInteger;
    '-393': BigInteger;
    '-392': BigInteger;
    '-391': BigInteger;
    '-390': BigInteger;
    '-389': BigInteger;
    '-388': BigInteger;
    '-387': BigInteger;
    '-386': BigInteger;
    '-385': BigInteger;
    '-384': BigInteger;
    '-383': BigInteger;
    '-382': BigInteger;
    '-381': BigInteger;
    '-380': BigInteger;
    '-379': BigInteger;
    '-378': BigInteger;
    '-377': BigInteger;
    '-376': BigInteger;
    '-375': BigInteger;
    '-374': BigInteger;
    '-373': BigInteger;
    '-372': BigInteger;
    '-371': BigInteger;
    '-370': BigInteger;
    '-369': BigInteger;
    '-368': BigInteger;
    '-367': BigInteger;
    '-366': BigInteger;
    '-365': BigInteger;
    '-364': BigInteger;
    '-363': BigInteger;
    '-362': BigInteger;
    '-361': BigInteger;
    '-360': BigInteger;
    '-359': BigInteger;
    '-358': BigInteger;
    '-357': BigInteger;
    '-356': BigInteger;
    '-355': BigInteger;
    '-354': BigInteger;
    '-353': BigInteger;
    '-352': BigInteger;
    '-351': BigInteger;
    '-350': BigInteger;
    '-349': BigInteger;
    '-348': BigInteger;
    '-347': BigInteger;
    '-346': BigInteger;
    '-345': BigInteger;
    '-344': BigInteger;
    '-343': BigInteger;
    '-342': BigInteger;
    '-341': BigInteger;
    '-340': BigInteger;
    '-339': BigInteger;
    '-338': BigInteger;
    '-337': BigInteger;
    '-336': BigInteger;
    '-335': BigInteger;
    '-334': BigInteger;
    '-333': BigInteger;
    '-332': BigInteger;
    '-331': BigInteger;
    '-330': BigInteger;
    '-329': BigInteger;
    '-328': BigInteger;
    '-327': BigInteger;
    '-326': BigInteger;
    '-325': BigInteger;
    '-324': BigInteger;
    '-323': BigInteger;
    '-322': BigInteger;
    '-321': BigInteger;
    '-320': BigInteger;
    '-319': BigInteger;
    '-318': BigInteger;
    '-317': BigInteger;
    '-316': BigInteger;
    '-315': BigInteger;
    '-314': BigInteger;
    '-313': BigInteger;
    '-312': BigInteger;
    '-311': BigInteger;
    '-310': BigInteger;
    '-309': BigInteger;
    '-308': BigInteger;
    '-307': BigInteger;
    '-306': BigInteger;
    '-305': BigInteger;
    '-304': BigInteger;
    '-303': BigInteger;
    '-302': BigInteger;
    '-301': BigInteger;
    '-300': BigInteger;
    '-299': BigInteger;
    '-298': BigInteger;
    '-297': BigInteger;
    '-296': BigInteger;
    '-295': BigInteger;
    '-294': BigInteger;
    '-293': BigInteger;
    '-292': BigInteger;
    '-291': BigInteger;
    '-290': BigInteger;
    '-289': BigInteger;
    '-288': BigInteger;
    '-287': BigInteger;
    '-286': BigInteger;
    '-285': BigInteger;
    '-284': BigInteger;
    '-283': BigInteger;
    '-282': BigInteger;
    '-281': BigInteger;
    '-280': BigInteger;
    '-279': BigInteger;
    '-278': BigInteger;
    '-277': BigInteger;
    '-276': BigInteger;
    '-275': BigInteger;
    '-274': BigInteger;
    '-273': BigInteger;
    '-272': BigInteger;
    '-271': BigInteger;
    '-270': BigInteger;
    '-269': BigInteger;
    '-268': BigInteger;
    '-267': BigInteger;
    '-266': BigInteger;
    '-265': BigInteger;
    '-264': BigInteger;
    '-263': BigInteger;
    '-262': BigInteger;
    '-261': BigInteger;
    '-260': BigInteger;
    '-259': BigInteger;
    '-258': BigInteger;
    '-257': BigInteger;
    '-256': BigInteger;
    '-255': BigInteger;
    '-254': BigInteger;
    '-253': BigInteger;
    '-252': BigInteger;
    '-251': BigInteger;
    '-250': BigInteger;
    '-249': BigInteger;
    '-248': BigInteger;
    '-247': BigInteger;
    '-246': BigInteger;
    '-245': BigInteger;
    '-244': BigInteger;
    '-243': BigInteger;
    '-242': BigInteger;
    '-241': BigInteger;
    '-240': BigInteger;
    '-239': BigInteger;
    '-238': BigInteger;
    '-237': BigInteger;
    '-236': BigInteger;
    '-235': BigInteger;
    '-234': BigInteger;
    '-233': BigInteger;
    '-232': BigInteger;
    '-231': BigInteger;
    '-230': BigInteger;
    '-229': BigInteger;
    '-228': BigInteger;
    '-227': BigInteger;
    '-226': BigInteger;
    '-225': BigInteger;
    '-224': BigInteger;
    '-223': BigInteger;
    '-222': BigInteger;
    '-221': BigInteger;
    '-220': BigInteger;
    '-219': BigInteger;
    '-218': BigInteger;
    '-217': BigInteger;
    '-216': BigInteger;
    '-215': BigInteger;
    '-214': BigInteger;
    '-213': BigInteger;
    '-212': BigInteger;
    '-211': BigInteger;
    '-210': BigInteger;
    '-209': BigInteger;
    '-208': BigInteger;
    '-207': BigInteger;
    '-206': BigInteger;
    '-205': BigInteger;
    '-204': BigInteger;
    '-203': BigInteger;
    '-202': BigInteger;
    '-201': BigInteger;
    '-200': BigInteger;
    '-199': BigInteger;
    '-198': BigInteger;
    '-197': BigInteger;
    '-196': BigInteger;
    '-195': BigInteger;
    '-194': BigInteger;
    '-193': BigInteger;
    '-192': BigInteger;
    '-191': BigInteger;
    '-190': BigInteger;
    '-189': BigInteger;
    '-188': BigInteger;
    '-187': BigInteger;
    '-186': BigInteger;
    '-185': BigInteger;
    '-184': BigInteger;
    '-183': BigInteger;
    '-182': BigInteger;
    '-181': BigInteger;
    '-180': BigInteger;
    '-179': BigInteger;
    '-178': BigInteger;
    '-177': BigInteger;
    '-176': BigInteger;
    '-175': BigInteger;
    '-174': BigInteger;
    '-173': BigInteger;
    '-172': BigInteger;
    '-171': BigInteger;
    '-170': BigInteger;
    '-169': BigInteger;
    '-168': BigInteger;
    '-167': BigInteger;
    '-166': BigInteger;
    '-165': BigInteger;
    '-164': BigInteger;
    '-163': BigInteger;
    '-162': BigInteger;
    '-161': BigInteger;
    '-160': BigInteger;
    '-159': BigInteger;
    '-158': BigInteger;
    '-157': BigInteger;
    '-156': BigInteger;
    '-155': BigInteger;
    '-154': BigInteger;
    '-153': BigInteger;
    '-152': BigInteger;
    '-151': BigInteger;
    '-150': BigInteger;
    '-149': BigInteger;
    '-148': BigInteger;
    '-147': BigInteger;
    '-146': BigInteger;
    '-145': BigInteger;
    '-144': BigInteger;
    '-143': BigInteger;
    '-142': BigInteger;
    '-141': BigInteger;
    '-140': BigInteger;
    '-139': BigInteger;
    '-138': BigInteger;
    '-137': BigInteger;
    '-136': BigInteger;
    '-135': BigInteger;
    '-134': BigInteger;
    '-133': BigInteger;
    '-132': BigInteger;
    '-131': BigInteger;
    '-130': BigInteger;
    '-129': BigInteger;
    '-128': BigInteger;
    '-127': BigInteger;
    '-126': BigInteger;
    '-125': BigInteger;
    '-124': BigInteger;
    '-123': BigInteger;
    '-122': BigInteger;
    '-121': BigInteger;
    '-120': BigInteger;
    '-119': BigInteger;
    '-118': BigInteger;
    '-117': BigInteger;
    '-116': BigInteger;
    '-115': BigInteger;
    '-114': BigInteger;
    '-113': BigInteger;
    '-112': BigInteger;
    '-111': BigInteger;
    '-110': BigInteger;
    '-109': BigInteger;
    '-108': BigInteger;
    '-107': BigInteger;
    '-106': BigInteger;
    '-105': BigInteger;
    '-104': BigInteger;
    '-103': BigInteger;
    '-102': BigInteger;
    '-101': BigInteger;
    '-100': BigInteger;
    '-99': BigInteger;
    '-98': BigInteger;
    '-97': BigInteger;
    '-96': BigInteger;
    '-95': BigInteger;
    '-94': BigInteger;
    '-93': BigInteger;
    '-92': BigInteger;
    '-91': BigInteger;
    '-90': BigInteger;
    '-89': BigInteger;
    '-88': BigInteger;
    '-87': BigInteger;
    '-86': BigInteger;
    '-85': BigInteger;
    '-84': BigInteger;
    '-83': BigInteger;
    '-82': BigInteger;
    '-81': BigInteger;
    '-80': BigInteger;
    '-79': BigInteger;
    '-78': BigInteger;
    '-77': BigInteger;
    '-76': BigInteger;
    '-75': BigInteger;
    '-74': BigInteger;
    '-73': BigInteger;
    '-72': BigInteger;
    '-71': BigInteger;
    '-70': BigInteger;
    '-69': BigInteger;
    '-68': BigInteger;
    '-67': BigInteger;
    '-66': BigInteger;
    '-65': BigInteger;
    '-64': BigInteger;
    '-63': BigInteger;
    '-62': BigInteger;
    '-61': BigInteger;
    '-60': BigInteger;
    '-59': BigInteger;
    '-58': BigInteger;
    '-57': BigInteger;
    '-56': BigInteger;
    '-55': BigInteger;
    '-54': BigInteger;
    '-53': BigInteger;
    '-52': BigInteger;
    '-51': BigInteger;
    '-50': BigInteger;
    '-49': BigInteger;
    '-48': BigInteger;
    '-47': BigInteger;
    '-46': BigInteger;
    '-45': BigInteger;
    '-44': BigInteger;
    '-43': BigInteger;
    '-42': BigInteger;
    '-41': BigInteger;
    '-40': BigInteger;
    '-39': BigInteger;
    '-38': BigInteger;
    '-37': BigInteger;
    '-36': BigInteger;
    '-35': BigInteger;
    '-34': BigInteger;
    '-33': BigInteger;
    '-32': BigInteger;
    '-31': BigInteger;
    '-30': BigInteger;
    '-29': BigInteger;
    '-28': BigInteger;
    '-27': BigInteger;
    '-26': BigInteger;
    '-25': BigInteger;
    '-24': BigInteger;
    '-23': BigInteger;
    '-22': BigInteger;
    '-21': BigInteger;
    '-20': BigInteger;
    '-19': BigInteger;
    '-18': BigInteger;
    '-17': BigInteger;
    '-16': BigInteger;
    '-15': BigInteger;
    '-14': BigInteger;
    '-13': BigInteger;
    '-12': BigInteger;
    '-11': BigInteger;
    '-10': BigInteger;
    '-9': BigInteger;
    '-8': BigInteger;
    '-7': BigInteger;
    '-6': BigInteger;
    '-5': BigInteger;
    '-4': BigInteger;
    '-3': BigInteger;
    '-2': BigInteger;
    '-1': BigInteger;
    '0': BigInteger;
    '1': BigInteger;
    '2': BigInteger;
    '3': BigInteger;
    '4': BigInteger;
    '5': BigInteger;
    '6': BigInteger;
    '7': BigInteger;
    '8': BigInteger;
    '9': BigInteger;
    '10': BigInteger;
    '11': BigInteger;
    '12': BigInteger;
    '13': BigInteger;
    '14': BigInteger;
    '15': BigInteger;
    '16': BigInteger;
    '17': BigInteger;
    '18': BigInteger;
    '19': BigInteger;
    '20': BigInteger;
    '21': BigInteger;
    '22': BigInteger;
    '23': BigInteger;
    '24': BigInteger;
    '25': BigInteger;
    '26': BigInteger;
    '27': BigInteger;
    '28': BigInteger;
    '29': BigInteger;
    '30': BigInteger;
    '31': BigInteger;
    '32': BigInteger;
    '33': BigInteger;
    '34': BigInteger;
    '35': BigInteger;
    '36': BigInteger;
    '37': BigInteger;
    '38': BigInteger;
    '39': BigInteger;
    '40': BigInteger;
    '41': BigInteger;
    '42': BigInteger;
    '43': BigInteger;
    '44': BigInteger;
    '45': BigInteger;
    '46': BigInteger;
    '47': BigInteger;
    '48': BigInteger;
    '49': BigInteger;
    '50': BigInteger;
    '51': BigInteger;
    '52': BigInteger;
    '53': BigInteger;
    '54': BigInteger;
    '55': BigInteger;
    '56': BigInteger;
    '57': BigInteger;
    '58': BigInteger;
    '59': BigInteger;
    '60': BigInteger;
    '61': BigInteger;
    '62': BigInteger;
    '63': BigInteger;
    '64': BigInteger;
    '65': BigInteger;
    '66': BigInteger;
    '67': BigInteger;
    '68': BigInteger;
    '69': BigInteger;
    '70': BigInteger;
    '71': BigInteger;
    '72': BigInteger;
    '73': BigInteger;
    '74': BigInteger;
    '75': BigInteger;
    '76': BigInteger;
    '77': BigInteger;
    '78': BigInteger;
    '79': BigInteger;
    '80': BigInteger;
    '81': BigInteger;
    '82': BigInteger;
    '83': BigInteger;
    '84': BigInteger;
    '85': BigInteger;
    '86': BigInteger;
    '87': BigInteger;
    '88': BigInteger;
    '89': BigInteger;
    '90': BigInteger;
    '91': BigInteger;
    '92': BigInteger;
    '93': BigInteger;
    '94': BigInteger;
    '95': BigInteger;
    '96': BigInteger;
    '97': BigInteger;
    '98': BigInteger;
    '99': BigInteger;
    '100': BigInteger;
    '101': BigInteger;
    '102': BigInteger;
    '103': BigInteger;
    '104': BigInteger;
    '105': BigInteger;
    '106': BigInteger;
    '107': BigInteger;
    '108': BigInteger;
    '109': BigInteger;
    '110': BigInteger;
    '111': BigInteger;
    '112': BigInteger;
    '113': BigInteger;
    '114': BigInteger;
    '115': BigInteger;
    '116': BigInteger;
    '117': BigInteger;
    '118': BigInteger;
    '119': BigInteger;
    '120': BigInteger;
    '121': BigInteger;
    '122': BigInteger;
    '123': BigInteger;
    '124': BigInteger;
    '125': BigInteger;
    '126': BigInteger;
    '127': BigInteger;
    '128': BigInteger;
    '129': BigInteger;
    '130': BigInteger;
    '131': BigInteger;
    '132': BigInteger;
    '133': BigInteger;
    '134': BigInteger;
    '135': BigInteger;
    '136': BigInteger;
    '137': BigInteger;
    '138': BigInteger;
    '139': BigInteger;
    '140': BigInteger;
    '141': BigInteger;
    '142': BigInteger;
    '143': BigInteger;
    '144': BigInteger;
    '145': BigInteger;
    '146': BigInteger;
    '147': BigInteger;
    '148': BigInteger;
    '149': BigInteger;
    '150': BigInteger;
    '151': BigInteger;
    '152': BigInteger;
    '153': BigInteger;
    '154': BigInteger;
    '155': BigInteger;
    '156': BigInteger;
    '157': BigInteger;
    '158': BigInteger;
    '159': BigInteger;
    '160': BigInteger;
    '161': BigInteger;
    '162': BigInteger;
    '163': BigInteger;
    '164': BigInteger;
    '165': BigInteger;
    '166': BigInteger;
    '167': BigInteger;
    '168': BigInteger;
    '169': BigInteger;
    '170': BigInteger;
    '171': BigInteger;
    '172': BigInteger;
    '173': BigInteger;
    '174': BigInteger;
    '175': BigInteger;
    '176': BigInteger;
    '177': BigInteger;
    '178': BigInteger;
    '179': BigInteger;
    '180': BigInteger;
    '181': BigInteger;
    '182': BigInteger;
    '183': BigInteger;
    '184': BigInteger;
    '185': BigInteger;
    '186': BigInteger;
    '187': BigInteger;
    '188': BigInteger;
    '189': BigInteger;
    '190': BigInteger;
    '191': BigInteger;
    '192': BigInteger;
    '193': BigInteger;
    '194': BigInteger;
    '195': BigInteger;
    '196': BigInteger;
    '197': BigInteger;
    '198': BigInteger;
    '199': BigInteger;
    '200': BigInteger;
    '201': BigInteger;
    '202': BigInteger;
    '203': BigInteger;
    '204': BigInteger;
    '205': BigInteger;
    '206': BigInteger;
    '207': BigInteger;
    '208': BigInteger;
    '209': BigInteger;
    '210': BigInteger;
    '211': BigInteger;
    '212': BigInteger;
    '213': BigInteger;
    '214': BigInteger;
    '215': BigInteger;
    '216': BigInteger;
    '217': BigInteger;
    '218': BigInteger;
    '219': BigInteger;
    '220': BigInteger;
    '221': BigInteger;
    '222': BigInteger;
    '223': BigInteger;
    '224': BigInteger;
    '225': BigInteger;
    '226': BigInteger;
    '227': BigInteger;
    '228': BigInteger;
    '229': BigInteger;
    '230': BigInteger;
    '231': BigInteger;
    '232': BigInteger;
    '233': BigInteger;
    '234': BigInteger;
    '235': BigInteger;
    '236': BigInteger;
    '237': BigInteger;
    '238': BigInteger;
    '239': BigInteger;
    '240': BigInteger;
    '241': BigInteger;
    '242': BigInteger;
    '243': BigInteger;
    '244': BigInteger;
    '245': BigInteger;
    '246': BigInteger;
    '247': BigInteger;
    '248': BigInteger;
    '249': BigInteger;
    '250': BigInteger;
    '251': BigInteger;
    '252': BigInteger;
    '253': BigInteger;
    '254': BigInteger;
    '255': BigInteger;
    '256': BigInteger;
    '257': BigInteger;
    '258': BigInteger;
    '259': BigInteger;
    '260': BigInteger;
    '261': BigInteger;
    '262': BigInteger;
    '263': BigInteger;
    '264': BigInteger;
    '265': BigInteger;
    '266': BigInteger;
    '267': BigInteger;
    '268': BigInteger;
    '269': BigInteger;
    '270': BigInteger;
    '271': BigInteger;
    '272': BigInteger;
    '273': BigInteger;
    '274': BigInteger;
    '275': BigInteger;
    '276': BigInteger;
    '277': BigInteger;
    '278': BigInteger;
    '279': BigInteger;
    '280': BigInteger;
    '281': BigInteger;
    '282': BigInteger;
    '283': BigInteger;
    '284': BigInteger;
    '285': BigInteger;
    '286': BigInteger;
    '287': BigInteger;
    '288': BigInteger;
    '289': BigInteger;
    '290': BigInteger;
    '291': BigInteger;
    '292': BigInteger;
    '293': BigInteger;
    '294': BigInteger;
    '295': BigInteger;
    '296': BigInteger;
    '297': BigInteger;
    '298': BigInteger;
    '299': BigInteger;
    '300': BigInteger;
    '301': BigInteger;
    '302': BigInteger;
    '303': BigInteger;
    '304': BigInteger;
    '305': BigInteger;
    '306': BigInteger;
    '307': BigInteger;
    '308': BigInteger;
    '309': BigInteger;
    '310': BigInteger;
    '311': BigInteger;
    '312': BigInteger;
    '313': BigInteger;
    '314': BigInteger;
    '315': BigInteger;
    '316': BigInteger;
    '317': BigInteger;
    '318': BigInteger;
    '319': BigInteger;
    '320': BigInteger;
    '321': BigInteger;
    '322': BigInteger;
    '323': BigInteger;
    '324': BigInteger;
    '325': BigInteger;
    '326': BigInteger;
    '327': BigInteger;
    '328': BigInteger;
    '329': BigInteger;
    '330': BigInteger;
    '331': BigInteger;
    '332': BigInteger;
    '333': BigInteger;
    '334': BigInteger;
    '335': BigInteger;
    '336': BigInteger;
    '337': BigInteger;
    '338': BigInteger;
    '339': BigInteger;
    '340': BigInteger;
    '341': BigInteger;
    '342': BigInteger;
    '343': BigInteger;
    '344': BigInteger;
    '345': BigInteger;
    '346': BigInteger;
    '347': BigInteger;
    '348': BigInteger;
    '349': BigInteger;
    '350': BigInteger;
    '351': BigInteger;
    '352': BigInteger;
    '353': BigInteger;
    '354': BigInteger;
    '355': BigInteger;
    '356': BigInteger;
    '357': BigInteger;
    '358': BigInteger;
    '359': BigInteger;
    '360': BigInteger;
    '361': BigInteger;
    '362': BigInteger;
    '363': BigInteger;
    '364': BigInteger;
    '365': BigInteger;
    '366': BigInteger;
    '367': BigInteger;
    '368': BigInteger;
    '369': BigInteger;
    '370': BigInteger;
    '371': BigInteger;
    '372': BigInteger;
    '373': BigInteger;
    '374': BigInteger;
    '375': BigInteger;
    '376': BigInteger;
    '377': BigInteger;
    '378': BigInteger;
    '379': BigInteger;
    '380': BigInteger;
    '381': BigInteger;
    '382': BigInteger;
    '383': BigInteger;
    '384': BigInteger;
    '385': BigInteger;
    '386': BigInteger;
    '387': BigInteger;
    '388': BigInteger;
    '389': BigInteger;
    '390': BigInteger;
    '391': BigInteger;
    '392': BigInteger;
    '393': BigInteger;
    '394': BigInteger;
    '395': BigInteger;
    '396': BigInteger;
    '397': BigInteger;
    '398': BigInteger;
    '399': BigInteger;
    '400': BigInteger;
    '401': BigInteger;
    '402': BigInteger;
    '403': BigInteger;
    '404': BigInteger;
    '405': BigInteger;
    '406': BigInteger;
    '407': BigInteger;
    '408': BigInteger;
    '409': BigInteger;
    '410': BigInteger;
    '411': BigInteger;
    '412': BigInteger;
    '413': BigInteger;
    '414': BigInteger;
    '415': BigInteger;
    '416': BigInteger;
    '417': BigInteger;
    '418': BigInteger;
    '419': BigInteger;
    '420': BigInteger;
    '421': BigInteger;
    '422': BigInteger;
    '423': BigInteger;
    '424': BigInteger;
    '425': BigInteger;
    '426': BigInteger;
    '427': BigInteger;
    '428': BigInteger;
    '429': BigInteger;
    '430': BigInteger;
    '431': BigInteger;
    '432': BigInteger;
    '433': BigInteger;
    '434': BigInteger;
    '435': BigInteger;
    '436': BigInteger;
    '437': BigInteger;
    '438': BigInteger;
    '439': BigInteger;
    '440': BigInteger;
    '441': BigInteger;
    '442': BigInteger;
    '443': BigInteger;
    '444': BigInteger;
    '445': BigInteger;
    '446': BigInteger;
    '447': BigInteger;
    '448': BigInteger;
    '449': BigInteger;
    '450': BigInteger;
    '451': BigInteger;
    '452': BigInteger;
    '453': BigInteger;
    '454': BigInteger;
    '455': BigInteger;
    '456': BigInteger;
    '457': BigInteger;
    '458': BigInteger;
    '459': BigInteger;
    '460': BigInteger;
    '461': BigInteger;
    '462': BigInteger;
    '463': BigInteger;
    '464': BigInteger;
    '465': BigInteger;
    '466': BigInteger;
    '467': BigInteger;
    '468': BigInteger;
    '469': BigInteger;
    '470': BigInteger;
    '471': BigInteger;
    '472': BigInteger;
    '473': BigInteger;
    '474': BigInteger;
    '475': BigInteger;
    '476': BigInteger;
    '477': BigInteger;
    '478': BigInteger;
    '479': BigInteger;
    '480': BigInteger;
    '481': BigInteger;
    '482': BigInteger;
    '483': BigInteger;
    '484': BigInteger;
    '485': BigInteger;
    '486': BigInteger;
    '487': BigInteger;
    '488': BigInteger;
    '489': BigInteger;
    '490': BigInteger;
    '491': BigInteger;
    '492': BigInteger;
    '493': BigInteger;
    '494': BigInteger;
    '495': BigInteger;
    '496': BigInteger;
    '497': BigInteger;
    '498': BigInteger;
    '499': BigInteger;
    '500': BigInteger;
    '501': BigInteger;
    '502': BigInteger;
    '503': BigInteger;
    '504': BigInteger;
    '505': BigInteger;
    '506': BigInteger;
    '507': BigInteger;
    '508': BigInteger;
    '509': BigInteger;
    '510': BigInteger;
    '511': BigInteger;
    '512': BigInteger;
    '513': BigInteger;
    '514': BigInteger;
    '515': BigInteger;
    '516': BigInteger;
    '517': BigInteger;
    '518': BigInteger;
    '519': BigInteger;
    '520': BigInteger;
    '521': BigInteger;
    '522': BigInteger;
    '523': BigInteger;
    '524': BigInteger;
    '525': BigInteger;
    '526': BigInteger;
    '527': BigInteger;
    '528': BigInteger;
    '529': BigInteger;
    '530': BigInteger;
    '531': BigInteger;
    '532': BigInteger;
    '533': BigInteger;
    '534': BigInteger;
    '535': BigInteger;
    '536': BigInteger;
    '537': BigInteger;
    '538': BigInteger;
    '539': BigInteger;
    '540': BigInteger;
    '541': BigInteger;
    '542': BigInteger;
    '543': BigInteger;
    '544': BigInteger;
    '545': BigInteger;
    '546': BigInteger;
    '547': BigInteger;
    '548': BigInteger;
    '549': BigInteger;
    '550': BigInteger;
    '551': BigInteger;
    '552': BigInteger;
    '553': BigInteger;
    '554': BigInteger;
    '555': BigInteger;
    '556': BigInteger;
    '557': BigInteger;
    '558': BigInteger;
    '559': BigInteger;
    '560': BigInteger;
    '561': BigInteger;
    '562': BigInteger;
    '563': BigInteger;
    '564': BigInteger;
    '565': BigInteger;
    '566': BigInteger;
    '567': BigInteger;
    '568': BigInteger;
    '569': BigInteger;
    '570': BigInteger;
    '571': BigInteger;
    '572': BigInteger;
    '573': BigInteger;
    '574': BigInteger;
    '575': BigInteger;
    '576': BigInteger;
    '577': BigInteger;
    '578': BigInteger;
    '579': BigInteger;
    '580': BigInteger;
    '581': BigInteger;
    '582': BigInteger;
    '583': BigInteger;
    '584': BigInteger;
    '585': BigInteger;
    '586': BigInteger;
    '587': BigInteger;
    '588': BigInteger;
    '589': BigInteger;
    '590': BigInteger;
    '591': BigInteger;
    '592': BigInteger;
    '593': BigInteger;
    '594': BigInteger;
    '595': BigInteger;
    '596': BigInteger;
    '597': BigInteger;
    '598': BigInteger;
    '599': BigInteger;
    '600': BigInteger;
    '601': BigInteger;
    '602': BigInteger;
    '603': BigInteger;
    '604': BigInteger;
    '605': BigInteger;
    '606': BigInteger;
    '607': BigInteger;
    '608': BigInteger;
    '609': BigInteger;
    '610': BigInteger;
    '611': BigInteger;
    '612': BigInteger;
    '613': BigInteger;
    '614': BigInteger;
    '615': BigInteger;
    '616': BigInteger;
    '617': BigInteger;
    '618': BigInteger;
    '619': BigInteger;
    '620': BigInteger;
    '621': BigInteger;
    '622': BigInteger;
    '623': BigInteger;
    '624': BigInteger;
    '625': BigInteger;
    '626': BigInteger;
    '627': BigInteger;
    '628': BigInteger;
    '629': BigInteger;
    '630': BigInteger;
    '631': BigInteger;
    '632': BigInteger;
    '633': BigInteger;
    '634': BigInteger;
    '635': BigInteger;
    '636': BigInteger;
    '637': BigInteger;
    '638': BigInteger;
    '639': BigInteger;
    '640': BigInteger;
    '641': BigInteger;
    '642': BigInteger;
    '643': BigInteger;
    '644': BigInteger;
    '645': BigInteger;
    '646': BigInteger;
    '647': BigInteger;
    '648': BigInteger;
    '649': BigInteger;
    '650': BigInteger;
    '651': BigInteger;
    '652': BigInteger;
    '653': BigInteger;
    '654': BigInteger;
    '655': BigInteger;
    '656': BigInteger;
    '657': BigInteger;
    '658': BigInteger;
    '659': BigInteger;
    '660': BigInteger;
    '661': BigInteger;
    '662': BigInteger;
    '663': BigInteger;
    '664': BigInteger;
    '665': BigInteger;
    '666': BigInteger;
    '667': BigInteger;
    '668': BigInteger;
    '669': BigInteger;
    '670': BigInteger;
    '671': BigInteger;
    '672': BigInteger;
    '673': BigInteger;
    '674': BigInteger;
    '675': BigInteger;
    '676': BigInteger;
    '677': BigInteger;
    '678': BigInteger;
    '679': BigInteger;
    '680': BigInteger;
    '681': BigInteger;
    '682': BigInteger;
    '683': BigInteger;
    '684': BigInteger;
    '685': BigInteger;
    '686': BigInteger;
    '687': BigInteger;
    '688': BigInteger;
    '689': BigInteger;
    '690': BigInteger;
    '691': BigInteger;
    '692': BigInteger;
    '693': BigInteger;
    '694': BigInteger;
    '695': BigInteger;
    '696': BigInteger;
    '697': BigInteger;
    '698': BigInteger;
    '699': BigInteger;
    '700': BigInteger;
    '701': BigInteger;
    '702': BigInteger;
    '703': BigInteger;
    '704': BigInteger;
    '705': BigInteger;
    '706': BigInteger;
    '707': BigInteger;
    '708': BigInteger;
    '709': BigInteger;
    '710': BigInteger;
    '711': BigInteger;
    '712': BigInteger;
    '713': BigInteger;
    '714': BigInteger;
    '715': BigInteger;
    '716': BigInteger;
    '717': BigInteger;
    '718': BigInteger;
    '719': BigInteger;
    '720': BigInteger;
    '721': BigInteger;
    '722': BigInteger;
    '723': BigInteger;
    '724': BigInteger;
    '725': BigInteger;
    '726': BigInteger;
    '727': BigInteger;
    '728': BigInteger;
    '729': BigInteger;
    '730': BigInteger;
    '731': BigInteger;
    '732': BigInteger;
    '733': BigInteger;
    '734': BigInteger;
    '735': BigInteger;
    '736': BigInteger;
    '737': BigInteger;
    '738': BigInteger;
    '739': BigInteger;
    '740': BigInteger;
    '741': BigInteger;
    '742': BigInteger;
    '743': BigInteger;
    '744': BigInteger;
    '745': BigInteger;
    '746': BigInteger;
    '747': BigInteger;
    '748': BigInteger;
    '749': BigInteger;
    '750': BigInteger;
    '751': BigInteger;
    '752': BigInteger;
    '753': BigInteger;
    '754': BigInteger;
    '755': BigInteger;
    '756': BigInteger;
    '757': BigInteger;
    '758': BigInteger;
    '759': BigInteger;
    '760': BigInteger;
    '761': BigInteger;
    '762': BigInteger;
    '763': BigInteger;
    '764': BigInteger;
    '765': BigInteger;
    '766': BigInteger;
    '767': BigInteger;
    '768': BigInteger;
    '769': BigInteger;
    '770': BigInteger;
    '771': BigInteger;
    '772': BigInteger;
    '773': BigInteger;
    '774': BigInteger;
    '775': BigInteger;
    '776': BigInteger;
    '777': BigInteger;
    '778': BigInteger;
    '779': BigInteger;
    '780': BigInteger;
    '781': BigInteger;
    '782': BigInteger;
    '783': BigInteger;
    '784': BigInteger;
    '785': BigInteger;
    '786': BigInteger;
    '787': BigInteger;
    '788': BigInteger;
    '789': BigInteger;
    '790': BigInteger;
    '791': BigInteger;
    '792': BigInteger;
    '793': BigInteger;
    '794': BigInteger;
    '795': BigInteger;
    '796': BigInteger;
    '797': BigInteger;
    '798': BigInteger;
    '799': BigInteger;
    '800': BigInteger;
    '801': BigInteger;
    '802': BigInteger;
    '803': BigInteger;
    '804': BigInteger;
    '805': BigInteger;
    '806': BigInteger;
    '807': BigInteger;
    '808': BigInteger;
    '809': BigInteger;
    '810': BigInteger;
    '811': BigInteger;
    '812': BigInteger;
    '813': BigInteger;
    '814': BigInteger;
    '815': BigInteger;
    '816': BigInteger;
    '817': BigInteger;
    '818': BigInteger;
    '819': BigInteger;
    '820': BigInteger;
    '821': BigInteger;
    '822': BigInteger;
    '823': BigInteger;
    '824': BigInteger;
    '825': BigInteger;
    '826': BigInteger;
    '827': BigInteger;
    '828': BigInteger;
    '829': BigInteger;
    '830': BigInteger;
    '831': BigInteger;
    '832': BigInteger;
    '833': BigInteger;
    '834': BigInteger;
    '835': BigInteger;
    '836': BigInteger;
    '837': BigInteger;
    '838': BigInteger;
    '839': BigInteger;
    '840': BigInteger;
    '841': BigInteger;
    '842': BigInteger;
    '843': BigInteger;
    '844': BigInteger;
    '845': BigInteger;
    '846': BigInteger;
    '847': BigInteger;
    '848': BigInteger;
    '849': BigInteger;
    '850': BigInteger;
    '851': BigInteger;
    '852': BigInteger;
    '853': BigInteger;
    '854': BigInteger;
    '855': BigInteger;
    '856': BigInteger;
    '857': BigInteger;
    '858': BigInteger;
    '859': BigInteger;
    '860': BigInteger;
    '861': BigInteger;
    '862': BigInteger;
    '863': BigInteger;
    '864': BigInteger;
    '865': BigInteger;
    '866': BigInteger;
    '867': BigInteger;
    '868': BigInteger;
    '869': BigInteger;
    '870': BigInteger;
    '871': BigInteger;
    '872': BigInteger;
    '873': BigInteger;
    '874': BigInteger;
    '875': BigInteger;
    '876': BigInteger;
    '877': BigInteger;
    '878': BigInteger;
    '879': BigInteger;
    '880': BigInteger;
    '881': BigInteger;
    '882': BigInteger;
    '883': BigInteger;
    '884': BigInteger;
    '885': BigInteger;
    '886': BigInteger;
    '887': BigInteger;
    '888': BigInteger;
    '889': BigInteger;
    '890': BigInteger;
    '891': BigInteger;
    '892': BigInteger;
    '893': BigInteger;
    '894': BigInteger;
    '895': BigInteger;
    '896': BigInteger;
    '897': BigInteger;
    '898': BigInteger;
    '899': BigInteger;
    '900': BigInteger;
    '901': BigInteger;
    '902': BigInteger;
    '903': BigInteger;
    '904': BigInteger;
    '905': BigInteger;
    '906': BigInteger;
    '907': BigInteger;
    '908': BigInteger;
    '909': BigInteger;
    '910': BigInteger;
    '911': BigInteger;
    '912': BigInteger;
    '913': BigInteger;
    '914': BigInteger;
    '915': BigInteger;
    '916': BigInteger;
    '917': BigInteger;
    '918': BigInteger;
    '919': BigInteger;
    '920': BigInteger;
    '921': BigInteger;
    '922': BigInteger;
    '923': BigInteger;
    '924': BigInteger;
    '925': BigInteger;
    '926': BigInteger;
    '927': BigInteger;
    '928': BigInteger;
    '929': BigInteger;
    '930': BigInteger;
    '931': BigInteger;
    '932': BigInteger;
    '933': BigInteger;
    '934': BigInteger;
    '935': BigInteger;
    '936': BigInteger;
    '937': BigInteger;
    '938': BigInteger;
    '939': BigInteger;
    '940': BigInteger;
    '941': BigInteger;
    '942': BigInteger;
    '943': BigInteger;
    '944': BigInteger;
    '945': BigInteger;
    '946': BigInteger;
    '947': BigInteger;
    '948': BigInteger;
    '949': BigInteger;
    '950': BigInteger;
    '951': BigInteger;
    '952': BigInteger;
    '953': BigInteger;
    '954': BigInteger;
    '955': BigInteger;
    '956': BigInteger;
    '957': BigInteger;
    '958': BigInteger;
    '959': BigInteger;
    '960': BigInteger;
    '961': BigInteger;
    '962': BigInteger;
    '963': BigInteger;
    '964': BigInteger;
    '965': BigInteger;
    '966': BigInteger;
    '967': BigInteger;
    '968': BigInteger;
    '969': BigInteger;
    '970': BigInteger;
    '971': BigInteger;
    '972': BigInteger;
    '973': BigInteger;
    '974': BigInteger;
    '975': BigInteger;
    '976': BigInteger;
    '977': BigInteger;
    '978': BigInteger;
    '979': BigInteger;
    '980': BigInteger;
    '981': BigInteger;
    '982': BigInteger;
    '983': BigInteger;
    '984': BigInteger;
    '985': BigInteger;
    '986': BigInteger;
    '987': BigInteger;
    '988': BigInteger;
    '989': BigInteger;
    '990': BigInteger;
    '991': BigInteger;
    '992': BigInteger;
    '993': BigInteger;
    '994': BigInteger;
    '995': BigInteger;
    '996': BigInteger;
    '997': BigInteger;
    '998': BigInteger;
    '999': BigInteger;
}

interface BaseArray {
    value: number[],
    isNegative: boolean
}