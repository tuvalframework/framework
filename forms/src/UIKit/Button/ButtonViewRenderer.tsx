import { StringBuilder, foreach } from '@tuval/core';

import { ControlHtmlRenderer } from '../../windows/Forms/Components/AAA/HtmlRenderer/ControlHtmlRenderer';
import { Teact } from '../../windows/Forms/Components/Teact';
import { Button } from '../Components/button/Button';
import { getView } from '../getView';
import { IRenderable } from '../IView';
import { UIController } from '../UIController';
import { ButtonView } from './ButtonView';
import { classNames } from '../Components/utils/ClassNames';
import { jss } from '../../jss/jss';
import React, { createElement, Fragment } from "../../preact/compat";
import { Message } from '../../windows/Forms/Components/AAA/Message';
import { Msg } from '../../windows/Forms/Components/AAA/Msg';


class MyComponent extends React.Component {

    get jssStyle(): any {
        return this.state.jssStyle;
    }

    set jssStyle(value: any) {
        this.setState({
            'jssStyle': value
        });
    }

    protected componentWillMount() {
        const className = `button-view`;

        /*   Appearance: AppearanceObject;
          HoverAppearance: AppearanceObject;
          ActiveAppearance: AppearanceObject;
          DisabledAppearance:AppearanceObject;
          FocusAppearance: AppearanceObject;
          BeforeAppearance:AppearanceObject; */

        const Appearance = this.props.control.Appearance.GetStyleObject();
        for (const [key, value] of Object.entries(Appearance)) {
            Appearance[key] = `${value} !important`
        }

        const HoverAppearance = this.props.control.HoverAppearance.GetStyleObject();
        for (const [key, value] of Object.entries(HoverAppearance)) {
            HoverAppearance[key] = `${value} !important`
        }


        const styles = {
            [className]: control => ({
                ...Appearance,
                '&:hover': { ...HoverAppearance },
                '& .e-ddl.e-input-group input.e-input::placeholder': {
                    color: '#C0C0C0',
                    fontSize: '1rem'
                },
                '.e-dropdownbase .e-list-item, .e-dropdownbase .e-list-item': {
                    //padding: '5px'
                },
                '&:focus': {
                    ...this.props.control.FocusAppearance.GetStyleObject()
                }
            }),

        }

        const jssStyle = jss.createStyleSheet(styles, { link: true }).attach();
        //  this.props.elementProps['className'] = jssStyle.classes[className];
        this.jssStyle = jssStyle;
    }

    protected componentWillUnmount(obj: ButtonView) {
        this.jssStyle.detach();
        jss.removeStyleSheet(this.jssStyle);
    }

    public render() {
        const _className = `button-view`;
        this.jssStyle?.update(this.props.control);

        const children = this.props.children;

        let className = this.props.className;

        if (this.jssStyle) {
            className = this.jssStyle.classes[_className] + ' ' + this.props.className;
        }

        delete this.props['className'];
        delete this.props['control'];
        delete this.props['children'];

        return (
            <Button {...this.props} className={className}>
                {children}
            </Button>
        )
    }
}

export class ButtonViewRenderer extends ControlHtmlRenderer<ButtonView> {
    public get UseFrameStyles(): boolean {
        return false;
    }



    /* public OnStyleCreating(obj: ButtonView, sb: StringBuilder): void {
        sb.AppendLine(require('../Components/common.css'));
        sb.AppendLine(require('../Components/button/Button.css'));
        sb.AppendLine(require('./Theme.css'));
        sb.AppendLine(`

        .pi {
            font-family: primeicons;
            speak: none;
            font-style: normal;
            font-weight: 400;
            font-feature-settings: normal;
            font-variant: normal;
            text-transform: none;
            line-height: 1;
            display: inline-block;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale
        }

        .pi:before {
            --webkit-backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
            backface-visibility: hidden
        }

        .pi-spinner:before {
            content: "\\e926"
        }

        .pi-spin {
            -webkit-animation: fa-spin 2s linear infinite;
            animation: fa-spin 2s linear infinite
        }

        @-webkit-keyframes fa-spin {
            0% {
                transform: rotate(0deg)
            }
            to {
                transform: rotate(359deg)
            }
        }

        @keyframes fa-spin {
            0% {
                transform: rotate(0deg)
            }
            to {
                transform: rotate(359deg)
            }
        }

`)
    } */

    public GenerateElement(obj: ButtonView): boolean {
        this.WriteStartFragment();
        return true;
    }
    public GenerateBody(obj: ButtonView): void {



        const className = classNames({
            'p-button-secondary': obj.vp_Color === 'secondary',
            'p-button-success': obj.vp_Color === 'success',
            'p-button-danger': obj.vp_Color === 'danger',
            'p-button-outlined': obj.vp_Variant === 'outlined',
        })

        this.WriteComponent(
            <MyComponent
                label=""
                control={obj}
                className={className}
                disabled={obj.vp_Disabled}
                loading={obj.vp_Loading}
                onClick={(e) => obj.WndProc(Message.Create(Msg.WM_CLICK, e, e))}
                style={{ display: 'flex', justifyContent: 'center' }}>

                <div style={{ marginLeft: '5px' }} >
                    {this.CreateControls(obj)}
                </div>

            </MyComponent >
        );
    }
    protected CreateControls(obj: ButtonView): any[] {
        const vNodes: any[] = [];
        if (obj.Controls != null) {
            foreach(obj.Controls, (control) => {
                vNodes.push(control.CreateMainElement());
            });
        }
        if (obj.GetViews != null) {
            let viewCount = obj.GetViews().length;
            let index = 0;
            foreach(obj.GetViews(), (root: IRenderable) => {
                const view = getView(obj instanceof UIController ? obj : (obj as any).controller, root);

                if (view != null) {
                    vNodes.push(view.Render());
                }
                index++;
            });
        }
        return vNodes;
    }
}