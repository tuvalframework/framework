import { TBuffer } from "../../Buffer/TBuffer";
import { UMPDataType } from "../DataTypes_";
import { PVOID$ } from "./PVOID";

/**
A handle to an object.
This type is declared in WinNT.h as follows:
typedef PVOID HANDLE;
 */
export class HANDLE$ extends PVOID$ {
}

export function HANDLE(target: any, name: string): any {
    return new HANDLE$(target, name);
}