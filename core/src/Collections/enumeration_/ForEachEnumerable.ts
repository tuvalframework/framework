
import { IIterator } from "./IIterator";
import { IEnumerableOrArray } from "../IEnumerableOrArray";
import { IEnumerator } from "./IEnumerator";

export type ForEachEnumerable<T> = IEnumerableOrArray<T> | IEnumerator<T> | IIterator<T>;