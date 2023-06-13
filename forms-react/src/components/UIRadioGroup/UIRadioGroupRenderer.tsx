import { Guid, is } from '@tuval/core';
import { RadioButton } from 'primereact';
import React, { Fragment, useMemo, useState } from "react";
import { UIRadioGroupClass } from './UIRadioGroupClass';
import { nanoid } from 'nanoid';



export interface IControlProperties {
    control: UIRadioGroupClass
}



function UIRadioGroupRenderer({ control }: IControlProperties) {


    const groupGuid = useMemo(() => nanoid(), [])

    return (

        <Fragment>
            {control.vp_RadioButtons.map(radioButtonInfo => {
                const guid = useMemo(() => nanoid(), []);
                return (
                    <div className="field-radiobutton">

                        <RadioButton
                            inputId={guid}
                            name={groupGuid}
                            value={radioButtonInfo.value}
                            onChange={(e) => is.function(control.vp_OnChange) ? control.vp_OnChange(e.value) : void 0}
                            checked={control.vp_Value === radioButtonInfo.value} />
                        <label htmlFor={guid}>{radioButtonInfo.label}</label>
                    </div>
                )
            })}
        </Fragment>
    )

}

export default UIRadioGroupRenderer;