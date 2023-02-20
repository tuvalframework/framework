import { UIFormController } from "../../UIFormController";
import { Dialog } from "primereact";
import { State } from "../../UIController";
import React from "react";
import { UIView } from "../../components/UIView/UIView";
import { ViewProperty } from "../../components/UIView/ViewProperty";
import { ModalDialogs } from "./DialogContainerClass";
import { Fragment } from "../../components/Fragment";
import { int } from "@tuval/core";

export class DialogView extends UIView {

    @ViewProperty('')
    public Header: string;

    @ViewProperty('')
    public Width: string;

    @ViewProperty('')
    public Height: string;

    @ViewProperty(true)
    public Visible: boolean;

    public ShowDialog() {
        this.Visible = true;
        ModalDialogs.Add(this);
    }

    @ViewProperty(true)
    protected ShowDialogAsyncResolve: any;

    @ViewProperty(true)
    protected ShowDialogAsyncReject: any;

    public ShowDialogAsync(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.Visible = true;
            ModalDialogs.Add(this);
           // this.OnShown();
            this.ShowDialogAsyncResolve = resolve;
            this.ShowDialogAsyncReject = reject;
        });

    }



    public Hide() {
        this.Visible = false;
        ModalDialogs.Remove(this);
    }

    public LoadView(): UIView {
        return null;
    }

    public render(): React.ReactNode {

        let view = this.LoadView();

        if (view == null) {
            view = Fragment()
        }

        return (
            <Dialog header={this.Header}  visible={this.Visible} style={{ width: this.Width, height: this.Height }} onHide={() => this.Hide()}>
                {
                    view.render()
                }
            </Dialog>
        )
    }
}