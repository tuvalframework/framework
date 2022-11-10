import { viewFunc } from '../getView';
import { DynamicViewClass } from './DynamicViewClass';

export function DynamicView(node: any): DynamicViewClass {
    return viewFunc(DynamicViewClass, (controller, propertyBag) => {
        return new DynamicViewClass().setController(controller).PropertyBag(propertyBag).node(node);
    });
}