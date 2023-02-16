import { OverlayPanel } from 'primereact';
import React, { Fragment, useEffect, useRef } from "react";
import { UIOverlayPanelClass } from "./UIOverlayPanelClass";



export interface IControlProperties {
    control: UIOverlayPanelClass
}



function UIOverlayPanelRenderer({ control }: IControlProperties) {

    const overlayPanelRef = useRef(null);

    const style = {};
    style['width'] = control.Appearance.Width;
    style['height'] = control.Appearance.Height;
    style['padding'] = control.Appearance.Padding;

    const createHeaderTemplate = () => {


        if (control.vp_HeaderTemplate != null) {
            const view = control.vp_HeaderTemplate;
            if (view != null) {
                return view.render();
            }
        }

        return null;
    }

    return (
        <Fragment>
            <div style={style} onClick={(e) => { overlayPanelRef.current.toggle(e); /* e.stopPropagation(); e.preventDefault(); */ }}>
                {createHeaderTemplate()}
                <OverlayPanel ref={overlayPanelRef} dismissable>
                    {
                        control.vp_Children.map(view => view && view.render())
                    }
                </OverlayPanel>
            </div>
        </Fragment>
    )

}

export default UIOverlayPanelRenderer;