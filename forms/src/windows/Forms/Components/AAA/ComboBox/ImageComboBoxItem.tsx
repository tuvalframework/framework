import { ComboBoxItem } from "./ComboBoxItem";
import { Guid } from '@tuval/core';
import { Fragment } from "../../../../../preact";
import { Teact } from '../../Teact';

export class ImageComboBoxItem extends ComboBoxItem {

    public Icon: string;
    public constructor(text: string);
    public constructor(key: string, text: string, icon: string);
    public constructor(...args: any[]) {
        super();
        if (args.length === 1) {
            const text = args[0];
            this.Key = Guid.NewGuid().ToString();
            this.Text = text;
        } else if (args.length === 3) {
            this.Key = args[0];
            this.Text = args[1];
            this.Icon = args[2];
        }
    }

    public GetItemTemplate() {
        return (
            <Fragment>
                <img alt={this.Text} src={this.Icon} onError={(e) => e.target.src = ''} className={''} />
                <div>{this.Text}</div>
            </Fragment>
        )

    }

    public ToObject(): any {
        return {
            text: this.Text,
            value: this
        };
    }
}