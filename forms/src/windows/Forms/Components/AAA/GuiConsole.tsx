import React, { createElement, Fragment } from "../../../../preact/compat";
import { Teact } from '../Teact';
import { TextConsole, Delegate, Event } from '@tuval/core';
import { InputText } from "../inputtext/TuInputText";
import { Control } from './Control';
import { DomHandler } from '../DomHandler';
import { GuiConsole as GC } from '@tuval/graphics';
import { ConsoleReady } from "./Terminal";


export class GuiConsole extends Control<GuiConsole> {
    private el: HTMLElement = null as any;

    public get OnConsoleReady(): Event<ConsoleReady> {
        return this.GetProperty('OnConsoleReady');
    }
    public set OnConsoleReady(value: Event<ConsoleReady>) {
        this.SetProperty('OnConsoleReady', value);
    }
    public get Console(): GC<any> {
        return this.GetProperty('Console');
    }
    public set Console(value: GC<any>) {
        this.SetProperty('Console', value);
    }

    public get Label(): string {
        return this.GetProperty('Label');
    }
    public set Label(value: string) {
        this.SetProperty('Label', value);
    }


    protected SetupControlDefaults(): void {
        super.SetupControlDefaults();
        this.OnConsoleReady = new Event();
    }

    public componentDidMount() {
        if (this.el != null) {
            const width = DomHandler.getClientWidth(this.el);
            const height = DomHandler.getClientHeight(this.el);
            const console = new GC({
                width: width,
                height: height,
                fullscreen: false,
                parent: this.el
            });
            this.OnConsoleReady(console);
            console.Run();
        }
    }
    public CreateElements(): any {
        return (
            <div ref={(el) => this.el = el} tabindex="0" className="tuval-gui-console" style={{ width: '100%', height: '100%' }}></div>
        );
    }
}