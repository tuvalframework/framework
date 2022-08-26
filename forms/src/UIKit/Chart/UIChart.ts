import { viewFunc } from '../getView';
import { ChartClass } from './ChartClass';

export function UIChart(): ChartClass {
    return viewFunc(ChartClass, (controller, propertyBag) => {
        return new ChartClass().setController(controller).PropertyBag(propertyBag);
    });
}