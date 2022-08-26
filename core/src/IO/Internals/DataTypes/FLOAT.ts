import { Convert } from './../../../convert';
import { TBuffer } from './../../Buffer/TBuffer';
import { UMPDataType } from "../DataTypes_";

//debugger;
export function FLOAT(target: any, name: string): any {
    return new class extends UMPDataType {
        public Write(buffer: TBuffer, value: any) {
            buffer.writeFloat64(value);
        }
        public Read(buffer: TBuffer) {
            return buffer.readFloat64();
        }
        public GetSize(): number {
            return 8;
        }
    }(target, name);
}