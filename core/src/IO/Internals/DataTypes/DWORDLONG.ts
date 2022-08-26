import { TBuffer } from "../../Buffer/TBuffer";
import { UMPDataType } from "../DataTypes_";

/**
A 64-bit unsigned integer. The range is 0 through 18446744073709551615 decimal.
This type is declared in IntSafe.h as follows:
typedef unsigned __int64 DWORDLONG;
 */
export function DWORDLONG(target: any, name: string): any {
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