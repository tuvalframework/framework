import { Enum } from "../Enum";
import { char, int } from "../float";
import { Out } from "../Out";
import { Assembly } from "./Assembly";
import { BindingFlags } from "./BindingFlags";
import { CallingConventions } from "./CallingConventions";
import { ConstructorInfo } from "./ConstructorInfo";
import { MemberFilter } from "./MemberFilter";
import { MemberTypes } from "./MemberTypes";
import { MethodBase } from "./MethodBase";
import { TypeAttributes } from "./TypeAttributes";
import { System } from '../SystemTypes';
import { TypeCode } from "../TypeCode";
import { TypeLoadException } from "./TypeLoadException";
import { RuntimeTypeHandle } from "./RuntimeTypeHandle";
import { TypeFilter } from "./TypeFilter";
import { FieldInfo } from "./FieldInfo";
import { MemberInfo } from "./MemberInfo";

declare var MonoEnumInfo, SerializableAttribute, ComImportAttribute, Binder, DefaultMemberAttribute, typeOf, NotImplementedException, ArgumentOutOfRangeException, InvalidFilterCriteriaException,
IndexOutOfRangeException,ArgumentException, ArgumentNullException, InvalidOperationException, NotSupportedException, MethodInfo;

type InterfaceMapping = any;
type EventInfo = any;
type Binder = any;
type ParameterModifier = any;
type CultureInfo = any;
type GenericParameterAttributes = any;
type PropertyInfo = any;
type DefaultMemberAttribute = any;
type MethodInfo = any;


export class Missing {
    public static readonly Value: Missing = new Missing();

    public /* internal */ constructor() { }
}

export abstract class Type extends MemberInfo {
    public static hasMemberOfType<T>(...args: any[]): boolean {
        throw new NotImplementedException('');
    }
    public static hasMethod<T>(...args: any[]): boolean {
        throw new NotImplementedException('');
    }
    public static hasMember<T>(...args: any[]): boolean {
        throw new NotImplementedException('');
    }


    public static UNDEFINED = null as any;
    public static FUNCTION = 'function';
    public static STRING = 'string';
    public static BOOLEAN = 'boolean';
    public static NUMBER = 'number';
    public static OBJECT = 'object';

    public /* internal */  _impl: RuntimeTypeHandle = null as any;

    public static readonly Delimiter: char = '.'.charCodeAt(0);
    public static readonly EmptyTypes: Type[] = [];
    public static readonly FilterAttribute: MemberFilter = new MemberFilter(Type.FilterAttribute_impl);
    public static readonly FilterName: MemberFilter = new MemberFilter(Type.FilterName_impl);
    public static readonly FilterNameIgnoreCase: MemberFilter = new MemberFilter(Type.FilterNameIgnoreCase_impl);
    public static readonly Missing: any = Missing.Value;

    public static readonly/* internal */   DefaultBindingFlags: BindingFlags = BindingFlags.Public | BindingFlags.Static | BindingFlags.Instance;

    /* implementation of the delegates for MemberFilter */
    private static FilterName_impl(m: MemberInfo, filterCriteria: any): boolean {
        const name: string = typeof filterCriteria === 'string' ? filterCriteria : null as any;
        if (name == null || name.length === 0)
            return false; // because m.Name cannot be null or empty

        if (name[name.length - 1] === '*')
            return m.Name.startsWith(name.substring(0, name.length - 1));

        return m.Name == name;
    }

    private static FilterNameIgnoreCase_impl(m: MemberInfo, filterCriteria: any): boolean {
        const name: string = typeof filterCriteria === 'string' ? filterCriteria : null as any;
        if (name == null || name.length === 0)
            return false; // because m.Name cannot be null or empty

        if (name[name.length - 1] === '*')
            return m.Name.startsWith(name.substring(0, name.length - 1));

        return m.Name === name;
    }

    private static FilterAttribute_impl(m: MemberInfo, filterCriteria: any): boolean {
        if (!(typeof filterCriteria === 'number'))
            throw new InvalidFilterCriteriaException("Int32 value is expected for filter criteria");

        throw new InvalidFilterCriteriaException("Int32 value is expected for filter criteria");
        /*  const flags:int = filterCriteria;
         if (m instanceof MethodInfo)
         return (m.Attributes & flags) !== 0;
         if (m instanceof FieldInfo)
         return ((int)((FieldInfo)m).Attributes & flags) != 0;
         if (m is PropertyInfo)
         return ((int)((PropertyInfo)m).Attributes & flags) != 0;
         if (m is EventInfo)
         return ((int)((EventInfo)m).Attributes & flags) != 0; */
        return false;
    }

    protected constructor() {
        super();
    }

    protected abstract Get_Assembly(): Assembly;
    public get Assembly(): Assembly {
        return this.Get_Assembly();
    }

    protected abstract Get_AssemblyQualifiedName(): string;
    public get AssemblyQualifiedName(): string {
        return this.Get_AssemblyQualifiedName();
    }


    public get Attributes(): TypeAttributes {
        return this.GetAttributeFlagsImpl();
    }

    protected abstract Get_BaseType(): Type;
    public get BaseType(): Type {
        return this.Get_BaseType();
    }

    public Get_DeclaringType(): Type {
        return null as any;
    }

    /// <summary>
    ///
    /// </summary>
    public static get DefaultBinder(): Binder {
        return Binder.DefaultBinder;
    }

    protected abstract Get_FullName(): string;
    public get FullName(): string {
        return this.Get_FullName();
    }
    protected abstract Set_FullName(value: string);
    public set FullName(value: string) {
        this.Set_FullName(value);
    }

    protected abstract Get_GUID(): string;
    public get GUID(): string {
        return this.Get_GUID();
    }


    public get HasElementType(): boolean {
        return this.HasElementTypeImpl();
    }

    public get IsAbstract(): boolean {
        return (this.Attributes & TypeAttributes.Abstract) !== 0;
    }

    public get IsAnsiClass(): boolean {
        return (this.Attributes & TypeAttributes.StringFormatMask) === TypeAttributes.AnsiClass;
    }

    public get IsArray(): boolean {
        return this.IsArrayImpl();
    }

    public get IsAutoClass(): boolean {
        return (this.Attributes & TypeAttributes.StringFormatMask) === TypeAttributes.AutoClass;
    }

    public get IsAutoLayout(): boolean {
        return (this.Attributes & TypeAttributes.LayoutMask) === TypeAttributes.AutoLayout;
    }

    public get IsByRef(): boolean {
        return this.IsByRefImpl();
    }

    public get IsClass(): boolean {
        if (this.IsInterface)
            return false;

        return !this.IsValueType;
    }

    public get IsCOMObject(): boolean {
        return this.IsCOMObjectImpl();
    }

    public get IsConstructedGenericType(): boolean {
        throw new NotImplementedException('');
    }

