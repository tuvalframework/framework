import { foreach, int, is } from "@tuval/core";
import React from "react";
import { AlignmentType, cBottom, cBottomLeading, cBottomTrailing, cCenter, cLeading, cTop, cTopLeading, cTopTrailing, cTrailing } from "../../Constants";
import { UIController } from "../../UIController";
import { UIView } from "../../components/UIView/UIView";
import UIViewRenderer from "../../components/UIView/UIViewRenderer";
import { ViewProperty } from "../../components/UIView/ViewProperty";
import HStackRenderer from "./HStackRenderer";

export class HStackClass extends UIView {

    /** @internal */
    @ViewProperty() vp_Spacing: string;

    /** @internal */
    @ViewProperty() vp_Alignment: string;

    /** @internal */
    @ViewProperty() vp_Chidren: UIView[];

    public children(...value: UIView[]) {
        this.vp_Chidren = value;
        return this;
    }

    public constructor() {
        super();
        this.Appearance.FlexDirection = 'row';

        this.Appearance.Display = 'flex';
        this.Appearance.Width = '100%';
        this.Appearance.Height = '100%';
        this.Appearance.AlignContent = 'center';
        this.Appearance.JustifyContent = 'center';

        this.Appearance.AlignItems = 'center';
        this.Appearance.JustifyItems = 'center';
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

        if (value === cTopLeading) {
            this.Appearance.JustifyContent = 'start';
            this.Appearance.AlignContent = 'start';

            this.Appearance.JustifyItems = 'start';
            this.Appearance.AlignItems = 'start';



        } else if (value === cTop) {
            this.Appearance.JustifyContent = 'center';
            this.Appearance.AlignContent = 'start';

            this.Appearance.JustifyItems = 'center';
            this.Appearance.AlignItems = 'start';


        } else if (value === cTopTrailing) {
            this.Appearance.JustifyContent = 'end';
            this.Appearance.AlignContent = 'start';

            this.Appearance.JustifyItems = 'end';
            this.Appearance.AlignItems = 'start';



        } else if (value === cLeading) {
            this.Appearance.JustifyContent = 'start';
            this.Appearance.AlignContent = 'center';

            this.Appearance.JustifyItems = 'start';
            this.Appearance.AlignItems = 'center';

        } else if (value === cCenter) {
            this.Appearance.JustifyContent = 'center';
            this.Appearance.AlignContent = 'center';

            this.Appearance.JustifyItems = 'center';
            this.Appearance.AlignItems = 'center';


        } else if (value === cTrailing) {
            this.Appearance.JustifyContent = 'end';
            this.Appearance.AlignContent = 'center';

            this.Appearance.JustifyItems = 'end';
            this.Appearance.AlignItems = 'center';

        } else if (value === cBottomLeading) {
            this.Appearance.JustifyContent = 'start';
            this.Appearance.AlignContent = 'end';

            this.Appearance.JustifyItems = 'start';
            this.Appearance.AlignItems = 'end';

        } else if (value === cBottom) {
            this.Appearance.JustifyContent = 'center';
            this.Appearance.AlignContent = 'end';

            this.Appearance.JustifyItems = 'center';
            this.Appearance.AlignItems = 'end';

        } else if (value === cBottomTrailing) {
            this.Appearance.JustifyContent = 'end';
            this.Appearance.AlignContent = 'end';

            this.Appearance.JustifyItems = 'end';
            this.Appearance.AlignItems = 'end';

        }
        return this;
    }
    public render() {
        return (<HStackRenderer control={this}></HStackRenderer>)
    }
}