import { TBuffer } from "../../Buffer/TBuffer";
import { UMPDataType } from "../DataTypes_";

/**
A handle to a device context (DC).
This type is declared in WinDef.h as follows:
typedef HANDLE HDC;
 */
export function HDC(target: any, name: string): any {
    return new class extends UMPDataType {
        public Write(buffer: TBuffer, value: any) {
            throw new Error('Data type not implemented.');
        }
        public Read(buffer: TBuffer) {
            throw new Error('Data type not implemented.');
        }
        public GetSize(): number {
            throw new Error('Data type not implemented.');
        }
    }(target, name);
}