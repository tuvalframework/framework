import { Delegate } from "../Delegate";
import { Type } from "./Type";

export class TypeFilter extends Delegate<(m: Type, filterCriteria: any) => boolean> { };
