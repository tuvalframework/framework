import { Teact } from "../Teact";
import React from '../../../../preact/compat';
import { classNames } from '@tuval/core';
import { Ripple } from '../ripple/Ripple';

export class RowTogglerButton extends React.Component {

    static defaultProps = {
        rowData: null,
        onClick: null,
        expanded: false
    }
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick(event) {
        if(this.props.onClick) {
            this.props.onClick({
                originalEvent: event,
                data: this.props.rowData
            })
        }
    }

    render() {
        let iconClassName = classNames('p-row-toggler-icon pi pi-fw p-clickable', {
            'pi-chevron-down': this.props.expanded,
            'pi-chevron-right': !this.props.expanded
        } as any);

        return  <button type="button" onClick={this.onClick} className="p-row-toggler p-link">
                    <span className={iconClassName}></span>
                    <Ripple />
                </button>
    }
}
