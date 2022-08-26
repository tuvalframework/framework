import { int, short, uint } from "../float";
import { IntPtr } from "../Marshal/IntPtr";
import { Out } from "../Out";
import { Guid } from "../uuid/Guid";
import { MemberTypes } from "./MemberTypes";
import { Type } from "./Type";

export interface _MemberInfo {
    Equals(other: any): boolean;
    GetCustomAttributes(inherit: boolean): any[];
    GetCustomAttributes(attributeType: Type, inherit: boolean): any[];
    GetHashCode(): int;
    GetType(): Type;
    IsDefined(attributeType: Type, inherit: boolean): boolean;
    ToString(): string;
    Get_DeclaringType(): Type;
    DeclaringType: Type;
    Get_MemberType(): MemberTypes;
    MemberType: MemberTypes;
    Get_Name(): string;
    Name: string;
    Get_ReflectedType(): Type;
    ReflectedType: Type;
    GetIDsOfNames(riid: Guid, rgszNames: IntPtr, cNames: uint, lcid: uint, rgDispId: IntPtr): void;
    GetTypeInfo(iTInfo: uint, lcid: uint, ppTInfo: IntPtr): void;
    GetTypeInfoCount(pcTInfo: Out<uint>): void;
    Invoke(dispIdMember: uint, riid: Guid, lcid: uint, wFlags: short, pDispParams: IntPtr, pVarResult: IntPtr, pExcepInfo: IntPtr, puArgErr: IntPtr): void;
}