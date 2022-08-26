import { TBuffer } from "../../Buffer/TBuffer";
import { UMPDataType } from "../DataTypes_";

let structCount: number = 0;
export function STRUCT(structType: any): Function {
    return function (target: any, name: string): any {
        return new class {
            public constructor(target: any, name: string) {
                if (!Array.isArray(target.__FIELDS__)) {
                    target.__FIELDS__ = [];
                }
                target.__FIELDS__.push(name);
                Object.defineProperty(target, name, {
                    get: (function () {
                        const size: number = target.__SIZE__ === undefined ? 0 : target.__SIZE__;
                        const _structCount = structCount;
                        return function () {

                            if (this['_structValue_' + _structCount] == null) {
                                this['_structValue_' + _structCount] = new structType();
                            }
                            if (this.pointer === undefined) {
                                this['_structValue_' + _structCount].pointer = undefined;
                            } else {
                                this['_structValue_' + _structCount].pointer = this.pointer + size;
                            }
                            return this['_structValue_' + _structCount];
                        }
                    })()
                });
                structCount++;
                target.__SIZE__ = (target.__SIZE__ === undefined ? 0 : target.__SIZE__) + structType.prototype.__SIZE__;
            }
        }(target, name);
    }
}

