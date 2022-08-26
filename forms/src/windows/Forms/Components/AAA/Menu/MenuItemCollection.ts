import { List, foreach, int, is, BREAK, ArgumentOutOfRangeException } from '@tuval/core';
import { ControlTypes } from '../../ControlTypes';
import { ContextMenu } from './ContextMenu';
import { MenuItem } from './MenuItem';


export class MenuItemCollection extends List<MenuItem> {
    public ContextMenu: ContextMenu = null as any;
    public constructor(contextMenu?:ContextMenu) {
        super();
        this.ContextMenu = contextMenu;
    }

    public Add(text: string): MenuItem;
    public Add(treeNode: MenuItem): int
    public Add(...args: any[]): MenuItem | int {
        if (args.length === 1 && is.string(args[0])) {
            const text: string = args[0];
            const treeNode = new MenuItem();
            treeNode.Text = text;
            super.Add(treeNode);
            if (this.ContextMenu != null) {
                this.SetContextMenu(treeNode);
                this.ContextMenu.ForceUpdate();
            }
            return treeNode;
        } else if (args.length === 1 && is.typeof<MenuItem>(args[0], ControlTypes.MenuItem) ){
            const treeNode: MenuItem = args[0];
            const result = super.Add(treeNode);
            if (this.ContextMenu != null) {
                this.SetContextMenu(treeNode);
                this.ContextMenu.ForceUpdate();
            }
            return result;
        }

        throw new  ArgumentOutOfRangeException('MenuItemCollection::Add');
    }

    private SetContextMenu(node: MenuItem): void {
        node.Items.ContextMenu = this.ContextMenu;
        foreach(node.Items, (treeNode: MenuItem) => {
            this.SetContextMenu(treeNode);
        });
    }


    public Serialize(): any[] {
        const nodes: any[] = [];
        foreach(this, (node: MenuItem) => {
            nodes.push(node.Serialize());
        });
        return nodes;
    }

}
