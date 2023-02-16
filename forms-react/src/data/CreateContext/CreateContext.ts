import { UIView } from "../../components/UIView/UIView";
import { CreateContextClass } from "./CreateContextClass";

export function UICreateContext(content: (create?: Function, isLoading?: boolean, isSuccess?: boolean) => UIView ): CreateContextClass {

        return new CreateContextClass().children(content);


}