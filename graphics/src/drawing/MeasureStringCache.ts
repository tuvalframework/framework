import { CGSize } from '@tuval/cg';
import { List } from "@tuval/core";
import { foreach, Out, newOutEmpty, Event } from "@tuval/core";
import { Font } from "./Font";
import { StringFormat } from "./StringFormat";
import { SimpleDictionary } from "@tuval/core";



type CreateEntryDelegateType = (s: string, font: Font, layoutArea: CGSize, format: StringFormat) => Entry;

export class Entry {
    public text: string;
    public font: Font;
    public layoutArea: CGSize;
    public format: StringFormat;

    // Outputs
    public charactersFitted: number = 0;
    public linesFilled: number = 0;
    public measure: CGSize = CGSize.Empty;





    public constructor(text: string, font: Font, layoutArea: CGSize, format: StringFormat) {
        this.text = text;
        this.font = font;
        this.layoutArea = layoutArea;
        this.format = format;

    }

    public conformsTo(text: string, font: Font, layoutArea: CGSize, format: StringFormat): boolean {
        return this.text === text && this.font.equals(font)
            && this.layoutArea.Equals(layoutArea)
            && this.format.equals(format);
    }
}

export class MeasureStringCache {

    protected lurch: SimpleDictionary<string, Entry>;
    protected enabled: boolean;

    private myCreateEntryDelegate: Event<any>;
    public get CreateEntryDelegate(): Event<any/* CreateEntryDelegateType */> {
        return this.myCreateEntryDelegate;
    }
    public set CreateEntryDelegate(value: Event<any/* CreateEntryDelegateType */>) {
        this.myCreateEntryDelegate = value;
    }

    public MeasureStringCache(capacity: number, enabled: boolean = true) {

    }

    constructor(capacity: number, enabled: boolean = true) {
        this.enabled = enabled;
        this.lurch = new SimpleDictionary<string, Entry>();
        this.myCreateEntryDelegate = null as any; //new Event<any/* CreateEntryDelegateType */>(this);
    }

    public getKey(s: string, font: Font, layoutArea: CGSize, format: StringFormat): string {
       // const fnt: string = `{font.Name }|{font.Size}|{(font.Italic ? '1' : '0')}{(font.Underline ? '1' : '0')}{(font.Strikeout ? '1' : '0')}`;
       // const fmt: string = `{format.FormatFlags}|{format.HotkeyPrefix}|{format.Alignment}|{format.LineAlignment}|{format.Trimming}`;
        return `{s}|{layoutArea.Width},{layoutArea.Height}|{fnt}|{fmt}`;
    }

    private /*internal*/ getOrCreate(text: string, font: Font, layoutArea: CGSize, format: StringFormat, createEntryDelegate: Event<any>): Entry {
        if (!this.enabled) {
            return createEntryDelegate(text, font, layoutArea, format);
        }

        const key: string = this.getKey(text, font, layoutArea, format);
        const c: Out<Entry> = newOutEmpty();

        if (this.lurch.tryGetValue(key, c))
            if (c.value.conformsTo(text, font, layoutArea, format))
                return c.value;


        const entry: Entry = createEntryDelegate(text, font, layoutArea, format);
        this.lurch.set(key, entry);
        return entry;
    }
}
