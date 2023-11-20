


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
    vp_DefaultCheckedKeys:string[];

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
}