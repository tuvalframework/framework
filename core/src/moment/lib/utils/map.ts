export default function map(arr, fn) {
    var res: any[] = [],
        i,
        arrLen = arr.length;
    for (i = 0; i < arrLen; ++i) {
        res.push(fn(arr[i], i));
    }
    return res;
}
