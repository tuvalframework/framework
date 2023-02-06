import { int } from "@tuval/core";
import { AlignmentType } from "../Constants";
import { UIViewClass } from "../UIView/UIViewClass";
import {  TooltipClass } from "./TooltipClass";


interface VStackParams {
    alignment?: AlignmentType;
    spacing?: int;
}



export function Tooltip(...views: UIViewClass[]): TooltipClass {
    return new TooltipClass().children(...views);
}