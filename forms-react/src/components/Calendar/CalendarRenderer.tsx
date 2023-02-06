import React, { useState } from "react";
import { TextField } from 'monday-ui-react-core';
import { Calendar } from "primereact";
import { is } from "@tuval/core";
import { CalendarClass } from "./CalendarClass";

export interface IControlProperties {
    control: CalendarClass
}


function CalendarRenderer({ control }: IControlProperties) {

    return (
        <Calendar key={control.vp_Key} value={control.vp_Value} onChange={control.vp_OnChange?.bind(control)} showIcon={control.vp_ShowIcon} />
    );

}

export default CalendarRenderer;