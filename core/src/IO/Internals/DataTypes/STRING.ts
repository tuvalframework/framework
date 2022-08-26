import { CharacterSplitter } from './../../../Text/TextSplitter';
import { Encoding } from "../../../Encoding/Encoding";
import { TBuffer } from "../../Buffer/TBuffer";
import { UMPDataType } from "../DataTypes_";

function countCodePoints(str) {
    var point;
    var index;
    var width = 0;
    var len = 0;
    for (index = 0; index < str.length;) {
        point = str.codePointAt(index);
        width = 0;
        while (point) {
            width += 1;
            point = point >> 8;
        }
        index += Math.round(width / 2);
        len += 1;
    }
    return len;
}
const cs = new CharacterSplitter();

export function STRING(lenght: number): Function {
    return function (target: any, name: string): any {
        return new class extends UMPDataType {
            private actLenght: number = 0;
            public Write(buffer: TBuffer, value: string) {
                //console.log(countCodePoints("😹🐶😹🐶"));
                let strArr = cs.SplitGraphemes(value);
                strArr = strArr.slice(0, lenght);
                value = strArr.join('');
                let bytes: Uint8Array = Encoding.UTF8.GetBytes(value);
                const actLenght = bytes.length;
                buffer.WriteLong(actLenght);
                buffer.writeBytes(bytes);
            }
            public Read(buffer: TBuffer): string {
                const actLenght = buffer.ReadLong();
                const str = buffer.readUtf8(actLenght);
                return str;
            }
            public GetSize(): number {
                return (lenght * 4) + 4;// for actual lenght;
            }
        }(target, name);
    }
}
