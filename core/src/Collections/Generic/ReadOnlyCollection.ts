import { ThrowHelper } from "../../ThrowHelper";
import { IList } from "./IList";
import { IReadOnlyList } from "./IReadOnlyList";
import { ExceptionArgument } from '../../ExceptionArgument';
import { int } from "../../float";
import { ExceptionResource } from "../../ExceptionResource";
import { IEnumerator } from "../enumeration_/IEnumerator";

export class ReadOnlyCollection<T> implements IList<T>, IReadOnlyList<T>
{
    private list: IList<T>;

    public constructor(list: IList<T>) {
        if (list == null) {
            ThrowHelper.ThrowArgumentNullException(ExceptionArgument.list);
        }
        this.list = list;
    }

    public get Count(): int {
        return this.list.Count;
    }

    public Get(index: int): T {
        return this.list.Get(index);
    }
    public Set(index: int, value: T) {
        ThrowHelper.ThrowNotSupportedException(ExceptionResource.NotSupported_ReadOnlyCollection);
    }



    public Contains(value: T): boolean {
        return this.list.Contains(value);
    }

    public CopyTo(array: T[], index: int): void {
        this.list.CopyTo(array, index);
    }

    public GetEnumerator(): IEnumerator<T> {
        return this.list.GetEnumerator();
    }

    public IndexOf(value: T): int {
        return this.list.IndexOf(value);
    }

    protected get Items(): IList<T> {
        return this.list;
    }

    public get IsReadOnly(): boolean {
        return true;
    }



    public Add(value: T): void {
        ThrowHelper.ThrowNotSupportedException(ExceptionResource.NotSupported_ReadOnlyCollection);
    }

    public Clear(): void {
        ThrowHelper.ThrowNotSupportedException(ExceptionResource.NotSupported_ReadOnlyCollection);
    }

    public Insert(index: int, value: T): void {
        ThrowHelper.ThrowNotSupportedException(ExceptionResource.NotSupported_ReadOnlyCollection);
    }

    public Remove(value: T): boolean {
        ThrowHelper.ThrowNotSupportedException(ExceptionResource.NotSupported_ReadOnlyCollection);
        return false;
    }

    public RemoveAt(index: int): void {
        ThrowHelper.ThrowNotSupportedException(ExceptionResource.NotSupported_ReadOnlyCollection);
    }
}