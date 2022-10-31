import { viewFunc } from "../getView";
import { UIView } from "../UIView";
import { RadioGroupClass } from "./UIRadioGroupClass";


export function UIRadioGroup(): RadioGroupClass {
      return viewFunc(RadioGroupClass, (controller, propertyBag) => {
         return new RadioGroupClass().setController(controller).PropertyBag(propertyBag);
      });
   
}