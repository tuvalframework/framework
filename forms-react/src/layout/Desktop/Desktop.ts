import { int } from "@tuval/core";
import { AlignmentType } from "../../Constants";
import { UIView } from "../../components/UIView/UIView";
import { DesktopClass } from './DesktopClass';



/* export function VStack(value: string): FunctionVStack; */
export function Desktop(baseUrl?: string): DesktopClass {
    return new DesktopClass().baseUrl(baseUrl)
}