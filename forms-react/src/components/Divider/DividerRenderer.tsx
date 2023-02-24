import React from "react";
import { DividerClass } from './DividerClass';



export interface IControlProperties {
    control: DividerClass
}



function DividerRenderer({ control }: IControlProperties) {

    return (
        <div style={{
            width: control.Appearance.Width,
            height: control.Appearance.Height,
            background: control.Appearance.Background,
            backgroundImage: control.Appearance.BackgroundImage,
        }}> </div>
    )

}

export default DividerRenderer;