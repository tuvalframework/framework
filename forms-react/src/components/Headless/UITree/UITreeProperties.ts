import { CSSProperties } from "react";
import { UIView } from "../../UIView/UIView";



export interface UITreeProperties {
    /*
    Whether to allow dropping on the node
    */
    vp_AllowDrop: ({ dropNode, dropPosition }) => boolean;

    /**
     * Whether to automatically expand a parent treeNode
     * Default falseß
     */
    vp_AutoExpandParent: boolean;

    /**
     * Whether treeNode fill remaining horizontal space
     * Default false
     */
    vp_BlockNode: boolean;

    /**
     * Add a Checkbox before the treeNodes
     * Default false
     */
    vp_Checkable: boolean;

    /**
     * (Controlled) Specifies the keys of the checked treeNodes (PS: 
     * When this specifies the key of a treeNode which is also a parent treeNode, 
     * all the children treeNodes of will be checked; and vice versa,
     *  when it specifies the key of a treeNode which is a child treeNode, 
     * its parent treeNode will also be checked. When checkable and checkStrictly is true, 
     * its object has checked and halfChecked property. 
     * Regardless of whether the child or parent treeNode is checked, they won't impact each other
     * Default: []
     */
    vp_CheckedKeys: string[] | { checked: string[], halfChecked: string[] };

    /**
     * Check treeNode precisely; parent treeNode and children treeNodes are not associated
     * Default: false
     */
    vp_CheckStrictly: boolean;

    /**
     * Specifies the keys of the default checked treeNodes
     * Default: []
     */
    vp_DefaultCheckedKeys: string[];

    /**
     * Whether to expand all treeNodes by default
     * Default: false
     */
    vp_DefaultExpandAll: boolean;

    /**
     * Specify the keys of the default expanded treeNodes
     * Default: []
     */
    vp_DefaultExpandedKeys: string[];

    /**
     * If auto expand parent treeNodes when init
     * Default: true
     */
    vp_DefaultExpandParent: boolean;

    /**
     * Specifies the keys of the default selected treeNodes
     * Default: []
     */
    vp_DefaultSelectedKeys: string[];

    /**
     * Whether disabled the tree
     * Default: false
     */
    vp_Disabled: boolean;

    /**
     * Specifies whether this Tree or the node is draggable. 
     * Use icon: false to disable drag handler icon
     * Default: false
     */
    vp_Draggable: boolean | ((node: any) => boolean) | { icon?: React.ReactNode | false, nodeDraggable?: (node: any) => boolean };

    /**
     * (Controlled) Specifies the keys of the expanded treeNodes
     * Default: []
     */
    vp_ExpandedKeys: string[];

    /**
     * Customize node title, key, children field name
     * Default: { title: title, key: key, children: children }
     */
    vp_FieldNames: object;

    /**
     * Defines a function to filter (highlight) treeNodes. 
     * When the function returns true, the corresponding treeNode will be highlighted
     */
    vp_FilterTreeNode: (node: any) => boolean;

    /**
     * Config virtual scroll height. Will not support horizontal scroll when enable this
     */
    vp_Height: number;

    /**
     * Customize treeNode icon
     */
    vp_Icon: UIView | ((props) => UIView);

    /**
     * Load data asynchronously
     */
    vp_LoadData: (node: any) => void;

    /**
     * (Controlled) Set loaded tree nodes. Need work with loadData
     * Default: []
     */
    vp_LoadedKeys: string[];

    /**
     * Allows selecting multiple treeNodes
     * Default: false
     */
    vp_Multiple: boolean;

    /**
     * Style on the root element
     */
    vp_RootStyle: CSSProperties;

    /**
     * Whether can be selected
     * Default: true
     */
    vp_Selectable: boolean;

    /**
     * (Controlled) Specifies the keys of the selected treeNodes, multiple selection needs to set multiple to true
     * 
     */
    vp_SelectedKeys: string[];

    /**
     * Shows the icon before a TreeNode's title. 
     * There is no default style; you must set a custom style for it if set to true
     * Default: false
     */
    vp_showIcon: boolean;

    /**
     * Shows a connecting line
     * Default: false
     */
    vp_showLine: boolean | { showLeafIcon: boolean | UIView | ((props: any) => UIView) };

    /**
     * Customize collapse/expand icon of tree node
     */
    vp_switcherIcon: UIView | ((props: any) => UIView);

    /**
     * 	Customize tree node title render
     */
    vp_titleRender: (nodeData) => UIView;

    /**
     * The treeNodes data Array, if set it then you need not to construct children TreeNode. 
     * (key should be unique across the whole array)
     */
    vp_treeData: Array<{ key, title, children, disabled, selectable }>;
}