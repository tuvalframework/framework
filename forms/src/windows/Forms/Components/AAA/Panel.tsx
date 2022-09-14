import { ButtonComponent } from "../button/TuButtonElement";
import React, { createElement, Fragment } from "../../../../preact/compat";
import { Teact } from '../Teact';
import { is, Delegate, Event, List, int, foreach, ClassInfo, typeOf, StringBuilder } from '@tuval/core';
import { Control, Modes, RendererTable } from "./Control";
import { ControlCollection } from "./ControlCollection";
import { PanelComponent } from '../panel/Panel';
import { Padding } from "../../Padding";
import { DomHandler } from "../DomHandler";
import { Margin, MarginApplies } from "../../Margin";
import { Property } from "./Reflection/PropertyDecorator";
import { PanelRenderer } from "./PanelRenderer";
import { EventArgs } from "../Delegates";
import { ControlTypes } from "../ControlTypes";
import { ControlHtmlRenderer } from "./HTMLRenderer";
import { IControl } from "./IControl";
import { IRenderable } from '../../../../UIKit/IView';
import { Ripple } from "../ripple/Ripple";
import { getView } from "../../../../UIKit/getView";
import { UIController } from "../../../../UIKit/UIController";

DomHandler.addCssToDocument(require('./Panel.css'));

@ClassInfo({
    fullName: ControlTypes.Panel,
    instanceof: [
        ControlTypes.Panel,
    ]
})
export class Panel extends Control<Panel> {
    public Controls: ControlCollection;

    public constructor() {
        super();
        //super.SetupControlDefaults();
        this.Controls = new ControlCollection(this);
        this.Margin = Margin.CreateEmpty();
    }

    /*  protected GetRenderer(): HTMLRenderer<Panel> {
         return PanelRenderer as any;
     } */

    protected OnMouseMove(e: EventArgs): void {
        // console.log('mouse over');
    }

}

export class TControlContainer extends Control<Panel> {
    public Controls: ControlCollection;

    public constructor() {
        super();
        this.Controls = new ControlCollection(this);
    }

    protected GetRenderer(): any {
        return class ContainerControlRenderer extends ControlHtmlRenderer<TControlContainer> {
            public get UseShadowDom(): boolean {
                return true;
            }

            public GenerateBody(obj: TControlContainer): void {
                if (!obj.Visible) {
                    return;
                }

                this.WriteComponent(this.CreateControls(obj));
            }
            private CreateControls(obj: TControlContainer): any[] {
                const vNodes: any[] = [];
                foreach(obj.Controls, (control) => {
                    vNodes.push(control.CreateMainElement());
                });
                return vNodes;
            }
        }
    }

    protected OnMouseMove(e: EventArgs): void {
        //console.log('mouse over');
    }

}

export interface IVirtualContainer extends IControl {
    Controls: ControlCollection;
    GetViews(): IRenderable[];
}
export class TVirtualContainer extends Control<Panel> implements IVirtualContainer {
    public Controls: ControlCollection;
    public GetViews(): IRenderable[]{
        return [];
    }

    public constructor() {
        super();
        this.Controls = new ControlCollection(this);
        this.Appearance.Display = 'flex';
        /*this.Appearance.AlignItems = 'center'; */
    }

    protected GetRenderer(): any {
        return TContainerControlRenderer;
    }

    protected OnMouseMove(e: EventArgs): void {
        //console.log('mouse over');
    }
}

