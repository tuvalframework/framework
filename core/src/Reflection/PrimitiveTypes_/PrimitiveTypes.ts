import { ArrayType } from "./ArrayType";
import { NumberType } from "./NumberType";
import { BooleanType } from "./BooleanType";
import { StringType } from "./StringType";
import { VoidType } from "./VoidType";

export class PrimitiveTypes {
    public static Array: ArrayType = new (ArrayType as any)();
    public static Number: NumberType = new (NumberType as any)();
    public static Boolean: BooleanType = new (BooleanType as any)();
    public static String: StringType = new (StringType as any)();
    public static Void: VoidType = new (VoidType as any)();
}