import { Type } from "./Type";
import { MethodInfo } from "./MethodInfo";
import { MemberTypes } from "./MemberTypes";
import { ICustomAttributeProvider } from "./ICustomAttributeProvider";
import { MethodAttributes } from "./MethodAttributes";
import { CultureInfo } from "../Globalization";
import { BindingFlags } from "./BindingFlags";
import { MethodImplAttributes } from "./MethodImplAttributes";
import { ParameterInfo } from "./ParameterInfo";
import { RuntimeMethodHandle } from "./RuntimeMethodHandle";

namespace Tuval.Reflection {

    export interface GenericPublicMethodConfig {
        name: string
        returnType: Type;
        isAbstract: boolean;
        isVirtual: boolean;
    }

    export class GenericPublicMethodInfo extends MethodInfo {
        public GetMethodImplementationFlags(): MethodImplAttributes {
            throw new Error("Method not implemented.");
        }
        public GetParameters(): ParameterInfo[] {
            throw new Error("Method not implemented.");
        }
        public Invoke(obj: any, invokeAttr: BindingFlags, binder: any, parameters: any[], culture: CultureInfo) {
            throw new Error("Method not implemented.");
        }
        protected Get_MethodHandle(): RuntimeMethodHandle {
            throw new Error("Method not implemented.");
        }
        protected Get_Attributes(): MethodAttributes {
            throw new Error("Method not implemented.");
        }
        public Get_DeclaringType(): Type {
            throw new Error("Method not implemented.");
        }
        protected Get_MemberType(): MemberTypes {
            throw new Error("Method not implemented.");
        }
        public Get_Name(): string {
            throw new Error("Method not implemented.");
        }
        protected Get_ReflectedType(): Type {
            throw new Error("Method not implemented.");
        }
        public IsDefined(attributeType: Type, inherit: boolean): boolean {
            throw new Error("Method not implemented.");
        }
        public GetCustomAttributes(inherit: boolean): any[];
        public GetCustomAttributes(attributeType: Type, inherit: boolean): any[];
        public GetCustomAttributes(attributeType: any, inherit?: any): any[] {
            throw new Error("Method not implemented.");
        }
        protected dispose(disposing: boolean): void {
            throw new Error("Method not implemented.");
        }
        protected getReturnTypeCustomAttributes(): ICustomAttributeProvider {
            throw new Error("Method not implemented.");
        }
        protected getAttributes(): MethodAttributes {
            throw new Error("Method not implemented.");
        }
        protected getIsSecurityCritical(): boolean {
            throw new Error("Method not implemented.");
        }
        protected getMethodHandle() {
            throw new Error("Method not implemented.");
        }
        protected getDeclaringType(): Type {
            throw new Error("Method not implemented.");
        }

        public /*override*/ getMemberType(): MemberTypes {
            return MemberTypes.Method;
        }
        public constructor(config?: GenericPublicMethodConfig) {
            super(/* {
                name: config ? config.name : String.Empty,
                isPrivate: false,
                isPublic: true,
                isAbstract: config ? config.isAbstract : false,
                isConstructor: false,
                isGenericMethod: true,
                isVirtual: config ? config.isVirtual : false,
                returnType: config ? config.returnType : undefined as any,
                isStatic: false
            } */);
        }
    }

}