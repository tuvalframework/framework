
// Convert array into object

export function mapToObject(array: any[], key?: any) {

    if (!array) {
        return null;
    }

    const obj: any = {};
    for (let i = 0; i < array.length; ++i) {
        if (key) {
            if (array[i][key]) {
                obj[array[i][key]] = true;
            }
        }
        else {
            obj[array[i]] = true;
        }
    }

    return obj;
}