import { int } from "@tuval/core";
import { AlignmentType } from "../../Constants";
import { UIView } from "../UIView/UIView";
import {  TooltipClass } from "./TooltipClass";


interface VStackParams {
    alignment?: AlignmentType;
    spacing?: int;
}



export function Tooltip(...views: UIView[]): TooltipClass {
    return new TooltipClass().children(...views);
}