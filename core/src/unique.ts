
/**
 * Remove duplicate items from Array
 * Example
 * var array = [1, 2, 2, 3, 3, 4, 5, 6];
 * var newArray = Hoek.unique(array);    // results in [1,2,3,4,5,6]
 * array = [{id: 1}, {id: 1}, {id: 2}];
 * newArray = unique(array, "id");  // results in [{id: 1}, {id: 2}]
 * @param array Array to
 * @param key
 */
export function unique(array: any[], key?: string) {
    let result: any[];
    if (key) {
        result = [];
        const index = new Set();
        array.forEach((item) => {
            const identifier = item[key];
            if (!index.has(identifier)) {
                index.add(identifier);
                result.push(item);
            }
        });
    } else {
        result = Array.from(new Set(array));
    }

    return result;
}