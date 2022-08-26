import { RibbonItemTypes } from "./RibbonItemTypes";
import { Delegate, EventArgs, Event } from "@tuval/core";
import { EventHandler } from '../../Delegates/EventHandler';

export abstract class RibbonItem {
    protected abstract Get_RibbonItemType(): RibbonItemTypes;
    public get Type(): RibbonItemTypes {
        return this.Get_RibbonItemType();
    }
    public Text: string = '';
    public Icon: string = '';
    public OnClick: Event<EventHandler> = new Event();
    public abstract ToModel(): any;
}

export class RibbonButton extends RibbonItem {
    protected Get_RibbonItemType(): RibbonItemTypes {
        return RibbonItemTypes.RibbonButton;
    }
    public ToModel() {
        return {
            type: RibbonItemTypes[this.Type],
            text: this.Text,
            icon: this.Icon,
            onClick: this.OnClick
        };
    }
}