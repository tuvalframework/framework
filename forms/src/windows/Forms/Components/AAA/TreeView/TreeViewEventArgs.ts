import { EventArgs } from "@tuval/core";
import { TreeNode } from "./TreeNode";
import { TreeViewAction } from "./TreeViewAction";

export class TreeViewEventArgs extends EventArgs {

	private node: TreeNode;
	private action: TreeViewAction = TreeViewAction.Unknown;

	public constructor(node: TreeNode, action?: TreeViewAction) {
		super();
		this.node = node;
		if (action != null) {
			this.action = action;
		}
	}

	public get Action(): TreeViewAction {
		return this.action;
	}

	public get Node(): TreeNode {
		return this.node;
	}
}
