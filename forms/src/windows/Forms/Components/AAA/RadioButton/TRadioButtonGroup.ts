import { TFlexColumnContainer } from "../Panel";
import { TRadioButton } from "./TRadioButton";

export class TRadioButtonGroup extends TFlexColumnContainer {
    public constructor() {
        super();
        this.Controls.ItemAdded.add((item: TRadioButton) => {
            item.Appearance.PaddingTop = '5px';
        });
    }
}