
export function flatten(array: any[], target?: any[]): any[] {
    if (!Array.isArray(array)) {
        array = [array];
    }
    const result = target || [];
    for (let i = 0; i < array.length; ++i) {
        if (Array.isArray(array[i])) {
            flatten(array[i], result);
        }
        else {
            result.push(array[i]);
        }
    }
    return result;
}