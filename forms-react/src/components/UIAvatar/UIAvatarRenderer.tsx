import { Avatar } from 'primereact';
import React, { Fragment, useEffect, useRef } from "react";
import { UIAvatarClass } from './UIAvatarClass';



export interface IControlProperties {
    control: UIAvatarClass
}



function UIAvatarRenderer({ control }: IControlProperties) {

    return (
        <Avatar shape='circle'>
            {
                control.vp_Children.map(view => view && view.render())
            }
        </Avatar>
    )

}

export default UIAvatarRenderer;