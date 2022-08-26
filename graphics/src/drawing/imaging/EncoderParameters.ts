import { IDisposable, New, int, IntPtr, Marshal } from '@tuval/core';
import { EncoderParameter } from './EncoderParameter';
export class EncoderParameters implements IDisposable {
    private parameters: EncoderParameter[] = null as any;

    public constructor();
    public constructor(count: int);
    public constructor(...args: any[]) {
        if (args.length === 0) {
            this.parameters = New.Array(1);
        } else if (args.length === 1) {
            this.parameters = New.Array(args[0]);
        }
    }


    public get Param(): EncoderParameter[] {
        return this.parameters;
    }

    public set Param(value: EncoderParameter[]) {
        this.parameters = value;
    }



    public Dispose(): void {
        // Nothing
        //GC.SuppressFinalize(this);
    }
    public /* internal */  ToNativePtr(): IntPtr {
        let result: IntPtr;
        let ptr: IntPtr;

        // 4 is the initial int32 "count" value
        result = Marshal.AllocHGlobal(4 + this.parameters.length * EncoderParameter.NativeSize());

        ptr = result;
        Marshal.WriteInt32(ptr, 0, this.parameters.length);

        ptr = new IntPtr(ptr.ToInt64() + 4);
        for (let i: int = 0; i < this.parameters.length; i++) {
            this.parameters[i].ToNativePtr(ptr);
            ptr = new IntPtr(ptr.ToInt64() + EncoderParameter.NativeSize());
        }

        return result;
    }

    /* The IntPtr passed in here is a blob returned from
     * GdipImageGetEncoderParameterList.  Its internal pointers
     * (i.e. the Value pointers in the EncoderParameter entries)
     * point to areas within this block of memeory; this means
     * that we need to free it as a whole, and also means that
     * we can't Marshal.PtrToStruct our way to victory.
     */
    public /* internal */ static FromNativePtr(epPtr: IntPtr): EncoderParameters {
        if (epPtr === IntPtr.Zero)
            return null as any;

        let ptr: IntPtr = epPtr;

        const count: int = Marshal.ReadInt32(ptr, 0);
        ptr = new IntPtr(ptr.ToInt64() + 4);

        if (count === 0)
            return null as any;

        const result: EncoderParameters = new EncoderParameters(count);

        for (let i: int = 0; i < count; i++) {
            result.parameters[i] = EncoderParameter.FromNativePtr(ptr);
            ptr = new IntPtr(ptr.ToInt64() + EncoderParameter.NativeSize());
        }

        return result;
    }
}