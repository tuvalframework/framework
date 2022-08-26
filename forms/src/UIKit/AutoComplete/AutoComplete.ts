import { viewFunc } from '../getView';
import { AutoCompleteClass } from './AutoCompleteClass';

export function AutoComplete(): AutoCompleteClass {
    return viewFunc(AutoCompleteClass, (controller, propertyBag) => {
        return new AutoCompleteClass().setController(controller).PropertyBag(propertyBag);
    });
}