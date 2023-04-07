import { ITab } from "./ITab";
import { TabListClass } from "./TabListClass";

export function TabList(...tabs: ITab[]) {
    return new TabListClass().tabs(tabs);
}