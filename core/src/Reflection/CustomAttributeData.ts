import { ParameterInfo } from './ParameterInfo';
import { Module } from "./Module";
import { NotImplementedException } from "../Exceptions/NotImplementedException";
import { MemberInfo } from "./MemberInfo";
import { IList } from '../Collections/Generic/IList';


export class CustomAttributeData {
  //#region Public Static Members
  public static GetCustomAttributes(target: MemberInfo): IList<CustomAttributeData>;
  public static GetCustomAttributes(target: Module): IList<CustomAttributeData>;
  public static GetCustomAttributes(target: ParameterInfo): IList<CustomAttributeData> {
    throw new NotImplementedException('GetCustomAttributes');
  }
  //#endregion
}