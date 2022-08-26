import { CGRectangle } from '@tuval/cg';
import { Graphics } from "../Graphics";
import { PageSettings } from "./PageSettings";
import { EventArgs } from "@tuval/core";

export class PrintPageEventArgs extends EventArgs {
    public MarginBounds: CGRectangle = undefined as any;
    public Graphics: Graphics = undefined as any;
    public PageSettings: PageSettings = undefined as any;
    public HasMorePages: boolean = undefined as any;
}