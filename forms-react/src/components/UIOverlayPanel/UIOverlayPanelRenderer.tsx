import { OverlayPanel } from 'primereact';
import React, { Fragment, useEffect, useRef } from "react";
import { UIOverlayPanelClass } from "./UIOverlayPanelClass";
import { css } from '@emotion/css';



export interface IControlProperties {
    control: UIOverlayPanelClass
}



function UIOverlayPanelRenderer({ control }: IControlProperties) {

    const overlayPanelRef = useRef(null);

    const style = {};
    style['width'] = control.Appearance.Width;
    style['height'] = control.Appearance.Height;
    style['padding'] = control.Appearance.Padding;


    const className = css`
        
        font-size: 1rem;
        color: #4b5563;
        background: #ffffff;
        padding: 0.75rem 0.75rem;
        border: 1px solid #d1d5db;
        transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
        appearance: none;
        border-radius: 6px;
    `;

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
                <OverlayPanel ref={overlayPanelRef} dismissable pt={{
                    root: { className: className }
                }}>
                    {
                        control.vp_Children.map(view => view && view.render())
                    }
                </OverlayPanel>
            </div>
        </Fragment>
    )

}

export default UIOverlayPanelRenderer;