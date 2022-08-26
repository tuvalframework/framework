import React, { createElement, Fragment } from "../../../../../preact/compat";
import { Teact } from '../../Teact';
import { ClassInfo, classNames, is } from '@tuval/core';
import { InputText } from "../../inputtext/TuInputText";
import { Control } from '../Control';
import { ControlTypes } from "../../ControlTypes";
import { PanelMenuComponent } from '../../panelmenu/PanelMenu';
import { DomHandler } from '../../DomHandler';

const css = require('./PanelMenu.css');
DomHandler.addCssToDocument(css);

/* @ClassInfo({
    fullName: ControlTypes.TextBox,
    instanceof: [
        ControlTypes.TextBox,
    ]
}) */
export class PanelMenu extends Control<PanelMenu> {
   public get Model(): any {
      return this.GetProperty('Model');
   }
   public set Model(value: any) {
      this.SetProperty('Model', value);
   }

   public CreateElements(): any {
      const title = is.nullOrEmpty(this.Text) ? null : (<h2 class="panelmenu-title">{this.Text}</h2>);
      return (
         <div class='tuval-panelmenu'>
            {title}
            <PanelMenuComponent model={this.Model} />
         </div>
      );
   }
}