import { is } from "@tuval/core";
import { AutoComplete } from "primereact";
import React from "react";
import { AutoCompleteClass } from "./AutoCompleteClass";

export interface IControlProperties {
    control: AutoCompleteClass
}


function AutoCompleteRenderer({ control }: IControlProperties) {

    return (
        <AutoComplete
            key={control.vp_Key}
            field={control.vp_Field}
            value={control.vp_Value}
            suggestions={control.vp_DataSource}
            completeMethod={(e) => is.function(control.vp_CompleteMethod) ? control.vp_CompleteMethod(e.query) : void 0}
            onChange={(e) => is.function(control.vp_OnChange) ? control.vp_OnChange(e.value) : void 0}
            dropdown
        />
    );

}

export default AutoCompleteRenderer;