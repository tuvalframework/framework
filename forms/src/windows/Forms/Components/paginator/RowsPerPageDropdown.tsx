import { Teact } from "../Teact";
import React  from '../../../../preact/compat';
import { DropdownComponent } from "../dropdown/DropDown";
import { ObjectUtils } from '../ObjectUtils';

export class RowsPerPageDropdown extends React.Component {

    static defaultProps = {
        options: null,
        value: null,
        page: null,
        pageCount: null,
        totalRecords: 0,
        appendTo: null,
        onChange: null,
        template: null
    }


    hasOptions() {
        return this.props.options && this.props.options.length > 0;
    }

    render() {
        const hasOptions = this.hasOptions();
        const options = hasOptions ? this.props.options.map(opt => ({ label: String(opt), value: opt })) : [];
        const element = hasOptions ? <DropdownComponent value={this.props.value} options={options} onChange={this.props.onChange} appendTo={this.props.appendTo} /> : null;

        if (this.props.template) {
            const defaultOptions = {
                value: this.props.value,
                options,
                onChange: this.props.onChange,
                appendTo: this.props.appendTo,
                currentPage: this.props.page,
                totalPages: this.props.pageCount,
                totalRecords: this.props.totalRecords,
                element,
                props: this.props
            };

            return ObjectUtils.getJSXElement(this.props.template, defaultOptions);
        }

        return element;
    }
}
