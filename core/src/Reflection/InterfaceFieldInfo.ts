import { FieldInfo } from './FieldInfo';
import { Type } from "./Type";


export interface InterfaceFieldInfoConfig {
    name: string;
    fieldType: Type;
}

export class InterfaceFieldInfo extends FieldInfo {
    public constructor(config?: InterfaceFieldInfoConfig) {
        super(/* {
            fieldType: config ? config.fieldType : undefined as any,
            isPrivate: false,
            isPublic: true,
            name: config ? config.name : String.Empty
        } */);
    }
}
