import { TreeNodeCollection } from "./TreeNodeCollection";
import { TTreeView } from './TTreeView';
import { Guid, is, ClassInfo } from '@tuval/core';
import { ControlTypes } from "../../ControlTypes";

@ClassInfo({
    fullName: ControlTypes.TreeView.TreeNode,
    instanceof: [
        ControlTypes.TreeView.TreeNode,
    ]
})
export class TreeNode {
    public Key: string = Guid.NewGuid().ToString();
    public Icon: string = '';
    public Selectable: boolean = true;
    public Tag: any;


    private m_TreeView: TTreeView = null as any;
    public get TreeView(): TTreeView {
        return this.m_TreeView;
    }

    public set TreeView(value: TTreeView) {
        this.m_TreeView = value;
        this.Nodes.TreeView = value;
    }

    public Text: string = '';
    public Nodes: TreeNodeCollection = null as any;

    public constructor(text: string);
    public constructor(key: string, text: string);
    public constructor(...args: any[]) {
        if (args.length === 1 && is.string(args[0])) {
            const text = args[0]
            this.Text = text;
            this.Nodes = new TreeNodeCollection();
        } else if (args.length === 2 && is.string(args[0]) && is.string(args[1])) {
            const key = args[0];
            const text = args[1];
            this.Key = key;
            this.Text = text;
            this.Nodes = new TreeNodeCollection();
        }
    }

    public ToObject(): any {
        return {
            key: this.Key,
            label: this.Text,
            selectable: this.Selectable,
            children: this.Nodes.ToObject(),
        };
    }
}