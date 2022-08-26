import React, { createElement, Fragment } from "../../../../../preact/compat";
import { Teact } from '../../Teact';
import { is, Delegate, Event, int } from '@tuval/core';
import { Control } from '../Control';
import { ResizeSensor } from '../../../../../ResizeSensor';
import { DomHandler } from "../../DomHandler";
import { Ref, State } from "../Reflection/PropertyDecorator";

DomHandler.addCssToDocument(require('./LayoutPanel.css'));

export enum SizingModes {
    LeftFixed = 0,
    RightFixed = 1,
    Left2Right10 = 2,
    Left3Right9 = 3,
    Left6Right6 = 4,
    Right2Left10 = 5,
}
export class LayoutPanel extends Control<LayoutPanel> {


    @Ref()
    public  RightPaneElementRef: HTMLElement;

    @Ref()
    private LeftPaneElementRef: HTMLElement;

    public get SizingMode(): SizingModes {
        return this.GetProperty('SizingMode');
    }
    public set SizingMode(value: SizingModes) {
        this.SetProperty('SizingMode', value);
    }

    public get LeftSize(): int {
        return this.GetProperty('LeftSize');
    }
    public set LeftSize(value: int) {
        this.SetProperty('LeftSize', value);
    }

    public get LeftControl(): Control<any> {
        return this.GetProperty('LeftControl');
    }
    public set LeftControl(value: Control<any>) {
        this.SetProperty('LeftControl', value);
        value.Parent = this;
    }
    public get RightControl(): Control<any> {
        return this.GetProperty('RightControl');
    }
    public set RightControl(value: Control<any>) {
        this.SetProperty('RightControl', value);
        value.Parent = this;
    }

    public SetupControlDefaults() {
        super.SetupControlDefaults();
        this.SizingMode = SizingModes.LeftFixed;
        this.LeftSize = 300;
    }

    public componentDidMount() {
        if (this.LeftControl != null) {
            //const sensor = new ResizeSensor(this.LeftControl, (size) => {
            //   console.log(this.GetLeftPanelRect());
            /* function getOffset( el ) {
                var _x = 0;
                var _y = 0;
                while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
                    _x += el.offsetLeft - el.scrollLeft;
                    _y += el.offsetTop - el.scrollTop;
                    el = el.offsetParent;
                }
                return { top: _y, left: _x };
            }
            var x = getOffset(this.rightPaneElement ).left; */

            // console.log(size);
            //console.log(getWindowRelativeOffset( this.rightPaneElement.parentElement,this.rightPaneElement));
            //  });
        }
    }
    private GetLeftControl(): any {
        const vNodes: any[] = [];
        if (this.LeftControl != null) {
            vNodes.push((this.LeftControl as any).CreateMainElement());
        }
        return vNodes;
    }
    private GetRightControl(): any {
        const vNodes: any[] = [];
        if (this.RightControl != null) {
            vNodes.push((this.RightControl as any).CreateMainElement());
        }
        return vNodes;
    }
    public CreateElements(): any {
        if (!this.Visible) {
            return;
        }
        if (this.SizingMode === SizingModes.LeftFixed) {
            return (
                <div class='tuval-layout-panel' style={this.GetStyleObject()}>
                    <div className="p-grid" style={{ flexWrap: 'nowrap' }}>
                        {/*  <div className="p-col-4"> */}
                        <div className="p-col-fixed" style={{ width: this.LeftSize + 'px' }}>
                            {this.GetLeftControl()}
                        </div>
                        <div className="p-col" ref={(e) => this.RightPaneElementRef = e}>
                            {this.GetRightControl()}
                        </div>
                    </div>
                </div>
            );
        } else if (this.SizingMode === SizingModes.RightFixed) {
            return (
                <div class='tuval-layout-panel' style={this.GetStyleObject()}>
                    <div className="p-grid" style={{ flexWrap: 'nowrap' }}>
                        <div className="p-col" ref={(e) => this.LeftPaneElementRef = e} style={{ overflow: 'hidden', width: '0px' }}>
                            {this.GetLeftControl()}
                        </div>
                        <div className="p-col-fixed" ref={(e) => this.RightPaneElementRef = e} style={{ width: this.LeftSize + 'px' }}>
                            {this.GetRightControl()}
                        </div>

                    </div>
                </div>
            );
        } else if (this.SizingMode === SizingModes.Left2Right10) {
            return (
                <div class='tuval-layout-panel' style={this.GetStyleObject()}>
                    <div className="p-grid" style={{ flexWrap: 'nowrap' }}>
                        {/*  <div className="p-col-4"> */}
                        <div className="p-col-2">
                            {this.GetLeftControl()}
                        </div>
                        <div className="p-col-10">
                            {this.GetRightControl()}
                        </div>
                    </div>
                </div>
            );
        } else if (this.SizingMode === SizingModes.Left3Right9) {
            return (
                <div class='tuval-layout-panel' style={this.GetStyleObject()}>
                    <div className="p-grid" style={{ flexWrap: 'nowrap' }}>
                        {/*  <div className="p-col-4"> */}
                        <div className="p-col-3">
                            {this.GetLeftControl()}
                        </div>
                        <div className="p-col-9">
                            {this.GetRightControl()}
                        </div>
                    </div>
                </div>
            );
        }
    }

    public OnFormResized(width: int, height: int) {
        this.LeftControl?.OnFormResized(width, height);
        this.RightControl?.OnFormResized(width, height);
    }

    public GetLeftPanelRect(): DOMRect {
        if (this.LeftPaneElementRef != null) {
            return this.LeftPaneElementRef.getBoundingClientRect();
        }
    }

}