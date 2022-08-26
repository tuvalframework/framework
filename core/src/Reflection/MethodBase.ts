import { ArgumentException, NotSupportedException } from "../Exceptions";
import { int } from "../float";
import { CultureInfo } from "../Globalization/CultureInfo";
import { IntPtr } from "../Marshal/IntPtr";
import { BindingFlags } from "./BindingFlags";
import { MemberInfo } from "./MemberInfo"
import { MethodImplAttributes } from "./MethodImplAttributes";
import { ParameterInfo } from "./ParameterInfo";
import { RuntimeMethodHandle } from "./RuntimeMethodHandle";
import { RuntimeTypeHandle } from "./RuntimeTypeHandle";
import { Type } from "./Type";
import { ArgumentOutOfRangeException } from '../Exceptions/ArgumentOutOfRangeException';
import { MethodAttributes } from "./MethodAttributes";
import { CallingConventions } from "./CallingConventions";
import { Exception } from "../Exception";
import { NotImplementedException } from '../Exceptions/NotImplementedException';

type Binder = any;
type MethodBody = any;
export abstract class MethodBase extends MemberInfo {

    public /* extern */ static GetCurrentMethod(): MethodBase {
        throw new NotImplementedException('');
    }

    public /* internal */ static GetMethodFromHandleNoGenericCheck(handle: RuntimeMethodHandle): MethodBase {
        return MethodBase.GetMethodFromIntPtr(handle.Value, IntPtr.Zero);
    }

    private static GetMethodFromIntPtr(handle: IntPtr, declaringType: IntPtr): MethodBase {
        if (handle == IntPtr.Zero)
            throw new ArgumentException("The handle is invalid.");
        const res: MethodBase = MethodBase.GetMethodFromHandleInternalType(handle, declaringType);
        if (res == null)
            throw new ArgumentException("The handle is invalid.");
        return res;
    }

    public static GetMethodFromHandle(handle: RuntimeMethodHandle): MethodBase;
    public static GetMethodFromHandle(handle: RuntimeMethodHandle, declaringType: RuntimeTypeHandle): MethodBase;
    public static GetMethodFromHandle(...args: any[]): MethodBase {
        if (args.length === 1) {
            const handle: RuntimeMethodHandle = args[0];
            const res: MethodBase = MethodBase.GetMethodFromIntPtr(handle.Value, IntPtr.Zero);
            const t: Type = res.DeclaringType;
            if (t.IsGenericType || t.IsGenericTypeDefinition)
                throw new ArgumentException("Cannot resolve method because it's declared in a generic class.");
            return res;
        } else if (args.length === 2) {
            const handle: RuntimeMethodHandle = args[0];
            const declaringType: RuntimeTypeHandle = args[1];
            return MethodBase.GetMethodFromIntPtr(handle.Value, declaringType.Value);
        }
        throw new ArgumentOutOfRangeException('');
    }

    private /* extern */ static GetMethodFromHandleInternalType(method_handle: IntPtr, type_handle: IntPtr): MethodBase {
        throw new NotImplementedException('');
    }

    public abstract GetMethodImplementationFlags(): MethodImplAttributes;

    public abstract GetParameters(): ParameterInfo[];

    //
    // This is a quick version for our own use. We should override
    // it where possible so that it does not allocate an array.
    // They cannot be abstract otherwise we break public contract
    //
    public /* internal */ /* virtual */  GetParametersInternal(): ParameterInfo[] {
        // Override me
        return this.GetParameters();
    }

    public /* internal virtual */  GetParametersCount(): int {
        // Override me
        return this.GetParametersInternal().length;
    }

    public /* internal virtual */  GetParameterType(pos: int): Type {
        throw new NotImplementedException('');
    }

    /*     public Invoke(obj: any, parameters: any[]): any {
            return this.Invoke(obj, 0, null, parameters, null);
        } */

    public abstract Invoke(obj: any, invokeAttr: BindingFlags, binder: Binder, parameters: any[], culture: CultureInfo): any;

    protected constructor() {
        super();
    }

    protected abstract Get_MethodHandle(): RuntimeMethodHandle;
    public get MethodHandle(): RuntimeMethodHandle {
        return this.Get_MethodHandle();
    }

    protected abstract Get_Attributes(): MethodAttributes;
    public get Attributes(): MethodAttributes {
        return this.Get_Attributes();
    }
    public /* virtual */ get CallingConvention(): CallingConventions {
        return CallingConventions.Standard;
    }
    public get IsPublic(): Boolean {
        return (this.Attributes & MethodAttributes.MemberAccessMask) === MethodAttributes.Public;
    }

    public get IsPrivate(): boolean {
        return (this.Attributes & MethodAttributes.MemberAccessMask) === MethodAttributes.Private;
    }
    public get IsFamily(): boolean {
        return (this.Attributes & MethodAttributes.MemberAccessMask) === MethodAttributes.Family;
    }
    public get IsAssembly(): boolean {
        return (this.Attributes & MethodAttributes.MemberAccessMask) === MethodAttributes.Assembly;
    }
    public get IsFamilyAndAssembly(): boolean {
        return (this.Attributes & MethodAttributes.MemberAccessMask) === MethodAttributes.FamANDAssem;
    }
    public get IsFamilyOrAssembly(): boolean {
        return (this.Attributes & MethodAttributes.MemberAccessMask) === MethodAttributes.FamORAssem;
    }
    public get IsStatic(): boolean {
        return (this.Attributes & MethodAttributes.Static) !== 0;
    }
    public get IsFinal(): boolean {
        return (this.Attributes & MethodAttributes.Final) !== 0;
    }
    public get IsVirtual(): boolean {
        return (this.Attributes & MethodAttributes.Virtual) !== 0;
    }
    public get IsHideBySig(): boolean {
        return (this.Attributes & MethodAttributes.HideBySig) !== 0;
    }

    public get IsAbstract(): boolean {
        return (this.Attributes & MethodAttributes.Abstract) !== 0;
    }
    public get IsSpecialName(): boolean {
        const attr: int = <int>this.Attributes;
        return (attr & MethodAttributes.SpecialName) !== 0;
    }

    public get IsConstructor(): boolean {
        const attr: int = this.Attributes;
        return ((attr & MethodAttributes.RTSpecialName) !== 0 && (this.Name === ".ctor"));
    }

    public /* internal virtual */  get_next_table_index(obj: any, table: int, inc: boolean): int {

        throw new Exception("Method is not a builder method");
    }

    public /* virtual */  GetGenericArguments(): Type[] {
        throw new NotSupportedException('');
    }

    public /* virtual */  get ContainsGenericParameters(): boolean {
        return false;
    }

    public /* virtual */ get IsGenericMethodDefinition(): boolean {
        return false;
    }

    public /* virtual */ get IsGenericMethod(): boolean {
        return false;
    }

    public /* internal extern */ static GetMethodBodyInternal(handle: IntPtr): MethodBody {
        throw new NotImplementedException('');
    }

    public /* internal */ static GetMethodBody(handle: IntPtr): MethodBody {
        return MethodBase.GetMethodBodyInternal(handle);
    }

    public /* virtual */  GetMethodBody(): MethodBody {
        throw new NotSupportedException('');
    }


    public /* override */  Equals(obj: any): boolean {
        return obj === this;
    }

}
