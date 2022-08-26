import { viewFunc } from '../getView';
import { UISkeletonClass } from './UISkeletonClass';

export function UISkeleton(): UISkeletonClass {
    return viewFunc(UISkeletonClass, (controller, propertyBag) => {
        return new UISkeletonClass().setController(controller).PropertyBag(propertyBag);
    });
}