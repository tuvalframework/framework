export function stringify(object: any): string {
    try {
        return JSON.stringify.apply(null, object);
    } catch (err: any) {
        return '[Cannot display object:' + err.message + ']';
    }
}