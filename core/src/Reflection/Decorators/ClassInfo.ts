import { Type } from "../Type";
import { InterfaceType } from "../InterfaceType";
import { as } from "../../as";
import { Factory } from "./Factory";
import { System } from "../../SystemTypes";
import { Assembly } from "../Assembly";
import { BindingFlags } from "../BindingFlags";
import { CallingConventions } from "../CallingConventions";
import { ConstructorInfo } from "../ConstructorInfo";
import { TypeAttributes } from "../TypeAttributes";
import { MethodInfo } from "../MethodInfo";
import { PropertyInfo } from "../PropertyInfo";
import { MemberTypes } from "../MemberTypes";


export class ClassType extends Type {

    public GetHashCode(): number {
        const str = this.FullName;
        let h: number = (str as any).hash || 0;
        if (h === 0 && str.length > 0) {
            for (let i = 0; i < str.length; i++) {
                h = 31 * h + str.charCodeAt(i);
            }
            //this.hash = h;
        }
        return h;
    }
    protected Get_Assembly(): Assembly {
        return new Assembly();
    }
    protected Get_AssemblyQualifiedName(): string {
        throw new Error("Method not implemented.");
    }
    protected Get_BaseType(): Type {
        throw null;/* new Error("Method not implemented.") */
    }

    private m_FullName: string = '';
    protected Get_FullName(): string {
        return this.m_FullName;
    }
    protected Set_FullName(value: string) {
        this.m_FullName = value;
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
        return this;
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
    public target: any;
    private myMethods: MethodInfo[] = [];
    private myProperties: PropertyInfo[] = [];
    private myInterfaces: ClassType[] = [];

    public /*override*/ getMemberType(): MemberTypes {
        return MemberTypes.NestedType;
    }

    public get Interfaces(): ClassType[] {
        return this.myInterfaces;
    }

    public get Methods(): MethodInfo[] {
        return this.myMethods;
    }

    public get Properties(): PropertyInfo[] {
        return this.myProperties;
    }
    public constructor() {
        super();
        this.myMethods = this.myMethods || [];
        this.myProperties = this.myProperties || [];
        this.myInterfaces = this.myInterfaces || [];

        /*  super({
             name: config.name,
             baseType: config.baseType,
             fullName: config.fullName,
             isAbstract: config.isAbstract,
             isInterface: false,
             interfaces: config.interfaces,
         });

         this.myMethods = this.myMethods || new Collection<MethodInfo>();
         foreach(config.methods, (obj: MethodInfo) => {
             this.myMethods.add(obj);
         });

         this.myProperties = this.myProperties || new Collection<PropertyInfo>();
         foreach(config.properties, (obj: PropertyInfo) => {
             this.myProperties.add(obj);
         }) */
    }

    public GetProperty(name: string): PropertyInfo;
    public GetProperty(name: string, returnType: Type): PropertyInfo;
    public GetProperty(...args: any[]): PropertyInfo {
        if (args.length === 1) {
            const name: string = args[0];

            if (this.myProperties != null) {
                this.myProperties.forEach((p: PropertyInfo) => {
                    if (p.Name === name) {
                        return p;
                    }
                })
            }
        } else if (args.length === 2) {
            const name: string = args[0];
            const type: Type = args[1];

            if (this.myProperties != null) {
                this.myProperties.forEach((p: PropertyInfo) => {
                    if (p.Name === name && p.PropertyType) {
                        return p;
                    }
                })
            }
        }
        return undefined as any;
    }

    public getSimpleName(): string {
        return this.FullName.replace('Symbol(', '').replace(')', '');
    }

    public getName(): string {
        return this.getSimpleName();
    }
}

let types: { [key: string]: any } = {};
export function type(objName: string | Symbol | object): Type {
  if (!types) {
    types = <any>{};
  }
  if (objName instanceof Symbol || typeof objName === 'symbol') {
    if (types[objName.toString()]) {
      return types[objName.toString()];
    } else {
      const type = new ClassType();
      types[objName.toString()] = type;
      return type;
    }
  } else if (typeof objName === 'string') {
    if (types[objName]) {
      return types[objName];
    } else {
      const type = new ClassType();
      types[objName] = type;
      return type;
    }
  }  else if (typeof objName === 'object') {
    return objName.constructor['__type__'] as any;
  }
  return null as any;
}

export function typeOf(objName: string | Symbol | object): Type {
  return type(objName);
}

export interface ClassTypeConfig {
    baseType?: Type;
    name?: string;
    fullName?: Symbol;
    implements?: InterfaceType[],
    instanceof?: Symbol[],
    package?: string
}



export function anonymousClassNew(config: ClassTypeConfig, aClass: any) {
    const a = ClassInfo(config);
    const classObject = aClass;
    a(aClass);
    return new aClass();
}
export function ClassInfo(config: ClassTypeConfig) {
    return (target: any) => {

        try {
            if (target) {
                if (Array.isArray(target['__instanceof__'])) {
                    const array: Symbol[] = target['__instanceof__'];
                    target['__instanceof__'] = [];
                    target['__instanceof__'].push(...array);
                    target['__instanceof__'].push(...config.instanceof as any);
                } else {
                    target['__instanceof__'] = config.instanceof;
                }
            }
        } catch (e) {
            console.log('Type oluşturulamadı.' + e);
        }

        const classType: ClassType = <any>type(config.fullName as any);
        classType.target = target;
        if (classType != null) {
           classType.FullName = config.fullName!.toString();
           /*   classType.Name = config.name as any;
            classType.IsAbstract = false; */
        }
        target['__type__'] = classType;
        target['class'] = classType;
        target.prototype.GetTypeInternal = () =>{
            return target['__type__'];
        }

    }
}

export function ClassInfoInline(config: ClassTypeConfig, target: any) {
    try {
        if (target) {
            if (Array.isArray(target['__instanceof__'])) {
                const array: Symbol[] = target['__instanceof__'];
                target['__instanceof__'] = [];
                target['__instanceof__'].push(...array);
                target['__instanceof__'].push(...config.instanceof as any);
            } else {
                target['__instanceof__'] = config.instanceof;
            }
        }
    } catch (e) {
        console.log('Type oluşturulamadı.' + e);
    }

    const classType: ClassType = <any>type(config.fullName as any);
    classType.target = target;
    if (classType != null) {
        classType.FullName =  config.fullName!.toString();
        /* classType.Name = config.name as any;
        classType.IsAbstract = false;  */
    }
    target['__type__'] = classType;
    target['class'] = classType;
}

export function sealed() {
    return (target: any) => {
        Object.freeze(target);
    }
}

/* export function sealed(constructor: Function) {
    Object.seal(constructor);
    Object.seal(constructor.prototype);
} */

export function AbstractClass(config: ClassTypeConfig) {
    return (target: any) => {

        const classType: ClassType = as(type(target), System.Types.Reflection.ClassType);
        if (classType != null) {
            //classType.Name = config.name as any;
            //classType.IsAbstract = true;
        }

    }
}

export function Implements(...interfaceTypes: Type[]) {
    return (target: any) => {

        const classType: ClassType = as(type(target), System.Types.Reflection.ClassType);
        if (classType != null) {

            /*   foreach(interfaceTypes as any, (obj: ClassType) => {
                  classType.Interfaces.push(obj);
              }); */
        }

    }
}

export function Internal(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    /* return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    } */
}

export function Override(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    /* return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    } */
}
export function Virtual(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
   /*  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    } */
}


export function Package(packageName: any) {
    return (target: any) => {
    }
}


export interface MethodConfig {
    name?: string
    returnType: Type;
}
export function PublicMethod(config: MethodConfig) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {

        const classType: ClassType = as(type(target), System.Types.Reflection.ClassType);
        if (classType != null) {
            config.name = config.name || propertyKey;
           /*  classType.Methods.push(new PublicMethodInfo({
                name: config.name,
                returnType: config.returnType
            })); */
        }

    }
}

