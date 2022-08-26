import React, { createElement, Fragment } from "../../../../preact/compat";
import { Teact } from '../Teact';
import { ClassInfo, classNames } from '@tuval/core';


export class RibbonContentPanelGroup extends React.Component {

    public render(): any {
        return (
            <div class="group">
                {this.props.children}
                <span class="title">{this.props.text}</span>
            </div>
        );
    }
}