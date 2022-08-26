import { Type } from "@tuval/core";

export abstract class IDataObject {
    abstract getData(format: string): any;
    abstract getData(format: Type): any;
    abstract getData(format: string, autoConvert: boolean): any;
    abstract getDataPresent(format: string): boolean;
    abstract getDataPresent(format: Type): boolean;
    abstract getDataPresent(format: string, autoConvert: boolean): boolean;
    abstract getFormats(): string[];
    abstract getFormats(autoConvert: boolean): string[];
    abstract setData(data: any): void;
    abstract setData(format: string, data: any): void;
    abstract setData(format: Type, data: any): void;
    abstract setData(format: string, autoConvert: boolean, data: any): void;
}