import { foreach, int, is } from "@tuval/core";
import React from "react";
import { AlignmentType, cBottom, cBottomLeading, cBottomTrailing, cCenter, cLeading, cTop, cTopLeading, cTopTrailing, cTrailing } from "../../Constants";
import { UIController } from "../../UIController";
import { UIViewClass } from "../../components/UIView/UIViewClass";
import UIViewRenderer from "../../components/UIView/UIViewRenderer";
import { ViewProperty } from "../../components/UIView/ViewProperty";
import VStackRenderer from "./ZStackRenderer";
import ZStackRenderer from "./ZStackRenderer";

export class ZStackClass extends UIViewClass {

    /** @internal */
    @ViewProperty() vp_Spacing: string;

    /** @internal */
    @ViewProperty() vp_Alignment: string;

     /** @internal */
     @ViewProperty() vp_Chidren: UIViewClass[];

     public children(...value:UIViewClass[]) {
        this.vp_Chidren = value;
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
    public render() {
        return (<UIViewRenderer wrap={true}  control = {this} renderer={ZStackRenderer}></UIViewRenderer>)
    }
}