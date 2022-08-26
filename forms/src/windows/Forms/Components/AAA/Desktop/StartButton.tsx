import React, { createElement, Fragment } from "../../../../../preact/compat";
import { Teact } from '../../Teact';
import { is, Delegate, Event, EventBus } from '@tuval/core';
import { Control } from "../Control";
import { DomHandler } from "../../DomHandler";

export class StartButton extends Control<StartButton> {

    private m_Status = 0;
    private m_TableRef: HTMLElement = null as any;
   /*  public constructor(props) {
        super(props);
        this.Visible = true;
    } */

    public componentDidMount(): void {

    }

    protected CreateElements(): any {
        return (
            <div id="sds-taskbar-startbutton">
                <table ref={(el) => this.m_TableRef = el} id="ext-comp-1104" cellspacing="0" class="x-btn x-btn-noicon"
                    onmouseover={(e) => DomHandler.addClass(this.m_TableRef, 'x-btn-over')}
                    onmouseout={(e) => DomHandler.removeClass(this.m_TableRef, 'x-btn-over')}
                    onmousedown={(e) => {
                        if (this.m_Status === 0) {
                            this.m_Status = 1;
                            DomHandler.addClass(this.m_TableRef, 'x-btn-pressed');
                            EventBus.Default.fire('tuval.desktop.appview', { show: true });
                        } else {
                            this.m_Status = 0;
                            DomHandler.removeClass(this.m_TableRef, 'x-btn-pressed');
                            EventBus.Default.fire('tuval.desktop.appview', { show: false });
                        }
                    }
                    }>
                    <tbody class="x-btn-small x-btn-icon-small-left">
                        <tr>
                            <td class="x-btn-tl"><i>&nbsp;</i></td>
                            <td class="x-btn-tc"></td>
                            <td class="x-btn-tr"><i>&nbsp;</i></td></tr>
                        <tr>
                            <td class="x-btn-ml"><i>&nbsp;</i>
                            </td>
                            <td class="x-btn-mc"><em class=" x-unselectable" unselectable="on">
                                <button type="button" id="ext-gen217" class=" x-btn-text" aria-label="Ana Menü" aria-describedby="ext-gen218">&nbsp;
                                    <div id="ext-gen218" class=" sds-notify-badge-num" style="opacity: 0;"></div>
                                </button>
                            </em>
                            </td>
                            <td class="x-btn-mr"><i>&nbsp;</i>
                            </td>
                        </tr>
                        <tr>
                            <td class="x-btn-bl"><i>&nbsp;</i></td>
                            <td class="x-btn-bc"></td><td class="x-btn-br"><i>&nbsp;</i>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }

}