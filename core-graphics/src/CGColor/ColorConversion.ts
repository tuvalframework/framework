export class ColorConversion {
    public static HsbaToHSLA(hsba: number[]): number[] {
        const hue: number = hsba[0];
        let sat: number = hsba[1];
        const val: number = hsba[2];

        // Calculate lightness.
        const li: number = (2 - sat) * val / 2;

        // Convert saturation.
        if (li !== 0) {
            if (li === 1) {
                sat = 0;
            } else if (li < 0.5) {
                sat = sat / (2 - sat);
            } else {
                sat = sat * val / (2 - li * 2);
            }
        }

        // Hue and alpha stay the same.
        return [hue, sat, li, hsba[3]];
    }

    public static HsbaToRGBA(hsba: number[]): number[] {
        const hue: number = hsba[0] * 6; // We will split hue into 6 sectors.
        const sat: number = hsba[1];
        const val: number = hsba[2];

        let RGBA: number[] = [];

        if (sat === 0) {
            RGBA = [val, val, val, hsba[3]]; // Return early if grayscale.
        } else {
            const sector: number = Math.floor(hue);
            const tint1: number = val * (1 - sat);
            const tint2: number = val * (1 - sat * (hue - sector));
            const tint3: number = val * (1 - sat * (1 + sector - hue));
            let red: number, green: number, blue: number;

            if (sector === 1) {
                // Yellow to green.
                red = tint2;
                green = val;
                blue = tint1;
            } else if (sector === 2) {
                // Green to cyan.
                red = tint1;
                green = val;
                blue = tint3;
            } else if (sector === 3) {
                // Cyan to blue.
                red = tint1;
                green = tint2;
                blue = val;
            } else if (sector === 4) {
                // Blue to magenta.
                red = tint3;
                green = tint1;
                blue = val;
            } else if (sector === 5) {
                // Magenta to red.
                red = val;
                green = tint1;
                blue = tint2;
            } else {
                // Red to yellow (sector could be 0 or 6).
                red = val;
                green = tint3;
                blue = tint1;
            }
            RGBA = [red, green, blue, hsba[3]];
        }

        return RGBA;
    }

    public static HslaToHSBA(hsla: number[]): number[] {
        const hue: number = hsla[0];
        let sat: number = hsla[1];
        const li: number = hsla[2];

        // Calculate brightness.
        let val: number;
        if (li < 0.5) {
            val = (1 + sat) * li;
        } else {
            val = li + sat - li * sat;
        }

        // Convert saturation.
        sat = 2 * (val - li) / val;

        // Hue and alpha stay the same.
        return [hue, sat, val, hsla[3]];
    }

    public static HslaToRGBA(hsla: number[]): number[] {
        const hue: number = hsla[0] * 6; // We will split hue into 6 sectors.
        const sat: number = hsla[1];
        const li: number = hsla[2];

        let RGBA: number[] = [];

        if (sat === 0) {
            RGBA = [li, li, li, hsla[3]]; // Return early if grayscale.
        } else {
            // Calculate brightness.
            let val: number;
            if (li < 0.5) {
                val = (1 + sat) * li;
            } else {
                val = li + sat - li * sat;
            }

            // Define zest.
            const zest: number = 2 * li - val;

            // Implement projection (project onto green by default).
            const hzvToRGB = function (hue: number, zest: number, val: number): number {
                if (hue < 0) {
                    // Hue must wrap to allow projection onto red and blue.
                    hue += 6;
                } else if (hue >= 6) {
                    hue -= 6;
                }
                if (hue < 1) {
                    // Red to yellow (increasing green).
                    return zest + (val - zest) * hue;
                } else if (hue < 3) {
                    // Yellow to cyan (greatest green).
                    return val;
                } else if (hue < 4) {
                    // Cyan to blue (decreasing green).
                    return zest + (val - zest) * (4 - hue);
                } else {
                    // Blue to red (least green).
                    return zest;
                }
            };

            // Perform projections, offsetting hue as necessary.
            RGBA = [
                hzvToRGB(hue + 2, zest, val),
                hzvToRGB(hue, zest, val),
                hzvToRGB(hue - 2, zest, val),
                hsla[3]
            ];
        }

        return RGBA;
    }

    public static RgbaToHSBA(rgba: number[]): number[] {
        const red: number = rgba[0];
        const green: number = rgba[1];
        const blue: number = rgba[2];

        const val: number = Math.max(red, green, blue);
        const chroma: number = val - Math.min(red, green, blue);

        let hue: number = 0, sat: number = 0;
        if (chroma === 0) {
            // Return early if grayscale.
            hue = 0;
            sat = 0;
        } else {
            sat = chroma / val;
            if (red === val) {
                // Magenta to yellow.
                hue = (green - blue) / chroma;
            } else if (green === val) {
                // Yellow to cyan.
                hue = 2 + (blue - red) / chroma;
            } else if (blue === val) {
                // Cyan to magenta.
                hue = 4 + (red - green) / chroma;
            }
            if (hue < 0) {
                // Confine hue to the interval [0, 1).
                hue += 6;
            } else if (hue >= 6) {
                hue -= 6;
            }
        }

        return [hue / 6, sat, val, rgba[3]];
    }

    public static RgbaToHSLA(rgba: number[]): number[] {
        const red: number = rgba[0];
        const green: number = rgba[1];
        const blue: number = rgba[2];

        const val: number = Math.max(red, green, blue);
        const min: number = Math.min(red, green, blue);
        const li: number = val + min; // We will halve this later.
        const chroma: number = val - min;

        let hue: number = 0, sat: number = 0;

        if (chroma === 0) {
            // Return early if grayscale.
            hue = 0;
            sat = 0;
        } else {
            if (li < 1) {
                sat = chroma / li;
            } else {
                sat = chroma / (2 - li);
            }
            if (red === val) {
                // Magenta to yellow.
                hue = (green - blue) / chroma;
            } else if (green === val) {
                // Yellow to cyan.
                hue = 2 + (blue - red) / chroma;
            } else if (blue === val) {
                // Cyan to magenta.
                hue = 4 + (red - green) / chroma;
            }
            if (hue < 0) {
                // Confine hue to the interval [0, 1).
                hue += 6;
            } else if (hue >= 6) {
                hue -= 6;
            }
        }

        return [hue / 6, sat, li / 2, rgba[3]];
    }
}