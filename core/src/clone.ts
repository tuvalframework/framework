
export function clone<T extends { [index: string]: any }>(obj: T, seen?: Map<any, any>): T {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    seen = seen || new Map<any, any>();

    const lookup = seen.get(obj);
    if (lookup) {
        return lookup;
    }

    let newObj;
    let cloneDeep = false;

    if (!Array.isArray(obj)) {
        if (obj instanceof Date) {
            newObj = new Date(obj.getTime());
        } else if (obj instanceof RegExp) {
            newObj = new RegExp(obj);
        } else {
            const proto = Object.getPrototypeOf(obj);
            if (proto && proto.isImmutable) {
                newObj = obj;
            } else {
                newObj = Object.create(proto);
                cloneDeep = true;
            }
        }
    } else {
        newObj = [];
        cloneDeep = true;
    }

    seen.set(obj, newObj);

    if (cloneDeep) {
        const keys = Object.getOwnPropertyNames(obj);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const description: any = Object.getOwnPropertyDescriptor(obj, key);
            if (description && description.get || description.set) {
                Object.defineProperty(newObj, key, description);
            } else {
                newObj[key] = clone(obj[key], seen);
            }
        }
    }

    return newObj;
}
