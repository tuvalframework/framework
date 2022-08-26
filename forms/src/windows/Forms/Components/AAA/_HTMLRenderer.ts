import { Msg } from './Msg';
import { TString } from "@tuval/core";
import React, { createElement, Fragment } from "../../../../preact/compat";
import { Border, BorderApplies } from "../../Border";
import { Margin, MarginApplies } from "../../Margin";
import { Padding, PaddingApplies } from "../../Padding";
import { Control, TComponent } from "./Control";
import { Message } from "./Message";
export abstract class _HTMLRenderer<T extends Control> extends React.Component {
    protected Ref;
    protected Control: T;
    public constructor(props: any) {
        super(props);
        this.Control = props.control;
        this.Control.PropertyChanged.add(propertyName => {
            console.log(propertyName, ' changed');
            this.forceUpdate();
        });
    }
    //Lifecycle methods
    protected componentWillMount(): void {

    }
    protected componentDidMount(): void {

    }
    protected componentWillReceiveProps(): void {

    }
    protected shouldComponentUpdate(nextProps: any, nextState: any): boolean {
        return true;
    }
    protected componentWillUpdate(): void {

    }
    protected componentDidUpdate(prevProps, prevState): void {

    }
    protected componentWillUnmount(): void {

    }

    protected GetStyleObject(): any {
        const style = {};
        if (this.Control.Width) {
            style['width'] = this.Control.Width + 'px';
        }
        if (this.Control.Height) {
            style['height'] = this.Control.Height + 'px';
        }

        if (this.Control.BackgroundColor) {
            style['background'] = this.Control.BackgroundColor;
        }

        if (this.Control.Padding !== Padding.Empty) {
            if (this.Control.Padding.Applies & PaddingApplies.Left) {
                style['paddingLeft'] = this.Control.Padding.Left + 'px';
            }
            if (this.Control.Padding.Applies & PaddingApplies.Right) {
                style['paddingRight'] = this.Control.Padding.Right + 'px';
            }
            if (this.Control.Padding.Applies & PaddingApplies.Top) {
                style['paddingTop'] = this.Control.Padding.Top + 'px';
            }
            if (this.Control.Padding.Applies & PaddingApplies.Bottom) {
                style['paddingBottom'] = this.Control.Padding.Bottom + 'px';
            }
        }
        if (this.Control.Border !== Border.Empty) {
            if (this.Control.Border.Applies & BorderApplies.Left) {
                style['borderLeft'] = TString.Format('solid {0}px {1}', 1, this.Control.Border.LeftBorderColor);
            }
            if (this.Control.Border.Applies & BorderApplies.Right) {
                style['borderRight'] = TString.Format('solid {0}px {1}', 1, this.Control.Border.RightBorderColor);
            }
            if (this.Control.Border.Applies & BorderApplies.Top) {
                style['borderTop'] = TString.Format('solid {0}px {1}', 1, this.Control.Border.TopBorderColor);
            }
            if (this.Control.Border.Applies & BorderApplies.Bottom) {
                style['borderBottom'] = TString.Format('solid {0}px {1}', 1, this.Control.Border.BottomBorderColor);
            }
        }

        if (this.Control.Margin !== Margin.Empty) {
            if (this.Control.Margin.Applies & MarginApplies.Left) {
                style['marginLeft'] = this.Control.Margin.Left + 'px';
            }
            if (this.Control.Margin.Applies & MarginApplies.Right) {
                style['marginRight'] = this.Control.Margin.Right + 'px';
            }
            if (this.Control.Margin.Applies & MarginApplies.Top) {
                style['marginTop'] = this.Control.Margin.Top + 'px';
            }
            if (this.Control.Margin.Applies & MarginApplies.Bottom) {
                style['marginBottom'] = this.Control.Margin.Bottom + 'px';
            }
        }

        return style;
    }

    public abstract Render(param: any);
    public render(param: any) {
        return React.createElement(`tvl-control-${this.Control.constructor.name}`, {
            onmouseover: (e) => this.Control.WndProc(Message.Create(Msg.WM_MOUSEHOVER, e, e)),
            onmousemove: (e) => this.Control.WndProc(Message.Create(Msg.WM_MOUSEMOVE, e, e)),
        }, this.Render(this.props.__param__));
    }
}