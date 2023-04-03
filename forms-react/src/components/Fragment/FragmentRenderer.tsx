import { List } from 'monday-ui-react-core';
import React, { Fragment } from "react";
import { FragmentClass } from './FragmentClass';
import { is } from '@tuval/core';

export interface IControlProperties {
    control: FragmentClass
}


function FragmentRenderer({ control }: IControlProperties) {

    return (
        <Fragment>
            {
                control.vp_Children.map(child => is.function(child.render) && child.render()) as any
            }
        </Fragment>
    );

}

export default FragmentRenderer;