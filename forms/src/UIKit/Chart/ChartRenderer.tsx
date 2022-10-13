import { StringBuilder } from "@tuval/core";
import { Fragment } from "../../preact";
import { ControlHtmlRenderer } from "../../windows/Forms/Components/AAA/HtmlRenderer/ControlHtmlRenderer";
import { Teact } from "../../windows/Forms/Components/Teact";
import { Skeleton } from "../Components/skeleton/Skeleton";
import { Steps } from "../Components/steps/Steps";
import { classNames } from "../Components/utils/ClassNames";
import Chart from "./Chart";
import { ChartClass } from "./ChartClass";

export class ChartClassRenderer extends ControlHtmlRenderer<ChartClass> {
    shadowDom: any;
    protected menu: any;
    public get UseShadowDom(): boolean {
        return true;
    }

    public OnStyleCreating(obj: ChartClass, sb: StringBuilder): void {
    }

    public GenerateElement(obj: ChartClass): boolean {
        this.WriteStartFragment();
        return true;
    }

    public GenerateBody(obj: ChartClass): void {

        this.WriteComponent(
            <Chart options={obj.vp_Options} series={obj.vp_Series} type={obj.vp_ChartType ?? 'area'} height={obj.vp_ChartHeight ?? 300} />
        )
    }
}