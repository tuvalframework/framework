import { IEnumerable } from "./Collections/enumeration_/IEnumerable";
import { IEnumerator } from "./Collections/enumeration_/IEnumerator";
import { is } from "./is";
import { System } from "./SystemTypes";
import { ICollection } from "./Collections/Generic/ICollection";
import { IList } from "./Collections/Generic/IList";
/* import { Iterator } from "../java/lang/Iterator";
import { Iterable } from "../java/lang/Iterable";
import { Set } from "../java/util/Set";  */

export const CONTINUE: number = 0;
export const BREAK: number = 1

export function foreach<T>(enumerable: IEnumerator<T> | IEnumerable<T> | IList<T> | Array<T> | ICollection<T> | Iterator<T> | Iterable<T> | Set<T>, func: (obj: T) => void | never | number) {
    if (enumerable == null) {
        return;
    }
    if (is.typeof<IEnumerator<T>>(enumerable, System.Types.Collections.Enumeration.IEnumerator)) {
        const enumerator: IEnumerator<T> = enumerable;
        if (enumerator) {
            while (enumerator.MoveNext()) {
                const result = func((enumerator as any).Current);
                if (result === CONTINUE) {
                    continue;
                } else if (result === BREAK) {
                    break;
                }
            }
        }
    } else if (is.typeof<IEnumerable<T>>(enumerable, System.Types.Collections.Enumeration.IEnumerable)) {
        const enumerator: IEnumerator<T> = enumerable.GetEnumerator();
        if (enumerator) {
            while (enumerator.MoveNext()) {
                const result = func((enumerator as any).Current);
                if (result === CONTINUE) {
                    continue;
                } else if (result === BREAK) {
                    break;
                }
            }
        }
    } else if (is.typeof<IList<T>>(enumerable, System.Types.Collections.Generics.IList)) {
        for (let i = 0; i < enumerable.Count; i++) {
            const result = func(enumerable.Get(i));
            if (result === CONTINUE) {
                continue;
            } else if (result === BREAK) {
                break;
            }
        }
    } else if (Array.isArray(enumerable) || enumerable instanceof Int8Array || enumerable instanceof Uint8Array ) {
        for (let i = 0; i < enumerable.length; i++) {
            const result = func(enumerable[i] as any);
            if (result === CONTINUE) {
                continue;
            } else if (result === BREAK) {
                break;
            }
        } // düzelt
    } /* else if (is<Iterator<T>>(enumerable, System.Types.tuval.lang.Iterator)) {
        while (enumerable.hasNext()) {
            const result = func(enumerable.next());
            if (result === CONTINUE) {
                continue;
            } else if (result === BREAK) {
                break;
            }
        }
    } else if (is<Iterable<T>>(enumerable, System.Types.tuval.lang.Iterable)) {
        const iterator: Iterator<T> = enumerable.iterator();
        if (iterator) {
            while (iterator.hasNext()) {
                const result = func(iterator.next());
                if (result === CONTINUE) {
                    continue;
                } else if (result === BREAK) {
                    break;
                }
            }
        }
    } */
}

export async function foreachAsync<T>(enumerable: IEnumerator<T> | IEnumerable<T> | IList<T> | Array<T> | ICollection<T> | Iterator<T> | Iterable<T> | Set<T>,  func:  (obj: T) => Promise<void> | Promise<never> | Promise<number>) {
    if (enumerable == null) {
        return;
    }
    if (is.typeof<IEnumerator<T>>(enumerable, System.Types.Collections.Enumeration.IEnumerator)) {
        const enumerator: IEnumerator<T> = enumerable;
        if (enumerator) {
            while (enumerator.MoveNext()) {
                const result = await func((enumerator as any).Current);
                if (result === CONTINUE) {
                    continue;
                } else if (result === BREAK) {
                    break;
                }
            }
        }
    } else if (is.typeof<IEnumerable<T>>(enumerable, System.Types.Collections.Enumeration.IEnumerable)) {
        const enumerator: IEnumerator<T> = enumerable.GetEnumerator();
        if (enumerator) {
            while (enumerator.MoveNext()) {
                const result = await func((enumerator as any).Current);
                if (result === CONTINUE) {
                    continue;
                } else if (result === BREAK) {
                    break;
                }
            }
        }
    } else if (is.typeof<IList<T>>(enumerable, System.Types.Collections.Generics.IList)) {
        for (let i = 0; i < enumerable.Count; i++) {
            const result = await func(enumerable[i]);
            if (result === CONTINUE) {
                continue;
            } else if (result === BREAK) {
                break;
            }
        }
    } else if (Array.isArray(enumerable) || enumerable instanceof Int8Array || enumerable instanceof Uint8Array ) {
        for (let i = 0; i < enumerable.length; i++) {
            const result = await func(enumerable[i] as any);
            if (result === CONTINUE) {
                continue;
            } else if (result === BREAK) {
                break;
            }
        } // düzelt
    } /* else if (is<Iterator<T>>(enumerable, System.Types.tuval.lang.Iterator)) {
        while (enumerable.hasNext()) {
            const result = func(enumerable.next());
            if (result === CONTINUE) {
                continue;
            } else if (result === BREAK) {
                break;
            }
        }
    } else if (is<Iterable<T>>(enumerable, System.Types.tuval.lang.Iterable)) {
        const iterator: Iterator<T> = enumerable.iterator();
        if (iterator) {
            while (iterator.hasNext()) {
                const result = func(iterator.next());
                if (result === CONTINUE) {
                    continue;
                } else if (result === BREAK) {
                    break;
                }
            }
        }
    } */
}