import { clone, Convert, int, is } from "@tuval/core";
import React, { Fragment, useEffect } from "react";
import { createContext } from "react";
import { useParams } from "react-router-dom";
import { query } from "./data/DataContext/DataContextRenderer";
import { State, UIController } from "./UIController";
import * as  objectPath from "object-path";

export const UIFormContext = createContext(null!);
export const UIControllerContext = createContext(null!);

export const useFormController = (): UIFormController =>
    React.useContext(UIFormContext);

export const useController = (): UIController =>
    React.useContext(UIControllerContext);



export function UIControllerProxy({ children, controller }) {
    const params = useParams();

    useEffect(() => {
        controller.BindRouterParams(params);
    }, []);

    const view = controller.LoadView();
    if (view != null) {
        return (
            <Fragment>
                {controller.LoadView().render()}
            </Fragment>
        )
    }

}


export abstract class ValidateRule {
    public Field: IField;
    public value: any;
    public ErrorMessage: string;

    public constructor(errorMessage: string) {

        this.ErrorMessage = errorMessage;
    }

    public setField(field: IField) {
        this.Field = field;
    }
    public setFieldValue(value: any) {
        this.value = value;
    }

    abstract validate(): boolean;
}

export class RequiredRule extends ValidateRule {
    public validate(): boolean {
        if (is.nullOrEmpty(this.value)) {
            return false;
        }
        return true;
    }
}

export class RegExRule extends ValidateRule {
    private regEx: RegExp;

    public constructor(regEx: RegExp, errorMessage: string) {
        super(errorMessage);
        this.regEx = regEx;
    }

    public validate(): boolean {
        if (this.regEx.test(this.value)) {
            return true;
        }
        else {
            return false;
        }
    }
}

export class CustomRule extends ValidateRule {
    private func: Function;

    public constructor(func: Function, errorMessage: string) {
        super(errorMessage);
        this.func = func;
    }

    public validate(): boolean {
        return this.func(this.value);
    }
}


export class MaxLengthRule extends ValidateRule {

    private maxLength: int;

    public constructor(maxLength: int, errorMessage: string) {
        super(errorMessage);
        this.maxLength = maxLength;
    }
    public validate(): boolean {
        if (is.nullOrEmpty(this.value)) {
            return true;
        } else {
            if (Convert.ToString(this.value).length > this.maxLength) {
                return false;
            }
        }
        return true;
    }
}

export interface IFieldState {
    errors?: string[];
    invalid?: boolean;
    isDirty?: boolean;
    isTouched?: boolean;
}
export interface IFieldOptions {
    rules: ValidateRule/* { new(): ValidateRule } */[];
}

export interface IField {
    state: IFieldState;
    options: IFieldOptions;
}

export const defaultField: IField = {
    options: {
        rules: []
    },
    state: {
        errors: [],
        invalid: false,
        isDirty: false,
        isTouched: false
    }
}

export class UIFormController extends UIController {

    @State(false)
    public IsLoaded: boolean;

    @State()
    private formData: { [key: string]: IField };

    @State()
    private fieldValues: any;

    @State()
    public isValid: boolean;

    constructor(props) {
        super(props);

        this.state = {
            formData: {},
            fieldValues: {}
        }
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
                rule.setFieldValue(this.GetValue(key))
                const validate = rule.validate();
                if (!validate) {
                    errorCount++;
                    errors.push(rule.ErrorMessage);
                }
            }
        }

        if (errorCount === 0) {
            this.formData = { ...this.formData }

            /*   const data = {};
              for (let key in this.formData) {
                  data[key] = this.GetValue(key);
              } */

            return [true, this.GetFormData()];
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
        this.fieldValues = {};
        /*  for (let key in this.formData) {
             this.SetValue(key, null);
         } */
    }

    public ClearErrors() { }

    public SetValue(name: string, value: any, silent: boolean = false, isDirty: boolean = false) {

        if (name != null) {
            if (value == null) {
                delete this.fieldValues[name];

                if (!silent) {
                    this.fieldValues = { ...this.fieldValues };
                }
                
            } else {
                const fieldName = name;

                if (this.formData[fieldName] == null) {
                    this.formData[fieldName] = clone(defaultField);
                }
                const path = name.indexOf('/') === 0 ? name.substring(1, name.length).split('/') : name;
                objectPath.set(this.fieldValues, path, value)

                if (!silent) {
                    this.fieldValues = { ...this.fieldValues };
                }
            }
        }
    }

    public GetValue(name: string) {
        if (name != null) {
            const fieldName = name;

            if (this.formData[fieldName] == null) {
                this.formData[fieldName] = clone(defaultField);
            }

            const path = name.indexOf('/') === 0 ? name.substring(1, name.length).split('/') : name;
            return objectPath.get(this.fieldValues, path, null);
        }
    }

    public GetFormData() {
        return { ...this.fieldValues };
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

    public register(name: string, rules: ValidateRule[], defaultValue?: any) {
        if (name != null) {
            const fieldName = name;

            if (this.formData[fieldName] != null) {
                return;
            }

            if (this.formData[fieldName] == null) {
                this.formData[fieldName] = clone(defaultField);
            }
            const fieldInfo = this.formData[fieldName];
            fieldInfo.options.rules = rules;

            const path = name.indexOf('/') === 0 ? name.substring(1, name.length).split('/') : name;
            objectPath.set(this.fieldValues, path, defaultValue);
        }
    }


    public render(): React.ReactNode {

        return (
            <UIFormContext.Provider value={this}>
                <UIControllerContext.Provider value={this}>
                    <UIControllerProxy controller={this}>
                        {super.render()}
                    </UIControllerProxy>
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

}