import { int } from "@tuval/core";
import { AlignmentType } from "../../Constants";
import { UIViewClass } from "../../components/UIView/UIViewClass";
import { DesktopClass } from './DesktopClass';



/* export function VStack(value: string): FunctionVStack; */
export function Desktop(): DesktopClass {
    return new DesktopClass()
}