import { EnumeratorBase } from "./EnumeratorBase";
import { IYield } from "./IYield";


    export interface IndexEnumeratorSource<T> {
        source: { [index: number]: T };
        length: number;
        step?: number

        pointer?: number;
    }

    export class IndexEnumerator<T> extends EnumeratorBase<T>
    {

        constructor(sourceFactory: () => IndexEnumeratorSource<T>) {

            let source: IndexEnumeratorSource<T>;
            super(() => {
                source = sourceFactory();
                if (source && source.source) {
                    const len = source.length;
                    if (len < 0) // Null is allowed but will exit immediately.
                        throw new Error("length must be zero or greater");

                    if (!isFinite(len))
                        throw new Error("length must finite number");

                    if (len && source.step === 0)
                        throw new Error("Invalid IndexEnumerator step value (0).");
                    let pointer = source.pointer;
                    if (!pointer)
                        pointer = 0;
                    else if (pointer != Math.floor(pointer))
                        throw new Error("Invalid IndexEnumerator pointer value (" + pointer + ") has decimal.");
                    source.pointer = pointer;

                    let step = source.step;
                    if (!step)
                        step = 1;
                    else if (step != Math.floor(step))
                        throw new Error("Invalid IndexEnumerator step value (" + step + ") has decimal.");
                    source.step = step;
                }
            },

                (yielder: IYield<T>) => {
                    let len = (source && source.source) ? source.length : 0;
                    if (!len || isNaN(len))
                        return yielder.yieldBreak();
                    const current = <number>source.pointer;
                    if (source.pointer == null) source.pointer = 0; // should never happen but is in place to negate compiler warnings.
                    if (!source.step) source.step = 1; // should never happen but is in place to negate compiler warnings.
                    source.pointer = source.pointer + source.step;
                    return (current < len && current >= 0)
                        ? yielder.yieldReturn(source.source[current])
                        : yielder.yieldBreak();
                },

                () => {
                    if (source) {
                        source.source = <any>null;
                    }
                }
            );
            this._isEndless = false;
        }
    }
