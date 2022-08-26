import { int } from "../../float";
import { IEnumerable } from "../enumeration_/IEnumerable";

export interface IReadOnlyCollection<T> extends IEnumerable<T> {
    Count: int;
}