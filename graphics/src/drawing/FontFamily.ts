import { FontStyle } from "./FontStyle";

export class FontFamily {

    private familyName: string;

    public get Name(): string {
        return this.familyName;
    }

    public getLineSpacing(style: FontStyle): number {
        console.error('FontFamily.getLineSpacing not implemented.');
        return undefined as any;
    }

    public getEmHeight(style: FontStyle): number {
        console.error('font.getEmHeight not implemented.');
        return undefined as any;
    }

    constructor(name: string) /* ;
        constructor(name: string, createDefaultIfNotExists: boolean);
        constructor(name: string, fontCollection: FontCollection);
        constructor(...args: any[]) */ {
        this.familyName = name;
    }
    public /* override */  toString(): string {
        return "FontFamily: Name=" + this.Name;
    }
}
