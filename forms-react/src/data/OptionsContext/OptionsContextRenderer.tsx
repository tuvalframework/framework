import { is } from "@tuval/core";
import { UIView } from "../../components/UIView/UIView";
import { OptionsContextClass, OptionsContextProvider } from "./OptionsContextClass";
import React, { Fragment } from "react";

export interface IControlProperties {
    control: OptionsContextClass
}


function OptionsContextRenderer({ control }: IControlProperties) {
    return is.function(control.vp_ChildFunc) ?

        (
            <OptionsContextProvider.Provider value={control.vp_Options}>

                {
                    control.vp_ChildFunc()?.render()

                }

            </OptionsContextProvider.Provider >
        ) : <Fragment></Fragment>
}

export default OptionsContextRenderer;