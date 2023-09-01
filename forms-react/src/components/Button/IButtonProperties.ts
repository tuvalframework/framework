import { IViewProperties } from "../UIView/IViewProperties";
import { UIView } from "../UIView/UIView";


export enum ButtonType {
    PRIMARY = "primary",
    SECONDARY = "secondary",
    TERTIARY = "tertiary"
}

export enum ButtonSize {
    SMALL = "small",
    MEDIUM = "medium",
    LARGE = "large",
    XXS = "xxs",
    XS = "xs"
}

export type ColorType = 'primary' | 'secondary' | 'danger' | 'success';

//const ButtonTypes: readonly ["default", "primary", "dashed", "link", "text"];



export interface IButtonProperties extends IViewProperties {
    vp_Label: string;
    vp_Loading: boolean;
    vp_Kind: ButtonType;
    vp_Size: ButtonSize;
    vp_Color: ColorType;
    vp_Children: UIView[];
}
