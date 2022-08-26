import { Delegate, Event, int } from '@tuval/core';
import { Observable } from 'rxjs-compat/Observable';

import { Border } from '../../../Border';
import { DomHandler } from '../../DomHandler';
import { ListMenuItem, ListMenuItemBase } from './ListMenuItem';
import { ListMenuItemCollection } from './ListMenutemCollection';
import { TFlexColumnContainer } from '../Panel';
import { Control } from '../Control';
import { ListMenuRenderer } from './ListMenuRenderer';
import { ControlCollection } from '../ControlCollection';

class ClickEvent extends Delegate<() => void>{ }

export class DragStartEventHandler extends Delegate<(e: DragEvent) => void> { };

const css = require('./ListMenu.css');
DomHandler.addCssToDocument(css);

export class ListMenu extends Control<ListMenu> {

    public DragStart: Event<DragStartEventHandler> = new Event();
    public EditMode: boolean;
    public HeaderText: string;
    public ItemHeight: int;
    public ItemColor: string;
    public SelectedItemColor: string;
    public ItemBorder: Border;
    public SelectedIndexChanged: Event<any> = new Event();

    private mySelectedIndex: int = -1;
    public get SelectedIndex(): int {
        return this.mySelectedIndex;
    }

    public set SelectedIndex(value: int) {
        const item = this.Items.Get(value);
        if (item != null && item.Selectable) {
            this.changeSelection(item);
        }
    }

    public get SelectedIndex$(): Observable<int> {
        return this.GetPipe('SelectedIndex');
    }
    public set SelectedIndex$(value: Observable<int>) {
        this.SetPipe('SelectedIndex', value);
    }

    public get Items(): ListMenuItemCollection {
        return this.GetProperty('Items');
    }

    public set Items(value: ListMenuItemCollection) {
        this.SetProperty('Items', value);
    }

    public Controls: ControlCollection;

    public constructor() {
        super();
        this.Items = new ListMenuItemCollection(this);
        this.Controls = new ControlCollection(this);
        this.ItemHeight = 50;
        this.ItemBorder = new Border();
        this.EditMode = false;
        this.DragStart = new Event();

        this.Appearance.Display = 'block';
        this.Appearance.Border = 'solid 1px lightgray';
        this.Appearance.BorderBottomWidth= '0px';
        this.Appearance.Overflow = 'auto';
        this.Appearance.BackgroundColor = 'rgb(230,230,230)';
    }

    protected GetRenderer() {
        return ListMenuRenderer;
    }

    private changeSelection(item: ListMenuItemBase) {
        const prev = this.Items.Get(this.SelectedIndex);
        if (prev === item) {
            return;
        }
        if (prev != null) {
            prev.InternalOnLostSelection();
        }
        if (item != null) {
            item.InternalOnGotSelection();
            this.mySelectedIndex = this.Items.IndexOf(item)
            this.InternalOnSelectedIndexChanged(prev, item);
        }
    }
    /** @internal */
    InternalOnItemClick(item: ListMenuItemBase): void {
        this.SelectedIndex = this.Items.IndexOf(item);
    }

    protected OnItemClick(item: ListMenuItem) {

    }
    /** @internal */
    InternalOnSelectedIndexChanged(prevSelectedItem: ListMenuItemBase, selectedItem: ListMenuItemBase) {
        this.OnSelectedIndexChanged();
    }
    public OnSelectedIndexChanged() {
        this.SelectedIndexChanged(this.SelectedIndex);
    }
}