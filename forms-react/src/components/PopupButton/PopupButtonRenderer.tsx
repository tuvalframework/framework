import { css } from "@emotion/css";
import { Dialog, DialogContentContainer, Menu, MenuButton, MenuGridItem, MenuItem, MenuTitle } from "monday-ui-react-core";

import React, { Fragment, useCallback, useMemo, useState } from "react";
import { Icons } from "../Icon";
import { PopupButtonClass } from "./PopupButtonClass";
import { AnimationType, HideShowEvent } from "monday-ui-react-core/dist/types/constants/dialog";
import { DialogEvent } from "monday-ui-react-core/dist/types/components/Dialog/Dialog";
import { is } from "@tuval/core";

export enum DialogType {
    MODAL = "modal",
    POPOVER = "popover"
}
export enum DialogSize {
    NONE = "none",
    SMALL = "small",
    MEDIUM = "medium",
    LARGE = "large"
}


export interface IControlProperties {
    control: PopupButtonClass
}


const WrapperComponent = ({ control }) => {
    return (
        /*   <div style={{background:'yellow', width:'30px', height:'30px'}}>AAA</div> */
        <Fragment>
            {control.vp_View.render()}
        </Fragment>
    )
}

const Content = ({ control }) => {
    return (
        <Fragment>
            {
                control.vp_Children.map(view => <Fragment>{view.render()}</Fragment>)
            }
        </Fragment>
    )
}

function PopupButtonRenderer({ control }: IControlProperties) {
    const className = css`
    ${control.Appearance.ToString()}
`;




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
            if (is.function(control.vp_OnDidHide)) {
                control.vp_OnDidHide();
            }

        },
        [setIsOpen]
    );

    if (is.function(control.vp_HideHandle)) {
        const handle = () => setIsOpen(false)
        control.vp_HideHandle(handle);
    }

    return (
        <Dialog
           
            open={control.vp_Open}
            isOpen={isOpen}
            //moveBy={computedDialogOffset}
            content={<DialogContentContainer className={className} size={DialogSize.NONE}
                type={DialogType.POPOVER}>
                <Content control={control}></Content>
            </DialogContentContainer>}
            //@ts-ignore
            showTrigger={showTrigger}
            hideTrigger={[Dialog.hideShowTriggers.CLICK_OUTSIDE/* ,Dialog.hideShowTriggers.CONTENT_CLICK */]}
            //@ts-ignore
            animationType={'expand'}
            //@ts-ignore
            position={control.vp_DialogPosition}
            //@ts-ignore
            // moveBy={control.vp_DialogOffset}
            // startingEdge={"bottom"}
            useDerivedStateFromProps={true}
            onDialogDidShow={onDialogDidShow}
            onDialogDidHide={onDialogDidHide}
        >
            <div style={{ width: '100%' }}>
                <WrapperComponent control={control}></WrapperComponent>
            </div>


        </Dialog>


    );

}

export default PopupButtonRenderer;