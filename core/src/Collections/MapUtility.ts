
import { IMap } from "../IMap";

export class MapUtility {
	/**
	 * Takes a target object and applies all source values to it.
	 * @param target
	 * @param source
	 * @returns {any}
	 */
	public static apply<T extends IMap<any>, U extends IMap<any>>(
		target: T,
		source: U): T & U {
		const result: any = target || {};
		for (const key in source) {
			if (source.hasOwnProperty(key)) {
				result[key] = (<any>source)[key];
			}
		}
		return result;
	}

	/**
	 * Takes a target object and ensures values exist.
	 * @param target
	 * @param defaults
	 * @returns {any}
	 */
	public static ensure<T extends IMap<any>, U extends IMap<any>>(
		target: T,
		defaults: U): T & U {
		const result: any = target || {};
		for (const key in defaults) {
			if (defaults.hasOwnProperty(key) && !result.hasOwnProperty(key)) {
				result[key] = (<any>defaults)[key];
			}
		}
		return result;
	}

	/**
	 * Make a copy of the source object.
	 * @param source
	 * @returns {Object}
	 */
	public static copy<T extends IMap<any>>(source: T): T {
		return MapUtility.apply({}, source);
	}


	/**
	 * Takes two objects and creates another with the values of both.
	 * B overwrites A.
	 * @param a
	 * @param b
	 */
	public static merge<A extends IMap<any>, B extends IMap<any>>(
		a: A,
		b: B): A & B {
		return MapUtility.apply(MapUtility.copy(a), b);
	}

	/**
	 * Removes any keys that don't exist on the keyMap.
	 * @param target
	 * @param keyMap
	 */
	public static trim<TResult extends IMap<any>>(target: IMap<any>, keyMap: TResult): void //Partial<TResult>
	{
		for (const key in target) {
			if (!keyMap.hasOwnProperty(key)) {
				delete target[key];
			}
		}
		//return <any>target;
	}

	public static wipe(map: IMap<any>, depth: number = 1): void {
		if (map && depth) {
			for (let key of Object.keys(map)) {
				const v = map[key];
				delete map[key];
				MapUtility.wipe(v, depth - 1);
			}
		}
	}
}