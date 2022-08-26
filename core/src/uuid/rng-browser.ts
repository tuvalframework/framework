declare var msCrypto;
const getRandomValues = (typeof (crypto) != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto)) ||
    (typeof (msCrypto) != 'undefined' && typeof (window as any).msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto));

export const rngBrowser  = (function () {
    if (getRandomValues) {
        // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
        var rnds8 = new Uint8Array(16);

        return function whatwgRNG() {
            getRandomValues(rnds8);
            return rnds8;
        };
    } else {
        // Math.random()-based (RNG)
        //
        // If all else fails, use Math.random().  It's fast, but is of unspecified
        // quality.
        var rnds = new Array(16);

        return function mathRNG() {
            for (var i = 0, r; i < 16; i++) {
                if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
                rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
            }

            return rnds;
        };
    }
})();
