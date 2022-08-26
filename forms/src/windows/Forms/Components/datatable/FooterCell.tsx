import { Teact } from "../Teact";
import React from '../../../../preact/compat';
import { ObjectUtils } from "../ObjectUtils";

export class FooterCell extends React.Component {

    render() {
        let className = this.props.footerClassName||this.props.className;
        let footer = ObjectUtils.getJSXElement(this.props.footer, this.props);

        return (
            <td role="cell" className={className} style={this.props.footerStyle||this.props.style}
                colSpan={this.props.colSpan} rowSpan={this.props.rowSpan}>
               {footer}
            </td>
        );
    }
}
