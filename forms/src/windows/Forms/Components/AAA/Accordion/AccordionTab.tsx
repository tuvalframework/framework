import { Teact } from "../../Teact";
import { Control } from "../Control";
import { ContainerControl } from "../Layout";
import { AccordionComponentTab } from '../../accordion/Accordion';

export class AccordionTab extends ContainerControl<any> {
    private renderControls(): any[] {
        return this.Controls.ToArray().map(control => (control as any).CreateMainElement());
    }
    public CreateElements() {
        return (
            <AccordionComponentTab header={this.Text}>
                {this.renderControls()}
            </AccordionComponentTab>
        );
    }

}