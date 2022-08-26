import { NotImplementedException } from "../Exceptions";
import { InvalidOperationException } from "../Exceptions/InvalidOperationException";
import { int } from "../float";
import { IntPtr } from "../Marshal/IntPtr";

export class RuntimeTypeHandle {
    private value: IntPtr = IntPtr.Zero;

    public /* internal */ constructor(val: IntPtr) {
        this.value = val;
    }



    public get Value(): IntPtr {
        return this.value;
    }

    public Equals(handle: RuntimeTypeHandle): boolean {
        return this.value === handle.Value;
    }

    public GetHashCode(): int {
        return this.value.GetHashCode();
    }

    public GetModuleHandle(): any/* ModuleHandle */ {
        throw new NotImplementedException('');
        /* if (this.value === IntPtr.Zero)
            throw new InvalidOperationException("Object fields may not be properly initialized");

        return Type.GetTypeFromHandle(this).Module.ModuleHandle; */
    }
}
