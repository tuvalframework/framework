import { foreach, StringBuilder } from '@tuval/core';

import { ControlHtmlRenderer } from '../../windows/Forms/Components/AAA/HtmlRenderer/ControlHtmlRenderer';
import { Teact } from '../../windows/Forms/Components/Teact';
import { DropDownClass } from './DropDownClass';
import { Dropdown } from '../Components/dropdown/Dropdown';
import { DomHandler } from '../../windows/Forms/Components/DomHandler';
import { IRenderable } from '../IView';
import { getView } from '../getView';
import { UIController } from '../UIController';
import { jss } from '../../jss/jss';

//console.log('AA_BB');
DomHandler.addCssToDocument(require('../Components/dropdown/Thema.css'));

export class DropDownRenderer extends ControlHtmlRenderer<DropDownClass> {
    shadowDom: any;
    protected menu: any;

    public OnStyleCreating(obj: DropDownClass, sb: StringBuilder): void {
        sb.AppendLine(require('../Components/common.css'));
        sb.AppendLine(require('../Components/dropdown/DropDown.css'));
        sb.AppendLine(require('../Components/dropdown/Thema.css'));

        sb.AppendLine(`
        .pi {
            font-family: primeicons;
            speak: none;
            font-style: normal;
            font-size: 1rem;
            font-weight: 400;
            font-feature-settings: normal;
            font-variant: normal;
            text-transform: none;
            line-height: 1;
            display: inline-block;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

            .pi-chevron-down:before {
                content: "\\e902";
            }
            .pi:before {
                --webkit-backface-visibility: hidden;
                -webkit-backface-visibility: hidden;
                backface-visibility: hidden;
            }
        `);

        let styles = {
            'p-dropdown': {
                overflow: 'hidden',
                ...(obj.vp_value != null && {
                    '& .p-dropdown-label.p-inputtext': {
                        padding: 0
                    }
                })
            }
        }

        const aa = jss.createStyleSheet(styles);

        sb.AppendLine(aa.toString());

    }

    public override GetCustomJss(): Object {
        return {
            '& .p-dropdown::before': {
                borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
                left: 0,
                bottom: 0,
                content: " ",
                position: 'absolute',
                right: 0,
                transition: 'border-bottom-color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                pointerEvents: 'none'
            },
            '& .p-dropdown::after': {
                borderBottom: '2px solid rgb(115, 82, 199)',
                left: 0,
                bottom: 0,
                content: "",
                position: 'absolute',
                right: 0,
                transform: 'scaleX(0)',
                transition: 'transform 200ms cubic-bezier(0, 0, 0.2, 1) 0ms',
                pointerEvents: 'none'
            },

        }
    }

    public GenerateElement(obj: DropDownClass): boolean {
        this.WriteStartFragment();
        return true;
    }

    public GenerateBody(obj: DropDownClass): void {

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
        style['height'] = '100%';
        style['backgroundColor'] = obj.Appearance.BackgroundColor;
        style['background'] = obj.Appearance.Background;
        style['color'] = obj.Appearance.Color;

        this.WriteComponent(

            <Dropdown
                style={style}
                optionLabel={obj.vp_optionLabel}
                optionValue={obj.vp_optionValue}
                valueTemplate={selectedTemplate}
                itemTemplate={template}
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