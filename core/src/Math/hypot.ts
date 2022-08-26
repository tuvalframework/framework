export function hypot(x: number, y: number, z?: number) {
    // Use the native implementation if it's available
    if (typeof Math.hypot === 'function') {
        return Math.hypot.apply(null, arguments as any);
    }

    // Otherwise use the V8 implementation
    // https://github.com/v8/v8/blob/8cd3cf297287e581a49e487067f5cbd991b27123/src/js/math.js#L217
    var length = arguments.length;
    const args: any[] = [];
    var max = 0;
    for (let i = 0; i < length; i++) {
        var n = arguments[i];
        n = +n;
        if (n === Infinity || n === -Infinity) {
            return Infinity;
        }
        n = Math.abs(n);
        if (n > max) {
            max = n;
        }
        args[i] = n;
    }

    if (max === 0) {
        max = 1;
    }
    var sum = 0;
    var compensation = 0;
    for (var j = 0; j < length; j++) {
        var m = args[j] / max;
        var summand = m * m - compensation;
        var preliminary = sum + summand;
        compensation = preliminary - sum - summand;
        sum = preliminary;
    }
    return Math.sqrt(sum) * max;
}