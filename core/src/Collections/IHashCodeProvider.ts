import { int } from "../float";

export interface IHashCodeProvider {
    GetHashCode(obj: any): int;
}