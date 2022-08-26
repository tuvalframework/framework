import { TBuffer } from "../../Buffer/TBuffer";
import { UMPDataType } from "../DataTypes_";

/**
 * An 8-bit Windows (ANSI) character.
 * This type is declared in WinNT.h as follows:
 * typedef char CCHAR;
 */
export function CCHAR(target: any, name: string): any {
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