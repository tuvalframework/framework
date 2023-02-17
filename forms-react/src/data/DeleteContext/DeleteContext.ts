import { UIView } from "../../components/UIView/UIView";
import { DeleteContextClass } from "./DeleteContextClass";

export function DeleteContext(content: (deleteFunc?: Function, isLoading?: boolean, isSuccess?: boolean) => UIView): DeleteContextClass {
        return new DeleteContextClass().children(content);
}