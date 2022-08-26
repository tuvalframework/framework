import React, { createElement, Fragment } from "../../../../preact/compat";
import { Teact } from '../Teact';
import { ClassInfo } from '@tuval/core';
import { RibbonTabComponent } from './RibbonTab';
import { DomHandler } from '../DomHandler';
import { RibbonTabsHolder } from './RibbonTabsHolder';

const css = require('./RibbonMenu.css');
DomHandler.addCssToDocument(css);

export class RibbonMenuComponent extends React.Component {

    constructor(props) {
        super(props);
        /*  if (this.props.onClick != null) {

         } */
    }

    public render(): any {
        return (
            <div class='ribbon-menu'>
                {/*   <RibbonTabsHolder>
                    <RibbonTabComponent static={true} onClick={ e => alert(e)} text='static' index='0'></RibbonTabComponent>
                    <li><a href="#">One</a></li>
                    <li><a href="#">Two</a></li>
                    <li class="disabled"><a href="#">Disabled</a></li>
                    <li><a href="#">Three</a></li>
                    </RibbonTabsHolder> */}
                {this.props.children}
            </div>
        );
    }

}