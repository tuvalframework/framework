import { Teact } from "../Teact";
import React  from '../../../../preact/compat';
import { ObjectUtils } from '../ObjectUtils';

export class CurrentPageReport extends React.Component {

    static defaultProps = {
        pageCount: null,
        page: null,
        first: null,
        rows: null,
        totalRecords: null,
        reportTemplate: '({currentPage} of {totalPages})',
        template: null
    }

    render() {
        const report = {
            currentPage: this.props.page + 1,
            totalPages: this.props.pageCount,
            first: Math.min(this.props.first + 1, this.props.totalRecords),
            last: Math.min(this.props.first + this.props.rows, this.props.totalRecords),
            rows: this.props.rows,
            totalRecords: this.props.totalRecords
        };

        const text = this.props.reportTemplate
            .replace("{currentPage}", report.currentPage)
            .replace("{totalPages}", report.totalPages)
            .replace("{first}", report.first)
            .replace("{last}", report.last)
            .replace("{rows}", report.rows)
            .replace("{totalRecords}", report.totalRecords);

        const element = <span className="p-paginator-current">{text}</span>;

        if (this.props.template) {
            const defaultOptions = {...report, ...{
                className: 'p-paginator-current',
                element,
                props: this.props
            }};

            return ObjectUtils.getJSXElement(this.props.template, defaultOptions);
        }

        return element;
    }
}
