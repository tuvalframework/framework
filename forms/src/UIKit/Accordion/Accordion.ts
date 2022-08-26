import { viewFunc } from '../getView';
import { UIView } from '../UIView';
import { AccordionClass } from './AccordionClass';

export function UIAccordion({ header, content }: { header: (item) => UIView | Function, content: (item) => UIView | Function }): AccordionClass {
    return viewFunc(AccordionClass, (controller, propertyBag) => {
        return new AccordionClass().setController(controller).PropertyBag(propertyBag).headerTemplate(header).contentTemplate(content);
    });
}