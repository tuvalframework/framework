import { Graphics,  GraphicTypes, Pen, SystemColors } from "@tuval/graphics";
import { CGRectangle, CGColor, CoreGraphicTypes } from "@tuval/cg";
import { is, int, using, ArgumentNullException, byte, float, Convert } from '@tuval/core';

export class ControlPaint {
    public static LightLight(baseColor: CGColor): CGColor {
        return (new ControlPaint.HLSColor(baseColor)).lighter(1);
    }
    public static Dark(baseColor: CGColor, percOfDarkDark: float = 0.5): CGColor {
        return (new ControlPaint.HLSColor(baseColor)).darker(percOfDarkDark);
    }
    public static DarkDark(baseColor: CGColor): CGColor {
        return (new ControlPaint.HLSColor(baseColor)).darker(1);
    }
    public static Light(baseColor: CGColor, percOfLightLight: float = 0.5): CGColor {
        return (new ControlPaint.HLSColor(baseColor)).lighter(percOfLightLight);
    }

    public static DrawSizeGrip(graphics: Graphics, backColor: CGColor, bounds: CGRectangle): void;
    public static DrawSizeGrip(graphics: Graphics, backColor: CGColor, x: int, y: int, width: int, height: int): void;
    public static DrawSizeGrip(...args: any[]): void {
        if (args.length === 3 && is.typeof<Graphics>(args[0], GraphicTypes.Graphics) && is.typeof<CGColor>(args[1], CoreGraphicTypes.CGColor) && is.typeof<CGRectangle>(args[2], CoreGraphicTypes.CGRectangle)) {
            const graphics: Graphics = args[0];
            const backColor: CGColor = args[1];
            const bounds: CGRectangle = args[2];
            ControlPaint.DrawSizeGrip(graphics, backColor, bounds.X, bounds.Y, bounds.Width, bounds.Height);
        } else if (args.length === 6 && is.typeof<Graphics>(args[0], GraphicTypes.Graphics) && is.typeof<CGColor>(args[1], CoreGraphicTypes.CGColor) &&
            is.int(args[2]) && is.int(args[3]) && is.int(args[4]) && is.int(args[5])) {
            const graphics: Graphics = args[0];
            const backColor: CGColor = args[1];
            const x: int = args[2];
            const y: int = args[3];
            const width: int = args[4];
            const height: int = args[5];
            if (graphics == null) {
                throw new ArgumentNullException("graphics");
            }
            using(new Pen(ControlPaint.LightLight(backColor)), (pen: Pen) => {
                using(new Pen(ControlPaint.Dark(backColor)), (pen1: Pen) => {
                    const ınt32: int = Math.min(width, height);
                    const ınt321: int = x + width - 1;
                    const ınt322: int = y + height - 2;
                    for (let i = 0; i < ınt32 - 4; i += 4) {
                        graphics.DrawLine(pen1, ınt321 - (i + 1) - 2, ınt322, ınt321, ınt322 - (i + 1) - 2);
                        graphics.DrawLine(pen1, ınt321 - (i + 2) - 2, ınt322, ınt321, ınt322 - (i + 2) - 2);
                        graphics.DrawLine(pen, ınt321 - (i + 3) - 2, ınt322, ınt321, ınt322 - (i + 3) - 2);
                    }
                });
            });
        }
    }

