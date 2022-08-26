import React, { createElement, Fragment } from "../../../../preact/compat";
import { Teact } from '../Teact';
import { ClassInfo, classNames } from '@tuval/core';

export class RibbonSplitButton extends React.Component {

    constructor(props) {
        super(props);
    }

    public render() {
        return (
            <div class="ribbon-split-button">
                <button class="ribbon-main">
                    <span class="icon">
                       {/*  <span class="mif-cogs"></span> */}
                       <img src="images/share.svg"></img>
                    </span>
                </button>
                <span class="ribbon-split dropdown-toggle">{this.props.text}</span>
            </div>
        );
    }
}