import { Control } from "../Control";
import React from "../../../../../preact/compat";
import { Teact } from '../../Teact';
import { ContainerControl } from "./EndLayout";
import { DomHandler } from '../../DomHandler';

DomHandler.addCssToDocument(require('./VerticalLayout.css'));

export class VerticalLayout extends ContainerControl<VerticalLayout> {

    private renderControls(): any[] {
        const controls = this.Controls.ToArray().map(c => {
            return (<div className="p-col p-0">
                {(c as any).CreateMainElement()}
            </div>);
        });

        return controls;
    }
    public CreateElements() {
        return (<div class='tuval-verticallayout' style={this.GetStyleObject()}>
            <div className="p-grid p-dir-col" style={{ width: '100%' }}>
                {this.renderControls()}
            </div>
        </div>);
    }
}