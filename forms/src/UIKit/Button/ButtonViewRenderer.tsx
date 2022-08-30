import { StringBuilder, foreach } from '@tuval/core';

import { ControlHtmlRenderer } from '../../windows/Forms/Components/AAA/HtmlRenderer/ControlHtmlRenderer';
import { Teact } from '../../windows/Forms/Components/Teact';
import { Button } from '../Components/button/Button';
import { getView } from '../getView';
import { IRenderable } from '../IView';
import { UIController } from '../UIController';
import { ButtonView } from './ButtonView';
import { classNames } from '../Components/utils/ClassNames';


export class ButtonViewRenderer extends ControlHtmlRenderer<ButtonView> {
    public get UseShadowDom(): boolean {
        return true;
    }

    public OnStyleCreating(obj: ButtonView, sb: StringBuilder): void {
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
    }

    public GenerateElement(obj: ButtonView): boolean {
        this.WriteStartFragment();
        return true;
    }
    public GenerateBody(obj: ButtonView): void {

        const className = classNames({
            'p-button-secondary': obj.vp_Color === 'secondary',
            'p-button-danger': obj.vp_Color === 'danger',
        })
        this.WriteComponent(
            <Button className={className} disabled={obj.vp_Disabled} loading={obj.vp_Loading} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <div style={{ marginLeft: '5px' }} >
                    {this.CreateControls(obj)}
                </div>

            </Button >
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