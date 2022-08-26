import { IReadOnlyCollection } from "./IReadOnlyCollection";
import { IEnumerable } from "../enumeration_/IEnumerable";
import { int } from "../../float";

export interface IReadOnlyList<T> extends IReadOnlyCollection<T>, IEnumerable<T> {
    Get(index: int): T;
}