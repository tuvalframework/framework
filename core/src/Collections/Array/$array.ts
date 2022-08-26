export function $array(...args: any[]): any[] {
    const array: any[] = [];
    for (let i = 0; i < args.length; i++) {
        if (Array.isArray(args[i])) {
            $array(args[i]);
        } else {
            array.push(args[i]);
        }
    }
    return array;
}