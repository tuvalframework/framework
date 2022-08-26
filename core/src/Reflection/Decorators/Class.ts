import { Reflect } from "../Reflect";
import {  type } from "./ClassInfo";

export interface ModuleMetadata {
    name?: string | Symbol;
    fullName?: string | Symbol;
    instanceof?: Symbol[],
}

export function Class(metadata: ModuleMetadata): ClassDecorator {
    const propsKeys = Object.keys(metadata);
    // validateModuleKeys(propsKeys);

    return (target: Function) => {
        for (const property in metadata) {
            if (metadata.hasOwnProperty(property)) {
                if (property === 'instanceof') {
                    const array: Symbol[] = Reflect.getMetadata('instanceof', target);
                    if (Array.isArray(array)) {
                        const newArray: Symbol[] = [];
                        newArray.push(...array);
                        newArray.push(...metadata.instanceof as any);
                        Reflect.defineMetadata(property, newArray, target);
                    } else {
                        Reflect.defineMetadata(property, (metadata as any)[property], target);
                    }
                } else {
                    Reflect.defineMetadata(property, (metadata as any)[property], target);
                }
            }
        }

        const classType: any/* ClassType */ = <any>type(metadata.fullName as any);
        classType.target = target;
        if (classType != null) {
           /*  classType.FullName = (metadata.fullName && metadata.fullName.toString()) as any;
            classType.Name = metadata.name as any;
            classType.IsAbstract = false; */
        }

        Reflect.defineMetadata('__type__', classType, target);
        Reflect.defineMetadata('class', classType, target);
        target.prototype.GetTypeInternal = () => {
            return classType;
        }
    };
}

export class Reflection {
    public static GetMetadata(metadata: any, target: Object): any {
        return Reflect.getMetadata(metadata, target);
    }
}