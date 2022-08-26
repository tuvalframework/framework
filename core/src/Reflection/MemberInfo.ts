import { TObject } from "../Extensions";
import { int, short, uint } from "../float";
import { ICustomAttributeProvider } from "./ICustomAttributeProvider";
import { MemberTypes } from "./MemberTypes";
import { Type } from "./Type";

export abstract class MemberInfo  implements ICustomAttributeProvider {
    protected constructor() {
    }
    isDefined(attributeType: Type, inherit: boolean): boolean {
        throw new Error("Method not implemented.");
    }

    public abstract Get_DeclaringType(): Type;
    public get DeclaringType(): Type {
        return this.Get_DeclaringType();
    }
    protected abstract Get_MemberType(): MemberTypes;
    public get MemberType(): MemberTypes {
        return this.Get_MemberType();
    }

    public abstract Get_Name(): string;
    public get Name(): string {
        return this.Get_Name();
    }

    protected abstract Get_ReflectedType(): Type;
    public get ReflectedType(): Type {
        return this.Get_ReflectedType();
    }

    protected Get_Module(): any/* Module */ {
        return this.DeclaringType.Module;
    }
    public get Module(): any/* Module */ {
        return this.Get_Module();
    }

    public abstract IsDefined(attributeType: Type, inherit: boolean): boolean;

    public abstract GetCustomAttributes(inherit: boolean): any[];

    public abstract GetCustomAttributes(attributeType: Type, inherit: boolean): any[];

    public get MetadataToken(): int {
        return 0;
    }

    public Equals(obj: any): boolean {
        return obj === this;
    }

    public GetHashCode(): int {
        throw 'yok.';
    }

    /*  public static bool operator == (MemberInfo left, MemberInfo right)
 {
     if ((object)left == (object)right)
     return true;
     if ((object)left == null ^ (object)right == null)
     return false;
     return left.Equals(right);
 }

             public static bool operator != (MemberInfo left, MemberInfo right)
 {
     if ((object)left == (object)right)
     return false;
     if ((object)left == null ^ (object)right == null)
     return true;
     return !left.Equals(right);
 }

             public virtual IList < CustomAttributeData > GetCustomAttributesData() {
     throw new NotImplementedException();
 }
     #endif
  */
    public GetIDsOfNames(riid: string, rgszNames: any, cNames: uint, lcid: uint, rgDispId: any): void {
        throw 'new NotImplementedException("")';
    }

    /* public GetType(): Type {
        return super.GetType();
    } */

    public GetTypeInfo(iTInfo: uint, lcid: uint, ppTInfo: any): void {
        throw 'new NotImplementedException("")';
    }

    public GetTypeInfoCount(pcTInfo: any/* Out<uint> */): void {
        throw 'new NotImplementedException("")';
    }

    public Invoke_(dispIdMember: uint, riid: string, lcid: uint, wFlags: short, pDispParams: any, pVarResult: any, pExcepInfo: any, puArgErr: any): void {
        throw 'new NotImplementedException("")';
    }
}