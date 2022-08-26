import { Convert } from './../../../convert';
import { TBuffer } from './../../Buffer/TBuffer';
import { UMPDataType } from "../DataTypes_";

export class PVOID$ extends UMPDataType {
    public Write(buffer: TBuffer, value: any) {
        buffer.writeInt32(Convert.ToInt32(value));
    }
    public Read(buffer: TBuffer) {
        return buffer.readInt32();
    }
    public GetSize(): number {
        return 4;
    }
}

export function PVOID(target: any, name: string): any {
    return new PVOID$(target, name);
}