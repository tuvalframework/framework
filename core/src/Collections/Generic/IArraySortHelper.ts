import { int } from '../../float';
import { IComparer } from '../IComparer';
export interface IArraySortHelper<TKey> {
    BinarySearch(keys: TKey[], index: int, length: int, value: TKey, comparer: IComparer<TKey>): int;
    Sort(keys: TKey[], index: int, length: int, comparer: IComparer<TKey>): void;
}