export class TContainerControlRenderer extends ControlHtmlRenderer<IVirtualContainer> {
    public ChildrenCreating: Event<any> = new Event();
  /*   public get UseShadowDom(): boolean {
        return true;
    } */
    public OnStyleCreating(obj: IVirtualContainer, sb: StringBuilder): void {
        sb.AppendLine(`
        /* total width */
        :host::-webkit-scrollbar {
            display: block;
            background-color: rgb(255,255,255,0%);
            width: 10px;
        }

        :host(:hover)::-webkit-scrollbar {
            width: 10px;
        }

        /* background of the scrollbar except button or resizer */
        :host::-webkit-scrollbar-track {
            background-color: rgb(255,255,255,0%);
        }

        /* scrollbar itself */
        :host::-webkit-scrollbar-thumb {
            border-radius: 16px;
            border: 0px solid #fff;
        }

        :host(:hover)::-webkit-scrollbar-thumb {
            background-color: #babac0;
        }

        /* set button(top and bottom of the scrollbar) */
        :host::-webkit-scrollbar-button {
            display:none;
        }

         .right {
            white-space:nowrap;
            top:50%;
            left:100%;
            margin-left:20px;
            transform:translate(0, -50%);
            padding:5px;
            color:#EEEEEE;
            background-color:#000000;
            font-weight:normal;
            font-size:13px;
            border-radius:8px;
            position:absolute;
            z-index:99999999;
            box-sizing:border-box;
            border:1px solid #000000;box-shadow:0 1px 8px rgba(0,0,0,0.5);
            visibility:hidden; opacity:0; transition:opacity 0.8s;
        }

        :host(:hover) .right {
            visibility:visible;
            opacity:1;
            transition: opacity  0s linear 3s;
        }

        :host(:active) .right {
            visibility:hidden;
        }

       .right i {
            position:absolute;
            top:50%;
            right:100%;
            margin-top:-12px;
            width:12px;
            height:24px;
            overflow:hidden;
        }

         .right i::after {
            content:'';
            position:absolute;
            width:12px;
            height:12px;
            left:0;
            top:50%;
            transform:translate(50%,-50%) rotate(-45deg);
            background-color:#000000;
            border:1px solid #000000;box-shadow:0 1px 8px rgba(0,0,0,0.5);
        }


.top {
    min-width:200px;
    top:-20px;
    left:50%;
    transform:translate(-50%, -100%);
    padding:10px 20px;
    color:#EEEEEE;
    background-color:#000000;
    font-weight:normal;
    font-size:13px;
    border-radius:8px;
    position:absolute;
    z-index:99999999;
    box-sizing:border-box;
    border:1px solid #000000;box-shadow:0 1px 8px rgba(0,0,0,0.5);
    visibility:hidden; opacity:0; transition:opacity 0.8s;
}

:host(:hover) .top {
    visibility:visible; opacity:1;
}

 .top i {
    position:absolute;
    top:100%;
    left:50%;
    margin-left:-12px;
    width:24px;
    height:12px;
    overflow:hidden;
}

 .top i::after {
    content:'';
    position:absolute;
    width:12px;
    height:12px;
    left:50%;
    transform:translate(-50%,-50%) rotate(45deg);
    background-color:#000000;
    border:1px solid #000000;box-shadow:0 1px 8px rgba(0,0,0,0.5);
}


 .bottom {
    min-width:200px;
    top:40px;
    left:50%;
    transform:translate(-50%, 0);
    padding:10px 20px;
    color:#EEEEEE;
    background-color:#000000;
    font-weight:normal;
    font-size:13px;
    border-radius:8px;
    position:absolute;
    z-index:99999999;
    box-sizing:border-box;
    border:1px solid #000000;box-shadow:0 1px 8px rgba(0,0,0,0.5);
    visibility:hidden; opacity:0; transition:opacity 0.8s;
}

:host(:hover) .bottom {
    visibility:visible; opacity:1;
}

 .bottom i {
    position:absolute;
    bottom:100%;
    left:50%;
    margin-left:-12px;
    width:24px;
    height:12px;
    overflow:hidden;
}

 .bottom i::after {
    content:'';
    position:absolute;
    width:12px;
    height:12px;
    left:50%;
    transform:translate(-50%,50%) rotate(45deg);
    background-color:#000000;
    border:1px solid #000000;box-shadow:0 1px 8px rgba(0,0,0,0.5);
}


 .left {
    min-width:200px;
    top:50%;
    right:100%;
    margin-right:20px;
    transform:translate(0, -50%);
    padding:10px 20px;
    color:#EEEEEE;
    background-color:#000000;
    font-weight:normal;
    font-size:13px;
    border-radius:8px;
    position:absolute;
    z-index:99999999;
    box-sizing:border-box;
    border:1px solid #000000;box-shadow:0 1px 8px rgba(0,0,0,0.5);
    visibility:hidden; opacity:0; transition:opacity 0.8s;
}

:host(:hover) .left {
    visibility:visible; opacity:1;
}

.left i {
    position:absolute;
    top:50%;
    left:100%;
    margin-top:-12px;
    width:12px;
    height:24px;
    overflow:hidden;
}

.left i::after {
    content:'';
    position:absolute;
    width:12px;
    height:12px;
    left:0;
    top:50%;
    transform:translate(-50%,-50%) rotate(-45deg);
    background-color:#000000;
    border:1px solid #000000;box-shadow:0 1px 8px rgba(0,0,0,0.5);
}
        `);
    }

    public GenerateElement(obj: IVirtualContainer): boolean {
        this.WriteStartFragment();
        return true;
    }
    public GenerateBody(obj: IVirtualContainer): void {
        if (!obj.Visible) {
            return;
        }

        this.WriteComponent(this.CreateControls(obj));
       // this.WriteComponent(<Ripple />);

        if (obj.Tooltip != null) {
            this.WriteComponent(
                <div class="right">
                    {obj.Tooltip}
                    <i></i>
                </div>
            );
        }

    }
    protected CreateControls(obj: IVirtualContainer): any[] {
        const vNodes: any[] = [];
        if (obj.Controls != null) {
            foreach(obj.Controls, (control) => {
                vNodes.push(control.CreateMainElement());
            });
        }
        if (obj.GetViews != null) {
            foreach(obj.GetViews(), (root: IRenderable) => {
                const view = getView(obj instanceof UIController ? obj : (obj as any).controller, root);
                if (view != null) {
                    vNodes.push(view.Render());
                }
            });
        }

        this.ChildrenCreating(vNodes);
        return vNodes;
    }

}

export class TFlexContainer extends TVirtualContainer {
    public constructor() {
        super();
        this.Appearance.Display = 'flex';
    }
}
export class TFlexColumnContainer extends TVirtualContainer {
    public constructor() {
        super();
        this.Appearance.FlexDirection = 'column';
    }
}

export class TFlexRowContainer extends TVirtualContainer {
    public constructor() {
        super();
        this.Appearance.FlexDirection = 'row';
    }
}



RendererTable.Add(typeOf(ControlTypes.Panel), PanelRenderer);

export class ContainerPanel extends Control<ContainerPanel> {
    public get Controls(): ControlCollection {
        return this.GetProperty('Controls');
    }

    public set Controls(value: ControlCollection) {
        this.SetProperty('Controls', value);
    }

    protected SetupControlDefaults(): void {
        super.SetupControlDefaults();
        this.Controls = new ControlCollection(this);
    }
    public InitComponents() {

    }

    /* protected GetRenderer(): HTMLRenderer<Panel> {
       return PanelRenderer as any;
    } */

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
        return (
            <div className='tuval-container'>
                {this.CreateControls()}
            </div>
        );
    }

}