    public get IsContextful(): boolean {
        return this.IsContextfulImpl();
    }

    public get IsEnum(): boolean {
        return this.IsSubclassOf(typeOf(Enum));
    }

    public get IsExplicitLayout(): boolean {
        return (this.Attributes & TypeAttributes.LayoutMask) === TypeAttributes.ExplicitLayout;
    }

    public get IsImport(): boolean {
        return (this.Attributes & TypeAttributes.Import) !== 0;
    }

    public get IsInterface(): boolean {
        return (this.Attributes & TypeAttributes.ClassSemanticsMask) === TypeAttributes.Interface;
    }

    public get IsLayoutSequential(): boolean {
        return (this.Attributes & TypeAttributes.LayoutMask) === TypeAttributes.SequentialLayout;
    }

    public get IsMarshalByRef(): boolean {
        return this.IsMarshalByRefImpl();
    }

    public get IsNestedAssembly(): boolean {
        return (this.Attributes & TypeAttributes.VisibilityMask) === TypeAttributes.NestedAssembly;
    }

    public get IsNestedFamANDAssem(): boolean {
        return (this.Attributes & TypeAttributes.VisibilityMask) === TypeAttributes.NestedFamANDAssem;
    }

    public get IsNestedFamily(): boolean {
        return (this.Attributes & TypeAttributes.VisibilityMask) === TypeAttributes.NestedFamily;
    }

    public get IsNestedFamORAssem(): boolean {
        return (this.Attributes & TypeAttributes.VisibilityMask) === TypeAttributes.NestedFamORAssem;
    }

    public get IsNestedPrivate(): boolean {
        return (this.Attributes & TypeAttributes.VisibilityMask) === TypeAttributes.NestedPrivate;
    }

    public get IsNestedPublic(): boolean {
        return (this.Attributes & TypeAttributes.VisibilityMask) === TypeAttributes.NestedPublic;
    }

    public get IsNotPublic(): boolean {
        return (this.Attributes & TypeAttributes.VisibilityMask) === TypeAttributes.NotPublic;
    }

    public get IsPointer(): boolean {
        return this.IsPointerImpl();
    }

    public get IsPrimitive(): boolean {
        return this.IsPrimitiveImpl();
    }

    public get IsPublic(): boolean {
        return (this.Attributes & TypeAttributes.VisibilityMask) == TypeAttributes.Public;
    }

    public get IsSealed(): boolean {
        return (this.Attributes & TypeAttributes.Sealed) !== 0;
    }

    public get IsSerializable(): boolean {
        if ((this.Attributes & TypeAttributes.Serializable) !== 0)
            return true;

        // Enums and delegates are always serializable

        let type: Type = this.UnderlyingSystemType;
        if (type == null)
            return false;

        // Fast check for system types
        if (type.IsSystemType)
            return Type.type_is_subtype_of(type, typeOf(Enum), false) || Type.type_is_subtype_of(type, typeOf(System.Types.Delegate), false);

        // User defined types depend on this behavior
        do {
            if ((type === typeOf(Enum)) || (type === typeOf(System.Types.Delegate)))
                return true;

            type = type.BaseType;
        } while (type != null);

        return false;
    }


    public get IsSpecialName(): boolean {
        return (this.Attributes & TypeAttributes.SpecialName) !== 0;
    }

    public get IsUnicodeClass(): boolean {
        return (this.Attributes & TypeAttributes.StringFormatMask) === TypeAttributes.UnicodeClass;
    }

    public get IsValueType(): boolean {
        return this.IsValueTypeImpl();
    }


    protected Get_MemberType(): MemberTypes {
        return MemberTypes.TypeInfo;
    }


    public abstract Get_Namespace(): string;
    public get Namespace(): string {
        return this.Get_Namespace();
    }

    protected Get_ReflectedType(): Type {
        return null as any;
    }

    public /* override */ get TypeHandle(): RuntimeTypeHandle {
        throw new ArgumentException("Derived class must provide implementation.");
    }

    public get TypeInitializer(): ConstructorInfo {
        return this.GetConstructorImpl(
            BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Static,
            null,
            CallingConventions.Any,
            Type.EmptyTypes, null as any);
    }

    protected abstract GetConstructorImpl(bindingAttr: BindingFlags, binder: Binder, callConvention: CallingConventions, types: Type[], modifiers: ParameterModifier[]): ConstructorInfo;
    /*
     * This has NOTHING to do with getting the base type of an enum. Use
     * Enum.GetUnderlyingType () for that.
     */
    protected abstract Get_UnderlyingSystemType(): Type;
    public get UnderlyingSystemType(): Type {
        return this.Get_UnderlyingSystemType();
    }


    public /* virtual */  Equals(o: Type): boolean {
        if (o === this)
            return true;
        if (o == null)
            return false;
        const me: Type = this.UnderlyingSystemType;
        if (me == null)
            return false;

        o = o.UnderlyingSystemType;
        if (o == null)
            return false;
        if (o === this)
            return true;
        return me.EqualsInternal(o);
    }


    public /* virtual */  GetEnumUnderlyingType(): Type {
        if (!this.IsEnum)
            throw new ArgumentException("Type is not an enumeration", "enumType");

        var fields = this.GetFields(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance);

        if (fields == null || fields.length != 1)
            throw new ArgumentException("An enum must have exactly one instance field", "enumType");

        return fields[0].FieldType;
    }

    public /* virtual */  GetEnumNames(): string[] {
        if (!this.IsEnum)
            throw new ArgumentException("Type is not an enumeration", "enumType");

        var fields = this.GetFields(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Static);

        const names: string[] = new Array(fields.length);
        if (0 !== names.length) {
            for (let i: int = 0; i < fields.length; ++i)
                names[i] = fields[i].Name;

            var et = this.GetEnumUnderlyingType();
            var values = (Array as any).CreateInstance(et, names.length);
            for (let i: int = 0; i < fields.length; ++i)
                values.SetValue((fields[i] as any).GetValue(null), i);
            MonoEnumInfo.SortEnums(et, values, names);
        }
        return names;
    }

    private static CreateNIE(): any {
        return new NotImplementedException('');
    }

    public /* virtual */  GetEnumValues(): Array<any> {
        if (!this.IsEnum)
            throw new ArgumentException("Type is not an enumeration", "enumType");

        throw Type.CreateNIE();
    }

    private IsValidEnumType(type: Type): boolean {
        return (type.IsPrimitive && type !== typeOf(System.Types.Primitives.Boolean) && type != typeOf(System.Types.Primitives.Double) && type !== typeOf(System.Types.Primitives.Float)) || type.IsEnum;
    }

