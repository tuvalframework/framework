import { Type } from "./Type";
import { MethodInfo } from "./MethodInfo";
import { FieldInfo } from "./FieldInfo";
import { MemberTypes } from "./MemberTypes";
import { PropertyInfo } from "./PropertyInfo";
import { foreach } from "../foreach";
import { Assembly } from "./Assembly";
import { BindingFlags } from "./BindingFlags";
import { CallingConventions } from "./CallingConventions";
import { ConstructorInfo } from "./ConstructorInfo";
import { TypeAttributes } from "./TypeAttributes";


export interface InterfaceTypeConfig {
    baseType: Type;
    name: string;
    fullName: string;
    methods: MethodInfo[];
    fields: FieldInfo[];
}


export class InterfaceType extends Type {
    protected Set_FullName(value: string) {
        throw new Error("Method not implemented.");
    }
    protected Get_Assembly(): Assembly {
        throw new Error("Method not implemented.");
    }
    protected Get_AssemblyQualifiedName(): string {
        throw new Error("Method not implemented.");
    }
    protected Get_BaseType(): Type {
        throw new Error("Method not implemented.");
    }
    protected Get_FullName(): string {
        throw new Error("Method not implemented.");
    }
    protected Get_GUID(): string {
        throw new Error("Method not implemented.");
    }
    public Get_Namespace(): string {
        throw new Error("Method not implemented.");
    }
    protected GetConstructorImpl(bindingAttr: BindingFlags, binder: any, callConvention: CallingConventions, types: Type[], modifiers: any[]): ConstructorInfo {
        throw new Error("Method not implemented.");
    }
    protected Get_UnderlyingSystemType(): Type {
        throw new Error("Method not implemented.");
    }
    public GetInterfaces(): Type[] {
        throw new Error("Method not implemented.");
    }
    public GetElementType(): Type {
        throw new Error("Method not implemented.");
    }
    protected GetMethodImpl(name: string, bindingAttr: BindingFlags, binder: any, callConvention: CallingConventions, types: Type[], modifiers: any[]): MethodInfo {
        throw new Error("Method not implemented.");
    }
    protected GetPropertyImpl(name: string, bindingAttr: BindingFlags, binder: any, returnType: Type, types: Type[], modifiers: any[]) {
        throw new Error("Method not implemented.");
    }
    protected GetAttributeFlagsImpl(): TypeAttributes {
        throw new Error("Method not implemented.");
    }
    protected HasElementTypeImpl(): boolean {
        throw new Error("Method not implemented.");
    }
    protected IsArrayImpl(): boolean {
        throw new Error("Method not implemented.");
    }
    protected IsByRefImpl(): boolean {
        throw new Error("Method not implemented.");
    }
    protected IsCOMObjectImpl(): boolean {
        throw new Error("Method not implemented.");
    }
    protected IsPointerImpl(): boolean {
        throw new Error("Method not implemented.");
    }
    protected IsPrimitiveImpl(): boolean {
        throw new Error("Method not implemented.");
    }
    public Get_Name(): string {
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

    private myMethods: MethodInfo[] = [];
    private myFields: FieldInfo[] = [];
    public /*override*/ getMemberType(): MemberTypes {
        return MemberTypes.NestedType;
    }
    public constructor(config?: InterfaceTypeConfig) {
        super(/* {
            name: config ? config.name : String.Empty,
            baseType: config ? config.baseType : undefined as any,
            fullName: config ? config.fullName : String.Empty,
            isAbstract: false,
            isInterface: true,
            interfaces: undefined,
        } */);

        this.myMethods = this.myMethods || [];
        if (config) {
            foreach(config.methods, (obj: MethodInfo) => {
                this.myMethods.push(obj);
            });
        }

        this.myFields = this.myFields || [];
        if (config) {
            foreach(config.fields, (obj: FieldInfo) => {
                this.myFields.push(obj);
            });
        }
    }

    public GetProperty(name: string): PropertyInfo;
    public GetProperty(name: string, returnType: Type): PropertyInfo;
    public GetProperty(...args: any[]): PropertyInfo {
        return undefined as any;
    }
}