import { UIViewClass } from "../../components/UIView/UIViewClass";
import { CreateContextClass } from "./CreateContextClass";

export function UICreateContext(content: (create?: Function, isLoading?: boolean, isSuccess?: boolean) => UIViewClass ): CreateContextClass {

        return new CreateContextClass().children(content);


}