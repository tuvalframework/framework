import { ILazy } from "./ILazy";
import { Func } from "./FunctionTypes";
import { ResolverBase } from "./ResolverBase";
// noinspection JSUnusedLocalSymbols


// We need a non-resettable lazy to ensure it can be passed safely around.
export class Lazy<T> extends ResolverBase<T> implements ILazy<T>
{

	constructor(valueFactory: Func<T>, trapExceptions: boolean = false, allowReset: boolean = false) {
		super(valueFactory, trapExceptions, allowReset);
		this._disposableObjectName = 'Lazy';
		this._isValueCreated = false;
	}

	get isValueCreated(): boolean {
		return !!this._isValueCreated;
	}

	get value(): T {
		return this.getValue();
	}

	Equals(other: Lazy<T>): boolean {
		return this == other;
	}

	valueEquals(other: Lazy<T>): boolean {
		return this.Equals(other) || this.value === other.value;
	}

	static create<T>(valueFactory: Func<T>, trapExceptions: boolean = false, allowReset: boolean = false) {
		return new Lazy<T>(valueFactory, trapExceptions, allowReset);
	}

}

export class ResettableLazy<T> extends Lazy<T>
{
	constructor(valueFactory: Func<T>, trapExceptions: boolean = false) {
		super(valueFactory, trapExceptions, true);
		this._disposableObjectName = 'ResettableLazy';
	}

	static create<T>(valueFactory: Func<T>, trapExceptions: boolean = false) {
		return new ResettableLazy<T>(valueFactory, trapExceptions);
	}
}