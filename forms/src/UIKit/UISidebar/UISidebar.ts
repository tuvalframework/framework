import { viewFunc } from "../getView";
import { UIView } from "../UIView";
import { UISidebarClass } from "./UISidebarClass";


export type SideBarPositions = 'left' | 'right' | 'top' | 'bottom'

type FunctionSideBar = (...content: UIView[]) => UISidebarClass;

export function UISidebar({position}: {position: SideBarPositions}): FunctionSideBar {
   return (...content: UIView[]) => {
      return viewFunc(UISidebarClass, (controller, propertyBag) => {
         return new UISidebarClass().setController(controller).PropertyBag(propertyBag).setChilds(...content).siodebarPosition(position)
      });
   }
}