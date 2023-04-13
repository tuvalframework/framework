import { UIView } from "../../components/UIView/UIView";
import { ErrorBoundaryClass, ErrorBoundaryFunc } from "./ErrorBoundaryClass";




export function UIErrorBoundary(contentFunc: ErrorBoundaryFunc): ErrorBoundaryClass {
    return new ErrorBoundaryClass().contentFunc(contentFunc);
}
