import React from "../../../../../preact/compat";
import { Teact } from '../../Teact';
import { Control, Modes } from '../Control';
import { ButtonComponent } from '../../button/TuButtonElement';
import { ToolbarComponent } from '../../toolbar/Toolbar';
import { TuInputElement } from '../../inputtext/TuInputText';
import { Button, ButtonColors } from "../Button/Button";
import { DomHandler } from "../../DomHandler";

const css = require('./Toolbar.css');
DomHandler.addCssToDocument(css);

export class Toolbar extends Control<Toolbar> {

    public CreateElements(): any {
        const leftContents = (
            <React.Fragment>
                <Button Visible={true} Color={ButtonColors.Gray} Text="<" />
                <Button Visible={true} Color={ButtonColors.Gray} Text=">" />
                <i className="pi pi-bars p-toolbar-separator p-mr-2" />
            </React.Fragment>
        );

        const centerContents = (
            <React.Fragment>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <TuInputElement placeholder="Search" />
                </span>

            </React.Fragment>
        );

        const rightContents = (
            <React.Fragment>
                <i className="pi pi-bars p-toolbar-separator p-mr-2" />
               <Button Visible={true} Color={ButtonColors.Gray} Text="Manuel Kurulum" />
               <Button Visible={true} Color={ButtonColors.Gray} Text="Ayarlar" />
            </React.Fragment>
        );
        return (<ToolbarComponent left={leftContents} center={centerContents} right={rightContents} />);
    }

}