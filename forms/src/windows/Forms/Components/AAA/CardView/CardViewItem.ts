import { Event,Delegate } from '@tuval/core';
import { Control } from '../Control';

import { CardView } from './CardView';

export class ClickEvent extends Delegate<() => void>{ }

export class CardViewItem {
    public CardView:CardView;

    private m_Title: string = '';
    public get Title(): string {
        return this.m_Title;
    }
    public set Title(value: string) {
        this.m_Title = value;
        this.UpdateParent();
    }

    private m__TopTitle: string = '';
    public get TopTitle(): string {
        return this.m__TopTitle;
    }
    public set TopTitle(value: string) {
        this.m__TopTitle = value;
    }

    private m_SubTitle: string = '';
    public get SubTitle(): string {
        return this.m_SubTitle;
    }
    public set SubTitle(value: string) {
        this.m_SubTitle = value;
        this.UpdateParent();
    }
    private m_Image: string = '';
    public get Image(): string {
        return this.m_Image;
    }
    public set Image(value: string) {
        this.m_Image = value;
        this.UpdateParent();
    }
    private m_Tag: any;
    public get Tag(): any {
        return this.m_Tag;
    }
    public set Tag(value: any) {
        this.m_Tag = value;
        this.UpdateParent();
    }

    private m_ButtonText: string;
    public get ButtonText(): string {
        return this.m_ButtonText;
    }
    public set ButtonText(value: string) {
        this.m_ButtonText = value;
        this.UpdateParent();
    }

    private m_Description: string;
    public get Description(): string {
        return this.m_Description;
    }
    public set Description(value: string) {
        this.m_Description = value;
    }

    public FooterControl: Control<any>;

    public OnClick: Event<ClickEvent> = new Event();


    private UpdateParent(): void {
        if (this.CardView != null) {
            this.CardView.ForceUpdate();
        }
    }
}