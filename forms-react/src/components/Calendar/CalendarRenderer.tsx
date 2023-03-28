import { DatePicker } from "monday-ui-react-core";
import { Calendar } from "primereact";
import React from "react";
import { CalendarClass } from "./CalendarClass";
import { moment } from "@tuval/core";

export interface IControlProperties {
    control: CalendarClass
}


function CalendarRenderer({ control }: IControlProperties) {

    return (
        <DatePicker data-testid="date-picker" date={moment(control.vp_Value)} onPickDate={d => alert(d)} />
       /*  <Calendar key={control.vp_Key} value={control.vp_Value} onChange={control.vp_OnChange?.bind(control)} showIcon={control.vp_ShowIcon} inline /> */
    );

}

export default CalendarRenderer;