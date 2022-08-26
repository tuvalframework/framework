import React, { createElement, Fragment } from "../../../../../preact/compat";
import { Teact } from '../../Teact';
import { ClassInfo, is, int, Event, foreach } from '@tuval/core';
import { Control } from "../Control";
import { SliderComponent } from "../../slider/Slider";
import { ShadowRoot } from "../../ShadowRoot/ShadowRoot";
import { Property } from "../Reflection/PropertyDecorator";
import { ControlCollection } from "../ControlCollection";

export class ShadowRootPanel extends Control<ShadowRootPanel> {

    @Property()
    public Style: string;

    @Property()
    public Controls: ControlCollection;

    protected SetupControlDefaults(): void {
        super.SetupControlDefaults();
        this.Style = '';
        this.Controls = new ControlCollection(this);
    }

    private CreateControls(): any[] {
        const vNodes: any[] = [];
        foreach(this.Controls, (control) => {
            vNodes.push(control.CreateMainElement());
        });
        return vNodes;
    }

    public CreateElements(): any {
        if (!this.Visible) {
            return;
        }
        const vNodes: any[] = [];
        /*   if (this.MdiChild != null) { */

        foreach(this.Controls, (control) => {
            vNodes.push(control.CreateMainElement());
        });

        return (
            <div> {/* The shadow root will be attached to this DIV */}
                <ShadowRoot>
                    <style>{this.Style}</style>
                    {vNodes}
                </ShadowRoot>
            </div>
        );
    }


}