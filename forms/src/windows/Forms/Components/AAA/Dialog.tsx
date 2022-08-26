import React, { createElement, Fragment } from "../../../../preact/compat";
import { Teact } from '../Teact';
import { ClassInfo, is, EventBus } from '@tuval/core';
import { InputText } from "../inputtext/TuInputText";
import { Control, Modes } from './Control';
import { ControlTypes } from "../ControlTypes";
import { Form } from "../form/Form";
import { ControlCollection } from './ControlCollection';
import { Property } from "./Reflection/PropertyDecorator";
import { Desktop } from "./Desktop/Desktop";

export enum DialogResult {
    Abort = 3,	//The dialog box return value is Abort (usually sent from a button labeled Abort).
    Cancel = 2, //The dialog box return value is Cancel (usually sent from a button labeled Cancel).
    Continue = 11, //The dialog box return value is Continue (usually sent from a button labeled Continue).
    Ignore = 5, //The dialog box return value is Ignore (usually sent from a button labeled Ignore).
    No = 7, //The dialog box return value is No(usually sent from a button labeled No).
    None = 0, //Nothing is returned from the dialog box.This means that the modal dialog continues running.
    OK = 1, //The dialog box return value is OK(usually sent from a button labeled OK).
    Retry = 4, //The dialog box return value is Retry(usually sent from a button labeled Retry).
    TryAgain = 10, //The dialog box return value is Try Again(usually sent from a button labeled Try Again).
    Yes = 6, //The dialog box return value is Yes(usually sent from a button labeled Yes).
}
export class Dialog<TController = any> extends Control<Dialog, TController> {

    @Property()
    public DialogResult: DialogResult;

    @Property()
    public Position: string;

    public get Controls(): ControlCollection {
        return this.GetProperty('Controls');
    }

    public set Controls(value: ControlCollection) {
        this.SetProperty('Controls', value);
    }

    public get FooterControls(): ControlCollection {
        return this.GetProperty('FooterControls');
    }

    public set FooterControls(value: ControlCollection) {
        this.SetProperty('FooterControls', value);
    }

    public SetupControlDefaults() {
        super.SetupControlDefaults();
        this.Controls = new ControlCollection(this);
        this.FooterControls = new ControlCollection(this);
        this.Visible = false;
        this.Position = 'center';
        this.DialogResult = DialogResult.None;


    }

    private renderControls(): any[] {
        return this.Controls.ToArray().map(control => {
            return (control as any).CreateMainElement();
        });
    }

    public CreateElements(): any {
        if (!this.Visible) {
            return;
        }

        const footer = this.FooterControls.ToArray().map(control => control.CreateMainElement());
        return <Form
            showHeader={false}
            showFooter={false}
            header={this.Text}
            footer={footer}
            position={this.Position}
            visible={true}
            baseZIndex={2000}
            style={this.GetStyleObject()}
            onHide={() => this.Hide()}>
            {this.renderControls()}
        </Form>
    }

    public OnShown(): void { }
    public ShowDialog() {
        this.Visible = true;
        Desktop.ModalDialogContainer.ModalDialogs.Add(this);
        Desktop.ModalDialogContainer.ForceUpdate();
        this.OnShown();
    }


    protected ShowDialogAsyncResolve: any;
    protected ShowDialogAsyncReject: any;
    public ShowDialogAsync(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.Visible = true;
            Desktop.ModalDialogContainer.ModalDialogs.Add(this);
            Desktop.ModalDialogContainer.ForceUpdate();
            this.OnShown();
            this.ShowDialogAsyncResolve = resolve;
            this.ShowDialogAsyncReject = reject;
        });

    }

    public Hide(): void {
        this.Visible = false;
        Desktop.ModalDialogContainer.ModalDialogs.Remove(this)
        // Desktop.ModalDialogContainer.ModalDialogs.Pop();
        Desktop.ModalDialogContainer.ForceUpdate();
    }

    protected GetStyleObject() {
        const style = super.GetStyleObject();
        style['width'] = this.Width + 'px';
        style['height'] = this.Height + 'px';
        return style;
    }


}