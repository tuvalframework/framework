import React, { createElement, Fragment } from "../../../../preact/compat";
import { Teact } from '../Teact';
import { ClassInfo, classNames } from '@tuval/core';
export class RibbonToolButton extends React.Component {

    constructor(props) {
        super(props);
    }

    public render() {
        return (
            <button class="ribbon-tool-button">
                <span class="icon">
                    <img src="images/share.svg"></img>
                </span>
            </button>
        );
    }
}