export function cloneObject<T extends { [k: string]: any }>(obj: T): T {
    var retObj: T = <any>{};
    let self:any;
    for (var key in obj) {
        if (self._isObject(obj[key])) {
            retObj[key] = self.cloneObject(obj[key]);
        } else if (self._isArray(obj[key])) {
            retObj[key] = self.cloneArray(obj[key]);
        } else {
            retObj[key] = obj[key];
        }
    }
    return retObj;
}