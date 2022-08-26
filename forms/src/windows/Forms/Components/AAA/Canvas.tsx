import React, { createElement, Fragment } from "../../../../preact/compat";
import { Teact } from '../Teact';
import { ClassInfo, Umay, int, Delegate, Event } from '@tuval/core';
import { InputText } from "../inputtext/TuInputText";
import { Control, Modes } from './Control';
import { ControlTypes } from "../ControlTypes";
import {  SketchGraphics } from '@tuval/graphics';

export class PaintEventHandler extends Delegate<(g: SketchGraphics) => void> { };
/* @ClassInfo({
    fullName: ControlTypes.TextBox,
    instanceof: [
        ControlTypes.TextBox,
    ]
}) */
export class Canvas extends Control<Canvas> {
    private m_CanvasEl: HTMLCanvasElement = null as any;
    private m_Graphics: SketchGraphics = null as any;

    public get OnPaintInternal(): Function {
        return this.GetProperty('OnPaintInternal');
    }

    public set OnPaintInternal(value: Function) {
        this.SetProperty('OnPaintInternal', value);
    }

    public get PaintEvent(): Event<PaintEventHandler> {
        return this.GetProperty('PaintEvent');
    }

    public set PaintEvent(value: Event<PaintEventHandler>) {
        this.SetProperty('PaintEvent', value);
    }

    public get Graphics(): SketchGraphics {
        if (this.__Mode__ === Modes.Control && this.__m_Component__ != null) {
            return this.__m_Component__.m_Graphics;
        }
        return this.m_Graphics;
    }

    public get Umay(): Umay {
        return this.GetProperty('Umay');
    }
    public set Umay(value: Umay) {
        this.SetProperty('Umay', value);
    }

    public get ID(): string {
        return this.GetProperty('ID');
    }
    public set ID(value: string) {
        this.SetProperty('ID', value);
    }

    public SetupControlDefaults(): void {
        super.SetupControlDefaults();
        this.PaintEvent = new Event();
        this.Umay = new Umay();
        this.OnPaintInternal = (e: SketchGraphics) => {
            this.OnPaint(e);
        };




    }
    protected OnPaint(e: SketchGraphics): void {
        this.PaintEvent(e);
    }
    public componentDidMount(): void {
        if (this.m_CanvasEl != null) {

            this.m_CanvasEl.style.width = `${this.Width * 1}px`;
            this.m_CanvasEl.style.height = `${this.Height * 1}px`;
            this.m_CanvasEl.style.padding = '0';
            //canvasElement.style.margin = 'auto';
            this.m_CanvasEl.style.border = '0';
            this.m_CanvasEl.style.background = 'transparent';
            this.m_CanvasEl.width = this.Width;
            this.m_CanvasEl.height = this.Height;

            const context = this.m_CanvasEl.getContext('2d')!;
            this.m_Graphics = new SketchGraphics(context);
            this.Umay.StartLoop();
            this.Umay.Task(() => {
                // previousFps = 0;
                this.OnPaintInternal(this.m_Graphics);

                /*  for (var f = 0; f < g.Umay.tvc.fps.length; f++) {
                     previousFps += g.Umay.tvc.fps[f];
                 }
                 previousFps = 1000 / (previousFps / g.Umay.tvc.fps.length); */
                /* g.Graphics.drawString(previousFps, font, Brushes.Black, 200, 200);

                a.draw(g.Graphics); */
            });
            this.Umay.WaitNextFrame();
            this.Umay.EndLoop();
            this.Umay.Run();
        }
    }

    public ResizeCanvas(width: int, height: int) {
        if (this.__Mode__ === Modes.Control && this.__m_Component__ != null) {
            this.__m_Component__.ResizeCanvas(width, height);
        } else {
            if (this.m_CanvasEl != null) {
                this.m_CanvasEl.style.width = `${width * 1}px`;
                this.m_CanvasEl.style.height = `${height * 1}px`;
                this.m_CanvasEl.style.padding = '0';
                //canvasElement.style.margin = 'auto';
                this.m_CanvasEl.style.border = '0';
                this.m_CanvasEl.style.background = 'transparent';
                this.m_CanvasEl.width = width;
                this.m_CanvasEl.height = height;
            }
        }
    }
    public componentWillUnmount() {
        this.Umay.Kill();
        this.m_Graphics = null as any;
        /*  this.m_PropertyBag = null as any;
         this.state = null as any; */
    }

    public CreateElements(): any {
        return (
            <canvas ref={e => this.m_CanvasEl = e} /* width={this.Width} heigth={this.Height} style={{ width: this.Width + 'px', height: this.Height + 'px' }} */></canvas>
        );
    }

}