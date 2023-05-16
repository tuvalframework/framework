import React from "react";
import { SortableListClass } from "./SortableListClass";
import { SortableList } from "./components/SortableList";
import { is } from "@tuval/core";

export interface IControlProperties {
    control: SortableListClass
}


function SortableListRenderer({ control }: IControlProperties) {
    return (
        <SortableList
            items={control.vp_Items}
            onChange={(e) => is.function(control.vp_OnChange) ?  control.vp_OnChange(e) : void 0}
            renderItem={(item) => (
                <SortableList.Item id={item.id}>
                     <SortableList.DragHandle />
                    {control.vp_RenderItem(item).render()}

                </SortableList.Item>
            )}
        />
    );

}

export default SortableListRenderer;