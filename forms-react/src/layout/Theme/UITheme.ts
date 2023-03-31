import { UIView } from "../../components/UIView/UIView";
import { Theme } from "../../thema-system";
import { BiosThemeClass, UIThemeClass } from "./UIThemeClass";

interface UIThemeParams {
    thema?: Theme;
}
type FunctionUITheme = (...views: UIView[]) => UIThemeClass;

export function UITheme(value: UIThemeParams): FunctionUITheme {
    return (...views: UIView[]): UIThemeClass => {
        return new UIThemeClass().theme(value.thema).children(...views)
    }
}

interface BiosThemeParams {
    thema?: Theme;
}
type FunctionBiosTheme = (content: () => UIView) => BiosThemeClass;

export function BiosTheme(value: BiosThemeParams): FunctionBiosTheme {
    return (views: () => UIView): BiosThemeClass => {
        return new BiosThemeClass().theme(value.thema).contentFunc(views)
    }
}