    public /* virtual */  GetEnumName(value: any): string {
        if (value == null)
            throw new ArgumentException("Value is null", "value");
        if (!this.IsValidEnumType(value.GetType()))
            throw new ArgumentException("Value is not the enum or a valid enum underlying type", "value");
        if (!this.IsEnum)
            throw new ArgumentException("Type is not an enumeration", "enumType");

        let obj: any = null;
        var fields = this.GetFields(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Static);

        for (let i: int = 0; i < fields.length; ++i) {
            var fv = (fields[i] as any).GetValue(null);
            if (obj == null) {
                try {
                    //XXX we can't use 'this' as argument as it might be an UserType
                    obj = (Enum as any).ToObject(fv.GetType(), value);
                } catch (InvalidCastException) {
                    throw new ArgumentException("Value is not valid", "value");
                }
            }
            if (fv.Equals(obj))
                return fields[i].Name;
        }

        return null as any;
    }

    public /* virtual */  IsEnumDefined(value: any): boolean {
        if (value == null)
            throw new ArgumentException("Value is null", "value");
        if (!this.IsEnum)
            throw new ArgumentException("Type is not an enumeration", "enumType");

        const vt: Type = value.GetType();
        if (!this.IsValidEnumType(vt) && vt !== typeOf(System.Types.Primitives.String))
            throw new InvalidOperationException("Value is not the enum or a valid enum underlying type");

        var fields = this.GetFields(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Static);

        if (typeof value === 'string') {
            for (let i: int = 0; i < fields.length; ++i) {
                if (fields[i].Name === value)
                    return true;
            }
        } else {
            if (vt !== this && vt !== this.GetEnumUnderlyingType())
                throw new ArgumentException("Value is not the enum or a valid enum underlying type", "value");

            let obj: any = null;
            for (let i: int = 0; i < fields.length; ++i) {
                var fv = (fields[i] as any).GetValue(null);
                if (obj == null) {
                    try {
                        //XXX we can't use 'this' as argument as it might be an UserType
                        obj = (Enum as any).ToObject(fv.GetType(), value);
                    } catch (InvalidCastException) {
                        throw new ArgumentException("Value is not valid", "value");
                    }
                }
                if (fv.Equals(obj))
                    return true;
            }
        }
        return false;
    }

    /* public static GetType(typeName: string, assemblyResolver: Func<AssemblyName, Assembly>, typeResolver: Func<Assembly, string, bool, Type>): Type {
        return GetType(typeName, assemblyResolver, typeResolver, false, false);
    }

    public static Type GetType(string typeName, Func <AssemblyName, Assembly > assemblyResolver, Func < Assembly, string, bool, Type > typeResolver, bool throwOnError)
{
    return GetType(typeName, assemblyResolver, typeResolver, throwOnError, false);
}

        public static Type GetType(string typeName, Func < AssemblyName, Assembly > assemblyResolver, Func < Assembly, string, bool, Type > typeResolver, bool throwOnError, bool ignoreCase)
{
    TypeSpec spec = TypeSpec.Parse(typeName);
    return spec.Resolve(assemblyResolver, typeResolver, throwOnError, ignoreCase);
} */

    public /* virtual */ get IsSecurityTransparent(): boolean {
        throw Type.CreateNIE();
    }

    public /* virtual */ get IsSecurityCritical(): boolean {
        throw Type.CreateNIE();
    }

    public /* virtual */ get IsSecuritySafeCritical(): boolean {
        throw Type.CreateNIE();
    }

    public/* internal */   EqualsInternal(type: Type): boolean {
        throw new NotImplementedException('');
    }

    private static /* extern */  internal_from_handle(handle: number): Type {
        throw new NotImplementedException('');
    }

    private static /* extern */  internal_from_name(name: string, throwOnError: boolean, ignoreCase: boolean): Type {
        throw new NotImplementedException('');
    }

    public static GetType(typeName: string): Type;
    public static GetType(typeName: string, throwOnError: boolean): Type;
    public static GetType(typeName: string, throwOnError: boolean, ignoreCase: boolean): Type;
    public static GetType(...args: any[]): Type {
        if (args.length === 1) {
            const typeName: string = args[0];
            if (typeName == null)
                throw new ArgumentNullException("TypeName");

            return Type.internal_from_name(typeName, false, false);
        } else if (args.length === 2) {
            const typeName: string = args[0];
            const throwOnError: boolean = args[1];
            if (typeName == null)
                throw new ArgumentNullException("TypeName");

            const type: Type = Type.internal_from_name(typeName, throwOnError, false);
            if (throwOnError && type == null)
                throw new TypeLoadException("Error loading '" + typeName + "'");

            return type;
        } else if (args.length === 3) {
            const typeName: string = args[0];
            const throwOnError: boolean = args[1];
            const ignoreCase: boolean = args[2];
            if (typeName == null)
                throw new ArgumentNullException("TypeName");

            const t: Type = Type.internal_from_name(typeName, throwOnError, ignoreCase);
            if (throwOnError && t == null)
                throw new TypeLoadException("Error loading '" + typeName + "'");

            return t;
        }
        throw new ArgumentOutOfRangeException('');
    }

    public static GetTypeArray(args: any[]): Type[] {
        if (args == null)
            throw new ArgumentNullException("args");

        let ret: Type[];
        ret = new Array(args.length);
        for (let i: int = 0; i < args.length; ++i)
            ret[i] = args[i].GetType();
        return ret;
    }

    public /* internal extern */ static GetTypeCodeInternal(type: Type): TypeCode {
        throw new NotImplementedException('');
    }


    protected /* virtual */  GetTypeCodeImpl(): TypeCode {
        const type: Type = this;
        throw new NotImplementedException('');
        /*  if (type is MonoType)
         return GetTypeCodeInternal(type);
 #if!FULL_AOT_RUNTIME
         if (type is TypeBuilder)
         return ((TypeBuilder)type).GetTypeCodeInternal();
 #endif

         type = type.UnderlyingSystemType;

         if (!type.IsSystemType)
             return TypeCode.Object;
         else
             return GetTypeCodeInternal(type); */
    }

    public static GetTypeCode(type: Type): TypeCode {
        if (type == null)
            return TypeCode.Empty;
        return type.GetTypeCodeImpl();
    }

    public static GetTypeFromCLSID(clsid: string): Type;
    public static GetTypeFromCLSID(clsid: string, throwOnError: boolean): Type;
    public static GetTypeFromCLSID(clsid: string, server: string): Type;
    public static GetTypeFromCLSID(clsid: string, server: string, throwOnError: boolean): Type;
    public static GetTypeFromCLSID(...args: any[]): Type {
        if (args.length === 1) {
            const clsid: string = args[0];
            return Type.GetTypeFromCLSID(clsid, null as any, true);
        } else if (args.length === 2 && typeof args[0] === 'string' && typeof args[1] === 'boolean') {
            const clsid: string = args[0];
            const throwOnError: boolean = args[1];
            return Type.GetTypeFromCLSID(clsid, null as any, throwOnError);
        } else if (args.length === 2 && typeof args[0] === 'string' && typeof args[1] === 'string') {
            const clsid: string = args[0];
            const server: string = args[1];
            return Type.GetTypeFromCLSID(clsid, server, true);
        } else if (args.length === 3) {
            throw new NotImplementedException('');
        }
        throw new ArgumentOutOfRangeException('');
    }

