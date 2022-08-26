import { TBuffer } from "../../Buffer/TBuffer";
import { UMPDataType } from "../DataTypes_";
import { HANDLE$ } from "./HANDLE";

/**
A handle to a window.
typedef HANDLE HWND;
 */

export class HWND$ extends HANDLE$ {
}
export function HWND(target: any, name: string): any {
    return new HWND$(target, name);
}