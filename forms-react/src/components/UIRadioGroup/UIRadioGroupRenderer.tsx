import { Guid } from '@tuval/core';
import { RadioButton } from 'primereact';
import React, { Fragment, useState } from "react";
import { UIRadioGroupClass } from './UIRadioGroupClass';



export interface IControlProperties {
    control: UIRadioGroupClass
}



function UIRadioGroupRenderer({ control }: IControlProperties) {

    const [groupGuid] = useState(Guid.NewGuid().ToString());
    const [guid] = useState(Guid.NewGuid().ToString());
    const [radioButtonValue, setRadioButtonValue] = useState(null);
    
    return (
       
            <Fragment>
                {control.vp_RadioButtons.map(radioButtonInfo => {
                    const guid = Guid.NewGuid().ToString();

                    return (
                        <div className="field-radiobutton">
                            <RadioButton 
                            inputId={guid} 
                            name={groupGuid} 
                            value={radioButtonInfo.value} 
                            onChange={(e) => setRadioButtonValue(e.value) } 
                            checked={ radioButtonValue === radioButtonInfo.value} />
                            <label htmlFor={guid}>{radioButtonInfo.label}</label>
                        </div>
                    )
                })}
            </Fragment>
    )

}

export default UIRadioGroupRenderer;