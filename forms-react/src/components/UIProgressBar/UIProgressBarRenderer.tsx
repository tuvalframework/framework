import { is } from "@tuval/core";
import { template } from "handlebars";
import React from "react";
import { UIProgressBarClass } from "./UIProgressBarClass";
import { ProgressBar } from 'primereact/progressbar';
import { UIView } from "../UIView/UIView";
import { css } from "@emotion/css";
import { useTheme } from "../../layout";

export interface IControlProperties {
    control: UIProgressBarClass
}


function UIProgressBarRenderer({ control }: IControlProperties) {
    const theme = useTheme();

    const className = css({
        '&.p-progressbar': {
            border: '0 none',
            background: '#dee2e6',
            borderRadius: 6,
            width: '100%',
            height: '100%',
            ...(control.vp_LabelOffset !== 0 && {
                overflow: 'unset'
            }),
            ...(theme && {
                // backgroundColor: getColorShade(theme, 'primary'),
                boxShadow: 'inset 0 1px 2px rgb(0 0 0 / 10%)'
            }),
            // progress bar
            '& .p-progressbar-value': {
                border: '0 none',
                borderRadius: '6px 0px 0px 6px',
                margin: 0,
                transition: 'transform 0.2s linear',
                ...(theme && {
                    //backgroundColor: (theme.vars || theme).palette['primary'].main,
                }),
                ...(theme == null && {
                    background: '#6366F1'
                }),

            },
            '& .p-progressbar-label': {
                color: '#ffffff',
                lineHeight: '1.5rem',
                ...(control.vp_LabelOffset !== 0 && {
                    position: 'absolute',
                    top: control.vp_LabelOffset,
                    left: control.vp_value + '%',
                    width: 'auto',
                    transform: 'translate(-50%)',
                    transition: 'all .5s ease-in-out'
                })

            }
        }
    });

    const template = (value) => {
        const view: UIView = control.vp_ValueTemplate(value);
        if (view != null) {
            return view.render();
        }
    }
    return (
        is.function(control.vp_ValueTemplate) ?
            <ProgressBar className={className} value={control.vp_value} displayValueTemplate={template}></ProgressBar>
            :
            <ProgressBar className={className} value={control.vp_value}></ProgressBar>
    )
}

export default UIProgressBarRenderer;