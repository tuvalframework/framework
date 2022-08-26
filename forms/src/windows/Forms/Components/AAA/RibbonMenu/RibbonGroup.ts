import {List} from '@tuval/core';
import { RibbonItem } from './RibbonItem';
import { RibbonItemCollection } from './RibbonItemCollection';
import { RibbonMenu } from './RibbonMenu';
export class RibbonGroup {
    private __RibbonMenu__: RibbonMenu = null as any;
    public Text: string = '';
    public Items:RibbonItemCollection = null as any;

    private constructor(ribbonmenu: RibbonMenu) {
        this.__RibbonMenu__ = ribbonmenu;
        this.Items = new RibbonItemCollection(this.__RibbonMenu__);
    }
    public ToModel(): any {
        const items = this.Items.ToArray().map((item: RibbonItem) =>{
            return item.ToModel();
        });
        return {
            label:this.Text,
            items: items
        }
    }
}