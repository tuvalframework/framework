import { CGColor } from '@tuval/cg';
import { EventArgs, int, is, throwIfEndless } from '@tuval/core';
import { Teact } from '../../Teact';
import { FontIcon } from "../FontIcon/FontIcon";
import { TVirtualContainer, TContainerControlRenderer } from '../Panel';
import { TLabel } from '../TLabel/TLabel';
import { ListMenu } from './ListMenu';

export class ListMenuItemBase extends TVirtualContainer {
    public get Selectable(): boolean {
        return true;
    }
    public get Parent(): ListMenu {
        return this.myParent as ListMenu;
    }
    public set Parent(value: ListMenu) {
        this.myParent = value;
    }
    protected OnClick(e: EventArgs): void {
        /* this.Parent.SelectedIndex = this.Parent.Items.IndexOf(this); */
        this.Parent.InternalOnItemClick(this);
    }

    /** @internal */
    InternalOnGotSelection(): void {
        this.OnGotSelection();
    }
    protected OnGotSelection(): void {

    }

    /** @internal */
    InternalOnLostSelection(): void {
        this.OnLostSelection();
    }
    protected OnLostSelection(): void {

    }
}

export class ListMenuItem extends ListMenuItemBase {
    // public ghetText: string = '';

    public get Text(): string {
        return this.Label.Text;
    }
    public set Text(value: string) {
        this.Label.Text = value;
    }

    public get BackgroundColor(): string {
        return this.Appearance.BackgroundColor;
    }
    public set BackgroundColor(value: string) {
        this.Appearance.BackgroundColor = value;
    }
    public Image: string = '';
    private iconContainer: TVirtualContainer;
    public Icon: FontIcon;
    public IconRight: FontIcon;
    public Label: TLabel;
    public ImageSelected: string = '';
    public ImageRight: string = '';
    public ImageRightSelected: string = '';
    public Tag: any;

    public constructor() {
        super();
        this.Icon = new FontIcon();
        this.Icon.Size = 18;
        this.Icon.Color = CGColor.FromRgba(0x6c, 0x75, 0x7d);
        this.Icon.Appearance.MarginLeft = '10px';
        this.Icon.Appearance.Display = 'flex';
        this.Icon.Appearance.JustifyContent = 'center';
        this.Icon.Appearance.AlignItems = 'center';

        this.Label = new TLabel();
        this.Label.Appearance.FontSize = '14px';
        this.Label.Appearance.MarginLeft = '10px';
        this.Label.ForeColor = '#6c757d';
        this.Label.Appearance.FlexShrink = '0';
        this.Label.Appearance.FlexBasis = 'auto';
        this.Label.Appearance.FlexGrow = '1';

        this.IconRight = new FontIcon();
        this.IconRight.Size = 18;
        this.IconRight.Color = CGColor.FromRgba(0x6c, 0x75, 0x7d);
        //this.IconRight.Appearance.MarginLeft = '10px';
        this.IconRight.Appearance.Display = 'flex';
        this.IconRight.Appearance.JustifyContent = 'center';
        this.IconRight.Appearance.AlignItems = 'center';

        this.BackgroundColor = 'white';
        this.Appearance.Display = 'flex';
        this.Appearance.AlignItems = 'center';
        this.Appearance.LineHeight = '50px';
        this.Appearance.BorderBottom = '1px solid rgb(220, 220, 220)';
        this.Appearance.Cursor = 'pointer';



        this.Controls.Add(this.Icon);
        this.Controls.Add(this.Label);
        this.Controls.Add(this.IconRight);
    }

    protected OnClick(e: EventArgs): void {
        /* this.Parent.SelectedIndex = this.Parent.Items.IndexOf(this); */
        this.Parent.InternalOnItemClick(this);
    }

    protected OnGotSelection(): void {
        this.BackgroundColor = '#f9f9f9'; //this.SelectedItemColor;
        this.Appearance.BoxShadow = 'inset 4px 0 0 0 #14a9d5';
    }

    protected OnLostSelection(): void {
        this.BackgroundColor = this.Parent.ItemColor;
        this.Appearance.BoxShadow = '';
    }

}