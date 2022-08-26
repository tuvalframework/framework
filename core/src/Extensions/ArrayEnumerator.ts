import { IIteratorResult } from "../Collections";
import { IEnumerator } from "../Collections/enumeration_/IEnumerator";
import { int } from "../float";
import { ClassInfo } from "../Reflection/Decorators/ClassInfo";
import { System } from "../SystemTypes";

@ClassInfo({
    fullName: System.Types.Extensions.ArrayEnumerator,
    instanceof: [
        System.Types.Collections.Enumeration.IEnumerator,
    ]
})
export class ArrayEnumerator<T> implements IEnumerator<T> {
    private readonly array: ArrayLike<T> = null as any;
    private index: int = -1;
    public get Current(): any {
        if (this.index === -1) {
            return null;
        }
        return this.array[this.index];
    }
    CanMoveNext?: boolean | undefined;
    public constructor(arr: ArrayLike<T>) {
        this.array = arr;
    }
    public MoveNext(): boolean {
        if (this.index + 1 >= this.array.length) {
            return false;
        }
        this.index++;
        return true;
    }

    public Reset(): void {
        this.index = -1;
    }
    TryMoveNext(out: (value: T) => void): boolean {
        throw new Error("Method not implemented.");
    }

    End(): void {
        throw new Error("Method not implemented.");
    }
    NextValue(value?: any): T | undefined {
        throw new Error("Method not implemented.");
    }
    IsEndless?: boolean | undefined;
    Next(value?: any): IIteratorResult<T> {
        throw new Error("Method not implemented.");
    }
    Dispose(): void {
        throw new Error("Method not implemented.");
    }
}