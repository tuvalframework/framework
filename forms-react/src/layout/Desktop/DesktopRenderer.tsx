import React, { Fragment, useMemo, useState } from "react";
import { DesktopController } from "../../DesktopController";
import { DesktopClass } from "./DesktopClass";
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Button, Toast } from "monday-ui-react-core";
import { EventBus, is } from "@tuval/core";
import  "monday-ui-react-core/dist/main.css";
import  "monday-ui-react-core/dist/Toast.css";
import { css } from "@emotion/css";


export interface IControlProperties {
    control: DesktopClass
}

const DesktopToast = () => {
    const className = css`
        width:fit-content;
        z-index:1;
    `
    
    const [positive, setPositive] = useState<any>({ opened: false });
    const [normal, setNormal] = useState<any>({ opened: false });
    const [negative, setNegative] = useState<any>({ opened: false });

    /*   const [contentPositive, setContentPositive] = useState('');
      const [contentNormal, setContentNormal] = useState('');
      const [contentNegative, setContentNegative] = useState(''); */

    //setTimeout(() => setOpened(true), 6000)

    EventBus.Default.on("show.normal.toast", ({ content = '', actionName = '', action = void 0 }) => {
        setNormal({
            content,
            opened: true,
            actionName,
            action
        })
    })
    EventBus.Default.on("show.positive.toast", ({ content = '', actionName = '', action = void 0 }) => {
        setPositive({
            content,
            opened: true,
            actionName,
            action
        })
    })

    EventBus.Default.on("show.negative.toast", ({ content = '', actionName = '', action = void 0 }) => {
        setNegative({
            content,
            opened: true,
            actionName,
            action
        })
    })

    const actions = useMemo(() => [{
        type: Toast.actionTypes.BUTTON,
        content: "Undo",
    }], []);

    return (
        <Fragment>
            <Toast className={className} open={normal.opened} type={Toast.types.NORMAL}  action={
                is.nullOrEmpty(normal.actionName) ? null :
                    <Button color={Button.colors.ON_PRIMARY_COLOR} kind={Button.kinds.SECONDARY} size="small" marginRight onClick={() => normal.action()}>
                        {normal.actionName}
                    </Button>

            } autoHideDuration={5000} onClose={() => setNormal({ opened: false })}>
                {normal.content}
            </Toast>

            <Toast className={className} open={positive.opened} type={Toast.types.POSITIVE} action={
                is.nullOrEmpty(positive.actionName) ? null :
                    <Button color={Button.colors.ON_PRIMARY_COLOR} kind={Button.kinds.SECONDARY} size="small" marginRight onClick={() => positive.action()}>
                        {positive.actionName}
                    </Button>

            } autoHideDuration={5000} onClose={() => setPositive({ opened: false })}>
                {positive.content}
            </Toast>

            <Toast className={className} open={negative.opened} type={Toast.types.NEGATIVE} action={
                is.nullOrEmpty(negative.actionName) ? null :
                    <Button color={Button.colors.ON_PRIMARY_COLOR} kind={Button.kinds.SECONDARY} size="small" marginRight onClick={() => negative.action()}>
                        {negative.actionName}
                    </Button>

            } autoHideDuration={5000} onClose={() => setNegative({ opened: false })}>
                {negative.content}
            </Toast>
        </Fragment>

    )
}

function DesktopRenderer({ control }: IControlProperties) {
    return (
        <Fragment>
            <ConfirmDialog />
            <DesktopToast />
            <DesktopController baseUrl={control.vp_BaseUrl} />
        </Fragment>

    );
}

export default DesktopRenderer;