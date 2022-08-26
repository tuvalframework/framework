import { Control } from "../Control";
import React from "../../../../../preact/compat";
import { Teact } from '../../Teact';
import { ContainerControl } from "./EndLayout";
import { DomHandler } from '../../DomHandler';

DomHandler.addCssToDocument(require('./HorizontalLayout.css'));

export class HorizontalLayout extends ContainerControl<HorizontalLayout> {

    private renderControls(): any[] {
        const controls = this.Controls.ToArray().map(c => {
            return (<div className="p-col p-0">
                {(c as any).CreateMainElement()}
            </div>);
        });

        return controls;
    }
    public CreateElements() {
        return (<div class='tuval-horizontal-layout' style={this.GetStyleObject()}>
            <div className="p-grid " style={{ width: '100%' }}>
                {this.renderControls()}
            </div>
        </div>);
    }
}