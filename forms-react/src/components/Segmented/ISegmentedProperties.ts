import { ReactNode } from "react";
import { IViewProperties } from "../UIView/IViewProperties";
import { UIView } from "../UIView/UIView";

export type SizeType = 'small' | 'middle' | 'large' | undefined;

export interface ISegmentedProperties extends IViewProperties {
    vp_DefaultValue: string | number;
    vp_Value: string | number;
    vp_Options: string[] | number[] | Array<{ label: (()=> UIView )| string, value: string, icon?: (()=>UIView) | string, disabled?: boolean, className?: string }>;
    vp_Size : SizeType;
    vp_OnChange: (value: string | number) => void;

}