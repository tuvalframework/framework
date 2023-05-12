import { DatePicker, Tab, TabList } from "monday-ui-react-core";
import { Calendar } from "primereact";
import React from "react";
import { TabListClass } from "./TabListClass";
import { is, moment } from "@tuval/core";

export interface IControlProperties {
    control: TabListClass
}


function TabListRenderer({ control }: IControlProperties) {

    return (
        <TabList activeTabId={control.vp_ActiveTabIndex} >
            {
                control.vp_Tabs.map(tab =>
                    <Tab
                        active={tab.active}
                        disabled={tab.disabled}
                        focus={tab.focus}
                        icon={tab.icon}
                        iconSide={tab.iconSide}
                        id={tab.id}
                        onClick={tab.onClick}
                        value={tab.value}
                    >
                        {is.function(tab.view) ? tab.view()?.render() as any: tab.text}
                    </Tab>
                )
            }


        </TabList>
    );

}

export default TabListRenderer;