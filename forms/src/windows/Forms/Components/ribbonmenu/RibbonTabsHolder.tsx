import React, { createElement, Fragment } from "../../../../preact/compat";
import { Teact } from '../Teact';
import { ClassInfo, classNames } from '@tuval/core';

export class RibbonTabsHolder extends React.Component {

    constructor(props) {
        super(props);
        /*  if (this.props.onClick != null) {

         } */
    }


    public render() {
        return (
            <ul class="tabs-holder">
                {this.props.children.map((tab, index) => {
                    const className = classNames({ 'static': tab.props.static, 'disabled': tab.props.disabled, 'active': this.props.activeIndex === index } as any);
                    return (
                        <li class={className}><a href="#" onClick={e =>  tab.props.disabled ? void 0 : this.props.onClick(index)}>{tab.props.text}</a></li>
                    );

                })}
            </ul>
        );
    }
}