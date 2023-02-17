import { is } from "@tuval/core";
import { ListBox } from "primereact";
import React from "react";
import { ListBoxClass } from "./ListBoxClass";

export interface IControlProperties {
    control: ListBoxClass
}


function ListBoxRenderer({ control }: IControlProperties) {

    return (
        <ListBox
            value={control.vp_Value}
            onChange={(e) => is.function(control.vp_OnChange) ? control.vp_OnChange(e.value) : void 0}
            options={control.vp_Model}
            optionLabel={control.vp_fields.text}
            optionValue={control.vp_fields.value}
        />
    );

}

export default ListBoxRenderer;