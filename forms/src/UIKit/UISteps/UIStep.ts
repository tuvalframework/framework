import { viewFunc } from '../getView';
import { UIStepsClass } from './UIStepsClass';
export function UIStep(): UIStepsClass {
    return viewFunc(UIStepsClass, (controller, propertyBag) => {
        return new UIStepsClass().setController(controller).PropertyBag(propertyBag);
    });
}