    private static HLSColor = class HLSColor {
        private static readonly ShadowAdj: int = -333;
        private static readonly HilightAdj: int = 500;
        private static readonly WatermarkAdj: int = -50;
        private static readonly Range: int = 240;
        private static readonly HLSMax: int = 240;
        private static readonly RGBMax: int = 255;
        private static readonly Undefined: int = 160;
        private hue: int = 0;
        private saturation: int = 0;
        private luminosity: int = 0;
        private isSystemColors_Control: boolean = false;
        public get Luminosity(): int {
            return this.luminosity;
        }

        public constructor(color: CGColor) {
            this.isSystemColors_Control = false;/* color.toKnownColor().equ == SystemColors.Control.ToKnownColor(); */
            const r: int = color.R;
            const g: int = color.G;
            const b: int = color.B;
            const ınt32: int = Math.max(Math.max(r, g), b);
            const ınt321: int = Math.min(Math.min(r, g), b);
            const ınt322: int = ınt32 + ınt321;
            this.luminosity = (ınt322 * 240 + 255) / 510;
            const ınt323: int = ınt32 - ınt321;
            if (ınt323 === 0) {
                this.saturation = 0;
                this.hue = 160;
                return;
            }
            if (this.luminosity > 120) {
                this.saturation = (ınt323 * 240 + (510 - ınt322) / 2) / (510 - ınt322);
            }
            else {
                this.saturation = (ınt323 * 240 + ınt322 / 2) / ınt322;
            }
            const ınt324: int = ((ınt32 - r) * 40 + ınt323 / 2) / ınt323;
            const ınt325: int = ((ınt32 - g) * 40 + ınt323 / 2) / ınt323;
            const ınt326: int = ((ınt32 - b) * 40 + ınt323 / 2) / ınt323;
            if (r === ınt32) {
                this.hue = ınt326 - ınt325;
            }
            else if (g != ınt32) {
                this.hue = 160 + ınt325 - ınt324;
            }
            else {
                this.hue = 80 + ınt324 - ınt326;
            }
            if (this.hue < 0) {
                this.hue += 240;
            }
            if (this.hue > 240) {
                this.hue -= 240;
            }
        }

        private colorFromHLS(hue: int, luminosity: int, saturation: int): CGColor {
            let rGB: byte;
            let num: byte;
            let rGB1: byte;
            let ınt32: int;
            if (saturation !== 0) {
                ınt32 = (luminosity > 120 ? luminosity + saturation - (luminosity * saturation + 120) / 240 : (luminosity * (240 + saturation) + 120) / 240);
                const ınt321 = 2 * luminosity - ınt32;
                rGB = Convert.ToByte((this.hueToRGB(ınt321, ınt32, hue + 80) * 255 + 120) / 240);
                num = Convert.ToByte((this.hueToRGB(ınt321, ınt32, hue) * 255 + 120) / 240);
                rGB1 = Convert.ToByte((this.hueToRGB(ınt321, ınt32, hue - 80) * 255 + 120) / 240);
            }
            else {
                const num1: byte = Convert.ToByte(luminosity * 255 / 240);
                rGB1 = num1;
                num = num1;
                rGB = num1;
                if (hue !== 160) {
                }
            }
            return CGColor.FromRgba(Convert.ToInt32(rGB), Convert.ToInt32(num), Convert.ToInt32(rGB1));
        }

        public darker(percDarker: float): CGColor {
            if (!this.isSystemColors_Control) {
                let ınt32: int = 0;
                const ınt321: int = this.newLuma(-333, true);
                return this.colorFromHLS(this.hue, ınt321 - Convert.ToInt32((ınt321 - ınt32) * percDarker), this.saturation);
            }
            if (percDarker === 0) {
                return SystemColors.ControlDark;
            }
            if (percDarker === 1) {
                return SystemColors.ControlDarkDark;
            }
            const controlDark: CGColor = SystemColors.ControlDark;
            const controlDarkDark: CGColor = SystemColors.ControlDarkDark;
            const r: int = controlDark.R - controlDarkDark.R;
            const g: int = controlDark.G - controlDarkDark.G;
            const b: int = controlDark.B - controlDarkDark.B;
            return CGColor.FromRgba(Convert.ToInt32(controlDark.R - Convert.ToInt32(r * percDarker)), Convert.ToInt32(controlDark.G - Convert.ToByte(g * percDarker)), Convert.ToInt32(controlDark.B - Convert.ToByte(b * percDarker)));
        }

        public /* override */  equals(o: any): boolean {
            if (!(o instanceof ControlPaint.HLSColor)) {
                return false;
            }
            const hLSColor: HLSColor = o;
            if (this.hue !== hLSColor.hue || this.saturation !== hLSColor.saturation || this.luminosity !== hLSColor.luminosity) {
                return false;
            }
            return this.isSystemColors_Control == hLSColor.isSystemColors_Control;
        }

        public /* override */  getHashCode(): int {
            return this.hue << 6 | this.saturation << 2 | this.luminosity;
        }

        private hueToRGB(n1: int, n2: int, hue: int): int {
            if (hue < 0) {
                hue += 240;
            }
            if (hue > 240) {
                hue -= 240;
            }
            if (hue < 40) {
                return n1 + ((n2 - n1) * hue + 20) / 40;
            }
            if (hue < 120) {
                return n2;
            }
            if (hue >= 160) {
                return n1;
            }
            return n1 + ((n2 - n1) * (160 - hue) + 20) / 40;
        }

        public lighter(percLighter: float): CGColor {
            if (!this.isSystemColors_Control) {
                const ınt32: int = this.luminosity;
                const ınt321: int = this.newLuma(500, true);
                return this.colorFromHLS(this.hue, ınt32 + Convert.ToInt32((ınt321 - ınt32) * percLighter), this.saturation);
            }
            if (percLighter === 0) {
                return SystemColors.ControlLight;
            }
            if (percLighter === 1) {
                return SystemColors.ControlLightLight;
            }
            const controlLight: CGColor = SystemColors.ControlLight;
            const controlLightLight: CGColor = SystemColors.ControlLightLight;
            const r: int = controlLight.R - controlLightLight.R;
            const g: int = controlLight.G - controlLightLight.G;
            const b: int = controlLight.B - controlLightLight.B;
            return CGColor.FromRgba(Convert.ToInt32(controlLight.R - Convert.ToByte(r * percLighter)), Convert.ToInt32(controlLight.G - Convert.ToByte(g * percLighter)), Convert.ToInt32(controlLight.B - Convert.ToByte(b * percLighter)));
        }

        private newLuma(n: int, scale: boolean): int;
        private newLuma(luminosity: int, n: int, scale: boolean): int;
        private newLuma(...args: any[]): int {
            if (args.length === 2 && is.int(args[0]) && is.boolean(args[1])) {
                const n: int = args[0];
                const scale: boolean = args[1];
                return this.newLuma(this.luminosity, n, scale);
            } else if (args.length === 3 && is.int(args[0]) && is.int(args[1]) && is.boolean(args[2])) {
                const luminosity: int = args[0];
                const n: int = args[1];
                const scale: boolean = args[2];
                if (n === 0) {
                    return luminosity;
                }
                if (scale) {
                    if (n <= 0) {
                        return luminosity * (n + 1000) / 1000;
                    }
                    return Convert.ToInt32(((luminosity * (1000 - n)) + 241 * n) / 1000);
                }
                let ınt32: int = luminosity;
                ınt32 += Convert.ToInt32(n * 240 / 1000);
                if (ınt32 < 0) {
                    ınt32 = 0;
                }
                if (ınt32 > 240) {
                    ınt32 = 240;
                }
                return ınt32;
            }
            return undefined as any;
        }
    }

}