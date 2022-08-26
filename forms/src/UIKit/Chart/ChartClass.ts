import { UIController } from "../UIController";
import { UIView, ViewProperty } from "../UIView";
import { ChartClassRenderer } from "./ChartRenderer";
import { TuvalAxisChartSeries, TuvalNonAxisChartSeries, UIChartOptions } from "./Types";


export class ChartClass extends UIView {

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