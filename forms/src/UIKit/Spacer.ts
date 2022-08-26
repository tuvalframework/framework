
import { viewFunc } from "./getView";
import { UIController } from "./UIController";
import { UIView } from "./UIView";

export class SpacerClass extends UIView {

    public constructor() {
        super();
        this.Appearance.FlexGrow = '1';
    }
}

export function Spacer(): SpacerClass {
    return viewFunc(SpacerClass, (controller, propertyBag) => {
        return new SpacerClass().setController(controller).PropertyBag(propertyBag);
    });
}