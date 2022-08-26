import { NotImplementedException } from "../Exceptions";
import { int } from "../float";
import { IntPtr } from "../Marshal";

export class RuntimeMethodHandle {
    private value: IntPtr = IntPtr.Zero;

    public /* internal */ constructor(v: IntPtr) {
        this.value = v;
    }



    public get Value(): IntPtr {
        return this.value;
    }

    private static /* extern */  GetFunctionPointer(m: IntPtr): IntPtr {
        throw new NotImplementedException('');
    }

    public GetFunctionPointer(): IntPtr {
        return RuntimeMethodHandle.GetFunctionPointer(this.value);
    }


    public Equals(handle: RuntimeMethodHandle): boolean {
        return this.value === handle.Value;
    }

    public /* override */  GetHashCode(): int {
        return this.value.GetHashCode();
    }
}
