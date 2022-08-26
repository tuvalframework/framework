import { Teact } from '../../Teact';
import { Control } from '../Control';
import { DomHandler } from '../../DomHandler';
import { TString, int, classNames, Event, Delegate, is } from '@tuval/core';
import { Observable } from "rxjs-compat/Observable";
import { Border } from '../../../Border';
import { AccordionTabCollection } from './AccordionTabCollection';
import { AccordionComponent, AccordionComponentTab } from '../../accordion/Accordion';
import { AccordionTab } from './AccordionTab';

class ClickEvent extends Delegate<() => void>{ }

export class Accordion extends Control<Accordion> {

    public get ActiveIndexes(): int[] {
        return this.GetProperty('ActiveIndexes');
    }
    public set ActiveIndexes(value: int[]) {
        this.SetProperty('ActiveIndexes', value);
    }

    public get HeaderText(): string {
        return this.GetProperty('HeaderText');
    }
    public set HeaderText(value: string) {
        this.SetProperty('HeaderText', value);
    }

    public get Tabs(): AccordionTabCollection {
        return this.GetProperty('Tabs');
    }

    public set Tabs(value: AccordionTabCollection) {
        this.SetProperty('Tabs', value);
    }

    public SetupControlDefaults(): void {
        super.SetupControlDefaults();
        this.Tabs = new AccordionTabCollection(this);
        this.ActiveIndexes = [];

    }

    private renderControls(tab: AccordionTab): any[] {
        return tab.Controls.ToArray().map(control => (control as any).CreateMainElement());
    }

    private renderTabs(): any[] {
        return this.Tabs.ToArray().map((tab: AccordionTab) => {
            return (
                <AccordionComponentTab header={tab.Text}>
                    {this.renderControls(tab)}
                </AccordionComponentTab>
            );
        });
    }
    public CreateElements() {
        return (
            <div class='tuval-accordion' style={this.GetStyleObject()}>
                <AccordionComponent multiple activeIndex={this.ActiveIndexes}>
                    {this.renderTabs()}
                </AccordionComponent>
            </div>
        );
    }

}