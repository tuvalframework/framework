import { FunctionComponent } from "react";
import { UIView } from "../UIView/UIView";
import { IconSubComponentProps } from "monday-ui-react-core/dist/types/components/Icon/Icon";

export interface ITab {
    id?: string;
    active?: boolean;
    children?: UIView;
    focus?: boolean;
    icon?: string | FunctionComponent<IconSubComponentProps>;
    iconSide?: string;
    onClick?: (value: number) => void
    value?: number;
    text?: string;
    disabled?: boolean;
    view?: ()=> UIView;

}