    public static GetTypeFromHandle(handle: RuntimeTypeHandle): Type {
        if ((handle as any).Value === 0/* IntPtr.Zero */)
            return null as any;

        return Type.internal_from_handle(handle.Value as any);
    }

    public static GetTypeFromProgID(progID: string): Type;
    public static GetTypeFromProgID(progID: string, throwOnError: boolean): Type;
    public static GetTypeFromProgID(progID: string, server: string): Type;
    public static GetTypeFromProgID(progID: string, server: string, throwOnError: boolean): Type;
    public static GetTypeFromProgID(...args: any[]): Type {
        throw new NotImplementedException('');
    }

    public static GetTypeHandle(o: any): RuntimeTypeHandle {
        if (o == null)
            throw new ArgumentNullException('');

        return o.GetType().TypeHandle;
    }

    public /* internal */ static /* extern */  type_is_subtype_of(a: Type, b: Type, check_interfaces: boolean): boolean {
        //throw new NotImplementedException('');
        return false;
    }

    public /* internal */ static /* extern */  type_is_assignable_from(a: Type, b: Type): boolean {
        throw new NotImplementedException('');
    }

    /*  public  GetType():Type {
         return base.GetType();
     } */

    public /* virtual */  IsSubclassOf(c: Type): boolean {
        return false;
        if (c == null || c == this)
            return false;

        // Fast check for system types
        if (this.IsSystemType)
            return c.IsSystemType && Type.type_is_subtype_of(this, c, false);

        // User defined types depend on this behavior
        for (let type: Type = this.BaseType; type != null; type = type.BaseType)
            if (type === c)
                return true;

        return false;
    }

    public /* virtual */  FindInterfaces(filter: TypeFilter, filterCriteria: any): Type[] {
        if (filter == null)
            throw new ArgumentNullException("filter");

        var ifaces: Type[] = [];
        const interfaces: any[] = this.GetInterfaces();
        for (let i = 0; i < interfaces.length; i++) {
            const iface = interfaces[i];
            if (filter(iface, filterCriteria))
                ifaces.push(iface);
        }

        return ifaces;
    }

    public GetInterface(name: string): Type;
    public /* abstract */ GetInterface(name: string, ignoreCase: boolean): Type;
    public GetInterface(...args: any[]): Type {
        if (args.length === 1) {
            const name: string = args[0];
            return this.GetInterface(name, false);
        }
        throw new ArgumentOutOfRangeException('');
    }

    public /* internal */ static /* extern */  GetInterfaceMapData(t: Type, iface: Type,
        targets: Out<MethodInfo[]>, methods: Out<MethodInfo[]>): void {
        throw new NotImplementedException('');
    }

    public /* virtual */  GetInterfaceMap(interfaceType: Type): InterfaceMapping {
        if (!this.IsSystemType)
            throw new NotSupportedException("Derived classes must provide an implementation.");
        if (interfaceType == null)
            throw new ArgumentNullException("interfaceType");
        if (!interfaceType.IsSystemType)
            throw new ArgumentException("interfaceType", "Type is an user type");
        let res: InterfaceMapping;
        if (!interfaceType.IsInterface)
            throw new ArgumentException("Argument must be an interface.", "interfaceType");
        if (this.IsInterface)
            throw new ArgumentException("'this' type cannot be an interface itself");
        res.TargetType = this;
        res.InterfaceType = interfaceType;
        Type.GetInterfaceMapData(this, interfaceType, /* out */ res.TargetMethods, /* out */ res.InterfaceMethods);
        if (res.TargetMethods == null)
            throw new ArgumentException(("Interface not found"), "interfaceType");

        return res;
    }

    public abstract GetInterfaces(): Type[];

    public /* virtual */  IsAssignableFrom(c: Type): boolean {
        if (c == null)
            return false;

        if (this.Equals(c))
            return true;

        /* Handle user defined type classes */
        if (!this.IsSystemType) {
            const systemType: Type = this.UnderlyingSystemType;
            if (!systemType.IsSystemType)
                return false;

            const other: Type = c.UnderlyingSystemType;
            if (!other.IsSystemType)
                return false;

            return systemType.IsAssignableFrom(other);
        }

        if (!c.IsSystemType) {
            const underlyingType: Type = c.UnderlyingSystemType;
            if (!underlyingType.IsSystemType)
                return false;
            return this.IsAssignableFrom(underlyingType);
        }

        return Type.type_is_assignable_from(this, c);
    }

    private /* extern */ static IsInstanceOfType(type: Type, o: any): boolean {
        throw new NotImplementedException('');
    }

    public /* virtual */  IsInstanceOfType(o: any): boolean {
        const type: Type = this.UnderlyingSystemType;
        if (!type.IsSystemType)
            return false;
        return Type.IsInstanceOfType(type, o);
    }

    public /* virtual */  GetArrayRank(): int {
        throw new NotSupportedException('');	// according to MSDN
    }

    public abstract GetElementType(): Type;

    public GetEvent(name: string): EventInfo;
    public /* abstract */ GetEvent(name: string, bindingAttr: BindingFlags): EventInfo;
    public GetEvent(...args: any[]): EventInfo {
        const name: string = args[0];
        return this.GetEvent(name, Type.DefaultBindingFlags);
    }

    public /* virtual */  GetEvents(): EventInfo[];
    public /* abstract */ GetEvents(bindingAttr: BindingFlags): EventInfo[];
    public /* virtual */  GetEvents(...args: any[]): EventInfo[] {
        if (args.length === 0) {
            return this.GetEvents(Type.DefaultBindingFlags);
        }
        throw new ArgumentOutOfRangeException('');
    }

    public GetField(name: string): FieldInfo;
    public /* abstract */ GetField(name: string, bindingAttr: BindingFlags): FieldInfo;
    public /* internal */ /* virtual */  GetField(fromNoninstanciated: FieldInfo): FieldInfo;
    public GetField(...args: any[]): FieldInfo {
        if (args.length === 1) {
            const name: string = args[0];
            return this.GetField(name, Type.DefaultBindingFlags);
        }
        throw new ArgumentOutOfRangeException('');
    }



    public GetFields(): FieldInfo[];
    public /* abstract */ GetFields(bindingAttr: BindingFlags): FieldInfo[];
    public GetFields(...args: any[]): FieldInfo[] {
        return this.GetFields(Type.DefaultBindingFlags);
    }

    public /* override */  GetHashCode(): int {
        const t: Type = this.UnderlyingSystemType;
        if (t != null && t != this)
            return t.GetHashCode();
        return this._impl.Value.ToInt32();
    }

