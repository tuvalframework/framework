import { css } from "@emotion/css";
import { is } from "@tuval/core";
import { motion } from "framer-motion";
import { Tooltip } from "monday-ui-react-core";
import React, { Fragment, ReactNode } from "react";
import { UIView } from "../../components/UIView/UIView";
import { VStackClass } from "./VStackClass";
import { DndContext, useDraggable } from "@dnd-kit/core";
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export interface IControlProperties {
    control: VStackClass
}

function SortableItem({ id, view }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {
                view instanceof UIView ? view.render() : view
            }
        </div>
    );
}
function Draggable({ view }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: 'draggable',
    });
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;


    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            {view.render()}
        </div>
    );
}

function VStackRenderer({ control }: IControlProperties) {

    control.Appearance.Gap = control.vp_Spacing;
    

    const className =  css`
    ${control.Appearance.ToString()}
    ${control.HoverAppearance.IsEmpty ? '' : '&:hover { ' + control.HoverAppearance.ToString() + ' }'}
    ${control.ActiveAppearance.IsEmpty ? '' : '&:active { ' + control.ActiveAppearance.ToString() + ' }'}
    ${control.FocusAppearance.IsEmpty ? '' : '&:focus { ' + control.FocusAppearance.ToString() + ' }'}
    ${control.BeforeAppearance.IsEmpty ? '' : '&:before { ' + control.BeforeAppearance.ToString() + ' }'}
    ${control.AfterAppearance.IsEmpty ? '' : '&:after { ' + control.AfterAppearance.ToString() + ' }'}
`;

    const className2 = control.vp_Style ? css(control.vp_Style) : '';

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
            <motion.div ref={control.vp_Ref} className={` ${className2} ${control.vp_ClassName} ${className}`} {...control.GetEventsObject()} {...elementProperties}>
                {
                    is.array(control.vp_Chidren) && control.vp_Chidren.map((view: (UIView | ReactNode)) => {
                        if (view == null) {
                            return null;
                        }

                        /*  if (control.vp_Spacing) {
                             view.Appearance.MarginRight = control.vp_Spacing;
                         } */
                        if (view instanceof UIView) {
                            return view.render();
                        } else {
                            return view;
                        }

                    })
                }
            </motion.div>
        );
    }




    let finalComponent;

    if (control.vp_DragableItems) {
        finalComponent = (
            <div ref={control.vp_Ref} className={` ${className2} ${control.vp_ClassName} ${className}`} {...control.GetEventsObject()} draggable={control.vp_Draggable}>
                <SortableContext items={control.vp_Chidren.map((item, index) => ({ id: index }))}>
                    {
                        is.array(control.vp_Chidren) && control.vp_Chidren.map((view: (UIView | ReactNode), index) => {
                            if (view == null) {
                                return null;
                            }

                            /*  if (control.vp_Spacing) {
                                 view.Appearance.MarginBottom = control.vp_Spacing;
                             } */

                            return (
                                <SortableItem id={index} view={view}></SortableItem>
                            )
                        })
                    }
                </SortableContext>
            </div>
        )
    } else {
        finalComponent = (
            <div ref={control.vp_Ref} className={`${className} ${className2}`} {...control.GetEventsObject()} draggable={control.vp_Draggable}>

                {
                    is.array(control.vp_Chidren) && control.vp_Chidren.map((view: (UIView | ReactNode)) => {
                        if (view == null) {
                            return null;
                        }

                        /*   if (control.vp_Spacing) {
                              view.Appearance.MarginBottom = control.vp_Spacing;
                          } */

                        return view instanceof UIView ? view.render() : view;
                    })
                }

            </div>
        )
    }






    if (control.vp_Tooltip) {
        return (
            <Tooltip style={{ zIndex: 10001 }} content={control.vp_Tooltip} position={control.vp_TooltipPosition as any} showDelay={100} >
                {finalComponent}
            </Tooltip>
        )
    }
    return finalComponent;


}

export default VStackRenderer;