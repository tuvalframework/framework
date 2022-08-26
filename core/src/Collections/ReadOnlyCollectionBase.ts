import { _CollectionBase } from "./CollectionBase";
import { IEnumerator } from "./enumeration_/IEnumerator";
import { ICollection } from "./Generic/ICollection";
import { IEnumerable } from "./enumeration_/IEnumerable";
import { ArrayList } from "./ArrayList";
import { int } from "../float";
import { Virtual } from '../Reflection/Decorators/ClassInfo';
import { NotSupportedException } from "../Exceptions/NotSupportedException";

export abstract class ReadOnlyCollectionBase<T> implements ICollection<T>, IEnumerable<T>
{
	private list: ArrayList<T> = undefined as any;

	protected Get_Count(): int {
		return this.InnerList.Count;
	}
	public get Count(): int {
		return this.Get_Count();
	}

	protected get InnerList(): ArrayList<T> {
		if (this.list == null) {
			this.list = new ArrayList();
		}
		return this.list;
	}


	protected constructor() {
	}

	public get IsReadOnly(): boolean {
		return true;
	}
	public Add(item: T): void {
		throw new NotSupportedException("Add Method Not Supported.");
	}
	public Clear(): void {
		throw new NotSupportedException("Clear Method Not Supported.");
	}
	public Contains(item: T): boolean {
		throw new NotSupportedException("Contains Method Not Supported.");
	}
	public Remove(item: T): boolean {
		throw new NotSupportedException("Remove Method Not Supported.");
	}
	IsEndless?: boolean | undefined;

	@Virtual
	public GetEnumerator(): IEnumerator<T> {
		return this.InnerList.GetEnumerator();
	}

	public CopyTo(array: Array<T>, index: int): void {
		this.InnerList.CopyTo(array, index);
	}
}

export abstract class _ReadOnlyCollectionBase<T> extends _CollectionBase<T>
{

	protected abstract _getCount(): number;

	protected getCount(): number {
		return this._getCount();
	}

	protected getIsReadOnly(): boolean {
		return true;
	}

	//noinspection JSUnusedLocalSymbols
	protected _addInternal(_entry: T): boolean {
		return false;
	}

	//noinspection JSUnusedLocalSymbols
	protected _removeInternal(_entry: T, _max?: number): number {
		return 0;
	}

	protected _clearInternal(): number {
		return 0;
	}

	protected abstract _getEnumerator(): IEnumerator<T>;

	GetEnumerator(): IEnumerator<T> {
		return this._getEnumerator();
	}

}