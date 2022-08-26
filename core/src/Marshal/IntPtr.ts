import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { int } from "../float";
import { ClassInfo } from "../Reflection/Decorators/ClassInfo";
import { ISerializable } from "../serialization_/ISerializable";
import { System } from "../SystemTypes";

@ClassInfo({
    fullName: System.Types.IntPtr,
    instanceof: [
        System.Types.IntPtr,
    ]
})
export class IntPtr implements ISerializable {
    private m_value: int = 0;

    public static readonly Zero: IntPtr = new IntPtr(0);

    public static get Size(): int {
        return 4;
    }

    /*     static IntPtr(): this(0)
    {
        this(0);
    } */

    public constructor(value: int) {
        this.m_value = value;
    }

    serialize(): string {
        throw new Error("Method not implemented.");
    }

    public get IsZero(): boolean {
        return this.Equals(IntPtr.Zero);
    }

    /* public IntPtr(long value) {
        unsafe
        {
            this.m_value = (void*)(checked((int)value));
        }
    } */

    /*  [CLSCompliant(false)]
     public unsafe IntPtr(void* value) {
         this.m_value = value;
     } */

    /* private IntPtr(SerializationInfo info, StreamingContext context) {
        unsafe
        {
            long ınt64 = info.GetInt64("value");
            if (IntPtr.Size == 4 && (ınt64 > (long)2147483647 || ınt64 < (long) - 2147483648))
            {
                throw new ArgumentException(Environment.GetResourceString("Serialization_InvalidPtrValue"));
            }
            this.m_value = (void*)ınt64;
        }
    } */

    public Equals(obj: IntPtr): boolean {
        /*   if (!(obj is IntPtr))
          {
              return false;
          } */
        return this.m_value === obj.m_value;
    }

    public GetHashCode(): int {
        return this.m_value;
    }

    /*  public static bool operator == (IntPtr value1, IntPtr value2)
 {
     return value1.m_value == value2.m_value;
 }

         public static explicit operator IntPtr(int value)
 {
     return new IntPtr(value);
 }

         public static explicit operator IntPtr(long value)
 {
     return new IntPtr(value);
 }

 [CLSCompliant(false)]
         public static unsafe explicit operator IntPtr(void* value)
 {
     return new IntPtr(value);
 }

 [CLSCompliant(false)]
         public static unsafe explicit operator Void * (IntPtr value)
 {
     return value.ToPointer();
 }

         public static explicit operator Int32(IntPtr value)
 {
     return (int)value.m_value;
 }

         public static explicit operator Int64(IntPtr value)
 {
     return (long)((int)value.m_value);
 }

         public static bool operator != (IntPtr value1, IntPtr value2)
 {
     return value1.m_value != value2.m_value;
 } */

    public GetObjectData(info: any, context: any): void {
        if (info == null) {
            throw new ArgumentNullException("info");
        }
        info.AddValue("value", this.m_value);
    }

    public ToInt32(): int {
        return this.m_value;
    }
    public ToInt64(): int {
        return this.m_value;
    }

    /*public long ToInt64()
{
    return (long)((int)this.m_value);
}

[CLSCompliant(false)]
        public unsafe void* ToPointer()
{
    return this.m_value;
}
 */
    public ToString(): string {
        return this.m_value.toString();
    }
}

export class SafeFileHandle extends IntPtr {
    public constructor(value:IntPtr, safe: boolean = false) {
        super(value.ToInt32());
    }
}