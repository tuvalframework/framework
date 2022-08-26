import { Constructor } from './Constructor';
export function shalowExtend(child: Constructor<any>, parent: Constructor<any>, ignores: string[]) {

    const list = Object.getOwnPropertyNames(parent.prototype);
    for (let i = 0; i < list.length; i++) {
        const key: string = list[i];
        //console.log(key);
        if (ignores.filter(s => key !== s).length !== 0) {
            child.prototype[key] = parent.prototype[key];
        }
    }
}
