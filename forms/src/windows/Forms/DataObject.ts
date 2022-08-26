import { Type } from "@tuval/core";
import { IDataObject } from "./IDataObject";

export class DataObject implements IDataObject {
    getData(format: string): void;
    getData(format: Type): void;
    getData(format: string, autoConvert: boolean): void;
    getData(format: any, autoConvert?: any): void {
        throw new Error("Method not implemented.");
    }
    getDataPresent(format: string): boolean;
    getDataPresent(format: Type): boolean;
    getDataPresent(format: string, autoConvert: boolean): boolean;
    getDataPresent(format: any, autoConvert?: any): boolean {
        throw new Error("Method not implemented.");
    }
    getFormats(): string[];
    getFormats(autoConvert: boolean): string[];
    getFormats(autoConvert?: any): string[] {
        throw new Error("Method not implemented.");
    }
    setData(data: any): void;
    setData(format: string, data: any): void;
    setData(format: Type, data: any): void;
    setData(format: string, autoConvert: boolean, data: any): void;
    setData(format: any, autoConvert?: any, data?: any) {
        throw new Error("Method not implemented.");
    }


}