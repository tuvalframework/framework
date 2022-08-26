import { int } from '@tuval/core';
import { Modes } from '..';

import { Control } from '../Control';
import { ColumnCollection } from './ColumnCollection';

export abstract class GridViewBase extends Control<GridViewBase> {

    public get AutoGenerateColumns(): boolean {
        return this.GetProperty('AutoGenerateColumns');
    }
    public set AutoGenerateColumns(value: boolean) {
        this.SetProperty('AutoGenerateColumns', value);
    }

    public get Columns(): ColumnCollection {
        return this.GetProperty('Columns');
    }
    public set Columns(value: ColumnCollection) {
        this.SetProperty('Columns', value);
    }
    public get DataSource(): any {
        return this.GetProperty('DataSource');
    }
    public set DataSource(value: any) {
        this.SetProperty('DataSource', value);
    }

    public get ScrollHeight(): int {
        return this.GetProperty('ScrollHeight');
    }
    public set ScrollHeight(value: int) {
        this.SetProperty('ScrollHeight', value);
    }

    public SetupControlDefaults() {
        super.SetupControlDefaults();
        this.AutoGenerateColumns = false;
        this.Columns = new ColumnCollection(this);
        this.ScrollHeight = 400;
    }

    protected componentWillUnmount() {
        this.DataSource = undefined;
    }

    public RefreshColumns(): void {
        if (this.__Mode__ === Modes.Control && this.__m_Component__ != null) {
            this.__m_Component__.RefreshColumns();
        } else {
            this.RefreshColumnsInternal();
        }
    }
    protected abstract RefreshColumnsInternal(): void;
}