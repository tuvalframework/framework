import { int } from "../float";

export interface IEqualityComparer<T> {
    Equals(x: T, y: T): boolean;
    GetHashCode(obj: T): int;
}