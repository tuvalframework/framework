import { int } from "@tuval/core";
import { UIController } from "../UIController";
import { UIView, ViewProperty } from "../UIView";
import { ChartClassRenderer } from "./ChartRenderer";
import { TuvalAxisChartSeries, TuvalNonAxisChartSeries, UIChartOptions } from "./Types";

export type ChartType =  'line'
| 'area'
| 'bar'
| 'histogram'
| 'pie'
| 'donut'
| 'radialBar'
| 'scatter'
| 'bubble'
| 'heatmap'
| 'candlestick'
| 'boxPlot'
| 'radar'
| 'polarArea'
| 'rangeBar'
| 'treemap'

export class ChartClass extends UIView {

  @ViewProperty() vp_ChartHeight: int;
  public chartHeight(value: int): this {
    this.vp_ChartHeight = value;
    return this;
  }

  @ViewProperty() vp_ChartType: ChartType;
  public chartType(value: ChartType): this {
    this.vp_ChartType = value;
    return this;
  }

  @ViewProperty() vp_Series: TuvalAxisChartSeries | TuvalNonAxisChartSeries;
  public series(value: TuvalAxisChartSeries | TuvalNonAxisChartSeries): this {
    this.vp_Series = value;
    return this;
  }

  @ViewProperty() vp_Options: UIChartOptions;
  public options(value: UIChartOptions): this {
    this.vp_Options = value;
    return this;
  }

  public setController(controller: UIController): this {
    super.setController(controller);
    this.Renderer = new ChartClassRenderer({
      control: this,
      doNotBind: true,
      renderId: false
    });

    return this;
  }
  public constructor() {
    super();

    this.Appearance.Width = '100%';
    this.Appearance.Height = '100%';
  }

}