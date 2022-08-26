import React  from "../../../../preact/compat";
import { Teact } from '../Teact';
import { is, Delegate, Event, ClassInfo } from '@tuval/core';
import { ControlTypes } from "../ControlTypes";
import { ScrollPanelComponent } from '../scrollpanel/ScrollPanel';
import { ContainerControl } from './Layout/EndLayout';

@ClassInfo({
    fullName: ControlTypes.ScrollPanel,
    instanceof: [
        ControlTypes.ScrollPanel,
    ]
})
export class ScrollPanel extends ContainerControl<ScrollPanel> {
    public CreateElements(): any {
        return (
            <ScrollPanelComponent style={{ width: this.Width + 'px', height: this.Height + 'px' }}>
                {this.CreateControls()}
            </ScrollPanelComponent>
        );
    }
}