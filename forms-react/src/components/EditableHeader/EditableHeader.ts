import { EditableHeaderClass } from "./EditableHeaderClass";
import { is } from '@tuval/core';

export function EditableHeader(): EditableHeaderClass;
export function EditableHeader(value: string): EditableHeaderClass;
export function EditableHeader(...args: any[]): EditableHeaderClass {
    if (args.length === 0) {
        return new EditableHeaderClass();
    } else if (args.length === 1 && is.string(args[0])) {
        const value = args[0];
        return new EditableHeaderClass().value(value);
    }

}