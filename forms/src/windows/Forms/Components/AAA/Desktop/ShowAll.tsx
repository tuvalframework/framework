import React, { createElement, Fragment } from "../../../../../preact/compat";
import { Teact } from '../../Teact';
import { is, Delegate, Event } from '@tuval/core';
import { Control } from "../Control";
import { DomHandler } from "../../DomHandler";

export class ShowAll extends Control<ShowAll> {

    private m_TableRef: HTMLElement = null as any;

    public componentDidMount(): void {

    }

    public CreateElements(): any {
        return (
            <div id="sds-taskbar-showall">
                <table id="ext-comp-1041" cellspacing="0" class="x-btn x-btn-noicon">
                    <tbody class="x-btn-small x-btn-icon-small-left"><tr><td class="x-btn-tl"><i>&nbsp;</i></td>
                        <td class="x-btn-tc"></td>
                        <td class="x-btn-tr"><i>&nbsp;</i></td>
                    </tr>
                        <tr>
                            <td class="x-btn-ml"><i>&nbsp;</i></td>
                            <td class="x-btn-mc">
                                <em class=" x-unselectable" unselectable="on">
                                    <button type="button" id="ext-gen88" class="x-btn-text" aria-label="Masaüstünü Göster">&nbsp;</button>
                                </em>
                            </td>
                            <td class="x-btn-mr"><i>&nbsp;</i></td>
                        </tr>
                        <tr>
                            <td class="x-btn-bl"><i>&nbsp;</i></td>
                            <td class="x-btn-bc"></td><td class="x-btn-br"><i>&nbsp;</i></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }

}