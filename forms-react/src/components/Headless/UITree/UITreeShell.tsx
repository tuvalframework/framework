import React from "react";
import { UIView } from "../../UIView/UIView";
import { useConfig } from "../../../data/ConfigContext/ConfigContextClass";
import { UITreeProperties } from "./UITreeProperties";
import { UITreeProtocol } from "./UITree";
import { ViewProperty } from "../../UIView/ViewProperty";
import { UIViewRenderer } from "../../UIView/UIViewRenderer";





const RendererNotFound = () => {
    return (
        <div>Renderer Not Found</div>
    )
}

const RendererProxy = (control: UIView) => {
    const config = useConfig();

    if (control.vp_Renderer) {
        return control.vp_Renderer;
    } else if (config && config.rendererEngine) {
        const renderer: Function = config.rendererEngine[UITreeProtocol];
        if (renderer) {
            return renderer;
        }
    }

    return RendererNotFound;

}

export class UITreeShell extends UIView implements UITreeProperties {

    /** @internal */
    @ViewProperty() vp_SelectedKeys: string[];
    selectedKeys(value: string[]) {
        this.vp_SelectedKeys = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_showIcon: boolean;
    showIcon(value: boolean) {
        this.vp_showIcon = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_showLine: boolean | { showLeafIcon: boolean | UIView | ((props: any) => UIView); };
    showLine(value: boolean | { showLeafIcon: boolean | UIView | ((props: any) => UIView); }) {
        this.vp_showLine = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_switcherIcon: UIView | ((props: any) => UIView);
    switcherIcon(value: UIView | ((props: any) => UIView)) {
        this.vp_switcherIcon = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_titleRender: (nodeData: any) => UIView;
    titleRender(value: (nodeData: any) => UIView) {
        this.vp_titleRender = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_treeData: { key: any; title: any; children: any; disabled: any; selectable: any; /** @internal */ }[];
    treeData(value: { key: any; title: any; children: any; disabled: any; selectable: any; /** @internal */ }[]) {
        this.vp_treeData = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_AllowDrop: ({ dropNode, dropPosition }: { dropNode: any; dropPosition: any; }) => boolean;
    allowDrop(value: ({ dropNode, dropPosition }: { dropNode: any; dropPosition: any; }) => boolean) {
        this.vp_AllowDrop = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_AutoExpandParent: boolean;
    autoExpandParent(value: boolean) {
        this.vp_AutoExpandParent = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_BlockNode: boolean;
    blockNode(value: boolean) {
        this.vp_BlockNode = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_Checkable: boolean;
    checkable(value: boolean) {
        this.vp_Checkable = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_CheckedKeys: string[] | { checked: string[]; halfChecked: string[]; };
    checkedKeys(value: string[] | { checked: string[]; halfChecked: string[]; }) {
        this.vp_CheckedKeys = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_CheckStrictly: boolean;
    checkStrictly(value: boolean) {
        this.vp_CheckStrictly = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_DefaultCheckedKeys: string[];
    defaultCheckedKeys(value: string[]) {
        this.vp_DefaultCheckedKeys = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_DefaultExpandAll: boolean;
    defaultExpandAll(value: boolean) {
        this.vp_DefaultExpandAll = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_DefaultExpandedKeys: string[];
    defaultExpandedKeys(value: string[]) {
        this.vp_DefaultExpandedKeys = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_DefaultExpandParent: boolean;
    defaultExpandParent(value: boolean) {
        this.vp_DefaultExpandParent = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_DefaultSelectedKeys: string[];
    defaultSelectedKeys(value: string[]) {
        this.vp_DefaultSelectedKeys = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_Draggable: boolean | { icon?: React.ReactNode; nodeDraggable?: (node: any) => boolean; } | ((node: any) => boolean);
    draggable(value: boolean | { icon?: React.ReactNode; nodeDraggable?: (node: any) => boolean; } | ((node: any) => boolean)) {
        this.vp_Draggable = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_ExpandedKeys: string[];
    expandedKeys(value: string[]) {
        this.vp_ExpandedKeys = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_FieldNames: object;
    fieldNames(value: object) {
        this.vp_FieldNames = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_FilterTreeNode: (node: any) => boolean;
    filterTreeNode(value: (node: any) => boolean) {
        this.vp_FilterTreeNode = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_Height: number;
    /*  height(value: number) {
         this.vp_Height = value;
         return this;
     } */

    /** @internal */
    @ViewProperty() vp_Icon: UIView | ((props: any) => UIView);
    icon(value: UIView | ((props: any) => UIView)) {
        this.vp_Icon = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_LoadData: (node: any) => void;
    loadData(value: (node: any) => void) {
        this.vp_LoadData = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_LoadedKeys: string[];
    loadedKeys(value: string[]) {
        this.vp_LoadedKeys = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_Multiple: boolean;
    multiple(value: boolean) {
        this.vp_Multiple = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_RootStyle: React.CSSProperties;
    rootStyle(value: React.CSSProperties) {
        this.vp_RootStyle = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_Selectable: boolean;
    selectable(value: boolean) {
        this.vp_Selectable = value;
        return this;
    }


    public render() {
        return (<UIViewRenderer wrap={false} control={this} renderer={RendererProxy(this) as any}></UIViewRenderer>)
    }
}
