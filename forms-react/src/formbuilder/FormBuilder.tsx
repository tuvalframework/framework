import { is } from "@tuval/core";


import * as Handlebars from 'handlebars';
import { cLeading, cTopLeading, cVertical } from "../Constants";
import { UIFormController, useFormController } from "../UIFormController";
import { MathHelpers } from "../formbuilder/helpers/math";
import { DataTableView } from "./views/datatable";
import { RadioGroupoFormView } from "./views/radiogroup";
import { RelativeUriView } from "./views/relativeuri";
import { SelectFormView } from "./views/select";
import { TextFormView } from "./views/text";
import { VirtualView } from "./views/virtual";
import { WidgetView } from "./views/widget";

import React, { createContext, useState } from "react";
import { Button, CheckBox, CodeEditor, Spinner, Text, TextAlignment, TextField, UIViewBuilder } from "../components";
import { ReactView } from "../components/ReactView/ReactView";
import { ForEach } from "../components/UIView/ForEach";
import { UICreateContext, UIUpdateContext } from "../data";
import { HStack, ScrollView, Spacer, VStack, useDialog } from "../layout";
import { Fragment } from "../components/Fragment/Fragment";
import { Icon, Icons } from "../components/Icon";
import { ObjectHelpers } from "./helpers/object";
import { useProtocol } from "../data/DataProviderContext";
import { label } from "./components/label";
import { description } from "./components/description";


export const UIFormBuilderContext = createContext(null!);

export const useFormBuilder = (): any =>
    React.useContext(UIFormBuilderContext);


export function compileFormula(formData: any, code: string) {
    if (is.nullOrEmpty(code)) {
        return null;
    }

    const template = Handlebars.compile(code);
    return template(formData, {
        helpers: {
            counter: () => 1000,
            ...MathHelpers,
            ...ObjectHelpers
        }
    })
}

const FormTitle = (title: string) => {
    const dialog = useDialog();
    return (
        HStack({ alignment: cLeading })(
            Text(title)
                .fontSize(20)
                .fontFamily('source sans pro semibold')
                .foregroundColor('#333D47')
                .lineHeight('24px'),
            Spacer(),
            dialog && HStack(
                Icon(Icons.Close).size(15).onClick(() => dialog.Hide())
            ).width('2rem').height('2rem')/* .background({ hover: 'gray' }) */.cornerRadius('50%').cursor('pointer')
                .shadow({ focus: '0 0 0 0.2rem rgba(38, 143, 255, 0.5)' })
        ).height(60)
            .background('#F8FAFF')
            .fontSize('1rem')
            .borderBottom('1px solid #D6E4ED')

            .padding()
    )
}


const EditorView = (textData: any) => {
    const formController = useFormController();
    const { visibleWhen, required, multiline, description } = textData;
    let canRender = false;
    debugger
    if (visibleWhen != null && !is.array(visibleWhen)) {
        const field = visibleWhen.field;
        const fieldValue = visibleWhen.is;
        if (field != null) {
            const fieldFormValue = formController.GetValue(field);
            if (fieldValue == fieldFormValue) {
                canRender = true;
            }
        }
    } else if (visibleWhen != null && is.array(visibleWhen)) {
        const fails = []
        for (let i = 0; i < visibleWhen.length; i++) {
            const field = visibleWhen[i].field;
            const fieldValue = visibleWhen[i].is;
            if (field != null) {
                const fieldFormValue = formController.GetValue(field);
                if (fieldValue == fieldFormValue) {

                } else {
                    fails.push(0)
                }
            }
        }
        if (fails.length === 0) {
            canRender = true;
        }

    } else {
        canRender = true;
    }

    if (canRender) {
        return (
            VStack({ alignment: cTopLeading })(
                Text(textData.label + (required ? '*' : '')).kerning('0.00938em')
                    .lineHeight('24px').foregroundColor('#333D47').fontSize(14)
                    .fontWeight(required ? '600' : '400'),
                CodeEditor().width('100%').height(200),
                description &&
                Text(description).multilineTextAlignment(TextAlignment.leading)
                    .foregroundColor('#95ABBC')
                    .fontSize('12px')
                    .fontFamily('"Roboto", "Helvetica", "Arial", sans-serif')
                    .kerning('0.03333em')
                    .lineHeight('20px')
                    .marginTop('4px')
            ).height().marginBottom('16px')
        )
    }
}


