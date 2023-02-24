import { DividerClass } from "./DividerClass";

export function VDivider(): DividerClass {
        //return viewFunc(DividerClass, (controller, propertyBag) => {
            return new DividerClass().height('100%').width('1px')/* .PropertyBag(propertyBag) */;
        //});
    }
    export function HDivider(): DividerClass {
        //return viewFunc(DividerClass, (controller, propertyBag) => {
            return new DividerClass().width('100%').height('1px')/* .PropertyBag(propertyBag) */;
        //});
    }