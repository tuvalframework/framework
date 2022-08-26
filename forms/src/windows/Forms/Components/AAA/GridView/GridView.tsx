import React, { createElement, Fragment } from "../../../../../preact/compat";
import { Teact } from '../../Teact';
import { is, Delegate, Event, int } from '@tuval/core';
import { Control } from "../Control";
import { DataTable } from "../../datatable/DataTable";
import { ColumnComponent } from "../../column/Column";
import { ColumnCollection } from './ColumnCollection';
import { ImageColumn } from './ImageColumn';
import { ControlTypes } from '../../ControlTypes';


export class RowClickEvent extends Delegate<() => void>{ }

export class GridView extends Control<GridView> {

    public get KeyField(): string {
        return this.GetProperty('KeyField') || {};
    }
    public set KeyField(value: string) {
        this.SetProperty('KeyField', value);
    }

    public get SelectedRow(): any {
        return this.GetProperty('SelectedRow') || {};
    }
    public set SelectedRow(value: any) {
        this.SetProperty('SelectedRow', value);
    }

    public get Columns(): ColumnCollection {
        return this.GetProperty('Columns') || {};
    }
    public set Columns(value: ColumnCollection) {
        this.SetProperty('Columns', value);
    }
    public get Data(): any {
        return this.GetProperty('Data') || {};
    }
    public set Data(value: any) {
        this.SetProperty('Data', value);
    }

    public get ScrollHeight(): int {
        return this.GetProperty('ScrollHeight') || {};
    }
    public set ScrollHeight(value: int) {
        this.SetProperty('ScrollHeight', value);
    }

    public get OnRowDoubleClick(): Event<RowClickEvent> {
        return this.GetProperty('OnRowDoubleClick');
    }
    public set OnRowDoubleClick(value: Event<RowClickEvent>) {
        this.SetProperty('OnRowDoubleClick', value);
    }

    public SetupControlDefaults() {
        super.SetupControlDefaults();
        this.Columns = new ColumnCollection(this as any);
        this.ScrollHeight = 400;
        this.OnRowDoubleClick = new Event();
    }

    protected componentWillUnmount() {
        this.Data = undefined;
    }
    private CreateColumns(): any[] {
        return this.Columns.ToArray().map(col => {
            let style = {};
            if (col.width > 0) {
                style['width'] = col.width + 'px';
            }
            if (is.typeof<ImageColumn>(col, ControlTypes.GridView.ImageColumn)) {
                return (
                    <ColumnComponent field={col.field} header={col.headerText} body={col.imageTemplate.bind(col)} style={style}></ColumnComponent>
                );
            } else {
                return (
                    <ColumnComponent field={col.field} header={col.headerText} style={style} body={col.GetBodyTemplate.bind(col)}></ColumnComponent>
                );
            }
        });
    }
    public CreateElements(): any {

        if (is.nullOrEmpty(this.KeyField)) {
            return (
                <DataTable value={this.Data} className='p-datatable-sm' showGridlines selectionMode="single" scrollable scrollHeight={this.ScrollHeight + 'px'}>
                    {this.CreateColumns()}
                </DataTable>
            );
        } else {
            return (
                <DataTable value={this.Data} emptyMessage='' className='p-datatable-sm' showGridlines selectionMode="single" scrollable scrollHeight={this.ScrollHeight + 'px'}
                    selection={this.SelectedRow} onSelectionChange={e => this.SelectedRow = e.value} dataKey={this.KeyField} onRowDoubleClick={(e) => this.OnRowDoubleClick(e.data)}>
                    {this.CreateColumns()}
                </DataTable>
            );
        }
    }

}