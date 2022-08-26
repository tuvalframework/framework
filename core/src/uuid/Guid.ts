import { int } from './../float';
import { v4 } from "./v4";
import { TObject } from '../Extensions/TObject';
import { ClassInfo } from '../Reflection/Decorators/ClassInfo';
import { System } from '../SystemTypes';

@ClassInfo({
    fullName: System.Types.Guid,
    instanceof: [
        System.Types.Guid,
    ]
})
export class Guid extends TObject {
    protected dispose(disposing: boolean): void {
        throw new Error('Method not implemented.');
    }
    private value: string = '';
    private hash: int = 0;
    private firstCharCode: int = 0;
    private lastCharCode: int = 0;
    public constructor(val: string) {
        super();
        this.value = val;
        this.firstCharCode = val.charCodeAt(0);
        this.lastCharCode = val.charCodeAt(val.length - 1);
        this.hash = this.makeHash(val);
    }
    private makeHash(str: string): number {
        var hash = 0;
        let char: int;
        if (str.length == 0) return hash;
        for (let i = 0; i < str.length; i++) {
            char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }
    public static NewGuid(): Guid {
        return new Guid(v4());
    }

    public Equals<Guid>(guid: Guid): boolean {
        if (this.hash !== (guid as any).hash) {
            return false;
        } else {
            if (this.firstCharCode === (guid as any).firstCharCode && this.lastCharCode === (guid as any).lastCharCode) {
                return true;
            }
        }
        return false;
    }
    public ToString(): string {
        return this.value;
    }
}