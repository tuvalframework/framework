import { css } from "@emotion/css";
import { UISliderClass } from "./UISliderClass";
import { Slider } from 'primereact'
import React from "react";



export interface IControlProperties {
    control: UISliderClass
}


function UISliderRenderer({ control }: IControlProperties) {

    const className = css`
    & .p-slider {
        position: relative;
    }

    & .p-slider .p-slider-handle {
        position: absolute;
       /*  cursor: grab; */
        touch-action: none;
        display: block;
        z-index: 1;
        border-radius: 100%;
        background-color: #fff;
        box-shadow: 0 2px 10px rgb(0 0 0 / 16%), 0 2px 5px rgb(0 0 0 / 26%);
        width: 24px;
        height: 24px;
        border: 0px !important;
        margin-left: -12px !important;
    }

    & .p-slider .p-slider-handle.p-slider-handle-active {
        z-index: 2;
    }

    & .p-slider .p-slider-range {
        background: rgb(20, 169, 213);
    }

    & .p-slider-range {
        position: absolute;
        display: block;
    }

    & .p-slider-horizontal .p-slider-range {
        top: 0;
        left: 0;
        height: 100%;
    }

    & .p-slider-horizontal .p-slider-handle {
        top: 50%;
    }

    & .p-slider-vertical {
        height: 100% !important;
        background-color: #d8d8d8 !important;
        border-radius: 4px !important;
        width: 8px !important;
    }

    & .p-slider-vertical .p-slider-handle {
        left: 50%;
    }

    & .p-slider-vertical .p-slider-range {
        bottom: 0;
        left: 0;
        width: 100%;
        border-radius: 4px !important;
        /* height: 100%; */
        width: 8px !important;
    }
    `;

    return (
        <div className={className}>
            <Slider style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', float: 'none' }} max={control.Max} min={control.Min} value={control.Value} onChange={(e) => control.Changed(e.value)} orientation={control.Orientation} />

        </div>
    )

}

export default UISliderRenderer;
