import React, { Fragment } from "react";
import { DesktopController } from "../../DesktopController";
import { DesktopClass } from "./DesktopClass";
import { ConfirmDialog} from 'primereact/confirmdialog';


export interface IControlProperties {
    control: DesktopClass
}


function DesktopRenderer({ control }: IControlProperties) {
    return (
        <Fragment>
             <ConfirmDialog />
            <DesktopController baseUrl={control.vp_BaseUrl} />
        </Fragment>

    );
}

export default DesktopRenderer;