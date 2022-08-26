import { List, foreach, int, is, BREAK, ArgumentOutOfRangeException } from '@tuval/core';
import { TreeNode } from './TreeNode';
import { TTreeView } from './TTreeView';
import { ControlTypes } from '../../ControlTypes';
export class TreeNodeCollection extends List<TreeNode> {
    public TreeView: TTreeView = null as any;
    public constructor() {
        super();
    }

    public Add(text: string): TreeNode;
    public Add(key: int, text: string): TreeNode;
    public Add(key: string, text: string): TreeNode;
    public Add(treeNode: TreeNode): int
    public Add(...args: any[]): TreeNode | int {
        if (args.length === 1 && is.string(args[0])) {
            const text: string = args[0];
            const treeNode = new TreeNode(text);
            super.Add(treeNode);
            if (this.TreeView != null) {
                this.SetTreeView(treeNode);
                this.TreeView.ForceUpdate();
            }
            return treeNode;
        } else if (args.length === 2 && is.string(args[0]) && is.string(args[1])) {
            const key: string = args[0];
            const text = args[1];
            const treeNode = new TreeNode(key, text);
            super.Add(treeNode);
            if (this.TreeView != null) {
                this.SetTreeView(treeNode);
                this.TreeView.ForceUpdate();
            }
            return treeNode;
        } else if (args.length === 2 && is.int(args[0]) && is.string(args[1])) {
            const key: int = args[0];
            const text = args[1];
            const treeNode = new TreeNode(key.toString(), text);
            super.Add(treeNode);
            if (this.TreeView != null) {
                this.SetTreeView(treeNode);
                this.TreeView.ForceUpdate();
            }
            return treeNode;
        } else if (args.length === 1 && is.typeof<TreeNode>(args[0], ControlTypes.TreeView.TreeNode) ){
            const treeNode: TreeNode = args[0];
            const result = super.Add(treeNode);
            if (this.TreeView != null) {
                this.SetTreeView(treeNode);
                this.TreeView.ForceUpdate();
            }
            return result;
        }

        throw new  ArgumentOutOfRangeException('TreeNodeCollection::Add');
    }

    private SetTreeView(node: TreeNode): void {
        node.Nodes.TreeView = this.TreeView;
        foreach(node.Nodes, (treeNode: TreeNode) => {
            this.SetTreeView(treeNode);
        });
    }

    public GetByKey(key: string): TreeNode {
        let result: TreeNode = null as any;
        foreach(this, (node: TreeNode) => {
            if (node.Key === key) {
                result = node;
                return BREAK;
            } else {
                result = node.Nodes.GetByKey(key);
                if (result != null) {
                    return BREAK;
                }
            }
        });
        return result;
    }
    public ToObject(): any[] {
        const nodes: any[] = [];
        foreach(this, (node: TreeNode) => {
            nodes.push(node.ToObject());
        });
        return nodes;
    }

}
