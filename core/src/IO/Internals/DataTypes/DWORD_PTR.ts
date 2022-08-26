import { TBuffer } from "../../Buffer/TBuffer";
import { UMPDataType } from "../DataTypes_";

/**
An unsigned long type for pointer precision. Use when casting a pointer to a long type to perform pointer arithmetic.
(Also commonly used for general 32-bit parameters that have been extended to 64 bits in 64-bit Windows.)
This type is declared in BaseTsd.h as follows:
typedef ULONG_PTR DWORD_PTR;
 */
export function DWORD_PTR(target: any, name: string): any {
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