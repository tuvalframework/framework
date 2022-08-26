import { Teact } from '../../Teact';
import { ControlHtmlRenderer } from '../HtmlRenderer/ControlHtmlRenderer';
import { ListMenu } from './ListMenu';
import { is, classNames, int, foreach } from '@tuval/core';
import { ListMenuItem, ListMenuItemBase } from './ListMenuItem';
import { InputText } from '../../inputtext/TuInputText';

export class ListMenuRenderer extends ControlHtmlRenderer<ListMenu> {

    public get UseShadowDom(): boolean {
        return true;
    }

    public GenerateElement(obj: ListMenu): boolean {
        this.WriteStartFragment();
        return true;
    }
    public GenerateBody(obj: ListMenu): void {
        if (!obj.Visible) {
            return;
        }

        this.WriteComponent(this.CreateControls(obj));
        this.WriteComponent(this.CreateItems(obj));
    }
    protected CreateItems(obj: ListMenu): any[] {
        const vNodes: any[] = [];
        foreach(obj.Items, (control) => {
            vNodes.push(control.CreateMainElement());
        });
        return vNodes;
    }
    protected CreateControls(obj: ListMenu): any[] {
        const vNodes: any[] = [];
        foreach(obj.Controls, (control) => {
            vNodes.push(control.CreateMainElement());
        });
        return vNodes;
    }

}