import { is } from "@tuval/core";
import { AutoComplete } from "primereact";
import React, { createContext, Fragment } from "react";
import { UIView } from "../../components/UIView/UIView";
import { Theme } from "../../thema-system";
import { BiosThemeClass, UIThemeClass } from "./UIThemeClass";


export const BiosThemeContext = createContext(null!);

export const useBiosTheme = (): Theme => {
    return React.useContext(BiosThemeContext);
}



export const UIThemeContext = createContext(null!);

export const useTheme = (): Theme => {
    const theme = React.useContext(UIThemeContext);
    if (theme == null) {
        return useBiosTheme();
    }
    return theme;
}




interface IControlProperties {
    control: UIThemeClass
}




export function UIThemeRenderer({ control }: IControlProperties) {

    return (
        <UIThemeContext.Provider value={control.vp_Theme}>
            <Fragment>
                {
                    is.array(control.vp_Chidren) && control.vp_Chidren.map((view: UIView) => {
                        if (view == null || !(view instanceof UIView)) {
                            return null;
                        }
                        return view.render();
                    })
                }
            </Fragment>
        </UIThemeContext.Provider>
    );

}


interface IBiosControlProperties {
    control: BiosThemeClass
}



const BiosThemeRendererProxy = ({ control }: IBiosControlProperties) => (
    <Fragment>
        {
            control.vp_ContentFunc()?.render()
        }
    </Fragment>
)
/* export function BiosThemeRenderer({ control }: IBiosControlProperties) {
   
    return (
        <BiosThemeContext.Provider value={{}}>
            <BiosThemeRendererProxy control={control}></BiosThemeRendererProxy>
        </BiosThemeContext.Provider>
    )

} */


export function BiosThemeRenderer({ control }: IBiosControlProperties) {

    return (
        <BiosThemeContext.Provider value={control.vp_Theme}>

            <BiosThemeRendererProxy control={control}></BiosThemeRendererProxy>

        </BiosThemeContext.Provider>
    );

}

