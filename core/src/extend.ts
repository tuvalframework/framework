
export function extend(child: any, parent: any) {
    function Ctor() {
        this.constructor = child;
    }
    Ctor.prototype = parent.prototype;
    const oldProto = child.prototype;
    child.prototype = new (<any>Ctor)();
    for (var key in oldProto) {
        if (oldProto.hasOwnProperty(key)) {
            child.prototype[key] = oldProto[key];
        }
    }
    child.__super__ = parent.prototype;
    // create reference to parent
    child.super = parent;
}