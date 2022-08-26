import React, { createElement, Fragment } from "../../../../preact/compat";
import { Teact } from '../Teact';
import { is, Delegate, Event } from '@tuval/core';
import { InputText } from "../inputtext/TuInputText";
import { Control } from './Control';

export class TCanvas extends Control<TCanvas> {

    public CreateElements(): any {
        return (
                <canvas id='TGI' className="box box-stretched" style={{ width:'100%', height: '300px'}}></canvas>
        );
    }

}