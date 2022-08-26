
import React from '../../../../preact/compat';
import { Teact } from '../Teact';
import { TuInputElement } from '../inputtext/TuInputText';
export class ListBoxHeader extends React.Component {

    static defaultProps = {
        filter: null,
        filterPlaceholder: null,
        disabled: false,
        onFilter: null
    }

    constructor(props) {
        super(props);
        this.onFilter = this.onFilter.bind(this);
    }

    onFilter(event) {
        if(this.props.onFilter) {
            this.props.onFilter({
                originalEvent: event,
                value: event.target.value
            });
        }
    }

    render() {
        return (
                <div className="p-listbox-header">
                    <div className="p-listbox-filter-container">
                        <TuInputElement type="text" value={this.props.filter} onChange={this.onFilter} className="p-listbox-filter" disabled={this.props.disabled} placeholder={this.props.filterPlaceholder} />
                        <span className="p-listbox-filter-icon pi pi-search"></span>
                    </div>
                </div>
        );
    }
}