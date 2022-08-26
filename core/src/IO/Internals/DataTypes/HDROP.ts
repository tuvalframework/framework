import { TBuffer } from "../../Buffer/TBuffer";
import { UMPDataType } from "../DataTypes_";

/**
A handle to an internal drop structure.
This type is declared in ShellApi.h as follows:
typedef HANDLE HDROP;
 */
export function HDROP(target: any, name: string): any {
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