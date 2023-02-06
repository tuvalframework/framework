import React, { useState } from "react";
import { TextField } from 'monday-ui-react-core';
import { AutoCompleteClass } from "./AutoCompleteClass";
import { AutoComplete } from "primereact";
import { is } from "@tuval/core";

export interface IControlProperties {
    control: AutoCompleteClass
}


function AutoCompleteRenderer({ control }: IControlProperties) {

    return (
        <AutoComplete
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