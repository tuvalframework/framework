import { Type } from "./Type";
import {  MemberInfo } from "./MemberInfo";
import { MethodInfo } from "./MethodInfo";
import { PropertyAttributes } from "./PropertyAttributes";
import { MemberTypes } from "./MemberTypes";
import { NotImplementedException } from "../Exceptions";

/* export interface PropertyInfoConfig extends MemberInfoConfig {
    canRead: boolean;
    canWrite: boolean;
    getMethod: MethodInfo;
    setMethod: MethodInfo;
    propertyType: Type;

} */
export class PropertyInfo extends MemberInfo {
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

    private myCanRead: boolean = false;
    private myCanWrite: boolean = false;
    //#region [Property] Attributes
    public get Attributes(): PropertyAttributes {
        return this.getAttributes();
    }
    protected getAttributes(): PropertyAttributes {
        throw new NotImplementedException('getAttributes');
    }
    //#endregion

    //#region [Property] CanRead
    public get CanRead(): boolean {
        return this.getCanRead();
    }
    protected getCanRead(): boolean {
        return this.myCanRead;
    }
    //#endregion

    //#region [Property] CanWrite
    public get CanWrite(): boolean {
        return this.getCanWrite();
    }
    protected getCanWrite(): boolean {
        return this.myCanWrite;
    }
    //#endregion

    //#region [Property] GetMethod
    private myGetMethod: MethodInfo = null as any;
    public get GetMethod(): MethodInfo {
        return this.getGetMethod();
    }
    protected /*virtual*/ getGetMethod(): MethodInfo {
        return this.myGetMethod;
    }
    //#endregion

    //#region [Property] IsSpecialName
    private myIsSpecialName: boolean = false;
    public get IsSpecialName(): boolean {
        return this.myIsSpecialName;
    }
    //#endregion

    //#region [Property] MemberType

    protected /*override*/ getMemberType(): MemberTypes {
        return MemberTypes.Property;
    }
    //#endregion

    //#region [Property] PropertyType
    private myPropertyType: Type = null as any;
    public get PropertyType(): Type {
        return this.getPropertyType();
    }
    protected getPropertyType(): Type {
        return this.myPropertyType;
    }
    //#endregion

    //#region [Property] SetMethod
    private mySetMethod: MethodInfo = null as any;
    public get SetMethod(): MethodInfo {
        return this.getSetMethod();
    }
    protected /*virtual*/ getSetMethod(): MethodInfo {
        return this.mySetMethod;
    }
    //#endregion

    //#region [Property] DeclaringType

    protected getDeclaringType(): Type {
        return this.getPropertyType();
    }

    //#endregion



    public constructor(/* config?: PropertyInfoConfig */) {
        super(/* config */);
     /*    this.myCanRead = config ? config.canRead : true;
        this.myCanWrite = config ? config.canWrite : true;
        this.myGetMethod = config ? config.getMethod : undefined as any;
        this.mySetMethod = config ? config.setMethod : undefined as any;
        this.myPropertyType = config ? config.propertyType : undefined as any; */
    }
}