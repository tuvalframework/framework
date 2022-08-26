import {  MethodBase } from "./MethodBase";
import { MemberTypes } from "./MemberTypes";
import { Type } from "./Type";
import { ICustomAttributeProvider } from "./ICustomAttributeProvider";
import { ParameterInfo } from "./ParameterInfo";

/* export interface MethodInfoConfig extends MethodBaseConfig {
    returnType: Type;
} */
export abstract class MethodInfo extends MethodBase {

    public /*ovverride*/ getMemberType(): MemberTypes {
        return MemberTypes.Method;
    }

    //#region [Property] ReturnParameter
    private myReturnParameter: ParameterInfo = undefined as any;
    public get ReturnParameter(): ParameterInfo {
        return this.getReturnParameter();
    }
    protected getReturnParameter(): ParameterInfo {
        return this.myReturnParameter;
    }
    //#endregion

    //#region [Property] ReturnType
    private myReturnType: Type = undefined as any;
    public get ReturnType(): Type {
        return this.getReturnType();
    }
    protected getReturnType(): Type {
        return this.myReturnType;
    }
    //#endregion

    //#region [Property] ReturnTypeCustomAttributes
    public get ReturnTypeCustomAttributes(): ICustomAttributeProvider {
        return this.getReturnTypeCustomAttributes();
    }
    protected abstract getReturnTypeCustomAttributes(): ICustomAttributeProvider;
    //#endregion

    public constructor(/* config?: MethodInfoConfig */) {
        super(/* config */);
    }

}