const CheckBoxFormView = (textData: any) => {
    const formController = useFormController();
    return (
        VStack({ alignment: cTopLeading })(
            CheckBox()
                .checked(formController.GetValue(textData.name))
                .labelView(
                    Text(textData.label).kerning('0.00938em').lineHeight('24px').foregroundColor('#333D47').fontSize(14),
                )
                .onChange((e) => formController.SetValue(textData.name, e))
            // .formField(textData.name, [])
        ).height().marginBottom('16px')
    )
}






const ColumnFormView = (columnInfo: any, fieldMap) => {

    const views = [];
    const { containers } = columnInfo;
    for (let i = 0; i < containers.length; i++) {
        const { label, fields } = containers[i];
        views.push(
            VStack({ alignment: cTopLeading, spacing: 10 })(
                Text(label).fontSize(17).lineHeight(22).foregroundColor('#333D47'),
                ...ForEach(fields)((field) =>
                    FormBuilder.getView(fieldMap[field as any])
                )
            )
        )
    }
    return (
        HStack({ alignment: cTopLeading, spacing: 20 })(
            ...views
        )
    )
}

const renderContainers = (layout: any, fieldMap) => {
    const views = []
    if (layout != null && layout.type == null && is.array(layout.containers)) {
        for (let i = 0; i < layout.containers.length; i++) {
            const container = layout.containers[i];
            if (container != null && container.type != null) {
                const subContainers = renderContainers(container, fieldMap);
                if (is.array(subContainers)) {
                    views.push(...subContainers);
                }
                const factoryFunc = FormBuilder.containerFactories[container.type];
                if (factoryFunc == null) {
                    views.push(Text(layout.type + ' not found'))
                } else {
                    views.push(factoryFunc(container, fieldMap))
                }
            } else if (container.fields != null) {
                for (let i = 0; i < container.fields.length; i++) {
                    const viewName = container.fields[i];
                    const view = fieldMap[viewName];
                    const factoryFunc = FormBuilder.viewFactories[view.type];
                    if (factoryFunc == null) {
                        views.push(Text(view.type + ' not found'))
                    } else {
                        views.push(factoryFunc(fieldMap[viewName]));
                    }
                }
            }
        }
    } else if (layout.fields != null) {
        for (let i = 0; i < layout.fields.length; i++) {
            const viewName = layout.fields[i];
            const view = fieldMap[viewName];
            const factoryFunc = FormBuilder.viewFactories[view.type];
            if (factoryFunc == null) {
                views.push(Text(view.type + ' not found'))
            } else {
                views.push(factoryFunc(fieldMap[viewName]));
            }
        }
    }

    return views;
}
const CollapseFormView = (columnInfo: any, fieldMap) => {

    const views = [];
    const { containers } = columnInfo;
    for (let i = 0; i < containers.length; i++) {
        const { label, fields } = containers[i];
        const subContainers = renderContainers(containers[i], fieldMap);
        const subViews = [];
        if (is.array(subContainers)) {
            subViews.push(...subContainers);
        }
        views.push(
            VStack({ alignment: cTopLeading, spacing: 10 })(
                HStack({ alignment: cLeading })(
                    Text(label).fontFamily('source sans pro').fontSize(17).lineHeight(40).foregroundColor('#333D47')
                )
                    .height()
                    .padding()
                    .allHeight(40)
                    .borderBottom('solid 1px #D6E4ED'),
                VStack({ alignment: cTopLeading })(
                    ...subViews
                    /* ...ForEach(fields)((field) =>
                        FormBuilder.getView(fieldMap[field as any])
                    ) */
                ).padding()
            ).height().background('white')
                .border('solid 1px #D6E4ED').cornerRadius(5)
        )
    }
    return (
        VStack({ alignment: cTopLeading, spacing: 20 })(
            ...views
        )
    )
}

