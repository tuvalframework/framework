import { DatePicker, Tab, TabList } from "monday-ui-react-core";
import { Calendar } from "primereact";
import React from "react";
import { TabListClass } from "./TabListClass";
import { is, moment } from "@tuval/core";
import { VDivider } from "../Divider/Divider";
import { cHorizontal } from "../../Constants";
import { Fragment } from "../Fragment";
import { Text } from "../Text";
import { HStack } from "../../layout/HStack/HStack";

export interface IControlProperties {
    control: TabListClass
}


function TabListRenderer({ control }: IControlProperties) {

    const tabTextView = (text) => (
        HStack({ spacing: 5 })(
            Text(text),
        ).padding(cHorizontal, 10).allHeight(50)
    )
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
                        {is.function(tab.view) ? tab.view()?.render() as any : tabTextView(tab.text).render()}
                    </Tab>
                )
            }


        </TabList>
    );

}

export default TabListRenderer;