import { viewFunc } from '../getView';
import { UIView } from '../UIView';
import { UIFileUploadClass } from './UIFileUploadClass';


export function UIFileUpload(...content: UIView[]): UIFileUploadClass {
    return viewFunc(UIFileUploadClass, (controller, propertyBag) => {
        return new UIFileUploadClass().setController(controller).PropertyBag(propertyBag).setChilds(...content);
    });
}
