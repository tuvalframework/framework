import { viewFunc } from '../getView';
import { UIView } from '../UIView';
import { UIMediaPlayerClass } from './UIMediaPlayerClass';

export function UIMediaPlayer(): UIMediaPlayerClass {
    return viewFunc(UIMediaPlayerClass, (controller, propertyBag) => {
        return new UIMediaPlayerClass().setController(controller).PropertyBag(propertyBag);
    });
}