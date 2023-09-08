import { cLeading, cTopLeading } from "../../Constants";
import { useFormController } from "../../UIFormController";
import { Select, Text } from "../../components";
import { Dropdown } from "../../components/Dropdown/Dropdown";
import { UIViewBuilder } from "../../components/UIViewBuilder/UIViewBuilder";
import { useProtocol } from "../../data/DataProviderContext/DataProviderClass";
import { DirectoryProtocol } from "../../data/DataProviderContext/Protocols";
import { HStack } from "../../layout/HStack/HStack";
import { VStack } from "../../layout/VStack/VStack";
import { label } from "../components/label";
import { is } from "@tuval/core";

export const SelectView = (textData: any) => {
    const formController = useFormController();
    let { name, options, defaultValue, fieldId, protocol, resource, filter, sort, text, key } = textData;

    if (defaultValue == null) {
        defaultValue = formController.GetValue(fieldId);
    }

    const formState = formController.GetFieldState(name);

    if (!formState.isTouched && defaultValue != null) {
        formController.SetValue(name, defaultValue, true);
    }

    if (protocol != null && resource != null) {
        return (
            UIViewBuilder(() => {
                const { getList } = useProtocol(protocol);

                const { data } = getList(resource, { filter, sort });

                return (

                    Select().options(data?.map(item => {
                        return { label: item[text], value: item[key] }
                    })
                    )
                )
            })
        )
    } else {
        return (
            VStack({ alignment: cTopLeading })(
                Select().options(options?.map(item => {
                    return { label: item.label, value: item.value }
                })
                )
            ).height().marginBottom('16px')
        )
    }


}