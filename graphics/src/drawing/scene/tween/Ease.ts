export class Ease {
    public static linear(t) {
        return t;
    }

    /**
     * Mimics the simple -100 to 100 easing in Flash Pro.
     * @param {Number} amount A value from -1 (ease in) to 1 (ease out) indicating the strength and direction of the ease.
     * @return {Function}
     */
    public static get(amount) {
        if (amount < -1) { amount = -1; } else if (amount > 1) { amount = 1; }
        return function (t) {
            if (amount == 0) { return t; }
            if (amount < 0) { return t * (t * -amount + 1 + amount); }
            return t * ((2 - t) * amount + (1 - amount));
        };
    }

    /**
     * Configurable exponential ease.
     * @param {Number} pow The exponent to use (ex. 3 would return a cubic ease).
     * @return {Function}
     */
    public static getPowIn(pow) {
        return function (t) {
            return Math.pow(t, pow);
        };
    }

    /**
     * Configurable exponential ease.
     * @param {Number} pow The exponent to use (ex. 3 would return a cubic ease).
     * @return {Function}
     */
    public static  getPowOut(pow) {
        return function (t) {
            return 1 - Math.pow(1 - t, pow);
        };
    }

    /**
     * Configurable exponential ease.
     * @param {Number} pow The exponent to use (ex. 3 would return a cubic ease).
     * @return {Function}
     */
    public static getPowInOut(pow) {
        return function (t) {
            if ((t *= 2) < 1) return 0.5 * Math.pow(t, pow);
            return 1 - 0.5 * Math.abs(Math.pow(2 - t, pow));
        };
    }

    /**
     * @param {Number} t
     * @return {Number}
     */
    public static sineIn(t) {
        return 1 - Math.cos(t * Math.PI / 2);
    }

    /**
     * @param {Number} t
     * @return {Number}
     */
    public static sineOut(t) {
        return Math.sin(t * Math.PI / 2);
    }

    /**
     * @param {Number} t
     * @return {Number}
     */
    public static sineInOut(t) {
        return -0.5 * (Math.cos(Math.PI * t) - 1);
    }

    /**
     * Configurable "back in" ease.
     * @param {Number} amount The strength of the ease.
     * @return {Function}
     */
    public static getBackIn(amount) {
        return function (t) {
            return t * t * ((amount + 1) * t - amount);
        };
    }

    /**
     * Configurable "back out" ease.
     * @param {Number} amount The strength of the ease.
     * @return {Function}
     */
    public static getBackOut(amount) {
        return function (t) {
            return (--t * t * ((amount + 1) * t + amount) + 1);
        };
    }

    /**
     * Configurable "back in out" ease.
     * @param {Number} amount The strength of the ease.
     * @return {Function}
     */
    public static getBackInOut(amount) {
        amount *= 1.525;
        return function (t) {
            if ((t *= 2) < 1) return 0.5 * (t * t * ((amount + 1) * t - amount));
            return 0.5 * ((t -= 2) * t * ((amount + 1) * t + amount) + 2);
        };
    }

    /**
     * @param {Number} t
     * @return {Number}
     */
    public static circIn(t) {
        return -(Math.sqrt(1 - t * t) - 1);
    }

    /**
     * @param {Number} t
     * @return {Number}
     */
    public static circOut(t) {
        return Math.sqrt(1 - --t * t);
    }

    /**
     * @param {Number} t
     * @return {Number}
     */
    public static circInOut(t) {
        if ((t *= 2) < 1) return -0.5 * (Math.sqrt(1 - t * t) - 1);
        return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
    }

    /**
     * @param {Number} t
     * @return {Number}
     */
    public static bounceIn(t) {
        return 1 - Ease.bounceOut(1 - t);
    }

    /**
     * @param {Number} t
     * @return {Number}
     */
    public static bounceOut(t) {
        if (t < 1 / 2.75) {
            return 7.5625 * t * t;
        } else if (t < 2 / 2.75) {
            return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
        } else if (t < 2.5 / 2.75) {
            return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
        } else {
            return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
        }
    }

    /**
     * @param {Number} t
     * @return {Number}
     */
    public static bounceInOut(t) {
        if (t < 0.5) return Ease.bounceIn(t * 2) * 0.5;
        return Ease.bounceOut(t * 2 - 1) * 0.5 + 0.5;
    }

    /**
     * Configurable elastic ease.
     * @param {Number} amplitude
     * @param {Number} period
     * @return {Function}
     */
    public static getElasticIn(amplitude, period) {
        let pi2 = Math.PI * 2;
        return function (t) {
            if (t === 0 || t === 1) return t;
            let s = period / pi2 * Math.asin(1 / amplitude);
            return -(amplitude * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * pi2 / period));
        };
    }

    /**
     * Configurable elastic ease.
     * @param {Number} amplitude
     * @param {Number} period
     * @return {Function}
     */
    public static getElasticOut(amplitude, period) {
        let pi2 = Math.PI * 2;
        return function (t) {
            if (t === 0 || t === 1) return t;
            let s = period / pi2 * Math.asin(1 / amplitude);
            return amplitude * Math.pow(2, -10 * t) * Math.sin((t - s) * pi2 / period) + 1;
        };
    }

    /**
     * Configurable elastic ease.
     * @param {Number} amplitude
     * @param {Number} period
     * @return {Function}
     */
    public static getElasticInOut(amplitude, period) {
        let pi2 = Math.PI * 2;
        return function (t) {
            let s = period / pi2 * Math.asin(1 / amplitude);
            if ((t *= 2) < 1) return -0.5 * (amplitude * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * pi2 / period));
            return amplitude * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - s) * pi2 / period) * 0.5 + 1;
        };
    }

    /**
     * Identical to linear.
     * @param {Number} t
     * @return {Number}
     */
    public static none = Ease.linear;
    /**
     * @param {Number} t
     * @return {Number}
     */
    public static quadIn = Ease.getPowIn(2);
    /**
     * @param {Number} t
     * @return {Number}
     */
    public static quadOut = Ease.getPowOut(2);
    /**
     * @param {Number} t
     * @return {Number}
     */
    public static quadInOut = Ease.getPowInOut(2);
    /**
     * @param {Number} t
     * @return {Number}
     */
    public static cubicIn = Ease.getPowIn(3);
    /**
     * @param {Number} t
     * @return {Number}
     */
    public static cubicOut = Ease.getPowOut(3);
    /**
     * @param {Number} t
     * @return {Number}
     */
    public static cubicInOut = Ease.getPowInOut(3);
    /**
     * @param {Number} t
     * @return {Number}
     */
    public static quartIn = Ease.getPowIn(4);
    /**
     * @param {Number} t
     * @return {Number}
     */
    public static quartOut = Ease.getPowOut(4);
    /**
     * @param {Number} t
     * @return {Number}
     */
    public static quartInOut = Ease.getPowInOut(4);
    /**
     * @param {Number} t
     * @return {Number}
     */
    public static quintIn = Ease.getPowIn(5);
    /**
     * @param {Number} t
     * @return {Number}
     */
    public static quintOut = Ease.getPowOut(5);
    /**
     * @param {Number} t
     * @return {Number}
     */
    public static quintInOut = Ease.getPowInOut(5);
    /**
     * @param {Number} t
     * @return {Number}
     */
    public static backIn = Ease.getBackIn(1.7);
    /**
     * @param {Number} t
     * @return {Number}
     */
    public static backOut = Ease.getBackOut(1.7);
    /**
     * @param {Number} t
     * @return {Number}
     */
    public static backInOut = Ease.getBackInOut(1.7);
    /**
     * @param {Number} t
     * @return {Number}
     */
    public static elasticIn = Ease.getElasticIn(1, 0.3);
    /**
     * @param {Number} t
     * @return {Number}
     */
    public static elasticOut = Ease.getElasticOut(1, 0.3);
    /**
     * @param {Number} t
     * @return {Number}
     */
    public static elasticInOut = Ease.getElasticInOut(1, 0.3 * 1.5);
}