    public GetMember(name: string): MemberInfo[];
    public /* virtual */  GetMember(name: string, bindingAttr: BindingFlags): MemberInfo[];
    public /* virtual */  GetMember(name: string, type: MemberTypes, bindingAttr: BindingFlags): MemberInfo[];
    public GetMember(...args: any[]): MemberInfo[] {
        if (args.length === 1) {
            const name: string = args[0];
            return this.GetMember(name, MemberTypes.All, Type.DefaultBindingFlags);
        } else if (args.length === 2) {
            const name: string = args[0];
            const bindingAttr: BindingFlags = args[1];
            return this.GetMember(name, MemberTypes.All, bindingAttr);
        } else if (args.length === 3) {
            const name: string = args[0];
            const type: MemberTypes = args[1];
            const bindingAttr: BindingFlags = args[2];
            if (name == null)
                throw new ArgumentNullException("name");
            if ((bindingAttr & BindingFlags.IgnoreCase) != 0)
                return this.FindMembers(type, bindingAttr, Type.FilterNameIgnoreCase, name);
            else
                return this.FindMembers(type, bindingAttr, Type.FilterName, name);
        }
        throw new ArgumentOutOfRangeException('');
    }


    public GetMembers(): MemberInfo[];
    public /* abstract */ GetMembers(bindingAttr: BindingFlags): MemberInfo[];
    public GetMembers(...args: any[]): MemberInfo[] {
        if (args.length === 0) {
            return this.GetMembers(Type.DefaultBindingFlags);
        }
        throw new ArgumentOutOfRangeException('');
    }
    public GetMethod(name: string): MethodInfo;
    public GetMethod(name: string, bindingAttr: BindingFlags): MethodInfo;
    public GetMethod(name: string, types: Type[]): MethodInfo;
    public GetMethod(name: string, types: Type[], modifiers: ParameterModifier[]): MethodInfo;
    public GetMethod(name: string, bindingAttr: BindingFlags, binder: Binder, types: Type[], modifiers: ParameterModifier[]): MethodInfo;
    public GetMethod(name: string, bindingAttr: BindingFlags, binder: Binder, callConvention: CallingConventions, types: Type[], modifiers: ParameterModifier[]): MethodInfo;
    public GetMethod(...args: any[]): MethodInfo {
        if (args.length === 1) {
            const name: string = args[0];
            if (name == null)
                throw new ArgumentNullException("name");
            return this.GetMethodImpl(name, Type.DefaultBindingFlags, null, CallingConventions.Any, null as any, null as any);
        } else if (args.length === 2 && typeof args[0] === 'string' && typeof args[1] === 'number') {
            const name: string = args[0];
            const bindingAttr: BindingFlags = args[1];
            if (name == null)
                throw new ArgumentNullException("name");

            return this.GetMethodImpl(name, bindingAttr, null, CallingConventions.Any, null as any, null as any);
        } else if (args.length === 2 && typeof args[0] === 'string' && Array.isArray(args[1])) {
            const name: string = args[0];
            const types: Type[] = args[1];
            return this.GetMethod(name, Type.DefaultBindingFlags, null as any, CallingConventions.Any, types, null as any);
        } else if (args.length === 3) {
            const name: string = args[0];
            const types: Type[] = args[1];
            const modifiers: ParameterModifier[] = args[2];
            return this.GetMethod(name, Type.DefaultBindingFlags, null, CallingConventions.Any, types, modifiers);
        } else if (args.length === 5) {
            const name: string = args[0];
            const bindingAttr: BindingFlags = args[1];
            const binder: Binder = args[2];
            const types: Type[] = args[3];
            const modifiers: ParameterModifier[] = args[4];
            return this.GetMethod(name, bindingAttr, binder, CallingConventions.Any, types, modifiers);
        } else if (args.length === 6) {
            const name: string = args[0];
            const bindingAttr: BindingFlags = args[1];
            const binder: Binder = args[2];
            const callConvention: CallingConventions = args[3];
            const types: Type[] = args[4];
            const modifiers: ParameterModifier[] = args[5];
            if (name == null)
                throw new ArgumentNullException("name");
            if (types == null)
                throw new ArgumentNullException("types");

            for (let i: int = 0; i < types.length; i++)
                if (types[i] == null)
                    throw new ArgumentNullException("types");

            return this.GetMethodImpl(name, bindingAttr, binder, callConvention, types, modifiers);
        }
        throw new ArgumentOutOfRangeException('');
    }


    protected abstract GetMethodImpl(name: string, bindingAttr: BindingFlags, binder: Binder, callConvention: CallingConventions, types: Type[], modifiers: ParameterModifier[]): MethodInfo;

    public /* internal */  GetMethodImplInternal(name: string, bindingAttr: BindingFlags, binder: Binder,
        callConvention: CallingConventions, types: Type[], modifiers: ParameterModifier[]): MethodInfo {
        return this.GetMethodImpl(name, bindingAttr, binder, callConvention, types, modifiers);
    }


    /* public  internal  virtual   GetConstructor(fromNoninstanciated: ConstructorInfo): ConstructorInfo {
        throw new InvalidOperationException("can only be called in generic type");
    } */




    public GetMethods(): MethodInfo[];
    public /* abstract */ GetMethods(bindingAttr: BindingFlags): MethodInfo[];
    public GetMethods(...args: any[]): MethodInfo[] {
        return this.GetMethods(Type.DefaultBindingFlags);
    }


    public GetNestedType(name: string): Type;
    public /* abstract */ GetNestedType(name: string, bindingAttr: BindingFlags): Type;
    public GetNestedType(...args: any[]): Type {
        if (args.length === 1) {
            const name: string = args[0];
            return this.GetNestedType(name, Type.DefaultBindingFlags);
        }
        throw new ArgumentOutOfRangeException('');
    }

    public GetNestedTypes(): Type[];
    public /* abstract */ GetNestedTypes(bindingAttr: BindingFlags): Type[];
    public GetNestedTypes(...args: any[]): Type[] {
        if (args.length === 0) {
            return this.GetNestedTypes(Type.DefaultBindingFlags);
        }
        throw new ArgumentOutOfRangeException('');
    }

    public GetProperties(): PropertyInfo[];
    public /* abstract */ GetProperties(bindingAttr: BindingFlags): PropertyInfo[];
    public GetProperties(...args: any[]): PropertyInfo[] {
        if (args.length === 0) {
            return this.GetProperties(Type.DefaultBindingFlags);
        }
        throw new ArgumentOutOfRangeException('');
    }

