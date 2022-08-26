import { foreach, StringBuilder } from '@tuval/core';

import { ControlHtmlRenderer } from '../../windows/Forms/Components/AAA/HtmlRenderer/ControlHtmlRenderer';
import { Teact } from '../../windows/Forms/Components/Teact';
import { AutoCompleteClass } from './AutoCompleteClass';
import { Dropdown } from '../Components/dropdown/Dropdown';
import { DomHandler } from '../../windows/Forms/Components/DomHandler';
import { IRenderable } from '../IView';
import { getView } from '../getView';
import { UIController } from '../UIController';
import { AutoComplete } from '../Components/autocomplete/AutoComplete';

//console.log('AA_BB');
DomHandler.addCssToDocument(require('../Components/autocomplete/AutoComplete.css'));
DomHandler.addCssToDocument(require('../Components/autocomplete/Theme.css'));

export class AutoCompleteRenderer extends ControlHtmlRenderer<AutoCompleteClass> {
    shadowDom: any;
    protected menu: any;
    public get UseShadowDom(): boolean {
        return true;
    }

    public OnStyleCreating(obj: AutoCompleteClass, sb: StringBuilder): void {
        sb.AppendLine(require('../Components/autocomplete/common.css'));
        sb.AppendLine(require('../Components/autocomplete/AutoComplete.css'));
        sb.AppendLine(require('../Components/autocomplete/Theme.css'));
    }

    public GenerateElement(obj: AutoCompleteClass): boolean {
        this.WriteStartFragment();
        return true;
    }

    public GenerateBody(obj: AutoCompleteClass): void {


        const style = {};
        style['width'] = '100%';
        style['height'] = '100%';
        style['backgroundColor'] = obj.Appearance.BackgroundColor;
        style['background'] = obj.Appearance.Background;
        style['color'] = obj.Appearance.Color;



        function itemTemplate(item) {
            return (
                <div className="country-item">
                    {/* <img alt={item.name} src={`images/flag/flag_placeholder.png`} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} className={`flag flag-${item.code.toLowerCase()}`} /> */}
                    <div>{item.name}</div>
                </div>
            );
        }
        const template = (option) => {
            const view = getView(obj.controller, obj.vp_itemTemplate(option));
            if (view != null) {
                return view.Render();
            }
        }

        this.WriteComponent(
            <AutoComplete
                value={obj.vp_Value}
                suggestions={obj.vp_items}
                completeMethod={obj.vp_SearchMethod}
                field={obj.vp_Field}
                dropdown
                forceSelection
                itemTemplate={template}
                onChange={obj.vp_OnChange}
                aria-label="Test" />

            /*  <Dropdown
                 style={style}
                 itemTemplate={template}
                 optionLabel="name"
                 value={obj.vp_value}
                 options={obj.vp_model}
                 onChange={(e) => obj.vp_onSelected(e.value)}
                 placeholder={obj.vp_PlaceHolder} /> */
        )
    }

    protected CreateControls(obj: AutoCompleteClass): any[] {
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