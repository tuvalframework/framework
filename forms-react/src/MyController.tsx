import React, { Fragment, useState } from "react";
import { UIViewClass } from "./UIView/UIViewClass";
import { Label } from "./Label";
import { ReactView } from "./ReactView/ReactView";
import { State, UIController } from "./UIController";
import { VStack } from "./VStack/VStack";
import { cLeading, cTop } from "./Constants";
import { ForEach } from "./UIView/ForEach";
import { HStack } from "./HStack/HStack";
import { Tooltip } from "./Tooltip/Tooltip";
import { TextField } from "./TextField/TextField";
import { AutoComplete } from "./components/AutoComplete/AutoComplete";
//import { TextField } from 'monday-ui-react-core';

const list = [{
    name: 'test'
},
{
    name: 'test1'
},
{
    name: 'test2'
}
];

export class MyController extends UIController {
    @State(10)
    public counter: number;

    @State("red")
    public color: string;

    @State("red")
    public text: string;

    public override LoadView(): UIViewClass {

        return (
            /*   ReactView(
                 <Fragment>
                     {
                         Array(500).fill(null).map((u, i) => i).map(() => {
                             return (
                                 <TextField
                                     iconName="fa fa-square"
                                     placeholder="Placeholder text here"
                                     showCharCount
                                     title="Name"
                                     validation={{
                                         text: 'Helper text'
                                     }}
                                     wrapperClassName="monday-storybook-text-field_size"
                                     value={this.text}
                                     onChange={(value)=> this.text = value}
                                 />
                             )
                         })
                     }
                 </Fragment>

             ) */


            VStack({ alignment: cTop })(
                ...ForEach(Array(100).fill(null).map((u, i) => i))(() =>
                    HStack({ alignment: cLeading })(
                        Label((this.counter).toString())
                        .tooltip("Test tooltip")
                            .background(this.color)
                            .onClick(() => {
                                const a = this.counter;
                                this.counter = a + 1;
                                this.color = "gray";
                            }),

                       AutoComplete().datasource(list).field('name')
                       .completeMethod((query) => list.filter( item => item.name.indexOf(query)))
                       .onChange(e => console.log(e))
                    )
                )
            )
        )
    }
}