import { css } from "@emotion/css";
import { Heading } from "monday-ui-react-core";



import React from "react";
import { GaugeClass } from "./GaugeClass";



export interface IControlProperties {
    control: GaugeClass
}

function GaugeRenderer({ control }: IControlProperties) {
    const className = css`
    circle {
        transition: stroke-dashoffset 0.35s;
        transform: rotate(-90deg);
        transform-origin: 50% 50%;
      }
    `;


    const stroke = control.vp_Stroke;
    const radius = control.vp_Radius;
    const normalizedRadius = radius - stroke * 2;
    const _circumference = normalizedRadius * 2 * Math.PI;
    const offset = _circumference - (control.vp_Value / 100 * _circumference);

    return (

        <svg className={className} width={`${control.vp_Radius * 2}`} height={`${control.vp_Radius * 2}`}>
            <circle stroke={control.vp_MaskColor} strokeWidth={`${stroke / 3 * 2}`} fill="transparent" r={`${normalizedRadius}`} cx={'50%'} cy={'50%'}></circle>
            <circle stroke={control.vp_Color} strokeDasharray={`${_circumference} ${_circumference}`} strokeDashoffset={`${offset}`} strokeWidth={`${stroke}`} strokeLinecap="round"
            fill="transparent" r={`${normalizedRadius}`} cx={'50%'} cy={'50%'}></circle>
            <text textAnchor="middle" fill={`${control.Appearance.Color}`} fontSize={`${control.Appearance.FontSize}`} dy={".3em"} x={'50%'} y={'50%'}>
                {control.vp_Value?.toString()}
            </text>
        </svg>

    );

}

export default GaugeRenderer;