const KeyValueView = (textData: any) => {
    const formController = useFormController();
    const { visibleWhen, required, multiline, name, description } = textData;
    let canRender = false;

    if (visibleWhen != null && !is.array(visibleWhen)) {
        const field = visibleWhen.field;
        const fieldValue = visibleWhen.is;
        if (field != null) {
            const fieldFormValue = formController.GetValue(field);
            if (fieldValue == fieldFormValue) {
                canRender = true;
            }
        }
    } else if (visibleWhen != null && is.array(visibleWhen)) {
        const fails = []
        for (let i = 0; i < visibleWhen.length; i++) {
            const field = visibleWhen[i].field;
            const fieldValue = visibleWhen[i].is;
            if (field != null) {
                const fieldFormValue = formController.GetValue(field);
                if (fieldValue == fieldFormValue) {

                } else {
                    fails.push(0)
                }
            }
        }
        if (fails.length === 0) {
            canRender = true;
        }

    } else {
        canRender = true;
    }

    const keyValuePairs: any[] = formController.GetValue(name) || [];
    const rows = [...keyValuePairs, { key: '', value: '' }]
    if (canRender) {
        return (
            VStack({ alignment: cTopLeading, spacing: 10 })(
                Text(textData.label + (required ? '*' : '')).kerning('0.00938em')
                    .lineHeight('24px').foregroundColor('#333D47').fontSize(14)
                    .fontWeight(required ? '600' : '400'),
                //  Text(JSON.stringify(rows)),
                ...ForEach(rows)((keyValue, index) =>
                    HStack({ alignment: cLeading, spacing: 10 })(
                        TextField()
                            .value(keyValuePairs[index] == null ? '' : keyValuePairs[index].key)
                            .multiline(multiline)
                            .height(multiline ? '' : '38px')
                            .foregroundColor('rgb(51,61,71)')
                            .cornerRadius(2)
                            // .padding('0px 15px')
                            //.formField(textData.name, [])
                            .onChange(text => {
                                if (text == '') {
                                    if (is.nullOrEmpty(keyValuePairs[index].value)) {
                                        keyValuePairs.splice(index, 1);
                                    } else {
                                        keyValuePairs[index] = { key: text, value: keyValue.value }

                                    }
                                    formController.SetValue(name, [...keyValuePairs])


                                } else {
                                    keyValuePairs[index] = { key: text, value: keyValue.value }
                                    formController.SetValue(name, [...keyValuePairs])
                                }
                            })
                            .border('1px solid #D6E4ED')
                            .shadow({ focus: 'none' })
                            .fontSize(15),
                        TextField()
                            .multiline(multiline)
                            .height(multiline ? '' : '38px')
                            .foregroundColor('rgb(51,61,71)')
                            .cornerRadius(2)
                            // .padding('0px 15px')
                            //.formField(textData.name, [])
                            .onChange(text => {
                                keyValuePairs[index] = { key: keyValue.key, value: text }
                                formController.SetValue(name, [...keyValuePairs])
                            })
                            .border('1px solid #D6E4ED')
                            .shadow({ focus: 'none' })
                            .fontSize(15)
                    )

                ),
                description &&
                Text(description).multilineTextAlignment(TextAlignment.leading)
                    .foregroundColor('#95ABBC')
                    .fontSize('12px')
                    .fontFamily('"Roboto", "Helvetica", "Arial", sans-serif')
                    .kerning('0.03333em')
                    .lineHeight('20px')
                    .marginTop('4px')

            ).height().marginBottom('16px')
        )
    }
}





export class FormBuilder {
    public static viewFactories = {};
    public static layoutFactories = {};
    public static containerFactories = {};
    public static injectView(viewType: string, viewFactory: any) {
        FormBuilder.viewFactories[viewType] = viewFactory;
    }
    public static injectLayout(layoutType: string, viewFactory: any) {
        FormBuilder.layoutFactories[layoutType] = viewFactory;
    }
    public static injectContainer(containerType: string, viewFactory: any) {
        FormBuilder.containerFactories[containerType] = viewFactory;
    }

    public static getViewFactory(type: string) {
        return FormBuilder.viewFactories[type];
    }
    public static getView(fieldInfo: any) {
        const viewType = fieldInfo?.type;
        const viewFunc = FormBuilder.getViewFactory(viewType);
        if (is.function(viewFunc)) {
            return viewFunc(fieldInfo)
        } else {
            return Text(viewType + ' not found.')
        }
    }

