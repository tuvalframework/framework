import { int } from "../../float";
import { IEnumerable } from "../enumeration_/IEnumerable";

export interface ICollection<T> extends IEnumerable<T> {
    Count: int;
    IsReadOnly: boolean;
    Add(item: T): void;
    Clear(): void;
    Contains(item: T): boolean;
    CopyTo(array: T[], arrayIndex: int): void;
    Remove(item: T): boolean;
}