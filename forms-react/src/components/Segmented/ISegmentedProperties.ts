import { ReactNode } from "react";
import { IViewProperties } from "../UIView/IViewProperties";
import { UIView } from "../UIView/UIView";

export type SizeType = 'small' | 'middle' | 'large' | undefined;

export interface ISegmentedProperties extends IViewProperties {
    vp_Options: string[] | number[] | Array<{ label: ReactNode, value: string, icon?: ReactNode, disabled?: boolean, className?: string }>;
    vp_Size : SizeType;
    vp_OnChange: (value: string | number) => void;

}