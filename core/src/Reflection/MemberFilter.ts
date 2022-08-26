import { Delegate } from "../Delegate";
import { MemberInfo } from "./MemberInfo";

export class MemberFilter extends Delegate<(m: MemberInfo, filterCriteria: any) => boolean> { }