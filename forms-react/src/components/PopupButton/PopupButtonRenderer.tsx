import { css } from "@emotion/css";
import { Dialog, DialogContentContainer, Menu, MenuButton, MenuGridItem, MenuItem, MenuTitle } from "monday-ui-react-core";

import React, { Fragment, useCallback, useMemo, useState } from "react";
import { Icons } from "../Icon";
import { PopupButtonClass } from "./PopupButtonClass";
import { AnimationType, HideShowEvent } from "monday-ui-react-core/dist/types/constants/dialog";
import { DialogEvent } from "monday-ui-react-core/dist/types/components/Dialog/Dialog";
import { is } from "@tuval/core";

export interface IControlProperties {
    control: PopupButtonClass
}



function PopupButtonRenderer({ control }: IControlProperties) {



    const className = css`
    & .menu-button--wrapper--open {
        background-color: transparent;
    }
    & .menu-button--wrapper:hover {
        background-color: transparent;
    }
    & .menu-button--wrapper:focus {
        background-color: transparent;
    }
`;

    const WrapperComponent = () => {
        return (
            <Fragment>
                {control.vp_View.render()}
            </Fragment>
        )
    }

    const Content = () => {
        return (
            <Fragment>
                {
                    control.vp_Children.map(view => <Fragment>{view.render()}</Fragment>)
                }
            </Fragment>
        )
    }

    const showTrigger = ['click', 'enter'];

    const MOVE_BY = { main: 0, secondary: -6 };

    const computedDialogOffset = useMemo(
        () => ({
            ...MOVE_BY
        }),
        []
    );

    const [isOpen, setIsOpen] = useState(false);

    const onDialogDidShow = useCallback(() => {
        setIsOpen(true);

    }, [setIsOpen]);

    const onDialogDidHide = useCallback(
        (event: DialogEvent, hideEvent: string) => {
            setIsOpen(false);

        },
        [setIsOpen]
    );

    if (is.function(control.vp_HideHandle)) {
        const handle = () => setIsOpen(false)
        control.vp_HideHandle(handle);
    }
    
    return (

        <div className={className}>
            <Dialog
                isOpen={isOpen}
                moveBy={computedDialogOffset}
                content={<DialogContentContainer size={'medium'}
                    type={'popover'}>
                    <Content></Content>
                </DialogContentContainer>}
                //@ts-ignore
                showTrigger={showTrigger}
                hideTrigger={[Dialog.hideShowTriggers.CLICK_OUTSIDE]}
                //@ts-ignore
                animationType={'expand'}
                //@ts-ignore
                position={control.vp_DialogPosition}
                dialogOffset={control.vp_DialogOffset}
                startingEdge={"bottom"}
                useDerivedStateFromProps={true}
                onDialogDidShow={onDialogDidShow}
                onDialogDidHide={onDialogDidHide}
            >
                <WrapperComponent></WrapperComponent>

            </Dialog>

            {/*    <MenuButton closeDialogOnContentClick={true}
                //@ts-ignore
                componentPosition={'start'}
                dialogOffset={control.vp_DialogOffset}

                //@ts-ignore
                dialogPosition={control.vp_DialogPosition}
                component={WrapperComponent} zIndex={10000}
            >
                <Menu
                    id="menu"
                    size="large"
                >
                    <MenuGridItem>
                        <Fragment>
                            {
                                control.vp_Children.map(view => <Fragment>{view.render()}</Fragment>)
                            }
                        </Fragment>
                    </MenuGridItem>
                </Menu>
            </MenuButton>  */}
        </div>
    );

}

export default PopupButtonRenderer;