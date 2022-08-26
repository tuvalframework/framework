export function proxy(method, scope) {
    var aArgs = Array.prototype.slice.call(arguments, 2);
    return function () {
        return method.apply(scope, Array.prototype.slice.call(arguments, 0).concat(aArgs));
    };
}