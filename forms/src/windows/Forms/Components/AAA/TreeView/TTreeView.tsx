import React, { createElement, Fragment } from "../../../../../preact/compat";
import { Teact } from '../../Teact';
import { is, Delegate, Event } from '@tuval/core';
import { InputText } from "../../inputtext/TuInputText";
import { Control, Modes } from '../Control';
import { DropdownComponent } from "../../dropdown/DropDown";
import { Tree } from '../../tree/Tree';
import { TreeNodeCollection } from './TreeNodeCollection';
import { TreeNode } from "./TreeNode";
import { TreeViewCancelEventHandler } from "./TreeViewCancelEventHandler";
import { TreeViewCancelEventArgs } from "./TreeViewCancelEventArgs";
import { TreeViewAction } from './TreeViewAction';
import { TreeViewEventHandler } from "./TreeViewEventHandler";
import { TreeViewEventArgs } from "./TreeViewEventArgs";
import { Observable } from "rxjs-compat/Observable";
import { DomHandler } from '../../DomHandler';
import { Resources } from './Resources';
import { Property } from "../Reflection/PropertyDecorator";

const css = require('./TreeView.css');
DomHandler.addCssToDocument(css);

export class SelectionChanged extends Delegate<(key: string) => void> { };
export class TTreeView extends Control<TTreeView> {

    private get expandedKeys(): any {
        return this.GetProperty('expandedKeys');
    }
    private set expandedKeys(value: any) {
        this.SetProperty('expandedKeys', value);
    }

    public get AfterSelect(): Event<TreeViewEventHandler> {
        return this.GetProperty('AfterSelect');
    }
    public set AfterSelect(value: Event<TreeViewEventHandler>) {
        this.SetProperty('AfterSelect', value);
    }

    public get BeforeSelect(): Event<TreeViewCancelEventHandler> {
        return this.GetProperty('BeforeSelect');
    }
    public set BeforeSelect(value: Event<TreeViewCancelEventHandler>) {
        this.SetProperty('BeforeSelect', value);
    }

    public get SelectedItem(): any {
        return this.GetProperty('SelectedItem');
    }
    public set SelectedItem(value: any) {
        this.SetProperty('SelectedItem', value);
    }


    public get Label(): string {
        return this.GetProperty('Label');
    }
    public set Label(value: string) {
        this.SetProperty('Label', value);
    }

    public get SelectedKey(): string {
        return this.GetProperty('SelectedKey');
    }
    public set SelectedKey(value: string) {
        this.SetProperty('SelectedKey', value);
    }

    public get SelectedKey$(): Observable<string> {
        return this.GetPipe('SelectedKey');
    }
    public set SelectedKey$(value: Observable<string>) {
        this.SetPipe('SelectedKey', value);
    }

    public get SelectedNode(): TreeNode {
        return this.Nodes.GetByKey(this.SelectedKey);
    }
    public set SelectedNode(value: TreeNode) {
        this.SelectedKey = value.Key;
    }

    public get Nodes(): TreeNodeCollection {
        return this.GetProperty('Nodes');
    }
    public set Nodes(value: TreeNodeCollection) {
        this.SetProperty('Nodes', value);
    }

    @Property()
    public NodeMouseDoubleClick: Event<any>;

    @Property()
    public ItemDrag: Event<any>;

    protected SetupControlDefaults(): void {
        super.SetupControlDefaults();
        this.Nodes = new TreeNodeCollection();
        this.Nodes.TreeView = this;
        this.BeforeSelect = new Event();
        this.AfterSelect = new Event();
        this.ItemDrag = new Event();
        this.NodeMouseDoubleClick = new Event();
    }

    protected SetupComponentDefaults(): void {
        super.SetupComponentDefaults();
        this.onSelectionChangeInternal = this.onSelectionChangeInternal.bind(this);
        this.nodeTemplate = this.nodeTemplate.bind(this);
    }

    private getNodeImage(imgUrl) {
        if (imgUrl !== '') {
            return (<img className='p-pr-1' style={{ width: '24px', height: '24px' }} src={imgUrl}></img>)
        }
        return null;
    }
    private nodeTemplate(node: any, options: any) {
        let label = node.label;

        if (node.url) {
            label = <a href={node.url}>{node.label}</a>;
        }

        let imgUrl = '';
        const treeNode: TreeNode = this.Nodes.GetByKey(node.key);
        if (treeNode == null || is.nullOrEmpty(treeNode.Icon)) {
            //imgUrl = Resources.Icons.Empty24x24Image;
        } else {
            imgUrl = treeNode.Icon;
        }
        return (
            <div class="flex justify-content-start flex-wrap card-container" ondblclick={() => this.NodeMouseDoubleClick(node)}>
                <div class="flex align-items-center justify-content-center">{this.getNodeImage(imgUrl)}</div>
                <div class="flex align-items-center justify-content-center ml-1">
                    <span className={options.className} ondblclick={options.onTogglerClick} draggable="true" ondragstart={(event) => this.ItemDrag({ nativeEvent: event, node: treeNode })}>
                        {label}
                    </span>
                </div>
            </div>
        )
    }

    private togglerTemplate(node, options) {
        return [];
    }

    public Expand(node: TreeNode): void {
        const obj = {};
        obj[node.Key] = true;
        Object.assign(obj, this.expandedKeys);
        this.expandedKeys = obj;
    }
    public CreateElements(): any {
        const style = {};

        if (this.Height > 0) {
            style['height'] = this.Height + 'px';
        }
        const obj = this.Nodes.ToObject();
        return (
            <div class='tuval-treeview' style={style}>
                <Tree
                    value={obj}
                    selectionMode="single"
                    expandedKeys={this.state.expandedKeys}
                    selectionKeys={this.SelectedKey} /* togglerTemplate={this.togglerTemplate} */
                    nodeTemplate={this.nodeTemplate}
                    onSelectionChange={e => this.onSelectionChangeInternal(e.value)}
                    onSelect={this.onNodeSelect}
                    onUnselect={this.onNodeUnselect}
                    onToggle={e => this.expandedKeys = e.value}
                    onNodeDoubleClick={(e) => { alert(e.value); this.NodeMouseDoubleClick(); }}
                />
            </div>
        );
    }

    private onSelectionChangeInternal(selectedKey: string): void {
        const node = this.Nodes.GetByKey(selectedKey);
        if (node != null) {
            const eventArs: TreeViewCancelEventArgs = new TreeViewCancelEventArgs(node, false, TreeViewAction.ByMouse);
            this.BeforeSelect(eventArs);
            if (eventArs.Cancel) {
                return;
            }
        }

        this.SelectedKey = selectedKey;

        const tvEventArgs: TreeViewEventArgs = new TreeViewEventArgs(node, TreeViewAction.ByMouse);
        this.AfterSelect(tvEventArgs);

        this.OnSelectionChanged();

    }

    public OnSelectionChanged() { }
    public onNodeSelect() { }
    public onNodeUnselect() { }
}