import { css } from "@emotion/css";
import { is } from "@tuval/core";
import React, { Fragment } from "react";
import { UIView } from "../../components/UIView/UIView";
import { HStackClass } from "./HStackClass";
import { motion } from "framer-motion"


export interface IControlProperties {
    control: HStackClass
}


function HStackRenderer({ control }: IControlProperties) {

    const className = css`
    ${control.Appearance.ToString()}
    ${control.HoverAppearance.IsEmpty ? '' : '&:hover { ' + control.HoverAppearance.ToString() + ' }'}
    ${control.ActiveAppearance.IsEmpty ? '' : '&:active { ' + control.ActiveAppearance.ToString() + ' }'}
    ${control.FocusAppearance.IsEmpty ? '' : '&:focus { ' + control.FocusAppearance.ToString() + ' }'}
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

                    control.vp_Chidren.map((view: UIView) => {
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

    return (
        <div className={className} {...events}>
            {

                control.vp_Chidren.map((view: UIView) => {
                    if (view == null) {
                        return null;
                    }

                    if (control.vp_Spacing) {
                        view.Appearance.MarginRight = control.vp_Spacing;
                    }
                    return view.render();
                })
            }
        </div>
    );

}

export default HStackRenderer;