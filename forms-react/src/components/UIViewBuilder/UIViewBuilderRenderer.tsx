import { Guid } from '@tuval/core';
import { RadioButton } from 'primereact';
import React, { Fragment, useState } from "react";
import { UIViewBuilderClass } from './UIViewBuilderClass';



export interface IControlProperties {
    control: UIViewBuilderClass
}



function UIViewBuilderRenderer({ control }: IControlProperties) {    
    return (
       
            <Fragment>
                {
                    control.vp_Content().render()
                }
            </Fragment>
    )

}

export default UIViewBuilderRenderer;