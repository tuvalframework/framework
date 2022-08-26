import { Teact } from "../Teact";
import React from '../../../../preact/compat';

export class TableLoadingBody extends React.Component {

    renderRow(index) {
        let cells: any = [];
        for (let i = 0; i < this.props.columns.length; i++) {
            cells.push(<td key={i}>{this.props.columns[i].props.loadingBody()}</td>);
        }

        return (
            <tr key={index}>
                {cells}
            </tr>
        );
    }

    renderRows() {
        let rows: any = [];
        for (let i = 0; i < this.props.rows; i++) {
            rows.push(this.renderRow(i));
        }

        return rows;
    }

    render() {
        const rows = this.renderRows();

        return (
            <tbody className="p-datatable-tbody">
                {rows}
            </tbody>
        );
    }
}