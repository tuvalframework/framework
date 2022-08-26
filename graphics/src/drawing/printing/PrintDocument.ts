import { PrintPageEventHandler } from "./PrintPageEventHandler";
import { PageSettings } from "./PageSettings";

export class PrintDocument {
    //public PrintPage: EventD<PrintPageEventHandler> = undefined as any;
    public DocumentName: string = '';
    public DefaultPageSettings: PageSettings = undefined as any;

    public print() {

    }
}