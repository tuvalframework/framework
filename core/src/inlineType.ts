
export function inlineType<T>(classType: any, obj: any): T {
    const newObj = new (<any>classType)();
    const keys = Object.getOwnPropertyNames(obj);
    for (let i = 0; i < keys.length; i++) {
        newObj[keys[i]] = obj[keys[i]];
    }
    return newObj;
}