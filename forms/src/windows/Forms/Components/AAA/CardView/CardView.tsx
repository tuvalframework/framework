import { Teact } from '../../Teact';
import { Control } from '../Control';
import { CardViewItem } from './CardViewItem';
import { CardViewItemCollection } from './CardViewCollection';
import { DomHandler } from '../../DomHandler';
import { TString } from '@tuval/core';

import { Event, Delegate } from '@tuval/core';
import { CardComponent } from '../../card/card';
import { Fragment } from '../../../../../preact';
import { Button, ButtonColors } from '../Button/Button';

class ClickEvent extends Delegate<() => void>{ }


const css = require('./CardView.css');
DomHandler.addCssToDocument(css);
export enum CardSizes {
    Small = 0,
    Medium = 1,
    Large = 2
}
export class CardView extends Control<CardView> {

    public get _OnClick(): Event<ClickEvent> {
        return this.GetProperty('OnClick');
    }
    public set _OnClick(value: Event<ClickEvent>) {
        this.SetProperty('OnClick', value);
    }

    public get CardSize(): CardSizes {
        return this.GetProperty('CardSize');
    }
    public set CardSize(value: CardSizes) {
        this.SetProperty('CardSize', value);
    }

    public get Items(): CardViewItemCollection {
        return this.GetProperty('Items');
    }

    public set Items(value: CardViewItemCollection) {
        this.SetProperty('Items', value);
    }

    public SetupControlDefaults(): void {
        super.SetupControlDefaults();
        this.Items = new CardViewItemCollection(this);
        this._OnClick = new Event();
        this.CardSize = CardSizes.Small;
    }

    private renderBadge(item: CardViewItem) {
        return (<div class="badge"></div>);
    }
    private renderIconArea(item: CardViewItem) {
        return (<div class="iconarea">
            <div class="icon">
                <img class="image" src={item.Image}></img>
            </div>
            <div class="price">
                <span></span>
            </div>
        </div>);
    }
    private renderInfoArea(item: CardViewItem) {
        const footer = item.FooterControl ? ((item.FooterControl as any).CreateMainElement()) : null;
        return (
            <div class="infoarea">
                <div class="info">
                    <span class="top-title">{item.TopTitle}</span>
                    <span class="title">{item.Title}</span>
                    <span class="subtitle">
                        <span>{item.SubTitle}</span>
                    </span>
                </div>
                <div class="btn">
                    <div class="container">
                        {/* <Button Color={ButtonColors.Gray} Visible={true} Text={item.ButtonText} OnClick={() => item.OnClick()}></Button> */}
                        {footer}
                    </div>
                </div>
            </div>
        );
    }
    public renderItem(item: CardViewItem) {
        return (
            <div class="tuval-cardview-item">
                {this.renderBadge(item)}
                {this.renderIconArea(item)}
                {this.renderInfoArea(item)}
            </div>
        );
    }

    public renderLargeItem(item: CardViewItem): any {
        const header = (
            <Fragment>
                <span onClick={() => item.OnClick()} style={{ cursor: 'pointer', display: 'flex', width: '240px', height: '135px', backgroundImage: TString.Format("url('{0}')", item.Image), justifyContent: 'center', alignItems: 'center' }}>
                    <svg viewBox="0 0 24 24" style={{ position: 'absolute', width: '4.4rem', height: '4.4rem', fill: 'white', display: 'inline-block' }}><circle cy="12" cx="12" fill="#1e1e1c" r="10"></circle><path d="M0 12A12 12 0 1012 0 12 12 0 000 12zm18 .137L8.4 16.8V7.2l9.6 4.937z"></path></svg>
                </span>

                {/* <img alt="" src={item.Image} onError={(e) => e.target.src = ''} /> */}
            </Fragment>
        );
        /* const footer = item.ButtonText !== '' ? (
            <span>
                <Button label={item.ButtonText} icon="pi pi-check" onClick={() => item.OnClick()} />
            </span>
        ) : (<span></span>); */

        const footer = item.FooterControl ? (item.FooterControl as any).CreateMainElement() : null;
        return (
            <CardComponent title={item.Title} subTitle={item.SubTitle} style={{ width: '240px', margin: '10px' }} footer={footer} header={header} >
                <p className="p-m-0" style={{ lineHeight: '1.5' }}>{item.Description}</p>
            </CardComponent>
        );
    }

    private renderItems(): any[] {
        return this.Items.ToArray().map(item => {
            if (this.CardSize === CardSizes.Small) {
                return this.renderItem(item);
            } else {
                return this.renderLargeItem(item);
            }
        });
    }

    public CreateElements() {
        const style = {};
        style['height'] = this.Height + 'px';
        if (this.CardSize === CardSizes.Large) {
            style['display'] = 'flex';
            style['flexWrap'] = 'wrap';
        }
        return (
            <div class="tuval-cardview" style={style}>
                {this.renderItems()}
            </div>
        );
    }

}