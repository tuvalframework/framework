import React, { createElement, Fragment } from "../../../../../preact/compat";
import { Teact } from '../../Teact';
import { is, Delegate, Event } from '@tuval/core';
import { Control } from "../Control";
import { DomHandler } from "../../DomHandler";
import { ButtonComponent } from "../../button/TuButtonElement";
import { TaskManager } from "../TaskManager";
import { TApplication } from "../TApplication";

export class TaskbarPanel extends Control<TaskbarPanel> {

    private m_TableRef: HTMLElement = null as any;
   /*  public constructor(props) {
        super(props);
        this.Visible = true;
    } */

    public componentDidMount(): void {

    }

    private toggleMinimized(app:TApplication): void {
        (app as any).MainForm.Minimized = !(app as any).MainForm.Minimized;
    }
    public renderRunningApps(): any[] {
        return TaskManager.GetApplications().map(app => {
           /*  const style = {};
            style['backgroundImage'] = app.Icon; */
            let image;
            if (!is.nullOrEmpty(app.Icon)) {
                image = <img style={{ width: '32px', height: '32px' }} src={app.Icon}></img>
            }
            return (
                <button className='x-tool-panel-button' onClick={e => this.toggleMinimized(app)}>
                    {image}
                </button>);
        });
    }

    public CreateElements(): any {
        return (
            <div style='float:left;'>
                {this.renderRunningApps()}
            </div>
        );
    }
}