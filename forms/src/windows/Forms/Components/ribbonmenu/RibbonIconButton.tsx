import React, { createElement, Fragment } from "../../../../preact/compat";
import { Teact } from '../Teact';
import { ClassInfo, classNames } from '@tuval/core';
export class RibbonIconButton extends React.Component {

    constructor(props) {
        super(props);
    }

    public render() {
        return (
            <button class="ribbon-icon-button">
            <span class="icon">
                <img src="images/share.svg"></img>
            </span>
            <span class="caption">{this.props.text}</span>
        </button>
        );
    }
}