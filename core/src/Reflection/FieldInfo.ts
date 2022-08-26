import { Type } from "./Type";
import {  MemberInfo } from "./MemberInfo";
import { FieldAttributes } from "./FieldAttributes";
import { MemberTypes } from "./MemberTypes";

/* export interface FieldInfoConfig extends MemberInfoConfig {
    isPublic: boolean;
    isPrivate: boolean;
    fieldType: Type;
} */

export class FieldInfo extends MemberInfo {
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
    //#region [Property] Attributes
    public get Attributes(): FieldAttributes {
        return this.getAttributes();
    }
    protected getAttributes(): FieldAttributes {
        return undefined as any;
    }
    //#endregion

    //#region [Property] FieldType
    private myFieldType: Type = undefined as any;
    public get FieldType(): Type {
        return this.getFieldType();
    }
    protected getFieldType(): Type {
        return this.myFieldType;
    }
    //#endregion

    //#region [Property] IsAssembly
    private myIsAssembly: boolean = false;
    public get IsAssembly(): boolean {
        return this.myIsAssembly;
    }
    //#endregion

    //#region [Property] IsFamily
    private myIsFamily: boolean = false;
    public get IsFamily(): boolean {
        return this.myIsFamily;
    }
    //#endregion

    //#region [Property] IsFamilyAndAssembly
    private myIsFamilyAndAssembly: boolean = false;
    public get IsFamilyAndAssembly(): boolean {
        return this.myIsFamilyAndAssembly;
    }
    //#endregion

    //#region [Property] IsFamilyOrAssembly
    private myIsFamilyOrAssembly: boolean = false;
    public get IsFamilyOrAssembly(): boolean {
        return this.myIsFamilyOrAssembly;
    }
    //#endregion

    //#region [Property] IsInitOnly
    private myIsInitOnly: boolean = false;
    public get IsInitOnly(): boolean {
        return this.myIsInitOnly;
    }
    //#endregion

    //#region [Property] IsLiteral
    private myIsLiteral: boolean = false;
    public get IsLiteral(): boolean {
        return this.myIsLiteral;
    }
    //#endregion

    //#region [Property] IsNotSerialized
    private myIsNotSerialized: boolean = false;
    public get IsNotSerialized(): boolean {
        return this.myIsNotSerialized;
    }
    //#endregion

    //#region [Property] IsPrivate
    private myIsPrivate: boolean = false;
    public get IsPrivate(): boolean {
        return this.myIsPrivate;
    }
    //#endregion

    //#region [Property] IsPublic
    private myIsPublic: boolean = false;
    public get IsPublic(): boolean {
        return this.myIsPublic;
    }
    //#endregion

    //#region [Property] MemberType

    protected /*override*/ getMemberType(): MemberTypes {
        return MemberTypes.Field;
    }
    //#endregion

    protected getDeclaringType(): Type {
        return this.getFieldType();
    }

    public constructor(/* config?: FieldInfoConfig */) {
        super(/* config */);
        /* if (config) {
            this.myIsPrivate = config.isPrivate;
            this.myIsPublic = config.isPublic;
            this.myFieldType = config.fieldType;
        } */
    }
}