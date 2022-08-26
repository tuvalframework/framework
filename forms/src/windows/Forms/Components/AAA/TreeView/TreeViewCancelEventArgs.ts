import { TreeNode } from "./TreeNode";
import { TreeViewAction } from "./TreeViewAction";

export class TreeViewCancelEventArgs {

	private node: TreeNode;
	private action: TreeViewAction;
	private cancel: boolean;

	public constructor(node: TreeNode, cancel: boolean, action: TreeViewAction) {
		this.node = node;
		this.action = action;
		this.cancel = cancel;
	}

	public get Node(): TreeNode {
		return this.node;
	}

	public get Action(): TreeViewAction {
		return this.action;
	}

	public get Cancel(): boolean {
		return this.cancel;
	}
	public set Cancel(value: boolean) {
		this.cancel = value;
	}
}
