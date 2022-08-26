import { Dictionary } from "../Collections";
import { EventBus } from "../Events/EventBus";
import { int } from "../float";
import { IntPtr } from "../Marshal";

let handleCount: int = 1;
export class Runtime {
    private static KSObjects: Dictionary<IntPtr, any> = new Dictionary();
    public static GetKernelObject(hwnd: IntPtr): any {
        if (Runtime.KSObjects.ContainsKey(hwnd)) {
            return Runtime.KSObjects.Get(hwnd);
        }
        return null;
    }
    public static AddKernelObject(hwnd: IntPtr, obj: any): void {
        Runtime.KSObjects.Add(hwnd, obj);
        EventBus.Default.fire('KSM_OBJECT_CREATED', { KernelObject: obj });
    }
    public static CreateKernelHandle(): IntPtr {
        return new IntPtr(handleCount);
    }
}
