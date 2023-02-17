import { css } from "@emotion/css";
import { foreach, is } from "@tuval/core";
import { Mention } from 'primereact';
import React, { Fragment } from "react";
import { UIView } from "../../UIView/UIView";
import { TableColumnClass } from "../TableColumn";
import { TableClass } from "./TableClass";

export interface IControlProperties {
    control: TableClass
}


function TableRenderer({ control }: IControlProperties) {

    const className = css`
    ${control.Appearance.ToString()}
    ${control.HoverAppearance.IsEmpty ? '' : '&:hover { ' + control.HoverAppearance.ToString() + ' }'}
    ${control.ActiveAppearance.IsEmpty ? '' : '&:active { ' + control.ActiveAppearance.ToString() + ' }'}
    ${control.FocusAppearance.IsEmpty ? '' : '&:focus { ' + control.FocusAppearance.ToString() + ' }'}
`;


    const attributeObject = {}
    attributeObject['alignment'] = control.vp_Alignment;
    attributeObject['spacing'] = control.vp_Spacing;

    const headerResult = [];
    const rowViewFunctions = [];
    foreach(control.vp_Header, tableColumn => {
        if (tableColumn != null) {
            const headerView: UIView = tableColumn.vp_HeaderView;
            if (headerView != null) {
                let headerNode = headerView.render();
                const style = tableColumn.Appearance?.GetStyleObject();
                if (tableColumn.vp_HeaderWidth) {
                    style['width'] = tableColumn.vp_HeaderWidth;
                }
                headerResult.push(<th style={style}> {headerNode}</th>);
            }
            rowViewFunctions.push(tableColumn.vp_RowFunction);
        }
    });

    const rowNodes = [];
    foreach(control.vp_Value, rowData => {
        const row_columns = [];
        foreach(rowViewFunctions, func => {
            try {
                const row_column = func(rowData);
                row_columns.push(<td> {row_column.render()}</td>);
            } catch {
                row_columns.push(<td>{'Error'}</td>);
            }
        });
        const style = control.vp_RowAppearance?.Appearance?.GetStyleObject();
        rowNodes.push(<tr style={style}>{row_columns}</tr>);
    });

    let headerStyle = {};
    if (control.vp_HeaderAppearance != null) {
        headerStyle = control.vp_HeaderAppearance.Appearance?.GetStyleObject();
    }
    return (
        <div className={className}>
            <table style={{ width: '100%', height: '100%', borderCollapse: 'collapse' }}>
                <thead style={headerStyle}>
                    <tr> {headerResult}</tr>
                </thead>
                <tbody>
                    {rowNodes}
                </tbody>
            </table>
        </div>
    );
}

export default TableRenderer;