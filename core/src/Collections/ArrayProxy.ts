/* import { IList } from "./Generic/IList";
import { IEnumerator } from "./enumeration_/IEnumerator";
import {  _ArrayList } from "./ArrayList";


var __ssextends = (this && this.__ssextends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

function get(target, property) {
    if (!isNaN(property)) {
        const _target: _ArrayList = target;
        if (_target.get) {
            return _target.get(property);
        }

    }
    return target[property];
}
function set(target, property, value, receiver) {
    if (!isNaN(property)) {
        console.log('set çalıştı');
        const _target: any = target;
        if (_target.setInternal) {
            if (property < 0 || property >= _target.getCount()) {
                _target.addInternal(value);
            } else {
                try {
                    _target.setInternal(property, value);
                } catch (e) {
                    const a = '';
                }
            }
        }
        return true;
    }
    target[property] = value;
    // you have to return true to accept the changes
    return true;
}

var handler = {
    'get': get,
    'set': set
};
function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor).forEach(name => {
            Object.defineProperty(derivedCtor, name, (Object as any).getOwnPropertyDescriptor(baseCtor, name));
        });
    });
}
// Create a proxy for a plain array:
export function getProxy() {
    const proxy = new Proxy({}, handler);
    console.log('getProxy');
    function ObjectProxy() { }
    ObjectProxy.prototype = proxy;

    return class extends (ObjectProxy as any) {
    }


}

export class ArrayList<T>  implements IList<T> {
    private list: _ArrayList<T> = undefined as any;
    public constructor() {
        //super();
        this.list = new _ArrayList();
        return new Proxy(this, {
            get:(target, property) => {
                if (!isNaN(property as any)) {
                    const _target: ArrayList<any> = target;
                    if (_target.get) {
                        return _target.get(property as any);
                    }

                }
                return target[property];
            },
            set: (target, property, value, receiver) => {
                if (!isNaN(property as any)) {
                    console.log('set çalıştı');
                    const _target: any = target;
                    if (_target.setInternal) {
                        if ((property as any) < 0 || (property as any) >= _target.getCount()) {
                            _target.addInternal(value);
                        } else {
                            try {
                                _target.setInternal(property, value);
                            } catch (e) {
                                const a = '';
                            }
                        }
                    }
                    return true;
                }
                target[property] = value;
                // you have to return true to accept the changes
                return true;
            }

          });
    }
    get(index: number): T {
        return this.list.get(index);
    }
    set(index: number, value: T): void {
        this.list.set(index, value);
    }
    private setInternal(index: number, value: T) {
        this.set(index, value);
    }
    indexOf(item: T): number {
        return this.list.indexOf(item);
    }
    insert(index: number, item: T): void {
        this.list.insert(index, item);
    }
    removeAt(index: number): void {
        this.list.removeAt(index);
    }
    get Count(): number {
        return this.list.Count;
    }
    get IsReadOnly(): boolean {
        return false;
    }
    getCount(): number {
        return this.list.Count;
    }
    private addInternal(item: T): void {
        this.add(item);
    }
    add(item: T): void {
        this.list.add(item);
    }
    clear(): void {
        this.list.clear();
    }
    contains(item: T): boolean {
        return this.list.contains(item);
    }
    copyTo(array: T[], arrayIndex: number): void {
        this.list.copyTo(array, arrayIndex);
    }
    remove(item: T): boolean {
        return this.list.remove(item);
    }
    getEnumerator(): IEnumerator<T> {
        return this.list.getEnumerator();
    }
    isEndless?: boolean | undefined;
}
 */