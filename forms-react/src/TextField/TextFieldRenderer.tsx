import React, { useState } from "react";
import { TextField } from 'monday-ui-react-core';
import { TextFieldClass } from "./TextFieldClass";

export interface IControlProperties {
    control: TextFieldClass
}


function TextFieldRenderer({ control }: IControlProperties) {

    return (<TextField
        iconName="fa fa-square"
        placeholder="Placeholder text here"
        showCharCount
        title="Name"
        validation={{
            text: 'Helper text'
        }}
        wrapperClassName="monday-storybook-text-field_size"
        value={control.vp_Value}
        onChange={control.vp_OnChange?.bind(control)}
    />);

}

export default TextFieldRenderer;