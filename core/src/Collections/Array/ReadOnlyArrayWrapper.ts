
import { ReadOnlyCollectionWrapper } from "../ReadOnlyCollectionWrapper";

export class ReadOnlyArrayWrapper<T> extends ReadOnlyCollectionWrapper<T>
{

	constructor(array: ArrayLike<T>) {
		super(array);
		this.__getValueAt = i => array[i];
	}

	protected _onDispose() {
		super._onDispose();
		this.__getValueAt = <any>null;
	}

	private __getValueAt: (i: number) => T;
	getValueAt(index: number): T {
		this.throwIfDisposed();
		return this.__getValueAt(index);
	}
}
