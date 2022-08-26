import { HotkeyPrefix } from "./HotkeyPrefix";
import { StringAlignment } from "./StringAlignment";
import { StringTrimming } from "./StringTrimming";
import { StringFormatFlags } from "./StringFormatFlags";
import { CharacterRange } from "./CharacterRange";
import { ArgumentNullException, NotImplementedException } from "@tuval/core";
import { float, Out, is } from "@tuval/core";
import { ClassInfo } from "@tuval/core";
import { GraphicTypes } from "../GDITypes";

@ClassInfo({
    fullName: GraphicTypes.StringFormat,
    instanceof: [
        GraphicTypes.StringFormat
    ]
})
export class StringFormat {
    private myHotkeyPrefix: HotkeyPrefix = HotkeyPrefix.None;
    private myAlignment: StringAlignment = undefined as any;
    private myLineAlignment: StringAlignment = undefined as any;
    private myTrimming: StringTrimming = undefined as any;
    private myFormatFlags: StringFormatFlags = StringFormatFlags.NoWrap;
    public/*internal*/  measurableCharacterRanges: CharacterRange[] = undefined as any;

    public get Alignment(): StringAlignment {
        return this.myAlignment;
    }
    public set Alignment(value: StringAlignment) {
        this.myAlignment = value;
    }

    public get LineAlignment(): StringAlignment {
        return this.myLineAlignment;
    }
    public set LineAlignment(value: StringAlignment) {
        this.myLineAlignment = value;
    }

    public get Trimming(): StringTrimming {
        return this.myTrimming;
    }
    public set Trimming(value: StringTrimming) {
        this.myTrimming = value;
    }

    public get FormatFlags(): StringFormatFlags {
        return this.myFormatFlags;
    }
    public set FormatFlags(value: StringFormatFlags) {
        this.myFormatFlags = value;
    }

    public get HotkeyPrefix(): HotkeyPrefix {
        return this.myHotkeyPrefix;
    }
    public set HotkeyPrefix(value: HotkeyPrefix) {
        this.myHotkeyPrefix = value;
    }



    public constructor();
    public constructor(format: StringFormat);
    public constructor(options: StringFormatFlags);
    public constructor(options: StringFormatFlags, language: number);
    public constructor(...args: any[]) {
        if (args.length === 0) {
            this.Alignment = StringAlignment.Near;
            this.LineAlignment = StringAlignment.Near;
        } else if (args.length === 1 && args[0] instanceof StringFormat) {
            if (args[0] == null) {
                throw new ArgumentNullException("format");
            }
            const format: StringFormat = args[0];
            this.Alignment = format.Alignment;
            this.LineAlignment = format.LineAlignment;
            this.FormatFlags = format.FormatFlags;
            this.Trimming = format.Trimming;
            this.HotkeyPrefix = format.HotkeyPrefix;
        } else if (args.length === 1 && typeof args[0] === 'number') {
            this.myFormatFlags = args[0];
        }
    }

    public clone(): StringFormat {
        return new StringFormat(this);
    }

    public static get GenericDefault(): StringFormat {
        const format = new StringFormat();
        format.FormatFlags = 0;
        return format;
    }

    public static get GenericTypographic(): StringFormat {
        const format = new StringFormat();
        format.FormatFlags = StringFormatFlags.FitBlackBox | StringFormatFlags.LineLimit | StringFormatFlags.NoClip;
        return format;
    }

    public setMeasurableCharacterRanges(ranges: CharacterRange[]): void {
        this.measurableCharacterRanges = ranges;
    }

    public setTabStops(firstTabOffset: float, tabStops: float[]): void {
        throw new NotImplementedException('StringFormat::setTabStops');
    }

    /*public void SetDigitSubstitution(int language,  StringDigitSubstitute substitute)
    {
        throw new NotImplementedException ();
    }*/

    public getTabStops(firstTabOffset: Out<float>): float[] {
        throw new NotImplementedException('StringFormat::getTabStops');
    }

    public /*override*/ equals(f: StringFormat): boolean {
        return (is.typeof<StringFormat>(f, GraphicTypes.StringFormat))
            && this.FormatFlags === f.FormatFlags
            && this.HotkeyPrefix === f.HotkeyPrefix
            && this.measurableCharacterRanges === f.measurableCharacterRanges
            && this.Alignment === f.Alignment
            && this.LineAlignment === f.LineAlignment
            && this.Trimming === f.Trimming;
    }

}