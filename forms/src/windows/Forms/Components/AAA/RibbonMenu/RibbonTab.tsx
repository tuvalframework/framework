import {List} from '@tuval/core';
import { RibbonGroup } from './RibbonGroup';
import { RibbonGroupCollection } from './RibbonGroupCollection';
import { RibbonMenu } from './RibbonMenu';

export class RibbonTab {
    private __RibbonMenu__: RibbonMenu = null as any;
    public Text: string = '';
    public IsStatic: boolean = false;
    public Groups: RibbonGroupCollection = null as any;
    private constructor(ribbonmenu: RibbonMenu) {
        this.__RibbonMenu__ = ribbonmenu;
        this.Groups = new RibbonGroupCollection(this.__RibbonMenu__);
    }
    public ToModel(): any {
        const groups = this.Groups.ToArray().map((group: RibbonGroup) =>{
            return group.ToModel();
        });
        return {
            tab:this.Text,
            static: this.IsStatic,
            groups:groups
        }
    }
}