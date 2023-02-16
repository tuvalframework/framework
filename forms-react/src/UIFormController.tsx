import { clone, Convert, int, is } from "@tuval/core";
import React from "react";
import { createContext } from "react";
import { State, UIController } from "./UIController";

export const UIFormContext = createContext(null!);
export const UIControllerContext = createContext(null!);

export const useFormController = (): UIFormController =>
    React.useContext(UIFormContext);

export const useController = (): UIController =>
    React.useContext(UIControllerContext);



export abstract class ValidateRule {
    public Field: IField;
    public ErrorMessage: string;

    public constructor(errorMessage: string) {

        this.ErrorMessage = errorMessage;
    }

    public setField(field: IField) {
        this.Field = field;
    }

    abstract validate(): boolean;
}

export class RequiredRule extends ValidateRule {
    public validate(): boolean {
        if (is.nullOrEmpty(this.Field.value)) {
            return false;
        }

        return true;
    }
}

export class MaxLengthRule extends ValidateRule {

    private maxLength: int;

    public constructor(maxLength: int, errorMessage: string) {
        super(errorMessage);
        this.maxLength = maxLength;
    }
    public validate(): boolean {
        if (is.nullOrEmpty(this.Field.value)) {
            return true;
        } else {
            if (Convert.ToString(this.Field.value).length > this.maxLength) {
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
    value: any;
    state: IFieldState;
    options: IFieldOptions;
}

const defaultField: IField = {
    value: null,
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
    @State({})
    private formData: { [key: string]: IField };

    @State()
    public isValid: boolean;

    public validateForm() {

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

            this.OnSubmit(data);
            return [true, data];
        } else {
            for (let key in this.formData) {
                const field = this.formData[key];
                field.state.invalid = true;
            }

            this.isValid = false;

            const data = {};
            for (let key in this.formData) {
                data[key] = this.formData[key].value;
            }

            return [false, data]
        }

        //this.EndUpdate();
    }
    protected OnSubmit(data) { }

    public Submit() {

        this.validateForm();
    }

    public ResetForm() { }

    public ClearErrors() { }

    public SetValue(name: string, value: any) {
        if (name != null) {
            const fieldName = name;

            if (this.formData[fieldName] == null) {
                this.formData[fieldName] = clone(defaultField);
            }
            const fieldInfo = this.formData[fieldName];
            fieldInfo.value = value;

            this.formData = { ...this.formData };
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

    public render(): React.ReactNode {

        return (
            <UIFormContext.Provider value={this}>
                {super.render()}
            </UIFormContext.Provider>
        )
    }

}