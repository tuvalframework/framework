import { List, foreach, int, is, BREAK } from '@tuval/core';
import { GridColumn } from './Column';
import { GridView } from './GridView';
import { GridViewBase } from './GridViewBase';

export class ColumnCollection extends List<GridColumn> {
    public GridView: GridViewBase = null as any;
    public constructor(gridview: GridViewBase) {
        super();
        this.GridView = gridview;
    }

    public Add(header: string): GridColumn;
    public Add(header: string, field: string): GridColumn;
    public Add(treeNode: GridColumn): int
    public Add(...args: any[]): GridColumn | int {
        if (args.length === 1 && is.string(args[0])) {
            const header: string = args[0];
            const treeNode = new GridColumn(header);
            super.Add(treeNode);
            if (this.GridView != null) {

                this.GridView.ForceUpdate();
            }
            return treeNode;
        } else if (args.length === 2 && is.string(args[0]) && is.string(args[1])) {
            const field: string = args[0];
            const header = args[1];
            const treeNode = new GridColumn(field, header);
            super.Add(treeNode);
            if (this.GridView != null) {

                this.GridView.ForceUpdate();
            }
            return treeNode;
        } else {
            const treeNode: GridColumn = args[0];
            const result = super.Add(treeNode);
            if (this.GridView != null) {

                this.GridView.ForceUpdate();
            }
            return result;
        }
    }

    public Clear(): int {
        const result = super.Clear();
        this.GridView.RefreshColumns();
        return result;
    }
}