    public GetProperty(name: string): PropertyInfo;
    public GetProperty(name: string, bindingAttr: BindingFlags): PropertyInfo;
    public GetProperty(name: string, returnType: Type): PropertyInfo;
    public GetProperty(name: string, types: Type[]): PropertyInfo;
    public GetProperty(name: string, returnType: Type, types: Type[]): PropertyInfo;
    public GetProperty(name: string, returnType: Type, types: Type[], modifiers: ParameterModifier[]): PropertyInfo;
    public GetProperty(name: string, bindingAttr: BindingFlags, binder: Binder, returnType: Type, types: Type[], modifiers: ParameterModifier[]): PropertyInfo;
    public GetProperty(...args: any[]): PropertyInfo {
        if (args.length === 1) {
            const name: string = args[0];
            if (name == null)
                throw new ArgumentNullException("name");

            return this.GetPropertyImpl(name, Type.DefaultBindingFlags, null, null as any, null as any, null as any);
        } else if (args.length === 2 && typeof args[0] === 'string' && typeof args[1] === 'number') {
            const name: string = args[0];
            const bindingAttr: BindingFlags = args[1];
            if (name == null)
                throw new ArgumentNullException("name");
            return this.GetPropertyImpl(name, bindingAttr, null, null as any, null as any, null as any);
        } else if (args.length === 2 && typeof args[0] === 'string' && args[1] instanceof Type) {
            const name: string = args[0];
            const returnType: Type = args[1];
            if (name == null)
                throw new ArgumentNullException("name");
            return this.GetPropertyImpl(name, Type.DefaultBindingFlags, null, returnType, null as any, null as any);
        } else if (args.length === 2 && typeof args[0] === 'string' && Array.isArray(args[1])) {
            const name: string = args[0];
            const types: Type[] = args[1];
            return this.GetProperty(name, Type.DefaultBindingFlags, null as any, null as any, types, null as any);
        } else if (args.length === 3) {
            const name: string = args[0];
            const returnType: Type = args[1];
            const types: Type[] = args[2];
            return this.GetProperty(name, Type.DefaultBindingFlags, null, returnType, types, null as any);
        } else if (args.length === 4) {
            const name: string = args[0];
            const returnType: Type = args[1];
            const types: Type[] = args[2];
            const modifiers: ParameterModifier[] = args[3];
            return this.GetProperty(name, Type.DefaultBindingFlags, null, returnType, types, modifiers);
        } else if (args.length === 6) {
            const name: string = args[0];
            const bindingAttr: BindingFlags = args[1];
            const binder: Binder = args[2];
            const returnType: Type = args[3];
            const types: Type[] = args[4];
            const modifiers: ParameterModifier[] = args[5];
            if (name == null)
                throw new ArgumentNullException("name");
            if (types == null)
                throw new ArgumentNullException("types");

            for (let i = 0; i < types.length; i++) {
                if (types[i] == null) {
                    throw new ArgumentNullException("types");
                }
            }

            return this.GetPropertyImpl(name, bindingAttr, binder, returnType, types, modifiers);
        }
    }



    /*  public GetProperty(name: string, returnType: Type, types: Type[], modifiers: ParameterModifier[]): PropertyInfo {
         return GetProperty(name, DefaultBindingFlags, null, returnType, types, modifiers);
     } */



    protected abstract GetPropertyImpl(name: string, bindingAttr: BindingFlags, binder: Binder,
        returnType: Type, types: Type[], modifiers: ParameterModifier[]): PropertyInfo;

    public /* internal */  GetPropertyImplInternal(name: string, bindingAttr: BindingFlags, binder: Binder,
        returnType: Type, types: Type[], modifiers: ParameterModifier[]): PropertyInfo {
        return this.GetPropertyImpl(name, bindingAttr, binder, returnType, types, modifiers);
    }



    protected abstract GetAttributeFlagsImpl(): TypeAttributes;
    protected abstract HasElementTypeImpl(): boolean;
    protected abstract IsArrayImpl(): boolean;
    protected abstract IsByRefImpl(): boolean;
    protected abstract IsCOMObjectImpl(): boolean;
    protected abstract IsPointerImpl(): boolean;
    protected abstract IsPrimitiveImpl(): boolean;

    public /* internal */ static /* extern */  IsArrayImpl(type: Type): boolean {
        throw new NotImplementedException('');
    }

    protected /* virtual */  IsValueTypeImpl(): boolean {
        /* if (this === typeOf(ValueType) || this === typeOf(Enum))
            return false;

        return this.IsSubclassOf(typeof (ValueType)); */
        throw new NotImplementedException('');
    }

    protected /* virtual */  IsContextfulImpl(): boolean {
        //return typeOf(ContextBoundObject).IsAssignableFrom(this);
        throw new NotImplementedException('');
    }

    protected /* virtual */  IsMarshalByRefImpl(): boolean {
        //return typeOf(MarshalByRefObject).IsAssignableFrom(this);
        throw new NotImplementedException('');
    }

    public GetConstructor(types: Type[]): ConstructorInfo;
    public GetConstructor(bindingAttr: BindingFlags, binder: Binder, types: Type[], modifiers: ParameterModifier[]): ConstructorInfo;
    public GetConstructor(bindingAttr: BindingFlags, binder: Binder, callConvention: CallingConventions, types: Type[], modifiers: ParameterModifier[]): ConstructorInfo;
    public GetConstructor(...args: any[]): ConstructorInfo {
        if (args.length === 1) {
            const types: Type[] = args[0];
            return this.GetConstructor(BindingFlags.Public | BindingFlags.Instance, null, CallingConventions.Any, types, null as any);
        } else if (args.length === 4) {
            const bindingAttr: BindingFlags = args[0];
            const binder: Binder = args[1];
            const types: Type[] = args[2];
            const modifiers: ParameterModifier[] = args[3];
            return this.GetConstructor(bindingAttr, binder, CallingConventions.Any, types, modifiers);
        } else if (args.length === 5) {
            const bindingAttr: BindingFlags = args[0];
            const binder: Binder = args[1];
            const callConvention: CallingConventions = args[2];
            const types: Type[] = args[3];
            const modifiers: ParameterModifier[] = args[4];
            if (types == null)
                throw new ArgumentNullException("types");

            for (let i = 0; i < types.length; i++) {
                if (types[i] == null) {
                    throw new ArgumentNullException("types");
                }
            }
            return this.GetConstructorImpl(bindingAttr, binder, callConvention, types, modifiers);
        }
        throw new ArgumentOutOfRangeException('');
    }

    public GetConstructors(): ConstructorInfo[];
    public /* abstract */ GetConstructors(bindingAttr: BindingFlags): ConstructorInfo[];
    public GetConstructors(...args: any[]): ConstructorInfo[] {
        if (args.length === 0) {
            return this.GetConstructors(BindingFlags.Public | BindingFlags.Instance);
        }
        throw new ArgumentOutOfRangeException('');
    }



    public /* virtual */  GetDefaultMembers(): MemberInfo[] {
        const att: any[] = this.GetCustomAttributes(typeOf(DefaultMemberAttribute), true);
        if (att.length == 0)
            return [];

        const member: MemberInfo[] = this.GetMember((<DefaultMemberAttribute>att[0]).MemberName);
        return (member != null) ? member : [];
    }

