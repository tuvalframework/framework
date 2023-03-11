import { css } from "@emotion/css";
import { is } from "@tuval/core";
import { motion } from "framer-motion";
import { Tooltip } from "monday-ui-react-core";
import React, { Fragment } from "react";
import { UIView } from "../../components/UIView/UIView";
import { VStackClass } from "./VStackClass";


export interface IControlProperties {
    control: VStackClass
}


function VStackRenderer({ control }: IControlProperties) {

    const className = css`
    ${control.Appearance.ToString()}
    ${control.HoverAppearance.IsEmpty ? '' : '&:hover { ' + control.HoverAppearance.ToString() + ' }'}
    ${control.ActiveAppearance.IsEmpty ? '' : '&:active { ' + control.ActiveAppearance.ToString() + ' }'}
    ${control.FocusAppearance.IsEmpty ? '' : '&:focus { ' + control.FocusAppearance.ToString() + ' }'}
    ${control.BeforeAppearance.IsEmpty ? '' : '&:focus { ' + control.FocusAppearance.ToString() + ' }'}
`;

    const events = {};
    events['onClick'] = is.function(control.vp_OnClick) ? (e) => control.vp_OnClick(e) : void 0;

    const elementProperties = {}
    if (control.renderAsAnimated) {
        elementProperties['animated'] = true;

        if (control._initial != null) {
            elementProperties['initial'] = control._initial;
        }
        if (control._animate != null) {
            elementProperties['animate'] = control._animate;
        }
        if (control._transition != null) {
            elementProperties['transition'] = control._transition;
        }

        if (control._whileHover != null) {
            elementProperties['whileHover'] = control._whileHover;
        }
        if (control._whileTap != null) {
            elementProperties['whileTap'] = control._whileTap;
        }
        if (control._whileDrag != null) {
            elementProperties['whileDrag'] = control._whileDrag;
        }
        if (control._whileFocus != null) {
            elementProperties['whileFocus'] = control._whileFocus;
        }
        if (control._whileInView != null) {
            elementProperties['whileInView'] = control._whileInView;
        }
        if (control._exit != null) {
            elementProperties['exit'] = control._exit;
        }
        console.log(elementProperties)


        return (
            <motion.div className={className} {...events} {...elementProperties}>
                {
                    is.array(control.vp_Chidren) && control.vp_Chidren.map((view: UIView) => {
                        if (view == null) {
                            return null;
                        }

                        if (control.vp_Spacing) {
                            view.Appearance.MarginRight = control.vp_Spacing;
                        }
                        return view.render();
                    })
                }
            </motion.div>
        );
    }

    const finalComponent = (
        <div className={className} {...events}>
            {

                is.array(control.vp_Chidren) && control.vp_Chidren.map((view: UIView) => {
                    if (view == null || !(view instanceof UIView)) {
                        return null;
                    }

                    if (control.vp_Spacing) {
                        view.Appearance.MarginBottom = control.vp_Spacing;
                    }
                    return view.render();
                })
            }
        </div>
    )

    if (control.vp_Tooltip) {
        return (
            <Tooltip style={{zIndex: 10001}}  content={control.vp_Tooltip} position={Tooltip.positions.BOTTOM} showDelay={100} >
                {finalComponent}
            </Tooltip>
        )
    }
    return finalComponent;


}

export default VStackRenderer;