import React, { createElement, Portal } from '../../../../preact/compat';
import { DomHandler } from '../DomHandler';
import { Ripple } from '../ripple/Ripple';
import { Teact } from '../Teact';
import { classNames } from '@tuval/core';

const css = require('./ProgressSpinner.css');
DomHandler.addCssToDocument(css);

export class ProgressSpinnerComponent extends React.Component {

    static defaultProps = {
        id: null,
        style: null,
        className: null,
        strokeWidth: "2",
        fill: "none",
        animationDuration: "2s"
    };


    render() {
        let spinnerClass = classNames('p-progress-spinner', this.props.className);

        return <div id={this.props.id} style={this.props.style} className={spinnerClass} role="alert" aria-busy>
            <svg className="p-progress-spinner-svg" viewBox="25 25 50 50" style={{ animationDuration: this.props.animationDuration }}>
                <circle className="p-progress-spinner-circle" cx="50" cy="50" r="20" fill={this.props.fill}
                    strokeWidth={this.props.strokeWidth} strokeMiterlimit="10" />
            </svg>
        </div>;
    }
}