import React, { createElement, Fragment } from "../../../../preact/compat";
import { Teact } from '../Teact';
import { ClassInfo, classNames } from '@tuval/core';
export class RibbonButton extends React.Component {

    constructor(props) {
        super(props);
        /*  if (this.props.onClick != null) {

         } */
    }

    public render() {
        return (
            <button class="ribbon-button" onClick={() => this.props.onClick()}>
                <span class="icon">
                    <img src={this.props.icon}></img>
                </span>
                <span class="caption">{this.props.text}</span>
            </button>
        );
    }
}