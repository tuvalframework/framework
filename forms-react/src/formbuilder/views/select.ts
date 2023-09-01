import { cLeading, cTopLeading } from "../../Constants";
import { useFormController } from "../../UIFormController";
import { Text } from "../../components";
import { Dropdown } from "../../components/Dropdown/Dropdown";
import { UIViewBuilder } from "../../components/UIViewBuilder/UIViewBuilder";
import { useProtocol } from "../../data/DataProviderContext/DataProviderClass";
import { DirectoryProtocol } from "../../data/DataProviderContext/Protocols";
import { HStack } from "../../layout/HStack/HStack";
import { VStack } from "../../layout/VStack/VStack";
import { label } from "../components/label";
import { is } from "@tuval/core";

export const SelectFormView = (textData: any) => {
    const formController = useFormController();
    let { name, query, options, defaultValue, fieldId ,protocol, resource, filter, sort, text, key} = textData;

    if (defaultValue == null) {
        defaultValue = formController.GetValue(fieldId);
    }

    const formState = formController.GetFieldState(name);

    if (!formState.isTouched && defaultValue != null) {
        formController.SetValue(name, defaultValue, true);
    }

    if (query != null) {
        const { body, resource, text, key } = query;

        return (
            UIViewBuilder(() => {
                const { query } = useProtocol(DirectoryProtocol);

                const { data } = query(body);

                return (
                    VStack({ alignment: cTopLeading })(
                        Dropdown((option) =>
                            HStack({ alignment: cLeading })(
                                Text(option[text])
                            )

                        )((option) =>
                            HStack({ alignment: cLeading })(
                                Text(option[text])
                            )
                                .paddingLeft('10px')
                        )
                            .floatlabel(false)
                            .dataSource(data[resource]/* textData?.options[0]?.items.map(item => ({ text: item, value: item })) */)
                            .fields({ text: text, value: key })
                            //.placeHolder(params.placeholder)
                            .width('100%')
                            .height(38)
                            .formField(textData.name, [])
                            .border('1px solid #D6E4ED')
                            .shadow({ focus: 'none' })
                        // .formField(textData.name, [])
                    ).height().marginBottom('16px')
                )
            })
        )
    } else if (protocol != null && resource != null) { 
        return (
            UIViewBuilder(() => {
                const { getList } = useProtocol(protocol);

                const { data } = getList(resource, {filter, sort});

                return (
                    VStack({ alignment: cTopLeading })(
                        Dropdown((option) =>
                            HStack({ alignment: cLeading })(
                                Text(option[text])
                            )

                        )((option) =>
                            HStack({ alignment: cLeading })(
                                Text(option[text])
                            )
                                .paddingLeft('10px')
                        )
                            .floatlabel(false)
                            .dataSource(data/* textData?.options[0]?.items.map(item => ({ text: item, value: item })) */)
                            .fields({ text: text, value: key })
                            //.placeHolder(params.placeholder)
                            .width('100%')
                            .height(38)
                            .formField(textData.name, [])
                            .border('1px solid #D6E4ED')
                            .shadow({ focus: 'none' })
                        // .formField(textData.name, [])
                    ).height().marginBottom('16px')
                )
            })
        )
    }else {
        return (
            VStack({ alignment: cTopLeading })(
              
                Dropdown((option) =>
                    HStack({ alignment: cLeading })(
                        Text(option.text)
                    )

                )((option) =>
                    HStack({ alignment: cLeading })(
                        Text(option.text)
                    )
                        .paddingLeft('10px')
                )
                    .floatlabel(false)
                    .dataSource(options?.[0]?.items.map(item => (is.string(item) ? { text: item, value: item } : { text: item.label, value: item.value })))
                    .fields({ text: 'text', value: 'value' })
                    //.placeHolder(params.placeholder)
                    .width('100%')
                    .height(38)
                    .formField(textData.name, [])
                    .border('1px solid #D6E4ED')
                    .shadow({ focus: 'none' })
                // .formField(textData.name, [])
            ).height().marginBottom('16px')
        )
    }


}