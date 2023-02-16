import { foreach, ICollection, IEnumerable, IEnumerator, IList, int } from "@tuval/core";
import { UIView } from "./UIView";

type ForEachIterateFunction<T> = (item: T, index?: number) => UIView;
export function ForEach<T>(enumarable: IEnumerator<T> | IEnumerable<T> | IList<T> | Array<T> | ICollection<T> | Iterator<T> | Iterable<T> | Set<T>): (value: ForEachIterateFunction<T>) => any[] {
    return (enumFunc: ForEachIterateFunction<T>) => {
        const result: any[] = [];
        let index: int = 0;

        const t0 = performance.now();

        foreach(enumarable, (item: any) => {
            const subView: any = enumFunc(item, index);
            if (Array.isArray(subView)) {
                foreach(subView, (view: any) => {
                    result.push(view);
                })
            } else {
                result.push(subView);
            }
            index++;
        });

        const t1 = performance.now();
        //console.log(`ForEach ${t1 - t0} milliseconds.`);
        return result;
    }
}