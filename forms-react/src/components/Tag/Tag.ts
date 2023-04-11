
import { TagClass } from "./TagClass";

export function UITag(value: string) {
    return new TagClass().value(value);
}