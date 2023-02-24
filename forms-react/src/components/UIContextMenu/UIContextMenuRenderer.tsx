import { CONTINUE, foreach } from '@tuval/core';
import { Menu } from 'primereact';
import React, { Fragment, useEffect, useRef } from "react";
import { UIContextMenuClass } from './UIContextMenuClass';



export interface IControlProperties {
    control: UIContextMenuClass
}



function UIContextMenuRenderer({ control }: IControlProperties) {

    const items = [];



    // onClick={(e) => { view.FireClick(e); options.onClick(e); }

    foreach(control.items, view => {
        if (view == null) {
            return CONTINUE;
        }
        /* } else if (view instanceof DividerClass) {
            items.push({ separator: true });
        } */ else {
            items.push({
                // command: (event) => console.log('clicked'),
                template: (item, options) => {
                    return (
                        //@ts-ignore
                        <div className={options.className} target={item.target} onClick={options.onClick}>
                            {view.render()}
                        </div>
                    );
                }
            })
        }

    });

    const style = {};
    style['width'] = control.Appearance.Width;
    style['height'] = control.Appearance.Height;
    style['padding'] = control.Appearance.Padding;

    control.Appearance.Padding = '';

    const menuRef = useRef(null);
    return (
        <Fragment>
            <div style={style} onClick={(e) => { menuRef.current.toggle(e); /* e.stopPropagation(); e.preventDefault(); */ }}>
                {
                    control.vp_Children.map(view => view && view.render())
                }
                <Menu id='mu_context_menu' popup model={items} ref={menuRef}></Menu>
            </div>
        </Fragment>

    )

}

export default UIContextMenuRenderer;