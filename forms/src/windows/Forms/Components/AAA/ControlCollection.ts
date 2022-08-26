import { List, Delegate, int, Event } from '@tuval/core';
import { Control, TComponent } from './Control';
import { TController } from './TController';
import { TTabPage } from './TTabControl';
import { IView } from './TView';

/* export class ItemAdded extends Delegate<(collection: ControlCollection, newItem: any) => void> { }
export class ControlCollection extends List<any> {
    public OnItemAdded: Event<ItemAdded> = new Event();
    public Add(item: any): int {
        const result = super.Add(item);
        try {
            this.OnItemAdded(this, item);
        } catch { }
        return result;
    }
} */

export class ControlCollection<TParent extends Control = any, TItem extends Control = any> extends List<any> {
    public ItemAdded: Event<any> = new Event();
    private m_Parent: TParent = null as any;
    public get Parent(): TParent {
        return this.m_Parent;
    }
    public constructor(parent: TParent) {
        super();
        this.m_Parent = parent;
    }

    public Get(index: int): TItem {
        return super.Get(index);
    }
    public Add(item: TItem): int {
        const result = super.Add(item);
        item.Parent = this.m_Parent;
        item.OnAdoption(this.m_Parent);
        this.m_Parent.ForceUpdate();
        this.ItemAdded(item);
        return result;
    }
    public RemoveAt(index: int): void {
        super.RemoveAt(index);
        this.m_Parent.ForceUpdate();
    }
}


export class ComponentCollection<T = TComponent> extends List<T> {
    private m_Parent: TComponent = null as any;
    public constructor(parent: TComponent) {
        super();
        this.m_Parent = parent;
    }
    public Add(item: T): int {
        const result = super.Add(item);
        //item.Parent = this.m_Parent;
        // item.OnAdoption(this.m_Parent);
        this.m_Parent.ForceUpdate();
        return result;
    }
    public RemoveAt(index: int): void {
        super.RemoveAt(index);
        this.m_Parent.ForceUpdate();
    }
}