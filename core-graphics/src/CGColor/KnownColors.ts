import { KnownColor } from "./KnownColor";
import { CGColor } from "./CGColor";
import { SimpleDictionary } from "@tuval/core";

    export class KnownColors {
        public static RgbaValues: number[][] = [
            [0x00, 0x00, 0x00,0x00],	/* 000 - Empty */
            [ 0xD4, 0xD0, 0xC8,0xFF],	/* 001 - ActiveBorder */
            [ 0x00, 0x54, 0xE3,0xFF],	/* 002 - ActiveCaption */
            [ 0xFF, 0xFF, 0xFF,0xFF],	/* 003 - ActiveCaptionText */
            [ 0x80, 0x80, 0x80,0xFF],	/* 004 - AppWorkspace */
            [ 0xEC, 0xE9, 0xD8,0xFF],	/* 005 - Control */
            [ 0xAC, 0xA8, 0x99,0xFF],	/* 006 - ControlDark */
            [ 0x71, 0x6F, 0x64,0xFF],	/* 007 - ControlDarkDark */
            [ 0xF1, 0xEF, 0xE2,0xFF],	/* 008 - ControlLight */
            [ 0xFF, 0xFF, 0xFF,0xFF],	/* 009 - ControlLightLight */
            [ 0x00, 0x00, 0x00,0xFF],	/* 010 - ControlText */
            [ 0x00, 0x4E, 0x98,0xFF],	/* 011 - Desktop */
            [ 0xAC, 0xA8, 0x99,0xFF],	/* 012 - GrayText */
            [ 0x31, 0x6A, 0xC5,0xFF],	/* 013 - Highlight */
            [ 0xFF, 0xFF, 0xFF,0xFF],	/* 014 - HighlightText */
            [ 0x00, 0x00, 0x80,0xFF],	/* 015 - HotTrack */
            [ 0xD4, 0xD0, 0xC8,0xFF],	/* 016 - InactiveBorder */
            [ 0x7A, 0x96, 0xDF,0xFF],	/* 017 - InactiveCaption */
            [ 0xD8, 0xE4, 0xF8,0xFF],	/* 018 - InactiveCaptionText */
            [ 0xFF, 0xFF, 0xE1,0xFF],	/* 019 - Info */
            [ 0x00, 0x00, 0x00,0xFF],	/* 020 - InfoText */
            [ 0xFF, 0xFF, 0xFF,0xFF],	/* 021 - Menu */
            [ 0x00, 0x00, 0x00,0xFF],	/* 022 - MenuText */
            [ 0xD4, 0xD0, 0xC8,0xFF],	/* 023 - ScrollBar */
            [ 0xFF, 0xFF, 0xFF,0xFF],	/* 024 - Window */
            [ 0x00, 0x00, 0x00,0xFF],	/* 025 - WindowFrame */
            [ 0x00, 0x00, 0x00,0xFF],	/* 026 - WindowText */
            [0x00, 0xFF, 0xFF, 0xFF],	/* 027 - Transparent */
            [ 0xF0, 0xF8, 0xFF,0xFF],	/* 028 - AliceBlue */
            [ 0xFA, 0xEB, 0xD7,0xFF],	/* 029 - AntiqueWhite */
            [ 0x00, 0xFF, 0xFF,0xFF],	/* 030 - Aqua */
            [ 0x7F, 0xFF, 0xD4,0xFF],	/* 031 - Aquamarine */
            [ 0xF0, 0xFF, 0xFF,0xFF],	/* 032 - Azure */
            [ 0xF5, 0xF5, 0xDC,0xFF],	/* 033 - Beige */
            [ 0xFF, 0xE4, 0xC4,0xFF],	/* 034 - Bisque */
            [ 0x00, 0x00, 0x00,0xFF],	/* 035 - Black */
            [ 0xFF, 0xEB, 0xCD,0xFF],	/* 036 - BlanchedAlmond */
            [ 0x00, 0x00, 0xFF,0xFF],	/* 037 - Blue */
            [ 0x8A, 0x2B, 0xE2,0xFF],	/* 038 - BlueViolet */
            [ 0xA5, 0x2A, 0x2A,0xFF],	/* 039 - Brown */
            [ 0xDE, 0xB8, 0x87,0xFF],	/* 040 - BurlyWood */
            [ 0x5F, 0x9E, 0xA0,0xFF],	/* 041 - CadetBlue */
            [ 0x7F, 0xFF, 0x00,0xFF],	/* 042 - Chartreuse */
            [ 0xD2, 0x69, 0x1E,0xFF],	/* 043 - Chocolate */
            [ 0xFF, 0x7F, 0x50,0xFF],	/* 044 - Coral */
            [ 0x64, 0x95, 0xED,0xFF],	/* 045 - CornflowerBlue */
            [ 0xFF, 0xF8, 0xDC,0xFF],	/* 046 - Cornsilk */
            [ 0xDC, 0x14, 0x3C,0xFF],	/* 047 - Crimson */
            [ 0x00, 0xFF, 0xFF,0xFF],	/* 048 - Cyan */
            [ 0x00, 0x00, 0x8B,0xFF],	/* 049 - DarkBlue */
            [ 0x00, 0x8B, 0x8B,0xFF],	/* 050 - DarkCyan */
            [ 0xB8, 0x86, 0x0B,0xFF],	/* 051 - DarkGoldenrod */
            [ 0xA9, 0xA9, 0xA9,0xFF],	/* 052 - DarkGray */
            [ 0x00, 0x64, 0x00,0xFF],	/* 053 - DarkGreen */
            [ 0xBD, 0xB7, 0x6B,0xFF],	/* 054 - DarkKhaki */
            [ 0x8B, 0x00, 0x8B,0xFF],	/* 055 - DarkMagenta */
            [ 0x55, 0x6B, 0x2F,0xFF],	/* 056 - DarkOliveGreen */
            [ 0xFF, 0x8C, 0x00,0xFF],	/* 057 - DarkOrange */
            [ 0x99, 0x32, 0xCC,0xFF],	/* 058 - DarkOrchid */
            [ 0x8B, 0x00, 0x00,0xFF],	/* 059 - DarkRed */
            [ 0xE9, 0x96, 0x7A,0xFF],	/* 060 - DarkSalmon */
            [ 0x8F, 0xBC, 0x8B,0xFF],	/* 061 - DarkSeaGreen */
            [ 0x48, 0x3D, 0x8B,0xFF],	/* 062 - DarkSlateBlue */
            [ 0x2F, 0x4F, 0x4F,0xFF],	/* 063 - DarkSlateGray */
            [ 0x00, 0xCE, 0xD1,0xFF],	/* 064 - DarkTurquoise */
            [ 0x94, 0x00, 0xD3,0xFF],	/* 065 - DarkViolet */
            [ 0xFF, 0x14, 0x93,0xFF],	/* 066 - DeepPink */
            [ 0x00, 0xBF, 0xFF,0xFF],	/* 067 - DeepSkyBlue */
            [ 0x69, 0x69, 0x69,0xFF],	/* 068 - DimGray */
            [ 0x1E, 0x90, 0xFF,0xFF],	/* 069 - DodgerBlue */
            [ 0xB2, 0x22, 0x22,0xFF],	/* 070 - Firebrick */
            [ 0xFF, 0xFA, 0xF0,0xFF],	/* 071 - FloralWhite */
            [ 0x22, 0x8B, 0x22,0xFF],	/* 072 - ForestGreen */
            [ 0xFF, 0x00, 0xFF,0xFF],	/* 073 - Fuchsia */
            [ 0xDC, 0xDC, 0xDC,0xFF],	/* 074 - Gainsboro */
            [ 0xF8, 0xF8, 0xFF,0xFF],	/* 075 - GhostWhite */
            [ 0xFF, 0xD7, 0x00,0xFF],	/* 076 - Gold */
            [ 0xDA, 0xA5, 0x20,0xFF],	/* 077 - Goldenrod */
            [ 0x80, 0x80, 0x80,0xFF],	/* 078 - Gray */
            [ 0x00, 0x80, 0x00,0xFF],	/* 079 - Green */
            [ 0xAD, 0xFF, 0x2F,0xFF],	/* 080 - GreenYellow */
            [ 0xF0, 0xFF, 0xF0,0xFF],	/* 081 - Honeydew */
            [ 0xFF, 0x69, 0xB4,0xFF],	/* 082 - HotPink */
            [ 0xCD, 0x5C, 0x5C,0xFF],	/* 083 - IndianRed */
            [ 0x4B, 0x00, 0x82,0xFF],	/* 084 - Indigo */
            [ 0xFF, 0xFF, 0xF0,0xFF],	/* 085 - Ivory */
            [ 0xF0, 0xE6, 0x8C,0xFF],	/* 086 - Khaki */
            [ 0xE6, 0xE6, 0xFA,0xFF],	/* 087 - Lavender */
            [ 0xFF, 0xF0, 0xF5,0xFF],	/* 088 - LavenderBlush */
            [ 0x7C, 0xFC, 0x00,0xFF],	/* 089 - LawnGreen */
            [ 0xFF, 0xFA, 0xCD,0xFF],	/* 090 - LemonChiffon */
            [ 0xAD, 0xD8, 0xE6,0xFF],	/* 091 - LightBlue */
            [ 0xF0, 0x80, 0x80,0xFF],	/* 092 - LightCoral */
            [ 0xE0, 0xFF, 0xFF,0xFF],	/* 093 - LightCyan */
            [ 0xFA, 0xFA, 0xD2,0xFF],	/* 094 - LightGoldenrodYellow */
            [ 0xD3, 0xD3, 0xD3,0xFF],	/* 095 - LightGray */
            [ 0x90, 0xEE, 0x90,0xFF],	/* 096 - LightGreen */
            [ 0xFF, 0xB6, 0xC1,0xFF],	/* 097 - LightPink */
            [ 0xFF, 0xA0, 0x7A,0xFF],	/* 098 - LightSalmon */
            [ 0x20, 0xB2, 0xAA,0xFF],	/* 099 - LightSeaGreen */
            [ 0x87, 0xCE, 0xFA,0xFF],	/* 100 - LightSkyBlue */
            [ 0x77, 0x88, 0x99,0xFF],	/* 101 - LightSlateGray */
            [ 0xB0, 0xC4, 0xDE,0xFF],	/* 102 - LightSteelBlue */
            [ 0xFF, 0xFF, 0xE0,0xFF],	/* 103 - LightYellow */
            [ 0x00, 0xFF, 0x00,0xFF],	/* 104 - Lime */
            [ 0x32, 0xCD, 0x32,0xFF],	/* 105 - LimeGreen */
            [ 0xFA, 0xF0, 0xE6,0xFF],	/* 106 - Linen */
            [ 0xFF, 0x00, 0xFF,0xFF],	/* 107 - Magenta */
            [ 0x80, 0x00, 0x00,0xFF],	/* 108 - Maroon */
            [ 0x66, 0xCD, 0xAA,0xFF],	/* 109 - MediumAquamarine */
            [ 0x00, 0x00, 0xCD,0xFF],	/* 110 - MediumBlue */
            [ 0xBA, 0x55, 0xD3,0xFF],	/* 111 - MediumOrchid */
            [ 0x93, 0x70, 0xDB,0xFF],	/* 112 - MediumPurple */
            [ 0x3C, 0xB3, 0x71,0xFF],	/* 113 - MediumSeaGreen */
            [ 0x7B, 0x68, 0xEE,0xFF],	/* 114 - MediumSlateBlue */
            [ 0x00, 0xFA, 0x9A,0xFF],	/* 115 - MediumSpringGreen */
            [ 0x48, 0xD1, 0xCC,0xFF],	/* 116 - MediumTurquoise */
            [ 0xC7, 0x15, 0x85,0xFF],	/* 117 - MediumVioletRed */
            [ 0x19, 0x19, 0x70,0xFF],	/* 118 - MidnightBlue */
            [ 0xF5, 0xFF,0xFA,0xFF],	/* 119 - MintCream */
            [ 0xFF, 0xE4, 0xE1,0xFF],	/* 120 - MistyRose */
            [ 0xFF, 0xE4, 0xB5,0xFF],	/* 121 - Moccasin */
            [ 0xFF, 0xDE, 0xAD,0xFF],	/* 122 - NavajoWhite */
            [ 0x00, 0x00, 0x80,0xFF],	/* 123 - Navy */
            [ 0xFD, 0xF5, 0xE6,0xFF],	/* 124 - OldLace */
            [ 0x80, 0x80, 0x00,0xFF],	/* 125 - Olive */
            [ 0x6B, 0x8E, 0x23,0xFF],	/* 126 - OliveDrab */
            [ 0xFF, 0xA5, 0x00,0xFF],	/* 127 - Orange */
            [ 0xFF, 0x45, 0x00,0xFF],	/* 128 - OrangeRed */
            [ 0xDA, 0x70, 0xD6,0xFF],	/* 129 - Orchid */
            [ 0xEE, 0xE8, 0xAA,0xFF],	/* 130 - PaleGoldenrod */
            [ 0x98, 0xFB, 0x98,0xFF],	/* 131 - PaleGreen */
            [ 0xAF, 0xEE, 0xEE,0xFF],	/* 132 - PaleTurquoise */
            [ 0xDB, 0x70, 0x93,0xFF],	/* 133 - PaleVioletRed */
            [ 0xFF, 0xEF, 0xD5,0xFF],	/* 134 - PapayaWhip */
            [ 0xFF, 0xDA, 0xB9,0xFF],	/* 135 - PeachPuff */
            [ 0xCD, 0x85, 0x3F,0xFF],	/* 136 - Peru */
            [ 0xFF, 0xC0, 0xCB,0xFF],	/* 137 - Pink */
            [ 0xDD, 0xA0, 0xDD,0xFF],	/* 138 - Plum */
            [ 0xB0, 0xE0, 0xE6,0xFF],	/* 139 - PowderBlue */
            [ 0x80, 0x00, 0x80,0xFF],	/* 140 - Purple */
            [ 0xFF, 0x00, 0x00,0xFF],	/* 141 - Red */
            [ 0xBC, 0x8F, 0x8F,0xFF],	/* 142 - RosyBrown */
            [ 0x41, 0x69, 0xE1,0xFF],	/* 143 - RoyalBlue */
            [ 0x8B, 0x45, 0x13,0xFF],	/* 144 - SaddleBrown */
            [ 0xFA, 0x80, 0x72,0xFF],	/* 145 - Salmon */
            [ 0xF4, 0xA4, 0x60,0xFF],	/* 146 - SandyBrown */
            [ 0x2E, 0x8B, 0x57,0xFF],	/* 147 - SeaGreen */
            [ 0xFF, 0xF5, 0xEE,0xFF],	/* 148 - SeaShell */
            [ 0xA0, 0x52, 0x2D,0xFF],	/* 149 - Sienna */
            [ 0xC0, 0xC0, 0xC0,0xFF],	/* 150 - Silver */
            [ 0x87, 0xCE, 0xEB,0xFF],	/* 151 - SkyBlue */
            [ 0x6A, 0x5A, 0xCD,0xFF],	/* 152 - SlateBlue */
            [ 0x70, 0x80, 0x90,0xFF],	/* 153 - SlateGray */
            [ 0xFF, 0xFA, 0xFA,0xFF],	/* 154 - Snow */
            [ 0x00, 0xFF, 0x7F,0xFF],	/* 155 - SpringGreen */
            [ 0x46, 0x82, 0xB4,0xFF],	/* 156 - SteelBlue */
            [ 0xD2, 0xB4, 0x8C,0xFF],	/* 157 - Tan */
            [ 0x00, 0x80, 0x80,0xFF],	/* 158 - Teal */
            [ 0xD8, 0xBF, 0xD8,0xFF],	/* 159 - Thistle */
            [ 0xFF, 0x63, 0x47,0xFF],	/* 160 - Tomato */
            [ 0x40, 0xE0, 0xD0,0xFF],	/* 161 - Turquoise */
            [ 0xEE, 0x82, 0xEE,0xFF],	/* 162 - Violet */
            [ 0xF5, 0xDE, 0xB3,0xFF],	/* 163 - Wheat */
            [ 0xFF, 0xFF, 0xFF,0xFF],	/* 164 - White */
            [ 0xF5, 0xF5, 0xF5,0xFF],	/* 165 - WhiteSmoke */
            [ 0xFF, 0xFF, 0x00,0xFF],	/* 166 - Yellow */
            [ 0x9A, 0xCD, 0x32,0xFF],	/* 167 - YellowGreen */
            [ 0xEC, 0xE9, 0xD8,0xFF],	/* 168 - ButtonFace */
            [ 0xFF, 0xFF, 0xFF,0xFF],	/* 169 - ButtonHighlight */
            [ 0xAC, 0xA8, 0x99,0xFF],	/* 170 - ButtonShadow */
            [ 0x3D, 0x95, 0xFF,0xFF],	/* 171 - GradientActiveCaption */
            [ 0x9D, 0xB9, 0xEB,0xFF],	/* 172 - GradientInactiveCaption */
            [ 0xEC, 0xE9, 0xD8,0xFF],	/* 173 - MenuBar */
            [ 0x31, 0x6A, 0xC5,0xFF],	/* 174 - MenuHighlight */
        ];

        public static Names: string[] = [
            '',
            'ActiveBorder',
            'ActiveCaption',
            'ActiveCaptionText',
            'AppWorkspace',
            'Control',
            'ControlDark',
            'ControlDarkDark',
            'ControlLight',
            'ControlLightLight',
            'ControlText',
            'Desktop',
            'GrayText',
            'Highlight',
            'HighlightText',
            'HotTrack',
            'InactiveBorder',
            'InactiveCaption',
            'InactiveCaptionText',
            'Info',
            'InfoText',
            'Menu',
            'MenuText',
            'ScrollBar',
            'Window',
            'WindowFrame',
            'WindowText',
            'Transparent',
            'AliceBlue',
            'AntiqueWhite',
            'Aqua',
            'Aquamarine',
            'Azure',
            'Beige',
            'Bisque',
            'Black',
            'BlanchedAlmond',
            'Blue',
            'BlueViolet',
            'Brown',
            'BurlyWood',
            'CadetBlue',
            'Chartreuse',
            'Chocolate',
            'Coral',
            'CornflowerBlue',
            'Cornsilk',
            'Crimson',
            'Cyan',
            'DarkBlue',
            'DarkCyan',
            'DarkGoldenrod',
            'DarkGray',
            'DarkGreen',
            'DarkKhaki',
            'DarkMagenta',
            'DarkOliveGreen',
            'DarkOrange',
            'DarkOrchid',
            'DarkRed',
            'DarkSalmon',
            'DarkSeaGreen',
            'DarkSlateBlue',
            'DarkSlateGray',
            'DarkTurquoise',
            'DarkViolet',
            'DeepPink',
            'DeepSkyBlue',
            'DimGray',
            'DodgerBlue',
            'Firebrick',
            'FloralWhite',
            'ForestGreen',
            'Fuchsia',
            'Gainsboro',
            'GhostWhite',
            'Gold',
            'Goldenrod',
            'Gray',
            'Green',
            'GreenYellow',
            'Honeydew',
            'HotPink',
            'IndianRed',
            'Indigo',
            'Ivory',
            'Khaki',
            'Lavender',
            'LavenderBlush',
            'LawnGreen',
            'LemonChiffon',
            'LightBlue',
            'LightCoral',
            'LightCyan',
            'LightGoldenrodYellow',
            'LightGray',
            'LightGreen',
            'LightPink',
            'LightSalmon',
            'LightSeaGreen',
            'LightSkyBlue',
            'LightSlateGray',
            'LightSteelBlue',
            'LightYellow',
            'Lime',
            'LimeGreen',
            'Linen',
            'Magenta',
            'Maroon',
            'MediumAquamarine',
            'MediumBlue',
            'MediumOrchid',
            'MediumPurple',
            'MediumSeaGreen',
            'MediumSlateBlue',
            'MediumSpringGreen',
            'MediumTurquoise',
            'MediumVioletRed',
            'MidnightBlue',
            'MintCream',
            'MistyRose',
            'Moccasin',
            'NavajoWhite',
            'Navy',
            'OldLace',
            'Olive',
            'OliveDrab',
            'Orange',
            'OrangeRed',
            'Orchid',
            'PaleGoldenrod',
            'PaleGreen',
            'PaleTurquoise',
            'PaleVioletRed',
            'PapayaWhip',
            'PeachPuff',
            'Peru',
            'Pink',
            'Plum',
            'PowderBlue',
            'Purple',
            'Red',
            'RosyBrown',
            'RoyalBlue',
            'SaddleBrown',
            'Salmon',
            'SandyBrown',
            'SeaGreen',
            'SeaShell',
            'Sienna',
            'Silver',
            'SkyBlue',
            'SlateBlue',
            'SlateGray',
            'Snow',
            'SpringGreen',
            'SteelBlue',
            'Tan',
            'Teal',
            'Thistle',
            'Tomato',
            'Turquoise',
            'Violet',
            'Wheat',
            'White',
            'WhiteSmoke',
            'Yellow',
            'YellowGreen',
        ];

        public static argbByName: SimpleDictionary<string, number[]> = undefined as any;
        public static nameByArgb: SimpleDictionary<number[], string> = undefined as any;

        public static get ArgbByName(): SimpleDictionary<string, number[]> {

            if (KnownColors.argbByName == null) {
                KnownColors.argbByName = new SimpleDictionary<string, number[]>();
                for (let i = 0; i < KnownColors.RgbaValues.length; ++i)
                    KnownColors.argbByName.set(KnownColors.Names[i], KnownColors.RgbaValues[i]);
            }
            return KnownColors.argbByName;
        }

        public static get NameByArgb(): SimpleDictionary<number[], string> {
            if (KnownColors.nameByArgb == null) {
                KnownColors.nameByArgb = new SimpleDictionary<number[], string>();
                for (let i = 0; i < KnownColors.Names.length; ++i)
                    KnownColors.nameByArgb.set(KnownColors.RgbaValues[i], KnownColors.Names[i]);
            }
            return KnownColors.nameByArgb;
        }

        public static FromKnownColor(kc: KnownColor): CGColor {
            let c: CGColor;
            const n: number = kc;
            if ((n <= 0) || (n >= KnownColors.RgbaValues.length))
                c = CGColor.FromRgba(0,0,0,0);
            else
                c = CGColor.FromRgba(KnownColors.RgbaValues[n][0],KnownColors.RgbaValues[n][1],KnownColors.RgbaValues[n][2]);
            return c;
        }

        public static GetName(kc: number | KnownColor): string {
            if (kc > 0 && kc < KnownColors.Names.length)
                return KnownColors.Names[kc];
            return '';
        }

        public static FindColorMatch(c: CGColor): CGColor {
            const argb: number[] = c.toRgba();
            for (let i = 0; i < KnownColors.RgbaValues.length; i++) {
                if (argb[1] === KnownColors.RgbaValues[i][1] && argb[2] === KnownColors.RgbaValues[i][2] && argb[3] === KnownColors.RgbaValues[i][3])
                    return KnownColors.FromKnownColor(<KnownColor>i);
            }
            return CGColor.Empty;
        }

        public static Update(knownColor: number, color: number[]): void {
            KnownColors.RgbaValues[knownColor] = color;
        }

    }

    (function staticKnownColorsConstructor() {
        //KnownColors.Update();
        //KnownColors.WatchColorChanges();
    })();