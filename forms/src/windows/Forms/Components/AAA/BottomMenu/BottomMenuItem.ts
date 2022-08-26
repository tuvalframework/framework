import {Event} from '@tuval/core';
import { EventHandler } from '../../Delegates/EventHandler';
import { BottomMenu } from './BottomMenu';

export class BottomMenuItem {
    public BottomMenu: BottomMenu;
    public Text: string = '';
    public Image: string = '';
    public Icon: string = '';
    public MenuModel: any = null;
    public OnClick:Event<EventHandler> = new Event();
    private m_Disabled: boolean = false;
    public get Disabled(): boolean {
        return this.m_Disabled;
    }
    public set Disabled(value: boolean) {
        this.m_Disabled = value;
        this.BottomMenu.ForceUpdate();
    }
    public constructor(bottomMenu: BottomMenu) {
        this.BottomMenu = bottomMenu;
    }
}