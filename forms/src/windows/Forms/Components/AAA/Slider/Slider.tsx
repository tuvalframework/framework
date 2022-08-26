import React, { createElement, Fragment } from "../../../../../preact/compat";
import { Teact } from '../../Teact';
import { ClassInfo, is, int, Event, StringBuilder } from '@tuval/core';
import { Control } from "../Control";
import { SliderComponent } from "../../slider/Slider";
import { ReplaySubject, Subject } from "rxjs";
import { Property } from "../Reflection/PropertyDecorator";
import { ControlHtmlRenderer } from "../HtmlRenderer/ControlHtmlRenderer";

export enum Orientations {
    Horizontal = 'horizontal',
    Vertical = 'vertical'
}

export class Slider extends Control<Slider> {

    @Property()
    public Orientation: Orientations;

    public get SlideEnd(): any {
        return this.GetProperty('SlideEnd');
    }
    public set SlideEnd(value: any) {
        this.SetProperty('SlideEnd', value);
    }

    public get Value(): int {
        return this.GetProperty('Value');
    }
    public set Value(value: int) {
        this.SetProperty('Value', value);
    }

    public get Max(): int {
        return this.GetProperty('Max');
    }
    public set Max(value: int) {
        this.SetProperty('Max', value);
    }

    public get Min(): int {
        return this.GetProperty('Min');
    }
    public set Min(value: int) {
        this.SetProperty('Min', value);
    }

    public get Value$(): ReplaySubject<int> {
        return this.GetPipe('Value');
    }
    public set Value$(value: ReplaySubject<int>) {
        this.SetPipe('Value', value);
    }
    public SetupControlDefaults() {
        super.SetupControlDefaults();
        this.Value = 0;
        this.Value$.next(this.Value);
        this.SlideEnd = new Event();
        this.Orientation = Orientations.Vertical;
    }

    public GetRenderer(): any {
        return class SliderRenderer extends ControlHtmlRenderer<Slider> {
            public get UseShadowDom(): boolean {
                return true;
            }

            public OnStyleCreating(obj: Slider, sb: StringBuilder): void {

                sb.AppendLine(`
                .p-slider {
                    position: relative;
                }

                .p-slider .p-slider-handle {
                    position: absolute;
                    cursor: grab;
                    touch-action: none;
                    display: block;
                    z-index: 1;
                    border-radius: 100%;
                    background-color: #fff;
                    box-shadow: 0 2px 10px rgb(0 0 0 / 16%), 0 2px 5px rgb(0 0 0 / 26%);
                    width: 24px;
                    height: 24px;
                    border: 0px !important;
                    margin-left: -11px !important;
                }

                .p-slider .p-slider-handle.p-slider-handle-active {
                    z-index: 2;
                }

                .p-slider .p-slider-range {
                    background: rgb(20, 169, 213);
                }

                .p-slider-range {
                    position: absolute;
                    display: block;
                }

                .p-slider-horizontal .p-slider-range {
                    top: 0;
                    left: 0;
                    height: 100%;
                }

                .p-slider-horizontal .p-slider-handle {
                    top: 50%;
                }

                .p-slider-vertical {
                    height: 100% !important;
                    background-color: #d8d8d8 !important;
                    border-radius: 4px !important;
                    width: 8px !important;
                }

                .p-slider-vertical .p-slider-handle {
                    left: 50%;
                }

                .p-slider-vertical .p-slider-range {
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    border-radius: 4px !important;
                    /* height: 100%; */
                    width: 8px !important;
                }
                `);
            }
            public GenerateElement(obj: Slider): boolean {
                this.WriteStartFragment();
                return true;
            }
            public GenerateBody(obj: Slider): void {
                this.WriteComponent(

                    <SliderComponent style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', float: 'none' }} max={obj.Max} min={obj.Min} value={obj.Value} onChange={(e) => obj.onChange(e.value)} onSlideEnd={(e) => obj.onSlideEnd()} orientation={obj.Orientation} />

                );

            }
        }
    }

    private onChange(value: int) {
        if (this.Value !== value) {
            this.Value = value;
        }
    }

    private onSlideEnd() {
        this.SlideEnd();
    }

}