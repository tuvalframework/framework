import { UIFormController } from "../../UIFormController";
import { Dialog } from "primereact";
import { State } from "../../UIController";
import React from "react";
import { UIView } from "../../components/UIView/UIView";
import { ViewProperty } from "../../components/UIView/ViewProperty";
import { ModalDialogs } from "./DialogContainerClass";
import { Fragment } from "../../components/Fragment";
import { int } from "@tuval/core";
import { ReactView } from "../../components/ReactView/ReactView";
import { query } from "../../data/DataContext/DataContextRenderer";

interface IDialogControllerProps {
    view:DialogView
}

class DialogController extends UIFormController {
    public override LoadView(): UIView {

        let view =  this.props.view.LoadView();

        if (view == null) {
            view = Fragment()
        }

       const propsView: DialogView = this.props.view;
       propsView.SetValue = this.SetValue.bind(this);
       propsView.GetValue = this.GetValue.bind(this);

        return (
            ReactView(
                <Dialog header={this.props.view.Header} 
                position={this.props.view.Position}
                visible={this.props.view.Visible}
                 style={{ width: this.props.view.Width, height: this.props.view.Height }} onHide={() => this.props.view.Hide()}>
                    {
                        view.render()
                    }
                </Dialog>
            )
        )
    }
}

export  class DialogView extends UIView {

    @ViewProperty('')
    public Header: string;

    @ViewProperty('')
    public Width: string;

    @ViewProperty('')
    public Height: string;

    @ViewProperty(true)
    public Visible: boolean;

    @ViewProperty('center')
    public Position: string;

    public   SetValue(name: string, value: any, silent?, isDirty?) {}
    public   GetValue(name: string) {}

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
        return (
            <DialogController view={this}> </DialogController>
        )
    }

    public InvalidateQueries() {
        query.invalidateQueries();
    }
    public InvalidateQuerie(queryName: string) {
        query.invalidateQueries({ queryKey: [queryName] });
    }

}