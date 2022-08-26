import { viewFunc } from '../getView';
import { DataTableClass } from './DataTableClass';

export function DataTable(): DataTableClass {
    return viewFunc(DataTableClass, (controller, propertyBag) => {
        return new DataTableClass().setController(controller).PropertyBag(propertyBag);
    });
}