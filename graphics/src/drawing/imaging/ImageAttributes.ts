import { CoreGraphicTypes } from '@tuval/cg';
import { CGColor } from '@tuval/cg';
import { ColorMatrix } from "../ColorMatrix";
import { ColorMatrixFlag } from "./ColorMatrixFlag";
import { ColorAdjustType } from "./ColorAdjustType";
import { GraphicTypes } from "../../GDITypes";
import { ICloneable, IDisposable, float, ClassInfo, is, NotImplementedException } from "@tuval/core";
import { WrapMode } from "../drawing2D/WrapMode";

@ClassInfo({
    fullName: GraphicTypes.Imaging.ImageAttributes,
    instanceof: [
        GraphicTypes.Imaging.ImageAttributes
    ]
})
export class ImageAttributes implements ICloneable<ImageAttributes>, IDisposable {
    public colorMatrix: ColorMatrix = undefined as any;
    public colorMatrixFlags: ColorMatrixFlag = undefined as any;
    public colorAdjustType: ColorAdjustType = undefined as any;
    public gamma: float = 0;

    public isColorMatrixSet: boolean = false;
    public isGammaSet: boolean = false;

    /// <summary>
    /// Clears the color matrix.
    /// </summary>
    public clearColorMatrix(): void {
        this.colorMatrix = null as any;
        this.colorMatrixFlags = ColorMatrixFlag.Default;
        this.colorAdjustType = ColorAdjustType.Default;
        this.isColorMatrixSet = false;
    }

    /// <summary>
    /// Clears the gamma.
    /// </summary>
    /* public  clearGamma():void
    {
        this.clearGamma(ColorAdjustType.Default);
    } */

    /// <summary>
    /// Clears the gamma for the color adjust type.
    /// </summary>
    /// <param name="type">Type.</param>
    public clearGamma(type?: ColorAdjustType): void {
        this.isGammaSet = false;
    }

    /// <summary>
    /// Sets the color matrix with the ColorMatrixFlag.Default.
    /// </summary>
    /// <param name="newColorMatrix">New color matrix.</param>
    public setColorMatrix(newColorMatrix: ColorMatrix): void;
    public setColorMatrix(newColorMatrix: ColorMatrix, flags: ColorMatrixFlag): void;
    public setColorMatrix(newColorMatrix: ColorMatrix, mode: ColorMatrixFlag, type: ColorAdjustType): void;
    public setColorMatrix(...args: any[]): void {
        if (args.length === 1 && is.typeof<ColorMatrix>(args[0], GraphicTypes.ColorMatrix)) {
            const newColorMatrix: ColorMatrix = args[0];
            this.setColorMatrix(newColorMatrix, ColorMatrixFlag.Default);
        } else if (args.length === 2 && is.typeof<ColorMatrix>(args[0], GraphicTypes.ColorMatrix)) {
            const newColorMatrix: ColorMatrix = args[0];
            this.setColorMatrix(newColorMatrix, ColorMatrixFlag.Default, ColorAdjustType.Default);
        } else if (args.length === 3 && is.typeof<ColorMatrix>(args[0], GraphicTypes.ColorMatrix)) {
            const newColorMatrix: ColorMatrix = args[0];
            const mode: ColorMatrixFlag = args[1];
            const type: ColorAdjustType = args[2];
            this.colorMatrix = newColorMatrix;
            this.colorMatrixFlags = mode;
            this.colorAdjustType = type;
            this.isColorMatrixSet = true;
        }
    }



    /// <summary>
    /// Sets the gamma.
    /// </summary>
    /// <param name="gamma">Gamma.</param>
    public setGamma(gamma: float): void;
    public setGamma(gamma: float, type: ColorAdjustType): void;
    public setGamma(...args: any[]): void {
        if (args.length === 1) {
            const gamma: float = args[0];
            this.setGamma(gamma, ColorAdjustType.Default);
        } else if (args.length === 2) {
            const gamma: float = args[0];
            const type: ColorAdjustType = args[1];
            this.gamma = gamma;
            this.colorAdjustType = type;
            this.isGammaSet = true;
        }

    }

    public setWrapMode(mode: WrapMode): void;
    public setWrapMode(mode: WrapMode, color: CGColor): void;
    public setWrapMode(mode: WrapMode, color: CGColor, clamp: boolean): void;
    public setWrapMode(...args: any[]): void {
        if (args.length === 1) {
            const mode: WrapMode = args[0];
            this.setWrapMode(mode, CGColor.Empty, false);
        } else if (args.length === 2) {
            const mode: WrapMode = args[0];
            const color: CGColor = args[1];
            this.setWrapMode(mode, color, false);
        } else if (args.length === 3) {
            // FIXME
        }
    }

    public SetColorKey(lowColor: CGColor, highColor: CGColor): void;
    public SetColorKey(lowColor: CGColor, highColor: CGColor, type: ColorAdjustType): void;
    public SetColorKey(...args: any[]): void {
        if (args.length === 2 && is.typeof<CGColor>(args[0], CoreGraphicTypes.CGColor) && is.typeof<CGColor>(args[1], CoreGraphicTypes.CGColor)) {
            const lowColor: CGColor = args[0];
            const highColor: CGColor = args[1];
            this.SetColorKey(lowColor, highColor, ColorAdjustType.Default);
        } else if (args.length === 3) {
            throw new NotImplementedException('setColorKey')
        }

    }

    //#region ICloneable implementation
    public Clone(): ImageAttributes {
        const copy = new ImageAttributes();
        copy.colorMatrix = this.colorMatrix;
        copy.colorAdjustType = this.colorAdjustType;
        copy.colorMatrixFlags = this.colorMatrixFlags;

        copy.gamma = this.gamma;
        copy.isColorMatrixSet = this.isColorMatrixSet;
        copy.isGammaSet = this.isGammaSet;
        return copy;
    }
    //#endregion

    //#region IDisposable implementation
    public Dispose(): void {
    }
    //#endregion
}