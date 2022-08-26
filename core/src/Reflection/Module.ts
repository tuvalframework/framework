import { Filters } from './Filters';
import { TypeFilter } from './TypeFilter';
import { CustomAttributeData } from './CustomAttributeData';
import { ICustomAttributeProvider } from './ICustomAttributeProvider';
import { Type } from './Type';
import { BindingFlags } from './BindingFlags';
import { MethodBase } from './MethodBase';
import { FieldInfo } from './FieldInfo';
import { MemberInfo } from './MemberInfo';
import { MethodInfo } from './MethodInfo';
import { IEnumerable} from '../Collections/enumeration_/IEnumerable';
import { NotImplementedException } from '../Exceptions/NotImplementedException';
import { IList } from '../Collections/Generic/IList';

type byte = number;
export enum PortableExecutableKinds {
  NotAPortableExecutableImage = 0x0,
  ILOnly = 0x1,
  Required32Bit = 0x2,
  PE32Plus = 0x4,
  Unmanaged32Bit = 0x8,
  Preferred32Bit = 0x10
}

export enum ImageFileMachine {
  I386 = 0x014c,
  IA64 = 0x0200,
  AMD64 = 0x8664,
  ARM = 0x01c4
}

export abstract class Module implements ICustomAttributeProvider {
  public static readonly FilterTypeName: TypeFilter;
  public static readonly FilterTypeNameIgnoreCase: TypeFilter;

  public get /* virtual */ CustomAttributes(): IEnumerable<CustomAttributeData> {
    return this.getCustomAttributesData();
  }

  //#region ICustomAttributeProvider Members
  public /* virtual */ GetCustomAttributes(inherit: boolean): any[];
  public /* virtual */ GetCustomAttributes(attributeType: Type, inherit: boolean): any[];
  public /* virtual */ GetCustomAttributes(...args: any[]): any[] {
    throw new NotImplementedException('getCustomAttributes');
  }

  public /* virtual */ isDefined(attributeType: Type, inherit: boolean): boolean {
    throw new NotImplementedException('getCustomAttributes');
  }

  public /* virtual */ getCustomAttributesData(): IList<CustomAttributeData> {
    throw new NotImplementedException('getCustomAttributes');
  }
  //#endregion

  public /* virtual */ resolveMethod(metadataToken: number, genericTypeArguments: Type[], genericMethodArguments: Type[]): MethodBase {
    throw new NotImplementedException('resolveMethod');
  }

  public /* virtual */ resolveField(metadataToken: number, genericTypeArguments: Type[], genericMethodArguments: Type[]): FieldInfo {
    throw new NotImplementedException('resolveField');
  }

  public /* virtual */ resolveType(metadataToken: number, genericTypeArguments: Type[], genericMethodArguments: Type[]): Type {
    throw new NotImplementedException('resolveType');
  }

  public /* virtual */ resolveMember(metadataToken: number, genericTypeArguments: Type[], genericMethodArguments: Type[]): MemberInfo {
    throw new NotImplementedException('resolveMember');
  }

  public /* virtual */ resolveSignature(metadataToken: number): byte[] {
    throw new NotImplementedException('resolveSignature');
  }

  public /* virtual */ resolveString(metadataToken: number): string {
    throw new NotImplementedException('resolveString');
  }

  public /* virtual */ getType(className: string, ignoreCase: boolean): Type {
    throw new NotImplementedException('getType');
  }

  public get /* virtual */ FullyQualifiedName(): string {
    throw new NotImplementedException('FullyQualifiedName');
  }

  public /* virtual */ findTypes(filter: TypeFilter, filterCriteria: any) {
    const c: Type[] = this.getTypes();
    let cnt: number = 0;
    for (let i = 0; i < c.length; i++) {
      if (filter != null && !filter(c[i], filterCriteria)) c[i] = undefined as any;
      else cnt++;
    }
    if (cnt === c.length) return c;

    const ret: Type[] = new Array(cnt);
    cnt = 0;
    for (let i = 0; i < c.length; i++) {
      if (c[i] != null) ret[cnt++] = c[i];
    }
    return ret;
  }

  public /* virtual */ getTypes(): Type[] {
    throw new NotImplementedException('getTypes');
  }

  public get /* virtual */ ModuleVersionId(): string {
    throw new NotImplementedException('ModuleVersionId');
  }

  public get /* virtual */ MetadataToken(): number {
    throw new NotImplementedException('MetadataToken');
  }

  public get /* virtual */ IsResource(): boolean {
    throw new NotImplementedException('IsResource');
  }

  public /* virtual */ getFields(bindingFlags: BindingFlags): FieldInfo[] {
    throw new NotImplementedException('getFields');
  }

  public /* virtual */ getField(name: string, bindingAttr: BindingFlags): FieldInfo {
    throw new NotImplementedException('getField');
  }

  public /* virtual */ getMethods(bindingFlags: BindingFlags): MethodInfo[] {
    throw new NotImplementedException('getMethods');
  }

  public /* override */ ToString(): string {
    return '';
  }
}

//#region Static Constructor

(function staticConstructor() {
  const _fltObj: Filters = new Filters();
  (<any>Module).FilterTypeName = _fltObj.filterTypeName.bind(_fltObj);
  (<any>Module).FilterTypeNameIgnoreCase = _fltObj.filterTypeNameIgnoreCase.bind(_fltObj);
})();

//#endregion