export function PrivateMethod(config: MethodConfig) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {

        const classType: ClassType = as(type(target), System.Types.Reflection.ClassType);
        if (classType != null) {
            config.name = config.name || propertyKey;
           /*  classType.Methods.push(new PrivateMethodInfo({
                name: config.name,
                returnType: config.returnType
            })); */
        }

    }
}

export function ProtectedMethod(config: MethodConfig) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {

        const classType: ClassType = as(type(target), System.Types.Reflection.ClassType);
        if (classType != null) {
            config.name = config.name || propertyKey;
           /*  classType.Methods.push(new ProtectedMethodInfo({
                name: config.name,
                returnType: config.returnType
            })); */
        }

    }

}

export function Property(propertyType: Type) {
    return (target: any /* Constructor<any> */, propertyKey: string, descriptor: PropertyDescriptor) => {

        const classType: ClassType = as(type(target), System.Types.Reflection.ClassType);
        if (classType != null) {

           /*  classType.Properties.push(new PropertyInfo({
                name: propertyKey,
                canRead: descriptor.get !== undefined,
                canWrite: descriptor.set !== undefined,
                getMethod: <any>descriptor.get,
                setMethod: <any>descriptor.set,
                propertyType: propertyType
            })); */
        }
    }
}

export function addGetterSetter<T>(defaultValue?: T, validator?: Function, after?: Function) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        Factory.addGetterSetter(target, propertyKey.toLowerCase(), defaultValue, validator, after);

    }
}

