import { foreach, is, StringBuilder } from '@tuval/core';

import { ControlHtmlRenderer } from '../../windows/Forms/Components/AAA/HtmlRenderer/ControlHtmlRenderer';
import { Teact } from '../../windows/Forms/Components/Teact';
import { DropDownClass } from './DropDownClass';
import { Dropdown } from '../Components/dropdown/Dropdown';
import { DomHandler } from '../../windows/Forms/Components/DomHandler';
import { IRenderable } from '../IView';
import { getView } from '../getView';
import { bindFormController, UIController, UIFormController } from '../UIController';
import { jss } from '../../jss/jss';
import React, { createElement, Fragment } from "../../preact/compat";



const MyDropDown = (params) => {

    const getLabel = () => {
        if (is.function(params.obj.vp_LabelTemplate)) {
            const view: any = getView(params.obj instanceof UIController ? params.obj : (params.obj as any).controller, params.obj.vp_LabelTemplate(params.obj.vp_Label));
            if (view != null) {
                return view.Render()
            }
        } else {
            return (
                <label className="block">{params.obj.vp_Label}</label>
            )
        }
    }

    const controller: UIFormController = bindFormController();
    // console.log(controller);


    if (params.obj.vp_FormField == null || controller == null) {
        return (
            <Fragment>
                {getLabel()}
                <Dropdown {...params}> </Dropdown>
            </Fragment>
        )

    } else {

        controller.register(params.obj.vp_FormField.name, params.obj.vp_FormField.rules);

        // const context = useFormContext(); // retrieve all hook methods
        // console.log(context.getFieldState('name'))

        // console.log(context)

        params['value'] = controller.GetValue(params.obj.vp_FormField.name);

        params['onChange'] = (e) => controller.SetValue(params.obj.vp_FormField.name, e.target.value)

        const fieldState = controller.GetFieldState(params.obj.vp_FormField.name);
        if (fieldState.errors.length > 0) {
            delete params['height']; // we do not want 100% height
        }
        return (
            <div style={{ width: '100%' }}>
                {getLabel()}
                <Dropdown  {...params} />
                {fieldState.errors.map(error => (
                    <small className="p-error">{error}</small>
                ))}

            </div>
        )
    }
}

export class DropDownRenderer extends ControlHtmlRenderer<DropDownClass> {
    shadowDom: any;
    protected menu: any;



    public GenerateElement(obj: DropDownClass): boolean {
        this.WriteStartFragment();
        return true;
    }

    public GenerateBody(obj: DropDownClass): void {

        const emptyTemplate = () => {
            if (is.function(obj.vp_emptyTemplate)) {
                const view = getView(obj.controller, obj.vp_emptyTemplate());
                if (view != null) {
                    return view.Render();
                }
            }
        }

        const template = (option) => {
            if (option) {
                const view = getView(obj.controller, obj.vp_itemTemplate(option));
                if (view != null) {
                    return view.Render();
                }
            }

            return (<span></span>)

        }

        /*  const selectedItemTemplate = (option) => {
             if (option) {
                 const view = getView(obj.controller, obj.vp_selectedItemTemplate(option));
                 if (view != null) {
                     return view.Render();
                 }
             } else {
                 return (<span>Select Item</span>)
             }
         } */

        const selectedTemplate = (option, props) => {
            console.group('Drop Down Context')
            console.log(option)


            if (option) {
                const view = getView(obj.controller, obj.vp_selectedItemTemplate(option));
                if (view != null) {
                    console.log(view);
                    console.groupEnd();

                    return view.Render();
                }
            }
            console.groupEnd()

            return (
                <span>
                    {props.placeholder}
                </span>
            );

        }

        const style = {};
        style['width'] = '100%';
       // style['height'] = '100%';
        style['backgroundColor'] = obj.Appearance.BackgroundColor;
        style['background'] = obj.Appearance.Background;
        style['color'] = obj.Appearance.Color;

        this.WriteComponent(

            <MyDropDown
                obj={obj}
                onFocus={(e) => is.function(obj.vp_SetFocus) ? obj.vp_SetFocus(e) : void 0}
                onBlur={(e) => is.function(obj.vp_KillFocus) ? obj.vp_KillFocus(e) : void 0}
                style={style}
                optionLabel={obj.vp_fields.text}
                optionValue={obj.vp_fields.value}
                valueTemplate={selectedTemplate}
                itemTemplate={template}
                emptyMessage={emptyTemplate()}
                value={obj.vp_value}
                options={obj.vp_model}
                onChange={(e) => { obj.vp_onSelected(e.value) }}
                placeholder={obj.vp_PlaceHolder} />
        )
    }

    protected CreateControls(obj: DropDownClass): any[] {
        const vNodes: any[] = [];

        if ((obj as any).SubViews != null) {
            foreach(obj.GetViews(), (root: IRenderable) => {
                const view = getView(obj instanceof UIController ? obj : (obj as any).controller, root);
                if (view != null) {
                    vNodes.push(view.Render());
                }
            });
        }

        return vNodes;
    }
}