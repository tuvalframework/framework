import { foreach, int, is } from "@tuval/core";
import React, { ReactNode } from "react";
import { AlignmentType, cBottom, cBottomLeading, cBottomTrailing, cCenter, cLeading, cTop, cTopLeading, cTopTrailing, cTrailing } from "../../Constants";
import { UIController } from "../../UIController";
import { UIView } from "../../components/UIView/UIView";
import { UIViewRenderer } from "../../components/UIView/UIViewRenderer";
import { ViewProperty } from "../../components/UIView/ViewProperty";
import VStackRenderer from "./VStackRenderer";
import { TooltipPositions } from "../../components/Tooltip/TooltipClass";
import { KeyFrameCollection } from "../../components/UIView/KeyFrameCollection";

export class VStackClass extends UIView {

    /** @internal */
    @ViewProperty() vp_TooltipPosition: TooltipPositions;
    public tooltipPosition(value: TooltipPositions) {
        this.vp_TooltipPosition = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_Spacing: string;

    /** @internal */
    @ViewProperty() vp_Alignment: string;

    /** @internal */
    @ViewProperty() vp_Chidren: (UIView | ReactNode)[];

    public children(...value: (UIView | ReactNode)[]) {
        this.vp_Chidren = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_DragableItems: boolean;

    public dragableItems(value: boolean) {
        this.vp_DragableItems = value;
        return this;
    }

    public constructor() {
        super();
        this.Appearance.FlexDirection = 'column';

        this.Appearance.Display = 'flex';
        this.Appearance.Width = '100%';
        this.Appearance.Height = '100%';
        this.Appearance.AlignContent = 'center';
        this.Appearance.JustifyContent = 'center';

        this.Appearance.AlignItems = 'center';
        this.Appearance.JustifyItems = 'center';

        this.vp_TooltipPosition = TooltipPositions.BOTTOM;
        // this.Appearance.Transition = '200ms cubic-bezier(0, 0, 0.2, 1) 0ms';
    }


    /** @internal */
    spacing(value: int): this;
    /** @internal */
    spacing(value: string): this;
    /** @internal */
    spacing(...args: any[]): this {
        if (args.length === 1 && is.string(args[0])) {
            const value: string = args[0];
            this.vp_Spacing = value;
            /*  let lastView = null;
             if (this.SubViews.Count > 0)
                 lastView = this.SubViews[this.SubViews.Count - 1];
             foreach(this.SubViews, (view) => {
                 if (view.Appearance != null && view !== lastView) {
                     view.Appearance.MarginBottom = value;
                 }
             }); */
            return this;
        } else if (args.length === 1 && is.int(args[0])) {
            const value: int = args[0];
            this.vp_Spacing = `${value}px`;
            /*  let lastView = null;
             if (this.SubViews.Count > 0)
                 lastView = this.SubViews[this.SubViews.Count - 1];
             foreach(this.SubViews, (view) => {
                 if (view.Appearance != null && view !== lastView) {
                     view.Appearance.MarginBottom = `${value}px`;
                 }
             }); */
            return this;
        }
        return this;
        /*  throw 'ArgumentOutOfRange Exception in VStack::spacing' */
    }

    /** @internal */
    alignment(value: AlignmentType) {
        if (value == null) {
            return this;
        }

        this.vp_Alignment = value;

        if (value === cTopLeading) {
            this.Appearance.JustifyContent = 'start';
            this.Appearance.AlignContent = 'start';

            this.Appearance.JustifyItems = 'start';
            this.Appearance.AlignItems = 'start';

        } else if (value === cTop) {
            this.Appearance.JustifyContent = 'start';
            this.Appearance.AlignContent = 'center';

            this.Appearance.JustifyItems = 'start';
            this.Appearance.AlignItems = 'center';
        } else if (value === cTopTrailing) {
            this.Appearance.JustifyContent = 'end';
            this.Appearance.AlignContent = 'start';

            this.Appearance.AlignItems = 'end';
            this.Appearance.JustifyItems = 'start';


        } else if (value === cLeading) {
            this.Appearance.JustifyContent = 'center';
            this.Appearance.AlignContent = 'center';

            this.Appearance.AlignItems = 'start';
            this.Appearance.JustifyItems = 'start';
        } else if (value === cCenter) {
            this.Appearance.JustifyContent = 'center';
            this.Appearance.AlignContent = 'center';

            this.Appearance.AlignItems = 'center';
            this.Appearance.JustifyItems = 'center';

        } else if (value === cTrailing) {
            this.Appearance.JustifyContent = 'end';
            this.Appearance.AlignContent = 'center';

            this.Appearance.AlignItems = 'end';
            this.Appearance.JustifyItems = 'center';
        } else if (value === cBottomLeading) {
            this.Appearance.JustifyContent = 'start';
            this.Appearance.AlignContent = 'end';

            this.Appearance.AlignItems = 'start';
            this.Appearance.JustifyItems = 'end';
        } else if (value === cBottom) {
            this.Appearance.JustifyContent = 'center';
            this.Appearance.AlignContent = 'end';

            this.Appearance.AlignItems = 'center';
            this.Appearance.JustifyItems = 'end';
        } else if (value === cBottomTrailing) {
            this.Appearance.JustifyContent = 'end';
            this.Appearance.AlignContent = 'end';

            this.Appearance.AlignItems = 'end';
            this.Appearance.JustifyItems = 'end';
        }
        return this;
    }

    public animation(value: KeyFrameCollection, time: string): this {
        this.KeyFrameCollection.push(value);

        // Set animation
        foreach(this.vp_Chidren as any, (view: UIView) => {
            view.Appearance.Animation = `${value.Name} ${time}`
        })
        return this;
    }

    /** @internal */
    @ViewProperty() vp_Draggable: boolean;
    public draggable(value: boolean) {
        this.vp_Draggable = value;
        return this;
    }

    public render() {
        if (this.vp_Visible) {
            return (<VStackRenderer control={this} ></VStackRenderer>)
        }
    }
}