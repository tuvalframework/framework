import { Brush } from "./Brush";
import { SolidBrush } from "./SolidBrush";
import { SystemColors } from "./SystemColors";

    export class SystemBrushes {
        public static ActiveBorder: Brush = new SolidBrush(SystemColors.ActiveBorder);
        public static ActiveCaption: Brush = new SolidBrush(SystemColors.ActiveCaption);
        public static ActiveCaptionText: Brush = new SolidBrush(SystemColors.ActiveCaptionText);
        public static AppWorkspace: Brush = new SolidBrush(SystemColors.AppWorkspace);

        public static ButtonFace: Brush = new SolidBrush(SystemColors.ButtonFace);
        public static ButtonHighlight: Brush = new SolidBrush(SystemColors.ButtonHighlight);
        public static ButtonShadow: Brush = new SolidBrush(SystemColors.ButtonShadow);

        public static Control: Brush = new SolidBrush(SystemColors.Control);
        public static ControlLightLight: Brush = new SolidBrush(SystemColors.ControlLightLight);
        public static ControlLight: Brush = new SolidBrush(SystemColors.ControlLight);
        public static ControlDark: Brush = new SolidBrush(SystemColors.ControlDark);
        public static ControlDarkDark: Brush = new SolidBrush(SystemColors.ControlDarkDark);
        public static ControlText: Brush = new SolidBrush(SystemColors.ControlText);

        public static Desktop: Brush = new SolidBrush(SystemColors.Desktop);

        public static GradientActiveCaption: Brush = new SolidBrush(SystemColors.GradientActiveCaption);
        public static GradientInactiveCaption: Brush = new SolidBrush(SystemColors.GradientInactiveCaption);
        public static GrayText: Brush = new SolidBrush(SystemColors.GrayText);

        public static Highlight: Brush = new SolidBrush(SystemColors.Highlight);
        public static HighlightText: Brush = new SolidBrush(SystemColors.HighlightText);
        public static HotTrack: Brush = new SolidBrush(SystemColors.HotTrack);

        public static InactiveCaption: Brush = new SolidBrush(SystemColors.InactiveCaption);
        public static InactiveBorder: Brush = new SolidBrush(SystemColors.InactiveBorder);
        public static InactiveCaptionText: Brush = new SolidBrush(SystemColors.InactiveCaptionText);
        public static Info: Brush = new SolidBrush(SystemColors.Info);
        public static InfoText: Brush = new SolidBrush(SystemColors.InfoText);

        public static Menu: Brush = new SolidBrush(SystemColors.Menu);
        public static MenuBar: Brush = new SolidBrush(SystemColors.MenuBar);
        public static MenuHighlight: Brush = new SolidBrush(SystemColors.MenuHighlight);
        public static MenuText: Brush = new SolidBrush(SystemColors.MenuText);

        public static ScrollBar: Brush = new SolidBrush(SystemColors.ScrollBar);

        public static Window: Brush = new SolidBrush(SystemColors.Window);
        public static WindowFrame: Brush = new SolidBrush(SystemColors.WindowFrame);
        public static WindowText: Brush = new SolidBrush(SystemColors.WindowText);

    }