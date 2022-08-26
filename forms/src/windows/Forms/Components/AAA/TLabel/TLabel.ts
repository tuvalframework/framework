import { TLabelRenderer } from './TLabelRenderer';
import { Control } from "../Control";
import { ControlHtmlRenderer } from "../HtmlRenderer/ControlHtmlRenderer";
import { ILabel } from './ILabel';

export class TLabel extends Control<TLabel> implements ILabel {
    public HtmlFor: string = null;
    public TextAlign: string;
    public constructor() {
        super();
        this.Appearance.Display = 'flex';
        this.Appearance.AlignItems = 'center';

        this.TextAlign = 'center';
    }

    protected GetRenderer(): any {
        return TLabelRenderer;
    }
}