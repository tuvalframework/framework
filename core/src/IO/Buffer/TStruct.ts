import { IntPtr } from '../../Marshal/IntPtr';
import { free, malloc, SystemHeap } from '../Internals/Memory';
import { TBuffer } from './TBuffer';

export abstract class UMP extends TBuffer {
    private _pointer: number = undefined as any;
    protected get pointer(): number {
        return this._pointer;
    }
    protected set pointer(value: number) {
        this._pointer = value;
    }
    public constructor() {
        super(SystemHeap);
    }

    protected StructureToPtr(ptr: number): void {
        this.pointer = ptr;
        for (let i = 0; i < (this as any).__FIELDS__.length; i++) {
            if (this[(this as any).__FIELDS__[i]] instanceof UMP) {
                this[(this as any).__FIELDS__[i]].StructureToPtr(this[(this as any).__FIELDS__[i]].pointer);
            } else {
                this[(this as any).__FIELDS__[i]] = this['$' + (this as any).__FIELDS__[i]];
            }
        }
        this.pointer = undefined as any;
    }
    protected PtrToStructure(ptr: number): void {
        this.pointer = ptr;
        //const propNames = Object.getOwnPropertyNames(this);
        for (let i = 0; i < (this as any).__FIELDS__.length; i++) {
            if (this[(this as any).__FIELDS__[i]] instanceof UMP) {
                this[(this as any).__FIELDS__[i]].PtrToStructure(this[(this as any).__FIELDS__[i]].pointer);
            } else {
                this['$' + (this as any).__FIELDS__[i]] = this[(this as any).__FIELDS__[i]];
            }
        }
        this.pointer = undefined as any;
    }

    public Dispose() {
        if (this.pointer !== undefined) {
            free(this.pointer);
        }
    }

    //protected abstract GetSize(): number ;
}


export abstract class UMO extends TBuffer {
    protected pointer: number = 0;
    public constructor(pointer?: number) {
        super(SystemHeap);
        if (pointer === undefined) {
            this.pointer = malloc((this as any).__SIZE__);
        } else {
            this.pointer = pointer;
        }
    }
    public Dispose() {
        if (this.pointer !== undefined) {
            free(this.pointer);
        }
    }

    //protected abstract GetSize(): number ;
}