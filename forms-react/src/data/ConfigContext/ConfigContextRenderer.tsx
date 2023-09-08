import { is } from "@tuval/core";
import { UIView } from "../../components/UIView/UIView";

import React, { Fragment } from "react";
import { ConfigContextClass, ConfigContextProvider, useConfig } from "./ConfigContextClass";

export interface IControlProperties {
    control: ConfigContextClass
}


function ConfigContextRenderer({ control }: IControlProperties) {
    

    let config = useConfig();

    
    const newConfig = Object.assign(config,control.vp_Config);


  
    return is.function(control.vp_ChildFunc) ?

        (
            <ConfigContextProvider.Provider value={newConfig}>

                {
                    control.vp_ChildFunc()?.render()

                }

            </ConfigContextProvider.Provider >
        ) : <Fragment></Fragment>
}

export default ConfigContextRenderer;