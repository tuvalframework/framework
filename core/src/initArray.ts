
export function initArray<T>(count: number, initFunc:()=>T): T[] {
    const array = new Array(count);
    for(let i = 0; i<array.length;i++) {
        array[i] = initFunc();
    }
    return array;
}