import { UIView } from "../../components/UIView/UIView";
import { UpdateContextClass } from "./UpdateContextClass";

export function UIUpdateContext(content: (update?: Function, isLoading?: boolean, isSuccess?: boolean) => UIView): UpdateContextClass {
        return new UpdateContextClass().children(content);
}