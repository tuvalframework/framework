import React, { createElement, Fragment } from "../../../../preact/compat";
import { Teact } from '../Teact';
import { ClassInfo, classNames } from '@tuval/core';

export class RibbonContentHolder extends React.Component {

    constructor(props) {
        super(props);
        /*  if (this.props.onClick != null) {

         } */
    }


    public render() {
        return (
            <ul class="content-holder">
                {this.props.children.map((content, index) => {
                    const className = classNames('section', { 'active': this.props.activeIndex === index } as any);
                    return (
                        <div class={className} id={`section_${index}`}>
                            {content.props.children}
                        </div>
                    );

                })}
            </ul>
        );
    }
}