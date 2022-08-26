import { GridColumn } from './Column';
import React, { createElement, Fragment } from "../../../../../preact/compat";
import { Teact } from '../../Teact';
import { ClassInfo, int } from '@tuval/core';
import { ControlTypes } from '../../ControlTypes';


@ClassInfo({
    fullName: ControlTypes.GridView.ImageColumn,
    instanceof: [
        ControlTypes.GridView.ImageColumn
    ]
})
export class ImageColumn extends GridColumn {
    public Image: string = '';
    public ImageSize: int = 64;
    public imageTemplate(rowData) {
        return <img src={this.Image} onError={(e) => e.target.src = ''} alt={rowData.image} width={this.ImageSize} height={this.ImageSize} />;
    }
}