    public static canRender(fieldInfo: any, formController?: UIFormController) {
        formController = useFormController();

        const { visibleWhen } = fieldInfo;

        if (visibleWhen == null) {
            return true;
        }

        let canRender = false;

        if (visibleWhen != null && !is.array(visibleWhen)) {
            const field = visibleWhen.field;
            const fieldValue = visibleWhen.is;
            if (field != null) {
                const fieldFormValue = formController.GetValue(field);
                if (fieldValue == fieldFormValue) {
                    canRender = true;
                }
            }
        } else if (visibleWhen != null && is.array(visibleWhen)) {
            const fails = []
            for (let i = 0; i < visibleWhen.length; i++) {
                let found = false;
                const { field, is, isNot } = visibleWhen[i];
                if (Array.isArray(is)) {
                    for (let j = 0; j < is.length; j++) {
                        const fieldValue = visibleWhen[i].is[j];
                        if (field != null) {
                            const fieldFormValue = formController.GetValue(field);
                            if (fieldValue == fieldFormValue) {
                                found = true;
                            }
                        }
                    }
                }
                if (Array.isArray(isNot)) {
                    for (let j = 0; j < isNot.length; j++) {
                        const fieldValue = visibleWhen[i].isNot[j];
                        if (field != null) {
                            const fieldFormValue = formController.GetValue(field);
                            if (fieldValue != fieldFormValue) {
                                found = true;
                            }
                        }
                    }
                }
                if (!found) {
                    fails.push(0)
                }
            }
            if (fails.length === 0) {
                canRender = true;
            }

        } else {
            canRender = true;
        }

        return canRender;
    }

