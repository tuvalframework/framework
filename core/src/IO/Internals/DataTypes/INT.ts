import { Convert } from './../../../convert';
import { TBuffer } from "../../Buffer/TBuffer";
import { UMPDataType } from "../DataTypes_";

export class INT$ extends UMPDataType {
    public Write(buffer: TBuffer, value: any) {
        buffer.WriteLong(Convert.ToInt32(value));
    }
    public Read(buffer: TBuffer) {
        return buffer.ReadLong();
    }
    public GetSize(): number {
        return 4;
    }
}
export function INT(target: any, name: string): any {
    return new INT$(target, name);
}