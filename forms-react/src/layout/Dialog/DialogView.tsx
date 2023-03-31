import { defaultField, IField, IFieldState, UIControllerContext, UIFormContext, UIFormController, ValidateRule } from "../../UIFormController";
import { Dialog } from "primereact";
import { State } from "../../UIController";
import React, { useState } from "react";
import { UIView } from "../../components/UIView/UIView";
import { ViewProperty } from "../../components/UIView/ViewProperty";
import { ModalDialogs } from "./DialogContainerClass";
import { Fragment } from "../../components/Fragment";
import { clone, int } from "@tuval/core";
import { ReactView } from "../../components/ReactView/ReactView";
import { query } from "../../data/DataContext/DataContextRenderer";
import { getAppFullName } from "../Application/Application";

interface IDialogControllerProps {
    view: DialogView
}

class DialogController extends UIFormController {
    public override LoadView(): UIView {

        const [value, setValue] = useState(0);
        this.props.view.ForceUpdate = () => {
            const newValue = value + 1;
            setValue(newValue);
        }
        
        let view = this.props.view.LoadView();

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
                    showHeader={this.props.view.ShowHeader}
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

export class DialogView extends UIView {

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

    @ViewProperty(true)
    public ShowHeader: boolean;

    @ViewProperty()
    private formData: { [key: string]: IField };

    @ViewProperty()
    public isValid: boolean;


    //public SetValue(name: string, value: any, silent?, isDirty?) { }
    //public GetValue(name: string) { }

    public ShowDialog() {
        const appName = getAppFullName();
        this.formData = {};
        this.Visible = true;
        ModalDialogs[appName].Add(this);
    }

    @ViewProperty(true)
    protected ShowDialogAsyncResolve: any;

    @ViewProperty(true)
    protected ShowDialogAsyncReject: any;

    public ShowDialogAsync(): Promise<any> {
        const appName = getAppFullName();
        return new Promise((resolve, reject) => {
            this.Visible = true;
            ModalDialogs[appName].Add(this);
            // this.OnShown();
            this.ShowDialogAsyncResolve = resolve;
            this.ShowDialogAsyncReject = reject;
        });

    }



    public Hide() {
        const appName = getAppFullName();
        this.Visible = false;
        ModalDialogs[appName].Remove(this);
    }

    public LoadView(): UIView {
        return null;
    }

    public render(): React.ReactNode {
        return (
            <UIFormContext.Provider value={this}>
                <UIControllerContext.Provider value={this}>
                    <DialogController view={this}> </DialogController>
                </UIControllerContext.Provider>

            </UIFormContext.Provider>

        )
    }

    public InvalidateQueries() {
        query.invalidateQueries();
    }
    public InvalidateQuerie(queryName: string) {
        query.invalidateQueries({ queryKey: [queryName] });
    }



    public validateForm(): any {

        //this.BeginUpdate();
        // let errors = [];
        let errorCount = 0;

        for (let key in this.formData) {
            const field: IField = this.formData[key];
            const errors = field.state.errors = [];
            for (let i = 0; i < field.options.rules.length; i++) {
                const rule = field.options.rules[i];
                rule.setField(field);
                const validate = rule.validate();
                if (!validate) {
                    errorCount++;
                    errors.push(rule.ErrorMessage);
                }
            }
        }

        if (errorCount === 0) {
            this.formData = { ...this.formData }

            const data = {};
            for (let key in this.formData) {
                data[key] = this.formData[key].value;
            }

            return [true, data];
            //this.OnSubmit(data);
        } else {
            for (let key in this.formData) {
                const field = this.formData[key];
                field.state.invalid = true;
            }

            this.isValid = false;
        }

        return [false, null]
        //this.EndUpdate();
    }
    protected OnSubmit(data) { }

    public Submit() {
        const [isValid, data] = this.validateForm();
        if (isValid) {
            this.OnSubmit(data);
        }
    }

    public ResetForm() {
        this.formData = {};
        /*  for (let key in this.formData) {
             this.SetValue(key, null);
         } */
    }

    public ClearErrors() { }

    public SetValue(name: string, value: any, silent: boolean = false, isDirty: boolean = false) {

        if (name != null) {
            const fieldName = name;

            if (this.formData[fieldName] == null) {
                this.formData[fieldName] = clone(defaultField);
            }
            const fieldInfo = this.formData[fieldName];
            fieldInfo.value = value;

            if (!silent) {
                this.formData = { ...this.formData };
            }
        }
    }

    public GetValue(name: string) {
        if (name != null) {
            const fieldName = name;

            if (this.formData[fieldName] == null) {
                this.formData[fieldName] = clone(defaultField);
            }
            const fieldInfo = this.formData[fieldName];
            return fieldInfo.value;
        }
    }

    public GetFieldState(name: string): IFieldState {
        if (name != null) {
            const fieldName = name;

            if (this.formData[fieldName] == null) {
                this.formData[fieldName] = clone(defaultField);
            }

            const fieldInfo = this.formData[fieldName];

            return fieldInfo.state;
        }
    }

    public SetFieldState(name: string, state: IFieldState): void {
        if (name != null) {
            const fieldName = name;

            if (this.formData[fieldName] == null) {
                this.formData[fieldName] = clone(defaultField);
            }

            const fieldInfo = this.formData[fieldName];

            fieldInfo.state = Object.assign(fieldInfo.state, state);
        }
    }

    public SetFieldTouch(name: string, isTouched: boolean): IFieldState {
        if (name != null) {
            const fieldName = name;

            if (this.formData[fieldName] == null) {
                return null;
            }
            const fieldInfo = this.formData[fieldName];

            fieldInfo.state.isTouched = isTouched;

            this.formData = { ...this.formData };
        }
    }

    public register(name: string, rules: ValidateRule[]) {
        if (name != null) {
            const fieldName = name;

            if (this.formData[fieldName] == null) {
                this.formData[fieldName] = clone(defaultField);
            }
            const fieldInfo = this.formData[fieldName];
            fieldInfo.options.rules = rules;

        }
    }


}