    public static render(_formMeta: string | object | object[]) {
        if (_formMeta == null) {
            return Fragment();
        }

        const [formIndex, setFormIndex] = useState(0);


        //const [formMeta, setFormMeta] = useState(is.array(_formMeta) ? _formMeta[0] : _formMeta);
        let formMeta;

        try {
            formMeta = is.string(_formMeta) ? JSON.parse(_formMeta) : (is.array(_formMeta) ? _formMeta[formIndex] : _formMeta);

        } catch (e) {
            return Text(e.toString())
        }

        const formController = useFormController();
        const dialog = useDialog();
        const contextValue = {
            nextForm: () => {
                setFormIndex(formIndex + 1)
            }
        }
        return (
            UIViewBuilder(() =>
                ReactView(
                    <UIFormBuilderContext.Provider value={contextValue}>
                        {
                            UIViewBuilder(() => {
                                let invalidateResource = null;
                                let formMutate = null;
                                let createMutate = null;
                                let updateMutate = null;
                                let isFormMutateExcuting = false;
                                let isFormLoading = false;

                                const views = []
                                const { fieldMap, layout, mode, resource, resourceId, title, protocol, mutation, query } = formMeta as any;

                                if (protocol) {
                                    const { query: _query, __mutation, getOne, create, update } = useProtocol(protocol);

                                    if (mode === 'create') {
                                        const { mutate, isLoading, invalidateResourceCache } = create(resource);
                                        createMutate = mutate;
                                        invalidateResource = invalidateResourceCache;
                                        isFormMutateExcuting = isLoading;
                                    }

                                    if (mode === 'update') {
                                        const {mutate,  isLoading , invalidateResourceCache} = update(resource);
                                        updateMutate = mutate;
                                        invalidateResource = invalidateResourceCache;
                                        isFormMutateExcuting = isLoading;
                                    }

                                    if (is.string(mutation)) {
                                        const { mutate, isLoading: isMutateLoading } = __mutation`${mutation}`;
                                        formMutate = mutate;
                                        isFormMutateExcuting = isMutateLoading;
                                    }
                                    if (is.string(query)) {
                                        const { data, isLoading } = _query(query);
                                        isFormLoading = isLoading;
                                        if (!isLoading) {
                                            if (!formController.IsLoaded) {
                                                const keys = Object.keys(data);
                                                for (let i = 0; i < keys.length; i++) {
                                                    const key = keys[i];
                                                    formController.SetValue(key, data[key]);
                                                }
                                                formController.IsLoaded = true;
                                            }
                                        }
                                    }
                                    if (is.string(resource) && (is.string(resourceId) || is.number(resourceId))) {
                                        const { data, isLoading } = getOne(resource, { id: resourceId });
                                        isFormLoading = isLoading;
                                        if (!isLoading) {
                                            if (!formController.IsLoaded) {
                                                const keys = Object.keys(data);
                                                for (let i = 0; i < keys.length; i++) {
                                                    const key = keys[i];
                                                    formController.SetValue(key, data[key]);
                                                }
                                                formController.IsLoaded = true;
                                            }
                                        }
                                    }
                                }

                                if (layout != null && layout.type != null) {
                                    const factoryFunc = FormBuilder.layoutFactories[layout.type];
                                    if (factoryFunc == null) {
                                        views.push(Text(layout.type + ' not found'))
                                    } else {
                                        if (FormBuilder.canRender(fieldMap)) {
                                            views.push(factoryFunc(layout, fieldMap))
                                        }
                                    }
                                }

                                if (layout != null && layout.type == null && is.array(layout.containers)) {
                                    for (let i = 0; i < layout.containers.length; i++) {
                                        const container = layout.containers[i];
                                        if (container != null && container.type != null) {
                                            const factoryFunc = FormBuilder.containerFactories[container.type];
                                            if (factoryFunc == null) {
                                                views.push(Text(layout.type + ' not found'))
                                            } else {
                                                if (FormBuilder.canRender(fieldMap)) {
                                                    views.push(factoryFunc(container, fieldMap))
                                                }
                                            }
                                        }

                                    }
                                }


                                if (layout == null) {
                                    for (let key in fieldMap) {
                                        const viewType = fieldMap[key].type;
                                        const factoryFunc = FormBuilder.viewFactories[viewType];
                                        if (factoryFunc == null) {
                                            views.push(Text(viewType + ' not found'))
                                        } else {
                                            if (FormBuilder.canRender(fieldMap[key])) {
                                                views.push(label(fieldMap[key]));
                                                views.push(factoryFunc(fieldMap[key]));
                                                views.push(description(fieldMap[key]));
                                            }
                                        }
                                    }
                                }

                                return (
                                    isFormLoading ? Spinner() :
                                        VStack(
                                            title && FormTitle(title),
                                            // Text(JSON.stringify(formController.GetFormData())),
                                            ScrollView({ axes: cVertical, alignment: cTopLeading })(
                                                VStack({ alignment: cTopLeading })(
                                                    // Text(JSON.stringify(formController.GetFormData())),
                                                    VStack({ alignment: cTopLeading })(
                                                        ...ForEach(views)(view => view)
                                                    )
                                                        .height()
                                                        .background('#F8FAFF')
                                                        .padding('24px 24px 0px')

                                                )
                                                    .background('#F8FAFF')
                                            ),
                                            (!is.function(formMutate) && !is.function(createMutate) && !is.function(updateMutate)) ? Fragment() :
                                                HStack({ alignment: cLeading })(
                                                    Button(
                                                        Text('Save')
                                                    )
                                                        .loading(isFormMutateExcuting)
                                                        .onClick(() => {
                                                            if (createMutate != null) {
                                                                createMutate(formController.GetFormData(), {
                                                                    onSuccess: () => {
                                                                        if (is.function(invalidateResource)) {
                                                                            invalidateResource();
                                                                        }
                                                                        dialog.Hide();
                                                                    }
                                                                });
                                                            }
                                                            if (updateMutate != null) {
                                                                updateMutate(  resourceId, formController.GetFormData() , {
                                                                    onSuccess: () => {
                                                                        if (is.function(invalidateResource)) {
                                                                            invalidateResource();
                                                                        }
                                                                        dialog.Hide();
                                                                    }
                                                                });
                                                            }
                                                            // formController.SetValue('tenant_id', useSessionService().TenantId);
                                                            if (is.function(formMutate)) {
                                                                //alert(JSON.stringify(formController.GetFormData()))
                                                                formMutate(formController.GetFormData(), {
                                                                    onSuccess: () => {
                                                                        dialog.Hide();
                                                                    }
                                                                });
                                                            }
                                                        })
                                                )
                                                    .height()
                                                    .padding()
                                                    .borderTop('1px solid #D6E4ED')

                                        )

                                )

                            }).render()
                        }
                    </UIFormBuilderContext.Provider>
                )
            )

        )
    }

    public static compileFormula(formula: any): string {
        const formController = useFormController();

        if (is.string(formula)) {
            if (formula[0] === '$') {
                const fieldName = formula.substring(1, formula.length);
                return formController.GetValue(fieldName);
            } else {
                return compileFormula(formController.GetFormData(), formula);
            }
        } else {
            return formula;
        }
    }
}

FormBuilder.injectView('editor', EditorView);
FormBuilder.injectView('text', TextFormView);
FormBuilder.injectView('checkbox', CheckBoxFormView);
FormBuilder.injectView('radiogroup', RadioGroupoFormView);
FormBuilder.injectView('select', SelectFormView);
FormBuilder.injectView('keyvalue', KeyValueView);

FormBuilder.injectLayout('column', ColumnFormView);
FormBuilder.injectLayout('collapse', CollapseFormView);

FormBuilder.injectView('relativeuri', RelativeUriView);
FormBuilder.injectView('virtual', VirtualView);

//FormBuilder.injectView('positionselect', PositionSelectView);
FormBuilder.injectView('widget', WidgetView);
FormBuilder.injectView('datatable', DataTableView);
