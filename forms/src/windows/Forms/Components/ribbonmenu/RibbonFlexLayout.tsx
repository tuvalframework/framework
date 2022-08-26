import React, { createElement, Fragment } from "../../../../preact/compat";
import { Teact } from '../Teact';
import { ClassInfo, classNames } from '@tuval/core';


export class RibbonFlexLayout extends React.Component {

    public render(): any {
        return (
            <div class="d-flex flex-column">
                {this.props.children}
            </div>
        );
    }
}