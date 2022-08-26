import { Type } from "../Reflection/Type";
import { IDisposable } from "../Disposable/IDisposable";
import { TString } from "./TString";

/*****************************
 * IMPORTANT NOTES ABOUT PERFORMANCE:
 * http://jsperf.com/string-concatenation-looped
 * http://jsperf.com/adding-strings-to-an-array
 * http://jsperf.com/string-concatenation-versus-array-operations-with-join
 *
 * It is clearly inefficient to use a StringBuilder or LinkedList to build a string when you have a small set of string portions.
 * StringBuilder will really show it's benefit likely somewhere above 1000 items.
 *****************************/


export class StringBuilder implements IDisposable
// Adding IDisposable allows for use with System.using();
// ... and since this may end up being a large array container, might be a good idea to allow for flexible cleanup.
{
    //noinspection JSMismatchedCollectionQueryUpdate
    private _partArray: string[] = [];
    private _latest: string | null = null; // AKA persistentString

    constructor(...initial: string[]) {
        this._latest = null;
        this._partArray = [];
        this.appendThese(initial);
    }

    private appendSingle(item: string): void {
        if (item != null) {
            this._latest = null;
            switch (typeof item) {
                case Type.OBJECT:
                case Type.FUNCTION:
                    item = item.toString();
                    break;
            }
            this._partArray.push(item); // Other primitive types can keep their format since a number or boolean is a smaller footprint than a string.
        }

    }

    public appendThese(items: string[]): StringBuilder {
        items.forEach(s => this.appendSingle(s));
        return this;
    }

    public append(...items: string[]): StringBuilder {
        this.appendThese(items);
        return this;
    }

    public appendLine(...items: any[]): StringBuilder {
        this.appendLines(items);
        return this;
    }
    public appendFormat(format: string, ...args: any[]) {
        this.appendLine(TString.Format(format, ...args));
    }
    public appendLines(items: any[]): StringBuilder {
        items.forEach(
            i => {
                if (i != null) {
                    this.appendSingle(i + '\n');
                    //this._partArray.push("\r\n");
                }
            }
        );
        return this;
    }

	/** /// These methods can only efficiently be added if not using a single array.
	 insert(index: number, value: string, count: number = 1): StringBuilder
	 {

	}

	 remove(startIndex:number, length:number): StringBuilder
	 {

	}
	 /**/

    get isEmpty(): boolean {
        return this._partArray.length === 0;
    }

    get Length(): number {
        return this._partArray.length;
    }

    public ToString(): string {
        let latest = this._latest;
        if (latest == null) {
            let result = '';
            for (let i = 0; i < this._partArray.length; i++) {
                result += this._partArray[i];
            }
            this._latest = latest = result;
        }

        return latest ?? '';
    }

    public join(delimiter: string): string {
        return this._partArray.join(delimiter);
    }

    public Replace(ss: string, rs: string): void {
        for (let i = 0; i < this._partArray.length; i++) {
            this._partArray[i] = TString.ReplaceAll(this._partArray[i],ss,rs);
        }
    }

    public clear(): void {
        this._partArray.length = 0;
        this._latest = null;
    }

    public Dispose(): void {
        this.clear();
    }
}