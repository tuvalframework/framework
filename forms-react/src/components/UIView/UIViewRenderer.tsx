import React, { Fragment, FunctionComponent, useInsertionEffect, useMemo, useState } from "react";
import { UIView } from "./UIView";
import { css } from '@emotion/css'
import { Tooltip } from "monday-ui-react-core";

export interface IControlProperties {
    control: UIView;
    renderer: FunctionComponent<any>;
    wrap: boolean;
}


const UIViewRenderer = ({ control, renderer, wrap }: IControlProperties) => {
    control.RenderStarted();

    const [value, setValue] = useState(0);
    control.ForceUpdate = () => {
        const newValue = value + 1;
        setValue(value);
    }

    /* const _className = useMemo<string>(() => {
        return css`
        ${control.Appearance.ToString()}
        ${control.HoverAppearance.IsEmpty ? '' : '&:hover { ' + control.HoverAppearance.ToString() + ' }'}
        ${control.ActiveAppearance.IsEmpty ? '' : '&:active { ' + control.ActiveAppearance.ToString() + ' }'}
        ${control.FocusAppearance.IsEmpty ? '' : '&:focus { ' + control.FocusAppearance.ToString() + ' }'}
    `;
    }, [
        control.Appearance.Hash,
        control.HoverAppearance.Hash,
        control.ActiveAppearance.Hash,
        control.FocusAppearance.Hash
    ])
 */

    const _className = css`
    ${control.Appearance.ToString()}
    ${control.HoverAppearance.IsEmpty ? '' : '&:hover { ' + control.HoverAppearance.ToString() + ' }'}
    ${control.ActiveAppearance.IsEmpty ? '' : '&:active { ' + control.ActiveAppearance.ToString() + ' }'}
    ${control.FocusAppearance.IsEmpty ? '' : '&:focus { ' + control.FocusAppearance.ToString() + ' }'}
`;

    let component = null;
    if (wrap) {
        component = (
            <div className={_className} >
                {React.createElement(renderer, { control: control })}
            </div>
        )
    } else {
        component = (
            <Fragment>
                {React.createElement(renderer, { control: control })}
            </Fragment>
        )
    }


    control.RenderFinished();
    let finalComponent;
    if (control.vp_Tooltip) {
        finalComponent = (
            <Tooltip content={control.vp_Tooltip} position={Tooltip.positions.RIGHT} >
                <div className="monday-storybook-tooltip_icon-wrapper">
                    {
                        component
                    }
                </div>
            </Tooltip>
        )
    } else {
        finalComponent = component;
    }

    return finalComponent;
}

export default UIViewRenderer;