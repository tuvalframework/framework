import { foreach, StringBuilder } from '@tuval/core';

import { ControlHtmlRenderer } from '../../windows/Forms/Components/AAA/HtmlRenderer/ControlHtmlRenderer';
import { Teact } from '../../windows/Forms/Components/Teact';

import { Dropdown } from '../Components/dropdown/Dropdown';
import { DomHandler } from '../../windows/Forms/Components/DomHandler';
import { IRenderable } from '../IView';
import { getView } from '../getView';
import { UIController } from '../UIController';
import { AutoComplete } from '../Components/autocomplete/AutoComplete';
import { AccordionClass } from './AccordionClass';
import { Accordion, AccordionTab } from '../Components/accordion/Accordion';

//console.log('AA_BB');
/* DomHandler.addCssToDocument(require('../Components/autocomplete/AutoComplete.css'));
DomHandler.addCssToDocument(require('../Components/autocomplete/Theme.css')); */

export class AccordionRenderer extends ControlHtmlRenderer<AccordionClass> {
    private accordionRef;
    shadowDom: any;
    protected menu: any;
    public get UseShadowDom(): boolean {
        return true;
    }

    public OnStyleCreating(obj: AccordionClass, sb: StringBuilder): void {
        sb.AppendLine(require('../Components/common.css'));
        sb.AppendLine(require('../Components/accordion/Accordion.css'));
        sb.AppendLine(require('../Components/accordion/Theme.css'));
    }

    public GenerateElement(obj: AccordionClass): boolean {
        this.WriteStartFragment();
        return true;
    }

    public GenerateBody(obj: AccordionClass): void {


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

        this.WriteComponent(
            <Accordion multiple>
                {this.createTabs(obj)}
            </Accordion>
        )
    }

    private createTabs(obj: AccordionClass): any[] {

        const template = (option) => {
            const view = getView(obj.controller, obj.vp_headerTemplate(option));
            if (view != null) {
                return view.Render();
            }
        }


        const vNodes: any[] = [];

        foreach(obj.vp_items, (item: any) => {
            vNodes.push(
                <AccordionTab headerTemplate={() => template(item)}>
                    {this.CreateControls(item, obj)}
                </AccordionTab>
            )
        });

        return vNodes;
    }

    protected CreateControls(item: any, obj: AccordionClass): any[] {
        const vNodes: any[] = [];

        if (obj.vp_contentTemplate != null) {
            const view = getView(obj instanceof UIController ? obj : (obj as any).controller, obj.vp_contentTemplate(item));
            if (view != null) {
                vNodes.push(view.Render());
            }
        }

        return vNodes;
    }
}