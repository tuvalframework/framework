import { Event, ClassInfo,Delegate } from '@tuval/core';
import { ControlTypes } from '../../ControlTypes';

import { MenuItemCollection } from './MenuItemCollection';

class ClickEvent extends Delegate<() => void>{ }

@ClassInfo({
    fullName: ControlTypes.MenuItem,
    instanceof: [
        ControlTypes.MenuItem,
    ]
})
export class MenuItem {
    public Text: string = '';
    public Icon:string= '';
    public Click:Event<ClickEvent> = new Event();
    public Items: MenuItemCollection;
    public Serialize(): object {
        return {
            label: this.Text,
            icon: this.Icon,
            command:this.Click
        };
    }
}