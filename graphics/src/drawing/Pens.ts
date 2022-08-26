import { CGColor } from '@tuval/cg';
import { Pen } from "./Pen";
import { is } from "@tuval/core";
import { GraphicTypes } from "../GDITypes";

export class Pens {
    public static get Transparent(): Pen {return new Pen(CGColor.Transparent);}
    public static get AliceBlue(): Pen { return new Pen(CGColor.AliceBlue); }
    public static get AntiqueWhite(): Pen { return new Pen(CGColor.AntiqueWhite); }
    public static get Aqua(): Pen { return new Pen(CGColor.Aqua); }
    public static get Aquamarine(): Pen { return new Pen(CGColor.Aquamarine); }
    public static get Azure(): Pen { return new Pen(CGColor.Azure); }
    public static get Beige(): Pen { return new Pen(CGColor.Beige); }
    public static get Bisque(): Pen { return new Pen(CGColor.Bisque); }
    public static get Black(): Pen { return new Pen(CGColor.Black); }
    public static get BlanchedAlmond(): Pen { return new Pen(CGColor.BlanchedAlmond); }
    public static get Blue(): Pen { return new Pen(CGColor.Blue); }
    public static get BlueViolet(): Pen { return new Pen(CGColor.BlueViolet); }
    public static get Brown(): Pen { return new Pen(CGColor.Brown); }
    public static get BurlyWood(): Pen { return new Pen(CGColor.BurlyWood); }
    public static get CadetBlue(): Pen { return new Pen(CGColor.CadetBlue); }
    public static get Chartreuse(): Pen { return new Pen(CGColor.Chartreuse); }
    public static get Chocolate(): Pen { return new Pen(CGColor.Chocolate); }
    public static get Coral(): Pen { return new Pen(CGColor.Coral); }
    public static get CornflowerBlue(): Pen { return new Pen(CGColor.CornflowerBlue); }
    public static get Cornsilk(): Pen { return new Pen(CGColor.Cornsilk); }
    public static get Crimson(): Pen { return new Pen(CGColor.Crimson); }
    public static get Cyan(): Pen { return new Pen(CGColor.Cyan); }
    public static get DarkBlue(): Pen { return new Pen(CGColor.DarkBlue); }
    public static get DarkCyan(): Pen { return new Pen(CGColor.DarkCyan); }
    public static get DarkGoldenrod(): Pen { return new Pen(CGColor.DarkGoldenrod); }
    public static get DarkGray(): Pen { return new Pen(CGColor.DarkGray); }
    public static get DarkGreen(): Pen { return new Pen(CGColor.DarkGreen); }
    public static get DarkKhaki(): Pen { return new Pen(CGColor.DarkKhaki); }
    public static get DarkMagenta(): Pen { return new Pen(CGColor.DarkMagenta); }
    public static get DarkOliveGreen(): Pen { return new Pen(CGColor.DarkOliveGreen); }
    public static get DarkOrange(): Pen { return new Pen(CGColor.DarkOrange); }
    public static get DarkOrchid(): Pen { return new Pen(CGColor.DarkOrchid); }
    public static get DarkRed(): Pen { return new Pen(CGColor.DarkRed); }
    public static get DarkSalmon(): Pen { return new Pen(CGColor.DarkSalmon); }
    public static get DarkSeaGreen(): Pen { return new Pen(CGColor.DarkSeaGreen); }
    public static get DarkSlateBlue(): Pen { return new Pen(CGColor.DarkSlateBlue); }
    public static get DarkSlateGray(): Pen { return new Pen(CGColor.DarkSlateGray); }
    public static get DarkTurquoise(): Pen { return new Pen(CGColor.DarkTurquoise); }
    public static get DarkViolet(): Pen { return new Pen(CGColor.DarkViolet); }
    public static get DeepPink(): Pen { return new Pen(CGColor.DeepPink); }
    public static get DeepSkyBlue(): Pen { return new Pen(CGColor.DeepSkyBlue); }
    public static get DimGray(): Pen { return new Pen(CGColor.DimGray); }
    public static get DodgerBlue(): Pen { return new Pen(CGColor.DodgerBlue); }
    public static get Firebrick(): Pen { return new Pen(CGColor.Firebrick); }
    public static get FloralWhite(): Pen { return new Pen(CGColor.FloralWhite); }
    public static get ForestGreen(): Pen { return new Pen(CGColor.ForestGreen); }
    public static get Fuchsia(): Pen { return new Pen(CGColor.Fuchsia); }
    public static get Gainsboro(): Pen { return new Pen(CGColor.Gainsboro); }
    public static get GhostWhite(): Pen { return new Pen(CGColor.GhostWhite); }
    public static get Gold(): Pen { return new Pen(CGColor.Gold); }
    public static get Goldenrod(): Pen { return new Pen(CGColor.Goldenrod); }
    public static get Gray(): Pen { return new Pen(CGColor.Gray); }
    public static get Green(): Pen { return new Pen(CGColor.Green); }
    public static get GreenYellow(): Pen { return new Pen(CGColor.GreenYellow); }
    public static get Honeydew(): Pen { return new Pen(CGColor.Honeydew); }
    public static get HotPink(): Pen { return new Pen(CGColor.HotPink); }
    public static get IndianRed(): Pen { return new Pen(CGColor.IndianRed); }
    public static get Indigo(): Pen { return new Pen(CGColor.Indigo); }
    public static get Ivory(): Pen { return new Pen(CGColor.Ivory); }
    public static get Khaki(): Pen { return new Pen(CGColor.Khaki); }
    public static get Lavender(): Pen { return new Pen(CGColor.Lavender); }
    public static get LavenderBlush(): Pen { return new Pen(CGColor.LavenderBlush); }
    public static get LawnGreen(): Pen { return new Pen(CGColor.LawnGreen); }
    public static get LemonChiffon(): Pen { return new Pen(CGColor.LemonChiffon); }
    public static get LightBlue(): Pen { return new Pen(CGColor.LightBlue); }
    public static get LightCoral(): Pen { return new Pen(CGColor.LightCoral); }
    public static get LightCyan(): Pen { return new Pen(CGColor.LightCyan); }
    public static get LightGoldenrodYellow(): Pen { return new Pen(CGColor.LightGoldenrodYellow); }
    public static get LightGreen(): Pen { return new Pen(CGColor.LightGreen); }
    public static get LightGray(): Pen { return new Pen(CGColor.LightGray); }
    public static get LightPink(): Pen { return new Pen(CGColor.LightPink); }
    public static get LightSalmon(): Pen { return new Pen(CGColor.LightSalmon); }
    public static get LightSeaGreen(): Pen { return new Pen(CGColor.LightSeaGreen); }
    public static get LightSkyBlue(): Pen { return new Pen(CGColor.LightSkyBlue); }
    public static get LightSlateGray(): Pen { return new Pen(CGColor.LightSlateGray); }
    public static get LightSteelBlue(): Pen { return new Pen(CGColor.LightSteelBlue); }
    public static get LightYellow(): Pen { return new Pen(CGColor.LightYellow); }
    public static get Lime(): Pen { return new Pen(CGColor.Lime); }
    public static get LimeGreen(): Pen { return new Pen(CGColor.LimeGreen); }
    public static get Linen(): Pen { return new Pen(CGColor.Linen); }
    public static get Magenta(): Pen { return new Pen(CGColor.Magenta); }
    public static get Maroon(): Pen { return new Pen(CGColor.Maroon); }
    public static get MediumAquamarine(): Pen { return new Pen(CGColor.MediumAquamarine); }
    public static get MediumBlue(): Pen { return new Pen(CGColor.MediumBlue); }
    public static get MediumOrchid(): Pen { return new Pen(CGColor.MediumOrchid); }
    public static get MediumPurple(): Pen { return new Pen(CGColor.MediumPurple); }
    public static get MediumSeaGreen(): Pen { return new Pen(CGColor.MediumSeaGreen); }
    public static get MediumSlateBlue(): Pen { return new Pen(CGColor.MediumSlateBlue); }
    public static get MediumSpringGreen(): Pen { return new Pen(CGColor.MediumSpringGreen); }
    public static get MediumTurquoise(): Pen { return new Pen(CGColor.MediumTurquoise); }
    public static get MediumVioletRed(): Pen { return new Pen(CGColor.MediumVioletRed); }
    public static get MidnightBlue(): Pen { return new Pen(CGColor.MidnightBlue); }
    public static get MintCream(): Pen { return new Pen(CGColor.MintCream); }
    public static get MistyRose(): Pen { return new Pen(CGColor.MistyRose); }
    public static get Moccasin(): Pen { return new Pen(CGColor.Moccasin); }
    public static get NavajoWhite(): Pen { return new Pen(CGColor.NavajoWhite); }
    public static get Navy(): Pen { return new Pen(CGColor.Navy); }
    public static get OldLace(): Pen { return new Pen(CGColor.OldLace); }
    public static get Olive(): Pen { return new Pen(CGColor.Olive); }
    public static get OliveDrab(): Pen { return new Pen(CGColor.OliveDrab); }
    public static get Orange(): Pen { return new Pen(CGColor.Orange); }
    public static get OrangeRed(): Pen { return new Pen(CGColor.OrangeRed); }
    public static get Orchid(): Pen { return new Pen(CGColor.Orchid); }
    public static get PaleGoldenrod(): Pen { return new Pen(CGColor.PaleGoldenrod); }
    public static get PaleGreen(): Pen { return new Pen(CGColor.PaleGreen); }
    public static get PaleTurquoise(): Pen { return new Pen(CGColor.PaleTurquoise); }
    public static get PaleVioletRed(): Pen { return new Pen(CGColor.PaleVioletRed); }
    public static get PapayaWhip(): Pen { return new Pen(CGColor.PapayaWhip); }
    public static get PeachPuff(): Pen { return new Pen(CGColor.PeachPuff); }
    public static get Peru(): Pen { return new Pen(CGColor.Peru); }
    public static get Pink(): Pen { return new Pen(CGColor.Pink); }
    public static get Plum(): Pen { return new Pen(CGColor.Plum); }
    public static get PowderBlue(): Pen { return new Pen(CGColor.PowderBlue); }
    public static get Purple(): Pen { return new Pen(CGColor.Purple); }
    public static get Red(): Pen { return new Pen(CGColor.Red); }
    public static get RosyBrown(): Pen { return new Pen(CGColor.RosyBrown); }
    public static get RoyalBlue(): Pen { return new Pen(CGColor.RoyalBlue); }
    public static get SaddleBrown(): Pen { return new Pen(CGColor.SaddleBrown); }
    public static get Salmon(): Pen { return new Pen(CGColor.Salmon); }
    public static get SandyBrown(): Pen { return new Pen(CGColor.SandyBrown); }
    public static get SeaGreen(): Pen { return new Pen(CGColor.SeaGreen); }
    public static get SeaShell(): Pen { return new Pen(CGColor.SeaShell); }
    public static get Sienna(): Pen { return new Pen(CGColor.Sienna); }
    public static get Silver(): Pen { return new Pen(CGColor.Silver); }
    public static get SkyBlue(): Pen { return new Pen(CGColor.SkyBlue); }
    public static get SlateBlue(): Pen { return new Pen(CGColor.SlateBlue); }
    public static get SlateGray(): Pen { return new Pen(CGColor.SlateGray); }
    public static get Snow(): Pen { return new Pen(CGColor.Snow); }
    public static get SpringGreen(): Pen { return new Pen(CGColor.SpringGreen); }
    public static get SteelBlue(): Pen { return new Pen(CGColor.SteelBlue); }
    public static get Tan(): Pen { return new Pen(CGColor.Tan); }
    public static get Teal(): Pen { return new Pen(CGColor.Teal); }
    public static get Thistle(): Pen { return new Pen(CGColor.Thistle); }
    public static get Tomato(): Pen { return new Pen(CGColor.Tomato); }
    public static get Turquoise(): Pen { return new Pen(CGColor.Turquoise); }
    public static get Violet(): Pen { return new Pen(CGColor.Violet); }
    public static get Wheat(): Pen { return new Pen(CGColor.Wheat); }
    public static get White(): Pen { return new Pen(CGColor.White); }
    public static get WhiteSmoke(): Pen { return new Pen(CGColor.WhiteSmoke); }
    public static get Yellow(): Pen { return new Pen(CGColor.Yellow); }
    public static get YellowGreen(): Pen { return new Pen(CGColor.YellowGreen); }
}

for (let p in Pens) {
    const pen: Pen = Pens[p];
    if (is.typeof(pen, GraphicTypes.Pen)) {
        for (let i = 2; i < 10; i++) {
            Pens[p.toString() + i.toString()] = new Pen(pen.Color, i);
            const penName = p.toString() + i.toString() + 'x5';
            const newPen = Pens[p.toString() + i.toString()].Clone();
            newPen.Shadow.color = CGColor.Black;
            newPen.Shadow.blur = newPen.Width * 5;
            Pens[penName] = newPen;
        }
    }
}
