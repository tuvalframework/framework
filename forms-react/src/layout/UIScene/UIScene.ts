import { FragmentClass } from "../../components/Fragment";
import { UIView } from "../../components/UIView/UIView";


export function UIScene(...children: UIView[]) {
    return new FragmentClass().children(children);
}