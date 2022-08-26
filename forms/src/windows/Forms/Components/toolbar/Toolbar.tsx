import React from '../../../../preact/compat';
import { DomHandler } from '../DomHandler';
import { Teact } from '../Teact';
import { classNames } from '@tuval/core';
import { ObjectUtils } from '../ObjectUtils';

const css = require('./Toolbar.css');
DomHandler.addCssToDocument(css);

export class ToolbarComponent extends React.Component {

    static defaultProps = {
        id: null,
        style: null,
        className: null,
        left: null,
        center: null,
        right: null
    };

    render() {
        const toolbarClass = classNames('p-toolbar p-component', this.props.className);
        const left = ObjectUtils.getJSXElement(this.props.left, this.props);
        const center = ObjectUtils.getJSXElement(this.props.center, this.props);
        const right = ObjectUtils.getJSXElement(this.props.right, this.props);

        return (
            <div id={this.props.id} className={toolbarClass} style={this.props.style} role="toolbar">
                <div className="p-toolbar-group-left">
                    {left}
                </div>
                <div className="p-toolbar-group-center">
                    {center}
                </div>
                <div className="p-toolbar-group-right">
                    {right}
                </div>
            </div>
        );
    }
}