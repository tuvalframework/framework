import { UIView } from "./UIView";



export function Switch(caseValue: any, caseObject: any) :UIView {
   return caseObject[caseValue]();
}