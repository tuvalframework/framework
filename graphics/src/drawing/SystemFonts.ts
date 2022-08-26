import { Font } from "./Font";

export class SystemFonts {
    public static StaticConstructor() {
        SystemFonts.CaptionFont = new Font('Tahoma', 8);
        SystemFonts.DefaultFont = new Font('Tahoma', 8);
        SystemFonts.DialogFont = new Font('Tahoma', 8);
        SystemFonts.IconTitleFont = new Font('Tahoma', 8);
        SystemFonts.MenuFont = new Font('Tahoma', 8);
        SystemFonts.MessageBoxFont = new Font('Tahoma', 8);
        SystemFonts.SmallCaptionFont = new Font('Tahoma', 8);
        SystemFonts.StatusFont = new Font('Tahoma', 8);
    }

    public static GetFontByName(systemFontName: string): Font {
        if (systemFontName == "CaptionFont")
            return SystemFonts.CaptionFont;
        if (systemFontName == "DefaultFont")
            return SystemFonts.DefaultFont;
        if (systemFontName == "DialogFont")
            return SystemFonts.DialogFont;
        if (systemFontName == "IconTitleFont")
            return SystemFonts.IconTitleFont;
        if (systemFontName == "MenuFont")
            return SystemFonts.MenuFont;
        if (systemFontName == "MessageBoxFont")
            return SystemFonts.MessageBoxFont;
        if (systemFontName == "SmallCaptionFont")
            return SystemFonts.SmallCaptionFont;
        if (systemFontName == "StatusFont")
            return SystemFonts.StatusFont;
        return null as any;
    }

    public static CaptionFont: Font = null as any;
    public static DefaultFont: Font = null as any;
    public static DialogFont: Font = null as any;
    public static IconTitleFont: Font = null as any;
    public static MenuFont: Font = null as any;
    public static MessageBoxFont: Font = null as any;
    public static SmallCaptionFont: Font = null as any;
    public static StatusFont: Font = null as any;
}

SystemFonts.StaticConstructor();