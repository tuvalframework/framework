import React, { createElement, Fragment } from "../../../../preact/compat";
import { Teact } from '../Teact';
import { ClassInfo, classNames } from '@tuval/core';
export class RibbonTabComponent extends React.Component {

    constructor(props) {
        super(props);
        /*  if (this.props.onClick != null) {

         } */
    }

    public render() {
        const className = classNames({ 'static': this.props.static, 'disabled': this.props.disabled, 'active': this.props.active } as any);
        return (
            <li class={className}><a href="#" onClick={e => this.props.onClick(this.props.index)}>{this.props.text}</a></li>
        );
    }
}