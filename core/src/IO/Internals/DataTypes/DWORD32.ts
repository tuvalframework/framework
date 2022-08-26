import { TBuffer } from "../../Buffer/TBuffer";
import { UMPDataType } from "../DataTypes_";

/**
A 32-bit unsigned integer.
This type is declared in BaseTsd.h as follows:
typedef unsigned int DWORD32;
 */
export function DWORD32(target: any, name: string): any {
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