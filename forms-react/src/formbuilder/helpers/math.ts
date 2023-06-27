import { is } from '@tuval/core';

export const MathHelpers = {
    add: (a, b) => {
        if (is.number(a) && is.number(b)) {
            return Number(a) + Number(b);
        }
        if (is.string(a) && is.string(b)) {
            return a + b;
        }
        return '';
    }
}