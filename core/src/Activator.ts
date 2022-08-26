import { ClassType } from "./Reflection/Decorators/ClassInfo";
import { Type } from "./Reflection/Type";

export class Activator {
    public static CreateInstance<T>(type: Type): T {
        if (type instanceof ClassType && type.target) {
            return new type.target();
        }
        return null as any;
    }
}