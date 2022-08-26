import { foreach } from "@tuval/core";
import { PanelComponent } from "../panel/Panel";
import { Teact } from "../Teact";
import { ControlHtmlRenderer } from "./HtmlRenderer/ControlHtmlRenderer";
import { Panel } from "./Panel";

export class PanelRenderer extends ControlHtmlRenderer<Panel> {
    public GenerateBody(obj: Panel): void {
        if (!obj.Visible) {
            return;
        }
        const result = (
            <div className='tuval-panel' style={this.GetStyleObject()}>
                <PanelComponent header={obj.Text} /* contentStyle={{ height: this.Height + 'px' }} */>
                    {this.CreateControls(obj)}
                </PanelComponent>
            </div>
        );
        this.WriteComponent(result);
    }
    private CreateControls(obj: Panel): any[] {
        const vNodes: any[] = [];
        foreach(obj.Controls, (control) => {
            vNodes.push(control.CreateMainElement());
        });
        return vNodes;
    }
    /*
    public Render(param: any) {

        if (!this.Control.Visible) {
            return;
        }
        return (
            <div className='tuval-panel' style={this.GetStyleObject()}>
                <PanelComponent header={this.Control.Text} >
                    {this.CreateControls()}
                </PanelComponent>
            </div>
        );
    } */

}