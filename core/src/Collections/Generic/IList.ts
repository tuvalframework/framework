import { IEnumerable } from '../enumeration_/IEnumerable';
import { ICollection } from './ICollection';
import { int } from '../../float';
export interface IList<T> extends ICollection<T>, IEnumerable<T> {
    Get(index: int): T;
    Set(index: int, value: T): void;
    IndexOf(item: T): int;
    Insert(index: int, item: T): void;
    RemoveAt(index: int): void;
    //isReadOnly: bool
}
/*
export interface IList<T> extends ICollection<T>, IEnumerable<T> {
    IsFixedSize: boolean;
    IsReadOnly: boolean;
    get(index: int): T;
    set(index: int, value: T): void;
    add(value: T): int;
    clear(): void;
    contains(value: T): boolean;
    indexOf(value: T): int;
    insert(index: int, value: T): void;
    remove(value: any): void;
    removeAt(index: int): void;
} */