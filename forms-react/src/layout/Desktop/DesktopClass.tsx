import { EventBus, Func, foreach, int, is } from "@tuval/core";
import React from "react";
import { AlignmentType, cBottom, cBottomLeading, cBottomTrailing, cCenter, cLeading, cTop, cTopLeading, cTopTrailing, cTrailing } from "../../Constants";
import { UIController } from "../../UIController";
import { UIView } from "../../components/UIView/UIView";
import { UIViewRenderer } from "../../components/UIView/UIViewRenderer";
import { ViewProperty } from "../../components/UIView/ViewProperty";
import HStackRenderer from "./DesktopRenderer";
import DesktopRenderer from "./DesktopRenderer";
import { Toast } from "monday-ui-react-core";

export function ShowSuccessToast(content: string, actionName?: string, action?: Function) {
    EventBus.Default.fire("show.positive.toast", {content, actionName, action });
}

export function ShowToast(content: string, actionName?: string, action?: Function) {
    EventBus.Default.fire("show.normal.toast", { content: content , actionName, action});
}

export function ShowFailToast(content: string, actionName?: string, action?: Function) {
    EventBus.Default.fire("show.negative.toast", { content: content, actionName, action });
}

export class DesktopClass extends UIView {

    /** @internal */
    @ViewProperty() vp_BaseUrl: string;

    public baseUrl(value: string) {
        this.vp_BaseUrl = value;
        return this;
    }

    public constructor() {
        super();
    }



    public render() {
        return (<UIViewRenderer wrap={false} control={this} renderer={DesktopRenderer}></UIViewRenderer>)
    }
}