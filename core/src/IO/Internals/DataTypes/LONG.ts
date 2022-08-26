import { Convert } from './../../../convert';
import { TBuffer } from './../../Buffer/TBuffer';
import { UMPDataType } from "../DataTypes_";
import { Guid } from '../../../uuid/Guid';
import { Encoding } from '../../../Encoding/Encoding';

//debugger;
export function LONG(target: any, name: string): any {

    return new class extends UMPDataType {
        public Write(buffer: TBuffer, value: any) {
            buffer.WriteLong(Convert.ToInt32(value));
        }
        public Read(buffer: TBuffer) {
            return buffer.ReadLong();
        }
        public GetSize(): number {
            return 4;
        }
    }(target, name);
}

export function GUID(target: any, name: string): any {
    return new class extends UMPDataType {
        public Write(buffer: TBuffer, value: Guid) {
            const guiString = value.ToString();
            const bytes = Encoding.UTF8.GetBytes(guiString);
            buffer.writeBytes(bytes);
        }
        public Read(buffer: TBuffer): Guid {
            const guidStr = buffer.readUtf8(36);
            return new Guid(guidStr);
        }
        public GetSize(): number {
            return 50;
        }
    }(target, name);
}