import { SetBase } from "./SetBase";
import { IMap } from "../IMap";
import { ILinkedNodeWithValue } from "./ILinkedListNode";
import { IEnumerableOrArray } from "./IEnumerableOrArray";
import { Selector } from "../FunctionTypes";
import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { Type } from "../Reflection";
import { is } from "../is";


const VOID0: undefined = void 0;

export class HashSet<T> extends SetBase<T>
{
	private readonly _keyGenerator: Selector<T, string | number | symbol>;

	constructor(keyGenerator: Selector<T, string | number | symbol>)
	constructor(source: IEnumerableOrArray<T> | undefined, keyGenerator: Selector<T, string | number | symbol>)
	constructor(source: IEnumerableOrArray<T> | Selector<T, string | number | symbol> | undefined, keyGenerator?: Selector<T, string | number | symbol>) {
		super();
		if (is.function(source)) {
			this._keyGenerator = source;
		} else {
			if (!keyGenerator)
				throw new ArgumentNullException("keyGenerator");
			this._keyGenerator = keyGenerator;
			this._importEntries(source);
		}
	}


	protected newUsing(source?: IEnumerableOrArray<T>): HashSet<T> {
		return new HashSet<T>(source, this._keyGenerator);
	}

	private _registry: IMap<IMap<ILinkedNodeWithValue<T>>> = undefined as any;

	protected _addInternal(item: T): boolean {
		const _ = this;
		const type = typeof item;
		let r = _._registry, t = r && r[type];
		const key = _._keyGenerator(item);
		if (!t || t[<any>key] === VOID0) {
			if (!r) {
				//noinspection JSUnusedAssignment
				_._registry = r = {};
			}
			if (!t) {
				//noinspection JSUnusedAssignment
				r[type] = t = {};
			}

			const node: ILinkedNodeWithValue<T> = { value: item };
			_._getSet().addNode(node);
			t[<any>key] = node;
			return true;
		}
		return false;
	}

	protected _clearInternal(): number {
		wipe(this._registry, 2);
		return super._clearInternal();
	}

	protected _onDispose(): void {
		super._onDispose();
		this._registry = <any>null;
		(<any>this)._keyGenerator = VOID0;
	}

	protected _getNode(item: T): ILinkedNodeWithValue<T> | undefined {
		const r = this._registry, t = r && r[typeof item];
		return t && t[<any>this._keyGenerator(item)];
	}

	protected _removeInternal(item: T, max: number = Infinity): number {
		if (max === 0) return 0;

		const r = this._registry,
			t = r && r[typeof item],
			node = t && t[<any>item];

		if (node) {
			delete t[<any>item];
			const s = this._set;
			if (s && s.removeNode(node)) {
				return 1;
			}
		}

		return 0;
	}

}

function wipe(map: IMap<any>, depth: number = 1): void {
	if (map && depth) {
		for (let key of Object.keys(map)) {
			let v = map[key];
			delete map[key];
			wipe(v, depth - 1);
		}
	}
}