    public /* virtual */  FindMembers(memberType: MemberTypes, bindingAttr: BindingFlags,
        filter: MemberFilter, filterCriteria: any): MemberInfo[] {
        let result: MemberInfo[];
        const l: any[] = [];

        // Console.WriteLine ("FindMembers for {0} (Type: {1}): {2}",
        // this.FullName, this.GetType().FullName, this.obj_address());
        if ((memberType & MemberTypes.Method) != 0) {
            const c: MethodInfo[] = this.GetMethods(bindingAttr);
            if (filter != null) {
                for (let i = 0; i < c.length; i++) {
                    const m = c[i];
                    if (filter(m, filterCriteria))
                        l.push(m);
                }
            } else {
                l.push(...c);
            }
        }
        if ((memberType & MemberTypes.Constructor) != 0) {
            const c: ConstructorInfo[] = this.GetConstructors(bindingAttr);
            if (filter != null) {
                for (let i = 0; i < c.length; i++) {
                    const m = c[i];
                    if (filter(m, filterCriteria))
                        l.push(m);
                }

            } else {
                l.push(...c);
            }
        }
        if ((memberType & MemberTypes.Property) != 0) {
            const c: PropertyInfo[] = this.GetProperties(bindingAttr);
            if (filter != null) {
                for (let i = 0; i < c.length; i++) {
                    const m = c[i];
                    if (filter(m, filterCriteria))
                        l.push(m);
                }
            } else {
                l.push(...c);
            }

        }
        if ((memberType & MemberTypes.Event) != 0) {
            const c: EventInfo[] = this.GetEvents(bindingAttr);
            if (filter != null) {
                for (let i = 0; i < c.length; i++) {
                    const m = c[i];
                    if (filter(m, filterCriteria))
                        l.push(m);
                }
            } else {
                l.push(...c);
            }
        }
        if ((memberType & MemberTypes.Field) != 0) {
            const c: FieldInfo[] = this.GetFields(bindingAttr);
            if (filter != null) {
                for (let i = 0; i < c.length; i++) {
                    const m = c[i];
                    if (filter(m, filterCriteria))
                        l.push(m);
                }
            } else {
                l.push(...c);
            }
        }
        if ((memberType & MemberTypes.NestedType) != 0) {
            const c: Type[] = this.GetNestedTypes(bindingAttr);
            if (filter != null) {
                for (let i = 0; i < c.length; i++) {
                    const m = c[i];
                    if (filter(m, filterCriteria)) {
                        l.push(m);
                    }
                }
            } else {
                l.push(...c);
            }
        }

        /*  switch (memberType) {
             case MemberTypes.Constructor:
                 result = new Array(l.Count);
                 break;
             case MemberTypes.Event:
                 result = new Array(l.Count);
                 break;
             case MemberTypes.Field:
                 result = new Array(l.Count);
                 break;
             case MemberTypes.Method:
                 result = new Array(l.Count);
                 break;
             case MemberTypes.NestedType:
             case MemberTypes.TypeInfo:
                 result = new Array(l.Count);
                 break;
             case MemberTypes.Property:
                 result = new Array(l.Count);
                 break;
             default:
                 result = new Array(l.Count);
                 break;
         } */
        // l.CopyTo(result);
        return l.slice();
    }

    public InvokeMember(name: string, invokeAttr: BindingFlags, binder: Binder, target: any, args: any[]): any;
    public InvokeMember(name: string, invokeAttr: BindingFlags, binder: Binder, target: any, args: any[], culture: CultureInfo): any;
    public /* abstract */ InvokeMember(name: string, invokeAttr: BindingFlags, binder: Binder, target: any, args: any[], modifiers: ParameterModifier[], culture: CultureInfo, namedParameters: string[]): any;
    public InvokeMember(...args: any[]): any {
        if (args.length === 5) {
            const name: string = args[0];
            const invokeAttr: BindingFlags = args[1];
            const binder: Binder = args[2];
            const target: any = args[3];
            const _args: any[] = args[4];
            return this.InvokeMember(name, invokeAttr, binder, target, _args, null as any, null, null as any);
        } else if (args.length === 6) {
            const name: string = args[0];
            const invokeAttr: BindingFlags = args[1];
            const binder: Binder = args[2];
            const target: any = args[3];
            const _args: any[] = args[4];
            const culture: CultureInfo = args[5];
            return this.InvokeMember(name, invokeAttr, binder, target, _args, null as any, culture, null as any);
        }
        throw new ArgumentOutOfRangeException('');
    }

    public /* override */  ToString(): string {
        return this.FullName;
    }

    public /* internal virtual */  InternalResolve(): Type {
        return this.UnderlyingSystemType;
    }

    public /* internal */ get IsSystemType() {
        return false; //(this._impl as any).Value !== 0 /* IntPtr.Zero */;
    }

    /* #if NET_4_5
            public virtual Type[] GenericTypeArguments {
        get {
            return IsGenericType ? GetGenericArguments() : EmptyTypes;
        }
    }
    #endif */

    public /* virtual */  GetGenericArguments(): Type[] {
        throw new NotSupportedException('');
    }

    public /* virtual */ get ContainsGenericParameters(): boolean {
        return false;
    }

    protected /* virtual extern */ Get_IsGenericTypeDefinition(): boolean {
        throw new NotImplementedException('');
    }
    public get IsGenericTypeDefinition(): boolean {
        return this.Get_IsGenericTypeDefinition();
    }

    public /* internal extern */  GetGenericTypeDefinition_impl(): Type {
        throw new NotImplementedException('');
    }

    public /* virtual */  GetGenericTypeDefinition(): Type {
        throw new NotSupportedException("Derived classes must provide an implementation.");
    }

    protected /* virtual */ /* extern */ Get_IsGenericType(): boolean {
        throw new NotImplementedException('');
    }
    public get IsGenericType(): boolean {
        return this.Get_IsGenericType();
    }

    /* [MethodImplAttribute(MethodImplOptions.InternalCall)]
    static extern Type MakeGenericType(Type gt, Type[] types); */

