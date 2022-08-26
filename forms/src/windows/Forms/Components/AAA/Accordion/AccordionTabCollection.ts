import { int, is, List } from '@tuval/core';
import { Accordion } from './Accordion';
import { AccordionTab } from './AccordionTab';

export class AccordionTabCollection extends List<AccordionTab> {
    public Accordion: Accordion = null as any;
    public constructor(listView: Accordion) {
        super();
        this.Accordion = listView;
    }

    public Add(text: string): AccordionTab;
    public Add(treeNode: AccordionTab): int
    public Add(...args: any[]): AccordionTab | int {
        if (args.length === 1 && is.string(args[0])) {
            const text: string = args[0];
            const tab = new AccordionTab();
            tab.Text = text;
            super.Add(tab);
            if (this.Accordion != null) {
                this.Accordion.ForceUpdate();
            }
            return tab;
        }  else {
            const treeNode: AccordionTab = args[0];
            const result = super.Add(treeNode);
            if (this.Accordion != null) {
                this.Accordion.ForceUpdate();
            }
            return result;
        }
    }
}