    public /* virtual */  MakeGenericType(...typeArguments: Type[]): Type {
        throw new NotImplementedException('');
        /*  if (IsUserType)
             throw new NotSupportedException();
         if (!IsGenericTypeDefinition)
             throw new InvalidOperationException("not a generic type definition");
         if (typeArguments == null)
             throw new ArgumentNullException("typeArguments");
         if (GetGenericArguments().Length != typeArguments.Length)
             throw new ArgumentException(String.Format("The type or method has {0} generic parameter(s) but {1} generic argument(s) where provided. A generic argument must be provided for each generic parameter.", GetGenericArguments().Length, typeArguments.Length), "typeArguments");

         bool hasUserType = false;

         Type[] systemTypes = new Type[typeArguments.Length];
         for (int i = 0; i < typeArguments.Length; ++i) {
             Type t = typeArguments[i];
             if (t == null)
                 throw new ArgumentNullException("typeArguments");

             if (!(t is MonoType))
             hasUserType = true;
             systemTypes[i] = t;
         }

         if (hasUserType) {
 #if FULL_AOT_RUNTIME
             throw new NotSupportedException("User types are not supported under full aot");
 #else
             return new MonoGenericClass(this, typeArguments);
 #endif
         }

         Type res = MakeGenericType(this, systemTypes);
         if (res == null)
             throw new TypeLoadException();
         return res; */
    }

    public /* virtual */ get IsGenericParameter(): boolean {
        return false;
    }

    public get IsNested(): boolean {
        return this.DeclaringType != null;
    }

    public get IsVisible(): boolean {
        if (this.IsNestedPublic)
            return this.DeclaringType.IsVisible;

        return this.IsPublic;
    }

    /* extern */  GetGenericParameterPosition(): int {
        throw new NotImplementedException('');
    }

    public /* virtual */ get GenericParameterPosition(): int {
        const res: int = this.GetGenericParameterPosition();
        if (res < 0)
            throw new InvalidOperationException('');
        return res;
    }

    /* extern */  GetGenericParameterAttributes(): GenericParameterAttributes {
        throw new ArgumentException('');
    }

    public /* virtual */ get GenericParameterAttributes(): GenericParameterAttributes {
        if (!this.IsSystemType)
            throw new NotSupportedException("Derived classes must provide an implementation.");

        if (!this.IsGenericParameter)
            throw new InvalidOperationException('');

        return this.GetGenericParameterAttributes();
    }

/* extern */  GetGenericParameterConstraints_impl(): Type[] {
        throw new NotImplementedException('');
    }

    public /* virtual */  GetGenericParameterConstraints(): Type[] {
        if (!this.IsSystemType)
            throw new InvalidOperationException('');

        if (!this.IsGenericParameter)
            throw new InvalidOperationException('');

        return this.GetGenericParameterConstraints_impl();
    }

    public /* virtual */ get DeclaringMethod(): MethodBase {
        return null as any;
    }

    public /* extern */  make_array_type(rank: int): Type {
        throw new NotImplementedException('');
    }

    public /* virtual */  MakeArrayType(): Type;
    public /* virtual */  MakeArrayType(rank: int): Type;
    public /* virtual */  MakeArrayType(...args: any[]): Type {
        if (args.length === 0) {
            if (!this.IsSystemType)
                throw new NotSupportedException("Derived classes must provide an implementation.");
            return this.make_array_type(0);
        } else if (args.length === 1) {
            const rank: int = args[0];
            if (!this.IsSystemType)
                throw new NotSupportedException("Derived classes must provide an implementation.");
            if (rank < 1 || rank > 255)
                throw new IndexOutOfRangeException('');
            return this.make_array_type(rank);
        }
        throw new ArgumentOutOfRangeException('');
    }

    private /* extern */  make_byref_type(): Type {
        throw new NotSupportedException('');
    }

    public /* virtual */  MakeByRefType(): Type {
        if (!this.IsSystemType)
            throw new NotSupportedException("Derived classes must provide an implementation.");
        if (this.IsByRef)
            throw new TypeLoadException("Can not call MakeByRefType on a ByRef type");
        return this.make_byref_type();
    }

    static /* extern */  MakePointerType(type: Type): Type {
        throw new NotImplementedException('');
    }

    public /* virtual */  MakePointerType(): Type {
        if (!this.IsSystemType)
            throw new NotSupportedException("Derived classes must provide an implementation.");
        return Type.MakePointerType(this);
    }

    public static ReflectionOnlyGetType(typeName: string,
        throwIfNotFound: boolean,
        ignoreCase: boolean): Type {
        if (typeName == null)
            throw new ArgumentNullException("typeName");
        const idx: int = typeName.indexOf(',');
        if (idx < 0 || idx == 0 || idx == typeName.length - 1)
            throw new ArgumentException("Assembly qualifed type name is required", "typeName");
        const an: string = typeName.substring(idx + 1);
        let a: Assembly;
        try {
            a = (Assembly as any).ReflectionOnlyLoad(an);
        } catch {
            if (throwIfNotFound)
                throw '';
            return null as any;
        }
        return (a as any).GetType(typeName.substring(0, idx), throwIfNotFound, ignoreCase);
    }

    /* extern */  GetPacking(packing: Out<int>, size: Out<int>): void {
        throw new NotImplementedException('');
    }

    /* 	public virtual StructLayoutAttribute StructLayoutAttribute {
    get {
#if NET_4_0
        throw new NotSupportedException();
#else
        return GetStructLayoutAttribute();
#endif
    }
} */
    /*
    internal StructLayoutAttribute GetStructLayoutAttribute()
    {
        LayoutKind kind;

        if (IsLayoutSequential)
            kind = LayoutKind.Sequential;
        else if (IsExplicitLayout)
            kind = LayoutKind.Explicit;
        else
            kind = LayoutKind.Auto;

        StructLayoutAttribute attr = new StructLayoutAttribute(kind);

        if (IsUnicodeClass)
            attr.CharSet = CharSet.Unicode;
        else if (IsAnsiClass)
            attr.CharSet = CharSet.Ansi;
        else
            attr.CharSet = CharSet.Auto;

        if (kind != LayoutKind.Auto) {
            int packing;
            GetPacking(out packing, out attr.Size);
            // 0 means no data provided, we end up with default value
            if (packing != 0)
                attr.Pack = packing;
        }

        return attr;
    } */

    public /* internal */  GetPseudoCustomAttributes(): any[] {
        let count: int = 0;

        /* IsSerializable returns true for delegates/enums as well */
        if ((this.Attributes & TypeAttributes.Serializable) !== 0)
            count++;
        if ((this.Attributes & TypeAttributes.Import) !== 0)
            count++;

        if (count === 0)
            return null as any;
        let attrs: any[] = new Array(count);
        count = 0;

        if ((this.Attributes & TypeAttributes.Serializable) != 0)
            attrs[count++] = new SerializableAttribute();
        if ((this.Attributes & TypeAttributes.Import) != 0)
            attrs[count++] = new ComImportAttribute();

        return attrs;
    }


    /* #if NET_4_0
    public virtual bool IsEquivalentTo(Type other) {
        return this == other;
    }
    #endif */

    /*
     * Return whenever this object is an instance of a user defined subclass
     * of System.Type or an instance of TypeDelegator.
     * A user defined type is not simply the opposite of a system type.
     * It's any class that's neither a SRE or runtime baked type.
     */
    /* internal */ /* virtual */ get IsUserType(): boolean {
        return true;
    }
}
